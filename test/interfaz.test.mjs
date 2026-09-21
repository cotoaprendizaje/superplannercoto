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

// El embudo de una columna: se abre, lista los valores reales con cuántas
// filas tiene cada uno, y al marcar uno la tabla queda con esas filas.
// El encabezado de la grilla se queda a la vista al scrollear: el contenedor
// ya era el que scrolleaba (lo obliga el scroll horizontal de las once
// columnas) pero medía los 8700 px de la tabla entera, así que el encabezado
// se pegaba a un borde que nunca se movía y se iba con la página.
const grilla = await page.evaluate(() => {
  const w = document.querySelector(".tec-table-wrap");
  return { caja: w.clientHeight, tabla: w.scrollHeight, ventana: window.innerHeight };
});
(check("la grilla scrollea adentro de su propia caja", grilla.caja < grilla.tabla, grilla),
  check("y esa caja no es más alta que la ventana", grilla.caja <= grilla.ventana, grilla));
await page.evaluate(() => window.scrollTo(0, 99999));
await page.waitForTimeout(400);
const pegado = await page.evaluate(() => {
  const th = document.querySelector(".tec-head-c th"),
    barra = document.querySelector(".topbar");
  if (!th) return { sinEncabezado: true };
  const r = th.getBoundingClientRect(),
    piso = barra ? barra.getBoundingClientRect().bottom - 2 : 0;
  return { top: Math.round(r.top), piso: Math.round(piso), visible: r.top >= piso && r.top < window.innerHeight };
});
check("el encabezado con los embudos sigue a la vista con la página abajo de todo", pegado.visible === true, pegado);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

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

await browser.close();
await backend.stop();
const fallan = resultados.filter((r) => !r.ok);
console.log(
  `\n${resultados.length - fallan.length}/${resultados.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.nombre).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
