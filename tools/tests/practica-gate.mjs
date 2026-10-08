/* practica-gate.mjs — la diapositiva de la mini práctica traba el avance
   hasta completarla, y "Repasar en …" llega a donde está la respuesta
   aunque sea un pop-up (kit-base v1.9.119, segundo relevo de "Prevención
   cardiovascular", 2026-10-06).

   BUG REAL que reportó el cliente, con foto: en la práctica se apretaba
   "Siguiente" sin contestar y se llegaba al cierre con "🔒 Hacé la mini
   práctica para desbloquear…", el pie en "Fin" y ninguna salida. El
   cierre exigía la práctica, pero su diapositiva no la pedía, y hasta
   v1.9.118 `initMiniQuiz` no devolvía ningún gate para pedirla. El curso
   lo resolvió por su cuenta (`faltaPractica`) y el kit no se enteró hasta
   el relevo.

   Tres partes:
     1 · El MÓDULO, en cualquier curso (si no carga `coto-quiz.js`, se lo
         carga): `initMiniQuiz` devuelve `faltan(slideEl)` — `['practica']`
         en la diapositiva de la práctica sin hacer, `[]` en las demás y
         `[]` al contestar la última; avisa con `gatechange`. Sin
         `[data-quiz]` devuelve un gate que no traba (el `canAdvance` de
         la plantilla no puede caerse por un `undefined`).
     2 · El CURSO, si tiene práctica en una diapositiva: parado en ella
         sin contestar, "Siguiente" no puede sacarlo de ahí. Es el
         recorrido del cliente.
     3 · Los `related` del banco (`curso.json → practica.banco`): cada uno
         tiene que ser una diapositiva o un pop-up. Si no, "Repasar" no
         hace nada, sin error. Y si hay un pop-up con disparador en una
         diapositiva, `irARelacionado` tiene que llegar y abrirlo. */
import { openCourse, irASlide, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];

