#!/usr/bin/env node
/* puntaje-maximo.mjs — kit-base v1.9.76
   ------------------------------------------------------------
   POR QUÉ EXISTE. Porque **la tabla de puntos es una intención y el
   contador es el hecho** (CLAUDE.md §7.3 punto 19, §7.21). Un curso
   declara "el máximo son 210" sumando su propia tabla, y el recorrido
   real da otra cosa. Eso importa de verdad: los tres umbrales de
   medalla se derivan del máximo, así que un máximo mal declarado deja
   al alumno sin la medalla que se ganó — o se la regala.

   En un curso real este recorrido encontró tres cosas que leer el
   código no encontró, entre ellas un paginador que pagaba por tocar la
   variante que ya estabas viendo (§7.21 F2: 220 medidos contra 210
   declarados).

   QUÉ HACE. Recorre el curso tocando TODO lo que puede pagar —hitboxes,
   variantes, pop-ups, capas— y compara el contador real contra el
   máximo declarado. El curso declara su máximo así:

       <body data-puntaje-max="210">     (o window.__PUNTAJE_MAX__)

   Sin esa declaración el test no falla: informa el máximo medido, que
   ya es el dato que hacía falta para derivar los umbrales.

   Y MIDE `cmi.suspend_data` AL 100%. El guard salta pasando la MITAD
   del cupo de SCORM 1.2 (2048 de 4096), no al borde: `saveState()`
   rechaza en silencio cuando se pasa, y enterarse con el cupo lleno es
   enterarse tarde. Con la mitad libre todavía hay margen para acomodar.

   OJO CON MEDIR EL HUD (§7.14, §7.21 F12): `#d-points` se anima con
   `countTo`, así que leer su `textContent` a mitad de la animación da
   un valor intermedio que "casi" parece bien. Por eso se lee
   `data-valor`, que el kit escribe con el número verdadero antes de
   animar.
   Y NO PAGA DOS VECES (kit-base v1.9.124, §7.73; relevo de "Seguridad
   de la información", 2026-10-07). Este test tocaba cada cosa UNA vez y
   comparaba contra el máximo, así que un pago repetido no aparecía nunca.
   MEDIDO en ese curso: cerrar y reabrir un número ya revelado volvía a
   pagar —140 → 180 con solo pasar de nuevo por una diapositiva— y se
   llegaba al oro sin contestar un repaso. Ahora, después de medir, el
   recorrido se repite entero (segunda pasada) y otra vez tras RECARGAR la
   página con un LMS en memoria que sobrevive la recarga (lo que ve un
   alumno que sale y vuelve). Las dos tienen que dejar el total igual.
   El gancho `__PUNTAJE_RECORRIDO__` corre solo en la primera.
*/
import { openCourse, report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

/* LMS SCORM 1.2 en memoria que SOBREVIVE la recarga (guarda en
   `sessionStorage`, que es de la pestaña): sin él, recargar borra todo
   y la tercera pasada empezaría de cero, sin medir nada. Se instala y se
   recarga ANTES de la primera pasada, así el curso guarda desde el
   principio como en un LMS de verdad. */
await page.addInitScript(() => {
  const K = '__pm_lms';
  let store = {};
  try { store = JSON.parse(sessionStorage.getItem(K) || '{}'); } catch { /* vacío */ }
  const guardar = () => { try { sessionStorage.setItem(K, JSON.stringify(store)); } catch { /* noop */ } };
  window.API = {
    LMSInitialize: () => 'true', LMSFinish: () => 'true', LMSCommit: () => { guardar(); return 'true'; },
    LMSGetValue: (k) => (k === 'cmi.core.student_name' ? 'Prueba, Alumno' : (store[k] || '')),
    LMSSetValue: (k, v) => { store[k] = String(v); guardar(); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => ''
  };
});
await page.reload();
await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(() => {});
const declarado = await page.evaluate(() => {
  const a = document.body.getAttribute('data-puntaje-max');
  return a ? parseInt(a, 10) : (typeof window.__PUNTAJE_MAX__ === 'number' ? window.__PUNTAJE_MAX__ : null);
});

const puntos = () => page.evaluate(() => {
  const p = document.getElementById('d-points');
  if (!p) return 0;
  const v = p.getAttribute('data-valor');      // el número VERDADERO, sin esperar la animación
  return v !== null ? parseInt(v, 10) : parseInt((p.textContent || '0').replace(/\D/g, ''), 10) || 0;
});

const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));

async function recorrer() {
  let toques = 0;
  for (const id of ids) {
    if (!(await irASlide(page, id))) continue;

    /* Todo lo que en este molde puede pagar. Se toca con `.click()` del
       DOM y no con el mouse real a propósito: un elemento tapado por otro
       igual tiene que poder pagar si el curso lo cablea, y acá lo que se
       mide es el PUNTAJE, no la clickeabilidad (eso lo cubre
       hitbox-click-check). */
    const SEL = '[data-hit], [data-shot-swap-step], [data-shot-swap-go], ' +
                '[data-popup-trigger], [data-layer-trigger], [data-repaso-ans]';
    /* Se busca DENTRO de la diapositiva con `slide.querySelectorAll(SEL)`,
       nunca con el prefijo `[data-slide="x"] ${SEL}` (kit-base v1.9.120,
       §7.69): en una lista con comas el prefijo acota solo la PRIMERA
       alternativa, y las demás matcheaban en todo el documento. MEDIDO en
       "Seguridad de la información": "en la portada" encontraba 43
       elementos y la diapositiva tenía 1; desde ahí contestaba todos los
       repasos del curso con la primera opción y los trababa como errados.
       El test medía 145 de un máximo real de 200. */
    const enDiapo = (s) => {
      const sl = document.querySelector(`[data-slide="${s.id}"]`);
      return sl ? Array.from(sl.querySelectorAll(s.sel)) : [];
    };
    const n = await page.evaluate(`(${enDiapo})(${JSON.stringify({ id, sel: SEL })}).length`);

    for (let i = 0; i < n; i++) {
      try {
        await page.evaluate(`(() => { const el = (${enDiapo})(${JSON.stringify({ id, sel: SEL })})[${i}];
          if (el && !el.disabled) el.click(); })()`);
        toques++;
        await page.waitForTimeout(40);
        // cerrar lo que se haya abierto, para no tapar el siguiente
        await page.evaluate(() => {
          document.querySelectorAll('[data-popup-close]').forEach((b) => b.click());
        });
      } catch { /* un elemento que desaparece a mitad del recorrido no es un fallo */ }
    }
  }
  return toques;
}

