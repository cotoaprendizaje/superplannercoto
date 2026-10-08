/* logros-kit.mjs — kit-base v1.9.125 (§7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Pedido del cliente: "¿hay tests que al final chequeen
   el sistema de logros y puntos? Quiero que todos los cursos tengan 5
   logros por defecto y que estén bien asociados a los puntos, que todo
   ese sistema funcione correctamente". Los cinco logros del kit
   (Puntería, En racha, Curioso, Explorador, Impecable) se detectan
   solos, por eventos de las piezas del kit; si un evento deja de salir,
   el logro queda imposible sin un solo error en consola.

   QUÉ HACE. Con un LMS en memoria que sobrevive la recarga:
     1 · Recorrido MÍNIMO: entrar y avanzar sin tocar nada → ningún logro
         del kit, bono 0. "Ninguno se gana con lo mínimo".
     2 · Cada logro con el gesto REAL del alumno, de a uno, y exige que se
         gane, que sume su bono UNA vez y que el contador de puntos lo
         muestre:
           · Explorador: abrir con un clic 3 paneles o fichas que
             ninguna diapositiva exige (Índice, Recursos, Mis logros…);
             abrirlos por código —como un gate que se abre solo— no cuenta.
           · Curioso: tocar 3 términos del glosario (si el curso tiene).
           · En racha: 3 respuestas bien seguidas (con una mal en el medio
             la racha vuelve a cero).
           · Impecable: la práctica entera bien al primer intento; un
             reintento perfecto NO lo da (decisión del cliente).
           · Puntería: todas las preguntas del repaso bien.
     3 · Recargar: los logros y el bono vuelven, y repetir los gestos no
         paga de nuevo.
   Un logro del kit que el curso no pidió no se mide. Un curso sin
   ningún logro del kit no tiene nada que revisar. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];

function lms() {
  const K = '__lk_lms';
  let store = {};
  try { store = JSON.parse(sessionStorage.getItem(K) || '{}'); } catch { /* vacío */ }
  const guardar = () => { try { sessionStorage.setItem(K, JSON.stringify(store)); } catch { /* noop */ } };
  window.API = {
    LMSInitialize: () => 'true', LMSFinish: () => 'true', LMSCommit: () => { guardar(); return 'true'; },
    LMSGetValue: (k) => (k === 'cmi.core.student_name' ? 'Prueba, Alumno' : (store[k] || '')),
    LMSSetValue: (k, v) => { store[k] = String(v); guardar(); return 'true'; },
    LMSGetLastError: () => '0', LMSGetErrorString: () => '', LMSGetDiagnostic: () => ''
  };
}

async function abrir() {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.addInitScript(lms);
  await page.goto(url);
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(() => { if (window.Narrador && Narrador.setEnabled) Narrador.setEnabled(false); });
  return { page, errores };
}

const estado = (page) => page.evaluate(() => {
  const p = document.getElementById('d-points');
  const cards = Array.from(document.querySelectorAll('#d-badges-list .d-badge[data-logro]'));
  return {
    puntos: p ? parseInt(p.getAttribute('data-valor') || '0', 10) : 0,
    bono: p ? parseInt(p.getAttribute('data-bono') || '0', 10) : 0,
    pedidos: cards.map((c) => c.getAttribute('data-logro')),
    ganados: cards.filter((c) => c.classList.contains('earned')).map((c) => c.getAttribute('data-logro'))
  };
});

const KIT = ['punteria', 'racha', 'curioso', 'explorador', 'impecable'];
const { page, errores } = await abrir();
/* Lo que el curso PIDE sale de sus datos (`curso.json` → logros), no de
   las tarjetas dibujadas: si el módulo no entendiera los ids del kit, las
   tarjetas no estarían y el test daría verde por ausencia. */
const pedidos = await page.evaluate((KIT) => {
  let l = [];
  try { l = (window.datosDelCurso && datosDelCurso('logros', [])) || []; } catch { l = []; }
  const ids = l.map((x) => (typeof x === 'string' ? x : x && x.id));
  const dom = Array.from(document.querySelectorAll('#d-badges-list [data-logro]')).map((c) => c.getAttribute('data-logro'));
  return [...new Set([...ids, ...dom])].filter((id) => KIT.includes(id));
}, KIT);

