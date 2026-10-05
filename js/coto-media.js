/* ============================================================
   coto-media.js · Los 3 patrones de video de una diapositiva-captura
   kit-base v1.7 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual a cada curso nuevo, sin editar.
   ------------------------------------------------------------
   Extraído de "Prevención cardiovascular" (initBgVideos /
   initVideoPlayer / initInlineCircleVideos en su curso.js). Los tres
   patrones aparecieron ahí por pedidos concretos del cliente y los
   tres son 100% reusables: ninguno sabe qué video es ni qué contenido
   tiene, solo leen atributos data-* del marcado.

   Los 3 patrones, y cuándo usar cada uno:

   1. VIDEO DE FONDO (`initBgVideos`) — la diapositiva ENTERA es un
      video a sangre, en el mismo lienzo 2:1 que las capturas (portada,
      apertura de unidad). El video corre solo al entrar a la diapo y
      se pausa al salir.
        <section data-slide="portada" class="d-shot-slide--bg-video">
          <div class="d-shot">
            <video class="d-shot-video" playsinline preload="auto"
                   poster="img/portada.webp">
              <source src="video/portada.mp4" type="video/mp4">
            </video>
            <button type="button" class="d-shot-video-tap" hidden></button>
          </div>
        </section>
      ⚠️ Bug real (documentado): autoplay CON audio lo bloquean todos
      los navegadores si no hubo un gesto previo del alumno — pasa
      SIEMPRE en la portada, que es la 1ª diapo. Por eso el
      `.d-shot-video-tap`: si `play()` es rechazado, el video arranca
      MUDO (§7.18 K10) y el botón aparece ofreciendo el audio; tocarlo
      cuenta como gesto real. No sacarlo.
      El botón va VACÍO en el marcado: el ícono, el texto, el
      `aria-label` y el `data-modo` se los pone `initBgVideos` según lo
      que haya pasado de verdad (§7.30). Un curso que quiera otro
      contenido puede ponerlo a mano y el kit no lo pisa.
      Con `prefers-reduced-motion` el video no arranca: se queda quieto
      en el `poster` (que es la misma captura .webp de siempre), así que
      la diapo se ve igual.
      ⚠️ Si el cliente todavía no entregó los .mp4, dejar placeholders
      con el nombre final (CLAUDE.md §3.9): sin el archivo el <source>
      no carga y el navegador se queda en el poster — el curso funciona
      igual mientras tanto.

   2. REPRODUCTOR EN POP-UP (`initVideoPlayer`) — el video vive en un
      pop-up grande, disparado por una hitbox de la captura. Es el
      patrón por defecto para videos tipo tarjeta rectangular.
      SIN `.modal-hd`: se ve solo el video, con un botón de cerrar
      flotante (`.modal-x--video`, CSS en coto-media.css) — ver
      CLAUDE.md §6.12 punto 5.
        <button class="d-shot-hit" data-hit data-video-play
                data-video="video/x.mp4" data-video-title="Título">…</button>
        <div class="modal modal--video" data-popup="video-player" role="dialog" aria-modal="true" aria-label="Video">
          <div class="modal-back" data-popup-close></div>
          <div class="modal-card modal-card--video">
            <h3 id="d-video-title" class="sr-only"></h3>
            <button class="modal-x modal-x--video" data-popup-close aria-label="Cerrar video">✕</button>
            <div class="modal-bd modal-bd--video">
              <video id="d-video-player" playsinline
                     controlslist="nodownload noremoteplayback" disablepictureinpicture></video>
            </div>
          </div>
        </div>

      MODIFICADORES DE `[data-hit]` — cuál usar, y no es estética:

        (ninguno)             aro + sombra + levante al pasar el mouse.
                              El default, y está bien para una zona que
                              sin él no se distingue del fondo.
        `.d-shot-hit--circle`  la zona es redonda: el realce se recorta
                              en círculo en vez de en rectángulo.
        `.d-shot-hit--sin-aro` la RESPUESTA de la zona ya se ve en el
                              arte (cambia la imagen, aparece un cartel,
                              se revela una ficha). El aro no agregaría
                              información y sí dibuja una figura
                              geométrica sobre un dibujo orgánico.
                              Apaga y no reemplaza: la zona queda sin
                              señal propia, así que solo va cuando el
                              arte ya da una.
        `.d-shot-hit--tab`     el arte CAMBIA DE FORMA entre estados
        `.d-shot-hit--paso`
                              (solapas, pasos). Ahí no hay rectángulo
                              que sirva para los dos, así que el realce
                              se recorta contra el ARTE: un lavado
                              blanco que solo se ve donde hay solapa
                              pintada. Ver `coto-shot-stage.css`.
        `.d-shot-hit--videobox` recuadro de video; ver los 3 patrones de
                              arriba y `data-video-popup`.
        `.d-shot-hit--hueco`  el arte dibuja algo que SOBRESALE del
                              hitbox (un ícono en un círculo que asoma
                              por arriba de su tarjeta). El aro lo
                              tacharía, y "por detrás" no existe: el
                              arte es un bitmap. Se le PERFORA un
                              agujero al realce con la forma de esa
                              ilustración, así que visto desde afuera
                              el aro pasa por detrás. Cuatro variables
                              en % del propio hitbox:

                                <button class="d-shot-hit d-shot-hit--hueco"
                                        style="--hueco-x:50%; --hueco-y:0%;
                                               --hueco-rx:25%; --hueco-ry:42%"
                                        data-hit data-l="…" data-t="…" …>

                              ⚠️ `rx` y `ry` son DISTINTOS aunque el
                              círculo sea redondo: los % del gradiente
                              van contra el ancho y el alto de la caja.
                              ⚠️ Y el hueco es solo VISUAL: el área
                              clickeable no cambia.
                              Ver `coto-shot-stage.css` para el detalle
                              y para la trampa al medir el radio.


   3. VIDEO CIRCULAR EN EL LUGAR (`initInlineCircleVideos`) — pedido
      explícito del cliente en "Prevención cardiovascular": los círculos
      chicos con la cara del especialista tienen que reproducirse AHÍ
      MISMO, no abrir el pop-up grande. Clic en el play arranca; clic
      sobre el video andando lo pausa. Sin controles nativos: a ese
      tamaño no entran legibles dentro del círculo.
        <div class="d-shot-hit d-shot-hit--circle d-shot-hit--video"
             data-hit data-inline-video data-video="video/x.mp4"
             data-video-title="Título" data-l data-t data-w data-h>
          <video class="d-shot-hit-video" playsinline preload="metadata">…
          <button type="button" class="d-shot-hit-play">Reproducir</button>
          <!-- el <svg> del triángulo lo pone el kit (`dibujarPlay`); el texto
               de acá pasa a `aria-label` y sigue siendo el nombre accesible -->
        </div>

      3 combinaciones válidas, según lo que el `<video>` traiga (desde
      "Seguridad alimentaria", ver CLAUDE.md §6.29/§6.4x):
        a) Sin `poster` y CON `.d-shot-hit-play` — círculo de arriba: el
           video queda oculto (opacity:0) hasta reproducir, dejando ver
           el arte de base detrás (la cara horneada en la captura).
        b) CON `poster` y SIN `.d-shot-hit-play` — el arte YA dibuja el
           reproductor completo (marco/play/barra) adentro del poster:
           sin botón propio, controles nativos recién al reproducir.
        c) CON `poster` y CON `.d-shot-hit-play` — carátula real (foto/
           patrón del cliente) SIN ningún control dibujado adentro: se
           ve siempre en reposo (a diferencia de (a)) y el botón real
           del kit es el único affordance de play, no uno dibujado.
      Las tres cablean igual — el módulo detecta la combinación solo
      por si el `<video>` trae `poster` y si hay `.d-shot-hit-play` en
      el marcado, sin flags nuevos.

      ⚠️ Trampa de especificidad si el curso pisa el `object-fit` de la
      variante (b)/(c) (ej. quiere `cover` en vez del `contain` de acá
      abajo — caso real, "Seguridad alimentaria"): el `<video>` está
      bajo `[data-inline-video].is-poster .d-shot-hit-video` — 3
      selectores de especificidad — así que un override del curso con
      MENOS de 3 (ej. una sola clase propia del wrapper,
      `.mi-videobox .d-shot-hit-video`) pierde contra ESTA regla y
      nunca se aplica al `<video>`, aunque sí le gane a la del
      `.d-shot-hit-poster-img` (que es una sola clase). Bug real: la
      carátula (en pausa) queda con un encuadre y el video (al
      reproducir) con otro, así que el marco "salta" justo al arrancar
      — parece un bug de recorte del video cuando en realidad es dos
      reglas de `object-fit` distintas peleando. Fix del curso: repetir
      el prefijo `[data-inline-video].is-poster` en el selector propio
      (`[data-inline-video].is-poster.mi-videobox .d-shot-hit-video`),
      nunca solo agregar una clase más liviana.

   Uso (llamar una vez desde boot(), las 3 son opcionales según lo que
   tenga el curso):
     initBgVideos();
     initVideoPlayer({
       onFirstPlay: function (src, title) { award(5, title); XAPI.experienced(src, title); },
       seen: function (src) { return !!state.videosVistos[src]; },
       markSeen: function (src) { state.videosVistos[src] = true; persistState(); }
     });
     initInlineCircleVideos({ onFirstPlay: …, seen: …, markSeen: …,
       afterPlay: syncNextGateUI });

   Todos los patrones de video de este archivo (incluido `initBgVideos`
   desde el fix de más abajo — antes era el único que no lo hacía)
   respetan `prefers-reduced-motion` y cortan la locución antes de
   reproducir (`Narrador.cancel()`): la voz nunca compite con el audio
   del video.
   ============================================================ */
