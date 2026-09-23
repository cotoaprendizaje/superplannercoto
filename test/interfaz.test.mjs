// Lo que se rompe al usarla, no al leerla.
//
// Las tres cosas de acá las encontró el área usando la app, no una prueba:
//
//  - El buscador del tablero dejaba escribir una letra por vez. Re-renderizaba
//    la vista entera en cada tecla, el <input> enfocado dejaba de existir y
//    nacía uno nuevo: había que volver a hacer clic para la segunda letra.
//  - Con "Mis tareas" puesto, una tarjeta nueva no aparecía. Nacía sin
//    responsable, así que el propio filtro que la persona tenía puesto la
//    escondía. Parecía que no se había creado.
//  - Reiniciar la ronda de CotoFrases obligaba a pedirlo y esperar un deploy.
//
// Ninguna de las tres rompe un número ni pierde un dato, así que ninguna de
// las otras baterías las iba a ver nunca. Por eso esta.

import { chromium } from "playwright";
import { rutaChromium } from "./navegador.mjs";
import { startFakeBackend } from "./fake-backend.mjs";

const CLAVE = "Cotonetes2026";
const resultados = [];
const check = (nombre, ok, extra) => {
  (resultados.push({ nombre, ok }),
    console.log(`${ok ? "  ok  " : " FALLA"} ${nombre}`),
    !ok && extra !== undefined && console.log("        ", JSON.stringify(extra).slice(0, 300)));
};

const backend = await startFakeBackend(8477);
const browser = await chromium.launch({ executablePath: rutaChromium() });
const page = await browser.newPage({ serviceWorkers: "block", viewport: { width: 1400, height: 950 } });
page.on("pageerror", (e) => console.log("  [interfaz] error de página:", e.message));
await page.route("**://*.supabase.co/**", async (route) => {
  const req = route.request(),
    { pathname, search } = new URL(req.url()),
    up = await fetch(backend.url + pathname + search, {
      method: req.method(),
      headers: { "Content-Type": "application/json", authorization: req.headers()["authorization"] || "" },
      body: req.method() === "POST" ? req.postData() : undefined,
    });
  route.fulfill({
    status: up.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: await up.text(),
  });
});
await page.goto(backend.url + "/index.html");
await page.waitForSelector("#gateMail");
await page.fill("#gateMail", "dami@coto.com.ar");
await page.fill("#gatePassInput", CLAVE);
await page.click('#gate button:has-text("Entrar")');
await page.waitForFunction(() => state?.ready === true, { timeout: 30000 });
await page.waitForTimeout(1200);

// Un tablero con algo adentro y una persona reconocida.
await page.evaluate(() => {
  const v = TEAM[0];
  if (v) ((v.email = "dami@coto.com.ar"), (state.user = v.nombre), (state.userId = v.id), (v.admin = true));
  ["Guion de seguridad", "Video de bienvenida", "Curso de cajas"].forEach((t) => {
    const c = newCard("libre", t, {});
    ((c.estado = "pendiente"), state.cards.push(c));
  });
  ((state.view = "kanban"), (state.mis = false), (state.filters.texto = ""), render());
});
await page.waitForTimeout(700);

// ── El buscador del tablero ───────────────────────────────────────────────
console.log("\nel buscador del tablero");
await page.click('[data-filter="texto"]');
// Se escribe como escribe una persona: tecla por tecla, sin volver a hacer clic.
await page.keyboard.type("seguridad", { delay: 60 });
await page.waitForTimeout(600);
const buscador = await page.evaluate(() => {
  const el = document.querySelector('[data-filter="texto"]');
  return {
    escrito: el.value,
    sigueEnfocado: document.activeElement === el,
    cursor: el.selectionStart,
    enPantalla: [...document.querySelectorAll(".kcard-title")].map((t) => t.textContent.trim()),
  };
});
(check("se puede escribir de corrido, sin volver a hacer clic", buscador.escrito === "seguridad", buscador),
  check("el foco se queda en el buscador", buscador.sigueEnfocado === true, buscador),
  check("y el cursor queda al final, no al principio", buscador.cursor === 9, buscador),
  check(
    "y filtra de verdad",
    buscador.enPantalla.length === 1 && /seguridad/i.test(buscador.enPantalla[0]),
    buscador,
  ));

// ── Crear con "Mis tareas" puesto ─────────────────────────────────────────
console.log("\ncrear una tarjeta con “Mis tareas” puesto");
await page.evaluate(() => {
  ((state.filters.texto = ""), (state.mis = true), render());
});
await page.waitForTimeout(600);
await page.click('[data-quickadd="pendiente"]');
await page.keyboard.type("TAREA NUEVA CON EL FILTRO PUESTO", { delay: 10 });
await page.keyboard.press("Enter");
await page.waitForTimeout(800);
const creada = await page.evaluate(() => {
  const t = state.cards.find((c) => c.titulo === "TAREA NUEVA CON EL FILTRO PUESTO");
  return {
    existe: !!t,
    responsable: t && t.responsable,
    yo: state.userId,
    seVe: [...document.querySelectorAll(".kcard-title")].some((x) =>
      /TAREA NUEVA CON EL FILTRO PUESTO/.test(x.textContent),
    ),
  };
});
(check("la tarjeta se crea", creada.existe === true, creada),
  check("se ve en el tablero en el momento, no después", creada.seVe === true, creada),
  check("y queda asignada a quien la creó", creada.responsable === creada.yo, creada));

// Con el filtro apagado sigue naciendo sin dueño, como siempre.
await page.evaluate(() => {
  ((state.mis = false), render());
});
await page.waitForTimeout(500);
await page.click('[data-quickadd="pendiente"]');
await page.keyboard.type("TAREA SIN FILTRO", { delay: 10 });
await page.keyboard.press("Enter");
await page.waitForTimeout(700);
const sinFiltro = await page.evaluate(() => {
  const t = state.cards.find((c) => c.titulo === "TAREA SIN FILTRO");
  return { responsable: t && t.responsable };
});
check(
  "sin el filtro puesto, una tarjeta nueva no se asigna sola",
  !sinFiltro.responsable,
  sinFiltro,
);

// ── Los mensajes del equipo en la tarjeta ─────────────────────────────────
//
// El equipo pidió dejarse mensajes entre compañeras dentro de cada tarjeta:
// que se vea quién escribió, que quede el historial, y que no se coma el
// panel. Antes existían, pero mezclados con el registro del sistema en un
// acordeón al final: para leer un mensaje había que pasar por veinte líneas
// de "movida a En revisión".
console.log("\nlos mensajes de la tarjeta");
const idTarjeta = await page.evaluate(() => {
  const c = newCard("libre", "TARJETA CON CONVERSACIÓN", {});
  const hs = (n) => Date.now() - n * 3600000;
  // Con 15 mensajes se pasa el tope de los que se ven de una (12) y aparece el
  // "ver los anteriores". Dos seguidos de la misma persona con un minuto de
  // diferencia para probar el agrupado, y uno de hace dos días para el
  // separador de día.
  c.comentarios = [
    { id: "m0", autor: (TEAM[1] || TEAM[0]).nombre, texto: "viejo de hace dos días", ts: hs(50) },
  ];
  for (let i = 1; i <= 11; i++)
    c.comentarios.push({ id: "r" + i, autor: (TEAM[2] || TEAM[0]).nombre, texto: "relleno " + i, ts: hs(20) + i * 60000 });
  c.comentarios.push(
    { id: "m2", autor: (TEAM[1] || TEAM[0]).nombre, texto: "dos", ts: hs(3) },
    { id: "m3", autor: (TEAM[1] || TEAM[0]).nombre, texto: "tres, pegadito al anterior", ts: hs(3) + 60000 },
    { id: "m4", autor: TEAM[0].nombre, texto: "cuatro, este es mío", ts: hs(1) },
  );
  ((c.actividad = [{ ts: hs(60), autor: "Vivi", texto: "creada" }]), state.cards.push(c), render());
  return c.id;
});
await page.evaluate((i) => openDetail(i), idTarjeta);
await page.waitForTimeout(700);
const sec = await page.evaluate(() => {
  const s = document.querySelector('[data-acc="mensajes"]'),
    orden = [...document.querySelectorAll("#panel details[data-acc]")].map((d) => d.dataset.acc),
    hilo = document.querySelector("#msgHilo"),
    globos = [...document.querySelectorAll("#panel .msg")];
  return {
    existe: !!s,
    abierta: !!(s && s.open),
    justoDespuesDeDatos: orden[0] === "datos" && orden[1] === "mensajes",
    titulo: s ? s.querySelector("summary").textContent.replace(/\s+/g, " ").trim() : "",
    aLaVista: globos.length,
    mios: document.querySelectorAll("#panel .msg.mio").length,
    pegados: document.querySelectorAll("#panel .msg.pegado").length,
    dias: [...document.querySelectorAll("#panel .msg-dia span")].map((d) => d.textContent),
    horas: [...document.querySelectorAll("#panel .msg-hora")].map((h) => h.textContent),
    conAvatar: document.querySelectorAll("#panel .msg .avatar:not(.hueco)").length,
    autores: [...document.querySelectorAll("#panel .msg-quien")].map((b) => b.textContent),
    botonMas: (document.querySelector(".msg-mas") || {}).textContent || "",
    // El hilo tiene alto propio y scrollea: los mensajes no se comen la
    // tarjeta entera aunque sean cien.
    scrollea: !!hilo && hilo.scrollHeight > hilo.clientHeight,
    arrancaAbajo: !!hilo && hilo.scrollTop + hilo.clientHeight >= hilo.scrollHeight - 2,
    // Del más viejo al más nuevo, como se lee una conversación.
    primero: (globos[0].querySelector(".msg-t") || {}).textContent.trim(),
    ultimo: (globos[globos.length - 1].querySelector(".msg-t") || {}).textContent.trim(),
  };
});
(check("hay una sección de mensajes propia y abierta", sec.existe && sec.abierta, sec),
  check("y está arriba, pegada a Datos", sec.justoDespuesDeDatos === true, sec),
  check("el título dice cuántos hay", /Mensajes · 15/.test(sec.titulo), sec),
  check("muestra los últimos 12, no los 15", sec.aLaVista === 12, sec),
  check("y ofrece ver los anteriores", /Ver los 3 anteriores/.test(sec.botonMas), sec),
  check("se leen del más viejo al más nuevo, como un chat", sec.ultimo === "cuatro, este es mío", sec),
  check("el mío va de mi lado", sec.mios === 1, sec),
  check("dos seguidos de la misma persona se agrupan", sec.pegados >= 1, sec),
  check("el nombre no se repite en los agrupados", sec.autores.length < sec.aLaVista, sec),
  check("cada globo lleva la hora adentro, en 24 h", sec.horas.length === sec.aLaVista && /^\d{2}:\d{2}$/.test(sec.horas[0]), sec),
  check("hay separadores de día", sec.dias.length >= 1 && sec.dias.includes("Hoy"), sec),
  check("con la cara de quien escribió al lado", sec.conAvatar > 0, sec),
  check("el hilo tiene alto propio y scrollea", sec.scrollea === true, sec),
  check("y arranca abajo, en el último mensaje", sec.arrancaAbajo === true, sec));

