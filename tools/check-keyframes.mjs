/* check-keyframes — toda `animation` apunta a un `@keyframes` que existe.
   kit-base v1.9.108 (relevo de "Prevención cardiovascular").

   POR QUÉ EXISTE
   --------------
   Un `animation: d-repaso-in .32s` cuyo `@keyframes` no está declarado
   NO da error, no avisa por consola y no se ve en ninguna parte: el
   elemento simplemente aparece sin animar. Es el tipo de defecto que
   nadie reporta porque nadie sabe qué tendría que haber visto.

   MEDIDO, y por eso está: cuando la tira de `Repaso rápido` se mudó de
   "Seguridad Alimentaria" al kit, las reglas vinieron y los tres
   `@keyframes` se quedaron en el `assets.css` de ese curso. Desde
   entonces, en todo curso armado del kit, `d-repaso-in`,
   `d-repaso-celebrate` y `d-repaso-shake` apuntaban a la nada: sin la
   entrada de la pregunta, sin el temblor al errar y sin el festejo al
   acertar. Sobrevivió cinco vueltas de revisión sobre esa misma
   tarjeta.

   Y la otra mitad, el caso simétrico: al quitar una regla se puede
   llevar por delante el `@keyframes` que otra regla todavía usa — pasó
   al sacar la "ilustración viva" de "Prevención cardiovascular", que
   dejó a `.d-barra-cartel` (de otra diapositiva) animando contra un
   nombre borrado.

   Mira las dos direcciones. Los `@keyframes` declarados y sin usar NO
   son un fallo —un kit trae piezas que no todo curso usa— pero se
   listan, porque un nombre huérfano suele ser un typo del otro lado.

   Uso: node tools/check-keyframes.mjs <carpeta-con-css>  */
import fs from 'fs';
import path from 'path';

const raiz = process.argv[2] || 'css';
if (!fs.existsSync(raiz)) {
  console.error('no existe ' + raiz + ' — uso: node tools/check-keyframes.mjs <carpeta-con-css>');
  process.exit(2);
}

const archivos = fs.readdirSync(raiz).filter(f => f.endsWith('.css')).sort();
if (!archivos.length) {
  console.log('✓ check-keyframes — no hay .css en ' + raiz + ', nada que revisar.');
  process.exit(0);
}

/* Palabras que pueden aparecer en el atajo `animation` y NO son el
   nombre de la animación. Sin esto, `animation: none`, un `ease` o un
   `infinite` se reportan como keyframes faltantes. */
const PALABRAS = new Set(['none', 'inherit', 'initial', 'unset', 'revert', 'revert-layer',
  'normal', 'reverse', 'alternate', 'alternate-reverse',
  'forwards', 'backwards', 'both', 'running', 'paused',
  'infinite', 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
  'step-start', 'step-end']);

const declarados = new Map();   // nombre → archivo
const usados = new Map();       // nombre → [archivo:linea]
const indirectos = new Set();   // nombres que llegan por var(--x)
const fallos = [];

for (const f of archivos) {
  const texto = fs.readFileSync(path.join(raiz, f), 'utf8');
  /* Se trabaja sobre el CSS sin comentarios: un `animation:` dentro de
     un comentario —y en este kit los comentarios son largos y citan
     código— no es un uso. */
  const limpio = texto.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '));
  const lineas = limpio.split('\n');

  lineas.forEach((linea, i) => {
    const d = linea.match(/@keyframes\s+("[^"]+"|'[^']+'|[\w-]+)/);
    if (d) declarados.set(d[1].replace(/['"]/g, ''), f + ':' + (i + 1));

    /* Un `animation: var(--x)` no se puede resolver acá, pero el nombre
       suele estar en la DECLARACIÓN de esa propiedad
       (`--d-ken-burns: d-ken-burns 18s …`). Se registra como uso
       indirecto para que no aparezca como huérfano: el kit lo usa así a
       propósito, para que un curso pueda apagar la animación. */
    for (const m of linea.matchAll(/--[\w-]+\s*:\s*([^;}]+)/g)) {
      for (const tok of m[1].trim().split(/\s+/)) {
        if (/^[a-zA-Z_-][\w-]*$/.test(tok) && !PALABRAS.has(tok.toLowerCase())) indirectos.add(tok);
      }
    }

    for (const m of linea.matchAll(/animation(-name)?\s*:\s*([^;}]+)/g)) {
      const valor = m[2];
      if (valor.includes('var(')) {
        /* El nombre del FALLBACK de `var(--x, nombre 18s …)` sí se puede
           leer, y es un uso como cualquier otro: tiene que existir
           (kit-base v1.9.108, al subirla). Sin esto, `d-ken-burns` —que el
           kit podría aplicar así— no se registraba. (`d-ken-burns` sigue
           listado como "sin usar", y es correcto: el kit lo trae apagado,
           `var(--d-ken-burns, none)`, y lo prende el curso.) */
        for (const fb of valor.matchAll(/var\(\s*--[\w-]+\s*,\s*([^)]*)\)/g)) {
          for (const tok of fb[1].trim().split(/\s+/)) {
            if (!/^[a-zA-Z_-][\w-]*$/.test(tok) || PALABRAS.has(tok.toLowerCase())) continue;
            if (!usados.has(tok)) usados.set(tok, []);
            usados.get(tok).push(f + ':' + (i + 1));
            break;
          }
        }
        continue;
      }
      for (const trozo of valor.split(',')) {
        for (const tok of trozo.trim().split(/\s+/)) {
          if (!/^[a-zA-Z_-][\w-]*$/.test(tok)) continue;   // tiempos, %, cubic-bezier(...)
          if (PALABRAS.has(tok.toLowerCase())) continue;
          if (!usados.has(tok)) usados.set(tok, []);
          usados.get(tok).push(f + ':' + (i + 1));
          break;   // en el atajo, el primer identificador que queda es el nombre
        }
      }
    }
  });
}

for (const [nombre, donde] of usados) {
  if (declarados.has(nombre)) continue;
  fallos.push('`animation: ' + nombre + '` en ' + donde.join(', ')
    + ' — no hay ningún `@keyframes ' + nombre + '`. No da error: el elemento aparece sin animar.');
}

const huerfanos = [...declarados.keys()].filter(n => !usados.has(n) && !indirectos.has(n));

if (huerfanos.length) {
  console.log('  · ' + huerfanos.length + ' `@keyframes` declarado(s) y sin usar (no es un fallo; '
    + 'revisá que no sea un typo del otro lado): ' + huerfanos.join(', '));
}
if (fallos.length) {
  console.log('\n✗ check-keyframes — ' + fallos.length + ' fallo(s):');
  fallos.forEach(f => console.log('  - ' + f));
  process.exit(1);
}
console.log('✓ check-keyframes — ' + usados.size + ' animación(es) usada(s), todas con su `@keyframes` '
  + '(' + declarados.size + ' declarados en ' + archivos.length + ' archivo(s)).');
