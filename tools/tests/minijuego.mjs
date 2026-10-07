#!/usr/bin/env node
/* minijuego.mjs — kit-base v1.9.87
   ------------------------------------------------------------
   POR QUÉ EXISTE. `initMinijuego()` subió al kit desde un solo curso
   (§7.34), y con un solo caso de referencia la única defensa contra
   haber roto algo al generalizar es un test que juegue una partida
   entera.

   ⚠️ SE ARMA SU PROPIO TABLERO, como `objetivos-progreso` y
   `recursos-panel`. El marcado del minijuego vive en
   `minijuego-boilerplate.html` —un archivo aparte que el curso copia
   si lo va a usar—, así que un curso recién generado no tiene ninguno.
   Un guard de "si no hay minijuego, salteo" se saltearía siempre.

   Lo que verifica, en una partida real:
     1. el grid se arma desde `opciones` (el HTML va vacío a propósito);
     2. acertar prende el hotspot del dibujo con el MISMO id;
     3. errar descuenta una vida;
     4. `onAcierto` recibe `primera=false` la segunda vez que se
        encuentra el mismo hallazgo — el bug del curso de origen: sin
        ese dato, reintentar pagaba los puntos de nuevo cada vuelta;
     5. completar dispara `onFin` con el marcador correcto;
     6. quedarse sin vidas también termina, y guarda en `memoria` lo
        que hay que reforzar en el reintento;
     7. (kit-base v1.9.99) el repaso NO se abre encima de la última
        devolución hablada — el bug que reportó el cliente en
        "Seguridad alimentaria", y que el minijuego del kit también tenía.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

/* El `<script>` de `coto-minijuego.js` es OPCIONAL en el marcado (solo
   lo pone el curso que tiene minijuego), pero `new-course.mjs` copia
   toda la carpeta `js/`, así que el archivo está siempre. El test lo
   carga él mismo: así corre en cualquier curso y de paso verifica que
   el módulo se pueda cargar suelto, que es como lo va a cargar quien
   lo agregue. */
if (!(await page.evaluate(() => typeof window.initMinijuego === 'function'))) {
  await page.addScriptTag({ url: 'js/coto-minijuego.js' }).catch(() => {});
  await page.waitForTimeout(150);
}