await page.click(".msg-mas");
await page.waitForTimeout(400);
check(
  "al desplegar aparecen los quince",
  (await page.evaluate(() => document.querySelectorAll("#panel .msg").length)) === 15,
);

// Escribir uno, con el atajo.
await page.click("#cmtInput");
await page.keyboard.type("MENSAJE DE PRUEBA");
await page.keyboard.press("Control+Enter");
await page.waitForTimeout(700);
const tras = await page.evaluate(() => {
  const c = state.cards.find((x) => x.titulo === "TARJETA CON CONVERSACIÓN"),
    globos = [...document.querySelectorAll("#panel .msg")],
    hilo = document.querySelector("#msgHilo");
  return {
    guardados: c.comentarios.length,
    autorDelUltimo: c.comentarios[c.comentarios.length - 1].autor,
    yo: state.user,
    ultimoEnPantalla: (globos[globos.length - 1].querySelector(".msg-t") || {}).textContent.trim(),
    esMio: globos[globos.length - 1].classList.contains("mio"),
    alFinal: !!hilo && hilo.scrollTop + hilo.clientHeight >= hilo.scrollHeight - 2,
    actividad: (document.querySelector('[data-acc="actividad"]') || {}).textContent || "",
  };
});
(check("Ctrl+Enter envía el mensaje", tras.guardados === 16, tras),
  check("queda firmado con quien lo escribió", tras.autorDelUltimo === tras.yo, tras),
  check("aparece último, que es donde mira el hilo", tras.ultimoEnPantalla === "MENSAJE DE PRUEBA", tras),
  check("y de mi lado", tras.esMio === true, tras),
  check("el hilo baja solo al mensaje recién escrito", tras.alFinal === true, tras),
  check("y no ensucia Actividad con un «comentó»", !/comentó/i.test(tras.actividad), tras));

// Abrir otra tarjeta no arrastra el «ver anteriores» de la anterior.
await page.evaluate(() => {
  const c = newCard("libre", "OTRA TARJETA", {});
  (state.cards.push(c), render(), openDetail(c.id));
});
await page.waitForTimeout(500);
await page.evaluate((i) => openDetail(i), idTarjeta);
await page.waitForTimeout(500);
check(
  "cambiar de tarjeta reinicia el desplegado",
  (await page.evaluate(() => document.querySelectorAll("#panel .msg").length)) === 12,
);

// ── Publicar deja la tarjeta en Finalizados, de ahora en adelante ─────────
console.log("\npublicar sin que la tarjeta desaparezca");
const fin = await page.evaluate(() => {
  // Un curso ya publicado ANTES del cambio: no lleva la marca.
  const viejo = newCard("curso", "CURSO YA PUBLICADO DE ANTES", {});
  ((viejo.publicado = true), (viejo.publicadoEl = "2026-03-10"), (viejo.estado = "finalizado"));
  // Uno que se va a publicar ahora.
  const nuevo = newCard("curso", "CURSO QUE SE PUBLICA AHORA", {});
  nuevo.estado = "en-revision";
  (state.cards.push(viejo, nuevo), (state.view = "kanban"), (state.mis = false), (state.filters = {}), render());
  const antes = kanbanCards().some((c) => c.id === nuevo.id);
  (openDetail(nuevo.id), document.querySelector('[data-action="curso:publicar"]').click());
  const d = state.cards.find((c) => c.id === nuevo.id);
  return {
    antes,
    publicado: d.publicado,
    estado: d.estado,
    sigueEnElTablero: kanbanCards().some((c) => c.id === nuevo.id),
    // El de antes se queda afuera: "de ahora en adelante" no arrastra los 90
    // cursos que ya estaban publicados.
    elViejoNoVuelve: !kanbanCards().some((c) => c.id === viejo.id),
    // Calendario y Timeline no se llenan de cursos publicados.
    fueraDelCalendario: !filteredBoard().some((c) => c.id === nuevo.id),
  };
});
(check("publicar deja la tarjeta en Finalizados", fin.publicado === true && fin.estado === "finalizado", fin),
  check("y la tarjeta sigue en el tablero, no desaparece", fin.sigueEnElTablero === true, fin),
  check("un curso publicado de antes no vuelve al tablero", fin.elViejoNoVuelve === true, fin),
  check("Calendario y Timeline siguen sin los publicados", fin.fueraDelCalendario === true, fin));
// Se vuelve a la tarjeta de la conversación: lo que sigue mira ese panel.
await page.evaluate((i) => openDetail(i), idTarjeta);
await page.waitForTimeout(500);

// ── Mover una tarjeta de columna sin arrastrar ────────────────────────────
console.log("\nmover de columna sin arrastrar");
const qe = await page.evaluate(async () => {
  const c = newCard("libre", "TARJETA QUE SE MUEVE", {});
  ((c.estado = "pendiente"), state.cards.push(c), (state.view = "kanban"), (state.mis = false), (state.filters = {}), render());
  openQEdit(c.id);
  const hayColumna = !!document.querySelector("#qeEstado");
  const sel = document.querySelector("#qeEstado");
  if (sel) ((sel.value = "en-revision"), document.querySelector('[data-action="qedit:save"]').click());
  const d = state.cards.find((x) => x.id === c.id);
  return {
    hayColumna,
    estado: d.estado,
    // El mismo registro que deja arrastrar: queda anotado y se sella la fecha.
    anotado: (d.actividad || []).some((a) => /revisi/i.test(a.texto)),
    selloRevision: !!d.revisionDesde,
  };
});
(check("la edición rápida deja elegir la columna", qe.hayColumna === true, qe),
  check("y mover la tarjeta sin arrastrarla", qe.estado === "en-revision", qe),
  check("queda anotado en Actividad, igual que al arrastrar", qe.anotado === true, qe),
  check("y sella desde cuándo está en revisión", qe.selloRevision === true, qe));
await page.evaluate((i) => openDetail(i), idTarjeta);
await page.waitForTimeout(400);

// ── El panel: escala, encabezados y lo que faltaba ────────────────────────
console.log("\nel panel de la tarjeta");
const panel = await page.evaluate(() => {
  const px = (sel, prop) => {
    const el = document.querySelector(sel);
    return el ? Math.round(parseFloat(getComputedStyle(el)[prop])) : 0;
  };
  return {
    // El encabezado de sección era el texto MÁS chico del panel (10.5px).
    encabezado: px("#panel .sub", "fontSize"),
    campo: px("#panel .fld input", "fontSize"),
    chipFecha: px("#panel .dp-btn", "height"),
    flecha: px("#panel .acc-ar", "width"),
    // Los presets salen del recorrido del Tab: un campo de fecha ya tiene tres
    // paradas propias y con los presets hacían falta diez Tab para cruzar Datos.
    presetsFueraDelTab: [...document.querySelectorAll("#panel .dp-btn")].every((b) => b.tabIndex === -1),
    hayResponsable: !!document.querySelector('#panel [data-field="responsable"]'),
    // El panel guarda solo y lo dice arriba: el botón era una promesa de que
    // sin tocarlo se perdía algo.
    sinBotonGuardar: !document.querySelector('#panel [data-action="card:save"]'),
    // Estado, fecha y responsable pegados arriba mientras se scrollea.
    contextoFijo: getComputedStyle(document.querySelector("#panel .panel-ctx")).position === "sticky",
    avisoSinFecha: !!document.querySelector("#panel .aviso-sinfecha"),
  };
});
(check("el encabezado de sección dejó de ser el texto más chico", panel.encabezado >= 12, panel),
  check("los campos se leen de lejos", panel.campo >= 14, panel),
  check("«Hoy / Mañana / +1 semana» se pueden tocar", panel.chipFecha >= 30, panel),
  check("y la flecha de abrir/cerrar también", panel.flecha >= 32, panel),
  check("los presets no se meten en el camino del Tab", panel.presetsFueraDelTab === true, panel),
  check("se puede poner responsable sin ser una misma", panel.hayResponsable === true, panel),
  check("no está más el botón Guardar", panel.sinBotonGuardar === true, panel),
  check("estado, fecha y responsable quedan fijos al scrollear", panel.contextoFijo === true, panel),
  check("y avisa que sin fecha de fin no se ve en Calendario ni Timeline", panel.avisoSinFecha === true, panel));

// Tocar el encabezado de una sección cerrada la abre; tocarlo con la sección
// abierta NO la cierra (eso es tarea de la flechita).
await page.evaluate(() => (document.querySelector('#panel details[data-acc="checklist"]').open = false));
await page.click('#panel details[data-acc="checklist"] > summary');
await page.waitForTimeout(300);
check(
  "tocar «Checklist» abre el checklist",
  await page.evaluate(() => document.querySelector('#panel details[data-acc="checklist"]').open === true),
);
await page.click('#panel details[data-acc="checklist"] > summary');
await page.waitForTimeout(300);
check(
  "y un segundo clic no lo cierra de casualidad",
  await page.evaluate(() => document.querySelector('#panel details[data-acc="checklist"]').open === true),
);
await page.click('#panel details[data-acc="checklist"] > summary .acc-ar');
await page.waitForTimeout(300);
check(
  "para cerrarlo está la flechita",
  await page.evaluate(() => document.querySelector('#panel details[data-acc="checklist"]').open === false),
);

