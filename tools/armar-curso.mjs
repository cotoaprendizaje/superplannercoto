#!/usr/bin/env node
/* armar-curso.mjs — arma el index.html de un curso desde sus datos
   (kit-base v1.9.111, Fase 1).

   Uso:
     node tools/armar-curso.mjs <carpeta-del-curso> [--salida <archivo>]
   Lee `<carpeta>/curso.json` y `<carpeta>/marco.html` y escribe
   `<carpeta>/index.html` (o el archivo de `--salida`).

   El index que sale es un archivo GENERADO: los cambios de contenido se
   hacen en `curso.json`, no en el index, o se pierden la próxima vez que
   se arme. Qué es cada campo: `tools/curso-datos.mjs`. */

import fs from 'node:fs';
import path from 'node:path';
import { armarIndex } from './curso-datos.mjs';

const args = process.argv.slice(2);
const carpeta = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--salida');
const iSal = args.indexOf('--salida');
if (!carpeta) {
  console.error('Uso: node tools/armar-curso.mjs <carpeta-del-curso> [--salida <archivo>]');
  process.exit(2);
}
const salida = iSal >= 0 ? args[iSal + 1] : path.join(carpeta, 'index.html');
for (const f of ['curso.json', 'marco.html']) {
  if (!fs.existsSync(path.join(carpeta, f))) {
    console.error(`Falta ${path.join(carpeta, f)}. Si el curso todavía es un index.html hecho a mano, primero: node tools/extraer-curso.mjs ${carpeta}`);
    process.exit(2);
  }
}
const curso = JSON.parse(fs.readFileSync(path.join(carpeta, 'curso.json'), 'utf8'));
const marco = fs.readFileSync(path.join(carpeta, 'marco.html'), 'utf8');
if (curso.formato !== 1) {
  console.error(`curso.json tiene formato ${curso.formato}; este kit arma el formato 1.`);
  process.exit(2);
}
let html;
try {
  html = armarIndex(curso, marco);
} catch (e) {
  console.error('✗ ' + e.message);
  process.exit(1);
}
fs.writeFileSync(salida, html);
console.log(`✓ ${salida} armado: ${curso.diapositivas.length} diapositivas.`);
