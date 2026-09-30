#!/usr/bin/env node
/* check-conteos — los números que el kit dice de SÍ MISMO tienen que ser
   ciertos (kit-base v1.9.98)
   ============================================================
   POR QUÉ EXISTE. Un relevamiento de un curso juntó una familia entera de
   afirmaciones desactualizadas, y ninguna rompe nada: todas hacen dudar.

     · `PROMPT-CURSO-NUEVO.md` anunciaba una versión del kit vieja — y ese
       prompt se copia TAL CUAL a cada chat nuevo, así que el número viaja
       mal a todos lados. El curso que lo relevó arrancó con una copia que
       decía "9/9 en verde" cuando el kit corría 17;
     · `CLAUDE.md` §7 paso 1 decía "los 16 tests" cuando eran 17 — y lo
       llamativo es que la vuelta que fue a corregir ese número lo dejó
       errado por uno;
     · la plantilla `js/curso.js` y el `README.md` pedían correr "los 7";
     · el `README.md` describía la suite como "7 tests" y listaba 12
       módulos JS cuando había 15.

   O sea: cuatro documentos con cuatro cifras distintas del mismo zip.

   > REGLA (§6.60): un número que describe el contenido del propio kit no
   > se escribe a mano. Se mide.

   Qué mide: cada afirmación VIVA —las que instruyen a quien arranca un
   curso— contra lo que hay en el disco. Las referencias HISTÓRICAS de las
   §7 de CLAUDE.md no se tocan: dicen qué era cierto en su momento y
   reescribirlas sería falsear la bitácora (ya pasó una vez, con un `sed`
   global de versiones).

   Barato y determinístico, así que va en `test:kit`.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.join(AQUI, '..');
const leer = (f) => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const contar = (dir, ext, sinGuion) => fs.readdirSync(path.join(RAIZ, dir))
  .filter((f) => f.endsWith(ext) && (!sinGuion || !f.startsWith('_'))).length;

const real = {
  version: JSON.parse(leer('package.json')).version,
  tests: contar('tools/tests', '.mjs', true),
  js: contar('js', '.js'),
  css: contar('css', '.css')
};

/* Cada fila: dónde, qué patrón busca el número, y contra qué se compara.
   El patrón tiene que capturar el número en $1. */
const AFIRMACIONES = [
  ['PROMPT-CURSO-NUEVO.md', /kit adjunto \(`kit-base\/`, v([\d.]+)\)/, 'version'],
  ['PROMPT-CURSO-NUEVO.md', /tiene que dar \*\*(\d+)\/\d+ en verde\*\*/, 'tests'],
  ['PROMPT-CURSO-NUEVO.md', /tiene que dar \*\*\d+\/(\d+) en verde\*\*/, 'tests'],
  ['README.md', /suite pass\/fail genérica, (\d+) tests/, 'tests'],
  ['README.md', /correr `tools\/tests\/\*\.mjs` \(los (\d+)/, 'tests'],
  ['js/curso.js', /correr tools\/tests\/\*\.mjs \(los (\d+)/, 'tests'],
  ['tools/tests/README.md', /\*\*Hoy son (\d+) tests\*\*/, 'tests'],
  /* v1.9.104: el paso 4 del prompt decía "los 17" con 53 tests, y ningún
     patrón lo miraba. Y el manual declara para qué versión vale. */
  ['PROMPT-CURSO-NUEVO.md', /npm test\s+# los (\d+)/, 'tests'],
  ['MANUAL-DEL-MOLDE.md', /Vigente para \*\*kit-base v([\d.]+)\*\*/, 'version']
];

const fallos = [];
for (const [archivo, patron, clave] of AFIRMACIONES) {
  let texto;
  try { texto = leer(archivo); } catch (e) { fallos.push(`${archivo}: no existe`); continue; }
  const m = texto.match(patron);
  if (!m) {
    fallos.push(`${archivo}: no se encontró la afirmación sobre "${clave}" (patrón ${patron}). ` +
      'Si el texto cambió a propósito, hay que actualizar el patrón acá — no borrarlo, o el ' +
      'número vuelve a envejecer sin que nadie lo note.');
    continue;
  }
  if (String(m[1]) !== String(real[clave])) {
    fallos.push(`${archivo}: dice ${clave} = ${m[1]} y el kit tiene ${real[clave]}. ` +
      `Frase: "${m[0]}"`);
  }
}

if (fallos.length) {
  console.error(`\n✗ check-conteos — ${fallos.length} número(s) que el kit dice de sí mismo y no son:\n`);
  fallos.forEach((f) => console.error('  · ' + f));
  console.error('');
  process.exit(1);
}
console.log(`✓ check-conteos — ${AFIRMACIONES.length} afirmación(es) del kit sobre sí mismo, ` +
  `todas ciertas (v${real.version}, ${real.tests} tests, ${real.js} módulos JS, ${real.css} hojas CSS).`);
