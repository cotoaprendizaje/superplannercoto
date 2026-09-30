/* ============================================================
   coto-simulador.js · EL MOTOR DE UN CURSO-SIMULADOR
   ------------------------------------------------------------
   kit-base v1.9.81 · subido desde "Simulador — Impresión de obleas
   de precios", siete rondas de feedback del cliente (CLAUDE.md §7.27).

   QUÉ ES UN CURSO-SIMULADOR Y EN QUÉ SE DIFERENCIA DEL RESTO
   ----------------------------------------------------------
   No es un curso con un minijuego adentro: el alumno recorre las
   MISMAS pantallas del sistema real que va a tener delante en la
   sucursal, y tiene que resolver cada una como la resolvería ahí.
   Por eso la cáscara de minijuego (`coto-minijuego.css`, el
   "¡Aprendé jugando!" con píldoras, vidas y mapa de opciones) NO se
   usa: es otra dinámica. Lo que sí se reusa es todo lo demás del kit
   — motor, chrome, narración, logros, gates, cierre.

   QUÉ RESUELVE ESTE ARCHIVO Y QUÉ LE DEJA AL CURSO
   -----------------------------------------------
   Acá vive la MECÁNICA, que no cambia de un simulador a otro:
   el presupuesto de pistas y su economía, el reloj, la derrota y el
   retomar, la hoja de ruta, el resaltado de zonas, el estado de
   "pantalla ya resuelta", el gate de avance, el nudge, la lupa de
   pantalla en móvil y el apagado del chrome durante la partida.

   El curso pone dos cosas y nada más:
     · `js/escenario.js` — los DATOS (producto, pasos, pistas, textos).
       Lo edita un diseñador instruccional sin abrir un motor.
     · el cableado de SUS pantallas — qué cuenta como error en cada
       una. Eso no se puede generalizar: un formulario de impresión y
       un árbol de menú no se validan igual.

   Ese corte es lo que convierte "un simulador" en "el molde de los
   simuladores": el segundo ya no cuesta lo que costó el primero.

   CONTRATO DE MARCADO (ver `simulador-boilerplate.html`)
   ------------------------------------------------------
     [data-sim-rail]        riel de ayudas · HIJO DE `.d-stage`, no de
                            una diapositiva (un solo contador, un solo
                            lugar donde se pinta — §6.25)
     [data-sim-pista]       las lupas del presupuesto (una por unidad)
     [data-sim-lupas-rot]   el rótulo de la tarjeta de pistas
     [data-sim-nudge]       globito del aviso de inactividad
     [data-sim-reloj]       el reloj, con -num, -aro y -sr adentro
     [data-sim-ruta]        hoja de ruta · también hijo de `.d-stage`
     [data-sim-ruta-i="id"] un paso de la hoja de ruta
     [data-sim-ruta-sr]     la misma ruta, en texto, para la locución
     [data-sim-zoom-box]    la lupa de pantalla (móvil)
     [data-sim-zona]        dentro de una diapositiva: qué resaltar
     [data-sim-resuelto]    cartel de "ya resolviste esta pantalla"
     [data-popup="pista"]   con [data-sim-pista-lista|-tit|-quedan|-pips]
     [data-popup="ups"]     con [data-sim-ups-lbl|-paso|-sub]
                            y [data-sim-reintentar] / [data-sim-reiniciar-cero]
     .sim-screen            la pantalla recreada, dentro de .sim-monitor
   ============================================================ */
