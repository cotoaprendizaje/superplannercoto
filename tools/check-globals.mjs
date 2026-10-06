#!/usr/bin/env node
/* ============================================================
   check-globals.mjs · kit-base v1.9.65 — Área Aprendizaje (COTO)
   ------------------------------------------------------------
   CONTRATO DE SÍMBOLOS GLOBALES ENTRE LOS MÓDULOS DEL KIT.

   POR QUÉ EXISTE (§7.10, y es un bug que se autoinfligió el kit):
   `coto-logros.js` sacaba sus avisos con `global.Player.toast(...)` —
   el "+N · motivo" de cada `award()` y el "🏆 Logro:" de cada
   `unlock()`. Pero `initPlayer()` solo DEVOLVÍA su API: nunca la
   publicaba en `window`, y todos los cursos la guardan en una variable
   local. `global.Player` era `undefined` y **todos esos avisos estaban
   muertos**, sin un solo error en consola.

   Lo que hace este chequeo es la pregunta de una línea que habría
   evitado eso: **de todo lo que un módulo CONSUME de `global`, ¿hay
   alguien que lo PUBLIQUE?** Los archivos del kit son autocontenidos a
   propósito (se copian de a uno a cada curso), así que el único
   contrato entre ellos es justamente `window` — y hasta ahora nadie lo
   verificaba.

   Es estático a propósito: no necesita navegador, curso ni servidor.
   Corre en milisegundos y entra en `npm run test:kit`, así que un
   símbolo que se rompe se ve en el commit que lo rompe y no tres
   versiones después, cuando un curso lo estrena.

     node tools/check-globals.mjs
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
/* ⚠️ Acepta la carpeta por argumento, y eso importa más de lo que
   parece (kit-base v1.9.103). Antes miraba SIEMPRE el `js/` del kit,
   sin forma de apuntarlo a otro lado — así que corrido desde la carpeta
   de un curso revisaba el kit y decía "✓" sin haber mirado una sola
   línea del curso. Y el archivo que un curso agrega es justamente el
   que más consume del contrato: su `curso.js`, que usa `Logros`,
   `Cierre`, `Narrador`, `motor`, `SCORM`, `XAPI`… Medido en
   "Prevención cardiovascular": 29 símbolos consumidos con el default y
   los mismos 29 apuntándolo al curso, pero eso es suerte del caso, no
   una garantía — el chequeo no lo estaba dando.
   Uso: `node tools/check-globals.mjs [carpeta-del-curso | carpeta-js]` */
/* Y acepta también la carpeta DEL CURSO (kit-base v1.9.119, §7.68):
   si adentro hay un `js/`, mira ese. Hasta v1.9.118, `check-globals .`
   desde un curso leía los `.js` sueltos de la raíz —ninguno— y daba 18
   falsos positivos ("`initMiniQuiz` aparece en README.md pero ningún
   módulo lo publica"), mirando la carpeta equivocada sin avisar. */
const ARG = process.argv[2] ? path.resolve(process.argv[2]) : null;
const JS_DIR = ARG
  ? (fs.existsSync(path.join(ARG, 'js')) && fs.statSync(path.join(ARG, 'js')).isDirectory() ? path.join(ARG, 'js') : ARG)
  : path.join(AQUI, '..', 'js');

/* Provistos por el navegador o por el propio curso — no los publica
   ningún módulo del kit y no tiene sentido exigirlo. */
const DEL_ENTORNO = new Set([
  'document', 'window', 'navigator', 'location', 'screen', 'history',
  'speechSynthesis', 'SpeechSynthesisUtterance', 'matchMedia', 'getComputedStyle',
  'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout',
  'setInterval', 'clearInterval', 'localStorage', 'sessionStorage', 'fetch',
  'Image', 'Audio', 'AudioContext', 'webkitAudioContext', 'CustomEvent', 'Event',
  'IntersectionObserver', 'ResizeObserver', 'MutationObserver', 'performance',
  'parent', 'top', 'self', 'frameElement', 'console', 'alert', 'print',
  'close', 'opener', 'addEventListener', 'removeEventListener', 'dispatchEvent',
  'innerWidth', 'innerHeight', 'scrollX', 'scrollY', 'devicePixelRatio',
  'API', 'API_1484_11',            // el LMS los inyecta en window (SCORM)
  'motor',                          // lo publica curso.js, no un módulo del kit
  'COURSE_SLUG', 'COURSE_NAME',
  'XAPI_CONFIG',                    // config opcional que define el curso, no el kit
  '__PUNTAJE_MAX__'                 // el máximo declarado del curso (kit v1.9.95,
                                    // misma fuente que lee tools/tests/puntaje-maximo.mjs)
]);

