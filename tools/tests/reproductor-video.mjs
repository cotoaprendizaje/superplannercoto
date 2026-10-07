/* reproductor-video.mjs — el reproductor se comporta como un
   reproductor de video normal, en PC y en tablet (kit-base v1.9.99).

   Viene de "Seguridad alimentaria" (`check-reproductor-video`), y
   reemplaza al que escribió el kit en v1.9.98. La diferencia es de
   fondo: aquel manejaba el `<video>` con `play()`/`duration` SIMULADOS,
   o sea que comprobaba que el código LLAMA a `play()`. Este fabrica un
   webm REAL con MediaRecorder y lo sirve en lugar de los .mp4 del repo
   (que pesan 0 bytes, §3.9), así que comprueba que el alumno VE el
   video moverse, pausar sin perder el cuadro, recuperarse de un
   desalojo y soltar el archivo al cerrar.
   Lo que el de v1.9.98 tenía y este no, se sumó al final (bloque N):
   rotulos accesibles de toda la barra y `role="status"` en el aviso.
   Y el bloque O cubre la variante con carátula de
   `initInlineCircleVideos`, donde v1.9.98 dejó una regresión: tocar la
   imagen para pausar no hacía nada (dos handlers sobre el mismo clic).

   Pedido del cliente después de tres vueltas de parches sobre el mismo
   componente: *"si hay que ver el reproductor y el pop-up reproductor,
   tiene que funcionar como cualquier estándar de reproductor de
   video"*. Eso es una lista de comportamientos, no una opinión, así
   que acá está escrita y verificada una por una.

   ⚠️ Lo que el entorno "iPad" de acá SÍ cubre: viewport, táctil, y
   todo lo que el curso decide mirando el user agent. Lo que NO puede
   cubrir: los límites de memoria y decodificadores de WebKit, que son
   de Safari y no de Chromium. Esa parte se comprueba por el lado
   medible —cuántos <video> retienen recurso a la vez— que es la causa
   que sí está en nuestras manos. */
import { chromium, devices } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';
import fs from 'fs';
import path from 'path';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
/* Si una acción se queda esperando (un botón que desapareció porque el
   pop-up se cerró a mitad de la batería), el test tiene que FALLAR con
   nombre, no reventar con un `TimeoutError` suelto (kit-base v1.9.120,
   §7.69). Pasó en "Seguridad de la información": el auto-avance del video
   de fondo le cerraba el pop-up y la salida era un stack de Playwright
   sin decir qué medía. Se reporta lo juntado hasta ahí más el motivo. */
process.on('uncaughtException', (e) => {
  fallos.push('el test no pudo seguir: ' + String(e && e.message || e).split('\n')[0] +
    '. Suele ser un control del reproductor que desapareció a mitad de la prueba (¿se cerró el pop-up?).');
  report('reproductor-video', fallos);
  process.exit(1);
});
const ARCHIVO = path.join(process.env.TMPDIR || '/tmp', 'coto-prueba-video.webm');

const browser = await chromium.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
});

/* ---- 1. fabricar el video de prueba (una vez) ---- */
if (!fs.existsSync(ARCHIVO)) {
  const p0 = await browser.newPage();
  await p0.goto('about:blank');
  const b64 = await p0.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 320; c.height = 180;
    const ctx = c.getContext('2d'); let t = 0;
    const iv = setInterval(() => { t++; ctx.fillStyle = `hsl(${t * 9},70%,50%)`; ctx.fillRect(0, 0, 320, 180); }, 50);
    const rec = new MediaRecorder(c.captureStream(20), { mimeType: 'video/webm' });
    const trozos = []; rec.ondataavailable = e => trozos.push(e.data);
    rec.start(); await new Promise(r => setTimeout(r, 6000)); rec.stop(); clearInterval(iv);
    await new Promise(r => { rec.onstop = r; });
    const u = new Uint8Array(await new Blob(trozos, { type: 'video/webm' }).arrayBuffer());
    let s = ''; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
    return btoa(s);
  });
  fs.writeFileSync(ARCHIVO, Buffer.from(b64, 'base64'));
  await p0.close();
}
const CUERPO = fs.readFileSync(ARCHIVO);

