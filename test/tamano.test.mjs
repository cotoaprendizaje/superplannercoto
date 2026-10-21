// Guarda el tamaño del documento que se sincroniza.
//
// Es la prueba que faltaba el día que la app tiró abajo la cuota de salida de
// Supabase. El tablero llevaba adentro 1,35 MB de portadas en base64 y el
// polling lo arrastraba entero cada pocos segundos: 43,6 GB en un mes, sobre
// una cuota de 5. Se arregló sacando las fotos a su propia fila, pero el
// arranque volvió a meterlas dos veces por caminos distintos, y las dos veces
// hizo falta medirlo a mano para darse cuenta.
//
// Esto lo mide solo, en cada cambio: si una foto vuelve al documento del
// tablero, o el documento crece más de la cuenta, la prueba se pone en rojo
// antes de que nadie publique nada.

import { chromium } from "playwright";
import { startFakeBackend } from "./fake-backend.mjs";
import { rutaChromium } from "./navegador.mjs";

// El tablero real de producción ronda los 170 KB con 126 tarjetas. El tope deja
// aire para que crezca sin molestar, pero corta mucho antes de que una sola
// portada (~16 KB cada una, 87 en total) pueda pasar desapercibida.
const TOPE_KB = 400;

const ok = [];
const fallas = [];
const check = (nombre, cond, detalle = "") => {
  if (cond) (ok.push(nombre), console.log("  ok   " + nombre));
  else (fallas.push(nombre), console.log(" FALLA " + nombre + (detalle ? "\n         " + detalle : "")));
};

const backend = await startFakeBackend(8471);
const browser = await chromium.launch({ executablePath: rutaChromium() });
const page = await browser.newPage({ serviceWorkers: "block", viewport: { width: 1400, height: 900 } });
const erroresJS = [];
page.on("pageerror", (e) => erroresJS.push(e.message));

await page.route("**://*.supabase.co/**", async (r) => {
  const q = r.request();
  const { pathname, search } = new URL(q.url());
  const up = await fetch(backend.url + pathname + search, {
    method: q.method(),
    headers: { "Content-Type": "application/json" },
    body: q.method() === "POST" ? q.postData() : undefined,
  });
  r.fulfill({ status: up.status, headers: { "Content-Type": "application/json" }, body: await up.text() });
});

async function filaDelBackend(id) {
  const j = await (await fetch(backend.url + "/rest/v1/planner?id=eq." + id + "&select=data")).json();
  return j[0] ? j[0].data : null;
}
const kb = (n) => (n / 1024).toFixed(0) + " KB";
// El tablero solo se baja después de entrar con una cuenta.
async function entrar(pg) {
  await pg.waitForSelector("#gateMail");
  await pg.fill("#gateMail", "dami@coto.com.ar");
  await pg.fill("#gatePassInput", "Cotonetes2026");
  await pg.click('#gate button:has-text("Entrar")');
  await pg.waitForFunction(() => state?.ready === true, { timeout: 60000 });
}
// Al recargar, la app ya no se abre sola: la pantalla de ingreso aparece
// siempre. Con la sesión todavía vigente no se pide la contraseña —alcanza el
// clic—, pero el clic hay que darlo.
async function volver(pg) {
  await pg.waitForSelector("#gateMail", { timeout: 15000 });
  await pg.click('#gate button:has-text("Entrar")');
  await pg.waitForFunction(() => state?.ready === true, { timeout: 60000 });
}

console.log("\ntamaño del documento sincronizado");

// ── Primer arranque: la app siembra el catálogo contra un backend vacío ──
await page.goto(backend.url + "/index.html");
await entrar(page);
await page.waitForTimeout(2500);

let tablero = await filaDelBackend("coto");
const fotos = await filaDelBackend("coto-fotos");

check("el primer arranque deja escrito el tablero", !!(tablero && Array.isArray(tablero.cards)));
// Las portadas de la semilla ya no viajan como base64: son archivos del sitio
// (assets/cursos) y la tarjeta guarda solo la ruta. La fila de fotos queda
// para las que suba el equipo a mano.
check(
  "las portadas de la semilla se guardan como ruta, no como imagen",
  !!(tablero && tablero.cards.some((c) => /^assets\/cursos\/\d+\.jpg$/.test((c.catalogo || {}).imagen || ""))),
);
check(
  "la fila de fotos no se llena con las portadas de la semilla",
  !(fotos && fotos.fotos && Object.keys(fotos.fotos).length > 0),
  "coto-fotos: " + (fotos && fotos.fotos ? Object.keys(fotos.fotos).length + " portadas" : "vacía"),
);

