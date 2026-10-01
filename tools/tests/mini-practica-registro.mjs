/* mini-practica-registro.mjs — la mini práctica queda COMPLETA al
   contestar la última pregunta, no al pulsar "Ver resultado"
   (kit-base v1.9.107, relevo de "Prevención cardiovascular").

   BUG REAL que reportó el cliente: contestaba las tres preguntas, leía
   la devolución de la tercera y seguía con el "Siguiente" del CURSO. El
   registro —`setState({done})`, `onFirstFinish()`, `onFinish()`— vivía en
   `finish()`, que solo corre al pulsar "Ver resultado", así que nada se
   guardaba y el cierre quedaba con candado.

   El test arma SU PROPIA práctica (un `[data-quiz]` puesto primero en el
   documento, porque `initMiniQuiz` toma el primero) con espías en los
   callbacks, contesta las tres preguntas sin tocar "Ver resultado" y
   verifica:
     · que `onFinish`, `onFirstFinish` y `setState({done:true})` corrieron
       UNA vez;
     · que pulsar "Ver resultado" después no los vuelve a correr (los
       intentos no pueden contarse dos veces);
     · que al contestar se narra la DEVOLUCIÓN (la locución corta la
       pregunta y pasa a la retroalimentación — mismo relevo). */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const { browser, page, errors } = await openCourse(url);

const r = await page.evaluate(async () => {
  /* Un curso sin mini práctica no carga `coto-quiz.js`, pero el archivo
     está (lo copia el kit): se carga acá, para probar el módulo igual en
     vez de dar verde —o rojo— sin medir. MEDIDO en "Seguridad de la
     información", que no tiene práctica. */
  if (typeof window.initMiniQuiz !== 'function') {
    await new Promise((res) => {
      const sc = document.createElement('script');
      sc.src = 'js/coto-quiz.js'; sc.onload = res; sc.onerror = res;
      document.head.appendChild(sc);
    });
  }
  if (typeof window.initMiniQuiz !== 'function') return { no: 'no se pudo cargar `initMiniQuiz` (js/coto-quiz.js no está en el curso)' };
  const host = document.createElement('div');
  host.setAttribute('data-quiz', '');
  host.id = 'zz-quiz';
  document.body.prepend(host);
  const log = { finish: 0, first: 0, done: 0, narrados: [], result: 0, resultConCaja: 0 };
  const banco = [0, 1, 2].map((i) => ({ q: 'Pregunta ' + i, opts: ['Buena ' + i, 'Mala ' + i, 'Otra ' + i], ok: 0, why: 'Porque sí ' + i }));
  window.initMiniQuiz({
    bank: banco, size: 3,
    setState: (s) => { if (s && s.done) log.done++; },
    onFirstFinish: () => { log.first++; },
    onFinish: () => { log.finish++; },
    onResult: (caja) => { log.result++; if (caja && caja.isConnected && caja.matches('.d-quiz-result')) log.resultConCaja++; },
    narrate: (el) => { log.narrados.push(el && el.matches && el.matches('[data-fb]') ? 'fb' : 'otro'); }
  });
  const espera = (ms) => new Promise((res) => setTimeout(res, ms));
  for (let i = 0; i < 3; i++) {
    const radio = host.querySelector('.d-opt input');
    if (!radio) return { no: 'la práctica no dibujó opciones en la pregunta ' + (i + 1) };
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
    host.querySelector('[data-answer]').click();
    await espera(60);
    if (i < 2) { host.querySelector('[data-next]').click(); await espera(60); }
  }
  const trasContestar = { finish: log.finish, first: log.first, done: log.done, result: log.result };
  const fbNarradas = log.narrados.filter((x) => x === 'fb').length;
  host.querySelector('[data-next]').click();          // "Ver resultado"
  await espera(60);
  const trasResultado = { finish: log.finish, first: log.first, done: log.done, result: log.result, resultConCaja: log.resultConCaja };
  host.remove();
  return { trasContestar, trasResultado, fbNarradas };
});

if (r.no) fallos.push(r.no);
else {
  const a = r.trasContestar, b = r.trasResultado;
  if (a.finish !== 1 || a.done !== 1 || a.first !== 1) {
    fallos.push(`contestadas las tres preguntas SIN pulsar "Ver resultado", la práctica no quedó registrada ` +
      `(onFinish ${a.finish}, setState done ${a.done}, onFirstFinish ${a.first}; tiene que ser 1 cada uno). ` +
      'El alumno que sigue con el "Siguiente" del curso deja el cierre con candado y sin puntos.');
  }
  if (b.finish !== 1 || b.done !== 1 || b.first !== 1) {
    fallos.push(`pulsar "Ver resultado" después de contestar volvió a registrar la práctica ` +
      `(onFinish ${b.finish}, setState done ${b.done}, onFirstFinish ${b.first}): los intentos se cuentan dos veces.`);
  }
  /* `onResult` (v1.9.107): el gancho para DECORAR la pantalla de
     resultado. No puede correr antes de que exista —ese es el momento de
     `onFinish`— y tiene que recibir la caja ya dibujada. */
  if (a.result !== 0) fallos.push(`\`onResult\` corrió ${a.result} vez(ces) ANTES de pulsar "Ver resultado": la pantalla de resultado todavía no existe.`);
  if (b.result !== 1 || b.resultConCaja !== 1) {
    fallos.push(`al mostrar el resultado, \`onResult\` corrió ${b.result} vez(ces) y ${b.resultConCaja} con la caja \`.d-quiz-result\` ya dibujada (tiene que ser 1 y 1): un curso que decora esa pantalla no tiene dónde engancharse.`);
  }
  if (r.fbNarradas < 3) {
    fallos.push(`al contestar se narró la devolución ${r.fbNarradas} de 3 veces: la locución sigue con la pregunta ` +
      'encima de una retroalimentación que ya está en pantalla.');
  }
}
if (errors.length) fallos.push(...errors.map((e) => 'error de consola: ' + e));
await browser.close();
report('mini-practica-registro', fallos);
