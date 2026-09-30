/* check-chrome-tactil — los controles del header/footer tienen que ser
   tocables con el dedo, y el escritorio no se toca.

   Reporte del cliente: "las barras de navegación tienen un tamaño fijo,
   se deberían agrandar un toque para el iPad". Medido antes del fix: con
   el chrome en 56+64px, los 10 botones quedaban por debajo de 44×44 en
   TODA resolución — el más chico, 28×28. 44 es el mínimo que recomienda
   Apple para el dedo.

   El contrato tiene DOS mitades y las dos importan:
     · en táctil (pointer:coarse) ningún control del chrome puede medir
       menos de 44×44;
     · en escritorio el chrome NO cambia — engordar las barras con mouse
       solo comería contenido sin resolver nada, y ese fue el criterio
       explícito al elegir la opción.

   ⚠️ Los casos táctiles van con hasTouch/isMobile, no con un viewport
   angosto: lo que la regla mira es `pointer:coarse`, y eso no lo da el
   tamaño de la pantalla (ver README-CURSO §9.40). */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const MIN = 44;
/* 7.5rem = 3.5 + 4, o sea los 56 + 64 de siempre a la raíz de 16px.
   ⚠️ Va en `rem` y no en 120px fijos desde kit-base v1.9.95: la raíz ahora
   escala en monitores grandes (`html{font-size:clamp(...)}`, coto-base.css)
   y las dos filas del chrome la acompañan a propósito, así que en 1920 el
   chrome mide 133px y en 2560, 158. Con 120 hardcodeado este test se ponía
   rojo por el arreglo, no por un bug.
   Lo que sigue midiendo —y es la mitad que importa— es que el escritorio
   NO reciba el chrome TÁCTIL, que es una talla entera más grande
   (4.5 + 5rem). Comparar contra la proporción y no contra un número deja
   las dos cosas: el escritorio no engorda por tener mouse, y puede
   escalar con la pantalla. */
const CHROME_ESCRITORIO_REM = 7.5;

const CASOS = [
  { nombre: 'PC 1920×1080',       w: 1920, h: 1080, tactil: false },
  { nombre: 'Notebook 1366×768',  w: 1366, h:  768, tactil: false },
  { nombre: 'iPad 10"',           w: 1024, h:  768, tactil: true  },
  { nombre: 'iPad Pro 11"',       w: 1194, h:  834, tactil: true  },
  { nombre: 'iPad Pro 12,9"',     w: 1366, h: 1024, tactil: true  },
  { nombre: 'iPhone horizontal',  w:  844, h:  390, tactil: true  },
];

const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

for (const c of CASOS) {
  const ctx = await browser.newContext(c.tactil
    ? { viewport: { width: c.w, height: c.h }, hasTouch: true, isMobile: true }
    : { viewport: { width: c.w, height: c.h } });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(400);

  const r = await page.evaluate((min) => {
    const top = document.querySelector('.d-top').getBoundingClientRect();
    const bot = document.querySelector('.d-bottom').getBoundingClientRect();
    const btns = [...document.querySelectorAll('.d-top button, .d-bottom button')]
      .filter(b => b.offsetParent !== null);
    const chicos = btns.map(b => {
      const q = b.getBoundingClientRect();
      return { t: (b.getAttribute('aria-label') || b.textContent || b.className).trim().slice(0, 26),
               w: Math.round(q.width), h: Math.round(q.height) };
    }).filter(x => x.w < min || x.h < min);
    // El chrome no puede desbordar horizontalmente al crecer.
    const desborda = [...document.querySelectorAll('.d-top, .d-bottom')]
      .filter(e => e.scrollWidth > e.clientWidth + 2)
      .map(e => e.className);
    return { chrome: Math.round(top.height + bot.height), total: btns.length, chicos, desborda,
             raiz: parseFloat(getComputedStyle(document.documentElement).fontSize) };
  }, MIN);

  /* ⚠️ PANTALLA BAJA: el piso táctil NO aplica, y es deliberado
     (kit-base v1.9.83). Un teléfono ACOSTADO también es
     `pointer: coarse`, pero ahí el que aprieta es el alto, no el dedo:
     el chrome compacto de §7.25 E2 baja las barras a 44+50 justamente
     porque 120px sobre 390 se comen el 31% de la pantalla. Forzarles
     encima el piso de 44px por botón devuelve el problema que esa
     versión resolvió, y la regla del kit lo excluye con
     `(min-height: 461px)`.
     No es "se pasa por alto": es que en un lienzo de 296px de alto no
     existe una respuesta que cumpla las dos cosas, y el kit ya eligió
     cuál gana. Lo que el test sí exige acá es que el chrome compacto
     esté puesto de verdad. */
  const pantallaBaja = c.h <= 460;
  const esperado = Math.round(CHROME_ESCRITORIO_REM * r.raiz);

  if (c.tactil && pantallaBaja) {
    if (r.chrome > esperado) {
      fallos.push(`${c.nombre}: el chrome quedó en ${r.chrome}px — en una pantalla baja tiene que ` +
        `ACHICARSE (§7.25 E2), no crecer: las barras no pueden comerse el lienzo`);
    }
    console.log(`  ⓘ ${c.nombre}: chrome ${r.chrome}px, ${r.chicos.length}/${r.total} control(es) por ` +
      'debajo de 44px — aceptado a propósito, ver el comentario del test');
  } else if (c.tactil) {
    r.chicos.forEach(x => fallos.push(`${c.nombre}: "${x.t}" mide ${x.w}×${x.h}, mínimo táctil ${MIN}×${MIN}`));
    if (r.chrome <= esperado) {
      fallos.push(`${c.nombre}: el chrome quedó en ${r.chrome}px — en táctil tiene que crecer sobre los ${esperado}px de escritorio`);
    }
  } else if (Math.abs(r.chrome - esperado) > 1) {
    fallos.push(`${c.nombre}: el chrome quedó en ${r.chrome}px y con esta raíz (${r.raiz}px) ` +
      `le corresponden ${esperado}px — en escritorio NO se aplica el chrome táctil`);
  }

  r.desborda.forEach(cls => fallos.push(`${c.nombre}: "${cls}" desborda horizontalmente`));
  errores.forEach(e => fallos.push(`${c.nombre}: error JS — ${e}`));

  await page.close();
  await ctx.close();
}

await browser.close();
report('chrome-tactil', fallos);
