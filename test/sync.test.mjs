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
import { rutaChromium } from "./navegador.mjs";
import { startFakeBackend } from "./fake-backend.mjs";

const CHROMIUM = rutaChromium();
// El ingreso pasó a ser una cuenta de verdad: mail y contraseña contra
// /auth/v1/token. La clave la fija el backend de mentira.
const CLAVE = "Cotonetes2026";
const correo = (nombre) => String(nombre).toLowerCase() + "@coto.com.ar";

const results = [];
const check = (name, ok, extra) => {
  (results.push({ name, ok }),
    console.log(`${ok ? "  ok  " : " FALLA"} ${name}`),
    !ok && extra !== undefined && console.log("        ", JSON.stringify(extra)));
};

// Intercepta a nivel de red conservando el hostname de Supabase, para que el
// service worker lo siga esquivando igual que en producción.
async function attachBackend(page, base) {
  await page.route("**://*.supabase.co/**", async (route) => {
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
  // Ahora el tablero se carga DESPUÉS de entrar: primero la pantalla de
  // ingreso, y recién cuando la sesión es válida se baja algo.
  await page.waitForSelector("#gateMail");
  await page.fill("#gateMail", correo(nombre));
  await page.fill("#gatePassInput", CLAVE);
  await page.click('#gate button:has-text("Entrar")');
  await page.waitForFunction(() => state?.ready === true, { timeout: 30000 });
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

  // restoreBackup ya no usa el confirm() nativo del navegador: abre el
  // modal propio de confirmación y espera el clic en "Sí, confirmar".
  await page.evaluate(() => {
    restoreBackup(readBackups()[0].ts);
  });
  await page.waitForTimeout(200);
  await page.click('[data-action="confirm:yes"]');
  await page.waitForTimeout(2000);

  (check(
    "restaurar una copia devuelve las tarjetas",
    await page.evaluate(() => state.cards.some((c) => c.titulo === "ANTES DEL DESASTRE")),
  ),
    check("la restauración llega al backend", (await backend.state()).cards.length > 0));

  await page.close();
}

// --- cerrar la pestaña con una edición sin guardar -----------------------
//
// El guardado normal tiene un debounce de 250ms y después una ida y vuelta de
// red. Si alguien edita una tarjeta y cierra la pestaña (o cambia de app, o
// el celular la manda a segundo plano) en ese lapso, un fetch normal se corta
// a mitad de camino sin avisar nada. Esta prueba reproduce justo eso: editar
// y cerrar en el mismo instante, sin darle tiempo al debounce a disparar.

// Nota sobre cómo se prueba esto: navegar la pestaña de verdad (page.goto,
// page.close) en este sandbox corta la conexión de red apenas arranca la
// navegación — hasta navigator.sendBeacon, el mecanismo más viejo y probado
// que existe para esto, falla igual con ERR_TUNNEL_CONNECTION_FAILED. Es el
// proxy de salida del entorno de pruebas cortando la conexión en el momento
// de navegar, no un problema del fetch con keepalive: un fetch keepalive
// idéntico, disparado sin navegar, sí llega. Así que en vez de navegar de
// verdad se dispara el evento pagehide a mano, que ejercita el mismo camino
// de código (el listener real de la app, guardarAhora(true), el POST con
// keepalive) sin depender de que la navegación sobreviva en este sandbox.
// El navegador impone un tope de 64 KB al cuerpo de un pedido keepalive; por
// encima de eso lo rechaza al toque, ni siquiera sale a la red. El tablero de
// esta app arranca en 114 KB solo con el catálogo semilla de cursos, antes de
// que el equipo cargue una sola tarjeta propia — así que en el uso real este
// tope se pisa todo el tiempo, no es un caso raro. Por eso hay dos defensas,
// no una: el POST con keepalive salva la edición cuando el tablero entra en
// el tope, y la copia local (que se graba antes de tocar la red, sin importar
// el tamaño) la salva siempre, incluso cuando no entra.
async function pruebaCierre(browser, backend) {
  console.log("\ncerrar la pestaña con una edición sin guardar");

  // Caso A: tablero chico, entra en el tope de keepalive — el POST debería
  // llegar de verdad.
  await backend.reset();
  let page = await openClient(browser, backend.url, "Popi");
  await page.waitForTimeout(1200);
  const writesAntes = (await backend.state()).writes;

  let resultado = await page.evaluate(async () => {
    state.cards = state.cards.slice(0, 2); // tablero chico a propósito
    const c = state.cards[0];
    ((c.titulo = "SE GUARDA AL CERRAR"), touch());
    const marcaPendiente = guardadoPendiente;
    // pagehide y visibilitychange('hidden') disparan juntos en un cierre real;
    // se simulan los dos para probar que el candado evita el POST duplicado.
    (window.dispatchEvent(new Event("pagehide")),
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true }),
      document.dispatchEvent(new Event("visibilitychange")));
    await new Promise((r) => setTimeout(r, 400));
    return { marcaPendiente, quedoPendiente: guardadoPendiente, tamano: JSON.stringify(docSnapshot()).length };
  });
  check("(tablero chico) entra bajo el tope de 64 KB", resultado.tamano < 60000, resultado.tamano);
  check(
    "(tablero chico) el guardado urgente limpia la marca de pendiente",
    resultado.quedoPendiente === false,
    resultado,
  );
  let estado = await backend.state();
  check(
    "(tablero chico) la edición llega al backend al cerrar",
    estado.cards.some((c) => c.titulo === "SE GUARDA AL CERRAR"),
    estado.cards,
  );
  check(
    "pagehide y visibilitychange a la vez no duplican el guardado",
    estado.writes - writesAntes === 1,
    { writesAntes, writesDespues: estado.writes },
  );
  await page.close();

  // Caso B: tablero real, con el catálogo semilla — pisa el tope, el POST se
  // rechaza sin salir a la red. La edición tiene que sobrevivir igual, en la
  // copia local.
  await backend.reset();
  page = await openClient(browser, backend.url, "Popi");
  await page.waitForTimeout(1200);

  resultado = await page.evaluate(async () => {
    const c = state.cards[0];
    ((c.titulo = "SOLO EN LA COPIA LOCAL"), touch());
    window.dispatchEvent(new Event("pagehide"));
    await new Promise((r) => setTimeout(r, 400));
    return { tamano: JSON.stringify(docSnapshot()).length, copias: readBackups() };
  });
  check("(tablero real) pisa el tope de 64 KB", resultado.tamano > 65536, resultado.tamano);
  check(
    "(tablero real) la copia local salva la edición igual",
    resultado.copias[0] && JSON.parse(resultado.copias[0].doc).cards.some((c) => c.titulo === "SOLO EN LA COPIA LOCAL"),
  );
  await page.close();
}

