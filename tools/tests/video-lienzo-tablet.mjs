/* check-video-lienzo-tablet — las slides con VIDEO de fondo no pueden
   recortar de costado en pantallas más angostas que 2:1.

   Regresión de README-CURSO §9.37. El arte de los videos NO respeta el
   margen lateral del 13% que la rama de "llenar y recortar" del
   @container da por sentado (portada deja 3,0% libre a la derecha), así
   que en tablet el recorte se come contenido real. Este test fija las
   dos mitades del contrato:

     · stage MÁS ANGOSTO que 2:1 (iPads, 16:10) → el .d-shot de una
       --bg-video **marcada con `data-arte-sin-margen`** vuelve al
       lienzo 2:1 exacto, con banda. Cero recorte.
     · stage 2:1 o MÁS ANCHO (16:9 puro) → sigue llenando el stage, sin
       cambios. Acá `cover` recorta ALTO, no ancho, y no hay nada que
       arreglar.

   El letterbox es OPT-IN desde kit-base v1.9.8x (pedido explícito del
   cliente: *"los otros no me importa que por ahora hagan zoom, así que
   sacale las franjas"*). Solo se exporta con margen el arte que el
   diseñador rehizo; el resto llena y recorta A PROPÓSITO. Por eso la
   expectativa de banda vale ÚNICAMENTE para las slides marcadas: una
   `--bg-video` sin el atributo tiene que llenar en TODA resolución, y
   que llene no es un bug que este test deba reportar.

   Y la mitad que importa para no pasarse de rosca: las láminas
   --bg-layered NO se tocan en ninguna resolución (ahí el recorte solo
   se come decoración, y achicarlas costaría legibilidad del texto). */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

/* [nombre, viewport w, h, esperaBandaEnVideo] — los ratios de stage que
   producen salen de restar el chrome fijo (~120px) al alto del viewport. */
const CASOS = [
  ['PC 1920x1080 (16:9 exacto)', 1920, 1080, false],
  ['PC 1600x900',                1600,  900, false],
  ['Notebook 1366x768',          1366,  768, false],
  ['Monitor 16:10 1920x1200',    1920, 1200, true ],
  ['iPad Pro 11"',               1194,  834, true ],
  ['iPad 10"',                   1024,  768, true ],
  ['iPad Pro 12,9"',             1366, 1024, true ],
];

const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

/* ---- NO SE EJECUTA en un curso sin video de fondo (kit-base v1.9.82).
   El test llegó dando por sentado que la portada es `--bg-video` y que
   existe una diapositiva llamada "introduccion" — las dos cosas son
   ciertas en el curso del que salió y falsas en un curso recién
   generado, donde no hay NINGUNA diapositiva con arte todavía. Sin
   este guard, un curso nuevo arrancaba con el test en rojo por no
   tener contenido, que es la forma más rápida de enseñar a ignorar la
   suite (mismo criterio que `simulador.mjs`, §7.27).
   De paso, la lámina `--bg-layered` de control se busca en el
   documento en vez de nombrarse a mano. */
const sonda = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await sonda.goto(url);
await sonda.waitForTimeout(500);
const piezas = await sonda.evaluate(() => {
  const v = document.querySelector('section.slide.d-shot-slide--bg-video[data-slide]');
  const l = document.querySelector('section.slide.d-shot-slide--bg-layered[data-slide]');
  return { video: v && v.dataset.slide, layered: l && l.dataset.slide };
});
await sonda.close();
if (!piezas.video) {
  console.log('  · el curso no tiene ninguna diapositiva `--bg-video`: nada que revisar.');
  await browser.close();
  report('video-lienzo-tablet', []);
  process.exit(process.exitCode || 0);
}

