import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });

await page.addInitScript(() => {
  function FakeVoice(name, lang) { this.name = name; this.lang = lang; this.default = false; this.localService = true; this.voiceURI = name; }
  const voices = [new FakeVoice('Google español de Argentina', 'es-AR'), new FakeVoice('Google español de Estados Unidos', 'es-US')];
  window.speechSynthesis = window.speechSynthesis || {};
  window.speechSynthesis.getVoices = () => voices;
  window.speechSynthesis.addEventListener = () => {};
  window.speechSynthesis.speak = () => {};
  window.speechSynthesis.cancel = () => {};
});

await page.goto(url);
await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(300);

// Espiar Narrador.speak en vez de ejercitar el motor de voz real: acá
// interesa confirmar que el CABLEADO de los botones llama a
// Narrador.speak(), no que la Web Speech API funcione de punta a
// punta con voces falsas (eso ya se prueba en check-controles-audio.mjs
// con la secuencia de narracionprogreso, y ahí sí con voces reales del
// sandbox cuando existen).
await page.evaluate(() => {
  window.__speakCalls = 0;
  window.Narrador.speak = function (t, k) { window.__speakCalls++; window.__lastText = t; };
});

await page.click('[data-fab-ctl="config"] .d-fab-btn', { force: true });
await page.waitForTimeout(300);

const fieldVisible = await page.evaluate(() => !document.getElementById('d-voice-field').hidden);
const failures = [];
if (!fieldVisible) failures.push('el selector de voz sigue oculto con voces disponibles');

await page.selectOption('#d-voice-select', { index: 1 });
await page.waitForTimeout(100);
let calls = await page.evaluate(() => window.__speakCalls);
if (calls < 1) failures.push('cambiar la voz debería disparar Narrador.speak() (demo)');
const voiceLS = await page.evaluate(() => localStorage.getItem('coto-diapos-voice'));
if (!voiceLS) failures.push('elegir una voz debería persistirla en localStorage');

await page.evaluate(() => { window.__speakCalls = 0; });
await page.click('#d-voice-listen', { force: true });
await page.waitForTimeout(100);
calls = await page.evaluate(() => window.__speakCalls);
if (calls < 1) failures.push('"Escuchar un ejemplo" debería disparar Narrador.speak()');

await page.fill('#d-rate-range', '1.3');
await page.evaluate(() => { document.getElementById('d-rate-range').dispatchEvent(new Event('input')); });
await page.waitForTimeout(500);
const rateVal = await page.evaluate(() => localStorage.getItem('coto-diapos-rate'));
if (rateVal !== '1.3') failures.push('la velocidad no persistió: ' + rateVal);

await page.click('#d-config-reset', { force: true });
await page.waitForTimeout(150);
const afterReset = await page.evaluate(() => ({
  voice: localStorage.getItem('coto-diapos-voice'),
  rate: localStorage.getItem('coto-diapos-rate'),
  selVal: document.getElementById('d-voice-select').value,
  rangeVal: document.getElementById('d-rate-range').value
}));
/* ⚠️ El valor recomendado se LE PREGUNTA al kit, no se escribe acá.
   Este test fijaba un 1.0, y cuando el producto cambió el default a
   1.15 falló por el número sin que nada estuviera roto. Lo que tiene
   que garantizar es que "restablecer" devuelva AL RECOMENDADO y deje
   los dos controles mostrando lo mismo — no cuál es el número.
   (kit-base v1.9.88; ver §7.37, la regla sobre tests que fijan un
   valor que el producto puede decidir cambiar.) */
const reco = await page.evaluate(() => window.Narrador.getRateDefault());
if (afterReset.voice !== null) failures.push('restablecer debería borrar la voz manual: ' + afterReset.voice);
if (parseFloat(afterReset.rate) !== reco) failures.push(`restablecer debería volver la velocidad al valor recomendado (${reco}): ` + afterReset.rate);
if (afterReset.selVal !== '') failures.push('el select debería volver a "automática": ' + afterReset.selVal);
if (parseFloat(afterReset.rangeVal) !== reco) failures.push(`el range debería volver al valor recomendado (${reco}): ` + afterReset.rangeVal);