// El aviso nativo del navegador ("¿seguro que querés salir?") no depende de
// que la red funcione: es la defensa que de verdad protege a un tablero
// grande, porque le da a la persona la chance de no irse y dejar que el
// guardado normal (sin el tope de keepalive) termine solo.
async function pruebaAvisoAlSalir(browser, backend) {
  console.log("\naviso nativo al intentar salir con algo sin guardar");
  await backend.reset();
  const page = await openClient(browser, backend.url, "Popi");
  await page.waitForTimeout(1200);

  const sinNada = await page.evaluate(() => {
    let bloqueado = false;
    const ev = new Event("beforeunload", { cancelable: true });
    Object.defineProperty(ev, "returnValue", { value: "", writable: true });
    window.dispatchEvent(ev);
    return ev.defaultPrevented || ev.returnValue !== "";
  });
  check("no avisa si no hay nada pendiente", sinNada === false, sinNada);

  const conAlgo = await page.evaluate(() => {
    (state.cards[0].titulo = "SIN GUARDAR TODAVÍA"), touch();
    const ev = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(ev);
    return ev.defaultPrevented;
  });
  check("avisa cuando hay una edición sin confirmar", conAlgo === true, conAlgo);

  await page.close();
}

// --- el backend no responde ---------------------------------------------
//
// El modo de falla que más caro sale: si la carga inicial fallaba, la app
// armaba un tablero de ejemplo y desactivaba el guardado. El equipo trabajaba
// media tarde sobre tarjetas inventadas y no se guardaba nada.

