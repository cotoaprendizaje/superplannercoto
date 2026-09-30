#!/usr/bin/env node
/* locucion-segundos.mjs — kit-base v1.9.92 (§7.40 K32)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El cliente reportó *"no está funcionando la barra
   para adelantar la locución"*. Funcionaba: el problema era que casi
   no se movía. El recorrido eran `total - 1` FRAGMENTOS, y medido
   sobre un curso real, de 22 diapositivas con locución 5 quedaban con
   `max = 0` (el pulgar literalmente no se puede mover) o `max = 1`
   (dos posiciones y nada en el medio), con una mediana de 3 fragmentos
   = 2 pasos de recorrido. Encima el pulgar solo se movía al CAMBIAR de
   fragmento. Una barra así se lee como rota, y para el alumno eso es
   lo mismo que estarlo.

   Ahora el recorrido son SEGUNDOS, que Web Speech API NO da: hay que
   estimarlos (`caracteres / (c-por-segundo × velocidad)`) y calibrar
   la constante sola contra lo que tardó de verdad cada fragmento.

   Eso deja tres cosas que se pueden romper en silencio, y las tres se
   miden acá:

     1 · que el recorrido sea de segundos y no de fragmentos — si
         alguien vuelve a `range.max = p.total - 1`, la barra vuelve a
         tener 1 o 2 posiciones y NADA da error;
     2 · que el pulgar y el reloj corran SOLOS mientras se escucha, sin
         cambiar de fragmento (el reloj de 250ms). Sin eso la barra
         vuelve a moverse "a los saltos", que es el reporte original;
     3 · que la calibración mida de verdad la voz que suena —y que NO
         se calibre con un fragmento CORTADO. Un fragmento que se cortó
         a los 400ms duró menos de lo que le tocaba; usarlo haría creer
         que la voz es 15 veces más rápida y el reloj quedaría inútil.
         Este es el que más fácil se rompe sin que se note: sin el
         guard, el reloj sigue existiendo y sigue moviéndose — solo
         que miente.

   CÓMO SE MIDE. Motor de voz falso con un c/s REAL conocido, que se
   pasa por parámetro: si la calibración midiera cualquier cosa, no
   podría dar 20 con una voz de 20 c/s y 8 con una de 8. El test corre
   las dos.
*/
import { report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const fails = [];

/* Motor de voz falso con c/s conocido. `cortaConOnend` imita a los
   navegadores que disparan `onend` también cuando los cancelan — que
   es justamente el caso que el guard tiene que ignorar. */
async function abrir(cps) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.addInitScript(`window.__CPS = ${cps};`);
  await page.addInitScript(() => {
    let hablando = null;
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, writable: true, value: {
      speaking: false, pending: false, paused: false,
      getVoices: () => [{ name: 'Falsa', lang: 'es-US', voiceURI: 'falsa', default: true, localService: true }],
      speak(u) {
        hablando = u; this.speaking = true;
        const ms = (u.text.length / (window.__CPS * (u.rate || 1))) * 1000;
        window.__durMs = ms;   // lo usa el corte "creíble" del punto 5
        u._t = setTimeout(() => { this.speaking = false; hablando = null; if (u.onend) u.onend({}); }, ms);
      },
      cancel() {
        if (hablando) {
          clearTimeout(hablando._t); const u = hablando; hablando = null; this.speaking = false;
          if (window.__cortaConOnend && u.onend) u.onend({});
        }
        this.speaking = false;
      },
      addEventListener() {}, removeEventListener() {}
    } });
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, writable: true,
      value: function (t) { this.text = t; this.rate = 1; this.onend = null; this.onerror = null; } });
  });
  await page.goto(url);
  await page.waitForTimeout(500);
  return page;
}

/* Texto propio en la diapositiva activa: el test no depende de cuánto
   escriba cada curso, solo del mecanismo del kit. */
async function narrar(page, frases, largo) {
  return page.evaluate(({ frases, largo }) => {
    localStorage.removeItem('coto-diapos-cps');
    const btn = document.getElementById('d-narrate');
    if (btn) btn.hidden = false;
    /* ⚠️ NO la diapositiva ACTIVA: al cargar, la activa es la PORTADA, y
       en los dos cursos terminados la portada es `--bg-video`, que por
       diseño NO narra (`textOf()` devuelve '' para esa clase, §5). O sea
       que este test le agregaba un párrafo a una diapositiva muda,
       `progreso()` quedaba en null desde t=0, `range.max` en "0" — y el
       bloque 3 lo dereferenciaba y REVENTABA el proceso antes de
       `report()`, así que los fallos de los bloques 1 y 2 nunca se
       imprimían. Medido igual en "Prevención cardiovascular" y en
       "Seguridad alimentaria": `TypeError: Cannot read properties of
       null (reading 'segTotal')`.
       Se elige la primera diapositiva que NO sea de video de fondo, que
       es donde este mecanismo tiene sentido. */
    const todas = Array.from(document.querySelectorAll('section[data-slide]'));
    const act = todas.find((s) => !s.classList.contains('d-shot-slide--bg-video')) || todas[0];
    if (!act || !window.Narrador || !window.motor || !window.motor.gotoId) return null;
    const p = document.createElement('p');
    p.textContent = Array.from({ length: frases }, (_, i) =>
      `Frase numero ${i} de prueba, ` + 'con relleno suficiente '.repeat(largo) + 'y punto final.').join(' ');
    act.appendChild(p);
    window.Narrador.setNarrating(true);
    window.motor.gotoId(act.getAttribute('data-slide'));
    return true;
  }, { frases, largo });
}

