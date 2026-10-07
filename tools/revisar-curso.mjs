#!/usr/bin/env node
/* revisar-curso.mjs — lo que un curso resolvió por su cuenta y puede ser
   del kit (kit-base v1.9.119).

   POR QUÉ EXISTE. El 2026-10-06 el chat de "Prevención cardiovascular"
   mandó un segundo relevo con doce cosas que había resuelto DENTRO del
   curso "porque creí que eran propias de él": entre ellas, el cierre
   bloqueado sin salida que el cliente había reportado con foto. No las
   ocultó: nadie le había pedido separar lo propio de lo general, así que
   decidió solo. La regla desde v1.9.119 es que decide el kit, y esta
   herramienta le da al chat del curso la lista de candidatos sin que
   dependa de acordarse.

   Uso:
     node tools/revisar-curso.mjs <carpeta-del-curso>
   Mira SOLO lo propio del curso (lo que no lista `kit-version.json`):
   `js/curso.js` y el CSS propio. No falla nunca (sale con 0): es una
   lista para el relevo, no un test. Cada punto que marca va al relevo,
   aunque parezca propio; el chat del kit decide. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(AQUI, '..');
const carpeta = process.argv[2];
if (!carpeta) { console.error('Uso: node tools/revisar-curso.mjs <carpeta-del-curso>'); process.exit(2); }

const delKit = new Set();
try {
  Object.keys(JSON.parse(fs.readFileSync(path.join(carpeta, 'kit-version.json'), 'utf8')).archivos || {}).forEach((f) => delKit.add(f));
} catch (e) { /* sin registro: se mira igual, con los nombres del kit */ }
/* ¿Corre desde el kit o desde la COPIA que `actualizar-kit` deja en el
   curso? (kit-base v1.9.123, §7.72). Desde la copia, `KIT` ES el curso, y
   "los CSS del kit" eran TODOS los de la carpeta —el propio del curso
   incluido—: el informe salía sin "!important sobre el kit" ni "Clases del
   kit que el curso reescribe", sin avisar. MEDIDO en "Seguridad de la
   información": 4 `!important` desde kit-base/, ninguno desde la copia. Y
   `build-zip.py` corre justamente la copia para el zip del relevo. Si hay
   `kit-version.json` en la carpeta del script, lo del kit sale de ahí. */
const regKit = (() => {
  try { return Object.keys(JSON.parse(fs.readFileSync(path.join(KIT, 'kit-version.json'), 'utf8')).archivos || {}); }
  catch (e) { return null; }
})();
const kitCss = regKit
  ? regKit.filter((f) => /^css\/[^/]+\.css$/.test(f)).map((f) => f.slice(4))
  : fs.readdirSync(path.join(KIT, 'css')).filter((f) => f.endsWith('.css'));
const esDelKit = (rel) => delKit.has(rel) || (rel.startsWith('css/') && kitCss.includes(path.basename(rel)));

const leer = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } };
const sinComentarios = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:])\/\/.*$/gm, (m, a) => a + ' '.repeat(m.length - a.length));
const linea = (texto, i) => texto.slice(0, i).split('\n').length;

/* ---- lo que publica el kit ---- */
const kitJs = (regKit
  ? regKit.filter((f) => /^js\/[^/]+\.js$/.test(f)).map((f) => f.slice(3))
  : fs.readdirSync(path.join(KIT, 'js')).filter((f) => f.endsWith('.js'))).filter((f) => f !== 'curso.js');
const globalesKit = new Set();
for (const f of kitJs) {
  for (const m of leer(path.join(KIT, 'js', f)).matchAll(/global\.([A-Za-z_$][\w$]*)\s*=/g)) globalesKit.add(m[1]);
}
const clasesKit = new Set();
for (const f of kitCss) {
  for (const m of sinComentarios(leer(path.join(KIT, 'css', f))).matchAll(/\.((?:d|modal|slide)-[\w-]+)/g)) clasesKit.add(m[1]);
}
/* números con decimales que solo aparecen en los tests del kit
   (márgenes medidos, umbrales): un curso que los copia queda desfasado
   el día que el kit los cambia. */
const numerosTests = new Map();
for (const f of fs.readdirSync(path.join(KIT, 'tools', 'tests')).filter((x) => x.endsWith('.mjs'))) {
  for (const m of leer(path.join(KIT, 'tools', 'tests', f)).matchAll(/(?<![\w.])(\d+\.\d{2,})(?![\w.])/g)) {
    if (!numerosTests.has(m[1])) numerosTests.set(m[1], f);
  }
}

/* …y los que el kit PUBLICA como variable CSS (`--d-margen-seguro:
   12.22%`): esos se leen con `getComputedStyle`, no se copian. */
const publicados = new Map();
for (const f of kitCss) {
  for (const m of leer(path.join(KIT, 'css', f)).matchAll(/(--d-[\w-]+)\s*:\s*(\d+\.\d{2,})%?/g)) {
    if (!publicados.has(m[2])) publicados.set(m[2], m[1]);
  }
}

/* Lo que el kit ofrece en lugar de cada API privada que un curso suele
   tocar. Si no está acá, el hallazgo igual sale, sin sugerencia. */
const EN_SU_LUGAR = {
  _syncNav: 'desde v1.9.119 está `motor.refrescarGate()`, o `document.dispatchEvent(new Event(\'gatechange\'))`'
};

const hallazgos = [];
const vistos = new Set();
const anotar = (tipo, donde, que) => {
  const clave = tipo + '|' + donde + '|' + que;
  if (vistos.has(clave)) return;          // la misma cosa dos veces en la misma línea
  vistos.add(clave);
  hallazgos.push({ tipo, donde, que });
};

