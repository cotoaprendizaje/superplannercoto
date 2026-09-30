/* audio-estado — el ícono de "Sonido" no puede contradecir al audio real.
   kit-base v1.9.100.

   Nace de un reporte de iPad vertical: *"en la portada el ícono de
   sonido aparece tachado, pero la música se escucha igual"*. Las dos
   mitades eran ciertas al mismo tiempo, porque había dos dueños del
   mismo dato: el ícono se dibuja desde `localStorage['coto-diapos-mute']`
   (coto-player.js) y el chip de gesto de la portada hacía
   `video.muted = false` a secas (coto-media.js), sin mirar esa marca ni
   avisarle a nadie.

   El camino reproducible —el que este test recorre— es el del alumno
   que tiene el chip a la vista (mute apagado, iOS bloqueando el
   autoplay con sonido), silencia el curso desde el panel de "Sonido", y
   entonces toca el chip. Lo que se exige es lo único que importa: que
   ícono y audio digan lo mismo, y que digan lo correcto — el que toca
   "Tocá para escuchar" está pidiendo sonido, así que el resultado
   esperado es audio ENCENDIDO, no un botón que no hace nada.

   ⚠️ SE ARMA SU PROPIO VIDEO DE FONDO (kit-base v1.9.100, al subirlo al
   kit). La versión que llegó del curso, en un curso sin portada
   `--bg-video`, anotaba "no se pudo probar el tap" y daba ✓ — el mismo
   verde por ausencia que su propio comentario de más abajo denuncia.
   Contra un curso recién generado habría dado verde SIEMPRE. Ahora, si
   la portada no es video de fondo, la vuelve una (reescribe el
   index.html servido) y sirve un webm REAL fabricado con MediaRecorder
   en lugar del .mp4, igual que `reproductor-video`. */
import { chromium, devices } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';
import fs from 'fs';
import path from 'path';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

/* ---- un webm real (el mismo archivo que usa reproductor-video) ---- */
const ARCHIVO = path.join(process.env.TMPDIR || '/tmp', 'coto-prueba-video.webm');
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

/* iPad en HORIZONTAL a propósito, aunque el reporte sea de vertical: en
   vertical el kit tapa el curso con el aviso "Girá tu dispositivo", y
   `attempt()` no arranca ningún video mientras el curso está tapado —
   así que el chip no llega a aparecer y no hay nada que tocar (medido:
   chipModo='inicio' pero chipVisible=false). El desfasaje que se prueba
   acá no es de orientación: es del mute global contra el audio real. */
const ctx = await browser.newContext({ ...devices['iPad (gen 7) landscape'] });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => {
  if (m.type() !== 'error') return;
  const u = (m.location && m.location().url) || '';
  if (!/favicon\.ico$/.test(u)) errors.push(m.text() + (u ? '  ← ' + u : ''));
});

await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/webm', body: CUERPO }));
/* Si la portada no es video de fondo, se la vuelve una en el HTML
   servido: así el test ejercita el mecanismo del kit en cualquier curso. */
let inyectado = false;
await page.route(u => /\/(index\.html)?$/.test(new URL(u).pathname) || /index\.html$/.test(u.toString()), async (r) => {
  const res = await r.fetch();
  let html = await res.text();
  if (!/d-shot-slide--bg-video/.test(html)) {
    const re = /(<section\b[^>]*data-slide="([^"]+)"[^>]*)>/;
    const m = html.match(re);
    if (m) {
      inyectado = true;
      let tag = m[1];
      tag = /class="/.test(tag) ? tag.replace(/class="/, 'class="d-shot-slide d-shot-slide--bg-video ') : tag + ' class="d-shot-slide d-shot-slide--bg-video"';
      html = html.replace(m[0], tag + '>\n' +
        '<div class="d-shot"><video class="d-shot-video" playsinline preload="auto">' +
        '<source src="video/prueba-audio-estado.mp4" type="video/mp4"></video>' +
        '<button type="button" class="d-shot-video-tap" hidden></button></div>');
    }
  }
  await r.fulfill({ response: res, body: html, headers: { ...res.headers(), 'content-type': 'text/html; charset=utf-8' } });
});

/* Se emula la regla de iOS: `play()` con sonido se rechaza si no viene
   de un gesto. Se emula acá en vez de confiar en la política del
   navegador de prueba porque Chromium headless CONCEDE el autoplay con
   sonido — y entonces el chip de gesto, que es el control que este test
   necesita tocar, no aparece nunca y el test pasaba sin haber probado
   nada (medido: la primera versión daba ✓ con la nota "no se pudo
   probar el tap"). Es la misma regla que motivó el reintento mudo de
   coto-media.js, escrita explícita. */