/* ---- 1 · el módulo ---- */
{
  const { browser, page, errors } = await openCourse(url);
  const r = await page.evaluate(async () => {
    if (typeof window.initMiniQuiz !== 'function') {
      await new Promise((res) => {
        const sc = document.createElement('script');
        sc.src = 'js/coto-quiz.js'; sc.onload = res; sc.onerror = res;
        document.head.appendChild(sc);
      });
    }
    if (typeof window.initMiniQuiz !== 'function') return { no: 'no se pudo cargar `initMiniQuiz` (js/coto-quiz.js no está en el curso)' };
    const espera = (ms) => new Promise((res) => setTimeout(res, ms));
    /* Sin práctica: tiene que devolver un gate que no traba. Se saca de
       en medio el `[data-quiz]` del curso, si tiene, para medir este caso. */
    const delCurso = Array.from(document.querySelectorAll('[data-quiz]'));
    const marcas = delCurso.map((el) => { const c = document.createComment('q'); el.replaceWith(c); return [c, el]; });
    const vacio = window.initMiniQuiz({ bank: [{ q: 'x', opts: ['a', 'b'], ok: 0 }] });
    marcas.forEach(([c, el]) => c.replaceWith(el));
    const sinPractica = !!(vacio && typeof vacio.faltan === 'function' && vacio.faltan(document.body).length === 0);

    const diapo = document.createElement('section');
    diapo.id = 'zz-diapo-quiz';
    diapo.setAttribute('data-slide', 'zz-diapo-quiz');
    const host = document.createElement('div');
    host.setAttribute('data-quiz', '');
    diapo.appendChild(host);
    document.body.prepend(diapo);
    const otra = document.createElement('section');
    let avisos = 0;
    document.addEventListener('gatechange', () => { avisos++; });
    const ev = { start: 0, retry: 0 };
    document.addEventListener('quizstart', () => { ev.start++; });
    document.addEventListener('quizretry', () => { ev.retry++; });
    const banco = [0, 1, 2].map((i) => ({ q: 'Pregunta ' + i, opts: ['Buena ' + i, 'Mala ' + i, 'Otra ' + i], ok: 0, why: 'Porque ' + i }));
    const gate = window.initMiniQuiz({ bank: banco, size: 3, introPopup: 'zz-intro' });
    if (!gate || typeof gate.faltan !== 'function') { diapo.remove(); return { sinPractica, noGate: true }; }
    const alArrancar = { corre: diapo.classList.contains('is-quiz-running'), intro: diapo.getAttribute('data-intro-popup'), start: ev.start };
    const antes = gate.faltan(diapo).slice();
    const enOtra = gate.faltan(otra).slice();
    for (let i = 0; i < 3; i++) {
      /* Se contesta MAL a propósito: se exige completarla, no acertar. */
      const radio = host.querySelectorAll('.d-opt input')[1];
      if (!radio) { diapo.remove(); return { no: 'la práctica no dibujó opciones en la pregunta ' + (i + 1) }; }
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
      host.querySelector('[data-answer]').click();
      await espera(60);
      if (i < 2) { host.querySelector('[data-next]').click(); await espera(60); }
    }
    const despues = gate.faltan(diapo).slice();
    const alTerminar = { corre: diapo.classList.contains('is-quiz-running'), intro: diapo.getAttribute('data-intro-popup') };
    host.querySelector('[data-next]').click();          // "Ver resultado"
    await espera(60);
    const alResultado = { corre: diapo.classList.contains('is-quiz-running'), resultado: diapo.classList.contains('is-quiz-resultado') };
    const btnRetry = host.querySelector('[data-retry]');
    if (btnRetry) btnRetry.click();
    await espera(60);
    const alReintentar = { corre: diapo.classList.contains('is-quiz-running'), start: ev.start, retry: ev.retry };
    diapo.remove();
    return { sinPractica, antes, enOtra, despues, avisos, alArrancar, alTerminar, alResultado, alReintentar };
  });
  if (r.no) fallos.push(r.no);
  else {
    if (!r.sinPractica) fallos.push('sin `[data-quiz]` en la página, `initMiniQuiz` no devuelve un gate con `faltan()` que no trabe: el `canAdvance` de la plantilla se cae con un TypeError.');
    if (r.noGate) fallos.push('`initMiniQuiz` no devuelve un gate (`{ faltan(slideEl) }`): un curso no tiene con qué trabar la diapositiva de la práctica, y el alumno pasa de largo hasta un cierre con candado.');
    else {
      if (r.antes.length !== 1) fallos.push(`en la diapositiva de la práctica sin hacer, \`faltan()\` dio [${r.antes.join(', ')}]: tiene que pedir la práctica.`);
      if (r.enOtra.length) fallos.push(`en una diapositiva SIN práctica, \`faltan()\` dio [${r.enOtra.join(', ')}]: trabaría todo el curso.`);
      if (r.despues.length) fallos.push(`contestadas las tres (mal, a propósito), \`faltan()\` sigue dando [${r.despues.join(', ')}]: se exige completarla, no acertar.`);
      /* v1.9.121 (§7.70): estado "respondiendo", eventos y aviso previo. */
      const a = r.alArrancar, t = r.alTerminar, q = r.alReintentar;
      if (!a.corre) fallos.push('al arrancar la práctica la diapositiva no tiene `.is-quiz-running`: en el marco de Moodle la intro no se va y la pregunta queda bajo el pliegue.');
      if (a.start < 1) fallos.push('al arrancar la práctica no se emitió `quizstart`.');
      if (a.intro !== 'zz-intro') fallos.push(`con \`introPopup: 'zz-intro'\` y la práctica sin hacer, la diapositiva tiene \`data-intro-popup="${a.intro}"\`: el aviso de "no es la evaluación" no se abre.`);
      /* v1.9.126 (§7.75): con la ÚLTIMA devolución todavía en pantalla la
         marca se queda —sacarla ahí devolvía la intro y la diapositiva
         scrolleaba (lo vio el cliente en cardio)—; se va al dibujar el
         resultado. */
      if (!t.corre) fallos.push('al contestar la última pregunta, con su devolución en pantalla, la diapositiva perdió `.is-quiz-running`: vuelve la intro y empuja la devolución (scroll dentro de la diapositiva).');
      if (r.alResultado.corre || !r.alResultado.resultado) fallos.push('con el resultado en pantalla la diapositiva tiene que tener `.is-quiz-resultado` y no `.is-quiz-running`.');
      if (t.intro) fallos.push('completada la práctica, el aviso previo se sigue abriendo al entrar (`data-intro-popup` no salió).');
      if (!q.corre || q.retry < 1 || q.start < 2) fallos.push(`"Practicar de nuevo" no avisó: \`.is-quiz-running\` ${q.corre ? 'sí' : 'no'}, \`quizretry\` ${q.retry}, \`quizstart\` ${q.start} (tiene que ser 2).`);
      if (r.avisos < 1) fallos.push('al completar la práctica no se emitió `gatechange`: "Siguiente" queda deshabilitado hasta que otra cosa refresque la nav.');
    }
  }
  if (errors.length) fallos.push(...errors.map((e) => 'error de consola (parte 1): ' + e));
  await browser.close();
}

