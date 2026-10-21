// Arma la vista del "editor en vivo": la app de verdad, publicada como
// artefacto de claude.ai, con una capa para revisarla y comentarla (ver
// scripts/editor-vivo/). Se rearma cada vez desde el index.html que sale de
// build.mjs; la vista es descartable y nunca se edita a mano. La capa del
// editor NUNCA entra en el index.html que se despliega.
//
//   node build.mjs && node scripts/vista-editor.mjs <carpeta de salida>
//
// No se conecta a ninguna base: las llamadas a Supabase las contesta una base
// de mentira que vive en el navegador de quien mira (localStorage), con un
// tablero de ejemplo. Cada persona puede tocar todo sin rozar los datos del
// equipo.
//
// Deja en <salida>:
//   pagina.html   la página del artefacto, con la forma que pide (sin
//                 doctype/html/head/body): título, estilos, la app y la capa.
//   marco.html    la app sola, para el "Ver como" (un iframe con la medida
//                 exacta del dispositivo).
//   editor-vivo.css, editor-vivo.js, assets/cursos/*.jpg
//   archivos.json el mapa { ruta publicada: archivo } que va en `files`.

import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";

const salida = process.argv[2];
if (!salida) throw new Error("Falta la carpeta de salida: node scripts/vista-editor.mjs <carpeta>");
const raiz = new URL("../", import.meta.url);

// Antes que la app: reemplaza fetch() para todo lo que vaya a *.supabase.co.
// La dirección del proyecto además se cambia por una que no existe, así que
// ni por error sale un pedido hacia la base real.
const BASE_FALSA = `<script>
(function () {
  var KEY = "revision.filas.v1";
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function guardar(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function resp(status, obj) {
    return Promise.resolve(new Response(JSON.stringify(obj), { status: status, headers: { "Content-Type": "application/json" } }));
  }
  var real = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = new URL(typeof input === "string" ? input : input.url, location.href);
    if (!/supabase\\.co$/.test(url.hostname)) return real(input, init);
    var metodo = (init && init.method) || "GET", cuerpo = {};
    try { cuerpo = JSON.parse((init && init.body) || "{}"); } catch (e) {}
    if (url.pathname === "/auth/v1/token")
      return resp(200, { access_token: "demo-" + Date.now(), refresh_token: "demo-r", expires_in: 3600,
        user: { email: String(cuerpo.email || "dami@coto.com.ar").toLowerCase() } });
    if (url.pathname.indexOf("/rest/v1/") === 0) {
      var filas = leer();
      if (metodo === "GET") {
        var id = (url.searchParams.get("id") || "").replace(/^eq\\./, ""), fila = filas[id],
          sel = url.searchParams.get("select") || "data", m = /^data->>?(.+)$/.exec(sel);
        if (m) { var o = {}; o[m[1]] = fila && fila[m[1]] != null ? fila[m[1]] : null; return resp(200, fila ? [o] : []); }
        return resp(200, fila ? [{ data: fila }] : []);
      }
      if (cuerpo && cuerpo.id) { filas[cuerpo.id] = cuerpo.data; guardar(filas); }
      return resp(201, {});
    }
    return resp(200, {});
  };
})();
</script>`;

