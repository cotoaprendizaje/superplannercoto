#!/usr/bin/env node
/* check-pdf-laminas.mjs — del PDF al recorrido de la receta
   (kit-base v1.9.134, §7.83)
   ------------------------------------------------------------
   POR QUÉ EXISTE. `pdf-a-laminas.mjs` es el primer paso de todo curso
   nuevo; si se rompe, el curso arranca mal sin que nada lo diga. Y guarda
   una regla que el kit ya pagó (§6.32): cada página a su proporción REAL,
   nunca estirada a 2:1.

   QUÉ HACE, sin navegador: arma un PDF de 8 páginas (7 a 2:1 y una ficha
   a 1,8:1), crea un curso con `new-course`, corre la herramienta con
   `--armar` y exige:
     · 8 webp de 2520px de ancho, la ficha a 2520×1400 (sin estirar), y
       `paginas.json` con la ficha marcada como no-lámina;
     · el recorrido de la receta: portada, objetivos, índice (que abre el
       instructivo), los temas, la práctica sembrada, consejos y un cierre
       `"tipo": "cierre"` con su imagen y sus 4 números;
     · el índice con los 3 grupos de cardio, un `i-tema-N` por tema
       definido en el sprite y ningún ícono de tipo sin usar;
     · las preguntas de ejemplo apuntando a temas que existen.
   Sin python3 + PyMuPDF en la máquina, avisa y no falla. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fallos = [];
const exige = (cond, msg) => { if (!cond) fallos.push(msg); };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-pdf-'));
try {
  const pdf = path.join(tmp, 'curso.pdf');
  const mk = spawnSync('python3', ['-c', String.raw`
import sys
try:
    import pymupdf as fitz
except ImportError:
    import fitz
d = fitz.open()
titulos = ['Portada del curso', 'Introducción', 'Índice', 'Tema uno', 'Tema dos', 'Ficha suelta', 'Consejos', 'Felicitaciones']
for i, t in enumerate(titulos):
    w, h = (900, 500) if t == 'Ficha suelta' else (1440, 720)
    p = d.new_page(width=w, height=h)
    p.draw_rect(fitz.Rect(0, 0, w, h), color=(0.2, 0.5, 0.6), fill=(0.85, 0.93, 0.95))
    p.insert_text((40, 60), t + '\nTexto de la página ' + str(i + 1) + '.', fontsize=24)
d.save(sys.argv[1])
`, pdf], { encoding: 'utf8' });
  if (mk.status !== 0) {
    console.log('· check-pdf-laminas — sin python3 + PyMuPDF en esta máquina: no se puede probar (no es un fallo del kit).');
    process.exit(0);
  }
  const curso = path.join(tmp, 'curso');
  const nc = spawnSync(process.execPath, [path.join(KIT, 'tools', 'new-course.mjs'), curso, '--titulo', 'Prueba PDF', '--cat', 'seguridad-higiene'], { encoding: 'utf8' });
  if (nc.status !== 0 || !fs.existsSync(path.join(curso, 'curso.json'))) {
    console.log('· check-pdf-laminas — new-course no pudo armar el curso como datos en esta máquina (hace falta Chromium): no se puede probar.');
    process.exit(0);
  }
  const r = spawnSync(process.execPath, [path.join(KIT, 'tools', 'pdf-a-laminas.mjs'), curso, pdf, '--armar'], { encoding: 'utf8' });
  exige(r.status === 0, 'pdf-a-laminas --armar terminó con error: ' + ((r.stderr || '') + (r.stdout || '')).trim().split('\n').slice(-2).join(' / '));
  if (r.status === 0) {
    const dir = path.join(curso, 'img', 'pdf');
    const webps = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
    exige(webps.length === 8, `pdf-a-laminas dejó ${webps.length} webp en img/pdf/ (eran 8 páginas).`);
    const pags = JSON.parse(fs.readFileSync(path.join(dir, 'paginas.json'), 'utf8'));
    const ficha = pags.find((p) => p.pagina === 6);
    exige(pags.every((p) => p.ancho === 2520), 'alguna página no salió a 2520px de ancho.');
    exige(ficha && ficha.alto === 1400 && ficha.lamina === false,
      'la página 1,8:1 se estiró o se tomó como lámina: cada página va a su proporción real (§6.32) y las que no son 2:1 son fichas.');
    exige(pags.filter((p) => p.lamina).length === 7, 'paginas.json no marca como lámina las 7 páginas 2:1.');
    exige(pags[3].titulo === 'Tema uno' && /Texto de la página 4/.test(pags[3].texto), 'paginas.json no trae el título y el texto de cada página.');

    const c = JSON.parse(fs.readFileSync(path.join(curso, 'curso.json'), 'utf8'));
    const ds = c.diapositivas;
    const tipos = ds.map((d) => d.tipo).join(',');
    exige(tipos === 'lamina,lamina,lamina,lamina,lamina,practica,lamina,cierre',
      `el recorrido no sigue la receta (portada, introducción, índice, temas, práctica, consejos, cierre): ${tipos}`);
    exige(ds[0].id === 'portada' && ds[1].id === 'objetivos' && ds[2].id === 'indice', 'las tres primeras no son portada, objetivos e índice.');
    exige(ds[2].requisitos && ds[2].requisitos.popupAntes === 'instrucciones', 'el índice no abre el instructivo (`requisitos.popupAntes`).');
    const cierre = ds[ds.length - 1];
    exige(cierre.imagen === 'img/pdf/pagina-08.webp' && (cierre.numeros || []).length === 4 && cierre.bloqueo && cierre.nota,
      'el cierre no lleva la última página como imagen, sus 4 números, el aviso del candado y la nota.');
    exige(ds.every((d) => d.tipo !== 'lamina' || /^img\/pdf\/pagina-\d\d\.webp$/.test(d.imagen)), 'alguna lámina no apunta a su página.');
    exige(!ds.some((d) => d.imagen === 'img/pdf/pagina-06.webp'), 'la ficha (página 6) quedó como diapositiva.');

    const grupos = c.indice.grupos;
    exige(grupos.map((g) => g.titulo).join('|') === 'Inicio|Contenido|Práctica y cierre', 'el índice no tiene los 3 grupos de cardio.');
    const marco = fs.readFileSync(path.join(curso, 'marco.html'), 'utf8');
    const iconos = grupos.flatMap((g) => g.items.map((i) => i.icono));
    exige(iconos.every((ic) => marco.includes(`<symbol id="${ic}"`)), 'el índice usa íconos que el sprite no define.');
    exige(!marco.includes('<symbol id="i-layers"'), 'quedó en el sprite un ícono de tipo que nadie usa (`i-layers`): `iconos-indice` lo marca.');
    const temas = ds.filter((d, k) => k > 2 && d.tipo === 'lamina' && d.id !== 'consejos').map((d) => d.id);
    exige(c.practica.banco.every((q) => temas.includes(q.related)), 'las preguntas de ejemplo apuntan a diapositivas que no existen.');
  }
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

if (fallos.length) {
  console.error(`✗ check-pdf-laminas — ${fallos.length} fallo(s):\n  - ` + fallos.join('\n  - '));
  process.exit(1);
}
console.log('✓ check-pdf-laminas — el PDF sale a láminas a su proporción real, la ficha aparte y el recorrido de la receta armado.');