const toques = await recorrer();

/* ---- El gancho para lo que un recorrido genérico no puede tocar
   (kit-base v1.9.97) ----
   Un curso con MINI JUEGO no se puede recorrer así y no es un selector
   que falte: las respuestas son botones que el curso fabrica con
   `innerHTML`, y aunque estuvieran en la lista, tocarlas todas tampoco
   sería "el máximo" —las incorrectas cuestan vidas—. Un recorrido
   genérico no puede JUGAR un juego.

   La consecuencia era incómoda: `data-puntaje-max` es todo o nada, así
   que un curso con minijuego o declaraba un número que el test no puede
   alcanzar (y fallaba) o declaraba el que el test mide (y afirmaba algo
   falso). Un curso terminó escribiendo su propio test de puntaje.

   Ahora el curso puede completar el recorrido él mismo:

       window.__PUNTAJE_RECORRIDO__ = async function () {
         // jugar el minijuego perfecto, o lo que este curso necesite
       };

   Se llama DESPUÉS del recorrido genérico y ANTES de medir, así que lo
   que suma se cuenta igual. Un curso que no lo define no cambia en nada.

   ⚠️ Lo que el gancho NO hace es adivinar: si el curso no lo implementa y
   declara un máximo que el recorrido no alcanza, el test sigue fallando —
   que es lo correcto, porque esa diferencia es real. */
const hayGancho = await page.evaluate(() => typeof window.__PUNTAJE_RECORRIDO__ === 'function');
if (hayGancho) {
  try {
    await page.evaluate(() => window.__PUNTAJE_RECORRIDO__());
    console.log('  · el curso completó el recorrido con `__PUNTAJE_RECORRIDO__()`.');
  } catch (e) {
    fails.push('`window.__PUNTAJE_RECORRIDO__()` tiró un error: ' + String(e).slice(0, 160));
  }
}

await page.waitForTimeout(600);       // que termine cualquier countTo pendiente
const medido = await puntos();

/* Segunda pasada y pasada tras recargar: el total no se mueve. */
const repasar = async (cuando, antes) => {
  await recorrer();
  await page.waitForTimeout(600);
  const otra = await puntos();
  console.log(`  · ${cuando} ${otra}`);
  if (otra !== antes) {
    fails.push(`${cuando} el puntaje pasó de ${antes} a ${otra}: algo PAGA DE NUEVO al volver a tocarlo. ` +
      'Cada pago tiene que chequear si ya se pagó (y ese "ya" tiene que viajar en suspend_data). ' +
      'Con unas vueltas así se llega al oro sin hacer lo que pide.');
  }
  return otra;
};
const segunda = await repasar('tocando todo de nuevo,', medido);
await page.reload();
await page.waitForTimeout(800);
await page.keyboard.press('Escape').catch(() => {});
const alVolver = await puntos();
if (alVolver !== segunda) {
  fails.push(`al recargar con el progreso guardado el puntaje volvió en ${alVolver} y era ${segunda}: ` +
    'los puntos no viajan bien en suspend_data.');
} else {
  await repasar('al recargar y tocar todo otra vez,', alVolver);
}

const suspend = await page.evaluate(() => {
  try {
    if (window.SCORM && SCORM.loadState) {
      const s = JSON.stringify(SCORM.loadState() || {});
      return s.length;
    }
  } catch { /* noop */ }
  return null;
});

console.log(`  · ${toques} elemento(s) tocado(s) · puntaje medido: ${medido}` +
  (declarado !== null ? ` · declarado: ${declarado}` : ' · (sin máximo declarado)') +
  (suspend !== null ? ` · suspend_data: ${suspend}/4096` : ''));

if (declarado !== null && medido !== declarado) {
  fails.push(`el puntaje MEDIDO recorriendo el curso es ${medido} y el declarado es ${declarado}. ` +
    'La tabla de puntos es una intención; el contador es el hecho. Los tres umbrales de medalla ' +
    'se derivan del máximo, así que esta diferencia deja al alumno sin la medalla que se ganó ' +
    '(o se la regala).');
}
if (suspend !== null && suspend > 2048) {
  fails.push(`cmi.suspend_data ocupa ${suspend} de los 4096 caracteres de SCORM 1.2 — ` +
    'pasando la mitad del cupo. `saveState()` rechaza en silencio cuando se pasa del tope, ' +
    'así que el aviso salta acá, con margen para acomodar, y no en el borde.');
}

if (errors.length) fails.push(...errors.map((e) => 'error de consola: ' + e));
report('puntaje-maximo', fails);
await browser.close();