/* ---- 2 y 3 · el curso ---- */
{
  const { browser, page, errors } = await openCourse(url);
  const info = await page.evaluate(() => {
    const host = document.querySelector('[data-quiz]');
    const slide = host && host.closest('[data-slide]');
    const datos = window.datosDelCurso ? window.datosDelCurso('practica', null) : null;
    const banco = (datos && datos.banco) || [];
    const related = banco.map((p) => p.related).filter(Boolean);
    const malos = related.filter((id) => !document.querySelector('[data-slide="' + id + '"]') && !document.querySelector('[data-popup="' + id + '"]'));
    /* Un pop-up con disparador dentro de una diapositiva, para probar el camino largo. */
    let popup = null;
    for (const t of document.querySelectorAll('[data-slide] [data-popup-trigger]')) {
      const id = t.getAttribute('data-popup-trigger');
      if (document.querySelector('[data-popup="' + id + '"]')) { popup = { id, slide: t.closest('[data-slide]').getAttribute('data-slide') }; break; }
    }
    return { slide: slide && slide.getAttribute('data-slide'), related: related.length, malos, popup };
  });

  info.malos.forEach((id) => fallos.push(`el banco de la práctica tiene \`related: '${id}'\`, que no es ni una diapositiva ni un pop-up: "Repasar en …" no hace nada, sin error.`));

  if (info.slide) {
    const llego = await irASlide(page, info.slide);
    await page.waitForTimeout(500);
    const hecha = await page.evaluate(() => !!document.querySelector('[data-quiz] .d-quiz-result'));
    if (llego !== info.slide) fallos.push(`no se pudo llegar a la diapositiva de la práctica ("${info.slide}"); quedó en "${llego}".`);
    else if (!hecha) {
      await page.evaluate(() => { const b = document.querySelector('[data-nav="next"]'); if (b) b.click(); else window.motor.next(); });
      await page.waitForTimeout(700);
      const donde = await page.evaluate(() => window.motor.current().getAttribute('data-slide'));
      if (donde !== info.slide) {
        fallos.push(`parado en la práctica ("${info.slide}") SIN contestar, "Siguiente" lo llevó a "${donde}". ` +
          'El alumno llega al cierre con candado y sin salida (lo reportó el cliente). Sumar el gate que devuelve ' +
          '`initMiniQuiz` a `motor.canAdvance` y a `initGateHints` (ver "Gates de contenido" en js/curso.js).');
      }
    }
  }

  if (info.popup) {
    const r = await page.evaluate(async (p) => {
      /* Un curso sin práctica no carga coto-quiz.js (alimentaria): se
         carga acá, igual que en la parte 1, para medir el módulo. */
      if (typeof window.irARelacionado !== 'function') {
        await new Promise((res) => {
          const sc = document.createElement('script');
          sc.src = 'js/coto-quiz.js'; sc.onload = res; sc.onerror = res;
          document.head.appendChild(sc);
        });
      }
      if (typeof window.irARelacionado !== 'function') return { no: true };
      if (window.motor.openPopup) window.motor.closePopup();
      window.irARelacionado(p.id);
      await new Promise((res) => setTimeout(res, 1100));
      const abierto = window.motor.openPopup;
      return { donde: window.motor.current().getAttribute('data-slide'),
        abierto: abierto ? abierto.getAttribute('data-popup') : null };
    }, info.popup);
    if (r.no) fallos.push('el kit no publica `irARelacionado`: "Repasar en …" no sabe ir a un pop-up.');
    else if (r.abierto !== info.popup.id) {
      fallos.push(`"Repasar" hacia el pop-up "${info.popup.id}" quedó en "${r.donde}" con ${r.abierto ? `"${r.abierto}"` : 'ningún pop-up'} abierto: ` +
        `tenía que ir a "${info.popup.slide}" y abrirlo.`);
    }
  }
  if (errors.length) fallos.push(...errors.map((e) => 'error de consola (parte 2): ' + e));
  await browser.close();
}

report('practica-gate', fallos);