// Anterior / siguiente sin cerrar el panel.
const nav = await page.evaluate(() => {
  ((state.view = "kanban"), (state.filters.texto = ""), (state.mis = false), render());
  const lista = filteredBoard();
  openDetail(lista[0].id);
  const antes = state.selectedId;
  panelMover(1);
  const despues = state.selectedId;
  return { lista: lista.length, antes, despues, hayFlechas: !!document.querySelector(".panel-nav") };
});
(check("el panel tiene anterior/siguiente", nav.hayFlechas === true, nav),
  check("y pasa a la tarjeta de al lado sin cerrarse", nav.antes !== nav.despues, nav));
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// ── Reiniciar las CotoFrases desde Ajustes ────────────────────────────────
console.log("\nreiniciar las CotoFrases desde Ajustes");
await page.evaluate(() => {
  (ensureFraseDay(), (state.cotofrase.porUsuario = { Ana: "una frase", Beto: "otra frase" }), touch());
  openSettings("datos");
});
await page.waitForTimeout(700);
const antes = await page.evaluate(() => ({
  hayBoton: !!document.querySelector('[data-action="data:frases-reset"]'),
  dice: (document.querySelector(".set-seg b") || {}).textContent,
  cuenta: Object.keys(state.cotofrase.porUsuario).length,
}));
(check("el botón está en Ajustes → Datos", antes.hayBoton === true, antes),
  check("y antes de tocarlo hay frases tiradas", antes.cuenta === 2, antes));

await page.click('[data-action="data:frases-reset"]');
await page.waitForTimeout(400);
await page.click('[data-action="confirm:yes"]');
await page.waitForTimeout(900);
const despues = await page.evaluate(() => ({
  cuenta: Object.keys(state.cotofrase.porUsuario).length,
  dia: state.cotofrase.day,
  hoy: isoOf(new Date()),
  version: state.cotofrase.v,
  versionDelCodigo: FRASES_V,
  // Lo que importa: que el widget vuelva a estar jugable.
  jugable: !/slot-widget locked/.test(slotWidgetHTML()),
}));
(check("reiniciar deja la ronda de hoy vacía", despues.cuenta === 0, despues),
  check("sin perder el día ni la versión de la lista", despues.dia === despues.hoy && despues.version === despues.versionDelCodigo, despues),
  check("y la máquina vuelve a estar jugable", despues.jugable === true, despues));

// Y no se llevó puesto el tablero.
const tablero = await page.evaluate(() => state.cards.length);
check("reiniciar las frases no toca las tarjetas", tablero > 3, { tarjetas: tablero });

// ── Técnico: las pestañas y los filtros por columna ───────────────────────
console.log("\nSeguimiento técnico");
await page.evaluate(() => {
  (closeModal(), (state.view = "tecnico"), (state.tecSubView = "grilla"), (state.tecColFiltros = {}), (state.tecFiltro = ""), render());
});
await page.waitForTimeout(500);
const pestanas = await page.evaluate(() => [...document.querySelectorAll(".mapa-sec")].map((s) => s.textContent.trim()));
(check("la pestaña Validación ya no está en la navegación", !pestanas.some((t) => /Validaci/i.test(t)), pestanas),
  check("y está la de Métodos de matriculación", pestanas.some((t) => /matriculaci/i.test(t)), pestanas));

// Técnico dejó de ser una planilla incrustada: cada curso es una tarjeta de
// la página, como las del Mapa, y no queda ni una tabla ni scroll de costado.
const lista = await page.evaluate(() => ({
  tablas: document.querySelectorAll(".tec-table, .tec-table-wrap").length,
  tarjetas: document.querySelectorAll(".tct").length,
  filas: tecRows().length,
  anchoPagina: document.documentElement.scrollWidth,
  ventana: window.innerWidth,
}));
(check("Técnico ya no dibuja ninguna tabla", lista.tablas === 0, lista),
  check("cada curso es una tarjeta", lista.tarjetas === lista.filas && lista.tarjetas > 0, lista),
  check("y la página no se va de ancho", lista.anchoPagina <= lista.ventana + 1, lista));

// Los embudos de columna sobrevivieron a la tabla: ahora cuelgan de una barra
// propia, donde se ven los doce de una en vez de a la derecha del borde.
const barra = await page.evaluate(() => ({
  embudos: [...document.querySelectorAll('.tbar-f[data-action="tec:filtcol"]')].map((b) => b.dataset.campo),
  ordenar: !!document.querySelector('.tbar-sel[data-action="tec:orden-sel"]'),
}));
(check("los embudos de columna siguen estando, ahora en su propia barra", barra.embudos.includes("diseno") && barra.embudos.length >= 8, barra),
  check("y el orden se elige de un desplegable", barra.ordenar === true, barra));

// Una tarjeta cerrada ya contesta sola cómo viene el curso: no hay que
// abrirla para ver las piezas ni la línea de fechas.
const cerrada = await page.evaluate(() => {
  const t = document.querySelector(".tct");
  return {
    nombre: !!t.querySelector(".tct-n"),
    piezas: t.querySelectorAll(".tct-pz .tpz").length === 4,
    fechas: t.querySelectorAll(".tct-lin .tlin-paso").length,
    cuerpo: !!t.querySelector(".tct-cuerpo"),
  };
});
(check("el renglón cerrado muestra nombre, las cuatro piezas y las dos fechas", cerrada.nombre && cerrada.piezas && cerrada.fechas === 2, cerrada),
  check("y no despliega la ficha hasta que se la abre", cerrada.cuerpo === false, cerrada));

// Abrirla la estira al ancho completo con todos los campos adentro.
await page.click(".tct .tct-b");
await page.waitForTimeout(350);
const fichaAbierta = await page.evaluate(() => {
  const t = document.querySelector(".tct.abierta");
  if (!t) return { sinAbrir: true };
  return {
    abiertas: document.querySelectorAll(".tct.abierta").length,
    curso: !!t.querySelector('[data-tec-field="curso"]'),
    categoria: !!t.querySelector('[data-tec-field="categoria"]'),
    fechas: t.querySelectorAll('.tct-cuerpo [data-tec-field="publicacion"], .tct-cuerpo [data-tec-field="scorm"]').length,
    piezas: t.querySelectorAll(".tct-cuerpo .falta-pz").length,
    borrar: !!t.querySelector('[data-action="tec:del"]'),
    ancha: Math.round(t.getBoundingClientRect().width) > Math.round(document.querySelector(".tgrid").getBoundingClientRect().width) - 8,
  };
});
(check("abrir una tarjeta la estira al ancho de la grilla", fichaAbierta.ancha === true, fichaAbierta),
  check("con el nombre, la categoría, las dos fechas y las piezas adentro", fichaAbierta.curso && fichaAbierta.categoria && fichaAbierta.fechas === 2 && fichaAbierta.piezas === 4, fichaAbierta),
  check("y con dónde borrarla", fichaAbierta.borrar === true, fichaAbierta),
  check("solo una ficha abierta por vez", fichaAbierta.abiertas === 1, fichaAbierta));
await page.evaluate(() => ((state.tecAbierta = null), renderTecList()));
await page.waitForTimeout(250);

// Las cuatro piezas van dichas por su nombre y se tildan en el renglón: cuatro
// puntitos anónimos decían CUÁNTAS faltan pero no CUÁLES, y averiguarlo obligaba
// a abrir curso por curso.
const idPz = await page.evaluate(() => tecRows()[0].id);
await page.evaluate((id) => {
  const f = state.tecnico.find((x) => x.id === id);
  (TEC_CHKS.forEach((k) => (f[k] = false)), renderTecList());
}, idPz);
await page.waitForTimeout(300);
const piezasEnFila = await page.evaluate(
  (id) => [...document.querySelectorAll('.tct[data-tec-row="' + id + '"] .tpz')].map((l) => l.textContent.trim()),
  idPz,
);
check(
  "cada renglón nombra sus cuatro piezas, sin abrir nada",
  piezasEnFila.join("|") === "Portada|Mosaico|Evaluación|Textos",
  piezasEnFila,
);
for (const k of ["portada", "mosaico", "evaluacion", "textos"])
  await page.click('.tct[data-tec-row="' + idPz + '"] .tpz input[data-tec-field="' + k + '"]');
await page.waitForTimeout(450);
const trasTildar = await page.evaluate((id) => {
  const f = state.tecnico.find((x) => x.id === id),
    el = document.querySelector('.tct[data-tec-row="' + id + '"]');
  return {
    guardadas: ["portada", "mosaico", "evaluacion", "textos"].filter((k) => f[k]).length,
    cantoVerde: el.classList.contains("llena"),
    prendidas: el.querySelectorAll(".tpz.on").length,
    avance: (el.closest(".tcat").querySelector(".tec-cat-txt") || {}).textContent || "",
  };
}, idPz);
(check("tildarlas ahí mismo las guarda", trasTildar.guardadas === 4, trasTildar),
  check("el renglón completo se marca en el momento", trasTildar.cantoVerde === true && trasTildar.prendidas === 4, trasTildar),
  check("y el avance de la categoría deja de mentir", /1 completo/.test(trasTildar.avance), trasTildar));

// El orden dice campo Y sentido en la misma línea: antes el desplegable decía
// "Publicación" a secas y el sentido era un botón aparte que recién aparecía
// después de elegir, rotulado "A-Z" —que para una fecha no quiere decir nada—.
await page.selectOption('.tbar-sel[data-action="tec:orden-sel"]', "publicacion|-1");
await page.waitForTimeout(500);
const nuevasPrimero = await page.evaluate(() =>
  tecRows()
    .map((f) => f.publicacion)
    .filter(Boolean)
    .slice(0, 6),
);
check(
  "«de la más nueva a la más vieja» ordena de verdad",
  nuevasPrimero.every((v, i) => !i || nuevasPrimero[i - 1] >= v) && nuevasPrimero.length > 3,
  nuevasPrimero,
);
await page.selectOption('.tbar-sel[data-action="tec:orden-sel"]', "publicacion|1");
await page.waitForTimeout(500);
const viejasPrimero = await page.evaluate(() =>
  tecRows()
    .map((f) => f.publicacion)
    .filter(Boolean)
    .slice(0, 6),
);
(check(
  "y «de la más vieja a la más nueva» también",
  viejasPrimero.every((v, i) => !i || viejasPrimero[i - 1] <= v),
  viejasPrimero,
),
  check("son dos órdenes distintos, no el mismo", nuevasPrimero[0] !== viejasPrimero[0], {
    nuevasPrimero,
    viejasPrimero,
  }));
