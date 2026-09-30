/* arrastre-pasos-mobile.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   Compañero de `arrastre-pasos.mjs`, pero en un contexto TÁCTIL real
   (`isMobile`/`hasTouch`), y no es una repetición: en touch el gesto se
   comporta distinto y ya rompió por eso. Un tap táctil sintetiza un
   `click` con `detail: 0` — idéntico al de teclado —, así que la
   primera versión del fix distinguía "teclado vs. puntero" por ese
   dato y dejaba pasar el salto directo en táctil, que es justo lo que
   el fix venía a impedir (kit-base v1.9.38). Probarlo solo con
   `page.mouse.*` no habría encontrado nada.

   Misma generalización que su compañero: la barra se busca por
   `.d-shot-hit--paso`, que es el marcador que lee `initShotSwap`, y no
   por el nombre que le puso un curso. Sin barra, no hay nada que
   revisar.
*/
import { openCourseMobile, requireUrl, report } from './_shared.mjs';

const url = requireUrl();
/* ⚠️ APAISADO, y no es un detalle: en un iPhone 12 VERTICAL el lienzo
   queda 390x662 (ratio 0.59), así que el kit muestra el cartel "Girá tu
   dispositivo" — y ese cartel SE COME EL TOQUE. Verificado con
   `elementFromPoint` sobre el centro del paso: devuelve
   `.d-rotate-notice`.

   Con eso, este test venía pasando EN FALSO desde v1.9.86: su primera
   aserción ("un toque no mueve la barra") daba verde porque el toque no
   llegaba nunca a la barra. Verde por ausencia, que es el verde que
   miente — y encima sobre el mismo mecanismo que el cliente reportó
   como "se tildó".

   La barra de pasos vive sobre el arte, así que probarla exige un
   lienzo apaisado. Quien agregue un test táctil sobre CUALQUIER cosa
   dibujada en la lámina tiene el mismo problema: primero hay que
   asegurarse de que el curso esté destapado. */
const { browser, page, errors } = await openCourseMobile(url, 'iPhone 12 landscape');
await page.waitForTimeout(300);
const cursoTapado = await page.evaluate(() => {
  const st = document.querySelector('.d-stage');
  return !!(st && st.classList.contains('is-vertical'));
});

const failures = [];
if (cursoTapado) {
  failures.push('el curso está TAPADO por el cartel "Girá tu dispositivo" en este viewport: ' +
    'nada de lo que sigue mediría la barra, mediría el cartel');
}

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
  report('arrastre-pasos-mobile', errors.map((e) => 'error de consola: ' + e));
  process.exit(process.exitCode || 0);
}

const SEL = `[data-shot-swap="${barra.nombre}"]`;
const go = (n) => `${SEL} [data-shot-swap-go="${n}"].d-shot-hit--paso`;
const destino = barra.pasos - 1;

await page.evaluate((id) => window.motor.gotoId(id), barra.slide);
await page.waitForTimeout(500);
console.log(`  · barra "${barra.nombre}" en "${barra.slide}", ${barra.pasos} pasos (táctil).`);

const activo = () => page.evaluate((sel) => {
  const btn = document.querySelector(sel + ' [data-shot-swap-go].d-shot-hit--paso.is-active');
  return btn ? btn.getAttribute('data-shot-swap-go') : null;
}, SEL);

const caja = async (sel) => { const el = await page.$(sel); return el ? el.boundingBox() : null; };
const bFin = await caja(go(destino));
const bIni = await caja(go(0));

if (!bFin || !bIni) {
  failures.push('los tramos no tienen caja medible en táctil: ¿el arte se recorta a este ancho?');
} else {
  const fin = { x: bFin.x + bFin.width / 2, y: bFin.y + bFin.height / 2 };
  const ini = { x: bIni.x + bIni.width / 2, y: bIni.y + bIni.height / 2 };

  /* 1 · TAP táctil: SÍ salta al paso (kit-base v1.9.91).
     ⚠️ Esto invierte el contrato que este test exigía antes, y el
     cambio es de producto, no un bug. La regla de "hay que arrastrar de
     verdad" nació para el MOUSE, donde arrastrar es natural y el
     clic-por-tramo hacía saltar la barra sin querer. Con el dedo no hay
     equivalente: si el toque no hace nada, el alumno no tiene forma de
     saber que tenía que deslizar, y lo lee como que el curso se colgó —
     que es exactamente como lo reportó el cliente ("se tildó, no
     pasaba").
     `arrastre-pasos.mjs` (mouse) conserva el contrato opuesto, que ahí
     sigue siendo el correcto. */
  await page.touchscreen.tap(fin.x, fin.y);
  await page.waitForTimeout(250);
  let a = await activo();
  if (a !== String(destino)) {
    failures.push(`un tap táctil debería saltar al paso ${destino}, quedó en ${a}. ` +
      'Con el dedo no hay "arrastre natural": si el toque no hace nada, el alumno lo lee como que se colgó.');
  }

  /* ⚠️ Acá había una aserción 1b, "tras tocar en otra parte el
     siguiente toque sigue funcionando", por el bug del sello de tiempo
     que reportó el cliente como "se tildó". La saqué porque NO PUEDE
     FALLAR: con la excepción táctil de v1.9.91, el camino que miraba
     esa marca ya no corre para `pointerType === 'touch'` —se sale por
     el `tipo !== 'touch'`— así que dejar la marca pegada no cambia nada
     en táctil. Verificado: rompiendo el sello de tiempo a propósito, el
     test seguía en verde.
     El sello de tiempo sigue valiendo para MOUSE, y ahí el contrato es
     "el clic no salta", que es lo que mide `arrastre-pasos.mjs`.
     Una aserción que no puede ponerse roja es peor que ninguna: ocupa
     lugar y promete una cobertura que no existe. */

  // 2 · ARRASTRE táctil real: sí mueve.
  await page.evaluate(({ sel, x1, y1, x2, y2 }) => {
    const el = document.querySelector(sel);
    const fire = (type, x, y) => el.dispatchEvent(new PointerEvent(type, {
      pointerId: 1, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, cancelable: true
    }));
    fire('pointerdown', x1, y1);
    fire('pointermove', x1 + 20, y1);
    fire('pointermove', x2, y2);
    fire('pointerup', x2, y2);
  }, { sel: SEL, x1: ini.x, y1: ini.y, x2: fin.x, y2: fin.y });
  await page.waitForTimeout(250);
  a = await activo();
  if (a !== String(destino)) {
    failures.push(`un arrastre táctil real debería llevar la barra al paso ${destino}, quedó en ${a}`);
  }
}

if (errors.length) failures.push(...errors.map((e) => 'error de consola: ' + e));
await browser.close();
report('arrastre-pasos-mobile', failures);
