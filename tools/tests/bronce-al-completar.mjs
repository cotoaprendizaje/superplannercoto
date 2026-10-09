#!/usr/bin/env node
/* bronce-al-completar.mjs — kit-base v1.9.135
   ------------------------------------------------------------
   POR QUÉ EXISTE. Regla del cliente, tras ver "Todavía sin medalla" al
   final de "Seguridad alimentaria" (2026-10-09): *"con llegar al final
   del curso el mínimo debería ser medalla de bronce; con el plus en
   interacciones y logros llego a plata u oro, pero como base, siempre
   que se completa el curso, es bronce"*. El bronce de ese curso
   arrancaba en un piso calculado a mano que un recorrido real no
   siempre juntaba, y nada lo avisaba.

   QUÉ MIDE, con umbrales a propósito inalcanzables (bronce en 10.000):
     1 · el RESUMEN del cierre (`pintarMedalla`): con 0 puntos muestra
         bronce, no "Todavía sin medalla", y lo que falta lo cuenta para
         PLATA (no "te faltaron N para la de bronce");
     2 · el panel "Mis logros" (`initLogros`): antes de terminar, sin
         medalla; al llegar a la ÚLTIMA diapositiva, bronce — sin que el
         curso llame a nada; y avisa `medallasube` para el festejo;
     3 · terminar viaja en el estado: al retomar sigue en bronce;
     4 · `medallas` puede ser una función (relevo SA K9).
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page } = await openCourse(url);
const fails = [];

const r = await page.evaluate(async () => {
  const out = {};
  const NIV = [
    { id: 'bronce', nombre: 'bronce', desde: 10000 },
    { id: 'plata', nombre: 'plata', desde: 20000 },
    { id: 'oro', nombre: 'oro', desde: 30000 }
  ];

  /* 1 · resumen del cierre */
  if (typeof window.pintarMedalla === 'function') {
    const viejas = [...document.querySelectorAll('[data-medalla],[data-medalla-ic],[data-medalla-nombre],[data-medalla-lbl],[data-medalla-sub]')];
    viejas.forEach((e) => { e.dataset.__antes = e.getAttribute('data-medalla') !== null ? 'm' : '1'; });
    const box = document.createElement('div');
    box.innerHTML = '<div data-medalla><span data-medalla-ic></span><p><span data-medalla-lbl></span> <b data-medalla-nombre></b></p><p data-medalla-sub></p></div>';
    /* Las del curso se renombran un instante para que el kit pinte las del test. */
    const ren = [];
    viejas.forEach((e) => { ['data-medalla', 'data-medalla-ic', 'data-medalla-nombre', 'data-medalla-lbl', 'data-medalla-sub'].forEach((a) => { if (e.hasAttribute(a)) { ren.push([e, a]); e.setAttribute('x-' + a, e.getAttribute(a)); e.removeAttribute(a); } }); });
    document.body.appendChild(box);
    window.pintarMedalla(0, NIV);
    out.cierre = {
      nivel: box.querySelector('[data-medalla]').getAttribute('data-nivel'),
      lbl: box.querySelector('[data-medalla-lbl]').textContent,
      sub: box.querySelector('[data-medalla-sub]').textContent
    };
    window.pintarMedalla(0, NIV, false);
    out.cierreAntes = box.querySelector('[data-medalla]').getAttribute('data-nivel');
    box.remove();
    ren.forEach(([e, a]) => { e.setAttribute(a, e.getAttribute('x-' + a)); e.removeAttribute('x-' + a); });
  }

  /* 2 · panel "Mis logros" con su propia instancia */
  if (typeof window.initLogros === 'function' && window.motor && motor.slides && motor.slides.length > 1) {
    const lista = document.getElementById('d-badges-list');
    const tmp = document.createElement('div'); tmp.innerHTML = '<div id="d-badges-list"></div>';
    if (lista) lista.id = 'x-d-badges-list';
    document.body.appendChild(tmp);
    let llamadas = 0;
    const subidas = [];
    const alSubir = (e) => subidas.push(e.detail && e.detail.a);
    document.addEventListener('medallasube', alSubir);
    const L = window.initLogros({ badges: [], medallas: () => { llamadas++; return NIV; } });
    const nombre = () => (tmp.querySelector('[data-lg-nombre]') || {}).textContent || '';
    L.render();
    out.panelAntes = nombre();
    out.medallaAntes = L.medalla ? (L.medalla() || {}).id || null : 'sin-api';
    motor.gotoId(motor.slides[motor.slides.length - 1].getAttribute('data-slide'));
    await new Promise((res) => setTimeout(res, 400));
    out.panelFin = nombre();
    out.medallaFin = L.medalla ? (L.medalla() || {}).id || null : 'sin-api';
    out.subidas = subidas.slice();
    out.funcionUsada = llamadas > 0;
    const estado = L.serialize();
    document.removeEventListener('medallasube', alSubir);
    tmp.remove();
    /* 3 · retomar */
    const tmp2 = document.createElement('div'); tmp2.innerHTML = '<div id="d-badges-list"></div>';
    document.body.appendChild(tmp2);
    motor.gotoId(motor.slides[0].getAttribute('data-slide'));
    await new Promise((res) => setTimeout(res, 300));
    const L2 = window.initLogros({ badges: [], medallas: NIV });
    L2.restore(estado);
    L2.render();
    out.retomado = (tmp2.querySelector('[data-lg-nombre]') || {}).textContent || '';
    tmp2.remove();
    if (lista) lista.id = 'd-badges-list';
  }
  return out;
});

if (r.cierre) {
  if (r.cierre.nivel !== 'bronce') fails.push(`el resumen del cierre, con 0 puntos y bronce en 10.000, muestra nivel ${JSON.stringify(r.cierre.nivel)}: completar el curso da bronce como mínimo (regla del cliente).`);
  if (/Todavía sin/i.test(r.cierre.lbl)) fails.push('el resumen del cierre dice "Todavía sin medalla" a quien completó el curso.');
  if (/bronce/.test(r.cierre.sub)) fails.push(`el subtítulo cuenta lo que falta para el BRONCE que ya tiene: ${JSON.stringify(r.cierre.sub)} (tiene que contar para plata).`);
  if (r.cierreAntes !== 'ninguna') fails.push('`pintarMedalla(p, n, false)` (antes del final) debería poder mostrar "sin medalla".');
} else fails.push('el curso no expone `pintarMedalla` (coto-cierre.js).');

if ('panelAntes' in r) {
  if (/bronce/i.test(r.panelAntes)) fails.push('el panel "Mis logros" ya daba bronce ANTES de terminar el curso (con 0 puntos).');
  if (!/bronce/i.test(r.panelFin)) fails.push(`al llegar a la última diapositiva el panel "Mis logros" dice ${JSON.stringify(r.panelFin)}: terminar el curso da bronce como mínimo.`);
  if (r.medallaFin !== 'bronce') fails.push(`\`Logros.medalla()\` al terminar devuelve ${JSON.stringify(r.medallaFin)}, no bronce.`);
  if (!r.subidas.includes('bronce')) fails.push('al terminar no salió `medallasube` con bronce: el alumno no ve el festejo de su medalla.');
  if (!/bronce/i.test(r.retomado)) fails.push(`al retomar, el panel volvió a ${JSON.stringify(r.retomado)}: haber terminado tiene que viajar en el estado.`);
  if (!r.funcionUsada) fails.push('`medallas` como función no se usó (relevo SA K9).');
}

await browser.close();
report('bronce-al-completar', fails);
