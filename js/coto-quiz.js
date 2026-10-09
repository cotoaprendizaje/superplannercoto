/* ============================================================
   coto-quiz.js · Mini práctica genérica (opción múltiple, de a una
   pregunta por vez, con racha/feedback/repaso)
   kit-base v1.6 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual a cada curso nuevo, sin editar.
   ------------------------------------------------------------
   Extraído de "Prevención cardiovascular" (initQuiz en su curso.js):
   ahí funcionaba, pero mezclado con el contenido y el estado propios
   de ese curso. Esta versión no sabe nada de un curso en particular —
   recibe el banco de preguntas y un puñado de callbacks por parámetro,
   y el curso decide qué hacer con cada evento (sumar puntos, guardar
   estado, narrar, navegar). NO decide solo si la evaluación final vive
   acá o en el LMS — eso es contenido, lo decide cada curso (CLAUDE.md
   §3.11); esta pieza es "práctica sin nota" por diseño.

   Contrato de marcado esperado (una diapositiva HTML nativa, NO
   captura — ver CLAUDE.md §2.8):
     <div data-quiz></div>

   Uso (llamar UNA vez, típicamente desde boot()):
     initMiniQuiz({
       bank: [
         { q: 'Enunciado', opts: ['A','B','C','D'], ok: 0,
           why: 'Explicación que se muestra al responder.',
           related: 'slide-id-para-repasar',        // opcional
           relatedLabel: 'Nombre visible de esa diapositiva' } // opcional
       ],
       size: 3,                          // preguntas por intento (def. 3)
       getState: function () {           // estado persistido o null si nunca se hizo
         return state.quiz || null;      // { correct, total, best, done }
       },
       setState: function (quizState, attempts) {
         state.quiz = quizState; state.quizAttempts = attempts; persistState();
       },
       onFirstFinish: function (correct, total) {  // primera vez que se completa
         unlockBadge('practica'); award(20, 'práctica completada');
       },
       onAnswer: function (correct, streak) {       // cada respuesta (bien o mal)
         if (correct) { sCorrect(); if (streak >= 3) award(10, 'racha x' + streak); sStreak(); }
         else sWrong();
       },
       onFinish: function () { unlockCierre(); },   // cada vez que se completa (1ª vez o repetición)
       narrate: function (bodyEl) { Narrador.speak(textOf(bodyEl), 'slide'); },
       // goToRelated: opcional desde v1.9.119 — el de serie ya sabe ir a
       //   una diapositiva O a un pop-up (ver `irARelacionado`)
       track: function (id, question, correct, response) {  // xAPI/analytics, opcional
         if (window.XAPI) XAPI.answered(id, question, correct, response);
       },
       stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); }, // opcional
       introPopup: 'practica-intro'   // opcional (v1.9.121): el aviso "no es la evaluación"
     });

   DEVUELVE un gate (kit-base v1.9.119, §7.68) con el mismo contrato
   que `initPopupGate`/`initVideoGate`: `faltan(slideEl)` da `['practica']`
   mientras la diapositiva que tiene `[data-quiz]` no esté completada, y
   `[]` en cualquier otra. Se exige COMPLETARLA, no acertar. Guardarlo y
   sumarlo a `canAdvance` y a `initGateHints` (la plantilla ya lo trae):
     var practicaGate = initMiniQuiz({ … });
     motor.canAdvance = function (s) { return !practicaGate.faltan(s).length && … };
   ============================================================ */
