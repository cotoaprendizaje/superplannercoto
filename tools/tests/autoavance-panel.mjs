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

report('autoavance-panel', fallos);
