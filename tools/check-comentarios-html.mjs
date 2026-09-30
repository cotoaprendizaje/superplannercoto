#!/usr/bin/env node
/* check-comentarios-html — kit-base v1.9.81
   ============================================================
   POR QUÉ EXISTE, con el caso real que lo originó.

   Al integrar el molde de simulador (§7.27), `simulador-boilerplate
   .html` llegó con TRES bloques donde un encabezado de sección nuevo
   se había insertado DENTRO de un comentario ya existente. El `-->`
   del encabezado cerraba el comentario de más arriba, y el final del
   comentario viejo quedaba como TEXTO VIVO en la página:

       <!-- ========== 7 · "¡UPS!" ... ========== -->
       significado que puede tener, que es empezar de nuevo. -->
       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
       esto se RENDERIZA: el alumno lo ve escrito en la diapositiva.

   Es un error que no da ningún síntoma hasta que alguien mira la
   página, y ninguna de las cinco verificaciones que traía ese relay
   —que cruzaban atributos y clases— podía verlo, porque ninguna
   parseaba el HTML. Tampoco lo ven los tests de Playwright: corren
   contra el `index.html` GENERADO, y los boilerplates son archivos
   que se copian a mano.

   Qué mide: que en todo `.html` del kit el texto que está FUERA de un
   comentario no contenga `-->`, y que no quede ningún `<!--` sin
   cerrar. Es barato y determinístico, así que va en `test:kit`.
   ============================================================ */
import fs from 'fs';
import path from 'path';

const raiz = process.argv[2] || '.';
const archivos = fs.readdirSync(raiz)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.join(raiz, f))
  .sort();

if (!archivos.length) {
  console.log('✓ check-comentarios-html — no hay .html en la raíz, nada que revisar.');
  process.exit(0);
}

const fallos = [];
for (const p of archivos) {
  const s = fs.readFileSync(p, 'utf8');
  const linea = (i) => s.slice(0, i).split('\n').length;
  let i = 0;
  while (i < s.length) {
    const abre = s.indexOf('<!--', i);
    const fuera = abre < 0 ? s.slice(i) : s.slice(i, abre);
    if (fuera.includes('-->')) {
      const off = i + fuera.indexOf('-->');
      fallos.push(`${p}:${linea(off)} — `
        + '`-->` en texto que NO está dentro de un comentario. Casi siempre es un '
        + 'encabezado de sección pegado adentro de otro comentario: su `-->` cerró el '
        + 'de arriba y la cola del viejo quedó como texto vivo, visible en la página.');
    }
    if (abre < 0) break;
    const cierra = s.indexOf('-->', abre);
    if (cierra < 0) {
      fallos.push(`${p}:${linea(abre)} — `
        + '`<!--` que nunca cierra: todo lo que sigue desaparece de la página.');
      break;
    }
    i = cierra + 3;
  }
}

if (fallos.length) {
  console.error(`\n✗ check-comentarios-html — ${fallos.length} problema(s):\n`);
  fallos.forEach((f) => console.error('  · ' + f));
  console.error('');
  process.exit(1);
}
console.log(`✓ check-comentarios-html — ${archivos.length} archivo(s) .html, `
  + 'ningún comentario abierto ni cola de comentario suelta.');
