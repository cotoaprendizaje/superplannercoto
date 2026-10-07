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

/* ---- Aviso: zonas en la franja que se recorta (kit-base v1.9.123, §7.72) ----
   Lo pidió "Seguridad de la información" (A20.3): al rediseñar sus repasos,
   `video-lienzo-tablet` y `scroll-audit` atraparon cajas fuera del margen
   seguro… recién al correr la suite, ~20 minutos después de armar. Acá se
   avisa al armar, con los mismos números que publica el kit
   (`--d-margen-seguro` 12,22% a los costados, `--d-margen-seguro-v` 4,55%
   arriba y abajo, este solo para lo tocable). Es un aviso: no frena el
   armado; el que decide es el test. */
{
  const H = 12.22, V = 4.55;
  const avisos = [];
  let diapo = '';
  for (const m of html.matchAll(/<[a-z][^>]*>/gi)) {
    const tag = m[0];
    const d = tag.match(/data-slide="([^"]+)"/);
    if (d && /<section\b/i.test(tag)) { diapo = d[1]; continue; }
    const hit = /\sdata-hit[\s=>]/.test(tag), place = /\sdata-place[\s=>]/.test(tag);
    if (!hit && !place) continue;
    const num = (a) => { const x = tag.match(new RegExp('\\s' + a + '="([\\d.]+)"')); return x ? parseFloat(x[1]) : NaN; };
    const l = num('data-l'), w = num('data-w'), t = num('data-t'), h = num('data-h');
    const nombre = (tag.match(/aria-label="([^"]{1,40})/) || tag.match(/class="([^"]{1,40})/) || [, tag.slice(0, 40)])[1];
    if (!isNaN(l) && (l < H || l + (isNaN(w) ? 0 : w) > 100 - H)) {
      avisos.push(`${diapo} · "${nombre}" ocupa ${l}–${+(l + (w || 0)).toFixed(2)}% de ancho (margen ±${H}%)`);
    }
    if (hit && !isNaN(t) && (t < V || t + (isNaN(h) ? 0 : h) > 100 - V)) {
      avisos.push(`${diapo} · "${nombre}" ocupa ${t}–${+(t + (h || 0)).toFixed(2)}% de alto (margen ±${V}%)`);
    }
  }
  if (avisos.length) {
    console.log(`⚠️ ${avisos.length} zona(s) en la franja que se recorta en tablet o en pantallas anchas ` +
      '(lo va a marcar `video-lienzo-tablet`):');
    avisos.slice(0, 20).forEach((a) => console.log('  - ' + a));
    if (avisos.length > 20) console.log(`  … y ${avisos.length - 20} más`);
  }
}