await page.selectOption('.tbar-sel[data-action="tec:orden-sel"]', "");
await page.waitForTimeout(400);
check(
  "y se vuelve al agrupado por categoría",
  await page.evaluate(() => !state.tecOrden && !!document.querySelector(".tcat")),
);

// Selección múltiple: poner "Portada hecha" en doce cursos eran doce clics en
// doce lugares distintos de la planilla. Marcadas las tarjetas, es uno.
await page.evaluate(() => ((state.tecSel = []), renderTecList()));
await page.waitForTimeout(250);
const tresIds = await page.evaluate(() => tecRows().slice(0, 3).map((f) => f.id));
for (const id of tresIds) await page.click('.tct[data-tec-row="' + id + '"] .tct-mk input');
await page.waitForTimeout(350);
const marcadas = await page.evaluate(() => ({
  enEstado: (state.tecSel || []).length,
  barra: (document.querySelector(".tsel-n") || {}).textContent || "",
  resaltadas: document.querySelectorAll(".tct.marcada").length,
}));
(check("marcar tarjetas arma la barra del lote", marcadas.enEstado === 3 && /3 cursos marcados/.test(marcadas.barra), marcadas),
  check("y las marcadas se ven marcadas", marcadas.resaltadas === 3, marcadas));

await page.click('.tsel [data-action="tec:selpieza"][data-campo="portada"][data-val="1"]');
await page.waitForTimeout(400);
const lotePieza = await page.evaluate((ids) => ({
  conPortada: ids.filter((id) => state.tecnico.find((f) => f.id === id).portada).length,
  otras: state.tecnico.filter((f) => !ids.includes(f.id) && f.portada).length,
}), tresIds);
check("el lote pone la pieza en las tres de una vez", lotePieza.conPortada === 3, lotePieza);

await page.click('.tsel [data-action="tec:selbaja"][data-val="si"]');
await page.waitForTimeout(400);
const loteBaja = await page.evaluate((ids) => ids.map((id) => state.tecnico.find((f) => f.id === id).baja), tresIds);
check("y las da de baja a las tres", loteBaja.every((b) => b === true), loteBaja);

await page.click('.tsel [data-action="tec:selclear"]');
await page.waitForTimeout(350);
const sinMarca = await page.evaluate(() => ({
  enEstado: (state.tecSel || []).length,
  barra: !!document.querySelector(".tsel"),
}));
(check("«Quitar la marca» limpia la selección", sinMarca.enEstado === 0, sinMarca),
  check("y la barra del lote deja de ocupar lugar", sinMarca.barra === false, sinMarca));
// Se devuelven a como estaban para no ensuciar lo que viene después.
await page.evaluate((ids) => {
  (ids.forEach((id) => {
    const f = state.tecnico.find((x) => x.id === id);
    ((f.portada = false), delete f.baja);
  }), renderTecList());
}, tresIds);
await page.waitForTimeout(250);

const antesFilas = await page.evaluate(() => tecRows().length);
await page.click('[data-action="tec:filtcol"][data-campo="diseno"]');
await page.waitForTimeout(400);
const embudo = await page.evaluate(() => ({
  abierto: !!document.querySelector("#tecFiltPop"),
  opciones: [...document.querySelectorAll("#tecFiltPop [data-tec-fv]")].map((c) => c.dataset.tecFv),
  cuentaHTML: +(document.querySelector('#tecFiltPop [data-tec-fv="HTML"]')?.closest(".tec-col-opt")?.querySelector(".tec-filt-n")?.textContent || 0),
}));
(check("el embudo de una columna se abre sin que lo cierre el scroll", embudo.abierto === true, embudo),
  check("y lista los valores que esa columna tiene de verdad", embudo.opciones.includes("HTML"), embudo),
  check("con cuántas filas tiene cada uno", embudo.cuentaHTML > 0, embudo));
await page.click('#tecFiltPop [data-tec-fv="HTML"]');
await page.waitForTimeout(400);
const filtrado = await page.evaluate(() => ({
  filas: tecRows().length,
  soloHTML: tecRows().every((f) => (f.diseno || "") === "HTML"),
  contador: document.querySelector("#tecTopN").textContent,
  sigueAbierto: !!document.querySelector("#tecFiltPop"),
}));
(check("marcar un valor filtra la tabla de verdad", filtrado.soloHTML === true && filtrado.filas < antesFilas, filtrado),
  check("el contador de arriba lo acompaña", filtrado.contador.startsWith(String(filtrado.filas)), filtrado),
  check("y el embudo no se cierra al marcar, para poder marcar varios", filtrado.sigueAbierto === true, filtrado));
await page.click('[data-action="tec:limpiar"]');
await page.waitForTimeout(400);
check(
  "«Limpiar filtros» también saca los de columna",
  await page.evaluate(() => Object.keys(state.tecColFiltros).length === 0 && tecRows().length === state.tecnico.length),
);

// Una fila que dice "Curso inutilizado" está dada de baja. La columna es texto
// libre, así que la app lo deduce de lo que escribió quien la cargó: las once
// filas del Centro de Distribución usaban esa palabra y se contaban activas.
const baja = await page.evaluate(() => ({
  inutilizado: tecEstadoSugiereBaja("Curso inutilizado"),
  mayusculas: tecEstadoSugiereBaja("CURSO INUTILIZADO"),
  dadoDeBaja: tecEstadoSugiereBaja("Dado de baja"),
  // Un comentario común no puede leerse como una baja.
  comentario: tecEstadoSugiereBaja("Falta portada audiovisual"),
  vacio: tecEstadoSugiereBaja(""),
}));
(check("«Curso inutilizado» cuenta como dado de baja", baja.inutilizado === true && baja.mayusculas === true, baja),
  check("y un comentario normal sigue contando como activo", baja.comentario === false && baja.vacio === false, baja));

// El estado dejó de adivinarse: se elige. El caso que lo obligó son dos cursos
// de Cajas que están de baja Y llevan la nota "Reemplazado por Medios de Pago"
// —"reemplazado" habla del contenido, no de si el curso sigue en Moodle, así
// que no puede ser una palabra de baja.
const estadoCol = await page.evaluate(() => {
  const f = state.tecnico[0];
  ((f.estado = "Reemplazado por Medios de Pago"), delete f.baja, render());
  const arrancaVigente = tecFilaActiva(f);
  applyTecField(f.id, "baja", "si");
  const trasElegir = { deBaja: !tecFilaActiva(f), comentario: f.estado, explicito: f.baja };
  // Y se puede volver atrás aunque el comentario diga otra cosa: gana la
  // elección de la persona, no el texto.
  const g = state.tecnico[1];
  ((g.estado = "Curso inutilizado"), delete g.baja);
  const adivinado = !tecFilaActiva(g);
  applyTecField(g.id, "baja", "no");
  return { arrancaVigente, trasElegir, adivinado, laEleccionGana: tecFilaActiva(g) };
});
(check("«reemplazado» no se lee como baja: es una nota de contenido", estadoCol.arrancaVigente === true, estadoCol),
  check("se puede marcar de baja sin perder el comentario", estadoCol.trasElegir.deBaja === true && estadoCol.trasElegir.comentario === "Reemplazado por Medios de Pago", estadoCol),
  check("una fila que nadie tocó se sigue leyendo del comentario", estadoCol.adivinado === true, estadoCol),
  check("pero lo que elige una persona le gana al texto", estadoCol.laEleccionGana === true, estadoCol));
await page.evaluate(() => {
  // se deja la grilla como estaba para lo que sigue
  (state.tecnico.forEach((f) => delete f.baja), render());
});
await page.waitForTimeout(300);

// ── Reportes: la franja que cuenta cómo viene el año ──────────────────────
console.log("\nReportes, más vivo");
const rep = await page.evaluate(() => {
  const iso = (d) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
  const a = newCard("libre", "SALE EN 3 DÍAS", {});
  ((a.estado = "en-desarrollo"), (a.fin = iso(3)));
  const b = newCard("libre", "SALE EN 10 DÍAS", {});
  ((b.estado = "en-revision"), (b.fin = iso(10)));
  // Una sin fecha: no puede figurar en «lo que está por salir», porque no se
  // sabe cuándo sale.
  const c = newCard("libre", "SIN FECHA", {});
  c.estado = "en-desarrollo";
  ((a.actividad = [{ ts: Date.now() - 86400000, autor: "Vivi", texto: "pasó a En desarrollo" }]),
    state.cards.push(a, b, c),
    (state.view = "reportes"),
    render());
  return {
    frases: repFrases().length,
    hayFranja: !!document.querySelector("#repFranja"),
    enPantalla: (document.querySelector(".rep-franja-txt") || {}).textContent || "",
    // Ordenadas por cuál sale primero, y la sin fecha afuera.
    vienen: repLoQueViene().map((x) => x.titulo),
    movidas: repMovidasSemana().length,
  };
});
(check("Reportes abre con una franja que dice cómo viene el año", rep.hayFranja === true, rep),
  check("con varias frases para rotar, no una sola", rep.frases >= 3, rep),
  check("«lo que está por salir» ordena por cuál cae primero", rep.vienen[0] === "SALE EN 3 DÍAS" && rep.vienen[1] === "SALE EN 10 DÍAS", rep),
  check("y deja afuera las que no tienen fecha", !rep.vienen.includes("SIN FECHA"), rep),
  check("cuenta lo que se movió esta semana, desde Actividad", rep.movidas >= 1, rep));

const paso = await page.evaluate(() => {
  const antes = (document.querySelector(".rep-franja-txt") || {}).textContent;
  document.querySelector('[data-action="rep:frase"][data-paso="1"]').click();
  return { antes, despues: (document.querySelector(".rep-franja-txt") || {}).textContent };
});
check("la flecha pasa a la frase siguiente", paso.antes !== paso.despues && !!paso.despues, paso);
await page.evaluate(() => ((state.view = "tecnico"), render()));
await page.waitForTimeout(300);

