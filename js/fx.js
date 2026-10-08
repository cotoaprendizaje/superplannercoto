/* ============================================================
   fx.js · Capa de efectos "cinematográficos" (opcional, no crítica)
   kit-base v1.0 · Área Aprendizaje (COTO) — genérico, sin contenido
   de curso. Copiar tal cual.
   ------------------------------------------------------------
   Efectos puramente decorativos, todos desactivables con
   prefers-reduced-motion. NO tocan la lógica del curso ni la
   posición de ningún hitspot: si este archivo no carga, el curso
   funciona igual. Se ejecuta después de curso.js.

   Incluye:
     · Parallax 3D suave de las capturas del PDF (sigue el mouse).
     · Ripple (onda) al hacer clic en botones e hitspots.
     · Partículas de fondo flotando en las diapositivas HTML.
     · Sonidos de interfaz sutiles (usa el mismo tono sintetizado
       del curso vía window.__fxTone si está expuesto; si no, calla).
     · "Moneda" flotante: el +N de puntos vuela hacia el contador.
     · Modo cine: atenúa el resto al reproducir un video.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- utilidades de audio de interfaz ----------
     Reusa un AudioContext propio, independiente del de curso.js, pero
     respeta el mute global guardado en localStorage por el botón de sonido. */
  var actx;
  function muted() { try { return localStorage.getItem('coto-diapos-mute') === '1'; } catch (e) { return false; } }
  // Nivel de volumen (0-1, panel de "Sonido" — kit-base v1.9.35, coto-player.js).
  function volumeLevel() {
    try {
      var v = parseFloat(localStorage.getItem('coto-diapos-volume'));
      return isNaN(v) ? 1 : Math.min(1, Math.max(0, v));
    } catch (e) { return 1; }
  }
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
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    return actx;
  }
  function uiTone(f, d, type, vol) {
    if (muted() || reduce) return;
    var vl = volumeLevel();
    if (vl <= 0) return;
    var c = ac(); if (!c) return;
    var t0 = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime((vol == null ? .05 : vol) * vl, t0 + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t0 + d);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .03);
  }
  function sWhoosh() { uiTone(320, .16, 'sine', .04); uiTone(480, .12, 'sine', .035); }
  function sTick() { uiTone(880, .06, 'triangle', .045); }

  /* ============================================================
     1 · (ex) PARALLAX DE PROFUNDIDAD entre fondo y contenido — SACADO
     ------------------------------------------------------------
     Se probó mover solo el fondo (.d-shot-bg) al mover el mouse,
     dejando el contenido quieto. Se rompía el diseño: en estas diapos
     el fondo y el contenido son la MISMA imagen partida en dos capas
     que tienen que quedar perfectamente registradas entre sí (todo el
     trabajo de .d-shot-slide--bg-layered es justamente lograr esa
     alineación exacta) — mover una sola capa, aunque sea unos pocos
     píxeles, desalinea esa costura y se nota. El cliente lo reportó
     ("se rompió bastante el diseño") y se sacó. Si en el futuro se
     quiere un efecto de profundidad, tendría que mover fondo Y
     contenido juntos (misma transform en las dos capas) para no perder
     el registro — eso sí sería seguro, pero no es lo que había acá. */

  /* ============================================================
     2 · RIPPLE al hacer clic (botones e hitspots)
     ============================================================ */
  function initRipple() {
    if (reduce) return;
    document.addEventListener('click', function (e) {
      // .d-concept-tab afuera a propósito: el ripple + el cambio de imagen
      // de fondo al mismo tiempo se sentía "molesto" (dos efectos
      // simultáneos compitiendo) — cambiar de concepto ya tiene su propio
      // feedback (la pestaña pasa a dorado fuerte).
      var el = e.target.closest('.btn, .d-shot-hit:not(.d-concept-tab), .d-iconbtn, .d-chip, .d-nav-btn');
      if (!el) return;
      var r = el.getBoundingClientRect();
      var span = document.createElement('span');
      span.className = 'fx-ripple';
      var size = Math.max(r.width, r.height) * 1.4;
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - r.left - size / 2) + 'px';
      span.style.top = (e.clientY - r.top - size / 2) + 'px';
      var prevPos = getComputedStyle(el).position;
      if (prevPos === 'static') el.style.position = 'relative';
      el.appendChild(span);
      setTimeout(function () { span.remove(); }, 620);
    }, true);
  }

  /* ============================================================
     3 · PARTÍCULAS de fondo (solo diapositivas HTML nativas — sin
     captura de PDF: `.slide` que NO es `.d-shot-slide`. Antes esto
     tenía 3 IDs de diapositiva hardcodeados de un curso puntual
     ("laboratorio","casos","evaluacion") — no era genérico de
     verdad, se colaba contenido de curso en un archivo que se supone
     se copia sin editar. La regla real siempre fue "diapositivas
     HTML", que ya existe como distinción de clase en el marcado.)
     ============================================================ */
  function initParticles() {
    if (reduce) return;
    document.querySelectorAll('.slide:not(.d-shot-slide)').forEach(function (slide) {
      var layer = document.createElement('div');
      layer.className = 'fx-particles'; layer.setAttribute('aria-hidden', 'true');
      for (var i = 0; i < 14; i++) {
        var p = document.createElement('span');
        p.style.left = Math.random() * 100 + '%';
        p.style.width = p.style.height = (5 + Math.random() * 12) + 'px';
        p.style.animationDuration = (9 + Math.random() * 10) + 's';
        p.style.animationDelay = (-Math.random() * 16) + 's';
        p.style.opacity = (0.05 + Math.random() * 0.12).toFixed(2);
        layer.appendChild(p);
      }
      slide.insertBefore(layer, slide.firstChild);
    });
  }

  /* ============================================================
     4 · SONIDOS de interfaz: whoosh al cambiar de diapo, tick en pop-ups
     ============================================================ */
  function initUISounds() {
    document.addEventListener('slidechange', function () { sWhoosh(); });
    document.addEventListener('popupopen', function () { sTick(); });
  }

  /* ============================================================
     5 · "MONEDA" flotante: el +N vuela desde el HUD hacia los puntos
     (se dispara escuchando el toast; liviano y desacoplado)
     ============================================================ */
  function coin(n) {
    if (reduce) return;
    var target = document.getElementById('d-points'); if (!target) return;
    var tr = target.getBoundingClientRect();
    /* "+N que sube" (rediseño v1.9.125, §7.74, efecto chico): con el
       número, una pastilla dorada que nace en el contador y sube. Sin
       número (un curso que todavía llama `__fxCoin()` a secas), la
       estrellita de siempre. */
    if (n) {
      var p = document.createElement('div');
      p.className = 'fx-mas';
      p.setAttribute('aria-hidden', 'true');
      p.textContent = '+' + n;
      p.style.left = (tr.left + tr.width / 2) + 'px';
      p.style.top = (tr.bottom + 40) + 'px';   // sube hasta el contador, sin taparlo de entrada
      document.body.appendChild(p);
      setTimeout(function () { p.remove(); }, 1300);
      return;
    }
    var c = document.createElement('div');
    c.className = 'fx-coin'; c.textContent = '✦';
    c.style.left = (tr.left + tr.width / 2) + 'px';
    c.style.top = (tr.top + tr.height / 2 + 40) + 'px';
    document.body.appendChild(c);
    requestAnimationFrame(function () {
      c.style.transform = 'translate(-50%, -46px) scale(1.2)';
      c.style.opacity = '0';
    });
    setTimeout(function () { c.remove(); }, 700);
  }

  /* ============================================================
     6 · MODO CINE: al reproducir un video, se atenúa lo de alrededor
     ============================================================ */
  function initCinema() {
    document.querySelectorAll('[data-video-play]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var slide = btn.closest('.slide'); if (!slide) return;
        slide.classList.add('fx-cinema');
      });
    });
    function limpiar() {
      document.querySelectorAll('.fx-cinema').forEach(function (s) { s.classList.remove('fx-cinema'); });
    }
    // al cambiar de diapositiva se limpia
    document.addEventListener('slidechange', limpiar);
    // ...y también al cerrar el pop-up del video. Sin esto, si el curso
    // reproduce el video dentro de un pop-up (patrón habitual) y el alumno
    // lo cierra sin cambiar de diapositiva, el modo cine queda pegado: la
    // barra superior e inferior se quedan al 45% de opacidad hasta navegar.
    // Bug real, verificado en "Prevención cardiovascular".
    document.addEventListener('popupclose', limpiar);
  }

  /* ============================================================
     7 · SPOTLIGHT que sigue el cursor en los botones (glare)
     ============================================================ */
  function initSpotlight() {
    if (reduce) return;
    document.addEventListener('mousemove', function (e) {
      var el = e.target.closest('.btn-cat, .d-nav-btn');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ============================================================
     8 · LOS EFECTOS DEL REDISEÑO (kit-base v1.9.125, §7.74)
     ------------------------------------------------------------
     Los diez aprobados en el canvas, por escalón (decisión del cliente):
       · chicos —tilde, sacudida, "+N" que sube, contador que rueda—:
         siempre. Los dos primeros son CSS puro (coto-fx.css), el "+N" es
         `coin(n)` y el contador ya era `CotoUI.countTo`.
       · medianos —destellos y sello—: SOLO al ganar un logro, en la
         tarjeta "¡Nuevo logro!".
       · grandes —fuegos artificiales, lluvia y serpentinas—: llegar al
         oro y terminar el curso. Más "medalla que gira" al subir de
         medalla y "destello en la barra" al completarla.
     Todos se apagan con "reducir movimiento": la tarjeta y el aviso de
     medalla se muestran igual, quietos; las partículas no se crean.
     Nada de esto es interactivo ni bloquea: la capa deja pasar los
     clics (`pointer-events:none`), se va sola y con cualquier toque o
     tecla. El texto ya lo anuncia el toast (role=status) de
     coto-player.js, así que la capa es `aria-hidden` y no lo repite.
     Escuchan eventos que el kit ya emite: `logroganado` y
     `medallasube` (coto-logros.js) y `courseend` (motor-slides.js). */
  var ORO = ['#ffd25e', '#006EA0', '#ffc531', '#00466E', '#00A578'];

  function capa(clase) {
    var el = document.createElement('div');
    el.className = clase;
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  /* Partículas: `fuegos` (estallidos desde 3 puntos) o `lluvia` (cae). */
  function particulas(dentro, tipo) {
    if (reduce) return;
    var html = '';
    if (tipo === 'fuegos') {
      [[28, 34, 0], [72, 30, .25], [50, 56, .5]].forEach(function (b) {
        for (var i = 0; i < 14; i++) {
          var a = i / 14 * Math.PI * 2, r = 90 + (i % 3) * 30;
          html += '<i class="fx-chispa" style="left:' + b[0] + '%;top:' + b[1] + '%;width:' + (i % 2 ? 9 : 12) + 'px;height:' + (i % 2 ? 9 : 12) +
            'px;background:' + ORO[i % ORO.length] + ';--dx:' + Math.round(Math.cos(a) * r) + 'px;--dy:' + Math.round(Math.sin(a) * r) +
            'px;animation-delay:' + b[2] + 's"></i>';
        }
      });
    } else {
      for (var j = 0; j < 46; j++) {
        var serp = j % 4 === 0;
        html += '<i class="fx-confeti" style="left:' + ((j * 37) % 100) + '%;width:' + (serp ? 4 : 8) + 'px;height:' + (serp ? 26 : (j % 3 ? 12 : 8)) +
          'px;border-radius:' + (serp || j % 3 ? '2px' : '50%') + ';background:' + ORO[j % ORO.length] +
          ';animation-delay:' + ((j % 9) * .16).toFixed(2) + 's;animation-duration:' + (2.2 + (j % 5) * .3).toFixed(1) + 's"></i>';
      }
    }
    var cont = document.createElement('div');
    cont.className = 'fx-particulas fx-particulas--' + tipo;
    cont.innerHTML = html;
    dentro.appendChild(cont);
    setTimeout(function () { cont.remove(); }, 4200);
  }

  /* Medalla que gira: plata del lado de atrás, la nueva al frente. */
  var COLOR_MED = { bronce: '#d38b4f', plata: '#c9d3de', oro: '#ffd25e' };
  var TINTA_MED = { bronce: '#ffffff', plata: '#00466E', oro: '#7a5300' };
  var ESTRELLA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>';
  function medallaQueGira(de, a) {
    return '<span class="fx-med"><span class="fx-med-giro">' +
      '<span class="fx-med-cara" style="--c:' + (COLOR_MED[de] || '#E9EEF8') + ';--t:' + (TINTA_MED[de] || '#6B7690') + '">' + ESTRELLA + '</span>' +
      '<span class="fx-med-cara fx-med-cara--atras" style="--c:' + (COLOR_MED[a] || '#ffd25e') + ';--t:' + (TINTA_MED[a] || '#7a5300') + '">' + ESTRELLA + '</span>' +
      '</span></span>';
  }
  function mayus(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function escH(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---- La tarjeta "¡Nuevo logro!" (con cola: dos logros juntos salen
     de a uno; Impecable + Puntería en un curso sin repaso es el caso
     real) ---- */
  var cola = [], abierta = null, cierreT = null;
  /* Nunca encima de un pop-up (v1.9.127, lo vio el cliente: al llegar a
     la mini práctica, "Unidad 2 completa" salía encima del aviso previo,
     que el motor abre al entrar). Con un pop-up abierto el logro espera en
     la cola; si un pop-up se abre con la tarjeta a la vista, la tarjeta se
     guarda y vuelve, entera, al cerrarlo. */
  function hayPopup() { return !!document.querySelector('[data-popup].open'); }
  function cerrarLogro() {
    if (!abierta) return;
    var el = abierta; abierta = null;
    clearTimeout(cierreT);
    el.classList.add('is-saliendo');
    setTimeout(function () { el.remove(); siguienteLogro(); }, reduce ? 0 : 220);
  }
  function siguienteLogro() {
    if (abierta || !cola.length || hayPopup()) return;
    var d = cola.shift();
    var ic = d.icono
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + escH(d.icono) + '"/></svg>'
      : '<span class="fx-logro-emoji">' + escH(d.ic || '🏆') + '</span>';
    var chispas = '';
    [[8, 12, 22], [80, 6, 16], [92, 60, 24], [2, 70, 16], [50, -6, 14], [46, 96, 18]].forEach(function (p, i) {
      chispas += '<svg class="fx-destello" viewBox="0 0 24 24" style="left:' + p[0] + '%;top:' + p[1] + '%;width:' + p[2] + 'px;height:' + p[2] +
        'px;fill:' + (i % 2 ? '#ffd25e' : '#006EA0') + ';animation-delay:' + (.35 + i * .08).toFixed(2) + 's"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg>';
    });
    var el = capa('fx-logro');
    el.innerHTML =
      '<div class="fx-logro-card">' +
        '<span class="fx-logro-tit">¡Nuevo logro!</span>' +
        '<span class="fx-logro-disco"><span class="fx-logro-ic">' + ic + '</span>' + chispas +
          (d.pts ? '<span class="fx-logro-mas">+' + d.pts + '</span>' : '') + '</span>' +
        '<b class="fx-logro-nom">' + escH(d.nombre) + '</b>' +
        (d.txt ? '<span class="fx-logro-txt">' + escH(d.txt) + '</span>' : '') +
        '<span class="fx-logro-sello">¡LOGRO!</span>' +
        '<span class="fx-logro-med" hidden></span>' +
        '<button type="button" class="fx-logro-seguir" tabindex="-1">Seguir con el curso</button>' +
      '</div>';
    el.querySelector('.fx-logro-seguir').addEventListener('click', cerrarLogro);
    el.__logro = d;
    abierta = el;
    cierreT = setTimeout(cerrarLogro, 4600);
  }
  function initLogroGanado() {
    document.addEventListener('logroganado', function (e) {
      cola.push(e.detail || {});
      siguienteLogro();
    });
    document.addEventListener('popupopen', function () {
      if (!abierta) return;
      var el = abierta; abierta = null;
      clearTimeout(cierreT);
      cola.unshift(el.__logro);
      el.remove();
    });
    document.addEventListener('popupclose', function () { setTimeout(siguienteLogro, 250); });
    /* Cualquier toque o tecla la cierra, sin comerse el gesto: el clic
       sigue hasta lo que el alumno quería tocar. */
    ['pointerdown', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function (e) {
        if (!abierta || (e.target && e.target.closest && e.target.closest('.fx-logro-seguir'))) return;
        cerrarLogro();
      }, true);
    });
  }

  /* ---- Subir de medalla ----
     Si la tarjeta del logro está abierta (el +20 del logro fue lo que la
     subió), va adentro como "¡Subiste a Plata!"; si no, un aviso propio
     arriba al centro. Al oro, además, fuegos artificiales. */
  function initMedalla() {
    document.addEventListener('medallasube', function (e) {
      var d = e.detail || {};
      var html = medallaQueGira(d.de, d.a) + '<span>¡Subiste a ' + escH(mayus(d.nombre || d.a)) + '!</span>';
      var donde;
      if (abierta) {
        donde = abierta.querySelector('.fx-logro-med');
        donde.innerHTML = html;
        donde.hidden = false;
        clearTimeout(cierreT);
        cierreT = setTimeout(cerrarLogro, 5600);
      } else {
        donde = capa('fx-subio');
        donde.innerHTML = '<span class="fx-subio-card">' + html + '</span>';
        setTimeout(function () { donde.remove(); }, 3600);
      }
      /* Los fuegos van en una capa propia a pantalla completa: dentro del
         aviso quedarían presos de su `transform` (un `fixed` adentro de
         un ancestro transformado se mide contra él, no contra la ventana). */
      if (d.a === 'oro') {
        var cielo = abierta || capa('fx-lluvia');
        particulas(cielo, 'fuegos');
        if (!abierta) setTimeout(function () { cielo.remove(); }, 4300);
      }
    });
  }

  /* ---- Fin del curso: lluvia y serpentinas + destello en la barra ----
     Una vez por carga, y no si el alumno ARRANCA en la última (retomar
     el curso donde lo dejó no es terminarlo de nuevo). */
  function initFinal() {
    /* Si fx.js arranca después del primer `go()` del motor (orden de
       carga del curso), la diapositiva inicial ya pasó: la próxima
       llegada al final es de verdad. */
    var primera = !(window.motor && window.motor.slides), festejado = false;
    document.addEventListener('slidechange', function () { setTimeout(function () { primera = false; }, 0); });
    document.addEventListener('courseend', function () {
      if (primera || festejado) return;
      festejado = true;
      var track = document.querySelector('[data-progress-track]');
      if (track && !reduce) {
        track.classList.add('fx-barra-llena');
        setTimeout(function () { track.classList.remove('fx-barra-llena'); }, 1800);
      }
      if (!reduce) {
        var lluvia = capa('fx-lluvia');
        particulas(lluvia, 'lluvia');
        setTimeout(function () { lluvia.remove(); }, 4300);
      }
    });
  }

  /* ---------- arranque ---------- */
  function boot() {
    initRipple();
    initParticles();
    initUISounds();
    initCinema();
    initSpotlight();
    initLogroGanado();
    initMedalla();
    initFinal();
    // expone coin() para que curso.js lo llame al sumar puntos (si quiere)
    window.__fxCoin = coin;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
