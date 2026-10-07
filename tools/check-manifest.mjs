#!/usr/bin/env node
/* check-manifest.mjs — kit-base v1.9.94
   ------------------------------------------------------------
   POR QUÉ EXISTE. `imsmanifest.xml` enumera archivo por archivo todo
   lo que viaja en el paquete SCORM, y nada lo mantiene sincronizado
   con el disco. Las dos formas de que se desalinee no dan ningún
   error visible mientras uno desarrolla con un servidor local:

     · un archivo EN EL DISCO y no en el manifiesto — el curso anda
       perfecto en local y en Moodle, porque Moodle es permisivo y
       sirve igual lo que está en el zip; pero un LMS estricto (o un
       validador SCORM) solo despliega lo declarado, y ahí el curso
       aparece sin una hoja de estilos o sin un módulo, o sea roto sin
       una sola línea de consola;
     · un archivo EN EL MANIFIESTO y no en el disco — el paquete no
       valida, y el mensaje del LMS no suele decir cuál falta.

   Pasó de verdad: al sumarle a "Prevención cardiovascular" las tres
   piezas que le faltaban de la capa del kit (`coto-repaso.css`,
   `coto-minijuego.css`, `coto-minijuego.js`), los `<link>` y el
   `<script>` se agregaron y el manifiesto quedó viejo. La suite
   entera daba 45/45 en verde — ninguno de los 45 tests mira el
   manifiesto.

   Se corre desde la carpeta del curso:
       node ../kit-base/tools/check-manifest.mjs
*/
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/* `--arreglar` (kit-base v1.9.122, §7.71): rehace la lista de <file> del
   manifiesto desde el disco —las mismas carpetas que mira el chequeo— y
   vuelve a medir. Lo relevó "Uso de Sucursales 3 - NOA": su manifiesto
   declaraba videos con nombres viejos que ya no existían y no declaraba
   máscaras, pósters ni artes del minijuego (58 desajustes); el curso la
   rehízo a mano. `actualizar-kit` solo suma los archivos DEL KIT. */
const ARREGLAR = process.argv.includes('--arreglar');
const raiz = process.argv.slice(2).find((a) => !a.startsWith('--')) || '.';
const manifiesto = join(raiz, 'imsmanifest.xml');
const fallos = [];

if (!existsSync(manifiesto)) {
  console.log('✗ check-manifest — no hay imsmanifest.xml en ' + raiz);
  process.exit(1);
}

const xml = readFileSync(manifiesto, 'utf8');
const declarados = new Set(
  Array.from(xml.matchAll(/<file\s+href="([^"]+)"/g)).map((m) => decodeURIComponent(m[1]))
);

/* Qué se considera "contenido del curso". `index.html` va aparte (es
   el `href` del <resource>, y también se declara como <file>). Se
   ignora lo que no forma parte del paquete servido. */
const CARPETAS = ['css', 'js', 'img', 'fonts', 'video', 'doc', 'audio'];
const IGNORAR = /(^|\/)(\.DS_Store|Thumbs\.db|\.git|node_modules)(\/|$)/;

function listar(dir) {
  const salida = [];
  if (!existsSync(join(raiz, dir))) return salida;
  (function rec(d) {
    for (const e of readdirSync(join(raiz, d))) {
      const rel = d + '/' + e;
      if (IGNORAR.test(rel)) continue;
      if (statSync(join(raiz, rel)).isDirectory()) rec(rel);
      else salida.push(rel);
    }
  })(dir);
  return salida;
}

const enDisco = CARPETAS.flatMap(listar);
if (existsSync(join(raiz, 'index.html'))) enDisco.push('index.html');

/* ---- La convención está fijada, y esto la vigila ----
   Al estrenar este chequeo aparecieron DOS convenciones conviviendo: un
   curso enumeraba sus 75 archivos y otro declaraba solo `index.html`.
   Las dos andan en Moodle, que sirve todo lo que viene en el zip, así que
   la diferencia no se notaba; en un LMS estricto o en un validador SCORM
   sí, porque despliegan SOLO lo declarado.

   Decidido en kit-base v1.9.95: **el manifiesto enumera todo**.
   `tools/new-course.mjs` lo emite así desde el arranque y esto lo
   mantiene honesto. Un manifiesto que declara solo el índice ya no es
   "una decisión pendiente": es un manifiesto viejo, y se reporta como
   falla, porque ahora hay una convención con la cual compararlo. */
if (ARREGLAR) {
  const lista = [...new Set(['index.html', ...enDisco.filter((f) => f !== 'index.html')])]
    .filter((f) => existsSync(join(raiz, f.split('/').join(sep))));
  const sangria = (xml.match(/\n([ \t]*)<file\s/) || [, '      '])[1];
  let nuevo = xml.replace(/[ \t]*<file\s+href="[^"]*"\s*\/>[ \t]*\r?\n?/g, '');
  const cierre = nuevo.indexOf('</resource>');
  if (cierre < 0) { console.log('✗ check-manifest --arreglar — el manifiesto no tiene <resource>: no se tocó.'); process.exit(1); }
  const antes = nuevo.slice(0, cierre).replace(/[ \t]*$/, '');
  const indent = (nuevo.slice(0, cierre).match(/\n([ \t]*)$/) || [, '    '])[1];
  nuevo = antes + lista.map((f) => `${sangria}<file href="${f}"/>\n`).join('') + indent + nuevo.slice(cierre);
  writeFileSync(manifiesto, nuevo);
  console.log(`  imsmanifest.xml: lista de <file> rehecha desde el disco (${lista.length} archivo(s), antes ${declarados.size}).`);
  declarados.clear();
  lista.forEach((f) => declarados.add(f));
}

const soloIndex = declarados.size <= 1 && declarados.has('index.html');
if (soloIndex) {
  fallos.push('el manifiesto declara SOLO `index.html` y en el paquete hay ' + enDisco.length +
    ' archivos. La convención del kit (v1.9.95) es enumerarlos todos: un LMS estricto o un ' +
    'validador SCORM despliega solo lo declarado, así que el curso se sirve sin sus hojas de ' +
    'estilo ni sus módulos, roto y sin una línea de consola. Un curso generado con el kit ya ' +
    'sale con la lista completa; si este la perdió, se regenera con `node tools/new-course.mjs` ' +
    'o se copia el bloque <file> de un curso al día.');
}

/* Si es la forma corta, la falla de arriba ya lo dice todo: enumerar los
   47 archivos que faltan sería repetir la misma cosa 47 veces y enterrar
   la línea que hay que leer. Se listan uno por uno solo cuando el
   manifiesto SÍ enumera y se quedó viejo, que es el caso donde saber
   CUÁL falta es la mitad del diagnóstico. */
for (const f of soloIndex ? [] : enDisco) {
  if (!declarados.has(f)) {
    fallos.push(`"${f}" está en el paquete y NO lo declara el manifiesto: un LMS estricto ` +
      'no lo despliega, así que el curso se sirve sin esa pieza.');
  }
}
for (const f of declarados) {
  if (!existsSync(join(raiz, f.split('/').join(sep)))) {
    fallos.push(`"${f}" lo declara el manifiesto y NO está en el disco: el paquete no valida.`);
  }
}

if (fallos.length) {
  console.log(`✗ check-manifest — ${fallos.length} desajuste(s):`);
  fallos.forEach((f) => console.log('  - ' + f));
  process.exitCode = 1;
} else {
  console.log(`✓ check-manifest — ${enDisco.length} archivo(s) en el paquete, todos declarados, ` +
    'y ningún <file> apunta a algo que no existe.');
}