// Acordeón: una pregunta a la vez.
await page.click('[data-fab-ctl="ayuda"] .d-fab-btn', { force: true });
await page.waitForTimeout(300);
await page.click('.d-fab-acc-q >> nth=0', { force: true });
await page.waitForTimeout(150);
await page.click('.d-fab-acc-q >> nth=2', { force: true });
await page.waitForTimeout(150);
const openCount = await page.evaluate(() => document.querySelectorAll('.d-fab-acc-item.is-open').length);
if (openCount !== 1) failures.push('el acordeón debería dejar una sola pregunta abierta a la vez, hay ' + openCount);

/* ---- ¿y se PUEDE tocar? (kit-base v1.9.98) ----
   FALSO NEGATIVO REAL. Los clicks de arriba van con `{force:true}`, que
   dispara el evento en las coordenadas del elemento aunque esté
   recortado o fuera de pantalla. O sea que este test abría y cerraba
   preguntas INVISIBLES y daba verde.

   Y estaba pasando en los dos cursos terminados. El panel de Ayuda es
   un flex column con `max-height`, y hasta v1.9.97 el scroll se le
   pedía al acordeón: como era el único hijo que se dejaba achicar
   (`min-height:0` contra los `min-height:auto` de sus hermanos), se
   comía TODO el recorte. Medido en el curso generado, bajando el alto
   de ventana: el acordeón va de 136px a 58, a 19, a **0**, con el
   contenido siempre en 140. El relevo lo midió a pantalla completa en
   los dos cursos entregados (0px y 1px, 175px de contenido, 5
   preguntas), que tienen más cosas arriba.

   ⚠️ Por qué se mide el ALTO y no la scrolleabilidad: a 0px de alto el
   acordeón TODAVÍA tiene `overflow:auto` y `scrollHeight > clientHeight`,
   así que preguntarle «¿scrolleás?» contesta que sí. Un contenedor con
   contenido y alto ~0 no se arregla scrolleando: no hay nada que
   scrollear.

   Se admite que la lista quede abajo del pliegue —para eso el panel
   scrollea, y el degradado del pie lo anuncia—; lo que no se admite es
   el alto cero. */
const alcance = await page.evaluate(() => {
  const acc = document.querySelector('.d-fab-acc');
  if (!acc) return null;
  return {
    accH: Math.round(acc.getBoundingClientRect().height),
    accScroll: acc.scrollHeight,
    preguntas: document.querySelectorAll('.d-fab-acc-q').length
  };
});
if (alcance && alcance.preguntas && alcance.accH < 24 && alcance.accScroll > 24) {
  failures.push(`el acordeón de Ayuda tiene ${alcance.preguntas} pregunta(s) ` +
    `(${alcance.accScroll}px de contenido) dentro de una caja de ${alcance.accH}px de alto: ` +
    'está aplastado a cero por sus hermanos del flex, así que no se ve ni se puede tocar. ' +
    'El scroll tiene que estar en el PANEL, no en el acordeón.');
}

// "Volver a ver la introducción": abre el modal Y cierra el flotante.
await page.click('.d-fab-replay', { force: true });
await page.waitForTimeout(300);
const state = await page.evaluate(() => ({
  modalOpen: document.querySelector('[data-popup="instrucciones"]').classList.contains('open'),
  fabPinned: document.querySelector('[data-fab-ctl="ayuda"]').classList.contains('is-open')
}));
if (!state.modalOpen) failures.push('"Volver a ver la introducción" debería abrir el modal de instrucciones');
if (state.fabPinned) failures.push('el flotante de Ayuda debería cerrarse al abrir el modal de instrucciones');

report('fab-config', failures);
await browser.close();
