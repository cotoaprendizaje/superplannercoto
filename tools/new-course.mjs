#!/usr/bin/env node
/* new-course.mjs — kit-base v1.9.48
   Automatiza §7 pasos 1-2 del checklist de arranque (CLAUDE.md):
   copiar `kit-base/` completo a la carpeta del curso nuevo y generar
   un `imsmanifest.xml` propio. Nada de esto se editaba a mano por
   necesidad — es la misma lista de archivos de siempre, con el mismo
   riesgo de siempre de olvidarse uno (o de copiar una versión vieja
   de "el curso anterior" en vez de la del kit-base actual).

   SÍ GENERA EL `index.html` COMPLETO (desde v1.9.60, §7.08)
   ---------------------------------------------------------
   Chrome real incluido: barra superior, barra inferior con progreso,
   sidenav, glosario, logros y el fab-stack de ayuda/configuración,
   más el orden de scripts. Sale de `index-boilerplate.html`, con el
   header inyectado desde `header-boilerplate.html` para que haya UNA
   sola fuente de verdad.

   Este bloque decía exactamente lo contrario hasta v1.9.71 —"no
   genera index.html", y mandaba a adaptar a mano el de otro curso—
   mientras el propio archivo, más abajo, lo generaba y lo anunciaba
   por consola (§7.18 K7). Adaptar a mano es el método viejo y es
   donde el contrato se rompe EN SILENCIO: `initPlayer()` no tira
   ningún error si un id no calza, simplemente deja medio chrome
   muerto.

   Uso:
     node tools/new-course.mjs <carpeta_destino> --titulo "Nombre del curso" --cat <categoria> [--tipo simulador]
   Ejemplo:
     node tools/new-course.mjs ../mi-curso-nuevo --titulo "Higiene y seguridad" --cat seguridad-higiene

   `--cat` tiene que ser una categoría real de `coto-base.css`
   (`[data-cat="..."]`) — se valida contra el archivo real, no contra
   una lista copiada acá que podría quedar desactualizada. */

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
/* El catálogo canónico de íconos de TIPO vive en un archivo propio y es
   la ÚNICA fuente: lo leen este generador y `tools/tests/iconos-indice.mjs`.
   Antes la tabla estaba acá adentro, así que el test no tenía contra qué
   comparar y solo podía verificar que no hubiera choques (kit v1.9.87). */
import { ICONOS_TIPO, TRAZOS_TIPO, spriteTipos } from './iconos-tipo.mjs';
import { archivosDelKit, registroDeVersion } from './_kit-archivos.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.join(AQUI, '..');

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--sin-datos') out.sinDatos = true;
    else if (argv[i] === '--titulo') out.titulo = argv[++i];
    else if (argv[i] === '--cat') out.cat = argv[++i];
    else if (argv[i] === '--tipo') out.tipo = argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const destino = args._[0];

if (!destino || !args.titulo || !args.cat) {
  console.error('Uso: node new-course.mjs <carpeta_destino> --titulo "Nombre del curso" --cat <categoria> [--tipo simulador]');
  process.exit(1);
}

const categoriasReales = (() => {
  const css = fs.readFileSync(path.join(KIT_ROOT, 'css', 'coto-base.css'), 'utf8');
  const set = new Set();
  const re = /\[data-cat="([^"]+)"\]/g;
  let m;
  while ((m = re.exec(css))) set.add(m[1]);
  return set;
})();
if (!categoriasReales.has(args.cat)) {
  console.error(`✗ "--cat ${args.cat}" no es una categoría real de coto-base.css.`);
  console.error('  Categorías válidas: ' + Array.from(categoriasReales).sort().join(', '));
  process.exit(1);
}

const destinoAbs = path.resolve(destino);
if (fs.existsSync(destinoAbs) && fs.readdirSync(destinoAbs).length) {
  console.error(`✗ ${destinoAbs} ya existe y no está vacía — no se pisa nada.`);
  process.exit(1);
}
fs.mkdirSync(destinoAbs, { recursive: true });