(function (global) {
  'use strict';

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function noop() {}

  /* El "Repasar en …" de una respuesta incorrecta, por defecto
     (kit-base v1.9.119, §7.68). Hasta v1.9.118 el de serie era
     `motor.gotoId(id)`, y si el `related` era un POP-UP no encontraba
     nada: el botón no hacía nada, sin error. MEDIDO en "Prevención
     cardiovascular" (`related: 'control-factores'`, la ficha del 50%).
     Se va a la diapositiva que abre ese pop-up y se lo abre cuando
     terminó la transición: así la pregunta puede apuntar a donde
     REALMENTE está la respuesta. `tools/tests/practica-gate.mjs` falla
     si algún `related` no es ni diapositiva ni pop-up. */
  var ESPERA_TRANSICION = 420;
  function irARelacionado(id) {
    var m = global.motor;
    if (!id || !m) return;
    if (document.querySelector('[data-slide="' + id + '"]')) { m.gotoId(id); return; }
    if (!document.querySelector('[data-popup="' + id + '"]')) return;
    var disparador = document.querySelector(
      '[data-gate-popup="' + id + '"], [data-require-popups~="' + id + '"], [data-popup-trigger="' + id + '"]');
    var slide = disparador && disparador.closest('[data-slide]');
    if (slide) {
      m.gotoId(slide.getAttribute('data-slide'));
      setTimeout(function () { m.showPopup(id); }, ESPERA_TRANSICION);
    } else {
      m.showPopup(id);
    }
  }

  /* Gate que no traba nada: lo que devuelve `initMiniQuiz` cuando no
     hay práctica que hacer (sin `[data-quiz]` o con el banco vacío), así
     el `canAdvance` de la plantilla no se cae por un `undefined`. */
  var SIN_GATE = { faltan: function () { return []; }, completa: function () { return true; } };

  function initMiniQuiz(opts) {
    opts = opts || {};
    var host = document.querySelector('[data-quiz]'); if (!host) return SIN_GATE;
    /* ---- La diapositiva se marca, para el CSS de pantalla baja ----
       kit-base v1.9.98. La pareja está en coto-quiz.css, bajo
       `@media (max-height:560px)`: ahí la intro de la diapositiva se
       esconde, porque la práctica sola ya ocupa el lienzo entero.
       Se marca acá y no con `:has()` en el CSS para no depender del
       soporte de `:has()` en los iPad viejos del cliente. */
    var slideDelQuiz = host.closest('[data-slide]');
    if (slideDelQuiz) slideDelQuiz.classList.add('d-slide-quiz');
    var bank = opts.bank || [];
    /* Banco vacío = nada que preguntar (kit-base v1.9.52). Sin este
       corte, `size` daba 0, `QUIZ` quedaba en `[]` y `renderQ()` moría
       en `QUIZ[cur].q` con un TypeError que se llevaba puesto el resto
       del `boot()` del curso — el caso real que lo dispara es un curso
       que cablea `initMiniQuiz()` antes de tener escritas las preguntas
       (o que las carga de un JSON que todavía no existe). */
    if (!bank.length) return SIN_GATE;
    var size = Math.min(opts.size || 3, bank.length);
    var getState = opts.getState || function () { return null; };
    var setState = opts.setState || noop;
    var onFirstFinish = opts.onFirstFinish || noop;
    var onAnswer = opts.onAnswer || noop;
    var onFinish = opts.onFinish || noop;
    /* `onResult` (kit-base v1.9.107): corre cuando la pantalla de
       resultado YA ESTÁ DIBUJADA, cada vez que se ve (reintentos
       incluidos). Es el lugar para decorarla.
       Hace falta separarlo de `onFinish` desde que `onFinish` corre al
       CONTESTAR LA ÚLTIMA (ver `registrar()`): ese es el momento en que la
       práctica queda completa, pero la pantalla de resultado todavía no
       existe. MEDIDO en "Pedidos de PLU set": su `onFinish` pintaba un
       veredicto sobre `.d-quiz-result` —y otorgaba ahí el logro
       "Aprobado"— con un `setTimeout(0)`; corriendo antes del resultado,
       no encontraba la caja y salía sin hacer nada. `actualizar-kit` avisa
       a los cursos que tocan `.d-quiz-result` sin `onResult`. */
    var onResult = opts.onResult || noop;
    var narrate = opts.narrate || noop;
    var goToRelated = opts.goToRelated || irARelacionado;
    var track = opts.track || noop;
    var stagger = opts.stagger || noop;
    var HAPPY = opts.happyMessages || ['¡Correcto!', '¡Bien ahí!', '¡Eso es!'];
    var HOT = opts.hotMessages || ['¡Imparable! Seguís en racha 🔥'];
    var OOPS = opts.oopsMessages || ['No pasa nada, aprendamos de esta.', 'Casi… mirá por qué.'];
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function sampleQuiz() {
      return shuffled(bank).slice(0, size).map(function (it) {
        var order = shuffled(it.opts.map(function (o, i) { return i; }));
        return { q: it.q, opts: order.map(function (i) { return it.opts[i]; }), ok: order.indexOf(it.ok),
          why: it.why, related: it.related, relatedLabel: it.relatedLabel };
      });
    }

    var QUIZ = sampleQuiz();
    var cur = 0, answers = new Array(QUIZ.length).fill(-1), streak = 0;
    host.innerHTML = '<div class="d-quiz-head"><span class="d-quiz-count">Pregunta <b data-qn>1</b> de ' + QUIZ.length + '</span>' +
      '<span class="d-quiz-streak" data-streak hidden>🔥 <b data-streak-n>0</b></span>' +
      '<span class="d-quiz-dots">' + QUIZ.map(function () { return '<i></i>'; }).join('') + '</span></div><div data-qbody></div>';
    var body = host.querySelector('[data-qbody]'), dots = host.querySelectorAll('.d-quiz-dots i'), qn = host.querySelector('[data-qn]');
    var streakChip = host.querySelector('[data-streak]'), streakN = host.querySelector('[data-streak-n]');

    function renderDots() { dots.forEach(function (d, i) { d.className = i === cur ? 'cur' : (answers[i] === -1 ? '' : (answers[i] === QUIZ[i].ok ? 'ok' : 'bad')); }); }
    function updateStreakChip() {
      streakChip.hidden = streak < 2;
      streakN.textContent = streak;
      streakChip.classList.toggle('hot', streak >= 3);
    }

    /* ---- "Continuar" al terminar, POR DEFECTO (kit-base v1.9.98) ----
       Pedido del cliente: *"agregar botón de continuar al terminar bien
       la minipráctica"*.

       El botón existía desde antes, pero era opt-in (`opts.nextLabel` +
       `opts.onGoNext`) y ningún curso lo pasaba: al terminar la práctica
       la única salida visible era "Practicar de nuevo", así que el alumno
       que ya había terminado se quedaba mirando su nota sin saber que
       tenía que ir al pie de la pantalla a buscar "Siguiente". Es la
       misma forma de falla de §7.17 —la pieza estaba, el cable no— y por
       eso ahora el default es tenerlo.

       `onGoNext` sigue existiendo para el curso que quiera otra cosa; si
       no lo pasa, se avanza con el motor, que es lo que el 100% de los
       casos necesita. Se usa `_advance(1)` y no `go()` para que el gate
       de avance se respete igual que con el botón del pie.

       También va en la pantalla de "ya hiciste la práctica": es el mismo
       callejón sin salida, y ahí era peor porque aparece al REENTRAR. */
    var rotuloSeguir = opts.nextLabel || 'Continuar';
    function seguir() {
      if (opts.onGoNext) { opts.onGoNext(); return; }
      if (global.motor && global.motor._advance) global.motor._advance(1);
    }

    function renderQ() {
      var it = QUIZ[cur]; qn.textContent = cur + 1; renderDots();
      host.classList.remove('is-devolucion');
      var h = '<div class="d-q"><div class="d-q-title"><span class="d-q-num">' + (cur + 1) + '</span>' + it.q + '</div>';
      /* Nomenclatura a) b) c) (kit-base v1.9.98). Pedido del cliente.
         No es decoración: sin letra, para referirse a una opción hay que
         leerla entera —en una consigna, en un pop-up de repaso o de viva
         voz entre dos personas mirando la misma pantalla—, y las opciones
         de este molde son frases largas. La letra le da nombre corto a
         cada una.
         Va DENTRO del `<label>` y con `aria-hidden`: el lector de
         pantalla ya numera las opciones de un grupo de radios solo, y
         anunciar "a, La relación entre peso y altura" sería decirlo dos
         veces. */
      it.opts.forEach(function (o, i) {
        var letra = String.fromCharCode(97 + i);   // a, b, c…
        h += '<label class="d-opt" for="q' + cur + 'o' + i + '">' +
             '<input type="radio" name="q' + cur + '" id="q' + cur + 'o' + i + '" value="' + i + '">' +
             '<span class="d-opt-mark"></span>' +
             '<span class="d-opt-letra" aria-hidden="true">' + letra + ')</span>' +
             '<span class="d-opt-text">' + o + '</span></label>';
      });
      h += '</div><div class="d-quiz-fb" data-fb hidden aria-live="polite"></div>' +
        '<div class="d-quiz-mascot" data-mascot hidden><span class="d-quiz-mface" data-mface aria-hidden="true">🙂</span><p data-mtext></p></div>' +
        '<div class="d-quiz-actions"><button type="button" class="btn btn-cat" data-answer disabled>Responder</button><button type="button" class="btn btn-cat" data-next hidden>Siguiente</button></div>';
      body.innerHTML = h;
      stagger(body.querySelector('.d-q'));
      var aBtn = body.querySelector('[data-answer]'), nBtn = body.querySelector('[data-next]'), fb = body.querySelector('[data-fb]');
      var mascot = body.querySelector('[data-mascot]'), mface = body.querySelector('[data-mface]'), mtext = body.querySelector('[data-mtext]');
      body.querySelectorAll('input').forEach(function (r) { r.addEventListener('change', function () { aBtn.disabled = false; }); });
      aBtn.addEventListener('click', function () {
        var ch = -1; body.querySelectorAll('input').forEach(function (r) { if (r.checked) ch = +r.value; });
        if (ch === -1) return; answers[cur] = ch; var ok = ch === it.ok;
        body.querySelectorAll('.d-opt').forEach(function (o, i) { o.classList.toggle('is-ok', i === it.ok); o.classList.toggle('is-bad', i === ch && !ok); o.querySelector('input').disabled = true; });
        /* `.is-devolucion` (v1.9.126): con la devolución a la vista, en
           pantalla baja coto-quiz.css saca la fila de avance y pone
           "Siguiente" al lado de la devolución (cardio a 844×390: 60px de más). */
        host.classList.add('is-devolucion');
        fb.hidden = false; fb.className = 'd-quiz-fb ' + (ok ? 'ok' : 'bad'); fb.innerHTML = '<b>' + (ok ? '✔ ¡Correcto!' : '✘ No es correcta.') + '</b> ' + it.why;
        track('practica-q' + (cur + 1), it.q, ok, it.opts[ch]);
        if (ok) { streak++; mface.textContent = streak >= 3 ? '🤩' : '😄'; mtext.textContent = pick(streak >= 3 ? HOT : HAPPY); mascot.className = 'd-quiz-mascot happy'; }
        else { streak = 0; mface.textContent = '🤔'; mtext.textContent = pick(OOPS); mascot.className = 'd-quiz-mascot oops'; }
        onAnswer(ok, streak);
        /* Para los logros del kit (coto-logros.js, v1.9.125): En racha cuenta
           respuestas seguidas. Un reintento de la práctica no cuenta
           (`repetida`): reintentar es para aprender, no suma (decisión del
           cliente). */
        var prevQ = getState();
        document.dispatchEvent(new CustomEvent('cotorespuesta', { detail: { fuente: 'practica', acerto: ok, repetida: !!(prevQ && prevQ.done) } }));
        /* La locución PASA A LA DEVOLUCIÓN (kit-base v1.9.107). Pedido del
           cliente: *"si el colaborador responde mientras la locución
           todavía está leyendo la pregunta, la locución tiene que cortarse
           y pasar directamente a leer la retroalimentación"*.
           MEDIDO antes de esto: al responder no se emitía NADA — la
           locución seguía leyendo la pregunta y sus opciones encima de una
           devolución que ya estaba en pantalla.
           No hace falta cancelar a mano: `Narrador.speak()` arranca con un
           `cancel()`, así que narrar la devolución corta lo que había. Se
           usa el `narrate` inyectado y no `Narrador` directo, que es el
           contrato del módulo. */
        narrate(fb);
        mascot.hidden = false;
        updateStreakChip();
        aBtn.hidden = true; nBtn.hidden = false; nBtn.textContent = cur + 1 < QUIZ.length ? 'Siguiente' : 'Ver resultado';
        /* Contestada la última, la práctica ESTÁ completa: se registra acá
           y no en `finish()`. Ver el comentario de `registrar()`. */
        if (cur + 1 >= QUIZ.length) registrar();
        // iOS + pantalla completa: mover el foco dispara el cartel de
        // Safari. Ver `focoBloqueado()` en motor-slides.js — se usa la
        // del kit, no una copia, justamente para no volver a dejar una
        // puerta abierta.
        if (!(window.focoBloqueado && window.focoBloqueado())) nBtn.focus();
        renderDots();
      });
      nBtn.addEventListener('click', function () { if (cur + 1 < QUIZ.length) { cur++; renderQ(); } else finish(); });
      // No se narra la consigna fija de la diapositiva en cada pregunta
      // (CLAUDE.md §6.5) — el curso ya la narró una sola vez al entrar.
      // Acá solo el cuerpo de ESTA pregunta.
      var slideEl = host.closest('.slide');
      if (slideEl && !slideEl.hidden) narrate(body);
    }

    function resetQuiz() {
      QUIZ = sampleQuiz(); cur = 0; answers = new Array(QUIZ.length).fill(-1); streak = 0; registrado = false;
      updateStreakChip(); renderQ();
      respondiendo(true, true);
    }

    function aciertos() {
      return answers.filter(function (a, i) { return a === QUIZ[i].ok; }).length;
    }

    /* ---- `registrar()` — COMPLETAR la práctica ≠ MIRAR el resultado ----
       kit-base v1.9.107. BUG REAL reportado por el cliente, y de los
       caros: *"después de responder las 3 preguntas de la mini práctica,
       la última diapositiva muestra «Hacé la mini práctica para
       desbloquear el cierre», como si no se hubiera completado... y al
       tocar «Fin» el curso no se cierra"*.

       La causa: todo esto vivía dentro de `finish()`, y `finish()` corre
       SOLO al pulsar el botón de la última pregunta, que dice "Ver
       resultado". El alumno contesta las tres, lee la devolución de la
       tercera, da la práctica por terminada —lo está: no queda ninguna
       pregunta— y sigue con el "Siguiente" del CURSO. Nunca pulsó "Ver
       resultado", así que no se guardó el estado, no se otorgó el logro
       ni los puntos, y `onFinish()` nunca desbloqueó el cierre.

       REPRODUCIDO en iPad: con las tres contestadas y sin pulsar "Ver
       resultado", la diapositiva de cierre queda sin la clase `unlocked`,
       con el candado visible, sin la captura del cierre y con el botón
       del footer en "Fin" en vez de "Finalizar curso" — los cuatro
       síntomas del reporte, a la vez.

       Ahora se registra al contestar la última, y la pantalla de
       resultado queda como lo que es: una pantalla. Idempotente, porque
       las dos puertas pueden pasar por acá en la misma vuelta (contestar
       y después pulsar el botón) y los intentos no pueden contarse dos
       veces. */
    var registrado = false;

    function registrar() {
      if (registrado) return;
      registrado = true;
      var correct = aciertos();
      var prev = getState();
      var firstTime = !(prev && prev.done);
      var prevBest = (prev && prev.best) || 0;
      var attempts = ((prev && prev.attempts) || 0) + 1;
      setState({ correct: correct, total: QUIZ.length, best: Math.max(prevBest, correct), done: true }, attempts);
      if (firstTime) onFirstFinish(correct, QUIZ.length);
      /* Impecable (y Puntería sin repaso) miran el PRIMER intento. */
      document.dispatchEvent(new CustomEvent('cotopractica', { detail: { correctas: correct, total: QUIZ.length, primera: firstTime } }));
      renderDots();
      onFinish();
      /* La marca "respondiendo" NO se saca acá (v1.9.126): al contestar la
         última pregunta su devolución sigue en pantalla, y sin la marca
         volvía la intro de la diapositiva (título, bajada, el aviso del
         curso) y la empujaba: la diapositiva scrolleaba, lo vio el cliente
         en cardio. Se saca al dibujar el resultado, en `finish()`. */
      respondiendo(false, false, true);
      /* La diapositiva de la práctica deja de trabar en este momento:
         se avisa al motor para que habilite "Siguiente" ya (§7.68). */
      document.dispatchEvent(new Event('gatechange'));
    }

    /* El anillo de la nota (rediseño v1.9.125): azul, verde si están todas. */
    function anilloNota(c, t) {
      var circ = 2 * Math.PI * 40, largo = t ? circ * c / t : 0;
      return '<svg class="d-quiz-anillo' + (c === t ? ' is-todas' : '') + '" viewBox="0 0 100 100" aria-hidden="true">' +
        '<circle cx="50" cy="50" r="40"/><circle class="v" cx="50" cy="50" r="40" transform="rotate(-90 50 50)" stroke-dasharray="' +
        largo.toFixed(1) + ' ' + circ.toFixed(1) + '"/><text x="50" y="55">' + c + '/' + t + '</text><text class="sub" x="50" y="70">bien</text></svg>';
    }

    /* Resultado que no entra (kit-base v1.9.129, §7.78): en un teléfono
       vertical las dos columnas apiladas medían 1191px para 661 de
       pantalla. Si la diapositiva scrollea, `.is-resultado-corto` deja la
       nota y sus botones, esconde el aviso del curso y "Repasemos tus
       respuestas" pasa a un botón que la abre en una capa
       (`CotoUI.abrirEnCapa`). Se mide, no se adivina por ancho: en una
       pantalla donde entra, queda como siempre. */
    function ajustarResultado() {
      if (!slideDelQuiz || !slideDelQuiz.classList.contains('is-quiz-resultado')) return;
      slideDelQuiz.classList.remove('is-resultado-corto');
      if (slideDelQuiz.scrollHeight > slideDelQuiz.clientHeight + 2) slideDelQuiz.classList.add('is-resultado-corto');
    }
    global.addEventListener('resize', ajustarResultado);

    function finish() {
      registrar();
      host.classList.remove('is-devolucion');
      var correct = aciertos();
      renderDots();
      /* Rediseño v1.9.125 (§7.74), del canvas: dos columnas. A la izquierda
         la nota en un anillo, la nota del curso y los botones; a la derecha
         "Repasemos tus respuestas:", TODAS (bien y mal), y en las erradas
         "Repasar en …". Mismas piezas que antes (`.d-quiz-result`,
         `.d-quiz-review`, `[data-go-next]`, `[data-retry]`,
         `[data-review-goto]`): los cursos que las usan no cambian. */
      var reviewHtml = '<div class="d-quiz-review"><p class="rv-title">Repasemos tus respuestas:</p><ul>' + QUIZ.map(function (it, i) {
          var bien = answers[i] === it.ok;
          return '<li class="' + (bien ? 'is-ok' : 'is-bad') + '"><span class="rv-ic" aria-hidden="true">' + (bien ? '✓' : '✕') + '</span><span class="rv-txt">' +
            '<span class="rq">' + (i + 1) + ' · ' + it.q + '</span>' +
            '<span class="ra">' + (bien ? 'Tu respuesta: ' + it.opts[answers[i]] : 'Respuesta correcta: ' + it.opts[it.ok]) + '</span>' +
            (!bien && it.related ? '<button type="button" class="btn btn-cat-ghost rv-go" data-review-goto="' + i + '">Repasar en “' + (it.relatedLabel || 'este tema') + '” →</button>' : '') +
            '</span></li>';
        }).join('') + '</ul></div>';
      body.innerHTML = '<div class="d-quiz-result ' + (correct === QUIZ.length ? 'pass' : '') + '">' +
        '<div class="d-quiz-nota"><p class="d-quiz-nota-hd">¡Práctica completa!</p>' + anilloNota(correct, QUIZ.length) +
        '<strong>' + correct + '/' + QUIZ.length + ' correctas</strong>' +
        (correct === QUIZ.length ? '<p class="d-quiz-allgood">✔ ¡Todas correctas! Dominás el tema.</p>' : '') +
        (opts.resultNote || '') +
        '<div class="d-quiz-actions">' +
        '<button type="button" class="btn btn-cat-ghost" data-retry><span aria-hidden="true">↺</span> Reintentar</button>' +
        '<button type="button" class="btn btn-cat" data-go-next>' + rotuloSeguir + '</button></div>' +
        '<button type="button" class="btn btn-cat-ghost d-quiz-ver-resp" data-ver-respuestas>Ver tus respuestas</button></div>' +
        reviewHtml + '</div>';
      body.querySelector('[data-retry]').addEventListener('click', resetQuiz);
      var goBtn = body.querySelector('[data-go-next]');
      if (goBtn) goBtn.addEventListener('click', seguir);
      body.querySelectorAll('[data-review-goto]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var it = QUIZ[parseInt(btn.getAttribute('data-review-goto'), 10)];
          goToRelated(it.related);
        });
      });
      /* `.is-quiz-resultado` (v1.9.125): el resultado en dos columnas es el
         estado más alto; en pantallas bajas la intro se va igual que
         mientras se responde (coto-quiz.css). */
      if (slideDelQuiz) { slideDelQuiz.classList.add('is-quiz-resultado'); slideDelQuiz.classList.remove('is-quiz-running'); }
      var verResp = body.querySelector('[data-ver-respuestas]');
      if (verResp) verResp.addEventListener('click', function () {
        var rv = body.querySelector('.d-quiz-review');
        if (rv && global.CotoUI && global.CotoUI.abrirEnCapa) global.CotoUI.abrirEnCapa(rv, { etiqueta: 'Tus respuestas' });
      });
      ajustarResultado();
      onResult(body.querySelector('.d-quiz-result'), aciertos(), QUIZ.length);
    }

    /* ---- Estado "respondiendo" y aviso previo (kit-base v1.9.121, §7.70) ----
       Lo pidió el relevo de cardio (A6 y A7), que lo tenía escrito en su
       `curso.js` porque el módulo no lo daba:
       · `.is-quiz-running` en la diapositiva mientras se están contestando
         preguntas. Con eso coto-quiz.css saca la intro de la PANTALLA en
         pantallas de hasta 760px de alto —el marco de Moodle mide ~690— y
         la pregunta entra.
       · eventos `quizstart` (cada vez que arranca un intento; `detail.
         reintento`) y `quizretry` (al pulsar "Practicar de nuevo"). Cardio
         escuchaba clics en `[data-retry]` porque no había otra forma.
       · `introPopup: 'id'`: el pop-up de "esto no es la evaluación" se
         abre al entrar MIENTRAS la práctica no esté completa. Va como
         `data-intro-popup` en la diapositiva, que el motor ya sabe abrir
         sin pisar la locución (con un `setTimeout` propio, cardio pisaba
         la narración y `locucion-control` lo marcó). Completa, se saca. */
    function respondiendo(si, reintento, mantenerMarca) {
      if (slideDelQuiz && !mantenerMarca) slideDelQuiz.classList.toggle('is-quiz-running', !!si);
      if (slideDelQuiz && si) slideDelQuiz.classList.remove('is-quiz-resultado', 'is-resultado-corto');
      if (slideDelQuiz && opts.introPopup) {
        if (completa()) slideDelQuiz.removeAttribute('data-intro-popup');
        else slideDelQuiz.setAttribute('data-intro-popup', opts.introPopup);
      }
      if (si) {
        document.dispatchEvent(new CustomEvent('quizstart', { detail: { reintento: !!reintento } }));
        if (reintento) document.dispatchEvent(new CustomEvent('quizretry'));
      }
    }

    /* El botón "Empezar" del aviso previo lo cierra. */
    if (opts.introPopup) {
      document.querySelectorAll('[data-popup="' + opts.introPopup + '"] [data-pracintro-go]').forEach(function (b) {
        b.addEventListener('click', function () { if (global.motor) global.motor.closePopup(); });
      });
    }

    var st = getState();
    if (st && st.done) {
      body.innerHTML = '<div class="d-quiz-result is-hecha"><div class="d-quiz-nota"><p class="d-quiz-nota-hd">Ya hiciste la práctica</p>' +
        anilloNota(st.best, QUIZ.length) + '<strong>Tu mejor resultado: ' + st.best + '/' + QUIZ.length + '</strong>' +
        (opts.resultNote || '') + '<div class="d-quiz-actions">' +
        '<button type="button" class="btn btn-cat-ghost" data-retry><span aria-hidden="true">↺</span> Reintentar</button>' +
        '<button type="button" class="btn btn-cat" data-go-next>' + rotuloSeguir + '</button></div></div></div>';
      body.querySelector('[data-retry]').addEventListener('click', resetQuiz);
      var goBtn2 = body.querySelector('[data-go-next]');
      if (goBtn2) goBtn2.addEventListener('click', seguir);
    } else { renderQ(); respondiendo(true); }
    if (st && st.done) respondiendo(false);

    function completa() { var e = getState(); return registrado || !!(e && e.done); }
    return {
      faltan: function (slideEl) {
        if (!slideEl || !slideEl.contains || !slideEl.contains(host)) return [];
        return completa() ? [] : ['practica'];
      },
      completa: completa
    };
  }

  global.initMiniQuiz = initMiniQuiz;
  global.irARelacionado = irARelacionado;
})(window);
