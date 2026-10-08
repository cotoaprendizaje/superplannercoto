#!/usr/bin/env node
/* check-fichas.mjs — las piezas del pop-up de contenido del canvas
   (kit-base v1.9.127, §7.76)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El tablero "Avisos" del canvas del rediseño dibuja el
   pop-up de contenido con un círculo de ícono arriba del texto y un pie
   con "Escuchá o leé" y el botón "Entendido". En el kit son dos campos
   opcionales de la ficha (`icono`, `entendido`) que arma
   `tools/curso-datos.mjs` y lee de vuelta `tools/extraer-curso.mjs`. Si
   el extractor no los reconoce, la ficha no vuelve como datos sino como
   HTML suelto, y el siguiente que la edite en `curso.json` no la
   encuentra: no se nota hasta que alguien la busca.

   QUÉ HACE, sin navegador, sobre `curso-prueba` (cardio, que los usa en
   las 4 fichas de tipos de ENT):
     · arma el curso en una carpeta temporal y exige el círculo y el pie
       (con un botón que cierra) en esas fichas;
     · lo extrae de vuelta y exige el MISMO `curso.json`;
     · arma una ficha sin los campos y exige que salga sin las piezas. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { armarFicha } from './curso-datos.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURSO = path.join(KIT, 'curso-prueba');
const fallos = [];
const exige = (cond, msg) => { if (!cond) fallos.push(msg); };
const ordenado = (v) => Array.isArray(v) ? v.map(ordenado)
  : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, ordenado(v[k])])) : v;

const curso = JSON.parse(fs.readFileSync(path.join(CURSO, 'curso.json'), 'utf8'));
const conPiezas = curso.fichas.filter((f) => f.icono && f.entendido);
exige(conPiezas.length >= 1, 'ninguna ficha de cardio usa `icono` + `entendido`: el test no prueba nada.');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-fichas-'));
try {
  const a = path.join(tmp, 'a'), b = path.join(tmp, 'b');
  fs.mkdirSync(a); fs.mkdirSync(b);
  for (const f of ['curso.json', 'marco.html']) fs.copyFileSync(path.join(CURSO, f), path.join(a, f));
  execFileSync(process.execPath, [path.join(KIT, 'tools/armar-curso.mjs'), a], { stdio: 'pipe' });
  const html = fs.readFileSync(path.join(a, 'index.html'), 'utf8');
  for (const f of conPiezas) {
    const i = html.indexOf(`data-popup="${f.id}"`);
    const trozo = i < 0 ? '' : html.slice(i, html.indexOf('data-popup="', i + 12) >>> 0 || undefined);
    exige(trozo.includes(`<span class="modal-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#${f.icono}"/>`), `la ficha "${f.id}" salió sin el círculo del ícono.`);
    exige(/<div class="modal-pie"><span class="modal-pie-oir"[^>]*>Escuchá o leé<\/span><button[^>]*data-popup-close[^>]*>Entendido<\/button><\/div>/.test(trozo), `la ficha "${f.id}" salió sin el pie "Escuchá o leé" + "Entendido" que cierra.`);
  }
  fs.copyFileSync(path.join(a, 'index.html'), path.join(b, 'index.html'));
  execFileSync(process.execPath, [path.join(KIT, 'tools/extraer-curso.mjs'), b], { stdio: 'pipe' });
  const vuelta = JSON.parse(fs.readFileSync(path.join(b, 'curso.json'), 'utf8'));
  for (const f of conPiezas) {
    const v = (vuelta.fichas || []).find((x) => x.id === f.id);
    exige(v && v.icono === f.icono && v.entendido === f.entendido, `la ficha "${f.id}" no volvió con su \`icono\` y su \`entendido\` al extraer.`);
  }
  exige(JSON.stringify(ordenado(vuelta)) === JSON.stringify(ordenado(curso)), 'armar y extraer cardio no devuelve el mismo `curso.json`.');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

const sola = armarFicha({ id: 'x', etiqueta: 'X', titulo: 'X:', clase: '', cuerpo: '<p>Hola</p>' }, '');
exige(!/modal-ic|modal-pie/.test(sola), 'una ficha sin `icono` ni `entendido` salió con las piezas nuevas: tiene que quedar como siempre.');
const propio = armarFicha({ id: 'x', etiqueta: 'X', titulo: 'X:', clase: '', cuerpo: '<p>Hola</p>', entendido: 'Ya lo leí' }, '');
exige(propio.includes('data-popup-close>Ya lo leí</button>'), '`entendido` con texto propio no puso ese texto en el botón.');

if (fallos.length) {
  console.error(`✗ check-fichas — ${fallos.length} fallo(s):\n  - ` + fallos.join('\n  - '));
  process.exit(1);
}
console.log(`✓ check-fichas — ${conPiezas.length} fichas con círculo y "Entendido", ida y vuelta exacta.`);
