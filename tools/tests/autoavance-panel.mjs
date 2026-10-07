/* autoavance-panel.mjs — el video de fondo de una diapositiva
   `[data-autoadvance]` no le cierra un panel abierto al alumno
   (kit-base v1.9.120, relevo de "Seguridad de la información",
   2026-10-06).

   BUG REAL, en todo curso con auto-avance: al terminar el video,
   `initBgVideos` llamaba a `motor._advance(1)` sin mirar nada, y el motor
   cierra todo pop-up al navegar. El alumno que leía el Glosario o el
   Índice se quedaba sin el panel a mitad de lectura. Medido en el curso
   con un video de 6 s: a los 6 s, "introduccion" y el panel cerrado.

   El test toma la primera diapositiva con video de fondo; si ninguna es
   `[data-autoadvance]`, le pone el atributo ANTES de que arranque el
   curso (así `initBgVideos` la engancha como a una real). Va a ella,
   abre un pop-up, simula el fin del video (`ended`) y exige:
     · que siga en la diapositiva y con el pop-up abierto;
     · que al cerrarlo avance sola a la siguiente;
     · y, sin pop-up, que avance enseguida (el auto-avance sigue andando). */
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { irASlide, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];

const marcar = () => {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.d-shot-slide--bg-video[data-autoadvance] video.d-shot-video')) return;
    const v = document.querySelector('.d-shot-slide--bg-video video.d-shot-video');
    const s = v && v.closest('[data-slide]');
    if (s) { s.setAttribute('data-autoadvance', ''); s.setAttribute('data-zz-auto', ''); }
  }, true);
};

async function preparar() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.addInitScript(marcar);
  await page.goto(url);
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape').catch(() => {});
  const info = await page.evaluate(() => {
    const v = document.querySelector('.d-shot-slide--bg-video[data-autoadvance] video.d-shot-video');
    const s = v && v.closest('[data-slide]');
    const slides = window.motor ? window.motor.slides : [];
    const i = s ? Array.prototype.indexOf.call(slides, s) : -1;
    const pop = document.querySelector('[data-popup]');
    return { id: s && s.getAttribute('data-slide'), siguiente: i >= 0 && slides[i + 1] ? slides[i + 1].getAttribute('data-slide') : null,
      popup: pop && pop.getAttribute('data-popup') };
  });
  return { browser, page, errors, info };
}

const fin = () => {
  const v = window.motor.current().querySelector('video.d-shot-video');
  v.dispatchEvent(new Event('ended'));
};
const donde = () => ({ slide: window.motor.current().getAttribute('data-slide'),
  popup: window.motor.openPopup ? window.motor.openPopup.getAttribute('data-popup') : null });

/* 1 · con un pop-up abierto */
{
  const { browser, page, errors, info } = await preparar();
  if (!info.id) {
    console.log('  · el curso no tiene ninguna diapositiva con video de fondo: nada que revisar.');
  } else if (!info.siguiente) {
    console.log(`  · "${info.id}" es la última diapositiva: no hay a dónde avanzar.`);
  } else if (!info.popup) {
    console.log('  · el curso no tiene ningún pop-up: nada que pueda quedar abierto.');
  } else {
    await irASlide(page, info.id);
    await page.waitForTimeout(500);
    await page.evaluate((id) => window.motor.showPopup(id), info.popup);
    await page.waitForTimeout(300);
    await page.evaluate(fin);
    await page.waitForTimeout(500);
    const a = await page.evaluate(donde);
    if (a.slide !== info.id || a.popup !== info.popup) {
      fallos.push(`con "${info.popup}" abierto, al terminar el video de "${info.id}" el curso quedó en "${a.slide}" con ` +
        `${a.popup ? `"${a.popup}"` : 'ningún pop-up'} abierto: el auto-avance le cerró el panel al alumno a mitad de lectura.`);
    } else {
      await page.evaluate(() => window.motor.closePopup());
      await page.waitForTimeout(600);
      const b = await page.evaluate(donde);
      if (b.slide !== info.siguiente) {
        fallos.push(`cerrado el pop-up después de que terminó el video, el curso quedó en "${b.slide}" y tenía que avanzar a "${info.siguiente}".`);
      }
    }
  }
  if (errors.length) fallos.push(...errors.map((e) => 'error de consola: ' + e));
  await browser.close();

  /* 2 · sin pop-up: el auto-avance de siempre */
  if (info.id && info.siguiente) {
    const r = await preparar();
    await irASlide(r.page, info.id);
    await r.page.waitForTimeout(500);
    await r.page.evaluate(fin);
    await r.page.waitForTimeout(600);
    const c = await r.page.evaluate(donde);
    if (c.slide !== info.siguiente) {
      fallos.push(`sin ningún pop-up abierto, al terminar el video de "${info.id}" el curso quedó en "${c.slide}": el auto-avance dejó de andar.`);
    }
    if (r.errors.length) fallos.push(...r.errors.map((e) => 'error de consola: ' + e));
    await r.browser.close();
  }
}

