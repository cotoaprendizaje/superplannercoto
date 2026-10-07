/* una-sola-voz — nunca suenan dos cosas a la vez: ni locución sobre un
   video, ni un video sobre la locución. kit-base v1.9.112 (relevo de
   "Prevención cardiovascular").

   POR QUÉ EXISTE
   --------------
   Regla del cliente, sin excepciones: *"siempre hay que ver que haya 1
   sola locución en acción"*, *"este tipo de errores son muy molestos y
   no tienen que pasar en ninguna parte del curso"*.

   Lo reportó en "Prevención cardiovascular": con el video circular de
   aterosclerosis sonando, tocaba una de las cuatro etapas, se abría su
   pop-up y el pop-up se narraba ENCIMA del video. La coordinación del
   kit iba en un solo sentido: los videos cortaban la locución al
   arrancar, pero nada pausaba un video cuando arrancaba una locución.

   Y no hay forma de verlo en esta suite sin este test, por dos motivos
   que el test resuelve:
     · los .mp4 de los cursos llegan VACÍOS (los sube el cliente), así
       que ningún video reproduce. Acá se sirve un video real con pista
       de audio en lugar de cada .mp4. Se FABRICA la primera vez (8s, un
       tono de 440Hz grabado con MediaRecorder) en
       `$TMPDIR/coto-prueba-video-audio.webm`, como el video sin audio de
       `reproductor-video`: así no viaja un binario de 300 KB en el kit
       y en cada curso.
     · Chromium sin parlantes no "habla". Se reemplaza speechSynthesis
       por uno que dura lo que dura el texto, así "está hablando" es un
       estado medible.

   QUÉ HACE
   --------
   Recorre cada diapositiva. En cada una arranca cada video audible que
   el alumno puede arrancar y dispara cada cosa que se narra (pop-ups,
   etapas, el "Repetir" del panel), EN LOS DOS ÓRDENES: video y después
   locución, locución y después video. Un muestreador corre cada 50ms
   todo el tiempo, así que también agarra un pisado de un instante.

   Un curso SIN NINGÚN video (el arnés, por ejemplo) no da verde sin
   medir: se le agrega un <video> con controles nativos a una diapositiva
   que se narra, y se prueba ese par en los dos órdenes. La regla vive en
   `narrador.js` y vale para cualquier video, así que eso alcanza para
   que el test mida algo en todo curso.

   Además vigila el caso inverso, que es el que un arreglo apurado
   rompe: los videos de FONDO (portada, separadores de unidad) suenan
   solos y por diseño no se narran — una regla de "la locución pausa los
   videos" mal puesta los callaría al entrar.

   Uso: node tests/una-sola-voz.mjs <url>  */
import pw from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { report, requireUrl } from './_shared.mjs';
const { chromium } = pw;

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath,
  args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });

const VIDEO_PRUEBA = path.join(process.env.TMPDIR || '/tmp', 'coto-prueba-video-audio.webm');
if (!fs.existsSync(VIDEO_PRUEBA)) {
  const p0 = await browser.newPage();
  await p0.setContent('<canvas width="320" height="320"></canvas>');
  const b64 = await p0.evaluate(async () => {
    const cv = document.querySelector('canvas'), cx = cv.getContext('2d');
    const ac = new AudioContext();
    const osc = ac.createOscillator(); osc.frequency.value = 440;
    const dst = ac.createMediaStreamDestination(); osc.connect(dst); osc.start();
    const stream = new MediaStream([...cv.captureStream(25).getVideoTracks(), ...dst.stream.getAudioTracks()]);
    const tipo = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/webm';
    const rec = new MediaRecorder(stream, { mimeType: tipo });
    const partes = []; rec.ondataavailable = e => partes.push(e.data);
    let t = 0; const iv = setInterval(() => { cx.fillStyle = 'hsl(' + (t * 9 % 360) + ',60%,45%)'; cx.fillRect(0, 0, 320, 320); t++; }, 40);
    rec.start(); await new Promise(r => setTimeout(r, 8000)); rec.stop();
    await new Promise(r => { rec.onstop = r; }); clearInterval(iv);
    const buf = new Uint8Array(await new Blob(partes, { type: 'video/webm' }).arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return btoa(s);
  });
  fs.writeFileSync(VIDEO_PRUEBA, Buffer.from(b64, 'base64'));
  await p0.close();
}
const VIDEO = fs.readFileSync(VIDEO_PRUEBA);
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
await ctx.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: VIDEO }));
const page = await ctx.newPage();
const errores = [];
page.on('pageerror', e => errores.push(String(e)));

