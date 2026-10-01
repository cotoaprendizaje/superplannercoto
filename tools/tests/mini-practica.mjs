#!/usr/bin/env node
/* mini-practica.mjs — kit-base v1.9.98
   ------------------------------------------------------------
   POR QUÉ EXISTE. La mini práctica (`initMiniQuiz`, coto-quiz.js) tiene
   cuatro reglas del molde que hasta ahora no verificaba nadie, y las
   cuatro salieron de un reporte:

     1 · las preguntas son de TRES opciones. Con cuatro, la tarjeta
         crece ~52px y en un teléfono acostado dejaba de entrar (ver 4).
     2 · cada opción va con su letra —a) b) c)—. Sin eso no hay forma
         corta de referirse a una opción: hay que leerla entera, y en
         este molde son frases largas.
     3 · al terminar hay un botón para SEGUIR. Sin él la única salida
         visible es "Practicar de nuevo" y el alumno que ya terminó se
         queda mirando su nota sin saber que tiene que ir al pie de la
         pantalla.
     4 · NO HAY SCROLL. Nunca, en ningún estado.

   Y el 4 es el que justifica un test aparte, porque es un HUECO DE
   COBERTURA real: `scroll-audit` recorre las diapositivas pero NUNCA
   RESPONDE el cuestionario, así que jamás llega a la pantalla de
   resultado — que es el estado MÁS ALTO de la diapositiva (nota + una
   ficha de repaso por pregunta errada + dos botones). Medido en
   "Prevención cardiovascular" a 844x390: la pregunta entraba y el
   resultado se pasaba 53px, con el botón "Continuar" fuera de la
   diapositiva. La suite entera estaba en verde.

   Este test responde las preguntas TODAS MAL a propósito: es el caso
   que produce la lista de repaso completa, o sea el más alto.
*/
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

/* Alto chico primero: es donde se rompe. El resto valida que no se haya
   arreglado a costa de escritorio. */
const VPS = [
  { w: 844, h: 390, label: 'teléfono acostado' },
  { w: 1280, h: 720, label: 'notebook' },
  { w: 1600, h: 900, label: 'PC' }
];

/* ---- ¿este curso tiene mini práctica? ---- */
{
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(600);
  const hay = await page.evaluate(() => !!document.querySelector('[data-quiz]'));
  await page.close();
  if (!hay) {
    console.log('  · el curso no tiene mini práctica ([data-quiz]): nada que revisar.');
    await browser.close();
    report('mini-practica', []);
    process.exit(process.exitCode || 0);
  }
}