/* ---- js/curso.js ---- */
const cursoJsPath = path.join(carpeta, 'js', 'curso.js');
const cursoJs = leer(cursoJsPath);
const codigo = sinComentarios(cursoJs);
for (const m of codigo.matchAll(/\bmotor\.(_[A-Za-z]\w*)/g)) {
  anotar('API privada del kit', `js/curso.js:${linea(codigo, m.index)}`,
    `usa \`motor.${m[1]}()\`, que es privado: ` +
    (EN_SU_LUGAR[m[1]] ? EN_SU_LUGAR[m[1]] + '.' : 'si el curso lo necesita, al kit le falta una forma pública de hacerlo.'));
}
for (const m of codigo.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)) {
  if (globalesKit.has(m[1])) {
    anotar('Función con el nombre de una del kit', `js/curso.js:${linea(codigo, m.index)}`,
      `define \`${m[1]}()\`, que el kit ya publica: o es una copia vieja, o el curso necesitó algo que la del kit no hace.`);
  }
}
for (const m of codigo.matchAll(/(?<![\w.])(\d+\.\d{2,})(?![\w.])/g)) {
  if (publicados.has(m[1])) {
    anotar('Número copiado del kit', `js/curso.js:${linea(codigo, m.index)}`,
      `usa ${m[1]}, que el kit publica como \`${publicados.get(m[1])}\`: leerlo con getComputedStyle en vez de copiarlo.`);
  } else if (numerosTests.has(m[1])) {
    anotar('Número copiado del kit', `js/curso.js:${linea(codigo, m.index)}`,
      `usa ${m[1]}, que aparece en tools/tests/${numerosTests.get(m[1])}: si el kit lo cambia, el curso queda desfasado sin aviso.`);
  }
}
/* Funciones propias de MECANISMO (no de contenido): las que escuchan
   eventos del motor o de la ventana, o tocan `data-*` del molde. Son las
   candidatas a servirle a otro curso. */
const funciones = [...codigo.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)];
for (let k = 0; k < funciones.length; k++) {
  const ini = funciones[k].index;
  const fin = k + 1 < funciones.length ? funciones[k + 1].index : codigo.length;
  const cuerpo = codigo.slice(ini, fin);
  const nombre = funciones[k][1];
  if (globalesKit.has(nombre) || nombre === 'boot') continue;   // boot() es de la plantilla: siempre engancha de todo
  const senales = [];
  if (/addEventListener\(\s*['"](slidechange|resize|popupopen|popupclose|advanceblocked|layerchange|orientationchange)['"]/.test(cuerpo)) senales.push('escucha eventos del motor o de la ventana');
  if (/getBoundingClientRect|scrollHeight|innerHeight|innerWidth/.test(cuerpo)) senales.push('mide la pantalla');
  if (/data-(place|l|t|w|h|repaso|quiz|gate|require)/.test(cuerpo)) senales.push('toca marcado del molde');
  if (senales.length >= 2) {
    anotar('Mecanismo propio', `js/curso.js:${linea(codigo, ini)}`,
      `\`${nombre}()\` ${senales.join(', ')}: si otro curso puede necesitarlo, es del kit.`);
  }
}

/* ---- CSS propio ---- */
const dirCss = path.join(carpeta, 'css');
const cssPropios = fs.existsSync(dirCss) ? fs.readdirSync(dirCss).filter((f) => f.endsWith('.css') && !esDelKit('css/' + f)) : [];
const pisadas = new Map();
for (const f of cssPropios) {
  const crudo = leer(path.join(dirCss, f));
  const css = sinComentarios(crudo);
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim();
    const decl = m[2];
    const clases = [...selector.matchAll(/\.((?:d|modal|slide)-[\w-]+)/g)].map((x) => x[1]).filter((c) => clasesKit.has(c));
    if (!clases.length) continue;
    if (/!important/.test(decl)) {
      anotar('!important sobre el kit', `css/${f}:${linea(css, m.index + m[1].length)}`,
        `\`${selector.replace(/\s+/g, ' ').slice(0, 90)}\` con !important: el curso está peleando con una regla del kit.`);
    }
    for (const c of clases) pisadas.set(c, (pisadas.get(c) || 0) + 1);
  }
}
const masPisadas = [...pisadas.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
if (masPisadas.length) {
  anotar('Clases del kit que el curso reescribe', 'css propio',
    masPisadas.map(([c, n]) => `.${c} (${n})`).join(', ') +
    ': mirar si alguna es un arreglo (va al kit) o solo estilo del curso.');
}

/* ---- informe ---- */
console.log(`revisar-curso — ${carpeta}`);
console.log('Lo que sigue va al relevo al kit, aunque parezca propio del curso: decide el kit.\n');
if (!hallazgos.length) {
  console.log('✓ Nada que marcar en js/curso.js ni en el CSS propio.');
  console.log('  En el relevo igual va la sección "Relevo al kit", diciendo que se corrió esto y no marcó nada.');
} else {
  const porTipo = {};
  for (const h of hallazgos) (porTipo[h.tipo] = porTipo[h.tipo] || []).push(h);
  for (const [tipo, lista] of Object.entries(porTipo)) {
    console.log(`· ${tipo} (${lista.length})`);
    for (const h of lista.slice(0, 15)) console.log(`    ${h.donde} — ${h.que}`);
    if (lista.length > 15) console.log(`    … y ${lista.length - 15} más`);
  }
}