// Las piezas de cada curso y el avance de cada categoría: saber cómo viene un
// curso obligaba a mirar cuatro casillas en cuatro columnas distintas.
const sem = await page.evaluate(() => {
  ((state.tecSubView = "grilla"), (state.tecFiltro = ""), (state.tecColFiltros = {}), render());
  const f = state.tecnico[0];
  ((f.portada = true), (f.mosaico = true), (f.evaluacion = false), (f.textos = false), render());
  return {
    piezas: tecPiezas(f),
    puntos: document.querySelectorAll(".tct-pz .tpz").length,
    prendidos: document.querySelectorAll(".tct-pz .tpz.on").length,
    // El encabezado de categoría dice cómo viene, no solo cuántos hay.
    avance: (document.querySelector(".tec-cat-txt") || {}).textContent || "",
  };
});
(check("cada renglón lleva sus cuatro piezas", sem.puntos > 0 && sem.prendidos > 0, sem),
  check("que cuenta lo que está cargado de verdad", sem.piezas.hechas === 2 && sem.piezas.total === 4, sem),
  check("y cada categoría dice cuántos están completos", /completo/.test(sem.avance), sem));

// ── Revisión: todo lo suelto junto, y se arregla ahí mismo ────────────────
console.log("\nla pestaña Revisión");
const rev = await page.evaluate(() => {
  const c = newCard("libre", "TARJETA SIN FECHA DE FIN", {});
  ((c.estado = "en-desarrollo"), (c.fin = null), state.cards.push(c));
  ((state.view = "tecnico"), (state.tecSubView = "revision"), render());
  return {
    pestaña: [...document.querySelectorAll(".mapa-sec")].map((x) => x.textContent.trim()),
    // El número de la pestaña y el del encabezado salen del mismo lugar: si
    // cada uno contara por su cuenta, tarde o temprano dirían cosas distintas.
    total: valTotal(),
    enLaPestaña: +(document.querySelector('[data-v="revision"] b').textContent.match(/\d+/) || [0])[0],
    secciones: document.querySelectorAll(".rep-sec").length,
    // Las tarjetas sin fecha de fin se fueron de acá a Reportes: no eran un
    // dato mal cargado sino la causa de que "Lo que está por salir" salga
    // corta, y mezclarlas hacía que la pantalla nunca se vaciara.
    camposDeFecha: document.querySelectorAll("[data-val-fin]").length,
    id: c.id,
  };
});
(check("Revisión es una pestaña de Técnico, con el número de pendientes", rev.pestaña.some((t) => /Revisi/.test(t)), rev),
  check("y ese número es el mismo que cuenta el panel", rev.enLaPestaña === rev.total, rev),
  check("junta todo lo suelto en una sola pantalla", rev.secciones >= 4, rev),
  check("y las fechas de fin ya no se piden acá", rev.camposDeFecha === 0, rev));

// Las fechas de fin ahora se cargan donde se notan que faltan.
const enReportes = await page.evaluate((id) => {
  ((state.view = "reportes"), render());
  const det = document.querySelector("details.rep-sinfecha");
  if (det) det.open = true;
  const antes = valSinFecha().length,
    inp = document.querySelector('[data-val-fin="' + id + '"]');
  if (!inp) return { hay: false };
  ((inp.value = "2026-10-15"), inp.dispatchEvent(new Event("change", { bubbles: true })));
  return {
    hay: true,
    antes,
    despues: valSinFecha().length,
    guardada: state.cards.find((c) => c.id === id).fin,
    // Arreglada, desaparece de la lista: es lo que hace que se vacíe sola a
    // medida que se trabaja.
    sigueEnLaLista: !!document.querySelector('[data-val-fin="' + id + '"]'),
    // Y la lista se queda abierta, o habría que volver a desplegarla después
    // de cada una de las veinte fechas.
    sigueAbierta: !!(document.querySelector("details.rep-sinfecha") || {}).open,
  };
}, rev.id);
(check("las tarjetas sin fecha de fin se cargan desde Reportes", enReportes.hay, enReportes),
  check("poner la fecha ahí mismo la guarda en la tarjeta", enReportes.guardada === "2026-10-15", enReportes),
  check("y una menos en la lista", enReportes.despues === enReportes.antes - 1, enReportes),
  check("la arreglada desaparece", enReportes.sigueEnLaLista === false, enReportes),
  check("y la lista no se vuelve a plegar sola", enReportes.sigueAbierta === true, enReportes));

// ── Las dos mitades del mismo hueco ───────────────────────────────────────
console.log("\nfilas sin curso y cursos sin fila");
const huecos = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  const suelta = {
      id: "zz-suelta",
      curso: "ZZ Curso solo en Técnico",
      categoria: "ZZ Prueba",
      publicacion: "2023-04-05",
    },
    // Una fila de baja no necesita tarjeta en el Mapa: no tiene que figurar.
    deBaja = { id: "zz-baja", curso: "ZZ Curso viejo dado de baja", categoria: "ZZ Prueba", baja: true },
    // Una fila sin nombre real: figura, pero no se le puede crear un curso.
    sinNombre = { id: "zz-sinnombre", curso: " - ", categoria: "ZZ Prueba" };
  (state.tecnico.push(suelta, deBaja, sinNombre), parInvalidar(), (state.view = "tecnico"), (state.tecSubView = "revision"), render());
  const sueltas = valFilasSinCurso();
  return {
    apareceLaViva: sueltas.some((f) => f.id === "zz-suelta"),
    apareceLaDeBaja: sueltas.some((f) => f.id === "zz-baja"),
    // La acción que faltaba: antes solo se podía "vincular" con una tarjeta
    // que no existe, que era una vía muerta.
    hayCrearCurso: !!document.querySelector('[data-action="tec:crearcurso"]'),
    // Y explica en castellano qué es cada cosa y qué hacer.
    hayAyuda: document.querySelectorAll(".val-ayuda").length >= 2,
    // La fila sin nombre se ve, pero sin el botón de crear: una tarjeta
    // llamada "-" en el Mapa sería peor que el hueco.
    apareceSinNombre: sueltas.some((f) => f.id === "zz-sinnombre"),
    ofreceCrearSinNombre: !!document.querySelector('[data-action="tec:crearcurso"][data-id="zz-sinnombre"]'),
  };
});
(check("una fila de Técnico sin tarjeta figura como suelta", huecos.apareceLaViva, huecos),
  check("pero una dada de baja no: no le falta nada", huecos.apareceLaDeBaja === false, huecos),
  check("cada sección explica qué pasa y qué hacer", huecos.hayAyuda, huecos),
  check("y se puede crear el curso que falta, no solo buscarlo", huecos.hayCrearCurso, huecos),
  check("una fila sin nombre se ve", huecos.apareceSinNombre, huecos),
  check("pero no deja crear un curso llamado «-»", huecos.ofreceCrearSinNombre === false, huecos));

const creado = await page.evaluate(() => {
  const b = document.querySelector('[data-action="tec:crearcurso"][data-id="zz-suelta"]');
  if (!b) return { hay: false };
  b.click();
  const fila = state.tecnico.find((f) => f.id === "zz-suelta"),
    card = state.cards.find((c) => c.id === fila.cardId);
  return {
    hay: true,
    unidos: !!card,
    titulo: card && card.titulo,
    // Nace publicado: una fila de Técnico existe para un curso que ya está en
    // Moodle, así que tiene que contar en Reportes desde el minuto cero.
    cuentaEnReportes: !!card && repCursosActivos().some((c) => c.id === card.id),
    // Y se lleva la fecha de publicación que la fila ya tenía.
    fecha: card && card.publicadoEl,
    yaNoEstaSuelta: !valFilasSinCurso().some((f) => f.id === "zz-suelta"),
  };
});
(check("crear el curso deja la fila y la tarjeta unidas", creado.hay && creado.unidos, creado),
  check("con el mismo nombre", creado.titulo === "ZZ Curso solo en Técnico", creado),
  check("contando ya en Reportes", creado.cuentaEnReportes, creado),
  check("y con la fecha de publicación que traía la fila", creado.fecha === "2023-04-05", creado),
  check("la fila deja de figurar como suelta", creado.yaNoEstaSuelta, creado));

await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id))),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    parInvalidar());
});

// ── Métodos de matriculación ──────────────────────────────────────────────
console.log("\nmétodos de matriculación");
await page.evaluate(() => {
  ((state.tecSubView = "matri"), (state.matVista = "reglas"), (state.matAbiertas = {}), render());
});
await page.waitForTimeout(500);
const matri = await page.evaluate(() => ({
  tarjetas: document.querySelectorAll(".mat-card").length,
  reglas: MATRI_SEED.length,
  cursos: matCursosTodos().length,
  // El cruce con el Técnico es por nombre: si se rompiera, no engancharía casi
  // ninguno y los chips dejarían de llevar a la fila.
  cruzados: matCursosTodos().filter((c) => matTecFila(c.n)).length,
}));
(check("se ven las 63 reglas", matri.tarjetas === matri.reglas && matri.reglas === 63, matri),
  check("que alcanzan 80 cursos", matri.cursos === 80, matri),
  check("y casi todos enganchan con una fila del Técnico", matri.cruzados >= 70, matri));
await page.click(".mat-card .mat-h");
await page.waitForTimeout(400);
const abierta = await page.evaluate(() => ({
  cursos: document.querySelectorAll(".mat-card.open .mat-curso").length,
  condiciones: document.querySelectorAll(".mat-card.open .mat-cond").length,
}));
(check("una regla se abre y muestra los cursos que otorga", abierta.cursos > 0, abierta),
  check("y las condiciones, leídas una por renglón", abierta.condiciones > 0, abierta));
await page.click('[data-action="mat:vista"][data-v="cursos"]');
await page.waitForTimeout(400);
check(
  "«Por curso» da vuelta la información: cada curso con sus reglas",
  await page.evaluate(() => document.querySelectorAll(".mat-ccard").length > 0 && document.querySelectorAll(".mat-rchip").length > 0),
);

