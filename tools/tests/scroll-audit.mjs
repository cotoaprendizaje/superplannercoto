#!/usr/bin/env node
/* scroll-audit.mjs — kit-base v1.0
   Cero scroll de página en NINGUNA diapositiva, en un set de tamaños
   de ventana representativos (incluye algunos achatados/angostos, no
   solo 16:9 de escritorio, para agarrar overflow que solo aparece en
   pantallas atípicas). Chequea overflow vertical Y horizontal. */
import { chromium } from 'playwright-core';
import { report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const VIEWPORTS = [
  { w: 1920, h: 1080, label: '1920×1080' },
  { w: 1366, h: 768, label: '1366×768' },
  { w: 1440, h: 900, label: '1440×900' },
  { w: 1280, h: 720, label: '1280×720 (angosta)' },
  { w: 1024, h: 1366, label: '1024×1366 (tablet vertical)' },
  { w: 1024, h: 768, label: '1024×768 (iPad horizontal)' },
  { w: 1366, h: 1024, label: '1366×1024 (iPad Pro horizontal)' },
  { w: 768, h: 1024, label: '768×1024 (iPad chico vertical)' },
  /* TELÉFONO ACOSTADO (kit-base v1.9.65). Punto ciego estructural de
     esta lista hasta acá: los 6 viewports de arriba tenían 720px de
     alto como mínimo, así que NINGUNO probaba el caso donde lo que
     falta es ALTO y no ancho. Costó caro — el minijuego de "Seguridad
     alimentaria" dejaba 3 de 12 opciones físicamente inalcanzables a
     844×390, con la suite en 7/7: un curso imposible de terminar
     desde el celular acostado, y todos los tests en verde (§7.12).
     Toda la escalera responsive del kit está pensada por ancho, así
     que este es el eje que hay que vigilar aparte. */
  { w: 844, h: 390, label: '844×390 (teléfono acostado)' },
  { w: 932, h: 430, label: '932×430 (teléfono grande acostado)' }
];

const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const fails = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(url);
  await page.waitForTimeout(500);
  await page.keyboard.press('Escape').catch(() => {});

  /* BUG REAL encontrado en tablet (iPad 1024px) con un nombre real de
     alumno: sin él, `#d-greet` (el saludo "👋 Hola, Nombre") queda
     hidden en cualquier corrida automática — no hay LMS real dando
     `cmi.core.student_name` — así que este chequeo SIEMPRE corría con
     el header en su versión más angosta posible, nunca con el ancho
     real que un alumno de verdad genera. Se simula acá, una vez por
     viewport, con un nombre deliberadamente largo (peor caso real,
     no el más corto) para que la barra se mida en las condiciones
     que de verdad importan. */
  await page.evaluate(() => {
    const el = document.getElementById('d-greet');
    if (!el) return;
    el.textContent = '';
    const ic = document.createElement('span');
    ic.className = 'ic'; ic.setAttribute('aria-hidden', 'true'); ic.textContent = '👋';
    el.appendChild(ic);
    el.appendChild(document.createTextNode(' Hola, Alejandra Fernandez'));
    el.hidden = false;
  });

  /* Chequeo aparte del de scroll de página: `body{overflow:hidden}`
     (kit-base, a propósito — CLAUDE.md) tapa cualquier overflow a
     nivel documento, así que un `.d-top`/`.d-bottom` más ancho que la
     ventana (bug real de CSS Grid: la columna implícita de `.d-app`
     sin `minmax(0,1fr)` crece con el min-content de sus hijos
     `flex:none` en vez de respetar el ancho fijo del contenedor) queda
     invisible para `document.documentElement.scrollWidth` — hay que
     medir la barra en sí. */
  const barOverflow = await page.evaluate(() => {
    const vw = window.innerWidth;
    const top = document.querySelector('.d-top');
    const bottom = document.querySelector('.d-bottom');
    return {
      top: top ? top.scrollWidth - vw : 0,
      bottom: bottom ? bottom.scrollWidth - vw : 0
    };
  });
  if (barOverflow.top > 2) fails.push(`[${vp.label}] .d-top se desborda ${barOverflow.top}px con un nombre real en el saludo`);
  if (barOverflow.bottom > 2) fails.push(`[${vp.label}] .d-bottom se desborda ${barOverflow.bottom}px con un nombre real en el saludo`);

  const slideIds = await page.evaluate(() => Array.from(document.querySelectorAll('[data-slide]')).map(s => s.getAttribute('data-slide')));
  for (const id of slideIds) {
    /* Navegación por el motor + verificación (kit-base v1.9.65, helper
       compartido). Antes clickeaba el índice, que en un curso con gate
       está `disabled`: este test venía midiendo la misma diapositiva
       alcanzable una y otra vez y reportando 0 fallos. Ver `irASlide`. */
    const llego = await irASlide(page, id);
    if (llego !== id) {
      fails.push(`[${vp.label}] no se pudo navegar a "${id}" (quedó en "${llego}") — NO auditada`);
      continue;
    }
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const out = {
        vScroll: doc.scrollHeight - doc.clientHeight,
        hScroll: doc.scrollWidth - doc.clientWidth,
        recorte: 0
      };
      /* "Sin scroll" NO alcanza como criterio. Bug real en "Prevención
         cardiovascular": el contenido de la mini práctica medía 860px
         contra 600 disponibles, pero como .slide-inner está centrado y
         la diapositiva recorta lo que sobra, la PÁGINA no scrolleaba —
         simplemente el encabezado de la actividad quedaba cortado y
         fuera de alcance, que es peor que un scroll. Hay que comparar
         el alto real del contenido contra el de su diapositiva. */
      const slide = document.querySelector('[data-slide]:not([hidden])');
      // Solo los .slide-inner que están REALMENTE en pantalla: el cierre
      // tiene uno oculto (el resumen, display:none) y medirlo daba un
      // recorte falso igual al alto del encabezado — falsa alarma
      // detectada al estrenar este chequeo.
      const inner = slide && Array.from(slide.querySelectorAll('.slide-inner'))
        .find(el => el.offsetParent !== null && el.getBoundingClientRect().height > 0);
      if (inner) {
        const ir = inner.getBoundingClientRect(), sr = slide.getBoundingClientRect();
        out.recorte = Math.round(Math.max(sr.top - ir.top, ir.bottom - sr.bottom));
      }
      return out;
    });
    if (overflow.vScroll > 2) fails.push(`[${vp.label}] data-slide="${id}": scroll vertical de ${overflow.vScroll}px`);
    if (overflow.hScroll > 2) fails.push(`[${vp.label}] data-slide="${id}": scroll horizontal de ${overflow.hScroll}px`);
    if (overflow.recorte > 2) fails.push(`[${vp.label}] data-slide="${id}": el contenido se recorta ${overflow.recorte}px (no hay scroll, pero queda fuera de alcance)`);

    /* ---- Lo ACCIONABLE, uno por uno (kit-base v1.9.94) ----
       FALSO NEGATIVO REAL, y de los caros: los tres chequeos de arriba
       miran el DOCUMENTO y `.slide-inner`, que son PROXIES. Medido en
       "Prevención cardiovascular" a 844x390: se acotó `.slide-inner` con
       `max-height:100%`, este test se puso en VERDE —el recorte pasó a
       0 porque `.slide-inner` ya entraba— y el botón "Responder" de la
       mini práctica seguía 34px POR DEBAJO del borde de la diapositiva,
       exactamente igual de inalcanzable que antes. El contenido
       desbordaba hacia adentro de un contenedor acotado, invisible para
       una medición de cajas.

       O sea: un curso podía quedar imposible de terminar desde el
       teléfono acostado con este test en verde. Es la misma forma de
       falla que §7.12 (3 de 12 opciones del minijuego inalcanzables con
       la suite en 7/7), y por eso acá se mide lo que de verdad importa:
       cada elemento accionable contra el borde de SU diapositiva.

       El `scrolleable` no es una concesión: un elemento dentro de una
       caja que scrollea SÍ se alcanza —es el patrón correcto cuando el
       contenido no entra— así que contarlo daría un falso positivo en
       todo curso bien resuelto. Lo que se busca es lo que no tiene
       ninguna forma de llegar a pantalla. */
    const inalcanzables = await page.evaluate((sid) => {
      const sl = document.querySelector(`[data-slide="${sid}"]`);
      if (!sl) return [];
      const sr = sl.getBoundingClientRect();
      const fuera = [];
      const SEL = 'button, a[href], input, select, textarea, label.d-opt, [role="button"], [data-hit]';
      sl.querySelectorAll(SEL).forEach((el) => {
        if (el.closest('[hidden]') || el.offsetParent === null || el.disabled) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        /* ¿vive dentro de algo que scrollea, entre el elemento y la
           diapositiva? Entonces se llega scrolleando. */
        let n = el.parentElement, scrolleable = false;
        while (n && n !== sl) {
          const cs = getComputedStyle(n);
          const puede = /auto|scroll/.test(cs.overflowY + cs.overflowX);
          if (puede && (n.scrollHeight > n.clientHeight + 2 || n.scrollWidth > n.clientWidth + 2)) {
            scrolleable = true; break;
          }
          n = n.parentElement;
        }
        if (scrolleable) return;
        const px = Math.round(Math.max(0, sr.top - r.top, r.bottom - sr.bottom,
                                          sr.left - r.left, r.right - sr.right));
        if (px > 2) {
          const nombre = (el.textContent || '').trim().slice(0, 34) ||
                         el.getAttribute('aria-label') || el.className.slice(0, 34) || el.tagName;
          fuera.push(`"${nombre}" queda ${px}px fuera`);
        }
      });
      return fuera;
    }, id);
    inalcanzables.forEach((m) => fails.push(
      `[${vp.label}] data-slide="${id}": ${m} del borde de su diapositiva, y no hay ningún ` +
      'contenedor que scrollee para llegar — es un control que el alumno no puede usar.'));
  }
  await page.close();
}

report('scroll-audit', fails);
await browser.close();
