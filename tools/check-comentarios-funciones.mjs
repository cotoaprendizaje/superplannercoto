#!/usr/bin/env node
/* check-comentarios-funciones — kit-base v1.9.121 (§7.70)
   ============================================================
   POR QUÉ EXISTE. El relevo de "Prevención cardiovascular" (A12) encontró
   en su `css/diapositivas.css` comentarios que remitían a funciones "en
   curso.js" que se fueron con la migración a datos: `initSlideGates()`,
   `renderQ`, `celebrate()`, `mostrarResumenCierre()`, `initResume`. Hoy
   viven en el kit con otro nombre o no existen. Un comentario que manda a
   buscar algo que no está es peor que ninguno: el próximo que lo lea
   pierde un rato buscando, o cree que la regla depende de un código que
   ya no corre. `check-comentarios-css` mira que los comentarios estén
   bien cerrados, no lo que dicen.

   Qué mide: en los comentarios del CSS PROPIO del curso y de `js/curso.js`,
   cada `nombre()` —o `nombre` entre comillas invertidas seguido de "en
   curso.js"— tiene que existir como función: en `js/curso.js` o publicada
   por algún módulo del kit (`js/*.js`). Mira solo lo del curso: lo que
   lista `kit-version.json` no se toca desde el curso.

   Uso: node tools/check-comentarios-funciones.mjs <carpeta-del-curso>
   Es un AVISO, no un test (sale con 0): distinguir "nombra algo que ya no
   está" de "cuenta que algo se fue" es lectura, y eso lo hace una persona.
   Por eso no cuenta: los `//` de `curso.js` (en la plantilla son código
   comentado, no texto), los comodines (`init*Videos()`), y las notas
   HISTÓRICAS —"acá había…", "se fue con…", "nunca publicó…"—, que nombran
   a propósito lo que ya no existe (alimentaria y cardio tienen las dos).
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';

const curso = process.argv[2];
if (!curso) { console.error('Uso: node tools/check-comentarios-funciones.mjs <carpeta-del-curso>'); process.exit(2); }

const leer = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
let delKit = new Set();
try { delKit = new Set(Object.keys(JSON.parse(leer(path.join(curso, 'kit-version.json'))).archivos || {})); } catch (e) {}

/* Lo que existe: funciones de curso.js y de todos los .js del curso
   (los del kit incluidos, que son los que publican lo compartido). */
const existen = new Set();
const dirJs = path.join(curso, 'js');
for (const f of fs.existsSync(dirJs) ? fs.readdirSync(dirJs).filter((x) => x.endsWith('.js')) : []) {
  const src = leer(path.join(dirJs, f));
  for (const m of src.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)) existen.add(m[1]);
  for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\s*[:=]\s*function\b/g)) existen.add(m[1]);
  for (const m of src.matchAll(/prototype\.([A-Za-z_$][\w$]*)\s*=/g)) existen.add(m[1]);
}
/* Nombres de la plataforma que un comentario puede citar sin que sean del curso. */
const AJENOS = new Set(['clamp', 'min', 'max', 'calc', 'var', 'url', 'rgba', 'rgb', 'hsl', 'translate', 'translateY',
  'translateX', 'scale', 'rotate', 'color-mix', 'attr', 'env', 'minmax', 'repeat', 'fit-content', 'linear-gradient',
  'radial-gradient', 'getComputedStyle', 'getBoundingClientRect', 'querySelector', 'querySelectorAll', 'setTimeout',
  'requestAnimationFrame', 'addEventListener', 'textOf', 'speak', 'focus', 'click', 'cubic-bezier', 'steps', 'has', 'not', 'is',
  'where', 'nth-child', 'matchMedia', 'require', 'import', 'cancel', 'scrollIntoView', 'contains', 'closest', 'play', 'pause',
  'print', 'function', 'return', 'if', 'for', 'while', 'switch', 'catch', 'alert', 'fetch', 'then']);
const HISTORIA = /hab[íi]a un|se fue|se fueron|viv[íi]a|nunca (public|existi|corri|se llam)|ya no (existe|est)|antes (era|estaba|llamaba)|se sac[óo]|se borr[óo]|qued[óo] fuera/i;

const comentarios = (src, esJs) => {
  const out = [];
  for (const m of src.matchAll(/\/\*[\s\S]*?\*\//g)) out.push({ txt: m[0], i: m.index });
  return out;
};
const linea = (src, i) => src.slice(0, i).split('\n').length;

const hallazgos = [];
const revisar = (rel, esJs) => {
  const src = leer(path.join(curso, rel));
  for (const c of comentarios(src, esJs)) {
    const nombres = new Set();
    for (const m of c.txt.matchAll(/`?([A-Za-z_$][\w$]{2,})\s*\(\)`?/g)) {
      if (c.txt[m.index - 1] === '*') continue;                 // comodín: init*Videos()
      const cerca = c.txt.slice(Math.max(0, m.index - 90), m.index + 90);
      if (HISTORIA.test(cerca)) continue;                       // nota histórica, a propósito
      nombres.add(m[1]);
    }
    for (const m of c.txt.matchAll(/`([A-Za-z_$][\w$]{2,})`\s+(?:\(|de |en )?\s*curso\.js/g)) nombres.add(m[1]);
    for (const n of nombres) {
      if (existen.has(n) || AJENOS.has(n)) continue;
      const off = c.txt.indexOf(n);
      hallazgos.push(`${rel}:${linea(src, c.i + Math.max(off, 0))} — nombra \`${n}()\` y no existe en el curso ni en el kit.`);
    }
  }
};

const dirCss = path.join(curso, 'css');
for (const f of fs.existsSync(dirCss) ? fs.readdirSync(dirCss).filter((x) => x.endsWith('.css')).sort() : []) {
  if (!delKit.has('css/' + f)) revisar('css/' + f, false);
}
if (fs.existsSync(path.join(dirJs, 'curso.js'))) revisar('js/curso.js', true);

if (!hallazgos.length) {
  console.log('✓ check-comentarios-funciones — ningún comentario del curso nombra una función que no existe.');
} else {
  console.log(`⚠ check-comentarios-funciones — ${hallazgos.length} comentario(s) mandan a buscar algo que ya no está:`);
  hallazgos.forEach((h) => console.log('  - ' + h));
  console.log('  Corregir el comentario (la función que hace eso hoy, o sacarlo): mandan a buscar código que no corre.' +
    '\n  Es un aviso: si el comentario cuenta a propósito que algo se fue, está bien así.');
}
