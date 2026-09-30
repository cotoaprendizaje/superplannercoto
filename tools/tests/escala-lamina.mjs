#!/usr/bin/env node
/* escala-lamina.mjs — kit-base v1.9.90
   ------------------------------------------------------------
   POR QUÉ EXISTE. Tres reportes distintos del cliente —un recuadro
   cortado abajo, una devolución metida en una caja con scroll, un
   panel montado sobre el título— tenían un solo origen:

     un `[data-place]` se posiciona en % de la lámina, así que su CAJA
     escala sola; el texto y los espacios de adentro, si van en `rem`,
     NO. Medido en un curso real: 162 px de contenido dentro de un panel
     de 89.

   ⚠️ REGLA: si algo vive SOBRE LA LÁMINA, se mide en `em` de
   `--d-escala-lamina` o en `cqh` — nunca en `rem`. Un `rem` sobre la
   lámina es un tamaño que ignora el dispositivo.

   Lo que este test protege es la ESCALA misma, que es de donde cuelga
   toda la regla:
     1. `--d-escala-lamina` existe y resuelve a un número;
     2. en una PC 1440x900 vale 1rem exacto — o sea que adoptar la
        regla NO cambia nada en escritorio, que es lo que la hizo
        aplicable sin rehacer los cursos;
     3. en una tablet vertical es MENOR, porque ahí la lámina es una
        franja de la mitad de alto;
     4. y el componente del kit que la usa (`.d-repaso`) la sigue de
        verdad, en vez de quedarse en `rem`.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fails = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

async function medir(w, h) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url);
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape').catch(() => {});
  const r = await page.evaluate(() => {
    const st = document.querySelector('.d-stage');
    const sr = st.getBoundingClientRect();
    const arteH = Math.min(sr.height, sr.width / 2);
    /* La escala se resuelve pidiéndosela a un elemento real: en `:root`
       la variable todavía es la expresión sin calcular. */
    const sonda = document.createElement('div');
    sonda.style.cssText = 'position:absolute;font-size:var(--d-escala-lamina)';
    st.appendChild(sonda);
    const escala = parseFloat(getComputedStyle(sonda).fontSize);
    sonda.remove();
    /* Y el componente del kit que la usa. */
    const rep = document.createElement('div');
    rep.className = 'd-repaso';
    st.appendChild(rep);
    const fontRepaso = parseFloat(getComputedStyle(rep).fontSize);
    rep.remove();
    /* Y el panel de texto sobre la lámina (kit-base v1.9.99): es el
       caso que originó la regla —162px de contenido en un panel de 89—,
       y hasta acá no lo definía ninguna hoja del kit. */
    const info = document.createElement('div');
    info.className = 'd-info-panel';
    st.appendChild(info);
    const fontInfo = parseFloat(getComputedStyle(info).fontSize);
    info.remove();
    return { arteH: Math.round(arteH), escala, fontRepaso, fontInfo };
  });
  await page.close();
  return r;
}

const pc = await medir(1440, 900);
const vertical = await medir(834, 1112);

if (!pc.escala || Number.isNaN(pc.escala)) {
  fails.push('`--d-escala-lamina` no está definida o no resuelve a un número');
} else {
  /* 720 px de lámina (PC 1440x900) tiene que dar 1rem clavado: es lo
     que hace que la regla se pueda adoptar sin retocar escritorio. */
  if (Math.abs(pc.escala - 16) > 0.1) {
    fails.push(`en PC 1440x900 la escala debería ser 1rem (16px) para no cambiar nada en escritorio, dio ${pc.escala}px ` +
      `(lámina ${pc.arteH}px)`);
  }
  if (!(vertical.escala < pc.escala - 1)) {
    fails.push(`en tablet vertical la escala debería ser MENOR que en PC —la lámina mide ${vertical.arteH}px ` +
      `contra ${pc.arteH}px— y dio ${vertical.escala}px contra ${pc.escala}px`);
  }
  if (Math.abs(vertical.fontRepaso - vertical.escala) > 0.5) {
    fails.push('`.d-repaso` no sigue `--d-escala-lamina`: su font-size es ' +
      `${vertical.fontRepaso}px y la escala ${vertical.escala}px. Un componente que se apoya en la lámina ` +
      'no puede quedarse en `rem`.');
  }
  if (Math.abs(vertical.fontInfo - vertical.escala) > 0.5) {
    fails.push('`.d-info-panel` no sigue `--d-escala-lamina`: su font-size es ' +
      `${vertical.fontInfo}px y la escala ${vertical.escala}px. Es el panel que dio origen a la regla ` +
      '(162px de contenido en una caja de 89 en un iPad vertical).');
  }
}

await browser.close();
report('escala-lamina', fails);