const leer = (page) => page.evaluate(() => {
  const r = document.getElementById('d-narr-range');
  const p = window.Narrador.progreso();
  return {
    max: parseFloat(r.max), value: parseFloat(r.value), disabled: r.disabled,
    reloj: (document.getElementById('d-narr-time') || {}).textContent,
    total: (document.getElementById('d-narr-total') || {}).textContent,
    index: p && p.index, fragmentos: p && p.total, segTotal: p && p.segTotal
  };
});

/* ---------- 1 · el recorrido es de segundos, y hay reloj ---------- */
const page = await abrir(20);
const cableado = await page.evaluate(() =>
  !!(window.Narrador && window.Narrador.seekSeg && document.getElementById('d-narr-range')));
if (!cableado) {
  report('locucion-segundos', ['el curso no tiene la barra de locución cableada (`#d-narr-range` / `Narrador.seekSeg`)']);
  await browser.close();
  process.exit(process.exitCode || 0);
}
if (!(await narrar(page, 6, 4))) {
  report('locucion-segundos', ['no se pudo arrancar la locución de prueba (`motor.gotoId` / `Narrador.setNarrating`)']);
  await browser.close();
  process.exit(process.exitCode || 0);
}
await page.waitForTimeout(700);

const a = await leer(page);
if (a.disabled) {
  fails.push('con locución en curso la barra sigue `disabled` — el alumno no puede adelantar nada.');
}
if (!(a.max > 5)) {
  fails.push(`el recorrido de la barra es ${a.max}, no segundos. Eso es el bug reportado: ` +
    `con \`max = total - 1\` (acá ${a.fragmentos - 1}) el pulgar tiene una o dos posiciones y la barra parece rota.`);
}
if (a.segTotal && Math.abs(a.max - a.segTotal) > 0.5) {
  fails.push(`\`range.max\` (${a.max}) no es la duración estimada (\`segTotal\` = ${a.segTotal}).`);
}
if (!/^\d+:\d\d$/.test(a.total || '') || a.total === '0:00') {
  fails.push(`el total del reloj (#d-narr-total) dice "${a.total}" — tiene que ser la duración en m:ss.`);
}
if (!/^\d+:\d\d$/.test(a.reloj || '')) {
  fails.push(`el transcurrido del reloj (#d-narr-time) dice "${a.reloj}" — tiene que ser m:ss.`);
}

/* ---------- 2 · el pulgar corre SOLO, sin cambiar de fragmento ---------- */
const b = await leer(page);
await page.waitForTimeout(1500);
const c = await leer(page);
if (c.index === b.index && !(c.value > b.value + 0.5)) {
  fails.push('el pulgar no se movió en 1,5 s DENTRO del mismo fragmento ' +
    `(${b.value} → ${c.value}). Sin el reloj de 250ms la barra solo avanza al cambiar de fragmento, ` +
    'que es exactamente el "no funciona" que reportó el cliente.');
}
if (c.reloj === b.reloj && c.index === b.index) {
  fails.push(`el reloj quedó clavado en "${b.reloj}" mientras se escuchaba el mismo fragmento.`);
}

/* ---------- 3 · arrastrar la barra salta por SEGUNDOS ----------
   Se mide moviendo la barra de verdad y disparando `change`, no
   llamando a `Narrador.seekSeg()` a mano: si el `change` quedara
   cableado al viejo `seek(parseInt(...))` —salto por número de
   fragmento— la pieza estaría y el cable no, y llamar a la API
   directo daría verde igual. Con el recorrido en segundos, un
   `parseInt` de "28.4" leería "28" como ÍNDICE de fragmento: en una
   locución de 6 frases eso se sale del final. */
/* Guard: si acá no hay locución en curso, los bloques de arriba ya
   reportaron por qué. Sin esto, un `progreso()` en null revienta el
   proceso ANTES de `report()` y el diagnóstico se pierde entero — que
   es justo lo que pasaba. */