async function pruebaBackendCaido(browser, backend) {
  console.log("\ncuando el backend no responde");
  await backend.reset();

  // Un cliente que enrutamos nosotros, para poder cortar la conexión a gusto.
  const abrir = async (control) => {
    const page = await browser.newPage({ ...CONTEXTO, viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [caido] error de página:", e.message));
    await page.route("**://*.supabase.co/**", async (route) => {
      const req = route.request();
      if (control.cortarLectura && req.method() === "GET") return route.fulfill({ status: 503, body: "{}" });
      if (control.cortarEscritura && req.method() === "POST")
        return route.fulfill({ status: 403, body: "{}" });
      (control.cabeceras = req.headers());
      const { pathname, search } = new URL(req.url());
      const upstream = await fetch(backend.url + pathname + search, {
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
    await page.goto(backend.url + "/index.html");
    return page;
  };

  // 1. la lectura falla
  // El ingreso es un POST a /auth/v1/token, así que entra igual con la lectura
  // cortada: lo que se rompe es la carga del tablero, justo después. Es la
  // situación que importa — la persona entró y no tiene que quedarse mirando
  // un tablero vacío como si no hubiera nada cargado.
  const control = { cortarLectura: true, cortarEscritura: false };
  let page = await abrir(control);
  await page.waitForSelector("#gateMail");
  await page.fill("#gateMail", correo("Vivi"));
  await page.fill("#gatePassInput", CLAVE);
  await page.click('#gate button:has-text("Entrar")');
  await page.waitForTimeout(2500);

  const traslaCaida = await page.evaluate(() => ({
    tarjetas: (window.state && state.cards && state.cards.length) || 0,
    lista: !!(window.state && state.ready),
    avisa: /no pude conectarme/i.test(document.body.innerText),
  }));
  (check("no inventa un tablero cuando no puede leer", traslaCaida.tarjetas === 0, traslaCaida),
    check("no se declara lista si no cargó", traslaCaida.lista === false),
    check("explica que no se pudo conectar", traslaCaida.avisa === true));
  await page.close();

  // 2. la lectura anda pero la escritura no
  ((control.cortarLectura = false), (control.cortarEscritura = false));
  page = await abrir(control);
  await page.waitForSelector("#gateMail");
  await page.fill("#gateMail", correo("Vivi"));
  await page.fill("#gatePassInput", CLAVE);
  await page.click('#gate button:has-text("Entrar")');
  await page.waitForFunction(() => state?.ready === true, { timeout: 30000 });
  await page.waitForTimeout(1200);

  check(
    "manda apikey y Authorization",
    !!(control.cabeceras && control.cabeceras["apikey"] && control.cabeceras["authorization"]),
    control.cabeceras && Object.keys(control.cabeceras),
  );

  control.cortarEscritura = true;
  await page.evaluate(() => {
    const c = newCard("libre", "SE VA A PERDER");
    (state.cards.push(c), touch());
  });
  await page.waitForTimeout(3000);

  const traslaFalla = await page.evaluate(() => ({
    avisa: !!document.querySelector("#saveWarn"),
    texto: (document.querySelector("#saveWarn") || {}).innerText || "",
    copias: JSON.parse(localStorage.getItem("coto.superplanner.backups") || "[]").length,
  }));
  (check("avisa fuerte que no se está guardando", traslaFalla.avisa === true),
    check("el aviso menciona la copia local", /copia/i.test(traslaFalla.texto), traslaFalla.texto),
    check("dejó una copia local igual", traslaFalla.copias > 0, traslaFalla.copias));

  // 3. vuelve el backend y el aviso se va
  control.cortarEscritura = false;
  await page.evaluate(() => persist());
  await page.waitForTimeout(2000);
  check(
    "el aviso desaparece cuando el backend vuelve",
    (await page.evaluate(() => !document.querySelector("#saveWarn"))) === true,
  );

  await page.close();
}

// --- la CotoFrase no se repite entre compañeras --------------------------
//
// Que a dos personas les toque la misma frase el mismo día le saca la gracia:
// lo divertido del widget es juntarse a la tarde a leer las cinco distintas.
// Elegir entre las libres alcanza para el caso normal, pero no para el que
// importa: dos personas tirando en el mismo momento eligen mirando lo que
// saben, y lo que saben tiene hasta 12 s de atraso. Ahí las dos pueden sacar
// la misma, y ahí entra el desempate.
async function pruebaFrasesSinRepetir(browser, base) {
  console.log("\nla CotoFrase no se repite en el día");
  const page = await browser.newPage(CONTEXTO);
  await attachBackend(page, base);
  await page.goto(base + "/index.html");
  await page.waitForFunction(() => typeof fraseLibre === "function");

  // Turnándose, a nadie le toca una repetida.
  const ronda = await page.evaluate(() => {
    ((state.cotofrase = { day: "hoy", v: 999, porUsuario: {} }), ensureFraseDay());
    const gente = ["Ana", "Beto", "Cami", "Dami", "Eve", "Flor"];
    gente.forEach((quien) => {
      state.user = quien;
      state.cotofrase.porUsuario[quien] = fraseLibre(quien);
    });
    const salieron = gente.map((g) => state.cotofrase.porUsuario[g]);
    return { salieron, distintas: new Set(salieron).size };
  });
  (check("tirando de a una, a nadie le toca la de otra", ronda.distintas === 6, ronda),
    check("y a todas les tocó alguna", ronda.salieron.every(Boolean), ronda));

  // Dos al mismo tiempo: cede una sola, y la misma en las dos pantallas.
  const empate = await page.evaluate(() => {
    const laMisma = SLOT_FRASES[0];
    // La pantalla de Beto: Ana ya tiene la misma frase.
    ((state.cotofrase = { day: "hoy", v: 999, porUsuario: { Ana: laMisma, Beto: laMisma } }),
      ensureFraseDay(),
      (state.cotofrase.porUsuario = { Ana: laMisma, Beto: laMisma }),
      (state.user = "Beto"));
    const cedioBeto = desempatarFrase(),
      frasedeBeto = state.cotofrase.porUsuario.Beto;
    // La pantalla de Ana, con exactamente los mismos datos de partida.
    ((state.cotofrase.porUsuario = { Ana: laMisma, Beto: laMisma }), (state.user = "Ana"));
    const cedioAna = desempatarFrase();
    return { cedioBeto, cedioAna, frasedeBeto, laMisma };
  });
  (check("cuando dos sacan la misma, cede una", empate.cedioBeto === true, empate),
    check("y cede la que va después por nombre, no las dos", empate.cedioAna === false, empate),
    check("la que cede se queda con otra frase", empate.frasedeBeto !== empate.laMisma, empate));

  // Con más gente que frases no se rompe: se vuelve a permitir repetir.
  const desborde = await page.evaluate(() => {
    const porUsuario = {};
    SLOT_FRASES.forEach((f, i) => (porUsuario["p" + i] = f));
    ((state.cotofrase = { day: "hoy", v: 999, porUsuario }), ensureFraseDay());
    state.cotofrase.porUsuario = porUsuario;
    state.user = "ultima";
    return { frase: fraseLibre("ultima") };
  });
  check("con más gente que frases igual toca una", !!desborde.frase, desborde);
  await page.close();
}

// --- dos tirando de la palanca en el mismo instante ----------------------
//
// Este es el caso que las pruebas no veían y que rompía de verdad. Las dos
// pantallas preguntan el sello antes de guardar; como ninguna había escrito
// todavía, las dos ven "nada nuevo" y las dos escriben el mapa de frases
// entero. La segunda tapa a la primera. La tapada después se entera por el
// polling, pero como nada la marcaba pendiente, su frase no volvía nunca a la
// base: le quedaba en la pantalla, las demás no la veían —y por lo tanto les
// podía tocar la misma—.
async function pruebaDosTirandoALaVez(browser, backend) {
  console.log("\ndos tirando de la palanca en el mismo instante");
  await backend.reset();
  const vivi = await openClient(browser, backend.url, "Vivi"),
    dami = await openClient(browser, backend.url, "Dami");

  const tirar = (pg, quien) =>
    pg.evaluate((n) => {
      ((state.user = n), ensureFraseDay());
      state.cotofrase.porUsuario[n] = fraseLibre(n);
      touch();
    }, quien);

  // Las dos eligen antes de que ninguna haya guardado: nadie ve a la otra.
  await Promise.all([tirar(vivi, "Vivi"), tirar(dami, "Dami")]);
  // Y de acá en adelante NO se fuerza ningún guardado: los que salgan tienen
  // que salir solos. Forzarlos es lo que hacía que esta prueba pasara igual
  // con el arreglo sacado —guardarAhora() mezcla antes de escribir, así que
  // reponía la frase tapada sin que nadie la marcara pendiente—, y una prueba
  // que pasa con el bug adentro no prueba nada.
  await vivi.waitForTimeout(2200);
  // El polling de cada pantalla, que es lo único que corre en este punto. La
  // primera vuelta la usa la tapada para darse cuenta y reponer su frase; la
  // segunda es la que le lleva esa frase a la otra. En la app son dos pasadas
  // del polling, o sea hasta 24 s: para una frase del día alcanza y sobra.
  //
  // Se sigue pollear hasta que converge, en vez de esperar un rato clavado y
  // mirar. Esto NO hace pasar la prueba con el bug adentro: sin el arreglo la
  // frase tapada no vuelve nunca a la base, así que el bucle se agota y las
  // comprobaciones fallan igual. Lo único que saca es la dependencia de que el
  // guardado con retardo entre dentro de una ventana fija — con el bug ya
  // arreglado, la prueba pasaba en una máquina rápida y fallaba en el runner
  // de CI, que es más lento.
  const leerBase = async () => {
    const r = await (await fetch(backend.url + "/rest/v1/planner?id=eq.coto&select=data")).json();
    return ((r[0] || {}).data || {}).cotofrase || { porUsuario: {} };
  };
  let guardadas = { porUsuario: {} },
    pantallas = [];
  for (let vuelta = 0; vuelta < 12; vuelta++) {
    for (const p of [vivi, dami]) await p.evaluate(() => mergeRemoteIntoState());
    await vivi.waitForTimeout(700);
    ((guardadas = await leerBase()),
      (pantallas = await Promise.all([vivi, dami].map((p) => p.evaluate(() => state.cotofrase.porUsuario)))));
    if (
      guardadas.porUsuario.Vivi &&
      guardadas.porUsuario.Dami &&
      guardadas.porUsuario.Vivi !== guardadas.porUsuario.Dami &&
      JSON.stringify(pantallas[0]) === JSON.stringify(pantallas[1])
    )
      break;
  }

  (check("no se pierde la frase de la que guardó primero", !!guardadas.porUsuario.Vivi, guardadas),
    check("ni la de la que guardó después", !!guardadas.porUsuario.Dami, guardadas),
    check(
      "las dos pantallas terminan viendo lo mismo",
      JSON.stringify(pantallas[0]) === JSON.stringify(pantallas[1]),
      pantallas,
    ),
    check(
      "y no les tocó la misma frase",
      guardadas.porUsuario.Vivi !== guardadas.porUsuario.Dami,
      guardadas,
    ));
  (await vivi.close(), await dami.close());
}

// --- importar un JSON tiene que poder SACAR filas -------------------------
//
// Esto apareció corrigiendo el Seguimiento técnico contra el Moodle real: se
// preparó un archivo con 95 filas para reemplazar 106, se importó… y quedaron
// 203. El importar cambiaba la lista en memoria, pero al guardar se mezcla con
// la del servidor y todo lo ausente volvía solo. Una fila solo se va de verdad
// si queda su "lápida", que es lo que deja la ✕ de cada fila — y el importador
// no la dejaba.
//
// La otra mitad: un archivo que trae SOLO el Seguimiento técnico no puede
// llevarse puesto el tablero. Antes se exigía "cards" siempre, así que
// corregir una grilla obligaba a pisar el tablero entero con la foto del
// respaldo, revirtiendo lo que alguien hubiera tocado mientras tanto.
async function pruebaImportarBorra(browser, backend) {
  console.log("\nimportar puede sacar filas, y solo toca lo que trae");
  await backend.reset();
  const page = await openClient(browser, backend.url, "Dami");
  await page.waitForTimeout(1000);

  // Punto de partida conocido: seis filas en el servidor, y un tablero.
  await page.evaluate(async () => {
    state.tecnico = ["A", "B", "C", "D", "E", "F"].map((n, i) => ({
      id: "tec-" + n, curso: "Curso " + n, categoria: "Cajas", publicacion: "",
      portada: false, mosaico: false, evaluacion: false, textos: false,
      diseno: "", estado: "", cardId: null, updatedAt: Date.now() - 100000,
    }));
    state.deletedTecnico = {};
    await Store.save(docSnapshotTecnico(), false, TEC_FILA);
  });
  await page.waitForTimeout(800);
  const tablero = await page.evaluate(() => state.cards.length);

  // Un archivo con CUATRO de las seis, y sin "cards".
  const archivo = await page.evaluate(() =>
    JSON.stringify({
      version: 1,
      tecnico: state.tecnico
        .filter((f) => f.id !== "tec-C" && f.id !== "tec-E")
        .map((f) => Object.assign({}, f, { updatedAt: Date.now() })),
    }),
  );
  await page.evaluate(() => doImport());
  await page.waitForTimeout(300);
  await page.evaluate((t) => { document.querySelector("#importText").value = t; }, archivo);
  await page.click('[data-action="data:import-run"]');
  await page.waitForTimeout(300);
  const pregunta = await page.evaluate(() => (document.querySelector(".modal .sub-t") || {}).textContent || "");
  (check("avisa cuántas filas se van, no solo «reemplaza todo»", /se borran 2 filas/i.test(pregunta), pregunta),
    check("y avisa que el tablero no se toca", !/tablero/i.test(pregunta), pregunta));
  await page.click('[data-action="confirm:yes"]');
  await page.waitForTimeout(1500);

  const recien = await page.evaluate(() => state.tecnico.length);
  check("al importar quedan las 4 filas del archivo", recien === 4, { recien });

  // Y ahora lo que fallaba: guardar y volver a bajar del servidor.
  await page.evaluate(() => guardarTecnicoAhora());
  await page.waitForTimeout(1200);
  await page.evaluate(() => refreshTecnicoFromRemote());
  await page.waitForTimeout(1200);
  const tras = await page.evaluate(() => ({
    filas: state.tecnico.length,
    nombres: state.tecnico.map((f) => f.id).sort(),
    lapidas: Object.keys(state.deletedTecnico || {}).length,
    cards: state.cards.length,
  }));
  (check("y después de sincronizar NO vuelven", tras.filas === 4, tras),
    check("las que se fueron son las que faltaban en el archivo", !tras.nombres.includes("tec-C") && !tras.nombres.includes("tec-E"), tras),
    check("queda una lápida por cada fila sacada", tras.lapidas === 2, tras),
    check("y el tablero no se tocó: el archivo no lo traía", tras.cards === tablero, { antes: tablero, ahora: tras.cards }));

  // Una segunda pantalla, que nunca importó nada, ve lo mismo.
  const otra = await openClient(browser, backend.url, "Vivi");
  await otra.waitForTimeout(1200);
  await otra.evaluate(() => refreshTecnicoFromRemote());
  await otra.waitForTimeout(1200);
  const vistoPorLaOtra = await otra.evaluate(() => state.tecnico.length);
  check("y la otra pantalla también las ve borradas", vistoPorLaOtra === 4, { vistoPorLaOtra });

  (await page.close(), await otra.close());
}

// --- corrida ------------------------------------------------------------

const backend = await startFakeBackend();
const browser = await chromium.launch({ executablePath: CHROMIUM });
try {
  (await pruebasDeMerge(browser, backend.url),
    await pruebaDosPersonas(browser, backend),
    await pruebaCarrera(browser, backend),
    await pruebaCierre(browser, backend),
    await pruebaAvisoAlSalir(browser, backend),
    await pruebaBackups(browser, backend),
    await pruebaBackendCaido(browser, backend),
    await pruebaFrasesSinRepetir(browser, backend.url),
    await pruebaDosTirandoALaVez(browser, backend),
    await pruebaImportarBorra(browser, backend));
} finally {
  (await browser.close(), await backend.stop());
}

const fallan = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - fallan.length}/${results.length} pruebas en verde` +
    (fallan.length ? `\n\nfallan:\n  ${fallan.map((f) => f.name).join("\n  ")}` : ""),
);
process.exit(fallan.length ? 1 : 0);