function copiarDir(rel, filtro) {
  const src = path.join(KIT_ROOT, rel);
  const dst = path.join(destinoAbs, rel);
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (filtro && !filtro(entry)) continue;
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(srcPath, dstPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

// ---- 1. Archivos genéricos, tal cual (CLAUDE.md §7 paso 1) ----
copiarDir('css');
/* `curso.js` se genera aparte, con substitución. `escenario-boilerplate.js`
   es una PLANTILLA del kit, no un módulo: en un simulador se copia abajo
   como `js/escenario.js` y en cualquier otro curso no pinta nada — hasta
   v1.9.81 se colaba en el `js/` de TODOS los cursos y viajaba al zip del
   alumno, el mismo error que §7.18 K8 ya había pagado con
   `header-boilerplate.html`. */
copiarDir('js', entry => entry.name !== 'curso.js' && entry.name !== 'escenario-boilerplate.js');
copiarDir('fonts');
copiarDir('tools', entry => entry.name !== '__pycache__'); // lo deja build-zip.py al correr
fs.copyFileSync(path.join(KIT_ROOT, 'header-boilerplate.html'), path.join(destinoAbs, 'header-boilerplate.html'));
fs.copyFileSync(path.join(KIT_ROOT, 'spec-motor-slides.md'), path.join(destinoAbs, 'spec-motor-slides.md'));
/* El marcado del minijuego viaja SIEMPRE (kit-base v1.9.87), no detrás
   de un `--tipo`: a diferencia del simulador —que es la forma de TODO
   el curso y se decide al crearlo— el minijuego es UNA diapositiva
   adentro de un curso normal, y esa decisión suele aparecer más tarde,
   cuando ya se está armando el contenido. Si el boilerplate no está
   ahí, quien lo necesita tiene que volver al kit a buscarlo.
   `js/coto-minijuego.js` ya viajó con el resto de `js/`; lo único que
   el curso agrega es el `<script>` y la llamada. */
fs.copyFileSync(path.join(KIT_ROOT, 'minijuego-boilerplate.html'),
                path.join(destinoAbs, 'minijuego-boilerplate.html'));
/* El prompt de arranque viaja con el curso: si alguien retoma esta
   carpeta en un chat nuevo (o hay que rehacerla), el procedimiento está
   ahí adentro y no en la memoria de quien la armó. */
fs.copyFileSync(path.join(KIT_ROOT, 'PROMPT-CURSO-NUEVO.md'), path.join(destinoAbs, 'PROMPT-CURSO-NUEVO.md'));
/* Y las reglas vigentes (kit-base v1.9.104): el diario (`CLAUDE.md`) no
   viaja con el curso, así que sin esto el chat que retoma la carpeta no
   tiene las reglas a mano. */
fs.copyFileSync(path.join(KIT_ROOT, 'MANUAL-DEL-MOLDE.md'), path.join(destinoAbs, 'MANUAL-DEL-MOLDE.md'));
/* Y el de retomarlo (v1.9.109): cuando el curso vuelva por correcciones,
   el procedimiento ya está en su carpeta. */
fs.copyFileSync(path.join(KIT_ROOT, 'PROMPT-RETOMAR-CURSO.md'), path.join(destinoAbs, 'PROMPT-RETOMAR-CURSO.md'));
fs.copyFileSync(path.join(KIT_ROOT, 'package.json'), path.join(destinoAbs, 'package.json'));
if (fs.existsSync(path.join(KIT_ROOT, 'package-lock.json'))) {
  fs.copyFileSync(path.join(KIT_ROOT, 'package-lock.json'), path.join(destinoAbs, 'package-lock.json'));
}
fs.mkdirSync(path.join(destinoAbs, 'img'), { recursive: true });
/* Los íconos del MOLDE que viajan en el kit (kit-base v1.9.98): hoy
   `reproductor-play.webp`, el botón de play de la marca que usa
   `.d-shot-hit-play--art`. Van copiados, no referenciados: el paquete
   SCORM tiene que ser autocontenido. Si no se copiaran, un curso que
   use esa clase quedaría con un `<img>` roto y `markup-sanity` en rojo
   por un 404 — exactamente "la pieza está y el cable no". */
const imgKit = path.join(KIT_ROOT, 'img');
if (fs.existsSync(imgKit)) {
  for (const f of fs.readdirSync(imgKit)) {
    fs.copyFileSync(path.join(imgKit, f), path.join(destinoAbs, 'img', f));
  }
}
fs.mkdirSync(path.join(destinoAbs, 'video'), { recursive: true });

/* ---- 1b. Curso-simulador (kit-base v1.9.81, CLAUDE.md §7.27) ----
   `--tipo simulador` deja la carpeta lista para el molde de simulador:
   el archivo de datos ya creado (que es lo primero que se llena) y el
   boilerplate de marcado a mano. El motor y el CSS ya viajaron con
   `copiarDir('js')` y `copiarDir('css')`: son parte del kit, no un
   extra.
   NO se genera el `index.html` del simulador entero a propósito. Las
   pantallas salen del PDF del diseñador, una por una (§3), y un
   esqueleto de tres pantallas inventadas invitaría a llenarlo sin
   abrir el PDF — que es exactamente el error que este kit ya pagó. */
const esSimulador = (args.tipo || '').toLowerCase() === 'simulador';
if (esSimulador) {
  fs.copyFileSync(path.join(KIT_ROOT, 'simulador-boilerplate.html'),
                  path.join(destinoAbs, 'simulador-boilerplate.html'));
  fs.copyFileSync(path.join(KIT_ROOT, 'js', 'escenario-boilerplate.js'),
                  path.join(destinoAbs, 'js', 'escenario.js'));
}

// ---- 2. curso.js: la plantilla del kit, con COURSE_SLUG/COURSE_NAME reales ----
function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const slug = slugify(args.titulo);
const cursoJs = fs.readFileSync(path.join(KIT_ROOT, 'js', 'curso.js'), 'utf8')
  .replace("var COURSE_SLUG = 'nombre-del-curso';", `var COURSE_SLUG = '${slug}';`)
  .replace("var COURSE_NAME = 'Nombre del curso';", `var COURSE_NAME = '${args.titulo.replace(/'/g, "\\'")}';`);
fs.writeFileSync(path.join(destinoAbs, 'js', 'curso.js'), cursoJs);

// ---- 3. imsmanifest.xml (mismo formato que un curso real: SCORM 1.2,
//         un SCO, sin masteryscore — ver CLAUDE.md §3.11 sobre cuándo
//         SÍ declararlo) ----
const idBase = slug.toUpperCase().replace(/-/g, '_');
/* El título va DENTRO de XML (comentario, <title> y atributos): un
   "&" o un "<" en el nombre del curso — "Higiene & seguridad", "Uso
   de sucursales <NOA>" — genera un imsmanifest.xml malformado, y un
   manifest que no parsea es un paquete que el LMS rechaza entero al
   importarlo. kit-base v1.9.52. */
function escXml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
const tituloXml = escXml(args.titulo);
const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  imsmanifest.xml · "${tituloXml}"
  SCORM 1.2, un solo SCO. Generado por tools/new-course.mjs —
  revisar si corresponde declarar <adlcp:masteryscore> (CLAUDE.md §3.11:
  NO declararlo si la evaluación calificada vive aparte, en Moodle).
-->
<manifest identifier="COTO_${idBase}" version="1.0"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>

  <organizations default="ORG_${idBase}">
    <organization identifier="ORG_${idBase}">
      <title>${tituloXml}</title>
      <item identifier="ITEM_${idBase}" identifierref="RES_${idBase}" isvisible="true">
        <title>${tituloXml}</title>
      </item>
    </organization>
  </organizations>

  <resources>
    <resource identifier="RES_${idBase}" type="webcontent" adlcp:scormtype="sco" href="index.html">
<!--FILES-->
    </resource>
  </resources>
</manifest>
`;
/* El manifiesto se escribe AL FINAL de este script (ver "6. manifiesto"):
   para enumerar los archivos hay que esperar a que estén todos. */

// ---- 4. CSS/README propios del curso — arrancan vacíos, con el
//         encabezado de rigor (evita el bug de §1: "el kit usa clases
//         que no define" si alguien las llena sin acordarse de que
//         existen) ----
for (const nombre of ['assets.css', 'diapositivas.css', 'pulido.css']) {
  fs.writeFileSync(path.join(destinoAbs, 'css', nombre),
    `/* ${nombre} — CSS propio de "${args.titulo}". Nunca tocar los .css del kit (CLAUDE.md §1). */\n`);
}
fs.writeFileSync(path.join(destinoAbs, 'README-CURSO.md'),
  `# ${args.titulo}\n\nBitácora propia de este curso (decisiones, bugs reales, pendientes) — ` +
  `no se mezcla con \`kit-base/CLAUDE.md\` (CLAUDE.md §0.1).\n\n` +
  `Generado con \`tools/new-course.mjs\` a partir de kit-base ` +
  `v${JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'package.json'), 'utf8')).version}.\n\n` +
  /* La sección del relevo nace con el curso (kit-base v1.9.122, §7.71):
     `build-zip.py` no arma el zip del curso si sigue así de vacía, y con
     lo que tenga arma el zip del relevo. */
  `## Relevo al kit\n\n` +
  `(pendiente — antes de entregar: correr \`node tools/revisar-curso.mjs .\` y anotar acá TODO lo que ` +
  `se resolvió o se encontró en el curso, también lo que parezca propio; decide el kit. ` +
  `\`build-zip.py\` no arma el zip del curso mientras esta sección diga "pendiente".)\n`);

// ---- 5. index.html, a partir de index-boilerplate.html (kit v1.9.60) ----
/* Hasta v1.9.59 este script NO generaba el index.html y mandaba a
   copiar el de un curso de referencia. La auditoría de los 2 cursos
   terminados (§7.08) mostró que el chrome de los dos difiere solo en
   PARÁMETROS, no en estructura — y que adaptarlo a mano es justo donde
   el contrato se rompe EN SILENCIO: `initPlayer()` no tira ningún
   error si un id no calza, simplemente deja medio chrome muerto.
   Generarlo acá lo acierta siempre. Lo que sigue siendo 100% del curso
   son las DIAPOSITIVAS: esto deja una por sección, vacía y rotulada. */

// El color del favicon sale de `--cat-strong` de la categoría elegida,
// leído del CSS real — no de una tabla copiada acá que se desactualice.
const catStrong = (() => {
  const css = fs.readFileSync(path.join(KIT_ROOT, 'css', 'coto-base.css'), 'utf8');
  const linea = css.split('\n').find(l => l.includes(`[data-cat="${args.cat}"]`)) || '';
  const m = linea.match(/--cat-strong:\s*#([0-9A-Fa-f]{6})/);
  return m ? m[1] : '0032C8';
})();

/* Secciones de arranque: el esqueleto que todo curso del molde tiene.
   El curso real suma, saca y renombra — pero arrancar con el orden
   correcto (y con `data-slide-end` en la última) evita de entrada el
   §6.24, el peor bug que tuvo este kit: sin `courseend` el alumno
   termina el curso y el LMS lo deja "incomplete" para siempre. */
/* `tipo` = rol estructural, y el ícono sale del catálogo canónico: es
   el MISMO en todos los cursos y se marca con `data-icono-tipo` para
   que el test sepa que repetirlo es correcto.
   Sin `tipo` = diapositiva de CONTENIDO: ícono propio del tema, que el
   curso reemplaza, y nunca repetido adentro del curso. */
const SECCIONES = [
  { id: 'portada', label: 'Portada', tipo: 'portada', grupo: 'Inicio' },
  { id: 'introduccion', label: 'Introducción', tipo: 'introduccion', entrada: true },
  { id: 'objetivos', label: 'Objetivos de aprendizaje', tipo: 'objetivos', entrada: true },
  { id: 'tema-1', label: 'Tema 1', icono: 'i-tema-1', grupo: 'Contenido' },
  { id: 'tema-2', label: 'Tema 2', icono: 'i-tema-2' },
  { id: 'repaso', label: 'Repaso', tipo: 'resumen', grupo: 'Cierre' },
  { id: 'cierre', label: 'Cierre', tipo: 'cierre' }
];
/* Resuelve el ícono de cada sección: del catálogo si es de tipo, propio
   si es de contenido. */
const iconoDe = (s) => s.tipo ? ICONOS_TIPO[s.tipo].icono : s.icono;

/* Sprite base: SOLO los íconos que el chrome generado referencia de
   verdad. `i-check` es el que usa CADA ítem del índice (la tilde de
   "ya visto"), así que sin él el índice sale roto en todos los cursos
   — por eso el set base es del kit aunque el sprite temático siga
   siendo contenido de curso (§6.67): se suman en el index.html
   generado, con el mismo estilo de línea 24x24. */
/* OJO: `i-check` NO va acá — ya lo define `header-boilerplate.html`,
   que se inyecta entero más abajo. Definirlo en los dos lados es un id
   duplicado, o sea el fallo silencioso del §7.06 punto 2: el `<use>`
   resuelve al primero y el segundo queda muerto. */
/* Los íconos de TIPO salen del catálogo (`tools/iconos-tipo.mjs`) y se
   emiten SOLO los que estas secciones usan de verdad: `iconos-indice`
   cuenta como fallo un símbolo definido y sin usar — engorda el sprite
   y hace creer que existe una sección que no está.
   Agregar una sección de otro tipo (una unidad, un minijuego) trae su
   símbolo sola, porque esto se calcula desde `SECCIONES`. */
const SPRITE_TEMAS = {
  /* Un ícono POR TEMA, distintos entre sí (kit-base v1.9.76, §7.22).
     El scaffold ponía `i-layers` en los dos temas, y la regla del kit
     dice que dos diapositivas de CONTENIDO distintas nunca comparten
     ícono — el alumno usa el ícono del índice para orientarse, y
     repetido deja de orientar.
     Son placeholders con forma neutra: el curso los reemplaza por el
     ícono de SU tema, que es justamente lo que la regla pide. */
  'i-tema-1': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 10h8M8 14h5"/>',
  'i-tema-2': '<circle cx="12" cy="12" r="9"/><path d="M12 8v5l3 2"/>'
};
/* OJO: `i-check` NO va acá — ya lo define `header-boilerplate.html`,
   que se inyecta entero más abajo. Definirlo en los dos lados es un id
   duplicado, o sea el fallo silencioso del §7.06 punto 2: el `<use>`
   resuelve al primero y el segundo queda muerto. */
const tiposUsados = [...new Set(SECCIONES.filter(s => s.tipo).map(s => ICONOS_TIPO[s.tipo].icono))];
const temasUsados = Object.entries(SPRITE_TEMAS).filter(([id]) =>
  SECCIONES.some(s => !s.tipo && s.icono === id));
const sprite = [
  spriteTipos(tiposUsados),
  ...temasUsados.map(([id, body]) =>
    `    <symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`)
].filter(Boolean).join('\n');

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const slides = SECCIONES.map((s, i) => {
  const ultima = i === SECCIONES.length - 1;
  const fin = ultima ? ' data-slide-end' : '';
  /* La capa de confeti va UNA sola vez y en la diapositiva de cierre,
     que es donde `initCierreCelebration()` la usa. Se emite acá, y no
     se deja al curso, por un bug real: "Uso de Sucursales 3 - NOA"
     terminó con DOS `#d-confetti` idénticos (el segundo, muerto —
     `getElementById` devuelve siempre el primero), y eso no lo delataba
     nada hasta que markup-sanity aprendió a ver ids duplicados en
     v1.9.58. Emitirla desde acá cierra las dos puntas: no falta y no
     se duplica. */
  const confeti = ultima
    ? `    <div class="d-confetti" id="d-confetti" aria-hidden="true"></div>\n`
    : '';
  return `  <!-- ${escHtml(s.label)} -->\n` +
    /* `data-entrada` (kit-base v1.9.99): las diapositivas GENÉRICAS
       —introducción, objetivos— son la misma captura plana en cualquier
       curso, sin piezas sueltas que escalonar, y el cliente pidió en
       "Seguridad alimentaria" que no entraran "muertas". Ver
       `initEntradaGenerica()` en coto-ui.js. Se saca borrando el
       atributo. */
    `  <section class="slide" data-slide="${s.id}" data-slide-index="${i}"${fin}${s.entrada ? ' data-entrada' : ''}>\n` +
    /* `data-slide-title` NO es decorativo (kit-base v1.9.95): es lo que
       `Motor.go()` busca para mover el foco al entrar a la diapositiva, y
       eso es lo que le avisa a un lector de pantalla que el contenido
       cambió. El generador emitía `<h2>` pelado, así que en TODO curso
       generado ese foco no encontraba nada y la accesibilidad quedaba
       muda — la pieza estaba en el motor y el cable no lo escribía nadie.
       Los cursos terminados lo tienen porque se escribió a mano, uno por
       uno. Medido: 1 sola diapositiva con el atributo en un curso
       generado (y era una que se había editado a mano), 0 en el
       boilerplate. */
    `    <h2 data-slide-title>${escHtml(s.label)}</h2>\n` +
    /* ⚠️ Y un párrafo de arranque, que NO es relleno (kit-base v1.9.95).
       `[data-slide-title]` no se narra por default —decisión de un
       cliente anterior, "solo el contenido explícito" (§5)— así que una
       diapositiva cuyo único texto sea el `<h2>` queda MUDA, y
       `narracion-completa` la reporta con razón. Medido al cablear el
       atributo: 6 diapositivas del esqueleto pasaron a mudas de golpe.
       Emitir el párrafo deja el curso generado coherente con lo que el kit
       exige y le da al autor el lugar exacto donde escribir.

       ⚠️ Y ARRANCA CON EL NOMBRE DE LA DIAPOSITIVA, que tampoco es
       relleno: `narracion-titulos` exige que la narración EMPIECE por el
       título —si no, quien escucha entra a mitad de una explicación sin
       saber de qué le hablan— y como el `[data-slide-title]` no se narra,
       eso tiene que estar en el contenido. Medido: con un párrafo que no
       lo repetía, las 6 diapositivas del esqueleto fallaban ese test. Así
       el esqueleto muestra la forma que el kit pide en vez de pelearse
       con ella. */
    `    <p>${escHtml(s.label)}. Texto de esta diapositiva: reemplazar por el ` +
    `contenido real, dejando el nombre de la diapositiva al principio.</p>\n` +
    `    <!-- Contenido de esta diapositiva. Decidir primero (CLAUDE.md §7\n` +
    `         paso 2): captura íntegra (.d-shot-slide) vs. piezas HTML reales. -->\n` +
    confeti +
    `  </section>`;
}).join('\n\n');

const sidenavItems = SECCIONES.map(s => {
  const grupo = s.grupo ? `      <span class="d-sidenav-group">${escHtml(s.grupo)}</span>\n` : '';
  return grupo +
    `      <button class="d-sidenav-item" type="button" data-goto="${s.id}"` +
    (s.tipo ? ` data-icono-tipo="${s.tipo}"` : '') + '>' +
    `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#${iconoDe(s)}"/></svg>` +
    `<span>${escHtml(s.label)}</span>` +
    `<svg class="ix-ck" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg></button>`;
}).join('\n');

/* El header NO está copiado dentro de index-boilerplate.html: se
   inyecta acá desde `header-boilerplate.html`, su única fuente de
   verdad. Dos copias de la misma barra era garantizar que se
   desincronicen — el bug que este kit ya pagó con el sprite y con los
   popovers. Se le saca el docblock de encabezado (instrucciones para
   quien lo lee suelto): dentro de un index.html ya armado no aporta. */
/* `header-boilerplate.html` trae placeholders entre <> pensados para
   rellenar a mano: <NOMBRE DEL CURSO>, <CATEGORÍA> y el src del logo
   `img/icono-<CATEGORIA>.webp`. Dejarlos sin resolver no es cosmético:
   el src roto es un 404, y un 404 hace fallar TRES tests de la suite
   (deep-audit, full-regress, hitbox-click-check cuentan cualquier
   error de consola). Es justo el tipo de detalle que se olvida al
   adaptar a mano — acá se resuelve siempre. */
const nombreCat = args.cat.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());
const header = fs.readFileSync(path.join(KIT_ROOT, 'header-boilerplate.html'), 'utf8')
  .replace(/^<!--[\s\S]*?-->\s*/, '')
  .replace(/img\/icono-<CATEGORIA>\.webp/g, `img/icono-${args.cat}.webp`)
  .replace(/<NOMBRE DEL CURSO>/g, escHtml(args.titulo))
  .replace(/<CATEGORÍA>/g, escHtml(nombreCat));

const indexHtml = fs.readFileSync(path.join(KIT_ROOT, 'index-boilerplate.html'), 'utf8')
  .replace(/^<!--[\s\S]*?-->\s*/, '')     // el docblock de la plantilla no viaja al curso
  .replace(/\{\{TITULO\}\}/g, escHtml(args.titulo))
  .replace(/\{\{CAT\}\}/g, args.cat +
    /* Un simulador ES la práctica de punta a punta y no tiene quiz ni
       repaso: se declara, así `gamificacion` no lo lee como faltante
       (relay K6, kit-base v1.9.81). */
    (esSimulador ? '" data-practica="simulador' : ''))
  .replace(/\{\{FAVICON_HEX\}\}/g, catStrong)
  .replace(/\{\{CSS_EXTRA\}\}/g, esSimulador
    ? '<!-- La cáscara del simulador va ANTES que la del curso, para que\n' +
      '     `diapositivas.css` pueda ajustar lo suyo encima. -->\n' +
      '<link rel="stylesheet" href="css/coto-simulador.css">\n' +
      '<!-- <link rel="stylesheet" href="css/coto-gescom.css"> si se simula GESCOM -->'
    : '<!-- <link rel="stylesheet" href="css/coto-quiz.css"> si el curso tiene quiz -->\n' +
      '<!-- <link rel="stylesheet" href="css/coto-minijuego.css"> si tiene minijuego -->')
  .replace(/\{\{SPRITE\}\}/g, sprite)
  .replace(/\{\{HEADER_BOILERPLATE\}\}/g, header.trimEnd())
  .replace(/\{\{SLIDES\}\}/g, slides)
  .replace(/\{\{TOTAL\}\}/g, String(SECCIONES.length))
  .replace(/\{\{SIDENAV_ITEMS\}\}/g, sidenavItems)
  .replace(/\{\{JS_EXTRA\}\}/g, esSimulador
    ? '<!-- El motor del simulador, después los DATOS del ejercicio. Los dos\n' +
      '     ANTES de curso.js, que es quien llama a initSimulador(). -->\n' +
      '<script src="js/coto-simulador.js"></script>\n' +
      '<script src="js/escenario.js"></script>'
    : '<!-- <script src="js/coto-quiz.js"></script> si el curso tiene quiz -->');

/* Un token sin rellenar es un `{{ALGO}}` literal en pantalla, en el
   curso entregado. Barato de atrapar acá y carísimo de descubrir en el
   LMS del cliente. */
const tokensSueltos = indexHtml.match(/\{\{[A-Z_]+\}\}/g);
if (tokensSueltos) {
  console.error(`✗ index-boilerplate.html quedó con tokens sin rellenar: ${[...new Set(tokensSueltos)].join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(destinoAbs, 'index.html'), indexHtml);

/* Logo de la marca: WebP de 1x1 transparente, como PLACEHOLDER real.
   No es capricho — la alternativa (dejar el src apuntando a un archivo
   que no existe) mete un 404 en consola, y la suite cuenta cualquier
   error de consola como fallo del curso: un curso recién generado
   arrancaría con 3 de 7 tests en rojo por un archivo que el diseñador
   todavía no entregó. Con esto arranca en verde y se reemplaza por el
   ícono real cuando llega, sin tocar el HTML. */
const LOGO_1PX_WEBP = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
fs.writeFileSync(path.join(destinoAbs, 'img', `icono-${args.cat}.webp`),
  Buffer.from(LOGO_1PX_WEBP, 'base64'));

// ---- 6. imsmanifest.xml, ENUMERANDO los archivos del paquete ----
/* CONVENCIÓN DEL KIT, decidida en v1.9.95: el manifiesto lista archivo
   por archivo todo lo que viaja en el paquete.
   Antes emitía un solo `<file href="index.html"/>`, y eso dejaba a los
   cursos en dos convenciones distintas sin que el kit dijera cuál era la
   buena: uno enumeraba sus 75 archivos a mano y otro declaraba solo el
   índice. Las dos andan en Moodle, que sirve todo lo que viene en el
   zip; un LMS estricto o un validador SCORM despliega SOLO lo declarado,
   así que la lista corta puede dejar el curso sin sus hojas de estilo o
   sin un módulo, roto y sin una línea de consola.
   Lo que hace sostenible enumerar es que ahora hay quien lo vigile:
   `tools/check-manifest.mjs` compara el manifiesto contra el disco. */
const CARPETAS_PAQUETE = ['css', 'js', 'img', 'fonts', 'video', 'doc', 'audio'];
const IGNORAR_PAQUETE = /(^|\/)(\.DS_Store|Thumbs\.db|\.git|node_modules)(\/|$)/;
function listarPaquete(dir) {
  const salida = [];
  const abs = path.join(destinoAbs, dir);
  if (!fs.existsSync(abs)) return salida;
  (function rec(rel) {
    for (const e of fs.readdirSync(path.join(destinoAbs, rel))) {
      const hijo = rel + '/' + e;
      if (IGNORAR_PAQUETE.test(hijo)) continue;
      if (fs.statSync(path.join(destinoAbs, hijo)).isDirectory()) rec(hijo);
      else salida.push(hijo);
    }
  })(dir);
  return salida;
}
const delPaquete = ['index.html'].concat(
  CARPETAS_PAQUETE.flatMap(listarPaquete).sort()
);
fs.writeFileSync(
  path.join(destinoAbs, 'imsmanifest.xml'),
  manifest.replace('<!--FILES-->',
    delPaquete.map((f) => '      <file href="' + f.replace(/&/g, '&amp;') + '"/>').join('\n'))
);

// ---- 7. kit-version.json: de qué versión del kit salió este curso ----
/* kit-base v1.9.102. Anota la versión y una huella de cada archivo del
   kit que recibió el curso. Con eso `actualizar-kit.mjs` puede llevarlo a
   una versión nueva sin pisar a ciegas —sabe qué se tocó a mano— y
   `tests/kit-intacto.mjs` avisa si alguien editó un archivo del kit
   adentro del curso, que es cómo los arreglos quedaban atrapados en un
   zip (§0.1).
   ⚠️ Y verifica que TODO lo que la lista dice que es del kit haya llegado:
   si alguien agrega una copia acá arriba y no a `_kit-archivos.mjs` (o
   al revés), falla al generar y no seis meses después. */
{
  const faltan = archivosDelKit(KIT_ROOT).filter((f) => !fs.existsSync(path.join(destinoAbs, f)));
  if (faltan.length) {
    console.error('✗ _kit-archivos.mjs dice que estos archivos son del kit y no llegaron al curso:\n  ' +
      faltan.join('\n  ') + '\n  Corregir la lista o la copia — tienen que coincidir.');
    process.exit(1);
  }
  fs.writeFileSync(path.join(destinoAbs, 'kit-version.json'),
    JSON.stringify(registroDeVersion(KIT_ROOT, destinoAbs), null, 2) + '\n');
}

/* ---- El curso nace como DATOS (kit-base v1.9.116, cierre de la Fase 1) ----
   Se pasa el index recién generado por `extraer-curso.mjs`: queda
   `curso.json` (el contenido) + `marco.html` (el resto), y el index pasa a
   ser un archivo ARMADO (`armar-curso.mjs`). El extractor verifica que
   armar desde los datos dé el mismo curso; si algo falla —por ejemplo, no
   hay Chromium en la máquina— el curso queda como antes, con el index a
   mano, y se avisa. `--sin-datos` lo saltea a propósito. */
let comoDatos = false;
if (!args.sinDatos) {
  const r = spawnSync(process.execPath, [path.join(AQUI, 'extraer-curso.mjs'), destinoAbs], { encoding: 'utf8' });
  comoDatos = r.status === 0 && fs.existsSync(path.join(destinoAbs, 'curso.json'));
  /* Y el index se vuelve a escribir DESDE los datos: es el mismo curso
     (el extractor lo verificó), pero así es literalmente el archivo armado
     y `actualizar-kit` no lo toma por editado a mano. */
  /* Los 5 logros del kit, de entrada (kit-base v1.9.125, §7.74). Pedido
     del cliente: "todos los cursos con 5 logros por defecto". Son ids:
     el texto, el ícono, el bono de +20 y la detección los pone el kit
     (coto-logros.js). Un curso los puede cambiar por logros propios.
     v1.9.127, regla del cliente: 2 de RECORRIDO + 3 de PLUS. Los de
     recorrido del kit (`mitad`, `completo`) se cambian, cuando el curso
     tiene unidades, por los suyos ("Unidad 1 completa"…). */
  if (comoDatos) {
    const fCurso = path.join(destinoAbs, 'curso.json');
    const datosCurso = JSON.parse(fs.readFileSync(fCurso, 'utf8'));
    if (datosCurso.logros === undefined) {
      datosCurso.logros = ['mitad', 'completo', 'impecable', 'racha', 'explorador'];
      fs.writeFileSync(fCurso, JSON.stringify(datosCurso, null, 2) + '\n');
    }
  }
  if (comoDatos) {
    const a = spawnSync(process.execPath, [path.join(AQUI, 'armar-curso.mjs'), destinoAbs], { encoding: 'utf8' });
    comoDatos = a.status === 0;
  }
  if (!comoDatos) {
    console.warn('⚠️ No se pudo pasar el curso a datos (curso.json + marco.html); queda con el index.html a mano.\n  ' +
      (((r.stderr || '') + (r.stdout || '')).split('\n').find((l) => /Error|✗/.test(l)) || 'sin detalle').trim().slice(0, 200));
  }
}

console.log(`✓ Curso creado en ${destinoAbs}`);
if (esSimulador) {
  console.log('  Tipo SIMULADOR: `js/escenario.js` (los datos) y `simulador-boilerplate.html`');
  console.log('  (el marcado del riel, la hoja de ruta y los pop-ups) ya están en la carpeta.');
  console.log('  Empezá por el PDF del diseñador: las pantallas, las cáscaras de los pop-ups y');
  console.log('  las proporciones salen de ahí — ver CLAUDE.md §7.27.');
}
console.log(`  index.html generado: chrome completo y cableado + ${SECCIONES.length} diapositivas vacías.`);
if (comoDatos) {
  console.log('  El curso está como DATOS: el contenido se edita en curso.json (el resto del index en marco.html)');
  console.log('  y el index se arma con `node tools/armar-curso.mjs .`. No editar index.html a mano.');
}
console.log('  Siguiente: CLAUDE.md §7 pasos 1-2 (PDF → decidir captura vs. HTML real por');
console.log(comoDatos
  ? '  diapositiva), después llenar las diapositivas en curso.json y escribir js/curso.js.'
  : '  diapositiva), después llenar las <section data-slide> y escribir js/curso.js.');
