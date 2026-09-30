#!/usr/bin/env node
/* check-comentarios-css — kit-base v1.9.95
   ============================================================
   POR QUÉ EXISTE, con el caso real que lo originó.

   Hermano de `check-comentarios-html` (§7.27), para el otro lenguaje
   donde el kit escribe comentarios largos: las hojas de estilo. El caso
   apareció aplicando el relay de v1.9.95, en `coto-media.css`:

       /* ---- 3. Video circular que se reproduce EN EL LUGAR ---- *[/]
                                                                  ^^^
          El hover/fondo se anula a propósito: acá el hitbox NO es
          ... siete líneas de texto SUELTO dentro de la hoja ...
          acompaña pero nunca crece más allá de lo razonable. *[/]
       .d-shot-hit--video { cursor: pointer; background: transparent; }

   El cierre del título cerraba el comentario antes de tiempo, así que
   las siete líneas siguientes quedaban como texto al nivel de la hoja.

   POR QUÉ IMPORTA, medido en el navegador: el parser de CSS no tira
   ningún error —no hay nada en consola— y se lleva puesta la PRIMERA
   REGLA QUE SIGUE mientras intenta recuperarse. La hoja quedaba con 36
   reglas en vez de 37, y la que faltaba era
   `.d-shot-hit--video { cursor: pointer }`: el video circular que el
   alumno tiene que tocar no mostraba la manito. Cerrando bien el
   comentario, 37 reglas y la regla vuelve.

   O sea: un cierre de comentario de más NO rompe la hoja, se come la
   regla siguiente. Es el modo de falla peor, porque nada avisa.

   ⚠️ El otro lado del mismo error, y también medido: escribir la
   secuencia de cierre DENTRO de un comentario para explicarla lo cierra
   igual. Pasó en la primera versión de este mismo arreglo.

   Qué mide: que en todo `.css` del kit no haya un cierre de comentario
   en texto que no esté dentro de uno, y que no quede ningún `/*` sin
   cerrar. Barato y determinístico, así que va en `test:kit`.

   ⚠️ Un detalle que NO es un descuido: en CSS un cierre de comentario
   puede aparecer legítimamente dentro de una cadena
   (`content: "*\\/"`). Se ignoran las cadenas antes de medir, porque si
   no el chequeo daría un falso positivo en cualquier hoja que use
   `content` con ese texto.
   ============================================================ */
import fs from 'fs';
import path from 'path';

const raiz = process.argv[2] || 'css';
const archivos = fs.existsSync(raiz)
  ? fs.readdirSync(raiz).filter((f) => f.endsWith('.css')).map((f) => path.join(raiz, f)).sort()
  : [];

if (!archivos.length) {
  console.log(`✓ check-comentarios-css — no hay .css en ${raiz}/, nada que revisar.`);
  process.exit(0);
}

const ABRE = '/' + '*';
const CIERRA = '*' + '/';

/* Las cadenas se reemplazan por espacios del mismo largo, así los
   números de línea siguen siendo los del archivo real. */
function sinCadenas(s) {
  return s.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, (m) => ' '.repeat(m.length));
}

const fallos = [];
for (const p of archivos) {
  const bruto = fs.readFileSync(p, 'utf8');
  const s = sinCadenas(bruto);
  const linea = (off) => bruto.slice(0, off).split('\n').length;

  let i = 0;
  while (i < s.length) {
    const abre = s.indexOf(ABRE, i);
    const fuera = s.slice(i, abre < 0 ? undefined : abre);
    if (fuera.includes(CIERRA)) {
      const off = i + fuera.indexOf(CIERRA);
      fallos.push(`${p}:${linea(off)} — cierre de comentario en texto que NO está dentro de `
        + 'un comentario. Casi siempre es un comentario que cerró antes de tiempo (un título '
        + 'con su propio cierre) y dejó el resto como texto suelto en la hoja. El parser no '
        + 'da ningún error: se come la PRIMERA REGLA QUE SIGUE.');
    }
    if (abre < 0) break;
    const cierra = s.indexOf(CIERRA, abre + 2);
    if (cierra < 0) {
      fallos.push(`${p}:${linea(abre)} — comentario que nunca cierra: todas las reglas que `
        + 'siguen quedan adentro del comentario y dejan de existir.');
      break;
    }
    i = cierra + 2;
  }
}

if (fallos.length) {
  console.error(`\n✗ check-comentarios-css — ${fallos.length} problema(s):\n`);
  fallos.forEach((f) => console.error('  · ' + f));
  console.error('');
  process.exit(1);
}
console.log(`✓ check-comentarios-css — ${archivos.length} archivo(s) .css, `
  + 'ningún comentario abierto ni cierre suelto.');