await page.addInitScript(() => {
  try { localStorage.setItem('coto-diapos-mute', '0'); } catch (e) {}
  var play = HTMLMediaElement.prototype.play;
  var gesto = false;
  ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'].forEach(function (t) {
    document.addEventListener(t, function () { gesto = true; }, true);
  });
  HTMLMediaElement.prototype.play = function () {
    if (!this.muted && this.volume > 0 && !gesto) {
      return Promise.reject(new DOMException('NotAllowedError', 'NotAllowedError'));
    }
    return play.apply(this, arguments);
  };
});
await page.goto(url);
await page.waitForTimeout(900);
if (inyectado) {
  /* El boilerplate trae `initBgVideos()` comentado: un curso sin video
     de fondo no lo llama. Se llama acá, una vez, y se vuelve a entrar a
     la primera diapositiva para que corra su `sync()`. */
  await page.evaluate(() => {
    if (window.initBgVideos) window.initBgVideos();
    const s = document.querySelector('[data-slide]');
    if (window.motor && s) { window.motor.gotoId(s.getAttribute('data-slide')); }
  });
}
await page.waitForTimeout(1600);

const SEL_ACT = '.d-slide.is-active, [data-slide].is-active';
const SEL_CHIP = SEL_ACT.split(', ').map(s => s + ' .d-shot-video-tap').join(', ');

function leer() {
  return page.evaluate(() => {
    const btn = document.getElementById('d-sound');
    const act = document.querySelector('.d-slide.is-active, [data-slide].is-active');
    const vid = act ? act.querySelector('video') : null;
    const chip = act ? act.querySelector('.d-shot-video-tap') : null;
    return {
      hayBtn: !!btn,
      tachado: btn ? btn.classList.contains('is-muted') : null,
      marca: (() => { try { return localStorage.getItem('coto-diapos-mute'); } catch (e) { return null; } })(),
      hayVideo: !!vid,
      mudo: vid ? (vid.muted || vid.volume === 0) : null,
      corriendo: vid ? !vid.paused : null,
      chipVisible: !!(chip && !chip.hidden && chip.getBoundingClientRect().width > 0),
      chipModo: chip ? chip.getAttribute('data-modo') : null
    };
  });
}

const a = await leer();
if (!a.hayBtn) fallos.push('no hay #d-sound en el curso');

/* Sin chip a la vista no hay nada que probar, y eso ahora ES un fallo:
   el video de fondo está (propio o inyectado) y la regla de iOS está
   emulada, así que el chip TIENE que aparecer. */
if (!a.chipVisible) {
  fallos.push('el chip de gesto no apareció en la portada con video de fondo y el autoplay con sonido bloqueado' +
    ' (chipModo=' + a.chipModo + ', hayVideo=' + a.hayVideo + ', corriendo=' + a.corriendo + ')');
} else if (a.chipModo !== 'sonido' && a.chipModo !== 'inicio') {
  fallos.push('el chip apareció en modo "' + a.chipModo + '": tendría que ofrecer sonido');
} else {
  // El alumno silencia el curso desde el panel, con el chip a la vista.
  await page.evaluate(() => { document.getElementById('d-vol-mute-btn').click(); });
  await page.waitForTimeout(250);
  const b = await leer();
  if (b.marca !== '1') fallos.push('el botón de mute del panel no dejó la marca puesta (quedó "' + b.marca + '")');
  if (b.tachado !== true) fallos.push('curso silenciado y el ícono de Sonido no quedó tachado');
  if (b.hayVideo && b.corriendo && b.mudo === false) {
    fallos.push('curso silenciado y el video de la diapositiva activa sigue con sonido');
  }

  // Y ahora pide sonido con el chip.
  /* `force: true`: el chip de la portada late (animación de
     `data-modo="inicio"`, coto-media.css) y Playwright no lo considera
     nunca "estable" — reintenta 30s y se cae. El elemento está visible
     y habilitado, que es lo que importa. */
  await page.click(SEL_CHIP, { force: true });
  await page.waitForTimeout(700);
  const c = await leer();
  if (c.tachado === true && c.mudo === false) {
    fallos.push('el ícono quedó tachado y el video suena: ícono y audio se contradicen'
      + ' (es el reporte exacto del cliente)');
  }
  if (c.tachado === true) fallos.push('el tap pidió sonido y el ícono quedó tachado');
  if (c.marca === '1') fallos.push('el tap pidió sonido y la marca de mute global quedó puesta');
  if (c.mudo === true) fallos.push('el tap pidió sonido y el video quedó mudo');
}

await browser.close();
report('audio-estado', fallos, errors);