if (!pedidos.length) {
  console.log('  · el curso no usa logros del kit: nada que revisar.');
} else {
  /* 1 · Lo mínimo: avanzar de la primera a la última sin tocar nada. */
  await page.evaluate(() => { const m = window.motor; for (let i = 0; i < m.slides.length; i++) m.go(i, true); });
  await page.waitForTimeout(400);
  const e1 = await estado(page);
  const deMas = e1.ganados.filter((id) => KIT.includes(id));
  if (deMas.length) fallos.push(`con el recorrido MÍNIMO (avanzar sin tocar nada) ya se ganan: ${deMas.join(', ')}. Un logro del kit es un plus: nunca sale con lo obligatorio.`);

  const exigir = async (id, gesto, como) => {
    if (!pedidos.includes(id)) return;
    const antes = await estado(page);
    if (antes.ganados.includes(id)) { fallos.push(`"${id}" ya estaba ganado antes de ${como}.`); return; }
    const r = await page.evaluate(gesto);
    await page.waitForTimeout(400);
    if (r === 'no-aplica') { console.log(`  · ${id}: el curso no tiene con qué medirlo (${como}).`); return; }
    if (r === 'cortada-no-corta') { fallos.push('"racha" se ganó con una respuesta mal en el medio: la errada tiene que cortar la racha.'); return; }
    if (r === 'solo-cuenta') { fallos.push('"explorador" se ganó con pop-ups que se abrieron SOLOS (por código, como un gate): tiene que ser el alumno abriéndolos.'); return; }
    if (r === 'reintento') { fallos.push('"impecable" se ganó con un REINTENTO perfecto: tiene que ser el primer intento (reintentar no suma, decisión del cliente).'); return; }
    const despues = await estado(page);
    if (!despues.ganados.includes(id)) { fallos.push(`"${id}" no se ganó al ${como}: el detector del kit no se enteró.`); return; }
    if (despues.bono - antes.bono !== 20) fallos.push(`"${id}" se ganó pero el bono subió ${despues.bono - antes.bono} y no 20.`);
    if (despues.puntos - antes.puntos < 20) fallos.push(`"${id}" se ganó pero los puntos subieron ${despues.puntos - antes.puntos}: el bono no entró al contador.`);
    console.log(`  · ${id}: ✓ (${como})`);
  };

  /* 2 · Cada uno con su gesto. */
  await exigir('explorador', () => {
    const m = window.motor;
    const exigidos = new Set();
    document.querySelectorAll('[data-slide]').forEach((s) => ['data-require-popups', 'data-require-fichas', 'data-gate-popup']
      .forEach((a) => (s.getAttribute(a) || '').split(/\s+/).filter(Boolean).forEach((x) => exigidos.add(x))));
    const vistos = new Set();
    const botones = Array.from(document.querySelectorAll('[data-popup-trigger]')).filter((b) => {
      const id = b.getAttribute('data-popup-trigger');
      if (vistos.has(id) || exigidos.has(id) || id === 'glosario' || id === 'instrucciones' || !document.querySelector(`[data-popup="${id}"]`)) return false;
      vistos.add(id); return true;
    }).slice(0, 3);
    if (botones.length < 3) return 'no-aplica';
    botones.forEach((b) => { m.showPopup(b.getAttribute('data-popup-trigger')); m.closePopup(); });
    if (document.querySelector('#d-badges-list .d-badge.earned[data-logro="explorador"]')) return 'solo-cuenta';
    botones.forEach((b) => { b.click(); m.closePopup(); });
    return 'ok';
  }, 'abrir con un clic 3 paneles o fichas opcionales');

  await exigir('curioso', () => {
    const dts = Array.from(document.querySelectorAll('[data-popup="glosario"] dl.d-glossary dt'));
    if (dts.length < 3) return 'no-aplica';
    dts.forEach((dt) => dt.classList.remove('is-locked'));
    dts.slice(0, 3).forEach((dt) => dt.click());
    return 'ok';
  }, 'tocar 3 términos del glosario');

  await exigir('racha', () => {
    const r = (ok) => document.dispatchEvent(new CustomEvent('cotorespuesta', { detail: { fuente: 'practica', acerto: ok } }));
    r(true); r(true); r(false); r(true); r(true);          // la errada corta: todavía no
    const ya = !!document.querySelector('#d-badges-list .d-badge[data-logro="racha"].earned');
    if (ya) return 'cortada-no-corta';
    r(true);
    return 'ok';
  }, 'contestar 3 bien seguidas');

  /* Impecable y Puntería. Sin repaso en el curso, Puntería mira la
     práctica (coto-logros.js): el mismo gesto da los dos, +40. */
  const sinRepaso = await page.evaluate(() => !document.querySelector('[data-slide] [data-repaso-item][data-repaso-id]'));
  if (sinRepaso && pedidos.includes('punteria') && pedidos.includes('impecable')) {
    const antesP = await estado(page);
    const rP = await page.evaluate(() => {
      const fin = (c, t, primera) => document.dispatchEvent(new CustomEvent('cotopractica', { detail: { correctas: c, total: t, primera } }));
      fin(3, 3, false);
      if (document.querySelector('#d-badges-list .d-badge.earned[data-logro="impecable"], #d-badges-list .d-badge.earned[data-logro="punteria"]')) return 'reintento';
      fin(3, 3, true);
      return 'ok';
    });
    await page.waitForTimeout(400);
    const despP = await estado(page);
    if (rP === 'reintento') fallos.push('un REINTENTO perfecto de la práctica dio Impecable o Puntería: tiene que ser el primer intento.');
    else if (!despP.ganados.includes('impecable') || !despP.ganados.includes('punteria')) fallos.push('la práctica perfecta al primer intento (curso sin repaso) no dio Impecable y Puntería.');
    else if (despP.bono - antesP.bono !== 40) fallos.push(`Impecable + Puntería subieron el bono ${despP.bono - antesP.bono} y no 40.`);
    else console.log('  · impecable + punteria: ✓ (práctica perfecta al primer intento; el curso no tiene repaso)');
  } else {
    await exigir('punteria', () => {
      const items = Array.from(document.querySelectorAll('[data-slide] [data-repaso-item][data-repaso-id]'));
      if (!items.length) return 'no-aplica';
      /* Clic REAL en la respuesta buena: así se mide también que el repaso
         del kit avise (`cotorespuesta`), no solo que el detector escuche. */
      items.forEach((it) => {
        const ok = it.getAttribute('data-repaso-ok') === 'true';
        const b = Array.from(it.querySelectorAll('[data-repaso-ans]')).find((x) => (x.getAttribute('data-repaso-ans') === 'true') === ok);
        if (b) b.click();
      });
      return 'ok';
    }, 'contestar bien todo el repaso (clic en las respuestas)');
    await exigir('impecable', () => {
      const fin = (c, t, primera) => document.dispatchEvent(new CustomEvent('cotopractica', { detail: { correctas: c, total: t, primera } }));
      fin(3, 3, false);                                     // reintento perfecto: no cuenta
      if (document.querySelector('#d-badges-list .d-badge[data-logro="impecable"].earned')) return 'reintento';
      fin(3, 3, true);
      return 'ok';
    }, 'terminar la práctica perfecta al primer intento');
  }

  /* 3 · Recargar: vuelven, y repetir no paga. */
  const antes = await estado(page);
  await page.reload();
  await page.waitForTimeout(900);
  await page.keyboard.press('Escape').catch(() => {});
  const vuelto = await estado(page);
  const perdidos = antes.ganados.filter((id) => !vuelto.ganados.includes(id));
  if (perdidos.length) fallos.push(`al recargar se perdieron: ${perdidos.join(', ')}.`);
  if (vuelto.puntos !== antes.puntos) fallos.push(`al recargar los puntos volvieron en ${vuelto.puntos} y eran ${antes.puntos}.`);
  await page.evaluate(() => {
    window.motor.go(2, true); window.motor.go(1, true);
    for (let i = 0; i < 4; i++) document.dispatchEvent(new CustomEvent('cotorespuesta', { detail: { fuente: 'practica', acerto: true } }));
    document.dispatchEvent(new CustomEvent('cotopractica', { detail: { correctas: 3, total: 3, primera: true } }));
  });
  await page.waitForTimeout(400);
  const otra = await estado(page);
  if (otra.bono !== vuelto.bono) fallos.push(`repetir los gestos después de recargar cambió el bono de ${vuelto.bono} a ${otra.bono}: un logro pagó dos veces.`);
  console.log(`  · ${pedidos.length} logro(s) del kit pedidos · ganados: ${otra.ganados.filter((id) => KIT.includes(id)).length} · bono ${otra.bono}`);
}

if (errores.length) fallos.push(...errores.map((e) => 'error de consola: ' + e));
report('logros-kit', fallos);
await browser.close();