const archivos = fs.readdirSync(JS_DIR).filter(f => f.endsWith('.js'));

/* Lo que cada archivo PUBLICA: `global.X = ...` / `window.X = ...` */
const publica = new Map();
/* Lo que cada archivo CONSUME: `global.X` / `window.X` leído */
const consume = new Map();

for (const f of archivos) {
  const src = fs.readFileSync(path.join(JS_DIR, f), 'utf8')
    /* Los comentarios se sacan antes de buscar: este kit documenta
       muchísimo, y un `global.Player` mencionado en una explicación no
       es ni un consumo ni una publicación. Contarlos daría exactamente
       el falso negativo que este chequeo viene a evitar. */
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  for (const m of src.matchAll(/\b(?:global|window)\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) {
    if (!publica.has(m[1])) publica.set(m[1], []);
    publica.get(m[1]).push(f);
  }
  for (const m of src.matchAll(/\b(?:global|window)\.([A-Za-z_$][\w$]*)\b(?!\s*=(?!=))/g)) {
    if (!consume.has(m[1])) consume.set(m[1], new Set());
    consume.get(m[1]).add(f);
  }
}

const fallos = [];

for (const [sym, files] of consume) {
  if (DEL_ENTORNO.has(sym)) continue;
  if (publica.has(sym)) continue;
  const quienes = Array.from(files).join(', ');
  fallos.push(`"${sym}" lo consume ${quienes} pero NINGÚN módulo del kit lo publica ` +
    '(o falta el `global.X = X`, o el consumo tiene un typo)');
}

/* Publicado dos veces desde archivos distintos: el segundo pisa al
   primero según el orden de los <script>, que es justo el tipo de bug
   que no se ve hasta que alguien reordena. */
for (const [sym, files] of publica) {
  const unicos = Array.from(new Set(files));
  if (unicos.length > 1) {
    fallos.push(`"${sym}" lo publican DOS archivos (${unicos.join(', ')}) — ` +
      'el orden de los <script> decide cuál gana, en silencio');
  }
}

/* ---- TERCERA PASADA: lo que la DOCUMENTACIÓN le promete al curso ----
   kit-base v1.9.81. Un curso nuevo no lee el kit módulo por módulo: lee
   el snippet de `boot()` del README y la plantilla `js/curso.js`, y
   copia de ahí. Así que una línea de ejemplo que llama a algo que el
   kit ya no exporta no es un error de prosa — es un ReferenceError en
   el curso que la copie, y encima en el arranque.

   Pasó de verdad: `initCertificatePrint()` se sacó en v1.9.64 por
   decisión de producto y la línea siguió viva en el snippet del README
   hasta v1.9.81, donde la encontró un curso real tirando
   "initCertificatePrint is not defined" en consola. El `check-globals`
   de entonces no podía verla: solo miraba `js/`.

   Se revisan únicamente los BLOQUES DE CÓDIGO (```), no la prosa: en el
   texto se nombran a propósito funciones históricas ya retiradas, que
   es información útil y no una promesa. */
const DOCS = ['README.md', 'PROMPT-CURSO-NUEVO.md'];
const publicadasInit = new Set(
  Array.from(publica.keys()).filter((k) => /^init[A-Z]/.test(k))
);
for (const doc of DOCS) {
  const ruta = path.join(AQUI, '..', doc);
  if (!fs.existsSync(ruta)) continue;
  const texto = fs.readFileSync(ruta, 'utf8');
  const bloques = Array.from(texto.matchAll(/```[a-z]*\n([\s\S]*?)```/g))
    .map((m) => m[1]).join('\n');
  const nombrados = new Set(
    Array.from(bloques.matchAll(/\b(init[A-Z][\w$]*)\s*\(/g)).map((m) => m[1])
  );
  for (const n of nombrados) {
    if (publicadasInit.has(n)) continue;
    fallos.push(`"${n}" aparece en un bloque de código de ${doc} pero NINGÚN módulo ` +
      'del kit lo publica. El curso que copie ese snippet arranca con un ' +
      'ReferenceError. O se sacó del kit y quedó la línea, o hay un typo.');
  }
}

if (fallos.length) {
  console.log(`\n✗ check-globals — ${fallos.length} problema(s) en el contrato entre módulos:`);
  fallos.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
console.log(`✓ check-globals — ${consume.size} símbolos consumidos, todos publicados o del entorno ` +
  `(${publica.size} publicados por ${archivos.length} módulos).`);
