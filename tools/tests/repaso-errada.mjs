/* repaso-errada.mjs — kit-base v1.9.124 (§7.73)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Relevo de "Seguridad de la información", 2026-10-07:
   el cliente terminó el curso con **1/4 logros** y preguntó si se podían
   cumplir. No se podían: los logros de unidad pedían las preguntas del
   repaso en `estado.repaso`, que solo llena `markSeen`, y `markSeen` corre
   solo al ACERTAR. Cada pregunta se contesta una vez, así que con una
   errada el logro de esa unidad quedaba imposible. Y al recargar la
   pregunta volvía en blanco, porque el curso no guardaba las erradas
   (`seenMal`/`markMal`).

   Nada lo veía: `puntaje-maximo` contesta y mide puntos; nunca contesta
   MAL a propósito ni cuenta logros.

   QUÉ HACE. Dos alumnos, cada uno con su LMS en memoria:
     · uno recorre el curso contestando TODO el repaso bien;
     · el otro hace el mismo recorrido y contesta TODO mal.
   Y exige:
     1 · los mismos LOGROS en los dos. Un logro que el segundo no gana
         depende de acertar una pregunta que se contesta una sola vez, y
         eso no se arregla después. Regla del kit: los logros miden
         recorrido (contestar), la medalla mide desempeño (acertar).
     2 · que al recargar, las preguntas erradas vuelvan CONTESTADAS. Si
         vuelven en blanco, el curso no cablea `seenMal`/`markMal`
         (plantilla de `js/curso.js`, bloque de `initRepasoRapido`).

   Un curso sin repaso rápido no tiene nada que revisar. */
import { chromium } from 'playwright-core';
import { report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];

/* LMS SCORM 1.2 en memoria que sobrevive la recarga (sessionStorage de
   la pestaña), el mismo de `puntaje-maximo`. */
function lms() {
  const K = '__re_lms';
  let store = {};
  try { store = JSON.parse(sessionStorage.getItem(K) || '{}'); } catch { /* vacío */ }
  const guardar = () => { try { sessionStorage.setItem(K, JSON.stringify(store)); } catch { /* noop */ } };
  window.API = {
    LMSInitialize: () => 'true', LMSFinish: () => 'true', LMSCommit: () => { guardar(); return 'true'; },
    LMSGetValue: (k) => (k === 'cmi.core.student_name' ? 'Prueba, Alumno' : (store[k] || '')),
    LMSSetValue: (k, v) => { store[k] = String(v); guardar(); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => ''
  };
}

async function abrir() {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.addInitScript(lms);
  await page.goto(url);
  await page.waitForTimeout(600);
  await page.keyboard.press('Escape').catch(() => {});
  return { page, errores };
}

const logrosGuardados = (page) => page.evaluate(() => {
  try { return ((window.SCORM && SCORM.loadState && SCORM.loadState()) || {}).b || []; } catch { return []; }
});

/* El mismo recorrido de `puntaje-maximo` (todo lo que puede pagar o
   desbloquear, con `.click()` del DOM), salvo el repaso: ahí se elige la
   respuesta buena o la mala según `modo`. */
async function recorrer(page, modo) {
  const ids = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));
  for (const id of ids) {
    if (!(await irASlide(page, id))) continue;
    await page.evaluate(async ({ id, modo }) => {
      const sl = document.querySelector(`[data-slide="${id}"]`);
      if (!sl) return;
      const espera = (ms) => new Promise((r) => setTimeout(r, ms));
      const SEL = '[data-hit], [data-shot-swap-step], [data-shot-swap-go], ' +
                  '[data-popup-trigger], [data-layer-trigger]';
      for (const el of Array.from(sl.querySelectorAll(SEL))) {
        try { if (!el.disabled) el.click(); } catch { /* noop */ }
        await espera(30);
        document.querySelectorAll('[data-popup-close]').forEach((b) => b.click());
      }
      for (const item of Array.from(sl.querySelectorAll('[data-repaso-item]'))) {
        const ok = item.getAttribute('data-repaso-ok') === 'true';
        const b = Array.from(item.querySelectorAll('[data-repaso-ans]'))
          .find((x) => ((x.getAttribute('data-repaso-ans') === 'true') === ok) === (modo === 'bien'));
        if (b) b.click();
        await espera(30);
      }
    }, { id, modo });
  }
  await page.waitForTimeout(500);
}

const hayRepaso = await (async () => {
  const p = await browser.newPage();
  await p.goto(url);
  await p.waitForTimeout(500);
  const n = await p.evaluate(() => document.querySelectorAll('[data-slide] [data-repaso-item][data-repaso-id]').length);
  await p.close();
  return n;
})();

if (!hayRepaso) {
  console.log('  · el curso no tiene repaso rápido: nada que revisar.');
} else {
  const bien = await abrir();
  await recorrer(bien.page, 'bien');
  const conBien = await logrosGuardados(bien.page);

  const mal = await abrir();
  await recorrer(mal.page, 'mal');
  const conMal = await logrosGuardados(mal.page);

  console.log(`  · ${hayRepaso} pregunta(s) de repaso · logros contestando todo bien: ${conBien.length} ` +
    `[${conBien.join(', ')}] · todo mal: ${conMal.length} [${conMal.join(', ')}]`);
  const perdidos = conBien.filter((b) => !conMal.includes(b));
  if (perdidos.length) {
    fallos.push(`contestando el repaso MAL no se gana: ${perdidos.join(', ')}. Ese logro depende de ACERTAR ` +
      'preguntas que se contestan una sola vez: con una errada queda imposible. Que pida las preguntas ' +
      'CONTESTADAS (`estado.repaso[id] || estado.repasoMal[id]`), no acertadas: acertar suma puntos, no decide logros.');
  }

  /* Al retomar, las erradas vuelven contestadas. */
  await mal.page.reload();
  await mal.page.waitForTimeout(800);
  const enBlanco = await mal.page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-slide] [data-repaso-item][data-repaso-id]'))
      .filter((it) => !it.classList.contains('is-answered'))
      .map((it) => it.getAttribute('data-repaso-id')));
  console.log(`  · al retomar: ${hayRepaso - enBlanco.length}/${hayRepaso} contestada(s)`);
  if (enBlanco.length) {
    fallos.push(`al retomar, ${enBlanco.length} pregunta(s) contestada(s) MAL volvieron en blanco ` +
      `(${enBlanco.slice(0, 6).join(', ')}${enBlanco.length > 6 ? '…' : ''}). El curso no guarda las erradas: ` +
      'pasarle `seenMal`/`markMal` a `initRepasoRapido` (bloque de la plantilla de `js/curso.js`) ' +
      'y guardar `estado.repasoMal` en suspend_data.');
  }

  for (const r of [bien, mal]) if (r.errores.length) fallos.push(...r.errores.map((e) => 'error de consola: ' + e));
}

report('repaso-errada', fallos);
await browser.close();
