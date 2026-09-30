#!/usr/bin/env node
/* prediccion.mjs — kit-base v1.9.99
   ------------------------------------------------------------
   POR QUÉ EXISTE. El componente `.d-pred*` (una pregunta suelta antes
   de un video) estuvo en `coto-base-addendum-v1.8.css` desde v1.8 SIN
   el JS que lo hace andar. "Seguridad alimentaria" se escribió el suyo a
   mano con otros nombres y chocó con el `.d-pred-fb` del kit: la caja
   del kit (padding + radio) se colaba en su párrafo y lo corría — el
   cliente lo reportó como "desfasado". `initPrediccion()` (coto-ui.js)
   es el cable que faltaba; esto verifica que ande de punta a punta.

   Se arma su propio bloque, como `minijuego` y `objetivos-progreso`: un
   curso recién generado no tiene ninguno, y un guard de "si no hay,
   salteo" se saltearía siempre.

   Lo que verifica, contestando mal a propósito (el caso que más cosas
   tiene que hacer bien):
     1. la opción elegida queda marcada y TODAS se deshabilitan
        (se contesta una vez);
     2. aparece la devolución del caso "no", con su estilo del kit;
     3. aparece el botón para seguir;
     4. la devolución se narra, una sola vez aunque se llame dos veces
        a `initPrediccion()`;
     5. y el curso generado la llama en su boot (el cable).
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const { browser, page, errors } = await openCourse(url);

const r = await page.evaluate(async () => {
  if (typeof window.initPrediccion !== 'function') return { sinFuncion: true };
  const dichos = [];
  if (window.Narrador) {
    window.Narrador.setNarrating(true);
    const orig = window.Narrador.speak;
    window.Narrador.speak = function (t) { dichos.push(t); };
  }
  const slide = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
  const caja = document.createElement('div');
  caja.innerHTML =
    '<div class="d-pred" data-pred data-pred-fb-ok="BIEN" data-pred-fb-no="NO PASA NADA">' +
    '  <p class="d-pred-q">¿Qué se hace primero?</p>' +
    '  <div class="d-pred-opts">' +
    '    <button type="button" class="d-pred-opt" data-pred-opt data-pred-ok>Correcta</button>' +
    '    <button type="button" class="d-pred-opt" data-pred-opt>Incorrecta</button>' +
    '  </div>' +
    '  <p class="d-pred-fb" data-pred-fb hidden></p>' +
    '  <button type="button" class="btn btn-cat" data-pred-continue hidden>Continuar</button>' +
    '</div>';
  slide.appendChild(caja);
  window.initPrediccion();
  window.initPrediccion();   // dos veces a propósito: no tiene que atar dos veces
  const b = caja.querySelectorAll('[data-pred-opt]');
  b[1].click();
  await new Promise((res) => setTimeout(res, 50));
  const fb = caja.querySelector('[data-pred-fb]');
  const cs = getComputedStyle(fb);
  const out = {
    marcada: b[1].classList.contains('is-no'),
    todasDeshabilitadas: Array.from(b).every((x) => x.disabled),
    fbVisible: !fb.hidden, fbTexto: fb.textContent, fbClase: fb.classList.contains('is-no'),
    fbFondo: cs.backgroundColor,
    seguirVisible: !caja.querySelector('[data-pred-continue]').hidden,
    dichos
  };
  caja.remove();
  return out;
});

if (r.sinFuncion) {
  fallos.push('`initPrediccion` no está publicada: coto-ui.js no se cargó o no la exporta.');
} else {
  if (!r.marcada) fallos.push('la opción elegida (incorrecta) no quedó marcada con `.is-no`.');
  if (!r.todasDeshabilitadas) fallos.push('después de contestar, las opciones tendrían que quedar deshabilitadas: se contesta una vez.');
  if (!r.fbVisible || r.fbTexto !== 'NO PASA NADA') {
    fallos.push(`la devolución del caso "no" tendría que verse con su texto; visible=${r.fbVisible}, texto=${JSON.stringify(r.fbTexto)}.`);
  }
  if (!r.fbClase) fallos.push('la devolución no lleva `.is-no`: se queda sin el color de error del kit.');
  if (/rgba\(0, 0, 0, 0\)|transparent/.test(r.fbFondo)) {
    fallos.push('la devolución no tiene fondo: el estilo del kit (`.d-pred-fb.is-no`, addendum §20) no se está aplicando.');
  }
  if (!r.seguirVisible) fallos.push('después de contestar tiene que aparecer el botón para seguir (`[data-pred-continue]`).');
  if (r.dichos.length !== 1) {
    fallos.push(`la devolución tendría que narrarse UNA vez y se narró ${r.dichos.length} ` +
      '(¿`initPrediccion()` ata dos veces el mismo bloque si se la llama dos veces?).');
  }
}

/* ---- 5 · el cable: el curso la llama en su boot ----
   Se lee la fuente de js/curso.js: es barato y es la única forma de
   saber si un curso SIN `[data-pred]` hoy la va a tener cuando lo agregue. */
const fuente = await (await fetch(new URL('js/curso.js', url))).text().catch(() => '');
if (fuente && !/^\s*initPrediccion\(\)/m.test(fuente)) {
  fallos.push('js/curso.js no llama a `initPrediccion()` en su boot: un `[data-pred]` en el marcado se vería y no haría nada ' +
    '(la pieza está, el cable no — §7.17).');
}

await browser.close();
report('prediccion', fallos, errors);
