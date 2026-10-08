/* ============================================================
   coto-player.js · Controles del reproductor (barra superior e inferior)
   kit-base v1.7 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual a cada curso nuevo, sin editar.
   ------------------------------------------------------------
   Todo el "chrome" que cada curso venía reescribiendo de cero en su
   propio curso.js: saludo con el nombre del alumno, botones de sonido /
   locución / pantalla completa, selector manual de voz, barra de
   progreso arrastrable, avisos flotantes (toast) y banner de "retomá
   donde dejaste". Ninguna de estas funciones lee contenido del curso —
   solo IDs del boilerplate del header/footer (ver
   header-boilerplate.html) y la API del motor.

   Pareja de: coto-player-chrome.css + coto-player-bottom.css.

   Uso (una sola llamada, después de crear el Motor):
     var Player = initPlayer({
       speakSlide: function (slideEl) { Narrador.speak(textOf(slideEl), 'slide'); },
       // Índices de diapositiva ya visitados — el tope real hasta donde
       // se puede ARRASTRAR la barra hacia adelante (ver initProgressSeek).
       visitedIndexes: function () {
         return Object.keys(state.vistas).map(function (id) {
           var el = document.querySelector('[data-slide="' + id + '"]');
           return el ? +el.getAttribute('data-slide-index') : -1;
         });
       }
     });
     Player.toast('texto');   // el curso lo usa para sus propios avisos
   ============================================================ */
