// Pruebas de los números que el equipo lee y cree.
//
// El equipo avisó que la campana marcaba como pendientes cosas que ya se
// habían terminado. La causa: computeAlerts() rehacía a mano la cuenta de
// "está vencida" y se olvidaba de mirar el estado, mientras que isOverdue()
// —que usa todo el resto de la app— sí lo miraba. Dos definiciones de lo
// mismo, una mal, y nada que avisara.
//
// Lo mismo pasaba en Reportería: "En revisión ahora" contaba solo las
// tarjetas que tenían registrada la fecha de entrada, así que daba menos que
// la columna del Planner; y "con portada o mosaico pendiente" contaba también
// cursos dados de baja, así que daba más que el mismo dato en Técnico.
//
// Un número equivocado no rompe nada visible: simplemente deja de creerse.
// Estas pruebas fijan que cada número siga coincidiendo con la vista donde el
// equipo puede ir a contarlo a mano.

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

const backend = await startFakeBackend(8475);
const browser = await chromium.launch({ executablePath: rutaChromium() });
const page = await browser.newPage({ serviceWorkers: "block", viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => console.log("  [números] error de página:", e.message));
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
(await page.fill("#gateMail", "dami@coto.com.ar"), await page.fill("#gatePassInput", CLAVE));
await page.click('#gate button:has-text("Entrar")');
await page.waitForFunction(() => state?.ready === true, { timeout: 30000 });
await page.waitForTimeout(1200);

// Un tablero armado a mano con los casos que importan.
await page.evaluate(() => {
  if (!state.tecnico.length) state.tecnico = seedTecnico();
  const dias = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const mk = (titulo, fin, estado, extra) => {
    const c = newCard("libre", titulo, {});
    ((c.fin = fin), (c.estado = estado), Object.assign(c, extra || {}));
    return (state.cards.push(c), c);
  };
  (mk("VENCIDA DE VERDAD", dias(-30), "pendiente"),
    mk("VENCIDA HACE MUCHO", dias(-120), "en-desarrollo"),
    mk("YA TERMINADA", dias(-45), "finalizado"),
    mk("VENCE PRONTO", dias(2), "pendiente"),
    mk("RECURRENTE DADA DE BAJA", dias(-10), "pendiente", { recurrencia: "mensual", activo: false }));
});

// ── La campana ────────────────────────────────────────────────────────────
console.log("\nalertas");
const al = await page.evaluate(() => {
  const a = computeAlerts();
  return {
    titulos: a.map((x) => x.c.titulo),
    orden: a.filter((x) => x.kind === "bad").map((x) => x.c.titulo),
    // Lo que dice el resto de la app sobre la misma tarjeta.
    isOverdueTerminada: isOverdue(state.cards.find((c) => c.titulo === "YA TERMINADA")),
  };
});
(check("una tarjeta terminada no figura como pendiente", !al.titulos.includes("YA TERMINADA"), al.titulos),
  check(
    "coincide con isOverdue(), que es lo que mira el resto de la app",
    al.isOverdueTerminada === false,
    al,
  ),
  check("una vencida de verdad sí figura", al.titulos.includes("VENCIDA DE VERDAD"), al.titulos),
  check("una que vence pronto también", al.titulos.includes("VENCE PRONTO"), al.titulos),
  check(
    "una recurrente dada de baja no reclama nada",
    !al.titulos.includes("RECURRENTE DADA DE BAJA"),
    al.titulos,
  ),
  check(
    "lo más atrasado va primero",
    al.orden.indexOf("VENCIDA HACE MUCHO") < al.orden.indexOf("VENCIDA DE VERDAD"),
    al.orden,
  ));

// El badge de la campana cuenta lo mismo que la lista.
const badge = await page.evaluate(() => {
  updateBell();
  const el = document.querySelector("#notifBadge");
  return {
    badge: el && !el.classList.contains("hidden") ? +el.textContent : 0,
    sinLeer: alertasSinLeer().length,
  };
});
check("el número de la campana es el de la lista", badge.badge === badge.sinLeer, badge);

// ── Reportería contra las vistas donde se puede contar a mano ─────────────
console.log("\nreportería");
await page.evaluate(() => {
  const dias = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const conSello = newCard("libre", "EN REVISIÓN CON SELLO", {});
  ((conSello.estado = "en-revision"), (conSello.revisionDesde = dias(-20)));
  const sinSello = newCard("libre", "EN REVISIÓN SIN SELLO", {});
  ((sinSello.estado = "en-revision"), delete sinSello.revisionDesde);
  state.cards.push(conSello, sinSello);
  // Un curso dado de baja al que le falta el mosaico: no es trabajo pendiente.
  const fila = state.tecnico.find((f) => f.portada && f.mosaico);
  if (fila) ((fila.mosaico = false), (fila.estado = "Dado de baja"));
  ((state.view = "reportes"), render());
});
await page.waitForTimeout(600);

const rep = await page.evaluate(() => {
  const textoKpi = (etiqueta) => {
    const kpi = [...document.querySelectorAll(".kpi")].find((k) =>
      (k.querySelector(".kpi-lbl") || {}).textContent === etiqueta,
    );
    return kpi ? +(kpi.querySelector(".kpi-num") || {}).textContent : null;
  };
  return {
    esperandoEnPantalla: textoKpi("Esperando revisión"),
    esperandoEnPlanner: boardCards().filter((c) => c.estado === "en-revision").length,
    pendientesEnPantalla: textoKpi("Con portada o mosaico pendiente"),
    pendientesEnTecnico: state.tecnico.filter(tecFilaActiva).filter((f) => !f.portada || !f.mosaico).length,
    activos: repCursosActivos().length,
    sumaAnios: repPublicacionesPorAnio().reduce((a, b) => a + b.n, 0),
    sumaMeses: repPublicacionesPorMes().reduce((a, b) => a + b, 0),
    delAnio: repPublicaciones().filter((p) => +p.fecha.slice(0, 4) === repAnioActual()).length,
  };
});
(check(
  '"Esperando revisión" da lo mismo que la columna del Planner',
  rep.esperandoEnPantalla === rep.esperandoEnPlanner,
  rep,
),
  check(
    '"Con portada o mosaico pendiente" da lo mismo que Técnico',
    rep.pendientesEnPantalla === rep.pendientesEnTecnico,
    rep,
  ),
  check("las barras por año suman el total de cursos activos", rep.activos === rep.sumaAnios, rep),
  check("las barras por mes suman lo publicado en ese año", rep.sumaMeses === rep.delAnio, rep));

// Ningún curso se cae del histórico por no tener fecha.
const sinFecha = await page.evaluate(() => {
  const barras = repPublicacionesPorAnio(),
    sf = barras.find((b) => b.lbl === "S/F");
  return {
    sinFechaReal: repCursosActivos().filter((c) => !fechaPublicacionCard(c)).length,
    sinFechaEnBarra: sf ? sf.n : 0,
  };
});
check(
  "los cursos sin fecha aparecen en su propia barra, no desaparecen",
  sinFecha.sinFechaReal === sinFecha.sinFechaEnBarra,
  sinFecha,
);

// El año que se mira manda: sobre el gráfico y sobre lo que se exporta.
console.log("\nel año elegido");
const anio = await page.evaluate(() => {
  const otro = repAniosDisponibles().find((a) => a !== repAnioActual());
  if (!otro) return { salteado: true };
  ((state.repAnio = otro), render());
  return {
    elegido: otro,
    titulo: [...document.querySelectorAll(".rep-sec-h h3")][0].textContent,
    chipActivo: (document.querySelector(".rep-anios .qchip.on") || {}).textContent,
    mesesDelOtroAnio: repPublicacionesPorMes().reduce((a, b) => a + b, 0),
    publicadosEseAnio: repPublicaciones().filter((p) => +p.fecha.slice(0, 4) === otro).length,
  };
});
if (anio.salteado) check("hay más de un año para elegir", false, anio);
else
  (check("el título del gráfico sigue al año elegido", anio.titulo.includes(String(anio.elegido)), anio),
    check("el chip del año queda marcado", anio.chipActivo === String(anio.elegido), anio),
    check("el gráfico por mes pasa a ser el de ese año", anio.mesesDelOtroAnio === anio.publicadosEseAnio, anio));

await browser.close();
await backend.stop();

const malas = resultados.filter((r) => !r.ok);
console.log("\n" + (resultados.length - malas.length) + "/" + resultados.length + " pruebas en verde");
if (malas.length) {
  console.log("\nfallan:");
  malas.forEach((r) => console.log("  " + r.nombre));
  process.exit(1);
}
