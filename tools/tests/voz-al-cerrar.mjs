#!/usr/bin/env node
/* voz-al-cerrar.mjs — kit-base v1.9.135
   ------------------------------------------------------------
   POR QUÉ EXISTE. Reporte del cliente en "Seguridad alimentaria"
   (2026-10-09): *"en algunas diapos, al cerrar el curso la locución
   seguía activa"*. Desde v1.9.98 el narrador callaba en `pagehide`, pero
   su `cancel()` INSISTE con timers (60/180/400ms) porque Chrome a veces
   no obedece el primero —con las voces "Google", que se sintetizan en
   red, es frecuente—. Al irse la página esos timers no corren nunca: si
   el primer `cancel()` caía en la carrera, la voz quedaba sonando sin
   dueño. De ahí el "en algunas": dependía de en qué momento se cerraba.

   CÓMO SE MIDE, sin voces reales (headless no tiene): un motor de voz
   falso TERCO, como el de Chrome en la carrera — el primer `cancel()`
   después de empezar a hablar no le hace nada; obedece al segundo, o si
   está en pausa. Y se mira de forma SÍNCRONA, en el mismo instante del
   evento, porque es todo lo que hay cuando la página se va.

     1. `beforeunload` (llega al EMPEZAR a irse, con la página todavía
        viva) ya manda a callar;
     2. `pagehide`: en el mismo instante el motor queda callado, sin
        esperar a ningún timer;
     3. la pausa que deja el corte no enmudece lo que venga después
        (volver a la pestaña, u otro curso en la misma ventana).
*/
import { report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const fails = [];

const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.addInitScript(() => {
  /* ⚠️ `Object.defineProperty`: `speechSynthesis` es de solo lectura y
     una asignación simple falla en silencio (ver locucion-control). */
  const m = { sp: false, pausado: false, cur: null, cola: [], terco: false, log: [] };
  window.__motor = m;
  function siguiente() {
    if (m.pausado) return;
    const u = m.cola.shift(); m.cur = u || null;
    if (!u) { m.sp = false; return; }
    m.sp = true; m.terco = true; m.log.push('habla');
    setTimeout(() => { if (m.cur !== u) return; m.terco = false; }, 400);
    setTimeout(() => { if (m.cur !== u) return; m.cur = null; m.sp = false; u.onend && u.onend({}); siguiente(); }, 3000);
  }
  const fake = {
    get speaking() { return m.sp; }, get pending() { return m.cola.length > 0; }, get paused() { return m.pausado; },
    speak(u) { m.cola.push(u); if (!m.sp && !m.pausado) siguiente(); },
    cancel() {
      m.log.push('cancel');
      if (m.sp && m.terco && !m.pausado) { m.terco = false; return; }   // la carrera de Chrome
      m.cola = []; const c = m.cur; m.cur = null; m.sp = false; if (c && c.onend) setTimeout(() => c.onend({}), 0);
    },
    pause() { m.log.push('pause'); m.pausado = true; },
    resume() { m.log.push('resume'); m.pausado = false; if (!m.sp) siguiente(); },
    getVoices() { return [{ name: 'Google español', lang: 'es-US', localService: false, default: true }]; },
    addEventListener() {}, removeEventListener() {}, onvoiceschanged: null
  };
  Object.defineProperty(window, 'speechSynthesis', { get: () => fake, configurable: true });
  window.SpeechSynthesisUtterance = function (t) { this.text = t; };
});

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1200);

const r = await page.evaluate(async () => {
  const m = window.__motor, N = window.Narrador;
  if (!N) return { sinNarrador: true };
  if (N.setNarrating) N.setNarrating(true);
  const hablar = async () => { N.speak('Una frase bastante larga para que dure. Y otra más después.', 'other'); await new Promise((r) => setTimeout(r, 120)); };
  const out = {};

  /* 1 · beforeunload */
  await hablar();
  out.hablabaAntes1 = m.sp;
  const n1 = m.log.length;
  window.dispatchEvent(new Event('beforeunload'));
  out.cancelEnBeforeunload = m.log.slice(n1).includes('cancel');
  await new Promise((r) => setTimeout(r, 700));

  /* 2 · pagehide, mirado en el mismo instante */
  m.pausado = false; await hablar();
  out.hablabaAntes2 = m.sp;
  window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: false }));
  out.sigueHablandoTrasPagehide = m.sp;

  /* 3 · lo siguiente vuelve a sonar */
  await new Promise((r) => setTimeout(r, 500));
  N.speak('Otra diapositiva.', 'other');
  await new Promise((r) => setTimeout(r, 300));
  out.hablaDespues = m.sp;
  return out;
});

if (r.sinNarrador) fails.push('el curso no expone window.Narrador');
else {
  if (!r.hablabaAntes1 || !r.hablabaAntes2) fails.push('el narrador falso no llegó a hablar: el test no midió nada (' + JSON.stringify(r) + ')');
  if (!r.cancelEnBeforeunload) {
    fails.push('`beforeunload` no manda a callar la locución: es el único momento en que la página todavía vive y los reintentos ' +
      'de `cancel()` pueden correr (reporte del cliente en "Seguridad alimentaria": la voz seguía al cerrar el curso).');
  }
  if (r.sigueHablandoTrasPagehide) {
    fails.push('tras `pagehide` el motor SIGUE hablando: el primer `cancel()` cayó en la carrera de Chrome y los reintentos ' +
      'con timers no corren cuando la página se va. Hay que callar sin timers (cancelar, pausar y cancelar).');
  }
  if (!r.hablaDespues) {
    fails.push('después del corte al irse, la siguiente locución no suena: la pausa quedó puesta y nadie la levantó ' +
      '(volver a la pestaña u otro curso en la misma ventana quedaba mudo).');
  }
}

await browser.close();
report('voz-al-cerrar', fails);
