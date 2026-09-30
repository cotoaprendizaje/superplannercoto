#!/usr/bin/env node
/* kit-intacto.mjs — los archivos del kit, dentro del curso, son los del kit
   kit-base v1.9.102
   ------------------------------------------------------------
   POR QUÉ EXISTE. Un arreglo hecho adentro de un curso, sobre un archivo
   del kit, queda atrapado en ese zip: el kit no se entera, el próximo
   curso arranca con el mismo bug, y la próxima vez que alguien actualice
   ese curso lo pisa sin saberlo (§0.1). Pasó más de una vez, y el caso
   más caro fue el del curso modelo: 38 archivos del kit distintos de los
   del kit, sin forma de saber cuáles estaban atrasados y cuáles traían
   un arreglo propio (§7.48).

   `new-course.mjs` anota en `kit-version.json` la versión del kit y una
   huella de cada archivo del kit que copió; `actualizar-kit.mjs` la
   reescribe al actualizar. Este test pide cada uno de esos archivos AL
   CURSO SERVIDO (lo mismo que ve el alumno) y compara la huella.

   Si falla, la salida NO es "volver a copiar el archivo del kit": es
   mirar qué se cambió. Si es un arreglo, sube al kit (§0.1) y el curso
   se actualiza; si fue un error, `actualizar-kit.mjs --aplicar --forzar`
   lo repone, respaldando el cambio. */
import crypto from 'node:crypto';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const base = new URL('.', url);

let reg = null;
try {
  const r = await fetch(new URL('kit-version.json', base));
  if (r.ok) reg = await r.json();
} catch (e) {}

if (!reg || !reg.archivos) {
  fallos.push('el curso no tiene `kit-version.json`: no se puede saber de qué versión del kit son sus archivos. ' +
    'Es un curso anterior a v1.9.102 — correr `node <kit>/tools/actualizar-kit.mjs <curso>` para ver el plan ' +
    'y registrarlo.');
} else {
  const editados = [], faltan = [];
  for (const [f, h] of Object.entries(reg.archivos)) {
    let r;
    try { r = await fetch(new URL(f, base)); } catch (e) { r = null; }
    if (!r || !r.ok) { faltan.push(f); continue; }
    const buf = Buffer.from(await r.arrayBuffer());
    const hh = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
    if (hh !== h) editados.push(f);
  }
  if (editados.length) {
    fallos.push(`${editados.length} archivo(s) del kit v${reg.version} se editaron dentro del curso: ` + editados.join(', ') +
      '. Si es un arreglo, tiene que subir al kit (CLAUDE.md §0.1); si no, `actualizar-kit.mjs --aplicar --forzar` ' +
      'los repone (respaldando el cambio).');
  }
  if (faltan.length) {
    fallos.push(`${faltan.length} archivo(s) del kit que registra \`kit-version.json\` no están en el curso servido: ` +
      faltan.join(', '));
  }
  if (!editados.length && !faltan.length) {
    console.log(`  · ${Object.keys(reg.archivos).length} archivos del kit v${reg.version}, todos intactos.`);
  }
}

report('kit-intacto', fallos);
