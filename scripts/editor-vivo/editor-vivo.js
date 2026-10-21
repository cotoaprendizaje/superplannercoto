/* Editor en vivo de Cotonetes Forever — la capa de revisión.
 *
 * Vive SOLO en la vista que se publica como artefacto (scripts/vista-editor.mjs);
 * nunca entra en el index.html que se despliega. Es una pastilla abajo a la
 * izquierda que se pliega y trae:
 *   - Comentar esta vista: el comentador de claude.ai anclado a lo que se ve
 *     (la vista, o la ficha / el cartel si hay uno abierto).
 *   - Señalar un elemento: el próximo clic no hace nada en la app; resalta lo
 *     que está bajo el puntero y ancla el comentario ahí. Esc cancela.
 *   - Ver como: la app en un marco con la medida EXACTA del dispositivo,
 *     escalado para que entre. Comentar ahí dice dónde se vio.
 *   - Ver como persona: entrar como otra persona del equipo (sus tarjetas en
 *     acción, su contador) y ver el cartel del primer ingreso.
 *   - Empezar de cero y Ver sin el editor.
 * Afuera de claude.ai no hay comentarios: se avisa y la app anda igual. */
(function () {
  "use strict";
  if (window.top !== window && /[?&]ev-marco=1/.test(location.search)) return;
  try {
    if (sessionStorage.getItem("ev-sin-editor") === "1") {
      sessionStorage.removeItem("ev-sin-editor");
      return;
    }
  } catch (e) {}

  var DISPOSITIVOS = [
    { id: "pc", nombre: "PC", w: 1366, h: 768 },
    { id: "fhd", nombre: "Full HD", w: 1920, h: 1080 },
    { id: "fhdv", nombre: "Full HD ventana", w: 1920, h: 945 },
    { id: "ipad", nombre: "iPad", w: 1180, h: 820, gira: true },
    { id: "tel", nombre: "Teléfono", w: 390, h: 844, gira: true },
  ];
  var comentarios = null,
    sinClaude = false,
    abierto = true;
  try {
    var guardado = localStorage.getItem("ev-abierto");
    abierto = guardado === null ? window.innerHeight >= 700 && window.innerWidth > 760 : guardado === "1";
  } catch (e) {}

  function hay(id) { return document.getElementById(id); }
  function vistaActual() {
    try {
      var tab = document.querySelector(".tab.active");
      return (tab && tab.textContent.trim()) || state.view;
    } catch (e) { return ""; }
  }
  function aviso(txt) {
    var t = hay("evAviso");
    t.textContent = txt;
    t.hidden = false;
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { t.hidden = true; }, 4200);
  }
  function abrirComentario(el) {
    if (!comentarios) {
      aviso(sinClaude ? "Para comentar, abrí esta página desde claude.ai." : "Los comentarios todavía están cargando…");
      return;
    }
    comentarios.openComposer({ element: el }).then(function (r) {
      if (r && r.opened === false) aviso("Ya tenés un comentario a medio escribir: terminalo primero.");
    }, function (err) {
      if (err && err.code === "unavailable") { comentarios = null; sinClaude = true; pintar(); }
      aviso("No se pudo abrir el comentario.");
    });
  }
  // Lo que hoy está en pantalla: un cartel abierto, la ficha abierta, o la vista.
  function loQueSeVe() {
    var modal = document.querySelector("#modal:not(.hidden) .modal");
    if (modal) return modal;
    var panel = document.querySelector("#panel.open");
    if (panel) return panel;
    return hay("view") || document.body;
  }

  // ── Señalar un elemento ──
  var senalando = false, marca = null;
  function objetivo(el) {
    if (!el || el.closest(".ev")) return null;
    if (el.closest("svg")) el = el.closest("button, a, [data-action], .kcard, .pb-fila, li, section, article, div") || el;
    return el === document.body || el === document.documentElement ? null : el;
  }
  function mover(ev) {
    var el = objetivo(document.elementFromPoint(ev.clientX, ev.clientY));
    if (!el) { marca.hidden = true; return; }
    var r = el.getBoundingClientRect();
    marca.hidden = false;
    marca.style.left = r.left - 3 + "px";
    marca.style.top = r.top - 3 + "px";
    marca.style.width = r.width + 6 + "px";
    marca.style.height = r.height + 6 + "px";
  }
  function elegir(ev) {
    var el = objetivo(ev.target);
    if (!el) return;
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.type === "click") { terminarSenalar(); abrirComentario(el); }
  }
  function tecla(ev) { if (ev.key === "Escape") { ev.stopPropagation(); terminarSenalar(); } }
  function empezarSenalar() {
    if (senalando) return terminarSenalar();
    senalando = true;
    document.body.classList.add("ev-senalando");
    document.addEventListener("mousemove", mover, true);
    ["pointerdown", "mousedown", "mouseup", "click"].forEach(function (t) { document.addEventListener(t, elegir, true); });
    document.addEventListener("keydown", tecla, true);
    aviso("Tocá lo que querés comentar. Esc cancela.");
    pintar();
  }
  function terminarSenalar() {
    senalando = false;
    document.body.classList.remove("ev-senalando");
    marca.hidden = true;
    document.removeEventListener("mousemove", mover, true);
    ["pointerdown", "mousedown", "mouseup", "click"].forEach(function (t) { document.removeEventListener(t, elegir, true); });
    document.removeEventListener("keydown", tecla, true);
    pintar();
  }

  // ── Ver como ──
  var dispositivo = null, vertical = { ipad: false, tel: true };
  function medida(d) {
    var w = d.w, h = d.h;
    if (d.id === "ipad" && vertical.ipad) { w = 820; h = 1180; }
    if (d.id === "tel" && !vertical.tel) { w = 844; h = 390; }
    return { w: w, h: h };
  }
  function abrirMarco(id) {
    dispositivo = DISPOSITIVOS.filter(function (d) { return d.id === id; })[0];
    var capa = hay("evMarco");
    capa.hidden = false;
    document.body.classList.add("ev-con-marco");
    armarMarco(true);
  }
  function armarMarco(recargar) {
    var d = dispositivo, m = medida(d), capa = hay("evMarco"),
      cuadro = capa.querySelector(".ev-marco-cuadro"), frame = capa.querySelector("iframe");
    var libreW = window.innerWidth - 48, libreH = window.innerHeight - 120,
      s = Math.min(1, libreW / m.w, libreH / m.h);
    cuadro.style.width = Math.round(m.w * s) + "px";
    cuadro.style.height = Math.round(m.h * s) + "px";
    frame.style.width = m.w + "px";
    frame.style.height = m.h + "px";
    frame.style.transform = "scale(" + s + ")";
    capa.querySelector(".ev-marco-nom").textContent = d.nombre + (d.gira ? (medida(d).h > medida(d).w ? " vertical" : " horizontal") : "");
    capa.querySelector(".ev-marco-med").textContent = m.w + " × " + m.h + (s < 1 ? " · al " + Math.round(s * 100) + "%" : "");
    capa.querySelector(".ev-girar").hidden = !d.gira;
    capa.querySelectorAll(".ev-disp").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.id === d.id)); });
    if (recargar) {
      capa.querySelector(".ev-marco-vista").textContent = vistaActual();
      frame.src = "marco.html?ev-marco=1&vista=" + encodeURIComponent(state.view || "");
    }
    titular();
  }
  function titular() {
    var capa = hay("evMarco"), m = medida(dispositivo);
    capa.querySelector("iframe").title =
      "Cotonetes Forever en " + dispositivo.nombre + " " + m.w + "×" + m.h + " · " + capa.querySelector(".ev-marco-vista").textContent;
  }
  function cerrarMarco() {
    hay("evMarco").hidden = true;
    hay("evMarco").querySelector("iframe").src = "about:blank";
    document.body.classList.remove("ev-con-marco");
    dispositivo = null;
  }
  window.addEventListener("message", function (ev) {
    var capa = hay("evMarco");
    if (!capa || capa.hidden || !ev.data || ev.data.revision !== "vista") return;
    if (ev.source !== capa.querySelector("iframe").contentWindow) return;
    capa.querySelector(".ev-marco-vista").textContent = String(ev.data.vista || "").slice(0, 40);
    titular();
  });

  // ── Ver como persona ──
  function comoPersona(id) {
    try {
      var m = member(id);
      if (!m) return;
      if (typeof closePanel === "function") closePanel();
      enterAs(m.nombre, m.id);
      render();
      aviso("Ahora estás viendo la app como " + m.nombre + ".");
    } catch (e) {}
    pintar();
  }
  function primerIngreso() {
    try {
      var yo = member(state.userId);
      if (!yo) return;
      var antes = { emoji: yo.emoji };
      delete yo.emoji;
      perfilModal(true);
      // Es solo para verlo: el emoji vuelve aunque se cierre sin guardar.
      setTimeout(function () { if (!yo.emoji && antes.emoji) yo.emoji = antes.emoji; }, 60000);
    } catch (e) {}
  }

  // ── Empezar de cero / sin el editor ──
  function deCero() {
    if (!confirm("¿Empezar de cero? Se borra todo lo que tocaste en esta vista (solo en tu navegador).")) return;
    if (!confirm("¿Seguro? Vuelve el tablero de ejemplo como al principio.")) return;
    try {
      ["revision.filas.v1", "revision.sembrado.v1"].forEach(function (k) { localStorage.removeItem(k); });
      Object.keys(localStorage).forEach(function (k) { if (/^coto\./.test(k)) localStorage.removeItem(k); });
    } catch (e) {}
    location.reload();
  }
  function sinEditor() {
    try { sessionStorage.setItem("ev-sin-editor", "1"); } catch (e) {}
    location.reload();
  }

  // Las descargas (CSV, JSON, PDF) no salen desde el visor de claude.ai.
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-action="data:export"],[data-action="data:csv"],[data-action="reportes:csv"],[data-action="app:print"]');
    if (b && !b.closest(".ev")) aviso("Las descargas y la impresión no andan dentro de claude.ai. En la app de verdad sí.");
  }, true);

  // ── La pastilla ──
  var raiz = document.createElement("div");
  raiz.className = "ev";
  raiz.innerHTML =
    '<div class="ev-pastilla" id="evPastilla"></div>' +
    '<div class="ev-aviso" id="evAviso" role="status" hidden></div>' +
    '<div class="ev-marca" id="evMarca" hidden></div>' +
    '<div class="ev-marco" id="evMarco" hidden><div class="ev-marco-caja" data-comment-target>' +
    '<div class="ev-marco-barra"><span class="ev-marco-nom"></span><span class="ev-marco-med"></span><span class="ev-marco-vista"></span>' +
    '<span class="ev-marco-acc"><button type="button" class="ev-chip ev-comentar-marco">💬 Comentar acá</button>' +
    '<button type="button" class="ev-chip ev-girar" title="Girar">⟳ Girar</button>' +
    '<button type="button" class="ev-chip ev-cerrar" aria-label="Cerrar la vista de dispositivo">✕</button></span>' +
    '<span class="ev-marco-disp">' +
    DISPOSITIVOS.map(function (d) { return '<button type="button" class="ev-chip ev-disp" data-id="' + d.id + '">' + d.nombre + "</button>"; }).join("") +
    '</span></div><div class="ev-marco-cuadro"><iframe></iframe></div></div></div>';
  document.body.appendChild(raiz);
  document.body.classList.add("ev-activo");
  marca = hay("evMarca");

  function pintar() {
    var p = hay("evPastilla");
    document.body.classList.toggle("ev-abierta", abierto);
    if (!abierto) {
      p.className = "ev-pastilla cerrada";
      p.innerHTML = '<button type="button" class="ev-abrir" data-ev="abrir" aria-label="Abrir el editor">✎ Editor</button>';
      return;
    }
    // Se redibuja seguido (al cargar el equipo, al llegar los comentarios):
    // los grupos que estaban abiertos tienen que seguir abiertos.
    var abiertos = {};
    p.querySelectorAll("details[data-g]").forEach(function (d) { abiertos[d.dataset.g] = d.open; });
    var gente = [];
    try { gente = TEAM.slice(); } catch (e) {}
    p.className = "ev-pastilla";
    p.innerHTML =
      '<div class="ev-cab"><b>Editor en vivo</b><span>' + (sinClaude ? "sin comentarios fuera de claude.ai" : "datos de ejemplo · nada toca al equipo") + '</span>' +
      '<button type="button" class="ev-plegar" data-ev="plegar" aria-label="Plegar el editor">–</button></div>' +
      '<button type="button" class="ev-b" data-ev="comentar">💬 Comentar esta vista</button>' +
      '<button type="button" class="ev-b' + (senalando ? " on" : "") + '" data-ev="senalar">🎯 ' + (senalando ? "Señalando… (Esc cancela)" : "Señalar un elemento") + "</button>" +
      '<details class="ev-grupo" data-g="disp"' + (abiertos.disp ? " open" : "") + '><summary>📐 Ver como</summary><div class="ev-lista">' +
      DISPOSITIVOS.map(function (d) {
        var m = medida(d);
        return '<button type="button" class="ev-chip" data-ev="disp" data-id="' + d.id + '">' + d.nombre + " <small>" + m.w + "×" + m.h + "</small></button>";
      }).join("") +
      "</div></details>" +
      '<details class="ev-grupo" data-g="persona"' + (abiertos.persona ? " open" : "") + '><summary>👤 Ver como persona</summary><div class="ev-lista">' +
      gente.map(function (m) {
        var yo = false;
        try { yo = state.userId === m.id; } catch (e) {}
        return '<button type="button" class="ev-chip' + (yo ? " on" : "") + '" data-ev="persona" data-id="' + m.id + '">' + (m.emoji || "") + " " + m.nombre + "</button>";
      }).join("") +
      '<button type="button" class="ev-chip" data-ev="ingreso">El primer ingreso</button></div></details>' +
      '<div class="ev-pie"><button type="button" class="ev-link" data-ev="cero">↺ Empezar de cero</button>' +
      '<button type="button" class="ev-link" data-ev="sin">👁 Ver sin el editor</button></div>';
  }
  raiz.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-ev], .ev-disp, .ev-girar, .ev-cerrar, .ev-comentar-marco");
    if (!b) return;
    if (b.classList.contains("ev-disp")) return abrirMarco(b.dataset.id);
    if (b.classList.contains("ev-girar")) {
      vertical[dispositivo.id] = !vertical[dispositivo.id];
      return armarMarco(false), pintar();
    }
    if (b.classList.contains("ev-cerrar")) return cerrarMarco();
    if (b.classList.contains("ev-comentar-marco")) return abrirComentario(hay("evMarco").querySelector(".ev-marco-caja"));
    var que = b.dataset.ev;
    if (que === "abrir" || que === "plegar") {
      abierto = que === "abrir";
      try { localStorage.setItem("ev-abierto", abierto ? "1" : "0"); } catch (e) {}
      return pintar();
    }
    if (que === "comentar") return abrirComentario(loQueSeVe());
    if (que === "senalar") return empezarSenalar();
    if (que === "disp") return abrirMarco(b.dataset.id);
    if (que === "persona") return comoPersona(b.dataset.id);
    if (que === "ingreso") return primerIngreso();
    if (que === "cero") return deCero();
    if (que === "sin") return sinEditor();
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && dispositivo && !senalando) cerrarMarco();
  });
  window.addEventListener("resize", function () { if (dispositivo) armarMarco(false); });
  pintar();
  // El equipo (con sus emojis) llega cuando la app termina de cargar.
  var espera = setInterval(function () {
    try { if (state.ready) { clearInterval(espera); pintar(); } } catch (e) {}
  }, 500);

  // El visor de claude.ai inyecta window.claude un poco después de cargar.
  (function probar(n) {
    if (window.claude && typeof window.claude.use === "function")
      return window.claude.use("comments").then(function (c) {
        comentarios = c;
        sinClaude = !c;
        pintar();
      }, function () { sinClaude = true; pintar(); });
    if (n < 40) setTimeout(function () { probar(n + 1); }, 250);
    else { sinClaude = true; pintar(); }
  })(0);
})();
