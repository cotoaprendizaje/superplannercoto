/* editor-vivo.js — capa del "simulador del editor" (kit-base v1.9.126)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Para revisar un curso como se diseñó el rediseño: abrirlo
   publicado como artefacto de claude.ai, señalar lo que hay que cambiar y
   dejar el comentario ahí mismo. El comentario (con "Send to Claude") le
   llega al chat del curso, que cambia la FUENTE (curso.json, marco, CSS
   propio) y vuelve a publicar en el mismo link. La vista nunca se edita a
   mano: es descartable, se rearma con `tools/vista-editor.mjs`.

   QUÉ HACE. Una pastilla abajo a la izquierda con dos entradas al
   comentador de claude.ai (capacidad `comments`, forma composer_only: no
   pide permiso y no escribe nada por su cuenta):
     · "Comentar esta diapositiva": abre el comentador anclado a la
       diapositiva en pantalla.
     · "Señalar un elemento": el próximo clic sobre el curso NO hace nada
       en el curso; abre el comentador anclado a lo que se tocó (Esc
       cancela).
     · "Ver como" (pedido del cliente: "¿podemos tener versiones web,
       iPad y teléfono para ir midiendo eso?"): el curso dentro de un
       marco con la medida EXACTA del dispositivo (la misma lista que usan
       los tests), escalado para que entre en la pantalla. Arriba del
       marco, una barra con dispositivo, medida y diapositiva: "Comentar"
       ancla ahí, así el comentario llega diciendo DÓNDE se vio. Adentro
       del marco el curso corre solo, sin esta capa (`?ev-marco=1`).
   Fuera de claude.ai (o sin permiso de comentar) la pastilla lo dice y
   el curso funciona igual. NUNCA va en el zip del curso. */
