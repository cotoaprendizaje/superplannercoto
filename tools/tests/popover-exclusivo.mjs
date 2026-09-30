/* Test de contenido — el mecanismo (attachHoverGrace/initPinnedPopover,
   coto-player.js) es 100% de kit, pero corre contra los popovers reales
   de este curso (Sonido/Locución/Ayuda/Configuración). Pedido explícito
   del cliente: "se me complica pasar rápido el mouse a los desplegables
   sin que desaparezcan" — antes el cierre dependía de CSS :hover puro
   (sin perdón de un solo frame fuera del hitbox); ahora JS agrega una
   clase con una gracia antes de cerrar, cancelable si el mouse vuelve a
   entrar (al botón O al popover) antes de que venza.

   La gracia arrancó en 3s (v1.9.37) y bajó a 1,5s por pedido del
   cliente (v1.9.40): 3s alcanzaban para cruzar el hueco pero dejaban el
   panel colgado un rato largo después de que el alumno ya siguió con
   otra cosa. Mismo pedido sumó que un clic AFUERA cierre el popover
   aunque se haya abierto por hover — antes el handler de click-afuera
   solo sacaba `is-open` (el pin), nunca `is-hover`, así que el panel se
   quedaba hasta que venciera la gracia. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
await page.goto(url);
await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(300);

const failures = [];

/* DOS preguntas distintas, y hay que hacer la correcta en cada caso:

   · `pineado()` — ¿tiene `.is-open`? Es el estado que el clic deja, y
     el único que sobrevive a que el mouse se vaya.
   · `seVe()` — ¿el alumno ve el panel? Mide geometría y estilo real.

   ⚠️ No son intercambiables, y confundirlas hace un test que miente en
   las dos direcciones: preguntar solo por `.is-open` deja pasar un
   `:hover` agregado al selector CSS (el panel se abre al pasar y la
   clase nunca aparece — verificado: el test daba verde con el bug
   puesto), y preguntar solo por visibilidad deja pasar un panel que se
   ve por `:focus-within` sin estar pineado. */
const pineado = (sel) => page.evaluate(
  (s) => { const el = document.querySelector(s); return el.classList.contains('is-open'); },
  sel
);
const seVe = (sel) => page.evaluate((s) => {
  const el = document.querySelector(s);
  const pop = el && el.querySelector('.d-audio-pop, .d-fab-pop');
  if (!pop) return false;
  const cs = getComputedStyle(pop);
  const r = pop.getBoundingClientRect();
  return cs.visibility !== 'hidden' && cs.display !== 'none' &&
    parseFloat(cs.opacity) > 0.5 && r.width > 4 && r.height > 4;
}, sel);

/* ---- LOS CUATRO POPOVERS ABREN SOLO POR CLIC ----
   Hasta v1.9.87 había DOS contratos: los de audio abrían al pasar el
   mouse (con una gracia de 1,5 s para cruzar el hueco entre el botón y
   el panel) y los flotantes solo por clic. El cliente pidió unificar:
   *"así todos tienen el mismo comportamiento"*.

   Salió gratis: el clic en Sonido/Locución YA abría el panel además de
   mutear o narrar, porque `initPinnedPopover` engancha ese mismo
   `click`. Medido antes de tocar nada. Lo único que se sacó fue el
   camino del hover — y con él `attachHoverGrace()` y la clase
   `.is-hover`, que sin apertura por hover no tenían consumidores.

   ⚠️ El hover tiene que ser REAL (`page.hover`), no un `dispatchEvent`:
   los eventos sintéticos no disparan `:hover` de CSS, así que un test
   sintético daría verde sin medir nada.

   ⚠️ Y se mide `.is-open`, no la visibilidad: un panel puede VERSE
   abierto por `:focus-within` (el clic deja el foco en el botón) sin
   estar pineado. Eso fue justo el síntoma engañoso que reportó el
   relay al sacar el mecanismo — se ve bien y está roto. */
async function checkSoloClic(selectorCtl, selectorBtn, label) {
  await page.mouse.move(10, 10);
  await page.waitForTimeout(400);

  // 1 · pasar el mouse NO lo muestra. Se pregunta por lo que VE el
  //     alumno, no por la clase: el hover puede volver por el selector
  //     CSS sin que ninguna clase se agregue.
  await page.hover(selectorBtn);
  await page.waitForTimeout(500);
  if (await seVe(selectorCtl)) {
    failures.push(`${label}: el panel se mostró al pasar el mouse — los popovers abren SOLO por clic`);
  }

  // 2 · el clic lo muestra Y lo deja PINEADO (no solo visible por foco)
  await page.click(selectorBtn);
  await page.waitForTimeout(250);
  if (!await seVe(selectorCtl)) failures.push(`${label}: el clic no mostró el panel`);
  if (!await pineado(selectorCtl)) failures.push(`${label}: el clic debería dejarlo pineado con .is-open`);

  // 3 · alejar el mouse no lo cierra: ya no depende del hover
  await page.mouse.move(400, 500);
  await page.waitForTimeout(600);
  if (!await pineado(selectorCtl)) failures.push(`${label}: alejar el mouse lo cerró — abierto por clic tiene que quedarse`);

  // 4 · y un clic afuera lo cierra
  await page.mouse.click(200, 500);
  await page.waitForTimeout(250);
  if (await pineado(selectorCtl)) failures.push(`${label}: un clic afuera debería cerrarlo`);
  if (await seVe(selectorCtl)) failures.push(`${label}: tras el clic afuera el panel sigue visible`);
}

