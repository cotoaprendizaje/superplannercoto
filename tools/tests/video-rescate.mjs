/* check-video-rescate — el reproductor del pop-up se recupera solo
   cuando el navegador le suelta el video (kit-base v1.9.95).

   BUG REAL, reporte del cliente en iPad con foto: pausó el video, la
   imagen se puso NEGRA y ya no volvió a arrancar. Los controles
   nativos seguían marcando `0:21 / -0:49`, o sea que el <video> sabía
   posición y duración: lo que había perdido era el recurso. Pasa
   cuando el alumno toca Picture-in-Picture / AirPlay en la barra
   nativa, y también cuando Safari le saca el decodificador a un video
   pausado por presión de memoria. En los dos casos el elemento
   dispara `emptied`, y `initVideoPlayer` lo usa para volver a
   enganchar el mismo .mp4 en el segundo donde estaba.

   Las tres mitades del contrato, y la 2ª y la 3ª son las que duelen si
   se rompen:
     · `emptied` con el pop-up ABIERTO  → vuelve a enganchar la fuente.
     · `emptied` repetido               → UN solo re-enganche, no un
       bucle (nuestro propio `src=` dispara otro `emptied`).
     · `emptied` al CERRAR el pop-up    → NO engancha nada: ese vaciado
       lo hacemos nosotros a propósito, para soltar el archivo.
       ⚠️ Este punto solo agarra el caso de los DOS guards juntos. El kit
       lo cuida dos veces (el `.open` del handler de `emptied` y el
       `fuenteActual = ''` del de `popupclose`), y medido, cada uno
       alcanza solo: sacando uno este test sigue verde. Es redundancia a
       propósito, pero conviene no creer que la suite vigila cada mitad.
   Y la prevención, que es marcado: el reproductor no puede ofrecer los
   botones que sacan la imagen de la página.

   ⚠️ SE ARMA SU PROPIO MARCADO si el curso no tiene video en pop-up
   (kit-base v1.9.95). Como llegó, este test se ponía ROJO en todo curso
   sin esa pieza —*"ningún curso: no hay [data-video-play]"*— y eso es la
   forma equivocada para el kit: un curso puede no tener videos y no está
   roto por eso. Pero saltear a secas sería verde por ausencia, y encima
   en un curso RECIÉN GENERADO, que es donde más importa que el mecanismo
   del kit esté sano. Así que si no hay disparador se inyecta el marcado
   que emite el propio módulo y se inicializa `initVideoPlayer()`, igual
   que hacen los otros seis tests de mecanismo opcional (ver
   tools/tests/README.md). */
