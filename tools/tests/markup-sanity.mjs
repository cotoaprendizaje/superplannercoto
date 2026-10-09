#!/usr/bin/env node
/* markup-sanity.mjs — candidato a kit v1.4
   ------------------------------------------------------------
   Nace de un bug real de "Prevención cardiovascular": a un botón de video
   le faltaba el ">" de cierre de la etiqueta, así que el navegador parseó
   <span class="sr-only"> como ATRIBUTOS del botón. Resultado: el texto
   accesible quedó como texto directo del botón y se veía escrito encima
   del video, sobre el arte.

   Por qué no lo agarraba ningún test existente:
     · deep-audit → el botón seguía teniendo nombre accesible (justamente
       porque el texto pasó a ser su contenido), así que pasaba.
     · hitbox-click-check → el rect seguía siendo válido y clickeable.
     · scroll-audit / keyboard-a11y → nada que ver.
   Solo se vio mirando el screenshot con overlay de verify-hitboxes.mjs.
   Este test automatiza esa clase de error, que es fácil de introducir
   editando HTML a mano y difícil de ver leyendo el archivo.

   Chequea 3 cosas, todas genéricas (no saben nada del contenido):
     1. Ningún elemento tiene atributos "imposibles" (span/div/button/img
        como nombre de atributo) — huella típica de una etiqueta sin cerrar.
     2. Ningún [data-hit] / .d-shot-hit tiene texto VISIBLE: sobre una
        diapositiva-captura el texto va siempre en un .sr-only (si no, se
        dibuja encima del arte) — SALVO que el hitbox lleve
        `data-hit-label-visible` (kit v1.9.5): un botón real reconstruido
        sobre una zona que el arte trae en blanco a propósito (ej. el
        "Continuar"/"Reintentar" del panel final del minijuego, cuyo
        mensaje depende del resultado y no puede quedar horneado en la
        imagen — CLAUDE.md §6.19). Ahí el texto visible ES el nombre
        accesible real, no una fuga de un .sr-only mal cerrado.
     3. Ningún elemento con clase .sr-only quedó visible en pantalla
        (regla de CSS pisada, clase mal escrita, etc.).
     4. Ningún id está repetido en el documento (ver el bloque 5, abajo).
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);

const fails = await page.evaluate(() => {
  const out = [];

  // 1 · atributos "imposibles" = etiqueta anterior sin cerrar con ">"
  const sospechosos = ['span', 'div', 'button', 'img', 'p', 'section', 'svg'];
  document.querySelectorAll('*').forEach(el => {
    Array.from(el.attributes).forEach(a => {
      const n = a.name.toLowerCase();
      if (n.startsWith('<') || sospechosos.includes(n)) {
        out.push(`<${el.tagName.toLowerCase()}> tiene el atributo "${a.name}" — casi seguro es una etiqueta sin cerrar con ">": ${el.outerHTML.slice(0, 100)}`);
      }
    });
  });

  // 2 · hitboxes con texto visible (tiene que estar todo en .sr-only),
  //     salvo el opt-out explícito data-hit-label-visible (ver arriba)
  document.querySelectorAll('[data-hit]:not([data-hit-label-visible]), .d-shot-hit:not([data-hit-label-visible])').forEach(h => {
    const directo = Array.from(h.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent.trim())
      .filter(Boolean).join(' ');
    if (directo) {
      out.push(`hitbox con texto visible (debería ir dentro de un .sr-only): "${directo.slice(0, 60)}"`);
    }
  });

  // 3 · .sr-only que quedó visible
  document.querySelectorAll('.sr-only, .sr-only-text').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 4 && r.height > 4) {
      out.push(`.sr-only visible en pantalla (${Math.round(r.width)}×${Math.round(r.height)}): "${el.textContent.trim().slice(0, 60)}"`);
    }
  });

  return out;
});

/* 4 · estructura reventada por una etiqueta de cierre DE MÁS.
   Bug real en "Prevención cardiovascular": al borrar un bloque quedó un
   </div> huérfano. El navegador cerró .d-app antes de tiempo y la mitad
   de las diapositivas pasaron a ser hijas de <body>; el pie del
   reproductor se estiró a toda la pantalla. NINGUNO de los 6 tests lo
   detectaba —todos verifican elementos, no el árbol— y el curso "se
   veía roto" sin un solo error de consola. Un cierre de más no rompe el
   parseo (no hay error), solo mueve el resto del documento afuera del
   contenedor: por eso hay que chequear la CONTENCIÓN explícitamente. */