if (!(await page.evaluate(() => typeof window.initMinijuego === 'function'))) {
  fails.push('initMinijuego no está expuesta y js/coto-minijuego.js no se pudo cargar');
} else {
  const r = await page.evaluate(() => {
    /* Tablero mínimo: la diapositiva, las tres capas y el grid vacío.
       Es el esqueleto del boilerplate, sin el arte. */
    const sec = document.createElement('section');
    sec.setAttribute('data-slide', '__mj__');
    sec.innerHTML =
      '<div data-layers>' +
      '  <button type="button" data-target="mj-intro"></button>' +
      '  <button type="button" data-target="mj-jugar"></button>' +
      '  <button type="button" data-target="mj-fin"></button>' +
      '  <div data-panel="mj-intro"><button data-mj-start></button></div>' +
      '  <div data-panel="mj-jugar" hidden>' +
      '    <span class="d-mj-hotspot" data-mj-hotspot="a"></span>' +
      '    <span class="d-mj-hotspot" data-mj-hotspot="b"></span>' +
      '    <b data-mj-found></b><span data-mj-lives></span>' +
      '    <p data-mj-remedy hidden></p>' +
      '    <div class="d-mj-grid" data-mj-grid></div>' +
      '    <p data-mj-fb></p>' +
      '  </div>' +
      '  <div data-panel="mj-fin" hidden><b data-mj-fin-found></b></div>' +
      '</div>';
    document.body.appendChild(sec);

    const log = { aciertos: [], errores: [], fin: [] };
    const memoria = {};
    const api = window.initMinijuego({
      slide: '__mj__',
      opciones: [
        { id: 'a', txt: 'Correcta A', ok: true },
        { id: 'b', txt: 'Correcta B', ok: true },
        { id: 'x', txt: 'Distractor X', ok: false },
        { id: 'y', txt: 'Distractor Y', ok: false }
      ],
      fb: { a: 'Sí, A.', b: 'Sí, B.', x: 'No, X.', y: 'No, Y.' },
      vidas: 2,
      pistaMs: 0,                       // sin timers: el test no espera
      memoria,
      onAcierto: (o, primera) => log.aciertos.push(o.id + ':' + primera),
      onError: (o) => log.errores.push(o.id),
      onFin: (res) => log.fin.push(res)
    });

    /* Todo se busca DENTRO de la sección inyectada (kit-base v1.9.105):
       buscando en el documento, un curso que ya tiene su minijuego
       (MEDIDO en "Seguridad alimentaria") le suma sus botones al conteo
       —16 en vez de 4— y el test acusaba al kit por el marcado del curso. */
    const btn = (id) => sec.querySelector('[data-mj-opt="' + id + '"]');
    const out = { armo: sec.querySelectorAll('[data-mj-grid] .d-mj-opt').length };

    /* --- partida 1: se pierde por falta de vidas --- */
    api.empezar();
    btn('a').click();
    out.hotspotA = sec.querySelector('[data-mj-hotspot="a"]').classList.contains('is-on');
    out.hotspotB = sec.querySelector('[data-mj-hotspot="b"]').classList.contains('is-on');
    out.found1 = sec.querySelector('[data-mj-found]').textContent;
    btn('x').click();
    out.vidasTrasUnError = sec.querySelectorAll('[data-mj-lives] .d-mj-heart:not(.is-off)').length;
    btn('y').click();                   // segunda vida → termina
    out.finPerdida = log.fin.length ? { gano: log.fin[0].gano, hallados: log.fin[0].hallados, total: log.fin[0].total } : null;
    out.memoriaTrasPerder = Object.keys(memoria.errados || {}).sort();

    /* --- partida 2: se gana, y 'a' ya se había encontrado antes --- */
    api.empezar();
    out.remedyVisible = !sec.querySelector('[data-mj-remedy]').hidden;
    btn('a').click();
    btn('b').click();
    out.finGanada = log.fin.length > 1 ? { gano: log.fin[1].gano, hallados: log.fin[1].hallados } : null;
    out.memoriaTrasGanar = Object.keys(memoria.errados || {});

    /* --- 8 · ganado, volver NO lleva a la bienvenida (v1.9.123, §7.72) ---
       NOA: "terminé aprobado, pasé a consejos, apreté Anterior y me llevó
       a empezar a jugar". Se cuenta a qué capa manda el módulo al salir. */
    const pedidos = [];
    sec.querySelectorAll('[data-target]').forEach((b) => b.addEventListener('click', () => pedidos.push(b.getAttribute('data-target'))));
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { id: 'otra-diapo' } }));
    out.alSalirGanado = pedidos.slice();
    out.log = log;
    sec.remove();

    /* --- y retomando OTRO día: `yaGanado()` pinta el final al entrar --- */
    const sec2 = sec.cloneNode(true);
    sec2.setAttribute('data-slide', '__mj3__');
    sec2.querySelector('[data-mj-grid]').innerHTML = '';
    sec2.querySelector('[data-mj-fin-found]').textContent = '';
    document.body.appendChild(sec2);
    window.initMinijuego({
      slide: '__mj3__', opciones: [{ id: 'a', txt: 'A', ok: true }, { id: 'b', txt: 'B', ok: true }, { id: 'x', txt: 'X', ok: false }],
      fb: {}, vidas: 2, pistaMs: 0, yaGanado: () => ({ hallados: 2 })
    });
    const pedidos2 = [];
    sec2.querySelectorAll('[data-target]').forEach((b) => b.addEventListener('click', () => pedidos2.push(b.getAttribute('data-target'))));
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { id: '__mj3__' } }));
    out.retomando = { pedidos: pedidos2.slice(), marcador: (sec2.querySelector('[data-mj-fin-found]') || {}).textContent };
    sec2.remove();
    return out;
  });

  if (r.armo !== 4) fails.push(`el grid debería tener 4 botones armados desde \`opciones\`, tiene ${r.armo}`);
  if (!r.hotspotA) fails.push('acertar no prendió el hotspot del dibujo con el mismo id');
  if (r.hotspotB) fails.push('se prendió el hotspot de una opción que no se eligió');
  if (r.found1 !== '1/2') fails.push(`el marcador debería decir "1/2" tras un acierto, dice ${JSON.stringify(r.found1)}`);
  if (r.vidasTrasUnError !== 1) fails.push(`con 2 vidas y 1 error deberían quedar 1 corazón encendido, quedan ${r.vidasTrasUnError}`);
  if (!r.finPerdida || r.finPerdida.gano !== false || r.finPerdida.hallados !== 1) {
    fails.push('quedarse sin vidas no terminó la partida con {gano:false, hallados:1}: ' + JSON.stringify(r.finPerdida));
  }
  /* Al perder se guarda lo que hay que reforzar: las distracciones
     elegidas (x, y) MÁS el hallazgo que nunca apareció (b). */
  if (JSON.stringify(r.memoriaTrasPerder) !== JSON.stringify(['b', 'x', 'y'])) {
    fails.push('al perder, `memoria.errados` debería guardar las distracciones elegidas y el hallazgo no encontrado (b,x,y), guardó: ' + JSON.stringify(r.memoriaTrasPerder));
  }
  if (!r.remedyVisible) fails.push('con algo que reforzar, el aviso [data-mj-remedy] debería mostrarse al reintentar');
  if (!r.finGanada || r.finGanada.gano !== true || r.finGanada.hallados !== 2) {
    fails.push('completar los hallazgos no terminó con {gano:true, hallados:2}: ' + JSON.stringify(r.finGanada));
  }
  if (r.memoriaTrasGanar.length) {
    fails.push('al ganar no queda nada que reforzar: `memoria.errados` debería vaciarse, quedó ' + JSON.stringify(r.memoriaTrasGanar));
  }
  if (r.alSalirGanado && r.alSalirGanado.includes('mj-intro')) {
    fails.push('con el minijuego GANADO, salir de la diapositiva lo devolvió a la bienvenida: al volver con "Anterior" ' +
      'el alumno no ve su resultado sino "empezar a jugar" (reporte del cliente en NOA).');
  }
  if (r.retomando && (!r.retomando.pedidos.includes('mj-fin') || r.retomando.marcador !== '2/2')) {
    fails.push(`con \`yaGanado()\` (ganó en otra sesión), entrar a la diapositiva tiene que mostrar el panel final con el marcador ` +
      `(pidió ${JSON.stringify(r.retomando.pedidos)}, marcador ${JSON.stringify(r.retomando.marcador)}).`);
  }
  /* ⚠️ La aserción importante: 'a' se encontró en las DOS partidas, y
     la segunda vez `primera` tiene que ser false. Sin eso, un curso
     que deje reintentar sin límite paga los mismos puntos cada vuelta
     (bug real del curso de origen). */
  const esperado = ['a:true', 'a:false', 'b:true'];
  if (JSON.stringify(r.log.aciertos) !== JSON.stringify(esperado)) {
    fails.push('onAcierto debería avisar `primera=false` al reencontrar un hallazgo ya encontrado. Esperaba ' +
      JSON.stringify(esperado) + ', dio ' + JSON.stringify(r.log.aciertos));
  }
}

