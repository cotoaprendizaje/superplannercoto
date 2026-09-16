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
  c.comentarios = [
    { id: "m1", autor: TEAM[0].nombre, texto: "uno", ts: hs(50) },
    { id: "m2", autor: (TEAM[1] || TEAM[0]).nombre, texto: "dos", ts: hs(30) },
    { id: "m3", autor: (TEAM[2] || TEAM[0]).nombre, texto: "tres", ts: hs(20) },
    { id: "m4", autor: (TEAM[1] || TEAM[0]).nombre, texto: "cuatro", ts: hs(3) },
    { id: "m5", autor: TEAM[0].nombre, texto: "cinco", ts: hs(1) },
  ];
  ((c.actividad = [{ ts: hs(60), autor: "Vivi", texto: "creada" }]), state.cards.push(c), render());
  return c.id;
});
await page.evaluate((i) => openDetail(i), idTarjeta);
await page.waitForTimeout(700);
const sec = await page.evaluate(() => {
  const s = document.querySelector('[data-acc="mensajes"]'),
    orden = [...document.querySelectorAll("#panel details[data-acc]")].map((d) => d.dataset.acc);
  return {
    existe: !!s,
    abierta: !!(s && s.open),
    justoDespuesDeDatos: orden[0] === "datos" && orden[1] === "mensajes",
    titulo: s ? s.querySelector("summary").textContent.replace(/\s+/g, " ").trim() : "",
    aLaVista: document.querySelectorAll("#panel .msg").length,
    conAvatar: document.querySelectorAll("#panel .msg .avatar").length,
    autores: [...document.querySelectorAll("#panel .msg-h b")].map((b) => b.textContent),
    botonMas: (document.querySelector(".msg-mas") || {}).textContent || "",
  };
});
(check("hay una sección de mensajes propia y abierta", sec.existe && sec.abierta, sec),
  check("y está arriba, pegada a Datos", sec.justoDespuesDeDatos === true, sec),
  check("el título dice cuántos hay", /Mensajes · 5/.test(sec.titulo), sec),
  check("muestra solo los 3 últimos, no los 5", sec.aLaVista === 3, sec),
  check("y ofrece ver los anteriores", /Ver los 2 anteriores/.test(sec.botonMas), sec),
  check("cada mensaje dice quién lo escribió", sec.autores.length === 3 && sec.autores.every(Boolean), sec),
  check("con la cara de esa persona al lado", sec.conAvatar === 3, sec));

await page.click(".msg-mas");
await page.waitForTimeout(400);
check(
  "al desplegar aparecen los cinco",
  (await page.evaluate(() => document.querySelectorAll("#panel .msg").length)) === 5,
);

// Escribir uno, con el atajo.
await page.click("#cmtInput");
await page.keyboard.type("MENSAJE DE PRUEBA");
await page.keyboard.press("Control+Enter");
await page.waitForTimeout(700);
const tras = await page.evaluate(() => {
  const c = state.cards.find((x) => x.titulo === "TARJETA CON CONVERSACIÓN");
  return {
    guardados: c.comentarios.length,
    autorDelUltimo: c.comentarios[c.comentarios.length - 1].autor,
    yo: state.user,
    primeroEnPantalla: (document.querySelector("#panel .msg-t") || {}).textContent.trim(),
    aLaVista: document.querySelectorAll("#panel .msg").length,
    actividad: (document.querySelector('[data-acc="actividad"]') || {}).textContent || "",
  };
});
(check("Ctrl+Enter envía el mensaje", tras.guardados === 6, tras),
  check("queda firmado con quien lo escribió", tras.autorDelUltimo === tras.yo, tras),
  check("y aparece primero, sin tener que buscarlo", tras.primeroEnPantalla === "MENSAJE DE PRUEBA", tras),
  check("al enviar vuelve a mostrar solo los últimos 3", tras.aLaVista === 3, tras),
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
  (await page.evaluate(() => document.querySelectorAll("#panel .msg").length)) === 3,
);
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

await browser.close();
await backend.stop();
const fallan = resultados.filter((r) => !r.ok);
console.log(
  `\n${resultados.length - fallan.length}/${resultados.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.nombre).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