// Después de la app: entra sola y, la primera vez, carga un tablero de
// ejemplo con los cursos de la planilla del área, el equipo con sus emojis y
// gente en acción y esperando. También le avisa a la página de afuera en qué
// vista está, para que lo diga arriba de cada pantalla.
const EJEMPLO = `<script>
(function () {
  var listo = function () { return typeof state !== "undefined" && state.ready; };
  var entrar = setInterval(function () {
    var gate = document.getElementById("gate"), mail = document.getElementById("gateMail");
    if (!gate || !mail || gate.classList.contains("hidden")) return;
    clearInterval(entrar);
    mail.value = "dami@coto.com.ar";
    document.getElementById("gatePassInput").value = "demo";
    var b = Array.prototype.find.call(document.querySelectorAll("#gate button"), function (x) { return /Entrar/.test(x.textContent); });
    if (b) b.click();
  }, 150);
  var sembrar = setInterval(function () {
    if (!listo()) return;
    clearInterval(sembrar);
    if (!localStorage.getItem("revision.sembrado.v1")) {
      var F = [
        ["Uso de Sucursales 3", "no-alimentos", "finalizado", ["gasti", "flor"], "", ""],
        ["Seguridad alimentaria", "control-de-calidad", "finalizado", ["gasti", "flor"], "", ""],
        ["Seguridad de la información", "sistemas", "finalizado", ["flor", "gasti"], "", ""],
        ["Cardiovascular", "servicio-medico", "finalizado", ["gasti", "flor"], "", ""],
        ["Surtido sin Venta", "salon", "en-revision", ["dami", "gasti"], "Esperar ok del sector → publicar masivo", "Sebastián Jaime"],
        ["Pedidos de PLU set a Compras", "no-alimentos", "en-revision", ["dami", "flor"], "Esperar ok del sector → publicar masivo", "Gustavo"],
        ["Impresión de obleas de precios", "salon", "con-claude", ["dami"], "Pasarlo por Claude → armar el curso", ""],
        ["Hábitos saludables", "servicio-medico", "diseno-listo", ["gasti", "flor", "vane"], "Exportar en el nuevo formato → armar con Claude → publicar", "Silvana Tucker", true],
        ["Sistema de Liquidación", "no-alimentos", "diseno-listo", ["gasti", "dami"], "Esperar ok del PDF → exportar → armar con Claude → publicar", "Gustavo"],
        ["Conociendo al cliente", "atencion-al-cliente", "en-desarrollo", ["vane", "gasti"], "Actualización al diseño nuevo", ""],
        ["Prevención de LA/FT/FP", "tci", "en-desarrollo", ["vane"], "Actualización del curso", ""],
        ["Código de Ética", "recursos-humanos", "en-desarrollo", ["vane", "flor"], "", ""],
        ["Mantenimiento de Ulma", "mantenimiento", "stand-by", ["flor"], "En pausa", ""],
        ["Elaboración de Facturas", "elaborados", "pendiente", ["flor", "dami"], "Armar contenido base", ""],
        ["Elaboración de Empanadas", "elaborados", "pendiente", ["flor"], "Armar contenido base", ""]
      ];
      state.cards = state.cards.filter(function (c) { return isInventory(c); });
      F.forEach(function (f) {
        var t = newCard("curso", f[0], { estado: f[2], sectores: [f[1]] });
        t.responsable = f[3][0]; t.asignados = f[3].slice(1);
        t.proximoPaso = f[4]; t.aprobacion = f[5]; t.aprobado = !!f[6]; t.checklist = [];
        state.cards.push(t);
      });
      var em = { vivi: "🦉", dami: "🦊", vane: "🌵", eve: "🎬", flor: "🌸", gasti: "🎮" };
      Object.keys(em).forEach(function (id) {
        var m = member(id); if (!m) return;
        if (id === "dami") m.email = "dami@coto.com.ar";
        state.perfiles[id] = { emoji: em[id], nombre: m.nombre, ts: 1 };
      });
      aplicarPerfiles();
      // Un par de mensajes para que el chat no arranque vacío.
      var ahora = Date.now();
      if (typeof CHAT_FILA !== "undefined")
        Store.save({ mensajes: [
          { id: "ej-1", autor: "flor", nombre: "Flor", texto: "Terminé el contenido de Hábitos saludables, ya se lo pasé a Gasti 🙌", ts: ahora - 3600000 },
          { id: "ej-2", autor: "gasti", nombre: "Gasti", texto: "Genial, lo tengo en acción. Mañana exporto.", ts: ahora - 3500000 },
          { id: "ej-3", autor: "vane", nombre: "Vane", texto: "¿Alguien revisa Código de Ética cuando pueda?", ts: ahora - 600000 }
        ] }, false, CHAT_FILA).catch(function () {});
      state.mailSinEquipo = "";
      enterAs("Dami", "dami");
      touch();
      try { localStorage.setItem("revision.sembrado.v1", "1"); } catch (e) {}
      state.view = "plannerb";
      render();
      if (typeof showBanner === "function") showBanner();
    }
    // En el marco de "Ver como" arranca en la vista que se estaba mirando.
    var pedida = (location.search.match(/[?&]vista=([^&]+)/) || [])[1];
    if (pedida) { state.view = decodeURIComponent(pedida); render(); }
    // Ya hay tablero: las otras pantallas pueden arrancar sin pisarse.
    try { parent.postMessage({ revision: "listo" }, "*"); } catch (e) {}
    var vista = "";
    setInterval(function () {
      if (state.view !== vista) {
        vista = state.view;
        var t = (document.querySelector(".tab.active") || {}).textContent || vista;
        try { parent.postMessage({ revision: "vista", vista: String(t).trim() }, "*"); } catch (e) {}
      }
    }, 400);
  }, 200);
})();
</script>`;

