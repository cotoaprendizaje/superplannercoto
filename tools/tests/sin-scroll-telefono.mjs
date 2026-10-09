/* sin-scroll-telefono.mjs — kit-base v1.9.129 (§7.78)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Regla del cliente: dentro de una diapositiva no hay
   scroll, nunca. Dos pantallas la rompían en teléfono, y los tests
   existentes no medían esas medidas:
     · el resultado de la mini práctica en teléfono vertical (1191px de
       contenido para 661 de pantalla);
     · el resumen del cierre en teléfono acostado (990 para 296).
   El arreglo (coto-quiz.js / coto-cierre.js) mide y, si no entra, pasa lo
   secundario a un botón que lo abre en una capa (`CotoUI.abrirEnCapa`):
   "Ver tus respuestas" y "Ver el repaso del curso".

   QUÉ HACE, en un curso real, en un teléfono vertical (390×844) y uno
   acostado chico (667×375), táctiles:
     1 · si hay mini práctica: la contesta entera y exige el resultado sin
         scroll; si aparece "Ver tus respuestas", que abra la lista en la
         capa y que "Listo" la devuelva a su lugar;
     2 · si hay resumen de cierre: lo muestra (`navcta` de la diapositiva
         "cierre", lo mismo que el botón del pie) y exige lo mismo con
         "Ver el repaso del curso". */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];

const sobraEn = (sel) => `(() => { const s = document.querySelector(${JSON.stringify(sel)}); if (!s) return null; const out = [];
  for (const el of [s, ...s.querySelectorAll('*')]) { if (!el.getClientRects().length) continue; const cs = getComputedStyle(el);
    if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) out.push((String(el.className).split(' ')[0] || el.tagName) + ' ' + el.clientHeight + '/' + el.scrollHeight); }
  return out.join(', '); })()`;

async function probarCapa(page, boton, pieza, lugar, quien) {
  const r = await page.evaluate(async ([boton, pieza, lugar]) => {
    const b = document.querySelector(boton);
    if (!b || !b.getClientRects().length || getComputedStyle(b).display === 'none') return { visible: false };
    b.click();
    await new Promise((res) => setTimeout(res, 350));
    const enCapa = !!document.querySelector('.d-capa-suelta ' + pieza);
    const listo = document.querySelector('.d-capa-suelta .d-repaso-capa-listo');
    if (listo) listo.click();
    await new Promise((res) => setTimeout(res, 200));
    return { visible: true, enCapa, cerro: !document.querySelector('.d-capa-suelta'), volvio: !!document.querySelector(lugar) };
  }, [boton, pieza, lugar]);
  if (!r.visible) return;
  if (!r.enCapa) fallos.push(`${quien}: el botón no abrió la capa con su contenido.`);
  if (!r.cerro || !r.volvio) fallos.push(`${quien}: "Listo" no cerró la capa o no devolvió el contenido a su lugar.`);
}

for (const [w, h, nombre] of [[390, 844, 'teléfono vertical'], [667, 375, 'teléfono acostado']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.evaluate(() => { document.querySelectorAll('[data-rotate-seguir]').forEach((x) => x.click()); if (window.motor) window.motor.closePopup(); });
  const ir = (pred) => page.evaluate((pred) => { const m = window.motor; const i = m.slides.findIndex((s) => new Function('s', 'return ' + pred)(s)); if (i < 0) return null; m.closePopup(); m.go(i, true); return m.slides[i].getAttribute('data-slide'); }, pred);

  /* 1 · la mini práctica */
  const q = await ir('!!s.querySelector("[data-quiz]")');
  if (q) {
    await page.waitForTimeout(500);
    await page.evaluate(() => window.motor.closePopup());
    for (let i = 0; i < 8; i++) {
      const hay = await page.evaluate(() => { const o = document.querySelector('[data-quiz] .d-opt input:not([disabled])'); if (!o) return false; o.click(); document.querySelector('[data-quiz] [data-answer]').click(); return true; });
      if (!hay) break;
      await page.waitForTimeout(300);
      await page.evaluate(() => { const n = document.querySelector('[data-quiz] [data-next]:not([hidden])'); if (n) n.click(); });
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(600);
    const s = await page.evaluate(sobraEn(`[data-slide="${q}"]`));
    if (s) fallos.push(`[${nombre}] el resultado de la mini práctica tiene scroll: ${s}.`);
    await probarCapa(page, '[data-ver-respuestas]', '.d-quiz-review', '.d-quiz-result > .d-quiz-review', `[${nombre}] "Ver tus respuestas"`);
  }

  /* 2 · el resumen del cierre */
  const c = await ir('s.getAttribute("data-slide") === "cierre" && !!s.querySelector("[data-cierre-step=\\"summary\\"]")');
  if (c) {
    await page.waitForTimeout(500);
    await page.evaluate(() => { window.motor.closePopup(); document.dispatchEvent(new CustomEvent('navcta', { detail: { id: 'cierre' } })); });
    await page.waitForTimeout(900);
    const visible = await page.evaluate(() => !document.querySelector('[data-cierre-step="summary"]').hidden);
    if (visible) {
      const s = await page.evaluate(sobraEn('[data-slide="cierre"]'));
      if (s) fallos.push(`[${nombre}] el resumen del cierre tiene scroll: ${s}.`);
      await probarCapa(page, '[data-ver-repaso]', '.d-cierre-recap', '.d-cierre-cols > .d-cierre-recap', `[${nombre}] "Ver el repaso del curso"`);
    }
  }
  if (!q && !c) console.log(`  · [${nombre}] el curso no tiene mini práctica ni resumen de cierre: nada que revisar.`);
  await ctx.close();
}
await browser.close();
report('sin-scroll-telefono', fallos);