const vivo = await page.evaluate(() => !!window.Narrador.progreso());
if (!vivo) {
  fails.push('al llegar al bloque 3 no había ninguna locución en curso (`Narrador.progreso()` es null), ' +
    'así que no se pudo medir el arrastre de la barra. Ver los fallos de arriba.');
  report('locucion-segundos', fails);
  await browser.close();
  process.exit(process.exitCode || 0);
}
const salto = await page.evaluate(() => {
  const p = window.Narrador.progreso();
  const objetivo = p.segTotal * 0.55;
  const r = document.getElementById('d-narr-range');
  r.value = String(objetivo);
  r.dispatchEvent(new Event('input', { bubbles: true }));
  r.dispatchEvent(new Event('change', { bubbles: true }));
  const q = window.Narrador.progreso();
  return { objetivo, index: q.index, seg: q.seg, total: q.total, reloj: document.getElementById('d-narr-time').textContent };
});
if (!/^\d+:\d\d$/.test(salto.reloj || '') || salto.reloj === '0:00') {
  fails.push(`arrastrar la barra y soltarla dejó el reloj en "${salto.reloj}": el transcurrido se fue a cero ` +
    'justo en el gesto que la barra en segundos venía a arreglar. Dos causas posibles, las dos medidas acá: ' +
    'el `input` no mueve el reloj mientras se arrastra, o `narracionprogreso` no lleva `seg`/`segTotal` ' +
    '(`seek()` emite uno por vía de `cancel()`, y con el detail incompleto `pintar()` toma la rama de ' +
    '"no hay locución" y escribe 0:00).');
}
if (!(salto.index > 0) || salto.index >= salto.total) {
  fails.push(`soltar la barra en el segundo ${salto.objetivo.toFixed(1)} de ${salto.total} fragmentos ` +
    `quedó en el fragmento ${salto.index}: el salto por segundos no está llegando al motor de voz ` +
    '(¿el `change` sigue cableado al viejo `seek()` por índice de fragmento?).');
}
if (salto.seg > salto.objetivo + 0.5) {
  fails.push(`soltar la barra en el segundo ${salto.objetivo.toFixed(1)} dejó el reloj en ` +
    `${salto.seg.toFixed(1)}s — tiene que caer en el COMIENZO de la frase que contiene ese segundo, nunca después.`);
}
await page.close();

/* ---------- 4 · la calibración mide la voz real ---------- */
async function calibrar(cps) {
  const p = await abrir(cps);
  await narrar(p, 12, 1);
  for (let i = 0; i < 70; i++) {
    await p.waitForTimeout(500);
    const v = await p.evaluate(() => localStorage.getItem('coto-diapos-cps'));
    if (v) { await p.close(); return parseFloat(v); }
  }
  await p.close();
  return null;
}
const cal20 = await calibrar(20);
const cal8 = await calibrar(8);
if (cal20 === null || cal8 === null) {
  fails.push('la locución nunca calibró: `coto-diapos-cps` quedó vacío después de fragmentos terminados ' +
    'de forma natural. Sin calibración el reloj se queda con la constante de fábrica y miente en toda voz ' +
    'que no hable a 13,5 c/s.');
} else {
  if (Math.abs(cal20 - 20) > 3) fails.push(`con una voz de 20 c/s la calibración guardó ${cal20}.`);
  if (Math.abs(cal8 - 8) > 2) fails.push(`con una voz de 8 c/s la calibración guardó ${cal8}.`);
  if (Math.abs(cal20 - cal8) < 3) {
    fails.push(`la calibración guardó casi lo mismo (${cal20} y ${cal8}) para dos voces de velocidad ` +
      'muy distinta: no está midiendo nada.');
  }
}

/* ---------- 5 · un fragmento CORTADO no calibra ----------
   El corte se hace al 60% de lo que el fragmento iba a durar, no "a
   los 400ms". No es un detalle: `calibrarCps` descarta sola cualquier
   medición fuera de 4–40 c/s, así que un corte muy temprano da un
   número absurdo que el rango de cordura rechaza IGUAL — y el test
   daría verde aunque el guard `gen === speakGen` no estuviera.
   MEDIDO: sacando el guard, un corte a los 400ms seguía dando verde.
   Al 60% la medición sale ~1,7× la real: perfectamente creíble, dentro
   del rango, y solo el guard la frena. Este es el corte que de verdad
   envenena el reloj.

   Y `cancel()` del motor falso dispara `onend`, como hacen varios
   navegadores reales: si no lo hiciera, no habría nada que guardar y
   el punto sería verde por ausencia. */
const pc = await abrir(20);
await pc.evaluate(() => { window.__cortaConOnend = true; });
await narrar(pc, 12, 1);
await pc.waitForTimeout(300);
const corte = await pc.evaluate(() => {
  const dur = window.__durMs || 0;
  return new Promise((res) => setTimeout(() => {
    window.Narrador.cancel();
    res(Math.round(dur * 0.6));
  }, Math.max(200, dur * 0.6 - 300)));
});
await pc.waitForTimeout(900);
const sucio = await pc.evaluate(() => localStorage.getItem('coto-diapos-cps'));
if (sucio) {
  fails.push(`un fragmento cortado al 60% de su duración (${corte}ms de lo que iba a durar) calibró igual: ` +
    `guardó ${sucio} c/s para una voz de 20 c/s. Duró menos de lo que le tocaba, así que el reloj queda ` +
    'creyendo que la voz es más rápida de lo que es: la barra sigue moviéndose, pero mintiendo — y ' +
    'encima la mentira se guarda en el dispositivo y sobrevive a la recarga.');
}
await pc.close();

report('locucion-segundos', fails);
await browser.close();
