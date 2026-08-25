// Pruebas de la sincronización entre varias personas.
//
// El backend guarda un único documento JSON con todo el tablero, así que el
// riesgo permanente de esta app es que dos personas editando a la vez se
// pisen. Estas pruebas fijan ese comportamiento: si alguien vuelve a hacer
// que persist() escriba la copia local entera, "no se pisan editando a la vez"
// se pone en rojo.
//
//   npm test

import { chromium } from "playwright";
import { startFakeBackend } from "./fake-backend.mjs";

const CHROMIUM = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
const CLAVE = "Minuevacontra5";

const results = [];
const check = (name, ok, extra) => {
  (results.push({ name, ok }),
    console.log(`${ok ? "  ok  " : " FALLA"} ${name}`),
    !ok && extra !== undefined && console.log("        ", JSON.stringify(extra)));
};

// Intercepta a nivel de red conservando el hostname de Supabase, para que el
// service worker lo siga esquivando igual que en producción.
async function attachBackend(page, base) {
  await page.route("**://*.supabase.co/rest/v1/**", async (route) => {
    const req = route.request();
    const { pathname, search } = new URL(req.url());
    const upstream = await fetch(base + pathname + search, {
      method: req.method(),
      headers: { "Content-Type": "application/json" },
      body: req.method() === "POST" ? req.postData() : undefined,
    });
    route.fulfill({
      status: upstream.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: await upstream.text(),
    });
  });
}

// El service worker recarga la página cuando toma control, lo que voltea el
// contexto en medio de un evaluate. En las pruebas no aporta nada, así que va
// bloqueado; el ruteo de red ya intercepta antes que él.
const CONTEXTO = { serviceWorkers: "block" };

