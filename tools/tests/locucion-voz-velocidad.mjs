/* check-locucion-voz-velocidad — dos reglas explícitas del cliente:

   1 · La voz se elige por CERCANÍA al español rioplatense/latino:
       es-AR → es-419 → es-US → es-UY → es-CL → es-MX → cualquier otra
       latina → y recién al final es-ES (España). Ninguna preferencia
       por dispositivo puede saltearse esta cadena (antes había un
       atajo para tablet que forzaba Paulina/Mónica y hacía que en un
       iPad no se llegara NUNCA a la voz argentina).

   2 · La velocidad base es 1.0x para TODA voz. Antes variaba
       (1.22 / 1.15 / 1.0) según qué voz tocara, así que la misma
       locución corría a distinta velocidad según el dispositivo.

   Se prueba inyectando catálogos de voces falsos con
   `speechSynthesis.getVoices`, porque el catálogo real depende del
   paquete de idioma de cada equipo y no se puede reproducir acá. Lo
   que se verifica es la DECISIÓN del código, que es lo nuestro. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
/* Se juntan los ritmos de todos los casos para el chequeo de coherencia
   del final: la garantía real es que no diverjan entre sí. */
const ritmos = [];
/* El recomendado se lee del kit UNA vez, en la primera página que se
   abre — así el test no fija un número que el producto puede mover. */
let recomendado = null;

const CASOS = [
  /* ⚠️ Los casos de iPad van con `tactil: true` — NO es decorativo.
     El atajo que se sacó estaba detrás de `matchMedia('(pointer:coarse)')`,
     así que en un contexto de escritorio no se dispara y el test pasa
     igual con el bug puesto. Se verificó: reintroduciendo el atajo, sin
     contexto táctil el test daba verde. Toda regresión de "esto pasa
     solo en tablet" necesita un contexto táctil de verdad. */
  { nombre: 'iPad con voces típicas de iOS',
    tactil: true,
    voces: [['Mónica', 'es-ES'], ['Paulina', 'es-MX'], ['Diego', 'es-AR'], ['Jorge', 'es-ES']],
    espera: 'Diego' },
  { nombre: 'iPad sin voz argentina',
    tactil: true,
    voces: [['Mónica', 'es-ES'], ['Paulina', 'es-MX']],
    espera: 'Paulina' },
  { nombre: 'iPad: España no le gana a una latina',
    tactil: true,
    voces: [['Mónica', 'es-ES'], ['Jorge', 'es-ES'], ['español (México)', 'es-MX']],
    espera: 'español (México)' },
  { nombre: 'solo voces de España (último recurso)',
    voces: [['Jorge', 'es-ES'], ['Mónica', 'es-ES']],
    espera: 'Mónica' },
  { nombre: 'escritorio con Google es-US',
    voces: [['Google español', 'es-ES'], ['Google español de Estados Unidos', 'es-US']],
    espera: 'Google español de Estados Unidos' },
  { nombre: 'España primera en la lista, pero hay latina',
    voces: [['Mónica', 'es-ES'], ['español (México)', 'es-MX']],
    espera: 'español (México)' },
  { nombre: 'dos es-AR: gana la mejorada',
    voces: [['Diego', 'es-AR', 'com.apple.voice.compact.es-AR.Diego'],
            ['Diego', 'es-AR', 'com.apple.voice.enhanced.es-AR.Diego']],
    esperaURI: 'com.apple.voice.enhanced.es-AR.Diego' },
];

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