import { report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', e => fallos.push('error JS: ' + e));
await page.goto(url);
await page.waitForTimeout(600);
await page.keyboard.press('Escape').catch(() => {});

// --- prevención: el atributo que apaga PiP ---
/* ⚠️ `controlslist` YA NO SE EXIGE (kit-base v1.9.98). Desde que los
   controles los dibuja `montarControles()` no hay barra nativa, y
   `controlslist` describe QUÉ BOTONES esconder de esa barra: sin ella el
   atributo no tiene sobre qué actuar, y pedirlo sería pedir markup
   muerto. AirPlay ya no está porque su botón vive en la barra que no se
   muestra — quien verifica eso ahora es `reproductor-video`, mirando que
   ningún `<video>` tenga `controls`.
   `disablepictureinpicture` SÍ se sigue exigiendo: lo pone `sinPiP()` y es
   el cinturón para Chrome, que sí lo respeta. */

let attrs = await page.evaluate(() => {
  const v = document.getElementById('d-video-player');
  if (!v) return null;
  return { pip: v.hasAttribute('disablepictureinpicture'),
           cl: v.getAttribute('controlslist') || '' };
});
/* Si el curso no trae el reproductor, la prevención se revisa más
   abajo, sobre el marcado que emite el módulo (el mismo que copia cada
   curso): acá no hay nada que medir todavía. */
if (!attrs) console.log('  · el curso no trae #d-video-player; se revisa sobre el marcado del módulo.');
else {
  if (!attrs.pip) fallos.push('#d-video-player sin disablepictureinpicture (Chrome sí lo respeta)');
}

// --- cura: espiar el src y abrir el reproductor ---
await page.evaluate(() => {
  window.__set = [];
  const v = document.getElementById('d-video-player');
  const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
  Object.defineProperty(v, 'src', { configurable: true,
                                    get() { return d.get.call(this); },
                                    set(x) { window.__set.push(x); d.set.call(this, x); } });
  // El .mp4 del repo pesa 0 bytes (los videos finales los sube el
  // cliente), así que play() nunca resolvería: se simula el arranque.
  v.play = function () { this.dispatchEvent(new Event('play')); return Promise.resolve(); };
});
/* Sin nombres de diapositiva hardcodeados: se busca en el marcado
   QUIÉN abre el reproductor (`[data-video-play]` o un video en el lugar
   derivado con `[data-video-popup]`) y se navega a su diapositiva. Así
   el test vale para cualquier curso del molde — un `data-slide`
   escrito a mano acá es la trampa que documenta `irASlide()`. */
const hayDisparador = await page.evaluate(() => {
  const t = document.querySelector('[data-video-play], [data-video-popup]');
  if (!t) return false;
  const s = t.closest('[data-slide]');
  if (s) window.motor.gotoId(s.getAttribute('data-slide'));
  return true;
});
if (!hayDisparador) {
  console.log('  · el curso no tiene video en pop-up: se inyecta el marcado del módulo.');
  const armado = await page.evaluate(() => {
    if (!window.initVideoPlayer) return 'el curso no carga coto-media.js (`initVideoPlayer`)';
    if (!document.querySelector('[data-popup="video-player"]')) {
      const wrap = document.createElement('div');
      wrap.innerHTML =
        '<div class="modal" data-popup="video-player" role="dialog" aria-modal="true" hidden>' +
        '  <div class="modal-card modal-card--video">' +
        '    <h3 id="d-video-title" class="sr-only"></h3>' +
        '    <button class="modal-x modal-x--video" data-popup-close aria-label="Cerrar video">✕</button>' +
        '    <div class="modal-bd modal-bd--video">' +
        '      <video id="d-video-player" playsinline' +
        '             disablepictureinpicture></video>' +
        '    </div>' +
        '  </div></div>';
      document.body.appendChild(wrap.firstChild);
    }
    const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
    const b = document.createElement('button');
    b.setAttribute('data-video-play', '');
    b.setAttribute('data-video', 'video/prueba-rescate.mp4');
    b.textContent = 'ver';
    slide.appendChild(b);
    window.initVideoPlayer({});
    return null;
  });
  if (armado) { await browser.close(); report('check-video-rescate', [armado]); process.exit(); }
  /* El espía del `src` y el `play()` simulado se instalan de nuevo SOLO si
     el `<video>` es el que se acaba de crear. Un curso generado ya trae
     `#d-video-player` (lo escribe index-boilerplate.html) y le falta
     nada más el disparador, así que en ese caso el espía de arriba ya
     está puesto y redefinir `src` tira "Cannot redefine property". */
  await page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    if (!Object.getOwnPropertyDescriptor(v, 'src')) {
      window.__set = [];
      const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
      Object.defineProperty(v, 'src', { configurable: true,
                                        get() { return d.get.call(this); },
                                        set(x) { window.__set.push(x); d.set.call(this, x); } });
    }
    v.play = function () { this.dispatchEvent(new Event('play')); return Promise.resolve(); };
  });
}
await page.waitForTimeout(400);
await page.evaluate(() => { const m = document.querySelector('.modal.open [data-popup-close]'); if (m) m.click(); }); // un data-intro-popup, si lo hay
await page.waitForTimeout(300);
await page.evaluate(() => {
  const t = document.querySelector('[data-video-play], [data-video-popup]');
  (t.querySelector('.d-shot-hit-play') || t).click();
});
await page.waitForTimeout(400);
if (!await page.evaluate(() => !!document.querySelector('[data-popup="video-player"].open')))
  fallos.push('el pop-up del reproductor no se abrió');

const emptied = async () => { await page.evaluate(() => { window.__set.length = 0; document.getElementById('d-video-player').dispatchEvent(new Event('emptied')); }); await page.waitForTimeout(500); };

