#!/usr/bin/env node
/* simulador.mjs — kit-base v1.9.81
   ------------------------------------------------------------
   POR QUÉ EXISTE. Un curso-simulador tiene un contrato de marcado
   propio (`js/coto-simulador.js`) y una MECÁNICA que se puede romper
   sin que nada dé error: el riel queda huérfano, el gate se abre al
   perder, el presupuesto de pistas no aprieta nunca. Ninguno de los
   otros 17 tests mira eso — miran el chrome, la narración, los
   hitboxes y el tracking, que en un simulador están bien igual.

   Los tres bugs más caros del primer simulador habrían caído acá:
     · perder abría el gate de avance (`terminado` cubría ganar Y
       perder, y `canAdvance` preguntaba por él);
     · el "¡Ups!" se cerraba con Escape y dejaba la partida congelada;
     · el presupuesto de pistas alcanzaba SIEMPRE, así que la economía
       del juego no existía y el reloj era inalcanzable.

   NO SE EJECUTA en un curso que no es simulador: si no hay
   `[data-sim-rail]`, informa y sale. Un test que le falla a un curso
   que no le corresponde enseña a ignorar la suite.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

const hay = await page.evaluate(() => !!document.querySelector('[data-sim-rail]'));
if (!hay) {
  console.log('  · no es un curso-simulador (sin [data-sim-rail]): nada que revisar.');
  report('simulador', errors.map((e) => 'error de consola: ' + e));
  await browser.close();
  process.exit(process.exitCode || 0);
}

/* ---- 1 · El contrato de marcado ---- */
const c = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  const stage = q('.d-stage');
  const rail = q('[data-sim-rail]');
  const ruta = q('[data-sim-ruta]');
  return {
    motor: !!window.initSimulador,
    escenario: !!window.ESCENARIO,
    lupas: document.querySelectorAll('[data-sim-pista]').length,
    railEnStage: !!(rail && stage && stage.contains(rail)),
    rutaEnStage: !ruta || !!(stage && stage.contains(ruta)),
    reloj: !!q('[data-sim-reloj] [data-sim-reloj-num]'),
    popPista: !!q('[data-popup="pista"] [data-sim-pista-lista]'),
    popUps: !!q('[data-popup="ups"]'),
    upsPaso: !!q('[data-sim-ups-paso]'),
    reintentar: !!q('[data-sim-reintentar]'),
    pantallas: document.querySelectorAll('.sim-screen').length,
    /* El "¡Ups!" NO puede tener ✕ ni fondo clickeable: de ahí se sale
       reintentando. Si los tiene, el alumno lo cierra y queda en una
       partida congelada, con todos los controles mudos. */
    upsConSalidaFalsa: !!q('[data-popup="ups"] [data-popup-close]')
  };
});

if (!c.motor) fails.push('falta `js/coto-simulador.js` — el riel está dibujado y no lo mueve nadie.');
if (!c.escenario) fails.push('falta `js/escenario.js`: el simulador no tiene datos (window.ESCENARIO).');
if (!c.lupas) fails.push('no hay ninguna `[data-sim-pista]`: el riel de ayudas está vacío.');
if (!c.railEnStage) {
  fails.push('`[data-sim-rail]` no es hijo de `.d-stage`. Adentro de una diapositiva habría ' +
    'un riel por pantalla y N estados que sincronizar a mano (§6.25).');
}
if (!c.rutaEnStage) fails.push('`[data-sim-ruta]` no es hijo de `.d-stage` (mismo motivo que el riel).');
if (!c.reloj) fails.push('falta el reloj `[data-sim-reloj]` con su `[data-sim-reloj-num]` adentro.');
if (!c.popPista) fails.push('el pop-up de pista no tiene `[data-sim-pista-lista]`: no hay dónde dibujarlas.');
if (!c.popUps) fails.push('falta el pop-up `[data-popup="ups"]`: perder no tiene pantalla.');
if (!c.upsPaso) {
  fails.push('el "¡Ups!" no tiene `[data-sim-ups-paso]`: no le dice al alumno DÓNDE se trabó, ' +
    'y sin eso lo manda a repetir desde cero lo que ya tenía resuelto.');
}
if (!c.reintentar) fails.push('el "¡Ups!" no tiene `[data-sim-reintentar]`: es un callejón sin salida.');
if (c.upsConSalidaFalsa) {
  fails.push('el "¡Ups!" tiene un `[data-popup-close]`: cerrarlo deja la partida congelada. ' +
    'De ahí se sale reintentando.');
}
if (!c.pantallas) fails.push('no hay ninguna `.sim-screen`: el simulador no simula nada.');

