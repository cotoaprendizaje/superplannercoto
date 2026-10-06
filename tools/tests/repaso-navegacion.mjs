/* repaso-navegacion.mjs — la tira de repaso al volver y al navegar
   (kit-base v1.9.118, relevo de "Seguridad alimentaria", 2026-10-06).

   Cuatro pedidos del cliente que ese curso resolvía con su propio repaso y
   el del kit no tenía:
     1. al cambiar de pregunta con las flechas se corta la voz y se narra
        SOLO la pregunta nueva (no la devolución anterior, no la lámina);
     2. una respuesta ERRADA de otra sesión se restaura (`seenMal`): se
        marca cuál eligió y cuál era la buena, sin narrar nada al cargar;
     3. cada respuesta avisa (`onAnswer`), por ejemplo para xAPI;
     4. al entrar arranca en la primera pregunta SIN contestar.

   El test arma SU tira (dos preguntas V/F) dentro de la diapositiva activa
   y la inicializa con un `seenMal` que dice que la 1 se contestó mal. La
   locución se espía: `isNarrating` en true y `speak`/`cancel` anotados. */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const { browser, page, errors } = await openCourse(url);

const r = await page.evaluate(async () => {
  if (typeof window.initRepasoRapido !== 'function') return { no: 'el curso no carga `initRepasoRapido` (coto-ui.js)' };
  if (!window.Narrador) return { no: 'el curso no carga narrador.js' };
  const espera = (ms) => new Promise((res) => setTimeout(res, ms));
  const sl = document.querySelector('.slide.is-active') || document.querySelector('[data-slide]');
  const tira = document.createElement('div');
  tira.className = 'd-repaso';
  tira.setAttribute('data-repaso', '');
  tira.id = 'zz-repaso';
  tira.innerHTML =
    '<b class="d-repaso-title">Repaso<span class="d-repaso-nav">' +
    '<button type="button" class="d-repaso-arrow" data-repaso-prev>‹</button>' +
    '<span class="d-repaso-count" data-repaso-count></span>' +
    '<button type="button" class="d-repaso-arrow" data-repaso-nextq>›</button></span></b>' +
    ['uno', 'dos'].map((n, k) =>
      `<div class="d-repaso-item" data-repaso-item data-repaso-n="${k + 1}" data-repaso-id="zz-${n}" data-repaso-ok="true">` +
      `<p class="d-repaso-q">Pregunta ${n} de prueba.</p>` +
      '<div class="d-repaso-btns d-repaso-btns--vf"><button type="button" data-repaso-ans="true">Verdadero</button>' +
      '<button type="button" data-repaso-ans="false">Falso</button></div>' +
      `<p class="d-repaso-fb" data-repaso-fb hidden>Devolución ${n}.</p></div>`).join('');
  sl.appendChild(tira);

  // Espía de la locución.
  const N = window.Narrador;
  const dichos = [];
  let cortes = 0;
  const orig = { speak: N.speak, cancel: N.cancel, isNarrating: N.isNarrating };
  N.isNarrating = () => true;
  N.speak = (t) => { dichos.push(String(t)); };
  N.cancel = () => { cortes++; };

  const respuestas = [];
  window.initRepasoRapido({
    seen: () => false,
    seenMal: (id) => (id === 'zz-uno' ? 'false' : null),
    onAnswer: (id, acerto, eligio) => respuestas.push([id, acerto, eligio])
  });
  await espera(400);
  const items = [...tira.querySelectorAll('[data-repaso-item]')];
  const res = {
    arrancaEn: items.findIndex((it) => !it.hidden),
    elegida: (items[0].querySelector('[data-chosen]') || {}).textContent || '',
    buena: (items[0].querySelector('.es-la-correcta') || {}).textContent || '',
    dichosAlCargar: dichos.length
  };

  // Contestar la 2 (bien) → onAnswer.
  items[1].querySelector('[data-repaso-ans="true"]').click();
  await espera(350);
  res.respuestas = respuestas.slice();

  // Flecha hacia atrás: corta y narra SOLO la pregunta 1.
  dichos.length = 0; cortes = 0;
  tira.querySelector('[data-repaso-prev]').click();
  await espera(450);
  res.cortes = cortes;
  res.dichosFlecha = dichos.slice();

  Object.assign(N, orig);
  tira.remove();
  return res;
});

if (r.no) fallos.push(r.no);
else {
  if (r.arrancaEn !== 1) fallos.push(`con la pregunta 1 ya contestada (mal), la tira arrancó en la ${r.arrancaEn + 1}: tiene que arrancar en la primera SIN contestar.`);
  if (!/Falso/.test(r.elegida)) fallos.push(`la respuesta errada de otra sesión no se restauró: la marcada como elegida es "${r.elegida}" (tenía que ser "Falso").`);
  if (!/Verdadero/.test(r.buena)) fallos.push('al restaurar la respuesta errada no se señala cuál era la correcta.');
  if (r.dichosAlCargar) fallos.push(`al cargar se narraron ${r.dichosAlCargar} cosa(s): restaurar una respuesta no tiene que hablar.`);
  if (!r.respuestas.length || r.respuestas[0][0] !== 'zz-dos' || r.respuestas[0][1] !== true) {
    fallos.push(`contestar la pregunta 2 no avisó por \`onAnswer\` (avisos: ${JSON.stringify(r.respuestas)}).`);
  }
  if (!r.cortes) fallos.push('al cambiar de pregunta con la flecha no se cortó la voz: la devolución anterior sigue sonando.');
  if (r.dichosFlecha.length !== 1 || !/Pregunta uno/.test(r.dichosFlecha[0]) || /Pregunta dos|Devolución dos/.test(r.dichosFlecha[0])) {
    fallos.push(`al volver con la flecha se narró ${JSON.stringify(r.dichosFlecha)}: tiene que narrarse SOLO la pregunta 1.`);
  }
}
if (errors.length) fallos.push(...errors.map((e) => 'error de consola: ' + e));
await browser.close();
report('repaso-navegacion', fallos);
