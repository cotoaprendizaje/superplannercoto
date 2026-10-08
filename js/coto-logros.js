/* coto-logros.js — kit-base v1.9.60 (logros del kit, bono y medalla desde v1.9.125)
   Área Aprendizaje (COTO) — puntaje y logros del curso
   ------------------------------------------------------------
   POR QUÉ EXISTE (auditoría de los 2 cursos terminados, §7.08):
   se compararon los `curso.js` de "Uso de Sucursales 3 - NOA" y
   "Seguridad alimentaria" función por función. `award` daba 92% de
   similitud entre los dos, `unlockBadge` 96%, `renderBadges` 88%,
   `updateHud` 67% — o sea, las mismas ~45 líneas copiadas y pegadas
   de un curso al otro. El kit ya era dueño de TODO lo demás de esta
   pieza: el marcado (`#d-badge-count` y `#d-points` viven en
   `header-boilerplate.html`), el CSS de las tarjetas
   (`.d-badge`/`.d-badges-grid`, addendum), el pulso del chip
   (`.d-chip--achieve.is-award-pulse`, coto-player-chrome.css), la
   moneda voladora (`fx.js`) y el sonido (`CotoUI.sStreak`). Lo único
   que NO vivía acá era el pegamento entre todo eso — justamente la
   parte que cada curso reescribía.

   Y ya se pagó el precio: "Seguridad alimentaria" tenía el conteo
   animado (`CotoUI.countTo`), el pulso del chip y el envío a xAPI
   (`XAPI.awarded`) — y "Uso de Sucursales 3 - NOA", que se armó
   DESPUÉS, no los tiene. La duplicación no solo cuesta líneas: hace
   que un curso nuevo ARRANQUE PEOR que el anterior, porque el que
   copia no sabe qué mejoras había que traerse. Este módulo toma como
   base la versión más completa de las dos, así el próximo curso las
   hereda de entrada en vez de redescubrirlas.

   QUÉ ES DEL KIT (está acá) y QUÉ NO (queda en el curso):
   · Acá: el contador de puntos, el set de logros obtenidos, pintar el
     HUD, dibujar la grilla de tarjetas, el toast, el sonido, la
     moneda, el pulso y el aviso a xAPI.
   · En el curso: el CATÁLOGO de logros (contenido: qué logros hay,
     cómo se llaman, qué pista dan) y CUÁNDO se otorga cada cosa (las
     reglas de su contenido). Eso no generaliza y no tiene por qué.

   Uso:
     var Logros = initLogros({
       badges: [{ id:'explorador', nom:'Explorador', ic:'🔎',
                  txt:'Abriste todas las fichas.',
                  pista:'Abrí todas las fichas de la diapositiva 3.' }, …]
     });
     Logros.award(10, 'Ficha completa');   // suma puntos + toast + fx
     Logros.unlock('explorador');          // otorga el logro (idempotente)

   Persistencia: este módulo NO llama a `SCORM.saveState()` por su
   cuenta a propósito — cada curso guarda además sus propias claves y
   `suspend_data` tiene 4096 caracteres contados en SCORM 1.2 (ver
   `check-suspend-data`). El curso arma su objeto y le pide a este
   módulo su parte:
     SCORM.saveState(Object.assign({ mis:'claves' }, Logros.serialize()));
     Logros.restore(SCORM.loadState());
   `serialize()` usa las mismas claves cortas que ya usaban los dos
   cursos (`p` = puntos, `b` = ids de logros), así un curso viejo que
   migre a este módulo sigue leyendo su propio suspend_data guardado.

   ---- v1.9.125: los 5 logros genéricos, el bono y la medalla (§7.74) ----
   Pedido del cliente: "todos los cursos tienen que tener 5 logros por
   defecto, bien asociados a los puntos", y "en los logros tiene que haber
   lugar para un plus del usuario: que pueda ganar más puntos y mejor
   medalla". Rediseñado en el canvas con el cliente. Tres cambios:

   1 · EL CATÁLOGO ACEPTA IDS DEL KIT. En `curso.json` → `logros` alcanza
       con escribir `["punteria", "racha", "curioso", "segunda", "impecable"]`:
       el texto, el ícono y el bono los pone el kit, y los detecta solo
       (más abajo, "Detectores"). Un curso puede mezclar ids del kit con
       logros propios (objetos, como siempre).
   2 · UN LOGRO PUEDE DAR PUNTOS: `pts` en la entrada (los del kit, +20).
       Se suman al ganarlo, una sola vez. `bono()` dice cuánto del puntaje
       vino de logros y `#d-points[data-bono]` lo publica para los tests.
   3 · `mide`: "acierto" o "recorrido". Los del kit Puntería, En racha e
       Impecable miden ACIERTO a propósito: son el plus. Un logro de
       recorrido (los propios de cada curso) nunca puede depender de
       acertar algo que se contesta una vez (§7.73); `repaso-errada` lo
       exige solo para esos.

   Y el panel "Mis logros:" se completa solo: arriba del `#d-badges-list`
   el kit agrega la medalla (con estrella), los puntos y la barra con
   Bronce · Plata · Oro marcados, si el curso le pasa `medallas`. Sin
   marcado nuevo: un curso viejo lo gana al actualizar el kit.
   -------------------------------------------------------------- */