// ── Qué falta ─────────────────────────────────────────────────────────────
console.log("\nqué falta");
await page.evaluate(() => {
  // Un curso al que le falta todo y otro al que no le falta nada, para poder
  // comprobar los dos extremos del orden.
  state.tecnico = state.tecnico.filter((f) => !/^ZZ /.test(f.curso || ""));
  const completo = {
      id: "zz-lleno",
      curso: "ZZ Curso completo",
      categoria: "ZZ Prueba",
      portada: true,
      mosaico: true,
      evaluacion: true,
      textos: true,
      publicacion: "2024-03-01",
      scorm: "2024-03-02",
      cardId: state.cards[0].id,
    },
    vacio = { id: "zz-vacio", curso: "ZZ Curso sin nada", categoria: "ZZ Prueba" };
  (state.tecnico.push(completo, vacio),
    (state.view = "tecnico"),
    (state.tecSubView = "falta"),
    (state.tecFiltro = "ZZ"),
    render());
});
await page.waitForTimeout(400);
const falta = await page.evaluate(() => {
  const items = Array.from(document.querySelectorAll(".falta-list .falta-item")),
    nombres = items.map((i) => i.querySelector(".falta-curso").textContent);
  return {
    items: items.length,
    // El que menos le falta va primero: es el orden que contesta "por dónde
    // arranco", no el alfabético.
    primero: nombres[0],
    pendientesVacio: tecPendientes(state.tecnico.find((f) => f.id === "zz-vacio")).length,
    pendientesLleno: tecPendientes(state.tecnico.find((f) => f.id === "zz-lleno")).length,
    // El completo no ensucia la lista de pendientes: se pliega abajo.
    plegados: document.querySelectorAll(".falta-completos .falta-item").length,
    pasosLinea: document.querySelectorAll(".falta-item .tlin-paso").length,
    pasosHechos: document.querySelectorAll(".falta-item .tlin-paso.ok").length,
  };
});
(check("«Qué falta» lista los cursos con algo pendiente", falta.items >= 1, falta),
  check("al que no le falta nada queda plegado aparte", falta.plegados === 1, falta),
  check("un curso sin nada cargado tiene 7 pendientes", falta.pendientesVacio === 7, falta),
  check("y uno completo, ninguno", falta.pendientesLleno === 0, falta),
  check("las dos fechas se dibujan como dos pasos", falta.pasosLinea >= 2, falta),
  check("y los pasos cargados se ven hechos", falta.pasosHechos >= 2, falta));

// Tildar una pieza acá mismo baja la cuenta y redibuja la lista.
const tildeAntes = await page.evaluate(
  () => document.querySelector('.falta-item [data-tec-field="portada"]') !== null,
);
check("las piezas se tildan sin salir de la vista", tildeAntes);
await page.click('.falta-item [data-tec-field="portada"]');
await page.waitForTimeout(350);
check(
  "y al tildarla baja lo que le falta al curso",
  await page.evaluate(() => tecPendientes(state.tecnico.find((f) => f.id === "zz-vacio")).length === 6),
);

// ── Reportes: el catálogo en detalle ──────────────────────────────────────
// Lo de arriba cuenta tarjetas del Mapa; el bloque nuevo cuenta filas de
// Seguimiento técnico. Son dos fuentes distintas y por eso el corte va dicho.
console.log("\nReportes · el catálogo en detalle");
await page.evaluate(() => ((state.view = "reportes"), render()));
await page.waitForTimeout(700);
const repNuevo = await page.evaluate(() => {
  const vivas = state.tecnico.filter(tecFilaActiva);
  return {
    corte: !!document.querySelector(".rep-corte"),
    // lo de siempre sigue arriba del corte
    heroAntes: document.querySelector(".rep-hero").compareDocumentPosition(document.querySelector(".rep-corte")) & Node.DOCUMENT_POSITION_FOLLOWING,
    piezas: [...document.querySelectorAll(".rep-pieza")].map((b) => b.dataset.campo),
    portadaDice: (document.querySelector('.rep-pieza[data-campo="portada"] .rep-pieza-h i') || {}).textContent,
    portadaReal: vivas.filter((f) => f.portada).length + " de " + vivas.length,
    disenos: document.querySelectorAll('.rep-rank-f[data-campo="diseno"]').length,
    disenosReales: new Set(vivas.map((f) => (f.diseno || "").trim())).size,
    tramos: document.querySelectorAll(".rep-rank-f.estatica").length,
    split: document.querySelectorAll(".rep-split button").length,
  };
});
(check("el bloque nuevo va DEBAJO de lo que ya estaba", repNuevo.corte === true && repNuevo.heroAntes > 0, repNuevo),
  check("están las cuatro piezas de producción", repNuevo.piezas.join("|") === "portada|mosaico|evaluacion|textos", repNuevo),
  check("y cada una dice cuántas van sobre el total vigente", repNuevo.portadaDice === repNuevo.portadaReal, repNuevo),
  check("el desglose por diseño lista todos los valores reales", repNuevo.disenos === repNuevo.disenosReales, repNuevo),
  check("la antigüedad va en tres tramos", repNuevo.tramos === 3, repNuevo));

// Cada número tiene salida: lleva a Técnico con el filtro ya puesto.
await page.click('.rep-pieza[data-campo="evaluacion"]');
await page.waitForTimeout(600);
const salida = await page.evaluate(() => ({
  vista: state.view,
  filtro: JSON.parse(JSON.stringify(state.tecColFiltros)),
  filas: tecRows().length,
  todasSinEvaluacion: tecRows().every((f) => !f.evaluacion),
}));
(check("tocar una pieza lleva a Técnico", salida.vista === "tecnico", salida),
  check("con el filtro ya puesto en los que le falta", JSON.stringify(salida.filtro) === '{"evaluacion":["no"]}', salida),
  check("y la lista muestra solo esos", salida.todasSinEvaluacion === true && salida.filas > 0, salida));
await page.evaluate(() => {
  ((state.tecColFiltros = {}), (state.tecSubView = "grilla"), (state.view = "tecnico"), render());
});
await page.waitForTimeout(300);

// ── Un curso, un registro ─────────────────────────────────────────────────
console.log("\nun curso, un registro");
const pares = await page.evaluate(() => {
  // Dos casos armados a mano: uno idéntico salvo acentos, otro que se parece
  // pero no es igual — exactamente los dos tipos que hay en el dato real.
  const c1 = newCard("curso", "ZZ Manual de Prueba - Capítulo 3", {}),
    c2 = newCard("curso", "ZZ Higiene Y Limpieza", {});
  (state.cards.push(c1, c2),
    state.tecnico.push(
      { id: "zz-p1", curso: "ZZ Manual de Prueba – 3", categoria: "ZZ Prueba" },
      { id: "zz-p2", curso: "zz higiene y limpieza", categoria: "ZZ Prueba" },
    ),
    parInvalidar());
  const ex = valParesExactos(),
    pa = valParesParecidos();
  return {
    exacto: ex.some((x) => x.fila.id === "zz-p2" && x.card.id === c2.id),
    parecido: pa.some((x) => x.fila.id === "zz-p1" && x.card.id === c1.id),
    // Lo que ya se ofrece como par no vuelve a contarse como fila suelta: si
    // no, el mismo problema figuraría dos veces y el total dejaría de cerrar.
    noSeRepite: !valFilasSinCurso().some((f) => f.id === "zz-p1" || f.id === "zz-p2"),
  };
});
(check("dos nombres iguales salvo mayúsculas se detectan como el mismo curso", pares.exacto, pares),
  check('"– 3" y "- Capítulo 3" se ofrecen como par a decidir', pares.parecido, pares),
  check("y un par ofrecido no se cuenta además como fila suelta", pares.noSeRepite, pares));

await page.evaluate(() => ((state.tecSubView = "revision"), render()));
await page.waitForTimeout(400);
const revision = await page.evaluate(() => ({
  grupos: document.querySelectorAll(".val-grupo").length,
  pares: document.querySelectorAll(".par").length,
  // Las revisiones sin nada pendiente se pliegan a una línea en vez de ocupar
  // una caja entera.
  lineasOk: document.querySelectorAll(".val-linea-ok").length,
  total: valTotal(),
}));
(check("Revisión agrupa todo en tres bloques", revision.grupos === 3, revision),
  check("con los pares enfrentados para poder compararlos", revision.pares >= 2, revision),
  check("lo que ya está bien ocupa una línea, no una caja", revision.lineasOk >= 1, revision));

// "Son distintos" se guarda en la fila y el par no vuelve.
await page.evaluate(() => {
  const b = document.querySelector('[data-action="val:nopar"][data-fila="zz-p1"]');
  if (b) b.click();
});
await page.waitForTimeout(400);
const descarte = await page.evaluate(() => ({
  guardado: (state.tecnico.find((f) => f.id === "zz-p1").noEs || []).length,
  vuelve: valParesParecidos().some((x) => x.fila.id === "zz-p1"),
}));
(check("marcar «son distintos» queda guardado en la fila", descarte.guardado === 1, descarte),
  check("y ese par no vuelve a preguntarse", descarte.vuelve === false, descarte));

// Vincular el par exacto los une de verdad, por id y no por texto.
const vinculado = await page.evaluate(() => {
  const x = valParesExactos().find((p) => p.fila.id === "zz-p2");
  if (!x) return null;
  return ((x.fila.cardId = x.card.id), parInvalidar(), { id: state.tecnico.find((f) => f.id === "zz-p2").cardId });
});
check("vincular un par lo deja unido por id", !!(vinculado && vinculado.id), vinculado);

