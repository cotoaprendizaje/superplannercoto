#!/usr/bin/env node
/* locucion-control.mjs — kit-base v1.9.76
   ------------------------------------------------------------
   POR QUÉ EXISTE. Ninguna de estas fallas rompe nada visible ni da un
   solo error de consola, y las tres las reportó un cliente:

     · entrar a una diapositiva y que NO narre (0 locuciones) — y, como
       es `speak()` quien llama a `cancel()`, la locución anterior sigue
       sonando por abajo, así que además queda desfasada;
     · entrar y que narre DOS veces encimadas;
     · volver a prender el botón y que RELEA la diapositiva entera en
       vez de reanudar (§7.18 K9).

   CÓMO SE MIDE, y por qué hace falta un motor de voz falso: en headless
   no hay voces, así que `speechSynthesis.speak()` termina al instante y
   `progreso()` siempre devuelve `terminado:true`. Con eso, el caso
   "silenciar a mitad de la frase" —que es justo el que importa— no
   existe. Acá se reemplaza el motor por uno que tarda 300ms por
   fragmento, y recién entonces se puede medir.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fails = [];

/* Motor de voz falso: 300ms por fragmento. Se instala ANTES de que
   cargue el curso, porque narrador.js lo mira al inicializarse. */
await page.addInitScript(() => {
  let hablando = null;
  /* ⚠️ `Object.defineProperty`, NO `window.speechSynthesis = {...}`
     (kit-base v1.9.95). `speechSynthesis` es un accessor de SOLO LECTURA
     del `Window`, y un `addInitScript` corre en modo sloppy: la
     asignación simple **falla en silencio** —no tira, no avisa— y
     `window.speechSynthesis` sigue siendo el motor real.

     MEDIDO en el mismo Chromium de la suite: después de la asignación,
     `window.speechSynthesis.__falso` da `false`; con `defineProperty`,
     `true`. O sea que este test decía instalar un motor de 300ms por
     fragmento y estaba corriendo contra el motor real, que en headless
     no tiene voces y termina al instante.

     Lo que eso invalidaba es justo el escenario por el que este test
     dice existir —"silenciar a MITAD de la frase"—, que sin una locución
     que dure no existe. Las cuentas de cuántas veces se llamó a
     `Narrador.speak` seguían siendo válidas, así que el test pasaba en
     verde: no medía de menos de forma visible, medía de menos en
     silencio. */
  Object.defineProperty(window, 'speechSynthesis', { configurable: true, writable: true, value: {
    speaking: false, pending: false, paused: false,
    getVoices: () => [{ name: 'Falsa', lang: 'es-US', voiceURI: 'falsa', default: true, localService: true }],
    speak(u) {
      hablando = u; this.speaking = true;
      u._t = setTimeout(() => { this.speaking = false; hablando = null; if (u.onend) u.onend({}); }, 300);
    },
    cancel() { if (hablando) { clearTimeout(hablando._t); hablando = null; } this.speaking = false; },
    addEventListener() {}, removeEventListener() {}
  } });
  /* Mismo motivo: `SpeechSynthesisUtterance` es una propiedad del
     `Window` que conviene tapar igual, para que el motor falso reciba
     objetos que él entienda. */
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, writable: true,
    value: function (t) { this.text = t; this.onend = null; this.onerror = null; } });
});

await page.goto(url);
await page.waitForTimeout(500);

const hay = await page.evaluate(() =>
  !!(window.Narrador && window.motor && document.getElementById('d-narrate')));
if (!hay) {
  report('locucion-control', ['el curso no tiene locución cableada (`#d-narrate` / `Narrador` / `motor`)']);
  await browser.close();
  process.exit(process.exitCode || 0);
}

await page.evaluate(() => {
  document.getElementById('d-narrate').hidden = false;
  window.__speak = []; window.__seek = [];
  const os = Narrador.speak, ok = Narrador.seek;
  Narrador.speak = function (t) { window.__speak.push(String(t || '').slice(0, 30)); return os.apply(this, arguments); };
  Narrador.seek = function (i) { window.__seek.push(i); return ok.apply(this, arguments); };
  Narrador.setNarrating(true);
});

const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));

/* 1 · Una locución por diapositiva, exactamente. 0 = muda; 2 = encimadas. */
for (const id of ids.slice(1)) {
  await page.evaluate(() => { window.__speak = []; });
  const fue = await page.evaluate((s) => {
    if (!window.motor.gotoId) return false;
    window.motor.gotoId(s); return true;
  }, id);
  if (!fue) continue;
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => window.__speak);
  const esVideo = await page.evaluate((s) =>
    !!document.querySelector(`[data-slide="${s}"]`)?.classList.contains('d-shot-slide--bg-video'), id);
  if (esVideo) continue;                      // por diseño no narra (§5)
  if (r.length === 0) {
    fails.push(`"${id}": entrar no disparó NINGUNA locución. Además de quedar muda, la locución ` +
      'de la diapositiva anterior sigue sonando por abajo, porque es `speak()` quien llama a `cancel()`.');
  } else if (r.length > 1) {
    fails.push(`"${id}": entrar disparó ${r.length} locuciones encimadas (${r.join(' | ')}).`);
  }
}

