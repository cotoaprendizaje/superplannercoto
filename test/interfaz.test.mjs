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
import { xlsxDePrueba } from "./xlsx-de-prueba.mjs";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
    arribaDeTodo: orden[0] === "mensajes" && orden[1] === "datos",
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
  check("y está arriba de todo, antes de Datos", sec.arribaDeTodo === true, sec),
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
    anotado: (d.actividad || []).some((a) => /En test/i.test(a.texto)),
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
    hayResponsable: !!document.querySelector('#panel .eqo-sumar'),
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

// Abrirla la estira al ancho completo con todos los campos adentro. Se abre
// con la flecha: el nombre es un campo y clickearlo pone el cursor.
await page.click(".tct .tct-ar");
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

// Lo que está a la vista en el renglón se escribe en el renglón. Mandar a
// abrir una ficha por curso para cargar una fecha es la planilla otra vez,
// pero peor: son ciento catorce aperturas.
const idEd = await page.evaluate(() => tecRows()[0].id);
const campos = await page.evaluate(
  (id) => [...document.querySelectorAll('.tct[data-tec-row="' + id + '"] > * [data-tec-field], .tct[data-tec-row="' + id + '"] [data-tec-field]')]
    .filter((n) => !n.closest(".tct-cuerpo"))
    .map((n) => n.dataset.tecField),
  idEd,
);
check(
  "sin abrir nada, el renglón deja editar nombre, piezas, diseño y las dos fechas",
  ["curso", "portada", "mosaico", "evaluacion", "textos", "diseno", "publicacion", "scorm"].every((k) => campos.includes(k)),
  campos,
);
await page.fill('.tct[data-tec-row="' + idEd + '"] input.tct-n', "ZZ Escrito en el renglón");
await page.waitForTimeout(350);
await page.selectOption('.tct[data-tec-row="' + idEd + '"] .tct-dis select', "Storyline V2");
await page.waitForTimeout(350);
await page.fill('.tct[data-tec-row="' + idEd + '"] [data-tec-field="scorm"]', "2026-02-10");
await page.waitForTimeout(400);
const guardado = await page.evaluate((id) => {
  const f = state.tecnico.find((x) => x.id === id);
  return { curso: f.curso, diseno: f.diseno, scorm: f.scorm, sigueAbiertaNinguna: state.tecAbierta === null };
}, idEd);
(check("lo que se escribe en el renglón se guarda", guardado.curso === "ZZ Escrito en el renglón" && guardado.diseno === "Storyline V2", guardado),
  check("y la fecha también, sin abrir la ficha", guardado.scorm === "2026-02-10" && guardado.sigueAbiertaNinguna, guardado));

