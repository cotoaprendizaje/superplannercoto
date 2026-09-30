#!/usr/bin/env node
/* overlays-colocados.mjs — kit-base v1.9.74
   ------------------------------------------------------------
   POR QUÉ EXISTE. Un relay de "Seguridad de la información" lo llamó
   "el gap que más caro salió" de todo el curso, y la frase que lo
   resume es ésta: **catorce píldoras revelables no se veían, con los
   once tests en verde**.

   El mecanismo está documentado hace rato (CLAUDE.md §6.22 punto 7,
   §6.45) y hasta tiene un aviso escrito en el motor: `Motor._initShots`
   escribe `left/top/width/height` EN PÍXELES y COMO ESTILO EN LÍNEA
   sobre cada `[data-hit]`/`[data-place]`. Sobre un elemento en flujo
   normal (`position: static`, el default) eso NO HACE NADA: la pieza
   cae al final del flujo, fuera del arte — y mientras tanto el clic
   sigue sumando puntos, así que el curso parece funcionar.

   El motor avisa por `console.warn`. El problema es que **ningún test
   del kit escuchaba los `warning`**: `_shared.mjs` filtra
   `msg.type() !== 'error'`. Un aviso que nadie escucha es un aviso que
   no existe.

   Este test hace las dos cosas que faltaban:
     1. Escucha la consola INCLUYENDO `warning`, y falla si el motor
        avisó por un overlay sin `position:absolute`.
     2. No se conforma con el aviso: mide. Cada `[data-hit]`/
        `[data-place]` tiene que caer DENTRO de su `[data-shot]`, con
        una tolerancia de 4px — que es la diferencia entre "está
        colocado" y "está en el lugar donde lo dejó el flujo".

   Recorre TODAS las diapositivas, no solo la primera: el bug del relay
   estaba en una diapositiva del medio. Y revela las capas ocultas una
   por una, por el mismo motivo que `clip-audit`: un overlay dentro de
   un `[data-panel][hidden]` es justamente donde esto se esconde.
*/
import { openCourse, report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

/* La consola, con warnings. `openCourse` ya engancha los `error`; acá
   se suma un segundo oyente SOLO para los avisos del motor, filtrado
   por su prefijo para no arrastrar ruido de terceros. */
const avisos = [];
page.on('console', (msg) => {
  if (msg.type() !== 'warning') return;
  const t = msg.text();
  if (t.includes('[motor-slides]')) avisos.push(t);
});

const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));

for (const id of ids) {
  const ok = await irASlide(page, id);
  if (!ok) { fails.push(`no se pudo navegar a "${id}"`); continue; }

  const problemas = await page.evaluate((slideId) => {
    const out = [];
    const slide = document.querySelector(`[data-slide="${slideId}"]`);
    if (!slide) return out;

    /* Las capas ocultas se revelan de a una: un overlay dentro de un
       `[data-panel][hidden]` es donde este bug se esconde mejor. */
    const paneles = Array.from(slide.querySelectorAll('[data-panel]'));
    const estados = paneles.map((p) => p.hidden);

    function medir(contexto) {
      slide.querySelectorAll('[data-shot]').forEach((shot) => {
        const sr = shot.getBoundingClientRect();
        if (!sr.width || !sr.height) return;      // shot todavía sin medidas: no es su turno
        shot.querySelectorAll('[data-hit], [data-place]').forEach((h) => {
          const st = getComputedStyle(h);
          if (st.display === 'none' || st.visibility === 'hidden') return;
          const etiqueta = (h.querySelector('.sr-only')?.textContent ||
            h.getAttribute('aria-label') || h.className || h.tagName.toLowerCase()).trim().slice(0, 40);

          if (st.position !== 'absolute') {
            out.push(`${contexto}"${etiqueta}": position:${st.position} — el motor le escribe ` +
              `left/top en px y eso no hace NADA sobre un elemento en flujo. ` +
              `Cae fuera del arte mientras el clic sigue contando.`);
            return;
          }
          const r = h.getBoundingClientRect();
          if (!r.width || !r.height) return;      // sin caja: lo cubre hitbox-click-check
          const T = 4;
          if (r.left < sr.left - T || r.top < sr.top - T ||
              r.right > sr.right + T || r.bottom > sr.bottom + T) {
            out.push(`${contexto}"${etiqueta}": cae fuera de su [data-shot] ` +
              `(${Math.round(r.left - sr.left)}, ${Math.round(r.top - sr.top)} sobre ` +
              `${Math.round(sr.width)}×${Math.round(sr.height)})`);
          }
        });
      });
    }

    medir(`[${slideId}] `);
    paneles.forEach((p, i) => {
      paneles.forEach((o) => { o.hidden = true; });
      p.hidden = false;
      medir(`[${slideId}] (capa "${p.getAttribute('data-panel')}") `);
    });
    paneles.forEach((p, i) => { p.hidden = estados[i]; });
    return out;
  }, id);

  fails.push(...problemas);
}