/* ---- 2 · La economía de las pistas ----
   Si el presupuesto alcanza para todas las pantallas sin elegir, no
   hay ninguna decisión que tomar: las pistas dejan de significar algo
   y el reloj —que arranca al gastar la última— se vuelve
   inalcanzable. Es exactamente el agujero que el cliente detectó sin
   poder explicarlo ("las pistas quedaron raras"). */
const eco = await page.evaluate(() => {
  const E = window.ESCENARIO || {};
  const pasos = E.pasos || [];
  const r = E.reglas || {};
  return {
    pasos: pasos.length,
    presupuesto: r.pistasTotales,
    porPantalla: pasos.map((p) => (p.pistas || []).length),
    repetidas: pasos.filter((p) => {
      const ps = (p.pistas || []).map((t) => String(t).trim());
      return new Set(ps).size !== ps.length;
    }).map((p) => p.id),
    sinLogroFinal: !E.logroFinal
  };
});

if (eco.presupuesto != null && eco.pasos && eco.presupuesto >= eco.porPantalla.reduce((a, b) => a + b, 0)) {
  fails.push(`el presupuesto de pistas (${eco.presupuesto}) alcanza para TODAS las de todas las ` +
    'pantallas: el alumno nunca tiene que elegir dónde gastarlas, así que no hay economía ' +
    'ninguna y el reloj no se activa nunca. Bajá `reglas.pistasTotales`.');
}
/* El caso sutil, que informa y no falla: el presupuesto alcanza para
   UNA pista en cada pantalla. No es un bug —el alumno igual tiene que
   elegir si la gasta en la primera o se la guarda— pero es el borde
   donde la economía empieza a no apretar, y conviene mirarlo con
   datos del piloto antes de dejarlo así. */
if (eco.presupuesto != null && eco.pasos && eco.presupuesto >= eco.pasos) {
  console.log(`  ⓘ presupuesto (${eco.presupuesto}) ≥ pantallas (${eco.pasos}): alcanza para una ` +
    'pista en cada una. Funciona, pero la decisión de "dónde la gasto" queda floja.');
}
if (eco.repetidas.length) {
  fails.push(`pistas repetidas dentro de la misma pantalla (${eco.repetidas.join(', ')}). ` +
    'Cada nivel cuesta una lupa: si trae lo mismo que el anterior, el alumno pagó por nada — ' +
    'que es la queja textual que originó esta mecánica.');
}
if (eco.porPantalla.some((n) => n === 0)) {
  fails.push('hay pantallas sin ninguna pista en `escenario.js`: el alumno que se traba ahí ' +
    'no tiene salida más que equivocarse hasta perder.');
}
if (eco.sinLogroFinal) {
  console.log('  ⓘ `escenario.logroFinal` vacío: terminar el simulador no desbloquea ningún logro.');
}

/* ---- 3 · Perder NO abre el gate ----
   Se fuerza la derrota desde el estado del motor y se pregunta por el
   gate. Es la comprobación más barata del bug más caro. */
const gate = await page.evaluate(() => {
  const E = window.ESCENARIO || {};
  const primero = (E.pasos || [])[0];
  if (!primero || !window.motor || !window.motor.canAdvance) return null;
  const sl = document.querySelector(`[data-slide="${primero.id}"]`);
  return sl ? window.motor.canAdvance(sl) : null;
});
if (gate === true) {
  fails.push('`motor.canAdvance` devuelve true en la PRIMERA pantalla sin haberla resuelto: ' +
    'el gate del simulador no está puesto y se puede caminar hasta el cierre sin jugar.');
}

console.log(`  · ${eco.pasos} pantalla(s) · ${c.lupas} lupa(s) · presupuesto ${eco.presupuesto} · ` +
  `pistas por pantalla [${eco.porPantalla.join(', ')}]`);

if (errors.length) fails.push(...errors.map((e) => 'error de consola: ' + e));
report('simulador', fails);
await browser.close();