await page.addInitScript(() => {
  /* speechSynthesis de prueba: "habla" ~6s por enunciado, o hasta que lo
     cancelen. Es lo único que hace falta para medir solapamientos. */
  window.__voz = { hablando: false, texto: '' };
  const fake = {
    speaking: false, pending: false, paused: false,
    speak(u) { this.speaking = true; window.__voz.hablando = true; window.__voz.texto = u.text || '';
      setTimeout(() => { if (u.onstart) u.onstart({}); }, 5);
      u.__t = setTimeout(() => { this.speaking = false; window.__voz.hablando = false; if (u.onend) u.onend({}); }, 6000);
      this.__u = u; },
    cancel() { if (this.__u) clearTimeout(this.__u.__t); this.speaking = false; window.__voz.hablando = false; },
    pause() {}, resume() {},
    getVoices() { return [{ name: 'Prueba', lang: 'es-AR', localService: true, voiceURI: 'prueba' }]; },
    addEventListener() {}, removeEventListener() {}, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { value: fake, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };

  /* El muestreador: cada 50ms, ¿hay un video audible sonando Y la voz
     hablando? Se guarda el primer momento de cada pisado con contexto. */
  window.__pisados = [];
  window.__etiqueta = '';
  setInterval(() => {
    if (!window.__voz.hablando) return;
    const v = [...document.querySelectorAll('video')].find(x => !x.paused && !x.muted && x.volume > 0);
    if (!v) return;
    const ult = window.__pisados[window.__pisados.length - 1];
    if (ult && ult.etiqueta === window.__etiqueta) return;
    const src = (v.currentSrc || (v.querySelector('source') || {}).src || '').split('/').pop();
    window.__pisados.push({ etiqueta: window.__etiqueta, video: src, voz: window.__voz.texto.slice(0, 70) });
  }, 50);
});

await page.goto(url);
await page.waitForTimeout(800);
await page.keyboard.press('Escape').catch(() => {});

const ids = await page.evaluate(() => {
  document.querySelectorAll('[data-slide]').forEach(s => {
    s.removeAttribute('data-require-seen'); s.removeAttribute('data-require-popups');
    s.removeAttribute('data-gate-popup'); s.removeAttribute('data-intro-popup');
    s.removeAttribute('data-require-repaso');
  });
  return [...document.querySelectorAll('[data-slide]')].map(s => s.getAttribute('data-slide'));
});

const etiquetar = (e) => page.evaluate((e) => { window.__etiqueta = e; }, e);
const cerrarTodo = async () => {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(250);
  await page.evaluate(() => { if (window.motor && window.motor.closePopup) try { window.motor.closePopup(); } catch (e) {} });
  await page.waitForTimeout(200);
};
const irA = async (id) => {
  await page.evaluate((x) => {
    const sl = document.querySelector('[data-slide="' + x + '"]');
    window.motor.go([...document.querySelectorAll('[data-slide]')].indexOf(sl));
  }, id);
  await page.waitForTimeout(700);
  await cerrarTodo();
};

/* Qué arranca un video y qué dispara una locución, en la diapositiva
   actual. Se devuelven selectores únicos para poder volver a tocarlos. */
const inventario = () => page.evaluate(() => {
  const sl = document.querySelector('.slide.is-active, [data-slide]:not([hidden])');
  /* ⚠️ Las marcas de la diapositiva ANTERIOR se borran primero. La
     primera versión no lo hacía y el contador vuelve a 0 en cada
     diapositiva, así que `[data-usv="v0"]` encontraba el video de OTRA
     lámina — y el test terminó tocando el video de "fallecimiento por
     ENT" desde la diapositiva de colesterol. */
  document.querySelectorAll('[data-usv]').forEach(x => x.removeAttribute('data-usv'));
  const marcar = (el, k) => { el.setAttribute('data-usv', k); return '[data-usv="' + k + '"]'; };
  let n = 0;
  const videos = [];
  sl.querySelectorAll('[data-inline-video]').forEach(w => {
    const b = w.querySelector('button, .d-shot-hit-play') || w;
    videos.push({ tipo: 'circular', sel: marcar(b, 'v' + (n++)) });
  });
  sl.querySelectorAll('[data-video-play]').forEach(b => videos.push({ tipo: 'reproductor', sel: marcar(b, 'v' + (n++)) }));
  /* …y los que viven DENTRO de un pop-up que se abre desde esta
     diapositiva (kit-base v1.9.124, §7.73; relevo de NOA, 2026-10-07: el ▶
     de cada ficha abre el reproductor). Sin esto, un curso con todos
     sus videos en fichas daba "ningún video arrancó: el test no midió
     nada", y como SÍ había `[data-video-play]` tampoco se inyectaba el
     de respaldo. El clic por código no necesita el pop-up abierto. */
  sl.querySelectorAll('[data-popup-trigger]').forEach(t => {
    const pop = document.querySelector('[data-popup="' + t.getAttribute('data-popup-trigger') + '"]');
    if (!pop) return;
    pop.querySelectorAll('[data-video-play]').forEach(b => {
      if (b.hasAttribute('data-usv')) return;
      videos.push({ tipo: 'reproductor (desde un pop-up)', sel: marcar(b, 'v' + (n++)) });
    });
  });
  const voces = [];
  sl.querySelectorAll('[data-popup-trigger], [data-etapa], [data-hit][data-popup]').forEach(b => {
    if (b.closest('[hidden]')) return;
    voces.push({ tipo: 'pop-up', sel: marcar(b, 'n' + (n++)) });
  });
  return { id: sl.getAttribute('data-slide'), videos, voces,
           fondo: !!sl.querySelector('.d-shot-video') };
});

const arrancarVideo = async (v) => {
  if (v.nativo) {
    await page.evaluate((s) => { const x = document.querySelector(s); if (x) x.play().catch(() => {}); }, v.sel);
    await page.waitForTimeout(900);
    return;
  }
  await page.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); }, v.sel);
  await page.waitForTimeout(900);
};
const dispararVoz = async (n) => {
  if (n.tipo === 'reproducir') {
    /* El ▶ del panel (v1.9.110). Con el video sonando la locución quedó
       cortada, así que el botón muestra ▶: es exactamente el caso "estoy
       mirando el video y aprieto play en la locución". */
    await page.evaluate(() => { const b = document.getElementById('d-narr-toggle'); if (b && !b.disabled) b.click(); });
  } else if (n.tipo === 'repetir') {
    await page.evaluate(() => {
      const b = document.querySelector('[data-loc-repeat], [data-narr-repeat], .d-loc-repeat, button[data-repetir]')
             || [...document.querySelectorAll('button')].find(x => /repetir/i.test(x.textContent));
      if (b) b.click();
    });
  } else {
    await page.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); }, n.sel);
  }
  await page.waitForTimeout(900);
};