(function () {
  'use strict';
  /* Adentro del marco de "Ver como": el curso solo. */
  if (/[?&]ev-marco=1(&|$)/.test(location.search)) { document.documentElement.classList.add('ev-en-marco'); return; }
  var EQUIPOS = [
    { id: 'pantalla', nom: 'Esta pantalla' },
    { id: 'pc', nom: 'PC', w: 1366, h: 768 },
    { id: 'fhd', nom: 'PC Full HD', w: 1920, h: 1080 },
    /* Lo que de verdad ve un navegador maximizado en un monitor Full HD
       (Chrome en Windows, con la barra de tareas): pestañas y barra de
       direcciones se comen ~135px. */
    { id: 'fhdv', nom: 'Full HD ventana', w: 1920, h: 945 },
    { id: 'ipad', nom: 'iPad', w: 1180, h: 820 },
    { id: 'ipadv', nom: 'iPad vertical', w: 820, h: 1180 },
    { id: 'tel', nom: 'Teléfono', w: 844, h: 390 },
    { id: 'telv', nom: 'Tel. vertical', w: 390, h: 844, movil: true }
  ];
  var root = document.createElement('div');
  root.className = 'ev-root';
  root.setAttribute('data-uncommentable', '');
  root.setAttribute('data-narrate-skip', '');
  root.innerHTML =
    '<div class="ev-card" id="ev-card" hidden>' +
      '<div class="ev-hd"><b>Editor en vivo</b><span class="ev-donde" id="ev-donde"></span></div>' +
      '<button type="button" class="ev-btn" id="ev-diapo"><span class="ev-ic" aria-hidden="true">✎</span>' +
        '<span>Comentar esta diapositiva<small>El comentario queda pegado a la pantalla actual</small></span></button>' +
      '<button type="button" class="ev-btn" id="ev-senalar" aria-pressed="false"><span class="ev-ic" aria-hidden="true">◎</span>' +
        '<span>Señalar un elemento<small>Tocá un texto, una imagen o un botón (Esc cancela)</small></span></button>' +
      '<div class="ev-ver" role="group" aria-label="Ver como">' + EQUIPOS.map(function (q) {
        return '<button type="button" class="ev-eq" data-eq="' + q.id + '" aria-pressed="' + (q.id === 'pantalla') + '"' +
          (q.w ? ' title="' + q.w + '×' + q.h + '"' : '') + '>' + q.nom + '</button>';
      }).join('') + '</div>' +
      '<p class="ev-nota" id="ev-nota">Escribí qué cambiar y tocá <b>Send to Claude</b>: se aplica en el curso y esta vista se actualiza sola.</p>' +
    '</div>' +
    '<button type="button" class="ev-tab" id="ev-tab" aria-expanded="false" aria-controls="ev-card"><span class="ev-dot" aria-hidden="true"></span>Editor</button>';
  document.body.appendChild(root);

  var card = root.querySelector('#ev-card');
  var tab = root.querySelector('#ev-tab');
  var donde = root.querySelector('#ev-donde');
  var nota = root.querySelector('#ev-nota');
  var bDiapo = root.querySelector('#ev-diapo');
  var bSenalar = root.querySelector('#ev-senalar');
  var comentarios = null;

  /* ---- "Ver como": el curso en un marco del tamaño del dispositivo ---- */
  var escena = null, marco = null, rotulo = null, equipo = null;
  function rotular() {
    if (!rotulo || !equipo) return;
    var txt = equipo.nom + ' · ' + equipo.w + '×' + equipo.h;
    try {
      var m = marco.contentWindow.motor, s = m && m.current && m.current();
      if (s) txt += ' · diapositiva ' + (m.slides.indexOf(s) + 1) + ' de ' + m.slides.length + ' (' + s.getAttribute('data-slide') + ')';
    } catch (e) { /* el marco todavía carga */ }
    rotulo.textContent = txt;
  }
  function encajar() {
    if (!escena || !equipo) return;
    var k = Math.min(1, (innerWidth - 24) / equipo.w, (innerHeight - 64) / equipo.h);
    marco.style.width = equipo.w + 'px'; marco.style.height = equipo.h + 'px';
    marco.style.transform = 'scale(' + k + ')';
    marco.parentElement.style.width = Math.round(equipo.w * k) + 'px';
    marco.parentElement.style.height = Math.round(equipo.h * k) + 'px';
  }
  function verComo(id) {
    root.querySelectorAll('.ev-eq').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-eq') === id)); });
    var q = EQUIPOS.filter(function (x) { return x.id === id; })[0];
    if (!q || !q.w) {
      if (escena) { escena.remove(); escena = marco = rotulo = null; }
      equipo = null; bSenalar.disabled = !comentarios; pintarDonde(); return;
    }
    equipo = q;
    if (!escena) {
      escena = document.createElement('div');
      escena.className = 'ev-escena';
      escena.innerHTML = '<h2 class="ev-rotulo" id="ev-rotulo"></h2><div class="ev-caja"><iframe class="ev-marco" title="Vista del curso en el dispositivo"></iframe></div>';
      document.body.insertBefore(escena, root);
      marco = escena.querySelector('iframe'); rotulo = escena.querySelector('#ev-rotulo');
      marco.addEventListener('load', function () {
        try {
          var w = marco.contentWindow, d = marco.contentDocument;
          /* Arranca en la diapositiva que se estaba mirando. */
          var ir = escena.getAttribute('data-ir');
          if (ir && w.motor) { var i = w.motor.slides.findIndex(function (x) { return x.getAttribute('data-slide') === ir; }); if (i >= 0) w.motor.go(i, true); }
          d.addEventListener('slidechange', function () { setTimeout(rotular, 0); });
        } catch (e) { /* otro origen: el rótulo queda sin diapositiva */ }
        setTimeout(rotular, 300);
      });
    }
    var actual = diapoActual();
    try { var mm = marco.contentWindow && marco.contentWindow.motor; if (mm && mm.current()) actual = mm.current(); } catch (e) { /* noop */ }
    escena.setAttribute('data-ir', actual ? actual.getAttribute('data-slide') : '');
    var u = new URL(location.href); u.searchParams.set('ev-marco', '1'); u.searchParams.set('ev-eq', q.id);
    marco.src = u.toString();
    bSenalar.disabled = true;   // adentro del marco no se puede señalar: se comenta la vista
    encajar(); rotular();
  }
  addEventListener('resize', encajar);

  function abrir(si) {
    card.hidden = !si;
    tab.setAttribute('aria-expanded', si ? 'true' : 'false');
    try { localStorage.setItem('ev-abierto', si ? '1' : '0'); } catch (e) { /* sin almacenamiento: se abre igual */ }
  }
  tab.addEventListener('click', function () { abrir(card.hidden); });
  var guardado = null;
  try { guardado = localStorage.getItem('ev-abierto'); } catch (e) { guardado = null; }
  /* En pantallas bajas (teléfono acostado) arranca cerrada: abierta tapa media lámina. */
  abrir(guardado === null ? window.innerHeight >= 600 : guardado !== '0');

  function diapoActual() {
    var m = window.motor;
    var s = m && m.current ? m.current() : null;
    return s || document.querySelector('[data-slide].is-active') || document.querySelector('[data-slide]:not([hidden])');
  }
  function pintarDonde() {
    var m = window.motor, s = diapoActual();
    if (!s) { donde.textContent = ''; return; }
    var i = m && m.slides ? Array.prototype.indexOf.call(m.slides, s) : -1;
    donde.textContent = (i >= 0 ? (i + 1) + ' de ' + m.slides.length + ' · ' : '') + (s.getAttribute('data-slide') || '');
  }
  document.addEventListener('slidechange', function () { setTimeout(pintarDonde, 0); });
  setTimeout(pintarDonde, 600);

  function sinComentarios(motivo) {
    bDiapo.disabled = true; bSenalar.disabled = true;
    nota.textContent = motivo;
  }
  function abrirComentador(el) {
    if (!comentarios) return;
    comentarios.openComposer({ element: el }).then(function (r) {
      if (r && r.opened === false) nota.textContent = 'Ya hay un comentario a medio escribir: terminalo o cerralo primero.';
    }).catch(function (e) {
      var c = e && e.code;
      if (c === 'unavailable' || c === 'not_granted' || c === 'capability_disabled' || c === 'capability_removed') {
        sinComentarios('Desde esta vista no se puede comentar. Usá el modo comentarios de claude.ai.');
      } else if (c === 'rate_limited') {
        nota.textContent = 'Muy seguido: esperá unos segundos y probá de nuevo.';
      }
    });
  }
  bDiapo.addEventListener('click', function () {
    if (escena) { rotular(); abrirComentador(rotulo); return; }
    var s = diapoActual(); if (s) abrirComentador(s);
  });
  root.querySelectorAll('.ev-eq').forEach(function (b) { b.addEventListener('click', function () { verComo(b.getAttribute('data-eq')); }); });

  /* ---- Modo "señalar" ---- */
  var senalando = false, marcado = null;
  function marcar(el) {
    if (marcado === el) return;
    if (marcado) marcado.classList.remove('ev-marca');
    marcado = el;
    if (marcado) marcado.classList.add('ev-marca');
  }
  function salirSenalar() {
    senalando = false;
    bSenalar.setAttribute('aria-pressed', 'false');
    document.documentElement.classList.remove('ev-senalando');
    marcar(null);
  }
  function objetivo(e) {
    var t = e.target;
    if (!t || !t.closest || t.closest('.ev-root')) return null;
    /* SVG suelto (un ícono): se anota sobre su botón o contenedor. */
    var svg = t.closest('svg');
    if (svg && svg.parentElement) t = svg.parentElement;
    return t;
  }
  bSenalar.addEventListener('click', function () {
    if (senalando) { salirSenalar(); return; }
    senalando = true;
    bSenalar.setAttribute('aria-pressed', 'true');
    document.documentElement.classList.add('ev-senalando');
  });
  document.addEventListener('pointerover', function (e) { if (senalando) marcar(objetivo(e)); }, true);
  ['pointerdown', 'mousedown', 'touchstart'].forEach(function (tipo) {
    document.addEventListener(tipo, function (e) {
      if (!senalando || !objetivo(e)) return;
      e.preventDefault(); e.stopPropagation();
    }, { capture: true, passive: false });
  });
  document.addEventListener('click', function (e) {
    if (!senalando) return;
    var el = objetivo(e);
    if (!el) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    salirSenalar();
    abrirComentador(el);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (senalando && e.key === 'Escape') { e.stopPropagation(); salirSenalar(); }
  }, true);

  /* ---- La capacidad: llega después del primer pintado, o nunca ---- */
  /* `window.claude` lo pone el visor de claude.ai y puede llegar un poco
     después que este script: se espera hasta 3 s. */
  (function esperar(n) {
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('comments').then(function (c) {
        if (c) comentarios = c;
        else sinComentarios('Desde esta vista no se puede comentar. Usá el modo comentarios de claude.ai.');
      }).catch(function () { sinComentarios('Desde esta vista no se puede comentar.'); });
    } else if (n < 30) {
      setTimeout(function () { esperar(n + 1); }, 100);
    } else {
      sinComentarios('Esta vista no está en claude.ai: los comentarios funcionan en el artefacto publicado.');
    }
  })(0);
})();