(function (global) {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  function silenciarLocucion() {
    if (global.Narrador && global.Narrador.cancel) global.Narrador.cancel();
  }

  /* ============================================================
     mostrarErrorVideo(v) / ocultarErrorVideo(v) — kit-base v1.9.44
     ------------------------------------------------------------
     Los patrones 2-5 (pop-up, círculo inline, video en pop-up de
     contenido, video en capa) no tenían NINGÚN estado visible si el
     `<video>` disparaba `error` DESPUÉS de que el alumno ya lo tocó
     (archivo roto, 404, códec no soportado en ese navegador) — se
     quedaba una caja negra o el último cuadro congelado, sin ningún
     mensaje. `videoUsable()` (más abajo) ya cubría el caso de
     "todavía no hay archivo" para el video de FONDO (vuelve al
     poster, que es la misma captura — no rompe nada visualmente),
     pero acá no hay poster de respaldo equivalente en todos los
     casos.

     `contenedorPara` fuerza `position:relative` en el padre SOLO si
     ya era `static` — es el uso estándar y no invasivo de
     position:relative para dar contexto de posicionamiento a un hijo
     absoluto, no mueve nada que ya estuviera posicionado. */
  function contenedorPara(v) {
    var p = v.parentElement;
    if (!p) return null;
    if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
    return p;
  }
  /* ---- Picture-in-Picture: el atributo no alcanza en iPad ----
     kit-base v1.9.96. BUG REAL, segunda foto del cliente, y esta vez el
     propio iOS lo dice con todas las letras: el pop-up del video mostrando
     *"This video is playing in picture in picture"*.

     Eso CONFIRMA el diagnóstico de la vuelta anterior —el cuadro negro era
     PiP— y a la vez muestra que la mitad preventiva era insuficiente:
     **WebKit ignora `disablepictureinpicture`**. El atributo lo respeta
     Chrome; Safari dibuja igual su botón, y no en la barra de abajo —donde
     `controlslist` podría tocarlo— sino en una capa propia arriba a la
     izquierda del video, que no es alcanzable ni por CSS (vive en su shadow
     DOM) ni por ninguna combinación de `controlslist`. Apple no expone una
     forma declarativa de sacarlo.

     La única que sí funciona es imperativa y es la de Apple:
     `webkitSetPresentationMode('inline')` en cuanto el modo cambia a
     `picture-in-picture`. El botón sigue estando —eso no se puede evitar—
     pero el video vuelve solo a la ficha.

     Por qué se BLOQUEA en vez de soportarlo: en PiP el video se va de la
     página, y esta ficha es un MODAL — abajo quedan el pop-up abierto, el
     candado de avance que espera el visionado y la locución que se silenció
     para no pisarlo. Un video reproduciéndose afuera de todo eso no es una
     función, es el curso partido en dos.

     ⚠️ Solo se saca de PiP, NUNCA de pantalla completa: el mismo evento
     avisa de los dos modos, y la pantalla completa el cliente la pidió
     explícitamente (§6.29).
     ⚠️ Y solo con la página VISIBLE. Si iOS entró en PiP porque el alumno
     se fue de Safari (la opción "Iniciar PiP automáticamente" del sistema),
     pelearle sería pelearle al sistema operativo — y ese caso ya está
     cubierto: el `visibilitychange` pausa todo con la página escondida.

     > LECCIÓN: un fix declarativo que "debería" andar no está verificado
     > hasta que lo confirma el navegador real. */
  function sinPiP(v) {
    try { v.disablePictureInPicture = true; } catch (e) {} // Chrome sí lo respeta
    function alInline() {
      if (document.hidden) return;
      try {
        if (v.webkitPresentationMode === 'picture-in-picture') v.webkitSetPresentationMode('inline');
      } catch (e) {}
    }
    v.addEventListener('webkitpresentationmodechanged', alInline);
    /* Camino estándar (Chrome/Edge de escritorio), por si el atributo no
       llegó a aplicarse: mismo criterio, vuelve a la página. */
    v.addEventListener('enterpictureinpicture', function () {
      if (document.hidden) return;
      if (document.exitPictureInPicture) document.exitPictureInPicture().catch(function () {});
    });
  }

  function mostrarErrorVideo(v) {
    var cont = contenedorPara(v);
    if (!cont) return;
    var msg = cont.querySelector(':scope > .d-video-error');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'd-video-error';
      msg.setAttribute('role', 'alert');
      msg.innerHTML =
        '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/>' +
        '<line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
        '<span>No se pudo cargar este video.</span>';
      cont.appendChild(msg);
    }
    msg.classList.add('is-shown');
  }
  function ocultarErrorVideo(v) {
    var p = v.parentElement;
    var msg = p && p.querySelector(':scope > .d-video-error');
    if (msg) msg.classList.remove('is-shown');
  }

  /* ============================================================
     montarControles(video) — controles PROPIOS del reproductor
     ------------------------------------------------------------
     kit-base v1.9.98, y es un cambio de enfoque, no un parche más.

     Cuatro vueltas de reportes del cliente en iPad sobre el mismo
     componente —cuadro negro al pausar, Picture-in-Picture llevándose
     el video de la página, desalojo de memoria, y los controles
     desapareciendo solos— y las cuatro tenían la misma causa de fondo:
     estábamos usando **la barra de controles nativa de Safari dentro
     de un modal**. De esa barra no controlamos NADA:

       · qué botones trae (PiP y AirPlay no se pueden sacar: WebKit
         ignora `disablepictureinpicture` y no hay valor de
         `controlslist` que los tape — §7.45 punto 1);
       · cómo se ve (su shadow DOM es cerrado: ni CSS ni `zoom`);
       · cuándo aparece y cuándo se esconde;
       · qué hace el sistema con el video al cambiar de modo.

     Con eso, cada vuelta era descubrir un comportamiento nuevo de
     iPadOS, no arreglar un bug. La salida no es parchar más rápido: es
     dejar de usar esa barra. Sin `controls`, los dos botones que
     rompían el curso **no existen** —no hay que pelearlos, viven en la
     barra que ya no mostramos— y todo lo demás pasa a ser nuestro:
     estado, visibilidad, tamaño de los botones, foco, idioma.

     Lo que se pierde, dicho de frente: AirPlay y el PiP legítimo.
     Decisión del cliente, con el mockup a la vista: dentro de un curso
     en Moodle las dos sacan al alumno del recorrido.

     ⚠️ El marcado lo arma ESTE archivo, no el curso. Un curso viejo
     solo tiene que sacar `controls` de su `<video>`; si se olvida, se
     lo sacamos igual acá abajo — dos barras superpuestas es
     exactamente el bug §6.29 que el kit ya pagó dos veces.

     ⚠️ Las dos barras son `<input type="range">` de verdad, no divs.
     Es la misma decisión que la línea de tiempo de la locución: un
     range trae teclado (flechas, Inicio/Fin), rol y valor para el
     lector de pantalla, y arrastre táctil — todo eso, reimplementado a
     mano sobre un div, es donde un reproductor casero se vuelve
     inaccesible sin que nadie lo note.
     ============================================================ */
  function mmss(seg) {
    if (!isFinite(seg) || seg < 0) seg = 0;
    var m = Math.floor(seg / 60), s = Math.floor(seg % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  var ICO = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>',
    pausa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    atras: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2.5L8 6l4 3.5V7a5 5 0 1 1-5 5H5.2A6.8 6.8 0 1 0 12 5z"/></svg>',
    vol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>',
    mudo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M15.5 9.5l5 5M20.5 9.5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    fs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z"/></svg>',
    fsOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4h2v6H6V8h4V4zm4 0h2v4h4v2h-6V4zM6 14h6v6h-2v-4H6v-2zm8 0h6v2h-4v4h-2v-6z"/></svg>'
  };

  function montarControles(video, opciones) {
    opciones = opciones || {};
    var cont = video.parentElement;
    if (!cont || cont.querySelector('.d-vp-bar')) return null;
    /* Sin `controls`: si el curso lo dejó en su HTML, se lo sacamos.
       Dos barras encima son el bug §6.29, ya pagado dos veces. */
    video.removeAttribute('controls');
    if (getComputedStyle(cont).position === 'static') cont.style.position = 'relative';

    var bar = document.createElement('div');
    bar.className = 'd-vp-bar';
    bar.innerHTML =
      '<input type="range" class="d-vp-seek" min="0" max="1000" step="1" value="0" aria-label="Avance del video">' +
      '<div class="d-vp-linea">' +
        '<button type="button" class="d-vp-btn d-vp-btn--play" aria-label="Reproducir">' + ICO.play + '</button>' +
        '<button type="button" class="d-vp-btn d-vp-atras" aria-label="Retroceder 10 segundos">' + ICO.atras + '</button>' +
        '<span class="d-vp-t"><b class="d-vp-ahora">0:00</b> <span class="d-vp-total">/ 0:00</span></span>' +
        '<span class="d-vp-sp"></span>' +
        '<button type="button" class="d-vp-btn d-vp-mute" aria-label="Silenciar">' + ICO.vol + '</button>' +
        '<input type="range" class="d-vp-vol" min="0" max="100" step="1" value="100" aria-label="Volumen">' +
        '<button type="button" class="d-vp-btn d-vp-fs" aria-label="Pantalla completa">' + ICO.fs + '</button>' +
      '</div>';
    cont.appendChild(bar);

    /* El aviso de estado: reemplaza al rectángulo negro mientras el
       video carga o se está recuperando de un desalojo. Es la misma
       pieza con dos textos, porque para el alumno es la misma
       situación: "esperá, estoy trayendo el video". */
    var aviso = document.createElement('div');
    aviso.className = 'd-vp-aviso';
    aviso.hidden = true;
    aviso.setAttribute('role', 'status');
    aviso.innerHTML = '<div><span class="d-vp-spin" aria-hidden="true"></span><span class="d-vp-aviso-txt"></span></div>';
    cont.appendChild(aviso);

    /* ---- `ocultarHastaPrimerPlay` ----
       Para los patrones cuyo `poster` es un mockup con un reproductor
       YA DIBUJADO (el caso de `initPopupVideos` y de la variante con
       carátula): antes del primer play, mostrar nuestra barra encima
       del reproductor dibujado son dos interfaces superpuestas y
       ninguna clara — el bug §6.29, que el kit ya pagó dos veces con
       los controles nativos. Mientras no arrancó, el video entero es
       el botón de play (el póster ya se ve como un reproductor listo);
       la barra aparece recién cuando hay algo que controlar. */
    if (opciones.ocultarHastaPrimerPlay) {
      cont.classList.add('d-vp-virgen');
      video.addEventListener('play', function () { cont.classList.remove('d-vp-virgen'); }, { once: true });
    }

    var btnPlay = bar.querySelector('.d-vp-btn--play');
    var btnAtras = bar.querySelector('.d-vp-atras');
    var btnMute = bar.querySelector('.d-vp-mute');
    var btnFs = bar.querySelector('.d-vp-fs');
    var seek = bar.querySelector('.d-vp-seek');
    var vol = bar.querySelector('.d-vp-vol');
    var elAhora = bar.querySelector('.d-vp-ahora');
    var elTotal = bar.querySelector('.d-vp-total');
    var txtAviso = aviso.querySelector('.d-vp-aviso-txt');

    var arrastrando = false;

    /* ---- pintar ---- */
    function pct(n) { return Math.max(0, Math.min(100, n)); }
    function pintarSeek() {
      var d = video.duration;
      var av = isFinite(d) && d > 0 ? (video.currentTime / d) * 100 : 0;
      var buf = 0;
      try {
        if (video.buffered.length && isFinite(d) && d > 0) {
          buf = (video.buffered.end(video.buffered.length - 1) / d) * 100;
        }
      } catch (e) {}
      seek.style.setProperty('--pct', pct(av) + '%');
      seek.style.setProperty('--buf', pct(Math.max(buf, av)) + '%');
      if (!arrastrando) seek.value = String(Math.round(pct(av) * 10));
    }
    function pintarTiempos() {
      elAhora.textContent = mmss(video.currentTime);
      elTotal.textContent = '/ ' + (isFinite(video.duration) ? mmss(video.duration) : '0:00');
    }
    function pintarPlay() {
      var and = !video.paused && !video.ended;
      btnPlay.innerHTML = and ? ICO.pausa : ICO.play;
      btnPlay.setAttribute('aria-label', and ? 'Pausar' : 'Reproducir');
      bar.classList.toggle('is-pausado', !and);
    }
    function pintarVol() {
      var mudo = video.muted || video.volume === 0;
      btnMute.innerHTML = mudo ? ICO.mudo : ICO.vol;
      btnMute.setAttribute('aria-label', mudo ? 'Activar el sonido' : 'Silenciar');
      var v = mudo ? 0 : Math.round(video.volume * 100);
      vol.value = String(v);
      vol.style.setProperty('--pct', v + '%');
    }
    function pintarFs() {
      var el = document.fullscreenElement || document.webkitFullscreenElement;
      var tj = video.closest('.modal-card');
      var on = el === cont || !!(tj && tj.classList.contains('d-vp-ampliado'));
      btnFs.innerHTML = on ? ICO.fsOff : ICO.fs;
      btnFs.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Pantalla completa');
      btnFs.setAttribute('aria-pressed', on ? 'true' : 'false');
    }

    /* ---- mostrar / esconder la barra ----
       Pausado, la barra SE QUEDA. Es literal el reporte del cliente
       ("le desaparecieron las opciones del reproductor"): con el video
       detenido, esconder los controles deja una imagen fija sin
       ninguna pista de qué hacer. Reproduciendo sí se desvanece, que
       es lo que uno espera de un reproductor, y vuelve con cualquier
       gesto — incluido el foco por teclado, que si no dejaría a quien
       navega con Tab moviéndose por botones invisibles. */
    var relojBarra = 0;
    function mostrarBarra() {
      cont.classList.add('d-vp-visible');
      clearTimeout(relojBarra);
      if (video.paused || video.ended) return;
      relojBarra = setTimeout(function () {
        /* ⚠️ `:focus-visible`, no `contains(activeElement)`. Un clic del
           mouse sobre nuestro botón de play LO DEJA ENFOCADO, así que
           preguntar por el foco a secas mantenía la barra abierta para
           siempre después del primer clic — el desvanecido no se
           disparaba nunca. Lo agarró la prueba negativa: M4 seguía en
           verde con las dos mitades del código rotas, y la razón era
           esta.
           Con `:focus-visible` la barra se queda solo cuando el foco
           llegó POR TECLADO, que es el caso que hay que proteger: con
           Tab, esconder los controles deja a la persona moviéndose
           entre botones invisibles. */
        var act = document.activeElement;
        var porTeclado = !!(act && cont.contains(act) && act.matches && act.matches(':focus-visible'));
        if (!video.paused && !porTeclado) cont.classList.remove('d-vp-visible');
      }, 3000);
    }
    ['pointermove', 'pointerdown', 'touchstart', 'focusin'].forEach(function (ev) {
      cont.addEventListener(ev, mostrarBarra, ev === 'touchstart' ? { passive: true } : false);
    });

    /* ---- acciones ---- */
    function alternar() {
      if (video.paused || video.ended) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
      else video.pause();
      mostrarBarra();
    }
    btnPlay.addEventListener('click', alternar);
    /* Un clic sobre la imagen también reproduce/pausa, como en
       cualquier reproductor. Sin `controls` no hay ambigüedad posible:
       acá el clic es SIEMPRE nuestro, así que no se repite el bug del
       doble toggle (el handler corría antes de la acción nativa y leía
       el estado viejo — CLAUDE.md §6.29). */
    video.addEventListener('click', alternar);
    btnAtras.addEventListener('click', function () {
      try { video.currentTime = Math.max(0, video.currentTime - 10); } catch (e) {}
      mostrarBarra();
    });
    btnMute.addEventListener('click', function () {
      video.muted = !(video.muted || video.volume === 0);
      if (!video.muted && video.volume === 0) video.volume = 1;
      pintarVol(); mostrarBarra();
    });
    vol.addEventListener('input', function () {
      var v = Number(vol.value) / 100;
      video.volume = v; video.muted = v === 0;
      pintarVol(); mostrarBarra();
    });

    /* Arrastre de la barra de avance. `input` mientras se arrastra
       (para que el número acompañe) pero el salto real recién en
       `change`: buscar en cada paso del arrastre dispara una carga por
       cada píxel y en una red de LMS eso se ve como un reproductor
       trabado. Mismo criterio que la línea de tiempo de la locución. */
    function segDeSeek() {
      var d = video.duration;
      return isFinite(d) && d > 0 ? (Number(seek.value) / 1000) * d : 0;
    }
    seek.addEventListener('pointerdown', function () { arrastrando = true; });
    seek.addEventListener('input', function () {
      arrastrando = true;
      elAhora.textContent = mmss(segDeSeek());
      seek.style.setProperty('--pct', (Number(seek.value) / 10) + '%');
    });
    seek.addEventListener('change', function () {
      var s = segDeSeek();
      arrastrando = false;
      try { video.currentTime = s; } catch (e) {}
      mostrarBarra();
    });

    /* ---- Ampliar: API de pantalla completa, con CSS de respaldo ----
       ⚠️ BUG REAL, reporte del cliente en iPad: *"no me está
       funcionando el botón de pantalla completa"*. Y la foto tenía el
       dato: arriba a la izquierda se veía la ✕ de Safari, o sea que
       **el curso YA estaba en pantalla completa** (la del botón del
       header, sobre `documentElement`).

       WebKit no apila pantallas completas: pedirla para un elemento
       anidado mientras hay otra activa se RECHAZA. Y el rechazo llega
       como promesa rechazada, así que mi `try/catch` —que solo atrapa
       errores sincrónicos— lo dejaba pasar en silencio. Para el alumno:
       un botón que no hace nada.

       Fix, y de paso una dependencia menos de Apple: cuando la API no
       está disponible o la rechaza, **ampliamos con CSS**. La tarjeta
       pasa a ocupar toda la ventana. Si el curso ya está en pantalla
       completa —el caso del reporte— eso ES pantalla completa; y si
       está embebido en un iframe de Moodle, llena el iframe, que es
       todo lo que cualquier técnica puede hacer ahí adentro.

       Por eso el botón NO se esconde nunca: siempre hay algo que
       ofrecer. Y NUNCA se usa `video.webkitEnterFullscreen()` como
       respaldo: en iOS devuelve el reproductor NATIVO, con su barra y
       sus botones de PiP y AirPlay — sería volver por la ventana a lo
       que este módulo vino a sacar. */
    var tarjeta = video.closest('.modal-card') || cont;
    function ampliadoCss() { return tarjeta.classList.contains('d-vp-ampliado'); }
    function enFsReal() {
      var el = document.fullscreenElement || document.webkitFullscreenElement;
      return el === cont;
    }
    function ampliarCss(on) { tarjeta.classList.toggle('d-vp-ampliado', !!on); pintarFs(); }
    btnFs.addEventListener('click', function () {
      mostrarBarra();
      if (enFsReal()) {
        try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {}
        return;
      }
      if (ampliadoCss()) { ampliarCss(false); return; }
      // Con el curso ya en pantalla completa ni se intenta: WebKit la
      // rechaza, y pedir algo que sabemos que falla es ruido.
      var yaHayFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
      var pedir = !yaHayFs && (cont.requestFullscreen || cont.webkitRequestFullscreen);
      if (!pedir) { ampliarCss(true); return; }
      var r;
      try { r = pedir.call(cont); } catch (e) { ampliarCss(true); return; }
      // El rechazo viene como promesa: acá es donde se perdía.
      if (r && r.catch) r.catch(function () { ampliarCss(true); });
      else setTimeout(function () { if (!enFsReal()) ampliarCss(true); }, 150);
    });
    function alSalirDeFs() {
      // Salir de la pantalla completa real no puede dejar la ampliación
      // de CSS puesta: quedarían dos estados discutiendo.
      if (!enFsReal()) ampliarCss(false);
      pintarFs();
    }
    document.addEventListener('fullscreenchange', alSalirDeFs);
    document.addEventListener('webkitfullscreenchange', alSalirDeFs);
    // Escape cierra el pop-up entero (motor), así que la ampliación se
    // apaga al cerrar para que la próxima apertura arranque normal.
    document.addEventListener('popupclose', function () { ampliarCss(false); });

    /* ---- el estado lo manda el <video>, no quien lo tocó ----
       Así da igual si arrancó por nuestro botón, por un clic en la
       imagen, por el teclado o por `abrir()`: la barra siempre muestra
       lo que el elemento está haciendo de verdad. */
    ['play', 'pause', 'ended'].forEach(function (ev) {
      video.addEventListener(ev, function () { pintarPlay(); mostrarBarra(); });
    });
    ['timeupdate', 'progress', 'seeked'].forEach(function (ev) {
      video.addEventListener(ev, function () { pintarSeek(); pintarTiempos(); });
    });
    ['loadedmetadata', 'durationchange'].forEach(function (ev) {
      video.addEventListener(ev, function () { pintarSeek(); pintarTiempos(); });
    });
    video.addEventListener('volumechange', pintarVol);
    video.addEventListener('emptied', function () { pintarSeek(); pintarTiempos(); pintarPlay(); });

    pintarPlay(); pintarVol(); pintarTiempos(); pintarSeek(); pintarFs(); mostrarBarra();

    return {
      /* `estado('cargando'|'recuperando'|null)` — el aviso que
         reemplaza al rectángulo negro. Lo maneja `initVideoPlayer`,
         que es quien sabe por qué estamos esperando. */
      estado: function (que) {
        if (!que) { aviso.hidden = true; cont.classList.remove('d-vp-esperando'); return; }
        txtAviso.textContent = que === 'recuperando' ? 'Recuperando el video…' : 'Cargando el video…';
        aviso.hidden = false;
        cont.classList.add('d-vp-esperando');
      },
      refrescar: function () { pintarPlay(); pintarVol(); pintarTiempos(); pintarSeek(); mostrarBarra(); },
      barra: bar
    };
  }

  /* BUG REAL, pedido del cliente: el botón "Sonido" del header
     (`initSoundToggle`, coto-player.js) solo apagaba los efectos de UI
     (fx.js/coto-ui.js, mismo `localStorage['coto-diapos-mute']`) — los
     3 patrones de video de ESTE archivo (fondo, pop-up, círculo
     inline) nunca leían esa marca, así que "Sonido" no lo silenciaba
     TODO como se espera de un mute global. Mismo helper `muted()` que
     ya usan fx.js/coto-ui.js (mismo criterio, no un mecanismo nuevo). */
  function muted() { try { return global.localStorage.getItem('coto-diapos-mute') === '1'; } catch (e) { return false; } }
  // Nivel de volumen (0-1, panel de "Sonido" — kit-base v1.9.35,
  // coto-player.js). `initSoundToggle` ya sincroniza `.volume` en
  // caliente sobre CUALQUIER <video> presente al mover el slider; esto
  // cubre el caso de un video que arranca DESPUÉS de ese ajuste (recién
  // se pone play), mismo criterio que ya usa `muted()` acá al lado.
  /* `pedirAudio()` — el chip de gesto es una PETICIÓN EXPLÍCITA de
     audio, y por lo tanto le gana al mute global (kit-base v1.9.100).

     Viene del reporte de iPad vertical *"en la portada el ícono de
     sonido aparece tachado, pero la música se escucha igual"*. HONESTO:
     no logré reproducir ese par exacto en un arranque limpio — con la
     marca de mute puesta, el `play()` mudo de `attempt()` no rechaza y
     el chip no aparece, así que no hay nada que se saltee el mute. El
     único camino que produce las dos mitades juntas es el del alumno
     que YA tiene el chip a la vista (mute apagado, autoplay con sonido
     bloqueado por iOS), abre el panel de "Sonido", silencia el curso, y
     entonces toca el chip: el `click` hacía `v.muted = false` a secas,
     sin mirar `muted()`. Video sonando, ícono tachado, y los dos
     diciendo la verdad de su propio lado.

     Se arregla del lado del ESTADO, no del ícono: el alumno que toca
     "Tocá para comenzar" está pidiendo sonido, así que lo correcto es
     levantar el mute global de verdad —y que el ícono lo refleje— en
     vez de silenciar el video y dejarlo tocando un botón que no hace
     nada. Quien manda sobre esa marca es `initSoundToggle`
     (coto-player.js): este módulo avisa con un evento y no escribe
     `localStorage` por su cuenta, para no tener dos dueños del mismo
     dato — que es exactamente de dónde salió el desfasaje. */
  function pedirAudio() {
    try { document.dispatchEvent(new CustomEvent('cotoaudiopedido')); } catch (e) {}
  }
  function volumeLevel() {
    try {
      var v = parseFloat(global.localStorage.getItem('coto-diapos-volume'));
      return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
    } catch (e) { return 1; }
  }

  /* Helpers de "ya visto": si el curso no pasa seen/markSeen, se usa un
     registro en memoria — así el módulo funciona sin configurar nada,
     pero el curso puede persistirlo en su suspend_data si quiere. */
  /* ---- El triángulo de play, dibujado por el kit (kit-base v1.9.95) ----
     `coto-media.css` estiliza `.d-shot-hit-play svg { width:40%; fill:#fff }`
     asumiendo que alguien pone el `<svg>`, y el marcado que documenta este
     mismo archivo era `<button class="d-shot-hit-play">Reproducir</button>`.
     Siguiendo esa documentación al pie de la letra, lo que se ve es el
     círculo azul con la PALABRA "Reproducir" adentro, en negro,
     desbordándolo — medido: `texto:"Reproducir", svg:false`.

     El comentario del patrón 3 ya decía *"el botón de play lo dibuja el
     kit"*. Ahora lo dibuja de verdad: el texto del botón pasa a
     `aria-label` (sigue siendo el nombre accesible, que un ícono solo no
     da) y adentro va el triángulo. Un curso que YA traiga su `<svg>` no se
     toca. */
  var ICONO_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M8 5v14l11-7z"></path></svg>';
  function dibujarPlay(btn) {
    /* ⚠️ No se toca un botón que YA trae su ícono (kit-base v1.9.101).
       Hasta acá solo se miraba si había un `<svg>`, y los dos modificadores
       del play de marca no lo tienen:
         · `--art` (v1.9.98) lleva un `<img>` con el PNG de la marca. MEDIDO:
           `dibujarPlay` le reemplazaba el contenido y el botón terminaba con
           el triángulo genérico en vez del ícono del cliente — regresión de
           v1.9.98, cuando `--art` subió al kit sin mirar esta función;
         · `--horneado` (v1.9.101) no dibuja nada a propósito: el play está
           en el arte. Sin esta excepción, el kit le pintaba un triángulo
           encima, que es exactamente el play doble que ese modificador
           vino a sacar. */
    if (!btn || btn.querySelector('svg, img') ||
        btn.classList.contains('d-shot-hit-play--horneado')) return;
    var texto = (btn.textContent || '').trim();
    if (texto && !btn.getAttribute('aria-label')) btn.setAttribute('aria-label', texto);
    btn.innerHTML = ICONO_PLAY;
  }

  function vistoAPI(opts) {
    var mem = {};
    return {
      seen: opts.seen || function (src) { return !!mem[src]; },
      mark: opts.markSeen || function (src) { mem[src] = true; }
    };
  }

  /* ============================================================
     videoUsable(v) — ¿este <video> tiene una fuente reproducible?
     ------------------------------------------------------------
     kit-base v1.9.9 · Sale de un bug real y de un riesgo real, los dos
     con la misma causa: durante buena parte del armado los .mp4 son
     placeholders de 0 bytes (el cliente sube los finales al final).

       · bug: `initBgVideos` mostraba el botón ▶ ante CUALQUIER rechazo
         de play(), incluso con el archivo ausente — un ▶ enorme sobre
         el arte que al tocarlo no hacía nada. Solo el rechazo por
         política de autoplay (NotAllowedError) se arregla con un gesto.
       · riesgo: un gate que exija "mirá el video" sobre un archivo que
         no existe deja el curso IMPOSIBLE de terminar.

     Los dos se resuelven preguntando lo mismo, así que la pregunta vive
     acá una sola vez. Un curso que exija videos debe usarla para NO
     exigir los que todavía no se pueden reproducir: así el gate no
     molesta hoy y empieza a exigir solo cuando entren los archivos
     reales, sin tocar código.
     ============================================================ */
  function videoUsable(v) {
    if (!v) return false;
    return !(v.error || v.networkState === 3 /* NETWORK_NO_SOURCE */);
  }

  /* ============================================================
     initVideoGate() — el gate "mirá el video" que NO traba el curso
     ------------------------------------------------------------
     kit-base v1.9.62. `videoUsable()` (arriba) dice el QUÉ desde
     v1.9.9 —"no exijas un video que no se puede reproducir, o el curso
     queda IMPOSIBLE de terminar"— pero nunca dio el CÓMO, así que cada
     curso lo improvisa. Migrando "Prevención cardiovascular" salió el
     problema real de improvisarlo: si se resuelve mirando el `<video>`
     de la diapositiva, el resultado es INCOHERENTE entre patrones.
     Ahí, de 9 diapositivas con gate, solo 2 (las de video circular)
     tienen un `<video>` en el DOM; las otras 7 abren el video en un
     pop-up y no tienen ningún elemento que inspeccionar hasta que el
     alumno lo abre. Con los .mp4 en placeholder de 0 bytes —el estado
     normal durante casi todo el armado, CLAUDE.md §3.9— esas 2 se
     eximían y las otras 7 seguían exigiendo un archivo igual de roto:
     el curso quedaba trabado igual, pero solo en algunas diapositivas,
     que es peor que trabarse en todas (parece un bug de contenido).

     La respuesta correcta no mira el DOM: SONDEA cada `src` declarado
     en `data-require-seen`, con un `<video>` suelto. Así la pregunta es
     la misma para los 4 patrones de video del kit, y se responde sola
     cuando el cliente sube los archivos reales, sin tocar código.

     Uso (en boot(), después de crear el motor):
       var gate = initVideoGate();
       motor.canAdvance = function (slide) {
         return gate.faltan(slide).length === 0 && ...otras reglas...;
       };

     Devuelve:
       · faltan(slideEl) -> [src...]  los que todavía hay que mirar
                                      (excluye vistos y no reproducibles)
       · marcarVisto(src)             registrarlo como visto
       · visto(src) -> bool
       · roto(src)  -> bool           la sonda dijo que no se puede ver
     `opts.seen`/`opts.markSeen` permiten que el registro de vistos sea
     el del curso (el que va al suspend_data), igual que en el resto de
     los init* de este archivo. `opts.onChange` se llama cuando una
     sonda cambia el estado, para re-sincronizar la barra.
     ============================================================ */
  function initVideoGate(opts) {
    opts = opts || {};
    var visto = vistoAPI(opts);
    var rotos = {};
    var onChange = opts.onChange || function () {
      if (global.motor && global.motor._syncNav) global.motor._syncNav();
    };

    var srcs = {};
    document.querySelectorAll('[data-require-seen]').forEach(function (s) {
      (s.getAttribute('data-require-seen') || '').split(/\s+/).filter(Boolean)
        .forEach(function (src) { srcs[src] = true; });
    });

    Object.keys(srcs).forEach(function (src) {
      var probe = document.createElement('video');
      probe.preload = 'metadata';
      probe.muted = true;
      function marcarRoto() {
        if (rotos[src]) return;
        rotos[src] = true;
        onChange();
      }
      probe.addEventListener('error', marcarRoto, true);
      probe.addEventListener('loadedmetadata', function () {
        if (!rotos[src]) return;
        delete rotos[src];      // el archivo real llegó: el gate vuelve a valer
        onChange();
      });
      probe.src = src;
      probe.load();
      /* Respaldo: hay navegadores que ante una respuesta vacía no
         disparan `error` y se quedan en NETWORK_NO_SOURCE sin avisar.
         `videoUsable()` es justo lo que sabe leer ese estado. */
      setTimeout(function () { if (!videoUsable(probe)) marcarRoto(); }, opts.timeoutMs || 6000);
    });

    /* Un video que llegó al final ESTÁ VISTO (kit-base v1.9.74, §7.20 A7).
       Sin esto, el gate y el auto-avance se peleaban: `[data-autoadvance]`
       llama a `motor._advance(1)` cuando el video de fondo termina, y
       `_advance()` consulta `canAdvance` antes de pasar — o sea que el
       propio video que satisface el gate no lo satisfacía, y la
       diapositiva quedaba trabada justo cuando el alumno ya había hecho
       lo que se le pedía.
       Se engancha acá y no en `initBgVideos` porque vale para CUALQUIER
       patrón de video del kit: el de fondo, el del pop-up y el circular.
       El curso no tiene que cablear nada. */
    document.querySelectorAll('video').forEach(function (v) {
      v.addEventListener('ended', function () {
        var src = v.getAttribute('src') ||
          (v.querySelector('source') && v.querySelector('source').getAttribute('src'));
        if (src && srcs[src]) { visto.mark(src); onChange(); }
      });
    });

    return {
      faltan: function (slideEl) {
        var req = slideEl && slideEl.getAttribute('data-require-seen');
        if (!req) return [];
        return req.split(/\s+/).filter(Boolean).filter(function (src) {
          return !visto.seen(src) && !rotos[src];
        });
      },
      marcarVisto: function (src) { visto.mark(src); },
      visto: function (src) { return visto.seen(src); },
      roto: function (src) { return !!rotos[src]; }
    };
  }

  /* ---- 1. Video de fondo, diapositiva completa ---- */
  function initBgVideos(opts) {
    opts = opts || {};
    var videos = document.querySelectorAll('.d-shot-slide--bg-video video.d-shot-video');
    if (!videos.length) return;

    function tapOf(v) { var shot = v.closest('.d-shot'); return shot && shot.querySelector('.d-shot-video-tap'); }


    /* ---- Soltar el recurso del video que NO se está mirando ----
       kit-base v1.9.98, y es la causa DE FONDO de tres vueltas de
       "el video se tildó y quedó en negro" en iPad.

       Hasta acá, salir de una diapositiva con video de fondo solo lo
       PAUSABA. Un `<video>` pausado no es un `<video>` libre: sigue
       reteniendo su recurso —su buffer y, en iOS, su decodificador—
       exactamente igual que uno reproduciéndose. Medido en el curso
       real: 6 elementos `<video>` en el documento, los 6 con fuente
       enganchada al mismo tiempo, y 4 de ellos con `preload="auto"`,
       que quiere decir "bajá el archivo entero ya" (el de la portada
       solo pesa 21 MB).

       iOS tiene un tope de medios decodificables a la vez y, cuando lo
       pasa, DESALOJA uno. No avisa: el elemento desalojado se queda
       negro y deja de responder. Y el primer candidato a desalojar es
       el que está pausado — que es, exactamente, el reproductor del
       pop-up en el momento en que el alumno toca pausa. De ahí que el
       síntoma apareciera SIEMPRE al pausar, y que ninguna de las dos
       curas anteriores (§7.44 rescate, §7.45 PiP) lo tapara del todo:
       las dos trataban el efecto en el reproductor, no la presión que
       lo causaba.

       La cura de raíz es no tener abierto lo que nadie mira. Al salir
       de la diapositiva se le saca la fuente y se hace `load()`: eso
       libera buffer y decodificador y deja el `poster` a la vista, que
       es el mismo arte de la diapositiva. Al volver se vuelve a
       enganchar y `attempt()` lo arranca como siempre.

       ⚠️ La fuente se recuerda al INICIALIZAR, antes de que nada pueda
       soltarla: leerla al momento de soltar es leer lo que ya se
       borró. */
    function fuenteDe(v) {
      var s = v.querySelector('source');
      return v.getAttribute('src') || (s && s.getAttribute('src')) || '';
    }
    function soltar(v) {
      if (!v._fuenteBg || v.networkState === 0 /* NETWORK_EMPTY: ya está suelto */) return;
      var s = v.querySelector('source');
      if (s) s.removeAttribute('src');
      v.removeAttribute('src');
      try { v.load(); } catch (e) {}
    }
    function reenganchar(v) {
      if (!v._fuenteBg || fuenteDe(v)) return;
      var s = v.querySelector('source');
      if (s) s.setAttribute('src', v._fuenteBg);
      else v.setAttribute('src', v._fuenteBg);
      try { v.load(); } catch (e) {}
    }
    /* ⚠️ ESTA es la línea que "recuerda al inicializar" (kit-base
       v1.9.105). Faltó desde v1.9.98 hasta v1.9.104: el bloque relevado
       traía `soltar`/`reenganchar` pero no la asignación, así que las dos
       salían en su primera línea y la cura no hacía nada. La encontró
       "Prevención cardiovascular", que sí la tenía; la vigila
       `video-fondo-soltar.mjs`, que inyecta su propio video de fondo. */
    Array.prototype.forEach.call(videos, function (v) { v._fuenteBg = fuenteDe(v); });

    /* ---- `seen` / `markSeen` / `onFirstPlay`, igual que los otros
       patrones (kit-base v1.9.95) ----
       Los cuatro patrones de video de este archivo resuelven el mismo
       problema de negocio —"¿el alumno vio este video?"— y hasta acá
       `initBgVideos` era el único sin forma de contestarlo:
       `initInlineCircleVideos` y `initVideoPlayer` toman el trío y este
       tomaba `bgVideoAutoMudo` y nada más. Consecuencia real, y pasó en un
       curso: mover una diapositiva del patrón 3 (video chico dentro del
       arte) al patrón 1 (video de fondo) hacía perder los puntos y el
       logro por verlo, sin un solo error — y hay que reescribir a mano un
       listener que el kit ya sabe poner.

       ⚠️ Se escucha `playing` y NO `play`: `play` también se dispara
       cuando el navegador lo intenta y después rechaza, así que un curso
       que escuchara `play` pagaría un video que el alumno nunca vio. Es
       el mismo evento que usa la red de rescate del pop-up, por el mismo
       motivo: es el único que significa "hay imagen moviéndose".

       ⚠️ Y con el MISMO objeto de opciones que los otros init: cada
       `vistoAPI()` sin `seen`/`markSeen` propios se arma su memoria
       aparte, así que con objetos distintos `onFirstPlay` paga dos veces
       (ya documentado en `initVideoPlayer`). */
    var visto = vistoAPI(opts);
    Array.prototype.forEach.call(videos, function (v) {
      v.addEventListener('playing', function () {
        var src = v.currentSrc || v.getAttribute('src') ||
          (v.querySelector('source') && v.querySelector('source').getAttribute('src')) || '';
        if (!src || visto.seen(src)) return;
        visto.mark(src);
        var slide = v.closest('[data-slide]');
        if (opts.onFirstPlay) opts.onFirstPlay(src, slide && slide.getAttribute('data-slide'));
      });
    });

    /* ---- El rótulo del control lo pone EL KIT (kit-base v1.9.83) ----
       Hasta v1.9.82 el kit marcaba `data-modo` y el comentario decía
       "el curso decide el rótulo leyendo `data-modo`". Ningún curso lo
       hizo nunca —verificado sobre los cursos terminados—, así que el
       botón decía SIEMPRE lo mismo que trae el boilerplate,
       "Reproducir el video con sonido", incluso en el caso normal, que
       es el video ya corriendo mudo y el botón ofreciendo el audio.
       Otra vez la pieza puesta y el cable no (§7.17).

       Además el marcado del boilerplate es solo texto, y el CSS del
       chip estiliza un ícono + un `<span>`. En vez de pedirle a cada
       curso que cambie su marcado —que es lo que garantiza que alguno
       quede viejo—, el kit lo completa solo la primera vez: si el botón
       no tiene elementos adentro, le pone el ícono y el span. Un curso
       que YA traiga su propio marcado no se toca. */
    var ICONO_SONIDO = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'
      + '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>';
    var ROTULOS = {
      sonido: { txt: 'Tocá para escuchar', aria: 'Reproducir el video con sonido' },
      reproducir: { txt: 'Tocá para ver el video', aria: 'Reproducir el video' },
      /* `inicio` — el MISMO control, en la PRIMERA diapositiva del
         curso. Pedido del cliente sobre iPad: *"en lugar de empezar con
         sonido aparece un botón que dice «Tocá para escuchar»… que ese
         paso quede integrado a un botón de inicio del curso para que no
         se vea como un error"*.

         ⚠️ Lo primero, con todas las letras, porque se va a volver a
         preguntar: EN iOS NO HAY FORMA DE QUE EL AUDIO ARRANQUE SOLO.
         Safari exige un gesto del alumno antes de reproducir cualquier
         cosa con sonido, y eso incluye la voz de la locución. No es una
         limitación del curso ni del kit, y no hay permiso, flag ni
         truco que lo levante.

         Lo que sí se puede es que ese gesto no PAREZCA un error. En la
         portada el botón deja de ser un aviso de "che, falta el audio"
         y pasa a ser el botón de empezar: otro texto, otro tamaño,
         color de marca y ubicación de CTA (ver `[data-modo="inicio"]`
         en coto-media.css). Ese mismo toque desbloquea de una vez el
         video Y la locución —el kit ya repara la primera narración con
         el primer gesto real, `repararPrimeraLocucion()` en
         coto-player.js—, así que el alumno toca UNA vez y el curso
         arranca entero. */
      inicio: { txt: 'Tocá para comenzar', aria: 'Comenzar el curso con sonido' }
    };
    /* La PRIMERA diapositiva del curso lleva el rótulo de INICIO. Se
       decide por POSICIÓN EN EL DOM y no por un id ("portada") para
       que valga en cualquier curso del kit. */
    function esPrimeraDiapo(el) {
      var slide = el && el.closest('[data-slide]');
      if (!slide) return false;
      return slide === document.querySelector('[data-slide]');
    }

    function rotularTap(tap, modo) {
      if (!tap) return;
      /* ⚠️ La traducción `sonido` → `inicio` vive ACÁ ADENTRO, y no en
         cada llamador, porque el llamador que importa no es el del
         arranque: es el REINTENTO MUDO de `attempt()`, que al lograr
         reproducir sin sonido vuelve a rotular el chip como `sonido`
         para ofrecer el audio. Y ese es justamente el camino que corre
         en la portada cuando el navegador bloquea el autoplay — o sea,
         el caso exacto para el que existe el modo `inicio`.
         Rotulando solo al inicializar, el "Tocá para comenzar" se
         pisaba a los milisegundos y nadie lo veía nunca (medido: el
         chip salía con `data-modo="sonido"`). Con la decisión acá,
         cualquier llamador —los de hoy y los de mañana— queda cubierto
         sin tener que acordarse. */
      /* También desde `reproducir`, no solo desde `sonido` (kit-base
         v1.9.94). La traducción cubría un solo camino: el reintento mudo
         que LOGRA reproducir. Pero si el video no arranca en absoluto
         —el otro camino, y el más probable en el iframe de un LMS con la
         red apretada o un mp4 que no decodifica— el chip queda en
         `reproducir` y la portada dice "Tocá para ver el video" en vez
         de "Tocá para comenzar". Es el MISMO gesto y el mismo problema
         que motivó el modo `inicio`: que el paso obligatorio de iOS no
         se lea como un error.
         Lo delató el propio kit: `video-tap-chip` exige `inicio` en la
         primera diapositiva y `video-autoplay-ios` exigía `sonido` — un
         curso con la portada en `--bg-video` no podía pasar los dos. */
      if ((modo === 'sonido' || modo === 'reproducir') && esPrimeraDiapo(tap)) modo = 'inicio';
      tap.setAttribute('data-modo', modo);
      if (!tap.querySelector('svg, span')) {
        tap.innerHTML = ICONO_SONIDO + '<span></span>';
      }
      var span = tap.querySelector('span');
      var r = ROTULOS[modo] || ROTULOS.sonido;
      if (span) span.textContent = r.txt;
      tap.setAttribute('aria-label', r.aria);
    }
    /* Se normalizan TODOS al arrancar, no recién cuando hay que
       mostrarlos: así el botón está bien formado desde el primer frame
       —aunque nunca llegue a mostrarse— y cualquier curso o test que
       mire el DOM ve el control real, no el texto pelado del
       boilerplate. `sonido` es el modo por defecto porque es el normal:
       con el reintento mudo de §7.18 K10, cuando este botón aparece es
       casi siempre para ofrecer el audio. */
    Array.prototype.forEach.call(videos, function (v) { rotularTap(tapOf(v), 'sonido'); });

    /* ⚠️ Se LEE el estado, no se confía en el evento `cursotapado`.
       Bug de orden encontrado probándolo: `initBgVideos` hace su
       `sync()` inicial al arrancar, y si eso ocurre antes de que se
       registre el listener, el aviso se pierde y el video arranca igual
       detrás del cartel — que es exactamente lo que se quería evitar.
       La clase en `.d-stage` está puesta desde el primer `medir()` de
       `initAvisoGirar`, así que preguntarle a ella funciona sin importar
       quién se inicializó primero. El evento queda para la TRANSICIÓN
       (destapar → arrancar), que es lo que una clase no puede avisar. */
    function cursoTapado() {
      var st = document.querySelector('.d-stage');
      return !!(st && st.classList.contains('is-vertical'));
    }

    function attempt(v) {
      var tap = tapOf(v);
      if (tap) tap.hidden = true;
      if (!videoUsable(v)) return;
      /* Curso TAPADO (aviso "Girá tu dispositivo"): no arranca nada.
         Ver el comentario del listener de `cursotapado` más abajo. */
      if (cursoTapado()) { v.pause(); return; }
      try { v.currentTime = 0; } catch (err) {}
      v.muted = muted();
      v.volume = volumeLevel();
      // Defensa en profundidad, igual criterio que los otros 3 patrones
      // de video de este archivo (§ arriba, "Los 3 respetan..."): la
      // razón real de que la locución y el video de fondo no compitan
      // más es que `textOf()` (narrador.js) ya no narra una diapositiva
      // `.d-shot-slide--bg-video` — esto de acá es un segundo cinturón
      // por si algún día algo más queda narrando sobre esta diapo.
      silenciarLocucion();
      var p = v.play();
      /* ---- Si arrancó MUDO, el chip vuelve (kit-base v1.9.95) ----
         `attempt()` empieza escondiendo el chip, y hasta acá solo lo
         reponía el reintento mudo del `catch`. Pero al video lo
         reintentan DOS caminos más —el primer gesto del alumno (a) y
         `canplay` (b), los dos más abajo— y por ahí el chip no volvía.

         MEDIDO, con el primer `play()` rechazando `AbortError` (lo que
         pasa cuando el `<video>` todavía está resolviendo su fuente) y el
         reintento arrancando mudo: video reproduciéndose (`paused:false`,
         `muted:true`) y el chip ESCONDIDO. O sea el alumno mira la
         portada sin sonido y sin ninguna forma de pedirlo, porque el
         control que existe justo para eso lo había ocultado el primer
         intento fallido.

         Preguntarlo acá, en el único lugar por donde pasan los tres
         caminos, evita repetir la reposición en cada reintento — que es
         cómo se escapó la primera vez. El rótulo lo decide `rotularTap()`
         ('inicio' en la portada, 'sonido' en el resto). */
      function arrancoMudo() {
        /* `!muted()` es la mitad que faltaba, y la agarró
           `video-autoplay-ios`: si el alumno APAGÓ el sonido del curso, el
           video mudo es lo que pidió y ofrecerle audio es desobedecerlo.
           Solo se repone el chip cuando está mudo CONTRA su preferencia,
           que es el caso de la política de autoplay. */
        if (v.muted && !muted() && tap && videoUsable(v)) {
          tap.hidden = false;
          rotularTap(tap, 'sonido');
        }
      }
      /* ⚠️ Las dos ramas van en UN solo `then(ok, err)`, no en un `then()`
         seguido de un `catch()`: `p.then(cb)` devuelve una promesa NUEVA,
         y si el `play()` rechaza, esa derivada queda sin manejar y el
         navegador lo escribe en consola ("NotAllowedError: play() failed
         because the user didn't interact..."). Lo agarró `markup-sanity`,
         que trata cualquier error de consola como fallo — y tenía razón:
         un error suelto en consola es ruido que tapa el próximo de
         verdad. */
      if (p && p.then) p.then(arrancoMudo, function (err) {
        // NotAllowedError = falta un gesto → todavía hay algo que hacer.
        // Cualquier otro error (fuente rota, codec) → no sirve, se
        // queda el poster, que es el mismo arte de la diapositiva.
        var recuperable = err && err.name === 'NotAllowedError';
        if (!recuperable || !videoUsable(v)) { if (tap) tap.hidden = true; return; }

        /* ---- Reintento MUDO (kit-base v1.9.72, §7.18 K10) ----
           Reporte del cliente, con el curso ya en Moodle: "la portada
           sigue mostrando la imagen estática, el video no se reproduce".

           El diagnóstico: los navegadores bloquean el autoplay CON
           SONIDO mientras no haya habido un gesto del alumno. Como el
           toggle "Sonido" del curso arranca en ON, en la PRIMERA
           diapositiva ese `play()` es rechazado SIEMPRE. O sea que el
           patrón "video de fondo" —cuyo caso de uso principal, y su
           propio ejemplo en el comentario de arriba de este archivo, es
           la portada— nunca arrancaba solo. El comentario del kit ya
           decía "pasa SIEMPRE en la portada": estaba identificado como
           condición y asumido como inevitable.

           No lo es: lo que se bloquea es EL SONIDO, no el video. El
           autoplay mudo lo permiten todos los navegadores. Así que ante
           `NotAllowedError` —y solo ante ese— se reintenta en mudo. Si
           anda, el video corre y el botón pasa a OFRECER el sonido en
           vez de pedir que arranques el video.

           `bgVideoAutoMudo: false` en las opciones lo apaga, para un
           curso que prefiera el poster fijo antes que un video mudo.
           Default `true` porque una portada congelada es una falla
           visible para el alumno y la otra no. */
        if (opts.bgVideoAutoMudo === false || v.muted) {
          if (tap) { tap.hidden = false; rotularTap(tap, 'reproducir'); }
          return;
        }
        v.muted = true;
        var p2 = v.play();
        if (p2 && p2.then) {
          p2.then(function () {
            /* Anda mudo: el botón ya no dice "reproducir", ofrece el
               audio. El curso decide el rótulo leyendo `data-modo`. */
            if (tap) { tap.hidden = false; rotularTap(tap, 'sonido'); }
          }).catch(function () {
            v.muted = muted();
            if (tap) { tap.hidden = !videoUsable(v); rotularTap(tap, 'reproducir'); }
          });
        }
      });
    }

    function sync(id) {
      Array.prototype.forEach.call(videos, function (v) {
        var slide = v.closest('[data-slide]');
        var active = slide && slide.getAttribute('data-slide') === id;
        var tap = tapOf(v);
        if (!active) { v.pause(); soltar(v); if (tap) tap.hidden = true; return; }
        reenganchar(v);
        if (prefersReduced) return; // se queda en el poster, quieto
        attempt(v);
      });
    }

    Array.prototype.forEach.call(videos, function (v) {
      // El fin del video cuenta como fin de narración de la diapo: así el
      // autoplay del curso (si está activo) encadena a la siguiente.
      v.addEventListener('ended', function () { document.dispatchEvent(new CustomEvent('slidenarrationend')); });
      /* `[data-autoadvance]` en la diapo (NO el toggle global "Reproducir
         todo" que el cliente pidió sacar — CLAUDE.md §6.6, sigue sin
         botón): esto es más angosto — pedido puntual de "los videos de
         fondo de las portadas/separadores deberían pasar solos a la
         siguiente diapo, sin tocar 'Siguiente'" (así lo hacían en
         Storyline). Se marca por diapo porque NO aplica a toda diapo con
         video de fondo — solo a la que es puro separador, sin nada más
         que mirar/hacer ahí. */
      var slide = v.closest('[data-slide]');
      if (slide && slide.hasAttribute('data-autoadvance')) {
        v.addEventListener('ended', function () {
          if (global.motor) global.motor._advance(1);
        });
      }
      var tap = tapOf(v);
      /* Si el video YA está corriendo mudo (reintento de arriba), el
         botón solo saca el mute: volver a pasar por `attempt()`
         reiniciaría `currentTime` a 0 y la portada empezaría de nuevo
         delante del alumno (kit-base v1.9.72, §7.18 K10). */
      if (tap) tap.addEventListener('click', function () {
        var modo = tap.getAttribute('data-modo');
        /* Antes de tocar el video: si el chip ofrece SONIDO, el tap vale
           como pedido de audio y levanta el mute global (ver
           `pedirAudio()` arriba). Va PRIMERO porque el `attempt()` de
           abajo arranca con `v.muted = muted()` — si la marca sigue
           puesta, el reintento sale mudo otra vez y el botón queda sin
           efecto audible. */
        if (modo === 'sonido' || modo === 'inicio') pedirAudio();
        if (!v.paused && v.muted && (modo === 'sonido' || modo === 'inicio')) {
          v.muted = false;
          v.volume = volumeLevel();
          tap.hidden = true;
          return;
        }
        attempt(v);
      });
      // La fuente falla DESPUÉS del primer intento (404, 0 bytes, codec):
      // el botón de gesto ya no tiene nada que hacer, se esconde.
      v.addEventListener('error', function () { if (tap) tap.hidden = true; }, true);
    });

    document.addEventListener('slidechange', function (e) { sync(e.detail.id); });

    /* ---- Mientras el curso esté TAPADO, no arranca ----
       ⚠️ BUG REAL: con el aviso "Girá tu dispositivo" puesto, el video
       de la portada se reproducía DETRÁS del cartel. Y como esa diapo
       es `[data-autoadvance]`, al terminar el curso avanzaba solo: el
       alumno giraba y aparecía en la diapositiva 2, habiéndose perdido
       la portada entera. Nada fallaba de forma visible — simplemente se
       le había pasado el contenido por atrás.

       `cursotapado` lo emite `initAvisoGirar` (coto-player.js) cuando
       una pantalla completa se interpone entre el alumno y el curso. No
       es lo mismo que "la diapo no está activa": la diapo ES la activa,
       lo que pasa es que todavía no se la está viendo.

       Al destaparse se llama a `sync()`, no a `attempt()` directo, para
       que valga el mismo criterio de siempre (diapo activa,
       prefersReduced, fuente usable) — y como `attempt()` arranca en
       `currentTime = 0`, el video empieza DESDE EL PRINCIPIO, que es lo
       que el alumno espera al destapar. */
    /* ---- Con la pantalla apagada o la app en segundo plano, se pausa ----
       ⚠️ BUG REAL, reporte del cliente con foto de la pantalla de
       bloqueo del iPad: al bloquear el dispositivo aparecía el widget
       de reproducción del sistema, con el nombre del curso y controles
       de play/pausa.

       Eso no es un adorno: iOS lo muestra PORQUE HAY UN VIDEO
       REPRODUCIÉNDOSE. Al apagar la pantalla el curso seguía corriendo
       —gastando batería, y con las diapositivas `[data-autoadvance]`
       avanzando solas—, así que el alumno podía desbloquear y
       encontrarse tres diapositivas más adelante sin haber visto nada.
       Como el bug del cartel de girar: nada falla de forma visible, el
       contenido simplemente se le pasó por atrás.

       `visibilitychange` cubre las dos situaciones con el mismo
       criterio: pantalla bloqueada y app en segundo plano.

       Al volver NO se reanuda donde estaba: `sync()` reinicia en
       `currentTime = 0`, que es lo correcto cuando el alumno se fue a
       la mitad — vuelve a ver la diapositiva entera, no el pedazo que
       le quedaba. Mismo criterio que al destaparse el cartel de girar.

       La locución se corta por la misma razón: una voz que sigue
       hablando con el dispositivo bloqueado es peor que una que se
       interrumpe.

       REGLA: ningún medio del curso sigue corriendo con la página
       oculta. */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        Array.prototype.forEach.call(videos, function (v) { v.pause(); });
        silenciarLocucion();
        return;
      }
      var cur = global.motor && global.motor.current();
      if (cur) sync(cur.getAttribute('data-slide'));
    });

    document.addEventListener('cursotapado', function (e) {
      if (e.detail && e.detail.tapado) {
        Array.prototype.forEach.call(videos, function (v) {
          v.pause();
          var tap = tapOf(v);
          if (tap) tap.hidden = true;
        });
        return;
      }
      var cur = global.motor && global.motor.current();
      if (cur) sync(cur.getAttribute('data-slide'));
    });

    /* ⚠️ BUG REAL, reporte del cliente probando en iPad: "entré al curso
       y me mostró una imagen fija; hice clic en la diapo siguiente,
       volví, y RECIÉN AHÍ arrancó el video solo" (kit-base v1.9.83).

       El reintento mudo de `attempt()` (§7.18 K10) cubre el rechazo por
       política de autoplay, pero sus DOS intentos pasan en el mismo
       instante: al cargar. Y al cargar todavía pueden faltar dos cosas
       distintas:

         · el GESTO. Safari no da por válido ningún gesto previo cuando
           el SCO recién se monta dentro del iframe del LMS, así que
           incluso el intento mudo puede caer;
         · los DATOS. `preload="auto"` sobre un .mp4 de 20MB no garantiza
           que haya un solo frame decodificado: `play()` puede resolver y
           quedarse igual en el póster, buffereando.

       Las dos terminan en lo mismo que vio el cliente —póster quieto— y
       las dos se resuelven solas al VOLVER a pasar por la diapo, porque
       para entonces ya hubo gesto y ya hay datos. De ahí que navegar y
       volver "lo arreglara": no era otro estado, era un segundo intento
       más tarde.

       No se puede distinguir cuál de las dos fue sin un iPad en la mano,
       así que se cubren las dos con el mismo criterio: NO confiar en que
       el único intento sea el de la carga. Y el daño no es solo visual:
       estas diapositivas suelen ser `[data-autoadvance]` y encadenan con
       el evento `ended`, así que un video que no arranca deja al curso
       esperando un final que no va a llegar nunca. */

    // a) Primer gesto real del alumno, venga de donde venga. `once`, en
    //    captura y pasivo: no interfiere con el toque que el alumno
    //    estaba dando (avanzar, abrir un pop-up, lo que sea).
    var reintentado = false;
    function reintentarUnaVez() {
      if (reintentado || prefersReduced) return;
      reintentado = true;
      var activa = global.motor && global.motor.current();
      if (!activa) return;
      var id = activa.getAttribute('data-slide');
      Array.prototype.forEach.call(videos, function (v) {
        var suya = v.closest('[data-slide]');
        if (!suya || suya.getAttribute('data-slide') !== id) return;
        /* Sale si ya está reproduciendo: un video andando mudo NO se
           reinicia porque el alumno tocó cualquier otra cosa. Para
           recuperar el audio está el control `.d-shot-video-tap`, que
           es un toque deliberado sobre ese control. */
        if (!v.paused) return;
        attempt(v);
      });
    }
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, reintentarUnaVez, { once: true, capture: true, passive: true });
    });

    // b) El video ya tiene datos para arrancar pero sigue quieto. Cubre
    //    "play() resolvió y se quedó buffereando" sin depender de que el
    //    alumno toque nada.
    Array.prototype.forEach.call(videos, function (v) {
      v.addEventListener('canplay', function () {
        if (!v.paused || prefersReduced) return;
        var activa = global.motor && global.motor.current();
        var suya = v.closest('[data-slide]');
        if (!activa || !suya) return;
        if (suya.getAttribute('data-slide') !== activa.getAttribute('data-slide')) return;
        attempt(v);
      });
    });

    var cur = global.motor && global.motor.current();
    if (cur) sync(cur.getAttribute('data-slide'));
  }

  /* ---- 2. Reproductor en pop-up ---- */
  /* Handle al reproductor en pop-up, para que OTROS patrones de video
     de este archivo puedan DERIVARLE un clip en vez de reproducirlo
     ellos (ver `data-video-popup` más abajo).
     Vive en el scope del módulo y se consulta recién AL HACER CLIC, no
     al init: así da igual en qué orden el curso llame a
     `initVideoPlayer` y a `initInlineCircleVideos`, y un curso que no
     tenga el pop-up en su HTML simplemente no deriva nada y se queda
     con el comportamiento de siempre. */
  var reproductorPopup = null;

  function initVideoPlayer(opts) {
    opts = opts || {};
    var player = document.getElementById(opts.playerId || 'd-video-player');
    var titleEl = document.getElementById(opts.titleId || 'd-video-title');
    var popupId = opts.popupId || 'video-player';
    var visto = vistoAPI(opts);
    if (!player) return;
    /* Una SEGUNDA llamada no vuelve a montar nada (kit-base v1.9.116):
       solo engancha los disparadores nuevos. Antes cada llamada sumaba
       otra barra de controles y otro juego de escuchas sobre el mismo
       reproductor, y el aviso de "Recuperando…" se prendía en la barra
       que nadie veía. Pasó cuando la plantilla de curso.js empezó a
       llamarla siempre y `reproductor-video`, en un curso sin video,
       inyecta su disparador y la llama otra vez. Las opciones de la
       segunda llamada se ignoran: valen las de la primera. */
    if (player.__cotoVP) { player.__cotoVP.enganchar(); return; }

    player.addEventListener('error', function () { mostrarErrorVideo(player); });
    sinPiP(player); // ver el comentario largo de `sinPiP` arriba
    /* Controles PROPIOS (kit-base v1.9.98): sin la barra nativa, los
       botones de PiP y AirPlay no existen y el estado es nuestro. Ver el
       comentario largo de `montarControles`. */
    var ctl = montarControles(player);
    /* La locución nunca compite con el video, venga el play de donde
       venga: `abrir()` ya la calla, pero ahora el alumno también puede
       arrancar desde nuestro botón o desde un clic en la imagen. */
    player.addEventListener('play', function () { silenciarLocucion(); });

    /* ---- Red de rescate: "lo pausé, se puso todo negro y no arrancó
       más" (kit-base v1.9.95) ----
       BUG REAL, reporte del cliente en iPad con foto: el pop-up abierto,
       los controles nativos a la vista marcando `0:21 / -0:49` —o sea el
       <video> SABE dónde está y cuánto dura— y el cuadro entero negro.
       Al tocar play, nada.

       Lo primero fue descartar culpa nuestra en vez de suponerla:
       instrumentando el reproductor (src, load(), pause(),
       removeAttribute) y disparando un `pause`, NINGÚN handler del kit ni
       del curso lo toca. El único que vacía la fuente es el de
       `popupclose`, y el pop-up seguía abierto. Así que el que soltó el
       video fue el NAVEGADOR.

       Dos causas conocidas, las dos de iOS y las dos con el mismo síntoma
       exacto (posición y duración intactas, imagen negra):
         · el alumno tocó Picture-in-Picture o AirPlay en la barra nativa
           —están pegados al botón de pausa— y la imagen se fue a otro
           lado; al volver, el elemento de la página queda vacío;
         · Safari le saca el decodificador a un <video> pausado cuando
           necesita memoria, y descarta el recurso.

       Las dos avisan: cuando un elemento suelta su recurso dispara
       `emptied`. Ese evento es la señal de "acá ya no hay video", y es
       accionable — sabemos la fuente y sabemos en qué segundo estaba. Así
       que se vuelve a enganchar el mismo .mp4 y se busca el segundo donde
       quedó: el alumno ve su cuadro de vuelta y sigue con el play de
       siempre, sin cerrar y reabrir la ficha (que además lo devolvía al
       principio del clip).

       Se rescata SOLO con el pop-up abierto: al cerrarlo vaciamos nosotros
       a propósito (más abajo), y ahí `emptied` es lo esperado. Eso está
       cuidado DOS veces —el guard de `.open` de acá abajo y el
       `fuenteActual = ''` del handler de `popupclose`— y conviene saber
       que es redundancia a propósito: MEDIDO, sacando cualquiera de los
       dos el comportamiento no cambia, y hace falta sacar LOS DOS para
       que el rescate se dispare al cerrar. O sea que el test solo puede
       ver el caso de los dos juntos: si alguien limpia uno "porque está
       repetido", la suite no se va a quejar.
       `rescatando` se apaga en `loadstart` —el evento que el algoritmo de
       carga dispara justo después de `emptied`— para que el vaciado que
       provoca nuestro propio `player.src = …` no se lea como una segunda
       pérdida y entre en bucle.

       PREVENCIÓN, aparte de la cura: el marcado del reproductor lleva
       `disablepictureinpicture` y `controlslist="…noremoteplayback"`.
       ⚠️ El parche que trajo esto decía que son *"las mismas dos defensas
       que el video EN EL LUGAR ya tenía"*. MEDIDO: no las tenía —
       `disablepictureinpicture` no aparecía en ninguna parte del kit, y
       el único `controlslist` estaba dentro de un comentario contando que
       una vuelta anterior probó `nofullscreen` y el cliente pidió
       explícitamente que la pantalla completa quedara. Estos dos
       atributos no tocan ese botón: sacan PiP y AirPlay, que son los que
       se llevan la imagen. */
    var fuenteActual = '';
    var segActual = 0;
    var rescatando = false;
    player.addEventListener('timeupdate', function () {
      if (player.currentTime > 0) segActual = player.currentTime;
    });
    player.addEventListener('loadstart', function () { rescatando = false; });

    /* El indicador de carga es UNO SOLO para los dos caminos que pueden
       dejar la ficha en negro esperando red: abrir el video (§7.44) y
       rescatarlo (acá abajo). Antes el rescate no lo prendía, así que
       recuperarse se veía igual que estar roto: un rectángulo negro
       quieto. */
    function cargando(on, motivo) {
      var tarjeta = player.closest('.modal-card');
      if (tarjeta) tarjeta.classList.toggle('is-cargando', !!on);
      /* Con controles propios el aviso lleva PALABRAS, no solo un
         spinner: "Recuperando el video…" le dice al alumno que el curso
         está haciendo algo. El rectángulo negro mudo era, según el
         reporte, indistinguible de estar roto. */
      if (ctl) ctl.estado(on ? (motivo || 'cargando') : null);
    }
    player.addEventListener('playing', function () { cargando(false); });
    player.addEventListener('error', function () { cargando(false); });

    /* Volver a enganchar el .mp4 en el segundo donde estaba, y dejar el
       reproductor como el alumno lo dejó.
       Los dos detalles que lo hacen invisible, y que son la diferencia
       entre "se recuperó" y "sigue roto":
         · se BUSCA el segundo guardado aunque el video esté pausado — un
           `seek` pinta el cuadro, y sin eso la ficha se queda negra
           hasta que el alumno toque play a ciegas;
         · si estaba reproduciendo, sigue reproduciendo. */
    function rescatar() {
      if (rescatando || !fuenteActual) return;
      var pop = document.querySelector('[data-popup="' + popupId + '"]');
      if (!pop || !pop.classList.contains('open')) return; // el cierre vacía a propósito
      var seg = segActual;
      var andaba = !player.paused;
      rescatando = true;
      cargando(true, 'recuperando');
      player.addEventListener('loadedmetadata', function () {
        try { if (seg > 0 && seg < player.duration) player.currentTime = seg; } catch (err) {}
        if (andaba) player.play().catch(function () {});
        else cargando(false); // pausado: alcanza con el cuadro del seek
      }, { once: true });
      player.addEventListener('error', function () { cargando(false); }, { once: true });
      player.src = fuenteActual; // el cambio de src dispara la carga solo
    }

    // 1) el navegador AVISA que soltó el recurso
    player.addEventListener('emptied', rescatar);
    /* 2) y cuando no avisa: el alumno toca play sobre un elemento que ya
          no tiene nada cargado (`HAVE_NOTHING`). Sin esto, el caso del
          desalojo silencioso de iOS se queda trabado igual. */
    player.addEventListener('play', function () {
      if (player.readyState === 0 /* HAVE_NOTHING */ && fuenteActual) rescatar();
    });

    /* Abrir el pop-up y arrancar el clip, con TODA la contabilidad
       (primer visionado, puntos, revalidar el gate) de este lado: quien
       derive un video acá no tiene que repetir nada.
       ⚠️ Los dos init van con EL MISMO objeto de opciones: cada
       `vistoAPI()` sin `seen`/`markSeen` propios se arma su memoria
       aparte, así que con objetos distintos `onFirstPlay` paga los
       puntos dos veces. */
    function abrir(src, title) {
      if (!src) return;
      title = title || 'Video';
      if (titleEl) titleEl.textContent = title;
      silenciarLocucion();
      ocultarErrorVideo(player); // por si quedó de un video roto anterior en el mismo pop-up
      fuenteActual = src; // para la red de rescate de arriba
      segActual = 0;
      /* ⚠️ LA RED DE RESCATE NO SE DISPARA EN LA APERTURA (kit-base
         v1.9.98). Poner `src` arranca una carga nuestra, y esa carga
         emite las DOS señales que el rescate escucha:

           · `emptied`, si el `<video>` ya tenía una fuente — medido:
             abrir un segundo video en el mismo pop-up emite
             `emptied, loadstart, error`, en ese orden;
           · y el `play` de abajo con `readyState === 0`, porque justo
             después de asignar `src` el elemento todavía no cargó nada
             — medido: `readyState:0, networkState:3`.

         Sin este candado, TODA apertura entraba al rescate: una segunda
         carga del mismo archivo y el cartel equivocado ("Recuperando el
         video…" en vez de "Cargando el video…"). Lo agarró una medición
         del aviso al abrir, que decía "Recuperando" en la primera
         apertura.

         Se reusa `rescatando`, que ya significa exactamente eso — "hay
         una carga en vuelo, no arranques otra" — y lo baja el
         `loadstart` de esta misma carga, antes de que un desalojo real
         pueda pasar. El primer camino (`emptied` al cambiar de video)
         ya se disparaba de más desde v1.9.95; no lo trajo esta vuelta. */
      rescatando = true;
      player.src = src;
      player.muted = muted();
      player.volume = volumeLevel();
      global.motor.showPopup(popupId);
      /* Señal de "está cargando" hasta el primer cuadro real. Ver el CSS
         pareja en coto-media.css: sin esto, la espera de red del .mp4 se
         ve como un rectángulo negro quieto, que el alumno no puede
         distinguir de un cuelgue. La apagan los listeners de
         `playing`/`error` de más arriba, compartidos con el rescate. */
      cargando(true);
      player.play().catch(function () {});
      if (!visto.seen(src)) {
        visto.mark(src);
        if (opts.onFirstPlay) opts.onFirstPlay(src, title);
      }
      if (opts.afterPlay) opts.afterPlay(src, title);
    }
    reproductorPopup = { abrir: abrir, popupId: popupId, player: player };

    function enganchar() {
      document.querySelectorAll('[data-video-play]').forEach(function (btn) {
        if (btn.__cotoVP) return;
        btn.__cotoVP = true;
        btn.addEventListener('click', function () {
          abrir(btn.getAttribute('data-video'), btn.getAttribute('data-video-title'));
        });
      });
    }
    player.__cotoVP = { enganchar: enganchar };
    enganchar();

    // Al cerrar el pop-up hay que soltar el archivo: sin esto el video
    // sigue descargando/sonando de fondo en algunos navegadores.
    document.addEventListener('popupclose', function (e) {
      if (e.detail && e.detail.id === popupId) {
        fuenteActual = ''; // apaga la red de rescate: este vaciado es a propósito
        segActual = 0;
        player.pause();
        player.removeAttribute('src');
        player.load();
      }
    });
  }

  /* ---- 3. Video que se reproduce EN EL LUGAR, sobre la captura ----
     Dos variantes del mismo mecanismo, y la diferencia la decide el
     MARCADO, no un parámetro:

     a) Con un `.d-shot-hit-play` adentro (el círculo de "Prevención
        cardiovascular"): el arte de base es la propia captura de la
        diapositiva, así que el <video> vive oculto (`opacity:0`) y solo
        se muestra mientras reproduce — si quedara visible, al terminar
        mostraría su último cuadro (negro) tapando el dibujo. El botón
        de play lo dibuja el kit.

     b) Sin `.d-shot-hit-play` (agregado en kit v1.9.21 para
        "Seguridad alimentaria"): el arte YA trae dibujado un
        reproductor completo (marco, triángulo de play, barra de
        progreso) y el `poster` del <video> es un recorte de ese mismo
        dibujo. Acá el <video> tiene que estar VISIBLE siempre — es él
        el que muestra el mockup — y no puede llevar `controls` de
        entrada: el navegador superpondría SUS controles sobre los
        dibujados y el play real quedaría desalineado del que el alumno
        ve (bug real ya documentado para pop-ups en CLAUDE.md §6.29,
        que hasta ahora solo estaba resuelto en `initPopupVideos`).
        Patrón: todo el video es el target de clic, `controls` se
        agrega recién en el evento `play` y se saca al terminar o al
        salir de la diapositiva, con `currentTime = 0`, para que al
        volver se vea otra vez el mockup limpio.
     La variante se marca con `.is-poster` en el wrapper desde acá (no
     desde el HTML del curso) para que el CSS pareja no dependa de
     `:has()` ni de que alguien se acuerde de poner una clase.

     BUG REAL encontrado en revisión (kit v1.9.22): la variante (b)
     confiaba 100% en el atributo `poster` nativo del `<video>` para
     mostrar el mockup — funciona en Chromium, pero varios navegadores
     (Safari en particular, y cualquiera con el códec del `.mp4`
     rechazado) REEMPLAZAN el poster por su propio ícono de "medio
     roto" en cuanto intentan precargar metadata de una fuente que no
     pueden decodificar — exactamente el caso de un placeholder de 0
     bytes (CLAUDE.md §3.9), que TODO curso tiene hasta que el cliente
     sube los videos reales. Resultado real: el botón de play dibujado
     en el poster desaparece, sin ningún error visible, en cualquier
     navegador que no sea Chrome de escritorio.
     Fix: el mockup deja de depender del atributo `poster` del
     `<video>` (que sigue puesto, como respaldo) y pasa a vivir como un
     `<img>` real, hijo del wrapper, DEBAJO del video — un `<img>` no
     tiene códec que rechazar, así que su render es inmune a esto. El
     `<video>` pasa a comportarse EXACTAMENTE como la variante circular
     de arriba (`opacity:0` en reposo, `opacity:1` en `.is-playing`):
     dejó de ser cierto que "acá el video tiene que estar visible
     siempre" — ahora lo visible siempre es el `<img>`, y el video
     aparece recién cuando hay algo real que mostrar. */
  function initInlineCircleVideos(opts) {
    opts = opts || {};
    var visto = vistoAPI(opts);
    var wraps = document.querySelectorAll('[data-inline-video]');

    wraps.forEach(function (wrap) {
      var video = wrap.querySelector('.d-shot-hit-video');
      var playBtn = wrap.querySelector('.d-shot-hit-play');
      dibujarPlay(playBtn);   // el kit pone el triángulo (ver `dibujarPlay`)
      var src = wrap.getAttribute('data-video');
      var title = wrap.getAttribute('data-video-title') || 'Video';
      if (!video) return;
      /* ---- `data-video-popup`: este recuadro NO reproduce en el lugar ----
         BUG REAL, reporte del cliente con el curso embebido en Moodle
         SIN pantalla completa: *"mirá qué grande se ve el botón de
         play, debería ser responsive"*. No era el botón del kit —ese ya
         es % con tope en px— sino la BARRA DE CONTROLES NATIVA que la
         variante con carátula agrega al reproducir.

         Los controles nativos de `<video>` tienen un tamaño MÍNIMO fijo
         que el navegador no achica: en un recuadro de ~30% del lienzo
         (el caso real: `data-w="29.52"`, ~290 px a tamaño ventana) la
         barra se come casi la mitad del alto y tapa el arte del
         reproductor que dibujó el diseñador.

         ⚠️ Y NO HAY CSS QUE LO ARREGLE: el shadow DOM de los controles
         nativos es cerrado, y `zoom`/`scale` sobre el `<video>` achican
         también la imagen. Cuando un control nativo no entra, la
         respuesta no es CSS — es moverlo a un contenedor donde entre.

         Con el atributo, el clic deriva el clip al reproductor en
         pop-up, que mide `min(760px,100%)` y ahí los controles SÍ están
         en proporción. El `<video>` de la diapositiva se queda igual
         —con su `poster` y su `<source>`— porque es el que miran
         `videoUsable()` y el gate de avance (`data-require-seen`);
         simplemente no se reproduce nunca.

         REGLA: si el recuadro mide menos de ~40% del ancho del lienzo,
         va con `data-video-popup`. Reproducir en el lugar es para
         recuadros grandes, o para la variante circular, que nunca
         lleva controles nativos.

         Si el curso no tiene el pop-up en su HTML, `reproductorPopup`
         queda en null y esto cae solo al comportamiento de siempre:
         sin el atributo, NADA cambia para los cursos existentes. */
      var aPopup = wrap.hasAttribute('data-video-popup');
      /* `poster` ya NO es "sin botón de play" (`!playBtn`): un video
         puede tener carátula real Y un botón de play interactivo propio
         a la vez (caso real, "Seguridad alimentaria" — la carátula es
         un patrón de marca del cliente, sin ningún control dibujado
         adentro, así que necesita el botón real del kit encima). La
         imagen de carátula se inserta siempre que haya `poster` en el
         `<video>`, tenga o no `.d-shot-hit-play`; el botón (si existe)
         se cablea aparte, más abajo. */
      var posterUrl = video.getAttribute('poster');
      var poster = !!posterUrl;
      if (poster) {
        wrap.classList.add('is-poster');
        video.removeAttribute('controls'); // por si el HTML lo trajo puesto
        var posterImg = document.createElement('img');
        posterImg.className = 'd-shot-hit-poster-img';
        posterImg.src = posterUrl;
        posterImg.alt = '';
        posterImg.setAttribute('aria-hidden', 'true');
        wrap.insertBefore(posterImg, video);
      }

      function start() {
        if (aPopup && reproductorPopup) { reproductorPopup.abrir(src, title); return; }
        silenciarLocucion();
        wrap.classList.add('is-playing');
        video.muted = muted();
        video.volume = volumeLevel();
        var p = video.play();
        if (p && p.catch) p.catch(function () { wrap.classList.remove('is-playing'); });
        if (!visto.seen(src)) {
          visto.mark(src);
          if (opts.onFirstPlay) opts.onFirstPlay(src, title);
        }
        // Gancho para revalidar el candado de avance de la diapo
        // (data-require-seen) apenas se reproduce — ver CLAUDE.md §9.
        if (opts.afterPlay) opts.afterPlay(src, title);
      }

      // stopPropagation: el wrapper es un [data-hit] del motor; sin esto
      // el clic del play dispararía además la acción de la hitbox.
      if (playBtn) playBtn.addEventListener('click', function (e) { e.stopPropagation(); start(); });

      /* BUG REAL ("Seguridad alimentaria"): al tocar PAUSA en los
         controles nativos, el video volvía a la carátula y el audio
         seguía sonando. Causa: el clic sobre los controles nativos se
         despacha sobre el `<video>` ANTES de que el navegador aplique
         su acción por default, así que un handler que decide mirando
         `video.paused` lee siempre el estado VIEJO — pausaba a mano,
         y acto seguido el control nativo alternaba de pausado a
         reproduciendo. Resultado: `.is-playing` sacada (carátula
         encima) sobre un video andando.
         Fix: mientras haya controles nativos, el play/pausa es de
         ELLOS — este toggle solo actúa antes del primer play (cuando
         todavía no hay `controls`), que es el caso de la variante
         circular sin carátula. */
      /* NORMA DEL KIT desde v1.9.98: ningún video del curso usa la barra
         NATIVA. Los controles los dibuja `montarControles()` — ver su
         comentario largo para el porqué (cuatro fallas de iPad con la
         misma causa de fondo). */
      /* Con la barra del kit el clic es SIEMPRE nuestro, así que el guard
         de `controls` ya no hace falta: el baile del doble toggle que
         describe el comentario de arriba no puede volver a pasar. Igual
         se deja el toggle, que es lo que espera cualquiera que toque la
         imagen de un video. */
      if (poster && !aPopup) montarControles(video, { ocultarHastaPrimerPlay: true });
      video.addEventListener('click', function () {
        /* ⚠️ REGRESIÓN DE v1.9.98, cerrada en v1.9.99 (el guard viene de
           "Seguridad alimentaria"). Con la carátula, `montarControles()`
           YA pone su propio toggle en el clic sobre el `<video>`
           (`alternar`), y este handler corre DESPUÉS sobre el mismo clic.
           Sin el guard: `alternar` pausa y este ve `paused` y vuelve a
           arrancar. MEDIDO en el curso generado: con el video
           reproduciendo, tocar la imagen dejaba el video reproduciendo —
           no había forma de pausar desde la imagen.
           Una vez andando, el play/pausa es de la barra propia; este
           toggle queda para la variante circular (sin carátula, sin
           barra) y para antes del primer play. */
        if (poster && wrap.classList.contains('is-playing')) return;
        if (video.paused) start();
        else video.pause();
      });

      /* El estado visual lo manda el propio `<video>`, no quien lo
         disparó: así da igual si arrancó por el botón del kit, por un
         clic sobre el video o por los controles nativos. */
      video.addEventListener('play', function () {
        wrap.classList.add('is-playing');
      });
      /* En pausa, la variante con carátula se QUEDA mostrando el video
         (su cuadro actual + los controles nativos) — volver a la
         carátula ahí es justamente el bug de arriba. La variante
         circular sí vuelve al arte de base: no tiene controles con los
         que retomar, el único affordance es su botón de play. */
      if (!poster) {
        video.addEventListener('pause', function () { wrap.classList.remove('is-playing'); });
      }
      /* BUG REAL ("Seguridad alimentaria"), corregido acá en vez de
         evitado: controles NATIVOS incluyen el botón de pantalla
         completa, y este video vive dentro de una diapositiva-captura
         posicionada por `_initShots()` (left/top/width/height en px,
         recalculados en `slidechange`/resize) — entrar y salir de
         fullscreen NATIVO no dispara ninguno de esos dos eventos, así
         que el cliente reportó el video "roto" (mal posicionado) al
         volver de pantalla completa. La vuelta anterior lo evitaba
         sacando el botón (`controlslist="nofullscreen"`), pero el
         cliente pidió explícitamente que la pantalla completa quedara
         habilitada — el arte del reproductor ya la dibuja. Fix real:
         escuchar `fullscreenchange` y volver a correr `_initShots()`
         al SALIR — el mismo recálculo que ya corre en cada resize,
         disparado a mano porque este evento no cuenta como uno. */
      /* ⚠️ Y `webkitendfullscreen` TAMBIÉN, que es el que llega en iPad
         (kit-base v1.9.97). Safari de iOS/iPadOS NO emite
         `fullscreenchange` para la pantalla completa NATIVA de un
         `<video>`: emite `webkitbeginfullscreen` / `webkitendfullscreen`
         sobre el propio elemento. O sea que en el dispositivo donde más se
         usa esa pantalla completa —y donde el cliente reportó que el
         reproductor "se tilda", ni se agranda ni se achica bien— el
         recálculo no corría NUNCA.
         El síntoma es el mismo que el `fullscreenchange` ya arreglaba: este
         `<video>` está posicionado en px sobre la captura por
         `_initShots()`, y salir de pantalla completa no dispara ningún
         resize. Lo que faltaba no era el arreglo: era el evento por el que
         llega en iOS.
         ⚠️ No se pudo reproducir el fullscreen nativo de iOS en el
         Chromium de la suite; lo verificado es el mecanismo — que el
         listener esté puesto y que al recibir el evento se recalcule. */
      function alSalirDePantallaCompleta() {
        if (window.motor && window.motor._initShots) window.motor._initShots();
      }
      video.addEventListener('fullscreenchange', function () {
        if (!document.fullscreenElement) alSalirDePantallaCompleta();
      });
      video.addEventListener('webkitendfullscreen', alSalirDePantallaCompleta);
      video.addEventListener('ended', function () {
        wrap.classList.remove('is-playing');
        /* Vuelve al reposo de la barra propia. Antes esto apagaba
           `v.controls`; es lo mismo con la interfaz nueva. */
        if (poster) { var envolt = video.parentElement; if (envolt) envolt.classList.add('d-vp-virgen'); }
        video.currentTime = 0; // para que el próximo play arranque desde el inicio, no desde el final
      });
      video.addEventListener('error', function () {
        wrap.classList.remove('is-playing');
        mostrarErrorVideo(video);
      });
      /* Mismo problema que el reproductor del pop-up, y acá molesta más:
         este `<video>` está posicionado en px sobre la captura por
         `_initShots()`, así que irse a PiP y volver lo deja fuera de lugar
         además de fuera de la diapositiva.
         ⚠️ El parche que trajo esto decía que este video "ya llevaba
         `disablepictureinpicture` en el marcado desde que se armó". MEDIDO:
         no lo llevaba — ese atributo no existía en ninguna parte del kit
         antes de v1.9.95. Lo pone `sinPiP()` por código, que además es lo
         único que sirve en WebKit. */
      sinPiP(video);
    });

    /* BUG REAL (reportado por el cliente en "Prevención cardiovascular"):
       el video circular seguía sonando después de cambiar de diapositiva.
       Los otros dos patrones ya tenían su punto de corte — el de fondo
       sincroniza con `slidechange`, el de pop-up se detiene en
       `popupclose` — pero este no tenía NINGUNO: se queda en el DOM de
       una diapositiva oculta, reproduciéndose, y el alumno escucha una
       voz sin saber de dónde sale.
       Regla general para cualquier medio con audio que se sume acá:
       preguntarse SIEMPRE "¿quién lo apaga?" antes de darlo por listo. */
    function pausarFuera(id) {
      wraps.forEach(function (wrap) {
        var slide = wrap.closest('[data-slide]');
        if (slide && slide.getAttribute('data-slide') === id) return;
        var v = wrap.querySelector('.d-shot-hit-video');
        if (v && !v.paused) v.pause();
        // Variante (b): al salir de la diapositiva se vuelve al mockup
        // limpio (sin controles nativos encima del dibujado) y al
        // principio del clip, igual que hace initPopupVideos al cerrar.
        if (v && wrap.classList.contains('is-poster')) {
          v.removeAttribute('controls');
          v.currentTime = 0;
        }
        wrap.classList.remove('is-playing');
      });
    }
    document.addEventListener('slidechange', function (e) { pausarFuera(e.detail.id); });
  }

  /* ---- 4. Video EMBEBIDO en un pop-up de contenido ------------------
     kit-base v1.9.4. Cuarto patrón, aparecido en "Uso de Sucursales 3 -
     NOA": la ficha de un tema es un pop-up con texto a un lado y su
     video al otro (no el reproductor a pantalla completa del patrón 2,
     que no lleva texto). El `<video>` vive en el marcado del pop-up con
     sus controles nativos, así que no hace falta ningún disparador.

     Lo que SÍ hace falta, y es la razón de que esto sea kit y no curso:
     nadie lo apagaba. `initVideoPlayer` solo sabe frenar SU reproductor
     (`#d-video-player`); un `<video>` cualquiera adentro de otro pop-up
     se quedaba sonando después de cerrarlo — exactamente el bug de
     CLAUDE.md §6.10.1 punto 1 ("¿quién lo apaga?"), que ya se había
     pagado una vez con el video circular. Acá se cierra el hueco para
     cualquier pop-up del molde:
       · al cerrar el pop-up: pause + volver a 0 (así no reabre al final)
       · al empezar a reproducir: callar la locución, para que la voz
         nunca compita con el audio del video (§5)
       · `onFirstPlay(src, popupId)` para que el curso premie el primer
         visionado sin tener que cablear listeners por su cuenta.

       <div class="modal" data-popup="rep-191"> …
         <video playsinline preload="none">
           <source src="video/191.mp4" type="video/mp4"></video> </div>
   -------------------------------------------------------------------- */
  function initPopupVideos(opts) {
    opts = opts || {};
    var sel = opts.selector || '[data-popup] video';
    var videos = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!videos.length) return;
    var visto = vistoAPI(opts);

    videos.forEach(function (v) {
      var pop = v.closest('[data-popup]');
      var popId = pop ? pop.getAttribute('data-popup') : '';
      /* BUG REAL de diseño (CLAUDE.md §6.29): el `poster` de estos
         videos es un mockup que ya trae un reproductor DIBUJADO —
         play, barra de progreso, volumen, pantalla completa, todo
         horneado en la imagen. Si el `<video>` además usa el atributo
         `controls` desde el arranque, el navegador dibuja SU PROPIA
         barra de controles ENCIMA de la que ya está dibujada — dos
         interfaces superpuestas y ninguna de las dos clara. El cliente
         lo reportó como "el botón de play no funciona": probablemente
         estaba tocando el botón HORNEADO EN LA IMAGEN, que no es más
         que píxeles.
         Fix, mismo criterio que `initInlineCircleVideos` (§3 de este
         archivo): SIN `controls` en el marcado. Mientras está pausado
         (mostrando el poster, que ya se ve como un reproductor listo
         para arrancar) el video entero es un botón de play — un solo
         estado, sin ambigüedad. Recién CUANDO arranca la reproducción
         se activan los controles nativos reales (barra, volumen,
         pantalla completa) para que el resto de la experiencia sea
         un reproductor de verdad. */
      /* BUG REAL (reportado en "Uso de Sucursales 3 - NOA": "le pongo
         play, lo pauso, quiero reproducir de nuevo y no me deja"): es
         EXACTAMENTE el mismo bug que §3 ya corrigió en
         `initInlineCircleVideos` (ver el comentario largo de arriba),
         que nunca se portó a este patrón. Una vez que el evento `play`
         prende `v.controls` (abajo), el navegador interpreta el clic
         sobre el video como SU PROPIO toggle play/pausa — pero este
         handler corre ANTES de esa acción por default, así que lee el
         estado VIEJO: sobre un video pausado llama `play()` a mano y
         acto seguido el toggle nativo lo vuelve a pausar. El video
         queda clavado y parece que el reproductor se rompió.

         Fix, idéntico al de la variante circular: mientras haya
         controles nativos, el play/pausa es de ELLOS. Este toggle solo
         actúa antes del primer play, que es cuando el póster hace de
         "botón de play gigante" y todavía no hay `controls`.
         Reproducido y verificado en Chromium con un video real:
         clic->reproduce, clic->pausa, clic->NO reproducía; con el
         guard, los 3 clics responden. */
      /* NORMA DEL KIT desde v1.9.98: ningún video del curso usa la barra
         NATIVA. Los controles los dibuja `montarControles()` — ver su
         comentario largo para el porqué (cuatro fallas de iPad con la
         misma causa de fondo). Acá va con `ocultarHastaPrimerPlay`
         porque el póster de este patrón ya dibuja un reproductor.
         Con esto desaparece también el baile de `v.controls` que
         describe el comentario de arriba: el toggle de clic ya no tiene
         que preguntar si hay controles nativos, porque no los hay. */
      montarControles(v, { ocultarHastaPrimerPlay: true });
      v.addEventListener('click', function () {
        if (v.paused) { v.muted = muted(); v.volume = volumeLevel(); v.play().catch(function () {}); }
      });
      v.addEventListener('play', function () {
        silenciarLocucion();
        var src = v.currentSrc || v.getAttribute('src') || popId;
        // `popId` va como 2º argumento a seen/mark (no solo a
        // onFirstPlay): así un curso puede llevar el registro por id de
        // pop-up — corto y estable — en vez de por `src`, que es la URL
        // absoluta del video y ocupa ~10x más en suspend_data, con
        // límite de 4096 caracteres en SCORM 1.2. Argumento extra:
        // los cursos viejos que solo miran `src` siguen andando igual.
        if (!visto.seen(src, popId)) {
          visto.mark(src, popId);
          if (opts.onFirstPlay) opts.onFirstPlay(src, popId);
        }
      });
      v.addEventListener('error', function () { mostrarErrorVideo(v); });
    });

    document.addEventListener('popupclose', function (e) {
      var id = e.detail && e.detail.id;
      videos.forEach(function (v) {
        var pop = v.closest('[data-popup]');
        if (!pop || (id && pop.getAttribute('data-popup') !== id)) return;
        try { v.pause(); v.currentTime = 0; } catch (err) {}
        /* Vuelve al estado "póster + un solo botón de play" para la
           próxima vez que se abra. Antes esto apagaba `v.controls`;
           ahora vuelve a poner la barra propia en reposo, que es lo
           mismo con la interfaz nueva: reabrir la ficha y encontrar una
           barra de controles sobre un video en el arranque es la
           confusión que este fix vino a evitar. */
        var envoltorio = v.parentElement;
        if (envoltorio) envoltorio.classList.add('d-vp-virgen');
      });
    });
  }

  /* ---- 5. Video dentro de una CAPA ([data-layers]/[data-panel]) ----
     kit-base v1.9.6. Mismo problema que resuelve `initPopupVideos`
     (§4 arriba) — silenciar la locución al reproducir, premiar el
     primer visionado, pausar y volver a 0 al salir — pero para un
     video que vive dentro de un `[data-panel]` en vez de un
     `[data-popup]`. Se agregó al armar "Uso de Sucursales 3 - NOA":
     el cliente pidió que la ficha de reporte (antes un pop-up) pasara
     a ser una capa más de la diapositiva, a pantalla completa
     (CLAUDE.md §6.20 punto 6) — y `initPopupVideos` escucha
     `popupclose`, un evento que una capa nunca dispara (dispara
     `layerchange`). Sin este módulo, un video dentro de un panel
     seguía sonando después de cambiar de capa: el mismo bug de
     "¿quién lo apaga?" de CLAUDE.md §6.10.1 punto 1, una vez más.

       <div data-panel="rep-191"> …
         <video playsinline preload="none">
           <source src="video/191.mp4" type="video/mp4"></video> </div>
  -------------------------------------------------------------------- */
  function initLayerVideos(opts) {
    opts = opts || {};
    var sel = opts.selector || '[data-panel] video';
    var videos = Array.prototype.slice.call(document.querySelectorAll(sel));
    if (!videos.length) return;
    var visto = vistoAPI(opts);

    videos.forEach(function (v) {
      var panel = v.closest('[data-panel]');
      var panelId = panel ? panel.getAttribute('data-panel') : '';
      // Misma norma que arriba: controles del kit, no los del navegador.
      montarControles(v, { ocultarHastaPrimerPlay: true });
      v.addEventListener('play', function () {
        silenciarLocucion();
        var src = v.currentSrc || v.getAttribute('src') || panelId;
        if (!visto.seen(src)) {
          visto.mark(src);
          if (opts.onFirstPlay) opts.onFirstPlay(src, panelId);
        }
      });
      v.addEventListener('error', function () { mostrarErrorVideo(v); });
    });

    document.addEventListener('layerchange', function (e) {
      var target = e.detail && e.detail.target;
      videos.forEach(function (v) {
        var panel = v.closest('[data-panel]');
        if (!panel) return;
        // se apaga si la capa que lo contiene YA NO es la activa
        // (target apunta a OTRA capa del mismo grupo, o a "base").
        if (panel.getAttribute('data-panel') === target) return;
        try { v.pause(); v.currentTime = 0; } catch (err) {}
      });
    });
  }

  /* ---- 6. Diapositiva-captura que cambia de imagen entera ----
     (kit v1.9.21 — la generalización que CLAUDE.md §1/§8 venía
     anotando como pendiente desde "Surtido sin venta")

     Patrón: una diapositiva es una captura íntegra y alguna zona
     dibujada en el arte (flechas de un carrusel, pestañas, los tramos
     de una barra de pasos) cambia la PÁGINA ENTERA por otra variante
     del mismo PDF. Hasta ahora esto se escribía a mano en cada curso
     — `initConceptShots()` en "Surtido sin venta" tenía los 7 nombres
     de concepto hardcodeados, y el propio CLAUDE.md dejaba dicho:
     "si un curso futuro repite el patrón, generalizarla recién ahí".
     "Seguridad alimentaria" lo repite CUATRO veces (2 carruseles,
     1 juego de pestañas y 1 barra de 4 pasos), así que acá está.

     Por qué swap de `src` y no `[data-layers]` con un panel por
     variante: son la MISMA página del PDF con una pieza distinta, así
     que N paneles serían N copias del mismo marcado (y N juegos de
     hitboxes que hay que mantener sincronizados). Una sola `.d-shot-img`
     con la lista de variantes es el mismo resultado visual con un
     orden de magnitud menos de HTML.

     Marcado:
       <div class="d-shot" data-shot
            data-shot-swap="malas"
            data-shot-swap-srcs="img/a.webp|img/b.webp|img/c.webp">
         <img class="d-shot-img" src="img/a.webp" alt="" aria-hidden="true">
         <button data-hit data-shot-swap-step="-1" …>Anterior</button>
         <button data-hit data-shot-swap-step="1"  …>Siguiente</button>
         <button data-hit data-shot-swap-go="2"    …>Ir al paso 3</button>
       </div>

     · `[data-shot-swap-step]` se OCULTA solo cuando el salto se iría de
       rango. No es cosmético: en estos PDF el diseñador dibuja la
       flecha solo en las páginas donde existe (la primera no tiene
       "anterior", la última no tiene "siguiente"), así que un botón
       invisible sobre una flecha que no está dibujada sería un hitbox
       fantasma — justo lo que CLAUDE.md §7.3 punto 4 prohíbe.
     · `[data-shot-swap-go]` marca `.is-active` + `aria-selected` en el
       que corresponde, para el caso pestañas/pasos.
     · Precarga todas las variantes al arrancar: sin eso, el primer
       clic muestra un parpadeo en blanco mientras baja la imagen.
     · `onChange(indice, id, vistos, total)` es el único gancho que
       necesita el curso: de ahí salen la narración del paso, los
       puntos y el gate. El módulo NO narra por su cuenta — quién narra
       qué es decisión de contenido (CLAUDE.md §5).

       ⚠️ UN GRUPO DE N VARIANTES DISPARA `onChange` N−1 VECES, NO N
       (kit-base v1.9.66, encontrado al rebalancear el puntaje de
       "Seguridad alimentaria" — §7.14). La variante 0 es la que ya se
       ve al entrar: se marca como vista para el gate y para el
       contador "N de N", pero NO dispara `onChange`, y hace bien —
       si lo disparara repartiría puntos al CARGAR la página, antes de
       que el alumno llegara siquiera a esa diapositiva.
       Importa cuando el curso paga puntos acá: la tabla de puntaje de
       ese curso contaba N por grupo y el contador real pagaba N−1,
       25 puntos de diferencia que nadie había cruzado nunca contra un
       recorrido real. Y como los umbrales de medalla se calculan sobre
       el máximo, un máximo inflado corre los tres hacia arriba y vuelve
       inalcanzable justamente el "máximo".

     Devuelve un mapa { id: { go, index, vistos, total } }. */
  function initShotSwap(opts) {
    opts = opts || {};
    var api = {};
    var grupos = document.querySelectorAll('[data-shot-swap]');

    Array.prototype.forEach.call(grupos, function (shot) {
      var id = shot.getAttribute('data-shot-swap');
      var srcs = (shot.getAttribute('data-shot-swap-srcs') || '').split('|')
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
      var img = shot.querySelector('.d-shot-img');
      if (!img || srcs.length < 2) return;

      srcs.forEach(function (s) { var p = new Image(); p.src = s; });

      var vistos = {};
      var i = Math.max(0, srcs.indexOf(img.getAttribute('src')));
      vistos[i] = true;
      /* Bandera para distinguir un `click` real (mouse O TÁCTIL) de uno
         sintetizado por activación de teclado — ver el porqué en el
         handler de `click` más abajo, `.d-shot-hit--paso`. */
      /* Marca de "el último `click` vino de un puntero, no del teclado".
         Es un SELLO DE TIEMPO, no un booleano — ver el bug largo en el
         handler de `click`. */
      var pasoPointerVisto = 0;
      var pasoPointerTipo = '';

      function sync() {
        Array.prototype.forEach.call(shot.querySelectorAll('[data-shot-swap-step]'), function (b) {
          var d = parseInt(b.getAttribute('data-shot-swap-step'), 10) || 0;
          b.hidden = (i + d) < 0 || (i + d) > srcs.length - 1;
        });
        Array.prototype.forEach.call(shot.querySelectorAll('[data-shot-swap-go]'), function (b) {
          var n = parseInt(b.getAttribute('data-shot-swap-go'), 10);
          var on = n === i;
          b.classList.toggle('is-active', on);
          /* `aria-current` en vez de `aria-selected`: vale en cualquier
             botón, sin obligar al curso a montar un `role="tablist"`
             alrededor de hitboxes que el motor posiciona en absoluto. */
          if (on) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        });
      }

      /* ⚠️ NO HAY FUNDIDO AL CAMBIAR DE VARIANTE — regla del cliente:
         *"cada vez que hago clic en una solapa se hace un fundido, y el
         cambio debería ser corte directo. Esto pasa en los carruseles
         también: siempre corte directo, no fundidos."*

         Hubo DOS vueltas acá, y la primera estuvo MAL: se sacó la
         `transition` de `.d-shot-img` (CSS) y se dejó este JS puesto.
         El fundido no desapareció: EMPEORÓ. La mecánica era
         `.d-shot-img--fade{opacity:0}` más dos timers de 110 ms
         alrededor del cambio de `src`; sin la `transition` que
         suavizaba esa opacidad, la imagen baja a 0 DE GOLPE y se queda
         así 220 ms — y como `.d-shot-img` tiene `background:#fff`, lo
         que se ve es un FLASH BLANCO DURO. El cliente lo volvió a
         reportar, con captura.

         ⚠️ LECCIÓN, y vale para cualquier efecto de este kit: un
         efecto vive en DOS archivos — el CSS que lo dibuja y el JS que
         lo dispara. Sacar una sola mitad no lo apaga, lo deja a
         medias, y a medias suele ser peor que entero. Antes de dar por
         muerto un efecto, `grep` de la clase en los dos lados.

         `data-shot-swap-nofade` (v1.9.61) y el parámetro `sinFade` de
         `go()` quedan ACEPTADOS pero inertes: ya no hay fundido que
         desactivar, y un curso que los declare no se rompe.

         REGLA GENERAL: un cambio de estado DISCRETO (solapa, paso de
         carrusel, variante) va con corte directo. Las transiciones se
         reservan para lo que entra o sale de la pantalla, no para lo
         que reemplaza a otra cosa en el mismo lugar. */
      function go(n, silencioso, sinFade) {
        n = Math.max(0, Math.min(srcs.length - 1, n));
        /* `mismo` = te quedaste donde ya estabas. Importa porque
           `onChange` es donde los cursos pagan puntos (kit-base
           v1.9.75, §7.21 F2): un paginador con un botón por variante
           le pagaba al alumno por tocar la que YA estaba viendo, tantas
           veces como quisiera. Medido en un curso real: máximo de 220
           contra 210 declarado, y la diferencia no se explicaba leyendo
           la tabla de puntos.
           El resto sigue corriendo igual —`vistos` y `sync()`— porque
           volver a tocar la variante actual no la "des-ve"; lo único
           que no vuelve a dispararse es el aviso al curso. */
        var mismo = (n === i);
        if (!mismo) {
          i = n;
          img.setAttribute('src', srcs[i]); // corte directo, siempre — ver arriba
        }
        vistos[i] = true;
        sync();
        if (!mismo && !silencioso && opts.onChange) {
          opts.onChange(i, id, Object.keys(vistos).length, srcs.length);
        }
      }

      shot.addEventListener('click', function (e) {
        var b = e.target.closest('[data-shot-swap-step],[data-shot-swap-go]');
        if (!b || !shot.contains(b) || b.hidden) return;
        /* `.d-shot-hit--paso`: un clic SIN arrastre ya NO mueve la
           barra (pedido explícito de producto, ver el bloque de
           `pointerdown` más abajo) — dejarlo pasar acá la haría saltar
           igual, contradiciendo esa decisión. PERO un `click` activado
           por TECLADO (Enter/Espacio sobre el botón con foco) nunca
           pasa por `pointerdown`/`pointermove` — sin distinguirlo, los
           pasos quedaban inalcanzables por teclado (bug real,
           encontrado auditando accesibilidad): ahí SÍ tiene que saltar
           directo, es el único disparador posible sin mouse/dedo.
           **`e.detail !== 0` NO alcanza para distinguirlos** (bug real,
           kit-base v1.9.38): un tap táctil real también sintetiza un
           `click` con `detail: 0` — igual al de teclado —, así que ese
           chequeo dejaba pasar el salto directo en touch, justo lo que
           esta función existe para evitar. La distinción real es "¿hubo
           un `pointerdown` justo antes de este `click`?" — eso pasa con
           mouse Y con touch, nunca con teclado. */
        if (b.classList.contains('d-shot-hit--paso')) {
          /* ⚠️ BUG REAL, reporte del cliente en iPad: *"al querer tocar
             en esas diapos que hay que ir pasando tipo carrusel se
             tildó, no pasaba; tuve que volver a la diapo anterior y
             volver"*.

             La marca era un BOOLEANO que se prendía en CUALQUIER
             `pointerdown` sobre la diapositiva y se apagaba SOLO acá
             adentro, cuando el clic caía sobre un paso. O sea que tocar
             una flecha, el fondo, o empezar un gesto que el navegador
             después cancelaba —algo que iOS hace seguido, con
             `pointercancel`— dejaba la marca prendida PARA SIEMPRE, y
             el siguiente toque real sobre un paso se lo comía este
             `return`. Se siente exactamente como "se tildó".

             Ahora es un sello de tiempo: un `click` se considera "de
             puntero" solo si hubo un `pointerdown` en los últimos
             700 ms. Una marca vieja caduca sola, así que el estado no
             se puede quedar pegado. */
          var fuePointer = pasoPointerVisto && (Date.now() - pasoPointerVisto) < 700;
          var tipo = pasoPointerTipo;
          pasoPointerVisto = 0;
          /* Y en TÁCTIL un toque SÍ salta al paso. La regla de "hay que
             arrastrar de verdad" nació para el mouse, donde arrastrar es
             natural y el clic-por-tramo hacía saltar la barra sin
             querer. Con el dedo no hay equivalente: si el toque no hace
             nada, el alumno no tiene forma de saber que tenía que
             deslizar, y lo lee como que el curso se colgó. */
          if (fuePointer && tipo !== 'touch') return;
        }
        if (b.hasAttribute('data-shot-swap-go')) go(parseInt(b.getAttribute('data-shot-swap-go'), 10));
        else go(i + (parseInt(b.getAttribute('data-shot-swap-step'), 10) || 0));
      });

      /* Barra de "pasos" arrastrable (pedido explícito, "Seguridad
         alimentaria": "la barra de la diapo rotación tendría que
         poder deslizarse con el mouse"). Acotado a `.d-shot-hit--paso`
         a propósito — NO a cualquier `[data-shot-swap-go]`: ese mismo
         atributo también arma pestañas de categoría (`.d-shot-hit--tab`,
         "Personas/Medio ambiente/Plagas/..."), donde arrastrar entre
         opciones no tiene sentido semántico (no son un progreso lineal).
         `.d-shot-hit--paso` sí lo es (Paso 1 de 4, 2 de 4...), así que
         solo ahí se reemplaza el clic-por-tramo por arrastre real.
         Pedido explícito de producto: un clic SIN mover ya NO salta al
         tramo tocado (se sacó a propósito) — hay que arrastrar de
         verdad. El único disparador puntual (sin arrastre) que queda
         es la activación por TECLADO (Enter/Espacio con foco, ver más
         abajo): no tiene forma de "arrastrar", así que sigue saltando
         directo al paso. Mismo patrón que la barra de progreso del
         curso (`initProgressSeek`, coto-player.js) — MISMO elemento
         escucha down/move/up Y recibe el `setPointerCapture` (acá,
         `shot`).

         BUG REAL propio, encontrado antes de subir esto: la 1ª versión
         escuchaba `pointerdown` en cada BOTÓN y capturaba en `shot` —
         dos elementos distintos. Rompía por partida doble: (1) el paso
         ACTIVO tiene `pointer-events:none` (CSS ya existente, para no
         competir con el resaltado) así que ese botón puntual NUNCA
         recibe `pointerdown` — no se puede ni EMPEZAR el arrastre
         parado en el paso donde ya se está; (2) `setPointerCapture` en
         un elemento que no es el mismo que escucha el evento no
         retargetea de forma confiable (verificado con Playwright:
         `pointermove` dejaba de llegar a los pocos eventos). Fix:
         todo — down, move, up y la captura — vive en `shot`, y el
         punto de partida se decide por POSICIÓN (¿el click cayó
         dentro del rectángulo que ocupan los botones de paso?), no por
         cuál elemento fue el target — así funciona arrancando desde
         CUALQUIER paso, activo o no. */
      var pasos = Array.prototype.filter.call(
        shot.querySelectorAll('[data-shot-swap-go]'),
        function (b) { return b.classList.contains('d-shot-hit--paso'); }
      );
      if (pasos.length > 1) {
        var arrastrandoPaso = false;
        var pasoIniciadoX = 0;
        var pasoMovioDeVerdad = false;
        // Cuánto tiene que moverse el puntero antes de contar como
        // arrastre real — sin esto, CUALQUIER clic (bajar+soltar el
        // mouse casi nunca es 100% inmóvil, siempre hay 1-2px de
        // temblor real) terminaba llamando a `go()` en el primer
        // `pointermove`, o sea saltando igual que si el "clic salta al
        // tramo" nunca se hubiera sacado (bug real reportado por el
        // cliente: "todavía se puede hacer clic para moverla"). Recién
        // a partir de este umbral se considera arrastre de verdad.
        var UMBRAL_ARRASTRE_PX = 6;
        function trackPasos() {
          var rects = pasos.map(function (b) { return b.getBoundingClientRect(); });
          return {
            left: Math.min.apply(null, rects.map(function (r) { return r.left; })),
            right: Math.max.apply(null, rects.map(function (r) { return r.right; })),
            top: Math.min.apply(null, rects.map(function (r) { return r.top; })),
            bottom: Math.max.apply(null, rects.map(function (r) { return r.bottom; }))
          };
        }
        function indiceDesdeX(x, t) {
          var frac = (x - t.left) / (t.right - t.left);
          frac = Math.max(0, Math.min(1, frac));
          return Math.round(frac * (pasos.length - 1));
        }
        shot.addEventListener('pointerdown', function (e) {
          /* Se marca ANTES del chequeo de rango: un `click` sobre un
             botón de paso siempre cae dentro de ese rango (el botón es
             uno de los medidos por `trackPasos()`), así que este
             `pointerdown` es la señal fiable de "no fue teclado" que
             lee el handler de `click`, sin importar mouse o touch. */
          pasoPointerVisto = Date.now();
          pasoPointerTipo = e.pointerType || '';
          var t = trackPasos();
          if (e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) return;
          /* BUG REAL, el que costó más encontrar de toda esta función:
             el arrastre se cortaba solo a mitad de camino, de forma
             intermitente — a veces al primer intento, a veces recién
             al segundo. Causa real (confirmada instrumentando
             `pointercancel`/`gotpointercapture` con logs): el punto de
             partida cae sobre el `<img>` de fondo (el botón del paso
             ACTIVO tiene `pointer-events:none`, así que el target real
             del down es la imagen debajo) — y una imagen es
             ARRASTRABLE por el navegador por default. En cuanto el
             mouse se mueve lo suficiente, el navegador arranca SU
             PROPIO drag-and-drop nativo de imagen y cancela la
             secuencia de punteros con `pointercancel`, cortando el
             `pointermove` en seco. `preventDefault()` en el `pointerdown`
             se lo impide — mismo motivo por el que la barra de progreso
             del curso (`initProgressSeek`) nunca lo necesitó: su pista
             es un `<div>`, no una imagen, y los `<div>` no son
             arrastrables por default. */
          e.preventDefault();
          // Sin `go()` acá a propósito: un clic sin mover ya no salta
          // — hace falta arrastrar de verdad (pedido explícito). El
          // índice recién se actualiza en `pointermove`, más abajo.
          arrastrandoPaso = true;
          pasoMovioDeVerdad = false;
          pasoIniciadoX = e.clientX;
          shot.classList.add('is-seeking-paso');
          try { shot.setPointerCapture(e.pointerId); } catch (err) {}
        });
        shot.addEventListener('pointermove', function (e) {
          if (!arrastrandoPaso) return;
          if (!pasoMovioDeVerdad) {
            if (Math.abs(e.clientX - pasoIniciadoX) < UMBRAL_ARRASTRE_PX) return;
            pasoMovioDeVerdad = true;
          }
          go(indiceDesdeX(e.clientX, trackPasos()), false, true); // sinFade=true: arrastre 1:1, ver el comentario en go()
        });
        ['pointerup', 'pointercancel'].forEach(function (ev) {
          shot.addEventListener(ev, function () {
            arrastrandoPaso = false;
            shot.classList.remove('is-seeking-paso');
          });
        });
      }

      sync();
      api[id] = {
        go: go,
        index: function () { return i; },
        vistos: function () { return Object.keys(vistos).length; },
        total: srcs.length
      };
    });

    return api;
  }

  /* ---- Red de seguridad universal: ningún <video> queda sonando
     fuera de su contexto activo (kit-base v1.9.39) ----
     Los 4 patrones de arriba (fondo/pop-up/círculo/capa) ya se apagan
     solos en su propio evento — esto es un CINTURÓN EXTRA, no un
     reemplazo: barre TODOS los <video> del documento en cada
     `slidechange`/`popupclose`/`layerchange` y pausa cualquiera que
     siga reproduciéndose fuera de la diapositiva/pop-up/capa que
     quedó activa. Cubre tanto un video con un patrón nuevo que un
     curso escriba a mano y se olvide de cablear el apagado (el bug
     real de "¿quién lo apaga?" ya documentado 4 veces — CLAUDE.md
     §6.10.1 punto 1, §6.18 punto 2, §6.20 punto 6.1, §6.45 gap 6) como
     un descuido futuro en uno de los patrones del kit mismo.

     No pisa nada de la lógica fina de cada patrón (reset de
     `currentTime`, sacar `controls`, marcar "visto") — solo pausa.
     Esos detalles siguen siendo responsabilidad de cada patrón que
     SÍ conoce su propio contrato; acá no se sabe (ni hace falta saber)
     qué patrón es cada video. */
  function activo(el) {
    var slide = el.closest('[data-slide]');
    if (slide && slide.hidden) return false;
    var popup = el.closest('[data-popup]');
    if (popup && !popup.classList.contains('open')) return false;
    var panel = el.closest('[data-panel]');
    if (panel && panel.hidden) return false;
    return true;
  }
  function initVideoSafetyNet() {
    function barrer() {
      Array.prototype.forEach.call(document.querySelectorAll('video'), function (v) {
        if (!v.paused && !activo(v)) v.pause();
      });
    }
    document.addEventListener('slidechange', barrer);
    document.addEventListener('popupclose', barrer);
    document.addEventListener('layerchange', barrer);
    /* Y la regla que el kit ya se había puesto —"ningún medio del curso
       sigue corriendo con la página oculta"— aplicada a TODOS los
       videos, no solo a los de fondo (kit-base v1.9.99, subido de
       "Seguridad alimentaria").
       La versión de `initBgVideos` barre SU propia lista, así que el video
       de un pop-up abierto seguía sonando con el iPad bloqueado: el mismo
       bug que ese handler vino a corregir, en el patrón de al lado. Acá es
       donde corresponde — este módulo es el que mira TODO el documento.
       Solo pausa: reanudar es de cada patrón, que sabe si corresponde
       volver a 0 (video de fondo) o seguir donde estaba (reproductor). */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) return;
      Array.prototype.forEach.call(document.querySelectorAll('video'), function (v) {
        if (!v.paused) v.pause();
      });
    });
  }

  global.videoUsable = videoUsable;
  global.initVideoGate = initVideoGate;
  global.initBgVideos = initBgVideos;
  global.initVideoPlayer = initVideoPlayer;
  global.initInlineCircleVideos = initInlineCircleVideos;
  global.initPopupVideos = initPopupVideos;
  global.initLayerVideos = initLayerVideos;
  global.initShotSwap = initShotSwap;
  global.initVideoSafetyNet = initVideoSafetyNet;
})(window);