for (const [nombre, w, h, esperaBanda] of CASOS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url);
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);

  const medir = (id) => page.evaluate((slideId) => {
    if (slideId) window.motor.gotoId(slideId);
    // el 700ms de abajo es la transición entre diapositivas
    return new Promise(r => setTimeout(() => {
      const st = document.querySelector('.d-stage').getBoundingClientRect();
      const sl = document.querySelector('.slide.is-active');
      const sh = sl.querySelector('.d-shot').getBoundingClientRect();
      r({
        slide: sl.dataset.slide,
        video: sl.classList.contains('d-shot-slide--bg-video'),
        sinMargen: sl.hasAttribute('data-arte-sin-margen'),
        sw: Math.round(st.width), sh: Math.round(st.height),
        cw: Math.round(sh.width), ch: Math.round(sh.height),
      });
    }, slideId ? 700 : 0));
  }, id);

  const vid = await medir(piezas.video);
  const lay = piezas.layered ? await medir(piezas.layered) : null;

  if (!vid.video) { fallos.push(`${nombre}: "${piezas.video}" dejó de ser --bg-video`); await page.close(); continue; }

  const ratio = vid.sw / vid.sh;
  const llenaVideo = vid.cw === vid.sw && vid.ch === vid.sh;
  const ratioShot = vid.cw / vid.ch;

  /* La mitad opt-in: sin `data-arte-sin-margen`, la slide llena y
     recorta a propósito en cualquier ratio. */
  if (esperaBanda && !vid.sinMargen) {
    if (!llenaVideo) {
      fallos.push(`${nombre} (ratio ${ratio.toFixed(3)}): "${vid.slide}" NO está marcada con ` +
        `data-arte-sin-margen pero dejó de llenar el stage (${vid.cw}x${vid.ch} en ${vid.sw}x${vid.sh}) — ` +
        `el letterbox es opt-in`);
    }
  } else if (esperaBanda) {
    if (llenaVideo) {
      fallos.push(`${nombre} (ratio ${ratio.toFixed(3)}): el video llena el stage — recorta de costado, tiene que volver al lienzo 2:1`);
    } else if (Math.abs(ratioShot - 2) > 0.02) {
      fallos.push(`${nombre}: el .d-shot del video quedó en ${ratioShot.toFixed(3)}:1, se esperaba 2:1 (${vid.cw}x${vid.ch})`);
    }
  } else if (!llenaVideo) {
    fallos.push(`${nombre} (ratio ${ratio.toFixed(3)}): el video dejó de llenar el stage — 16:9 puro no tiene que cambiar (${vid.cw}x${vid.ch} en ${vid.sw}x${vid.sh})`);
  }

  if (lay && !(lay.cw === lay.sw && lay.ch === lay.sh)) {
    fallos.push(`${nombre}: la lámina --bg-layered "${lay.slide}" dejó de llenar el stage (${lay.cw}x${lay.ch} en ${lay.sw}x${lay.sh}) — la excepción es solo para --bg-video`);
  }

  await page.close();
}

/* Segundo chequeo, independiente del anterior y el que de verdad
   separa "recorte cosmético" de "bug funcional": ningún elemento
   interactivo puede caer en la franja que el peor caso recorta.

   Las láminas `--bg-layered` siguen llenando y recortando a propósito
   (ahí solo se come decoración), así que la garantía no es "no se
   recorta nada" sino "no se recorta nada CLICKEABLE". Un [data-hit] a
   menos de 12,22% del borde sería un botón invisible en un iPad Pro
   12,9", y eso no se ve mirando la pantalla en una PC.

   Ojo con el método: la primera vuelta de este diagnóstico midió el
   margen con un detector de bordes por gradiente sobre el arte, y dio
   falsos positivos en masa — marcaba texturas de puntos y blobs de
   fondo como si fueran contenido. "Hay tinta cerca del borde" no es
   "hay contenido cerca del borde". Los [data-l]/[data-w] declarados sí
   son contenido que importa, y son exactos. */
const CROP_PEOR = 12.22; // iPad Pro 12,9", el stage más angosto soportado
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
  const invasores = await page.evaluate((crop) => {
    const out = [];
    document.querySelectorAll('section.slide').forEach(sl => {
      sl.querySelectorAll('[data-hit], [data-place]').forEach(h => {
        const l = parseFloat(h.getAttribute('data-l'));
        const w = parseFloat(h.getAttribute('data-w'));
        if (isNaN(l)) return;
        const der = l + (isNaN(w) ? 0 : w);
        if (l < crop || der > 100 - crop) {
          out.push(`${sl.dataset.slide} · "${(h.textContent || '').trim().slice(0, 38) || h.className}" ocupa ${l.toFixed(1)}–${der.toFixed(1)}%`);
        }
      });
    });
    return out;
  }, CROP_PEOR);
  invasores.forEach(i => fallos.push(`elemento interactivo dentro de la franja recortada (±${CROP_PEOR}%): ${i}`));
  await page.close();
}

await browser.close();
report('video-lienzo-tablet', fallos);
