#!/usr/bin/env node
/* check-receta.mjs — un curso nuevo sale con la receta cableada
   (kit-base v1.9.133, §7.82)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Se armó un curso desde cero siguiendo solo la receta
   del manual (§3, "La receta") y no funcionaba sin escribir ~150 líneas:
   la plantilla de `js/curso.js` traía COMENTADOS los gates, el repaso, la
   práctica y el cierre; `coto-quiz.js` venía apagado en el marco; la
   práctica nacía como un texto sin su aviso ni su pop-up previo; y la
   locución no arrancaba por el título. Todo eso lo tenía cardio escrito
   a mano. Y Seguridad alimentaria tenía su propia copia de
   `initRepasoRapido`, que tapaba la del kit sin que nada lo dijera.

   QUÉ HACE, sin navegador:
     · lee la plantilla `js/curso.js` sin comentarios y exige las llamadas
       de la receta ACTIVAS;
     · siembra la práctica sobre un curso de esqueleto (`sembrarPractica`,
       la que usa `new-course`) y exige la diapositiva, el banco y la ficha
       `practica-intro`, y que sembrar dos veces no duplique nada;
     · exige que `new-course` emita `coto-quiz.js` y su CSS sin comentar;
     · arma un curso mínimo con `function initRepasoRapido()` propia y
       exige que `actualizar-kit` avise la copia y cierre con el plan del
       curso (v1.9.134): qué trae el kit, los avisos y los 5 pasos. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sembrarPractica } from './curso-datos.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fallos = [];
const exige = (cond, msg) => { if (!cond) fallos.push(msg); };

// 1 · La plantilla de curso.js, con la receta activa.
const plantilla = fs.readFileSync(path.join(KIT, 'js', 'curso.js'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
for (const [llamada, para] of [
  ['initPopupGate(', 'las fichas que traban (requisitos.popups)'],
  ['initVideoGate(', 'los videos que traban (requisitos.visto)'],
  ['initRepasoRapido(', 'la tira de repaso'],
  ['initMiniQuiz(', 'la mini práctica'],
  ['initCierreCelebration(', 'el cierre y su resumen'],
  ['initGateHints(', 'los avisos de lo que falta'],
  ['initShotSwap(', 'las láminas con pestañas'],
  ['initInlineCircleVideos(', 'el video en círculo'],
  ['setNarrateTitles(true)', 'que la locución arranque por el título']
]) exige(plantilla.includes(llamada), `la plantilla js/curso.js no llama a \`${llamada}\` (${para}): un curso nuevo hecho con la receta no lo tendría.`);
exige(/motor\.canAdvance\s*=/.test(plantilla), 'la plantilla js/curso.js no arma `motor.canAdvance` con los gates.');

// 2 · La práctica sembrada.
const datos = { diapositivas: [{ id: 'evaluacion', tipo: 'texto', titulo: 'Mini práctica', parrafos: ['x'] }], fichas: [] };
sembrarPractica(datos);
sembrarPractica(datos);
const ev = datos.diapositivas[0];
exige(ev.tipo === 'practica' && !ev.parrafos, 'sembrarPractica no convierte la diapositiva `evaluacion` al tipo `practica`.');
exige(/d-aviso-practica/.test(ev.aviso || ''), 'la práctica sembrada no trae el aviso "Esto no es la evaluación".');
exige(datos.practica && datos.practica.banco && datos.practica.banco.length === 3 &&
  datos.practica.banco.every((q) => q.opts.length === 3 && q.ok === 0 && q.why && q.related),
  'la práctica sembrada no trae 3 preguntas de ejemplo con 3 opciones, su explicación y la diapositiva para repasar.');
exige(datos.fichas.filter((f) => f.id === 'practica-intro').length === 1,
  'la práctica sembrada no trae UNA ficha `practica-intro` (el pop-up previo); sembrar dos veces no tiene que duplicarla.');

// 3 · new-course emite coto-quiz sin comentar.
const nc = fs.readFileSync(path.join(KIT, 'tools', 'new-course.mjs'), 'utf8');
exige(nc.includes(`'<script src="js/coto-quiz.js"></script>'`) && !nc.includes('<!-- <script src="js/coto-quiz.js"></script>'),
  'new-course deja `js/coto-quiz.js` comentado: la práctica de la receta no carga.');
exige(nc.includes(`'<link rel="stylesheet" href="css/coto-quiz.css">`) && !nc.includes('<!-- <link rel="stylesheet" href="css/coto-quiz.css">'),
  'new-course deja `css/coto-quiz.css` comentado.');
exige(/sembrarPractica\(/.test(nc), 'new-course no siembra la práctica (`sembrarPractica`).');

// 4 · actualizar-kit avisa una copia propia de una función del kit.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-receta-'));
try {
  fs.mkdirSync(path.join(tmp, 'js'));
  fs.mkdirSync(path.join(tmp, 'css'));
  fs.writeFileSync(path.join(tmp, 'index.html'), '<!doctype html><html><head><title>x</title></head><body><script src="js/curso.js"></script></body></html>\n');
  fs.writeFileSync(path.join(tmp, 'js', 'curso.js'), '(function () {\n  function initRepasoRapido() { return 1; }\n  initRepasoRapido();\n})();\n');
  let salida = '';
  try { salida = execFileSync(process.execPath, [path.join(KIT, 'tools', 'actualizar-kit.mjs'), tmp], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { salida = (e.stdout || '') + (e.stderr || ''); }
  exige(/propia copia/.test(salida) && /initRepasoRapido/.test(salida),
    'actualizar-kit no avisa que js/curso.js tiene su propia copia de `initRepasoRapido` (la copia tapa la del kit).');
  /* 5 · El plan del curso (v1.9.134): lo arma actualizar-kit, no una
     ficha escrita a mano que se desactualiza o se confunde de curso. */
  const tests = fs.readdirSync(path.join(KIT, 'tools', 'tests')).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).length;
  const planCurso = salida.slice(salida.indexOf('══ Plan para este curso'));
  exige(salida.includes('══ Plan para este curso'), 'actualizar-kit no imprime el "Plan para este curso" al final del informe.');
  exige(/Qué trae el kit desde la versión del curso/.test(planCurso), 'el plan no dice qué trae el kit desde la versión del curso.');
  exige((planCurso.match(/^\s+\d\. /gm) || []).length === 5, 'el plan no trae los 5 pasos (aplicar, avisos, suite, editor en vivo, relevo).');
  exige(planCurso.includes(`(${tests} tests,`), `el plan no pide la cantidad real de tests (${tests}).`);
  exige(/Resolver los \d+ aviso/.test(planCurso), 'el plan no cuenta los avisos ⚠️ que hay que resolver.');
} finally { fs.rmSync(tmp, { recursive: true, force: true }); }

if (fallos.length) {
  console.error(`✗ check-receta — ${fallos.length} fallo(s):\n  - ` + fallos.join('\n  - '));
  process.exit(1);
}
console.log('✓ check-receta — la plantilla trae la receta cableada, la práctica se siembra entera y actualizar-kit avisa las copias del kit.');