if (avisos.length) {
  fails.push(...[...new Set(avisos)].map((a) =>
    `el motor avisó por consola y nadie lo escuchaba: ${a.slice(0, 160)}`));
}
/* ---- Ningún overlay se DIBUJA donde sabemos que no va ----
   kit-base v1.9.91. BUG REAL, reporte del cliente en iPad: *"el recuadro
   del «Repaso rápido» aparece directamente encima del título y del
   inicio del texto"*.

   Cuando `place()` no puede medir todavía —la diapositiva está oculta,
   así que `clientWidth` es 0, o la imagen no terminó de decodificar—
   el ancla de emergencia dejaba el overlay en `left:0; top:0`: arriba a
   la izquierda del arte, que es exactamente donde lo fotografiaron. Y
   un `[data-hit]` ahí además se puede tocar, tapando lo de abajo.

   ⚠️ Parquear algo en una posición que SABEMOS falsa es el peor default
   posible: se ve como un bug de maquetado y no se corrige solo hasta
   que algo dispare otra medición (de ahí el "volví a la diapo anterior
   y volví, y se arregló"). Ahora queda invisible hasta que se pueda
   medir.

   Se recorre TODO el curso porque el estado provisional depende de
   cuándo se midió cada diapositiva, no de cuál es. */
{
  const ids = await page.evaluate(() =>
    [...document.querySelectorAll('[data-slide]')].map((s) => s.getAttribute('data-slide')));
  const enCero = [];
  for (const id of ids) {
    await page.evaluate((i) => window.motor.gotoId(i), id);
    await page.waitForTimeout(180);
    const malos = await page.evaluate((i) => {
      const sl = document.querySelector('[data-slide="' + i + '"]');
      return [...sl.querySelectorAll('[data-hit],[data-place]')]
        .filter((h) => h.getAttribute('data-l') !== null)
        .filter((h) => h.style.left === '0px' && h.style.top === '0px' &&
                       getComputedStyle(h).visibility !== 'hidden')
        .map((h) => 'data-l=' + h.getAttribute('data-l'));
    }, id);
    malos.forEach((m) => enCero.push(id + ' · ' + m));
  }
  if (enCero.length) {
    fails.push(`${enCero.length} overlay(s) quedaron VISIBLES en la esquina 0,0 del arte ` +
      `(${enCero.slice(0, 4).join('; ')}): es el ancla provisional, que no se debe dibujar — ` +
      'sin medidas reales el overlay va invisible, no mal ubicado');
  }
}

