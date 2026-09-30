#!/usr/bin/env node
/* actualizar-kit.mjs — lleva un curso a ESTA versión del kit (kit-base v1.9.102)
   ------------------------------------------------------------
   Uso (se corre desde el kit NUEVO, apuntando al curso):
     node kit-base/tools/actualizar-kit.mjs ../mi-curso            ← muestra el plan, no toca nada
     node kit-base/tools/actualizar-kit.mjs ../mi-curso --aplicar  ← lo hace
     … --aplicar --forzar   ← también pisa archivos del kit editados a mano

   POR QUÉ EXISTE. Hasta v1.9.101 actualizar un curso era copiar archivos a
   mano, y como nada registraba de qué versión venía cada uno, era
   imposible saber si una diferencia era "el curso está atrasado" o
   "alguien arregló algo acá adentro". Las dos cosas pasaban, y la segunda
   es la peor: un arreglo hecho dentro de un curso y pisado al actualizar
   se pierde sin que nadie se entere (§0.1).

   Lo que hace:
     · lee `kit-version.json` del curso (lo escribe `new-course.mjs` desde
       v1.9.102, y lo reescribe este script al terminar);
     · para cada archivo del kit (la lista es `_kit-archivos.mjs`, la misma
       que usa el generador) decide: igual, a actualizar, nuevo, quitado del
       kit, o EDITADO A MANO en el curso;
     · un archivo editado a mano FRENA todo, salvo `--forzar`: ese cambio
       probablemente es un arreglo que tiene que subir al kit (§0.1), y no
       se pisa sin que alguien lo decida;
     · respalda en `.kit-anterior/<fecha>-v<versión>/` todo lo que reemplaza
       o saca, así nunca se pierde nada;
     · y avisa de las llamadas que la plantilla nueva de `js/curso.js` hace
       en su arranque y el `curso.js` del curso no — `curso.js` es del curso
       y no se toca, pero una pieza nueva del kit que nadie llama es la
       falla de siempre: la pieza está y el cable no (§7.17).

   Un curso SIN `kit-version.json` (los anteriores a v1.9.102) se puede
   actualizar igual: como no hay registro, no se puede distinguir "atrasado"
   de "editado a mano", así que toda diferencia se trata como posible
   edición y hace falta `--forzar`. Después de esa primera vez el curso ya
   queda con su registro. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { archivosDelKit, huellaDe, versionDelKit, registroDeVersion } from './_kit-archivos.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const destino = args.find((a) => !a.startsWith('--'));
const APLICAR = args.includes('--aplicar');
const FORZAR = args.includes('--forzar');
if (!destino) {
  console.error('Uso: node tools/actualizar-kit.mjs <carpeta-del-curso> [--aplicar] [--forzar]');
  process.exit(2);
}
const CURSO = path.resolve(destino);
if (!fs.existsSync(path.join(CURSO, 'index.html'))) {
  console.error(`✗ ${CURSO} no parece un curso (no tiene index.html).`);
  process.exit(2);
}
if (path.resolve(CURSO) === KIT) {
  console.error('✗ La carpeta del curso es el propio kit.');
  process.exit(2);
}

let reg = null;
try { reg = JSON.parse(fs.readFileSync(path.join(CURSO, 'kit-version.json'), 'utf8')); } catch (e) {}
const versionNueva = versionDelKit(KIT);
const versionVieja = reg ? reg.version : null;

const nuevos = new Set(archivosDelKit(KIT));
const registrados = new Set(reg ? Object.keys(reg.archivos) : []);
const todos = [...new Set([...nuevos, ...registrados])].sort();

const plan = { igual: [], actualizar: [], agregar: [], quitar: [], editados: [], sinRegistro: [] };
for (const f of todos) {
  const enCurso = path.join(CURSO, f);
  const existe = fs.existsSync(enCurso);
  const hCurso = existe ? huellaDe(enCurso) : null;
  const hNuevo = nuevos.has(f) ? huellaDe(path.join(KIT, f)) : null;
  const hReg = reg ? reg.archivos[f] : undefined;

  if (!nuevos.has(f)) {                         // el kit nuevo ya no lo trae
    if (!existe) continue;
    if (hReg && hCurso !== hReg) plan.editados.push({ f, motivo: 'ya no está en el kit y además se editó en el curso' });
    else plan.quitar.push(f);
    continue;
  }
  if (!existe) { plan.agregar.push(f); continue; }
  if (hCurso === hNuevo) { plan.igual.push(f); continue; }
  if (!reg) { plan.sinRegistro.push(f); continue; }
  if (hReg === undefined) { plan.editados.push({ f, motivo: 'no es del kit según su registro, pero el kit nuevo lo trae' }); continue; }
  if (hCurso !== hReg) { plan.editados.push({ f, motivo: 'editado a mano en el curso' }); continue; }
  plan.actualizar.push(f);
}

/* ---- llamadas del arranque que el curso no hace ---- */
function llamadasInit(texto) {
  const sinComentarios = texto.replace(/\/\*[\s\S]*?\*\//g, '').split('\n')
    .filter((l) => !/^\s*\/\//.test(l)).join('\n');
  return new Set([...sinComentarios.matchAll(/\b(init[A-Z]\w*)\s*\(/g)].map((m) => m[1]));
}
let llamadasFaltantes = [];
try {
  const plantilla = llamadasInit(fs.readFileSync(path.join(KIT, 'js/curso.js'), 'utf8'));
  const delCurso = llamadasInit(fs.readFileSync(path.join(CURSO, 'js/curso.js'), 'utf8'));
  llamadasFaltantes = [...plantilla].filter((n) => !delCurso.has(n)).sort();
} catch (e) {}

/* ---- informe ---- */
const L = (t, xs) => { if (xs.length) console.log(`\n${t} (${xs.length}):\n  ` + xs.join('\n  ')); };
console.log(`Curso: ${CURSO}`);
console.log(`Kit del curso: ${versionVieja ? 'v' + versionVieja : 'SIN REGISTRO (curso anterior a v1.9.102)'}  →  kit nuevo: v${versionNueva}`);
console.log(`Sin cambios: ${plan.igual.length} archivo(s).`);
L('A actualizar', plan.actualizar);
L('Nuevos en el kit', plan.agregar);
L('El kit ya no los trae (se respaldan y se sacan)', plan.quitar);
L('⚠️ EDITADOS A MANO en el curso — probablemente un arreglo que tiene que subir al kit (§0.1)',
  plan.editados.map((x) => `${x.f}  (${x.motivo})`));
L('⚠️ Distintos del kit nuevo, y sin registro para saber si están atrasados o editados', plan.sinRegistro);
if (llamadasFaltantes.length) {
  console.log(`\nℹ La plantilla de js/curso.js del kit llama en su arranque a funciones que el curso no llama:\n  ` +
    llamadasFaltantes.join(', ') +
    '\n  js/curso.js es del curso y no se toca: revisá si corresponde agregarlas (una pieza nueva que nadie llama no hace nada).');
}

const bloqueantes = plan.editados.length + plan.sinRegistro.length;
if (!APLICAR) {
  console.log('\nNo se tocó nada. Para aplicarlo: agregar --aplicar' +
    (bloqueantes ? ' --forzar (hay archivos editados o sin registro; se respaldan igual)' : '') + '.');
  process.exit(0);
}
if (bloqueantes && !FORZAR) {
  console.error(`\n✗ No se aplicó: hay ${bloqueantes} archivo(s) editados o sin registro. Revisalos (y subí al kit lo que sea un arreglo);` +
    ' después, --forzar los reemplaza, respaldándolos antes.');
  process.exit(1);
}

/* ---- aplicar ---- */
const reemplazar = [...plan.actualizar, ...plan.editados.filter((x) => nuevos.has(x.f)).map((x) => x.f), ...plan.sinRegistro];
const respaldar = [...reemplazar, ...plan.quitar];
const sello = new Date().toISOString().slice(0, 10) + '-v' + (versionVieja || 'desconocida');
const dirRespaldo = path.join(CURSO, '.kit-anterior', sello);
for (const f of respaldar) {
  const d = path.join(dirRespaldo, f);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(path.join(CURSO, f), d);
}
for (const f of [...reemplazar, ...plan.agregar]) {
  const d = path.join(CURSO, f);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(path.join(KIT, f), d);
}
for (const f of plan.quitar) fs.rmSync(path.join(CURSO, f));
fs.writeFileSync(path.join(CURSO, 'kit-version.json'), JSON.stringify(registroDeVersion(KIT, CURSO), null, 2) + '\n');

console.log(`\n✓ Curso llevado a v${versionNueva}: ${reemplazar.length} reemplazado(s), ${plan.agregar.length} agregado(s), ${plan.quitar.length} sacado(s).`);
if (respaldar.length) console.log(`  Respaldo de lo reemplazado o sacado: ${path.relative(CURSO, dirRespaldo)}/`);
console.log('  Siguiente: correr la suite del curso (npm test) antes de empaquetar.');
