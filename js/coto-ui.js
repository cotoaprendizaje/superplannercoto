/* ============================================================
   coto-ui.js · Comportamientos de interfaz reusables entre cursos
   kit-base v1.7 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual a cada curso nuevo, sin editar.
   ------------------------------------------------------------
   Extraído de "Prevención cardiovascular" (staggerReveal /
   initPopupStagger / initPopupNarration / initStatPopups /
   precargarVecinas / initSummaryPrint / tonos de UI en su curso.js).
   Ninguna de estas funciones lee contenido del curso: trabajan sobre
   atributos data-* y clases del sistema de diseño (CLAUDE.md §1).

   Contenido:
     · initPopupNarration()   narra pop-ups al abrirlos; [data-narrate-only]
     · initPopupStagger()     entrada escalonada del contenido del pop-up
     · staggerReveal(hd, bd)  la misma cascada, a mano (mini-práctica, cierre)
     · initStatPopups()       números que cuentan de 0 a N ([data-count-to])
     · initPrefetchNeighbors() precarga las diapositivas vecinas
     · initSummaryPrint()     imprimir el resumen final
     · initTiempoActivo()     reloj que descuenta el tiempo de video
     · tiempoActivoMs()       ms de recorrido real (sin videos)
     · Sonidos de UI: tone / sCorrect / sWrong / sStreak / sWin

   Uso (desde boot(), en cualquier orden):
     initPopupNarration();      // usa Narrador.textOf por debajo
     initPopupStagger();
     initStatPopups();
     initPrefetchNeighbors();   // se engancha solo a `slidechange`
     initSummaryPrint();

   TODO respeta `prefers-reduced-motion` y el mute global
   (`localStorage['coto-diapos-mute']`), igual que fx.js.
   ============================================================ */
