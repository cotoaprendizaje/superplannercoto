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
       goToRelated: function (id) { window.motor.gotoId(id); },
       track: function (id, question, correct, response) {  // xAPI/analytics, opcional
         if (window.XAPI) XAPI.answered(id, question, correct, response);
       },
       stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); } // opcional
     });
   ============================================================ */
(function (global) {
  'use strict';

  function shuffled(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function noop() {}

  function initMiniQuiz(opts) {
    opts = opts || {};
    var host = document.querySelector('[data-quiz]'); if (!host) return;
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
    if (!bank.length) return;
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
    var goToRelated = opts.goToRelated || noop;
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
        fb.hidden = false; fb.className = 'd-quiz-fb ' + (ok ? 'ok' : 'bad'); fb.innerHTML = '<b>' + (ok ? '✔ ¡Correcto!' : '✘ No es correcta.') + '</b> ' + it.why;
        track('practica-q' + (cur + 1), it.q, ok, it.opts[ch]);
        if (ok) { streak++; mface.textContent = streak >= 3 ? '🤩' : '😄'; mtext.textContent = pick(streak >= 3 ? HOT : HAPPY); mascot.className = 'd-quiz-mascot happy'; }
        else { streak = 0; mface.textContent = '🤔'; mtext.textContent = pick(OOPS); mascot.className = 'd-quiz-mascot oops'; }
        onAnswer(ok, streak);
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

    function resetQuiz() { QUIZ = sampleQuiz(); cur = 0; answers = new Array(QUIZ.length).fill(-1); streak = 0; registrado = false; updateStreakChip(); renderQ(); }

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
      renderDots();
      onFinish();
    }

    function finish() {
      registrar();
      var correct = aciertos();
      renderDots();
      var wrongIdx = []; answers.forEach(function (a, i) { if (a !== QUIZ[i].ok) wrongIdx.push(i); });
      var reviewHtml = wrongIdx.length
        ? '<div class="d-quiz-review"><p class="rv-title">Para repasar</p><ul>' + wrongIdx.map(function (i) {
            return '<li><span class="rq">' + QUIZ[i].q + '</span><span class="ra">Respuesta correcta: ' + QUIZ[i].opts[QUIZ[i].ok] + '</span>' +
              (QUIZ[i].related ? '<button type="button" class="btn btn-cat-ghost rv-go" data-review-goto="' + i + '">Repasar en “' + (QUIZ[i].relatedLabel || 'este tema') + '” →</button>' : '') + '</li>';
          }).join('') + '</ul></div>'
        : '<p class="d-quiz-allgood">✔ ¡Todas correctas! Dominás el tema.</p>';
      body.innerHTML = '<div class="d-quiz-result ' + (correct === QUIZ.length ? 'pass' : '') + '"><strong>' + correct + '/' + QUIZ.length + ' correctas</strong>' +
        (opts.resultNote || '') +
        reviewHtml +
        '<div class="d-quiz-actions">' +
        '<button type="button" class="btn btn-cat" data-go-next>' + rotuloSeguir + '</button>' +
        '<button type="button" class="btn btn-cat-ghost" data-retry>Practicar de nuevo</button></div></div>';
      body.querySelector('[data-retry]').addEventListener('click', resetQuiz);
      var goBtn = body.querySelector('[data-go-next]');
      if (goBtn) goBtn.addEventListener('click', seguir);
      body.querySelectorAll('[data-review-goto]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var it = QUIZ[parseInt(btn.getAttribute('data-review-goto'), 10)];
          goToRelated(it.related);
        });
      });
      onResult(body.querySelector('.d-quiz-result'), aciertos(), QUIZ.length);
    }

    var st = getState();
    if (st && st.done) {
      body.innerHTML = '<div class="d-quiz-result"><strong>Ya hiciste la práctica · mejor: ' + st.best + '/' + QUIZ.length + '</strong>' +
        (opts.resultNote || '') + '<div class="d-quiz-actions">' +
        '<button type="button" class="btn btn-cat" data-go-next>' + rotuloSeguir + '</button>' +
        '<button type="button" class="btn btn-cat-ghost" data-retry>Practicar de nuevo</button></div></div>';
      body.querySelector('[data-retry]').addEventListener('click', resetQuiz);
      var goBtn2 = body.querySelector('[data-go-next]');
      if (goBtn2) goBtn2.addEventListener('click', seguir);
    } else renderQ();
  }

  global.initMiniQuiz = initMiniQuiz;
})(window);
