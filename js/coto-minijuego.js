/* ============================================================
   coto-minijuego.js · LA MECÁNICA DEL MINIJUEGO "¿QUÉ ESTÁ MAL?"
   ------------------------------------------------------------
   kit-base v1.9.87 · subido desde "Seguridad alimentaria" (§7.34).

   POR QUÉ SUBE AHORA, Y LA SALVEDAD SOBRE LA REGLA §4
   ---------------------------------------------------
   La regla §4 pide DOS cursos antes de generalizar, y minijuego hay
   uno solo. Igual sube, por una razón concreta: el CSS del minijuego
   YA estaba en el kit (`coto-minijuego.css`, ~120 reglas), promovido
   en su momento desde ese mismo curso. O sea que la función estaba
   MEDIO promovida — 37 clases `.d-mj-*` con estilo en el kit y cero
   forma de usarlas, porque toda la máquina vivía en el `curso.js` de
   un curso. Un curso nuevo que quisiera un minijuego tenía el CSS
   servido y ~370 líneas para reescribir de cero.

   Medio promovido es el peor estado: paga el costo de mantener el CSS
   genérico sin ninguno de los beneficios. Así que esto no es
   generalizar de un caso — es terminar una promoción a medio hacer.

   ⚠️ Con UN solo caso de referencia, la API de abajo va a estar
   sesgada hacia ese curso. Cuando aparezca el segundo minijuego,
   esperar tener que mover cosas: lo que hoy son opciones puede tener
   que ser callback, y algún texto fijo puede tener que salir afuera.
   Eso NO es deuda: es el segundo caso haciendo su trabajo.

   QUÉ RESUELVE ESTE ARCHIVO Y QUÉ LE DEJA AL CURSO
   -----------------------------------------------
   Acá vive la MECÁNICA: armar el mapa de opciones, las vidas, el
   marcador, la pista por inactividad, la remediación al reintentar,
   el encendido de los hotspots del dibujo, el repaso y el paso entre
   las tres capas (portada → juego → resultado).

   El curso pone LOS DATOS y LA ECONOMÍA:
     · `opciones` y `fb` — qué se puede elegir y qué se contesta;
     · los callbacks de puntaje (`onAcierto`, `onFin`): el kit NO sabe
       de `PUNTOS`, `award()`, logros ni SCORM, y no tiene por qué.
       Ese es justo el código que cambia de un curso a otro, y meterlo
       acá obligaría a cada curso a pelearle a una economía ajena.
     · la persistencia (`memoria`): un objeto plano que el curso
       guarda donde guarda todo lo demás.

   ⚠️ LAS TRES CAPAS SE CAMBIAN COMO LAS CAMBIA EL CURSO, no con
   `hidden` a mano: se busca el `[data-target="..."]` correspondiente
   y se lo clickea, que es el mismo camino que usa el alumno. Así el
   motor de capas (`data-layers`) se entera, y la narración y el
   `_syncNav()` siguen funcionando. Poner `hidden` directo deja al
   motor con una idea vieja de qué capa está arriba.
   ============================================================ */
