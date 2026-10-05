/* ============================================================
   curso.js · Prevención cardiovascular — Área Servicio Médico (COTO)
   Migrado al kit-base v1.9.61 (estructura modular).
   ------------------------------------------------------------
   Este archivo es el ÚNICO propio del curso. Todo el mecanismo genérico
   —motor, narrador, chrome del reproductor, media, hotspots, quiz,
   cierre, logros— vive en los módulos `coto-*.js` del kit y NO se toca
   (CLAUDE.md §1: "¿esto lee algo del curso?" — si sí, va acá; si no, va
   en el módulo genérico).

   QUÉ DESAPARECIÓ DE ACÁ EN LA MIGRACIÓN (y a dónde se fue)
   ------------------------------------------------------------
   La versión anterior de este archivo tenía 1956 líneas porque
   reimplementaba a mano lo que el kit ya resuelve. Cada bloque que se
   borró tiene hoy un dueño único:
     · reloj de tiempo activo ............ initTiempoActivo()  coto-ui
     · textOf()/speakSlide() ............. Narrador.textOf()   narrador
     · saludo, sonido, locución, voz,
       velocidad, pantalla completa,
       barra arrastrable, toast, resume .. initPlayer()        coto-player
     · puntos, logros, HUD, tarjetas ..... initLogros()        coto-logros
     · swap de imagen de "Factores" ...... initShotSwap()      coto-media
     · videos de fondo / pop-up /
       circulares .......................  init*Videos()       coto-media
     · torta, barras, etapas ............. initHotspots()      coto-hotspots
     · mini práctica ..................... initMiniQuiz()      coto-quiz
     · cierre, confeti, medalla, count-up. initCierreCelebration()
                                                               coto-cierre
     · stagger, narración de pop-ups,
       números animados, precarga,
       imprimir resumen .................. init*()             coto-ui
   El comentario que la versión anterior dejó escrito ("se mantiene la
   implementación local hasta que un curso próximo migre de verdad a los
   módulos... momento en el que corresponde borrar esta copia") es
   exactamente esta migración: esas copias ya no están.

   LO QUE SIGUE ACÁ es solo contenido y reglas de ESTE curso: el
   vocabulario de la locución, el catálogo de logros, los textos de la
   torta/barras/etapas, las 6 diapositivas de la Unidad 2 con su
   predicción, el banco de la mini práctica, los umbrales de medalla y
   el gate de avance.
   ============================================================ */
