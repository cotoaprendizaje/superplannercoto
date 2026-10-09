/* ============================================================
   curso.js · PLANTILLA DE ARRANQUE (kit-base v1.9.40)
   ------------------------------------------------------------
   Este archivo es el ÚNICO que escribe cada curso — todo lo demás
   (motor, narrador, UI, media, hotspots, quiz, cierre) vive en los
   módulos genéricos del kit y NO SE TOCA (ver CLAUDE.md §1: "¿esto lee
   algo del curso?" — si la respuesta es sí, va acá; si es no, va en el
   archivo genérico correspondiente, nunca acá).

   Punto de partida documentado en README.md ("Con v1.7, un curso.js
   nuevo arranca así") — reemplazar cada bloque con el contenido real
   del curso siguiendo el checklist de CLAUDE.md §7:
     1. PDF → render de cada página
     2. Decidir, diapositiva por diapositiva: captura íntegra
        (.d-shot-slide) vs. piezas HTML reales (texto vivo + arte suelto)
     3. Armar el HTML (index.html) sobre esa decisión
     4. Medir hitboxes en píxeles contra el render (nunca a ojo)
     5. Escribir ESTE archivo: vocabulario propio para la locución,
        banco de datos del curso (quiz/minijuego si aplica), cableado
        de los módulos del kit con los datos/callbacks de este curso
     6. CSS propio del curso en diapositivas.css (nunca en los .css
        del kit) + assets.css si hace falta
     7. imsmanifest.xml con la lista real de archivos
     8. Antes de entregar: correr tools/tests/*.mjs (los 72, exit 0 en
        todos) y tools/verify-hitboxes.mjs para inspección visual
   ============================================================ */
