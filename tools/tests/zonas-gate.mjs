#!/usr/bin/env node
/* zonas-gate.mjs — kit-base v1.9.135
   ------------------------------------------------------------
   POR QUÉ EXISTE. `initZonasGate` subió de "Seguridad alimentaria"
   (relevo K14), donde el cliente reportó *"me deja avanzar sin tocar los
   3 botones que componen cada diapositiva"*. Las zonas de `initHotspots`
   no abren pop-up, así que `data-require-popups` no las ve: sin este
   gate, una diapositiva de zonas se saltea sin mirar nada y sin un solo
   error en consola.

   SE ARMA SU PROPIO TABLERO (como `minijuego`): una diapositiva con
   `data-require-hits="data-zz"` y tres zonas, dos con la misma clave
   (cuentan como una). Mide:
     1. sin tocar nada faltan las 2 claves, como selectores que
        `initGateHints` puede pulsar;
     2. tocar una zona la marca (vía el evento `cotozona` del kit, sin
        que el curso llame a nada) y falta 1;
     3. tocar la otra: no falta ninguna;
     4. una diapositiva sin `data-require-hits` no pide nada;
     5. la plantilla `js/curso.js` la cablea en los gates.
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page } = await openCourse(url);
const fails = [];

for (const [fn, f] of [['initHotspots', 'js/coto-hotspots.js'], ['initZonasGate', 'js/coto-ui.js']]) {
  if (!(await page.evaluate((n) => typeof window[n] === 'function', fn))) {
    await page.addScriptTag({ url: f }).catch(() => {});
    await page.waitForTimeout(150);
  }
}

const r = await page.evaluate(() => {
  if (typeof window.initZonasGate !== 'function' || typeof window.initHotspots !== 'function') return { sinApi: true };
  const sec = document.createElement('section');
  sec.setAttribute('data-slide', '__zz__');
  sec.setAttribute('data-require-hits', 'data-zz');
  sec.innerHTML = '<button type="button" class="zz" data-zz="a">A</button>' +
    '<button type="button" class="zz" data-zz="b">B</button>' +
    '<button type="button" class="zz" data-zz="b">B otra vez</button>' +
    '<div id="zz-cartel" hidden></div>';
  document.body.appendChild(sec);
  const otra = document.createElement('section');
  otra.setAttribute('data-slide', '__zz2__');
  document.body.appendChild(otra);
  const g = window.initZonasGate({});
  window.initHotspots({ zonas: '[data-slide="__zz__"] .zz', clave: 'data-zz', cartel: '#zz-cartel', soloClick: true });
  const out = { antes: g.faltan(sec) };
  sec.querySelector('[data-zz="a"]').click();
  out.unaTocada = g.faltan(sec);
  sec.querySelectorAll('[data-zz="b"]')[1].click();
  out.todas = g.faltan(sec);
  out.sinPedido = g.faltan(otra);
  sec.remove(); otra.remove();
  return out;
});

if (r.sinApi) fails.push('el kit no expone `initZonasGate` (coto-ui.js) o `initHotspots` (coto-hotspots.js).');
else {
  if (JSON.stringify(r.antes) !== JSON.stringify(['[data-zz="a"]', '[data-zz="b"]'])) {
    fails.push('sin tocar nada tienen que faltar las 2 claves, como selectores; dio ' + JSON.stringify(r.antes) + '.');
  }
  if (JSON.stringify(r.unaTocada) !== JSON.stringify(['[data-zz="b"]'])) {
    fails.push('tocar la zona "a" no la marcó por sí sola (evento `cotozona`): falta ' + JSON.stringify(r.unaTocada) + '.');
  }
  if (r.todas.length) fails.push('con las dos claves tocadas el gate sigue pidiendo ' + JSON.stringify(r.todas) + '.');
  if (r.sinPedido.length) fails.push('una diapositiva sin `data-require-hits` pide zonas: ' + JSON.stringify(r.sinPedido) + '.');
}

/* 5 · Solo en el KIT (relevo SA L2): adentro de un curso, `js/curso.js`
   es el del curso, no la plantilla, y cada curso cablea sus gates como
   quiere. Se reconoce el curso por su `kit-version.json`, que no lista
   `js/curso.js` como archivo del kit. */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
let esCurso = false;
try { esCurso = !JSON.parse(fs.readFileSync(path.join(RAIZ, 'kit-version.json'), 'utf8')).archivos['js/curso.js']; } catch (e) {}
if (!esCurso) {
  const plantilla = fs.readFileSync(path.join(RAIZ, 'js', 'curso.js'), 'utf8');
  if (!/initZonasGate\(/.test(plantilla) || !/gate:\s*zonasGate/.test(plantilla)) {
    fails.push('la plantilla js/curso.js del kit no cablea `initZonasGate` en sus gates: un curso nuevo con zonas obligatorias se saltearía.');
  }
}

await browser.close();
report('zonas-gate', fails);