await checkSoloClic('[data-audio-ctl="sonido"]', '#d-sound', 'Sonido');
await checkSoloClic('[data-audio-ctl="locucion"]', '#d-narrate', 'Locución');
await checkSoloClic('[data-fab-ctl="config"]', '[data-fab-ctl="config"] .d-fab-btn', 'Configuración');
await checkSoloClic('[data-fab-ctl="ayuda"]', '[data-fab-ctl="ayuda"] .d-fab-btn', 'Ayuda');

/* ============================================================
   NUNCA DOS PANELES ABIERTOS A LA VEZ
   ------------------------------------------------------------
   ⚠️ ESTA ES LA MITAD QUE FALTABA, y la falta costó caro: el test
   llegó midiendo la gracia de cada popover DE A UNO, y con eso pasaba
   en verde en un curso donde el bug de exclusión estaba presente. Se
   promovió al kit diciendo que era "el test que habría atajado" ese
   bug — y no lo habría atajado. Un test que da confianza falsa es peor
   que no tenerlo (kit-base v1.9.86).

   El bug real: el CSS abre el panel con tres condiciones en OR
   —`:focus-within ∨ .is-hover ∨ .is-open`— y el cierre del hermano
   solo sacaba las clases. Un CLIC deja el foco en el botón, así que
   ese control seguía abierto por `:focus-within` mientras el mouse
   abría el siguiente.

   ⚠️ Y cómo se escribe importa: `dispatchEvent('mouseenter')` NO
   dispara `:hover` de CSS, así que un test sintético mide verde sobre
   el bug puesto. Hace falta movimiento real del mouse
   (`page.hover` / `page.mouse.move`), que es lo que se usa acá.
   ============================================================ */
const abiertos = () => page.evaluate(() => {
  const out = [];
  document.querySelectorAll('[data-audio-ctl], [data-fab-ctl]').forEach((ctl) => {
    const pop = ctl.querySelector('.d-audio-pop, .d-fab-pop');
    if (!pop) return;
    const cs = getComputedStyle(pop);
    const r = pop.getBoundingClientRect();
    const visible = cs.visibility !== 'hidden' && cs.opacity !== '0' &&
      cs.display !== 'none' && r.width > 4 && r.height > 4;
    if (visible) out.push(ctl.getAttribute('data-audio-ctl') || ctl.getAttribute('data-fab-ctl'));
  });
  return out;
});

/* Los pares que comparten fila o columna, que son los que el alumno
   recorre de corrido: se prueba cada uno en los dos sentidos. */
const PARES = [
  ['#d-sound', '#d-narrate', 'Sonido', 'Locución'],
  ['[data-fab-ctl="config"] .d-fab-btn', '[data-fab-ctl="ayuda"] .d-fab-btn', 'Configuración', 'Ayuda']
];

for (const [selA, selB, nomA, nomB] of PARES) {
  for (const [primero, segundo, nom1, nom2] of [[selA, selB, nomA, nomB], [selB, selA, nomB, nomA]]) {
    await page.mouse.move(10, 400);
    await page.waitForTimeout(300);

    // CLIC en el primero: lo fija Y le deja el foco al botón.
    await page.click(primero, { force: true });
    await page.waitForTimeout(250);
    const trasClic = await abiertos();
    if (trasClic.length !== 1) {
      failures.push(`clic en ${nom1}: quedaron ${trasClic.length} panel(es) abiertos (${trasClic.join(', ')}), esperaba 1`);
    }

    // Y ahora el mouse ENCIMA del hermano, con movimiento real.
    await page.hover(segundo);
    await page.waitForTimeout(350);
    const trasHover = await abiertos();
    if (trasHover.length > 1) {
      failures.push(`clic en ${nom1} y después el mouse sobre ${nom2}: quedaron ${trasHover.length} ` +
        `paneles abiertos a la vez (${trasHover.join(', ')}). El clic deja el foco en el botón y ` +
        '`:focus-within` mantiene abierto al hermano: sacar las clases no alcanza, hay que hacer blur().');
    }
  }
}
await page.mouse.move(10, 400);
await page.waitForTimeout(300);

/* ---- `.is-hover` no vuelve de contrabando ----
   El mecanismo que la ponía (`attachHoverGrace`) se borró en v1.9.89
   junto con la apertura por hover. Esta comprobación existe para que la
   clase no reaparezca en un selector CSS o en un `classList.add` sin su
   mecanismo detrás: sería un estado que el kit promete y nadie produce,
   o peor, la mitad de un comportamiento que ya no queremos. */
const quedanHover = await page.evaluate(() =>
  [...document.querySelectorAll('.is-hover')].map((el) =>
    el.getAttribute('data-audio-ctl') || el.getAttribute('data-fab-ctl') || el.className));
if (quedanHover.length) {
  failures.push('quedó `.is-hover` vivo en el DOM (' + quedanHover.join(', ') +
    '): el mecanismo que la ponía se borró, así que nadie debería agregarla');
}

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
report('popover-exclusivo', failures);
await browser.close();