(function () {
  'use strict';

  var COURSE_SLUG = 'nombre-del-curso';
  var COURSE_NAME = 'Nombre del curso';

  /* ---------- Vocabulario propio para la locución ----------
     El diccionario base del kit ya trae la tabla oficial del Manual de
     Contenido (PLU, ticket, online...). Acá solo lo específico de ESTE
     curso — siglas, nombres propios, números que se leen distinto. */
  if (window.Narrador && Narrador.addFixes) {
    Narrador.addFixes([
      // ['SIGLA', 'cómo se lee'],
    ]);
  }

  /* La locución arranca por el TÍTULO de la diapositiva (la línea de
     cardio, kit-base v1.9.133): sin esto, quien escucha entra a mitad de
     una explicación sin saber de qué le hablan (`narracion-titulos`). El
     kit no lo hace por default por un cliente anterior que pidió "solo el
     contenido explícito"; un curso así lo apaga acá. */
  if (window.Narrador && Narrador.setNarrateTitles) Narrador.setNarrateTitles(true);

  /* ---------- Estado propio del curso (si aplica) ----------
     Ej.: banco de preguntas del quiz, situaciones del minijuego, qué
     fichas se abrieron — solo si el curso tiene ese contenido.
     Los PUNTOS y los LOGROS ya NO van acá: los maneja `initLogros()`
     (coto-logros.js), más abajo. */
  /* `repaso` y `repasoMal` (kit-base v1.9.124, §7.73): las respuestas
     del repaso rápido, ACERTADAS y ERRADAS. Las dos se guardan —ver el
     bloque de `initRepasoRapido` más abajo—. Si el curso no tiene
     repaso quedan vacías y no ocupan lugar en suspend_data. */
  /* `popups`, `videos`, `quiz` y `quizIntentos` (kit-base v1.9.133): lo
     que leen los gates de la receta y el resumen del cierre. */
  var estado = { vistas: {}, repaso: {}, repasoMal: {}, popups: {}, videos: {}, quiz: null, quizIntentos: 0 };

  /* ---------- Catálogo de logros (CONTENIDO del curso) ----------
     La única parte de los logros que es propia de cada curso: cuáles
     hay y cómo se llaman. Todo el resto (puntaje, HUD, tarjetas,
     toast, sonido, moneda, xAPI) lo hace `initLogros()` — kit-base
     v1.9.60, §7.08.
       id    · clave corta y estable: viaja en suspend_data (4096
               caracteres contados en SCORM 1.2), así que 'explorador',
               no 'el-alumno-abrio-todas-las-fichas'.
       ic    · emoji de la tarjeta obtenida (bloqueada muestra 🔒).
       txt   · qué logró, en pasado, una vez obtenido.
       pista · qué hay que hacer, mientras sigue bloqueado.
     El catálogo va en `curso.json` → `logros` (Fase 1, kit v1.9.113): el
     armador lo pone en el index y esto lo lee. Ejemplo de una entrada:
       { "id": "explorador", "nom": "Explorador", "ic": "🔎",
         "txt": "Abriste todas las fichas del curso.",
         "pista": "Abrí todas las fichas para desbloquearlo." } */
  var BADGES = window.datosDelCurso ? datosDelCurso('logros', []) : [];
  var Logros = null;   // lo crea boot(), cuando el DOM ya existe

  /* Puntos y logros viajan en las claves `p` y `b` — las MISMAS que ya
     usaban los cursos anteriores, así un curso que migre a este módulo
     sigue leyendo el suspend_data que ya tenía guardado. El curso suma
     sus propias claves al lado; `serialize()`/`restore()` son los dos
     únicos puntos de contacto (no escribir `p`/`b` a mano acá). */
  function persistir() {
    if (!window.SCORM || !Logros) return;
    var guardar = { vs: Object.keys(estado.vistas) };
    if (Object.keys(estado.repaso).length) guardar.rp = Object.keys(estado.repaso);
    if (Object.keys(estado.repasoMal).length) guardar.rm = estado.repasoMal;   // { id: lo que eligió }
    if (Object.keys(estado.popups).length) guardar.pp = Object.keys(estado.popups);
    if (Object.keys(estado.videos).length) guardar.vv = Object.keys(estado.videos);
    if (estado.quiz) { guardar.qz = estado.quiz; guardar.qi = estado.quizIntentos; }
    SCORM.saveState(Object.assign(guardar, Logros.serialize()));
  }
  function restaurar() {
    if (!window.SCORM) return;
    var s = SCORM.loadState();
    if (!s) return;
    (s.vs || []).forEach(function (id) { estado.vistas[id] = true; });
    (s.rp || []).forEach(function (id) { estado.repaso[id] = true; });
    if (s.rm && typeof s.rm === 'object') Object.keys(s.rm).forEach(function (id) { estado.repasoMal[id] = s.rm[id]; });
    (s.pp || []).forEach(function (id) { estado.popups[id] = true; });
    (s.vv || []).forEach(function (src) { estado.videos[src] = true; });
    if (s.qz) { estado.quiz = s.qz; estado.quizIntentos = s.qi || 1; }
    if (Logros) Logros.restore(s);
  }

  /* ---------- Arranque ---------- */
  function boot() {
    if (window.SCORM) SCORM.init();

    /* ---------- Tracking mínimo del LMS — NO comentar ni borrar ----------
       kit-base v1.9.52. Estas dos líneas son EXACTAMENTE lo que
       `tools/tests/scorm-tracking.mjs` le exige a cualquier curso, y
       hasta esta versión la plantilla no las traía: un curso arrancado
       desde acá fallaba ese test recién salido del molde, y si nadie lo
       corría (el test ni siquiera entraba a la suite hasta v1.9.39 —
       §6.60) se reproducía el PEOR bug que tuvo este kit: §6.24, el
       alumno termina el curso entero y en el LMS queda "incomplete"
       para siempre. O sea: el curso no sirve para lo que el cliente
       paga, y nada en pantalla lo delata.

       · `courseend` lo emite el motor al llegar a la diapositiva
         `[data-slide-end]`. El motor NO habla con el LMS a propósito
         (spec-motor-slides.md §4): solo avisa, y alguien tiene que
         escucharlo. Ese alguien es este archivo.
       · `setLocation` en cada `slidechange` es lo que después lee
         `initResume()` (el banner "retomá donde dejaste", coto-player.js)
         al reabrir el curso: sin esto `getLocation()` vuelve siempre
         vacío y el banner no aparece nunca, por más marcado que tenga.

       Se registran ANTES de `new Motor(document)` a propósito: el
       constructor del motor emite su primer `slidechange` adentro (el
       `go()` del final de `_init()`), así que un listener registrado
       después se pierde esa primera diapositiva.

       Si el curso ya lleva su propio `slidechange` (para `estado.vistas`,
       glosario, puntos), se puede mover `setLocation` ahí adentro — lo
       que NO se puede es sacarlo. */
    document.addEventListener('slidechange', function (e) {
      if (window.SCORM) SCORM.setLocation(e.detail.id);
    });
    document.addEventListener('courseend', function () {
      if (window.SCORM) SCORM.markCompleted();
    });

    window.motor = new Motor(document);

    /* Puntos y logros (coto-logros.js, kit-base v1.9.60). Va DESPUÉS
       del motor y ANTES de `restaurar()`: `initLogros()` pinta el HUD
       en 0/N al crearse, y `restaurar()` lo repinta con lo guardado.
       `onChange` se dispara en cada `award()`/`unlock()`, así el
       progreso se guarda solo — antes cada curso tenía que acordarse
       de llamar a `persistir()` después de cada suma, y olvidárselo en
       UN lugar significa que el alumno pierde esos puntos al reabrir. */
    /* `medallas` (v1.9.125): con ellas el panel "Mis logros:" muestra la
       medalla, los puntos y la barra. Sin `medallas` en curso.json, el kit
       las calcula del máximo declarado (`data-puntaje-max`): plata al 85%,
       oro = máximo + 2 logros. */
    Logros = initLogros({ badges: BADGES, medallas: window.datosDelCurso ? datosDelCurso('medallas', null) : null, onChange: persistir });
    restaurar();

    /* `initPlayer()` además publica `window.Player` (kit-base v1.9.62),
       así que esta variable local es una comodidad para escribir
       `Player.toast(...)` acá adentro, no la única forma de llegarle.
       Importa porque los módulos del kit que avisan cosas —
       `coto-logros.js` y sus toasts de "+N ·" y "🏆 Logro:"— lo buscan
       en `window`: cuando solo existía esta variable local del IIFE,
       esos avisos no salían nunca y sin un solo error en consola. */
    var Player = initPlayer({
      speakSlide: function (s) { Narrador.speak(Narrador.textOf(s), 'slide'); },
      visitedIndexes: function () { return []; /* índices ya vistos, para la barra */ }
    });

    initPopupNarration();
    initPopupStagger();
    initStatPopups();
    initPrefetchNeighbors();
    initSummaryPrint();
    initTiempoActivo();    // reloj del resumen: descuenta lo que dura mirar video (§6.10.4)
    initVideoSafetyNet();  // pausa cualquier <video> que quede sonando fuera de su diapo/pop-up/capa —
                            // seguro llamarlo siempre, no hace nada si no hay <video> en el DOM (§6.59)
    initEntradaGenerica(); // anima la entrada de las diapos con `data-entrada` (coto-ui.js)
    initPrediccion();      // pregunta suelta antes de un video (`[data-pred]`, coto-ui.js);
                            // sin ese marcado no hace nada

    /* ---------- La receta, cableada de fábrica (kit-base v1.9.133) ----------
       Lo que `curso.json` declara con la receta del manual (§3, "La
       receta") ya funciona sin escribir nada acá: fichas que traban
       (`requisitos.popups`), videos que traban (`requisitos.visto`), la
       tira de repaso (`data-require-repaso`), la mini práctica
       (`"tipo": "practica"` + `practica` en curso.json) y el cierre
       (`"tipo": "cierre"`). Hasta v1.9.132 todo esto venía COMENTADO: un
       curso nuevo armado como cardio no trababa nada, la práctica no
       aparecía y el cierre quedaba en blanco hasta escribir ~150 líneas
       copiadas de `curso-prueba/js/curso.js`. Cada pieza degrada sola si
       el curso no la usa (sin `[data-quiz]`, sin `[data-require-seen]`,
       sin `.d-repaso`, no hace nada).
       Lo PROPIO del curso (una pieza a medida, un logro de unidad) se
       suma abajo; `motor.canAdvance` y los avisos se extienden, no se
       reescriben. */

    // Fichas: `data-require-popups` (lo escribe `requisitos.popups`).
    var popupGate = initPopupGate({
      seen: function (id) { return !!estado.popups[id]; },
      markSeen: function (id) { estado.popups[id] = true; persistir(); }
    });

    // Videos: los tres patrones (pop-up, de fondo, en círculo) marcan el
    // MISMO registro que lee el gate (`data-require-seen`, `requisitos.visto`).
    var vistoOpts = {
      seen: function (src) { return !!estado.videos[src]; },
      markSeen: function (src) {
        if (estado.videos[src]) return;
        estado.videos[src] = true;
        Logros.award(5, 'video visto');
        persistir();
        if (window.motor) window.motor._syncNav();
      }
    };
    /* El reproductor del pop-up de video (`#d-video-player`) viene en el
       chrome de TODO curso, así que se inicializa siempre (kit-base
       v1.9.116): sin esto, `montarControles()` nunca corre y
       `reproductor-video` lo marca en rojo. */
    initVideoPlayer(vistoOpts);
    initBgVideos();
    initInlineCircleVideos(vistoOpts);
    var videoGate = initVideoGate(vistoOpts);

    // Pestañas o estados de una lámina (`atributosShot` con `data-shot-swap`).
    initShotSwap();

    /* Repaso rápido (coto-repaso.css + coto-ui.js): refuerzo, no
       evaluación. Traba solo si la diapositiva lleva
       `data-require-repaso`, y pide CONTESTAR, no acertar. Las ERRADAS
       también se guardan (`seenMal`/`markMal`, §7.73): sin eso, al
       retomar la pregunta vuelve en blanco y un logro que pida "el repaso
       de la unidad" queda imposible. */
    var repasoGate = initRepasoRapido({
      seen: function (id) { return !!estado.repaso[id]; },
      markSeen: function (id) { estado.repaso[id] = true; persistir(); },
      seenMal: function (id) { return estado.repasoMal[id] || null; },
      markMal: function (id, eligio) { estado.repasoMal[id] = eligio; persistir(); },
      onCorrect: function () { Logros.award(5, 'Repaso'); }
    });

    /* Cierre (coto-cierre.js): el resumen, la medalla y los cuatro
       números de `numeros` en curso.json. Se crea ANTES que la práctica
       porque terminarla es lo que lo desbloquea. */
    function llenarResumen() {
      if (window.pintarMedalla) pintarMedalla(Logros.puntos(), window.datosDelCurso ? datosDelCurso('medallas', null) : null);
      var nombre = window.SCORM && SCORM.getFirstName && SCORM.getFirstName();
      var hueco = document.getElementById('d-cert-name');
      if (hueco && nombre) { hueco.textContent = nombre; hueco.parentElement.hidden = false; }
      var poner = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };
      poner('d-cert-score', estado.quiz ? (estado.quiz.best + '/' + (estado.quiz.total || 3)) : '–');
      poner('d-cert-points', String(Logros.puntos()));
      poner('d-cert-badges', Logros.obtenidos() + '/' + BADGES.length);
      poner('d-cert-tries', String(estado.quizIntentos || 1));
    }
    var Cierre = initCierreCelebration({
      statIds: ['d-cert-score', 'd-cert-points', 'd-cert-badges', 'd-cert-tries'],
      onUnlock: llenarResumen,
      onFinish: function () {
        llenarResumen();
        if (window.XAPI) XAPI.completed(COURSE_SLUG, COURSE_NAME);
        if (window.SCORM) SCORM.markCompleted();
      },
      onExit: function () { if (window.XAPI) XAPI.completed(COURSE_SLUG, COURSE_NAME); },
      stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); }
    });

    /* Mini práctica (coto-quiz.js): el banco va en curso.json →
       `practica` (banco, porIntento, mensajes). Devuelve su gate: SI EL
       CURSO TIENE PRÁCTICA ESTE GATE NO ES OPCIONAL — sin él, "Siguiente"
       pasa de largo y el alumno llega a un cierre con candado y sin
       salida (lo reportó el cliente en cardio; `practica-gate.mjs`).
       "Repasar en …" va solo a la diapositiva o al pop-up de `related`.
       `introPopup` abre el aviso "esto no es la evaluación" al entrar,
       mientras no esté hecha (lo emite `"tipo": "practica"`). */
    var PRACTICA = window.datosDelCurso ? datosDelCurso('practica', {}) : {};
    /* Sin `coto-quiz.js` en la página (un curso `--tipo simulador`, que
       no tiene práctica) el gate queda vacío y el cierre, abierto. */
    var practicaGate = !window.initMiniQuiz
      ? { faltan: function () { return []; }, completa: function () { return true; } }
      : initMiniQuiz({
        bank: PRACTICA.banco || [],
        size: PRACTICA.porIntento,
        happyMessages: (PRACTICA.mensajes || {}).bien,
        hotMessages: (PRACTICA.mensajes || {}).racha,
        oopsMessages: (PRACTICA.mensajes || {}).error,
        introPopup: document.querySelector('[data-popup="practica-intro"]') ? 'practica-intro' : null,
        getState: function () { return estado.quiz || null; },
        setState: function (q, intentos) { estado.quiz = q; estado.quizIntentos = intentos; persistir(); },
        onAnswer: function (correcta, racha) {
          if (!window.CotoUI) return;
          if (correcta) {
            if (CotoUI.sCorrect) CotoUI.sCorrect();
            if (racha >= 3) { Logros.award(10, 'racha x' + racha); if (CotoUI.sStreak) CotoUI.sStreak(); }
          } else if (CotoUI.sWrong) CotoUI.sWrong();
        },
        onFirstFinish: function () { Logros.award(20, 'práctica completada'); },
        onFinish: function () {
          Cierre.unlockCierre();
          if (window.motor) window.motor._syncNav();
        },
        narrate: function (el) { Narrador.speak(Narrador.textOf(el), 'slide'); },
        track: function (id, pregunta, correcta, respuesta) {
          if (window.XAPI) XAPI.answered(id, pregunta, correcta, respuesta);
        },
        stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); }
      });
    /* Práctica hecha (de otra sesión) o curso SIN práctica: el cierre
       arranca abierto. `completa()` da true cuando no hay `[data-quiz]`. */
    if (practicaGate.completa()) Cierre.unlockCierre();

    /* Los gates, en el orden en que se ven en pantalla: primero las
       fichas, después el video, el repaso y la práctica. `initGateHints`
       hace que no sean mudos: "Siguiente" tiembla, pulsa lo que falta y
       un toast dice cuántos quedan. Un gate propio del curso se suma acá
       (mismo contrato `faltan(slideEl)`). */
    var gates = [
      { gate: popupGate, sel: function (id) { return '[data-popup-trigger="' + id + '"]'; }, uno: 'tarjeta', varias: 'tarjetas' },
      { gate: videoGate, sel: function (src) { return '[data-video="' + src + '"]'; },
        aviso: function () { return 'Mirá el video antes de seguir.'; } },
      { gate: repasoGate, sel: function () { return '.d-repaso'; },
        aviso: function () { return 'Respondé el repaso rápido antes de seguir.'; } },
      { gate: practicaGate, sel: function () { return '[data-quiz]'; },
        aviso: function () { return 'Completá la mini práctica antes de seguir.'; } }
    ];
    motor.canAdvance = function (slideEl) {
      return gates.every(function (g) { return !g.gate.faltan(slideEl).length; });
    };
    initGateHints({ gates: gates });

    /* ⚠️ Los DOS de acá abajo DEVUELVEN una función `refresh` y hay que
       GUARDARLA (kit-base v1.9.72, §7.18 K5). Corren una vez al crearse
       y después no se enteran de nada: si no los volvés a llamar cuando
       el progreso cambia, se quedan congelados en el estado del arranque
       — el glosario con todos los términos bajo candado para siempre, y
       el índice sin habilitar nunca lo ya visitado. Sin ningún error:
       un curso terminado, con la medalla de oro, y los 8 términos
       todavía bloqueados. Pasó de verdad.
       Por eso van con `var` y con la llamada de refresco a la vista. */

    /* ⚠️ ESTE BLOQUE VA SIN COMENTAR, a diferencia de casi todo lo
       demás de esta plantilla (kit-base v1.9.84). El motivo: el
       generador emite el marcado de las tres piezas en TODO curso —el
       índice lateral con sus `.d-sidenav-item`, el
       `<p id="d-sidenav-progress">` y el pop-up de glosario con su
       buscador—, así que dejarlas comentadas significaba entregar un
       curso con la línea de progreso vacía para siempre, los tildes que
       no aparecen nunca y un buscador de glosario que no filtra, sin un
       solo error en consola. Es la misma forma de §7.17 y §7.18 K4 un
       nivel más arriba: no era que faltara el cable adentro de la
       pieza, era que nadie llamaba a la pieza.
       Todas degradan solas si el curso no tiene esa parte: sin
       `[data-popup="glosario"]` el unlock devuelve un no-op, y sin
       términos no hay nada que bloquear. */

    // Índice ☰: secciones no visitadas quedan disabled — sin esto, el
    // menú lateral deja saltar directo al cierre sin cumplir el gate (§7.3 punto 3).
    var refrescarIndice = initIndexJumps({ visited: function (id) { return !!estado.vistas[id]; } });

    /* "Ver en el curso" del panel de Recursos: MISMO gate que el índice
       (kit-base v1.9.86). Sin esta llamada, Recursos sería el atajo que
       saltea las diapositivas —y los gates— del medio: el alumno abre
       el cajón, toca "Ver en el curso" del último documento y aparece
       pasado el gate, sin haber cumplido nada.

       Se llama siempre, aunque el curso no tenga recursos: sin ningún
       `.d-recurso-ir` en el DOM no hace nada, y así no queda un cable
       que haya que acordarse de enchufar el día que se agregue el
       primer documento. */
    var refrescarRecursos = initIndexJumps({
      selector: '.d-recurso-ir',
      visited: function (id) { return !!estado.vistas[id]; }
    });

    // Glosario (el buscador filtra por texto ignorando mayúsculas y acentos;
    // el unlock deja bajo candado los términos de diapositivas no visitadas).
    initGlossarySearch();
    var refrescarGlosario = initGlossaryUnlock({
      seen: function (id) { return !!estado.vistas[id]; },
      onUnlock: function (labels) { Player.toast('🔓 Desbloqueaste ' + labels.join(', ')); }
    });

    // …y en cada cambio de diapositiva, DESPUÉS de marcar la visita.
    // Los dos `refrescar*` corren una vez al crearse y no se enteran de
    // nada después: sin esta llamada se congelan en el estado del
    // arranque (ver el aviso de arriba).
    document.addEventListener('slidechange', function (e) {
      estado.vistas[e.detail.id] = 1;
      if (refrescarIndice) refrescarIndice();
      if (refrescarGlosario) refrescarGlosario();
      if (refrescarRecursos) refrescarRecursos();
    });
    /* Y la diapositiva en la que ya estamos, a mano: este listener se
       registra DESPUÉS de `new Motor(document)`, y el primer
       `slidechange` lo emite el constructor del motor — o sea que la
       portada nunca se marcaría y el índice arrancaría diciendo "0 de
       N" con el alumno parado en la 1. Es el mismo detalle que el
       aviso de más arriba, y se paga acá en vez de mover el listener
       porque estos refrescos necesitan `refrescarIndice`, que se crea
       después del motor. */
    (function () {
      var actual = window.motor && window.motor.current();
      if (!actual) return;
      estado.vistas[actual.getAttribute('data-slide')] = 1;
      if (refrescarIndice) refrescarIndice();
      if (refrescarGlosario) refrescarGlosario();
      if (refrescarRecursos) refrescarRecursos();
    }());

    /* ============================================================
       PIEZAS DE `coto-piezas.js` y `coto-visor.js` (kit-base v1.9.77 y
       v1.9.78). Están acá para que existan a la vista: un módulo del
       kit que no aparece en esta plantilla es un módulo que el curso
       nuevo no sabe que existe, y lo termina reescribiendo a mano.
       Si escribís el marcado y te olvidás del `init`, `contrato-cableado`
       lo reporta con la consecuencia — no falla en silencio.
       ============================================================ */

    // Revelado ACUMULATIVO (el punto N aparece y los anteriores quedan):
    //   <button data-hit data-revelar="1" …><span class="sr-only">…</span></button>
    //   <div data-place data-revelado="1" hidden>…</div>
    // var Revelados = initRevelados({
    //   onRevelar: function (id, n, total) { Logros.award(5, 'Punto ' + id); }
    // });
    // …y para que sea un gate de avance, como cualquier otro del kit:
    //   motor.canAdvance = function (s) { return !Revelados.faltan(s).length; };

    // Dos juegos de carteles sobre el MISMO arte (no es initShotSwap):
    //   <div data-tandas="riesgos"><div data-tanda="1">…</div><div data-tanda="2" hidden>…</div></div>
    //   <button class="d-tanda-nav" data-tanda-nav="1">▶</button><span class="d-tanda-prog"></span>
    // initTandas({ onChange: function (id, i, total) { … } });

    // Visor de documentos: paginado, zoom, arrastre, pantalla completa
    // y descarga. Incluye el gate por "documento leído entero":
    // var Visor = initVisorDocs({ onPagina: function (id, i, leidas, total) { … } });
    //   …y el gate, con el mismo contrato que los demás:
    //   motor.canAdvance = function (s) { return !Visor.faltan(s).length; };

    // Pasar hojas del documento SIN abrir el pop-up (las flechas las
    // dibuja el arte). Tocar la hoja abre el visor en esa misma página:
    // initDocEnDiapo({ visor: Visor, hojas: { convenio: ['doc/c-1.webp', 'doc/c-2.webp'] } });

    // Panel de pasos al costado del repaso (lee el estado por
    // MutationObserver, así también refleja las flechas ‹ › y lo
    // restaurado de una sesión anterior):  <ol data-repaso-pasos></ol>
    // initPasosRepaso();

    // El "Siguiente" de la última pregunta del repaso, con todas
    // contestadas, lleva a la diapositiva siguiente:
    // initSalidaRepaso();

    /* ---- CURSO-SIMULADOR (CLAUDE.md §7.27) ----
       Solo si este curso es un simulador: el alumno recorre las
       pantallas reales de un sistema y resuelve el procedimiento ahí.
       Pide `js/escenario.js` (los DATOS) y el marcado de
       `simulador-boilerplate.html` (riel, hoja de ruta, pop-ups).
       El motor maneja pistas, reloj, derrota, gate y hoja de ruta;
       este archivo cablea QUÉ cuenta como error en cada pantalla y
       llama a `Sim.errar(...)` / `Sim.resolverPaso()`. */
    // var Sim = initSimulador({
    //   escenario: window.ESCENARIO,
    //   premiar: premiar,          // el guard persistido de este curso (§6.53)
    //   logros: Logros, player: Player, cierre: Cierre,
    //   onVariante: function (v) { /* pintar los datos del caso en pantalla */ },
    //   onReset: function () { /* limpiar las pantallas del curso */ },
    //   onGanar: function () { /* mostrar el resumen del procedimiento */ },
    //   onPerder: function (porque) { if (window.XAPI) XAPI.failed(COURSE_SLUG, porque); }
    // });

    // Video de una capa [data-layers]:
    // initLayerVideos({ … });
    // Precarga del contenido de un pop-up antes de abrirlo:
    // initPopupPrefetch();

    // Zonas interactivas sobre el arte (hotspots), una llamada por grupo:
    // initHotspots({ zonas: '.d-shot-hit--mi-grupo', cartel: '#mi-cartel' });

    // Video adentro de un pop-up propio (no el reproductor del chrome):
    // initPopupVideos({ onFirstPlay: function (src, popupId) { /* sumar puntos/logro */ } });

    /* Techo de "hasta dónde llegó" para la barra arrastrable.
       NO está comentado a propósito (kit-base v1.9.71, §7.17): estuvo
       comentado hasta v1.9.70 y el resultado eran dos fallas mudas en
       todo curso generado —
       1. `motor.maxVisited` quedaba `undefined`, y el motor solo dibuja
          `.d-progress-locked` cuando es un número: la trama de "todavía
          bloqueado" no es que se viera poco, es que el elemento no
          existía en el DOM.
       2. Al reingresar, arrastrar la barra hasta una diapositiva ya
          vista EN OTRA SESIÓN no funcionaba, porque el techo se
          calculaba solo con la sesión en curso.
       `restoreMaxVisited()` tolera `undefined` (primera visita), así
       que llamarlo siempre es seguro; `estado` sale del `loadState()`
       de más arriba. */
    motor.restoreMaxVisited(estado && estado.vistas);

    if (window.SCORM) SCORM.commit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
