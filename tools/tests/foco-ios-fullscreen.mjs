/* check-foco-ios-fullscreen — en iPad y en pantalla completa, el curso
   no mueve el foco solo (kit-base v1.9.95).

   BUG REAL, reportado CUATRO veces por el cliente: *"me sigue saliendo
   ese cartel de pantalla completa todo el tiempo cada vez que voy
   interactuando con el curso"*. El cartel lo dibuja Safari cuando algo
   toma el foco estando en pantalla completa; no se puede esconder, así
   que lo único de nuestro lado es no provocarlo.

   La vuelta anterior tapó DOS de las tres puertas (abrir y cerrar
   pop-up) y se dio por cerrado el tema sin un test. Quedó abierta la
   tercera —el foco al título en cada `go()`— que además es la que más
   corre: una vez por navegación. De ahí el "cada vez". Este test mira
   las tres a la vez, que es la única forma de que "ya está" sea cierto.

   Fuera de pantalla completa, o fuera de iOS, el foco automático tiene
   que seguir funcionando igual: es accesibilidad real (el lector de
   pantalla anuncia la diapositiva nueva), no un adorno que se pueda
   sacar para todos. Por eso las dos mitades.

   ⚠️ LO QUE ESTE TEST NO CUBRE, medido al integrarlo (kit-base v1.9.95):
   el kit mueve el foco solo en CUATRO lugares, no tres. El cuarto es
   `nBtn.focus()` del mini-quiz (coto-quiz.js), y acá no se ejercita —
   sacándole el guard, este test sigue en verde. Hace falta un curso con
   `initMiniQuiz()` cableado y una pregunta contestada para llegar ahí.
   Queda cubierto por compartir `focoBloqueado()` en vez de copiarla, que
   es lo que evita que las dos definiciones se separen, y no por una
   medición. Los otros dos `focus()` del motor (líneas del ciclo de Tab
   dentro de un diálogo) NO llevan guard a propósito: responden a una
   tecla Tab real del alumno, y si no hay teclado no hay Tab. */
import { report, requireUrl, irASlide } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

async function correr({ ios, fs, etiqueta, esperaFoco }) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 820 } });
  page.on('pageerror', e => fallos.push(`[${etiqueta}] error JS: ${e}`));
  await page.goto(url);
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape').catch(() => {});

  await page.evaluate(({ ios, fs }) => {
    document.documentElement.classList.toggle('d-ios', ios);
    // Chromium headless no entra en pantalla completa de verdad; lo que
    // el guard mira es esta propiedad, así que se simula.
    if (fs) Object.defineProperty(document, 'fullscreenElement', { get: () => document.documentElement, configurable: true });
  }, { ios, fs });

  const marcar = () => page.evaluate(() => {
    const b = document.getElementById('d-sound') || document.querySelector('button');
    b.focus(); window.__ancla = b;
  });
  const movio = () => page.evaluate(() => document.activeElement !== window.__ancla);

  // 1) navegar de diapositiva
  await marcar();
  await page.evaluate(() => window.motor.go(2));
  await page.waitForTimeout(250);
  if (await movio() !== esperaFoco)
    fallos.push(`[${etiqueta}] al cambiar de diapositiva el foco ${esperaFoco ? 'tendría que moverse al título y no se movió' : 'se movió solo (dispara el cartel de Safari)'}`);

  // 2) abrir un pop-up  3) cerrarlo
  await marcar();
  await page.evaluate(() => {
    // el primer pop-up del marcado, sea cual sea: el test es del kit
    const p = document.querySelector('[data-popup]');
    window.motor.showPopup(p.getAttribute('data-popup'));
  });
  await page.waitForTimeout(250);
  if (await movio() !== esperaFoco)
    fallos.push(`[${etiqueta}] al ABRIR un pop-up el foco ${esperaFoco ? 'tendría que ir a la tarjeta y no fue' : 'se movió solo'}`);
  await page.evaluate(() => { const b = document.getElementById('d-sound'); b.focus(); window.__ancla = b; window.motor.closePopup(); });
  await page.waitForTimeout(250);

  await page.close();
}

await correr({ ios: true,  fs: true,  etiqueta: 'iPad en pantalla completa', esperaFoco: false });
await correr({ ios: false, fs: false, etiqueta: 'PC normal',                 esperaFoco: true  });
await correr({ ios: true,  fs: false, etiqueta: 'iPad SIN pantalla completa', esperaFoco: true  });

await browser.close();
report('check-foco-ios-fullscreen', fallos);
