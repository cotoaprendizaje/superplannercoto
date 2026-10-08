#!/usr/bin/env node
/* vista-editor.mjs — arma la VISTA de un curso para publicarla como
   artefacto de claude.ai y revisarla comentando en vivo (kit-base v1.9.126)
   ------------------------------------------------------------
   Uso:  node tools/vista-editor.mjs <carpeta-del-curso> <carpeta-de-salida>

   POR QUÉ EXISTE. El "simulador del editor": el curso publicado como
   artefacto, con una capa (`tools/editor-vivo/`) para comentar una
   diapositiva o señalar un elemento. Los comentarios le llegan al chat del
   curso, que cambia la FUENTE y vuelve a publicar en el mismo link.

   LA FUENTE NO SE TOCA. Esto escribe solo en la carpeta de salida, que es
   descartable: se rearma cada vez. En un curso armado desde datos el index
   se arma en memoria desde curso.json + marco.html.

   QUÉ ARMA en la salida:
     · `pagina.html` — el index del curso con la forma que pide el
       artefacto: sin <!doctype>/<html>/<head>/<body> (los pone la
       publicación); el <title> y los <link> arriba, y un script al
       principio que devuelve a <html> y <body> sus atributos (el kit lee
       `body[data-cat]`, `data-puntaje-max`…).
     · css/, js/, img/, fonts/, video/ tal cual (sin archivos vacíos: los
       videos placeholder de 0 bytes no se publican) y editor-vivo/.
     · `archivos.json` — el mapa { ruta publicada: archivo } para pasarle
       a la publicación (`files`).
   La capa del editor NUNCA entra en el zip del curso: vive solo acá. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [origen, salida] = process.argv.slice(2).map((p) => p && path.resolve(p));
if (!origen || !salida) { console.error('Uso: node tools/vista-editor.mjs <carpeta-del-curso> <carpeta-de-salida>'); process.exit(2); }
if (salida === origen || origen.startsWith(salida + path.sep)) { console.error('✗ La salida no puede ser el curso ni contenerlo.'); process.exit(2); }

let index;
if (fs.existsSync(path.join(origen, 'curso.json')) && fs.existsSync(path.join(origen, 'marco.html'))) {
  const { armarIndex } = await import('./curso-datos.mjs');
  index = armarIndex(JSON.parse(fs.readFileSync(path.join(origen, 'curso.json'), 'utf8')), fs.readFileSync(path.join(origen, 'marco.html'), 'utf8'));
} else if (fs.existsSync(path.join(origen, 'index.html'))) {
  index = fs.readFileSync(path.join(origen, 'index.html'), 'utf8');
} else { console.error(`✗ ${origen} no parece un curso (ni index.html ni curso.json + marco.html).`); process.exit(2); }

fs.rmSync(salida, { recursive: true, force: true });
fs.mkdirSync(salida, { recursive: true });
const archivos = {};
const copiar = (desdeAbs, rel) => {
  const d = path.join(salida, rel);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(desdeAbs, d);
  archivos[rel] = rel;
};
const recorrer = (base, rel) => {
  const abs = path.join(base, rel);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const r = rel + '/' + e.name;
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) recorrer(base, r);
    else if (fs.statSync(path.join(base, r)).size > 0) copiar(path.join(base, r), r);
  }
};
for (const d of ['css', 'js', 'img', 'fonts', 'video', 'audio', 'doc']) recorrer(origen, d);
if (!fs.existsSync(path.join(salida, 'fonts'))) recorrer(KIT, 'fonts');   // las fuentes las piden los CSS del kit con url()
for (const f of ['editor-vivo.css', 'editor-vivo.js']) copiar(path.join(KIT, 'tools/editor-vivo', f), 'editor-vivo/' + f);

/* ---- el index, con la forma de una página de artefacto ---- */
const atributos = (tag) => {
  const m = index.match(new RegExp('<' + tag + '\\b([^>]*)>', 'i'));
  const out = {};
  if (m) for (const a of m[1].matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g)) out[a[1]] = a[2] == null ? '' : a[2];
  return out;
};
const head = (index.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1]
  .replace(/<meta\s+charset[^>]*>\s*/i, '')
  .replace(/<meta\s+name="viewport"[^>]*>\s*/i, '');
const cuerpo = (index.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [, ''])[1];
const titulo = ((head.match(/<title>([\s\S]*?)<\/title>/i) || [, 'Curso'])[1]).split('·')[0].trim();
const sinTitulo = head.replace(/<title>[\s\S]*?<\/title>\s*/i, '');
const pagina =
  `<title>${titulo}</title>\n` +
  sinTitulo.trim() + '\n' +
  '<link rel="stylesheet" href="editor-vivo/editor-vivo.css">\n' +
  `<script>(function(){var h=${JSON.stringify(atributos('html'))},b=${JSON.stringify(atributos('body'))},k;` +
  'for(k in h)document.documentElement.setAttribute(k,h[k]);for(k in b)document.body.setAttribute(k,b[k]);})();</script>\n' +
  cuerpo.trim() + '\n' +
  '<script src="editor-vivo/editor-vivo.js"></script>\n';
fs.writeFileSync(path.join(salida, 'pagina.html'), pagina);
/* Lo que la página pide y el curso no trae (el curso de prueba del kit
   guarda solo sus archivos propios): de la capa del kit. */
const faltan = [];
for (const m of pagina.matchAll(/(?:href|src)="([^"#:?]+)"/g)) {
  const rel = m[1];
  if (archivos[rel] || rel.startsWith('/')) continue;
  if (fs.existsSync(path.join(KIT, rel)) && fs.statSync(path.join(KIT, rel)).isFile()) copiar(path.join(KIT, rel), rel);
  else faltan.push(rel);
}
if (faltan.length) console.log(`⚠️ La página pide ${faltan.length} archivo(s) que no están ni en el curso ni en el kit: ${faltan.slice(0, 6).join(', ')}${faltan.length > 6 ? '…' : ''}`);
fs.writeFileSync(path.join(salida, 'archivos.json'), JSON.stringify(archivos, null, 1) + '\n');
const peso = Object.keys(archivos).reduce((t, f) => t + fs.statSync(path.join(salida, f)).size, fs.statSync(path.join(salida, 'pagina.html')).size);
console.log(`✓ Vista de "${titulo}" en ${salida}: pagina.html + ${Object.keys(archivos).length} archivo(s), ${(peso / 1048576).toFixed(1)} MB.`);
console.log('  Publicar pagina.html con `files` = archivos.json (raíz: la carpeta de salida) y la capacidad comments {composer_only:true}.');