/* 2 · Volver a prender REANUDA, no relee (§7.18 K9). */
await page.evaluate(() => { window.__speak = []; window.__seek = []; });
await page.click('#d-narrate');                        // apagar a mitad
await page.evaluate(() => { window.__speak = []; window.__seek = []; });
await page.click('#d-narrate');                        // prender
await page.waitForTimeout(200);
const reanuda = await page.evaluate(() => ({ speak: window.__speak, seek: window.__seek }));
if (reanuda.speak.length && !reanuda.seek.length) {
  fails.push('volver a prender la locución RELEE la diapositiva desde el principio en vez de ' +
    'reanudar donde se cortó (§7.18 K9). En una diapositiva larga es volver a escuchar todo.');
}

/* 3 · Tras navegar en silencio, prender lee LA QUE ESTÁ EN PANTALLA. */
await page.click('#d-narrate');                        // apagar
await page.evaluate(() => { if (window.motor) window.motor._advance(1); });
await page.waitForTimeout(300);
await page.evaluate(() => { window.__speak = []; });
await page.click('#d-narrate');                        // prender
await page.waitForTimeout(300);
const tras = await page.evaluate(() => {
  const cur = window.motor.current();
  const esperado = (window.Narrador.textOf(cur) || '').slice(0, 30);
  return { dijo: window.__speak, esperado };
});
if (tras.dijo.length && tras.esperado && !tras.dijo.some((t) => t.slice(0, 20) === tras.esperado.slice(0, 20))) {
  fails.push('después de navegar con la locución apagada, al prenderla lee una diapositiva que ' +
    `no es la que está en pantalla (dijo "${tras.dijo[0]}", se esperaba "${tras.esperado}").`);
}

/* ---- El cierre: pasar al resumen corta la voz (kit-base v1.9.123, §7.72) ----
   Reporte del cliente en "Seguridad de la información" (A17): en la
   diapositiva final, "Siguiente" muestra el resumen y la locución de la
   felicitación seguía sonando. El cambio de paso es DENTRO de la misma
   diapositiva —no hay `slidechange`, que es lo que corta la voz— y
   `mostrarResumen()` no la cortaba. Se mide lo que importa: si después del
   cambio de paso el motor de voz sigue diciendo la frase de ANTES (una
   larga, de muchos fragmentos de 300ms). Y al volver con "Anterior", igual. */
{
  const hay = await page.evaluate(() => !!document.querySelector('[data-slide="cierre"] [data-cierre-step="summary"]'));
  const r = !hay ? null : await page.evaluate(async () => {
    const espera = (ms) => new Promise((res) => setTimeout(res, ms));
    const sl = [...document.querySelectorAll('[data-slide]')];
    window.motor.go(sl.findIndex((s) => s.getAttribute('data-slide') === 'cierre'), true);
    await espera(600);
    const ss = window.speechSynthesis;
    const dichos = [];
    const orig = ss.speak.bind(ss);
    ss.speak = (u) => { dichos.push(String(u.text || '')); return orig(u); };
    const LARGA = Array.from({ length: 12 }, (_, k) => `Frase de la felicitación número ${k + 1}.`).join(' ');
    const sigueDiciendo = async () => { const n = dichos.length; await espera(900); return dichos.slice(n).some((t) => /felicitación número/.test(t)); };
    window.Narrador.speak(LARGA, 'slide');
    await espera(350);
    document.dispatchEvent(new CustomEvent('navcta', { detail: { id: 'cierre' } }));
    await espera(50);
    const visible = !document.querySelector('[data-cierre-step="summary"]').hidden;
    const alResumen = await sigueDiciendo();
    window.Narrador.speak(LARGA, 'slide');
    await espera(350);
    const prev = document.querySelector('[data-nav="prev"]');
    if (prev) prev.click();
    await espera(50);
    const alVolver = await sigueDiciendo();
    ss.speak = orig;
    return { visible, alResumen, alVolver };
  });
  if (r && r.visible && r.alResumen) {
    fails.push('en el cierre, pasar al resumen no cortó la voz: la locución de la felicitación siguió sonando ' +
      'sobre una pantalla que ya no está (es un cambio de paso, no de diapositiva).');
  }
  if (r && r.visible && r.alVolver) {
    fails.push('en el cierre, volver del resumen con "Anterior" no cortó la voz que estaba sonando.');
  }
}

report('locucion-control', fails);
await browser.close();