await emptied();
const reEngancha = await page.evaluate(() => window.__set.slice());
if (reEngancha.length !== 1 || !/\.mp4$/.test(reEngancha[0]))
  fallos.push(`con el pop-up abierto, "emptied" tendría que volver a enganchar el .mp4 una vez (fue: ${JSON.stringify(reEngancha)})`);

await page.evaluate(() => { window.__set.length = 0; const v = document.getElementById('d-video-player'); for (let i = 0; i < 10; i++) v.dispatchEvent(new Event('emptied')); });
await page.waitForTimeout(800);
const bucle = await page.evaluate(() => window.__set.length);
if (bucle > 2) fallos.push(`10 "emptied" seguidos re-engancharon ${bucle} veces: es un bucle`);

await page.evaluate(() => { window.__set.length = 0; document.querySelector('[data-popup="video-player"] [data-popup-close]').click(); });
await page.waitForTimeout(600);
const trasCerrar = await page.evaluate(() => ({ sets: window.__set.slice(), src: document.getElementById('d-video-player').getAttribute('src') }));
if (trasCerrar.sets.length) fallos.push('al cerrar el pop-up el rescate volvió a enganchar el video: no se suelta el archivo');
if (trasCerrar.src) fallos.push('al cerrar el pop-up el <video> quedó con src: sigue descargando de fondo');

if (!attrs) {
  attrs = await page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    return v ? { pip: v.hasAttribute('disablepictureinpicture'),
                 cl: v.getAttribute('controlslist') || '' } : null;
  });
  if (!attrs) fallos.push('no existe #d-video-player ni después de inyectar el marcado del módulo');
  else {
    if (!attrs.pip) fallos.push('el marcado del módulo no lleva `disablepictureinpicture`: la barra ' +
      'nativa ofrece PiP y saca la imagen de la página (coto-media.js, ejemplo del encabezado)');
  }
}

/* ---- Picture-in-Picture: el video tiene que volver a la ficha ----
   (kit-base v1.9.99, subido de "Seguridad alimentaria"). `sinPiP()` es
   el arreglo de iPad que costó dos vueltas —WebKit IGNORA
   `disablepictureinpicture`, y la única salida es imperativa— y hasta
   acá NINGÚN test del kit lo verificaba. Se prueban las dos mitades:
     · entrar en PiP → se vuelve a la ficha con
       `webkitSetPresentationMode('inline')`;
     · entrar en PANTALLA COMPLETA → NO se toca: el mismo evento avisa
       de los dos modos, y la pantalla completa el cliente la pidió
       expresamente (§6.29). Confundirlos rompe una función que sí se
       quiere.
   El evento se simula: este Chromium no tiene el modo de presentación
   de WebKit. Lo que se verifica es el cableado. */
const pip = await page.evaluate(async () => {
  const v = document.getElementById('d-video-player');
  if (!v) return null;
  const modos = [];
  v.webkitSetPresentationMode = (m) => { modos.push(m); v.webkitPresentationMode = m; };
  v.webkitPresentationMode = 'picture-in-picture';
  v.dispatchEvent(new Event('webkitpresentationmodechanged'));
  await new Promise((r) => setTimeout(r, 120));
  const volvio = modos.slice();
  modos.length = 0;
  v.webkitPresentationMode = 'fullscreen';
  v.dispatchEvent(new Event('webkitpresentationmodechanged'));
  await new Promise((r) => setTimeout(r, 120));
  return { volvio, enFullscreen: modos.slice(), atributo: v.disablePictureInPicture === true };
});
if (pip) {
  if (pip.volvio.join() !== 'inline') {
    fallos.push(`al entrar en PiP el video tendría que volver a la ficha con webkitSetPresentationMode('inline') (fue: ${JSON.stringify(pip.volvio)})`);
  }
  if (pip.enFullscreen.length) {
    fallos.push(`en PANTALLA COMPLETA el video no se tiene que tocar, y se llamó a webkitSetPresentationMode(${JSON.stringify(pip.enFullscreen)}): ` +
      'el cliente pidió esa función expresamente');
  }
  if (!pip.atributo) fallos.push('no se fijó la propiedad disablePictureInPicture (el camino que sí respeta Chrome)');
}

await browser.close();
report('check-video-rescate', fallos);
