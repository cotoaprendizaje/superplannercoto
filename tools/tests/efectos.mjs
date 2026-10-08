/* efectos.mjs — kit-base v1.9.125 (§7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El rediseño trajo diez efectos aprobados por el
   cliente en el canvas, por escalón: chicos siempre (tilde, sacudida,
   "+N" que sube, contador), medianos solo en logros (destellos, sello,
   en la tarjeta "¡Nuevo logro!") y grandes en el oro y al terminar
   (fuegos, lluvia y serpentinas, destello en la barra). Viven en fx.js,
   que es decoración: si un evento deja de salir o una clase cambia de
   nombre, el efecto desaparece sin un error en consola. Y el riesgo al
   revés: una capa de festejo que se COME los clics traba el curso.

   QUÉ HACE, en un curso real:
     1 · Ganar un logro con el gesto del alumno (volver a una diapositiva
         ya vista: Segunda mirada, el logro del kit más fácil de provocar;
         si el curso no lo usa, `logroganado` a mano) → aparece la tarjeta
         con su nombre, el sello y los destellos; es `aria-hidden` (el
         toast ya lo anuncia) y deja pasar el clic: lo que está debajo
         recibe el toque y la tarjeta se va.
     2 · `__fxCoin(10)` → la pastilla "+10".
     3 · `medallasube` al oro → "¡Subiste a Oro!" con la medalla que gira
         y fuegos artificiales.
     4 · Llegar a la última diapositiva NAVEGANDO → lluvia de papelitos y
         la barra se pone verde. Arrancar ahí (retomar) no festeja.
     1b · Con un pop-up abierto la tarjeta espera, y si se abre uno con la
         tarjeta a la vista, se guarda y vuelve al cerrarlo (v1.9.127).
     5 · Con "reducir movimiento": la tarjeta sale igual, sin partículas.
   Un curso sin `fx.js` no tiene nada que revisar. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];

async function abrir(opciones = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 760 }, ...opciones });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape').catch(() => {});
  return { ctx, page, errores };
}

const { ctx, page, errores } = await abrir();
const tieneFx = await page.evaluate(() => typeof window.__fxCoin === 'function');
if (!tieneFx) {
  console.log('  · el curso no carga fx.js: nada que revisar.');
} else {
  /* 1 · La tarjeta del logro. */
  /* Con el gesto real si el curso tiene "Explorador" (3 paneles
     opcionales abiertos con un clic); si no, el evento a mano. */
  await page.evaluate(() => {
    const m = window.motor;
    const ids = ['sidenav', 'recursos', 'logros'].filter((id) => document.querySelector(`[data-popup-trigger="${id}"]`));
    if (document.querySelector('#d-badges-list .d-badge[data-logro="explorador"]:not(.earned)') && ids.length === 3) {
      ids.forEach((id) => { document.querySelector(`[data-popup-trigger="${id}"]`).click(); m.closePopup(); });
    } else document.dispatchEvent(new CustomEvent('logroganado', { detail: { id: 'x', nombre: 'Prueba', txt: 'Un logro de prueba.', pts: 20 } }));
  });
  await page.waitForTimeout(500);
  const t = await page.evaluate(() => {
    const el = document.querySelector('.fx-logro');
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      oculta: el.getAttribute('aria-hidden') === 'true',
      pasa: cs.pointerEvents === 'none',
      nombre: (el.querySelector('.fx-logro-nom') || {}).textContent || '',
      sello: !!el.querySelector('.fx-logro-sello'),
      destellos: el.querySelectorAll('.fx-destello').length,
      visible: el.getBoundingClientRect().width > 0 && cs.display !== 'none'
    };
  });
  if (!t) fallos.push('ganar un logro no mostró la tarjeta "¡Nuevo logro!" (`.fx-logro`): fx.js no escucha `logroganado`, o coto-logros.js dejó de emitirlo.');
  else {
    if (!t.visible) fallos.push('la tarjeta "¡Nuevo logro!" existe pero no se ve (¿falta coto-fx.css?).');
    if (!t.nombre.trim()) fallos.push('la tarjeta "¡Nuevo logro!" no dice qué logro se ganó.');
    if (!t.sello || t.destellos < 3) fallos.push(`la tarjeta "¡Nuevo logro!" no trae el sello y los destellos (sello: ${t.sello}, destellos: ${t.destellos}).`);
    if (!t.oculta) fallos.push('la tarjeta "¡Nuevo logro!" no es `aria-hidden`: el lector de pantalla lo diría dos veces (el toast ya lo anuncia).');
    if (!t.pasa) fallos.push('la tarjeta "¡Nuevo logro!" se come los clics (`pointer-events` no es none): mientras está, el curso no responde.');
    /* El clic pasa a lo de abajo y la tarjeta se va. */
    const recibio = await page.evaluate(() => {
      window.__fxClic = 0;
      const blanco = document.querySelector('.d-nav-btn--prev, [data-nav="prev"]') || document.body;
      blanco.addEventListener('pointerdown', () => { window.__fxClic++; }, { once: true });
      const r = blanco.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await page.mouse.click(recibio.x, recibio.y);
    await page.waitForTimeout(400);
    const despues = await page.evaluate(() => ({ clic: window.__fxClic, sigue: !!document.querySelector('.fx-logro') }));
    if (!despues.clic) fallos.push('con la tarjeta "¡Nuevo logro!" abierta, un toque NO llegó al botón de abajo.');
    if (despues.sigue) fallos.push('la tarjeta "¡Nuevo logro!" no se cerró con un toque.');
  }

  /* 1b · Nunca encima de un pop-up (v1.9.127): al llegar a la mini
     práctica, "Unidad 2 completa" salía encima del aviso previo. Con un
     pop-up abierto la tarjeta espera; al cerrarlo, sale. Y si un pop-up
     se abre con la tarjeta a la vista, la tarjeta se guarda y vuelve. */
  const pop = await page.evaluate(() => {
    const id = Array.from(document.querySelectorAll('[data-popup]')).map((x) => x.getAttribute('data-popup')).find((x) => x === 'recursos' || x === 'sidenav' || x === 'logros');
    if (!id) return null;
    const m = window.motor;
    m.showPopup(id);
    document.dispatchEvent(new CustomEvent('logroganado', { detail: { id: 'p1', nombre: 'Prueba uno', pts: 20 } }));
    const conPopup = !!document.querySelector('.fx-logro');
    return { id, conPopup };
  });
  if (pop) {
    if (pop.conPopup) fallos.push(`la tarjeta "¡Nuevo logro!" salió ENCIMA del pop-up "${pop.id}": tiene que esperar a que se cierre.`);
    await page.evaluate(() => window.motor.closePopup());
    await page.waitForTimeout(500);
    const alCerrar = await page.evaluate(() => !!document.querySelector('.fx-logro'));
    if (!alCerrar) fallos.push('al cerrar el pop-up, la tarjeta del logro que esperaba no salió.');
    const guardada = await page.evaluate((id) => { window.motor.showPopup(id); return !document.querySelector('.fx-logro'); }, pop.id);
    if (!guardada) fallos.push('se abrió un pop-up con la tarjeta del logro a la vista y la tarjeta quedó encima.');
    await page.evaluate(() => window.motor.closePopup());
    await page.waitForTimeout(500);
    const volvio = await page.evaluate(() => { const t = document.querySelector('.fx-logro'); const ok = !!(t && /Prueba uno/.test(t.textContent)); if (t) t.querySelector('.fx-logro-seguir').click(); return ok; });
    if (!volvio) fallos.push('la tarjeta del logro que se guardó al abrirse un pop-up no volvió al cerrarlo.');
    await page.waitForTimeout(400);
  }

  /* 2 · "+N" que sube. */
  const mas = await page.evaluate(() => { window.__fxCoin(10); const t = document.querySelectorAll('.fx-mas'); return t.length ? t[t.length - 1].textContent : null; });
  if (mas !== '+10') fallos.push(`\`__fxCoin(10)\` no mostró la pastilla "+10" (salió: ${JSON.stringify(mas)}).`);

  /* 3a · `medallasube` sale de coto-logros.js al CRUZAR un umbral en vivo
     (`award`), y no al restaurar. Instancia aparte con umbrales chicos:
     el curso real no se toca (su `Logros` es privado de curso.js). */
  const sube = await page.evaluate(() => {
    if (typeof window.initLogros !== 'function') return null;
    const vistos = [];
    const oir = (e) => vistos.push(e.detail && e.detail.a);
    document.addEventListener('medallasube', oir);
    const L = window.initLogros({ badges: [], medallas: [{ id: 'bronce', nombre: 'bronce', desde: 0 }, { id: 'plata', nombre: 'plata', desde: 30 }, { id: 'oro', nombre: 'oro', desde: 60 }] });
    L.award(10); const a = vistos.slice();
    L.award(30); const b = vistos.slice();
    L.award(30); const c = vistos.slice();
    const L2 = window.initLogros({ badges: [], medallas: [{ id: 'bronce', desde: 0 }, { id: 'oro', desde: 60 }] });
    L2.restore({ p: 100, b: [] }); const d = vistos.slice();
    document.removeEventListener('medallasube', oir);
    document.querySelectorAll('.fx-subio, .fx-lluvia').forEach((x) => x.remove());
    return { a, b, c, d };
  });
  if (sube) {
    if (sube.a.length) fallos.push(`\`medallasube\` salió sin cruzar ningún umbral (${sube.a.join(', ')}).`);
    if (sube.b.join() !== 'plata') fallos.push(`cruzar el umbral de plata con \`award\` no emitió \`medallasube\` a plata (salió: [${sube.b.join(', ')}]).`);
    if (sube.c.join() !== 'plata,oro') fallos.push(`cruzar el umbral de oro no emitió \`medallasube\` a oro (salió: [${sube.c.join(', ')}]).`);
    if (sube.d.length !== sube.c.length) fallos.push('restaurar un puntaje alto emitió `medallasube`: festejaría la recarga.');
  }

  /* 3 · Subir al oro. */
  const oro = await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('medallasube', { detail: { de: 'plata', a: 'oro', nombre: 'oro' } }));
    const el = document.querySelector('.fx-subio');
    return { aviso: el ? el.textContent : '', gira: !!(el && el.querySelector('.fx-med-giro')), fuegos: document.querySelectorAll('.fx-chispa').length };
  });
  if (!/Subiste a Oro/.test(oro.aviso)) fallos.push(`\`medallasube\` al oro no mostró "¡Subiste a Oro!" (salió: ${JSON.stringify(oro.aviso)}).`);
  if (!oro.gira) fallos.push('el aviso de medalla no trae la medalla que gira.');
  if (oro.fuegos < 10) fallos.push(`llegar al oro no tiró fuegos artificiales (${oro.fuegos} chispas).`);

  /* 4 · Terminar el curso navegando. */
  const fin = await page.evaluate(() => {
    const m = window.motor, ult = m.slides.length - 1;
    const esFin = m.slides[ult].hasAttribute('data-slide-end');
    m.go(ult, true);
    const track = document.querySelector('[data-progress-track]');
    return { esFin, lluvia: document.querySelectorAll('.fx-confeti').length, barra: !!(track && track.classList.contains('fx-barra-llena')) };
  });
  if (!fin.esFin) console.log('  · la última diapositiva no tiene `data-slide-end`: el final no se festeja (no hay `courseend`).');
  else {
    if (fin.lluvia < 20) fallos.push(`llegar al final no tiró la lluvia de papelitos (${fin.lluvia}).`);
    if (!fin.barra) fallos.push('llegar al final no hizo el destello en la barra (`.fx-barra-llena`).');
  }
  console.log(`  · tarjeta de logro · +10 · oro (${oro.fuegos} chispas) · final (${fin.lluvia} papelitos)`);

  /* 4b · Retomar EN la última no festeja. */
  if (fin.esFin) {
    const r = await abrir();
    await r.page.evaluate(() => { const m = window.motor; m.go(m.slides.length - 1, true); });
    await r.page.reload();
    await r.page.waitForTimeout(900);
    const vuelve = await r.page.evaluate(() => ({
      enFin: window.motor.current && window.motor.current().hasAttribute('data-slide-end'),
      lluvia: document.querySelectorAll('.fx-confeti').length
    }));
    if (vuelve.enFin && vuelve.lluvia) fallos.push('al RETOMAR el curso en la última diapositiva cayó la lluvia de papelitos: festeja la recarga, no el final.');
    await r.ctx.close();
  }

  /* 5 · Reducir movimiento. */
  const q = await abrir({ reducedMotion: 'reduce' });
  const quieto = await q.page.evaluate(() => {
    document.dispatchEvent(new CustomEvent('logroganado', { detail: { id: 'x', nombre: 'Prueba', pts: 20 } }));
    document.dispatchEvent(new CustomEvent('medallasube', { detail: { de: 'plata', a: 'oro', nombre: 'oro' } }));
    window.__fxCoin(10);
    return { tarjeta: !!document.querySelector('.fx-logro'), chispas: document.querySelectorAll('.fx-chispa, .fx-confeti').length, mas: !!document.querySelector('.fx-mas') };
  });
  if (!quieto.tarjeta) fallos.push('con "reducir movimiento" no salió la tarjeta del logro: se apaga el movimiento, no la información.');
  if (quieto.chispas || quieto.mas) fallos.push('con "reducir movimiento" igual se crearon partículas o el "+N" (decisión del cliente: todos los efectos se apagan).');
  errores.push(...q.errores);
  await q.ctx.close();
}

if (errores.length) fallos.push(...errores.map((e) => 'error de consola: ' + e));
report('efectos', fallos);
await ctx.close();
await browser.close();