/* ---- 7 · la última devolución se escucha entera ----
   Motor de voz FALSO pero ASÍNCRONO, como el real: `speaking` pasa a
   true recién ~150ms después de `speak()` y cada frase dura 1.5s. Ese
   desfase es toda la trampa: quien pregunta "¿está hablando?" justo
   después de pedir la última devolución recibe false, y abría el
   repaso a los 700ms, cortando la devolución con su propia locución.
   Medido antes del arreglo: devolución en t=8120, repaso en t=8821,
   y la devolución nunca llegaba a su fin. */
{
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const p2 = await ctx.newPage();
  await p2.addInitScript(() => {
    const t0 = performance.now(); const T = () => Math.round(performance.now() - t0);
    const ev = []; window.__ev = ev;
    const motor = { _sp: false, _q: [],
      get speaking() { return this._sp; }, get pending() { return this._q.length > 0 && !this._sp; }, get paused() { return false; },
      getVoices() { return [{ name: 'X', lang: 'es-AR', localService: false, default: true }]; },
      speak(u) { this._q.push(u); if (this._q.length === 1) this._arranca(); },
      _arranca() { const u = this._q[0]; if (!u) return;
        setTimeout(() => { if (this._q[0] !== u) return; this._sp = true; if (u.onstart) u.onstart();
          setTimeout(() => { if (this._q[0] !== u) return; this._sp = false; this._q.shift();
            ev.push({ t: T(), fin: String(u.text) }); if (u.onend) u.onend({}); this._arranca(); }, 1500);
        }, 150); },
      cancel() { this._q = []; this._sp = false; }, pause() {}, resume() {}, addEventListener() {}, removeEventListener() {} };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, get() { return motor; } });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    window.__T = T;
  });
  await p2.goto(url);
  await p2.waitForTimeout(600);
  await p2.keyboard.press('Escape').catch(() => {});
  if (!(await p2.evaluate(() => typeof window.initMinijuego === 'function'))) {
    await p2.addScriptTag({ url: 'js/coto-minijuego.js' }).catch(() => {});
    await p2.waitForTimeout(150);
  }
  const v = await p2.evaluate(async () => {
    if (typeof window.initMinijuego !== 'function' || !window.Narrador) return null;
    window.Narrador.setNarrating(true);
    const sec = document.createElement('section');
    sec.setAttribute('data-slide', '__mj2__');
    sec.innerHTML = '<div data-layers><button type="button" data-target="mj-intro"></button>' +
      '<button type="button" data-target="mj-jugar"></button><button type="button" data-target="mj-fin"></button>' +
      '<div data-panel="mj-intro"><button data-mj-start></button></div>' +
      '<div data-panel="mj-jugar" hidden><b data-mj-found></b><span data-mj-lives></span>' +
      '<p data-mj-remedy hidden></p><div class="d-mj-grid" data-mj-grid></div><p data-mj-fb></p></div>' +
      '<div data-panel="mj-fin" hidden><b data-mj-fin-found></b></div></div>' +
      '<div><h3 data-mj-repaso-title></h3><p data-mj-repaso-sub></p><ul data-mj-repaso-list></ul></div>';
    document.body.appendChild(sec);
    let tPop = null;
    window.motor.showPopup = function () { tPop = window.__T(); return true; };
    const api = window.initMinijuego({ slide: '__mj2__', vidas: 3, pistaMs: 0,
      decir: (t) => window.Narrador.speak(t, 'other'),
      opciones: [{ id: 'a', txt: 'A', ok: true }, { id: 'x', txt: 'X', ok: false }],
      fb: { a: 'ULTIMA DEVOLUCION', x: 'no' } });
    api.empezar();
    await new Promise((r) => setTimeout(r, 2200));
    sec.querySelector('[data-mj-opt="a"]').click();
    await new Promise((r) => setTimeout(r, 4000));
    const fin = window.__ev.filter((e) => e.fin === 'ULTIMA DEVOLUCION')[0];
    return { tPop, tFinDevolucion: fin ? fin.t : null };
  });
  if (v) {
    if (v.tFinDevolucion === null) {
      fails.push('la última devolución del minijuego NUNCA terminó de decirse: el repaso se abrió encima y la cortó ' +
        `(repaso en t=${v.tPop}ms). Esperar con \`Narrador.alTerminar\`, no preguntando \`speaking\` en el instante.`);
    } else if (v.tPop !== null && v.tPop < v.tFinDevolucion) {
      fails.push(`el repaso se abrió en t=${v.tPop}ms, ANTES de que terminara la última devolución (t=${v.tFinDevolucion}ms).`);
    } else if (v.tPop === null) {
      fails.push('el repaso no se abrió nunca después de la última devolución.');
    }
  }
  await ctx.close();
}

report('minijuego', fails, errors);
await browser.close();