/* ---- Cambiar de CAPA coloca los overlays, sin esperar un frame ----
   kit-base v1.9.95. Un `slidechange` ya disparaba el recálculo; un
   `layerchange` NO, aunque es el mismo problema con otro nombre: un
   curso que mete overlays dentro de un `[data-panel]` dependía solo del
   `ResizeObserver`, o sea de un frame de más. Síntoma del lado del
   alumno: la primera vez que se abre el panel final del minijuego, los
   números se pintan un instante en la esquina del arte y después saltan
   a su lugar.

   ⚠️ SE INYECTA EL MARCADO, como los otros cinco tests de mecanismo
   opcional del kit (ver tools/tests/README.md). Las capas con overlays
   adentro son opcionales —un curso puede no tener minijuego—, así que
   el guard de siempre ("si la pieza no está, salteo") se saltearía
   SIEMPRE en un curso recién generado: verde por ausencia.

   ⚠️ Y se mide DENTRO de la diapositiva activa: en una oculta el lienzo
   mide 0 y anclar provisionalmente es lo CORRECTO, así que medir ahí
   daría un fallo falso. Costó una medición equivocada averiguarlo. */
{
  const r = await page.evaluate(async () => {
    const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
    if (!slide) return { salteado: 'no hay diapositivas' };
    const grupo = document.createElement('div');
    /* Tamaño PROPIO (kit-base v1.9.105): sin él, el grupo toma el layout
       de la diapositiva donde cae. MEDIDO en "Seguridad alimentaria": la
       activa a esta altura era su cierre, un contenedor flex donde el
       grupo medía 0 de ancho, y el test acusaba al motor de no colocar
       overlays que no tenían dónde colocarse. */
    grupo.style.cssText = 'position:absolute;left:0;top:0;width:800px;height:400px;z-index:2147483000';
    grupo.innerHTML =
      '<div class="d-mj-panel" data-panel="prueba-a">' +
      '  <div class="d-shot" data-shot><img class="d-shot-img" alt="" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="d-mj-panel" data-panel="prueba-b" hidden>' +
      '  <div class="d-shot" data-shot>' +
      '    <img class="d-shot-img" alt="" aria-hidden="true" loading="lazy">' +
      '    <div style="position:absolute" data-place data-l="30" data-t="40" data-w="20" data-h="10">x</div>' +
      '  </div>' +
      '</div>';
    /* Un arte real, en data: URI, para no depender de ningún archivo del
       curso: sin `naturalWidth` no hay nada que colocar y el test daría
       verde sin medir (fue exactamente así como se escondía este bug). */
    const arte = 'data:image/svg+xml;base64,' + btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800"><rect width="1600" height="800" fill="#345"/></svg>');
    grupo.querySelectorAll('img').forEach((im) => { im.src = arte; });
    slide.appendChild(grupo);
    window.motor._initShots(slide);

    await new Promise((res) => {
      let n = 0;
      (function esperar() {
        const im = grupo.querySelector('[data-panel="prueba-b"] img');
        if (im.naturalWidth || n++ > 40) return res();
        setTimeout(esperar, 25);
      })();
    });

    const overlay = grupo.querySelector('[data-place]');
    const antes = { left: overlay.style.left, prov: overlay.hasAttribute('data-place-provisional') };
    // revelar la capa como lo hace el motor, y medir EN EL MISMO TURNO
    grupo.querySelector('[data-panel="prueba-a"]').hidden = true;
    const b = grupo.querySelector('[data-panel="prueba-b"]');
    b.hidden = false;
    b.dispatchEvent(new CustomEvent('layerchange', { bubbles: true, detail: { target: 'prueba-b' } }));
    const despues = {
      left: overlay.style.left, width: overlay.style.width,
      prov: overlay.hasAttribute('data-place-provisional'),
      vis: getComputedStyle(overlay).visibility
    };
    grupo.remove();
    return { antes, despues };
  });

  if (r.salteado) {
    console.log('  · ' + r.salteado);
  } else if (r.despues.prov || r.despues.vis === 'hidden' || !parseFloat(r.despues.width)) {
    fails.push('al revelar una capa `[data-panel]`, los overlays de adentro NO se colocan en el ' +
      `mismo turno (quedaron en left="${r.despues.left}" width="${r.despues.width}", ` +
      `provisional=${r.despues.prov}): el motor recalcula por \`slidechange\` pero no por ` +
      '`layerchange`, así que dependen del ResizeObserver y se ven un instante en la esquina ' +
      'del arte antes de saltar a su lugar.');
  }
}

if (errors.length) fails.push(...errors.map((e) => 'error de consola: ' + e));
report('overlays-colocados', fails);
await browser.close();
