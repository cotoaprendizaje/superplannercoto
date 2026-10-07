/* popup-video-medida — el pop-up del reproductor respeta el estándar del
   kit, y ningún curso lo pisa. kit-base v1.9.103.

   El estándar está escrito y explicado en coto-media.css:

     width: min(1040px, 94vw, calc(var(--d-arte-h) * 0.94 * 16 / 9))

   Existe este test porque la forma de romperlo es INVISIBLE: las hojas
   del curso cargan después del kit, así que un `width` que el curso le
   ponga a `.modal-card--video` gana y nadie se entera. Pasó en
   "Prevención cardiovascular", que arrastraba `width:min(760px,100%)`
   de una versión anterior del kit: el pop-up salía de 760px en
   escritorio, en notebook Y en iPad horizontal —el mismo tamaño en las
   tres, sin aprovechar la pantalla— y nada fallaba.

   Se comprueba en 6 viewports: que el ancho sea el que manda la
   fórmula (no otro), que el pop-up entre entero en pantalla, y que el
   video tenga un alto usable.

   Uso: node tests/popup-video-medida.mjs <url>  */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();

const VIEWPORTS = [
  ['escritorio', 1600, 900],
  ['notebook', 1366, 768],
  ['iPad horizontal', 1080, 810],
  ['iPad vertical', 810, 1080],
  ['teléfono acostado', 844, 390],
  ['teléfono parado', 390, 844]
];
/* Mínimo de alto ÚTIL del video. 150px es el punto en que los
   controles propios del kit (una fila de píldoras de 34px más la barra
   de progreso) dejan de tapar la mitad del cuadro. Por debajo de eso
   el pop-up no sirve para ver un video, que es todo lo que hace. */
const ALTO_MINIMO = 150;

const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });

const fallos = [];
let medidos = 0;

