/* piezas-del-modelo.mjs — kit-base v1.9.131 (§7.80)
   ------------------------------------------------------------
   POR QUÉ EXISTE. "Prevención cardiovascular" es el curso MODELO (§7.79):
   todo curso tiene que salir como él. Cuatro piezas que cardio resolvía
   en su propio CSS subieron al kit; si el kit las pierde, cardio no se
   entera (ya no las tiene) y los cursos nuevos salen distintos sin un
   error a la vista.

   QUÉ HACE, en un curso real, con marcado propio inyectado:
     1 · una zona de VIDEO (`.d-shot-hit[data-video-play]`) con el mouse
         encima: sin aro, sin sombra, sin levante (regla del cliente);
     2 · una tira `.d-repaso--fila` contestada: la pregunta se va y la
         devolución queda en la MISMA fila que las pastillas;
     3 · `.d-cierre-arte-txt` (texto sobre la lámina del cierre): absoluto
         y en `cqw`;
     4 · a 1600×800 (escenario de ~2.36, más ancho que 2:1), la lámina de una diapositiva
         `--bg-layered` LLENA el escenario (sin franjas laterales), si el
         curso tiene una. */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const { browser, page } = await openCourse(url);
await page.setViewportSize({ width: 1366, height: 768 });
await page.waitForTimeout(400);
await page.evaluate(() => { document.querySelector('.ev-root')?.remove(); if (window.motor) window.motor.closePopup(); });

/* 1 · zona de video */
await page.evaluate(() => {
  const b = document.createElement('button');
  b.className = 'd-shot-hit'; b.setAttribute('data-hit', ''); b.setAttribute('data-video-play', 'zz.mp4'); b.id = 'zz-video';
  b.style.cssText = 'position:fixed;left:40%;top:40%;width:200px;height:120px;z-index:2147483647';
  document.body.appendChild(b);
});
await page.hover('#zz-video', { force: true });
await page.waitForTimeout(300);
const v = await page.evaluate(() => { const c = getComputedStyle(document.getElementById('zz-video')); return { o: c.outlineStyle, s: c.boxShadow, t: c.transform }; });
if (v.o !== 'none' || v.s !== 'none' || v.t !== 'none') fallos.push(`la zona de video con el mouse encima tiene realce (outline ${v.o}, sombra ${v.s}, transform ${v.t}): sin recuadro, regla del cliente.`);

/* 2 · tira en fila contestada · 3 · texto sobre la lámina */
const r = await page.evaluate(() => {
  const caja = document.createElement('div');
  caja.style.cssText = 'position:fixed;left:0;top:0;width:640px;z-index:9999;background:#fff;container-type:inline-size';
  caja.innerHTML = '<div class="d-repaso d-repaso--fila"><b class="d-repaso-title">Repaso rápido:</b>' +
    '<div class="d-repaso-item is-current is-answered is-correct"><p class="d-repaso-q">Pregunta</p>' +
    '<div class="d-repaso-btns d-repaso-btns--vf"><button data-chosen>Verdadero</button><button>Falso</button></div>' +
    '<p class="d-repaso-fb">Devolución corta.</p></div></div>' +
    '<p class="d-cierre-arte-txt" id="zz-arte">Texto</p>';
  document.body.appendChild(caja);
  const it = caja.querySelector('.d-repaso-item'), q = caja.querySelector('.d-repaso-q'), fb = caja.querySelector('.d-repaso-fb'), bt = caja.querySelector('.d-repaso-btns');
  const a = document.getElementById('zz-arte'), ca = getComputedStyle(a);
  const out = { dir: getComputedStyle(it).flexDirection, qVisible: getComputedStyle(q).display !== 'none',
    misma: Math.abs(fb.getBoundingClientRect().top - bt.getBoundingClientRect().top) < 30, arte: ca.position, arteFs: parseFloat(ca.fontSize) };
  caja.style.width = '320px';
  out.arteFs2 = parseFloat(getComputedStyle(a).fontSize);
  caja.remove();
  return out;
});
if (r.dir !== 'row') fallos.push(`la tira \`.d-repaso--fila\` no va en fila (flex-direction ${r.dir}).`);
if (r.qVisible) fallos.push('en la tira `.d-repaso--fila` contestada la pregunta sigue a la vista: la devolución tiene que tomar su lugar.');
if (!r.misma) fallos.push('en la tira `.d-repaso--fila` contestada la devolución no quedó en la fila de las pastillas.');
if (r.arte !== 'absolute') fallos.push(`\`.d-cierre-arte-txt\` no es absoluto (${r.arte}): tiene que colocarse sobre la lámina.`);
if (!(r.arteFs2 < r.arteFs)) fallos.push('`.d-cierre-arte-txt` no escala con el ancho de la lámina (`cqw`).');

/* 4 · lienzo más ancho que 2:1: 1600×800 deja un escenario de ~2.36,
   fuera del caso tablet del kit (hasta 2.2) y dentro de éste (hasta 2.38). */
await page.setViewportSize({ width: 1600, height: 800 });
await page.waitForTimeout(500);
const l = await page.evaluate(async () => {
  const m = window.motor;
  const i = m.slides.findIndex((s) => s.classList.contains('d-shot-slide--bg-layered'));
  if (i < 0) return null;
  m.closePopup(); m.go(i, true);
  await new Promise((res) => setTimeout(res, 600));
  const sh = m.slides[i].querySelector(':scope > .d-shot');
  const st = sh.parentElement.getBoundingClientRect(), r2 = sh.getBoundingClientRect();
  return { prop: +(st.width / st.height).toFixed(2), franja: Math.round(st.width - r2.width), sin: document.documentElement.hasAttribute('data-arte-sin-margen') };
});
if (l && !l.sin && l.franja > 2) fallos.push(`a 1600×800 la lámina deja ${l.franja}px de franjas laterales: más ancho que 2:1 tiene que llenar recortando arriba y abajo.`);
if (!l) console.log('  · el curso no tiene diapositivas `--bg-layered`: el punto 4 no tiene qué medir.');

await browser.close();
report('piezas-del-modelo', fallos);
