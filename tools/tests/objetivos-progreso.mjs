#!/usr/bin/env node
/* objetivos-progreso.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. "Seguridad alimentaria" y "Seguridad de la
   información" escribieron, cada uno por su lado, el MISMO
   `marcarObjetivos()`: tres pips A/B/C en el cajón del índice que se
   pintan cuando el alumno llega al resumen de cada unidad. Dos cursos
   con el mismo código es exactamente el disparador de la regla §4, así
   que el mecanismo subió al kit — dentro del `refresh()` de
   `initIndexJumps`, para que no sea un cable más que cada curso tenga
   que acordarse de mantener sincronizado.

   ⚠️ POR QUÉ ESTE TEST SE ARMA SU PROPIO MARCADO, en vez de mirar el
   del curso. El bloque de pips va COMENTADO en `index-boilerplate.html`
   (un curso puede no declarar objetivos), así que un test con el guard
   de siempre —"si no hay pips, salteo"— se saltearía SIEMPRE: en el
   curso fresco del kit no hay pips nunca, y verde por ausencia es el
   verde que miente. Lo que hay que proteger acá es el MECANISMO del
   kit, no el contenido de un curso, así que el test inyecta tres pips,
   llama a `initIndexJumps` con un `visited` que él controla, y mide.

   Cubre las tres cosas que los dos cursos hacían a mano y que al subir
   cambiaron:
     1. el pip se pinta solo si su `data-obj-check` está visitado;
     2. el TOTAL se cuenta, no se escribe (los dos cursos tenían "de 3"
        hardcodeado: un cuarto objetivo habría mentido en silencio);
        ⚠️ por eso el caso principal usa CUATRO pips y no tres. Con tres,
        contar y tener "de 3" escrito dan el mismo texto, y el test no
        podría distinguirlos: seria una asercion que no mide nada
        (verificado — con 3 pips el test pasaba igual con el total
        hardcodeado). El segundo caso, de un solo pip, cubre ademas el
        singular del rotulo;
     3. un pip SIN `data-obj-check` queda apagado, no dado por cubierto.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

if (!(await page.evaluate(() => typeof window.initIndexJumps === 'function'))) {
  fails.push('initIndexJumps no está expuesta — coto-ui.js no se cargó');
} else {
  /* `n` pips: los `visitados` primeros tienen un data-obj-check que
     `visited()` da por visto, el resto uno que no. El ultimo, si
     `sinCheck`, va SIN data-obj-check. */
  const medir = (n, visitados, sinCheck) => page.evaluate(({ n, visitados, sinCheck }) => {
    const box = document.createElement('div');
    box.className = 'd-obj-progress';
    let html = '';
    for (let i = 0; i < n; i++) {
      const k = String.fromCharCode(65 + i);
      const ultimo = i === n - 1;
      const check = (ultimo && sinCheck) ? ''
        : ' data-obj-check="' + (i < visitados ? '__vista__' : '__no__') + i + '"';
      html += '<span class="d-obj-pip" data-obj-pip="' + k + '"' + check + '>' + k + '</span>';
    }
    box.innerHTML = html + '<span class="d-obj-progress-lbl" data-obj-lbl></span>';
    document.body.appendChild(box);

    const pedidos = [];
    window.initIndexJumps({
      selector: '.__no_existe__',          // no tocar la navegación real
      visited: (id) => { pedidos.push(id); return id.indexOf('__vista__') === 0; }
    });

    const marcados = [...box.querySelectorAll('[data-obj-pip]')]
      .map((p) => p.classList.contains('is-done'));
    const out = { marcados, lbl: box.querySelector('[data-obj-lbl]').textContent, pedidos };
    box.remove();
    return out;
  }, { n, visitados, sinCheck });

  /* Caso principal: CUATRO pips — dos visitados, uno no, y el cuarto sin
     `data-obj-check`. Cuatro y no tres, a proposito: ver el encabezado. */
  const r = await medir(4, 2, true);
  const s1 = await medir(1, 1, false);

  if (!r.marcados[0] || !r.marcados[1]) {
    fails.push('un pip cuyo data-obj-check ESTÁ visitado no se marcó is-done: ' + JSON.stringify(r.marcados));
  }
  if (r.marcados[2]) fails.push('el pip cuyo data-obj-check NO está visitado se marcó is-done igual');
  if (r.marcados[3]) fails.push('un pip SIN data-obj-check se dio por cubierto (tiene que quedar apagado)');
  /* El total sale de CONTAR los pips presentes (4), no de un numero
     escrito: un "de 3" hardcodeado cae justo acá. */
  if (r.lbl !== '2 de 4 objetivos cubiertos') {
    fails.push('el rótulo debería contar los pips presentes ("2 de 4 objetivos cubiertos"), dio: ' + JSON.stringify(r.lbl));
  }
  if (!r.pedidos.some((id) => id.indexOf('__vista__') === 0)) {
    fails.push('nunca se consultó visited() con el data-obj-check del pip');
  }
  if (s1.lbl !== '1 de 1 objetivo cubierto') {
    fails.push('con un solo objetivo el rótulo va en singular ("1 de 1 objetivo cubierto"), dio: ' + JSON.stringify(s1.lbl));
  }
}

report('objetivos-progreso', fails, errors);
await browser.close();
