/* aviso-listo.mjs — kit-base v1.9.127 (§7.76)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El tablero "Avisos que aparecen solos" del canvas del
   rediseño tiene cinco avisos; el kit tenía cuatro. Faltaba "¡Listo! Ya
   podés seguir", que sale al completar lo que la pantalla pedía (el
   alumno ve brillar "Siguiente" pero nada le dice por qué). Lo dispara
   `gateabierto`, que el motor emite en el mismo instante del brillo, y
   lo dice `initGateHints` (coto-ui.js). Si el evento deja de salir o el
   oyente se pierde, el aviso desaparece sin un error.
   Y el panel de Locución del canvas dice "1,05x": con coma, como se
   escribe en castellano, no "1.05x".

   QUÉ HACE, en un curso real:
     1 · Busca una diapositiva con gate de pop-ups (`[data-popup-trigger]`
         adentro que traba "Siguiente"), abre y cierra cada uno, y exige
         el aviso en tono "ok" con "¡Listo! Ya podés seguir".
     2 · Si el curso tiene el atajo de velocidad o el de Ajustes, exige la
         coma en los dos.
   Un curso sin diapositivas con gate de pop-ups no tiene nada que revisar
   en el punto 1. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];
const ctx = await browser.newContext({ viewport: { width: 1280, height: 760 } });
const page = await ctx.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push(String(e)));
await page.goto(url);
await page.waitForTimeout(800);
await page.keyboard.press('Escape').catch(() => {});

/* 1 · La primera diapositiva que traba "Siguiente" y se destraba abriendo
   sus pop-ups. */
const slide = await page.evaluate(() => {
  const m = window.motor;
  if (!m || typeof m.canAdvance !== 'function') return null;
  for (let k = 0; k < m.slides.length; k++) {
    const s = m.slides[k];
    const trig = s.querySelectorAll('[data-popup-trigger]');
    if (!trig.length || s.hasAttribute('data-gate-popup')) continue;
    if (m.canAdvance(s)) continue;
    return s.getAttribute('data-slide');
  }
  return null;
});
if (!slide) {
  console.log('  · el curso no tiene diapositivas con gate de pop-ups: nada que revisar en el punto 1.');
} else {
  await page.evaluate((id) => { const m = window.motor; m.go(m.slides.findIndex((s) => s.getAttribute('data-slide') === id), true); }, slide);
  await page.waitForTimeout(500);
  await page.evaluate(() => window.motor.closePopup && window.motor.closePopup());
  /* Se escucha el aviso desde el principio: el "+N" de cada ficha y el
     "¡Listo!" usan el mismo cartel, y el de puntos dura 2,2 s. */
  await page.evaluate(() => {
    window.__avisos = [];
    const ver = () => { const t = document.querySelector('.d-award-toast.show'); if (t) { const x = t.className + '|' + t.textContent; if (window.__avisos[window.__avisos.length - 1] !== x) window.__avisos.push(x); } };
    new MutationObserver(ver).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  });
  const ids = await page.evaluate((id) => [...new Set([...document.querySelectorAll(`[data-slide="${id}"] [data-popup-trigger]`)].map((t) => t.getAttribute('data-popup-trigger')))], slide);
  for (const pid of ids) {
    await page.evaluate((pid) => {
      const t = document.querySelector(`[data-slide]:not([hidden]) [data-popup-trigger="${pid}"]`);
      if (t) t.click();
    }, pid);
    await page.waitForTimeout(250);
    await page.evaluate(() => window.motor.closePopup && window.motor.closePopup());
    await page.waitForTimeout(150);
    const libre = await page.evaluate(() => window.motor.canAdvance(window.motor.current()));
    if (libre) break;
  }
  const libre = await page.evaluate(() => window.motor.canAdvance(window.motor.current()));
  if (!libre) console.log(`  · "${slide}" no se destrabó abriendo sus pop-ups (gate propio del curso): nada que revisar en el punto 1.`);
  else {
    await page.waitForTimeout(4500);
    const avisos = await page.evaluate(() => window.__avisos);
    const listo = avisos.find((a) => a.includes('¡Listo! Ya podés seguir'));
    if (!listo) fallos.push(`en "${slide}", al completar los pop-ups no salió "¡Listo! Ya podés seguir" (avisos vistos: ${avisos.map((a) => a.split('|')[1]).join(' / ') || 'ninguno'}).`);
    else if (!/d-toast--ok/.test(listo)) fallos.push(`"¡Listo!" salió sin el tono verde (clase: ${listo.split('|')[0]}).`);
    const i = avisos.indexOf(listo);
    if (listo && avisos.slice(i + 1).some((a) => /d-toast--pts/.test(a))) fallos.push('"¡Listo!" salió ANTES que el "+N" de la última ficha: lo tiene que esperar.');
  }
}

/* 2 · La velocidad, con coma. */
const vel = await page.evaluate(() => { const v = document.getElementById('d-narr-rate-val'); const c = v && v.closest('.d-narr-rate'); return v && c && !c.hidden ? v.textContent : null; });
if (vel != null && !/^\d,\d\dx$/.test(vel)) fallos.push(`el atajo de velocidad dice "${vel}": tiene que ir con coma ("1,05x"), como en el canvas.`);
const velCfg = await page.evaluate(() => { const v = document.getElementById('d-rate-value'); const c = document.getElementById('d-rate-field'); return v && c && !c.hidden ? v.textContent : null; });
if (velCfg != null && !/^\d,\d\dx/.test(velCfg)) fallos.push(`Ajustes dice la velocidad "${velCfg}": con coma, igual que el panel de Locución.`);

if (errores.length) fallos.push('errores en consola: ' + errores.slice(0, 3).join(' | '));
await browser.close();
report('aviso-listo', fallos);
