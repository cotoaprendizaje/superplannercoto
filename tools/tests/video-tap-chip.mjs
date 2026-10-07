/* check-video-tap-chip — el control de sonido del video de fondo tiene
   que ser legible, tocable y estar donde no tape el arte.

   Dos bugs reales que fija (los dos aparecieron recién cuando el botón
   empezó a mostrarse de verdad en iPad, ver README-CURSO §9.43):

   1 · El CSS lo dibujaba como un círculo de 76px pensado para un ícono
       SVG que el marcado NO tenía, así que el texto se renderizaba
       crudo adentro, apretado y diminuto.
   2 · Decía "reproducir" cuando lo que ofrece es el AUDIO: el video ya
       arranca solo, muteado. Un ▶ sobre un video que se está viendo es
       engañoso.

   El test recorre las 4 diapositivas con video de fondo y fuerza el
   control visible (en un navegador de escritorio el autoplay puede no
   ser rechazado, así que esperar a que aparezca solo haría el test
   inestable — lo que se verifica es cómo SE VE cuando aparece). */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MIN_TACTIL = 44;
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
/* El botón de la portada viene con un ÍCONO PROPIO y sin `<span>`
   (kit-base v1.9.122, §7.71): es el marcado de "Uso de Sucursales 3 -
   NOA", donde el kit lo dejaba sin texto. Se le pone antes de que arranque
   el curso; el vacío del boilerplate lo cubren los demás tests de video. */
await page.addInitScript(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const t = document.querySelector('.d-shot-video-tap');
    if (t) t.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  }, true);
});
await page.goto(url);
await page.waitForTimeout(900);
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(400);

const slides = await page.evaluate(() =>
  [...document.querySelectorAll('.d-shot-slide--bg-video[data-slide]')].map(s => s.dataset.slide));

/* NO SE EJECUTA en un curso sin video de fondo (kit-base v1.9.83,
   mismo criterio que `simulador.mjs` y los otros dos tests de video):
   un curso recién generado no tiene ninguna diapositiva con arte
   todavía, y un test que le falla a un curso al que no le corresponde
   enseña a ignorar la suite. */
if (slides.length === 0) {
  console.log('  · el curso no tiene ninguna diapositiva con video de fondo: nada que revisar.');
  await page.close();
  await ctx.close();
  await browser.close();
  report('video-tap-chip', []);
  process.exit(process.exitCode || 0);
}

for (const id of slides) {
  const r = await page.evaluate(async (slideId) => {
    window.motor.gotoId(slideId);
    await new Promise(r => setTimeout(r, 700));
    const sl = document.querySelector('.slide.is-active');
    const tap = sl.querySelector('.d-shot-video-tap');
    if (!tap) return { falta: true };
    tap.hidden = false;
    await new Promise(r => setTimeout(r, 200));
    const q = tap.getBoundingClientRect();
    const shot = sl.querySelector('.d-shot').getBoundingClientRect();
    const svg = tap.querySelector('svg');
    const span = tap.querySelector('span');
    // ¿el contenido entra en la caja, o se está desbordando como antes?
    const desborda = tap.scrollWidth > tap.clientWidth + 1 || tap.scrollHeight > tap.clientHeight + 1;
    // ¿tapa el centro del arte, donde viven títulos y logo?
    const cx = shot.left + shot.width / 2, cy = shot.top + shot.height / 2;
    const tapaCentro = q.left < cx && q.right > cx && q.top < cy && q.bottom > cy;
    return {
      w: Math.round(q.width), h: Math.round(q.height),
      texto: (span && span.textContent.trim()) || '',
      tieneIcono: !!svg, aria: tap.getAttribute('aria-label') || '',
      desborda, tapaCentro,
      dentro: q.left >= shot.left - 1 && q.right <= shot.right + 1 && q.bottom <= shot.bottom + 1,
    };
  }, id);

  if (r.falta) { fallos.push(`${id}: no tiene .d-shot-video-tap`); continue; }
  if (!r.tieneIcono) fallos.push(`${id}: el control no tiene ícono — el CSS lo estiliza esperando uno`);
  if (!r.texto) fallos.push(`${id}: el control no tiene texto visible; un ícono suelto no comunica qué hace`);
  if (/reproducir/i.test(r.texto)) {
    fallos.push(`${id}: el texto visible dice "${r.texto}" — el video YA arranca solo, lo que ofrece es el audio`);
  }
  if (!r.aria) fallos.push(`${id}: el control se quedó sin nombre accesible (aria-label)`);
  if (r.desborda) fallos.push(`${id}: el contenido desborda la caja del control (${r.w}×${r.h})`);
  if (r.h < MIN_TACTIL) fallos.push(`${id}: el control mide ${r.w}×${r.h}, mínimo táctil ${MIN_TACTIL}`);
  if (r.tapaCentro) fallos.push(`${id}: el control tapa el centro del arte, donde viven título y logo`);
  if (!r.dentro) fallos.push(`${id}: el control se sale de la caja del arte`);
}

/* ---- El chip de la PRIMERA diapositiva es el botón de EMPEZAR ----
   kit-base v1.9.88. En iOS no hay forma de que el audio arranque solo
   —Safari exige un gesto— así que en la portada el chip deja de ser un
   aviso y pasa a ser el botón de inicio del curso, para que ese paso no
   se vea como un error.

   ⚠️ Esta aserción existe por un bug REAL del parche que trajo la
   función: rotulaba `inicio` solo al inicializar, y el reintento mudo
   de `attempt()` volvía a rotular el chip como `sonido` a los
   milisegundos — justo en el camino que corre en la portada cuando el
   navegador bloquea el autoplay, o sea el caso exacto para el que la
   función existe. El "Tocá para comenzar" no lo veía nadie, y nada
   fallaba. Se mide `data-modo` DESPUÉS de que el video se estabilice,
   no al cargar. */
const primera = await page.evaluate(async () => {
  await new Promise((r) => setTimeout(r, 900));
  const sl = document.querySelector('[data-slide]');
  const tap = sl && sl.querySelector('.d-shot-video-tap');
  if (!tap) return null;
  return { id: sl.getAttribute('data-slide'), modo: tap.getAttribute('data-modo'),
           texto: (tap.textContent || '').trim() };
});
if (primera) {
  if (primera.modo !== 'inicio') {
    fallos.push(`la primera diapositiva ("${primera.id}") tiene el chip en modo "${primera.modo}": ` +
      'ahí tiene que ser el botón de empezar el curso (modo "inicio"), no un aviso de audio');
  }
  if (primera.modo === 'inicio' && !/comenzar|empezar/i.test(primera.texto)) {
    fallos.push(`el chip de inicio dice "${primera.texto}" — tiene que invitar a COMENZAR el curso`);
  }
}

await page.close();
await ctx.close();
await browser.close();
report('video-tap-chip', fallos);
