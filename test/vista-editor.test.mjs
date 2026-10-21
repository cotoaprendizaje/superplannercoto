// Cuida la vista del "editor en vivo" (scripts/vista-editor.mjs): la app que
// se publica como artefacto para revisarla y comentarla.
//
// Se arma la vista, se la envuelve como lo hace el visor de claude.ai y se la
// abre en un navegador. Fija lo que no puede romperse: que no salga ni un
// pedido a internet (y menos a la base real), que la app arranque sola con
// el tablero de ejemplo, que la capa del editor aparezca y que "Ver como" use
// la medida exacta del dispositivo. Y que nada de esto entre en el index.html
// que se despliega.

import { chromium } from "playwright";
import { rutaChromium } from "./navegador.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import http from "node:http";

const resultados = [];
const check = (nombre, ok, extra) => {
  resultados.push({ nombre, ok: !!ok });
  console.log((ok ? "  ok   " : " FALLA ") + nombre + (ok || extra === undefined ? "" : "\n         " + JSON.stringify(extra)));
};

console.log("\nvista del editor en vivo");
const dir = mkdtempSync(join(tmpdir(), "vista-editor-"));
await promisify(execFile)("node", ["scripts/vista-editor.mjs", dir]);
const pagina = readFileSync(join(dir, "pagina.html"), "utf8"),
  archivos = JSON.parse(readFileSync(join(dir, "archivos.json"), "utf8")),
  produccion = readFileSync("index.html", "utf8");

check("la página tiene la forma de un artefacto (sin doctype/html/head/body)", !/^\s*<!doctype/i.test(pagina) && !/^<(html|head|body)[\s>]/im.test(pagina));
check("no nombra la base real", !/lhxngngmrsanlyqbsvcw/.test(pagina) && !/lhxngngmrsanlyqbsvcw/.test(readFileSync(join(dir, "marco.html"), "utf8")));
check("todos los archivos del mapa existen", Object.values(archivos).every((f) => existsSync(join(dir, f))), archivos);
check("la capa del editor no entra en el index.html que se despliega", !/editor-vivo|ev-pastilla|revision\.filas/.test(produccion));

// Como la envuelve el visor: el esqueleto mínimo y la página adentro del body.
const envuelta =
  '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>' +
  pagina +
  "</body></html>";
const TIPOS = { html: "text/html", css: "text/css", js: "text/javascript", jpg: "image/jpeg" };
const srv = http
  .createServer((q, r) => {
    const ruta = decodeURIComponent(q.url.split("?")[0]);
    if (ruta === "/") return (r.setHeader("Content-Type", "text/html"), r.end(envuelta));
    try {
      const b = readFileSync(join(dir, ruta));
      (r.setHeader("Content-Type", TIPOS[ruta.split(".").pop()] || "application/octet-stream"), r.end(b));
    } catch {
      ((r.statusCode = 404), r.end());
    }
  })
  .listen(8611);

const browser = await chromium.launch({ executablePath: rutaChromium() });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const errores = [],
  afuera = [];
page.on("pageerror", (e) => errores.push(e.message));
page.on("request", (q) => {
  const u = q.url();
  if (!u.startsWith("http://localhost:8611") && !u.startsWith("data:") && !u.startsWith("about:")) afuera.push(u);
});
await page.goto("http://localhost:8611/");
await page.waitForFunction(() => typeof state !== "undefined" && state.ready && boardCards().length > 0, { timeout: 30000 });
await page.waitForTimeout(800);
const arranque = await page.evaluate(() => ({
  vista: state.view,
  tarjetas: boardCards().length,
  quien: state.userId,
  emoji: (member("dami") || {}).emoji,
  pastilla: !!document.querySelector(".ev-pastilla"),
  tema: document.documentElement.getAttribute("data-theme"),
}));
check("la app entra sola y carga el tablero de ejemplo", arranque.tarjetas >= 15 && arranque.quien === "dami" && arranque.emoji === "🦊", arranque);
check("la pastilla del editor está", arranque.pastilla, arranque);
check("el html recupera su tema", !!arranque.tema, arranque);

// Señalar: el clic no hace nada en la app (no abre la tarjeta).
await page.evaluate(() => ((state.view = "plannerb"), render()));
await page.click('.ev [data-ev="senalar"]');
await page.click(".pb-fila >> nth=0");
await page.waitForTimeout(300);
const senalar = await page.evaluate(() => ({
  fichaAbierta: document.querySelector("#panel").classList.contains("open"),
  modo: document.body.classList.contains("ev-senalando"),
}));
check("señalar un elemento no dispara la app y termina con el clic", !senalar.fichaAbierta && !senalar.modo, senalar);

// Ver como: el iframe con la medida exacta, arrancando en la misma vista.
await page.click('.ev summary:has-text("Ver como")');
await page.click('.ev [data-ev="disp"][data-id="tel"]');
await page.waitForTimeout(2500);
const marco = await page.evaluate(() => {
  const f = document.querySelector("#evMarco iframe");
  return { w: f.style.width, h: f.style.height, src: f.getAttribute("src"), titulo: f.title, barra: document.querySelector(".ev-marco-med").textContent };
});
check("«Ver como Teléfono» usa 390 × 844 exactos", marco.w === "390px" && marco.h === "844px" && /^390 × 844/.test(marco.barra), marco);
check("y arranca en la vista que se estaba mirando", /vista=plannerb/.test(marco.src) && /Teléfono/.test(marco.titulo), marco);
const dentro = await page.frameLocator("#evMarco iframe").locator("body").evaluate(() => ({
  vista: state.view,
  sinCapa: !document.querySelector(".ev-pastilla"),
}));
check("adentro del marco la app corre sola, sin la capa", dentro.vista === "plannerb" && dentro.sinCapa, dentro);
await page.click(".ev-cerrar");

check("no sale ningún pedido a internet", afuera.length === 0, afuera.slice(0, 5));
check("sin errores de JavaScript", errores.length === 0, errores);

await browser.close();
srv.close();
const fallan = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - fallan.length}/${resultados.length} pruebas en verde`);
process.exit(fallan.length ? 1 : 0);