let json = JSON.stringify(tablero);
check("el tablero guardado no lleva imágenes adentro", json.indexOf("data:image") === -1);
check("el tablero guardado entra bajo el tope", json.length < TOPE_KB * 1024, kb(json.length) + " de " + TOPE_KB + " KB");
check("el tablero lleva sello de versión, para que el polling no lo baje entero", !!tablero.rev);
console.log("         tablero: " + kb(json.length) + " · fila de fotos: " + kb(JSON.stringify(fotos || {}).length));

// ── Segundo arranque: acá estuvo el error. Al releer un tablero cuyas fotos
//    ya salieron, el relleno del catálogo se las volvía a meter y el guardado
//    de arranque las devolvía a la fila del tablero. ──
await page.reload();
await volver(page);
await page.waitForTimeout(2500);

tablero = await filaDelBackend("coto");
json = JSON.stringify(tablero);
check("al segundo arranque las imágenes siguen fuera del tablero", json.indexOf("data:image") === -1);
check("al segundo arranque el tablero no engordó", json.length < TOPE_KB * 1024, kb(json.length) + " de " + TOPE_KB + " KB");

// Y las portadas se siguen viendo: sacarlas del documento no puede costarle
// la imagen a ninguna tarjeta.
const portadas = await page.evaluate(async () => {
  const rutas = state.cards.map(cardImagen).filter((src) => src.startsWith("assets/cursos/"));
  const cargan = await Promise.all(
    rutas.map((src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im.naturalWidth > 0); im.onerror = () => ok(false); im.src = src; })),
  );
  return { conPortada: rutas.length, cargan: cargan.filter(Boolean).length };
});
check(
  "las tarjetas siguen mostrando su portada (y el archivo existe)",
  portadas.conPortada >= 80 && portadas.cargan === portadas.conPortada,
  JSON.stringify(portadas),
);

// ── Una edición cualquiera tampoco puede devolver las fotos ──
await page.evaluate(async () => {
  const c = state.cards[0];
  ((c.titulo = c.titulo + " (editada)"), touch());
  await guardarAhora(false);
});
await page.waitForTimeout(1500);
tablero = await filaDelBackend("coto");
json = JSON.stringify(tablero);
check("después de editar y guardar, las imágenes siguen afuera", json.indexOf("data:image") === -1);
check("después de editar y guardar, el tablero sigue bajo el tope", json.length < TOPE_KB * 1024, kb(json.length));

// ── Aligerar portadas: el tablero de producción todavía guarda las fotos de
//    las tarjetas viejas adentro de la base. Las idénticas a un archivo del
//    sitio se cambian por la ruta; una foto subida a mano no se toca. ──
await page.evaluate(async () => {
  const conRuta = state.cards.filter((c) => /^assets\/cursos\//.test((c.catalogo || {}).imagen || "")).slice(0, 3);
  for (const c of conRuta) {
    const b = await (await fetch(c.catalogo.imagen)).arrayBuffer();
    ((state.fotos[c.id] = "data:image/jpeg;base64," + base64DeBytes(b)), (c.catalogo.imagen = ""));
  }
  const propia = state.cards.find((c) => !conRuta.includes(c));
  state.fotos[propia.id] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
  window.__propia = propia.id;
  await Store.save(docSnapshotFotos(), false, FOTOS_FILA);
});
await page.evaluate(() => portadasAligerar());
await page.waitForSelector('[data-action="confirm:yes"]', { timeout: 10000 });
await page.click('[data-action="confirm:yes"]');
await page.waitForTimeout(2000);
const aligeradas = await page.evaluate(() => ({
  enMemoria: Object.keys(state.fotos),
  propia: window.__propia,
  rutas: state.cards.filter((c) => /^assets\/cursos\//.test(cardImagen(c))).length,
}));
const fotosTras = await filaDelBackend("coto-fotos");
check(
  "aligerar deja solo la foto subida a mano, en memoria y en la base",
  aligeradas.enMemoria.length === 1 && aligeradas.enMemoria[0] === aligeradas.propia &&
    Object.keys((fotosTras || {}).fotos || {}).length === 1,
  { aligeradas, enBase: Object.keys((fotosTras || {}).fotos || {}) },
);
tablero = await filaDelBackend("coto");
json = JSON.stringify(tablero);
check("y las tarjetas aligeradas guardan la ruta, sin imagen adentro", json.indexOf("data:image") === -1 && aligeradas.rutas >= 80, aligeradas.rutas);

check("sin errores de JavaScript", erroresJS.length === 0, erroresJS.join(" | "));

await browser.close();
await backend.stop();

console.log("\n" + ok.length + "/" + (ok.length + fallas.length) + " pruebas en verde");
if (fallas.length) {
  console.log("\nfallan:");
  fallas.forEach((f) => console.log("  " + f));
  process.exit(1);
}
