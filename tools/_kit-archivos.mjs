/* _kit-archivos.mjs — qué archivos de un curso son DEL KIT (kit-base v1.9.102)
   ------------------------------------------------------------
   Una sola lista, que usan los tres que la necesitan:
     · `new-course.mjs`   — al crear un curso, anota la huella de cada uno
                            en `kit-version.json`;
     · `actualizar-kit.mjs` — al llevar un curso a otra versión, sabe qué
                            reemplazar y qué no tocar nunca;
     · `tests/kit-intacto.mjs` — avisa si alguno se editó a mano.

   POR QUÉ EXISTE. Hasta v1.9.101 cada curso se llevaba una COPIA del kit
   y nada registraba de qué versión era. El costo, medido en las rondas de
   §7.43 a §7.50: casi todos los relevos llegaron escritos contra un kit
   más viejo, en cuatro de ellos copiar los archivos "completos" habría
   borrado arreglos, y el curso modelo estaba atrás del kit en 5 de 7
   archivos compartidos sin que nadie lo supiera (§7.48).

   ⚠️ Si mañana `new-course.mjs` empieza a copiar un archivo más, se agrega
   ACÁ. `new-course.mjs` verifica al final que todo lo de esta lista haya
   llegado al curso, así que una lista desactualizada falla al generar,
   no seis meses después.

   Lo que NO es del kit, aunque lo cree el generador: `index.html`,
   `js/curso.js`, `css/assets.css`, `css/diapositivas.css`,
   `css/pulido.css`, `imsmanifest.xml`, `README-CURSO.md` y el ícono de
   la categoría. Son el curso: se escriben una vez y se editan a mano. */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/* Carpetas que viajan enteras, con lo que se excluye de cada una. */
const CARPETAS = {
  css: (n) => !['assets.css', 'diapositivas.css', 'pulido.css'].includes(n),
  js: (n) => n !== 'curso.js' && n !== 'escenario-boilerplate.js',
  fonts: () => true,
  img: () => true,       // solo lo que trae el kit: el ícono de categoría lo escribe el generador
  tools: () => true
};
const SUELTOS = [
  'header-boilerplate.html', 'spec-motor-slides.md', 'minijuego-boilerplate.html',
  'PROMPT-CURSO-NUEVO.md', 'MANUAL-DEL-MOLDE.md', 'package.json', 'package-lock.json'
];
/* `__pycache__`/`.pyc`: los deja Python al correr `build-zip.py`, y se
   colaban en la lista (y en la rama de git) como si fueran del kit.
   `.kit-anterior`: los respaldos que deja `actualizar-kit.mjs`. */
const IGNORAR = /(^|\/)(node_modules|\.git|\.DS_Store|Thumbs\.db|__pycache__|\.kit-anterior)(\/|$)|\.pyc$/;

function recorrer(raiz, rel, filtroRaiz, salida) {
  const abs = path.join(raiz, rel);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const r = rel + '/' + e.name;
    if (IGNORAR.test(r)) continue;
    if (filtroRaiz && !filtroRaiz(e.name)) continue;
    if (e.isDirectory()) recorrer(raiz, r, null, salida);
    else salida.push(r);
  }
}

/* Lista de rutas relativas (con `/`), ordenada, de los archivos del kit
   que viajan a un curso. Se calcula sobre el KIT, no sobre el curso. */
export function archivosDelKit(kitRoot) {
  const salida = [];
  for (const [dir, filtro] of Object.entries(CARPETAS)) recorrer(kitRoot, dir, filtro, salida);
  for (const f of SUELTOS) if (fs.existsSync(path.join(kitRoot, f))) salida.push(f);
  return salida.sort();
}

export function huellaDe(archivo) {
  return crypto.createHash('sha256').update(fs.readFileSync(archivo)).digest('hex').slice(0, 16);
}

export function versionDelKit(kitRoot) {
  return JSON.parse(fs.readFileSync(path.join(kitRoot, 'package.json'), 'utf8')).version;
}

/* El contenido de `kit-version.json` para una carpeta que ya tiene esos
   archivos copiados. */
export function registroDeVersion(kitRoot, destino) {
  const archivos = {};
  for (const f of archivosDelKit(kitRoot)) {
    const abs = path.join(destino, f);
    if (fs.existsSync(abs)) archivos[f] = huellaDe(abs);
  }
  return { version: versionDelKit(kitRoot), actualizado: new Date().toISOString().slice(0, 10), archivos };
}