(function (global) {
  'use strict';

  /* Íconos lineales del banco del rediseño (trazo 2, puntas redondas,
     grilla de 24). Mismos trazos que el canvas. */
  var IC = {
    punteria: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    racha: 'M12 3c1 3.5 5 5.2 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.8 2.4-4.6.1 1.6.9 2.6 2 3C11 9 11 6 12 3z',
    curioso: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20M9 8h7M9 12h5',
    segunda: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2',
    impecable: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z',
    candado: 'M5 11h14v10H5z M8 11V8a4 4 0 0 1 8 0v3',
    estrella: 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z'
  };
  var BONO = 20;
  /* Ninguno se gana con lo mínimo: lo obligatorio del curso no alcanza
     para ninguno de los cinco. Esa es la regla que los hace un plus. */
  var GENERICOS = {
    punteria:  { nom: 'Puntería', mide: 'acierto', txt: 'Contestaste bien todos los repasos al primer intento.' },
    racha:     { nom: 'En racha', mide: 'acierto', txt: 'Encadenaste 3 respuestas correctas seguidas.' },
    curioso:   { nom: 'Curioso', mide: 'recorrido', txt: 'Consultaste 3 términos del glosario por tu cuenta.' },
    segunda:   { nom: 'Segunda mirada', mide: 'recorrido', txt: 'Volviste a una diapositiva para repasarla.' },
    impecable: { nom: 'Impecable', mide: 'acierto', txt: 'Terminaste la práctica o el minijuego sin un error, al primer intento.' }
  };
  var IDS_GENERICOS = ['punteria', 'racha', 'curioso', 'segunda', 'impecable'];
  var COLOR_MEDALLA = { bronce: '#d38b4f', plata: '#c9d3de', oro: '#ffd25e' };
  var TINTA_MEDALLA = { bronce: '#ffffff', plata: '#00466E', oro: '#7a5300' };

  function svg(d, clase) {
    return '<svg class="' + (clase || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + d + '"/></svg>';
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Un string es un logro del kit; un objeto, uno del curso. Un id del
     kit con campos propios (`{ "id": "curioso", "txt": "…" }`) toma lo
     del kit y le pisa lo que el curso escribió. */
  function expandir(lista) {
    var out = [];
    (lista || []).forEach(function (x) {
      var id = typeof x === 'string' ? x : x && x.id;
      if (!id) return;
      var base = GENERICOS[id];
      if (typeof x === 'string' && !base) return;
      var b = Object.assign({ id: id }, base ? { pts: BONO, icono: IC[id], pista: base.txt, generico: true } : {}, base || {}, typeof x === 'string' ? {} : x);
      if (!b.mide) b.mide = 'recorrido';
      out.push(b);
    });
    return out;
  }

  /* Umbrales por defecto (kit-base v1.9.125): con lo obligatorio se llega
     a bronce o plata; el oro pide el plus. Plata = 85% del máximo sin
     logros; oro = ese máximo + 2 logros. Con un curso de 130 da los 110 y
     170 del canvas. Un curso que trae `medallas` propias manda. */
  function medallasPorDefecto(max) {
    if (!max) return null;
    return [
      { id: 'bronce', nombre: 'bronce', desde: 0 },
      { id: 'plata', nombre: 'plata', desde: Math.round(max * 0.85 / 5) * 5 },   // redondeado a 5: 130 → 110
      { id: 'oro', nombre: 'oro', desde: max + 2 * BONO }
    ];
  }
  function maximoDeclarado() {
    var m = parseInt(document.body && document.body.getAttribute('data-puntaje-max'), 10);
    if (!m && typeof global.__PUNTAJE_MAX__ === 'number') m = global.__PUNTAJE_MAX__;
    return m || 0;
  }

  function initLogros(opts) {
    opts = opts || {};
    var BADGES = expandir(opts.badges);
    var puntos = 0;
    var obtenidos = {};
    /* Estado de los detectores (viaja en `lg`, solo si el catálogo trae
       logros del kit): pr = repaso acertado, pm = repaso errado, rs = racha
       actual, gl = términos consultados (por posición), pi = la primera
       práctica o el primer minijuego ya terminados. */
    var lg = { pr: [], pm: 0, rs: 0, gl: [], pi: 0 };
    var tiene = {};
    BADGES.forEach(function (b) { if (b.generico) tiene[b.id] = true; });
    var hayGenericos = Object.keys(tiene).length > 0;

    function porId(id) { return BADGES.filter(function (x) { return x.id === id; })[0]; }
    function bono() {
      return BADGES.reduce(function (s, b) { return s + (obtenidos[b.id] ? (b.pts || 0) : 0); }, 0);
    }
    function bonoTotal() { return BADGES.reduce(function (s, b) { return s + (b.pts || 0); }, 0); }
    function medallas() {
      var m = opts.medallas && opts.medallas.length ? opts.medallas : medallasPorDefecto(maximoDeclarado());
      return m ? m.slice().sort(function (a, b) { return a.desde - b.desde; }) : null;
    }

    /* ---- El chip del header: anillo de N segmentos (uno por logro) ----
       Se dibuja por JS en el chip de siempre (`.d-chip--achieve`): un
       curso viejo lo gana sin tocar su marcado. Reemplaza al 🏆. */
    function anillo() {
      var chip = document.querySelector('.d-chip--achieve');
      if (!chip || !BADGES.length) return;
      var a = chip.querySelector('.d-lg-anillo');
      if (!a) {
        var copa = chip.querySelector('span[aria-hidden="true"]');
        a = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        a.setAttribute('class', 'd-lg-anillo');
        a.setAttribute('viewBox', '0 0 40 40');
        a.setAttribute('aria-hidden', 'true');
        if (copa && /🏆/.test(copa.textContent)) chip.replaceChild(a, copa); else chip.insertBefore(a, chip.firstChild);
      }
      var n = BADGES.length, circ = 2 * Math.PI * 16, seg = circ / n, h = '<circle cx="20" cy="20" r="16" fill="#fff"/>';
      BADGES.forEach(function (b, i) {
        h += '<circle cx="20" cy="20" r="16" fill="none" stroke-width="5" transform="rotate(-90 20 20)" class="' +
          (obtenidos[b.id] ? 'is-on' : '') + '" stroke-dasharray="' + (seg - 3).toFixed(2) + ' ' + (circ - seg + 3).toFixed(2) +
          '" stroke-dashoffset="' + (-i * seg).toFixed(2) + '"/>';
      });
      h += '<text x="20" y="25" text-anchor="middle">' + Object.keys(obtenidos).length + '</text>';
      a.innerHTML = h;
    }

    /* El HUD se pinta por id, igual que lo hacía cada curso — son los
       ids del boilerplate del kit, no inventados acá. Si el curso no
       los tiene (una portada suelta, un test), simplemente no pinta:
       nunca romper por marcado ausente. */
    function updateHud() {
      var c = document.getElementById('d-badge-count');
      var p = document.getElementById('d-points');
      if (c) c.textContent = Object.keys(obtenidos).length + '/' + BADGES.length;
      anillo();
      if (!p) return;
      /* `data-valor` con el número VERDADERO, siempre y antes de animar
         (kit-base v1.9.66): el count-up de `countTo` dura 500ms y leer el
         `textContent` a mitad devuelve un valor intermedio que parece un
         bug de producto. Los tests y el curso leen `data-valor`.
         `data-bono` (v1.9.125): la parte que vino de logros. */
      p.setAttribute('data-valor', String(puntos));
      p.setAttribute('data-bono', String(bono()));
      if (global.CotoUI && global.CotoUI.countTo) global.CotoUI.countTo(p, puntos);
      else p.textContent = puntos;
      pintarMedalla();
    }

    /* Pulso del chip de logros del header (reflow entre quitar y poner la
       clase: sin eso dos premios seguidos no reinician la animación). */
    function pulsarChip() {
      var chip = document.querySelector('.d-chip--achieve');
      if (!chip) return;
      chip.classList.remove('is-award-pulse');
      void chip.offsetWidth;
      chip.classList.add('is-award-pulse');
    }

    /* ---- Progreso de cada logro del kit, para la tarjeta ---- */
    function totalRepaso() {
      return document.querySelectorAll('[data-slide] [data-repaso-item][data-repaso-id]').length;
    }
    function progreso(b) {
      if (obtenidos[b.id]) return { txt: 'Completado', pct: 100 };
      if (b.id === 'punteria' && b.generico) {
        var t = totalRepaso();
        if (lg.pm) return { txt: 'hubo una errada', pct: 0 };
        return t ? { txt: lg.pr.length + ' de ' + t + ' preguntas', pct: Math.round(lg.pr.length / t * 100) } : { txt: 'todavía no', pct: 0 };
      }
      if (b.id === 'racha' && b.generico) return { txt: lg.rs ? 'racha de ' + lg.rs : 'todavía no', pct: Math.round(Math.min(lg.rs, 3) / 3 * 100) };
      if (b.id === 'curioso' && b.generico) return { txt: lg.gl.length + ' de 3 términos', pct: Math.round(Math.min(lg.gl.length, 3) / 3 * 100) };
      return { txt: 'todavía no', pct: 0 };
    }

    /* Contrato del kit: el contenedor es #d-badges-list.d-badges-grid y
       cada tarjeta es .d-badge[.earned] con .i / .n / .d adentro (las
       clases de siempre: un curso que las estiliza no se rompe). El
       rediseño suma el pie: estado, puntos, barra y "¡Ganado!". */
    function render() {
      var g = document.getElementById('d-badges-list');
      if (!g) return;
      g.innerHTML = '';
      BADGES.forEach(function (b) {
        var on = !!obtenidos[b.id];
        var pr = progreso(b);
        var el = document.createElement('div');
        el.className = 'd-badge' + (on ? ' earned' : '');
        el.setAttribute('data-logro', b.id);
        var marca = on
          ? (b.pts ? '<span class="d-badge-plus">+' + b.pts + '</span>' : '')
          : '<span class="d-badge-lock">' + svg(IC.candado) + '</span>';
        el.innerHTML =
          '<span class="i" aria-hidden="true">' + (b.icono ? svg(b.icono) : esc(on ? b.ic : (b.ic || '🔒'))) + marca + '</span>' +
          '<span class="n">' + esc(b.nom) + '</span>' +
          '<span class="d">' + esc(on ? b.txt : (b.pista || b.txt)) + '</span>' +
          '<span class="d-badge-pie">' +
            '<span class="d-badge-est"><span>' + esc(pr.txt) + '</span>' + (b.pts ? '<b>+' + b.pts + ' pts</b>' : '') + '</span>' +
            '<span class="d-badge-bar"><i style="width:' + pr.pct + '%"></i></span>' +
            '<span class="d-badge-pill">' + (on ? '¡Ganado!' : 'Todavía no') + '</span>' +
          '</span>';
        g.appendChild(el);
      });
    }

    /* ---- La medalla, los puntos y la barra, arriba de las tarjetas ----
       Se arma una vez (si el panel existe y hay medallas) y se actualiza
       en cada cambio de puntaje. */
    function pintarMedalla() {
      var g = document.getElementById('d-badges-list');
      var ms = medallas();
      if (!g || !ms) return;
      var box = g.parentNode.querySelector('.d-lg-medalla');
      if (!box) {
        box = document.createElement('div');
        box.className = 'd-lg-medalla';
        box.innerHTML =
          '<div class="d-lg-med">' +
            '<span class="d-lg-cinta" aria-hidden="true"><i></i><i></i></span>' +
            '<span class="d-lg-disco" aria-hidden="true">' + svg(IC.estrella) + '</span>' +
            '<span class="d-lg-medtxt"><small>Tu medalla</small><b data-lg-nombre></b><span data-lg-falta></span></span>' +
          '</div>' +
          '<div class="d-lg-pts">' +
            '<span class="d-lg-num"><b data-lg-puntos>0</b> puntos</span>' +
            '<span class="d-lg-barra"><i data-lg-relleno></i></span>' +
            '<span class="d-lg-hitos" data-lg-hitos></span>' +
          '</div>';
        g.parentNode.insertBefore(box, g.parentNode.querySelector('.d-badges-intro') || g);   // como en el canvas: medalla, texto, tarjetas
      }
      var tope = Math.max((maximoDeclarado() || ms[ms.length - 1].desde) + bonoTotal(), puntos, 1);
      var m = null, sig = null;
      ms.forEach(function (x) { if (puntos >= x.desde) m = x; else if (!sig) sig = x; });
      var id = m ? m.id : 'ninguna';
      box.setAttribute('data-nivel', id);
      box.style.setProperty('--lg-medalla', COLOR_MEDALLA[id] || '#E9EEF8');
      box.style.setProperty('--lg-medalla-tinta', TINTA_MEDALLA[id] || '#6B7690');
      var cap = function (t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : ''; };
      box.querySelector('[data-lg-nombre]').textContent = m ? cap(m.nombre) : 'Todavía sin medalla';
      box.querySelector('[data-lg-falta]').textContent = sig
        ? 'Te faltan ' + (sig.desde - puntos) + ' puntos para ' + cap(sig.nombre) + '.'
        : '¡Llegaste al oro! Excelente recorrido.';
      box.querySelector('[data-lg-puntos]').textContent = puntos;
      box.querySelector('[data-lg-relleno]').style.width = Math.min(100, puntos / tope * 100).toFixed(1) + '%';
      box.querySelector('[data-lg-hitos]').innerHTML = ms.map(function (x) {
        var left = (x.desde / tope * 100).toFixed(1);
        return '<span class="d-lg-hito' + (x.desde === 0 ? ' is-inicio' : '') + '" style="left:' + left + '%;--c:' +
          (COLOR_MEDALLA[x.id] || '#96A5BE') + '"><i></i>' + esc(cap(x.nombre)) + ' · ' + x.desde + '</span>';
      }).join('');
    }

    /* ---- ¿Subió de medalla? (rediseño v1.9.125, §7.74) ----
       `medallasube` {de, a} SOLO en vivo —desde `award`/`unlock`, nunca al
       restaurar—: los efectos de fx.js (la medalla que gira, los fuegos
       del oro) festejan el momento, no la recarga. */
    function nivelMedalla() {
      var ms = medallas(), id = null;
      if (ms) ms.forEach(function (x) { if (puntos >= x.desde) id = x.id; });
      return id;
    }
    function avisarMedalla(antes) {
      var ahora = nivelMedalla();
      if (ahora && ahora !== antes) {
        var ms = medallas(), nom = ahora;
        ms.forEach(function (x) { if (x.id === ahora) nom = x.nombre || x.id; });
        document.dispatchEvent(new CustomEvent('medallasube', { detail: { de: antes, a: ahora, nombre: nom } }));
      }
    }

    function award(n, motivo) {
      var antes = nivelMedalla();
      puntos += n;
      updateHud();
      pulsarChip();
      /* El "+N que sube" lo expone fx.js como `__fxCoin(n)` (ver su §5). */
      if (global.__fxCoin) global.__fxCoin(n);
      if (global.Player && motivo) global.Player.toast('+' + n + ' · ' + motivo);
      avisarMedalla(antes);
      if (opts.onChange) opts.onChange();
    }

    function unlock(id) {
      if (obtenidos[id]) return false;   // idempotente: otorgar dos veces no suma dos toasts
      var b = porId(id);
      if (!b) return false;              // id que no está en el catálogo: no inventar una tarjeta
      var antes = nivelMedalla();
      obtenidos[id] = true;
      /* El bono del logro (v1.9.125) entra al puntaje UNA vez, acá: el
         `obtenidos[id]` de arriba es lo que impide pagarlo dos veces, y
         viaja en suspend_data junto con los puntos. */
      if (b.pts) { puntos += b.pts; pulsarChip(); if (global.__fxCoin) global.__fxCoin(b.pts); }
      updateHud();
      render();
      if (global.Player) global.Player.toast('🏆 Logro: ' + b.nom + (b.pts ? ' · +' + b.pts : ''));
      if (global.XAPI) global.XAPI.awarded(id, b.nom);
      if (global.CotoUI && global.CotoUI.sStreak) global.CotoUI.sStreak();
      document.dispatchEvent(new CustomEvent('logroganado', { detail: { id: id, nombre: b.nom, txt: b.txt, icono: b.icono || null, ic: b.ic || null, pts: b.pts || 0 } }));
      avisarMedalla(antes);
      if (opts.onChange) opts.onChange();
      return true;
    }

    /* ---- Detectores de los logros del kit ----
       Escuchan los eventos que emiten las piezas del kit; un curso no
       tiene que llamar a nada. Solo se enganchan si el catálogo trae ese
       logro. */
    function guardar() { render(); if (opts.onChange) opts.onChange(); }
    if (hayGenericos) {
      document.addEventListener('cotorespuesta', function (e) {
        var d = e.detail || {};
        if (d.repetida) return;                       // un reintento no cuenta (decisión del cliente)
        if (tiene.racha) {
          lg.rs = d.acerto ? lg.rs + 1 : 0;
          if (lg.rs >= 3) unlock('racha');
        }
        if (tiene.punteria && d.fuente === 'repaso' && d.id) {
          if (!d.acerto) lg.pm = 1;
          else if (lg.pr.indexOf(d.id) < 0) lg.pr.push(d.id);
          var t = totalRepaso();
          if (!lg.pm && t && lg.pr.length >= t) unlock('punteria');
        }
        guardar();
      });
      document.addEventListener('cotopractica', function (e) {
        var d = e.detail || {};
        /* Sin repaso en el curso, Puntería mira la práctica: todas bien
           al primer intento. */
        if (tiene.punteria && !totalRepaso() && d.primera && d.total && d.correctas === d.total) unlock('punteria');
        if (tiene.impecable && d.primera && d.total && d.correctas === d.total) unlock('impecable');
        if (d.primera) lg.pi = 1;
        guardar();
      });
      document.addEventListener('cotominijuego', function (e) {
        var d = e.detail || {};
        if (tiene.impecable && d.primera && d.gano && !d.errores) unlock('impecable');
        guardar();
      });
      document.addEventListener('cotoglosario', function (e) {
        var n = e.detail && e.detail.n;
        if (!tiene.curioso || n == null || lg.gl.indexOf(n) >= 0) return;
        lg.gl.push(n);
        if (lg.gl.length >= 3) unlock('curioso');
        guardar();
      });
      /* Segunda mirada: llegar a una diapositiva ANTERIOR a la más
         avanzada que ya se vio (con "Anterior", el índice o "Repasar en").
         Retomar donde se dejó no cuenta: eso es avanzar. */
      var maxVista = -1;
      document.addEventListener('slidechange', function () {
        var m = global.motor;
        if (!m || !m.slides || !m.current) return;
        var i = m.slides.indexOf(m.current());
        if (i < 0) return;
        if (tiene.segunda && maxVista >= 0 && i < maxVista) unlock('segunda');
        if (i > maxVista) maxVista = i;
      });
    }

    function serialize() {
      var s = { p: puntos, b: Object.keys(obtenidos) };
      if (hayGenericos && (lg.pr.length || lg.pm || lg.rs || lg.gl.length || lg.pi)) s.lg = lg;
      return s;
    }

    /* Tolerante a `null`/objeto vacío a propósito: `SCORM.loadState()`
       devuelve null en la primera visita. */
    function restore(s) {
      if (!s) return;
      puntos = s.p || 0;
      /* ⚠️ VALIDA CONTRA EL CATÁLOGO, igual que `unlock()` (kit-base
         v1.9.95): un id de un build anterior servido desde la misma ruta
         inflaba el chip ("7/6 logros", reportado por el cliente). Un logro
         que ya no existe en el catálogo no tiene tarjeta que mostrar. */
      var descartados = [];
      (s.b || []).forEach(function (id) {
        if (porId(id)) obtenidos[id] = true;
        else descartados.push(id);
      });
      if (descartados.length && global.console && console.warn) {
        console.warn('[logros] el estado guardado traía ' + descartados.length +
          ' logro(s) que no están en el catálogo y se descartaron: ' + descartados.join(', ') +
          '. Suele ser estado de un build anterior servido desde la misma ruta.');
      }
      if (s.lg && typeof s.lg === 'object') {
        lg.pr = Array.isArray(s.lg.pr) ? s.lg.pr : [];
        lg.pm = s.lg.pm ? 1 : 0;
        lg.rs = +s.lg.rs || 0;
        lg.gl = Array.isArray(s.lg.gl) ? s.lg.gl : [];
        lg.pi = s.lg.pi ? 1 : 0;
      }
      updateHud();
      render();
    }

    updateHud();
    render();

    return {
      award: award,
      unlock: unlock,
      has: function (id) { return !!obtenidos[id]; },
      puntos: function () { return puntos; },
      bono: bono,
      total: function () { return BADGES.length; },
      obtenidos: function () { return Object.keys(obtenidos).length; },
      catalogo: function () { return BADGES.slice(); },
      medallas: medallas,
      practicaHecha: function () { return !!lg.pi; },
      render: render,
      updateHud: updateHud,
      serialize: serialize,
      restore: restore
    };
  }

  initLogros.genericos = IDS_GENERICOS.slice();
  initLogros.medallasPorDefecto = medallasPorDefecto;
  global.initLogros = initLogros;
})(window);
