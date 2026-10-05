/* retomar.mjs — un alumno que dejó el curso a la mitad, al volver ve
   "Retomá donde dejaste" y "Continuar" lo lleva ahí (kit-base v1.9.117,
   relevo de "Prevención cardiovascular", 2026-10-05).

   BUG REAL, en TODO curso de la plantilla: el cartel no aparecía nunca.
   `js/curso.js` registra `slidechange → SCORM.setLocation(id)` ANTES de
   `new Motor(document)` (para no perderse la primera diapositiva), el
   motor arranca en la portada, y ese primer `slidechange` escribía
   `portada` en `cmi.core.lesson_location`. Recién después `initResume()`
   leía la ubicación… y encontraba `portada`. Medido en el relevo con un
   API espía: escritura de `portada` a los 179 ms, lectura a los 184 ms.

   Por qué nadie lo vio: `scorm-tracking` verifica que la ubicación SE
   GUARDE al navegar, no que al REABRIR el cartel aparezca. Este test
   hace lo segundo: arma un LMS SCORM 1.2 en memoria que ya tiene guardado
   a un alumno en una diapositiva del medio, abre el curso y exige el
   cartel. Después pulsa "Continuar" y exige llegar a esa diapositiva. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

/* 1 · Qué diapositivas tiene el curso (sin LMS). */
const p0 = await browser.newPage();
await p0.goto(url);
await p0.waitForTimeout(600);
const ids = await p0.evaluate(() => Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));
const hayCartel = await p0.evaluate(() => !!document.getElementById('d-resume'));
await p0.close();

if (ids.length < 3) {
  fallos.push(`el curso tiene ${ids.length} diapositiva(s): no hay "mitad de camino" donde retomar.`);
} else if (!hayCartel) {
  fallos.push('el curso no trae `#d-resume` (el cartel "Retomá donde dejaste" del header del kit).');
} else {
  /* 2 · El mismo curso, con un LMS que ya guardó a un alumno en el medio. */
  const destino = ids[Math.floor(ids.length / 2)];
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.addInitScript((id) => {
    const store = {
      'cmi.core.lesson_status': 'incomplete',
      'cmi.core.lesson_location': id,
      'cmi.core.student_name': 'Prueba, Alumno',
      'cmi.suspend_data': ''
    };
    window.__escrituras = [];
    window.API = {
      LMSInitialize: () => 'true', LMSFinish: () => 'true', LMSCommit: () => 'true',
      LMSGetValue: (k) => store[k] || '',
      LMSSetValue: (k, v) => { store[k] = String(v); window.__escrituras.push(k + '=' + v); return 'true'; },
      LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => ''
    };
  }, destino);
  await page.goto(url);
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const bar = document.getElementById('d-resume');
    return { visible: !!bar && !bar.hidden && bar.getBoundingClientRect().height > 0,
      actual: window.motor && window.motor.current() && window.motor.current().getAttribute('data-slide'),
      escrituras: window.__escrituras.filter((x) => x.startsWith('cmi.core.lesson_location')) };
  });
  if (!r.visible) {
    fallos.push(`el LMS tenía guardado al alumno en "${destino}" y el cartel "Retomá donde dejaste" NO apareció ` +
      `(el curso arrancó en "${r.actual}"; escrituras de ubicación antes de mirar: ${r.escrituras.join(', ') || 'ninguna'}). ` +
      'Si la primera es la portada, el curso pisó la ubicación guardada antes de leerla.');
  } else {
    await page.click('#d-resume-go');
    await page.waitForTimeout(800);
    const fin = await page.evaluate(() => window.motor.current().getAttribute('data-slide'));
    if (fin !== destino) fallos.push(`"Continuar" llevó a "${fin}" y el alumno estaba en "${destino}".`);
  }
  if (errores.length) fallos.push(...errores.map((e) => 'error de consola: ' + e));
  await page.close();
}

await browser.close();
report('retomar', fallos);