(function (global) {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* Los rótulos de los tres niveles de pista. Se ven en el pop-up y le
     dicen al alumno qué esperar de cada uno: que la primera NO le va a
     cantar la respuesta es parte del trato, y decirlo evita que la lea
     como una pista mala. El curso puede pisarlos desde
     `escenario.reglas.niveles`. */
  var NIVELES = ['Para empezar', 'Un poco más cerca', 'Te la señalo'];

  var LUPA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<circle cx="10.5" cy="10.5" r="6.3" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
    '<path d="M15.2 15.2 L20.5 20.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>';

  function initSimulador(opts) {
    opts = opts || {};
    var E = opts.escenario;
    if (!E) {
      console.error('initSimulador: falta el escenario (js/escenario.js).');
      return null;
    }

    var REGLAS = E.reglas || {};
    var PASOS = E.pasos || [];
    var SEGUNDOS = REGLAS.segundos || 30;
    var NIVEL_LBL = REGLAS.niveles || NIVELES;
    var noop = function () {};
    var premiar = opts.premiar || function () { return false; };
    var Logros = opts.logros || null;
    var Player = opts.player || null;
    var Cierre = opts.cierre || null;

    /* ============================================================
       ESTADO DE LA PARTIDA
       ------------------------------------------------------------
       NO se persiste: una partida no sobrevive a cerrar el curso,
       empieza de nuevo. Lo que sí se persiste —puntos y logros— lo
       maneja el curso con su guard (§6.53), que es lo que impide que
       reintentar pague dos veces.

       `terminado` cubría DOS finales distintos —ganar y perder— y el
       gate de avance preguntaba por él. O sea: perder abría el
       candado. No se encontró jugando: caías en el "¡Ups!", apretabas
       Escape y de ahí "Siguiente" te llevaba caminando hasta el
       cierre, con el simulador sin resolver. Por eso son tres banderas
       y no una: `ganado` es lo único que abre el gate.
       ============================================================ */
    function partidaNueva(desdePaso, conPistas, conservar) {
      return {
        pistas: conPistas,
        paso: desdePaso || 0,
        erroresPaso: 0,
        /* Por PANTALLA, no global: cuántas de las pistas de esa
           pantalla están destapadas. Cada una costó una lupa del
           presupuesto común, y releerlas no vuelve a cobrar. */
        nivel: conservar ? conservar.nivel : {},
        terminado: false,
        ganado: false,
        perdido: false
      };
    }

    var juego = partidaNueva(0, REGLAS.pistasTotales || 3, null);
    var pistasUsadas = 0;
    var VARIANTE = null;

    function pasoActual() { return PASOS[juego.paso] || null; }
    function slideDe(id) { return $('[data-slide="' + id + '"]'); }

    /* ============================================================
       VARIANTE DEL EJERCICIO
       ------------------------------------------------------------
       Sucursal, producto, caso: lo que cambia entre una partida y
       otra. Se sortea al empezar y en cada reinicio desde cero, así
       repetir el simulador no es repetirlo de memoria, y quien lo
       rehace a los quince días se encuentra con otro caso.
       Con UNA sola variante cargada esto es un no-op — y está bien:
       agregar variantes pide datos REALES del cliente, y un código
       inventado se cae al primer alumno que lo busque en el sistema.
       ============================================================ */
    function sortearVariante() {
      var vs = E.variantes || [];
      VARIANTE = vs.length ? vs[Math.floor(Math.random() * vs.length)] : null;
      (opts.onVariante || noop)(VARIANTE);
      return VARIANTE;
    }

    /* ============================================================
       FEEDBACK
       ------------------------------------------------------------
       Una sola tarjeta reusada por todas las pantallas. `role="status"`:
       el resultado tiene que llegar también por voz, no solo por color
       (§6.10.1 — una interacción que solo se ve es media interacción).
       ============================================================ */
    var fbEl = null, fbTimer = 0;

    function feedback(tipo, texto) {
      var paso = pasoActual();
      var slide = slideDe(paso ? paso.id : (PASOS[0] && PASOS[0].id));
      if (!slide) return;
      if (!fbEl) {
        fbEl = document.createElement('div');
        fbEl.className = 'sim-fb';
        fbEl.setAttribute('role', 'status');
        fbEl.innerHTML = '<span class="sim-fb-ic" aria-hidden="true"></span><p></p>';
      }
      fbEl.classList.remove('sim-fb--ok', 'sim-fb--mal');
      fbEl.classList.add(tipo === 'ok' ? 'sim-fb--ok' : 'sim-fb--mal');
      $('.sim-fb-ic', fbEl).textContent = tipo === 'ok' ? '✓' : '!';
      $('p', fbEl).textContent = texto;
      slide.appendChild(fbEl);
      // Reiniciar la animación aunque la tarjeta ya estuviera puesta.
      fbEl.style.animation = 'none'; void fbEl.offsetWidth; fbEl.style.animation = '';
      clearTimeout(fbTimer);
      fbTimer = setTimeout(ocultarFeedback, tipo === 'ok' ? 2600 : 5200);
      decir(texto);
    }

    /* ---- Micro-locución del resultado ----
       `role="status"` hace que un lector de pantalla lea la tarjeta,
       pero el alumno que tiene la locución prendida y NO usa lector no
       escuchaba nada: el acierto y el error eran los dos únicos
       momentos mudos del simulador, justo los que más importan.
       Canal propio, para que una devolución no le pise la narración de
       la diapositiva por la mitad ni al revés. */
    function decir(texto) {
      if (REGLAS.locucionFeedback === false) return;
      if (!global.Narrador || !texto) return;
      if (Narrador.isNarrating && !Narrador.isNarrating()) return;
      Narrador.speak(texto, 'sim-fb');
    }

    function ocultarFeedback() {
      clearTimeout(fbTimer);
      if (fbEl && fbEl.parentNode) fbEl.parentNode.removeChild(fbEl);
    }

    /* ============================================================
       PISTAS · la economía del simulador
       ------------------------------------------------------------
       Esta es la pieza que más veces se rehizo, y la historia explica
       el diseño (CLAUDE.md §7.27):

       v1: una pista por pantalla, tres lupas. El alumno gastaba la
       segunda esperando algo nuevo y leía el mismo párrafo.

       v2: tres niveles por pantalla, UNA sola lupa gastable por
       pantalla, y los niveles 2 y 3 se destapaban gratis al
       equivocarse. Arreglaba la repetición y rompía otra cosa: con
       3 lupas para 3 pantallas y una por pantalla el presupuesto
       nunca apretaba; y si equivocarse destapaba ayuda gratis,
       equivocarse era estrictamente mejor que pedir una pista. Una
       moneda que nunca escasea y que además se consigue gratis no es
       una moneda.

       v3 (ésta): cada nivel cuesta una lupa y se pueden gastar varias
       en la misma pantalla. Cada clic trae información NUEVA y más
       concreta — nunca el párrafo anterior. Equivocarse no regala
       nada. Y quemar dos acá es quedarse con una para lo que falta:
       esa es la decisión que le devuelve sentido al presupuesto, y la
       que hace que quedarse sin pistas —con su reloj y su "¡Ups!"—
       vuelva a ser algo que puede pasar de verdad.

       Releer lo ya abierto es gratis, siempre.
       ============================================================ */
    function nivelDe(id) { return juego.nivel[id] || 0; }

    function pintarLupas() {
      /* Se apagan DESDE ARRIBA, no desde abajo. Con `i >= juego.pistas`
         —que es lo que parece natural al escribirlo— el alumno toca la
         primera lupa y se le apaga la TERCERA: la cuenta era correcta y
         la pantalla decía otra cosa. Encontrado en un recorrido
         instrumentado, no mirando el código. */
      var lupas = $$('[data-sim-pista]');
      var gastadas = lupas.length - juego.pistas;
      var paso = pasoActual();
      var abiertas = paso ? nivelDe(paso.id) : 0;
      var quedanEnPantalla = paso ? (paso.pistas || []).length - abiertas : 0;

      lupas.forEach(function (b, i) {
        var gastada = i < gastadas;
        /* Una lupa gastada NO queda muerta si en esta pantalla hay
           pistas abiertas: sigue siendo el botón de "volver a leerlas",
           que es gratis. Un control apagado que igual tiene algo que
           ofrecer es un control que el alumno no va a volver a tocar. */
        b.disabled = gastada && !abiertas;
        b.classList.toggle('is-gastada', gastada);
        b.setAttribute('aria-label', gastada
          ? (abiertas ? 'Volver a leer las pistas de esta pantalla'
                      : 'Pista ' + (i + 1) + ' de ' + lupas.length + ', ya usada')
          : 'Usar pista ' + (i + 1) + ' de ' + lupas.length +
            (quedanEnPantalla ? '' : ' (en esta pantalla ya no quedan)'));
      });
    }

    function usarPista() {
      if (juego.terminado) return;
      var paso = pasoActual();
      if (!paso) return;

      var lista = paso.pistas || [];
      var n = nivelDe(paso.id);
      var hayMas = n < lista.length;

      // Sin presupuesto, o sin niveles nuevos que destapar: se relee lo
      // ya abierto, gratis. Si no hay nada abierto, no pasa nada.
      if (!hayMas || juego.pistas <= 0) {
        if (n > 0) mostrarPistas(paso, false);
        return;
      }

      juego.pistas--;
      pistasUsadas++;
      juego.nivel[paso.id] = n + 1;
      pintarLupas();

      /* El último nivel no solo se lee: SEÑALA. "Te la señalo" tenía
         que señalar algo — resaltar la zona en la pantalla es la forma
         más directa de ayudar a alguien que no encuentra el control, y
         es la razón por la que ese nivel vale una lupa. */
      if (n + 1 >= lista.length) resaltarZona(paso);

      mostrarPistas(paso, true);

      // El reloj arranca recién al gastar la ÚLTIMA pista del presupuesto.
      if (juego.pistas === 0) arrancarReloj();
    }

    /* Dibuja la pila de pistas destapadas de esta pantalla. `gasto` dice
       si esta apertura costó una lupa: cambia el pie, no el contenido. */
    function mostrarPistas(paso, gasto) {
      var n = nivelDe(paso.id);
      var lista = $('[data-sim-pista-lista]');
      if (lista) {
        lista.textContent = '';
        for (var i = 0; i < n; i++) {
          var li = document.createElement('li');
          li.className = 'sim-pista-i' + (i === n - 1 && n > 1 ? ' is-nueva' : '');
          var b = document.createElement('b');
          b.textContent = NIVEL_LBL[i] || ('Pista ' + (i + 1));
          var pp = document.createElement('p');
          pp.textContent = paso.pistas[i];
          li.appendChild(b); li.appendChild(pp);
          lista.appendChild(li);
        }
      }
      var tit = $('[data-sim-pista-tit]');
      if (tit) tit.textContent = n > 1 ? 'Tus pistas de esta pantalla' : 'Pista';

      pintarPips();
      var quedan = $('[data-sim-pista-quedan]');
      if (quedan) quedan.textContent = pieDePista(paso, gasto);
      if (global.motor) motor.showPopup('pista');
    }

    /* El pie del pop-up es donde el alumno entiende la economía del
       juego, así que dice las dos cosas que necesita para decidir:
       cuánto le queda en total y si esta pantalla tiene más para dar. */
    function pieDePista(paso, gasto) {
      var n = nivelDe(paso.id);
      var faltanAca = (paso.pistas || []).length - n;

      if (!gasto) {
        return 'Estas son las pistas que ya abriste en esta pantalla. Volver a leerlas ' +
          'no gasta nada' +
          (faltanAca && juego.pistas
            ? ', y todavía hay ' + (faltanAca === 1 ? 'una más' : faltanAca + ' más') +
              ' acá si la necesitás.'
            : '.');
      }
      if (juego.pistas === 0) {
        return 'Era tu última pista. A partir de ahora tenés ' + SEGUNDOS +
          ' segundos por pantalla, y si te equivocás volvés a empezar.';
      }
      return (juego.pistas === 1 ? 'Te queda 1 pista' : 'Te quedan ' + juego.pistas + ' pistas') +
        ' para todo lo que falta. ' +
        (faltanAca
          ? 'En esta pantalla hay ' + (faltanAca === 1 ? 'una más' : faltanAca + ' más') +
            ', más concreta que ésta — pero también cuesta.'
          : 'Acá ya no queda ninguna: ésta era la última de esta pantalla.');
    }

    /* Las lupas del pop-up: se entienden sin leer, porque el alumno ya
       asoció ese ícono con "ayuda" en el riel. El texto de abajo dice
       lo mismo en palabras, para quien escucha el curso. */
    function pintarPips() {
      var caja = $('[data-sim-pista-pips]');
      if (!caja) return;
      var total = $$('[data-sim-pista]').length;
      caja.textContent = '';
      for (var i = 0; i < total; i++) {
        var pip = document.createElement('span');
        pip.className = 'sim-pop-pip' + (i >= juego.pistas ? ' sim-pop-pip--usada' : '');
        pip.innerHTML = LUPA_SVG;
        caja.appendChild(pip);
      }
    }

    /* Los adornos de la hoja del arte (círculos de "!" y ángulos de las
       esquinas) viven en un `<template>` y se clonan donde haga falta:
       repetir doce nodos de decoración en cada pop-up es ruido en el
       marcado y una copia más que mantener sincronizada. */
    function ponerAdornos() {
      var tpl = document.getElementById('sim-adornos');
      if (!tpl) return;
      $$('[data-sim-adornar]').forEach(function (caja) {
        caja.insertBefore(tpl.content.cloneNode(true), caja.firstChild);
      });
    }

    /* ============================================================
       RELOJ
       ------------------------------------------------------------
       Un solo temporizador gobierna lo que se VE (el número y el aro) y
       lo que PASA (el "¡Ups!"). Tener dos —uno para la animación CSS y
       otro para la lógica— es cómo se termina con un reloj que marca 3
       mientras el juego ya te sacó.
       ============================================================ */
    var relojId = 0, relojRestante = 0;
    var RADIO = 19, CIRC = 2 * Math.PI * RADIO;   // el aro del SVG del riel

    function pintarReloj() {
      var caja = $('[data-sim-reloj]');
      if (!caja) return;
      var num = $('[data-sim-reloj-num]', caja);
      var aro = $('[data-sim-reloj-aro]', caja);
      var sr = $('[data-sim-reloj-sr]', caja);
      if (num) num.textContent = relojRestante;
      if (aro) aro.style.strokeDashoffset = (CIRC * (1 - relojRestante / SEGUNDOS)).toFixed(2);
      caja.classList.toggle('is-urgente', relojRestante <= 10);
      // Se anuncia al arrancar y en los últimos 10, no cada segundo: un
      // lector de pantalla leyendo 30 números seguidos tapa todo lo demás.
      if (sr) {
        sr.textContent = (relojRestante === SEGUNDOS || relojRestante === 10)
          ? 'Te quedan ' + relojRestante + ' segundos.' : '';
      }
    }

    function arrancarReloj() {
      if (juego.pistas > 0 || juego.terminado) return;
      pararReloj();
      var caja = $('[data-sim-reloj]');
      if (caja) caja.hidden = false;
      relojRestante = SEGUNDOS;
      pintarReloj();
      relojId = setInterval(function () {
        relojRestante--;
        pintarReloj();
        if (relojRestante <= 0) {
          pararReloj();
          perder('Se te acabó el tiempo.');
        }
      }, 1000);
    }

    function pararReloj() {
      if (relojId) { clearInterval(relojId); relojId = 0; }
    }

    function ocultarReloj() {
      pararReloj();
      var caja = $('[data-sim-reloj]');
      if (caja) { caja.hidden = true; caja.classList.remove('is-urgente'); }
    }

    /* ============================================================
       ERROR · DERROTA · REINICIO
       ============================================================ */
    function errar(texto) {
      if (juego.terminado) return;
      juego.erroresPaso++;
      if (juego.pistas <= 0) { perder(texto); return; }
      feedback('mal', texto);
      /* Equivocarse NO destapa ayuda. Si errar consigue lo mismo que
         una pista y no cuesta nada, pedir una pista es la peor jugada
         disponible — y el alumno lo nota enseguida aunque no sepa
         explicar por qué. La devolución del error explica QUÉ pasó;
         señalar DÓNDE mirar es lo que se compra con la última pista. */
    }

    /* Resalta la zona donde está la respuesta. Por defecto, todos los
       `[data-sim-zona]` de la diapositiva; el curso puede pasar
       `zonaDe` cuando la zona no es fija — en un árbol de menú, por
       ejemplo, lo que hay que señalar es el SIGUIENTE nodo del camino
       que todavía no se abrió, no los tres de una. */
    function resaltarZona(paso) {
      var sl = slideDe(paso.id);
      if (!sl) return;
      limpiarZonas();
      var zonas = opts.zonaDe ? (opts.zonaDe(paso, sl) || []) : $$('[data-sim-zona]', sl);
      zonas.forEach(function (z) { z.classList.add('is-zona'); });
    }

    function limpiarZonas() {
      $$('.is-zona').forEach(function (z) { z.classList.remove('is-zona'); });
    }

    function perder(porque) {
      if (juego.terminado) return;
      juego.terminado = true;
      juego.perdido = true;
      cancelarNudge();
      ocultarReloj();          // `pararReloj()` frena la cuenta pero deja
                               // el círculo marcando 0 al lado del "¡Ups!"
      ocultarFeedback();
      limpiarZonas();
      pintarUps(porque);
      (opts.onPerder || noop)(porque, pasoActual());
      if (global.motor) motor.showPopup('ups');
    }

    /* El "¡Ups!" dice DÓNDE se trabó. Un cartel genérico manda al
       alumno a repetir desde cero las pantallas que ya tenía
       resueltas, que es la forma más rápida de que abandone. */
    function pintarUps(porque) {
      var paso = pasoActual();
      var ups = E.ups || {};
      var lbl = $('[data-sim-ups-lbl]');
      var nom = $('[data-sim-ups-paso]');
      var sub = $('[data-sim-ups-sub]');
      if (lbl) lbl.textContent = (ups.etiqueta || 'Te trabaste en') + ' ';
      if (nom) nom.textContent = paso ? paso.titulo : 'el simulador';
      if (sub) {
        sub.textContent = (porque ? porque + ' ' : '') +
          (ups.retomarTxt || 'Tocá Reintentar para volver a esta pantalla con una pista nueva.');
      }
      var cero = $('[data-sim-reiniciar-cero]');
      if (cero && ups.desdeCero) cero.textContent = ups.desdeCero;
    }

    /* ============================================================
       REINICIO — dos formas, y la diferencia importa
       ------------------------------------------------------------
       · 'retomar' — vuelve a la pantalla donde se cayó, con lo
         anterior resuelto y UNA pista nueva para poder seguir jugando
         (sin eso volvería con cero pistas y el próximo error lo
         sacaría de nuevo: un callejón). Es la salida por defecto del
         "¡Ups!".
       · 'cero'    — empieza el simulador entero de nuevo, con el
         presupuesto completo y otra variante sorteada.

       En los dos casos se reinicia la PARTIDA, no el progreso: los
       puntos y logros ya ganados se quedan, y el guard del curso
       impide cobrarlos otra vez (§6.53).
       ============================================================ */
    function reiniciar(modo) {
      var retomar = modo === 'retomar' && juego.paso > 0;
      var desde = retomar ? juego.paso : 0;

      if (retomar) {
        /* Se conserva lo abierto en las pantallas anteriores, pero la
           pantalla donde se cayó arranca limpia: si no, vuelve con
           todas las pistas destapadas y ya no hay nada que resolver. */
        var conservar = { nivel: juego.nivel };
        var idAqui = PASOS[desde] && PASOS[desde].id;
        if (idAqui) delete conservar.nivel[idAqui];
        juego = partidaNueva(desde, 1, conservar);
      } else {
        sortearVariante();
        juego = partidaNueva(0, REGLAS.pistasTotales || 3, null);
        pistasUsadas = 0;
      }

      /* El cierre vuelve a su primer paso. Sin esto, quien termina,
         pasa al resumen y toca "Volver a jugar" se encuentra —al ganar
         de nuevo— con la felicitación Y el resumen EN PANTALLA AL
         MISMO TIEMPO: `coto-cierre.js` lleva su propio contador de
         pasos, y `unlockCierre()` destapa otra vez el arte sin que ese
         contador vuelva a cero. */
      if (Cierre && Cierre.volverAlShot) Cierre.volverAlShot();
      ocultarFeedback();
      ocultarReloj();
      limpiarZonas();
      pintarLupas();
      (opts.onReset || noop)(desde, retomar);
      if (global.motor) {
        motor.closePopup();
        if (PASOS[desde]) motor.gotoId(PASOS[desde].id);
      }
      sincronizar();
    }

    /* ============================================================
       NUDGE DE AYUDA
       ------------------------------------------------------------
       Si el alumno se queda quieto, el riel se hace notar: la tarjeta
       de Pistas late y aparece un globito que dice para qué sirve. No
       abre nada ni resuelve nada — solo señala dónde está la ayuda,
       que es lo que alguien trabado no encuentra justamente porque
       está mirando otra cosa. Se cancela con cualquier interacción.
       ============================================================ */
    var NUDGE_MS = (REGLAS.nudgeSegundos || 18) * 1000;
    var nudgeId = 0;

    function armarNudge() {
      cancelarNudge(true);
      if (juego.terminado || !pasoActual()) return;
      nudgeId = setTimeout(function () {
        var rail = $('[data-sim-rail]');
        if (!rail || rail.hidden || juego.terminado) return;
        rail.classList.add('is-nudge');
        var globo = $('[data-sim-nudge]');
        if (globo) {
          globo.textContent = juego.pistas > 0
            ? '¿Te trabaste? Tocá una lupa'
            : 'Mirá las reglas si dudás';
          globo.hidden = false;
        }
      }, NUDGE_MS);
    }

    function cancelarNudge(soloTimer) {
      clearTimeout(nudgeId); nudgeId = 0;
      if (soloTimer) return;
      var rail = $('[data-sim-rail]');
      if (rail) rail.classList.remove('is-nudge');
      var globo = $('[data-sim-nudge]');
      if (globo) globo.hidden = true;
    }

    function apagarNudge() { cancelarNudge(); armarNudge(); }

    /* ============================================================
       HOJA DE RUTA
       ------------------------------------------------------------
       Los pasos del procedimiento, siempre a la vista. Adentro de la
       segunda pantalla el alumno no tiene forma de saber cuántas
       faltan ni qué viene después — y un procedimiento se aprende
       mejor cuando se ve entero, no de a una pantalla.
       ============================================================ */
    function pintarRuta() {
      var ruta = $('[data-sim-ruta]');
      if (!ruta) return;
      PASOS.forEach(function (paso, i) {
        var li = $('[data-sim-ruta-i="' + paso.id + '"]', ruta);
        if (!li) return;
        var lbl = $('span', li);
        if (lbl && paso.rotulo && lbl.textContent !== paso.rotulo) lbl.textContent = paso.rotulo;
        var hecho = juego.paso > i || juego.ganado;
        var ahora = juego.paso === i && !juego.ganado;
        li.classList.toggle('is-hecho', hecho);
        li.classList.toggle('is-ahora', ahora);
        li.setAttribute('aria-current', ahora ? 'step' : 'false');
      });
      // El texto para quien escucha: la lista visual dice lo mismo con
      // números y color, y eso por voz no llega.
      var sr = $('[data-sim-ruta-sr]');
      if (sr) {
        var p = PASOS[juego.paso];
        sr.textContent = juego.ganado || !p ? ''
          : 'Paso ' + (juego.paso + 1) + ' de ' + PASOS.length + ': ' + p.titulo + '.';
      }
    }

    /* ============================================================
       LUPA DE LA PANTALLA (móvil)
       ------------------------------------------------------------
       EL PROBLEMA, medido y no supuesto: en un teléfono acostado el
       lienzo mide 932×336 px. Una pantalla de sistema recreada ocupa
       ~56% del ancho y su tipografía cae por debajo de 4 px. La
       pantalla está, se ve, y no se puede LEER — que en un simulador
       es lo mismo que no estar.

       LO QUE NO SE HIZO Y POR QUÉ: rehacer la pantalla en una versión
       "móvil" con menos controles. El sistema real tiene esos veinte
       controles; sacarle la mitad para que entre en un teléfono enseña
       un sistema que no existe.

       LO QUE SE HIZO: acercar y arrastrar, como con cualquier plano.
       Arriba de 1×, el arrastre mueve la pantalla — con umbral, para
       que un toque siga siendo un clic y no el principio de un
       arrastre. Y el control va en el RIEL, no encima del monitor:
       probado sobre un teléfono acostado real, flotando sobre la
       pantalla tapaba un control del formulario.
       ============================================================ */
    var zoom = 1, panX = 0, panY = 0;
    var ZOOM_MIN = 1, ZOOM_MAX = 2.6, ZOOM_PASO = 0.35;
    var ZOOM_ALTO = REGLAS.zoomBajoDe || 430;   // px de alto de lienzo

    function pantallaEnJuego() {
      var paso = pasoActual();
      var sl = paso ? slideDe(paso.id) : null;
      return (sl && $('.sim-screen', sl)) || $('.sim-screen');
    }

    function aplicarZoom() {
      $$('.sim-screen').forEach(function (sc) {
        var app = sc.firstElementChild;
        if (!app) return;
        if (zoom <= 1) {
          app.style.transform = '';
          app.style.transformOrigin = '';
        } else {
          app.style.transformOrigin = '0 0';
          app.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoom + ')';
        }
        sc.classList.toggle('is-zoom', zoom > 1);
      });
      $$('[data-sim-zoom-lbl]').forEach(function (b) { b.textContent = Math.round(zoom * 100) + '%'; });
      $$('button[data-sim-zoom="-1"]').forEach(function (b) { b.disabled = zoom <= ZOOM_MIN + 0.01; });
      $$('button[data-sim-zoom="1"]').forEach(function (b) { b.disabled = zoom >= ZOOM_MAX - 0.01; });
    }

    function limitarPan(sc) {
      if (!sc || zoom <= 1) { panX = panY = 0; return; }
      var w = sc.clientWidth, h = sc.clientHeight;
      var maxX = w * (zoom - 1), maxY = h * (zoom - 1);
      panX = Math.min(0, Math.max(-maxX, panX));
      panY = Math.min(0, Math.max(-maxY, panY));
    }

    function cambiarZoom(delta, sc) {
      var antes = zoom;
      zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(zoom + delta * ZOOM_PASO).toFixed(2)));
      if (zoom === antes) return;
      var caja = sc || pantallaEnJuego();
      if (caja) {
        /* El punto fijo del acercamiento NO es el centro geométrico:
           en una pantalla de sistema los controles están arriba y la
           mitad de abajo suele ser una grilla vacía, así que centrar
           en el medio deja al alumno mirando un rectángulo blanco
           (visto en el teléfono, no calculado). Se ancla arriba. */
        var cx = caja.clientWidth / 2, cy = caja.clientHeight * 0.16;
        panX = cx - (cx - panX) * (zoom / antes);
        panY = cy - (cy - panY) * (zoom / antes);
        limitarPan(caja);
      }
      aplicarZoom();
    }

    function initZoom() {
      $$('button[data-sim-zoom]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.preventDefault();
          cambiarZoom(+b.getAttribute('data-sim-zoom'), pantallaEnJuego());
        });
      });

      $$('.sim-screen').forEach(function (sc) {
        var arrastrando = false, movio = false, x0 = 0, y0 = 0, px0 = 0, py0 = 0;
        sc.addEventListener('pointerdown', function (e) {
          if (zoom <= 1) return;
          arrastrando = true; movio = false;
          x0 = e.clientX; y0 = e.clientY; px0 = panX; py0 = panY;
        });
        sc.addEventListener('pointermove', function (e) {
          if (!arrastrando) return;
          var dx = e.clientX - x0, dy = e.clientY - y0;
          // Umbral de 6 px: por debajo sigue siendo un clic, y los
          // controles se pueden tocar con la pantalla acercada.
          if (!movio && Math.abs(dx) + Math.abs(dy) < 6) return;
          movio = true;
          if (sc.setPointerCapture) sc.setPointerCapture(e.pointerId);
          panX = px0 + dx; panY = py0 + dy;
          limitarPan(sc);
          aplicarZoom();
          e.preventDefault();
        });
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
          sc.addEventListener(ev, function () { arrastrando = false; });
        });
        // Un clic que fue en realidad el final de un arrastre no tiene
        // que activar el control que quedó abajo del dedo.
        sc.addEventListener('click', function (e) {
          if (movio) { e.stopPropagation(); e.preventDefault(); movio = false; }
        }, true);
      });

      revisarZoom();
      global.addEventListener('resize', revisarZoom);
    }

    /* La lupa aparece sola donde hace falta. El umbral se mide sobre el
       ALTO del lienzo y no sobre el ancho de la ventana: lo que vuelve
       ilegible a la pantalla es el lienzo bajo de un teléfono
       acostado, y eso no se detecta con un media query de ancho. */
    function revisarZoom() {
      var stage = document.querySelector('.d-stage');
      var chico = !!stage && stage.clientHeight < ZOOM_ALTO;
      $$('[data-sim-zoom-box]').forEach(function (c) { c.hidden = !chico; });
      if (!chico && zoom > 1) { zoom = 1; panX = panY = 0; aplicarZoom(); }
    }

    /* ============================================================
       AVANCE ENTRE PASOS
       ============================================================ */
    function resolverPaso() {
      var paso = pasoActual();
      if (!paso || juego.terminado) return;

      pararReloj();

      premiar(paso.id, REGLAS.puntosPaso || 25, paso.titulo);
      if (juego.erroresPaso === 0) {
        premiar(paso.id + ':limpio', REGLAS.puntosLimpio || 10, 'Sin errores');
      }
      if (Logros && paso.logro) Logros.unlock(paso.logro);

      feedback('ok', juego.erroresPaso === 0
        ? '¡Perfecto! Lo resolviste sin un solo error.'
        : '¡Bien ahí! Esa era.');

      (opts.onPasoResuelto || noop)(paso, juego.paso);

      juego.paso++;
      juego.erroresPaso = 0;
      limpiarZonas();
      pintarRuta();

      if (juego.paso >= PASOS.length) { ganar(); return; }

      // Un respiro antes de cambiar de pantalla: avanzar en el mismo
      // frame se lleva puesto el feedback que el alumno no leyó.
      setTimeout(function () {
        if (juego.terminado) return;
        if (global.motor) motor.gotoId(PASOS[juego.paso].id);
        if (juego.pistas === 0) arrancarReloj();
      }, REGLAS.respiroMs || 1400);
    }

    /* Ganar y SALIR de la última pantalla son dos momentos distintos.
       Antes eran uno solo: al resolver la última, el simulador saltaba
       derecho al cierre y el alumno nunca llegaba a ver QUÉ hizo bien.
       `ganar()` congela la partida y le deja al curso mostrar su
       resumen; `terminar()` es lo que ese resumen llama al cerrarse. */
    function ganar() {
      juego.terminado = true;
      juego.ganado = true;
      cancelarNudge();
      ocultarReloj();
      limpiarZonas();
      if (Logros && E.logroFinal) Logros.unlock(E.logroFinal);
      sincronizar();
      (opts.onGanar || noop)();
    }

    /* Cierra el resumen y DEJA AL ALUMNO donde estaba, en la última
       pantalla ya resuelta. No lo lleva al cierre: el avance lo maneja
       él con la barra de abajo, que es como avanzó en todo el resto
       del curso. Antes saltaba solo y era un salto de más — el alumno
       acababa de leer el resumen y de golpe estaba en otra pantalla
       sin haber tocado nada que dijera "llevame ahí". */
    function terminar() {
      if (global.motor) motor.closePopup();
      if (Cierre && Cierre.unlockCierre) Cierre.unlockCierre();
      sincronizar();
      if (Player && Player.toast) {
        Player.toast('✓ Simulador completo — tocá "Siguiente" para el cierre');
      }
    }

    /* ============================================================
       SINCRONIZAR LA PANTALLA CON EL ESTADO
       ============================================================ */
    function sincronizar() {
      if (!global.motor) return;
      var cur = motor.slides[motor.index];
      var id = cur && cur.getAttribute('data-slide');

      /* El riel se muestra SOLO en la pantalla que se está resolviendo,
         no en cualquiera del simulador. Antes aparecía también al
         volver atrás a una ya resuelta, y ahí la lupa daba la pista del
         paso ACTUAL — o sea, de otra pantalla. */
      var rail = $('[data-sim-rail]');
      var paso = pasoActual();
      var enJuego = !!paso && paso.id === id && !juego.terminado;
      if (rail) rail.hidden = !enJuego;

      /* La hoja de ruta acompaña a TODAS las pantallas del simulador,
         incluso las ya resueltas: es el mapa del procedimiento, no el
         panel de ayudas de la pantalla en curso. */
      var esSim = PASOS.some(function (pp) { return pp.id === id; });
      var ruta = $('[data-sim-ruta]');
      if (ruta) ruta.hidden = !esSim;
      pintarRuta();

      /* Toda la cáscara del curso —puntos, glosario, índice— se apaga
         adentro del simulador. No es cosmética: el chip de puntos
         convierte cada pantalla en una jugada por puntaje, el índice es
         un atajo para salirse del procedimiento en el medio, y el
         glosario es una ventana que tapa la pantalla que el alumno
         tiene que estar mirando. Vuelven en la portada y en el cierre,
         que es donde sirven. El CSS lo hace con `body.sim-jugando`. */
      document.body.classList.toggle('sim-jugando', esSim);

      /* "Anterior" adentro del simulador significa SALIR, no retroceder
         una pantalla: hacia atrás solo hay pantallas ya resueltas, que
         están congeladas. El rótulo lo dice, porque un botón que hace
         otra cosa de la que dice es peor que un botón que falta.
         Esconderlo directamente —que fue la primera versión— rompe la
         garantía del kit de que el alumno nunca queda encerrado
         (`full-regress` la mide). */
      var prev = $('[data-nav="prev"]');
      if (prev) {
        var lbl = $('span:not(.sr-only)', prev);
        if (lbl) lbl.textContent = esSim ? 'Al inicio' : 'Anterior';
        prev.setAttribute('aria-label', esSim
          ? 'Volver al inicio del simulador' : 'Diapositiva anterior');
      }

      /* Una pantalla ya resuelta queda congelada y lo dice.
         Antes seguía viva pero muda: se podía tipear, tocar el botón y
         no pasaba nada, porque los handlers salen temprano si no es el
         paso actual. Un control que responde al clic y no hace nada es
         un control roto (§7.3) — y en un simulador es peor, porque el
         alumno no sabe si se rompió el curso o si hizo algo mal.
         `inert` y no `disabled`: apaga el clic Y el recorrido por
         teclado de todo el subárbol de una vez, y se revierte solo sin
         tener que acordarse de cuáles controles venían deshabilitados
         de fábrica. */
      PASOS.forEach(function (pp, i) {
        var sl = slideDe(pp.id);
        if (!sl) return;
        var resuelto = juego.paso > i;
        var pantalla = sl.querySelector('.sim-screen');
        if (pantalla) pantalla.inert = resuelto;
        var cartel = sl.querySelector('[data-sim-resuelto]');
        if (cartel) cartel.hidden = !resuelto;
        sl.classList.toggle('is-resuelto', resuelto);
      });
    }

    /* ============================================================
       CABLEADO
       ============================================================ */
    /* ============================================================
       VER / OCULTAR LA CONTRASEÑA
       ------------------------------------------------------------
       Cualquier simulador que empiece por un login necesita esto, y
       necesita el MOTIVO, que no es obvio:

       El campo NO puede ser `type="password"`. Chrome ignora
       `autocomplete="off"` en cualquier formulario que huela a login,
       y lo que lo delata es justamente ese `type`: aparecía el
       desplegable con las credenciales GUARDADAS DEL ALUMNO encima
       del campo de usuario. Sin campo de contraseña real no hay login
       que detectar, y los datos del simulador se quedan adentro del
       simulador. El enmascarado lo hace el CSS
       (`-webkit-text-security`), que cubre Chrome/Edge/Safari — todo
       lo que corre en las máquinas de sucursal. **Firefox no**, y
       queda dicho acá y no escondido.

       Y por qué existe el ojito: en una pantalla de práctica, escribir
       a ciegas una clave que el curso acaba de enseñar es fricción sin
       ningún valor — el alumno no sabe si se equivocó de tecla o de
       dato, y el simulador termina evaluando su tipeo.

       El ícono cuenta el ESTADO, no la acción: oculta → ojo tachado;
       visible → ojo abierto.
       ============================================================ */
    function verClave(mostrar) {
      var btn = $('[data-sim-ver-clave]'), inp = $('[data-sim-pass]');
      if (!btn || !inp) return;
      inp.classList.toggle('is-oculta', !mostrar);
      btn.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
      btn.setAttribute('aria-label', mostrar ? 'Ocultar la contraseña' : 'Mostrar la contraseña');
      var on = $('[data-sim-ojo="on"]', btn), off = $('[data-sim-ojo="off"]', btn);
      if (on) on.hidden = !mostrar;
      if (off) off.hidden = mostrar;
    }

    function initVerClave() {
      var btn = $('[data-sim-ver-clave]'), inp = $('[data-sim-pass]');
      if (!btn || !inp) return;
      btn.addEventListener('click', function () {
        verClave(inp.classList.contains('is-oculta'));
      });
      verClave(false);   // una partida nueva empieza con la clave tapada
    }

    function cablear() {
      ponerAdornos();
      initZoom();
      initVerClave();
      pintarLupas();
      pintarRuta();

      $$('[data-sim-pista]').forEach(function (b) {
        b.addEventListener('click', usarPista);
      });

      /* ---- Gate de avance ----
         No se puede pasar de una pantalla del simulador sin resolverla.
         Es el mismo contrato que los gates del kit (`motor.canAdvance`),
         solo que la regla la decide el estado del juego y no una lista
         de pop-ups vistos. */
      if (global.motor) {
        motor.canAdvance = function (slideEl) {
          var id = slideEl && slideEl.getAttribute('data-slide');
          var i = PASOS.findIndex(function (p) { return p.id === id; });
          if (i < 0) return true;              // portada y cierre no bloquean
          return juego.paso > i || juego.ganado;
        };
      }

      // El gate no puede ser mudo (§6.10): si el alumno insiste con
      // "Siguiente", hay que decirle qué le falta, no solo negarle el paso.
      document.addEventListener('advanceblocked', function () {
        if (!pasoActual()) return;
        if (Player && Player.toast) Player.toast('Resolvé esta pantalla para seguir.');
        feedback('mal', 'Todavía no terminaste esta pantalla. ' +
          (juego.pistas > 0 ? 'Si no sabés por dónde seguir, usá una pista.'
                            : 'Ya no te quedan pistas: mirá bien antes de tocar.'));
      });

      /* Del "¡Ups!" no hay otra salida que reintentar. El motor cierra
         CUALQUIER pop-up con Escape o con un clic en el fondo, y eso
         acá dejaba al alumno en una partida congelada —todos los
         controles mudos, el riel escondido— sin nada en pantalla que lo
         explicara. No se le pelea el Escape al motor: se le da al
         cierre el único significado que tiene acá, empezar de nuevo. */
      document.addEventListener('popupclose', function (e) {
        if (!e.detail || e.detail.id !== 'ups') return;
        if (juego.perdido) reiniciar('retomar');
      });

      $$('[data-sim-reintentar]').forEach(function (b) {
        b.addEventListener('click', function () { reiniciar('retomar'); });
      });
      /* `$$` y no `$`: "Volver a intentarlo" suele existir en más de un
         lugar —el resumen, el arte del cierre— y con `querySelector`
         solo el primero queda cableado. El segundo se ve igual y no
         hace nada. */
      $$('[data-sim-reiniciar], [data-sim-reiniciar-cero]').forEach(function (b) {
        b.addEventListener('click', function () { reiniciar('cero'); });
      });

      /* "Anterior" adentro del simulador sale al inicio. Se engancha en
         CAPTURA para llegar antes que el motor: el motor ya tiene su
         propio listener en el mismo nodo, y el orden entre dos
         listeners del mismo elemento lo decide quién se registró
         primero — que no es algo que este archivo pueda garantizar. */
      var prevBtn = $('[data-nav="prev"]');
      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          if (!document.body.classList.contains('sim-jugando')) return;
          e.stopPropagation();
          e.preventDefault();
          if (global.motor && PASOS.length) {
            var portada = motor.slides[0] && motor.slides[0].getAttribute('data-slide');
            if (portada) motor.gotoId(portada);
          }
        }, true);
      }

      /* Cualquier actividad dentro del simulador reinicia la cuenta del
         nudge: el aviso es para quien se trabó, no para quien está
         leyendo con calma. */
      ['pointerdown', 'keydown'].forEach(function (ev) {
        document.addEventListener(ev, apagarNudge, true);
      });

      document.addEventListener('slidechange', function () {
        ocultarFeedback();
        cancelarNudge();
        limpiarZonas();
        sincronizar();
        armarNudge();

        // Volver a una pantalla del simulador con el reloj corriendo lo
        // reinicia: el tiempo es por pantalla, no una cuenta global.
        var cur = motor.slides[motor.index];
        var id = cur && cur.getAttribute('data-slide');
        var enPaso = pasoActual() && pasoActual().id === id;
        if (enPaso && juego.pistas === 0 && !juego.terminado) arrancarReloj();
        else if (!enPaso) pararReloj();
      });

      sortearVariante();
      sincronizar();
    }

    cablear();

    /* ---- API pública ----
       Lo mínimo que el curso necesita para cablear SUS pantallas. */
    return {
      errar: errar,
      verClave: verClave,
      feedback: feedback,
      resolverPaso: resolverPaso,
      usarPista: usarPista,
      reiniciar: reiniciar,
      terminar: terminar,
      ganar: ganar,
      perder: perder,
      sincronizar: sincronizar,
      pasoActual: pasoActual,
      variante: function () { return VARIANTE; },
      pistasUsadas: function () { return pistasUsadas; },
      /* Copia del estado, no el objeto: que un curso pueda escribirle
         `juego.ganado = true` desde afuera es abrir el gate a mano. */
      estado: function () {
        return { paso: juego.paso, pistas: juego.pistas, erroresPaso: juego.erroresPaso,
                 terminado: juego.terminado, ganado: juego.ganado, perdido: juego.perdido };
      },
      /* Para los handlers del curso: "¿esta pantalla es la que se está
         jugando ahora?". Sin esto cada pantalla repite la misma
         condición de tres partes y una se olvida. */
      esPasoActivo: function (id) {
        var p = pasoActual();
        return !!p && p.id === id && !juego.terminado;
      }
    };
  }

  global.initSimulador = initSimulador;
  global.CotoSimulador = { initSimulador: initSimulador, NIVELES: NIVELES, LUPA_SVG: LUPA_SVG };
})(window);