// El nombre viaja a la tarjeta del Mapa si está vinculada, como siempre.
const espejo = await page.evaluate((id) => {
  const f = state.tecnico.find((x) => x.id === id);
  if (!f.cardId) return "sin vínculo";
  const c = state.cards.find((x) => x.id === f.cardId);
  return c ? c.titulo : "sin tarjeta";
}, idEd);
check(
  "y si el curso está vinculado, el nombre viaja al Mapa",
  espejo === "sin vínculo" || espejo === "ZZ Escrito en el renglón",
  espejo,
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

// ── Escribir mientras entra un cambio de otra persona ─────────────────────
// El polling redibuja la vista cuando alguien más toca algo. Si eso pasa con
// el cursor puesto en un campo, el <input> deja de existir y la palabra se
// corta a la mitad. Pasaba en el buscador de Técnico, en el de Matriculación
// y en los campos del renglón: focoDeLaVista() solo sabía devolver el foco a
// los dos buscadores con data-filter.
const state1Total = await page.evaluate(() => state.tecnico.length);
console.log("\nescribir sin que te corten");
await page.evaluate(() => ((state.view = "tecnico"), (state.tecSubView = "grilla"), (state.tecFiltro = ""), render()));
await page.waitForTimeout(500);
await page.click("#tecSearch");
await page.keyboard.type("caj", { delay: 70 });
// En medio de la palabra, el redibujado que dispara el polling.
await page.evaluate(() => render());
await page.waitForTimeout(150);
await page.keyboard.type("as", { delay: 70 });
await page.waitForTimeout(400);
const buscTec = await page.evaluate(() => {
  const el = document.querySelector("#tecSearch");
  return { valor: el ? el.value : null, enfocado: document.activeElement === el, filas: tecRows().length };
});
(check("un redibujado en medio no corta lo que estás escribiendo", buscTec.valor === "cajas", buscTec),
  check("y el cursor se queda donde estaba", buscTec.enfocado === true, buscTec),
  check("la lista acompaña lo escrito", buscTec.filas > 0 && buscTec.filas < state1Total, buscTec));

// Lo mismo escribiendo el nombre de un curso en el renglón.
await page.evaluate(() => ((state.tecFiltro = ""), render()));
await page.waitForTimeout(400);
const idFoco = await page.evaluate(() => tecRows()[0].id);
await page.click('.tct[data-tec-row="' + idFoco + '"] input.tct-n');
await page.evaluate(() => {
  const el = document.querySelector("input.tct-n");
  ((el.value = ""), el.dispatchEvent(new Event("input", { bubbles: true })));
});
await page.keyboard.type("ZZ Nom", { delay: 70 });
await page.evaluate(() => render());
await page.waitForTimeout(150);
await page.keyboard.type("bre", { delay: 70 });
await page.waitForTimeout(400);
const campoFila = await page.evaluate((id) => {
  const el = document.querySelector('.tct[data-tec-row="' + id + '"] input.tct-n');
  return { valor: el ? el.value : null, enfocado: document.activeElement === el, guardado: state.tecnico.find((f) => f.id === id).curso };
}, idFoco);
(check("y tampoco corta el nombre que escribís en el renglón", campoFila.valor === "ZZ Nombre", campoFila),
  check("lo que quedó escrito es lo que se guardó", campoFila.guardado === "ZZ Nombre", campoFila));

// El polling directamente no redibuja mientras hay un campo con el cursor.
const esperaAEscribir = await page.evaluate(() => {
  document.querySelector("input.tct-n").focus();
  return escribiendo();
});
check("y el sincronizado espera a que sueltes el campo", esperaAEscribir === true);
await page.evaluate(() => document.activeElement.blur());

// ── El buscador trae lo relacionado, no solo lo que coincide de nombre ────
console.log("\nbuscar por sector, no solo por nombre");
const porSector = await page.evaluate(() => {
  const sec = Object.keys(SECTORES).find((k) => /caja/i.test(SECTORES[k].nombre));
  if (!sec) return { sinSector: true };
  const nombre = SECTORES[sec].nombre.toLowerCase(),
    cursos = state.cards.filter((c) => c.tipo === "curso"),
    delSector = cursos.filter((c) => (c.sectores || []).includes(sec)),
    porNombre = delSector.filter((c) => c.titulo.toLowerCase().includes(nombre));
  return {
    nombre: nombre,
    delSector: delSector.length,
    porNombre: porNombre.length,
    losEncuentraATodos: delSector.every((c) => cardCoincideTexto(c, nombre)),
  };
});
(check("hay cursos de un sector que no lo dicen en el nombre", porSector.sinSector || porSector.delSector > porSector.porNombre, porSector),
  check("y el buscador los trae igual", porSector.sinSector || porSector.losEncuentraATodos === true, porSector));

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

// ── Moodle: el Excel del área es la lista oficial de categorías ──
// Un Excel armado acá mismo (el real no puede ir a un repo público) con un
// caso de cada cosa: un curso que ya está, uno oculto, uno nuevo, un
// presencial y uno de Testing.
console.log("\nimportar el Excel de Moodle");
await page.evaluate(() => {
  ((state.view = "tecnico"), (state.tecSubView = "grilla"), (state.moodle = null));
  state.tecnico.push(
    { id: "zz-alfa", curso: "ZZ Curso Alfa", categoria: "Frescos 1", publicacion: "2020-01-01", scorm: "", portada: true, mosaico: false, evaluacion: false, textos: false, diseno: "", estado: "", cardId: null, updatedAt: Date.now() },
    { id: "zz-beta", curso: "ZZ Curso Beta de Cajas", categoria: "Cajas", publicacion: "2019-05-05", scorm: "2026-01-01", portada: false, mosaico: false, evaluacion: false, textos: false, diseno: "", estado: "", cardId: null, updatedAt: Date.now() },
  );
  render();
});
const SCORM_ALFA = 45900.5,
  esperadoScorm = new Date(Math.round((SCORM_ALFA - 25569) * 86400000)).toISOString().slice(0, 10),
  dirX = mkdtempSync(join(tmpdir(), "moodle-")),
  rutaX = join(dirX, "cursos-moodle.xlsx");
writeFileSync(
  rutaX,
  xlsxDePrueba([
    ["ID", "Fe.Creación", "Categoría", "Nombre", "Nombre corto", "Visible", "Fe.Modif.SCORM"],
    [9001, 45000, "Frescos I", "ZZ Curso Alfa", "ZZA", 1, SCORM_ALFA],
    [9002, 43000, "Cajas", "ZZ Curso Beta de Cajas", "ZZB", 0, 45000],
    [9006, 46000.25, "Coto Digital", "ZZ Curso Nuevo Delta", "ZZD", 1, 46001],
    [9004, 45500, "Presenciales", "ZZ Taller presencial", "ZZP", 1, ""],
    [9005, 45500, "Testing", "ZZ Prueba de Moodle", "ZZT", 0, ""],
  ]),
);
await page.click('[data-action="moodle:abrir"]');
await page.waitForTimeout(300);
await page.setInputFiles("#moodleFile", rutaX);
await page.waitForFunction(() => !document.querySelector("#moodleAplicar").disabled, { timeout: 5000 }).catch(() => {});
const mdlPrevia = await page.evaluate(() => ({
  resumen: (document.querySelector(".mdl-resumen") || {}).textContent || "",
  intacto: state.tecnico.find((f) => f.id === "zz-alfa").categoria,
}));
check("el Excel se lee y la vista previa cuenta cada caso", /5 cursos en el Excel: 2 ya están en Técnico, 0 para confirmar, 1 nuevos, 1 presenciales y 1 de prueba/.test(mdlPrevia.resumen), mdlPrevia);
check("la vista previa no toca nada todavía", mdlPrevia.intacto === "Frescos 1", mdlPrevia);
await page.click("#moodleAplicar");
await page.waitForTimeout(500);
const mdlTras = await page.evaluate(() => {
  const alfa = state.tecnico.find((f) => f.id === "zz-alfa"),
    beta = state.tecnico.find((f) => f.id === "zz-beta"),
    delta = state.tecnico.find((f) => f.curso === "ZZ Curso Nuevo Delta");
  return {
    alfa: { cat: alfa.categoria, scorm: alfa.scorm, pub: alfa.publicacion, id: alfa.moodleId },
    beta: { activa: tecFilaActiva(beta), scorm: beta.scorm },
    delta: delta && { cat: delta.categoria, id: delta.moodleId, pub: delta.publicacion, activa: tecFilaActiva(delta) },
    presencialEnTec: state.tecnico.some((f) => /presencial|Prueba de Moodle/.test(f.curso)),
    moodle: state.moodle && { pres: state.moodle.presenciales.length, el: state.moodle.elearning },
  };
});
check("la categoría pasa a la de Moodle", mdlTras.alfa.cat === "Frescos I", mdlTras.alfa);
check("el SCORM se completa con la fecha de Moodle", mdlTras.alfa.scorm === esperadoScorm, { mdlTras: mdlTras.alfa, esperadoScorm });
check("la fecha de publicación cargada a mano no se pisa", mdlTras.alfa.pub === "2020-01-01", mdlTras.alfa);
check("queda anotado el número de Moodle", mdlTras.alfa.id === "9001", mdlTras.alfa);
check("oculto en Moodle pasa a dado de baja", mdlTras.beta.activa === false, mdlTras.beta);
check("un SCORM más nuevo que el de Moodle no se pisa con uno viejo", mdlTras.beta.scorm === "2026-01-01", mdlTras.beta);
check("el curso nuevo entra con su categoría y su número", !!mdlTras.delta && mdlTras.delta.cat === "Coto Digital" && mdlTras.delta.id === "9006" && mdlTras.delta.activa, mdlTras.delta);
check("presenciales y Testing no entran a Técnico", !mdlTras.presencialEnTec, mdlTras);
check("los presenciales quedan contados aparte", !!mdlTras.moodle && mdlTras.moodle.pres === 1 && mdlTras.moodle.el === 3, mdlTras.moodle);
const mdlSectores = await page.evaluate(() =>
  ["Frescos I", "Frescos 1", "TCI", "Administración y Finanzas", "Higiene y Seguridad", "Recursos Humanos", "Pañol", "Area Secos - Centro de Distribución"].map(
    (c) => sectorDeCategoria(c),
  ),
);
check(
  "cada categoría (la de Moodle o la vieja) cae en su sector del Mapa",
  JSON.stringify(mdlSectores) === JSON.stringify(["frescos-1", "frescos-1", "tci", "tci", "seguridad-higiene", "recursos-humanos", "panol-base-12", null]),
  mdlSectores,
);
// Volver a cargar el mismo Excel no cambia nada: ya se reconocen por número.
await page.click('[data-action="moodle:abrir"]');
await page.waitForTimeout(300);
await page.setInputFiles("#moodleFile", rutaX);
await page.waitForTimeout(800);
const mdlOtraVez = await page.evaluate(() => (document.querySelector("#moodlePrevia") || {}).textContent || "");
check("el mismo Excel dos veces no propone cambios", /coinciden con Moodle/.test(mdlOtraVez) && !/Se actualizan/.test(mdlOtraVez), mdlOtraVez.slice(0, 200));
await page.evaluate(() => closeModal());
await page.evaluate(() => ((state.view = "reportes"), render()));
await page.waitForTimeout(300);
const mdlRepM = await page.evaluate(() => (document.querySelector(".rep-mdl") || {}).textContent || "");
check("Reportes muestra los presenciales en su propia línea", /1\s*presenciales/.test(mdlRepM) && /3\s*e-learning/.test(mdlRepM), mdlRepM);
await page.evaluate(() => ((state.view = "tecnico"), render()));

// ── Planner B, el 1 y el 2, y los perfiles ──
console.log("\nplanner B, el 1 y el 2, perfiles");
const pbA = await page.evaluate(() => {
  closeModal();
  ((state.filters = { persona: "", tipo: "", sector: "", estado: "", texto: "", cursoEstado: "" }), (state.mis = false), (state.quick = ""));
  const a = newCard("libre", "ZZ Uno es Flor", { estado: "diseno-listo" }),
    b = newCard("libre", "ZZ Uno es Gasti", { estado: "pendiente" }),
    c = newCard("libre", "ZZ Gasti en acción", { estado: "con-claude" });
  ((a.responsable = "flor"), (a.asignados = ["gasti"]), (b.responsable = "gasti"), (c.responsable = "gasti"), state.cards.push(a, b, c));
  ((state.view = "kanban"), render());
  const columnas = document.querySelectorAll(".kanban .kcol").length;
  ((state.view = "plannerb"), render());
  const orden = [...document.querySelectorAll(".pb-etapa")].map((x) => x.id);
  const circGasti = +document.querySelector('.eqc-b[data-id="gasti"] .eqc-n').textContent;
  const cuentaGasti = boardCards().filter((c) => c.estado !== "finalizado" && participa(c, "gasti")).length;
  document.querySelector('.eqc-b[data-id="gasti"]').click();
  const filas = [...document.querySelectorAll(".pb-fila")].map((f) => f.textContent);
  const es2 = [...document.querySelectorAll(".pb-fila.como-2")].map((f) => f.textContent);
  const sinMarca = [...document.querySelectorAll(".pb-fila:not(.como-2)")].map((f) => f.textContent);
  document.querySelector('.eqc-b[data-id="gasti"]').click();
  return {
    columnas,
    lineaArriba: orden.indexOf("pb-finalizado") < orden.indexOf("pb-pendiente") || orden.indexOf("pb-finalizado") === -1,
    proximosAbajo: orden[orden.length - 1] === "pb-pendiente",
    circGasti,
    cuentaGasti,
    veLasDos: filas.some((t) => t.includes("ZZ Uno es Flor")) && filas.some((t) => t.includes("ZZ Uno es Gasti")),
    // Esperando: donde no es el primero (Flor) y donde es el primero pero la
    // etapa es de espera (Próximo a desarrollar). En acción: Con Claude.
    marcaEs2:
      es2.some((t) => t.includes("ZZ Uno es Flor")) &&
      es2.some((t) => t.includes("ZZ Uno es Gasti")) &&
      sinMarca.some((t) => t.includes("ZZ Gasti en acción")),
    filtroLimpio: !state.filters.persona,
    a: a.id,
  };
});
check("el Planner de siempre tiene las 7 etapas", pbA.columnas === 7, pbA);
check("Planner B: Publicado arriba y Próximo a desarrollar abajo", pbA.lineaArriba && pbA.proximosAbajo, pbA);
const pub = await page.evaluate(async () => {
  const hace = (n) => isoOf(new Date(Date.now() - n * 86400000));
  const nueva = newCard("libre", "ZZ Publicada ayer", { estado: "finalizado" }),
    vieja = newCard("libre", "ZZ Publicada hace dos meses", { estado: "finalizado" });
  ((nueva.publicadaEl = hace(1)), (vieja.publicadaEl = hace(60)), state.cards.push(nueva, vieja));
  // Vieja retocada hoy y sin ninguna pista de cuándo se publicó: el último
  // cambio no cuenta, queda fuera de la vista. Otra con el movimiento en su
  // actividad: se asienta esa fecha.
  const retocada = newCard("libre", "ZZ Vieja retocada hoy", { estado: "finalizado" }),
    conRastro = newCard("libre", "ZZ Con rastro", { estado: "finalizado" });
  ((retocada.updatedAt = Date.now()), (retocada.actividad = []), delete retocada.publicadoEl, delete retocada.publicadaEl, delete conRastro.publicadaEl);
  conRastro.actividad = [{ ts: Date.now() - 45 * 86400000, autor: "x", texto: "pasó a En línea" }];
  state.cards.push(retocada, conRastro);
  const asentadas = asentarFechasPublicado();
  const asienta = conRastro.publicadaEl === hace(45) && !retocada.publicadaEl && asentadas >= 1;
  const ver = (sel) => [...document.querySelectorAll(sel)].map((x) => x.textContent).join("|");
  ((state.view = "plannerb"), render());
  const b = ver("#pb-finalizado .pb-fila"),
    bBoton = !!document.querySelector("#pb-finalizado .pub-hist-btn");
  ((state.view = "kanban"), render());
  const k = ver('.kcol-body[data-estado="finalizado"] .kcard'),
    nombre = ver(".kcol-head h3");
  document.querySelector('.kcol-body[data-estado="finalizado"] .pub-hist-btn').click();
  const hist = ver("#pubHistLista .pub-hist-item");
  const buscar = document.querySelector("#pubHistBuscar");
  ((buscar.value = "dos meses"), buscar.dispatchEvent(new Event("input", { bubbles: true })));
  const filtrado = ver("#pubHistLista .pub-hist-item");
  document.querySelector('#pubHistLista [data-id="' + vieja.id + '"]').click();
  await new Promise((r) => setTimeout(r, 50));
  const abre = $("#modal").classList.contains("hidden") && document.querySelector("#panel").classList.contains("open");
  closePanel();
  ((nueva.estado = "pendiente"), (vieja.estado = "pendiente"), (retocada.estado = "pendiente"), (conRastro.estado = "pendiente"));
  // Al pasarla a Publicado queda sellada con la fecha de hoy.
  const t = newCard("libre", "ZZ Recién publicada", { estado: "con-claude" });
  (state.cards.push(t), moverTarjetaAEstado(t, "finalizado"));
  const sello = t.publicadaEl === todayISO();
  (moverTarjetaAEstado(t, "pendiente"));
  return {
    plannerB: b.includes("ZZ Publicada ayer") && !b.includes("dos meses") && bBoton,
    plannerA: k.includes("ZZ Publicada ayer") && !k.includes("dos meses") && !k.includes("retocada") && !k.includes("Con rastro"),
    asienta,
    retocadaEnHistorico: hist.includes("ZZ Vieja retocada hoy"),
    nombre: /Publicado/.test(nombre) && !/En línea/.test(nombre),
    historico: hist.includes("ZZ Publicada ayer") && hist.includes("ZZ Publicada hace dos meses"),
    busca: filtrado.includes("dos meses") && !filtrado.includes("ayer"),
    abre,
    sello,
    sinSello: !t.publicadaEl,
  };
});
check("«En línea» ahora se llama «Publicado»", pub.nombre, pub);
const pestana = await page.evaluate(() => ({ titulo: document.title, icono: !!document.querySelector('link[rel="icon"][href^="data:image/svg"]') }));
check("la pestaña dice «Cotonetes Forever» y tiene su logo", /^(\(\d+\) )?Cotonetes Forever$/.test(pestana.titulo) && pestana.icono, pestana);
check("Publicado muestra solo lo de los últimos 30 días, en los dos Planners", pub.plannerA && pub.plannerB, pub);
check("«Todo lo publicado» tiene el histórico completo y se puede buscar", pub.historico && pub.busca, pub);
check("desde el histórico se abre la tarjeta", pub.abre, pub);
check("un retoque no la vuelve a mostrar: sin fecha de publicación queda solo en el histórico", pub.retocadaEnHistorico && pub.plannerA, pub);
check("las ya publicadas quedan con su fecha asentada (la de cuando pasaron)", pub.asienta, pub);
check("al pasar a Publicado se sella la fecha, y se borra si vuelve atrás", pub.sello && pub.sinSello, pub);
check("el número del círculo es el total de cada uno: en acción + esperando", pbA.circGasti === pbA.cuentaGasti, pbA);
check("al tocar un perfil se ven también las tarjetas donde espera su turno", pbA.veLasDos, pbA);
check("y esas se marcan como «esperando para hacer»", pbA.marcaEs2, pbA);
const accion = await page.evaluate(() => {
  ((state.userId = "gasti"), (state.view = "kanban"), render());
  const enPlanner = document.querySelectorAll(".kcard .tag-accion").length,
    esperadas = kanbanCards().filter((c) => enAccion(c) === "gasti").length;
  ((state.view = "plannerb"), render());
  const enB = document.querySelectorAll(".pb-fila .tag-accion").length;
  ((state.userId = null), render());
  return { enPlanner, enB, esperadas };
});
check("las tarjetas cerradas marcan «En acción» solo las que tengo en acción", accion.esperadas > 0 && accion.enPlanner === accion.esperadas && accion.enB === accion.esperadas, accion);
check("tocar el mismo perfil de nuevo vuelve a todo", pbA.filtroLimpio, pbA);
const antesMine = await page.evaluate((id) => {
  state.userId = "gasti";
  const r = mine(state.cards.find((c) => c.id === id));
  openDetail(id);
  return r;
}, pbA.a);
await page.waitForTimeout(200);
// Gasti sube del 2 al 1 con la flecha.
await page.click('#panel .eqo-i[data-persona="gasti"] [data-action="equipo:mover"][data-dir="-1"]');
await page.waitForTimeout(150);
const trasSubir = await page.evaluate((id) => {
  const t = state.cards.find((c) => c.id === id);
  return { orden: equipoDe(t), hist: (t.historial1 || []).map((h) => h.id), mine: mine(t) };
}, pbA.a);
// Se suma Vane al final y después, arrastrando, pasa a ser la primera.
await page.selectOption("#panel .eqo-sumar", "vane");
await page.waitForTimeout(150);
const trasSumar = await page.evaluate((id) => equipoDe(state.cards.find((c) => c.id === id)), pbA.a);
const gasti = await page.locator('#panel .eqo-i[data-persona="gasti"]').boundingBox();
await page.dragAndDrop('#panel .eqo-i[data-persona="vane"] .eqo-grip', '#panel .eqo-i[data-persona="gasti"]', {
  targetPosition: { x: 40, y: 4 },
});
await page.waitForTimeout(200);
const trasArrastrar = await page.evaluate((id) => equipoDe(state.cards.find((c) => c.id === id)), pbA.a);
await page.click('#panel .eqo-i[data-persona="flor"] [data-action="equipo:quitar"]');
await page.waitForTimeout(150);
const trasQuitar = await page.evaluate((id) => {
  const t = state.cards.find((c) => c.id === id);
  const r = { orden: equipoDe(t), numeros: document.querySelectorAll("#panel .eqo-n").length, filas: [...document.querySelectorAll("#panel .eqo-i")].map((li) => li.dataset.persona) };
  (closePanel(), (state.userId = null));
  return r;
}, pbA.a);
const roles = { antesMine, trasSubir, trasSumar, gasti: !!gasti, trasArrastrar, trasQuitar };
check("estar 2.º no cuenta como tarea tuya", roles.antesMine === false, roles);
check("subir al 2 lo hace responsable y el anterior pasa a 2", JSON.stringify(roles.trasSubir.orden) === '["gasti","flor"]', roles);
check("queda anotado quién fue 1", JSON.stringify(roles.trasSubir.hist) === '["flor","gasti"]', roles);
check("y ahora sí le cuenta", roles.trasSubir.mine === true, roles);
check("sumar a alguien lo pone último", JSON.stringify(roles.trasSumar) === '["gasti","flor","vane"]', roles);
check("arrastrando se cambia el orden", JSON.stringify(roles.trasArrastrar) === '["vane","gasti","flor"]', roles);
check("sacar a alguien corre a los demás, en orden y sin números", JSON.stringify(roles.trasQuitar.orden) === '["vane","gasti"]' && roles.trasQuitar.filas.join() === "vane,gasti" && roles.trasQuitar.numeros === 0, roles);

// ── El tipo como cartelito, en los dos Planners ──
const stickers = await page.evaluate(() => {
  ((state.view = "kanban"), render());
  const k = document.querySelectorAll(".kcard .tipo-sticker").length === document.querySelectorAll(".kcard").length;
  ((state.view = "plannerb"), render());
  const b = document.querySelectorAll(".pb-fila .tipo-sticker").length === document.querySelectorAll(".pb-fila").length;
  const video = tipoStickerHTML({ tipo: "video" });
  return { k, b, video: /Video/.test(video) && /--tipo:#D71E50/.test(video) };
});
check("cada tarjeta lleva su tipo como cartelito, en los dos Planners", stickers.k && stickers.b && stickers.video, stickers);

// ── Hace cuánto está en test ──
const enTest = await page.evaluate(() => {
  const hace = (n) => isoOf(new Date(Date.now() - n * 86400000));
  const a = newCard("libre", "ZZT Diez días", { estado: "en-revision" }),
    b = newCard("libre", "ZZT Por la actividad", { estado: "en-revision" });
  a.revisionDesde = hace(10);
  delete b.revisionDesde;
  b.actividad = [{ ts: Date.now() - 20 * 86400000, autor: "x", texto: "pasó a En test – esperando aprobación" }];
  state.cards.push(a, b);
  asentarFechasPublicado();
  ((state.view = "plannerb"), render());
  const fila = (id) => document.querySelector('.pb-fila[data-id="' + id + '"] .tag-test');
  const fa = fila(a.id), fb = fila(b.id),
    espera = (document.querySelector("#pb-en-revision .pb-espera") || {}).textContent || "";
  ((state.view = "kanban"), render());
  const k = document.querySelector('.kcard[data-id="' + a.id + '"] .tag-test');
  const r = {
    a: fa && fa.textContent, aOjo: fa && fa.classList.contains("ojo"),
    b: fb && fb.textContent, bMal: fb && fb.classList.contains("mal"),
    sello: b.revisionDesde === hace(20),
    kanban: k && k.textContent,
    espera,
  };
  [a, b].forEach((c) => (c.activo = false));
  return r;
});
check("en test se ve hace cuántos días espera, en los dos Planners", /hace 10 días/.test(enTest.a) && enTest.aOjo && /hace 10 días/.test(enTest.kanban), enTest);
check("al costado de la etapa dice cuánto espera la más vieja", /la más vieja: \d+ días/.test(enTest.espera), enTest);
check("pasadas las dos semanas se marca en rojo, y la fecha sale de la actividad si no estaba", /hace 20 días/.test(enTest.b) && enTest.bMal && enTest.sello, enTest);

// ── Alertas y vencidas de Inicio: solo lo tuyo en acción ──
const alertasFlor = await page.evaluate(() => {
  const hace = isoOf(new Date(Date.now() - 5 * 86400000));
  const deFlor = newCard("libre", "ZZA Vencida de Flor", { estado: "en-desarrollo", fin: hace }),
    deGasti = newCard("libre", "ZZA Vencida de Gasti", { estado: "en-desarrollo", fin: hace }),
    esperando = newCard("libre", "ZZA Flor esperando", { estado: "en-desarrollo", fin: hace });
  ((deFlor.responsable = "flor"), (deGasti.responsable = "gasti"), (esperando.responsable = "gasti"), (esperando.asignados = ["flor"]));
  state.cards.push(deFlor, deGasti, esperando);
  ((state.userId = "flor"), (state.view = "inicio"), render());
  const titulos = computeAlerts().map((a) => a.c.titulo);
  const boton = document.querySelector(".ini-alerta.mal"),
    numero = boton ? parseInt(boton.textContent, 10) : 0,
    esperadas = boardCards().filter((c) => isOverdue(c) && enAccion(c) === "flor").length;
  boton && boton.click();
  const enPlanner = kanbanCards().map((c) => c.titulo);
  ((state.quick = ""), (state.userId = null), (state.view = "inicio"), render());
  [deFlor, deGasti, esperando].forEach((c) => (c.activo = false));
  return { titulos, numero, esperadas, enPlanner };
});
check("las alertas son solo de lo que uno tiene en acción", alertasFlor.titulos.includes("ZZA Vencida de Flor") && !alertasFlor.titulos.includes("ZZA Vencida de Gasti") && !alertasFlor.titulos.includes("ZZA Flor esperando"), alertasFlor);
check("«N vencidas» de Inicio cuenta solo las tuyas y lleva a esas", alertasFlor.numero === alertasFlor.esperadas && alertasFlor.enPlanner.includes("ZZA Vencida de Flor") && !alertasFlor.enPlanner.includes("ZZA Vencida de Gasti"), alertasFlor);

// ── Orden libre: alfabético de entrada, después donde uno la suelte ──
await page.evaluate(() => {
  ((state.filters = { persona: "", tipo: "", sector: "", estado: "", texto: "", cursoEstado: "" }), (state.quick = ""), (state.mis = false), (state.userId = null));
  for (const t of ["ZZO Cigüeña", "ZZO Árbol", "ZZO Barco"]) state.cards.push(newCard("libre", t, { estado: "en-desarrollo" }));
  ((state.view = "kanban"), render());
});
const ordTitulos = (sel) => page.evaluate((sel) => [...document.querySelectorAll(sel)].map((e) => (e.querySelector("b, .kcard-title, h4") || e).textContent).filter((t) => t.includes("ZZO")).map((t) => t.match(/ZZO \S+/)[0]), sel);
const ordInicial = await ordTitulos('.kcol-body[data-estado="en-desarrollo"] .kcard');
const colTitulos = await page.evaluate(() => [...document.querySelectorAll('.kcol-body[data-estado="en-desarrollo"] .kcard')].map((e) => state.cards.find((c) => c.id === e.dataset.id).titulo));
const idDe = (t) => page.evaluate((t) => state.cards.find((c) => c.titulo === t).id, t);
const [idA, idC] = [await idDe("ZZO Árbol"), await idDe("ZZO Cigüeña")];
// Arrastre a mano (bajar, mover, soltar): dragAndDrop() desplaza la página
// hacia el destino a mitad del gesto y suelta sobre la misma tarjeta.
const arrastrar = async (desde, hasta) => {
  await page.evaluate((sel) => document.querySelector(sel).scrollIntoView({ block: "center", behavior: "instant" }), hasta);
  await page.waitForTimeout(100);
  const a = await page.locator(desde).boundingBox(),
    b = await page.locator(hasta).boundingBox();
  await page.mouse.move(a.x + 30, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(b.x + 30, b.y + 6, { steps: 8 });
  await page.mouse.move(b.x + 32, b.y + 4, { steps: 2 });
  await page.mouse.up();
};
await arrastrar('.kcard[data-id="' + idC + '"]', '.kcard[data-id="' + idA + '"]');
await page.waitForTimeout(200);
const ordTrasMover = await ordTitulos('.kcol-body[data-estado="en-desarrollo"] .kcard');
await page.evaluate(() => ((state.view = "plannerb"), render()));
const ordEnB = await ordTitulos("#pb-en-desarrollo .pb-fila");
// En el Planner B también se arrastra, y a otra etapa.
const filaRev = await page.evaluate(() => [...document.querySelectorAll("#pb-diseno-listo .pb-fila")].pop().dataset.id);
await arrastrar('.pb-fila[data-id="' + idA + '"]', '.pb-fila[data-id="' + filaRev + '"]');
await page.waitForTimeout(200);
const ordOtra = await page.evaluate((id) => {
  const t = state.cards.find((c) => c.id === id);
  const filas = [...document.querySelectorAll("#pb-diseno-listo .pb-fila")].map((f) => f.dataset.id);
  return { estado: t.estado, primera: filas[filas.length - 2] === id, sort: state.sort };
}, idA);
await page.evaluate(() => state.cards.filter((c) => /^ZZO /.test(c.titulo)).forEach((c) => (c.activo = false)));
const orden = { ordInicial, colTitulos, ordTrasMover, ordEnB, ordOtra };
check("cada columna arranca en orden alfabético", ordInicial.join() === "ZZO Árbol,ZZO Barco,ZZO Cigüeña" && colTitulos.every((t, i, l) => !i || l[i - 1].localeCompare(t, "es", { sensitivity: "base", numeric: true }) <= 0), orden);
check("arrastrando una tarjeta queda donde se la suelta", ordTrasMover.join() === "ZZO Cigüeña,ZZO Árbol,ZZO Barco", orden);
check("el Planner B muestra el mismo orden", ordEnB.join() === "ZZO Cigüeña,ZZO Árbol,ZZO Barco", orden);
check("en el Planner B se arrastra también, incluso a otra etapa", ordOtra.estado === "diseno-listo" && ordOtra.primera && ordOtra.sort === "manual", orden);

// ── La regla de las etapas: en espera nadie está en acción ──
const reglas = await page.evaluate(() => {
  state.userId = "flor";
  const t = newCard("libre", "ZZ regla de etapas", { estado: "en-revision" });
  ((t.responsable = "flor"), state.cards.push(t));
  const enRevision = { mine: mine(t), accion: enAccion(t), tag: enAccionTagHTML(t) !== "" };
  openDetail(t.id);
  const nota = (document.querySelector("#panel .eqo-nota") || {}).textContent || "";
  closePanel();
  const resto = ["pendiente", "stand-by", "finalizado"].map((e) => ((t.estado = e), mine(t) || enAccion(t) !== ""));
  t.estado = "con-claude";
  const trabajando = { mine: mine(t), accion: enAccion(t), tag: enAccionTagHTML(t) !== "" };
  // Tarjeta vieja: alguien en asignados pero sin responsable guardado.
  const vieja = newCard("libre", "ZZ tarjeta vieja", { estado: "en-desarrollo" });
  ((vieja.responsable = null), (vieja.asignados = ["vane", "gasti"]), state.cards.push(vieja));
  const acomodadas = normalizarEquipos();
  state.userId = null;
  return { enRevision, nota, resto, trabajando, vieja: { r: vieja.responsable, a: vieja.asignados, n: acomodadas } };
});
check("en «En test» nadie está en acción: no suma a pendientes ni lleva ⚡", !reglas.enRevision.mine && !reglas.enRevision.accion && !reglas.enRevision.tag, reglas);
check("y la ficha dice por qué", /esperando la aprobación del sector/.test(reglas.nota), reglas);
check("tampoco en Próximo a desarrollar, Stand by ni En línea", reglas.resto.every((x) => x === false), reglas);
check("al pasar a una etapa de trabajo, el primero queda en acción", reglas.trabajando.mine && reglas.trabajando.accion === "flor" && reglas.trabajando.tag, reglas);
const pend = await page.evaluate(() => {
  state.userId = "flor";
  const res = {};
  for (const v of ["kanban", "plannerb"]) {
    (pendAlternar(false), (state.view = v), render());
    document.querySelector(".pend-fab").click();
    const titulos = [...document.querySelectorAll("#pendPop .pend-i .pend-t")].map((x) => x.textContent);
    res[v] = {
      numero: +document.querySelector(".pend-fab b").textContent,
      titulos,
      esperadas: boardCards().filter((c) => enAccion(c) === "flor").map((c) => c.titulo).sort(),
      abierto: !document.querySelector("#pendPop").classList.contains("hidden"),
    };
  }
  const sinRuleta = !document.querySelector(".roulette-fab, #roulettePop");
  ((state.userId = null), render());
  return { res, sinRuleta };
});
check(
  "«Mis pendientes» lista solo lo que tengo en acción, en los dos Planner",
  ["kanban", "plannerb"].every((v) => {
    const r = pend.res[v];
    return r.abierto && r.numero === r.esperadas.length && JSON.stringify(r.titulos.slice().sort()) === JSON.stringify(r.esperadas) && r.titulos.length > 0;
  }),
  pend,
);
check("la ruleta de «¿Qué curso me toca?» ya no está", pend.sinRuleta, pend);
const repTab = await page.evaluate(() => {
  ((state.view = "reportes"), render());
  const abiertas = boardCards().filter((c) => c.estado !== "finalizado");
  const filas = [...document.querySelectorAll(".rep-persona")].map((b) => {
    const id = b.dataset.id,
      txt = b.querySelector(".rep-persona-c").textContent;
    return {
      ok:
        +txt.match(/(\d+) en acción/)[1] === abiertas.filter((c) => enAccion(c) === id).length &&
        +txt.match(/(\d+) esperando/)[1] === abiertas.filter((c) => participa(c, id) && enAccion(c) !== id).length,
      id,
    };
  });
  const etapas = [...document.querySelectorAll(".rep-flujo .pb-flujo-s")].length;
  document.querySelector('.rep-persona[data-id="flor"]').click();
  const tras = { view: state.view, persona: state.filters.persona };
  ((state.filters.persona = ""), (state.view = "reportes"), render());
  return { filas, etapas, tras };
});
check("Reportes: «Cada uno» cuenta en acción y esperando con la regla del Planner", repTab.filas.length > 0 && repTab.filas.every((f) => f.ok) && repTab.etapas === 6, repTab);
check("y tocar una persona lleva al Planner B filtrado", repTab.tras.view === "plannerb" && repTab.tras.persona === "flor", repTab);
check("una tarjeta vieja con asignados y sin responsable pasa a tener al primero", reglas.vieja.r === "vane" && reglas.vieja.a.join() === "gasti" && reglas.vieja.n >= 1, reglas);
const perfil = await page.evaluate(async () => {
  const eve = member("eve"),
    antes = { emoji: eve.emoji, nombre: eve.nombre };
  ((state.userId = "eve"), (state.mailSinEquipo = ""), delete eve.emoji, delete state.perfiles.eve);
  state.perfiles.vane = { emoji: "🌵", nombre: member("vane").nombre, ts: 5 };
  aplicarPerfiles();
  pedirPerfilSiFalta();
  const abierto = !!document.querySelector("#modal .perfil-obligatorio");
  closeModal();
  const sigue = !!document.querySelector("#modal .perfil-obligatorio");
  const tomado = document.querySelector('.perfil-em[data-emoji="🌵"]').disabled;
  document.querySelector('.perfil-em[data-emoji="🐙"]').click();
  document.querySelector("#perfilNombre").value = "Evita";
  document.querySelector('[data-action="perfil:guardar"]').click();
  await new Promise((r) => setTimeout(r, 100));
  const tras = { emoji: member("eve").emoji, nombre: member("eve").nombre, cerrado: !document.querySelector("#modal .perfil"), avatar: avatarHTML("eve").includes("🐙") };
  // Dos pantallas eligiendo a la vez: gana el más nuevo de cada persona y nadie pisa al otro.
  const mezcla = mezclarPerfiles({ eve: { emoji: "🐙", ts: 10 }, vane: { emoji: "🌵", ts: 1 } }, { eve: { emoji: "🦄", ts: 5 }, flor: { emoji: "🌸", ts: 3 } });
  // dejar todo como estaba
  ((state.perfiles = {}), delete member("eve").emoji, delete member("vane").emoji, (member("eve").nombre = antes.nombre), (state.userId = null), render());
  return { abierto, sigue, tomado, tras, mezcla: [mezcla.eve.emoji, mezcla.vane.emoji, mezcla.flor.emoji] };
});
check("el primer ingreso pide el emoji y no se puede saltear", perfil.abierto && perfil.sigue, perfil);
check("el emoji de otra persona no se puede elegir", perfil.tomado === true, perfil);
check("guardar deja el emoji y el nombre elegidos en toda la app", perfil.tras.emoji === "🐙" && perfil.tras.nombre === "Evita" && perfil.tras.cerrado && perfil.tras.avatar, perfil);
check("los perfiles se mezclan por persona, sin pisarse", JSON.stringify(perfil.mezcla) === JSON.stringify(["🐙", "🌵", "🌸"]), perfil);

// ── El checklist no te manda arriba de la tarjeta ──
console.log("\nchecklist sin saltos");
const chkId = await page.evaluate(() => {
  closeModal();
  const t = newCard("curso", "ZZ checklist largo", {});
  t.checklist = Array.from({ length: 10 }, (_, i) => ({ id: "zzc" + i, text: "Paso " + i, done: false }));
  (state.cards.push(t), (state.view = "kanban"), render(), openDetail(t.id));
  return t.id;
});
await page.waitForTimeout(300);
await page.evaluate(() => document.querySelector('#panel [data-acc="checklist"] [data-action="cl:add"]').scrollIntoView({ block: "center" }));
const chkAntesChk = await page.evaluate(() => document.querySelector("#panel .panel-body").scrollTop);
await page.click('#panel [data-action="cl:toggle"][data-cl="zzc5"]');
await page.waitForTimeout(200);
const chkTrasTachar = await page.evaluate(() => ({
  scroll: document.querySelector("#panel .panel-body").scrollTop,
  abierto: document.querySelector('#panel [data-acc="checklist"]').open,
}));
await page.click('#panel [data-action="cl:add"]');
await page.waitForTimeout(200);
const chkTrasSumar = await page.evaluate(() => ({
  scroll: document.querySelector("#panel .panel-body").scrollTop,
  foco: (document.activeElement && document.activeElement.dataset && document.activeElement.dataset.field) || "",
  abierto: document.querySelector('#panel [data-acc="checklist"]').open,
}));
await page.evaluate(() => closePanel());
check("tachar un ítem deja la tarjeta donde estaba", chkAntesChk > 100 && Math.abs(chkTrasTachar.scroll - chkAntesChk) < 5 && chkTrasTachar.abierto, { chkAntesChk, chkTrasTachar });
check("sumar un ítem no te manda arriba y deja el cursor en el nuevo", chkTrasSumar.scroll > 100 && /^cl:/.test(chkTrasSumar.foco) && chkTrasSumar.abierto, chkTrasSumar);

// ── La 🎰 en la esquina de Inicio ──
await page.setViewportSize({ width: 1366, height: 768 });
const esquina = await page.evaluate(() => {
  ((state.view = "inicio"), render());
  const b = document.querySelector(".cotofrase-fab").getBoundingClientRect(),
    g = document.querySelector(".hub-grid").getBoundingClientRect();
  return {
    aLaDerecha: Math.round(b.left - g.right),
    centro: Math.round(b.top + b.height / 2 - (g.top + g.height / 2)),
  };
});
await page.setViewportSize({ width: 1400, height: 950 });
check("en Inicio la 🎰 queda a la derecha de las tarjetas, centrada con ellas", esquina.aLaDerecha > 0 && Math.abs(esquina.centro) < 40, esquina);
// La máquina se abre al centro de la pantalla, entera.
await page.click(".cotofrase-fab");
await page.waitForTimeout(150);
const cfModal = await page.evaluate(() => {
  const m = document.querySelector("#modal .modal.cotofrase-modal"),
    r = m && m.getBoundingClientRect();
  const fuera = r && (r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth);
  const res = { hay: !!m, slot: !!(m && m.querySelector(".slot-widget")), centrado: r ? Math.abs(r.left + r.width / 2 - innerWidth / 2) < 4 : false, fuera };
  closeModal();
  return res;
});
check("la CotoFrase se abre en una ventana central, sin cortarse", cfModal.hay && cfModal.slot && cfModal.centrado && !cfModal.fuera, cfModal);
// La barra de arriba en una sola fila, también en 1536 (Full HD al 125%).
const barraFila = [];
for (const w of [1280, 1366, 1470, 1536, 1600, 1920]) {
  await page.setViewportSize({ width: w, height: 800 });
  await page.waitForTimeout(80);
  barraFila.push(await page.evaluate(() => ({ w: innerWidth, alto: Math.round(document.querySelector(".topbar").getBoundingClientRect().height), ancho: document.documentElement.scrollWidth })));
}
await page.setViewportSize({ width: 1400, height: 950 });
check("la barra de arriba va en una sola fila de 1280 a 1920", barraFila.every((b) => b.alto < 80 && b.ancho <= b.w), barraFila);
// Y al pasar de Inicio al Planner, «Mis pendientes» no hereda ese lugar: va a la derecha.
const pendLugar = await page.evaluate(() => {
  ((state.view = "inicio"), render(), (state.view = "kanban"), render());
  const b = document.querySelector(".pend-fab").getBoundingClientRect();
  return { derecha: Math.round(innerWidth - b.right) };
});
check("«Mis pendientes» queda pegado a la derecha aunque vengas de Inicio", pendLugar.derecha < 40, pendLugar);

// ── El chat del equipo ──
console.log("\nchat del equipo");
await page.evaluate(() => { if (!document.querySelector("#chatBtn")) chatArrancar(); closeModal(); });
const hayBoton = await page.evaluate(() => !!document.querySelector("#chatBtn") && document.querySelector("#chatPanel").hidden);
await page.click("#chatBtn");
// Arranca en Movimientos: lo que se movió en el tablero, sin que nadie avise.
const novedades = await page.evaluate(() => {
  const t = state.cards.find((c) => /^ZZ /.test(c.titulo) && !isInventory(c)) || boardCards()[0];
  moverTarjetaAEstado(t, t.estado === "con-claude" ? "en-revision" : "con-claude");
  render();
  return {
    tab: document.querySelector("#chatTabMov").classList.contains("on"),
    sinCaja: document.querySelector("#chatForm").hidden,
    titulo: t.titulo,
    primero: (document.querySelector("#chatLista .mov") || {}).textContent || "",
  };
});
check("las novedades arrancan en Movimientos, sin caja para escribir", novedades.tab && novedades.sinCaja, novedades);
check("un movimiento del tablero aparece arriba de todo", novedades.primero.includes(novedades.titulo) && /pasó a/.test(novedades.primero), novedades);
await page.click("#chatTabMsj");
await page.fill("#chatTexto", "ZZ hola equipo");
await page.press("#chatTexto", "Enter");
await page.waitForTimeout(1500);
const enviado = await page.evaluate(async () => {
  const remoto = await Store.remote(CHAT_FILA);
  return {
    abierto: !document.querySelector("#chatPanel").hidden,
    enPantalla: document.querySelector("#chatLista").textContent.includes("ZZ hola equipo"),
    guardado: !!remoto && (remoto.mensajes || []).some((m) => m.texto === "ZZ hola equipo"),
    vacio: document.querySelector("#chatTexto").value === "",
  };
});
const otro = await page.evaluate(async () => {
  chatAlternar(false);
  const remoto = await Store.remote(CHAT_FILA);
  await Store.save({ mensajes: (remoto.mensajes || []).concat({ id: "zz-flor", autor: "flor", nombre: "Flor", texto: "ZZ dale!", ts: Date.now() + 1000 }) }, false, CHAT_FILA);
  await chatTraer(true);
  chatPintar();
  const badge = document.querySelector("#chatBadge"),
    conAviso = !badge.hidden && badge.textContent === "1";
  chatElegirTab("msj");
  chatAlternar(true);
  const leido = badge.hidden;
  chatAlternar(false);
  const mezcla = mezclarChat([{ id: "a", ts: 1 }, { id: "b", ts: 3 }], [{ id: "c", ts: 2 }, { id: "a", ts: 1 }]).map((m) => m.id).join("");
  return { conAviso, leido, mezcla };
});
check("hay un globito de chat en todas las vistas", hayBoton, { hayBoton });
check("lo que escribo aparece y queda guardado para el equipo", enviado.abierto && enviado.enPantalla && enviado.guardado && enviado.vacio, enviado);
check("un mensaje de otra persona suma al contador de no leídos", otro.conAviso, otro);
check("y al abrir el chat queda leído", otro.leido, otro);
check("si dos escriben a la vez no se pisan", otro.mezcla === "acb", otro);

// Dejar el tablero como estaba para que nada de esto ensucie lo que sigue.
await page.evaluate(() => {
  ((state.tecnico = state.tecnico.filter((f) => !/^zz-/.test(f.id) && !/^ZZ /.test(f.curso || ""))),
    (state.moodle = null),
    (state.cards = state.cards.filter((c) => !/^ZZ /.test(c.titulo))),
    (state.tecFiltro = ""),
    (state.tecSubView = "grilla"),
    parInvalidar());
});

// En el teléfono el encabezado va en una sola fila: con el nombre al lado del
// avatar se partía en dos y se comía 109 px fijos arriba de la pantalla.
await page.setViewportSize({ width: 360, height: 780 });
await page.evaluate(() => ((state.view = "inicio"), render()));
await page.waitForTimeout(300);
const celu = await page.evaluate(() => ({
  alto: Math.round(document.querySelector(".topbar").getBoundingClientRect().height),
  ancho: document.documentElement.scrollWidth,
  aviso: !!document.querySelector('[data-action="agendaAviso:cerrar"]'),
}));
check("en el teléfono el encabezado entra en una fila", celu.alto < 70 && celu.ancho <= 360, celu);
check("el aviso viejo de la Agenda ya no aparece en Inicio", !celu.aviso, celu);
// Y en las pantallas de oficina (1366 y 1280), con las ocho pestañas, la
// barra de arriba también entra en una fila.
const oficina = [];
for (const ancho of [1366, 1280]) {
  await page.setViewportSize({ width: ancho, height: 768 });
  await page.waitForTimeout(150);
  oficina.push(await page.evaluate(() => Math.round(document.querySelector(".topbar").getBoundingClientRect().height)));
}
check("en 1366 y 1280 la barra de arriba entra en una fila", oficina.every((h) => h < 80), oficina);
await page.setViewportSize({ width: 1400, height: 950 });

await browser.close();
await backend.stop();
const fallan = resultados.filter((r) => !r.ok);
console.log(
  `\n${resultados.length - fallan.length}/${resultados.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.nombre).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