for (const vp of VPS) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  /* Semilla fija: `initMiniQuiz` sortea las preguntas del banco y mezcla
     las opciones, así que sin esto dos corridas miden cosas distintas. */
  await page.addInitScript(() => { let s = 7; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; });
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape').catch(() => {});

  const idQuiz = await page.evaluate(() => {
    const q = document.querySelector('[data-quiz]');
    const sl = q && q.closest('[data-slide]');
    return sl ? sl.getAttribute('data-slide') : null;
  });
  if (!idQuiz) { fallos.push('[data-quiz] no vive dentro de ninguna [data-slide]'); await page.close(); continue; }

  await page.evaluate((id) => window.motor.gotoId(id), idQuiz);
  await page.waitForTimeout(900);
  await page.evaluate(() => window.motor.closePopup && window.motor.closePopup());
  await page.waitForTimeout(500);
  /* Si la práctica vive en una CAPA (`[data-panel]`) que se habilita
     después de otra actividad, se muestra esa capa y se esconden sus
     hermanas, como hace el motor al cambiar de capa (kit-base v1.9.107).
     MEDIDO en "Pedidos de PLU set": el quiz es la parte 2 de una práctica
     en dos capas, el test clickeaba respuestas invisibles, nunca llegaba
     al resultado y lo reportaba como falla del curso. */
  await page.evaluate(() => {
    let n = document.querySelector('[data-quiz]');
    while (n && !n.matches('[data-slide]')) {
      if (n.matches('[data-panel]') && n.parentElement) {
        n.parentElement.querySelectorAll(':scope > [data-panel]').forEach((p) => { p.hidden = p !== n; });
      }
      n = n.parentElement;
    }
  });
  await page.waitForTimeout(300);

  /* ---- medida del estado ACTUAL de la diapositiva ---- */
  const medir = () => page.evaluate((id) => {
    const sl = document.querySelector(`[data-slide="${id}"]`);
    const sr = sl.getBoundingClientRect();
    const inner = Array.from(sl.querySelectorAll('.slide-inner'))
      .find((e) => e.offsetParent !== null && e.getBoundingClientRect().height > 0);
    const ir = inner ? inner.getBoundingClientRect() : null;
    const scrollean = Array.from(sl.querySelectorAll('*')).filter((e) => {
      const cs = getComputedStyle(e);
      return /auto|scroll/.test(cs.overflowY + cs.overflowX) &&
             (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2);
    }).map((e) => e.className || e.tagName);
    const fuera = [];
    sl.querySelectorAll('button, label.d-opt, a[href]').forEach((el) => {
      if (el.closest('[hidden]') || el.offsetParent === null) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const px = Math.round(Math.max(0, sr.top - r.top, r.bottom - sr.bottom));
      if (px > 2) fuera.push(((el.textContent || '').trim().slice(0, 28) || el.className) + ` (${px}px)`);
    });
    return {
      recorte: ir ? Math.round(Math.max(0, sr.top - ir.top, ir.bottom - sr.bottom)) : 0,
      scrollean, fuera,
      docScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
    };
  }, idQuiz);

  const revisar = (m, estado) => {
    if (m.recorte > 2) {
      fallos.push(`[${vp.label}] ${estado}: el contenido se recorta ${m.recorte}px — en estos cursos ` +
        'no hay scroll, así que tiene que ENTRAR.');
    }
    if (m.docScroll > 2) fallos.push(`[${vp.label}] ${estado}: la página scrollea ${m.docScroll}px.`);
    if (m.scrollean.length) {
      fallos.push(`[${vp.label}] ${estado}: hay ${m.scrollean.length} contenedor(es) que scrollean ` +
        `(${m.scrollean.join(', ')}). La regla del molde es que el contenido entre, no que se scrollee.`);
    }
    m.fuera.forEach((f) => fallos.push(`[${vp.label}] ${estado}: "${f}" queda fuera de la diapositiva.`));
  };

  /* ---- 1 y 2 · tres opciones, con su letra ---- */
  const opciones = await page.evaluate(() => {
    const opts = Array.from(document.querySelectorAll('[data-quiz] .d-opt'));
    return opts.map((o) => {
      const l = o.querySelector('.d-opt-letra');
      return { letra: l ? l.textContent.trim() : null };
    });
  });
  if (opciones.length !== 3) {
    fallos.push(`[${vp.label}] la pregunta tiene ${opciones.length} opciones: el molde son TRES ` +
      '(y con cuatro la tarjeta deja de entrar en un teléfono acostado).');
  }
  const esperadas = ['a)', 'b)', 'c)'];
  opciones.forEach((o, i) => {
    if (!o.letra) fallos.push(`[${vp.label}] la opción ${i + 1} no tiene su letra (.d-opt-letra).`);
    else if (i < 3 && o.letra !== esperadas[i]) {
      fallos.push(`[${vp.label}] la opción ${i + 1} dice "${o.letra}", se esperaba "${esperadas[i]}".`);
    }
  });

  revisar(await medir(), 'con la pregunta en pantalla');

  /* ---- responder TODAS MAL: el estado más alto ---- */
  for (let i = 0; i < 6; i++) {
    const hayPregunta = await page.evaluate(() => !!document.querySelector('[data-quiz] [data-answer]'));
    if (!hayPregunta) break;
    await page.evaluate(() => {
      const ins = document.querySelectorAll('[data-quiz] .d-opt input');
      if (!ins.length) return;
      ins[0].checked = true;
      ins[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.click('[data-quiz] [data-answer]', { force: true }).catch(() => {});
    await page.waitForTimeout(350);
    const sig = await page.$('[data-quiz] [data-next]:not([hidden])');
    if (sig) { await sig.click({ force: true }).catch(() => {}); await page.waitForTimeout(350); }
  }
  await page.waitForTimeout(500);

  /* ---- 3 · el botón de seguir ---- */
  const cierre = await page.evaluate(() => {
    const res = document.querySelector('[data-quiz] .d-quiz-result');
    const go = document.querySelector('[data-quiz] [data-go-next]');
    return { hayResultado: !!res, haySeguir: !!go, rotulo: go ? (go.textContent || '').trim() : null };
  });
  if (!cierre.hayResultado) {
    fallos.push(`[${vp.label}] no se llegó a la pantalla de resultado: no se pudo medir el estado más alto.`);
  } else {
    if (!cierre.haySeguir) {
      fallos.push(`[${vp.label}] la pantalla de resultado no tiene botón para SEGUIR ([data-go-next]): ` +
        'la única salida visible queda "Practicar de nuevo".');
    }
    revisar(await medir(), 'en la pantalla de resultado');
  }

  await page.close();
}

await browser.close();
report('mini-practica', fallos);
