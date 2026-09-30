#!/usr/bin/env node
/* check-raw-cat-colors.mjs — kit-base v1.9.43
   Detecta un hex de categoría (--cat / --cat-strong / --cat-soft /
   --cat-ink, definidos en coto-base.css §[data-cat=...]) escrito a
   mano, como literal, en una declaración que NO es la definición del
   token — es decir: alguien copió el número en vez de usar
   `var(--cat-strong)` (o similar). Ese bypass es exactamente lo que
   rompe la paridad con el Manual de Diseño si el cliente pide
   ajustar una categoría más adelante: el token cambia, pero el color
   copiado a mano se queda atrás, en silencio.

   POR QUÉ NO ES "cualquier color crudo es un error"
   --------------------------------------------------
   Se probó esa versión primero (ver CLAUDE.md §6.65): el kit tiene
   ~150 usos legítimos de colores crudos (blancos/negros/grises de
   chrome, sombras `rgba(20,30,60,...)`, gradientes del minijuego)
   que NO tienen nada que ver con el sistema de categorías — exigir
   que todo pase por un token ahí sería ruido puro y el chequeo se
   terminaría ignorando. Este script solo mira los 75 hex que SON
   valores reales de --cat/--cat-strong/--cat-soft/--cat-ink hoy —
   si alguno de esos aparece suelto fuera de su propia definición,
   es casi con certeza una copia a mano, no una decisión de diseño.

   Excluye las declaraciones de custom property (`--algo: #hex`,
   que es donde los tokens SE DEFINEN) y los bloques `[data-cat=...]`
   enteros.

   Uso: node check-raw-cat-colors.mjs [css/coto-base.css ...]
        (sin argumentos: revisa todos los css/*.css del kit)
   Exit code 1 si encuentra algo, 0 si no. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
/* ⚠️ Mismo arreglo que en check-globals (kit-base v1.9.103): sin
   argumentos miraba el `css/` DEL KIT, así que corrido desde la carpeta
   de un curso decía "✓" sin haber revisado ninguna hoja del curso — que
   es donde los hex copiados a mano aparecen de verdad. Ahora, sin
   argumentos, usa el `css/` del directorio actual si existe, y cae al
   del kit solo si no lo hay.
   `CSS_BASE` (de donde salen los tokens) sigue el mismo criterio: un
   curso trae su propia copia de `coto-base.css`. */
const CSS_DIR = fs.existsSync(path.resolve('css'))
  ? path.resolve('css')
  : path.join(AQUI, '..', 'css');
const CSS_BASE = fs.existsSync(path.join(CSS_DIR, 'coto-base.css'))
  ? path.join(CSS_DIR, 'coto-base.css')
  : path.join(AQUI, '..', 'css', 'coto-base.css');

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, m => '\n'.repeat(m.split('\n').length - 1));
}

function tokensDeCategoria() {
  const raw = stripComments(fs.readFileSync(CSS_BASE, 'utf8'));
  const re = /--(cat|cat-strong|cat-soft|cat-ink)\s*:\s*(#[0-9a-fA-F]{3,8})/g;
  const set = new Set();
  let m;
  while ((m = re.exec(raw))) set.add(m[2].toLowerCase());
  return set;
}

function analizarArchivo(filePath, hexSet) {
  const raw = stripComments(fs.readFileSync(filePath, 'utf8'));
  const lines = raw.split('\n');
  const hallazgos = [];
  const declRe = /([a-zA-Z-]+)\s*:\s*[^;{}]*?(#[0-9a-fA-F]{3,8})/g;
  lines.forEach((line, i) => {
    let m;
    declRe.lastIndex = 0;
    while ((m = declRe.exec(line))) {
      const prop = m[1];
      const hex = m[2].toLowerCase();
      if (prop.startsWith('--')) continue; // es la definición del token, no un bypass
      /* ⚠️ FALSO POSITIVO que este test se comió durante varias vueltas
         (kit-base v1.9.103): un hex que va como FALLBACK de `var()` —
         `var(--cat, #1EAADC)` — no es un bypass, es lo contrario. El
         token gana siempre que exista, y el hex solo aparece si alguien
         cargó el CSS sin definir la categoría. La regla existe para que
         nadie COPIE un color de categoría a mano y después ese color
         quede desfasado del token; un fallback no puede desfasarse,
         porque no se usa mientras el token esté.
         MEDIDO en `coto-media.css` del kit: 4 hallazgos, los cuatro
         fallbacks de `var(--cat, …)` en los controles del reproductor,
         que venían así desde que ese reproductor subió al kit. O sea
         que el test estaba en rojo por algo correcto — y un test que
         está siempre en rojo se deja de leer, que es el modo de fallar
         que este kit ya pagó dos veces.
         Se mira el texto ANTES del hex en la misma declaración: si
         termina en una `var(` abierta con su coma, es un fallback. */
      const antes = line.slice(m.index, m.index + m[0].length - m[2].length);
      if (/var\(\s*--[\w-]+\s*,\s*$/.test(antes)) continue;
      if (hexSet.has(hex)) {
        hallazgos.push(`línea ${i + 1}: "${prop}: ${m[2]}" — ese hex es un token de categoría; usar var(--cat...) en su lugar.`);
      }
    }
  });
  return hallazgos;
}

const args = process.argv.slice(2);
const archivos = args.length
  ? args
  : fs.readdirSync(CSS_DIR).filter(f => f.endsWith('.css')).map(f => path.join(CSS_DIR, f));

const hexSet = tokensDeCategoria();
let huboHallazgos = false;

for (const f of archivos) {
  if (!fs.existsSync(f)) {
    console.error(`✗ no existe: ${f}`);
    huboHallazgos = true;
    continue;
  }
  const hallazgos = analizarArchivo(f, hexSet);
  if (hallazgos.length) {
    huboHallazgos = true;
    console.log(`✗ ${f}:`);
    hallazgos.forEach(h => console.log('  - ' + h));
  } else {
    console.log(`✓ ${path.basename(f)} — sin hex de categoría copiado a mano.`);
  }
}

if (!huboHallazgos) {
  console.log(`\n✓ Sin bypass de tokens de categoría — 0 de ${hexSet.size} hex conocidos aparece suelto.`);
}

process.exitCode = huboHallazgos ? 1 : 0;