for (const [nombre, w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/mp4', body: '' }));
  await page.goto(url);
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape').catch(() => {});

  const hay = await page.evaluate(() => {
    document.querySelectorAll('[data-slide]').forEach(s => {
      s.removeAttribute('data-require-seen');
      s.removeAttribute('data-gate-popup');
      s.removeAttribute('data-intro-popup');
    });
    let hit = document.querySelector('[data-video-play], [data-video-popup]');
    /* Sin disparador en el curso, se inyecta uno (kit-base v1.9.103, al
       subirlo): el `#d-video-player` y su pop-up los trae el boilerplate
       en TODO curso, así que el estándar se puede medir igual. La versión
       que llegó daba ✓ "no había ningún reproductor para medir" en un
       curso sin video: verde por ausencia. */
    if (!hit && document.getElementById('d-video-player') && window.initVideoPlayer) {
      const s0 = document.querySelectorAll('[data-slide]')[1] || document.querySelector('[data-slide]');
      hit = document.createElement('button');
      hit.setAttribute('data-video-play', ''); hit.setAttribute('data-video', 'video/prueba-medida.mp4');
      hit.textContent = 'ver';
      s0.appendChild(hit);
      window.initVideoPlayer({});
    }
    if (!hit) return false;
    /* El disparador puede vivir DENTRO de un pop-up (kit-base v1.9.124, §7.73; relevo de
       NOA, 2026-10-07: el ▶ de cada ficha de reporte
       abre el reproductor). Ahí no hay `[data-slide]` arriba: se va a la
       diapositiva que abre ese pop-up y se marca el disparador para el
       paso siguiente. Antes salía "no hay #d-video-player", que era
       falso: el reproductor estaba, lo que no había era una diapo. */
    hit.setAttribute('data-pvm-hit', '');
    let sl = hit.closest('[data-slide]');
    const pop = !sl && hit.closest('[data-popup]');
    if (pop) {
      const t = document.querySelector('[data-slide] [data-popup-trigger="' + pop.getAttribute('data-popup') + '"]');
      sl = t && t.closest('[data-slide]');
    }
    if (!sl || !window.motor) return false;
    window.motor.go([...document.querySelectorAll('[data-slide]')].indexOf(sl));
    return true;
  });
  if (!hay) { await page.close(); fallos.push('[' + nombre + '] no hay `#d-video-player` en el curso (index-boilerplate.html)'); continue; }
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const act = document.querySelector('.d-slide.is-active, [data-slide].is-active') || document;
    const hit = act.querySelector('[data-video-play], [data-video-popup]') || document.querySelector('[data-pvm-hit]');
    /* Se toca el PLAY, como el alumno (kit-base v1.9.105). Un recuadro
       `[data-inline-video][data-video-popup]` no abre nada con un clic
       en el contenedor: el disparador es su botón. MEDIDO en "Seguridad
       alimentaria": clic en el recuadro → ningún pop-up abierto, y el
       test medía la tarjeta CERRADA (0px) y acusaba "el video queda de
       0px de alto" en los seis viewports. */
    const play = hit && !hit.matches('button') && hit.querySelector('.d-shot-hit-play, button');
    if (play) play.click(); else if (hit) hit.click();
  });
  await page.waitForTimeout(800);
  const abierto = await page.evaluate(() => {
    const m = window.motor && window.motor.openPopup;
    return !!(m && m.querySelector('#d-video-player'));
  });
  if (!abierto) {
    fallos.push('[' + nombre + '] el disparador de video no abrió el pop-up del reproductor: no hay nada que medir (y medir la tarjeta cerrada daría 0px).');
    await page.close(); continue;
  }

  const m = await page.evaluate(() => {
    const c = document.querySelector('.modal-card--video');
    if (!c) return null;
    const b = c.getBoundingClientRect();
    const v = document.getElementById('d-video-player');
    const vb = v ? v.getBoundingClientRect() : null;
    /* ⚠️ NO se recalcula la fórmula acá para comparar el número.
       Se probó y da falsos positivos: `--d-arte-h` no vive en `:root`
       y `94vw` no es `innerWidth * .94` (el ancho de la barra de
       scroll), así que la cuenta rehecha en JS difiere de la del
       navegador por decenas de píxeles y el test acusaba un override
       inexistente en los 6 viewports.
       Lo que se revisa es la CAUSA, que además es exacta: QUIÉN declara
       el ancho. Se recorre el CSSOM buscando toda regla que le ponga
       `width` a `.modal-card--video`; las del kit viven en un
       `coto-*.css` y cualquier otra hoja es del curso — y como las del
       curso cargan últimas, ganan. */
    const culpables = [];
    for (const hoja of document.styleSheets) {
      let reglas;
      try { reglas = hoja.cssRules; } catch (e) { continue; }  // hoja de otro origen
      const archivo = (hoja.href || 'en línea').split('/').pop();
      /* ⚠️ La regla se MIRA primero y se baja después, nunca al revés.
         La primera versión hacía `if (r.cssRules) { recorrer(...);
         continue; }` para entrar en los `@media`, y con eso no
         encontraba NADA: desde que Chrome soporta CSS anidado, una
         `CSSStyleRule` común también tiene `cssRules` —una lista
         vacía, pero un objeto, o sea truthy— así que ese `continue` se
         saltaba todas las reglas planas. MEDIDO: el test daba ✓ con el
         override de 760px puesto y servido (`w = 760`, `culpables =
         []`). Justo el modo de fallar que el test existe para
         detectar, en el test. */
      const recorrer = (lista) => {
        for (const r of lista) {
          if (r.selectorText && r.style
              && r.selectorText.includes('.modal-card--video')
              && r.style.getPropertyValue('width')
              && !/^coto-.*\.css$/.test(archivo)) {
            culpables.push(archivo + ' { ' + r.selectorText + ': width: '
              + r.style.getPropertyValue('width') + ' }');
          }
          if (r.cssRules && r.cssRules.length) recorrer(r.cssRules);
        }
      };
      recorrer(reglas);
    }
    return {
      w: b.width, alto: b.height, culpables,
      videoAlto: vb ? vb.height : null,
      cabe: b.bottom <= innerHeight + 1 && b.top >= -1 && b.left >= -1 && b.right <= innerWidth + 1
    };
  });
  await page.close();

  if (!m) { fallos.push('[' + nombre + '] se tocó el video y no se abrió `.modal-card--video`'); continue; }
  medidos++;
  const q = '[' + nombre + '] ';
  m.culpables.forEach(c => {
    const f = q + 'una hoja del curso le declara el ancho a `.modal-card--video` y le gana al '
      + 'estándar del kit: ' + c + ' (medido: ' + Math.round(m.w) + 'px)';
    if (!fallos.includes(f)) fallos.push(f);
  });
  if (!m.cabe) fallos.push(q + 'el pop-up no entra entero en la pantalla');
  if (m.videoAlto !== null && m.videoAlto < ALTO_MINIMO) {
    fallos.push(q + 'el video queda de ' + Math.round(m.videoAlto) + 'px de alto (mínimo ' + ALTO_MINIMO + ')');
  }
}

await browser.close();
if (!medidos && !fallos.length) fallos.push('no se pudo abrir el reproductor en ningún viewport');
if (!fallos.length) console.log('  · el estándar del kit se cumple en ' + medidos + ' viewport(s)');
report('popup-video-medida', fallos);
