/* arrastre-pasos.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. La barra de pasos (`[data-shot-swap]` con sus
   `[data-shot-swap-go]`) se mueve con ARRASTRE, no con clic: desde
   v1.9.37/38 un clic suelto sobre un tramo no debe hacer nada. Es una
   decisión de producto que el alumno no puede adivinar, así que el
   affordance tiene que acompañarla — cursor `grab` y un tramo que no
   se pinta al pasarle el mouse, porque pintarse invita justamente al
   gesto que no funciona (reporte del cliente, v1.9.40).

   Tres cosas que se rompen por separado y ninguna da error:
     1 · un clic vuelve a mover la barra (vuelve el gesto equivocado);
     2 · el tramo se pinta al hover y promete un clic que no existe;
     3 · el cursor deja de ser `grab` y nadie descubre el arrastre.

   ⚠️ Llegó desde un curso apuntando a SU barra por nombre
   (`[data-shot-swap="rotacion"]`) y a la diapositiva 21 por número, así
   que en cualquier otro curso reventaba con un null. Acá se busca la
   primera barra que el curso tenga, sea cual sea, y se navega a su
   diapositiva. Un curso sin barra de pasos no tiene nada que revisar.
*/
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url);
await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(300);

const failures = [];

/* La barra se reconoce por `.d-shot-hit--paso`, que es el marcador que
   usa el KIT: `initShotSwap` (coto-media.js) acota el arrastre a esa
   clase a propósito, porque el mismo `[data-shot-swap-go]` también arma
   PESTAÑAS de categoría —donde arrastrar no significa nada, no son un
   progreso lineal— y ahí el clic sí tiene que saltar.
   Buscar "el primer [data-shot-swap]" a secas agarraba las pestañas y
   les exigía el contrato de la barra: medido, 3 fallos que no eran
   fallos. */
const barra = await page.evaluate(() => {
  const cands = Array.from(document.querySelectorAll('[data-shot-swap]'))
    .filter((el) => el.querySelectorAll('[data-shot-swap-go].d-shot-hit--paso').length >= 3);
  if (!cands.length) return null;
  const el = cands[0];
  const slide = el.closest('[data-slide]');
  return {
    nombre: el.getAttribute('data-shot-swap') || '(sin nombre)',
    slide: slide ? slide.getAttribute('data-slide') : null,
    pasos: el.querySelectorAll('[data-shot-swap-go].d-shot-hit--paso').length
  };
});

if (!barra || !barra.slide) {
  console.log('  · el curso no tiene barra de pasos arrastrable (`.d-shot-hit--paso`): nada que revisar.');
  await browser.close();
  report('arrastre-pasos', errors.map((e) => 'error de consola: ' + e));
  process.exit(process.exitCode || 0);
}

const SEL = `[data-shot-swap="${barra.nombre}"]`;
const go = (n) => `${SEL} [data-shot-swap-go="${n}"].d-shot-hit--paso`;
const destino = barra.pasos - 1;

await page.evaluate((id) => window.motor.gotoId(id), barra.slide);
await page.waitForTimeout(500);
console.log(`  · barra "${barra.nombre}" en la diapositiva "${barra.slide}", ${barra.pasos} pasos.`);

const activo = () => page.evaluate((sel) => {
  const btn = document.querySelector(sel + ' [data-shot-swap-go].d-shot-hit--paso.is-active');
  return btn ? btn.getAttribute('data-shot-swap-go') : null;
}, SEL);

const centro = async (sel) => {
  const el = await page.$(sel);
  if (!el) return null;
  const b = await el.boundingBox();
  return b ? { x: b.x + b.width / 2, y: b.y + b.height / 2 } : null;
};

const pFin = await centro(go(destino));
const pIni = await centro(go(0));
if (!pFin || !pIni) {
  failures.push('los tramos de la barra no tienen caja medible: ¿están ocultos en esta diapositiva?');
} else {
  // 1 · un CLIC (down y up en el mismo punto, sin mover) no mueve nada.
  await page.mouse.move(pFin.x, pFin.y);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(200);
  let a = await activo();
  if (a !== '0') {
    failures.push(`un clic sin arrastre movió la barra: quedó en el paso ${a} (esperaba seguir en 0). ` +
      'La barra se mueve SOLO con arrastre desde v1.9.37.');
  }

  // 2 · un ARRASTRE real sí mueve.
  await page.mouse.move(pIni.x, pIni.y);
  await page.mouse.down();
  await page.mouse.move(pFin.x, pFin.y, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(200);
  a = await activo();
  if (a !== String(destino)) {
    failures.push(`un arrastre real debería llevar la barra al paso ${destino}, quedó en ${a}`);
  }

  // 3 · el affordance acompaña al gesto que sí funciona.
  await page.hover(go(1));
  await page.waitForTimeout(200);
  const estilo = await page.evaluate((sel) => {
    const cs = getComputedStyle(document.querySelector(sel));
    return { background: cs.backgroundColor, cursor: cs.cursor };
  }, go(1));
  const transparente = estilo.background === 'rgba(0, 0, 0, 0)' || estilo.background === 'transparent';
  if (!transparente) {
    failures.push('con el mouse encima, un tramo no debería pintarse — invita a un clic que no ' +
      `mueve nada. Dio background ${estilo.background}`);
  }
  if (estilo.cursor !== 'grab') {
    failures.push(`el cursor sobre la barra debería ser "grab" (el gesto que funciona), dio "${estilo.cursor}"`);
  }
}

if (errors.length) failures.push(...errors.map((e) => 'error de consola: ' + e));
await browser.close();
report('arrastre-pasos', failures);