/* ---- 2. la batería, igual en los dos entornos ---- */
async function bateria(etiqueta, opcionesContexto) {
  const falla = m => fallos.push(`[${etiqueta}] ${m}`);
  const ctx = await browser.newContext(opcionesContexto);
  const page = await ctx.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', e => falla('error JS: ' + e));
  await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: CUERPO }));
  await page.goto(url);
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape').catch(() => {});
  /* Sin disparador en el marcado, se inyecta uno (kit-base v1.9.99):
     el test tiene que valer para cualquier curso del molde, y un curso
     sin video en pop-up no es un curso sin reproductor — el
     `#d-video-player` lo trae el boilerplate igual. Antes, `abrir()`
     reventaba con un TypeError sin reportar nada. */
  const sinReproductor = await page.evaluate(() => {
    if (!document.getElementById('d-video-player')) return 'el curso no trae #d-video-player (index-boilerplate.html)';
    if (typeof window.initVideoPlayer !== 'function') return 'el curso no carga coto-media.js (`initVideoPlayer`)';
    if (document.querySelector('[data-video-popup], [data-video-play]')) return null;
    const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
    const b = document.createElement('button');
    b.setAttribute('data-video-play', ''); b.setAttribute('data-video', 'video/prueba-reproductor.mp4');
    b.setAttribute('data-video-title', 'Video de prueba'); b.textContent = 'ver';
    slide.appendChild(b);
    window.initVideoPlayer({});
    return null;
  });
  if (sinReproductor) { falla(sinReproductor); await ctx.close(); return; }

  const est = () => page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    const card = v.closest('.modal-card');
    return {
      t: +v.currentTime.toFixed(2), dur: isFinite(v.duration) ? +v.duration.toFixed(2) : null,
      paused: v.paused, ready: v.readyState, net: v.networkState,
      src: v.getAttribute('src'), cargando: card.classList.contains('is-cargando'),
      abierto: !!document.querySelector('[data-popup="video-player"].open')
    };
  });
  const abrir = () => page.evaluate(() => {
    const t = document.querySelector('[data-video-popup], [data-video-play]');
    (t.querySelector('.d-shot-hit-play') || t).click();
  });
  const conRecurso = () => page.evaluate(() => Array.from(document.querySelectorAll('video'))
    .filter(v => v.getAttribute('src') || (v.querySelector('source') && v.querySelector('source').getAttribute('src'))).length);

  // ir a la diapositiva del video y sacar de encima su pop-up de intro
  await page.evaluate(() => {
    const t = document.querySelector('[data-video-popup], [data-video-play]');
    const s = t && t.closest('[data-slide]');
    if (s) window.motor.gotoId(s.getAttribute('data-slide'));
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => { const m = document.querySelector('.modal.open [data-popup-close]'); if (m) m.click(); });
  await page.waitForTimeout(300);

  /* --- huella de memoria: cuántos <video> retienen archivo a la vez --- */
  const retenidos = await conRecurso();
  if (retenidos > 2) falla(`${retenidos} <video> retienen archivo a la vez en la diapositiva del video: es la presión de memoria que en iPad termina en "se tildó y quedó en negro" (tope razonable: 2, el de la diapo y el del pop-up)`);

  /* --- A. abrir y reproducir --- */
  await abrir();
  await page.waitForTimeout(1600);
  const a = await est();
  if (!a.abierto) falla('el pop-up no se abrió');
  if (a.paused) falla('al abrir, el video no arrancó solo');
  if (!(a.t > 0)) falla(`al abrir, el video no avanza (currentTime=${a.t})`);
  if (a.cargando) falla('el indicador de carga quedó prendido con el video ya reproduciendo');

  /* --- B. PAUSAR: conserva cuadro y posición (el gesto que rompía) --- */
  await page.evaluate(() => document.getElementById('d-video-player').pause());
  await page.waitForTimeout(700);
  const b = await est();
  if (!b.paused) falla('no se pudo pausar');
  if (b.ready < 2) falla(`al pausar, el reproductor perdió el cuadro (readyState=${b.ready}): eso es la pantalla en negro`);
  if (!b.src) falla('al pausar se soltó la fuente del video');
  if (Math.abs(b.t - a.t) > 0.6) falla(`al pausar, la posición saltó de ${a.t}s a ${b.t}s`);

  /* --- C. RETOMAR: sigue donde estaba ---
     ⚠️ La promesa de `play()` NO se devuelve desde el `evaluate`: sobre
     un `<video>` sin fuente no se resuelve NUNCA, y el test se colgaba
     hasta el timeout en vez de reportar el fallo. Un test que se
     cuelga cuando el código está roto no sirve: hay que verlo fallar. */
  await page.evaluate(() => { const pr = document.getElementById('d-video-player').play(); if (pr) pr.catch(() => {}); });
  await page.waitForTimeout(1000);
  const c = await est();
  if (c.paused) falla('no se pudo retomar después de pausar');
  if (c.t < b.t - 0.1) falla(`al retomar volvió atrás: de ${b.t}s a ${c.t}s`);

  /* --- D. VOLUMEN / MUDO: el reproductor los respeta --- */
  const vol = await page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    v.muted = true; const m1 = v.muted; v.muted = false; v.volume = 0.5;
    return { m1, m2: v.muted, vol: v.volume };
  });
  if (!vol.m1 || vol.m2 || vol.vol !== 0.5) falla(`los controles de volumen no responden: ${JSON.stringify(vol)}`);

  /* --- E. DESALOJO con el video pausado: el caso del cliente --- */
  await page.evaluate(() => document.getElementById('d-video-player').pause());
  await page.waitForTimeout(400);
  const antes = await est();
  await page.evaluate(() => { const v = document.getElementById('d-video-player'); v.removeAttribute('src'); v.load(); });
  await page.waitForTimeout(2200);
  const tras = await est();
  if (!tras.src) falla('tras un desalojo del navegador el reproductor se quedó sin fuente: pantalla negra definitiva');
  if (tras.ready < 2) falla(`tras el desalojo el reproductor no recuperó el cuadro (readyState=${tras.ready})`);
  if (tras.cargando) falla('el indicador de carga quedó colgado después del rescate');
  if (!tras.abierto) falla('el rescate cerró el pop-up');

  /* --- F. y que desde ahí se pueda seguir mirando --- */
  await page.evaluate(() => { const pr = document.getElementById('d-video-player').play(); if (pr) pr.catch(() => {}); });
  await page.waitForTimeout(1100);
  const f = await est();
  if (f.paused || !(f.t > tras.t)) falla(`después del rescate el video no vuelve a reproducirse (paused=${f.paused}, ${tras.t}s → ${f.t}s)`);

  /* --- G. CERRAR: suelta el archivo --- */
  await page.evaluate(() => document.querySelector('[data-popup="video-player"] [data-popup-close]').click());
  await page.waitForTimeout(800);
  const g = await est();
  if (g.abierto) falla('el pop-up no se cerró');
  if (g.src) falla('al cerrar, el <video> quedó con archivo enganchado: sigue descargando de fondo');
  if (!g.paused) falla('al cerrar, el video siguió reproduciéndose');

  /* --- H. REABRIR: vuelve a andar, desde el principio --- */
  await abrir();
  await page.waitForTimeout(1600);
  const h = await est();
  if (!h.abierto || h.paused || !(h.t > 0)) falla(`al reabrir no volvió a reproducir (${JSON.stringify(h)})`);

  /* --- I. cerrar con Esc --- */
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const i = await est();
  if (i.abierto || i.src) falla('cerrar con Esc no suelta el video igual que el botón ✕');

  /* --- J. doble toque: abrir dos veces seguidas no lo rompe --- */
  await abrir(); await abrir();
  await page.waitForTimeout(1800);
  const j = await est();
  if (!j.abierto || j.paused) falla(`tocar dos veces seguidas el disparador deja el reproductor trabado (${JSON.stringify(j)})`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  /* --- K. navegar con el pop-up abierto: se cierra y suelta --- */
  await abrir();
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.motor.go(0));
  await page.waitForTimeout(800);
  const k = await est();
  if (k.abierto || k.src) falla('al cambiar de diapositiva con el reproductor abierto, el video no se soltó');

  /* ================================================================
     M. LOS CONTROLES PROPIOS (kit-base v1.9.98)
     ----------------------------------------------------------------
     Las pruebas de arriba manejan el `<video>` por código, así que
     pasarían igual con la barra nativa: verifican el MEDIO, no la
     interfaz. Esto de acá toca los botones como los toca el alumno —
     que es lo único que demuestra que los controles propios andan.
     ================================================================ */
  await page.evaluate(() => {
    const t = document.querySelector('[data-video-popup], [data-video-play]');
    const s = t && t.closest('[data-slide]');
    if (s) window.motor.gotoId(s.getAttribute('data-slide'));
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => { const m = document.querySelector('.modal.open [data-popup-close]'); if (m) m.click(); });
  await page.waitForTimeout(200);
  await abrir();
  await page.waitForTimeout(1500);

  /* Antes de cada clic, revelar la barra moviendo el puntero, que es
     lo que hace una persona. Sin esto, si la barra queda escondida el
     test muere por timeout de Playwright en vez de decir qué pasó —y
     un fallo que no se explica solo cuesta media hora de lectura. */
  const despertar = async () => {
    await page.evaluate(() => {
      const c = document.querySelector('[data-popup="video-player"] .d-vp-bar').parentElement;
      c.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }));
    });
    await page.waitForTimeout(120);
  };

  // M1. la barra nativa NO puede estar
  const nat = await page.evaluate(() => document.getElementById('d-video-player').hasAttribute('controls'));
  if (nat) falla('el <video> todavía tiene `controls`: la barra nativa de Safari vuelve, y con ella PiP y AirPlay');

  // M2. existen nuestros controles
  const piezas = await page.evaluate(() => ({
    bar: !!document.querySelector('[data-popup="video-player"] .d-vp-bar'),
    play: !!document.querySelector('[data-popup="video-player"] .d-vp-btn--play'),
    seek: !!document.querySelector('[data-popup="video-player"] .d-vp-seek'),
    vol: !!document.querySelector('[data-popup="video-player"] .d-vp-vol'),
    atras: !!document.querySelector('[data-popup="video-player"] .d-vp-atras')
  }));
  Object.keys(piezas).forEach(k => { if (!piezas[k]) falla(`falta el control "${k}" en la barra propia`); });

  /* Todo `.d-vp-*` de esta batería va acotado al reproductor del pop-up
     (kit-base v1.9.122, §7.71): un curso con `initPopupVideos` monta una
     barra por video de ficha —NOA: 10 fichas + el reproductor = 11— y el
     locator sin acotar cortaba con "strict mode violation". Y antes de
     cada clic se "despierta" la barra: si se auto-ocultó (opacity 0,
     pointer-events none) el clic no llega, que es lo que cortaba M3 por
     timeout en NOA. Los dos los relevó ese curso. */
  // M3. el botón de play/pausa hace las dos cosas, y el rótulo acompaña
  const btn = page.locator('[data-popup="video-player"] .d-vp-btn--play');
  await despertar(); await btn.click();
  await page.waitForTimeout(500);
  const m3a = await est();
  const rot1 = await page.locator('[data-popup="video-player"] .d-vp-btn--play').getAttribute('aria-label');
  if (!m3a.paused) falla('el botón de pausa de la barra propia no pausó');
  if (rot1 !== 'Reproducir') falla(`con el video pausado el botón tendría que decir "Reproducir" (dice "${rot1}")`);
  await despertar(); await btn.click();
  await page.waitForTimeout(800);
  const m3b = await est();
  const rot2 = await page.locator('[data-popup="video-player"] .d-vp-btn--play').getAttribute('aria-label');
  if (m3b.paused) falla('el botón de reproducir de la barra propia no retomó');
  if (rot2 !== 'Pausar') falla(`reproduciendo, el botón tendría que decir "Pausar" (dice "${rot2}")`);

  // M4. PAUSADO, la barra se queda visible (la falla que reportó el cliente)
  await despertar(); await btn.click();
  await page.waitForTimeout(3600); // más que el auto-ocultado de 3 s
  const visible = await page.evaluate(() => {
    const b = document.querySelector('[data-popup="video-player"] .d-vp-bar');
    return getComputedStyle(b).opacity !== '0' && b.getBoundingClientRect().height > 0;
  });
  if (!visible) falla('con el video PAUSADO los controles se escondieron solos: es exactamente la falla reportada');

  // M5. el reloj muestra tiempo real, no 0:00
  const reloj = await page.evaluate(() => ({
    ahora: document.querySelector('[data-popup="video-player"] .d-vp-ahora').textContent,
    total: document.querySelector('[data-popup="video-player"] .d-vp-total').textContent
  }));
  if (!/^\d+:\d\d$/.test(reloj.ahora) || reloj.ahora === '0:00') falla(`el reloj no muestra el avance real (dice "${reloj.ahora}")`);
  if (!/\d+:\d\d/.test(reloj.total) || /0:00/.test(reloj.total)) falla(`el reloj no muestra la duración (dice "${reloj.total}")`);

  // M6. retroceder 10 s
  const antes10 = (await est()).t;
  await despertar(); await page.locator('[data-popup="video-player"] .d-vp-atras').click();
  await page.waitForTimeout(600);
  const tras10 = (await est()).t;
  if (!(tras10 < antes10) && antes10 > 0.5) falla(`el botón de -10 s no retrocedió (${antes10}s → ${tras10}s)`);

  // M7. mudo y volumen
  await despertar(); await page.locator('[data-popup="video-player"] .d-vp-mute').click();
  await page.waitForTimeout(300);
  if (!await page.evaluate(() => document.getElementById('d-video-player').muted)) falla('el botón de silenciar no silencia');
  await despertar(); await page.locator('[data-popup="video-player"] .d-vp-mute').click();
  await page.waitForTimeout(300);
  if (await page.evaluate(() => document.getElementById('d-video-player').muted)) falla('el botón de silenciar no devuelve el sonido');

  /* M8. la barra de avance pide el segundo correcto.
     ⚠️ Se verifica QUÉ SEGUNDO PIDE el control, no dónde termina el
     video. El webm que fabrica este test sale de `MediaRecorder` y no
     trae índice de búsqueda —comprobado: `seekable` devuelve [0,0]—,
     así que cualquier `currentTime` cae en 0 por limitación DEL
     ARCHIVO, no del curso. Afirmar sobre el resultado sería reportar
     un bug que no existe; el cálculo y el cableado sí son nuestros y
     son lo que hay que fijar acá.
     Si algún día el archivo de prueba soporta búsqueda, la segunda
     mitad (el resultado real) se comprueba sola. */
  const dur = (await est()).dur;
  const pedido = await page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    const d = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
    let pedidos = [];
    Object.defineProperty(v, 'currentTime', {
      configurable: true,
      get() { return d.get.call(this); },
      set(x) { pedidos.push(x); d.set.call(this, x); }
    });
    const r = document.querySelector('[data-popup="video-player"] .d-vp-seek');
    r.value = '600'; // 60 % del recorrido
    r.dispatchEvent(new Event('input', { bubbles: true }));
    r.dispatchEvent(new Event('change', { bubbles: true }));
    const ultimo = pedidos.length ? pedidos[pedidos.length - 1] : null;
    delete v.currentTime;
    return { ultimo, sePuedeBuscar: v.seekable.length ? v.seekable.end(0) > 0 : false };
  });
  if (pedido.ultimo === null) falla('mover la barra de avance no le pidió ningún segundo al video');
  else if (dur && Math.abs(pedido.ultimo - dur * 0.6) > Math.max(0.3, dur * 0.05))
    falla(`la barra de avance pidió ${pedido.ultimo.toFixed(2)}s cuando el 60 % son ${(dur * 0.6).toFixed(2)}s`);
  if (pedido.sePuedeBuscar) {
    await page.waitForTimeout(800);
    const trasBuscar = (await est()).t;
    if (Math.abs(trasBuscar - dur * 0.6) > Math.max(1.2, dur * 0.18))
      falla(`la barra de avance no llevó el video al 60 % (esperado ~${(dur * 0.6).toFixed(1)}s, quedó en ${trasBuscar}s)`);
  }

  // M9. teclado: los controles son alcanzables y accionables con Tab/Enter
  const focoOk = await page.evaluate(() => {
    const b = document.querySelector('[data-popup="video-player"] .d-vp-btn--play');
    b.focus();
    return document.activeElement === b;
  });
  if (!focoOk) falla('el botón de play no recibe foco de teclado');
  const rangeRoles = await page.evaluate(() => {
    const s = document.querySelector('[data-popup="video-player"] .d-vp-seek');
    return { tag: s.tagName, tipo: s.type, etiqueta: s.getAttribute('aria-label') || '' };
  });
  if (rangeRoles.tag !== 'INPUT' || rangeRoles.tipo !== 'range')
    falla('la barra de avance no es un <input type="range">: pierde teclado y lector de pantalla');
  if (!rangeRoles.etiqueta) falla('la barra de avance no tiene aria-label');

  /* M9b. AMPLIAR, incluido el caso exacto que reportó el cliente.
     ⚠️ Lo que falla no es "tocar ampliar" a secas: es tocarlo **con el
     curso ya en pantalla completa**, que es como lo usa el alumno en
     iPad (el botón del header). Ahí WebKit rechaza la pantalla completa
     anidada, el rechazo llega como promesa —no como excepción— y el
     botón no hacía nada. Por eso la segunda mitad de esta prueba
     simula que ya hay una pantalla completa activa: sin eso, en
     Chromium la API funciona y el bug no se ve nunca. */
  await despertar();
  await page.locator('[data-popup="video-player"] .d-vp-fs').click();
  await page.waitForTimeout(600);
  const amp1 = await page.evaluate(() => ({
    css: document.querySelector('.modal-card--video').classList.contains('d-vp-ampliado'),
    fsReal: !!document.fullscreenElement,
    rotulo: document.querySelector('[data-popup="video-player"] .d-vp-fs').getAttribute('aria-label')
  }));
  if (!amp1.css && !amp1.fsReal) falla('el botón de ampliar no hizo nada (ni pantalla completa real ni ampliación por CSS)');
  if (amp1.rotulo !== 'Salir de pantalla completa') falla(`ampliado, el botón tendría que decir "Salir de pantalla completa" (dice "${amp1.rotulo}")`);
  await despertar();
  await page.locator('[data-popup="video-player"] .d-vp-fs').click();
  await page.waitForTimeout(600);
  if (await page.evaluate(() => document.querySelector('.modal-card--video').classList.contains('d-vp-ampliado') || !!document.fullscreenElement))
    falla('el botón de ampliar no vuelve atrás');

  // …y ahora el caso del reporte: con una pantalla completa YA activa.
  await page.evaluate(() => {
    Object.defineProperty(document, 'fullscreenElement', { get: () => document.documentElement, configurable: true });
  });
  await despertar();
  await page.locator('[data-popup="video-player"] .d-vp-fs').click();
  await page.waitForTimeout(600);
  if (!await page.evaluate(() => document.querySelector('.modal-card--video').classList.contains('d-vp-ampliado')))
    falla('CON EL CURSO YA EN PANTALLA COMPLETA el botón de ampliar no hizo nada: es el caso exacto reportado en iPad');
  const tapa = await page.evaluate(() => {
    const c = document.querySelector('.modal-card--video').getBoundingClientRect();
    return { ancho: Math.round(c.width), alto: Math.round(c.height), vw: innerWidth, vh: innerHeight };
  });
  if (tapa.ancho < tapa.vw - 2 || tapa.alto < tapa.vh - 2)
    falla(`ampliado, la tarjeta tendría que ocupar la ventana (mide ${tapa.ancho}x${tapa.alto} en ${tapa.vw}x${tapa.vh})`);
  await despertar();
  await page.locator('[data-popup="video-player"] .d-vp-fs').click();
  await page.waitForTimeout(400);
  await page.evaluate(() => { delete document.fullscreenElement; });

  /* M10. el aviso con palabras reemplaza al rectángulo negro.
     ⚠️ Se OBSERVA el cambio, no se espera un rato y se mira. Con el
     archivo servido desde el disco el rescate termina en milisegundos,
     así que mirar 350 ms después daba "no se vio" cuando en realidad
     se vio y ya se había ido. Un test que depende de la velocidad de
     la red miente en las dos direcciones. */
  await page.evaluate(() => {
    window.__vioAviso = '';
    const a = document.querySelector('[data-popup="video-player"] .d-vp-aviso');
    new MutationObserver(() => {
      if (a && !a.hidden && !window.__vioAviso) window.__vioAviso = a.textContent.trim();
    }).observe(a, { attributes: true, attributeFilter: ['hidden'], childList: true, subtree: true });
  });
  await page.evaluate(() => { const v = document.getElementById('d-video-player'); v.removeAttribute('src'); v.load(); });
  await page.waitForTimeout(1200);
  const avisoTxt = await page.evaluate(() => window.__vioAviso);
  if (!/Recuperando/i.test(avisoTxt)) falla(`durante el rescate tendría que verse "Recuperando el video…" y se vio "${avisoTxt}"`);
  await page.waitForTimeout(2000);
  if (await page.evaluate(() => { const a = document.querySelector('[data-popup="video-player"] .d-vp-aviso'); return a && !a.hidden; }))
    falla('el aviso de "Recuperando…" quedó colgado después del rescate');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  /* --- L. página oculta: no puede quedar nada sonando --- */
  await page.evaluate(() => {
    const t = document.querySelector('[data-video-popup], [data-video-play]');
    const s = t && t.closest('[data-slide]');
    if (s) window.motor.gotoId(s.getAttribute('data-slide'));
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => { const m = document.querySelector('.modal.open [data-popup-close]'); if (m) m.click(); });
  await page.waitForTimeout(200);
  await abrir();
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { get: () => true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(600);
  const l = await page.evaluate(() => Array.from(document.querySelectorAll('video')).filter(v => !v.paused).length);
  if (l > 0) falla(`con la página oculta quedaron ${l} video(s) reproduciéndose`);

  await ctx.close();
}

await bateria('PC 1600x900', { viewport: { width: 1600, height: 900 } });
await bateria('iPad', { ...devices['iPad (gen 7) landscape'] });

/* ---- LA NORMA DEL KIT, comprobada sobre el código ----
   Desde kit-base v1.9.98: **ningún patrón de video del kit usa la barra
   NATIVA del navegador**. Las pruebas de arriba cubren el reproductor
   del pop-up, que es el único que este curso ejercita; los otros tres
   patrones (`initPopupVideos`, `initLayerVideos`, la variante con
   carátula de `initInlineCircleVideos`) viven en cursos distintos y
   acá no hay marcado que los dispare.
   Eso no puede querer decir "sin red": si alguien vuelve a prender
   `controls` en cualquiera de ellos, los cuatro problemas de iPad
   vuelven con él. Esta comprobación es barata y lee la fuente. */
const fuente = await (await fetch(new URL('js/coto-media.js', url))).text();
const prende = fuente.split('\n')
  .map((l, i) => ({ n: i + 1, l }))
  .filter(x => /(\.controls\s*=\s*true|setAttribute\(\s*['"]controls['"])/.test(x.l) && !/^\s*[*/]/.test(x.l));
if (prende.length)
  fallos.push('NORMA DEL KIT: coto-media.js vuelve a prender los controles NATIVOS en ' +
    prende.map(x => 'la línea ' + x.n).join(', ') +
    ' — con ellos vuelven PiP, AirPlay y los controles que se esconden solos. Usar montarControles().');

/* ---- N. accesibilidad de la barra (lo que tenía el test de v1.9.98) ----
   Las dos barras son `<input type="range">` a propósito, y eso ya lo
   verifica M8. Acá: que TODO control tenga nombre accesible (son
   íconos: sin `aria-label` el lector de pantalla dice "botón" y nada
   más) y que el aviso sea `role="status"`, para que se anuncie solo. */
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: CUERPO }));
  await page.goto(url);
  await page.waitForTimeout(700);
  const a11y = await page.evaluate(() => {
    const v = document.getElementById('d-video-player');
    if (!v) return null;
    const cont = v.parentElement;
    const bar = cont.querySelector('.d-vp-bar');
    const aviso = cont.querySelector('.d-vp-aviso');
    return {
      hayBarra: !!bar,
      sinRotulo: bar ? Array.from(bar.querySelectorAll('button, input'))
        .filter(e => !(e.getAttribute('aria-label') || '').trim()).map(e => e.className) : [],
      avisoRole: aviso ? aviso.getAttribute('role') : null,
      avisoTxt: !!(aviso && aviso.querySelector('.d-vp-aviso-txt'))
    };
  });
  if (a11y && !a11y.hayBarra) fallos.push('el reproductor del pop-up no tiene barra propia (.d-vp-bar): `montarControles()` no se está llamando.');
  if (a11y && a11y.hayBarra) {
    a11y.sinRotulo.forEach(c => fallos.push(`el control "${c}" de la barra no tiene aria-label: es un ícono sin nombre accesible.`));
    if (a11y.avisoRole !== 'status') fallos.push(`el aviso de estado tendría que ser role="status" para que el lector de pantalla lo anuncie (es "${a11y.avisoRole}").`);
    if (!a11y.avisoTxt) fallos.push('el aviso de estado no tiene dónde escribir el texto (.d-vp-aviso-txt).');
  }
  await page.close();
}

/* ---- O. la variante con CARÁTULA: tocar la imagen pausa ----
   REGRESIÓN REAL de v1.9.98. En `initInlineCircleVideos` con `poster`,
   `montarControles()` pone su propio toggle en el clic sobre el
   `<video>` y el patrón tenía el suyo: los dos corrían sobre el mismo
   clic, uno pausaba y el otro volvía a arrancar. Medido: con el video
   reproduciendo, tocar la imagen lo dejaba reproduciendo.
   Se inyecta el marcado del patrón (es de cursos distintos a los que
   tienen el pop-up), con un webm real. */
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: CUERPO }));
  await page.goto(url);
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape').catch(() => {});
  const car = await page.evaluate(async () => {
    if (typeof window.initInlineCircleVideos !== 'function') return null;
    const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
    const wrap = document.createElement('div');
    wrap.setAttribute('data-inline-video', '');
    wrap.style.cssText = 'position:relative;width:400px;height:225px';
    const poster = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    wrap.innerHTML = '<video class="d-shot-hit-video" playsinline muted poster="' + poster + '" src="video/prueba-caratula.mp4"></video>' +
                     '<button type="button" class="d-shot-hit-play">Reproducir</button>';
    slide.appendChild(wrap);
    window.initInlineCircleVideos({});
    const v = wrap.querySelector('video');
    const espera = (ms) => new Promise(r => setTimeout(r, ms));
    wrap.querySelector('.d-shot-hit-play').click(); await espera(900);
    const out = { arranco: !v.paused };
    v.click(); await espera(300);
    out.pausoTocandoLaImagen = v.paused;
    v.click(); await espera(400);
    out.retomoTocandoLaImagen = !v.paused;
    return out;
  });
  if (car) {
    if (!car.arranco) fallos.push('variante con carátula: el botón de play no arrancó el video.');
    else {
      if (!car.pausoTocandoLaImagen) fallos.push('variante con carátula: tocar la imagen del video NO lo pausó — ' +
        'hay dos handlers sobre el mismo clic (el de `montarControles` y el del patrón) y se anulan.');
      if (!car.retomoTocandoLaImagen) fallos.push('variante con carátula: tocar la imagen de un video pausado no lo retomó.');
    }
  }
  await page.close();
}