async function openClient(browser, base, nombre) {
  const page = await browser.newPage({ ...CONTEXTO, viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (e) => console.log(`  [${nombre}] error de página:`, e.message));
  await attachBackend(page, base);
  await page.goto(base + "/index.html");
  await page.waitForFunction(() => state?.ready === true);
  await page.fill("#gatePassInput", CLAVE);
  await page.fill("#gateInput", nombre);
  await page.click('#gate button:has-text("Entrar")');
  await page.waitForTimeout(1600);
  return page;
}

// --- unitarias del merge -----------------------------------------------

async function pruebasDeMerge(browser, base) {
  console.log("\nmezcla de tarjetas");
  const page = await browser.newPage(CONTEXTO);
  await attachBackend(page, base);
  await page.goto(base + "/index.html");
  await page.waitForFunction(() => typeof mergeCards === "function");

  const casos = await page.evaluate(() => {
    const C = (id, titulo, updatedAt) => ({ id, titulo, updatedAt });
    const dia = 24 * 60 * 60 * 1000;
    return {
      une: mergeCards([C("a", "local", 10)], [C("b", "remoto", 10)], {}, {}).cards.length,
      ganaLocal: mergeCards([C("a", "nuevo", 20)], [C("a", "viejo", 10)], {}, {}).cards[0].titulo,
      ganaRemoto: mergeCards([C("a", "viejo", 10)], [C("a", "nuevo", 20)], {}, {}).cards[0].titulo,
      conservaAjena: mergeCards([C("a", "edito", 50)], [C("a", "vieja", 10), C("x", "de otro", 30)], {}, {})
        .cards.length,
      borradoNoRevive: mergeCards([], [C("a", "sigue", 10)], { a: 20 }, {}).cards.length,
      edicionPosteriorRevive: mergeCards([], [C("a", "editada", 30)], { a: 20 }, {}).cards.length,
      podaLapidasViejas: "a" in mergeCards([], [], { a: Date.now() - 40 * dia }, {}).deleted,
      conservaLapidasNuevas: "a" in mergeCards([], [], { a: Date.now() }, {}).deleted,
      sinMarcaDeTiempo: mergeCards([{ id: "a" }], [{ id: "a", updatedAt: 5 }], {}, {}).cards.length,
    };
  });

  (check("une las tarjetas nuevas de ambos lados", casos.une === 2, casos.une),
    check("gana la edición más nueva (local)", casos.ganaLocal === "nuevo", casos.ganaLocal),
    check("gana la edición más nueva (remota)", casos.ganaRemoto === "nuevo", casos.ganaRemoto),
    check("conserva la tarjeta que creó el otro", casos.conservaAjena === 2, casos.conservaAjena),
    check("una tarjeta borrada no revive", casos.borradoNoRevive === 0, casos.borradoNoRevive),
    check("editarla después de borrarla la revive", casos.edicionPosteriorRevive === 1),
    check("poda lápidas de más de 30 días", casos.podaLapidasViejas === false),
    check("conserva lápidas recientes", casos.conservaLapidasNuevas === true),
    check("tolera tarjetas viejas sin updatedAt", casos.sinMarcaDeTiempo === 1));

  await page.close();
}

// --- dos personas a la vez ---------------------------------------------

async function pruebaDosPersonas(browser, backend) {
  console.log("\ndos personas editando a la vez");
  await backend.reset();

  const vivi = await openClient(browser, backend.url, "Vivi");
  await vivi.waitForTimeout(1200);

  const dami = await openClient(browser, backend.url, "Dami");
  await dami.waitForTimeout(1200);

  // Vivi deja el panel abierto: esto congelaba el polling y la dejaba con una
  // copia vieja del tablero.
  await vivi.evaluate(() => openDetail(state.cards[0].id));
  await vivi.waitForTimeout(400);

  await dami.evaluate(() => {
    const c = newCard("libre", "TARJETA DE DAMI");
    (state.cards.push(c), touch());
  });
  await dami.waitForTimeout(1800);

  await vivi.evaluate(() => {
    ((state.cards[0].titulo = "EDITADA POR VIVI"), touch());
  });
  await vivi.waitForTimeout(2500);

  const fin = await backend.state();
  (check(
    "no se pisan editando a la vez",
    fin.cards.some((c) => c.titulo === "TARJETA DE DAMI"),
    fin.cards.length,
  ),
    check(
      "la edición propia llega igual",
      fin.cards.some((c) => c.titulo === "EDITADA POR VIVI"),
    ));

  // Un borrado tiene que sobrevivir a que el otro escriba después.
  const idBorrado = await vivi.evaluate(() => {
    const c = state.cards.find((x) => x.titulo === "TARJETA DE DAMI");
    return (dropCards([c.id]), touch(), c.id);
  });
  await vivi.waitForTimeout(2000);
  await dami.evaluate(() => {
    ((state.cards[1].titulo = "OTRA EDICIÓN DE DAMI"), touch());
  });
  await dami.waitForTimeout(2500);

  const trasBorrado = await backend.state();
  check(
    "un borrado no revive cuando el otro guarda",
    !trasBorrado.cards.some((c) => c.id === idBorrado),
    trasBorrado.cards.filter((c) => c.id === idBorrado),
  );

  (await vivi.close(), await dami.close());
}

// --- la ventana entre editar y guardar ----------------------------------

async function pruebaCarrera(browser, backend) {
  console.log("\ncarreras entre editar y sincronizar");
  await backend.reset();
  const page = await openClient(browser, backend.url, "Vivi");
  await page.waitForTimeout(1200);

  // El guardado va con 250 ms de retardo. Si la marca de tiempo se pusiera
  // recién ahí, un polling que entre en esa ventana vería el cambio sin marca
  // y lo descartaría por viejo. Por eso touch() tiene que marcar en el acto.
  const marca = await page.evaluate(() => {
    const c = state.cards[0],
      antes = c.updatedAt || 0;
    ((c.titulo = "CAMBIO SIN GUARDAR"), touch());
    return { antes, despues: c.updatedAt || 0 };
  });
  check("editar marca la tarjeta en el acto, sin esperar el guardado", marca.despues > marca.antes, marca);

  // Y el caso concreto: una tarjeta con lápida que vuelve, si el merge corre
  // antes del guardado, tiene que sobrevivir igual.
  const sobrevive = await page.evaluate(async () => {
    const c = state.cards[0];
    // Alguien la borró hace un rato; ahora otra persona la vuelve a cargar.
    ((state.deleted[c.id] = Date.now() - 1000), delete c.updatedAt);
    ((c.titulo = "VUELVE A LA VIDA"), touch());
    await mergeRemoteIntoState();
    return state.cards.some((x) => x.titulo === "VUELVE A LA VIDA");
  });
  check("un cambio recién hecho no lo pisa el polling", sobrevive);

  await page.close();
}

// --- copias de resguardo ------------------------------------------------

async function pruebaBackups(browser, backend) {
  console.log("\ncopias de resguardo");
  await backend.reset();
  const page = await openClient(browser, backend.url, "Vivi");
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    (state.cards.push(newCard("libre", "ANTES DEL DESASTRE")), touch());
  });
  await page.waitForTimeout(1600);

  const copias = await page.evaluate(() => readBackups().length);
  check("guarda una copia al grabar", copias >= 1, copias);

  // Alguien vacía el tablero compartido.
  await page.evaluate(() => {
    (dropCards(state.cards.map((c) => c.id)), touch());
  });
  await page.waitForTimeout(1600);
  check(
    "el tablero queda vacío tras el desastre",
    (await page.evaluate(() => state.cards.length)) === 0,
  );

  await page.evaluate(() => {
    window.confirm = () => true;
    restoreBackup(readBackups()[0].ts);
  });
  await page.waitForTimeout(2000);

  (check(
    "restaurar una copia devuelve las tarjetas",
    await page.evaluate(() => state.cards.some((c) => c.titulo === "ANTES DEL DESASTRE")),
  ),
    check("la restauración llega al backend", (await backend.state()).cards.length > 0));

  await page.close();
}

// --- corrida ------------------------------------------------------------

const backend = await startFakeBackend();
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  (await pruebasDeMerge(browser, backend.url),
    await pruebaDosPersonas(browser, backend),
    await pruebaCarrera(browser, backend),
    await pruebaBackups(browser, backend));
} finally {
  (await browser.close(), await backend.stop());
}

const fallan = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - fallan.length}/${results.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.name).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