let html = await readFile(new URL("index.html", raiz), "utf8");
if (/lhxngngmrsanlyqbsvcw|sb_secret_/.test(BASE_FALSA + EJEMPLO)) throw new Error("La vista no puede nombrar la base real.");
html = html.replace(/supabaseUrl: "[^"]*"/, 'supabaseUrl: "https://revision-sin-base.supabase.co"');
// Se corta por las etiquetas de verdad, que van solas en su renglón: el CSS y
// el JS de la app nombran "<body>" en algún comentario.
const finCabeza = html.indexOf("\n</head>\n<body>\n"),
  finCuerpo = html.lastIndexOf("\n</body>"),
  cabeza = finCabeza > 0 ? html.slice(html.indexOf("<head>") + 6, finCabeza) : "",
  cuerpo = finCabeza > 0 && finCuerpo > finCabeza ? html.slice(finCabeza + "\n</head>\n<body>\n".length, finCuerpo) : "";
if (!cabeza || !cuerpo) throw new Error("index.html no tiene <head> o <body>: ¿corriste node build.mjs?");
const estilos = (cabeza.match(/<style>[\s\S]*?<\/style>/g) || []).join("\n");
if (!estilos) throw new Error("No encontré los estilos de la app en index.html.");

// La app sola, para el marco de "Ver como".
const marco = html.replace("<head>", "<head>\n" + BASE_FALSA).replace(/<\/body>(?![\s\S]*<\/body>)/, EJEMPLO + "\n</body>");

// La página del artefacto: sin doctype/html/head/body (el visor la envuelve).
// La app lee atributos de <html> (idioma y tema): se los devuelve un script
// antes de que arranque.
const pagina =
  "<title>Cotonetes Forever · Editor en vivo</title>\n" +
  estilos +
  '\n<link rel="stylesheet" href="editor-vivo.css">\n' +
  '<script>document.documentElement.lang = "es"; if (!document.documentElement.getAttribute("data-theme")) document.documentElement.setAttribute("data-theme", "light");</script>\n' +
  BASE_FALSA +
  "\n" +
  cuerpo +
  "\n" +
  EJEMPLO +
  '\n<script src="editor-vivo.js"></script>\n';

await mkdir(salida + "/assets", { recursive: true });
await writeFile(salida + "/pagina.html", pagina);
await writeFile(salida + "/marco.html", marco);
await cp(new URL("scripts/editor-vivo/editor-vivo.css", raiz), salida + "/editor-vivo.css");
await cp(new URL("scripts/editor-vivo/editor-vivo.js", raiz), salida + "/editor-vivo.js");
await cp(new URL("assets/cursos", raiz), salida + "/assets/cursos", { recursive: true });
const archivos = { "marco.html": "marco.html", "editor-vivo.css": "editor-vivo.css", "editor-vivo.js": "editor-vivo.js" };
(await readdir(salida + "/assets/cursos")).sort().forEach((n) => (archivos["assets/cursos/" + n] = "assets/cursos/" + n));
await writeFile(salida + "/archivos.json", JSON.stringify(archivos, null, 1));
console.log("Vista del editor lista en " + salida + " · " + Object.keys(archivos).length + " archivos aparte · página " + Math.round(pagina.length / 1024) + " KB");