/* ---- P. el botón de play: cuándo lo dibuja el kit y cuándo NO ----
   (kit-base v1.9.101). `dibujarPlay()` pone el triángulo en un
   `.d-shot-hit-play` que no trae ícono. Hasta v1.9.100 solo miraba si
   había un `<svg>`, y ninguno de los dos modificadores del play de marca
   lo tiene: `--art` perdía su `<img>` con el ícono del cliente (MEDIDO:
   quedaba el triángulo genérico, regresión de v1.9.98) y `--horneado`
   —cuyo play ya está en el arte— recibía uno dibujado encima, que es el
   play doble que existe para sacar. Y ningún test lo miraba.
   v1.9.103: se suma `--marca` (el play de la marca calzado sobre el del
   arte con `--play`/`--play-x`/`--play-y`): tiene que conservar su <img>,
   quedar transparente y caer donde dicen sus variables — que es todo lo
   que lo hace calzar con el play dibujado en la tarjeta. */
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: CUERPO }));
  await page.goto(url);
  await page.waitForTimeout(600);
  const pl = await page.evaluate(() => {
    if (typeof window.initInlineCircleVideos !== 'function') return null;
    const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
    const mk = (clase, interior) => {
      const w = document.createElement('div');
      w.setAttribute('data-inline-video', '');
      w.className = 'd-shot-hit d-shot-hit--circle d-shot-hit--video';
      w.innerHTML = '<video class="d-shot-hit-video" playsinline></video>' +
        '<button type="button" class="d-shot-hit-play ' + clase + '">' + interior + '</button>';
      slide.appendChild(w);
      return w.querySelector('.d-shot-hit-play');
    };
    const art = mk('d-shot-hit-play--art', '<span class="sr-only">Reproducir</span><img src="img/reproductor-play.webp" alt="" aria-hidden="true">');
    const horn = mk('d-shot-hit-play--horneado', '<span class="sr-only">Reproducir video</span>');
    const marca = mk('d-shot-hit-play--marca', '<span class="sr-only">Reproducir video</span><img src="img/reproductor-play.webp" alt="" aria-hidden="true">');
    marca.setAttribute('style', '--play:12%; --play-x:30%; --play-y:40%');
    /* Tamaño explícito: sin él la zona inyectada mide 0×0, las medidas dan
       NaN y toda comparación con NaN es falsa → verde sin medir (MEDIDO). */
    marca.parentElement.style.cssText = 'position:absolute; left:100px; top:100px; width:400px; height:300px';
    const plano = mk('', 'Reproducir');
    window.initInlineCircleVideos({});
    const leer = (b) => ({ svg: !!b.querySelector('svg'), img: !!b.querySelector('img'),
      nombre: (b.getAttribute('aria-label') || b.textContent || '').trim(),
      fondo: getComputedStyle(b).backgroundColor });
    const donde = (b) => {
      const z = b.parentElement.getBoundingClientRect(), r = b.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - z.left) / z.width * 100,
               y: (r.top + r.height / 2 - z.top) / z.height * 100,
               w: r.width / z.width * 100 };
    };
    return { art: leer(art), horn: leer(horn), plano: leer(plano),
             marca: Object.assign(leer(marca), donde(marca)) };
  });
  if (pl) {
    if (!pl.plano.svg) fallos.push('un `.d-shot-hit-play` sin ícono tendría que recibir el triángulo del kit (`dibujarPlay`) y no lo recibió.');
    if (!pl.plano.nombre) fallos.push('al dibujar el triángulo, el botón se quedó sin nombre accesible (el texto tiene que pasar a aria-label).');
    if (!pl.art.img || pl.art.svg) fallos.push('`.d-shot-hit-play--art` perdió su <img> con el ícono de la marca: `dibujarPlay` la reemplazó por el triángulo genérico.');
    if (pl.horn.svg) fallos.push('`.d-shot-hit-play--horneado` recibió un triángulo dibujado: el play ya está en el arte, y quedan dos encimados.');
    if (!pl.horn.nombre) fallos.push('`.d-shot-hit-play--horneado` se quedó sin nombre accesible: es el único control del círculo.');
    if (!/rgba\(0, 0, 0, 0\)|transparent/.test(pl.horn.fondo)) {
      fallos.push(`\`.d-shot-hit-play--horneado\` tendría que ser transparente (su dibujo lo pone el arte) y tiene fondo ${pl.horn.fondo}.`);
    }
    const m = pl.marca;
    if (!m.img || m.svg) fallos.push('`.d-shot-hit-play--marca` perdió su <img> con el play de la marca (o recibió el triángulo genérico encima).');
    if (!m.nombre) fallos.push('`.d-shot-hit-play--marca` se quedó sin nombre accesible.');
    if (!/rgba\(0, 0, 0, 0\)|transparent/.test(m.fondo)) fallos.push(`\`.d-shot-hit-play--marca\` tendría que ser transparente y tiene fondo ${m.fondo}.`);
    if (![m.x, m.y, m.w].every(Number.isFinite) || m.w === 0) {
      fallos.push('`.d-shot-hit-play--marca`: no se pudo medir (zona o botón sin tamaño).');
    } else if (Math.abs(m.x - 30) > 1 || Math.abs(m.y - 40) > 1 || Math.abs(m.w - 12) > 1) {
      fallos.push(`\`.d-shot-hit-play--marca\` no cae donde dicen sus variables (pedido 30%/40%, disco 12%; quedó ${m.x.toFixed(1)}%/${m.y.toFixed(1)}%, disco ${m.w.toFixed(1)}%): no calzaría sobre el play del arte.`);
    }
    /* El aumento es UNO, se pase el mouse por donde se pase (v1.9.105).
       `.d-shot-hit-play:hover` trae `transform: scale(1.06)`, y `transform`
       y `scale` se MULTIPLICAN: encima del play daba 1,19 y en el resto de
       la zona 1,12 — "doble aumento", reporte del cliente en cardio. */
    const z = await page.evaluate(() => {
      const b = document.querySelector('.d-shot-hit-play--marca'); b.id = 'zz-marca';
      const r = b.getBoundingClientRect(), p = b.parentElement.getBoundingClientRect();
      return { bx: r.left + r.width / 2, by: r.top + r.height / 2, zx: p.left + 12, zy: p.top + 12 };
    });
    const ancho = () => page.evaluate(() => document.getElementById('zz-marca').getBoundingClientRect().width);
    await page.mouse.move(z.zx, z.zy); await page.waitForTimeout(350); const enZona = await ancho();
    await page.mouse.move(z.bx, z.by); await page.waitForTimeout(350); const encima = await ancho();
    if (Math.abs(enZona - encima) > 1) {
      fallos.push(`\`.d-shot-hit-play--marca\` crece distinto según dónde esté el mouse: ${enZona.toFixed(0)}px en la zona y ${encima.toFixed(0)}px encima del play. Se está sumando el \`transform\` del hover genérico al \`scale\` propio.`);
    }
  }
  await page.close();
}

