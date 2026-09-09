// Pruebas del ingreso con cuenta propia.
//
// Hasta ahora la pantalla de entrada era un cartelito: se escribía un nombre y
// se pasaba. Lo que protegía los datos no era eso —no protegía nada— sino la
// política de la base, que estaba abierta: cualquiera con el link podía leer y
// borrar todo el inventario de capacitación.
//
// Ahora se entra con una cuenta de verdad y la base solo le contesta a quien
// manda una sesión válida. Estas pruebas fijan las dos mitades: que sin sesión
// no se ve nada, y que con sesión se trabaja normal aunque el token venza en
// el medio de la jornada.

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

const backend = await startFakeBackend(8473);
const browser = await chromium.launch({ executablePath: rutaChromium() });

async function abrir() {
  const page = await browser.newPage({ serviceWorkers: "block", viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (e) => console.log("  [ingreso] error de página:", e.message));
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
  return page;
}

async function entrar(page, email, clave) {
  (await page.fill("#gateMail", email), await page.fill("#gatePassInput", clave || CLAVE));
  await page.click('#gate button:has-text("Entrar")');
}

const listo = (page, ms = 30000) => page.waitForFunction(() => state?.ready === true, { timeout: ms });
const texto = (page) => page.evaluate(() => document.body.innerText);

// ── Sin entrar no se baja nada ────────────────────────────────────────────
console.log("\nsin sesión");
let page = await abrir();
await page.waitForTimeout(2500);
let estado = await page.evaluate(() => ({
  lista: !!(window.state && state.ready),
  tarjetas: (window.state && state.cards && state.cards.length) || 0,
  gateVisible: !document.querySelector("#gate").classList.contains("hidden"),
}));
(check("no se declara lista sin sesión", estado.lista === false, estado),
  check("no baja ninguna tarjeta sin sesión", estado.tarjetas === 0, estado),
  check("muestra la pantalla de ingreso", estado.gateVisible === true));

// La contraseña equivocada no entra, y lo dice en castellano.
await entrar(page, "dami@coto.com.ar", "loquesea");
await page.waitForTimeout(1500);
const malaClave = await page.evaluate(() => ({
  msg: (document.querySelector("#gateMsg") || {}).textContent || "",
  lista: !!(window.state && state.ready),
}));
(check("con la contraseña mal no entra", malaClave.lista === false),
  check("explica el error sin jerga", /no coinciden/i.test(malaClave.msg), malaClave.msg),
  check("no deja el mensaje en inglés de Supabase", !/invalid login/i.test(malaClave.msg), malaClave.msg));

// ── Con la cuenta correcta entra y carga ──────────────────────────────────
console.log("\ncon la cuenta correcta");
await entrar(page, "dami@coto.com.ar", CLAVE);
await listo(page);
await page.waitForTimeout(1500);
const dentro = await page.evaluate(() => ({
  tarjetas: state.cards.length,
  gateOculto: document.querySelector("#gate").classList.contains("hidden"),
  usuario: state.user,
}));
(check("entra y carga el tablero", dentro.tarjetas > 0 && dentro.gateOculto === true, dentro),
  check("queda identificada", !!dentro.usuario, dentro));

// El pedido va con el token de la persona, no con la clave pública del proyecto.
const auth = await page.evaluate(async () => {
  let visto = null;
  const orig = window.fetch;
  window.fetch = function (u, o) {
    const h = (o && o.headers) || {};
    if (String(u).includes("/rest/v1/")) visto = h.Authorization || h.authorization || "";
    return orig.apply(this, arguments);
  };
  await Store.rev();
  return (window.fetch = orig), visto;
});
(check("los pedidos viajan con el token de la sesión", /^Bearer acc-/.test(auth || ""), auth),
  check("ya no viaja la clave pública como identidad", !/sb_publishable/.test(auth || ""), auth));

// ── La sesión sobrevive a recargar ────────────────────────────────────────
await page.reload();
await listo(page);
check("al recargar no vuelve a pedir la contraseña", true);

// ── Salir cierra de verdad ────────────────────────────────────────────────
await page.evaluate(() => cerrarSesion());
await page.waitForSelector("#gateMail", { timeout: 15000 });
await page.waitForTimeout(1200);
const trasSalir = await page.evaluate(() => ({
  lista: !!(window.state && state.ready),
  guardada: !!localStorage.getItem("cf.sesion.v1"),
}));
(check("salir borra la sesión guardada", trasSalir.guardada === false, trasSalir),
  check("después de salir hay que volver a entrar", trasSalir.lista === false, trasSalir));
await page.close();

// ── Con la base cerrada, sin sesión no se lee nada ────────────────────────
console.log("\ncon la base cerrada (políticas RLS)");
backend.exigirSesion(true);
page = await abrir();
const sinSesion = await page.evaluate(async () => {
  // Lo que haría alguien de afuera con solo el link y lo que ve en el código.
  const r = await fetch(BACKEND.supabaseUrl + "/rest/v1/planner?select=*", {
    headers: { apikey: BACKEND.supabaseKey, Authorization: "Bearer " + BACKEND.supabaseKey },
  });
  return r.status;
});
check("con solo la clave pública la base no contesta", sinSesion === 401, sinSesion);

await entrar(page, "vivi@coto.com.ar", CLAVE);
await listo(page);
await page.waitForTimeout(1200);
check("con sesión válida sí se puede trabajar", (await page.evaluate(() => state.cards.length)) > 0);

// ── El mail decide quién es del equipo ────────────────────────────────────
console.log("\nquién es quién");
const quien = await page.evaluate(() => ({ user: state.user, id: state.userId, sinEquipo: state.mailSinEquipo }));
check(
  "sin el mail cargado en el equipo, entra igual pero avisa",
  quien.sinEquipo === "vivi@coto.com.ar" && /No pude|no figura/i.test("") === false,
  quien,
);
check("el aviso aparece en pantalla", /no figura en ningún integrante/i.test(await texto(page)));

// Cargando el mail en el equipo, pasa a reconocerla.
await page.evaluate(async () => {
  const v = TEAM.find((m) => m.id === "vivi");
  ((v.email = "vivi@coto.com.ar"), (localManda = true), touch());
  await guardarAhora(false);
});
await page.waitForTimeout(1200);
await page.reload();
await listo(page);
await page.waitForTimeout(1200);
const reconocida = await page.evaluate(() => ({ user: state.user, id: state.userId, sinEquipo: state.mailSinEquipo }));
(check("con el mail cargado la reconoce", reconocida.id === "vivi" && reconocida.user === "Vivi", reconocida),
  check("y el aviso desaparece", !/no figura en ningún integrante/i.test(await texto(page))));

// ── El token vence en el medio de la jornada ──────────────────────────────
console.log("\ncuando el token vence trabajando");
const antes = await page.evaluate(() => state.cards.length);
await page.evaluate(() => {
  // Se fuerza el vencimiento del lado del cliente, como pasa a la hora.
  ((sesion.expira = Date.now() - 1000), guardarSesion(sesion));
});
await page.evaluate(async () => {
  const c = newCard("libre", "TARJETA CON TOKEN VENCIDO", {});
  (state.cards.push(c), touch());
  await guardarAhora(false);
});
await page.waitForTimeout(2000);
const trasRenovar = await page.evaluate(async () => {
  const r = await fetch(BACKEND.supabaseUrl + "/rest/v1/planner?id=eq.coto&select=data", {
    headers: { apikey: BACKEND.supabaseKey, Authorization: "Bearer " + sesion.access },
  });
  const j = await r.json();
  return {
    guardada: (j[0]?.data?.cards || []).some((c) => c.titulo === "TARJETA CON TOKEN VENCIDO"),
    sinAviso: !/sesión venció/i.test(document.body.innerText),
  };
});
(check("renueva la sesión sola y el trabajo se guarda igual", trasRenovar.guardada === true, trasRenovar),
  check("no molesta a la persona con un cartel", trasRenovar.sinAviso === true, trasRenovar));
check("no se perdió ninguna tarjeta en el camino", (await page.evaluate(() => state.cards.length)) === antes + 1);

// ── La sesión revocada avisa, no rompe en silencio ────────────────────────
console.log("\ncuando la sesión ya no vale");
backend.vencerTodo();
await page.evaluate(async () => {
  ((state.cards[0].titulo = "EDITADA SIN SESIÓN"), touch());
  await guardarAhora(false);
});
await page.waitForTimeout(2500);
const revocada = await page.evaluate(() => ({
  avisa: /sesión venció/i.test(document.body.innerText),
  gateVisible: !document.querySelector("#gate").classList.contains("hidden"),
  copia: (() => {
    try {
      return (JSON.parse(readBackups()[0].doc).cards || []).some((c) => c.titulo === "EDITADA SIN SESIÓN");
    } catch (e) {
      return false;
    }
  })(),
}));
(check("avisa que la sesión venció", revocada.avisa === true, revocada),
  check("vuelve a pedir el ingreso", revocada.gateVisible === true, revocada),
  check("el trabajo sin guardar queda en la copia local", revocada.copia === true, revocada));

await page.close();
await browser.close();
await backend.stop();

const malas = resultados.filter((r) => !r.ok);
console.log("\n" + (resultados.length - malas.length) + "/" + resultados.length + " pruebas en verde");
if (malas.length) {
  console.log("\nfallan:");
  malas.forEach((r) => console.log("  " + r.nombre));
  process.exit(1);
}