const estructura = await page.evaluate(() => {
  const out = [];
  const app = document.querySelector('.d-app');
  if (!app) { out.push('no existe .d-app'); return out; }
  const total = document.querySelectorAll('[data-slide]').length;
  const dentro = document.querySelectorAll('.d-app [data-slide]').length;
  if (dentro !== total) {
    out.push(`${total - dentro} de ${total} diapositivas quedaron FUERA de .d-app ` +
             '(casi siempre: una etiqueta de cierre de más en el HTML)');
  }
  const sueltas = Array.from(document.body.children)
    .filter(el => el.matches('[data-slide]')).length;
  if (sueltas) out.push(`${sueltas} diapositiva(s) colgando directamente de <body>`);
  return out;
});
fails.push(...estructura);

/* 5 · ids duplicados.
   Bug real al migrar "Uso de Sucursales 3 - NOA" al bloque flotante de
   Ayuda/Configuración: los controles de voz/velocidad/reset vivían en el
   drawer viejo y se agregaron también al flotante, así que por un rato
   hubo dos #d-rate-range, dos #d-config-reset, etc. `getElementById`
   devuelve SIEMPRE el primero del documento, de modo que
   initVoicePicker/initRatePicker/initConfigReset cablearon los controles
   VIEJOS y los del flotante quedaron muertos: el alumno los ve, los toca
   y no pasa nada. Cero errores de consola y los 7 tests en verde — es
   exactamente la clase de fallo silencioso que este archivo existe para
   atrapar. Barato de chequear y sirve para cualquier curso, porque todo
   el kit busca sus controles por id. */
const idsDup = await page.evaluate(() => {
  const vistos = new Set(); const dup = new Set();
  document.querySelectorAll('[id]').forEach((el) => {
    if (vistos.has(el.id)) dup.add(el.id); else vistos.add(el.id);
  });
  return Array.from(dup);
});
fails.push(...idsDup.map((id) => `id duplicado: #${id} — getElementById toma el primero, ` +
  'el resto queda sin cablear (visible pero muerto)'));

/* 6. `.d-shot-slide--bg-video` declarado en una diapositiva que NO tiene
   video de fondo (kit v1.9.62).
   BUG REAL, encontrado migrando "Prevención cardiovascular": 15 de sus
   18 diapositivas llevaban esa clase por copiar/pegar la anterior, pero
   solo 3 tenían un `<video>` de fondo real. Mientras la clase servía
   nada más que para dimensionar el lienzo, no molestaba a nadie. Desde
   que `Narrador.textOf()` la usa como señal —"una diapositiva que ES un
   video no se narra", el fix a la raíz de narrar encima del audio del
   video— pasó a ser una clase con CONSECUENCIA: esas 15 diapositivas se
   habrían quedado MUDAS, sin un solo error en consola y con el
   `.sr-only` intacto en el DOM (así que ni deep-audit ni un lector de
   pantalla lo delatan).
   La diapositiva que solo muestra una captura fija va con
   `--bg-layered`, que dimensiona el lienzo EXACTAMENTE igual. */