// ── El comparador de nombres ──────────────────────────────────────────────
// Esta batería existe por un error concreto: la primera versión tiraba los
// tokens de menos de tres letras, así que los números de capítulo
// desaparecían y los ocho capítulos del Manual de Recursos Humanos eran
// indistinguibles entre sí. No se ofrecieron como par, y el botón de crear
// filas en lote les abrió una fila duplicada a cada uno.
console.log("\ncomparar nombres de curso");
const comparador = await page.evaluate(() => ({
  mismoCapitulo: tecParecido('Manual de Recursos Humanos "Capítulo 3"', "Manual de Recursos Humanos – 3"),
  otroCapitulo: tecParecido('Manual de Recursos Humanos "Capítulo 3"', "Manual de Recursos Humanos – 4"),
  otraEdicion: tecParecido("Seguridad e Higiene - 2026", "Seguridad e Higiene - 2025"),
  // Un año de un solo lado no dice nada: puede ser el mismo curso.
  unSoloAnio: tecParecido("Seguridad e Higiene 2026", "Seguridad e Higiene"),
  // Solo palabras genéricas del catálogo en común no alcanza.
  soloGenericas: tecParecido("Envíos – Conceptos básicos", "Ventas – Conceptos básicos"),
  // Contención: el mismo curso escrito distinto no aporta palabras propias.
  contiene: tecUnoContieneAlOtro("Curso de Uso Seguro del Montacargas", "Uso seguro del montacargas"),
  noContiene: tecUnoContieneAlOtro("Coto Digital - Conceptos básicos", "Coto Hogar – Conceptos básicos"),
}));
(check("el capítulo 3 se reconoce con el capítulo 3", comparador.mismoCapitulo > 0.7, comparador),
  check("y no se confunde con el capítulo 4", comparador.otroCapitulo === 0, comparador),
  check("dos ediciones de distinto año son cursos distintos", comparador.otraEdicion === 0, comparador),
  check("pero el año de un solo lado no los separa", comparador.unSoloAnio > 0.7, comparador),
  check("compartir solo palabras genéricas no cuenta", comparador.soloGenericas === 0, comparador),
  check("un nombre contenido en el otro es el mismo curso", comparador.contiene, comparador),
  check("y «Digital» contra «Hogar» no lo es", comparador.noContiene === false, comparador));

// ── Filas repetidas en Técnico ────────────────────────────────────────────
console.log("\nfilas repetidas en Técnico");
const repes = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  const card = newCard("curso", "ZZ Cronograma de Prueba – 3", {});
  state.cards.push(card);
  const llena = {
      id: "zz-llena",
      curso: 'ZZ Cronograma de Prueba "Capítulo 3"',
      categoria: "ZZ Prueba",
      portada: true,
      mosaico: true,
      scorm: "2024-02-02",
      diseno: "HTML",
    },
    // La que abrió de más el botón de lote: vacía y unida a la tarjeta.
    vacia = { id: "zz-vacia", curso: "ZZ Cronograma de Prueba – 3", categoria: "ZZ Prueba", cardId: card.id },
    // Y dos que se parecen pero NO son el mismo curso: no se deben proponer.
    distinta1 = { id: "zz-d1", curso: "ZZ Sucursal Digital – Conceptos básicos", categoria: "ZZ Prueba" },
    distinta2 = { id: "zz-d2", curso: "ZZ Sucursal Hogar – Conceptos básicos", categoria: "ZZ Prueba", portada: true };
  (state.tecnico.push(llena, vacia, distinta1, distinta2), parInvalidar());
  const pares = valFilasRepetidas();
  return {
    proponeElReal: pares.some((x) => x.queda.id === "zz-llena" && x.va.id === "zz-vacia"),
    // La que se mantiene es la que tiene los datos, nunca la vacía.
    noProponeLasDistintas: !pares.some((x) => /^zz-d/.test(x.queda.id) || /^zz-d/.test(x.va.id)),
    cardId: card.id,
  };
});
(check("detecta el mismo curso con dos filas, una vacía", repes.proponeElReal, repes),
  check("y no propone fusionar dos cursos que solo se parecen", repes.noProponeLasDistintas, repes));

const fusion = await page.evaluate((cardId) => {
  const queda = state.tecnico.find((f) => f.id === "zz-llena"),
    va = state.tecnico.find((f) => f.id === "zz-vacia");
  (tecFusionarFilas(queda, va), parInvalidar());
  const d = state.tecnico.find((f) => f.id === "zz-llena");
  return {
    // Nada de lo que tenía se pierde…
    conserva: d.portada && d.mosaico && d.scorm === "2024-02-02" && d.diseno === "HTML",
    // …y se queda con el vínculo que traía la otra.
    hereda: d.cardId === cardId,
    nombre: d.curso,
    // La sobrante se va de verdad, con lápida, para que no vuelva al sincronizar.
    borrada: !state.tecnico.some((f) => f.id === "zz-vacia"),
    lapida: !!state.deletedTecnico["zz-vacia"],
  };
}, repes.cardId);
(check("fusionar no pierde ningún dato de la fila que se mantiene", fusion.conserva, fusion),
  check("y le pasa el vínculo con el Mapa de la otra", fusion.hereda, fusion),
  check("conserva el nombre de la fila que tenía los datos", fusion.nombre === 'ZZ Cronograma de Prueba "Capítulo 3"', fusion),
  check("la fila sobrante se borra con lápida", fusion.borrada && fusion.lapida, fusion));

// ── Tarjetas que el Mapa no necesitaba ────────────────────────────────────
// La otra mitad del mismo error del comparador: "Filas de Técnico sin curso
// en el Mapa" listaba filas que SÍ tenían su curso con otro nombre, y el
// botón de crear cursos en lote les armó a cada una una tarjeta nueva.
console.log("\ntarjetas creadas de más en el Mapa");
const deMas = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  // La tarjeta de siempre, con trabajo encima.
  const real = newCard("curso", "ZZ Bandejas – Armado del hueco", {});
  ((real.publicado = true),
    (real.estado = "finalizado"),
    (real.checklist = [{ id: "x", text: "guion", done: true }]),
    state.cards.push(real));
  // La fila que le corresponde, con otro nombre y todavía sin vincular.
  const fila = { id: "zz-fila", curso: "ZZ Curso de Armado del Hueco de Bandejas", categoria: "ZZ Prueba", portada: true };
  state.tecnico.push(fila);
  // Lo que hizo el botón: crear una tarjeta nueva desde la fila y unirlas.
  const creada = cardNuevaParaFila(fila);
  (state.cards.push(creada), (fila.cardId = creada.id), parInvalidar());
  const antes = valTarjetasDeMas();
  return {
    // La tarjeta de siempre quedó huérfana y por eso figuraba como "sin fila".
    realQuedoHuerfana: valCursosSinTec().some((x) => x.card.id === real.id),
    detecta: antes.some((x) => x.fila.id === "zz-fila" && x.real.id === real.id && x.creada.id === creada.id),
    realId: real.id,
    creadaId: creada.id,
  };
});
(check("la tarjeta de siempre queda huérfana cuando se crea una de más", deMas.realQuedoHuerfana, deMas),
  check("y se detecta cuál es la creada de más y cuál la de siempre", deMas.detecta, deMas));

const reparado = await page.evaluate((ids) => {
  const x = valTarjetasDeMas().find((y) => y.fila.id === "zz-fila");
  valRepararTarjeta(x);
  parInvalidar();
  const fila = state.tecnico.find((f) => f.id === "zz-fila");
  return {
    // La fila vuelve a la tarjeta original…
    vuelve: fila.cardId === ids.realId,
    // …la creada de más se va…
    borrada: !state.cards.some((c) => c.id === ids.creadaId),
    // …y la original conserva su trabajo.
    conservaTrabajo: (state.cards.find((c) => c.id === ids.realId).checklist || []).length === 1,
    // Y deja de figurar como curso sin fila, que era el síntoma visible.
    yaNoEsHuerfana: !valCursosSinTec().some((x) => x.card.id === ids.realId),
  };
}, { realId: deMas.realId, creadaId: deMas.creadaId });
(check("deshacer devuelve la fila a la tarjeta de siempre", reparado.vuelve, reparado),
  check("borra la tarjeta creada de más", reparado.borrada, reparado),
  check("sin tocar el trabajo cargado en la original", reparado.conservaTrabajo, reparado),
  check("y el curso deja de figurar como «sin fila»", reparado.yaNoEsHuerfana, reparado));

// Una tarjeta creada de más pero que alguien YA empezó a usar no se toca.
const conTrabajo = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  const real = newCard("curso", "ZZ Pescadería – Corte fino", {});
  ((real.publicado = true), state.cards.push(real));
  const fila = { id: "zz-f2", curso: "ZZ Curso de Corte Fino de Pescadería", categoria: "ZZ Prueba" };
  state.tecnico.push(fila);
  const creada = cardNuevaParaFila(fila);
  // Alguien le puso un responsable: ya no es descartable.
  ((creada.responsable = TEAM[0].id),
    delete creada.nacidaDeFila,
    state.cards.push(creada),
    (fila.cardId = creada.id),
    parInvalidar());
  return { propone: valTarjetasDeMas().some((x) => x.fila.id === "zz-f2") };
});
check("una tarjeta creada de más que alguien ya usó no se propone borrar", conTrabajo.propone === false, conTrabajo);

// Y el botón que causó todo esto ahora se saltea los casos dudosos.
const loteCursos = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  const real = newCard("curso", "ZZ Fiambrería – Rotación de stock", {});
  ((real.publicado = true), state.cards.push(real));
  (state.tecnico.push({ id: "zz-f3", curso: "ZZ Curso de Rotación de Stock de Fiambrería", categoria: "ZZ Prueba" }),
    parInvalidar());
  return {
    // Lo correcto: se ofrece como PAR con el curso que ya existe, no como una
    // fila suelta a la que haya que inventarle una tarjeta.
    esPar: valParesParecidos().some((x) => x.fila.id === "zz-f3" && x.card.id === real.id),
    noEsSuelta: !valFilasSinCurso().some((f) => f.id === "zz-f3"),
    // Y aunque se colara, el lote tiene su propia red: no se la lleva puesta.
    quedaAfuera: !valFilasSinCursoSeguras().some((f) => f.id === "zz-f3"),
  };
});
(check("una fila cuyo curso existe con otro nombre se ofrece como par", loteCursos.esPar, loteCursos),
  check("y ya no figura como fila suelta a la que inventarle una tarjeta", loteCursos.noEsSuelta, loteCursos),
  check("el lote de «crear cursos» tampoco se la llevaría puesta", loteCursos.quedaAfuera, loteCursos));

await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id))),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    parInvalidar());
});

// ── El botón de crear filas en lote, desconfiado ──────────────────────────
const lote = await page.evaluate(() => {
  const card = newCard("curso", "ZZ Uso Seguro de la Zorra", {});
  ((card.publicado = true), (card.estado = "finalizado"), state.cards.push(card));
  // Una fila de nombre parecido, sin vincular: el curso NO está sin fila, está
  // cargado con otro nombre. Crearle una fila sería duplicarlo.
  (state.tecnico.push({ id: "zz-parecida", curso: "ZZ Uso seguro de la zorra hidráulica", categoria: "ZZ Prueba" }),
    parInvalidar());
  const todos = valCursosSinTec().length,
    seguros = valCursosSinTecSeguros().length;
  return { todos, seguros, quedaAfuera: !valCursosSinTecSeguros().some((x) => x.card.id === card.id) };
});
check("el lote de «crear filas» saltea los cursos que ya podrían tener fila", lote.quedaAfuera, lote);