/* ---- Q. videos de FICHA: el archivo se engancha al abrir y se suelta al
   cerrar (kit-base v1.9.122, §7.71) ----
   `initPopupVideos` dejaba el `src` puesto en todos: NOA, con 10 fichas,
   tenía 11 videos reteniendo archivo a la vez. Se arman tres fichas de
   prueba y se mide cuántos tienen fuente con las tres cerradas, con una
   abierta y al cerrarla. */
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(700);
  const r = await page.evaluate(async () => {
    if (typeof window.initPopupVideos !== 'function' || !window.motor) return { no: true };
    const espera = (ms) => new Promise((res) => setTimeout(res, ms));
    for (let k = 0; k < 3; k++) {
      const m = document.createElement('div');
      m.className = 'modal zz-pv'; m.setAttribute('data-popup', 'zz-pv-' + k);
      m.innerHTML = '<div class="modal-card"><div class="modal-bd"><video playsinline preload="none">' +
        '<source src="video/zz-ficha-' + k + '.mp4" type="video/mp4"></video></div></div>';
      document.body.appendChild(m);
    }
    /* Sin `selector` (v1.9.123, §7.72): así lo llama un curso, y el
       default NO puede tomar el reproductor del kit (`#d-video-player`). */
    window.initPopupVideos({});
    const conFuente = () => [...document.querySelectorAll('.zz-pv video')]
      .filter((v) => v.getAttribute('src') || [...v.querySelectorAll('source')].some((x) => x.getAttribute('src'))).length;
    const cerradas = conFuente();
    window.motor.showPopup('zz-pv-1');
    await espera(200);
    const abierta = conFuente();
    const laAbierta = !!document.querySelector('[data-popup="zz-pv-1"] source[src]');
    window.motor.closePopup();
    await espera(200);
    const alCerrar = conFuente();
    document.querySelectorAll('.zz-pv').forEach((m) => m.remove());
    /* El reproductor del kit, después de abrir y cerrar su pop-up: la barra
       no puede quedar apagada (`d-vp-virgen` en su contenedor). Que suelte
       su archivo al cerrar es suyo y a propósito (`initVideoPlayer`). */
    let reproductor = null;
    const vp = document.getElementById('d-video-player');
    if (vp && vp.closest('[data-popup]')) {
      window.motor.showPopup(vp.closest('[data-popup]').getAttribute('data-popup'));
      await espera(200);
      window.motor.closePopup();
      await espera(200);
      reproductor = { virgen: !!(vp.parentElement && vp.parentElement.classList.contains('d-vp-virgen')) };
    }
    return { cerradas, abierta, laAbierta, alCerrar, reproductor };
  });
  if (!r.no) {
    if (r.cerradas > 0) fallos.push(`[fichas] con las tres fichas de video CERRADAS, ${r.cerradas} retienen archivo: en un curso con muchas fichas (NOA: 10) es la presión de memoria que en iPad deja la pantalla en negro.`);
    if (r.abierta !== 1 || !r.laAbierta) fallos.push(`[fichas] al abrir una ficha, ${r.abierta} video(s) con archivo (tiene que ser 1, el de la ficha abierta${r.laAbierta ? '' : ', y ese no lo tiene'}).`);
    if (r.alCerrar > 0) fallos.push(`[fichas] al cerrar la ficha su video siguió reteniendo el archivo.`);
    if (r.reproductor && r.reproductor.virgen) {
      fallos.push('[fichas] `initPopupVideos()` sin selector tomó también el reproductor del kit (#d-video-player): ' +
        'al cerrarlo su barra quedó apagada (`d-vp-virgen`) para siempre, sin clics.');
    }
  }
  await page.close();
}

await browser.close();
report('reproductor-video', fallos);
