/* glosario-flow.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. El glosario del molde se desbloquea a medida que el
   alumno recorre el curso: cada término se destapa al visitar la
   diapositiva que lo explica. Son cinco contratos encadenados y cada
   uno se rompe callado:

     1 · al empezar, los términos están bloqueados;
     2 · un término bloqueado NO deja navegar a su diapositiva — bug
         real del cliente: `.is-locked` solo cambiaba estilos y el
         `[data-goto]` de adentro seguía siendo un botón habilitado,
         así que el glosario era un atajo para saltarse el recorrido
         gateado (§6.62). El arreglo fue poner `disabled` en el botón:
         un botón nativo deshabilitado no dispara `click`, así que el
         motor ni se entera;
     3 · el buscador no encuentra lo que todavía está bloqueado;
     4 · visitar la diapositiva lo desbloquea y avisa con un toast;
     5 · desde ahí se ve la definición y el buscador lo encuentra.

   ⚠️ Llegó desde un curso con SUS 26 términos y SUS nombres
   ("Inocuidad", "Alérgeno") escritos a mano, así que en cualquier otro
   curso reventaba. Acá el término de prueba se elige solo: el primero
   que esté bloqueado y apunte a una diapositiva real. Sin glosario, o
   sin términos bloqueados, no hay nada que revisar.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

const sel = (s) => `[data-popup="glosario"] dl.d-glossary ${s}`;

async function abrirGlosario() {
  await page.evaluate(() => { window.motor.closePopup && window.motor.closePopup(); });
  await page.click('[data-popup-trigger="glosario"]').catch(() => {});
  await page.waitForTimeout(250);
}

const hayGlosario = await page.evaluate(() => !!document.querySelector('[data-popup="glosario"]'));
if (!hayGlosario) {
  console.log('  · el curso no tiene glosario: nada que revisar.');
  if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
  await browser.close();
  report('glosario-flow', failures);
  process.exit(process.exitCode || 0);
}

await abrirGlosario();

/* 1 · Estado inicial y elección del término de prueba: el primero que
   esté bloqueado Y apunte a una diapositiva que exista. */
const inicio = await page.evaluate((s) => {
  const dts = Array.from(document.querySelectorAll(s));
  const bloqueados = dts.filter((d) => d.classList.contains('is-locked'));
  const cand = bloqueados.map((dt) => {
    const btn = dt.querySelector('[data-goto]');
    const goto = btn ? btn.getAttribute('data-goto') : null;
    return { texto: (btn ? btn.textContent : dt.textContent).trim(), goto, disabled: btn ? btn.disabled : null };
  }).find((c) => c.goto && document.querySelector(`[data-slide="${c.goto}"]`));
  return { total: dts.length, bloqueados: bloqueados.length, cand };
}, sel('dt'));

console.log(`  · ${inicio.total} término(s), ${inicio.bloqueados} bloqueado(s) al empezar.`);

if (!inicio.total) {
  console.log('  · el glosario no tiene términos todavía: nada que revisar.');
  if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
  await browser.close();
  report('glosario-flow', failures);
  process.exit(process.exitCode || 0);
}
if (!inicio.bloqueados) {
  failures.push(`los ${inicio.total} términos arrancan DESBLOQUEADOS: el glosario tiene que ` +
    'destaparse a medida que el alumno recorre el curso (`initGlossaryUnlock`).');
}
if (!inicio.cand) {
  if (inicio.bloqueados) {
    failures.push('hay términos bloqueados pero ninguno apunta con `data-goto` a una diapositiva ' +
      'real: sin eso no hay forma de desbloquearlos recorriendo el curso.');
  }
} else {
  const T = inicio.cand;
  console.log(`  · término de prueba: "${T.texto}" → diapositiva "${T.goto}".`);

  // 2 · Bloqueado = no navega, ni forzando el clic.
  if (!T.disabled) {
    failures.push(`el botón del término bloqueado "${T.texto}" debería estar \`disabled\`: si no, ` +
      'el glosario es un atajo para saltarse el recorrido gateado (§6.62).');
  }
  const antes = await page.evaluate(() => window.motor.current().getAttribute('data-slide'));
  await page.click(sel('dt.is-locked [data-goto]') + ' >> nth=0', { force: true }).catch(() => {});
  await page.waitForTimeout(300);
  const despues = await page.evaluate(() => window.motor.current().getAttribute('data-slide'));
  if (despues !== antes) {
    failures.push(`clickear un término bloqueado navegó igual, de "${antes}" a "${despues}"`);
  }
  /* Si navegó, el pop-up se cerró con él: hay que reabrirlo o los pasos
     siguientes se quedan esperando un campo que no está en pantalla
     (el test moría por timeout en vez de reportar el fallo real). */
  await abrirGlosario();

  // 3 · El buscador no lo encuentra mientras está bloqueado.
  const clave = T.texto.split(/\s+/)[0].toLowerCase();
  await page.fill('[data-gloss-search]', clave);
  await page.waitForTimeout(200);
  const ocultoBloqueado = await page.evaluate(({ s, txt }) => {
    const dt = Array.from(document.querySelectorAll(s)).find((d) => d.textContent.includes(txt));
    return dt ? dt.hidden : null;
  }, { s: sel('dt'), txt: T.texto.slice(0, 12) });
  if (ocultoBloqueado !== true) {
    failures.push(`buscar "${clave}" encontró un término todavía bloqueado (hidden=${ocultoBloqueado})`);
  }
  await page.fill('[data-gloss-search]', '');
  await page.waitForTimeout(150);

  // 4 · Visitar su diapositiva lo desbloquea y avisa.
  await page.evaluate((id) => window.motor.gotoId(id), T.goto);
  await page.waitForTimeout(400);
  const toast = await page.evaluate(() => {
    const t = document.querySelector('.d-award-toast.show');
    return t ? t.textContent : null;
  });
  if (!toast || !/[Dd]esbloque/.test(toast)) {
    failures.push(`visitar "${T.goto}" debería avisar con un toast de desbloqueo, hubo: "${toast}"`);
  }

  // 5 · Y desde ahí se ve y se busca.
  await abrirGlosario();
  const final = await page.evaluate(({ s, txt }) => {
    const dt = Array.from(document.querySelectorAll(s)).find((d) => d.textContent.includes(txt));
    if (!dt) return null;
    const dd = dt.nextElementSibling;
    const def = dd && dd.querySelector('.d-gloss-def');
    return {
      locked: dt.classList.contains('is-locked'),
      defVisible: def ? getComputedStyle(def).display !== 'none' : null
    };
  }, { s: sel('dt'), txt: T.texto.slice(0, 12) });
  if (!final) {
    failures.push(`tras visitar su diapositiva, "${T.texto}" desapareció del glosario`);
  } else {
    if (final.locked) failures.push(`"${T.texto}" sigue bloqueado tras visitar "${T.goto}"`);
    if (final.defVisible === false) failures.push(`la definición de "${T.texto}" no se muestra ya desbloqueada`);
  }
  await page.fill('[data-gloss-search]', clave);
  await page.waitForTimeout(200);
  const visibleDesbloqueado = await page.evaluate(({ s, txt }) => {
    const dt = Array.from(document.querySelectorAll(s)).find((d) => d.textContent.includes(txt));
    return dt ? dt.hidden : null;
  }, { s: sel('dt'), txt: T.texto.slice(0, 12) });
  if (visibleDesbloqueado !== false) {
    failures.push(`buscar "${clave}" no encuentra el término ya desbloqueado (hidden=${visibleDesbloqueado})`);
  }
}

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
await browser.close();
report('glosario-flow', failures);