(function (global) {
  'use strict';

  var HEART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M12 21s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.3-9.3 9-9.3 9z"/></svg>';

  function elegirAlAzar(arr, n) {
    var copia = arr.slice(), out = [];
    while (copia.length && out.length < n) {
      out.push(copia.splice(Math.floor(Math.random() * copia.length), 1)[0]);
    }
    return out;
  }

  /* ============================================================
     initMinijuego(opts)
     ------------------------------------------------------------
       opts.opciones  [{ id, txt, ok }]  OBLIGATORIA. El orden es el
                      del mapa si no se pasa `pos`.
       opts.fb        { id: 'texto' } — la devolución de cada opción.
                      La correcta explica QUÉ se ve; la incorrecta,
                      por qué no corresponde, sin retar (§6.10.2.3).
       opts.pos       [[col,row], …] — posición en el grid, 1 por
                      opción. Sin esto, fluyen solas.
       opts.slide     id de la diapositiva (def. 'minijuego')
       opts.vidas     def. 3
       opts.aprobar   YA NO SE USA (v1.9.135). Pasar = GANAR: encontrar
                      todas las `ok` antes de quedarse sin vidas. Con
                      `aprobar` menor que el total, perder con 4 de 6
                      mostraba "Reintentar" y a la vez abría el Siguiente
                      (reporte del cliente en "Seguridad alimentaria"):
                      la pantalla y el paso decían cosas distintas. Si
                      el curso lo pasa, se ignora y avisa en consola.
       opts.pistaMs   inactividad antes de la pista (def. 20000; 0 la
                      apaga)
       opts.artes     { exito, reintentar } — src de la imagen final
       opts.memoria   objeto del curso, PERSISTENTE entre intentos y
                      sesiones. El kit lee y escribe `aciertos` y
                      `errados`; el curso lo guarda con el resto.
       opts.decir     fn(texto) — narrar. Sin esto, no narra.
       opts.onAcierto fn(opcion, esPrimeraVez) — puntaje del curso.
                      ⚠️ `esPrimeraVez` es false si ese hallazgo ya se
                      encontró en un intento anterior: sin ese dato, un
                      curso que permita reintentar sin límite paga los
                      mismos puntos cada vuelta (bug real del curso de
                      origen).
       opts.onError   fn(opcion)
       opts.onEmpezar fn() — al empezar cada partida (v1.9.135)
       opts.onFin     fn({ gano, hallados, total, errores, orden })
       opts.textoFin  fn({ gano, hallados, total }) -> texto a narrar
       opts.yaGanado  fn() -> { hallados } | null — si el alumno ya ganó en
                      otra sesión (lo guardó el curso en `onFin`), al entrar
                      se ve el panel final y no la bienvenida (v1.9.123).
       opts.celebrar  fn() — el festejo al ganar (confeti, sonido…).
                      Lo pone el curso: el confeti del kit vive dentro
                      de `initCierreCelebration` y es del cierre.

     Devuelve { empezar, reset, estado }.
     ============================================================ */
  function initMinijuego(opts) {
    opts = opts || {};
    var OPCIONES = opts.opciones || [];
    if (!OPCIONES.length) return null;

    var slideId = opts.slide || 'minijuego';
    var slide = document.querySelector('[data-slide="' + slideId + '"]');
    if (!slide) return null;
    var grid = slide.querySelector('[data-mj-grid]');
    if (!grid) return null;

    var FB = opts.fb || {};
    var POS = opts.pos || null;
    var VIDAS = opts.vidas == null ? 3 : opts.vidas;
    var TOTAL = OPCIONES.filter(function (o) { return o.ok; }).length;
    if (opts.aprobar != null && opts.aprobar < TOTAL && global.console) {
      console.warn('initMinijuego: `aprobar` ya no abre el paso sin ganar (kit-base v1.9.135). ' +
        'El minijuego se aprueba encontrando las ' + TOTAL + '; sacá `aprobar` del curso.');
    }
    var PISTA_MS = opts.pistaMs == null ? 20000 : opts.pistaMs;
    var memoria = opts.memoria || {};
    if (!memoria.aciertos) memoria.aciertos = {};
    if (!memoria.errados) memoria.errados = {};
    var decir = typeof opts.decir === 'function' ? opts.decir : function () {};

    var fbEl = slide.querySelector('[data-mj-fb]');
    var remedyEl = slide.querySelector('[data-mj-remedy]');
    var foundEl = slide.querySelector('[data-mj-found]');
    var scoreEl = slide.querySelector('[data-mj-score]');
    var livesEl = slide.querySelector('[data-mj-lives]');
    var finImg = slide.querySelector('[data-mj-fin-img]');
    var finFound = slide.querySelector('[data-mj-fin-found]');
    var finScore = slide.querySelector('[data-mj-fin-score]');
    var finSay = slide.querySelector('[data-mj-fin-say]');
    /* El repaso es un pop-up real y vive FUERA de la diapositiva, con
       los demás pop-ups del documento: estos tres se buscan desde
       `document`, no desde `slide`. */
    var repasoListEl = document.querySelector('[data-mj-repaso-list]');
    var repasoTitleEl = document.querySelector('[data-mj-repaso-title]');
    var repasoSubEl = document.querySelector('[data-mj-repaso-sub]');

    var partidas = 0;   // partidas terminadas en esta sesión (logro Impecable)
    var mj = { vidas: VIDAS, hallados: {}, errados: {}, orden: [], activo: false, errores: 0 };
    var pistaTimer = null;
    var pendienteFin = null;

    function irA(panel) {
      var b = slide.querySelector('[data-target="' + panel + '"]');
      if (b) b.click();
    }

    function pintarVidas() {
      if (!livesEl) return;
      livesEl.innerHTML = '';
      for (var i = 0; i < VIDAS; i++) {
        var h = document.createElement('span');
        h.className = 'd-mj-heart' + (i < mj.vidas ? '' : ' is-off');
        h.setAttribute('aria-hidden', 'true');
        h.innerHTML = HEART_SVG;
        livesEl.appendChild(h);
      }
      livesEl.setAttribute('aria-label', 'Vidas restantes: ' + mj.vidas + ' de ' + VIDAS);
    }

    function hud() {
      var n = Object.keys(mj.hallados).length;
      if (foundEl) foundEl.textContent = n + '/' + TOTAL;
      /* El marcador de puntos lo escribe el CURSO desde `onAcierto`
         (es su moneda, no una escala interna de acá). El kit solo se
         asegura de que el nodo exista y arranque en algo. */
      if (scoreEl && !scoreEl.textContent) scoreEl.textContent = '0';
      pintarVidas();
    }

    function armarGrid() {
      grid.innerHTML = '';
      OPCIONES.forEach(function (o, idx) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'd-mj-opt';
        b.textContent = o.txt;
        b.setAttribute('data-mj-opt', o.id);
        if (POS && POS[idx]) {
          b.style.gridColumn = String(POS[idx][0]);
          b.style.gridRow = String(POS[idx][1]);
        }
        b.addEventListener('click', function () { responder(o, b); });
        grid.appendChild(b);
      });
    }

    function resetBotones() {
      grid.querySelectorAll('.d-mj-opt').forEach(function (b) {
        b.className = 'd-mj-opt';
        b.disabled = false;
      });
    }

    /* ---- Pista tras inactividad ----
       Resalta 1 correcta todavía no encontrada + 2 incorrectas todavía
       no probadas. La correcta lleva `.is-hint-ok` y las otras
       `.is-hint-bad`: el cliente pidió expresamente que SÍ se note cuál
       es la buena — resaltar las tres igual, para no delatar, resultó
       ser una pista que no ayudaba a nadie. */
    function marcarHint(id, ok) {
      var btn = grid.querySelector('[data-mj-opt="' + id + '"]');
      if (btn) btn.classList.add('is-hint', ok ? 'is-hint-ok' : 'is-hint-bad');
    }
    function limpiarPista() {
      if (pistaTimer) { clearTimeout(pistaTimer); pistaTimer = null; }
      grid.querySelectorAll('.d-mj-opt.is-hint').forEach(function (b) {
        b.classList.remove('is-hint', 'is-hint-ok', 'is-hint-bad');
      });
    }
    function programarPista() {
      limpiarPista();
      if (!PISTA_MS) return;
      pistaTimer = setTimeout(function () {
        var correctas = OPCIONES.filter(function (o) { return o.ok && !mj.hallados[o.id]; });
        var incorrectas = OPCIONES.filter(function (o) { return !o.ok && !mj.errados[o.id]; });
        if (!correctas.length) return;
        elegirAlAzar(correctas, 1).forEach(function (o) { marcarHint(o.id, true); });
        elegirAlAzar(incorrectas, 2).forEach(function (o) { marcarHint(o.id, false); });
      }, PISTA_MS);
    }

    /* Remediación al reintentar: se resaltan de entrada las opciones
       que la vez pasada fueron un error elegido o un hallazgo que
       nunca apareció, en vez de dejar todas en igualdad de condiciones.
       ⚠️ Va DESPUÉS de `programarPista()` a propósito: esa función
       limpia cualquier `.is-hint` antes de armar su timer, así que
       aplicarla antes la borraría de inmediato. */
    function aplicarRemediacion() {
      var ids = Object.keys(memoria.errados);
      if (remedyEl) remedyEl.hidden = !ids.length;
      ids.forEach(function (id) {
        /* `memoria.errados` mezcla dos cosas (ver `terminar()`): una
           distracción elegida por error, o un hallazgo real que nunca
           se encontró. Cada una necesita su color. */
        var opt = OPCIONES.filter(function (o) { return o.id === id; })[0];
        marcarHint(id, !!(opt && opt.ok));
      });
    }

    function feedback(ok, txt) {
      if (!fbEl) return;
      fbEl.className = 'd-mj-fb ' + (ok ? 'is-ok' : 'is-bad');
      fbEl.textContent = txt || '';
      if (txt) decir(txt);
    }

    function responder(o, btn) {
      if (!mj.activo || btn.disabled) return;
      btn.disabled = true;
      mj.orden.push({ id: o.id, ok: o.ok });
      if (o.ok) {
        mj.hallados[o.id] = true;
        btn.classList.add('is-ok');
        /* Al acertar se prende la zona real del dibujo:
           `data-mj-hotspot` coincide 1:1 con el id de la opción, así
           que no hace falta tabla de mapeo. La cáscara visual (halo,
           pulso, posición) es toda del CSS del kit. */
        var spot = slide.querySelector('[data-mj-hotspot="' + o.id + '"]');
        if (spot) spot.classList.add('is-on');
        feedback(true, FB[o.id]);
        var primera = !memoria.aciertos[o.id];
        memoria.aciertos[o.id] = true;
        if (opts.onAcierto) opts.onAcierto(o, primera);
      } else {
        mj.errados[o.id] = true;
        mj.vidas--;
        mj.errores++;
        btn.classList.add('is-bad');
        feedback(false, FB[o.id]);
        if (opts.onError) opts.onError(o);
      }
      hud();
      if (Object.keys(mj.hallados).length >= TOTAL) return terminar(true);
      if (mj.vidas <= 0) return terminar(false);
      programarPista();
    }

    /* ¿Está hablando el narrador ahora? Decide cuánto vale la red de
       seguridad: si no hay locución, el respaldo corto de siempre; si
       la hay, un tope generoso que solo actúa si `narracionfin` no
       llega (una voz que se cuelga, por ejemplo). */
    function hablando() {
      var N = global.Narrador;
      return !!(N && N.isNarrating && N.isNarrating() &&
        global.speechSynthesis && global.speechSynthesis.speaking);
    }

    function terminar(gano) {
      mj.activo = false;
      mj.ganado = mj.ganado || !!gano;   // ver el `slidechange` del final
      limpiarPista();
      var hallados = Object.keys(mj.hallados).length;

      /* Qué se guarda para el próximo intento: si encontró todas, no
         queda nada que reforzar. Si no, sus distracciones MÁS los
         hallazgos que nunca aparecieron. */
      if (gano) {
        memoria.errados = {};
      } else {
        Object.keys(mj.errados).forEach(function (id) { memoria.errados[id] = true; });
        OPCIONES.forEach(function (o) { if (o.ok && !mj.hallados[o.id]) memoria.errados[o.id] = true; });
      }

      /* Para el logro Impecable del kit (coto-logros.js, v1.9.125): la
         primera partida de la sesión, ganada y sin errores. */
      partidas++;
      document.dispatchEvent(new CustomEvent('cotominijuego', { detail: { gano: !!gano, errores: mj.errores, primera: partidas === 1 } }));

      if (opts.onFin) {
        opts.onFin({ gano: gano, hallados: hallados, total: TOTAL,
                     /* `aprobado` = `gano`, siempre (v1.9.135): lo que
                        dice el panel final ("Continuar" o "Reintentar")
                        es lo que decide el paso. Queda el campo para los
                        cursos que ya lo leen. */
                     aprobado: !!gano, errores: mj.errores,
                     orden: mj.orden.slice() });
      }

      if (finImg && opts.artes) {
        var src = gano ? opts.artes.exito : opts.artes.reintentar;
        if (src) finImg.setAttribute('src', src);
      }
      if (finFound) finFound.textContent = hallados + '/' + TOTAL;

      /* El botón del panel final es UNO solo con dos comportamientos:
         el arte suele traer "Reintentar" dibujado en las DOS versiones,
         también en la de aprobado, así que el texto lo pone acá y el
         `data-mj-accion` decide qué hace. Quien aprueba tiene que poder
         seguir, no reintentar. */
      slide.querySelectorAll('[data-mj-retry]').forEach(function (b) {
        b.textContent = gano ? 'Continuar' : 'Reintentar';
        b.setAttribute('data-mj-accion', gano ? 'continuar' : 'reintentar');
        b.setAttribute('aria-label', gano ? 'Continuar con el curso' : 'Reintentar el mini juego');
      });

      var dicho = opts.textoFin
        ? opts.textoFin({ gano: gano, hallados: hallados, total: TOTAL })
        : (gano
            ? '¡Terminaste el mini juego con éxito! Encontraste las ' + TOTAL + ' cosas que estaban mal.'
            : '¡Ups! Estuviste cerca. Encontraste ' + hallados + ' de ' + TOTAL + '. Tocá "Reintentar" para intentarlo de nuevo.');
      if (finSay) finSay.textContent = dicho;

      /* ---- Esperar a que TERMINE de hablar, no 700 ms ----
         kit-base v1.9.91. Antes había un `setTimeout(…, 700)` acá, y
         era un número puesto a ojo: la devolución del último hallazgo
         arrancaba y se CORTABA EN SECO cuando el pop-up de repaso
         aparecía encima. 700 ms no alcanzan para leer una devolución de
         dos renglones, y la duración real depende del texto, del
         dispositivo y de qué voces haya instaladas — o sea que ningún
         número fijo podía estar bien.

         `narracionfin` (narrador.js, v1.9.91) avisa cuando termina
         CUALQUIER locución, no solo la de diapositiva: es justo el
         aviso que faltaba. Se escucha una sola vez.

         ⚠️ Con red de seguridad: si no hay locución —el alumno la
         apagó, el navegador no tiene voces, o el texto estaba vacío—
         ese evento no llega nunca y el repaso no se abriría jamás. El
         timer de respaldo garantiza que el juego siempre avanza; lo que
         cambia es que ya no es LA regla sino el último recurso. */
      var repasoLanzado = false;
      function lanzarRepaso() {
        if (repasoLanzado) return;
        repasoLanzado = true;
        document.removeEventListener('narracionfin', lanzarRepaso);
        pendienteFin = { gano: gano, dicho: dicho };
        mostrarRepaso(gano);
      }
      /* ⚠️ Se espera con `Narrador.alTerminar` (kit-base v1.9.99), no con
         `hablando()` + un temporizador. `hablando()` pregunta en el
         INSTANTE en que termina la partida, que es justo después de pedir
         la última devolución —y `speechSynthesis.speak()` es asíncrono:
         en ese instante `speaking` todavía es false—, así que el tope
         caía en 700ms y el repaso cortaba la devolución. MEDIDO con un
         motor de voz asíncrono: devolución en t=8120, repaso en t=8821, y
         la devolución nunca llegaba a su fin. Es el bug que reportó el
         cliente en "Seguridad alimentaria", que lo resolvió del lado del
         curso con la misma función que ahora vive en narrador.js.
         Sin narrador cargado queda el respaldo de siempre. */
      if (global.Narrador && global.Narrador.alTerminar) global.Narrador.alTerminar(lanzarRepaso);
      else {
        document.addEventListener('narracionfin', lanzarRepaso);
        setTimeout(lanzarRepaso, hablando() ? 12000 : 700);
      }
    }

    /* ---- Repaso, entre terminar la partida y ver el resultado ----
       Al GANAR: las correctas con su explicación completa — ya las
       encontró todas, no hay nada que espoilear.
       Al PERDER: SOLO lo que eligió en ESTA partida, en el orden real
       en que clickeó. Nunca la lista completa de correctas: sería
       arruinarle el reintento mostrándole de arranque qué le falta. */
    function mostrarRepaso(gano) {
      if (!repasoListEl) { irA('mj-fin'); return; }
      repasoListEl.innerHTML = '';
      var items;
      if (gano) {
        if (repasoTitleEl) repasoTitleEl.textContent = '¡Encontraste las ' + TOTAL + '!';
        if (repasoSubEl) repasoSubEl.textContent = 'Antes de ver tu resultado final, repasemos qué estaba mal en la imagen y por qué.';
        items = OPCIONES.filter(function (o) { return o.ok; })
          .map(function (o) { return { id: o.id, ok: true, txt: o.txt }; });
      } else {
        if (repasoTitleEl) repasoTitleEl.textContent = 'Repasemos tu partida';
        if (repasoSubEl) repasoSubEl.textContent = 'Esto es lo que elegiste esta vez. Las que todavía no encontraste te esperan en el reintento.';
        items = mj.orden.map(function (a) {
          var o = OPCIONES.filter(function (x) { return x.id === a.id; })[0];
          return { id: a.id, ok: a.ok, txt: o ? o.txt : a.id };
        });
      }
      items.forEach(function (it) {
        var li = document.createElement('li');
        li.className = 'd-mj-repaso-item ' + (it.ok ? 'is-ok' : 'is-bad');
        var ic = document.createElement('span');
        ic.className = 'd-mj-repaso-ic';
        ic.setAttribute('aria-hidden', 'true');
        ic.textContent = it.ok ? '✓' : '✕';
        var txt = document.createElement('div');
        txt.className = 'd-mj-repaso-txt';
        var b = document.createElement('b'); b.textContent = it.txt;
        var p = document.createElement('p'); p.textContent = FB[it.id] || '';
        txt.appendChild(b); txt.appendChild(p);
        li.appendChild(ic); li.appendChild(txt);
        repasoListEl.appendChild(li);
      });
      if (global.motor) global.motor.showPopup('mj-repaso');
      if (repasoTitleEl && repasoSubEl) {
        decir(repasoTitleEl.textContent + '. ' + repasoSubEl.textContent);
      }
    }

    /* `opts.onEmpezar()` (v1.9.135, relevo SA K8): al arrancar CADA
       partida, para que el curso vuelva a 0 su marcador del intento. Antes
       el curso lo hacía escuchando el clic de [data-mj-start]/[data-mj-retry]
       en captura, atado al marcado. */
    function empezar() {
      mj.vidas = VIDAS; mj.hallados = {}; mj.errados = {};
      mj.orden = []; mj.activo = true; mj.errores = 0;
      /* DESPUÉS de reiniciar (relevo SA L1): un curso que repinta su
         marcador desde `estado.hallados` lo pintaba con los de la partida
         anterior (perder con 4 y "Reintentar" arrancaba en 120). */
      if (typeof opts.onEmpezar === 'function') { try { opts.onEmpezar(); } catch (e) {} }
      resetBotones();
      slide.querySelectorAll('[data-mj-hotspot].is-on').forEach(function (s) { s.classList.remove('is-on'); });
      if (fbEl) { fbEl.textContent = ''; fbEl.className = 'd-mj-fb'; }
      hud();
      irA('mj-jugar');
      decir('¿Qué observás en esta imagen que esté mal? Elegí las ' + TOTAL + ' cosas que están mal.');
      programarPista();
      aplicarRemediacion();
    }

    armarGrid();
    hud();

    slide.querySelectorAll('[data-mj-start]').forEach(function (b) {
      b.addEventListener('click', empezar);
    });
    slide.querySelectorAll('[data-mj-retry]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-mj-accion') === 'continuar') {
          if (global.motor) global.motor._advance(1);
          return;
        }
        empezar();
      });
    });

    /* "Ver resultado" del repaso lleva `data-popup-close`, así que el
       motor ya lo cierra solo (junto con ✕/Esc/fondo). Acá solo se
       reacciona al cierre, venga por donde venga. */
    document.addEventListener('popupclose', function (e) {
      if (!e.detail || e.detail.id !== 'mj-repaso' || !pendienteFin) return;
      irA('mj-fin');
      decir(pendienteFin.dicho);
      /* ⚠️ El festejo lo pone el CURSO (`opts.celebrar`), no el kit.
         La primera versión llamaba a `global.confetti()` —así se
         llamaba en el curso de origen— y `check-globals` lo cazó: el
         kit NO publica ningún `confetti`. Su confeti es `celebrate()`,
         privado de `initCierreCelebration` y atado a `#d-confetti`.
         O sea que el festejo del minijuego nunca habría salido, sin un
         solo error en consola: la forma exacta de §7.17. */
      if (pendienteFin.gano && typeof opts.celebrar === 'function') opts.celebrar();
      if (global.motor) global.motor.refrescarGate();
      pendienteFin = null;
    });

    /* ⚠️ El motor no recarga la diapositiva al navegar, así que quien
       sale a mitad de partida y vuelve encontraría la capa "jugar" o
       "fin" tal cual la dejó, sin ningún botón visible para arrancar
       de nuevo. Al SALIR se resetea a la portada del juego. */
    /* …salvo que ya GANÓ (kit-base v1.9.123, §7.72; relevo de NOA, P).
       Pedido del cliente: *"terminé el minijuego, pasé a últimos consejos y
       apreté Anterior para volver a ver mi puntaje, pero me llevó a la
       pantalla de empezar a jugar"*. Ganado, el panel final se deja como
       está (ya trae el resultado y "Continuar"). Para retomar OTRO día, el
       curso guarda el resultado en `onFin` y lo devuelve en `yaGanado()`.
       Portado del parche de NOA, que lo había resuelto en su minijuego
       propio; acá lo mide `minijuego.mjs` con el del kit. */
    document.addEventListener('slidechange', function (e) {
      if (e.detail.id !== slideId) {
        mj.activo = false; limpiarPista();
        if (!mj.ganado) irA('mj-intro');
      } else if (!mj.ganado && typeof opts.yaGanado === 'function') {
        var r = opts.yaGanado();
        if (!r) return;
        mj.ganado = true;
        if (finImg && opts.artes && opts.artes.exito) finImg.setAttribute('src', opts.artes.exito);
        if (finFound && typeof r.hallados === 'number') finFound.textContent = r.hallados + '/' + TOTAL;
        slide.querySelectorAll('[data-mj-retry]').forEach(function (b) {
          b.textContent = 'Continuar';
          b.setAttribute('data-mj-accion', 'continuar');
          b.setAttribute('aria-label', 'Continuar con el curso');
        });
        irA('mj-fin');
      }
    });

    return { empezar: empezar, estado: mj };
  }

  global.initMinijuego = initMinijuego;
}(window));