await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id))),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    parInvalidar());
});

// ── Técnico manda sobre la vigencia ───────────────────────────────────────
// Antes cada lado tenía su interruptor: se podía dar de baja en Técnico y que
// el Mapa lo siguiera contando como activo. Revisión avisaba de la
// contradicción pero solo dejaba darle la razón a un lado.
console.log("\nla vigencia la manda Técnico");
const vigencia = await page.evaluate(() => {
  state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id));
  state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo));
  const card = newCard("curso", "ZZ Verdulería – Armado de góndola", {});
  ((card.publicado = true), (card.activo = true), state.cards.push(card));
  const fila = { id: "zz-vig", curso: "ZZ Verdulería – Armado de góndola", categoria: "ZZ Prueba", cardId: card.id };
  (state.tecnico.push(fila), parInvalidar());
  applyTecField("zz-vig", "baja", "si");
  const trasBaja = { activo: card.activo, fecha: !!card.bajaEl };
  applyTecField("zz-vig", "baja", "no");
  return {
    trasBaja,
    trasVolver: { activo: card.activo, fecha: card.bajaEl },
    // Y queda anotado en la Actividad de la tarjeta, no pasa en silencio.
    anotado: (card.actividad || []).length,
    cardId: card.id,
  };
});
(check("dar de baja en Técnico da de baja la tarjeta del Mapa", vigencia.trasBaja.activo === false, vigencia),
  check("y le pone la fecha de baja", vigencia.trasBaja.fecha, vigencia),
  check("volver a vigente la reactiva", vigencia.trasVolver.activo === true && !vigencia.trasVolver.fecha, vigencia),
  check("los dos cambios quedan en la Actividad de la tarjeta", vigencia.anotado === 2, vigencia));

// Una contradicción vieja se puede resolver para cualquiera de los dos lados.
const contra = await page.evaluate(() => {
  const fila = state.tecnico.find((f) => f.id === "zz-vig"),
    card = state.cards.find((c) => c.id === fila.cardId);
  // Así venían los datos del Excel: sin elección explícita y con el comentario
  // diciendo "Dado de baja". La app lo deducía del texto.
  (delete fila.baja, (fila.estado = "Dado de baja"), parInvalidar());
  const figuraba = valEstadoContradictorio().some((x) => x.fila.id === "zz-vig");
  // "Está vigente": la elección explícita gana sobre el texto del comentario.
  ((fila.baja = false), tecEspejarVigencia(fila), parInvalidar());
  return {
    figuraba,
    yaNo: !valEstadoContradictorio().some((x) => x.fila.id === "zz-vig"),
    // El comentario sigue ahí —es información— pero ya no decide nada.
    comentarioIntacto: fila.estado === "Dado de baja",
    sigueActiva: card.activo === true,
  };
});
(check("una fila con «Dado de baja» en el comentario figura como contradicción", contra.figuraba, contra),
  check("marcarla vigente la saca de la lista", contra.yaNo, contra),
  check("sin borrar el comentario, que es información", contra.comentarioIntacto, contra),
  check("y la tarjeta sigue activa", contra.sigueActiva, contra));

// ── Arreglar sin salir de Revisión ────────────────────────────────────────
console.log("\narreglar sin salir de Revisión");
const arreglos = await page.evaluate(() => {
  const fila = state.tecnico.find((f) => f.id === "zz-vig");
  ((fila.publicacion = ""), delete fila.publicacionDesconocida, parInvalidar());
  const pide = valFechas().some((f) => f.id === "zz-vig");
  // "No la sé" no es lo mismo que "todavía no la cargué".
  ((fila.publicacionDesconocida = true), parInvalidar());
  const calla = !valFechas().some((f) => f.id === "zz-vig");
  // Y cargar la fecha después la limpia.
  ((fila.publicacion = "2019-06-01"), (fila.publicacionDesconocida = false), parInvalidar());
  return { pide, calla, conFecha: !valFechas().some((f) => f.id === "zz-vig") };
});
(check("un curso activo sin fecha de publicación se pide", arreglos.pide, arreglos),
  check("«No la sé» calla el aviso sin inventar una fecha", arreglos.calla, arreglos),
  check("y cargarla después también", arreglos.conFecha, arreglos));

// El nombre definitivo se escribe, no se elige entre dos opciones fijas.
const nombre = await page.evaluate(() => {
  const fila = state.tecnico.find((f) => f.id === "zz-vig"),
    card = state.cards.find((c) => c.id === fila.cardId);
  ((card.titulo = "ZZ Verdulería - armado de gondola"), parInvalidar());
  const figuraba = valTitulosDifieren().some((x) => x.fila.id === "zz-vig");
  ((state.view = "tecnico"), (state.tecSubView = "revision"), render());
  const campo = document.querySelector('[data-val-nombre="zz-vig"]');
  if (!campo) return { hay: false };
  campo.value = "ZZ Verdulería – Armado de góndola (definitivo)";
  document.querySelector('[data-action="tec:usarnombre"][data-fila="zz-vig"]').click();
  return {
    hay: true,
    figuraba,
    fila: state.tecnico.find((f) => f.id === "zz-vig").curso,
    card: state.cards.find((c) => c.id === card.id).titulo,
  };
});
(check("se puede escribir un nombre que no es ninguno de los dos", nombre.hay && nombre.figuraba, nombre),
  check("y queda el mismo en Técnico y en el Mapa", nombre.fila === nombre.card && /definitivo/.test(nombre.fila || ""), nombre));

// ── Dar de alta un curso desde Técnico ────────────────────────────────────
console.log("\ndar de alta un curso desde Técnico");
const alta = await page.evaluate(() => {
  const antes = { filas: state.tecnico.length, cards: state.cards.length };
  openModal(tecNuevaFilaModalHTML(""));
  ($("#tecNuevoNombre").value = "ZZ Panadería – Horneado de facturas"),
    ($("#tecNuevaCat").value = "ZZ Prueba");
  document.querySelector('[data-action="tec:add-confirmar"]').click();
  const fila = state.tecnico.find((f) => f.curso === "ZZ Panadería – Horneado de facturas"),
    card = fila && state.cards.find((c) => c.id === fila.cardId);
  return {
    filaCreada: !!fila,
    cardCreada: !!card,
    unidas: !!card && card.id === fila.cardId && card.nacidaDeFila === fila.id,
    // Un curso nuevo es trabajo por hacer, no catálogo publicado.
    sinPublicar: !!card && !card.publicado,
    filas: state.tecnico.length - antes.filas,
  };
});
(check("dar de alta en Técnico crea la fila", alta.filaCreada, alta),
  check("y su tarjeta en el Planner, unidas", alta.cardCreada && alta.unidas, alta),
  check("la tarjeta nace sin publicar: es trabajo por hacer", alta.sinPublicar, alta));

// Y no deja crear dos veces el mismo curso, que fue el origen de todo.
const repetido = await page.evaluate(() => {
  const antes = state.tecnico.length;
  openModal(tecNuevaFilaModalHTML(""));
  $("#tecNuevoNombre").value = "zz panaderia   horneado de facturas";
  document.querySelector('[data-action="tec:add-confirmar"]').click();
  return { creadas: state.tecnico.length - antes };
});
check("y avisa en vez de crear el mismo curso dos veces", repetido.creadas === 0, repetido);

await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id) && !/^ZZ /.test(f.curso || ""))),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    closeModal(),
    parInvalidar());
});

// ── Mover una tarjeta ─────────────────────────────────────────────────────
console.log("\nmover una tarjeta de columna");
const movida = await page.evaluate(() => {
  const c = state.cards.find((x) => x.titulo === "Guion de seguridad");
  ((c.estado = "pendiente"), (c.actividad = []), (c.revisionDesde = null));
  const cambio = moverTarjetaAEstado(c, "en-revision"),
    sinCambio = moverTarjetaAEstado(c, "en-revision");
  return {
    cambio: cambio,
    sinCambio: sinCambio,
    estado: c.estado,
    // Pasar a revisión sella desde cuándo: es lo que después cuenta los días.
    sello: !!c.revisionDesde,
    anotado: (c.actividad || []).length,
  };
});
(check("mover una tarjeta cambia su columna", movida.cambio === true && movida.estado === "en-revision", movida),
  check("lo anota en la actividad", movida.anotado === 1, movida),
  check("sella desde cuándo está en revisión", movida.sello, movida),
  check("y mover a la misma columna no hace nada", movida.sinCambio === false && movida.anotado === 1, movida));

// ── Navegación ────────────────────────────────────────────────────────────
console.log("\nnavegación");
const paleta = await page.evaluate(() => {
  const cmds = paletteCommands();
  return {
    falta: cmds.some((c) => c.act === "tecsub" && c.arg === "falta"),
    revision: cmds.some((c) => c.act === "tecsub" && c.arg === "revision"),
    matri: cmds.some((c) => c.act === "tecsub" && c.arg === "matri"),
  };
});
(check("el buscador encuentra «Qué falta»", paleta.falta, paleta),
  check("y «Revisión»", paleta.revision, paleta),
  check("y «Métodos de matriculación»", paleta.matri, paleta));
const salto = await page.evaluate(() => {
  ((state.view = "reportes"), render());
  const b = document.createElement("button");
  (b.setAttribute("data-action", "tec:subview"), b.setAttribute("data-v", "revision"), document.body.appendChild(b), b.click(), b.remove());
  return { view: state.view, sub: state.tecSubView };
});
check(
  "desde otra vista se puede saltar directo a una solapa de Técnico",
  salto.view === "tecnico" && salto.sub === "revision",
  salto,
);

// Dejar el tablero como estaba para que nada de esto ensucie lo que sigue.
await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id))),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    (state.tecFiltro = ""),
    (state.tecSubView = "grilla"),
    parInvalidar());
});

await browser.close();
await backend.stop();
const fallan = resultados.filter((r) => !r.ok);
console.log(
  `\n${resultados.length - fallan.length}/${resultados.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.nombre).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