/* ---- 3 · el video de fondo VUELVE a andar al cerrar el panel ----
   (kit-base v1.9.123, §7.72; NOA punto N y "Seguridad de la información"
   A16, el mismo día). "Una sola voz" pausa el video audible cuando el
   panel empieza a narrar, y un video de fondo no tiene botón de play: se
   quedaba clavado. Hace falta un video que suene de verdad: el webm con
   audio que fabrica `una-sola-voz` (se fabrica acá si no está), servido en
   lugar de los .mp4. */
{
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const VIDEO_PRUEBA = path.join(process.env.TMPDIR || '/tmp', 'coto-prueba-video-audio.webm');
  if (!fs.existsSync(VIDEO_PRUEBA)) {
    const p0 = await browser.newPage();
    await p0.setContent('<canvas width="160" height="160"></canvas>');
    const b64 = await p0.evaluate(async () => {
      const cv = document.querySelector('canvas'), cx = cv.getContext('2d');
      const ac = new AudioContext();
      const osc = ac.createOscillator(); osc.frequency.value = 440;
      const dst = ac.createMediaStreamDestination(); osc.connect(dst); osc.start();
      const stream = new MediaStream([...cv.captureStream(25).getVideoTracks(), ...dst.stream.getAudioTracks()]);
      const rec = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const partes = []; rec.ondataavailable = (e) => partes.push(e.data);
      let t = 0; const iv = setInterval(() => { cx.fillStyle = 'hsl(' + (t * 9 % 360) + ',60%,45%)'; cx.fillRect(0, 0, 160, 160); t++; }, 40);
      rec.start(); await new Promise((r) => setTimeout(r, 8000)); rec.stop();
      await new Promise((r) => { rec.onstop = r; }); clearInterval(iv);
      const buf = new Uint8Array(await new Blob(partes, { type: 'video/webm' }).arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return btoa(s);
    });
    fs.writeFileSync(VIDEO_PRUEBA, Buffer.from(b64, 'base64'));
    await p0.close();
  }
  const VIDEO = fs.readFileSync(VIDEO_PRUEBA);
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  await ctx.route('**/*.mp4', (r) => r.fulfill({ status: 200, contentType: 'video/webm', body: VIDEO }));
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape').catch(() => {});
  const info = await page.evaluate(() => {
    const v = document.querySelector('.d-shot-slide--bg-video video.d-shot-video');
    const pop = document.querySelector('[data-popup]:not([data-popup="video-player"])');
    return { id: v && v.closest('[data-slide]').getAttribute('data-slide'), popup: pop && pop.getAttribute('data-popup') };
  });
  if (info.id && info.popup) {
    await irASlide(page, info.id);
    await page.waitForTimeout(600);
    const r = await page.evaluate(async (popId) => {
      const espera = (ms) => new Promise((res) => setTimeout(res, ms));
      const v = window.motor.current().querySelector('video.d-shot-video');
      v.removeAttribute('data-autoadvance'); v.loop = true;
      v.muted = false; v.volume = 1;
      try { await v.play(); } catch (e) { return { no: 'el video de prueba no arrancó: ' + e.message }; }
      await espera(400);
      if (v.paused) return { no: 'el video de prueba no quedó andando' };
      window.motor.showPopup(popId);
      await espera(150);
      /* La locución del panel: es lo que pausa el video ("una sola voz"). */
      if (window.Narrador && window.Narrador.speak) window.Narrador.speak('Texto del panel de prueba.', 'popup');
      await espera(300);
      const pausadoConPanel = v.paused;
      window.motor.closePopup();
      await espera(900);
      return { pausadoConPanel, andaDespues: !v.paused };
    }, info.popup);
    if (r.no) console.log('  · ' + r.no + ': no se pudo medir la reanudación.');
    else if (!r.pausadoConPanel) console.log('  · la locución del panel no pausó el video (¿voz apagada?): no hay reanudación que medir.');
    else if (!r.andaDespues) {
      fallos.push(`en "${info.id}", el video de fondo que estaba andando quedó PAUSADO después de cerrar "${info.popup}": ` +
        'la locución del panel lo calló ("una sola voz") y nadie lo volvió a arrancar. Un video de fondo no tiene botón de play.');
    }
  }
  await browser.close();
}

report('autoavance-panel', fallos);