const bgVideoSinVideo = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.d-shot-slide--bg-video'))
    /* `video.d-shot-video` — EXACTAMENTE el selector de `initBgVideos()`
       (coto-media.js), no un `video` cualquiera: una diapositiva puede
       tener un `<video>` que no es de fondo (el circular de
       `initInlineCircleVideos`, el del pop-up) y eso NO la convierte en
       "diapositiva que ES un video". Chequear `video` a secas dejaba
       pasar justo esos casos. */
    .filter((s) => !s.querySelector('video.d-shot-video'))
    .map((s) => s.getAttribute('data-slide') || '(sin data-slide)'));
fails.push(...bgVideoSinVideo.map((id) =>
  `"${id}" declara .d-shot-slide--bg-video pero no tiene <video> de fondo — ` +
  'Narrador.textOf() la trata como "diapositiva que ES un video" y NO la narra: ' +
  'usar .d-shot-slide--bg-layered (mismo lienzo, sin ese efecto)'));

/* ---- El ícono de marca sigue siendo el placeholder (kit-base v1.9.97) ----
   `new-course.mjs` deja en `img/icono-<cat>.webp` un WebP de **1×1
   transparente**, y lo hace por una buena razón que documenta ahí mismo:
   un `src` roto sería un 404, y esta misma suite cuenta cualquier error de
   consola como fallo, así que un curso recién generado arrancaría en rojo
   por un asset que el diseñador todavía no entregó.

   El costo es que la pastilla dorada del header se ve VACÍA y no hay nada
   que lo note: no hay error, el `src` resuelve, la imagen "existe". Un
   curso se entregó así una vuelta entera. `naturalWidth <= 1` lo convierte
   en un aviso.

   ⚠️ Va como AVISO y no como fallo mientras el curso esté en construcción:
   el placeholder es lo correcto hasta que llegue el arte, y poner esto en
   rojo desde el minuto cero entrena a mirar la suite en rojo — que es el
   modo de fallar de §6.60. Se exige recién cuando el curso tiene
   contenido, con el mismo piso que usa `gamificacion`. */
const marca = await page.evaluate(() => {
  const img = document.querySelector('.d-brand img, .d-brand .lg img');
  if (!img) return null;
  /* ⚠️ `textContent` crudo, y a propósito. Dos formas más obvias NO
     sirven acá, las dos medidas:
       · `body.innerText` devuelve solo lo VISIBLE, y en un curso de
         diapositivas eso es una sola — daba 40 palabras en un curso con
         contenido de sobra, así que el piso no se alcanzaba nunca;
       · `Narrador.textOf()` filtra lo que está `[hidden]`, o sea todas las
         diapositivas menos la activa: daba 0. `gamificacion.mjs` lo usa
         igual, pero puede porque NAVEGA a cada diapositiva desde Node
         (`irASlide`), y este test es de los rápidos.
     Para la pregunta que hay que contestar acá —"¿esto es todavía un
     esqueleto o ya tiene contenido?"— el texto crudo del DOM alcanza y no
     necesita que nada esté visible. */
  let palabras = 0;
  document.querySelectorAll('[data-slide]').forEach((sl) => {
    palabras += (sl.textContent || '').split(/\s+/).filter(Boolean).length;
  });
  return { ancho: img.naturalWidth, src: img.getAttribute('src') || '', palabras };
});
if (marca && marca.ancho <= 1) {
  const msg = `el ícono de marca ("${marca.src}") mide ${marca.ancho}px: sigue siendo el ` +
    'placeholder de 1×1 que deja `new-course.mjs`, así que la pastilla del header se ve VACÍA. ' +
    'No da error ni 404 — por eso hace falta mirarlo.';
  if (marca.palabras >= 300) fails.push(msg);   // el mismo piso que gamificacion (300 desde v1.9.132)
  else console.log('  · ' + msg + ' (aviso: el curso todavía está en construcción)');
}

if (errors.length) fails.push(...errors.map(e => 'error de consola: ' + e));
report('markup-sanity', fails);
await browser.close();