(function () {
  'use strict';

  var COURSE_SLUG = 'prevencion-cardiovascular';
  var COURSE_NAME = 'Prevención cardiovascular';

  var TOTAL_FACTORES = ['hipertension', 'colesterol', 'diabetes', 'obesidad', 'sedentarismo', 'tabaco', 'alcohol'];

  /* ---------- Vocabulario propio para la locución ----------
     El diccionario base del kit ya trae la tabla oficial del Manual de
     Contenido. Acá solo las siglas de este curso. */
  if (window.Narrador && Narrador.addFixes) {
    Narrador.addFixes([
      [/\bENT\b/g, 'e ene te'],
      [/\bIMC\b/g, 'i eme ce'],
      [/\bOMS\b/g, 'o eme ese'],
      [/\bACV\b/g, 'a ce ve']
    ]);
  }

  /* Narrar el título de la diapositiva antes del cuerpo (opt-in del kit,
     v1.9.9x). Sin esto, 16 diapositivas arrancaban la locución en medio
     de una idea: el alumno oía el cuerpo sin saber de qué se habla. */
  if (window.Narrador && Narrador.setNarrateTitles) Narrador.setNarrateTitles(true);

  /* ---------- Catálogo de logros (CONTENIDO del curso) ----------
     Formato de `initLogros` (coto-logros.js): id corto y estable — viaja
     en suspend_data, que en SCORM 1.2 tiene 4096 caracteres contados. */
  var BADGES = datosDelCurso('logros', []);   // en curso.json (Fase 1, kit v1.9.113)

  var estado = {
    factoresExplorados: {},
    videosVistos: {},     // clave = src del video (mismo valor que data-require-seen)
    popupsVistos: {},
    predicciones: {},       // id de factor → repaso contestado BIEN
    prediccionesMal: {},    // id de factor → contestado MAL alguna vez
    vistas: {},
    quiz: null,           // { correct, total, best, done }
    quizAttempts: 0
  };

  var Logros = null;      // lo crea boot(), cuando el DOM ya existe
  var Player = null;
  var Cierre = null;
  var refrescarIndice = function () {};
  var refrescarRecursos = function () {};   // el gate del panel de Recursos
  var refrescarRepaso = function () {};     // muestra la tira de repaso ya ganada
  var refrescarGlosario = function () {};

  function toast(t) { if (Player) Player.toast(t); }

  /* ---------- Persistencia (SCORM suspend_data) ----------
     Claves CORTAS a propósito: `suspend_data` son 4096 caracteres
     contados en SCORM 1.2 y este curso guarda 5 conjuntos de ids. La
     versión anterior usaba nombres largos ('factoresExplorados',
     'videosVistos'...) y además una lista de videos vistos con el path
     completo de cada .mp4 — se leen igual al restaurar (ver abajo) para
     no perder el progreso de quien ya cursó, pero lo que se ESCRIBE de
     acá en adelante es la forma corta.
     `p` (puntos) y `b` (logros) las aporta Logros.serialize(): son las
     mismas claves que ya usaban los otros cursos del kit. */
  function persistir() {
    if (!window.SCORM || !Logros) return;
    SCORM.saveState(Object.assign({
      f: Object.keys(estado.factoresExplorados),
      v: Object.keys(estado.videosVistos),
      pv: Object.keys(estado.popupsVistos),
      pr: Object.keys(estado.predicciones),
      pm: Object.keys(estado.prediccionesMal),
      vs: Object.keys(estado.vistas),
      q: estado.quiz,
      qa: estado.quizAttempts
    }, Logros.serialize()));
  }

  function restaurar() {
    if (!window.SCORM) return;
    var s = SCORM.loadState();
    if (!s) return;
    /* Acepta las dos formas: la corta de hoy y la larga que escribía la
       versión pre-migración. Un alumno a mitad del curso no tiene que
       perder lo hecho porque cambiamos el formato. */
    function comoSet(corto, largo) {
      var out = {};
      if (Array.isArray(corto)) corto.forEach(function (k) { out[k] = true; });
      else if (largo && typeof largo === 'object') {
        Object.keys(largo).forEach(function (k) { if (largo[k]) out[k] = true; });
      }
      return out;
    }
    estado.factoresExplorados = comoSet(s.f, s.factoresExplorados);
    estado.videosVistos = comoSet(s.v, s.videosVistos);
    estado.popupsVistos = comoSet(s.pv, s.popupsVistos);
    estado.predicciones = comoSet(s.pr, s.predicciones);
    estado.prediccionesMal = comoSet(s.pm, s.prediccionesMal);
    estado.vistas = comoSet(s.vs, s.vistas);
    estado.quiz = s.q || s.quiz || null;
    estado.quizAttempts = s.qa || s.quizAttempts || 0;

    /* Puntos y logros: `Logros.restore()` entiende `{p, b}`. El formato
       viejo traía `puntos` (número) y `logros` (objeto {id:bool}), así
       que se traduce ANTES de pasárselo — no llamando a award()/unlock(),
       que además de sumar disparan la moneda voladora, el pulso del chip
       y el toast: festejar de nuevo, al reabrir, lo que el alumno ya
       había ganado en otra sesión.
       Solo se restauran ids de logro que sigan existiendo hoy: uno
       guardado de una versión anterior del curso no debe inflar el
       contador X/N ni quedar huérfano. */
    if (Logros) {
      var idsValidos = BADGES.map(function (b) { return b.id; });
      Logros.restore({
        p: s.p != null ? s.p : (s.puntos || 0),
        b: (Array.isArray(s.b) ? s.b : Object.keys(s.logros || {}).filter(function (id) {
          return s.logros[id];
        })).filter(function (id) { return idsValidos.indexOf(id) !== -1; })
      });
    }
  }

  /* ============================================================
     CONTENIDO · Unidad 1
     ============================================================ */

  /* Torta de "Fallecimiento por ENT en Argentina". Los textos son de
     este curso; el mecanismo (hover + foco + tap) lo pone initHotspots. */
  var PIE_INFO = {
    corazon: { pct: 40, name: 'Enfermedades del corazón',
      txt: 'El grupo que más muertes causa. Su mecanismo principal es la aterosclerosis, que vas a ver más adelante.' },
    diabetes: { pct: 35, name: 'Diabetes',
      txt: 'Glucosa elevada sostenida en el tiempo. Es además uno de los 7 factores de riesgo cardiovascular del curso.' },
    cancer: { pct: 25, name: 'Cáncer',
      txt: 'Comparte factores de riesgo con las enfermedades cardiovasculares: tabaco, alcohol, obesidad y sedentarismo.' }
  };

  /* Barras de "Las ENT en la región de las Américas". El gráfico ya
     muestra el número: lo que suma cada cartel es el SIGNIFICADO. */
  var BARRAS = {
    cardio: { name: 'Enfermedades cardiovasculares · 36,7%',
      txt: 'Causan más muertes que el cáncer y la diabetes juntos. Son el tipo de ENT del que se ocupa este curso.' },
    cancer: { name: 'Cáncer · 24,6%',
      txt: 'Comparte factores de riesgo con las cardiovasculares: tabaco, alcohol, obesidad y sedentarismo.' },
    diabetes: { name: 'Diabetes mellitus · 6,4%',
      txt: 'Además de las muertes propias, multiplica el riesgo cardiovascular: es el factor de riesgo más relevante.' },
    respiratorias: { name: 'Enfermedades respiratorias · 8,6%',
      txt: 'Su principal factor de riesgo evitable es el tabaco, uno de los 7 que vas a ver en la unidad 2.' },
    otras: { name: 'Otras ENT · 23,8%',
      txt: 'Agrupa al resto de las enfermedades no transmisibles, que no entran en las 4 categorías principales.' }
  };

  /* Las 4 etapas de la aterosclerosis. El texto va a un pop-up (no a un
     panel dentro de la diapositiva): estas capturas no tienen un hueco
     libre del tamaño que un texto de 2 líneas necesita — se probó y el
     cliente lo marcó como error de maquetación. */
  var ETAPAS = {
    '1': { name: 'Funciones normales',
      txt: 'La arteria está sana: la pared interna es lisa y la sangre circula sin obstáculos.',
      que: 'Es el punto de partida. Todo lo que viene después se puede evitar o frenar controlando los factores de riesgo.' },
    '2': { name: 'Disfunción endotelial',
      txt: 'La capa interna de la arteria pierde su funcionamiento normal y empieza a acumularse la placa.',
      que: 'Acá todavía no hay síntomas. Es la etapa en la que el colesterol elevado y la presión alta hacen su trabajo en silencio.' },
    '3': { name: 'Formación de placa',
      txt: 'La placa de colesterol crece y estrecha el paso de la sangre.',
      que: 'La arteria se angosta y el corazón tiene que esforzarse más. Si ocurre en las arterias del corazón, se lo llama enfermedad coronaria.' },
    '4': { name: 'Trombosis',
      txt: 'La placa obstruye por completo la arteria y corta el paso de la sangre.',
      que: 'Es el desenlace que se busca evitar: según dónde ocurra, puede ser un infarto o un ACV.' }
  };

  /* ============================================================
     CONTENIDO · Unidad 2 — las 6 diapositivas de factor
     ------------------------------------------------------------
     Las 6 tienen la misma estructura y esa repetición apaga la
     atención (planteo del cliente). Se suman 3 cosas, construidas
     desde acá para no repetir el mismo bloque 6 veces en el HTML:
       1. PREDICCIÓN antes del video — pop-up de 3 opciones la 1ª vez
          que se entra. Activar lo que alguien ya cree antes de
          corregirlo hace que el dato se retenga mucho más.
          ⚠️ Cada pregunta se responde con un dato que el curso YA dice.
          No se inventó ninguna estadística: para diabetes y tabaquismo
          el curso no da prevalencia, así que la pregunta es sobre otra
          cosa que sí afirma.
       2. PROGRESO de la unidad — 6 tildes en la banda libre de abajo
          (y 1095-1160 del render, medida barriendo píxeles).
       3. ILUSTRACIÓN VIVA — la ilustración grande era decorativa; al
          pasar el mouse / enfocar / tocar muestra un dato práctico.
     Las coordenadas están medidas una por una sobre el render de
     2520x1260 (las 6 ilustraciones son distintas). */
  var U2 = [
    { id: 'colesterol-alto', nombre: 'Colesterol alto', video: 'video/colesterol-alto.mp4',
      q: '¿Qué parte de la población argentina tiene el colesterol elevado?',
      opts: ['9%', '29%', '49%'], ok: 1,
      why: 'Casi 3 de cada 10 personas, y sin síntomas.' },
    { id: 'hipertension-arterial', nombre: 'Hipertensión arterial', video: 'video/hipertension-arterial.mp4',
      q: '¿Qué parte de la población argentina tiene hipertensión arterial?',
      opts: ['14%', '34%', '54%'], ok: 1,
      why: 'Más de 3 de cada 10. La llaman "la silenciosa".' },
    { id: 'diabetes-detalle', nombre: 'Diabetes', video: 'video/diabetes.mp4',
      /* Dos de las seis preguntas entraban en DOS renglones y por eso la
         tarjeta pedía 161px en una banda de 150 (notebook 1366x768) — y
         el cliente lo vio como scroll y opciones cortadas. Acortadas a
         un renglón sin perder el sentido; las otras cuatro ya entraban. */
      q: '¿Cuál es el factor de riesgo cardiovascular MÁS relevante?',
      opts: ['El colesterol alto', 'La diabetes', 'El sedentarismo'], ok: 1,
      why: 'La diabetes: daña corazón, vasos, ojos y riñones.' },
    { id: 'obesidad-detalle', nombre: 'Sobrepeso y obesidad', video: 'video/obesidad.mp4',
      q: '¿Qué parte de la población argentina tiene sobrepeso u obesidad?',
      opts: ['31,6%', '61,6%', '81,6%'], ok: 1,
      why: '6 de cada 10 personas: de los más extendidos.' },
    { id: 'sedentarismo-detalle', nombre: 'Sedentarismo', video: 'video/sedentarismo.mp4',
      q: '¿Qué parte de los adultos no llega al mínimo de actividad física?',
      opts: ['24,9%', '44,9%', '64,9%'], ok: 2,
      why: 'Casi 2 de cada 3. Mejor en bloques de 30 minutos.' },
    { id: 'tabaquismo-detalle', nombre: 'Tabaquismo', video: 'video/tabaquismo.mp4',
      q: 'Al dejar de fumar, ¿cuándo empieza a bajar el riesgo cardiovascular?',
      opts: ['De inmediato', 'Al año', 'Recién a los 10 años'], ok: 0,
      why: 'De inmediato, y sigue bajando. Nunca es tarde.' }
  ];

  function mezclar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Opciones de predicción mezcladas UNA vez por sesión, no en cada
     apertura: si cambiaran de orden entre visitas a la misma
     diapositiva sería más confuso que útil. */
  U2.forEach(function (f) {
    var orden = mezclar(f.opts.map(function (o, i) { return i; }));
    var okAntes = f.ok;
    f.opts = orden.map(function (i) { return f.opts[i]; });
    f.ok = orden.indexOf(okAntes);
  });

  /* ---------- Banco de la mini práctica ----------
     NO cuenta para la nota: la evaluación final es un cuestionario
     aparte en Moodle (CLAUDE.md §3.11). `initMiniQuiz` sortea `size`
     preguntas de acá y mezcla las opciones en cada intento. */
  var PRACTICA = datosDelCurso('practica', {});   // banco, preguntas por intento y mensajes: curso.json

  /* ---------- Premio final: umbrales de medalla ----------
     Salen del puntaje REAL alcanzable, no de números redondos:
       · 7 factores de riesgo ........ 7 x 5 =  35
       · 7 videos en pop-up .......... 7 x 5 =  35
       · 2 videos circulares ......... 2 x 5 =  10
       · 6 repasos acertados ......... 6 x 5 =  30
       · racha de 3 en la práctica ... 1 x 10 =  10
       · práctica completada ......... 1 x 20 =  20
                                       máximo = 140
     El avance está bloqueado hasta ver cada video e interactuar con
     cada factor, así que quien termina tiene 100 asegurados: los 40
     restantes salen de acertar los repasos y de la racha. Por eso el
     bronce arranca en el piso real y no en 0 — una medalla que se
     obtiene sin hacer nada no premia nada.
     La LÓGICA (medallaDe/pintarMedalla) vive en coto-cierre.js; acá
     quedan solo los umbrales, que sí son de este curso. */
  var MEDALLAS = datosDelCurso('medallas', []);   // los umbrales: curso.json

  /* ============================================================
     GATE DE AVANCE (regla de contenido de este curso)
     ------------------------------------------------------------
     Ninguna diapositiva con video, ni "Factores de riesgo" (sus 7
     pestañas), deja avanzar sin haber interactuado con TODO su
     contenido. `data-require-seen` y `data-require-popups` son el
     mecanismo GENÉRICO que lee el motor: cualquier diapositiva futura
     con esos atributos se suma sola, sin tocar este archivo.
     ============================================================ */
  /* ---------- Videos que no se pueden reproducir ----------
     Lo resuelve `initVideoGate()` del kit (coto-media.js, v1.9.62): un
     gate que exija "mirá el video" sobre un .mp4 ausente o roto deja el
     curso IMPOSIBLE de terminar, y durante casi todo el armado los .mp4
     son placeholders de 0 bytes (CLAUDE.md §3.9), así que no es
     hipotético. El módulo sondea cada src de `data-require-seen` con un
     `<video>` suelto — no mirando el `<video>` de la diapositiva, que
     solo existe en 2 de las 9 con gate (las de círculo) y daría un
     resultado incoherente entre patrones.
     `VideoGate` se crea en boot(); `seen`/`markSeen` lo enganchan al
     mismo registro que persiste el curso (`estado.videosVistos`). */
  var VideoGate = null;

  function faltanVideos(slideEl) {
    return VideoGate ? VideoGate.faltan(slideEl) : [];
  }
  function faltanPopups(slideEl) {
    var req = slideEl && slideEl.getAttribute('data-require-popups');
    if (!req) return [];
    return req.split(/\s+/).filter(Boolean).filter(function (id) { return !estado.popupsVistos[id]; });
  }
  function faltanFactores() {
    return TOTAL_FACTORES.filter(function (id) { return !estado.factoresExplorados[id]; });
  }
  /* ---- Gate por REPASO RÁPIDO ----
     Corrección del cliente: *"se puede avanzar con «Siguiente» sin haber
     respondido el repaso. El botón «Siguiente» debe habilitarse recién
     cuando se responde"*.
     Cambia una decisión de producto anterior —el repaso estaba pensado
     como refuerzo que no trababa— y se aplica solo a las 6 diapositivas
     de factor, que son las que tienen tira.
     Cuenta como respondida tanto la acertada como la fallada: el gate
     pide PARTICIPAR, no acertar. Si pidiera acertar, una respuesta mala
     dejaría el curso trabado para siempre.
     Va DESPUÉS del gate de video a propósito: la tira recién aparece
     cuando el video está visto, así que primero se pide el video y
     después el repaso, que es el orden en que se ven en pantalla. */
  function faltaRepaso(slideEl) {
    var id = slideEl && slideEl.getAttribute('data-slide');
    if (!id) return false;
    var esFactor = U2.some(function (f) { return f.id === id; });
    if (!esFactor) return false;
    if (faltanVideos(slideEl).length) return false;   // primero el video
    return !estado.predicciones[id] && !estado.prediccionesMal[id];
  }

  /* ---- Gate por MINI PRÁCTICA ----
     BUG REAL, el segundo camino al mismo cartel, y éste estaba desde
     antes: la diapositiva de la mini práctica NO trababa. Se pulsaba
     "Siguiente" sin contestar ninguna pregunta, se caminaba hasta el
     final y el cierre aparecía BLOQUEADO — "🔒 Hacé la mini práctica
     para desbloquear el cierre del curso" — con el botón del footer en
     "Fin" y sin ninguna forma de seguir. Un callejón sin salida: la
     única salida era volver atrás, y el cartel no lo dice.
     Reportado por el cliente con una foto de ese cartel: *"esto está
     apareciendo al final del curso, lo cual no debería ser así"*.
     REPRODUCIDO: `evaluacion → consejos` sin contestar nada, y el
     cierre con `unlocked` ausente y el candado a la vista.

     El cierre ya exigía la práctica; lo que faltaba era pedirla EN su
     diapositiva, que es donde el alumno puede hacer algo al respecto.
     Con esto el cartel del candado queda, en la práctica, inalcanzable
     navegando — sigue puesto para el reingreso con el progreso a medias,
     que es su caso legítimo.

     Se exige COMPLETARLA, no acertar: `estado.quiz.done` lo marca
     `registrar()` (coto-quiz) al contestar la última, sin mirar el
     puntaje. */
  function faltaPractica(slideEl) {
    if (!slideEl || !slideEl.querySelector('[data-quiz]')) return false;
    return !(estado.quiz && estado.quiz.done);
  }

  function bloqueada(slideEl) {
    if (!slideEl) return false;
    if (faltanPopups(slideEl).length) return true;
    if (slideEl.getAttribute('data-slide') === 'factores-riesgo' && faltanFactores().length) return true;
    if (faltanVideos(slideEl).length > 0) return true;
    if (faltaRepaso(slideEl)) return true;
    return faltaPractica(slideEl);
  }

  function nudge(el) {
    if (!el) return;
    el.classList.remove('d-nudge'); void el.offsetWidth; el.classList.add('d-nudge');
  }

  function initGates() {
    window.motor.canAdvance = function (slideEl) { return !bloqueada(slideEl); };

    document.addEventListener('popupopen', function (e) {
      if (estado.popupsVistos[e.detail.id]) return;
      estado.popupsVistos[e.detail.id] = true;
      persistir();
    });

    /* Pulso que guía la mirada al elemento que falta tocar: el alumno
       ve temblar "Siguiente" y además CUÁL es la interacción pendiente. */
    document.addEventListener('advanceblocked', function (e) {
      var slideEl = document.querySelector('[data-slide="' + e.detail.id + '"]');
      var btn = document.querySelector('[data-nav="next"]');
      if (btn) { btn.classList.remove('d-shake'); void btn.offsetWidth; btn.classList.add('d-shake'); }

      if (e.detail.id === 'factores-riesgo') {
        var faltan = faltanFactores();
        faltan.forEach(function (id) {
          nudge(slideEl && slideEl.querySelector('[data-hit][data-factor="' + id + '"]'));
        });
        toast('Te ' + (faltan.length === 1 ? 'queda 1 factor' : 'quedan ' + faltan.length + ' factores') + ' por ver antes de seguir.');
        return;
      }
      var pops = faltanPopups(slideEl);
      if (pops.length) {
        pops.forEach(function (id) {
          nudge(slideEl && slideEl.querySelector('[data-popup-trigger="' + id + '"]'));
        });
        toast('Te ' + (pops.length === 1 ? 'queda 1 tarjeta' : 'quedan ' + pops.length + ' tarjetas') + ' por ver antes de seguir.');
        return;
      }
      if (faltanVideos(slideEl).length) {
        toast('Mirá el video antes de seguir.');
        nudge(slideEl && slideEl.querySelector('[data-hit][data-video]'));
        return;
      }
      if (faltaRepaso(slideEl)) {
        toast('Respondé el repaso rápido antes de seguir.');
        nudge(slideEl && slideEl.querySelector('.d-repaso'));
        return;
      }
      if (faltaPractica(slideEl)) {
        toast('Completá la mini práctica antes de seguir.');
        nudge(slideEl && slideEl.querySelector('[data-quiz]'));
      }
    });
  }

  /* ============================================================
     UNIDAD 2 · piezas que se inyectan por JS
     ------------------------------------------------------------
     Se construyen desde acá (y no en index.html) para no repetir el
     mismo bloque 6 veces a mano. Corre ANTES de crear el Motor: las
     zonas llevan data-l/t/w/h y es `_initShots()` —dentro de
     `new Motor()`— el que las posiciona. Al revés quedarían sin ubicar.
     ============================================================ */
  /* ---- La franja que recorta el iPad (kit §9.37, `video-lienzo-tablet`) ----
     Un escenario más angosto que 2:1 —iPad Pro 12,9" es el peor caso
     soportado— llena y recorta de costado: se come 12,22% de cada lado.
     En una lámina `--bg-layered` eso es a propósito (ahí solo se pierde
     decoración del arte), pero lo que NO puede caer en esa franja es
     algo CLICKEABLE o algo que haya que LEER: sería un botón invisible
     o media frase cortada, y desde una PC no se nota nunca.

     Lo usa la tira de repaso para que su borde derecho no caiga en esa
     franja. `anchoSeguro()` vivía acá y se fue con la "ilustración
     viva": era la única que lo usaba, y una función que nadie llama
     envejece peor que una que no existe. */
  var MARGEN_SEGURO = 12.22;

  function initUnidad2DOM() {
    U2.forEach(function (f, i) {
      var slide = document.querySelector('[data-slide="' + f.id + '"]');
      var shot = slide && slide.querySelector('[data-shot]');
      if (!shot) return;

      /* ---- LAS ILUSTRACIONES NO LLEVAN NADA ENCIMA ----
         Acá vivía la "ilustración viva": una zona clickeable sobre el
         dibujo y un cartel de dato que aparecía al pasar el mouse. Se
         la quitó por pedido del cliente: *"podemos sacarle la
         interacción con ese bloque de texto a todas esas ilustraciones?
         no me convencen, al final prefiero que no tengan nada esas
         ilus"*. Lo mandó con una foto de la lámina de hipertensión donde
         el cartel caía ENCIMA del chip de "Factor 2 de 6" y de sus
         tildes, que es lo que terminó de decidirlo.

         No se perdió contenido: los seis datos repetían lo que la propia
         lámina ya dice en su columna de texto ("Cómo se detecta: …",
         "Recomendación semanal (OMS): …", "Acompañamiento: …"), que es
         además lo que el bloque `.sr-only` de cada diapositiva le lee a
         un lector de pantalla, y el "cómo se detecta cada uno" vuelve a
         aparecer en el resumen del cierre.

         Tres ubicaciones tuvo ese cartel —sobre el tercio inferior del
         dibujo, en una banda fija debajo del arte, y arriba de la
         ilustración— y la que lo sacó de la cancha fue la cuarta
         conversación sobre lo mismo. Si alguna vez vuelve, el cartel
         necesita un renglón PROPIO: no hay lugar libre entre el chip de
         progreso (termina en 19,79%) y el arte (arranca en 20,79%). */

      /* --- TIRA DE REPASO, abajo de la ilustración y sin tocarla ---
         Quinto y último envase de estas 6 preguntas. Los cuatro
         anteriores los rechazó el cliente: pop-up al entrar, tira sobre
         la ilustración, chip + pop-up, y tira apoyada abajo pisándole
         el borde. Sobre el último dijo: *"yo quiero una opción que no
         tape la ill, y si achicás un poco la ill?"* — y en la misma
         vuelta *"que tenga la misma distancia en todos"*.

         Las dos cosas se resolvieron juntas, y una es de ARTE:
           · `tools/achicar-ilustracion.py` (del kit) mueve y achica la
             ilustración horneada en cada .webp para que las SEIS ocupen
             la MISMA franja: 23,50-75,07 declarado, 23,49-75,00% medido.
             El renglón de arriba lo marca la caja del título, como
             pidió el cliente (*"el margen superior lo debe marcar la
             caja del título 'tabaquismo'"*): la caja va de 12,62% a
             19,76% en las seis, y el chip "Factor N de 6" —que está en
             la MISMA columna— se alinea con ella por arriba, terminando
             en 17,96%. La ilustración arranca 5,5 puntos (43px) más
             abajo: es el aire que pidió el cliente después de ver la
             primera versión, donde había 1 solo punto y se leía
             pegado.
           · `tools/bajar-tarjeta.py` (del kit) baja la TARJETA DE VIDEO
             horneada de cada lámina hasta que las seis terminen en el
             mismo renglón, 90,95%. Venían desparejas —85,71% en
             sedentarismo contra 90,95% en hipertensión, 5,2 puntos—
             porque todas miden lo mismo (35,3 puntos) pero arrancan
             justo abajo del texto, y el texto no tiene la misma
             cantidad de renglones en las seis. Se bajaron al renglón de
             hipertensión, que es la más baja, así que ninguna sube ni
             se acerca al texto: queda entre 5,2 y 9 puntos de aire.
           · Con eso, la tira va ANCLADA ABAJO (`--abajo`) en 90,95%, y
             las dos mitades de la lámina cierran en el mismo renglón
             arriba y abajo. Pedido del cliente: *"factor debería estar
             a la misma altura que la caja de obesidad"* y, sobre el
             borde de abajo, *"y si podemos hacer que abajo pase lo
             mismo"*.
             Anclada abajo la tarjeta CRECE HACIA ARRIBA al contestar
             (la devolución se despliega) y su borde inferior no se
             mueve, que es el que el ojo usa para leer la alineación.
             El alto declarado de la banda (22,00) cubre el estado más
             alto de los doce, sedentarismo contestado, que mide 21,15.

         Las dos alternativas que se descartaron, medidas con el test de
         píxeles en los 6 factores x 2 estados: una sola línea SIN tocar
         el arte tapa 39 píxeles de la alfombra de sedentarismo, y anclar
         cada tira a SU propia tarjeta tapa 4.631 — en sedentarismo la
         tira contestada tendría que subir hasta 64,56% y la tarjeta
         termina en 68,57%. Ésta da 0 en los doce.

         Las opciones van en FILA (`.d-repaso-btns` sin `--col`) y sin el
         chip de "Repaso completo": las dos cosas bajan la tarjeta de
         217px a 165px en su estado más alto, y son las que permiten que
         entre sin achicar más el dibujo. El recuadro verde de la
         devolución ya dice que está resuelta.

         VERIFICADO A NIVEL PÍXEL, no por coordenadas: contando cuántos
         píxeles de dibujo caen dentro del rectángulo renderizado de la
         tira, en los 6 factores x 2 estados. Da 0 en los 12. Antes de
         agregarle al script la banda de limpieza daba hasta 228 en
         diabetes — el fleco de antialias del reescalado más el ruido de
         compresión del WebP, invisible pero distinto de cero. */
      var marco = document.createElement('div');
      marco.className = 'd-repaso-marco d-repaso-marco--abajo';
      marco.setAttribute('data-place', '');
      /* `data-no-tapa-arte` va en la TIRA, no en este marco: con la
         tarjeta anclada abajo, la banda arranca por encima del borde de
         la ilustración a propósito (es donde la tarjeta crece al
         contestar) y es transparente, así que medirla a ella daría un
         falso positivo. Lo que no puede pisar el dibujo es la tarjeta
         visible. Lo mira `bloque-no-tapa-arte.mjs` (kit), que cuenta
         cuántos píxeles de DIBUJO caen dentro del rectángulo renderizado
         y falla si hay uno. Es el test que faltaba: las cuatro
         ubicaciones anteriores se habían verificado por coordenadas y
         las cuatro estaban mal. */
      /* Ancho FIJO y el mismo en las seis, NO el de la ilustración.
         BUG REAL, lo agarró `repaso-tira`: la tira venía tomando el
         ancho de `f.ilustra`, así que al achicar las ilustraciones la
         tira se angostó con ellas — y una tarjeta más angosta es más
         ALTA. MEDIDO: diabetes pasó a necesitar 197px en una caja de
         174 y scrolleaba, que es exactamente lo que la regla del kit
         prohíbe. Con un ancho propio, achicar el arte no le toca el
         alto a la tarjeta, y de paso las seis quedan idénticas.
         48,50 arranca después de la columna de texto (que en la lámina
         más ancha, diabetes, llega al 46,8%) y termina en el margen de
         seguridad lateral. */
      marco.setAttribute('data-l', '48.50');
      marco.setAttribute('data-w', (100 - MARGEN_SEGURO - 48.50).toFixed(2));
      /* 67,91 declarado + 22,00 de alto = base en 90,95% medido, el
         renglón donde ahora terminan las seis tarjetas de video. */
      marco.setAttribute('data-t', '67.91');
      marco.setAttribute('data-h', '22.00');
      marco.setAttribute('data-narrate-last', '');
      marco.hidden = true;
      var tira = document.createElement('div');
      tira.className = 'd-repaso d-repaso--factor';
      tira.setAttribute('data-repaso', f.id);
      tira.setAttribute('data-no-tapa-arte', '');
      tira.innerHTML =
        /* El rótulo "Repaso rápido" deja de OCUPAR un renglón, pero no
           se borra: queda `.sr-only`, visible solo para un lector de
           pantalla, que sin él se encuentra una pregunta suelta sin
           saber qué es.
           Por qué se fue de la vista: ese renglón mide 26px en notebook
           —4,2 puntos de la lámina— y era lo único que había para
           liberar. El cliente pidió aire entre el chip y la ilustración
           y además la ilustración más grande, y las dos cosas salen del
           mismo lugar: entre la caja del título y el renglón de abajo
           hay 70 puntos fijos donde tienen que entrar el aire, el dibujo
           y esta tarjeta. Sin este renglón la tarjeta pasa de 22,07 a
           15,28 puntos (notebook 1366x768, que es el tamaño que manda) y
           con eso alcanza para 5,5 puntos de aire Y +7,8% de dibujo.
           Las tres opciones y el recuadro verde de la devolución dejan
           claro qué es la tarjeta sin necesidad del rótulo. */
        '<b class="sr-only">Repaso rápido</b>' +
        '<div class="d-repaso-item is-current" data-repaso-item data-repaso-ok="' + f.ok + '">' +
          '<p class="d-repaso-q">' + f.q + '</p>' +
          '<div class="d-repaso-btns">' +
            f.opts.map(function (o, n) {
              return '<button type="button" data-repaso-ans="' + n + '">' + o + '</button>';
            }).join('') +
          '</div>' +
          /* `data-narrate-skip` en la devolución: se narra UNA vez, al
             contestar. Sin esto, el alumno que vuelve a un factor ya
             contestado se come la explicación entera cada vez que
             entra. */
          '<p class="d-repaso-fb" data-repaso-fb data-narrate-skip hidden>' + f.why + '</p>' +
        '</div>' +
        '';
      marco.appendChild(tira);
      shot.appendChild(marco);

      /* --- progreso de la unidad (6 tildes)
         Decisión explícita del cliente: NO son botones y no navegan.
         La primera versión eran círculos clickeables; se cambiaron a
         tildes porque un punto no comunica "hecho", y se les sacó la
         navegación porque saltar de factor en factor por acá se
         llevaba puesto el orden del recorrido. Por eso son <span> y no
         <button>: si no se puede accionar, no debe anunciarse como
         accionable a un lector de pantalla. */
      var prog = document.createElement('div');
      prog.className = 'd-u2-prog';
      prog.setAttribute('data-place', '');
      /* El chip sube a un renglón ARRIBA de la ilustración: el de abajo
         ahora es del cartel del dato. Y va a la ALTURA DE LA CAJA DEL
         TÍTULO, no pegado al margen de seguridad: el cliente leía la
         mitad derecha como más alta que la izquierda (*"factor debería
         estar a la misma altura que la caja de obesidad... y así bajar
         toda la mitad derecha hacia abajo"*). Con 15,34 la tinta del
         chip se alinea con la caja del título por ARRIBA (12,63 contra
         12,62) y no por abajo, que es la otra lectura del mismo renglón.
         El motivo es el aire: terminando en 17,96 en vez de 19,79 le
         deja 1,8 puntos más de separación a la ilustración sin que el
         dibujo pierda nada. Pedido del cliente: *"no da que quede así de
         pegado, ahí meterle un buen espacio de aire entre ambas cosas"*.
         El aire total queda en 5,5 puntos (43px): 1,8 los pone el chip y
         los 3,7 restantes salen de que la ilustración arranque en 23,50
         en vez de 20,81.
         El chip no se apoya en ningún detalle del arte, así que en vez de
         angostarlo (le reflowearía el rótulo) se CORRE a la izquierda
         hasta que su borde derecho entre en el margen seguro. */
      prog.setAttribute('data-l', (100 - MARGEN_SEGURO - 35).toFixed(2));
      prog.setAttribute('data-t', '13.56');
      prog.setAttribute('data-w', '35.00'); prog.setAttribute('data-h', '5.20');
      var tildes = U2.map(function (o) {
        return '<span class="d-u2-tick" data-u2-tick="' + o.video + '" role="img">' +
               '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7"/></svg>' +
               '</span>';
      }).join('');
      prog.innerHTML = '<span class="d-u2-prog-lbl">Factor ' + (i + 1) + ' de ' + U2.length + '</span>' +
                       '<span class="d-u2-dots">' + tildes + '</span>';
      shot.appendChild(prog);
    });
  }

  /* La tilde se completa cuando el VIDEO de ese factor fue reproducido
     (no cuando se pasó por la diapositiva): el cliente pidió que marque
     "video visto", que es lo que el gate exige de todos modos. */
  function pintarProgresoU2() {
    var actual = window.motor && window.motor.current();
    var actualId = actual && actual.getAttribute('data-slide');
    document.querySelectorAll('[data-u2-tick]').forEach(function (t) {
      var video = t.getAttribute('data-u2-tick');
      var visto = !!estado.videosVistos[video];
      var f = U2.filter(function (o) { return o.video === video; })[0];
      t.classList.toggle('is-done', visto);
      t.classList.toggle('is-here', !!f && f.id === actualId);
      t.setAttribute('aria-label', (f ? f.nombre : '') + (visto ? ': video visto' : ': video pendiente'));
    });
  }

  /* ---- Repaso rápido de cada factor ----
     Las 6 preguntas son las mismas de siempre y valen los mismos 5
     puntos; lo que cambió CUATRO veces es el envase:
       1. pop-up de predicción que se abría solo al ENTRAR, antes del video;
       2. tira apoyada sobre la ilustración, después del video;
       3. chip abajo de la infografía que abría un pop-up;
       4. y hoy: la tira otra vez, apoyada abajo de la ilustración, sin
          pop-up — *"prefiero que no sea pop up y quede con ese tamaño
          correcto pero ubicalo bien abajo de la ilustración"*.
     El dónde, y cuánto se superpone al arte, están medidos en el
     comentario de la tira, en `initUnidad2DOM`.

     La lógica es la de `initRepasoRapido` de alimentaria, recortada a
     lo que hace falta acá: una sola pregunta por factor, así que no hay
     flechas ‹ › ni contador ni "Siguiente" que lleve a una pregunta 2.

     `estado.predicciones` se mantiene como clave de persistencia, sin
     renombrar: un alumno a mitad de curso trae su `suspend_data` con
     esa marca y no se le puede borrar el progreso por un cambio de
     nombre interno. `prediccionesMal` cumple el mismo papel que
     `repasoMal` en alimentaria: sin ella, recargar la página re-armaba
     la pregunta fallada y devolvía la chance de los puntos, o sea que
     equivocarse no costaba nada. */
  function initRepasoFactor() {
    /* La tira aparece cuando el video de ESE factor ya fue visto. Se
       llama desde `markSeen` (boot) y en cada `slidechange`, no una sola
       vez al montar: el alumno puede ver el video y quedarse en la misma
       diapositiva, y ahí no hay ningún cambio de diapo que refresque
       nada. */
    function refrescar() {
      U2.forEach(function (f) {
        var tira = document.querySelector('[data-repaso="' + f.id + '"]');
        if (!tira || !tira.parentElement) return;
        // El `hidden` va en el MARCO, que es el que ocupa lugar en la
        // lámina (y el que el narrador mira para saltearse el bloque).
        tira.parentElement.hidden = !estado.videosVistos[f.video];
      });
    }
    refrescarRepaso = refrescar;

    U2.forEach(function (f) {
      var tira = document.querySelector('[data-repaso="' + f.id + '"]');
      var item = tira && tira.querySelector('[data-repaso-item]');
      if (!item) return;
      var btns = Array.prototype.slice.call(item.querySelectorAll('[data-repaso-ans]'));
      var fb = item.querySelector('[data-repaso-fb]');

      function resolver(acerto) {
        item.classList.add('is-answered', acerto ? 'is-correct' : 'is-wrong');
        if (fb) fb.hidden = false;
        btns.forEach(function (b) { b.disabled = true; });
        /* Señalar CUÁL era la correcta al errar: el kit ya trae la regla
           `.es-la-correcta` (con su "← esta era") en coto-repaso.css, y
           sin esto el alumno que se equivoca queda sabiendo que falló
           pero no qué opción era — el texto lo cuenta en prosa, pero no
           señala el botón. */
        if (!acerto && btns[f.ok]) btns[f.ok].classList.add('es-la-correcta');
        tira.classList.add('is-complete');
      }

      // Quien ya contestó en una sesión anterior la encuentra resuelta.
      if (estado.predicciones[f.id] || estado.prediccionesMal[f.id]) {
        var acertoAntes = !!estado.predicciones[f.id];
        if (acertoAntes && btns[f.ok]) btns[f.ok].setAttribute('data-chosen', '');
        resolver(acertoAntes);
        return;
      }

      btns.forEach(function (btn, n) {
        btn.addEventListener('click', function () {
          if (item.classList.contains('is-answered')) return;
          var acerto = n === f.ok;
          btn.setAttribute('data-chosen', '');
          resolver(acerto);
          if (window.XAPI) XAPI.answered('repaso-' + f.id, f.q, acerto, f.opts[n]);
          if (window.Narrador && Narrador.isNarrating() && fb) {
            Narrador.speak(fb.textContent, 'other');
          }
          if (acerto && !estado.predicciones[f.id]) {
            estado.predicciones[f.id] = true;
            Logros.award(5, 'repaso de ' + f.nombre);
          } else if (!acerto) {
            estado.prediccionesMal[f.id] = true;
          }
          persistir();
          /* El repaso traba el avance (`faltaRepaso`), así que al
             contestarlo hay que avisarle a la nav: sin esto "Siguiente"
             queda deshabilitado hasta el próximo `slidechange`, que es
             justo lo que el gate acaba de impedir. */
          if (window.motor) window.motor._syncNav();
        });
      });
    });

    document.addEventListener('slidechange', function () {
      pintarProgresoU2();
      refrescar();
      acomodarTiras();
    });
    refrescar();
    pintarProgresoU2();
    acomodarTiras();
    window.addEventListener('resize', acomodarTiras);
  }

  /* ---- La tira se va al espacio libre cuando la lámina no la aguanta ----
     Corrección del cliente, probada en iPad vertical: *"el recuadro del
     repaso se ve con scroll, tapa parte de la ilustración y las opciones
     de respuesta quedan cortadas (la última no se llega a ver).
     Ubicarlo más abajo para que se vea completo, sin scroll y sin tapar
     el dibujo"*.

     No es un problema de ubicación: la banda mide un % del lienzo pero el
     texto de la tarjeta tiene un piso en píxeles, así que cuanto más
     chica la pantalla menos banda hay y más alta es la tarjeta. MEDIDO,
     la misma tarjeta: 176px de banda contra 163 de tarjeta en escritorio,
     y 89 contra 156 en iPad vertical. Se cruzan.

     Y un lienzo 2:1 en una pantalla vertical no la llena: deja franjas
     vacías. MEDIDO: 262px abajo en iPad vertical, 143 en iPhone vertical.
     Ahí se va la tira, a todo el ancho — donde además necesita MENOS
     alto, porque el texto deja de envolverse: 112px contra 156.

     En apaisado no hay franja libre y la tira se queda sobre la lámina,
     que es como se aprobó. Para que entre ahí se acortaron a un renglón
     las dos preguntas que entraban en dos (diabetes y sedentarismo): con
     eso las seis necesitan 143px en los 150 del notebook y 130 en los 145
     del iPad apaisado.

     LÍMITE CONOCIDO, y no tiene arreglo por geometría: en TELÉFONO
     APAISADO el escenario mide 170px de alto, la lámina lo llena entero
     y no queda franja libre, mientras la tarjeta necesita 213. Ahí sigue
     el modo compacto con scroll que ya trae el kit
     (`@media (max-height: 480px)` en coto-repaso.css). */
  function acomodarTiras() {
    U2.forEach(function (f) {
      var slide = document.querySelector('[data-slide="' + f.id + '"]');
      if (!slide) return;
      var marco = slide.querySelector('.d-repaso-marco');
      var tira = marco && marco.querySelector('.d-repaso');
      var shot = slide.querySelector('[data-shot]');
      var img = slide.querySelector('.d-shot-img');
      if (!marco || !tira || !shot || !img) return;
      var ir = img.getBoundingClientRect();
      var sr = slide.getBoundingClientRect();
      if (!ir.height || !sr.height) return;

      /* `scrollHeight` y no `clientHeight`: lo que importa es lo que la
         tarjeta NECESITA, que en la banda chica es justamente lo que no
         entra. Los 24px son el aire mínimo contra la lámina y el pie. */
      var libre = sr.bottom - ir.bottom;
      var afuera = libre >= tira.scrollHeight + 24;
      var yaAfuera = marco.classList.contains('d-repaso-marco--suelto');
      if (afuera === yaAfuera) {
        if (afuera) marco.style.setProperty('--tira-arriba', Math.round(ir.bottom - sr.top) + 'px');
        return;
      }
      if (afuera) {
        /* Sale del `.d-shot` porque el `.d-shot` tiene `overflow:hidden`:
           desde adentro no hay forma de dibujar nada por debajo del
           borde del arte. Y se le saca `data-place` para que
           `_initShots()` no lo vuelva a contar — aunque eso NO alcanza
           para frenar a `place()`, que escribe desde closures ya
           capturados; de eso se encarga el `!important` de la clase. */
        marco.removeAttribute('data-place');
        marco.removeAttribute('style');
        marco.classList.add('d-repaso-marco--suelto');
        if (marco.parentElement === shot) slide.appendChild(marco);
        marco.style.setProperty('--tira-arriba', Math.round(ir.bottom - sr.top) + 'px');
      } else {
        marco.classList.remove('d-repaso-marco--suelto');
        marco.removeAttribute('style');
        if (marco.parentElement !== shot) shot.appendChild(marco);
        marco.setAttribute('data-place', '');
        if (window.motor && motor._initShots) motor._initShots();
      }
    });
  }

  /* ============================================================
     Estadísticas del cierre (contenido: qué números muestra este curso)
     ============================================================ */
  function setText(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }

  function llenarStatsCierre() {
    if (window.pintarMedalla) pintarMedalla(Logros.puntos(), MEDALLAS);
    var name = window.SCORM && SCORM.getFirstName();
    var slot = document.getElementById('d-cert-name');
    if (slot && name) { slot.textContent = name; slot.parentElement.hidden = false; }
    setText('d-cert-score', estado.quiz ? (estado.quiz.best + '/' + (estado.quiz.total || 3)) : '–');
    setText('d-cert-points', String(Logros.puntos()));
    setText('d-cert-badges', Logros.obtenidos() + '/' + BADGES.length);
    setText('d-cert-tries', String(estado.quizAttempts || 1));
  }

  /* ---------- Arranque ---------- */
  function boot() {
    if (window.SCORM) SCORM.init();

    /* Tracking mínimo del LMS — NO comentar ni borrar (kit v1.9.52).
       Es lo que exige `tools/tests/scorm-tracking.mjs`, y nace del peor
       bug que tuvo este kit (§6.24): el alumno termina el curso entero
       y en el LMS queda "incomplete" para siempre, sin que nada en
       pantalla lo delate. Se registran ANTES de `new Motor(document)`
       porque el constructor emite su primer `slidechange` adentro. */
    /* ---- No pisar dónde quedó el alumno ANTES de ofrecerle volver ----
       BUG REAL, y del molde (relevado al kit: relevo Prevención
       cardiovascular, 2026-10-05). Este listener se registra antes de
       `new Motor(document)` para no perderse la primera diapositiva, pero
       el motor arranca SIEMPRE en la portada, así que ese primer
       `slidechange` escribía `portada` en `lesson_location` — y
       `initResume()` (coto-player.js), que corre después, leía `portada`
       y no mostraba el cartel "Retomá donde dejaste". MEDIDO con un LMS
       simulado: escritura de `portada` a los 179 ms, lectura a los
       184 ms. El cartel no podía aparecer nunca, y ya pasaba en el
       v1.9.110 entregado.
       Se saltea solo lo que pasa DURANTE la construcción del motor: lo
       que el alumno navega después se guarda como siempre, que es lo que
       mide `scorm-tracking`. */
    var arrancando = true;
    document.addEventListener('slidechange', function (e) {
      if (arrancando) return;
      if (window.SCORM) SCORM.setLocation(e.detail.id);
    });
    document.addEventListener('courseend', function () {
      if (window.SCORM) SCORM.markCompleted();
    });
    /* Respaldo: el motor emite `courseexit` solo si la última diapositiva
       YA no tiene `data-nav-cta`. Con el cierre del kit ese atributo se
       mantiene ("Salir del curso"), así que en el recorrido normal la
       salida pasa por `navcta` → `salirDelCurso()` y esto no se dispara.
       Queda por si el cierre se desarma o un curso futuro saca el CTA.
       `exitCourse()` y no `finish()`: acá el alumno se va a propósito. */
    document.addEventListener('courseexit', function () {
      if (window.SCORM && SCORM.exitCourse) SCORM.exitCourse();
    });

    // Antes del motor: inyecta las piezas de la Unidad 2 con data-l/t/w/h,
    // que `_initShots()` (dentro de `new Motor()`) tiene que posicionar.
    initTiempoActivo();
    initUnidad2DOM();

    window.motor = new Motor(document);
    arrancando = false;   // ver el listener de `setLocation`, arriba

    /* Puntos y logros. Va DESPUÉS del motor y ANTES de `restaurar()`:
       pinta el HUD en 0/N al crearse y `restaurar()` lo repinta con lo
       guardado. `onChange` guarda solo en cada award()/unlock(). */
    Logros = initLogros({ badges: BADGES, onChange: persistir });
    restaurar();

    /* Solo la variable local: el `window.Player` que había acá lo hace
       AHORA EL KIT. `initPlayer()` publica `global.Player` por su
       cuenta desde kit-base v1.9.61, justamente para que el curso no
       tenga que acordarse de quién más necesita el objeto
       (`coto-logros.js` lo usa para sus avisos "+5 · video visto" y
       "🏆 Logro: …").
       Lo encontró `check-globals` apuntado al curso —no al kit, que es
       lo que miraba por default hasta v1.9.102—: "Player lo publican
       DOS archivos, el orden de los <script> decide cuál gana". Acá no
       hacía daño, porque los dos asignaban EL MISMO objeto, pero una
       segunda fuente de verdad para un símbolo global es exactamente lo
       que ese chequeo existe para no dejar pasar. */
    Player = initPlayer({
      speakSlide: function (s) { Narrador.speak(Narrador.textOf(s), 'slide'); },
      visitedIndexes: function () {
        return Object.keys(estado.vistas).map(function (id) {
          var el = document.querySelector('[data-slide="' + id + '"]');
          return el ? +el.getAttribute('data-slide-index') : -1;
        });
      }
    });

    // Chrome genérico del kit
    initPopupNarration();
    initPopupStagger();
    /* Las dos que la plantilla v1.9.116 llama y este curso no
       (las avisó `actualizar-kit`). Hoy NO hacen nada acá, y está bien:
       · `initPrediccion()` solo cablea los `[data-pred]` del marcado, y
         este curso no tiene ninguno A PROPÓSITO — el pop-up de
         predicción antes de cada video lo rechazó el cliente y se
         reemplazó por la tira de repaso. Se llama igual para que una
         pregunta así, si algún día vuelve, no quede dibujada y muerta
         (la pieza está, el cable no). Lo exige el test `prediccion`.
       · `initEntradaGenerica()` anima la entrada de las diapositivas con
         `data-entrada`, y ninguna la lleva. Ponérsela a introducción,
         objetivos, índice y consejos es un cambio VISIBLE que el
         cliente no pidió en este curso: queda como opción. */
    initEntradaGenerica();
    initPrediccion();
    initStatPopups();
    initPrefetchNeighbors();
    initSummaryPrint();
    initVideoSafetyNet();

    // Índice ☰: no deja saltar a lo que todavía no se visitó
    refrescarIndice = initIndexJumps({
      visited: function (id) { return !!estado.vistas[id]; }
    });

    /* El "Ver en el curso" del panel de Recursos pasa por el MISMO gate.
       Va en una llamada aparte porque `initIndexJumps` toma UN selector y
       el del índice trae además la tilde de visto y la línea de progreso.
       Sin este cable, Recursos sería el atajo que saltea las diapositivas
       —y los gates— del medio: el alumno abre el cajón, toca el último
       documento y aparece del otro lado sin haber cumplido nada. */
    refrescarRecursos = initIndexJumps({
      selector: '.d-recurso-ir',
      visited: function (id) { return !!estado.vistas[id]; }
    });

    /* ---- Glosario progresivo (coto-ui.js) ----
       Los 16 términos van en ORDEN DE APARICIÓN en el curso (no
       alfabético) y cada uno es un botón que salta a la diapositiva
       donde se explica — el salto lo cablea el motor solo, por el
       `data-goto` del marcado, sin JS del curso.
       Arrancan bloqueados: `initGlossaryUnlock` deshabilita el botón
       hasta que esa diapositiva fue vista, así el glosario no se
       vuelve un atajo para saltearse el recorrido (era el bug §6.44
       del índice lateral, mismo criterio acá).
       `refrescarGlosario()` se llama en cada `slidechange`, más abajo. */
    refrescarGlosario = initGlossaryUnlock({
      seen: function (id) { return !!estado.vistas[id]; },
      onUnlock: function (labels) {
        toast('🔓 ' + (labels.length === 1
          ? 'Desbloqueaste "' + labels[0] + '"'
          : 'Desbloqueaste ' + labels.length + ' términos') + ' del glosario');
      }
    });
    initGlossarySearch();   // buscador: filtra por texto, ignora mayúsculas/acentos

    /* ---- Videos (coto-media.js) ----
       `seen`/`markSeen` conectan los 3 patrones de video con el MISMO
       registro que lee el gate (`estado.videosVistos`, clave = src). */
    var vistoOpts = {
      seen: function (src) { return !!estado.videosVistos[src]; },
      markSeen: function (src) {
        if (estado.videosVistos[src]) return;
        estado.videosVistos[src] = true;
        Logros.award(5, 'video visto');
        pintarProgresoU2();
        /* La tira de repaso de ese factor se destapa acá mismo: el
           alumno cierra el video y se queda en la misma diapositiva, así
           que no hay ningún `slidechange` que la muestre. */
        refrescarRepaso();
        persistir();
        if (window.motor) window.motor._syncNav();
      }
    };
    initBgVideos();
    initVideoPlayer(vistoOpts);
    initInlineCircleVideos(vistoOpts);

    /* El gate de "mirá el video" comparte el MISMO registro de vistos
       que los 3 patrones de arriba (`vistoOpts`), así que mirar el
       video por cualquier vía libera el avance. Se crea después de
       ellos, pero antes no importa: solo lee el DOM al construirse. */
    VideoGate = initVideoGate(vistoOpts);

    /* ---- "Factores de riesgo": pestañas que cambian la captura entera ----
       El swap, la precarga y el fundido los hace initShotSwap; acá queda
       lo de contenido: los puntos, el gate y la narración del panel. */
    initShotSwap({
      onChange: function (indice) {
        var btn = document.querySelector('[data-shot-swap-go="' + indice + '"]');
        var factor = btn && btn.getAttribute('data-factor');
        if (factor && !estado.factoresExplorados[factor]) {
          estado.factoresExplorados[factor] = true;
          var label = btn.querySelector('.sr-only');
          Logros.award(5, label ? label.textContent : factor);
          if (window.XAPI) XAPI.experienced('factor-' + factor, label ? label.textContent : factor);
          persistir();
          if (window.motor) window.motor._syncNav();
        }
        /* Narración: SOLO el panel del paso actual, nunca la consigna
           fija de la diapositiva (CLAUDE.md §6.5: no re-narrar la intro
           en cada paso de una actividad multi-paso). Los paneles son
           `.sr-only` y viven ocultos: se muestra el del paso actual para
           que `Narrador.textOf()` lo encuentre (filtra `[hidden]`). */
        var grupo = document.querySelector('.d-factores-tabs');
        if (!grupo) return;
        var clave = factor || 'index';
        var panel = null;
        grupo.querySelectorAll('[data-panel]').forEach(function (p) {
          var esEste = p.getAttribute('data-panel') === clave;
          p.hidden = !esEste;
          if (esEste) panel = p;
        });
        if (panel) Narrador.speak(Narrador.textOf(panel), 'slide');
      }
    });

    /* ---- Zonas interactivas sobre el arte (coto-hotspots.js) ----
       Los 3 casos usaban el mismo patrón escrito 3 veces; ahora es una
       llamada por grupo, con la geometría y el contenido de cada uno. */
    initHotspots({
      zonas: '[data-barra]', clave: 'data-barra', datos: BARRAS,
      cartel: '[data-barra-cartel]', claseIdle: 'is-barra-idle',
      render: function (cartel, d) {
        cartel.querySelector('[data-barra-name]').textContent = d.name;
        cartel.querySelector('[data-barra-txt]').textContent = d.txt;
      },
      narrar: function (d) { return d.name + '. ' + d.txt; }
    });

    initHotspots({
      zonas: '.d-pie-seg', clave: 'data-seg', datos: PIE_INFO,
      contenedor: '[data-pie]', cartel: '[data-pie-card]', claseIdle: 'is-idle',
      render: function (card, d, k) {
        card.querySelector('[data-pie-pct]').textContent = d.pct;
        card.querySelector('[data-pie-name]').textContent = d.name;
        card.querySelector('[data-pie-txt]').textContent = d.txt;
        /* La tarjeta se ubica cerca del sector elegido (pedido del
           cliente: "que cada dato aparezca en su correspondiente parte
           de la torta"), no en un lugar fijo — ver las posiciones por
           sector en diapositivas.css, `[data-pie-active="…"]`. */
        document.querySelector('[data-pie]').setAttribute('data-pie-active', k);
      },
      onClear: function () {
        var w = document.querySelector('[data-pie]');
        if (w) w.removeAttribute('data-pie-active');
      },
      narrar: function (d) { return d.pct + ' por ciento, ' + d.name + '. ' + d.txt; }
    });

    /* Las etapas abren un pop-up en vez de un cartel: estas capturas no
       tienen un hueco libre del tamaño que el texto necesita. El hover
       queda solo para el resaltado. */
    var Etapas = initHotspots({
      zonas: '[data-etapa]', clave: 'data-etapa', datos: ETAPAS,
      claseIdle: 'is-etapa-idle',
      onSelect: function (id, d) {
        var hd = document.querySelector('[data-etapa-hd]');
        var txt = document.querySelector('[data-etapa-txt]');
        var que = document.querySelector('[data-etapa-que]');
        if (hd) hd.textContent = 'Etapa ' + id + ' de 4 · ' + d.name + ':';
        if (txt) txt.textContent = d.txt;
        if (que) que.textContent = d.que;
        var pasos = document.querySelector('[data-etapa-steps]');
        if (pasos) {
          pasos.querySelectorAll('[data-step]').forEach(function (b) {
            var n = +b.getAttribute('data-step');
            b.parentNode.classList.toggle('is-prev', n < +id);
            b.parentNode.classList.toggle('is-cur', n === +id);
            if (n === +id) b.setAttribute('aria-current', 'step');
            else b.removeAttribute('aria-current');
          });
        }
      },
      narrar: function (d) { return d.name + '. ' + d.txt + ' ' + d.que; }
    });
    // El clic sobre una etapa además abre el pop-up con su texto.
    document.querySelectorAll('[data-etapa]').forEach(function (z) {
      z.addEventListener('click', function () { window.motor.showPopup('etapa'); });
    });
    // Los botones de la barra de pasos saltan de etapa sin cerrar el pop-up.
    document.querySelectorAll('[data-etapa-steps] [data-step]').forEach(function (b) {
      b.addEventListener('click', function () { Etapas.mostrar(b.getAttribute('data-step')); });
    });

    initRepasoFactor();
    initGates();

    /* ---- Cierre (coto-cierre.js) ---- */
    Cierre = initCierreCelebration({
      statIds: ['d-cert-score', 'd-cert-points', 'd-cert-badges', 'd-cert-tries'],
      onUnlock: llenarStatsCierre,
      onFinish: function () {
        Logros.unlock('curso');
        llenarStatsCierre();   // con el logro "curso" ya otorgado
        if (window.XAPI) XAPI.completed(COURSE_SLUG, COURSE_NAME);
        if (window.SCORM) SCORM.markCompleted();
      },
      /* 2º clic del pie en el cierre ("Salir del curso"): lo maneja
         `salirDelCurso()` del kit — cancela la locución, cierra la
         sesión SCORM con `exitCourse()` (marca completado y NO deja
         `exit=suspend`, que es lo correcto para una salida deliberada:
         el curso original usaba `finish()` acá, pensado para retomar) y
         muestra la pantalla `#d-salida` que este curso ya trae.
         El botón NO se apaga después de salir: si el alumno vuelve al
         resumen tiene que poder salir otra vez (reporte del cliente). */
      onExit: function () {
        if (window.XAPI) XAPI.completed(COURSE_SLUG, COURSE_NAME);
      },
      stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); }
    });

    /* ---- Mini práctica (coto-quiz.js) ---- */
    initMiniQuiz({
      bank: PRACTICA.banco || [],
      size: PRACTICA.porIntento,
      happyMessages: (PRACTICA.mensajes || {}).bien,
      hotMessages: (PRACTICA.mensajes || {}).racha,
      oopsMessages: (PRACTICA.mensajes || {}).error,
      getState: function () { return estado.quiz || null; },
      setState: function (q, intentos) { estado.quiz = q; estado.quizAttempts = intentos; persistir(); },
      onAnswer: function (correcta, racha) {
        if (!window.CotoUI) return;
        if (correcta) {
          if (CotoUI.sCorrect) CotoUI.sCorrect();
          if (racha >= 3) { Logros.award(10, 'racha x' + racha); if (CotoUI.sStreak) CotoUI.sStreak(); }
        } else if (CotoUI.sWrong) CotoUI.sWrong();
      },
      onFirstFinish: function () {
        Logros.unlock('practica');
        Logros.award(20, 'práctica completada');
      },
      /* `_syncNav()` acá también: la diapositiva de la práctica traba el
         avance (`faltaPractica`), así que al completarla hay que
         refrescar la nav en el mismo momento. */
      onFinish: function () {
        Cierre.unlockCierre();
        syncQuizRunning();
        if (window.motor) motor._syncNav();
      },
      narrate: function (el) { Narrador.speak(Narrador.textOf(el), 'slide'); },
      /* El "repasar" de una respuesta incorrecta puede apuntar a una
         DIAPOSITIVA o a un POP-UP.
         BUG REAL (venía del curso pre-migración): una de las 9 preguntas
         usa `related: 'control-factores'`, que es el pop-up del 50% —
         no una diapositiva. `motor.gotoId()` no encontraba nada y el
         botón "Repasar" no hacía absolutamente nada, sin error.
         Se resuelve acá y no cambiando ese `related` por la diapositiva
         que lo contiene, porque así cualquier pregunta futura puede
         apuntar al pop-up donde REALMENTE está la respuesta: se navega
         a la diapositiva que lo abre y después se abre el pop-up. */
      goToRelated: function (id) {
        if (document.querySelector('[data-slide="' + id + '"]')) {
          window.motor.gotoId(id);
          return;
        }
        if (!document.querySelector('[data-popup="' + id + '"]')) return;
        var disparador = document.querySelector(
          '[data-gate-popup="' + id + '"], [data-require-popups~="' + id + '"], [data-popup-trigger="' + id + '"]');
        var slide = disparador && disparador.closest('[data-slide]');
        if (slide) {
          window.motor.gotoId(slide.getAttribute('data-slide'));
          // se espera a que termine la transición de diapositiva
          setTimeout(function () { window.motor.showPopup(id); }, 420);
        } else {
          window.motor.showPopup(id);
        }
      },
      track: function (id, pregunta, correcta, respuesta) {
        if (window.XAPI) XAPI.answered(id, pregunta, correcta, respuesta);
      },
      stagger: function (el) { if (window.staggerReveal) staggerReveal(null, el); }
    });

    /* ---- Espacio para las preguntas mientras se responde ----
       `.is-quiz-running` en la diapositiva oculta el eyebrow, la bajada
       y el aviso destacado (CSS en diapositivas.css). Lo hacía el quiz
       propio del curso antes de migrar; `initMiniQuiz` del kit no tiene
       ese concepto, así que se maneja acá.
       No es cosmético: a 1600x900 la diapositiva entra holgada, pero
       dentro del iframe de Moodle el escenario mide ~570px de alto y
       ahí la pregunta con sus 4 opciones queda debajo del pliegue. El
       aviso de "esto no es la evaluación" no se pierde por ocultarlo:
       ahora lo da el pop-up `practica-intro` al entrar, y vuelve a
       aparecer en el resultado. */
    function syncQuizRunning() {
      var slide = document.querySelector('[data-slide="evaluacion"]');
      if (!slide) return;
      var pendiente = !(estado.quiz && estado.quiz.done);
      slide.classList.toggle('is-quiz-running', pendiente);
      /* El aviso previo lo abre EL MOTOR (`data-intro-popup`) mientras la
         práctica esté pendiente; una vez terminada, el atributo sale y la
         diapositiva se narra normal. Ver el bloque del pop-up más abajo. */
      if (pendiente) slide.setAttribute('data-intro-popup', 'practica-intro');
      else slide.removeAttribute('data-intro-popup');
    }
    // "Practicar de nuevo" (lo pinta el módulo dentro de [data-quiz]):
    // vuelve a arrancar el cuestionario, así que hay que volver a ocultar.
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-quiz] [data-retry]')) {
        var slide = document.querySelector('[data-slide="evaluacion"]');
        if (slide) slide.classList.add('is-quiz-running');
      }
    });

    /* ---- Aviso previo a la mini práctica ----
       Pedido explícito del cliente: que quede sin lugar a dudas que la
       mini práctica NO es la evaluación del curso. Va como pop-up al
       entrar a la diapositiva, no como una línea más de la bajada,
       porque es justo lo que un alumno lee en diagonal y después
       reclama.
       Se REABRE cada vez que se entra mientras la práctica no esté
       terminada — mismo criterio que el pop-up de instrucciones del
       índice: un aviso que aparece una sola vez es un aviso que se
       pierde. Una vez completada deja de aparecer, porque ahí el aviso
       ya cumplió y repetirlo molesta.
       (`initMiniQuiz` del kit no tiene gancho para esto: el módulo
       renderiza la primera pregunta al arrancar y el pop-up se abre
       encima, que además evita el estado en blanco que tenía la
       versión anterior mientras el aviso estaba abierto.) */
    var pracIntro = document.querySelector('[data-popup="practica-intro"]');
    if (pracIntro) {
      var irAlQuiz = pracIntro.querySelector('[data-pracintro-go]');
      if (irAlQuiz) {
        irAlQuiz.addEventListener('click', function () { window.motor.closePopup(); });
      }
      /* Lo ABRE EL MOTOR, vía `data-intro-popup`, no un `setTimeout` de
         acá. Un pop-up que el motor no anuncia hace que `coto-player.js`
         narre la diapositiva 220ms después de entrar y que el pop-up la
         corte a mitad de palabra: `locucion-control` lo medía como dos
         locuciones encimadas en "evaluacion". Con el atributo, el motor
         lo avisa en `slidechange.detail.introPopup`, el player se calla,
         y la diapositiva se narra al cerrar el aviso (kit §7.17). Lo
         propio del curso es solo CUÁNDO corresponde —mientras la
         práctica no esté terminada— y eso se expresa poniendo y quitando
         el atributo, que el motor relee en cada entrada. */
      document.addEventListener('slidechange', function (e) {
        if (e.detail.id !== 'evaluacion') return;
        syncQuizRunning();   // y con eso, el `data-intro-popup` al día
      });
    }

    /* ---- Progreso propio del curso ---- */
    document.addEventListener('slidechange', function (e) {
      var id = e.detail.id;
      estado.vistas[id] = true;
      persistir();
      refrescarIndice();
      refrescarRecursos();
      refrescarGlosario();   // el término de esta diapositiva deja de estar bloqueado
      if (window.XAPI) XAPI.experienced(id, id);
      // Los 2 logros de unidad se otorgan al ENTRAR a la diapositiva
      // siguiente a cada unidad: es el punto en el que está recorrida.
      if (id === 'unidad2') Logros.unlock('unidad1');
      /* La Unidad 2 queda recorrida al SALIR del último factor, o sea al
         entrar a la diapositiva siguiente. Desde que la mini práctica se
         movió antes de "Últimos consejos", esa siguiente es "evaluacion"
         (antes era "consejos"). Si esto no se movía, el logro de Unidad 2
         se otorgaba una diapositiva tarde. */
      if (id === 'evaluacion') Logros.unlock('unidad2');
    });

    // Barra arrastrable con gate: hay que restaurar hasta dónde se llegó
    // en sesiones anteriores, o al reabrir no se puede volver a lo visto.
    motor.restoreMaxVisited(estado.vistas);
    refrescarIndice();
    refrescarRecursos();
    refrescarGlosario();

    // Reingreso con la práctica ya hecha: el cierre tiene que aparecer
    // desbloqueado desde el arranque, no después de rehacerla.
    if (estado.quiz && estado.quiz.done) Cierre.unlockCierre();
    syncQuizRunning();

    if (window.SCORM) SCORM.commit();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