for (const caso of CASOS) {
  // Contexto TÁCTIL real para los casos de tablet (isMobile/hasTouch),
  // no solo un viewport del tamaño de un iPad: lo que se quiere que
  // matchee es `(pointer:coarse)`, y eso no lo da el tamaño.
  const ctx = caso.tactil
    ? await browser.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })
    : await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.addInitScript((voces) => {
    const lista = voces.map(([name, lang, voiceURI]) => ({
      name, lang, voiceURI: voiceURI || name, localService: true, default: false
    }));
    // Catálogo fijo + captura de lo que se manda a hablar.
    window.__dicho = [];
    const sp = window.speechSynthesis || (window.speechSynthesis = {});
    Object.defineProperty(window.speechSynthesis, 'getVoices', { value: () => lista, configurable: true });
    Object.defineProperty(window.speechSynthesis, 'speak', {
      value: (u) => {
        window.__dicho.push({ voz: u.voice && u.voice.name, uri: u.voice && u.voice.voiceURI, rate: u.rate });
        // El narrador encadena trozos con el evento `end`; se dispara
        // para que no quede esperando y el estado no se trabe.
        setTimeout(() => { if (typeof u.onend === 'function') u.onend(); }, 0);
      },
      configurable: true
    });
    Object.defineProperty(window.speechSynthesis, 'cancel', { value: () => {}, configurable: true });
    /* El SpeechSynthesisUtterance real VALIDA el tipo de `voice` y
       rechaza un objeto plano ("Failed to convert value to
       'SpeechSynthesisVoice'"). Como las voces de este test son
       inventadas a propósito, se reemplaza por una clase simple: lo
       que se quiere observar es qué voz y qué rate le asigna el
       código, no que el motor de voz del sistema los acepte. */
    window.SpeechSynthesisUtterance = class {
      constructor(text) { this.text = text; this.voice = null; this.lang = ''; this.rate = 1; this.pitch = 1; this.volume = 1; }
    };
  }, caso.voces);

  await page.goto(url);
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);

  if (recomendado === null) {
    recomendado = await page.evaluate(() => (window.Narrador && window.Narrador.getRateDefault)
      ? window.Narrador.getRateDefault() : 1);
  }

  const r = await page.evaluate(() => {
    window.__dicho = [];
    if (!window.Narrador || !window.Narrador.speak) return { err: 'no hay Narrador.speak' };
    window.Narrador.setNarrating && window.Narrador.setNarrating(true);
    window.Narrador.speak('Texto de prueba para la locución.', 'slide');
    return { dicho: window.__dicho };
  });

  if (r.err) { fallos.push(`${caso.nombre}: ${r.err}`); await page.close(); await ctx.close(); continue; }
  const u = r.dicho[0];
  if (!u) { fallos.push(`${caso.nombre}: no se llamó a speechSynthesis.speak()`); await page.close(); await ctx.close(); continue; }

  if (caso.espera && u.voz !== caso.espera) {
    fallos.push(`${caso.nombre}: eligió "${u.voz}", se esperaba "${caso.espera}"`);
  }
  if (caso.esperaURI && u.uri !== caso.esperaURI) {
    fallos.push(`${caso.nombre}: eligió voiceURI "${u.uri}", se esperaba "${caso.esperaURI}"`);
  }
  /* ⚠️ Antes esto exigía un 1.0 escrito acá, y cuando el producto
     cambió el default a 1.15 falló siete veces sin que nada estuviera
     roto. Lo que este test protege NO es el número: es que la
     velocidad sea LA MISMA PARA TODA VOZ — el bug real era "suena
     distinto en cada dispositivo", porque el kit multiplicaba por un
     factor según la voz. Así que se le pregunta el recomendado al kit,
     y además se junta el de cada caso para comprobar que no diverjan
     entre sí, que es la garantía de verdad.
     (kit-base v1.9.88, §7.37.) */
  ritmos.push({ caso: caso.nombre, rate: u.rate });
  if (Math.abs(u.rate - recomendado) > 0.001) {
    fallos.push(`${caso.nombre}: narró a ${u.rate}x — la velocidad base tiene que ser la recomendada por el kit (${recomendado}x) para toda voz`);
  }

  await page.close();
  await ctx.close();
}

/* La garantía central, dicha una vez sobre todos los casos juntos:
   ninguna voz narra a una velocidad distinta de otra. Esto sigue en pie
   aunque mañana el default vuelva a cambiar. */
const distintos = [...new Set(ritmos.map((x) => x.rate.toFixed(3)))];
if (distintos.length > 1) {
  fallos.push('la velocidad NO es la misma para toda voz — ' +
    ritmos.map((x) => `${x.caso}: ${x.rate}x`).join(' · '));
}

await browser.close();
report('locucion-voz-velocidad', fallos);
