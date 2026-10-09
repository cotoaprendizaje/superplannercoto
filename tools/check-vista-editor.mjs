#!/usr/bin/env node
/* check-vista-editor.mjs — la vista del "simulador del editor"
   (kit-base v1.9.126, §7.75)
   ------------------------------------------------------------
   POR QUÉ EXISTE. `vista-editor.mjs` arma el curso para publicarlo como
   artefacto de claude.ai y que el equipo lo revise comentando. Si la vista
   sale mal, no se entera nadie hasta que alguien abre el link: una página
   con <!doctype> propio (el artefacto pone el suyo y queda anidado), un
   archivo que la página pide y no se publicó (la diapositiva sin su
   imagen), la capa del editor ausente (no hay cómo comentar), o la capa
   dibujándose también ADENTRO del marco de "Ver como" (dos pestañas
   "Editor", una dentro de la otra).

   QUÉ HACE, sin navegador, sobre `curso-prueba` (cardio):
     · arma la vista en una carpeta temporal y exige que la FUENTE no
       cambió;
     · `pagina.html` sin <!doctype>/<html>/<head>/<body>, con <title> sin
       el "· Área…" y la capa del editor enlazada una vez, al final;
     · todo archivo local que la página pide está en `archivos.json`, y
       todo lo de `archivos.json` existe y no está vacío;
     · la capa se corta sola adentro del marco (`ev-marco=1`) ANTES de
       dibujar nada, y "Ver como" trae las medidas que usan los tests;
     · la salida no puede ser el curso. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURSO = path.join(KIT, 'curso-prueba');
const fallos = [];
const exige = (cond, msg) => { if (!cond) fallos.push(msg); };

const foto = (dir) => {
  const out = [];
  const rec = (rel) => {
    for (const e of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const r = path.join(rel, e.name);
      if (e.isDirectory()) rec(r);
      else out.push(r + ':' + fs.statSync(path.join(dir, r)).size + ':' + fs.statSync(path.join(dir, r)).mtimeMs);
    }
  };
  rec('.');
  return out.sort().join('\n');
};

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vista-editor-'));
const salida = path.join(tmp, 'vista');
try {
  const antes = foto(CURSO);
  const salidaTxt = String(execFileSync(process.execPath, [path.join(KIT, 'tools/vista-editor.mjs'), CURSO, salida], { stdio: 'pipe' }));
  /* v1.9.135 (relevo SA K5): lo que está adentro de un comentario HTML no
     es un archivo que la página pida. */
  const faltanTxt = (salidaTxt.match(/no están ni en el curso ni en el kit: ([^\n]*)/) || [, ''])[1];
  const comentado = faltanTxt.split(/,\s*/).filter((r) => r && fs.existsSync(path.join(CURSO, 'index.html')) &&
    !fs.readFileSync(path.join(CURSO, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '').includes(r.replace(/…$/, '')));
  exige(!comentado.length, `vista-editor avisa como faltantes archivos que solo aparecen en un comentario: ${comentado.join(', ')}.`);
  exige(foto(CURSO) === antes, 'armar la vista CAMBIÓ la fuente del curso: tiene que escribir solo en la salida.');

  const pag = fs.readFileSync(path.join(salida, 'pagina.html'), 'utf8');
  exige(!/<!doctype|<html[\s>]|<head[\s>]|<\/?body[\s>]/i.test(pag), '`pagina.html` trae <!doctype>, <html>, <head> o <body>: los pone la publicación y quedarían anidados.');
  const t = (pag.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  exige(t && t.trim() && !t.includes('·'), `el <title> de la vista es "${t}": tiene que ser el nombre del curso, sin el "· Área…".`);
  const css = pag.match(/<link rel="stylesheet" href="editor-vivo\/editor-vivo\.css">/g) || [];
  const js = pag.match(/<script src="editor-vivo\/editor-vivo\.js"><\/script>/g) || [];
  exige(css.length === 1 && js.length === 1, `la capa del editor tiene que ir enlazada UNA vez (css ${css.length}, js ${js.length}).`);
  const scripts = [...pag.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  exige(scripts[scripts.length - 1] === 'editor-vivo/editor-vivo.js', 'editor-vivo.js no es el último script: tiene que correr con el curso ya armado (lee `window.motor`).');

  const archivos = JSON.parse(fs.readFileSync(path.join(salida, 'archivos.json'), 'utf8'));
  for (const rel of Object.keys(archivos)) {
    const f = path.join(salida, archivos[rel]);
    exige(fs.existsSync(f) && fs.statSync(f).size > 0, `\`archivos.json\` lista "${rel}" y en la salida no está o está vacío.`);
  }
  exige(archivos['editor-vivo/editor-vivo.js'] && archivos['editor-vivo/editor-vivo.css'], 'la capa del editor no está en `archivos.json`: no se publicaría.');
  const pedidos = new Set([...pag.matchAll(/\s(?:src|href)="([^"#:]+\.(?:css|js|webp|png|jpe?g|svg|woff2?))"/g)].map((m) => m[1]));
  const faltan = [...pedidos].filter((r) => !archivos[r]);
  exige(!faltan.length, `la página pide archivos que no se publicarían: ${faltan.slice(0, 5).join(', ')}${faltan.length > 5 ? '…' : ''}.`);

  const capa = fs.readFileSync(path.join(KIT, 'tools/editor-vivo/editor-vivo.js'), 'utf8');
  const corte = capa.search(/if \(\/\[\?&\]ev-marco=1/);
  const dibujo = capa.indexOf('document.body.appendChild(root)');
  exige(corte > 0 && dibujo > corte, 'la capa no se corta ANTES de dibujarse adentro del marco de "Ver como" (`?ev-marco=1`): saldrían dos pestañas "Editor".');
  const medidas = new Set([...capa.matchAll(/w: (\d+), h: (\d+)/g)].map((m) => m[1] + '×' + m[2]));
  for (const m of ['1366×768', '1920×1080', '1180×820', '820×1180', '844×390', '390×844']) {
    exige(medidas.has(m), `"Ver como" no trae ${m}, una de las medidas con que se mide el kit.`);
  }

  const mal = spawnSync(process.execPath, [path.join(KIT, 'tools/vista-editor.mjs'), CURSO, CURSO], { stdio: 'pipe' });
  exige(mal.status === 2, 'con la salida igual al curso, vista-editor no se negó: borraría el curso.');
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (fallos.length) {
  console.error(`✗ check-vista-editor — ${fallos.length} fallo(s):\n  - ` + fallos.join('\n  - '));
  process.exit(1);
}
console.log('✓ check-vista-editor — la vista sale lista para publicar, con su capa, sin tocar la fuente.');