const avisos = [];
let pruebas = 0;
let combinaciones = 0;
/* Sin ningún video que el alumno pueda arrancar en todo el curso, se
   agrega uno (ver arriba): un <video> con controles nativos, el camino
   que no pasa por ningún botón del kit. Va a la primera diapositiva que
   tiene algo para narrar, así "Repetir" tiene qué decir. */
let inyectado = null;
const hayVideos = await page.evaluate(() => !!document.querySelector('[data-inline-video], [data-video-play]'));
if (!hayVideos) {
  for (const id of ids) {
    await irA(id);
    const ok = await page.evaluate(() => {
      const sl = document.querySelector('.slide.is-active');
      if (!sl || !window.Narrador || !window.Narrador.textOf(sl)) return false;
      const v = document.createElement('video');
      v.src = 'video/zz-una-sola-voz.mp4'; v.controls = true; v.playsInline = true;
      v.setAttribute('data-usv-inyectado', '');
      v.style.cssText = 'position:absolute;left:10px;top:10px;width:160px;height:90px;z-index:5';
      sl.appendChild(v);
      return true;
    });
    if (ok) { inyectado = id; break; }
  }
  if (!inyectado) {
    await browser.close();
    report('una-sola-voz', ['el curso no tiene videos y ninguna diapositiva tiene texto para narrar: no hay dónde medir.']);
    process.exit(1);
  }
}
for (const id of ids) {
  if (inyectado && id !== inyectado) continue;
  await irA(id);
  const inv = await inventario();
  if (inyectado) inv.videos.push({ tipo: 'nativo (inyectado)', sel: '[data-usv-inyectado]', nativo: true });
  if (!inv.videos.length) continue;
  const voces = inv.voces.concat([{ tipo: 'repetir' }]);
  if (await page.evaluate(() => !!document.getElementById('d-narr-toggle'))) voces.push({ tipo: 'reproducir' });
  for (const v of inv.videos) {
    for (const n of voces) {
      /* 1 · video sonando, después algo que se narra */
      await etiquetar('[' + id + '] video ' + v.tipo + ' → ' + n.tipo);
      await arrancarVideo(v);
      const sonando = await page.evaluate(() => !![...document.querySelectorAll('video')].find(x => !x.paused && !x.muted && x.volume > 0));
      if (!sonando) { avisos.push('[' + id + '] el video ' + v.tipo + ' no arrancó; se saltea esa combinación'); await cerrarTodo(); continue; }
      await dispararVoz(n);
      pruebas++; combinaciones++;
      await cerrarTodo();
      await page.evaluate(() => document.querySelectorAll('video').forEach(x => { try { x.pause(); } catch (e) {} }));
      /* 2 · algo narrándose, después el video */
      await etiquetar('[' + id + '] ' + n.tipo + ' → video ' + v.tipo);
      await dispararVoz(n);
      if (n.tipo === 'pop-up') {
        /* con un pop-up abierto el video de la lámina queda detrás: se
           arranca desde el propio <video>, que es el camino de los
           controles nativos y el que dejaba la voz sonando */
        await page.evaluate(() => { const x = document.querySelector('.slide.is-active video, [data-slide]:not([hidden]) video'); if (x) x.play().catch(() => {}); });
        await page.waitForTimeout(900);
      } else {
        await arrancarVideo(v);
      }
      pruebas++; combinaciones++;
      await cerrarTodo();
      await page.evaluate(() => document.querySelectorAll('video').forEach(x => { try { x.pause(); } catch (e) {} }));
    }
  }
}

