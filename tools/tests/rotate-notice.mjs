/* rotate-notice.mjs — kit-base v1.9.93
   Confirma el aviso "Girá tu dispositivo" (.d-rotate-notice,
   coto-shot-stage.css): visible SOLO cuando el .d-stage queda más
   alto que ancho Y el dispositivo PUEDE girar, invisible en cualquier
   landscape (desktop, tablet horizontal, teléfono horizontal).
   Resuelve la limitación documentada sin resolver en CLAUDE.md §6.56.

   ⚠️ Este encabezado decía "sin importar si el viewport es táctil o
   no", y era el contrato de verdad hasta v1.9.92 — con la consecuencia
   que reportó el cliente: **en una PC, angostar la ventana sacaba el
   cartel** (§7.41 K33). La forma del lienzo sola nunca fue la pregunta:
   si el dispositivo no rota, "girá tu dispositivo" propone algo
   imposible y encima tapa el curso.

   Los dos casos de escritorio angosto de abajo son ESE bug. Sin la
   guarda de `initAvisoGirar` este test se pone rojo en los dos —
   verificado, no supuesto. Los casos táctiles siguen igual: lo que
   cambió es a quién se le habla, no cuándo. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });

/* `punteroFino` sintetiza EL MONITOR TÁCTIL DE ESCRITORIO: pantalla
   táctil (`maxTouchPoints > 0`) pero mouse como puntero primario, o sea
   `pointer: coarse` en false. Ningún perfil de dispositivo de Playwright
   da esa combinación —`hasTouch` emula una tablet y responde `coarse`
   true, medido—, así que se fuerza el `matchMedia` de esa consulta.
   Es un dispositivo armado a mano y conviene saberlo: lo que prueba es
   que la guarda mire el puntero PRIMARIO y no `any-pointer`. Sin este
   caso, cambiar `pointer` por `any-pointer` —el error más fácil de
   cometer acá— daba verde: verificado.

   ⚠️ Lo que este test NO cubre, y conviene que esté escrito: la otra
   mitad de la guarda, `maxTouchPoints > 0`. Sacarla deja los siete
   casos en verde —verificado— porque el dispositivo del que protege
   (puntero grueso SIN pantalla táctil: un navegador de TV o de consola)
   no se puede emular acá. Queda cubierta por el comentario de
   `initAvisoGirar`, no por una medición. */
async function visible(viewport, isMobile, punteroFino) {
  const page = await browser.newPage({
    viewport, isMobile: !!isMobile, hasTouch: !!(isMobile || punteroFino)
  });
  if (punteroFino) {
    await page.addInitScript(() => {
      const mm = window.matchMedia.bind(window);
      window.matchMedia = (q) => (q === '(pointer: coarse)'
        ? { matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
        : mm(q));
    });
  }
  await page.goto(url);
  await page.waitForTimeout(400);
  const disp = await page.evaluate(() => getComputedStyle(document.querySelector('.d-rotate-notice')).display);
  await page.close();
  return disp !== 'none';
}

const casos = [
  { nombre: 'teléfono portrait angosto (390x844)', viewport: { width: 390, height: 844 }, isMobile: true, esperado: true },
  { nombre: 'tablet portrait (768x1024)', viewport: { width: 768, height: 1024 }, isMobile: true, esperado: true },
  { nombre: 'desktop 1600x900', viewport: { width: 1600, height: 900 }, esperado: false },
  /* El bug del cliente: una PC con la ventana angosta tiene el lienzo
     MÁS ALTO QUE ANCHO, igual que una tablet vertical. La diferencia no
     está en la forma, está en que acá no hay nada que girar. */
  { nombre: 'PC con la ventana angostada (600x900)', viewport: { width: 600, height: 900 }, esperado: false },
  { nombre: 'PC con la ventana angostada (500x800)', viewport: { width: 500, height: 800 }, esperado: false },
  { nombre: 'tablet landscape (1024x768)', viewport: { width: 1024, height: 768 }, isMobile: true, esperado: false },
  { nombre: 'teléfono landscape (844x390)', viewport: { width: 844, height: 390 }, isMobile: true, esperado: false },
  /* Monitor táctil de escritorio, en vertical: tiene pantalla táctil,
     pero el puntero primario es el mouse y el monitor no rota. */
  { nombre: 'monitor táctil de escritorio (600x900)', viewport: { width: 600, height: 900 }, punteroFino: true, esperado: false },
];

const failures = [];
for (const c of casos) {
  const v = await visible(c.viewport, c.isMobile, c.punteroFino);
  console.log(c.nombre, '-> visible:', v, '(esperado:', c.esperado, ')');
  if (v !== c.esperado) failures.push(c.nombre + ': se esperaba visible=' + c.esperado + ', dio ' + v);
}
report('rotate-notice', failures);
await browser.close();
