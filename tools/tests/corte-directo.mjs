#!/usr/bin/env node
/* corte-directo.mjs — kit-base v1.9.87
   ------------------------------------------------------------
   POR QUÉ EXISTE. Regla del cliente, textual: *"cada vez que hago clic
   en una solapa se hace un fundido, y el cambio debería ser corte
   directo. Esto pasa en los carruseles también: siempre corte directo,
   no fundidos."*

   Y sobre todo: **el primer intento de cumplirla dejó el kit PEOR que
   antes**. Se sacó la `transition` de `.d-shot-img` (CSS) y se dejó el
   JS que ponía y sacaba `.d-shot-img--fade` con dos timers de 110 ms.
   Sin la transición que la suavizaba, la opacidad cae a 0 DE GOLPE y se
   queda 220 ms — y como `.d-shot-img` tiene `background:#fff`, el
   resultado es un flash blanco duro. El cliente lo volvió a reportar.

   ⚠️ Un efecto vive en DOS archivos: el CSS que lo dibuja y el JS que
   lo dispara. Por eso este test NO busca la clase ni la regla CSS —
   eso es mirar una mitad. Mide el RESULTADO: que el `src` cambie
   dentro del propio clic y que la opacidad nunca baje de 1. Las dos
   formas de romperlo (dejar el CSS, dejar el JS) caen acá.

   Se arma su propio grupo de swap: un curso recién generado no tiene
   ninguno, y `initShotSwap` es del kit.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

if (!(await page.evaluate(() => typeof window.initShotSwap === 'function'))) {
  fails.push('initShotSwap no está expuesta — coto-media.js no se cargó');
} else {
  const r = await page.evaluate(async () => {
    const A = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    const B = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=';
    const sec = document.createElement('section');
    sec.setAttribute('data-slide', '__corte__');
    /* ⚠️ Los `srcs` viajan en el ATRIBUTO `data-shot-swap-srcs`, no en
       las opciones del init. Pasarlos por opciones da un falso "el src
       no cambió" (pisada real al escribir esto). */
    sec.innerHTML =
      '<div class="d-shot" data-shot data-shot-swap="__corte__" data-shot-swap-srcs="' + A + '|' + B + '">' +
      '<img class="d-shot-img" src="' + A + '">' +
      '<button data-shot-swap-go="1"></button></div>';
    document.body.appendChild(sec);
    const img = sec.querySelector('img');
    window.initShotSwap();

    const antes = img.getAttribute('src');
    sec.querySelector('[data-shot-swap-go]').click();
    // ¿el src ya cambió al volver del clic, sin esperar ningún timer?
    const sincrono = img.getAttribute('src') !== antes;

    // …y durante los 300 ms siguientes la imagen nunca se atenúa.
    let minOp = 1, clase = false;
    for (let i = 0; i < 20; i++) {
      minOp = Math.min(minOp, parseFloat(getComputedStyle(img).opacity));
      if (img.classList.contains('d-shot-img--fade')) clase = true;
      await new Promise((res) => setTimeout(res, 15));
    }
    sec.remove();
    return { sincrono, minOp, clase };
  });

  if (!r.sincrono) {
    fails.push('al cambiar de variante el `src` NO cambió dentro del propio clic: ' +
      'hay un timer en el medio, o sea que el cambio no es corte directo');
  }
  if (r.minOp < 1) {
    fails.push(`la imagen se atenúa al cambiar de variante (opacidad mínima ${r.minOp}). ` +
      'Con `background:#fff` debajo, eso se ve como un flash blanco, no como un fundido suave');
  }
  if (r.clase) {
    fails.push('volvió `.d-shot-img--fade`: es la mitad JS del fundido que se sacó en v1.9.87');
  }
}

report('corte-directo', fails, errors);
await browser.close();