/* El caso inverso: los videos de fondo no se tienen que callar al entrar. */
const fondosCallados = [];
for (const id of ids) {
  const tiene = await page.evaluate((x) => !!document.querySelector('[data-slide="' + x + '"] .d-shot-video'), id);
  if (!tiene) continue;
  await etiquetar('[' + id + '] video de fondo');
  await page.evaluate((x) => {
    const sl = document.querySelector('[data-slide="' + x + '"]');
    window.motor.go([...document.querySelectorAll('[data-slide]')].indexOf(sl));
  }, id);
  await page.waitForTimeout(1800);
  const r = await page.evaluate((x) => { const v = document.querySelector('[data-slide="' + x + '"] .d-shot-video');
    return v && v.paused && !v.ended; }, id);
  pruebas++;
  if (r) fondosCallados.push(id);
}

const pisados = await page.evaluate(() => window.__pisados);
await browser.close();

avisos.forEach(a => console.log('  · ' + a));
const fallos = pisados.map(p => p.etiqueta + ': el video `' + p.video + '` sonaba mientras la locución decía "' + p.voz + '…"')
  .concat(fondosCallados.map(id => '[' + id + '] el video de fondo quedó PAUSADO al entrar — la regla de una sola voz no puede callar lo que no compite con nada'))
  .concat(errores.map(e => 'error de página: ' + e));
if (combinaciones === 0) fallos.push('no se pudo probar ninguna combinación video/locución (ningún video arrancó): el test no midió nada.');
console.log(`  ${combinaciones} combinación(es) video/locución en los dos órdenes` + (inyectado ? ` (con un video inyectado en "${inyectado}": el curso no tiene)` : '') + '.');
report('una-sola-voz', fallos);