(function (global) {
  'use strict';

  function initPlayer(opts) {
    opts = opts || {};
    var speakSlide = opts.speakSlide || function () {};
    var visitedIndexes = opts.visitedIndexes || function () { return []; };

    /* ---- Aviso flotante ---- */
    var toastEl = null, toastTimer = null;
    function toast(text, ms) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'd-award-toast';
        toastEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastEl);
      }
      /* Rediseño v1.9.125 (§7.74), del canvas: pastilla con un círculo de
         ícono a la izquierda y el tono según qué avisa (puntos, logro, lo
         que falta, listo, información). Se deduce del TEXTO, así ningún
         curso tiene que cambiar sus `Player.toast(...)`. El emoji del
         principio pasa al círculo; el resto del texto queda igual. */
      var t = String(text), ic = 'i', tono = 'info', m;
      if ((m = t.match(/^\+(\d+)\s*·\s*/))) { tono = 'pts'; ic = '+' + m[1]; t = t.slice(m[0].length); }
      else if (/^🏆\s*/.test(t)) { tono = 'logro'; ic = '★'; t = t.replace(/^🏆\s*/, ''); }
      else if (/^(✓|✔)\s*/.test(t)) { tono = 'ok'; ic = '✓'; t = t.replace(/^(✓|✔)\s*/, ''); }
      else if (/^🔓\s*/.test(t)) { tono = 'ok'; ic = '✓'; t = t.replace(/^🔓\s*/, ''); }
      else if (/^🔒\s*/.test(t)) { tono = 'falta'; ic = '!'; t = t.replace(/^🔒\s*/, ''); }
      else if ((m = t.match(/^Te (queda|quedan|falta|faltan) (\d+)/))) { tono = 'falta'; ic = m[2]; }
      toastEl.className = 'd-award-toast d-toast--' + tono;
      toastEl.textContent = '';
      var ci = document.createElement('span');
      ci.className = 'd-toast-ic'; ci.setAttribute('aria-hidden', 'true'); ci.textContent = ic;
      var tx = document.createElement('span');
      tx.className = 'd-toast-txt'; tx.textContent = t;
      toastEl.appendChild(ci); toastEl.appendChild(tx);
      void toastEl.offsetWidth;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 2200);
    }

    /* ---- "¡Listo! Ya podés seguir" (canvas del rediseño, v1.9.127) ----
       El quinto aviso del tablero "Avisos que aparecen solos": cuando se
       completa lo que la pantalla pedía, el motor emite `gateabierto` en
       el mismo instante en que brilla "Siguiente". Vive acá y no en
       `initGateHints` porque ésa la llama cada curso a su manera (la
       plantilla la trae comentada), y este aviso tiene que salir en
       todos. Si hay otro aviso a la vista (los puntos de la ficha que se
       acaba de cerrar, un logro) espera a que termine: pisarlo se comería
       el "+10", y pisado por él no se leía. Se apaga con `initPlayer({ avisoListo: false })`. */
    if (opts.avisoListo !== false) {
      document.addEventListener('gateabierto', function (e) {
        var id = e.detail && e.detail.id;
        function decir() {
          var cur = global.motor && global.motor.current && global.motor.current();
          if (id && cur && cur.getAttribute('data-slide') !== id) return;
          toast('✓ ¡Listo! Ya podés seguir');
        }
        /* Se mira un rato después y no en el acto: hay cursos que dan
           el "+10" de la última ficha DESPUÉS de destrabar la pantalla
           (Seguridad alimentaria), y un "¡Listo!" inmediato quedaba
           pisado. Mientras haya un aviso a la vista, se espera (hasta 6 s). */
        var intentos = 0;
        function mirar() {
          if (toastEl && toastEl.classList.contains('show') && intentos++ < 15) setTimeout(mirar, 400);
          else decir();
        }
        setTimeout(mirar, 350);
      });
    }

    /* ---- Saludo con el nombre del alumno ----
       El emoji va en su propio <span class="ic"> (no pegado al texto)
       para poder ocultarlo aparte en pantallas angostas sin tocar el
       nombre. Se arma con createTextNode y NO con innerHTML porque `n`
       viene del LMS (cmi.core.student_name): no hay que confiar en que
       nunca traiga caracteres raros. */
    function initGreeting() {
      var el = document.getElementById('d-greet');
      if (!el || !global.SCORM) return;
      var n = global.SCORM.getFirstName();
      if (!n) return;
      el.textContent = '';
      var ic = document.createElement('span');
      ic.className = 'ic'; ic.setAttribute('aria-hidden', 'true'); ic.textContent = '👋';
      el.appendChild(ic);
      el.appendChild(document.createTextNode(' Hola, ' + n));
      el.hidden = false;
    }

    /* ---- Un clic hace UNA cosa ----
       ⚠️ BUG REAL, y regresión introducida en v1.9.89: al pasar los
       popovers a "solo por clic", los botones de Sonido y Locución
       quedaron haciendo DOS cosas con el mismo gesto — abrir su panel
       y, de paso, mutear o apagar la locución. Reporte del cliente:
       *"para abrirlo tengo que hacer clic pero al abrirlo también lo
       desactiva; tenemos que hacerlo en 2 clics, uno para abrir y otro
       para desactivar"*.

       Antes no se notaba porque el panel abría al pasar el mouse: el
       clic era SOLO del toggle. Sacado el hover, los dos usos se
       pisaron. (Medido: un clic en Locución la dejaba en `false` y
       guardaba `"0"` en localStorage.)

       Fix: el toggle actúa SOLO si el panel YA estaba abierto. Clic 1
       abre y no toca el audio; clic 2 apaga —y cierra, por el "segundo
       clic = cerrar" que el popover ya tenía.

       ⚠️ El orden importa y está garantizado: `initSoundToggle` e
       `initNarrateToggle` registran su listener ANTES que
       `initAudioPopovers` (líneas 1251-1252 contra 1255), así que
       cuando esto corre, `is-open` todavía refleja el estado PREVIO al
       clic — que es justamente lo que hay que mirar. Si algún día se
       reordenan esos init, esto deja de funcionar en silencio.

       Si el botón no vive dentro de un popover (un curso que no los
       use), devuelve true y el toggle funciona como siempre. */
    function panelYaAbierto(btn) {
      var ctl = btn.closest && btn.closest('.d-audio-ctl');
      return !ctl || ctl.classList.contains('is-open');
    }

    /* ---- Sonido (mute global, compartido con fx.js vía localStorage) ---- */
    function initSoundToggle() {
      var btn = document.getElementById('d-sound');
      if (!btn) return;
      var LS = 'coto-diapos-mute';
      var LS_VOL = 'coto-diapos-volume';
      var muted = false;
      try { muted = localStorage.getItem(LS) === '1'; } catch (e) {}
      /* BUG REAL, pedido del cliente ("Sonido debería mutear todo el
         curso, sin excepción"): esto solo tocaba `localStorage`, que
         fx.js/coto-ui.js SÍ leen (efectos de UI) pero coto-media.js no
         leía (los 3 patrones de video del kit — fondo, pop-up, círculo
         inline — seguían sonando aparte). coto-media.js ya lee la
         misma marca al ARRANCAR cada video (próxima vez que se
         reproduce, ya sale mudo/con sonido según corresponda), pero un
         video de FONDO ya sonando en el momento del click (portada,
         separador de unidad) necesita que ALGUIEN le toque `.muted`
         ahí mismo — nadie lo hacía. */
      /* Volumen (pedido de producto, kit-base v1.9.35): antes "Sonido"
         era on/off puro. `volume` es el nivel real (0-1), separado del
         flag `muted` — igual que cualquier control de volumen real
         (sistema operativo, YouTube): arrastrar el slider a >0 con el
         sonido muteado desmutea solo (si no, mover la barra "no hace
         nada" a los ojos del alumno); el ícono/estado "silenciado" se
         calcula con `efectivoMudo()` = muted O volumen en 0, sin
         necesidad de mezclar los dos datos en un solo flag. */
      var volume = 1;
      try {
        var savedVol = parseFloat(localStorage.getItem(LS_VOL));
        if (!isNaN(savedVol)) volume = Math.min(1, Math.max(0, savedVol));
      } catch (e) {}

      var popMuteBtn = document.getElementById('d-vol-mute-btn');
      var range = document.getElementById('d-vol-range');
      var pct = document.getElementById('d-vol-pct');
      var barsWrap = document.getElementById('d-vol-bars');
      var barEls = barsWrap ? Array.prototype.slice.call(barsWrap.children) : [];

      function efectivoMudo() { return muted || volume <= 0; }
      function syncVideos() {
        document.querySelectorAll('video').forEach(function (v) {
          v.muted = efectivoMudo();
          v.volume = volume;
        });
      }
      function sync() {
        var off = efectivoMudo();
        btn.classList.toggle('is-muted', off);
        btn.setAttribute('aria-pressed', off ? 'false' : 'true');
        btn.setAttribute('aria-label', off ? 'Activar sonido' : 'Silenciar sonido');
        if (popMuteBtn) {
          popMuteBtn.classList.toggle('is-muted', off);
          popMuteBtn.setAttribute('aria-pressed', off ? 'true' : 'false');
          popMuteBtn.setAttribute('aria-label', off ? 'Activar sonido' : 'Silenciar sonido');
        }
        var pctVal = Math.round(volume * 100);
        if (range) { range.value = String(pctVal); range.style.setProperty('--pct', pctVal + '%'); }
        if (pct) pct.textContent = pctVal + '%';
        // Ecualizador decorativo: cuántas barras "prenden" es proporcional
        // al volumen — puramente visual, no representa audio real (no
        // hay forma confiable de leer el espectro de un <video> remoto
        // sin enredarse con CORS); apagado entero si está mudo.
        var prendidas = off ? 0 : Math.round((volume * barEls.length));
        barEls.forEach(function (b, i) { b.classList.toggle('is-on', i < prendidas); });
        syncVideos();
      }
      sync();

      function toggleMute() {
        muted = !muted;
        try { localStorage.setItem(LS, muted ? '1' : '0'); } catch (e) {}
        sync();
        /* Solo acá, nunca en el `input` del slider de abajo (kit-base
           v1.9.40): "Sonido" ahora también gobierna el volumen de la
           locución (narrador.js, `volumenEfectivo()`), y la única forma
           de aplicar un volumen nuevo a un utterance que ya está sonando
           es re-emitirlo — bien para un gesto discreto como mutear (el
           alumno espera silencio YA), pero recortaría la frase en seco
           en cada píxel si se llamara durante un arrastre continuo. */
        if (global.Narrador && global.Narrador.refreshVolume) global.Narrador.refreshVolume();
      }
      /* `cotoaudiopedido` — lo emite coto-media.js cuando el alumno
         toca el chip de gesto que OFRECE sonido ("Tocá para comenzar" /
         "Tocá para escuchar"). Ver el comentario largo de `pedirAudio()`
         alla (kit-base v1.9.100): es la mitad que arregla el reporte
         "el icono aparece tachado pero la musica se escucha igual".
         Este es el unico lugar del kit que escribe la marca de mute, asi
         que el levantamiento tiene que pasar por aca — y de paso `sync()`
         redibuja el icono y aplica el volumen a todos los videos, que es
         exactamente lo que hacia falta para que icono y audio no puedan
         volver a contradecirse. Si el volumen habia quedado en 0, se
         devuelve a 1: dejarlo en 0 seria desmutear a un silencio, o sea
         el mismo boton que no hace nada, con otra cara. */
      document.addEventListener('cotoaudiopedido', function () {
        if (!efectivoMudo()) return;
        muted = false;
        try { localStorage.setItem(LS, '0'); } catch (e) {}
        if (volume <= 0) {
          volume = 1;
          try { localStorage.setItem(LS_VOL, '1'); } catch (e) {}
        }
        sync();
        if (global.Narrador && global.Narrador.refreshVolume) global.Narrador.refreshVolume();
      });
      btn.addEventListener('click', function () { if (panelYaAbierto(btn)) toggleMute(); });
      // El de ADENTRO del panel siempre actúa: ahí no hay nada que abrir.
      if (popMuteBtn) popMuteBtn.addEventListener('click', toggleMute);
      if (range) {
        range.addEventListener('input', function () {
          volume = Math.min(1, Math.max(0, parseInt(range.value, 10) / 100));
          try { localStorage.setItem(LS_VOL, String(volume)); } catch (e) {}
          if (volume > 0 && muted) {
            muted = false;
            try { localStorage.setItem(LS, '0'); } catch (e) {}
          }
          sync();
        });
        /* BUG REAL, reportado tras entregar v1.9.40 (kit-base v1.9.42):
           el volumen de la locución quedaba sin aplicar hasta reiniciar
           la narración — "subo y bajo el volumen y no cambia". Causa
           real: `u.volume` de un `SpeechSynthesisUtterance` no se puede
           tocar en caliente sobre uno que ya está sonando (comentario
           de §6.60 más arriba) — la única forma de aplicarlo es
           re-emitir (`Narrador.refreshVolume()`), y esa llamada se dejó
           a propósito FUERA del `input` de arriba para no cortar la
           frase en cada píxel de un arrastre continuo. El plan era que
           "el fragmento siguiente" lo resolviera solo — pero
           `chunkText` (narrador.js, tope 180 caracteres) suele producir
           UN SOLO fragmento para una diapositiva típica (título + un
           párrafo corto): no hay "fragmento siguiente" hasta que
           termina TODA la narración, así que en la práctica el volumen
           no se sentía actualizar hasta la próxima diapositiva.
           Fix real: `change` (nativo de `<input type="range">`) es
           exactamente el gesto discreto que ya usa `toggleMute()` —
           dispara UNA vez al soltar (mouse/touch/teclado), nunca en
           cada tick de un arrastre en curso, así que re-emitir ahí no
           corta nada a mitad de frase. */
        range.addEventListener('change', function () {
          if (global.Narrador && global.Narrador.refreshVolume) global.Narrador.refreshVolume();
        });
      }
    }

    /* ---- Locución on/off ---- */
    function initNarrateToggle() {
      var btn = document.getElementById('d-narrate');
      if (!btn) return;
      // sin Web Speech API el botón no tiene nada que controlar (el
      // header-boilerplate lo trae hidden justamente por esto)
      if (!('speechSynthesis' in global)) { btn.hidden = true; return; }
      // BUG REAL (encontrado recién en el primer curso que usó el kit
      // end-to-end, "Uso de sucursales 3 - NOA"): el boilerplate trae
      // el botón `hidden` a propósito para el caso SIN soporte — pero
      // nada lo des-ocultaba en el caso CON soporte (el caso normal).
      // El botón quedaba invisible SIEMPRE, en cualquier navegador,
      // aunque Web Speech API estuviera disponible.
      btn.hidden = false;
      function sync() {
        var on = global.Narrador.isNarrating();
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.setAttribute('aria-label', on ? 'Silenciar la locución' : 'Escuchar la diapositiva');
      }
      sync();

      /* ---- Pausar y REANUDAR, no releer (kit-base v1.9.72, §7.18 K9) ----
         Reporte del cliente: silenciar y volver a activar "no retoma en
         el punto actual ni queda mudo — arranca de nuevo desde el
         principio". En una diapositiva larga eso significa volver a
         escuchar todo, y era exactamente lo que hacía el kit: al
         prender llamaba a `speakSlide()`, o sea siempre desde la frase 0.

         Lo llamativo es que el kit YA TENÍA todo para reanudar y no lo
         usaba — no hace falta agregarle nada a `narrador.js`:
         · `cancel()` no borra `estadoActual` (está así a propósito,
           para que "Repetir" siga sirviendo después de cortar);
         · `progreso()` devuelve `{index, total, terminado}`;
         · `seek(i)` retoma desde la frase `i`, y ya lo usan la línea de
           tiempo del panel y `refreshVolume()`.

         Tres casos, y solo uno vuelve a hablar desde cero:
         · se cortó a mitad → se retoma en esa frase;
         · ya había terminado → SILENCIO. Es una decisión de producto,
           no un descuido: releer la diapositiva entera es justamente el
           "arranca de nuevo" que se reportó como bug. Para volver a
           escucharla está "Repetir", en el mismo panel;
         · se navegó estando en silencio → se lee la diapositiva que
           está EN PANTALLA, desde el principio; nunca la anterior, que
           es la otra mitad del reporte. */
      var pausa = null;
      document.addEventListener('slidechange', function () { pausa = null; });

      btn.addEventListener('click', function () {
        // Mismo criterio que Sonido: clic 1 abre el panel, clic 2 apaga.
        if (!panelYaAbierto(btn)) return;
        var on = !global.Narrador.isNarrating();
        var cur = global.motor && global.motor.current();
        var idActual = cur ? cur.getAttribute('data-slide') : null;
        if (!on) {
          var pr = global.Narrador.progreso();
          pausa = (pr && idActual)
            ? { slide: idActual, index: pr.index, terminado: !!pr.terminado }
            : null;
        }
        global.Narrador.setNarrating(on);
        sync();
        /* Repintar el panel de "Avance": su primer renglón dice "La
           locución está apagada" cuando corresponde, y `setNarrating()`
           no emite `narracionprogreso` por su cuenta si la narración ya
           había terminado — sin esto el texto quedaba viejo hasta la
           próxima frase (kit-base v1.9.71). */
        document.dispatchEvent(new CustomEvent('narracionprogreso', {
          detail: global.Narrador.progreso()
        }));
        if (on) {
          if (pausa && pausa.slide === idActual && !pausa.terminado) {
            global.Narrador.seek(pausa.index);   // reanudar donde se cortó
          } else if (!(pausa && pausa.slide === idActual && pausa.terminado)) {
            speakSlide(global.motor.current());  // nunca sonó acá, o se navegó
          }
          /* el caso restante —misma diapositiva, ya terminada— queda en
             silencio a propósito (ver arriba). */
          pausa = null;
        }
      });
    }

    /* ---- Narrar al CAMBIAR de diapositiva (kit-base v1.9.71, §7.17) ----
       BUG REAL, y de los peores que tuvo este kit porque no se ve:
       hasta v1.9.70 `speakSlide` se usaba en UN solo lugar —el click
       del botón de arriba— y nadie narraba al pasar de diapositiva.
       O sea: un curso recién generado, con la locución prendida,
       quedaba MUDO en todas sus diapositivas. Los pop-ups sí narraban
       (`initPopupNarration` tiene su propio enganche), lo que hacía la
       falla todavía más difícil de leer: no era "la locución no anda",
       era "anda a veces". Sin error, sin warning, sin nada en consola.
       Lo encontró un curso auditando la locución de punta a punta con
       `Narrador.speak` interceptado: 14 diapositivas, 14 mudas.

       Por qué acá y no en la plantilla de `curso.js`: el kit ya recibe
       `speakSlide` por opciones, así que ya sabe narrar; lo único que
       faltaba era el disparador. Dejarlo como línea a copiar en cada
       curso es exactamente la clase de olvido que un kit existe para
       hacer imposible (§1). Se engancha SOLO si el curso pasó
       `speakSlide` — un curso sin locución no cambia en nada.

       El `cancel()` + los 220ms no son prolijidad, son dos bugs
       distintos que se arreglan con el mismo timer:

       1. "La locución sigue al pasar de diapo" (reporte de cliente).
          NO es doble narración: se midió, `speak()` se llama una sola
          vez por diapositiva. Es la latencia del `speechSynthesis
          .cancel()` de Chrome, que no siempre corta en el acto la
          frase que ya está sonando — y menos con las voces DE RED que
          este kit prioriza (§6.7/§6.54). Adelantar el `cancel()` le da
          margen para cortar antes de que arranque la nueva.
       2. Pasar cinco diapositivas rápido encolaba cinco narraciones.
          Con el `clearTimeout`, sobrevive una sola: la de donde el
          alumno efectivamente quedó.

       El curso puede afinar la espera con `speakDelayMs`, o desactivar
       el enganche entero con `speakOnSlideChange:false` si por algún
       motivo quiere manejarlo a mano. */
    function initNarrateOnSlideChange() {
      if (!opts.speakSlide) return;                  // curso sin locución: nada que enganchar
      if (opts.speakOnSlideChange === false) return; // opt-out explícito
      var espera = typeof opts.speakDelayMs === 'number' ? opts.speakDelayMs : 220;
      var timer = null;
      var introPendiente = null;   // id del pop-up de intro en camino, o null

      /* ---- LA DIAPOSITIVA CON `data-intro-popup` SE NARRABA A MEDIAS
         Y DESPUÉS QUEDABA MUDA (kit-base v1.9.84, K2) ----
         Lo encontró `locucion-control`, no una persona: no da error de
         consola, no se ve nada roto, y pasó por tres cursos sin que
         nadie lo reportara.

         La secuencia medida, en una diapositiva que abre un pop-up al
         entrar:

           t=0      el motor emite `slidechange`
           t=220ms  acá se narra la diapositiva (speakDelayMs)
           t=350ms  el motor abre el `data-intro-popup`
           t=350ms  `initPopupNarration` narra el pop-up, y su `speak()`
                    llama a `cancel()`: CORTA la locución de la diapo a
                    mitad de la primera palabra
           después  el alumno cierra el pop-up → `popupclose` → el kit
                    solo hace `cancel()`. La diapositiva NUNCA se retoma.

         Neto para el alumno: un arranque en falso de ~130ms y, de ahí
         en más, silencio sobre un contenido escrito para narrarse.

         La regla queda simple: si hay un pop-up de intro en camino, ESE
         pop-up es la introducción de la diapositiva — que narre él — y
         la diapositiva se narra al cerrarlo, que es cuando el alumno
         está listo para escucharla. El dato "¿va a abrirse ahora?" lo
         trae `slidechange` desde v1.9.84 (motor-slides.js). */
      document.addEventListener('slidechange', function (e) {
        if (!global.Narrador || !global.Narrador.isNarrating()) return;
        if (global.Narrador.cancel) global.Narrador.cancel();
        clearTimeout(timer);
        introPendiente = (e.detail && e.detail.introPopup) || null;
        if (introPendiente) return;
        timer = setTimeout(function () {
          if (global.motor && global.Narrador.isNarrating()) speakSlide(global.motor.current());
        }, espera);
      });

      /* Los 260ms dejan que `initPopupNarration` (coto-ui.js) haga su
         `cancel()` de `popupclose` primero: los dos escuchan el mismo
         evento y sin la espera este `speak()` se cancelaría a sí mismo.
         Y se comprueba que el alumno siga en la MISMA diapositiva: si
         cerró el pop-up y navegó en el mismo gesto, manda el
         `slidechange`, no esto. */
      document.addEventListener('popupclose', function (e) {
        if (!introPendiente || !e.detail || e.detail.id !== introPendiente) return;
        introPendiente = null;
        if (!global.Narrador || !global.Narrador.isNarrating()) return;
        var sl = global.motor && global.motor.current();
        if (!sl) return;
        clearTimeout(timer);
        timer = setTimeout(function () {
          if (global.motor && global.Narrador.isNarrating() && global.motor.current() === sl) {
            speakSlide(sl);
          }
        }, 260);
      });
      repararPrimeraLocucion();
    }

    /* ---- LA PRIMERA DIAPOSITIVA DE CUALQUIER CURSO QUEDABA MUDA ----
       kit-base v1.9.81, relayado desde el primer simulador.

       No es un bug del curso ni de este archivo: los navegadores
       BLOQUEAN `speechSynthesis.speak()` hasta que hay un gesto real
       del usuario, y el primer `slidechange` lo emite el constructor
       del motor — mucho antes de que el alumno toque nada. O sea que
       la locución de la portada se pedía, el navegador la tiraba, y
       nadie se enteraba: el resto del curso narraba bien, así que
       parecía un problema de ESA diapositiva.

       El kit ya tenía el guard equivalente para los SONIDOS
       (`huboGesto`, coto-ui.js) pero no para la voz.

       Se repara al primer gesto real, y SOLO si el alumno sigue en la
       misma diapositiva: si el gesto fue tocar "Empezar", el
       `slidechange` que viene atrás corta esto y narra la que
       corresponde, que es el comportamiento correcto. */
    function repararPrimeraLocucion() {
      var hecho = false;
      function reparar() {
        if (hecho) return;
        hecho = true;
        if (!global.Narrador || !global.motor) return;
        /* Lo PRIMERO: gastar este gesto en desbloquear el motor de voz
           (kit-base v1.9.100). Va antes de cualquier `return` de los que
           siguen, porque el caso que más importa es justamente uno de
           ellos: una portada que es video de fondo no tiene texto que
           narrar, así que `speakSlide` de abajo no habla — y sin esto el
           gesto se desperdiciaba y la locución de la diapositiva
           siguiente llegaba 220ms tarde, o sea fuera del gesto, y Safari
           la descartaba. Ver el comentario largo de `desbloquear()` en
           narrador.js. */
        if (global.Narrador.desbloquear) global.Narrador.desbloquear();
        if (global.Narrador.isNarrating && !global.Narrador.isNarrating()) return;
        var inicial = global.motor.slides[0];
        var cur = global.motor.current();
        if (!cur || cur !== inicial) return;   // ya se movió: no es esto
        speakSlide(cur);
      }
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
        document.addEventListener(ev, reparar, { capture: true, once: true });
      });
    }

    /* ---- Línea de tiempo de la locución (pedido de producto, kit-base
       v1.9.35) ----
       Panel bajo el botón "Locución": progreso + arrastrar para saltar
       + repetir. La granularidad es por FRASE (el mismo fragmentado de
       `chunkText` en narrador.js), no por palabra — Web Speech API no
       da un "segundo exacto" de por dónde va la síntesis, y encima esa
       precisión es más floja todavía con las voces DE RED (Google/
       Microsoft online) que este kit ya prioriza (§6.7/§6.54) — un
       progreso fino prometería algo que no se puede garantizar en la
       mayoría de los navegadores reales. Por frase sí es 100% confiable
       (`onend`/`onerror` de cada utterance SIEMPRE disparan). Todo el
       estado real vive en narrador.js (`seek`/`repeat`/`progreso`) —
       esto solo pinta lo que llega por el evento `narracionprogreso` y
       traduce los gestos del alumno a llamadas al motor de voz. */
    function mmss(seg) {
      seg = Math.max(0, Math.round(seg || 0));
      var m = Math.floor(seg / 60), s2 = seg % 60;
      return m + ':' + (s2 < 10 ? '0' : '') + s2;
    }

    function initNarrateTimeline() {
      var range = document.getElementById('d-narr-range');
      var timeEl = document.getElementById('d-narr-time');
      var totalEl = document.getElementById('d-narr-total');
      var replayBtn = document.getElementById('d-narr-replay');
      var status = document.getElementById('d-narr-status');
      var estado = document.getElementById('d-narr-estado');
      var hint = document.querySelector('.d-narr-hint');
      /* Reproducir / Detener (kit-base v1.9.112): un botón que alterna.
         Opcional — un curso con el marcado viejo, sin `#d-narr-toggle`,
         queda exactamente como estaba. */
      var toggleBtn = document.getElementById('d-narr-toggle');
      if (!range || !replayBtn || !('speechSynthesis' in global)) return;

      /* La parte recorrida de la barra va pintada de azul, como en el
         canvas del rediseño (v1.9.127): un <input type=range> no la
         pinta solo, la lee de `--pct`. */
      function llenar() {
        var max = parseFloat(range.max) || 0;
        range.style.setProperty('--pct', (max > 0 ? Math.min(100, (parseFloat(range.value) || 0) / max * 100) : 0) + '%');
      }
      var arrastrando = false;
      range.addEventListener('pointerdown', function () { arrastrando = true; });
      ['pointerup', 'pointercancel'].forEach(function (ev) {
        range.addEventListener(ev, function () { arrastrando = false; });
      });

      /* Sin "frase N de M": pedido explícito del cliente — sonaba como
         si la locución tuviera "partes" separadas, cuando en realidad
         es un audio continuo. Alcanza con la barra (arrastrable, salta
         al soltar) + el botón "Repetir"; el conteo de fragmentos sigue
         existiendo puertas adentro (chunkText, narrador.js) pero ya no
         se le muestra al alumno.

         DOS CLIENTES, DOS PEDIDOS OPUESTOS (kit-base v1.9.71, §7.17).
         Un segundo curso reportó lo contrario: "muchos no entendían
         que la barra de la locución era para adelantar, pensaban que
         era el sonido", y propuso justamente reponer el contador
         ("Frase 4 de 12"). Los dos reportes son ciertos, pero no dicen
         lo mismo: el primero objeta EXPONER LOS FRAGMENTOS, el segundo
         señala que la barra no se distingue de la de volumen. Reponer
         el contador arreglaría el segundo reintroduciendo el primero.

         Así que se resuelve el problema real —la ambigüedad contra el
         panel de al lado— sin volver a mostrar el conteo: título
         "Avance" haciendo par con "Volumen", una línea que dice qué
         hace la barra, la barra con marcas (visualmente distinta de la
         pista continua del volumen) y el estado escrito en palabras.
         Si algún día se decide que el contador vuelve, es una línea
         acá abajo — pero que sea una decisión tomada, no un olvido. */
      function pintar(p) {
        var hay = !!(p && p.total);
        range.disabled = !hay;
        replayBtn.disabled = !hay;
        /* "Hablando" sale del mismo `progreso()` que mueve la barra, así
           los botones y la barra no pueden contar cosas distintas. */
        var encendida = !!(global.Narrador && global.Narrador.isNarrating && global.Narrador.isNarrating());
        var hablando = hay && !p.terminado;
        if (toggleBtn) {
          toggleBtn.disabled = !hay || !encendida;
          toggleBtn.classList.toggle('is-hablando', hablando);
          toggleBtn.setAttribute('aria-label', hablando ? 'Detener la locución' : 'Reproducir la locución');
          toggleBtn.title = hablando ? 'Detener' : 'Reproducir';
        }

        /* El estado, en palabras. Antes, con la locución apagada o en
           una diapositiva que por diseño no narra (`--bg-video`), el
           panel mostraba un slider gris y NADA más: no había forma de
           distinguir "está apagado" de "acá no hay nada que escuchar"
           de "está roto". */
        if (estado) {
          if (global.Narrador && global.Narrador.isNarrating && !global.Narrador.isNarrating()) {
            estado.textContent = 'La locución está apagada';
          } else if (!hay) {
            estado.textContent = 'Esta diapositiva no tiene locución';
          } else if (p.detenido) {
            estado.textContent = 'Locución detenida';
          } else if (p.terminado) {
            estado.textContent = 'Locución terminada';
          } else {
            estado.textContent = 'Escuchando esta diapositiva';
          }
        }
        if (hint) hint.hidden = !hay;
        if (!hay) {
          if (status) status.hidden = true;
          if (!arrastrando) { range.max = 0; range.value = 0; }
          if (timeEl) timeEl.textContent = '0:00';
          if (totalEl) totalEl.textContent = '0:00';
          llenar();
          return;
        }
        /* BUG REAL reportado por el cliente: *"no está funcionando la
           barra para adelantar la locución"*. Funcionaba, pero casi
           nunca se notaba: el recorrido era `total - 1` FRAGMENTOS, y
           medido sobre un curso real 5 de 22 diapositivas con locución
           quedaban con `max = 0` (el pulgar NO se puede mover) o
           `max = 1` (dos posiciones, nada en el medio), con una mediana
           de 3 fragmentos = 2 pasos de recorrido. Parecía una barra rota.
           Ahora el recorrido son SEGUNDOS: siempre hay decenas de
           posiciones, el pulgar avanza solo mientras se escucha, y el
           salto cae al comienzo de la frase que contiene ese segundo
           (lo único que Web Speech API permite). */
        if (!arrastrando) {
          range.max = String(Math.max(0.1, p.segTotal || 0));
          range.value = String(Math.min(p.seg || 0, p.segTotal || 0));
          if (timeEl) timeEl.textContent = mmss(p.seg || 0);
        }
        if (totalEl) totalEl.textContent = mmss(p.segTotal || 0);
        if (status) status.hidden = !!p.terminado;
        llenar();
      }
      pintar(global.Narrador.progreso());
      document.addEventListener('narracionprogreso', function (e) { pintar(e.detail); });

      // `change` (no `input`): saltar recién al SOLTAR, no en cada
      // pixel arrastrado — cada salto corta y vuelve a arrancar una
      // utterance, encadenar eso en cada frame se escucharía como un
      // tartamudeo, no como un arrastre suave.
      range.addEventListener('input', function () {
        // Mientras se arrastra solo se mueve el reloj: cortar y volver a
        // hablar en cada píxel del recorrido sería un tartamudeo.
        if (timeEl) timeEl.textContent = mmss(parseFloat(range.value) || 0);
        llenar();
      });
      range.addEventListener('change', function () {
        global.Narrador.seekSeg(parseFloat(range.value) || 0);
      });

      /* El reloj corre solo. Sin esto la barra solo se movería cuando
         cambia de fragmento —o sea, a los saltos y muy de vez en
         cuando—, que es justamente lo que hacía parecer que no
         funcionaba. 250ms es suficiente para que se vea continuo sin
         despertar al navegador todo el tiempo. */
      setInterval(function () {
        if (arrastrando || !global.Narrador || !global.Narrador.progreso) return;
        var p = global.Narrador.progreso();
        if (!p || !p.total || p.terminado) return;
        pintar(p);
      }, 250);
      replayBtn.addEventListener('click', function () { global.Narrador.repeat(); });
      if (toggleBtn) toggleBtn.addEventListener('click', function () {
        var p = global.Narrador.progreso();
        if (p && !p.terminado) global.Narrador.detener(); else global.Narrador.reproducir();
      });
    }

    /* ---- La gracia de hover SE FUE, y con ella `attachHoverGrace` ----
       kit-base v1.9.89. Existía para un problema que ya no existe: los
       popovers abrían al pasar el mouse, y entre el botón y el panel
       hay un hueco real (`top:calc(100%+10px)` en los de audio,
       `bottom:calc(100%+14px)` en los flotantes) que el `:hover` de CSS
       no perdona ni un frame. La gracia daba 1,5 s para cruzarlo.

       Desde esta vuelta NINGÚN popover abre por hover —los cuatro son
       solo por clic, pedido del cliente para que se comporten igual—
       así que no hay hueco que cruzar: el panel queda pineado con
       `.is-open` y no se cierra por mover el mouse.

       ⚠️ Salió GRATIS, y conviene saberlo: el clic en Sonido/Locución
       YA abría el panel además de mutear o narrar, porque
       `initPinnedPopover` engancha ese mismo `click`. Medido antes de
       tocar nada. O sea que sacar el hover no quita ninguna función; lo
       único que desaparece es un camino de más.

       Mantener el mecanismo habría dejado código muerto y una clase
       (`.is-hover`) que el CSS seguiría prometiendo sin que nadie la
       ponga nunca. Si algún día vuelve un popover por hover, esto se
       recupera del historial: no es una decisión sobre la técnica, es
       que hoy no tiene consumidores. */

    /* ---- Mecanismo genérico de popover "pinned" (kit-base v1.9.39) ----
       `initAudioPopovers()` e `initFabPopovers()` cablean casi la misma
       lógica cada uno por su cuenta (pin por click, un solo abierto a la
       vez, gracia de hover, cierre por fuera/slidechange) — duplicada
       significa que un bug encontrado en una (ej. la gracia de hover de
       §6.58) hay que acordarse de portarlo a mano a la otra. Un solo
       mecanismo reduce esa superficie, y cualquier popover NUEVO que
       cuelgue del chrome (mobile incluido, CLAUDE.md §6.10.1 punto 4)
       lo hereda gratis en vez de reinventarlo.

       `items`: elementos contenedores, cada uno con un botón disparador
       adentro (`opts.btnSelector`) y la clase `is-open` que el CSS ya
       sabe interpretar. `opts.onOpen(item)`, si se pasa, corre al abrir
       por click/hover/foco Y en cada resize mientras esté abierto — es
       el gancho de posicionamiento dinámico que necesita
       `initAudioPopovers` (§6.55) y que `initFabPopovers` no necesita
       (anclaje fijo). Devuelve `{ closeAll }` para que el que llama
       pueda cerrar todo desde un botón propio (ej. "volver a ver la
       introducción" en el FAB de Ayuda). */
    /* Gracia de hover antes de cerrar un popover "pinned" al salir del
       mouse — bajada de 3s a 1,5s (kit-base v1.9.40): cruzar el hueco
       real entre botón y panel (10-14px) lleva ~50ms, así que 3s alcanzaban
       de sobra para el gesto pero dejaban el panel colgado mucho después
       de que el alumno ya siguió con otra cosa. Un solo lugar para el
       número — cualquier ajuste futuro se hace acá, no en cada llamada. */

    /* Registro de TODOS los popovers pinned de la página, entre
       llamadas distintas a `initPinnedPopover()` (kit-base v1.9.71,
       §7.17). Existe por un bug real: la gracia de hover de 1,5s está
       bien para UN panel, pero nadie cerraba al hermano, así que barrer
       el mouse entre dos controles pegados dejaba LOS DOS paneles
       abiertos durante todo ese tiempo. Y como el chrome llama a este
       helper dos veces —una para el par Sonido/Locución de la barra,
       otra para los flotantes Ayuda/Configuración— cerrar solo dentro
       de `items` no alcanzaba: quedaba uno arriba y otro abajo.

       Por eso el registro es de módulo y no de instancia: los cuatro
       controles se tratan como UN conjunto, y nunca hay dos paneles
       abiertos en pantalla. */
    var pinnedTodos = [];
    function cerrarOtrosPinned(actual) {
      pinnedTodos.forEach(function (it) {
        if (it === actual) return;
        it.classList.remove('is-open');
        /* ⚠️ SACAR LAS CLASES NO ALCANZA (kit-base v1.9.85). El CSS abre
           el panel con tres condiciones en OR —`:focus-within` ∨
           `.is-open`— y `:focus-within` no se saca con
           `classList`: hay que mover el foco.

           El caso medido, y es el que reportó el cliente ("sonido y
           locución se pisan"): clic en Locución —que la fija Y le deja
           el foco al botón—, después el mouse pasa por Sonido. Sonido
           abre por hover, este cierre le saca las clases a Locución… y
           Locución sigue abierta por `:focus-within`. **Dos paneles en
           pantalla a la vez**, que es justo lo que este mecanismo
           existe para impedir.

           Es el mismo motivo del `btn.blur()` del segundo clic (§7.19
           A5): ahí se había visto para el propio control y no para el
           hermano. */
        if (it.contains(document.activeElement) && document.activeElement.blur) {
          document.activeElement.blur();
        }
      });
    }

    function initPinnedPopover(items, opts) {
      opts = opts || {};
      function closeAll() { items.forEach(function (it) { it.classList.remove('is-open'); }); }
      if (!items.length) return { closeAll: closeAll };

      items.forEach(function (it) {
        var btn = it.querySelector(opts.btnSelector);
        if (!btn) return;
        btn.addEventListener('click', function () {
          var yaAbierto = it.classList.contains('is-open');
          closeAll();
          if (!yaAbierto) {
            it.classList.add('is-open');
            if (opts.onOpen) opts.onOpen(it);
          } else if (btn.blur) {
            /* Segundo clic = cerrar. Sacar la clase NO alcanza: el CSS
               abre el panel con dos condiciones en OR
               (`:focus-within` ∨ `.is-open`) y el clic
               acaba de dejar el foco EN EL BOTÓN, que está adentro del
               control — así que `:focus-within` lo mantiene abierto y
               había que clickear afuera para cerrarlo (reporte del
               cliente, kit-base v1.9.72, §7.19 A5).
               Es el mismo motivo por el que el manejador de `Escape`
               de más abajo hace `blur()`; faltaba acá. */
            btn.blur();
          }
        });
        if (opts.onOpen) {
          it.addEventListener('mouseenter', function () { opts.onOpen(it); });
          it.addEventListener('focusin', function () { opts.onOpen(it); });
        }
        /* Entrar en uno cierra a todos los demás, de cualquier grupo.
           `focusin` además del `click` porque el CSS abre también por
           `:focus-within`, y ese camino NO pasa por el handler de
           arriba: tabular hasta un control con otro panel pineado
           dejaría dos abiertos. (`mouseenter` sigue en la lista por un
           caso que ya no es el hover de apertura: el mouse entrando a
           un popover pineado mientras otro quedó abierto por foco.) */
        ['mouseenter', 'focusin', 'click'].forEach(function (ev) {
          it.addEventListener(ev, function () { cerrarOtrosPinned(it); });
        });
        pinnedTodos.push(it);
      });
      document.addEventListener('click', function (e) {
        items.forEach(function (it) {
          if (!it.contains(e.target)) it.classList.remove('is-open');
        });
      });
      /* Esc también cierra. Faltaba: el panel se cerraba con clic
         afuera y al cambiar de diapositiva, pero no con Esc — y el
         texto de Ayuda del propio kit promete "Esc cierra cualquier
         ventana emergente". Afecta a los DOS consumidores de este
         helper: los popovers de audio de la barra (Sonido/Locución) y
         los flotantes de Ayuda/Configuración.

         Ojo con el `blur()`: el CSS abre el panel también con
         `:focus-within` (.d-audio-ctl / .d-fab), así que sacar las
         clases NO alcanza si el foco quedó adentro — por ejemplo tras
         tocar una pregunta del acordeón de Ayuda, o el slider de
         volumen. Sin soltar el foco, el panel se queda abierto y
         encima sigue interceptando clics sobre lo que tapa. */
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var foco = document.activeElement;
        var dentro = items.some(function (it) { return it.contains(foco); });
        if (dentro && foco && foco.blur) foco.blur();
        closeAll();
      });
      document.addEventListener('slidechange', closeAll);
      if (opts.onOpen) {
        window.addEventListener('resize', function () {
          items.forEach(function (it) { if (it.classList.contains('is-open')) opts.onOpen(it); });
        });
      }
      return { closeAll: closeAll };
    }

    /* ---- Paneles de audio (volumen / línea de tiempo): el tap fija
       el panel abierto — mismo criterio que `initHotspots` (coto-
       hotspots.js): el hover/foco ya los abre solos por CSS
       (`:hover`/`:focus-within` en `.d-audio-ctl`), pero en touch no
       existe el hover (CLAUDE.md §6.10.1 regla 2), así que hace falta
       un gesto explícito que los deje abiertos para poder tocar el
       slider de adentro. */
    function initAudioPopovers() {
      var ctls = Array.prototype.slice.call(document.querySelectorAll('.d-audio-ctl'));
      if (!ctls.length) return;

      /* El botón de audio no siempre está cerca del borde derecho —
         en mobile (≤799px, ver coto-player-chrome.css) el layout de
         2 filas lo manda a la IZQUIERDA. Un anclaje fijo por CSS
         asumía mal, así que acá se mide la posición REAL del botón
         en cada apertura y se corrige el `left` inline (con `--flecha-
         left` para que la flechita siga apuntando al botón), dejando
         el `left:50%` del CSS como fallback sin JS. */
      function posicionar(ctl) {
        var pop = ctl.querySelector('.d-audio-pop');
        if (!pop) return;
        var margen = 8;
        var anchoVentana = document.documentElement.clientWidth || window.innerWidth;
        var rectCtl = ctl.getBoundingClientRect();
        var anchoPop = pop.getBoundingClientRect().width;
        var centroCtl = rectCtl.left + rectCtl.width / 2;
        var izqMax = Math.max(margen, anchoVentana - anchoPop - margen);
        var izq = Math.min(Math.max(centroCtl - anchoPop / 2, margen), izqMax);
        pop.style.left = (izq - rectCtl.left) + 'px';
        pop.style.transform = 'none';
        var flecha = Math.min(Math.max(centroCtl - izq, 14), Math.max(14, anchoPop - 14));
        pop.style.setProperty('--flecha-left', flecha + 'px');
      }

      initPinnedPopover(ctls, { btnSelector: '.d-iconbtn', onOpen: posicionar });
    }

    /* ---- Botones flotantes: Ayuda + Configuración (kit-base v1.9.36,
       CLAUDE.md §6.57) ----
       Mismo mecanismo "pinned" que initAudioPopovers (hover/foco en
       desktop, clic fijo en táctil) — pero sin el posicionamiento
       dinámico de ese: acá el anclaje es SIEMPRE abajo a la derecha
       (nunca se mueve entre breakpoints como el grupo de audio), así
       que un `max-width` en CSS alcanza para no salirse en mobile. */
    function initFabPopovers() {
      var stack = document.querySelector('[data-fab-stack]');
      if (!stack) return;
      var fabs = Array.prototype.slice.call(stack.querySelectorAll('[data-fab-ctl]'));
      if (!fabs.length) return;

      var pinned = initPinnedPopover(fabs, { btnSelector: '.d-fab-btn' });

      /* Aro de "hay algo acá": un pulso corto una sola vez por visita,
         apenas carga el curso — nunca en loop (sería ruido permanente,
         no un llamado de atención). Se apaga sola al terminar la
         animación (2 vueltas de 1.6s, ver keyframes en el CSS) o si el
         alumno ya interactuó con cualquiera de los dos botones antes. */
      fabs.forEach(function (fab) { fab.classList.add('is-pulsing'); });
      setTimeout(function () {
        fabs.forEach(function (fab) { fab.classList.remove('is-pulsing'); });
      }, 3300);
      fabs.forEach(function (fab) {
        var btn = fab.querySelector('.d-fab-btn');
        if (btn) btn.addEventListener('click', function () {
          fabs.forEach(function (o) { o.classList.remove('is-pulsing'); });
        }, { once: true });
      });

      /* Acordeón de "Ayuda": una pregunta abierta a la vez. */
      var acc = stack.querySelector('[data-fab-acc]');
      if (acc) {
        var items = Array.prototype.slice.call(acc.querySelectorAll('.d-fab-acc-item'));
        items.forEach(function (item) {
          var q = item.querySelector('.d-fab-acc-q');
          if (!q) return;
          q.addEventListener('click', function () {
            var yaAbierta = item.classList.contains('is-open');
            items.forEach(function (o) { o.classList.remove('is-open'); });
            if (!yaAbierta) item.classList.add('is-open');
          });
        });
      }

      /* "Volver a ver la introducción": además de abrir el pop-up
         "instrucciones" (ya cableado solo por el motor vía
         data-popup-trigger), cierra el propio flotante de Ayuda —
         si no, queda "pinned" abierto detrás del modal. */
      var replayBtn = stack.querySelector('.d-fab-replay');
      if (replayBtn) replayBtn.addEventListener('click', pinned.closeAll);
    }

    /* ---- Selector manual de voz ----
       narrador.js expone pickVoice/setManualVoice justamente para esto:
       la elección automática es "mejor esfuerzo" y depende de qué voces
       tenga el dispositivo del alumno. */
    function initVoicePicker() {
      var field = document.getElementById('d-voice-field');
      var sel = document.getElementById('d-voice-select');
      if (!field || !sel || !('speechSynthesis' in global)) return;
      function fill() {
        var voices = speechSynthesis.getVoices().filter(function (v) { return /^es/i.test(v.lang); });
        if (!voices.length) return;
        var current = global.Narrador.pickVoice();
        sel.textContent = '';
        var auto = document.createElement('option');
        auto.value = ''; auto.textContent = 'Voz recomendada (automática)';
        sel.appendChild(auto);
        voices.forEach(function (v) {
          var o = document.createElement('option');
          o.value = v.name + '|' + v.lang;
          o.textContent = v.name + ' (' + v.lang + ')';
          if (current && v.name === current.name && v.lang === current.lang) o.selected = true;
          sel.appendChild(o);
        });
        field.hidden = false;
      }
      fill();
      speechSynthesis.addEventListener('voiceschanged', fill);
      sel.addEventListener('change', function () {
        var voices = speechSynthesis.getVoices();
        var v = voices.find(function (x) { return (x.name + '|' + x.lang) === sel.value; });
        global.Narrador.setManualVoice(v || null);
        global.Narrador.speak('Esta es la voz que vas a escuchar durante el curso.', 'other');
      });

      /* "Escuchar un ejemplo": mismo texto de prueba de arriba, pero
         a demanda — el cambio de <select> ya lo dispara solo, esto
         cubre el caso de querer re-escuchar la voz YA elegida sin
         tener que tocar el selector. */
      var listenBtn = document.getElementById('d-voice-listen');
      if (listenBtn) listenBtn.addEventListener('click', function () {
        global.Narrador.speak('Esta es la voz que vas a escuchar durante el curso.', 'other');
      });
    }

    /* ---- Control manual de velocidad de la locución ----
       Desde kit-base v1.9.82 es la ÚNICA velocidad: narrador.js narra a
       1.0x con cualquier voz y este slider es la preferencia del alumno
       (§6.7). Antes había además un ajuste automático por calidad de
       voz —1.0x/1.15x/1.22x— y esto era un multiplicador sobre él; se
       sacó porque hacía que la misma locución corriera a tres
       velocidades distintas según el paquete de idioma del alumno, sin
       que él tocara nada. Vive en el
       mismo pop-up de "Ayuda" que el selector de voz, no en la barra
       superior: la barra ya tuvo demasiadas rondas de bugs de layout
       (CLAUDE.md §6.6/§6.15/§6.16) como para sumarle un control más. */
    /* ---- La velocidad de la locución, en DOS lugares ----
       kit-base v1.9.88. Pedido del cliente: *"hoy está en config, tal
       vez debamos pasarlo al botón de locución para que el usuario lo
       encuentre más fácil, o ponerlo en ambos lugares"*. Va en los dos:

         · Config (tuerca)      → slider fino, `initRatePicker()`
         · Panel de Locución    → atajo −/valor/+, `initRateQuick()`

       ⚠️ Dos controles sobre el MISMO dato es la receta clásica de
       "cambié uno y el otro sigue mostrando lo viejo". Acá no puede
       pasar: NINGUNO GUARDA ESTADO PROPIO. Los dos escriben con
       `Narrador.setRateFactor()` —única fuente de verdad, que además ya
       persiste— y los dos se repintan desde `getRateFactor()` a través
       de `avisarRate()`. Un tercer control solo tiene que sumarse a
       `oyentesRate`. */
    var oyentesRate = [];
    function avisarRate() {
      var f = global.Narrador.getRateFactor();
      oyentesRate.forEach(function (fn) { try { fn(f); } catch (e) {} });
    }
    function aplicarRate(f) {
      global.Narrador.setRateFactor(f);
      avisarRate();
    }
    /* El rótulo se calcula contra el DEFAULT del kit, no contra un 1
       escrito a mano: con el default en 1.15, un "1.15x (más rápido)"
       sería mentira — es la velocidad normal. */
    function etiquetaRate(f) {
      var base = global.Narrador.getRateDefault ? global.Narrador.getRateDefault() : 1;
      if (f <= base - 0.1) return f.toFixed(2) + 'x (más lento)';
      if (f >= base + 0.1) return f.toFixed(2) + 'x (más rápido)';
      return f.toFixed(2) + 'x (normal)';
    }

    function initRatePicker() {
      var field = document.getElementById('d-rate-field');
      var range = document.getElementById('d-rate-range');
      var out = document.getElementById('d-rate-value');
      if (!field || !range || !out || !('speechSynthesis' in global)) return;
      oyentesRate.push(function (f) { range.value = f; out.textContent = etiquetaRate(f); });
      avisarRate();
      field.hidden = false;
      var debounceTimer = null;
      range.addEventListener('input', function () {
        var f = parseFloat(range.value);
        aplicarRate(f);
        // Debounce: no interrumpir la narración en cada micro-paso del
        // slider, solo cuando el alumno se queda quieto un instante —
        // mismo criterio que cualquier control que dispara una acción
        // costosa (acá, cortar y re-empezar una frase hablada).
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          global.Narrador.speak('Así de rápido vas a escuchar la locución.', 'other');
        }, 400);
      });
    }

    /* Atajo de velocidad dentro del panel de "Locución": −/valor/+, de
       a 0,05x, con los mismos topes que el slider (0,75–1,40). Los
       botones se deshabilitan en cada extremo para que el tope SE VEA,
       en vez de sentirse como un control roto. */
    function initRateQuick() {
      var caja = document.querySelector('.d-narr-rate');
      var menos = document.getElementById('d-narr-rate-down');
      var mas = document.getElementById('d-narr-rate-up');
      var val = document.getElementById('d-narr-rate-val');
      if (!caja || !menos || !mas || !val || !('speechSynthesis' in global)) return;
      var MIN = 0.75, MAX = 1.4, PASO = 0.05;
      oyentesRate.push(function (f) {
        val.textContent = f.toFixed(2).replace('.', ',') + 'x';
        menos.disabled = f <= MIN + 0.001;
        mas.disabled = f >= MAX - 0.001;
      });
      function mover(d) {
        var f = Math.round((global.Narrador.getRateFactor() + d) * 100) / 100;
        aplicarRate(Math.min(MAX, Math.max(MIN, f)));
        /* Se narra una frase de muestra, igual que el slider de Config:
           un control de velocidad sin devolución inmediata obliga a
           cambiar de diapositiva para saber si quedó bien. */
        global.Narrador.speak('Así de rápido vas a escuchar la locución.', 'other');
      }
      menos.addEventListener('click', function () { mover(-PASO); });
      mas.addEventListener('click', function () { mover(PASO); });
      caja.hidden = false;
      avisarRate();
    }

    /* ---- Restablecer voz + velocidad a los valores recomendados ----
       En vez de duplicar la lógica de setManualVoice/setRateFactor
       acá, se reusan los listeners de "change"/"input" que
       initVoicePicker/initRatePicker ya cablean — bajarle el valor al
       control y disparar el evento hace exactamente lo mismo que si
       el alumno lo hubiera tocado a mano (label, persistencia y el
       aviso hablado incluidos), sin dos caminos de código para el
       mismo resultado. */
    function initConfigReset() {
      var resetBtn = document.getElementById('d-config-reset');
      if (!resetBtn) return;
      resetBtn.addEventListener('click', function () {
        var sel = document.getElementById('d-voice-select');
        var range = document.getElementById('d-rate-range');
        if (sel) { sel.value = ''; sel.dispatchEvent(new Event('change')); }
        /* "Los valores recomendados" son los del kit, no un 1 escrito
           a mano acá: si mañana cambia el default, este botón lo sigue
           solo. Y se aplica con `aplicarRate()` para que se repinten
           LOS DOS controles de velocidad, no solo el slider. */
        var reco = global.Narrador.getRateDefault ? global.Narrador.getRateDefault() : 1;
        aplicarRate(reco);
        if (range) range.value = String(reco);
      });
    }

    /* ---- Pantalla completa ----
       Útil cuando el curso queda embebido chico dentro de la página del
       LMS. Si el navegador no soporta la API (o el iframe de Moodle no
       trae allowfullscreen), el botón directamente se oculta en vez de
       fallar visiblemente al hacer clic. */
    function initFullscreen() {
      var btn = document.getElementById('d-fullscreen');
      if (!btn) return;
      if (!document.documentElement.requestFullscreen) { btn.hidden = true; return; }

      /* ---- iOS/iPadOS: el botón VUELVE (pedido explícito) ----
         kit-base v1.9.88, y es una vuelta atrás hecha a conciencia.

         En v1.9.86 el kit lo escondía en iOS por dos reportes reales:
         el cartel *"parece que estás escribiendo mientras estás en modo
         de pantalla completa"* y la cruz de salir que Safari dibuja
         encima de la página. Ahora el cliente pide lo contrario: *"no
         aparece el ícono para ampliar la pantalla; debe estar
         disponible también en iPad"*. Pedido el cliente, se hace.

         ⚠️ Pero el motivo viejo no era inventado, y queda anotado: EL
         CARTEL DE iOS PUEDE VOLVER. Lo dispara el sistema cuando un
         control de formulario recibe el foco estando en pantalla
         completa, y el curso tiene sliders (volumen, velocidad) que el
         alumno toca a propósito. No hay forma de suprimirlo desde la
         página. Si vuelve a molestar, la conversación es esa — no es un
         bug del curso.

         Lo que SÍ se conserva es la DETECCIÓN POR CAPACIDAD, dos líneas
         más arriba: sin `requestFullscreen` (el iPhone, donde Safari
         solo hace fullscreen de `<video>`) el botón se sigue escondiendo
         solo. O sea que aparece donde de verdad funciona y no aparece
         donde sería un botón muerto — que era el problema de fondo, no
         el sistema operativo. Por eso alcanzó con BORRAR el guard de
         iOS en vez de cambiarlo por otro. */
      // Mismo bug que initNarrateToggle: el caso CON soporte nunca
      // des-ocultaba el botón, solo el caso sin soporte lo tocaba.
      btn.hidden = false;
      var lbl = btn.querySelector('.lbl');
      /* BUG REAL: los 2 SVG (ic-expand/ic-compress) ya se alternaban
         solos por CSS (`#d-fullscreen.is-on`), pero el texto visible
         ("Ampliar") y el `title`/`aria-label` quedaban fijos aunque el
         curso ya estuviera en pantalla completa — mismo botón, mismo
         nombre, dos estados. `aria-pressed` ya cambiaba (por eso un
         lector de pantalla SÍ se enteraba), pero quien lee la etiqueta
         a simple vista, no.
         El texto en sí pasó por 3 rondas de pedidos del cliente: primero
         "Salir" (cuando está maximizado, "contraer" no le sonaba bien),
         después volvió a "Contraer", y terminó en "Reducir" — empareja
         mejor con "Ampliar" (mismo registro, mismo tipo de verbo de
         acción) sin el matiz de "contraer" (que suena más a encoger
         una forma que a un estado de pantalla). El `title`/`aria-label`
         (para lectores de pantalla y tooltip) sigue algo más explícito
         que el texto corto del botón. */
      function syncLabel(on) {
        var texto = on ? 'Reducir' : 'Ampliar';
        if (lbl) lbl.textContent = texto;
        btn.title = on ? 'Salir de pantalla completa' : 'Pantalla completa';
        btn.setAttribute('aria-label', btn.title);
      }
      btn.addEventListener('click', function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen().catch(function () {});
      });
      /* ---- `<html class="d-ios d-fullscreen">` ----
         El CSS necesita saber las DOS cosas a la vez, y ninguna se
         puede preguntar desde una media query.

         BUG REAL, reporte del cliente en iPad: *"al ampliar la
         pantalla, la X para salir aparece en la esquina superior
         izquierda y tapa el ícono de las 3 líneas del índice, por lo
         que no se puede acceder al menú"*.

         ⚠️ Esa ✕ la dibuja SAFARI, no el curso: es su control de salir
         de pantalla completa, flotando encima de la página. No se puede
         mover ni esconder desde acá. Lo único que está de nuestro lado
         es NO PONER NADA DEBAJO, así que la barra de arriba se corre a
         la derecha mientras dure la pantalla completa en iOS.

         Es un gasto de espacio real, por eso está acotado a ese caso:
         en escritorio esa ✕ no existe y regalar 64 px de barra no
         tendría sentido.

         Nota de continuidad: esta detección de iOS NO es la que se
         borró en v1.9.88 — aquella escondía el botón de pantalla
         completa y el cliente pidió lo contrario. Esta no esconde
         nada, solo corre la barra. */
      var esIOS = /iP(hone|ad|od)/.test(navigator.platform || '') ||
        ((navigator.platform || '') === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
      if (esIOS) document.documentElement.classList.add('d-ios');

      document.addEventListener('fullscreenchange', function () {
        var on = !!document.fullscreenElement;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        syncLabel(on);
        document.documentElement.classList.toggle('d-fullscreen', on);
      });
    }

    /* ---- Barra de progreso arrastrable ----
       motor-slides.js ya sincroniza relleno y pulgar con la misma
       fracción (diapo 0 → 0%, última → 100%) justamente para que
       arrastrar coincida con lo que se ve (ver _syncNav). Acá va la otra
       mitad: el gesto real de arrastre/clic. Las flechas del teclado NO
       se manejan acá a propósito — el pulgar es un <span>, así que el
       listener global del motor ya las procesa; duplicarlas haría
       avanzar 2 diapositivas de una. */
    function initProgressSeek() {
      var track = document.querySelector('[data-progress-track]');
      var thumb = document.querySelector('[data-slide-thumb]');
      if (!track || !global.motor) return;
      var last = global.motor.slides.length - 1;
      if (last <= 0) return;

      /* Tope real de hasta dónde se puede arrastrar hacia ADELANTE.
         BUG REAL (encontrado comparando contra "Surtido sin venta"): sin
         este tope, arrastrar el pulgar llama a motor.go() directo,
         salteándose CUALQUIER gate de contenido — el botón "Siguiente"
         sí lo respeta porque pasa por _advance, pero el drag nunca
         pasaba por ahí. Retroceder siempre es libre. */
      function maxReachable() {
        var max = global.motor.index;
        visitedIndexes().forEach(function (i) { if (i >= 0 && i > max) max = i; });
        return max;
      }
      function indexFromEvent(e) {
        var r = track.getBoundingClientRect();
        var frac = (e.clientX - r.left) / r.width;
        frac = Math.max(0, Math.min(1, frac));
        return Math.round(frac * last);
      }
      function preview(i) {
        var pct = (i / last) * 100;
        var fill = track.querySelector('[data-slide-progress]');
        if (fill) fill.style.width = pct + '%';
        if (thumb) thumb.style.left = pct + '%';
      }
      var dragging = false;
      track.addEventListener('pointerdown', function (e) {
        dragging = true;
        track.classList.add('is-seeking');
        track.setPointerCapture(e.pointerId);
        preview(Math.min(indexFromEvent(e), maxReachable()));
      });
      track.addEventListener('pointermove', function (e) {
        if (dragging) preview(Math.min(indexFromEvent(e), maxReachable()));
      });
      track.addEventListener('pointerup', function (e) {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('is-seeking');
        var raw = indexFromEvent(e), max = maxReachable();
        if (raw > max) toast('🔒 Todavía no viste esa parte del curso');
        global.motor.go(Math.min(raw, max));
      });
      track.addEventListener('pointercancel', function () {
        dragging = false;
        track.classList.remove('is-seeking');
        global.motor.refrescarGate();
      });
      if (thumb) {
        thumb.addEventListener('keydown', function (e) {
          if (e.key === 'Home') { e.preventDefault(); global.motor.go(0); }
          else if (e.key === 'End') { e.preventDefault(); global.motor.go(Math.min(last, maxReachable())); }
        });
      }
    }

    /* ---- "Reproducir todo" (autoavance al terminar cada locución) ----
       Decisión de producto del cliente: el botón se sacó de la barra por
       bajo valor frente al ruido visual que sumaba (ver CLAUDE.md §6.6).
       Queda como no-op seguro, sin punto de entrada en el DOM, por si se
       recupera con otro disparador — no volver a agregar el botón sin
       pedido explícito. */
    function initAutoplay() {
      var btn = document.getElementById('d-autoplay');
      if (!btn) return; // sin botón en el DOM: no hace nada, a propósito
      var on = false;
      btn.addEventListener('click', function () {
        on = !on;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      document.addEventListener('slidenarrationend', function () {
        if (on) global.motor._advance(1);
      });
    }

    /* ---- Banner "Retomá donde dejaste" ----
       El curso guarda la ubicación en cmi.core.lesson_location en cada
       slidechange. Cómo usar ese dato al reingresar es una decisión de
       producto: acá NUNCA se navega solo — se ofrece y el alumno decide.
       (La 1ª versión de "Prevención cardiovascular" saltaba sola a la
       última diapositiva vista, y desorienta: el alumno abre el curso y
       aparece en el medio sin entender por qué.) Se autooculta a los 9s. */
    function initResume() {
      var bar = document.getElementById('d-resume');
      if (!bar || !global.SCORM) return;
      /* La ubicación con la que ABRIÓ el curso, no la de ahora: para
         cuando esto corre, el primer `slidechange` del motor ya escribió
         la portada encima (kit-base v1.9.117, test `retomar`). */
      var id = (global.SCORM.getLocationInicial && global.SCORM.getLocationInicial()) || global.SCORM.getLocation();
      if (!id) return;
      var first = global.motor && global.motor.slides[0];
      if (first && id === first.getAttribute('data-slide')) return; // ya está al principio
      if (!document.querySelector('[data-slide="' + id + '"]')) return;
      bar.hidden = false;
      var go = document.getElementById('d-resume-go');
      var x = document.getElementById('d-resume-x');
      if (go) go.addEventListener('click', function () { global.motor.gotoId(id); bar.hidden = true; });
      if (x) x.addEventListener('click', function () { bar.hidden = true; });
      setTimeout(function () { if (!bar.hidden) bar.hidden = true; }, 9000);
    }

    /* ---- Aviso "Girá tu dispositivo": lo decide JS, no el CSS ----
       ⚠️ BUG REAL (reporte del cliente, tablet): *"cuando giras el
       dispositivo para verlo horizontal queda la misma pantalla,
       siempre la de Girá tu dispositivo"*. El curso quedaba inusable:
       el botón Siguiente respondía, pero el cartel tapaba todo.

       La causa NO es el curso: es que Safari no vuelve a evaluar la
       `@container (max-aspect-ratio: 1)` cuando cambia la orientación.
       La condición queda congelada en el valor que tenía al cargar, así
       que un dispositivo que arrancó vertical sigue "siendo" vertical
       acostado. En Chromium rotar funciona perfecto — verificado — y
       por eso nunca apareció en las pruebas.

       El arreglo no puede depender de que esa query se refresque, así
       que la decisión pasa a JS: se MIDE el `.d-stage` y se pone (o se
       saca) la clase. El CSS ya no pregunta por la proporción, pregunta
       por la clase.

       ⚠️ Los dos `setTimeout` no son paranoia: iOS informa dimensiones
       VIEJAS durante unos cientos de milisegundos después de rotar. Una
       sola medición inmediata devuelve el tamaño anterior y deja la
       clase igual de congelada que la container query. Se vuelve a
       medir a los 250ms y a los 600ms, que cubre el rango observado en
       reportes de este comportamiento.

       No se pudo verificar en un iPad real (no hay forma de reproducir
       iPadOS acá). Lo que sí es seguro: medir con
       `getBoundingClientRect()` en `resize`/`orientationchange` no
       depende del mecanismo que está fallando. */
    /* ---- Recursos: el boton se muestra solo si hay recursos ----
       kit-base v1.9.86. El panel de Recursos y su boton viajan en el
       boilerplate de TODO curso, porque el cliente pidio que el menu
       contenedor sea igual en todos (§7.32). Pero un curso sin
       documentos no tiene que mostrar un boton que abre un cajon
       vacio.

       Se decide LEYENDO el panel, no con una opcion que el curso tenga
       que pasar: el dato ya esta en el DOM —hay fichas o no hay— y asi
       no existe el estado incoherente de "puse los <li> pero me olvide
       de habilitar el boton", que es el cable suelto de siempre
       (§7.17). Agregar un recurso es agregar un <li>, punto.

       Se esconde con `hidden` y no sacando el nodo para que el curso
       que agregue fichas mas tarde (o un test) solo tenga que volver a
       llamar a esto. */
    function initRecursos() {
      var btn = document.getElementById('d-recursos-btn');
      if (!btn) return;
      var panel = document.querySelector('[data-popup="recursos"]');
      var hay = !!(panel && panel.querySelector('.d-recurso'));
      btn.hidden = !hay;
      /* "N documentos para leer o llevarte" arriba de las fichas (rediseño
         v1.9.125, §7.74), desde el marcado de siempre. */
      if (hay) {
        var n = panel.querySelectorAll('.d-recurso').length;
        var bd = panel.querySelector('.modal-bd');
        if (bd && !bd.querySelector('.d-recursos-cuenta')) {
          var p = document.createElement('p');
          p.className = 'd-recursos-cuenta';
          p.textContent = n + (n === 1 ? ' documento para leer o llevarte' : ' documentos para leer o llevarte');
          bd.insertBefore(p, bd.firstChild);
        }
      }
    }

    function initAvisoGirar() {
      var stage = document.querySelector('.d-stage');
      if (!stage) return;

      /* BUG REAL reportado probando el curso con el cliente en una PC:
         *"cuando lo abro en web y achico la pantalla me aparece el cartel
         de girar dispositivo"*.

         El cartel se disparaba solo por la FORMA del lienzo (más alto que
         ancho), y en una PC eso pasa cada vez que alguien angosta la
         ventana o la pone al costado de otra para tomar notas. Pedirle a
         esa persona que "gire el dispositivo" no tiene ningún sentido: no
         hay nada que girar, y encima le tapa el curso con un cartel que
         no puede resolver. MEDIDO antes de tocar nada: 600×900 y 500×800
         en escritorio daban el cartel puesto.

         La forma del lienzo nunca fue la pregunta completa. La pregunta
         es SI GIRAR EL DISPOSITIVO ES UNA ACCIÓN POSIBLE, y eso solo es
         cierto donde hay una pantalla que rota.

         Las dos condiciones hacen falta, y cada una descarta algo
         distinto —al revés de lo que parece—:

           · `pointer: coarse` descarta el ESCRITORIO, incluido el monitor
             táctil: con un mouse conectado el puntero PRIMARIO es el
             mouse, así que `coarse` da false aunque haya digitalizador
             (ahí lo que da true es `any-pointer: coarse`, que justamente
             por eso no sirve para esto).
           · `maxTouchPoints > 0` descarta lo que informa puntero grueso
             SIN pantalla táctil que rote: un navegador de TV o de consola
             manejado con control remoto.

         ⚠️ Lo del monitor táctil no se puede medir acá: Playwright emula
         `hasTouch` informando `pointer: coarse` (medido), que es lo que
         haría una tablet, no un escritorio con mouse. Queda apoyado en
         cómo define `pointer` la spec de Media Queries 4, no en una
         medición propia.

         En una PC angosta el curso simplemente se ve angosto, que es lo
         correcto: el lienzo ya se adapta solo. */
      var puedeGirar = !!(navigator.maxTouchPoints > 0) &&
        !!(global.matchMedia && global.matchMedia('(pointer: coarse)').matches);
      if (!puedeGirar) return;

      /* `seguirIgual` — el alumno pidió continuar en vertical. Dura la
         sesión: si rota y vuelve a girar, el cartel no reaparece, porque
         ya dijo que no puede girar. */
      var seguirIgual = false;
      var tapadoAntes = null;

      /* ⚠️ BUG REAL, encontrado verificando esto mismo: con el cartel
         puesto, el video de la portada SE REPRODUCÍA DETRÁS. Y como esa
         diapositiva es `[data-autoadvance]`, al terminar el curso
         avanzaba solo: el alumno giraba el dispositivo y aparecía en la
         diapositiva 2, habiéndose perdido la portada entera.

         El cartel no es un adorno encima del curso: mientras está, el
         curso NO EMPEZÓ. Por eso avisa a quien corresponda —hoy los
         videos de fondo— en vez de limitarse a tapar. */
      function avisar(tapado) {
        if (tapado === tapadoAntes) return;
        tapadoAntes = tapado;
        document.dispatchEvent(new CustomEvent('cursotapado', { detail: { tapado: tapado } }));
      }

      function medir() {
        var r = stage.getBoundingClientRect();
        if (!r.width || !r.height) return;
        var vertical = r.width / r.height <= 1;
        var tapado = vertical && !seguirIgual;
        stage.classList.toggle('is-vertical', tapado);
        avisar(tapado);
      }

      var salida = document.querySelector('[data-rotate-seguir]');
      if (salida) salida.addEventListener('click', function () {
        seguirIgual = true;
        medir();
      });

      medir();
      window.addEventListener('resize', medir);
      window.addEventListener('orientationchange', function () {
        medir();
        setTimeout(medir, 250);
        setTimeout(medir, 600);
      });
      if (window.screen && screen.orientation && screen.orientation.addEventListener) {
        screen.orientation.addEventListener('change', function () {
          medir(); setTimeout(medir, 250); setTimeout(medir, 600);
        });
      }
    }

    initGreeting();
    initSoundToggle();
    initNarrateToggle();
    initNarrateTimeline();
    initNarrateOnSlideChange();
    initAudioPopovers();
    initFabPopovers();
    initVoicePicker();
    initRatePicker();
    initRateQuick();
    initConfigReset();
    initFullscreen();
    initAvisoGirar();
    initRecursos();
    /* Expuesta porque el panel puede crecer DESPUÉS del arranque (un
       curso que genere sus fichas por JS, o un test): sin esto, el
       botón quedaría escondido para siempre aunque haya recursos. */
    global.initRecursos = initRecursos;
    initProgressSeek();
    initAutoplay();
    initResume();
    /* Red de seguridad universal para <video> (kit-base v1.9.39,
       initVideoSafetyNet en coto-media.js) — se dispara sola desde ACÁ,
       no como un init más que el curso tenga que acordarse de llamar:
       `initPlayer()` es el único punto que TODO curso llama siempre,
       así que colgarla de acá es la única forma de garantizar que
       ningún patrón de video (los 4 del kit, o uno nuevo que un curso
       escriba a mano) se quede sonando fuera de su diapositiva/pop-up/
       capa por olvidarse de cablearla — el bug de "¿quién lo apaga?"
       que ya volvió a aparecer 4 veces (CLAUDE.md §6.10.1 punto 1,
       §6.18 punto 2, §6.20 punto 6.1, §6.45 gap 6). Curso sin video →
       `coto-media.js` no está cargado → `global.initVideoSafetyNet` no
       existe → no hace nada, sin error (mismo criterio defensivo que
       `initGreeting()` con `global.SCORM` más arriba). */
    if (typeof global.initVideoSafetyNet === 'function') global.initVideoSafetyNet();

    /* `global.Player` por el MISMO motivo que la red de seguridad de
       arriba: que no dependa de que cada curso se acuerde.

       BUG REAL (encontrado migrando "Prevención cardiovascular" al kit
       v1.9.61, el primer curso que usa `coto-logros.js`): ese módulo
       saca sus avisos con `global.Player.toast(...)` — el "+5 · Ficha
       completa" de cada `award()` y el "🏆 Logro: ..." de cada
       `unlock()`. Pero el boilerplate de `js/curso.js` y los dos cursos
       terminados guardan el resultado de `initPlayer()` en una variable
       LOCAL del IIFE del curso (`var Player = initPlayer({...})`), que
       nunca llega a `window`. O sea: `global.Player` era `undefined` y
       esos toasts no aparecían NUNCA, sin ningún error en consola.
       No se detectó antes solo porque coto-logros.js (v1.9.60) es
       posterior a los dos cursos, así que ninguno lo cargaba todavía —
       el bug estaba servido para el primero que lo usara.

       Se expone acá, y no pidiéndole al curso `window.Player = ...`,
       porque el curso ya no tiene por qué saber quién más necesita el
       objeto: cualquier módulo del kit que quiera avisar algo lo tiene
       disponible por el solo hecho de que el curso llamó a
       `initPlayer()`. La variable local del curso sigue funcionando
       igual — esto SUMA, no reemplaza. */
    var api = { toast: toast };
    global.Player = api;
    return api;
  }

  global.initPlayer = initPlayer;
})(window);
