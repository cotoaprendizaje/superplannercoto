#!/usr/bin/env node
/* pdf-a-laminas.mjs — del PDF del diseñador a las láminas del curso
   (kit-base v1.9.134, §7.83)
   ------------------------------------------------------------
   Uso:  node tools/pdf-a-laminas.mjs <carpeta-del-curso> <archivo.pdf> [--armar]

   POR QUÉ EXISTE. El primer paso de todo curso (CLAUDE.md §7, pasos 1-2)
   era a mano: pasar cada página del PDF a imagen, a webp y con el peso
   justo, y copiar el texto de cada página para la locución. Y tiene una
   trampa que el kit ya pagó (§6.32): un PDF puede MEZCLAR tamaños de
   página —las láminas a 2:1 y las fichas en su propia proporción— y
   forzar todo a 2520×1260 las estira sin avisar.

   QUÉ HACE:
     · renderiza cada página a su proporción REAL, 2520px de ancho, en
       `img/pdf/pagina-NN.webp` (calidad 82, el peso de las de cardio);
     · extrae el texto de cada página (título = primer renglón) y escribe
       `img/pdf/paginas.json`: página, imagen, medida, proporción, título y
       texto. Es el insumo para elegir el tipo de cada diapositiva con la
       receta (MANUAL-DEL-MOLDE.md, sección 3);
     · avisa las páginas que NO son 2:1: casi siempre son fichas o pop-ups
       (van en `fichas`, no como diapositiva).
   Con `--armar` además escribe el recorrido en `curso.json`, en el orden
   de la receta: cada página 2:1 es una lámina con su imagen y su texto
   como borrador de la narración; la primera es la portada, la segunda
   introducción y objetivos, la tercera el índice (abre el instructivo),
   la anteúltima los últimos consejos y la última el cierre (`"tipo":
   "cierre"`, con los datos de la línea). La mini práctica que siembra
   `new-course` va antes de los consejos. El índice se rehace con los
   tres grupos de cardio y un ícono numerado por tema (para reemplazar por
   el de cada tema). Lo que queda para el curso: video de fondo en la
   portada y en las unidades, zonas, fichas y la narración final.
   Después de `--armar`, `armar-curso` vuelve a armar el index. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ICONOS_TIPO } from './iconos-tipo.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const ARMAR = args.includes('--armar');
const [curso, pdf] = args.filter((a) => !a.startsWith('--')).map((p) => p && path.resolve(p));
if (!curso || !pdf) {
  console.error('Uso: node tools/pdf-a-laminas.mjs <carpeta-del-curso> <archivo.pdf> [--armar]');
  process.exit(2);
}
if (!fs.existsSync(pdf)) { console.error(`✗ No existe el PDF: ${pdf}`); process.exit(2); }
const fCurso = path.join(curso, 'curso.json');
if (ARMAR && !fs.existsSync(fCurso)) { console.error('✗ --armar necesita un curso armado desde datos (curso.json + marco.html).'); process.exit(2); }

/* ---- 1 · render y texto, con PyMuPDF (o pdftoppm + pdftotext) ---- */
const salida = path.join(curso, 'img', 'pdf');
fs.mkdirSync(salida, { recursive: true });
const PY = String.raw`
import sys, json, io
pdf, salida = sys.argv[1], sys.argv[2]
from PIL import Image
try:
    import pymupdf as fitz
except ImportError:
    import fitz
doc = fitz.open(pdf)
out = []
for i, p in enumerate(doc):
    w, h = p.rect.width, p.rect.height
    zoom = 2520.0 / w
    pix = p.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGB')
    nombre = 'pagina-%02d.webp' % (i + 1)
    im.save(salida + '/' + nombre, 'WEBP', quality=82, method=6)
    out.append({'pagina': i + 1, 'archivo': nombre, 'ancho': im.width, 'alto': im.height, 'texto': p.get_text()})
print(json.dumps(out))
`;
const r = spawnSync('python3', ['-c', PY, pdf, salida], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
if (r.status !== 0) {
  console.error('✗ No se pudo renderizar el PDF. Hace falta python3 con PyMuPDF (`pip install pymupdf`) y Pillow.\n  ' +
    (r.stderr || '').trim().split('\n').slice(-2).join('\n  '));
  process.exit(1);
}
const rel = (p) => { const r = path.relative(process.cwd(), p); return r.startsWith('..' + path.sep + '..') ? p : (r || '.'); };
const limpiar = (t) => t.replace(/\s+/g, ' ').trim();
const paginas = JSON.parse(r.stdout).map((p) => {
  const renglones = p.texto.split('\n').map(limpiar).filter(Boolean);
  const proporcion = Math.round((p.ancho / p.alto) * 100) / 100;
  return {
    pagina: p.pagina,
    imagen: 'img/pdf/' + p.archivo,
    ancho: p.ancho, alto: p.alto, proporcion,
    lamina: Math.abs(proporcion - 2) <= 0.06,
    titulo: (renglones[0] || `Página ${p.pagina}`).slice(0, 80),
    texto: renglones.join(' ')
  };
});
fs.writeFileSync(path.join(salida, 'paginas.json'), JSON.stringify(paginas, null, 2) + '\n');

const laminas = paginas.filter((p) => p.lamina);
const otras = paginas.filter((p) => !p.lamina);
console.log(`✓ ${paginas.length} página(s) en ${rel(salida)}/ (webp, 2520px de ancho, a su proporción real).`);
console.log(`  ${laminas.length} lámina(s) 2:1` + (otras.length ? ` · ${otras.length} página(s) en otra proporción:` : '.'));
otras.forEach((p) => console.log(`    · página ${p.pagina} (${p.proporcion}:1, "${p.titulo}"): casi seguro una ficha o un pop-up → va en "fichas", no como diapositiva.`));
console.log('  El texto de cada página está en img/pdf/paginas.json (título y borrador de la narración).');

if (!ARMAR) {
  console.log('  Siguiente: elegir el tipo de cada página con la receta (manual §3), o correr de nuevo con --armar para el recorrido de cardio.');
  process.exit(0);
}

/* ---- 2 · --armar: el recorrido de la receta en curso.json ---- */
if (laminas.length < 5) {
  console.error(`✗ --armar necesita al menos 5 láminas 2:1 (portada, introducción, índice, contenido y cierre); hay ${laminas.length}.`);
  process.exit(1);
}
const datos = JSON.parse(fs.readFileSync(fCurso, 'utf8'));
const practica = (datos.diapositivas || []).find((d) => d.tipo === 'practica');
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'diapositiva';
const usados = new Set(practica ? [practica.id] : []);
const idPara = (base) => { let id = base, n = 2; while (usados.has(id)) id = `${base}-${n++}`; usados.add(id); return id; };
const nota = 'Borrador desde el PDF (pdf-a-laminas): revisar el tipo con la receta y la narración.';
const lamina = (p, id, extra) => Object.assign({
  id, tipo: 'lamina', titulo: p.titulo, imagen: p.imagen,
  narracion: [{ texto: p.texto || p.titulo }],
  notas: [' ' + nota + ` Página ${p.pagina} del PDF. `]
}, extra || {});

const n = laminas.length;
const portada = lamina(laminas[0], idPara('portada'));
const objetivos = lamina(laminas[1], idPara('objetivos'), { atributos: { 'data-entrada': '' } });
const indice = lamina(laminas[2], idPara('indice'), { requisitos: { popupAntes: 'instrucciones' } });
const temas = laminas.slice(3, n - 2).map((p) => lamina(p, idPara(slug(p.titulo))));
const consejos = lamina(laminas[n - 2], idPara('consejos'));
const pc = laminas[n - 1];
const cierre = {
  id: idPara('cierre'), tipo: 'cierre', titulo: 'Cierre del curso', imagen: pc.imagen,
  bloqueo: '🔒 Hacé la mini práctica para desbloquear el cierre del curso.',
  narracion: [{ texto: pc.texto || pc.titulo }],
  saludo: true,
  numeros: [
    { id: 'd-cert-score', rotulo: 'Respuestas correctas' },
    { id: 'd-cert-points', rotulo: 'Puntos' },
    { id: 'd-cert-badges', rotulo: 'Logros' },
    { id: 'd-cert-tries', rotulo: 'Intentos de práctica' }
  ],
  nota: 'Recordá que la <b>evaluación final</b> es un <b>cuestionario aparte</b>, que vas a encontrar en la plataforma ahora que terminaste todo el contenido.',
  repaso: '<h3>Repaso rápido de todo el curso</h3>\n<p>(Las ideas clave del curso: completar.)</p>',
  fin: true,
  notas: [' ' + nota + ` Página ${pc.pagina} del PDF. Si el arte trae texto dibujado, pasarlo a "capas" (d-cierre-arte-txt). `]
};
datos.diapositivas = [portada, objetivos, indice, ...temas, ...(practica ? [practica] : []), consejos, cierre];

/* El índice, con los grupos de cardio. Un ícono NUMERADO por tema: la
   regla del kit es un ícono distinto por contenido (`iconos-indice`), y el
   de verdad lo elige el curso. */
const item = (d, icono, tipo, rotulo) => Object.assign({ diapo: d.id, icono, rotulo: rotulo || d.titulo }, tipo ? { tipo } : {});
datos.indice = Object.assign({}, datos.indice, {
  grupos: [
    { titulo: 'Inicio', items: [item(portada, 'i-flag', 'portada', 'Portada'), item(objetivos, 'i-target', 'objetivos', 'Introducción y objetivos'),
      item(indice, 'i-grid', 'indice', 'Índice de contenidos')] },
    { titulo: 'Contenido', items: temas.map((t, k) => item(t, `i-tema-${k + 1}`)) },
    { titulo: 'Práctica y cierre', items: [
      ...(practica ? [item(practica, 'i-examen', 'evaluacion')] : []),
      item(consejos, 'i-bulb', 'consejos', 'Últimos consejos'),
      { diapo: cierre.id, icono: 'i-medal', rotulo: 'Cierre', tipo: 'cierre' }
    ] }
  ]
});
/* La práctica sembrada apunta a `tema-1`/`tema-2`: a los temas reales. */
if (datos.practica && datos.practica.banco && temas.length) {
  datos.practica.banco.forEach((q, k) => {
    const t = temas[Math.min(k, temas.length - 1)];
    if (/^tema-\d+$/.test(q.related || '')) { q.related = t.id; q.relatedLabel = t.titulo; }
  });
}
fs.writeFileSync(fCurso, JSON.stringify(datos, null, 2) + '\n');

/* Los símbolos del sprite: los de tipo que se usan y un `i-tema-N` por
   tema; se sacan los `i-tema-N` que sobran (un símbolo sin uso también
   lo marca `iconos-indice`). */
const fMarco = path.join(curso, 'marco.html');
let marco = fs.readFileSync(fMarco, 'utf8');
const temaSym = (k) => `    <symbol id="i-tema-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
  `<rect x="3" y="3" width="18" height="18" rx="5"></rect><text x="12" y="16.5" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" stroke="none">${k}</text></symbol>`;
marco = marco.replace(/\n\s*<symbol id="i-tema-\d+"[\s\S]*?<\/symbol>/g, '');
const enUso = new Set(datos.indice.grupos.flatMap((g) => g.items.map((i) => i.icono)));
for (const ic of new Set(Object.values(ICONOS_TIPO).map((t) => t.icono))) {
  if (enUso.has(ic)) continue;
  marco = marco.replace(new RegExp('\\n\\s*<symbol id="' + ic + '"[\\s\\S]*?<\\/symbol>'), '');
}
const ancla = marco.match(/\n\s*<symbol id="i-medal"[\s\S]*?<\/symbol>/);
if (ancla) {
  const nuevos = temas.map((t, k) => temaSym(k + 1)).join('\n');
  marco = marco.replace(ancla[0], ancla[0] + (nuevos ? '\n' + nuevos : ''));
}
fs.writeFileSync(fMarco, marco);

const a = spawnSync(process.execPath, [path.join(AQUI, 'armar-curso.mjs'), curso], { encoding: 'utf8' });
if (a.status !== 0) { console.error('✗ armar-curso falló después de --armar:\n' + (a.stderr || a.stdout)); process.exit(1); }
console.log(`✓ curso.json con el recorrido de la receta: portada, introducción, índice, ${temas.length} tema(s), ` +
  `${practica ? 'mini práctica, ' : ''}últimos consejos y cierre; el índice con los 3 grupos de cardio.`);
console.log('  Falta, con la receta: video de fondo en la portada y las unidades, zonas (fichas, video, tira),' +
  ' las fichas de las páginas que no son 2:1, el ícono de cada tema, la narración final y las preguntas de la práctica.');
