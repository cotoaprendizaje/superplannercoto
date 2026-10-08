/* repaso-reintentar.mjs — kit-base v1.9.125 (§7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El rediseño agrega "↺ Reintentar" a cada pregunta del
   repaso rápido ya contestada (canvas "Repaso" y "RepasoDiapo"), y el
   cliente decidió que REINTENTAR NO SUMA. El botón lo arma coto-ui.js,
   así que ningún curso tiene que tocar su HTML; lo que hay que cuidar es
   que volver a contestar no se convierta en una forma de sumar puntos,
   de cambiar lo guardado o de ganar logros, y que mientras se reintenta
   el curso no crea que la pregunta quedó sin contestar (el gate
   `data-require-repaso` y la barra de pasos la siguen contando).

   QUÉ HACE, con un LMS en memoria que sobrevive la recarga:
     1 · contesta MAL la primera pregunta del repaso → aparece
         "↺ Reintentar";
     2 · lo toca → la pregunta vuelve a estar para contestar (botones
         habilitados, sin devolución) pero marcada `data-ya-contestada`;
     3 · contesta BIEN → se ve la devolución, pero los puntos, el bono
         de logros y lo guardado (`rp`/`rm`) no cambian, y el aviso a
         los logros sale como `repetida`;
     4 · recarga → vuelve la respuesta ORIGINAL (la mal contestada).
   Un curso sin repaso rápido no tiene nada que revisar. */
import { chromium } from 'playwright-core';
import { report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];

function lms() {
  const K = '__rr_lms';
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

const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errores = [];
page.on('pageerror', (e) => errores.push(String(e)));
await page.addInitScript(lms);
await page.goto(url);
await page.waitForTimeout(700);
await page.keyboard.press('Escape').catch(() => {});

const destino = await page.evaluate(() => {
  const it = document.querySelector('[data-slide] [data-repaso-item][data-repaso-id]');
  if (!it) return null;
  return { slide: it.closest('[data-slide]').getAttribute('data-slide'), id: it.getAttribute('data-repaso-id') };
});

const estado = () => page.evaluate((id) => {
  const p = document.getElementById('d-points');
  let s = {};
  try { s = (window.SCORM && SCORM.loadState && SCORM.loadState()) || {}; } catch { s = {}; }
  return {
    puntos: p ? parseInt(p.getAttribute('data-valor') || '0', 10) : 0,
    bono: p ? parseInt(p.getAttribute('data-bono') || '0', 10) : 0,
    rp: JSON.stringify(s.rp || []), rm: JSON.stringify(s.rm || {}),
    item: (() => {
      const it = document.querySelector(`[data-repaso-item][data-repaso-id="${id}"]`);
      if (!it) return null;
      return {
        contestada: it.classList.contains('is-answered'),
        ya: it.hasAttribute('data-ya-contestada'),
        bien: it.classList.contains('is-correct'),
        reintentar: (() => { const b = it.closest('[data-repaso]').querySelector('[data-repaso-reintentar]'); return !!(b && !b.hidden && b.getBoundingClientRect().width > 0); })(),
        habilitados: Array.from(it.querySelectorAll('[data-repaso-ans]')).every((b) => !b.disabled),
        devolucion: Array.from(it.querySelectorAll('[data-repaso-fb]')).some((f) => !f.hidden)
      };
    })()
  };
}, destino.id);

const contestar = (bien) => page.evaluate(({ id, bien }) => {
  const it = document.querySelector(`[data-repaso-item][data-repaso-id="${id}"]`);
  const ok = it.getAttribute('data-repaso-ok') === 'true';
  const b = Array.from(it.querySelectorAll('[data-repaso-ans]')).find((x) => ((x.getAttribute('data-repaso-ans') === 'true') === ok) === bien);
  b.click();
}, { id: destino.id, bien });

if (!destino) {
  console.log('  · el curso no tiene repaso rápido: nada que revisar.');
} else {
  await irASlide(page, destino.slide);
  await page.waitForTimeout(300);
  await contestar(false);
  await page.waitForTimeout(300);
  const e1 = await estado();
  if (!e1.item.reintentar) fallos.push(`al contestar "${destino.id}" no apareció "↺ Reintentar" a la vista (\`[data-repaso-reintentar]\` en la barra de la tira, lo arma coto-ui.js).`);
  else {
    await page.evaluate((id) => document.querySelector(`[data-repaso-item][data-repaso-id="${id}"]`).closest('[data-repaso]').querySelector('[data-repaso-reintentar]').click(), destino.id);
    await page.waitForTimeout(200);
    const e2 = await estado();
    if (e2.item.contestada || !e2.item.habilitados || e2.item.devolucion) fallos.push('después de "↺ Reintentar" la pregunta no quedó para contestar de nuevo (sigue resuelta, con botones apagados o con la devolución a la vista).');
    if (!e2.item.ya) fallos.push('después de "↺ Reintentar" la pregunta no quedó marcada `data-ya-contestada`: el gate y la barra de pasos la tomarían como SIN contestar.');

    const avisos = [];
    await page.exposeFunction('__rrAviso', (d) => avisos.push(d));
    await page.evaluate(() => document.addEventListener('cotorespuesta', (e) => window.__rrAviso(e.detail)));
    await contestar(true);
    await page.waitForTimeout(400);
    const e3 = await estado();
    if (!e3.item.contestada || !e3.item.bien || !e3.item.devolucion) fallos.push('el reintento no mostró la respuesta como bien contestada con su devolución.');
    if (e3.puntos !== e1.puntos) fallos.push(`el reintento SUMÓ puntos (${e1.puntos} → ${e3.puntos}): reintentar no suma (decisión del cliente).`);
    if (e3.bono !== e1.bono) fallos.push(`el reintento hizo ganar un logro (bono ${e1.bono} → ${e3.bono}).`);
    if (e3.rp !== e1.rp || e3.rm !== e1.rm) fallos.push('el reintento cambió lo guardado del repaso (`rp`/`rm` en suspend_data): vale la primera respuesta.');
    const a = avisos.find((d) => d && d.fuente === 'repaso');
    if (!a) fallos.push('el reintento no avisó a los logros (`cotorespuesta`).');
    else if (!a.repetida) fallos.push('el reintento avisó a los logros SIN `repetida`: En racha o Puntería lo contarían.');

    await page.reload();
    await page.waitForTimeout(900);
    const e4 = await estado();
    if (!e4.item || !e4.item.contestada || e4.item.bien) fallos.push('al recargar, la pregunta no volvió con la respuesta ORIGINAL (la mal contestada).');
    console.log(`  · "${destino.id}": mal → ↺ → bien · puntos ${e1.puntos} → ${e3.puntos} · al recargar: ${e4.item && e4.item.bien ? 'bien' : 'mal'}`);
  }
}

if (errores.length) fallos.push(...errores.map((e) => 'error de consola: ' + e));
report('repaso-reintentar', fallos);
await browser.close();