(function (global) {
  'use strict';

  var prefersReduced = global.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function popEl(id) { return document.querySelector('[data-popup="' + id + '"]'); }

  /* ---- Narración de pop-ups ----------------------------------------
     CLAUDE.md §5: los pop-ups se narran solos al abrirse y se callan al
     cerrarse. El reproductor de video queda afuera a propósito — ahí la
     voz taparía el audio del propio video.

     `[data-narrate-only]` acota QUÉ se narra dentro de un pop-up: es la
     distinción "narración obligatoria vs. opcional" que pide el Manual
     de Contenido (CLAUDE.md §6.5), resuelta de forma genérica en el
     marcado en vez de con una regla nueva de código. Nació de un caso
     concreto en "Prevención cardiovascular": al ampliar el glosario a
     16 términos, narrarlo entero pasaba de ~50 segundos a MÁS DE 3
     MINUTOS de locución seguida — y un glosario es material de
     CONSULTA (se abre para buscar un término puntual), no algo para
     escuchar de corrido. Con el atributo sobre la frase de entrada se
     narra solo eso y el resto queda para leer. Sin el atributo, se
     narra el pop-up entero como siempre.

       <div class="modal-card">
         <div class="modal-hd modal-hd--dark">…</div>
         <div class="modal-bd">
           <p class="d-glossary-intro" data-narrate-only>Frase que sí se narra.</p>
           <dl>… 16 términos que NO se narran …</dl>
   -------------------------------------------------------------------- */
  function initPopupNarration(opts) {
    opts = opts || {};
    var skip = opts.skip || ['video-player'];
    function skipped(id) { return skip.indexOf(id) !== -1; }

    document.addEventListener('popupopen', function (e) {
      if (skipped(e.detail.id)) return;
      var pop = popEl(e.detail.id);
      if (!pop) return;
      var scope = pop.querySelector('[data-narrate-only]') || pop.querySelector('.modal-card');
      if (scope) global.Narrador.speak(global.Narrador.textOf(scope), 'other');
    });
    document.addEventListener('popupclose', function (e) {
      if (skipped(e.detail.id)) return;
      global.Narrador.cancel();
    });
  }

  /* ---- Entrada escalonada (título → párrafo → elementos) ------------
     Le pone `.d-stagger-in` (css/coto-base.css) a cada hijo directo de
     `hd`/`bd` con un animation-delay creciente, y hace lo mismo UN
     NIVEL más adentro con cualquier grilla conocida (logros, accesos
     rápidos, stats del cierre) para que esas tarjetas entren en cascada
     entre sí y no todas juntas como "un elemento más" de la lista de
     afuera.

     ⚠️ Regla de uso, decidida con el cliente: se llama SOLO sobre HTML
     real (pop-ups, mini-práctica, resumen del cierre) — NUNCA sobre las
     diapositivas-captura. Una captura es UNA sola imagen con el texto
     horneado adentro (CLAUDE.md §2.8): no tiene título ni párrafo
     separados que puedan entrar por turnos, así que "animar la entrada
     de sus elementos" no es posible sin volver a pedirle al diseñador
     las piezas sueltas con alfa (CLAUDE.md §3.3, la excepción cara).
     El `void el.offsetWidth` entre remove y add es obligatorio: fuerza
     un reflow para que la animación se reinicie si el mismo pop-up se
     vuelve a abrir (sin eso, la 2ª apertura no anima nada).
   -------------------------------------------------------------------- */
  var STAGGER_GRIDS = '.d-badges-grid, .d-instr-grid, .d-cert-stats';
  function staggerReveal(hd, bd) {
    if (prefersReduced) return;
    var items = [];
    if (hd) items.push(hd);
    if (bd) items.push.apply(items, bd.children);
    /* BUG REAL ("Seguridad alimentaria", pop-up de predicción antes de
       un video): un hijo que arranca `hidden` (feedback, botón
       "Continuar" que solo aparece después de responder) igual
       recibía `.d-stagger-in` acá. Con `display:none` en ese momento
       la animación nunca arranca, y sacar el `hidden` más tarde NO la
       reinicia sola (confirmado en Chromium: queda pegada en el
       fotograma `from`, `opacity:0`, para siempre — ver CLAUDE.md).
       Animar la entrada de algo invisible no tiene sentido de todos
       modos, así que se filtra ACÁ: el curso no tiene que acordarse de
       anular la animación a mano en cada elemento que revela después. */
    items = items.filter(function (el) { return !el.hidden; });
    items.forEach(function (el, i) {
      el.classList.remove('d-stagger-in'); void el.offsetWidth;
      el.style.animationDelay = (i * 70) + 'ms';
      el.classList.add('d-stagger-in');
    });
    var root = bd || hd; if (!root) return;
    root.querySelectorAll(STAGGER_GRIDS).forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.classList.remove('d-stagger-in'); void child.offsetWidth;
        child.style.animationDelay = (i * 60) + 'ms';
        child.classList.add('d-stagger-in');
      });
    });
  }

  function initPopupStagger(opts) {
    opts = opts || {};
    // El reproductor de video y el índice lateral quedan afuera: el
    // primero no tiene contenido que escalonar (es un <video> solo) y el
    // segundo es navegación — escalonar 20 ítems retrasa el clic real.
    var skip = opts.skip || ['video-player', 'sidenav'];
    document.addEventListener('popupopen', function (e) {
      if (skip.indexOf(e.detail.id) !== -1) return;
      var pop = popEl(e.detail.id);
      if (!pop) return;
      staggerReveal(pop.querySelector('.modal-hd'), pop.querySelector('.modal-bd'));
    });
  }

  /* ---- Números animados de pop-ups de estadística -------------------
     Cualquier <span data-count-to="N"> dentro de un pop-up cuenta de 0 a
     N al abrirse, una sola vez por elemento (se marca con data-counted
     para no reiniciar si se vuelve a abrir el mismo pop-up).
     ⚠️ El mismo atributo lo lee `Narrador.textOf` para narrar el valor
     FINAL en vez del que esté en pantalla a mitad de la animación (bug
     real: se narraba "disminuir 0% de la mortalidad" en vez de 50%).
     O sea: el atributo no es decorativo, es la fuente de verdad del
     número — no reemplazarlo por el textContent inicial.
   -------------------------------------------------------------------- */
  /* ---- Contador animado, genérico (kit-base v1.9.43) ----
     Generalización real de lo que `initStatPopups` (abajo) ya hacía
     ad-hoc: "0→N, ease-out, UNA sola vez, al abrir un pop-up". Esa
     versión no sirve para un contador que cambia REPETIDAS veces en la
     vida del curso — el caso real que la motivó: el chip de puntos del
     header, que sube en cada `award()` del curso (contenido, no vive
     acá). Diferencias con la versión vieja:
       · `from` opcional — si no se pasa, arranca del `textContent`
         actual del elemento (para que cada llamada nueva sea relativa
         a donde quedó la anterior, no siempre desde 0).
       · Token por elemento — si llega una llamada nueva mientras la
         anterior todavía está animando (dos `award()` seguidos), la
         vieja se corta sola en su próximo frame en vez de pelear por
         el mismo `textContent` (dos `requestAnimationFrame` escribiendo
         el mismo nodo a la vez parpadea/salta). */
  function countTo(el, to, opts) {
    if (!el) return;
    opts = opts || {};
    var from = opts.from;
    if (from == null) {
      var actual = parseInt(String(el.textContent).replace(/[^\d-]/g, ''), 10);
      from = isNaN(actual) ? 0 : actual;
    }
    if (prefersReduced) { el.textContent = String(to); return; }
    var dur = opts.dur || 500;
    var token = (el._countToToken = (el._countToToken || 0) + 1);
    var t0 = null;
    function step(ts) {
      if (el._countToToken !== token) return; // una llamada más nueva la reemplazó
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initStatPopups() {
    document.addEventListener('popupopen', function (e) {
      var pop = popEl(e.detail.id);
      if (!pop) return;
      Array.prototype.forEach.call(pop.querySelectorAll('[data-count-to]'), function (el) {
        var target = parseInt(el.getAttribute('data-count-to'), 10);
        if (el.dataset.counted || isNaN(target)) return;
        el.dataset.counted = '1';
        countTo(el, target, { from: 0, dur: 900 });
      });
    });
  }

  /* ---- Precarga de las diapositivas vecinas -------------------------
     Cada diapositiva es un .webp de página completa (~100-250 KB). Al
     entrar por primera vez, el navegador recién ahí la pide: en una
     conexión de sucursal se ve un parpadeo en blanco justo al avanzar.
     Precargar la siguiente (y la anterior, para el que retrocede)
     mientras el alumno lee la actual elimina ese salto sin costo
     perceptible. Se engancha solo a `slidechange` y corre una vez para
     la diapositiva inicial.
   -------------------------------------------------------------------- */
  function initPrefetchNeighbors() {
    var ya = {};
    function precargar(index) {
      [index + 1, index - 1].forEach(function (i) {
        var vecina = global.motor && global.motor.slides[i];
        if (!vecina) return;
        vecina.querySelectorAll('img[src]').forEach(function (img) {
          var src = img.getAttribute('src');
          if (!src || ya[src]) return;
          ya[src] = true;
          var pre = new Image();
          pre.src = src;
        });
      });
    }
    document.addEventListener('slidechange', function (e) { precargar(e.detail.index); });
    var cur = global.motor && global.motor.current();
    if (cur) precargar(+cur.getAttribute('data-slide-index'));
  }

  /* ---- Imprimir el resumen final ------------------------------------
     `body.printing-summary` es la clase que el CSS del curso usa para
     dejar visible SOLO el resumen al imprimir. El `setTimeout` cubre los
     navegadores donde `window.print()` no bloquea y `afterprint` no
     dispara (Safari); tener los dos no hace daño — sacar la clase dos
     veces es inocuo, dejarla puesta rompe la pantalla.
   -------------------------------------------------------------------- */
  function initSummaryPrint(opts) {
    opts = opts || {};
    var btn = document.getElementById(opts.buttonId || 'd-summary-print');
    if (!btn) return;
    function limpiar() { document.body.classList.remove('printing-summary'); }
    btn.addEventListener('click', function () {
      document.body.classList.add('printing-summary');
      global.print();
      setTimeout(limpiar, 400);
    });
    global.addEventListener('afterprint', limpiar);
  }

  /* ---- Reloj de tiempo ACTIVO ---------------------------------------
     kit-base v1.8. Devuelve cuánto tiempo estuvo la persona RECORRIENDO
     el curso, descontando lo que duró mirar videos.

     Por qué existe: en un curso con 9 videos, la duración del material
     se lleva la mayor parte del número, y "20 min" termina diciendo más
     sobre lo que dura el video que sobre el recorrido de quien lo hizo.
     El reloj se frena mientras haya CUALQUIER <video> reproduciéndose y
     sigue cuando termina.

     Detalle que se paga caro si se hace mal: los videos en curso se
     llevan en una LISTA, no en un contador. Al terminar un video se
     disparan `pause` Y `ended` — con un contador simple quedaría en
     negativo y el reloj no volvería a arrancar nunca.

     ⚠️ Esto es solo el número que se le muestra al alumno.
     `cmi.core.session_time` de SCORM (scorm-api.js) sigue midiendo la
     sesión REAL: el estándar define ese campo como el tiempo que el SCO
     estuvo abierto, así que descontarle los videos sería reportarle mal
     al LMS.

     Uso:
       initTiempoActivo();                       // una vez, en boot()
       tiempoActivoMs();                         // ms de recorrido real
   -------------------------------------------------------------------- */
  var _reloj = { acumulado: 0, desde: Date.now(), enCurso: [] };
  function relojParar(v) {
    if (_reloj.enCurso.indexOf(v) !== -1) return;
    if (_reloj.enCurso.length === 0) _reloj.acumulado += Date.now() - _reloj.desde;
    _reloj.enCurso.push(v);
  }
  function relojSeguir(v) {
    var i = _reloj.enCurso.indexOf(v);
    if (i === -1) return;
    _reloj.enCurso.splice(i, 1);
    if (_reloj.enCurso.length === 0) _reloj.desde = Date.now();
  }
  function tiempoActivoMs() {
    return _reloj.acumulado + (_reloj.enCurso.length ? 0 : Date.now() - _reloj.desde);
  }
  function initTiempoActivo() {
    // en fase de CAPTURA: los eventos de <video> no burbujean
    document.addEventListener('play', function (e) {
      if (e.target && e.target.tagName === 'VIDEO') relojParar(e.target);
    }, true);
    ['pause', 'ended', 'emptied'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        if (e.target && e.target.tagName === 'VIDEO') relojSeguir(e.target);
      }, true);
    });
  }

  /* ---- Sonidos de UI (tonos sintetizados, Web Audio API) ------------
     Mismo criterio que fx.js (respetan el mute global y
     prefers-reduced-motion) pero separados: fx.js es decoración de
     CUALQUIER interacción, esto es el vocabulario sonoro de
     actividades (acierto / error / racha / victoria). Sin archivos de
     audio: se sintetizan, así el curso no suma peso al paquete SCORM.
   -------------------------------------------------------------------- */
  var actx;
  /* No se crea el AudioContext hasta que hubo un gesto real del alumno
     (kit-base v1.9.52). Chrome bloquea todo AudioContext creado antes
     del primer gesto y escupe "The AudioContext was not allowed to
     start" en la consola de CADA carga del curso — verificado en
     Chromium headless con un curso mínimo del kit: el `slidechange`
     inicial (el `go()` que hace `new Motor()`) dispara el whoosh antes
     de que nadie haya tocado nada. Ese sonido no se escuchaba igual
     (el contexto nace `suspended`), así que lo único que dejaba era el
     warning y un contexto colgado. El flag se prende con el primer
     `pointerdown`/`keydown` en captura — a partir de ahí todo suena
     como siempre. */
  var huboGesto = false;
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, function () { huboGesto = true; }, { capture: true, once: true });
  });
  function ac() {
    if (!huboGesto) return null;
    if (!actx) { try { actx = new (global.AudioContext || global.webkitAudioContext)(); } catch (e) {} }
    return actx;
  }
  function muted() { try { return global.localStorage.getItem('coto-diapos-mute') === '1'; } catch (e) { return false; } }
  // Nivel de volumen (0-1, panel de "Sonido" — kit-base v1.9.35, coto-player.js).
  // Mismo criterio que `muted()`: helper chico duplicado por archivo, no un
  // módulo compartido — cada archivo del kit se copia solo, sin depender
  // de que otro haya cargado antes.
  function volumeLevel() {
    try {
      var v = parseFloat(global.localStorage.getItem('coto-diapos-volume'));
      return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
    } catch (e) { return 1; }
  }
  function tone(f, d, type, vol, when) {
    if (muted() || prefersReduced) return;
    var vl = volumeLevel();
    if (vl <= 0) return;
    var c = ac(); if (!c) return;
    var t0 = c.currentTime + (when || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime((vol == null ? .12 : vol) * vl, t0 + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .03);
  }
  function sCorrect() { tone(660, .12, 'sine', .14); tone(880, .16, 'sine', .12, .09); }
  function sWrong() { tone(220, .22, 'sawtooth', .1); }
  function sStreak() { tone(880, .1, 'sine', .13); tone(1100, .12, 'sine', .12, .08); tone(1320, .16, 'sine', .12, .16); }
  function sWin() { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, .18, 'triangle', .12, i * .09); }); }


  /* ============================================================
     initIndexJumps(opts) — índice clicable, pero solo hacia atrás
     ------------------------------------------------------------
     kit-base v1.9.9 · Una diapositiva de índice con hitboxes que
     saltan a cada sección. El punto fino, y la razón de que esto sea
     genérico: **solo se habilitan los destinos ya visitados**. Un
     índice que salta libre hacia adelante ANULA cualquier gate de
     obligatoriedad del curso (abrir fichas, ver videos, aprobar un
     juego), porque los gates se evalúan al avanzar de a una. El
     atajo sirve para volver, no para adelantarse.

     Los destinos bloqueados quedan `disabled`: salen del orden de
     tabulación solos, sin tocar tabindex, y el lector de pantalla lee
     el motivo en vez de ofrecer un botón que no hace nada.

       opts.selector  CSS de los disparadores del índice.
                      Default: '.d-sidenav-item[data-goto], .d-shot-hit--indice'
                      — LOS DOS (kit-base v1.9.72, §7.19 A4). Antes el
                      default era solo el índice DIBUJADO EN EL ARTE, y
                      el chrome que genera `new-course.mjs` usa el cajón
                      lateral `.d-sidenav-item[data-goto]`: llamar a esta
                      función sin `selector` no fallaba ni avisaba, y el
                      menú lateral quedaba SIN GATE — se podía saltar al
                      cierre sin cumplir nada.
       opts.visited   fn(idDestino) -> bool  (OBLIGATORIA)
       opts.lockedLabel fn(labelBase) -> texto alternativo

     Llamar `refresh()` (lo devuelve) cada vez que cambie lo visitado.
     ============================================================ */
  function initIndexJumps(opts) {
    opts = opts || {};
    var sel = opts.selector || '.d-sidenav-item[data-goto], .d-shot-hit--indice';
    /* `sel` puede ser una LISTA ("a, b"), así que el `[data-goto]` se le
       agrega a CADA parte: concatenarlo al string entero se lo pega solo
       a la última y la primera queda sin filtrar (kit-base v1.9.72). */
    var selGoto = sel.split(',').map(function (x) {
      x = x.trim();
      return x.indexOf('[data-goto]') === -1 ? x + '[data-goto]' : x;
    }).join(', ');
    var visited = opts.visited;
    if (typeof visited !== 'function') return function () {};
    var lockedLabel = opts.lockedLabel || function (base) {
      return base.replace(/^Ir a /, 'Todavía no llegaste a ') +
        ' (se habilita cuando pases por ahí)';
    };

    function refresh() {
      /* Tilde de "ya visto" y línea de progreso del índice lateral
         (kit-base v1.9.72, §7.18 K4). El addendum define
         `.d-sidenav-item.is-done .ix-ck` y el generador emite tanto el
         `<svg class="ix-ck">` de cada ítem como el
         `<p id="d-sidenav-progress">` — pero NADIE los cableaba: un
         `grep` de `is-done`/`d-sidenav-progress` sobre todo el JS del
         kit daba cero. O sea, un curso que no escribiera su propio
         `marcarVistas()` tenía un tilde que no aparecía nunca y una
         línea de progreso vacía, sin ningún error. Misma forma exacta
         que los cuatro hallazgos de §7.17.
         Se cablea acá porque `visited` —el dato que hace falta— ya
         llega a esta función y no hay que pedirle nada nuevo al curso. */
      var items = document.querySelectorAll('.d-sidenav-item[data-goto]');
      var vistos = 0;
      items.forEach(function (it) {
        var hecho = !!visited(it.getAttribute('data-goto'));
        it.classList.toggle('is-done', hecho);
        if (hecho) vistos++;
      });
      var prog = document.getElementById('d-sidenav-progress');
      if (prog && items.length) {
        /* Redacción del CURSO MODELO ("Seguridad Alimentaria"), que es
           la referencia del molde — kit-base v1.9.101. El kit decía
           "1 de 20 vistas", que además de no coincidir con el modelo se
           lee mal: "vistas" queda colgando y no se entiende si cuenta
           diapositivas, visitas o secciones. El modelo dice de quién es
           el progreso y qué cuenta. Lo notó el cliente comparando los
           dos índices lado a lado. */
        prog.textContent = 'Viste ' + vistos + ' de ' + items.length + ' secciones';
      }

      /* ---- Progreso por OBJETIVO de aprendizaje (kit-base v1.9.86) ----
         Las N diapositivas vistas dicen cuánto NAVEGASTE; no dicen cuánto
         de los objetivos declarados en la diapositiva "Objetivos" ya
         cubriste, que es lo que al alumno le importa. Cada pip se da por
         cubierto cuando visitó su diapositiva de checkpoint.

         El mapeo objetivo -> diapositiva viaja en el MARCADO
         (`data-obj-pip="A" data-obj-check="resumen1"`), no en una opción
         de esta función, por dos motivos:

           · es dato de CONTENIDO — cambia por curso, igual que el
             `data-goto` de cada item del indice, que ya se lee del DOM;
           · y asi esto no necesita que el curso llame ni refresque nada
             aparte. Los dos cursos terminados traian su propio
             `marcarObjetivos()`, y en los dos habia que acordarse de
             invocarlo DESPUES de cada `marcarVistas()` — el mismo cable
             suelto de siempre (§7.17). Acá cuelga del `refresh()` que el
             curso ya llama, asi que no se puede desincronizar.

         ⚠️ El total se CUENTA (`pips.length`), no se escribe. Los dos
         cursos tenian "de 3 objetivos cubiertos" a mano: el cuarto
         objetivo habria mentido en silencio. */
      /* ⚠️ POR GRUPO, no por documento (kit-base v1.9.98).
         BUG REAL. La primera versión hacía
         `document.querySelectorAll('[data-obj-pip]')` y
         `document.querySelector('[data-obj-lbl]')`: contaba los pips de
         TODO el documento y escribía el rótulo en el PRIMERO que
         encontraba. Con un solo grupo —el caso de los cursos de hoy—
         funciona; con dos, los dos grupos se mezclan en una cuenta sola
         y el segundo rótulo queda vacío para siempre.

         MEDIDO en el curso generado, inyectando dos grupos (uno de 3
         objetivos, otro de 2): el primer rótulo decía
         **"0 de 5 objetivos cubiertos"** y el segundo quedó en **''**.

         Lo delataba su propio test, que no se podía aprobar: para medir,
         `objetivos-progreso.mjs` inyecta un grupo de prueba y lee SU
         rótulo. En un curso que YA tiene el suyo, el kit escribía en el
         del curso y el de la prueba quedaba en '' — o sea que el test
         solo pasaba en cursos SIN la funcionalidad, y fallaba justo en
         los que la usan.

         Se recorre por CONTENEDOR (`.d-obj-progress`, el envoltorio que
         documenta `coto-base-addendum`), con el documento entero como
         único grupo si un curso no lo usa, así el marcado de los cursos
         ya entregados sigue valiendo igual. */
      var gruposObj = document.querySelectorAll('.d-obj-progress');
      var ambitosObj = gruposObj.length ? Array.prototype.slice.call(gruposObj) : [document];
      ambitosObj.forEach(function (ambito) {
        var pips = ambito.querySelectorAll('[data-obj-pip]');
        if (!pips.length) return;
        var cubiertos = 0;
        pips.forEach(function (pip) {
          var check = pip.getAttribute('data-obj-check');
          /* Sin `data-obj-check` el pip no se puede evaluar: se deja
             apagado en vez de darlo por cubierto. Un objetivo que se
             tilda solo es peor que uno que nunca se tilda. */
          /* `objetivoCumplido(id)` (kit-base v1.9.123, §7.72): un objetivo
             que NO se cumple visitando —NOA: "abrir las 10 fichas",
             "aprobar el minijuego"— lo decide el curso. Sin esto el
             `refresh()` del kit lo pisaba con "visitado", y el curso tenía
             que pintar DESPUÉS de cada refresh para no quedar en "0 de 3".
             Devuelve true/false para decidir, o `undefined` para dejarle
             el criterio de siempre (visitar `data-obj-check`). */
          var propio = typeof opts.objetivoCumplido === 'function'
            ? opts.objetivoCumplido(pip.getAttribute('data-obj-pip'), check, pip) : undefined;
          var hecho = propio !== undefined ? !!propio : !!(check && visited(check));
          if (hecho) cubiertos++;
          pip.classList.toggle('is-done', hecho);
        });
        var objLbl = ambito.querySelector('[data-obj-lbl]');
        if (objLbl) {
          objLbl.textContent = cubiertos + ' de ' + pips.length +
            (pips.length === 1 ? ' objetivo cubierto' : ' objetivos cubiertos');
        }
      });

      document.querySelectorAll(selGoto).forEach(function (b) {
        var abierto = !!visited(b.getAttribute('data-goto'));
        b.disabled = !abierto;
        b.classList.toggle('is-open', abierto);
        var lbl = b.querySelector('.sr-only');
        if (!lbl) return;
        if (!b.dataset.lblBase) b.dataset.lblBase = lbl.textContent;
        lbl.textContent = abierto ? b.dataset.lblBase : lockedLabel(b.dataset.lblBase);
      });
    }
    refresh();
    return refresh;
  }

  /* ============================================================
     initPopupPrefetch(opts) — precargar los pop-ups de una diapositiva
     ------------------------------------------------------------
     kit-base v1.9.9 · `initPrefetchNeighbors` precarga las
     DIAPOSITIVAS vecinas, pero deja afuera los pop-ups: el primer
     pop-up con imagen pesada que abrías se veía cargar en blanco. Este
     lee, de la diapositiva activa, un atributo con la lista de ids de
     pop-up que va a necesitar, y precarga sus imágenes al entrar — para
     cuando el alumno toca el primer botón, ya están en caché.

     `fetchPriority='low'` a propósito: no tiene que pelear ancho de
     banda con el video de fondo ni con la diapositiva siguiente.

       opts.attr     atributo con los ids (def. 'data-require-fichas')
       opts.imgSel   qué imagen del pop-up precargar (def. '.d-shot-img')
     ============================================================ */
  function initPopupPrefetch(opts) {
    opts = opts || {};
    var attr = opts.attr || 'data-require-fichas';
    var imgSel = opts.imgSel || '.d-shot-img';
    var hechas = {};

    function precargar(slideEl) {
      if (!slideEl) return;
      (slideEl.getAttribute(attr) || '').split(/\s+/).filter(Boolean).forEach(function (id) {
        if (hechas[id]) return;
        hechas[id] = true;
        var img = document.querySelector('[data-popup="' + id + '"] ' + imgSel);
        var src = img && img.getAttribute('src');
        if (!src) return;
        var pre = new Image();
        if ('fetchPriority' in pre) pre.fetchPriority = 'low';
        pre.src = src;
      });
    }

    document.addEventListener('slidechange', function () {
      precargar(global.motor && global.motor.current());
    });
    precargar(global.motor && global.motor.current());
    return precargar;
  }

  /* ============================================================
     initGlossarySearch(opts) — buscador rápido del glosario
     ------------------------------------------------------------
     kit-base v1.9.22. 100% genérico: no sabe qué términos tiene el
     curso, solo filtra los `<dt>/<dd>` de cualquier `dl.d-glossary`
     dentro del pop-up de glosario por coincidencia de texto (sin
     distinguir mayúsculas ni acentos, así "peligro quimico" encuentra
     "Peligro químico"). Si una sección entera (su `<dl>`) queda sin
     resultados, se oculta junto con el encabezado que la precede — un
     `<h4>` "colgado" sin nada debajo se lee como un bug, no como un
     filtro funcionando.

       opts.popup   selector del pop-up (def. '[data-popup="glosario"]')
       opts.input   selector del campo de búsqueda (def. '[data-gloss-search]')
       opts.empty   selector del mensaje "sin resultados" (opcional,
                    def. '[data-gloss-empty]')

     Uso: initGlossarySearch();  // una vez, en boot()
     ============================================================ */
  function quitarAcentos(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  }
  function initGlossarySearch(opts) {
    opts = opts || {};
    var popup = document.querySelector(opts.popup || '[data-popup="glosario"]');
    if (!popup) return;
    var input = popup.querySelector(opts.input || '[data-gloss-search]');
    var empty = popup.querySelector(opts.empty || '[data-gloss-empty]');
    if (!input) return;

    var listas = Array.prototype.slice.call(popup.querySelectorAll('dl.d-glossary'));
    function filtrar() {
      var q = quitarAcentos(input.value.trim().toLowerCase());
      var totalVisible = 0;
      listas.forEach(function (dl) {
        var pares = [];
        Array.prototype.forEach.call(dl.children, function (el) {
          if (el.tagName === 'DT') pares.push({ dt: el, dd: null });
          else if (el.tagName === 'DD' && pares.length) pares[pares.length - 1].dd = el;
        });
        var visiblesEnLista = 0;
        pares.forEach(function (par) {
          // Un término bloqueado (initGlossaryUnlock, ver más abajo) nunca
          // entra en los RESULTADOS de una búsqueda con texto — su
          // definición real sigue en el DOM (oculta por CSS, no por este
          // filtro) para el día en que se desbloquee, pero no debería
          // poder "encontrarse" buscando antes de eso. Sin texto de
          // búsqueda (q vacío) sí se muestra, con su candado — es la
          // vista normal del glosario, no un resultado de búsqueda.
          var bloqueado = par.dt.classList.contains('is-locked');
          var texto = quitarAcentos((par.dt.textContent + ' ' + (par.dd ? par.dd.textContent : '')).toLowerCase());
          var visible = !q ? true : (!bloqueado && texto.indexOf(q) !== -1);
          par.dt.hidden = !visible;
          if (par.dd) par.dd.hidden = !visible;
          if (visible) visiblesEnLista++;
        });
        dl.hidden = visiblesEnLista === 0;
        var heading = dl.previousElementSibling;
        if (heading && /^H[1-6]$/.test(heading.tagName)) heading.hidden = visiblesEnLista === 0;
        totalVisible += visiblesEnLista;
      });
      if (empty) empty.hidden = totalVisible !== 0;
    }
    input.addEventListener('input', filtrar);
    filtrar();
  }

  /* ============================================================
     initGlossaryUnlock(opts) — glosario progresivo (candado hasta
     visitar la diapositiva que explica el término)
     ------------------------------------------------------------
     kit-base v1.9.28. 100% genérico: no sabe qué términos tiene el
     curso ni a qué diapositiva corresponde cada uno — eso vive en el
     propio marcado, con el MISMO atributo que ya usa el índice/
     sidenav para saltar (`data-goto="<slide-id>"`, dentro del <dt>):
     `new Motor()` ya lo cablea solo al arrancar (cierra cualquier
     pop-up abierto y navega, gratis — `Motor.prototype.go`), así que
     "hacer clic en un término te lleva a la diapositiva" no necesita
     ningún JS nuevo, alcanza con poner el atributo en el marcado.
     Este módulo solo decide bloqueado/desbloqueado, dejando la fuente
     de verdad (¿ya se vio esa diapositiva?) del lado del curso vía
     callback — igual que `initProgressSeek`/`visitedIndexes()` no
     sabe de dónde sale "visto", solo pregunta.

     Marcado esperado por término, dentro de cualquier `dl.d-glossary`:
       <dt><button data-goto="slide-id">Término</button>
         <svg data-gloss-lock aria-hidden="true">...candado...</svg>
       </dt>
       <dd><span class="d-gloss-def">Definición real.</span>
           <span class="d-gloss-hint">Se desbloquea al llegar a "...".</span></dd>
     El CSS (`coto-base-addendum-v1.8.css`) se encarga de mostrar el
     candado + el hint y ocultar `.d-gloss-def` mientras el <dt> tenga
     la clase `.is-locked` — este módulo solo pone/saca esa clase.

       opts.popup      selector del pop-up (def. '[data-popup="glosario"]')
       opts.seen(id)   función que devuelve true si esa diapositiva
                       (el `data-goto` del término) ya fue vista
       opts.onUnlock(labels) callback opcional: se llama con la lista
                       de nombres de término que pasaron de bloqueado a
                       desbloqueado EN ESA llamada — para disparar un
                       toast ("🔓 Desbloqueaste..."). Nunca se llama en
                       la primera pasada (arranque): un progreso ya
                       restaurado no es una notificación nueva, es
                       estado que se está aplicando en silencio.

     Devuelve una función `refresh()` — el curso la llama de nuevo en
     cada `slidechange` (después de actualizar su propio "visto") para
     que el glosario reaccione en caliente mientras el pop-up puede
     estar abierto o no.

     Uso:
       var refrescarGlosario = initGlossaryUnlock({
         seen: function (id) { return !!estado.vistas[id]; },
         onUnlock: function (labels) {
           if (Player) Player.toast('🔓 ' + (labels.length === 1
             ? 'Desbloqueaste "' + labels[0] + '"'
             : 'Desbloqueaste ' + labels.length + ' términos') + ' del glosario');
         }
       });
       document.addEventListener('slidechange', function (e) {
         estado.vistas[e.detail.id] = true;
         refrescarGlosario();
       });
     ============================================================ */
  function initGlossaryUnlock(opts) {
    opts = opts || {};
    var popup = document.querySelector(opts.popup || '[data-popup="glosario"]');
    if (!popup) return function () {};
    var seen = opts.seen || function () { return true; };

    /* EL ORDEN LO DECIDE EL CURSO, no este módulo (kit-base v1.9.63,
       explicitado tras una consulta real: "¿el glosario está definido
       por orden de aparición?"). Se leen los `<dt>` en el orden del
       HTML y NO se ordenan nunca — ni alfabéticamente ni por
       desbloqueo. La convención del molde es ORDEN DE APARICIÓN en el
       curso, y encaja con el desbloqueo progresivo: si los términos
       siguen el recorrido, lo desbloqueado queda arriba y lo que falta
       abajo, así el glosario se lee como un mapa del avance. Un curso
       que los quiera alfabéticos solo tiene que escribirlos así en su
       `index.html` — el kit es agnóstico, pero el default del molde no
       es "cualquiera": es el orden en que aparecen. */
    var terminos = Array.prototype.map.call(popup.querySelectorAll('dl.d-glossary dt'), function (dt) {
      var link = dt.querySelector('[data-goto]');
      if (!link) return null;
      return { dt: dt, link: link, id: link.getAttribute('data-goto'), label: link.textContent, bloqueado: true };
    }).filter(Boolean);

    /* BUG REAL, reportado ("el glosario rompe el bloqueo de avanzar de
       a 1 diapo") — kit-base v1.9.42. Mismo patrón que ya se corrigió
       en el índice lateral (§6.44 punto 2, `.d-sidenav-item:disabled`):
       `.is-locked` solo apagaba el color del término, nunca el botón —
       `data-goto` en un `<button>` sigue siendo clickeable/enfocable
       aunque el `<dt>` que lo envuelve se vea bloqueado. El motor
       (`[data-goto]`, spec-motor-slides.md §4) navega SIN chequear
       ningún gate — eso es correcto para volver a lo ya visto (el
       índice), pero un término TODAVÍA bloqueado apunta a una
       diapositiva que el alumno nunca visitó: un clic ahí saltaba
       directo, saltándose cualquier interacción/gate de las
       diapositivas intermedias. `link.disabled = true` en un `<button>`
       nativo alcanza — un botón deshabilitado no dispara `click` (el
       browser ni siquiera lo entrega al listener del motor), así que
       no hace falta tocar nada del lado de `motor-slides.js`. */
    function refresh(silencioso) {
      var desbloqueados = [];
      terminos.forEach(function (t) {
        var visto = !!seen(t.id);
        if (!silencioso && t.bloqueado && visto) desbloqueados.push(t.label);
        t.bloqueado = !visto;
        t.dt.classList.toggle('is-locked', !visto);
        t.link.disabled = !visto;
        /* ---- Y el atributo `hidden`, no solo la clase (kit-base v1.9.96) ----
           El CSS esconde la definición o la pista según `.is-locked`
           (`coto-base-addendum-v1.8.css`: `display:none`), y `textOf()`
           filtra por el ATRIBUTO `hidden`, nunca por el display calculado —
           es la trampa que §7.21 F1 ya documenta, solo que acá la produce
           el marcado que el propio kit recomienda.

           Consecuencia: un curso que narre el glosario leía, por cada
           término, la definición Y la pista del candado
           (*"...No aparece en el envase.Se desbloquea al llegar a
           «Algunos conceptos importantes»."*) — la pista incluso con el
           término ya DESBLOQUEADO, y pegada sin espacio porque los dos
           `<span>` viven en el mismo `<dd>` y `textContent` los concatena.

           Marcando con `hidden` lo que el CSS ya esconde, el glosario queda
           bien narrado sin que el curso tenga que saber nada de esto. La
           clase se mantiene: es la que gobierna el estilo. */
        var dd = t.dt.nextElementSibling;
        if (dd && dd.tagName === 'DD') {
          var def = dd.querySelector('.d-gloss-def');
          var pista = dd.querySelector('.d-gloss-hint');
          if (def) def.hidden = !visto;
          if (pista) pista.hidden = visto;
        }
      });
      if (desbloqueados.length && opts.onUnlock) opts.onUnlock(desbloqueados);
    }
    refresh(true); // aplica el estado ya restaurado sin avisar (no es "nuevo")
    return refresh;
  }

  /* `CotoUI` es el namespace documentado; los alias sueltos de más
     abajo existen para que `curso.js` llame corto. `initIndexJumps` e
     `initPopupPrefetch` estaban SOLO en los alias y faltaban acá
     (kit-base v1.9.52) — una asimetría silenciosa: quien seguía el
     namespace se encontraba con que dos de las funciones del archivo
     no existían ahí, sin ninguna razón. */

  /* ============================================================
     initPopupGate(opts) / initGateHints(opts) — kit-base v1.9.63
     ------------------------------------------------------------
     POR QUÉ EXISTEN (auditoría del 3er curso terminado, §7.11):
     `faltanPopups()` estaba escrita, con el mismo cuerpo, en los TRES
     cursos terminados — "Prevención cardiovascular", "Uso de
     Sucursales 3 - NOA" y "Seguridad alimentaria". Cambiaba solo el
     nombre del atributo (`data-require-popups` en dos, y
     `data-require-fichas` en el tercero: la divergencia que aparece
     sola cuando cada curso reescribe lo mismo) y qué mapa de estado
     leía. Y el kit YA tenía la otra mitad del problema resuelta:
     `initVideoGate()` (v1.9.62, coto-media.js) hace exactamente esto
     para videos. Faltaba la mitad de los pop-ups.

     `initGateHints()` es la otra pieza que los cursos reescribían, y
     esta duele más: el kit ya tenía el CSS (`.d-shake` en el botón
     "Siguiente", `.d-nudge` en el elemento pendiente, los dos con su
     `prefers-reduced-motion`, en coto-player-bottom.css desde que se
     extrajeron de "Prevención cardiovascular") pero NUNCA el JS que
     los dispara. O sea: el kit tenía la animación y cada curso tenía
     que acordarse de cablearla, que es el mismo seam mal puesto que
     §7.08 encontró con los puntos y logros.

     Lo que aporta de verdad, y por qué vale la pena que sea del kit:
     un gate que solo dice "no podés avanzar" deja al alumno buscando
     QUÉ le falta. Estas dos, juntas, hacen que el curso señale la
     interacción pendiente (pulso sobre ella) y diga cuántas quedan.
     ============================================================ */

  /* Espejo de `initVideoGate()`: mismo contrato `faltan(slideEl)`, para
     que un curso que gatea por videos Y por pop-ups escriba las dos
     mitades igual en vez de inventar dos formas.
       initPopupGate({ seen, markSeen })  → { faltan, marcarVisto, visto }
     `data-require-popups` es el atributo canónico. Se acepta también
     `data-require-fichas` porque un curso real ya lo usaba y romperlo
     no aporta nada — pero para un curso nuevo, `-popups`. */
  function initPopupGate(opts) {
    opts = opts || {};
    var vistos = {};
    var seen = opts.seen || function (id) { return !!vistos[id]; };
    var mark = opts.markSeen || function (id) { vistos[id] = true; };

    /* Marcar solo se hace acá: el curso ya no necesita su propio
       listener de `popupopen` (los tres lo tenían, los tres iguales). */
    document.addEventListener('popupopen', function (e) {
      var id = e.detail && e.detail.id;
      if (!id || seen(id)) return;
      mark(id);
      if (opts.onChange) opts.onChange(id);
    });

    function requeridos(slideEl) {
      if (!slideEl || !slideEl.getAttribute) return [];
      var req = slideEl.getAttribute('data-require-popups') ||
                slideEl.getAttribute('data-require-fichas') || '';
      return req.split(/\s+/).filter(Boolean);
    }
    return {
      faltan: function (slideEl) {
        return requeridos(slideEl).filter(function (id) { return !seen(id); });
      },
      marcarVisto: function (id) { mark(id); },
      visto: function (id) { return !!seen(id); }
    };
  }

  /* Feedback al intentar avanzar con el gate puesto. Escucha
     `advanceblocked` (lo emite el motor) y hace las 3 cosas que los
     cursos hacían a mano:
       · el botón "Siguiente" tiembla (.d-shake)
       · el/los elemento(s) pendientes pulsan (.d-nudge)
       · un toast dice CUÁNTOS faltan y de qué
     `opts.pendientes(slideEl)` lo provee el curso y devuelve
     `[{ el, tipo }]` — o se arma solo a partir de los gates que se le
     pasen en `opts.gates`, que es el caso normal:
       initGateHints({ gates: [
         { gate: popupGate, sel: function (id) { return '[data-popup-trigger="' + id + '"]'; },
           uno: 'tarjeta', varias: 'tarjetas' },
         { gate: videoGate, sel: function (src) { return '[data-video="' + src + '"]'; },
           uno: 'video', varias: 'videos' }
       ] });
     El `void offsetWidth` entre quitar y poner la clase es obligatorio
     en las dos animaciones: sin ese reflow, dos intentos seguidos no
     reinician la animación y el segundo no se ve (mismo detalle que
     `_syncGate()` y que el pulso del chip de logros). */
  function initGateHints(opts) {
    opts = opts || {};
    var gates = opts.gates || [];

    function animar(el, clase) {
      if (!el) return;
      el.classList.remove(clase);
      void el.offsetWidth;
      el.classList.add(clase);
    }

    document.addEventListener('advanceblocked', function (e) {
      var id = e.detail && e.detail.id;
      var slideEl = id && document.querySelector('[data-slide="' + id + '"]');
      document.querySelectorAll('[data-nav="next"]').forEach(function (b) {
        animar(b, 'd-shake');
      });
      if (!slideEl) return;

      /* `opts.pendientes(slideEl)` — la vía de escape que este mismo
         encabezado promete desde que existe la función, y que hasta
         v1.9.72 el cuerpo NUNCA leía (§7.19 A2). Un curso con un gate
         propio (uno que no sea `initPopupGate`/`initVideoGate`) la
         implementaba siguiendo la documentación y no pasaba nada: ni
         pulso, ni toast, ni un error que lo delatara.
         Devuelve `[{ el, tipo }]`; si devuelve algo, gana sobre los
         `gates` declarativos, porque es lo más específico que el curso
         pudo decir sobre su propia diapositiva. */
      if (typeof opts.pendientes === 'function') {
        var propios = opts.pendientes(slideEl) || [];
        if (propios.length) {
          propios.forEach(function (p) { if (p && p.el) animar(p.el, 'd-nudge'); });
          if (global.Player && global.Player.toast) {
            var tipo = propios[0] && propios[0].tipo;
            global.Player.toast(
              propios.length === 1
                ? 'Te falta ' + (tipo || 'un paso') + ' para poder avanzar'
                : 'Te faltan ' + propios.length + ' ' + (tipo || 'pasos') + ' para poder avanzar');
          }
          return;
        }
      }

      /* Se avisa por el PRIMER gate que tenga pendientes, no por todos:
         tres toasts encimados sobre el mismo intento es ruido, y el
         alumno solo puede atender una cosa por vez. El orden del array
         es la prioridad, y la decide el curso. */
      for (var i = 0; i < gates.length; i++) {
        var g = gates[i];
        if (!g || !g.gate || !g.gate.faltan) continue;
        var faltan = g.gate.faltan(slideEl);
        if (!faltan.length) continue;
        faltan.forEach(function (clave) {
          if (!g.sel) return;
          animar(slideEl.querySelector(g.sel(clave)), 'd-nudge');
        });
        if (opts.toast !== false && global.Player && global.Player.toast) {
          var n = faltan.length;
          var qué = n === 1 ? (g.uno || 'elemento') : (g.varias || 'elementos');
          global.Player.toast('Te ' + (n === 1 ? 'queda 1 ' : 'quedan ' + n + ' ') + qué + ' por ver antes de seguir.');
        }
        return;
      }
    });
  }


  /* ============================================================
     initRepasoRapido(opts) — kit-base v1.9.64 (§7.12)
     ------------------------------------------------------------
     Pareja JS de `coto-repaso.css`. Sube por el mismo motivo que la
     cáscara: estaba escrita en "Uso de Sucursales 3 - NOA" y en
     "Seguridad alimentaria" con ~95 líneas y 70% de similitud, y la
     diferencia era el pegamento con el estado de cada curso, no la
     mecánica. Acá queda la mecánica; el curso pasa `seen`/`markSeen`.

     Dos preguntas V/F por unidad, UNA por vez, sin nota ni gate: es
     refuerzo, no evaluación (mismo criterio que el minijuego, un paso
     más allá — acá ni siquiera empuja la nota final).

       initRepasoRapido({
         seen: function (id) { return !!estado.repaso[id]; },
         markSeen: function (id) { estado.repaso[id] = true; persistir(); },
         onCorrect: function (id) { Logros.award(5, 'Repaso'); }
       });
     ============================================================ */
  /* Opciones nuevas en kit-base v1.9.118 (relevo de "Seguridad
     alimentaria", 2026-10-06; las cuatro vienen de pedidos del cliente):
       seenMal(id)          → la respuesta ERRADA que eligió antes, o falsy.
                              Se restaura cuál eligió y se muestra la buena.
       markMal(id, eligio)  → guardar una respuesta errada ('true'/'false'
                              o el valor del botón).
       onAnswer(id, acerto, eligio) → cada respuesta (ej. XAPI.answered).
     Y dos conductas sin opción: al cambiar de pregunta con las flechas se
     corta la voz y se narra SOLO la pregunta nueva, y al entrar arranca
     en la primera pregunta sin contestar. */
  /* ============================================================
     acomodarTirasSueltas() — la tira de repaso SALE del lienzo cuando
     no entra en su banda y abajo hay franja libre (kit-base v1.9.120,
     §7.69)
     ------------------------------------------------------------
     Pareja JS de `.d-repaso-marco--suelto` (coto-repaso.css, v1.9.107).
     El CSS llegó al kit y la lógica que decide cuándo usarlo se quedó en
     "Prevención cardiovascular" (`acomodarTiras`, relevo del 2026-10-06):
     un curso nuevo tenía la regla y no el comportamiento, y en iPad
     vertical la tarjeta scrolleaba y tapaba el dibujo.
     Para cada `.d-repaso-marco` de una diapositiva con lámina: mide la
     franja libre bajo el arte contra lo que la tarjeta NECESITA
     (`scrollHeight`, no `clientHeight`) más 24px de aire. Si entra, la
     saca del `.d-shot` (que tiene `overflow:hidden`) y le pone
     `--tira-arriba`; si deja de entrar, la devuelve y la recoloca.
     Corre sola desde `initRepasoRapido` (se apaga con `suelto: false`)
     y en cada `slidechange` y `resize`. En teléfono apaisado no hay
     franja libre: ahí sigue el modo compacto de `coto-repaso.css`. */
  /* ---- Modo pop-up en teléfono (kit-base v1.9.121, §7.70) ----
     Decisión del cliente (B1 del relevo de cardio): "en estos cursos no
     hay scroll, nunca" vale también para la tira. En teléfono apaisado
     el escenario mide ~170px de alto y la tira necesita ~213: no hay
     geometría que la haga entrar, y el modo compacto de coto-repaso.css
     la dejaba con scroll. Ahí la tira se vuelve un botón en su lugar, y
     al tocarlo se abre ENTERA en una capa sobre el curso. Se cierra con
     "Listo", Escape, tocando afuera o al cambiar de diapositiva, y vuelve
     a su marco. Pasó en dos cursos (cardio y "Seguridad de la
     información"), por eso es del kit. Solo en teléfono (lado corto ≤
     480px): en escritorio la tira que no entra es un problema de
     contenido, no de pantalla. */
  function esTelefono() { return Math.min(global.innerWidth, global.innerHeight) <= 480; }
  var capaAbierta = null;
  function cerrarCapa() {
    var c = capaAbierta;
    if (!c) return;
    capaAbierta = null;
    c.marco.insertBefore(c.tira, c.marco.firstChild ? c.marco.firstChild.nextSibling : null);
    c.capa.remove();
    var cab = c.marco.querySelector('.d-repaso-abrir');
    if (cab) {
      var listo = c.tira.classList.contains('is-complete');
      cab.classList.toggle('is-completa', listo);
      cab.querySelector('span').textContent = listo ? 'Repaso completo · volver a ver' : 'Repaso rápido · tocá para responder';
      try { cab.focus({ preventScroll: true }); } catch (e) {}
    }
  }
  function abrirCapa(marco) {
    cerrarCapa();
    var tira = marco.querySelector('.d-repaso');
    if (!tira) return;
    var capa = document.createElement('div');
    capa.className = 'd-repaso-capa';
    capa.setAttribute('role', 'dialog');
    capa.setAttribute('aria-modal', 'true');
    capa.setAttribute('aria-label', 'Repaso rápido');
    var caja = document.createElement('div');
    caja.className = 'd-repaso-capa-caja';
    var listo = document.createElement('button');
    listo.type = 'button';
    listo.className = 'd-repaso-capa-listo';
    listo.textContent = 'Listo';
    caja.appendChild(tira);
    caja.appendChild(listo);
    capa.appendChild(caja);
    document.body.appendChild(capa);
    capaAbierta = { capa: capa, tira: tira, marco: marco };
    listo.addEventListener('click', cerrarCapa);
    capa.addEventListener('click', function (e) { if (e.target === capa) cerrarCapa(); });
    var primero = tira.querySelector('[data-repaso-item]:not([hidden]) [data-repaso-ans]:not(:disabled)') || listo;
    try { primero.focus({ preventScroll: true }); } catch (e) {}
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && capaAbierta) cerrarCapa(); });
  document.addEventListener('slidechange', cerrarCapa);
  function ponerPop(marco, si) {
    var cab = marco.querySelector('.d-repaso-abrir');
    if (si && !cab) {
      cab = document.createElement('button');
      cab.type = 'button';
      cab.className = 'd-repaso-abrir';
      cab.innerHTML = '<b aria-hidden="true">🔍</b><span>Repaso rápido · tocá para responder</span>';
      cab.addEventListener('click', function () { abrirCapa(marco); });
      marco.insertBefore(cab, marco.firstChild);
    }
    if (!si && cab) { if (capaAbierta && capaAbierta.marco === marco) cerrarCapa(); cab.remove(); }
    marco.classList.toggle('d-repaso-marco--pop', !!si);
  }

  function acomodarTirasSueltas() {
    document.querySelectorAll('[data-slide] .d-repaso-marco').forEach(function (marco) {
      var slide = marco.closest('[data-slide]');
      var tira = marco.querySelector('.d-repaso') || (capaAbierta && capaAbierta.marco === marco ? capaAbierta.tira : null);
      var shot = slide && slide.querySelector('[data-shot]');
      var img = shot && shot.querySelector('.d-shot-img');
      if (!tira || !shot || !img) return;
      var ir = img.getBoundingClientRect();
      var sr = slide.getBoundingClientRect();
      if (!ir.height || !sr.height) return;          // diapositiva oculta: se mide al llegar
      if (marco.classList.contains('d-repaso-marco--pop')) {
        if (esTelefono()) return;                     // sigue de botón; la tira está escondida o en la capa
        ponerPop(marco, false);
      }
      var afuera = sr.bottom - ir.bottom >= tira.scrollHeight + 24;
      var yaAfuera = marco.classList.contains('d-repaso-marco--suelto');
      if (afuera) {
        if (!yaAfuera) {
          /* Se le saca `data-place` para que `_initShots()` no lo cuente;
             lo que siga escribiendo `place()` lo pisa el `!important` de
             la clase (ver coto-repaso.css). */
          marco.removeAttribute('data-place');
          marco.removeAttribute('style');
          marco.classList.add('d-repaso-marco--suelto');
          if (marco.parentElement === shot) slide.appendChild(marco);
        }
        marco.style.setProperty('--tira-arriba', Math.round(ir.bottom - sr.top) + 'px');
      } else if (yaAfuera) {
        marco.classList.remove('d-repaso-marco--suelto');
        marco.removeAttribute('style');
        if (marco.parentElement !== shot) shot.appendChild(marco);
        marco.setAttribute('data-place', '');
        if (global.motor && global.motor._initShots) global.motor._initShots();
      }
      /* Ni en su banda ni afuera: en teléfono, botón + capa. */
      if (!afuera && esTelefono() && tira.scrollHeight > marco.clientHeight + 2) ponerPop(marco, true);
    });
  }
  var tirasEnganchadas = false;
  function engancharTirasSueltas() {
    if (tirasEnganchadas) return;
    tirasEnganchadas = true;
    var pendiente = 0;
    var luego = function () { clearTimeout(pendiente); pendiente = setTimeout(acomodarTirasSueltas, 120); };
    document.addEventListener('slidechange', luego);
    global.addEventListener('resize', luego);
    luego();
  }

  var candadosEnganchados = false;
  function initRepasoRapido(opts) {
    opts = opts || {};
    var candados = [];
    if (opts.suelto !== false && document.querySelector('[data-slide] .d-repaso-marco')) engancharTirasSueltas();
    var seen = opts.seen || function () { return false; };
    var mark = opts.markSeen || function () {};
    var seenMal = opts.seenMal || function () { return null; };
    var markMal = opts.markMal || function () {};
    var onAnswer = opts.onAnswer || function () {};

    document.querySelectorAll('[data-repaso]').forEach(function (panel) {
      var items = Array.prototype.slice.call(panel.querySelectorAll('[data-repaso-item]'));
      var count = panel.querySelector('[data-repaso-count]');
      var prevBtn = panel.querySelector('[data-repaso-prev]');
      var nextBtn = panel.querySelector('[data-repaso-nextq]');
      if (!items.length) return;

      /* UNA pregunta por vez (pedido real del cliente): con las dos a la
         vez, al contestar la primera el panel crecía y chocaba contra el
         borde inferior de la diapositiva. De a una, el alto del bloque no
         depende de cuántas se contestaron.
         Las flechas ‹ › navegan libre entre preguntas contestadas o no —
         a diferencia de "Siguiente", que solo aparece tras responder y
         empuja hacia adelante. Volver a la 1 después de la 2 no resetea
         ninguna respuesta. */
      var actual = 0;
      /* `inicial`: el `mostrar()` del arranque no corta ni narra nada. */
      function mostrar(i, inicial) {
        i = Math.max(0, Math.min(items.length - 1, i));
        actual = i;
        items.forEach(function (it, n) {
          it.classList.toggle('is-current', n === i);
          /* BUG REAL, y la razón de que esto sea `hidden` y no solo una
             clase: `.d-repaso-item{display:none}` esconde visualmente,
             pero `Narrador.textOf()` filtra por el ATRIBUTO `hidden`,
             nunca por el `display` calculado. Con solo la clase, al
             entrar a la diapositiva se narraban las dos preguntas
             seguidas, revelando la segunda antes de que el alumno
             llegara. Con `hidden` real, ocultar de la vista y ocultar
             de la voz son la MISMA garantía. */
          it.hidden = n !== i || panel.classList.contains('is-bloqueada');
        });
        if (count) count.textContent = (i + 1) + ' de ' + items.length;
        if (prevBtn) prevBtn.disabled = i === 0;
        if (nextBtn) nextBtn.disabled = i === items.length - 1;

        /* ---- La voz sigue a la pregunta (v1.9.118) ----
           Pedidos del cliente en "Seguridad alimentaria": *"si respondo
           una pregunta y avanzo con la flecha a la siguiente, la locución
           de la retroalimentación de la pregunta anterior sigue
           reproduciéndose"* y *"al pasar de la pregunta 1 a la 2 la
           locución vuelve a leer todo el contenido de la diapositiva; debe
           leer solo la pregunta"*. Cambiar de pregunta no es cambiar de
           diapositiva, así que el corte del `slidechange` no se entera.
           Se corta siempre, y si la locución está activa se narra SOLO la
           pregunta visible (`textOf(item)`: las otras están `hidden`),
           220 ms después y solo si el alumno sigue en la misma diapositiva.
           `speakSlide()` fue la primera versión en ese curso y el cliente
           la rechazó: repetía el texto de la lámina. */
        if (inicial || !global.Narrador) return;
        var narrando = global.Narrador.isNarrating ? global.Narrador.isNarrating() : false;
        if (global.Narrador.cancel) global.Narrador.cancel();
        if (!narrando) return;
        var sl = global.motor && global.motor.current && global.motor.current();
        var item = items[i];
        setTimeout(function () {
          if (!global.Narrador.isNarrating() || (global.motor && global.motor.current && global.motor.current() !== sl)) return;
          var txt = global.Narrador.textOf(item);
          if (txt) global.Narrador.speak(txt, 'repaso');
        }, 220);
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { mostrar(actual - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { mostrar(actual + 1); });

      /* `restaurando`: lo contestado en otra sesión se pinta igual, pero
         no se narra (antes se narraba la devolución al cargar la página). */
      function resolver(item, acerto, restaurando) {
        item.classList.add('is-answered', acerto ? 'is-correct' : 'is-wrong');
        /* Devolución DISTINTA según acierto o error (kit-base v1.9.77,
           §7.23 C7). Antes salía el mismo texto en los dos casos, así
           que la redacción tenía que servir para ambos — y en la
           práctica terminaba presuponiendo que erraste ("Recordá
           que…"), que es raro de leer cuando acertaste.
           Marcado, los dos opcionales y retrocompatible: si el curso
           solo trae `[data-repaso-fb]`, se comporta igual que siempre.
             <p data-repaso-fb hidden>…</p>            ← el de siempre
             <p data-repaso-fb data-fb-ok hidden>…</p> ← solo si acertó
             <p data-repaso-fb data-fb-no hidden>…</p> ← solo si erró */
        var fbs = item.querySelectorAll('[data-repaso-fb]');
        var especifico = false;
        fbs.forEach(function (f) {
          var esOk = f.hasAttribute('data-fb-ok');
          var esNo = f.hasAttribute('data-fb-no');
          if (!esOk && !esNo) return;
          var mostrar = acerto ? esOk : esNo;
          f.hidden = !mostrar;
          if (mostrar) especifico = true;
        });
        /* El genérico solo aparece si no hubo uno específico para este
           resultado: si no, se leen los dos (y el narrador los lee los
           dos, §7.21 F1). */
        fbs.forEach(function (f) {
          if (f.hasAttribute('data-fb-ok') || f.hasAttribute('data-fb-no')) return;
          f.hidden = especifico;
        });
        var fb = especifico ? null : item.querySelector('[data-repaso-fb]:not([data-fb-ok]):not([data-fb-no])');
        if (fb) fb.hidden = false;
        item.querySelectorAll('[data-repaso-ans]').forEach(function (b) { b.disabled = true; });

        /* ---- CUÁL ERA LA CORRECTA ----
           kit-base v1.9.81, relayado desde el primer simulador (y antes
           desde otros cursos, que lo venían resolviendo cada uno por su
           cuenta con un MutationObserver propio).

           Hasta acá el kit marcaba la opción ELEGIDA —verde si acertó,
           roja si no— y apagaba las demás, pero cuando el alumno erraba
           NUNCA señalaba cuál era la buena: se quedaba sabiendo que se
           equivocó y nada más. Un repaso que no muestra la respuesta no
           enseña.

           Cuál es: la que su `data-repaso-ans` coincide con el
           `data-repaso-ok` del ítem. Se lee del marcado en vez de
           asumir "true", así sirve igual si una pregunta tiene la
           correcta del otro lado. */
        if (!acerto) {
          var esperada = item.getAttribute('data-repaso-ok');
          var buena = item.querySelector('[data-repaso-ans="' + esperada + '"]');
          if (buena) buena.classList.add('es-la-correcta');
        }

        /* ---- Y QUE SE ESCUCHE ----
           La devolución aparecía en pantalla y no se decía. Para el
           alumno que hace el curso escuchando, errar una pregunta era
           silencio: veía cambiar colores y no sabía por qué.
           260ms: deja terminar la animación de la devolución antes de
           empezar a hablarla. Canal propio, para no pisar la narración
           de la diapositiva. */
        var leer = restaurando ? null : item.querySelector('[data-repaso-fb]:not([hidden])');
        if (leer && global.Narrador && global.Narrador.speak) {
          if (!global.Narrador.isNarrating || global.Narrador.isNarrating()) {
            setTimeout(function () { global.Narrador.speak(leer.textContent.trim(), 'repaso'); }, 260);
          }
        }
        panel.classList.toggle('is-complete', items.every(function (it) {
          return it.classList.contains('is-answered');
        }));
      }

      items.forEach(function (item, idx) {
        var ok = item.getAttribute('data-repaso-ok') === 'true';
        var id = item.getAttribute('data-repaso-id');
        /* Restaurar lo contestado en una sesión anterior: bien (`seen`) o
           MAL (`seenMal`, v1.9.118), marcando cuál eligió. No se vuelve
           a premiar ni a narrar. */
        var btnsItem = Array.prototype.slice.call(item.querySelectorAll('[data-repaso-ans]'));
        var malAntes = id ? seenMal(id) : null;
        if (id && seen(id)) {
          btnsItem.forEach(function (b) { if ((b.getAttribute('data-repaso-ans') === 'true') === ok) b.setAttribute('data-chosen', ''); });
          resolver(item, true, true);
        } else if (malAntes) {
          /* `seenMal` devuelve el valor del botón que eligió ('true'/'false').
             Si devuelve otra cosa (un `true` suelto de un curso que solo
             guardaba "la erró"), se marca el botón que no es el correcto. */
          var porValor = btnsItem.filter(function (b) { return b.getAttribute('data-repaso-ans') === String(malAntes); });
          (porValor.length ? porValor : btnsItem.filter(function (b) { return (b.getAttribute('data-repaso-ans') === 'true') !== ok; }))
            .slice(0, 1).forEach(function (b) { b.setAttribute('data-chosen', ''); });
          resolver(item, false, true);
        }
        btnsItem.forEach(function (b) {
          b.addEventListener('click', function () {
            if (item.classList.contains('is-answered')) return;
            var eligio = b.getAttribute('data-repaso-ans') === 'true';
            var acerto = eligio === ok;
            b.setAttribute('data-chosen', '');
            resolver(item, acerto);
            if (acerto && id && !seen(id)) {
              mark(id);
              if (opts.onCorrect) opts.onCorrect(id);
            }
            if (!acerto && id) markMal(id, b.getAttribute('data-repaso-ans'));
            onAnswer(id, acerto, b.getAttribute('data-repaso-ans'));
            document.dispatchEvent(new Event('gatechange'));   // por si la diapositiva lo exige (abajo)
          });
        });
        var next = item.querySelector('[data-repaso-next]');
        if (next) next.addEventListener('click', function () { mostrar(idx + 1); });
      });

      /* Al entrar, la PRIMERA SIN CONTESTAR (v1.9.118): quien vuelve con
         la 1 resuelta no tiene que pasar por ella para llegar a la 2. */
      var primera = items.findIndex(function (it) { return !it.classList.contains('is-answered'); });
      mostrar(primera < 0 ? 0 : primera, true);

      /* ---- Candado opcional: `bloqueada(panel)` (kit-base v1.9.122, §7.71) ----
         Dos cursos lo escribieron a mano: NOA (el repaso se abre recién
         con los videos de la unidad vistos) y cardio (la tira aparece con
         el video visto). Y el de NOA tenía el bug que esto evita: al
         desbloquear destapaba TODAS las preguntas, deshaciendo el `hidden`
         por pregunta del kit, y la voz podía leer la 2 antes de tiempo.
         Acá, bloqueada: ninguna pregunta visible ni narrable, flechas
         ocultas, y el texto de `data-candado` (o uno por defecto) en su
         lugar. Desbloqueada: SOLO la actual. Se reevalúa en cada
         `gatechange` y `slidechange` —lo que suele destrabarlo es ver un
         video o una ficha— y con `refrescarCandado()`. */
      if (typeof opts.bloqueada === 'function') {
        if (!panel.hasAttribute('data-candado')) panel.setAttribute('data-candado', '🔒 Se habilita al terminar lo de esta parte.');
        var candado = function () {
          var b = !!opts.bloqueada(panel);
          panel.classList.toggle('is-bloqueada', b);
          items.forEach(function (it, n) { it.hidden = b || n !== actual; });
        };
        candados.push(candado);
        candado();
      }
    });
    if (candados.length && !candadosEnganchados) {
      candadosEnganchados = true;
      var todos = function () { candados.forEach(function (c) { c(); }); };
      document.addEventListener('gatechange', todos);
      document.addEventListener('slidechange', todos);
    }

    /* ---- Gate opcional: `data-require-repaso` (kit-base v1.9.121, §7.70) ----
       El repaso es refuerzo sin gate, salvo que la DIAPOSITIVA lo pida con
       `data-require-repaso`: ahí "Siguiente" espera a que se contesten sus
       preguntas. Pide PARTICIPAR, no acertar —una respuesta mala no puede
       trabar el curso para siempre— y una errada de otra sesión cuenta como
       contestada. Lo pidió cardio (A4): su cliente quería una pregunta por
       factor, y "Siguiente" recién al responder; lo tenía escrito a mano
       (`initRepasoFactor` + `faltaRepaso`). Mismo contrato que los demás
       gates: va a `canAdvance` y a `initGateHints`. */
    return {
      refrescarCandado: function () { candados.forEach(function (c) { c(); }); },
      faltan: function (slideEl) {
        if (!slideEl || !slideEl.hasAttribute || !slideEl.hasAttribute('data-require-repaso')) return [];
        return Array.prototype.slice.call(slideEl.querySelectorAll('[data-repaso-item]'))
          .filter(function (it) { return !it.classList.contains('is-answered'); })
          .map(function (it, k) { return it.getAttribute('data-repaso-id') || ('pregunta-' + (k + 1)); });
      }
    };
  }

  /* ---- datosDelCurso(clave, porDefecto) — kit-base v1.9.113 (Fase 1) ----
     Un curso armado desde `curso.json` (tools/armar-curso.mjs) trae su
     contenido no-marcado —el banco de la mini práctica, los logros, las
     medallas— en un bloque `<script type="application/json"
     id="d-curso-datos">` dentro del index. Esto lo lee:

       var QUIZ_BANK = datosDelCurso('practica', {}).banco;
       var BADGES    = datosDelCurso('logros', []);

     Sin el bloque (un curso hecho a mano), o sin esa clave, devuelve
     `porDefecto`: un curso puede pasar a datos de a una pieza. Se parsea
     una sola vez. Un JSON roto NO se traga en silencio: queda en consola,
     porque un curso sin banco de preguntas tiene que verse roto, no vacío. */
  var _datosCurso = null;
  function datosDelCurso(clave, porDefecto) {
    if (_datosCurso === null) {
      _datosCurso = {};
      var el = document.getElementById('d-curso-datos');
      if (el) {
        try { _datosCurso = JSON.parse(el.textContent) || {}; }
        catch (e) { if (global.console) console.error('[datosDelCurso] el bloque #d-curso-datos no es JSON válido:', e); }
      }
    }
    if (clave == null) return _datosCurso;
    return Object.prototype.hasOwnProperty.call(_datosCurso, clave) ? _datosCurso[clave] : porDefecto;
  }

  global.CotoUI = {
    initTiempoActivo: initTiempoActivo,
    tiempoActivoMs: tiempoActivoMs,
    initPopupNarration: initPopupNarration,
    initPopupStagger: initPopupStagger,
    staggerReveal: staggerReveal,
    countTo: countTo,
    initStatPopups: initStatPopups,
    initPrefetchNeighbors: initPrefetchNeighbors,
    initPopupPrefetch: initPopupPrefetch,
    initSummaryPrint: initSummaryPrint,
    initIndexJumps: initIndexJumps,
    initGlossarySearch: initGlossarySearch,
    initRepasoRapido: initRepasoRapido,
    initPopupGate: initPopupGate,
    initGateHints: initGateHints,
    initGlossaryUnlock: initGlossaryUnlock,
    tone: tone, sCorrect: sCorrect, sWrong: sWrong, sStreak: sStreak, sWin: sWin
  };
  // Alias sueltos, para que el curso.js las llame igual que antes.
  global.initRepasoRapido = initRepasoRapido;
  global.acomodarTirasSueltas = acomodarTirasSueltas;

  /* ============================================================
     initPrediccion() — una pregunta suelta ANTES de algo (kit-base v1.9.99)
     ------------------------------------------------------------
     ⚠️ ERA UNA PIEZA SIN CABLE. `coto-base-addendum-v1.8.css` §20 trae
     desde v1.8 el componente `.d-pred*` ("una predicción antes de un
     video, un chequeo rápido"), con sus estados de acierto y error, y
     el kit NUNCA tuvo el JS que lo hace andar ni un marcado documentado.
     "Seguridad alimentaria" necesitó justo eso ("Un momento, pensemos",
     antes del video del proceso de limpieza), se lo escribió a mano con
     otros nombres… y chocó con el `.d-pred-fb` del kit: el padding y el
     radio de la caja del kit se colaban en su párrafo y lo corrían. El
     cliente lo reportó como "desfasado, las cosas no se ven alineadas".
     Esta función es la lógica de ese curso, sobre el contrato de
     clases que el kit ya tenía.

     Sin nota ni puntos a propósito: es una pausa para pensar, no una
     evaluación (§3.11). Se contesta UNA vez; la devolución dice lo
     correcto en los dos casos, así que no hace falta "reintentar".

     Marcado (típicamente dentro de un pop-up abierto con
     `data-intro-popup` + `data-intro-once` en la diapositiva):
       <div class="d-pred" data-pred
            data-pred-fb-ok="Exacto: …"  data-pred-fb-no="No pasa nada, ahora lo vemos: …">
         <p class="d-pred-q">¿Qué creés que …?</p>
         <div class="d-pred-opts">
           <button type="button" class="d-pred-opt" data-pred-opt data-pred-ok>…</button>
           <button type="button" class="d-pred-opt" data-pred-opt>…</button>
         </div>
         <p class="d-pred-fb" data-pred-fb hidden></p>
         <button type="button" class="btn btn-cat" data-pred-continue data-popup-close hidden>Continuar</button>
       </div>
     Una opción puede traer su PROPIA devolución con `data-pred-fb="…"`,
     que gana sobre la general del bloque.

     Llamarla siempre: sin `[data-pred]` en el marcado no hace nada. */
  function initPrediccion() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-pred]'), function (bloque) {
      /* Idempotente: llamarla dos veces no ata dos veces el mismo bloque
         (el segundo listener volvería a narrar la devolución). */
      if (bloque.hasAttribute('data-pred-listo')) return;
      bloque.setAttribute('data-pred-listo', '');
      var opts = bloque.querySelectorAll('[data-pred-opt]');
      var fb = bloque.querySelector('[data-pred-fb]');
      var seguir = bloque.querySelector('[data-pred-continue]');
      if (!opts.length) return;
      if (fb) fb.setAttribute('aria-live', 'polite');
      var respondido = false;
      Array.prototype.forEach.call(opts, function (btn) {
        btn.addEventListener('click', function () {
          if (respondido) return;
          respondido = true;
          var v = btn.getAttribute('data-pred-ok');
          var ok = v !== null && v !== 'false';
          btn.classList.add(ok ? 'is-ok' : 'is-no');
          btn.setAttribute('aria-pressed', 'true');
          Array.prototype.forEach.call(opts, function (b) { b.disabled = true; });
          var texto = btn.getAttribute('data-pred-fb') ||
            bloque.getAttribute(ok ? 'data-pred-fb-ok' : 'data-pred-fb-no') || '';
          if (fb) {
            fb.textContent = texto;
            fb.classList.remove('is-ok', 'is-no');
            fb.classList.add(ok ? 'is-ok' : 'is-no');
            fb.hidden = !texto;
          }
          if (seguir) {
            seguir.hidden = false;
            /* El foco va al botón de seguir, salvo en iOS con pantalla
               completa (el cartel de Safari — ver `focoBloqueado`). */
            if (!(global.focoBloqueado && global.focoBloqueado())) seguir.focus();
          }
          if (texto && global.Narrador && global.Narrador.isNarrating()) global.Narrador.speak(texto, 'other');
        });
      });
    });
  }
  global.initPrediccion = initPrediccion;

  /* ============================================================
     initEntradaGenerica() — las diapositivas genéricas no entran muertas
     kit-base v1.9.99, subido de "Seguridad alimentaria"
     ------------------------------------------------------------
     Pedido del cliente: introducción, objetivos, índice y consejos son la
     misma captura plana en cualquier curso, sin piezas sueltas que
     escalonar (`staggerReveal` es para HTML real, nunca para una
     diapositiva-captura). Se anima la IMAGEN entera: aparece y sube un
     poco al entrar.
     El curso de origen lo ataba a una lista de ids escrita a mano; acá
     es declarativo: `data-entrada` en la `<section>`, que el generador
     ya pone en las genéricas que emite.
     ⚠️ Se re-dispara en CADA `slidechange` (quitar la clase, forzar un
     reflow, volver a ponerla): una animación CSS pura corre una sola vez,
     al cargar la página, y la diapositiva volvería a entrar quieta.
     Respeta `prefers-reduced-motion` (CSS en coto-shot-stage.css). */
  function initEntradaGenerica() {
    document.addEventListener('slidechange', function (e) {
      var id = e.detail && e.detail.id;
      var sl = id && document.querySelector('[data-slide="' + id + '"][data-entrada]');
      if (!sl) return;
      var img = sl.querySelector('.d-shot-img');
      if (!img) return;
      img.classList.remove('d-generic-enter');
      void img.offsetWidth;
      img.classList.add('d-generic-enter');
    });
  }
  global.initEntradaGenerica = initEntradaGenerica;
  global.initPopupGate = initPopupGate;
  global.initGateHints = initGateHints;
  global.initGlossarySearch = initGlossarySearch;
  global.initGlossaryUnlock = initGlossaryUnlock;
  global.initTiempoActivo = initTiempoActivo;
  global.tiempoActivoMs = tiempoActivoMs;
  global.initPopupNarration = initPopupNarration;
  global.initPopupStagger = initPopupStagger;
  global.staggerReveal = staggerReveal;
  global.countTo = countTo;
  global.initStatPopups = initStatPopups;
  global.initPrefetchNeighbors = initPrefetchNeighbors;
  global.initSummaryPrint = initSummaryPrint;
  global.initIndexJumps = initIndexJumps;
  global.initPopupPrefetch = initPopupPrefetch;
  global.datosDelCurso = datosDelCurso;
})(window);
