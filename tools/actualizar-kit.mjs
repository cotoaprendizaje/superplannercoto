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
const TODAS = args.includes('--todas');   // v1.9.135: listar TODAS las reglas que pisan al kit
if (!destino) {
  console.error('Uso: node tools/actualizar-kit.mjs <carpeta-del-curso> [--aplicar] [--forzar] [--todas]');
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

/* ---- Narración DOBLE: el riesgo de actualizar un curso anterior a v1.9.71 ----
   (kit-base v1.9.107). Desde v1.9.71 `initPlayer()` narra cada
   diapositiva solo, con el `speakSlide` que recibe. Un curso armado
   antes tenía su PROPIO `slidechange` → `speakSlide(...)`; al ponerlo al
   día quedan los dos y cada diapositiva arranca con dos locuciones
   encimadas. MEDIDO en "Uso de Sucursales 3 - NOA" (`locucion-control`).
   El arreglo es del curso —sacar esa línea, o pasarle
   `speakOnSlideChange: false` a `initPlayer`—, así que acá solo se
   avisa, con la línea. Es una heurística: busca la llamada dentro de
   las 15 líneas siguientes a cada `addEventListener('slidechange'`. */
let narracionDoble = [];
try {
  /* Los comentarios de bloque se blanquean conservando los saltos de
     línea (así los números de línea siguen valiendo). Sin esto avisaba
     en "Seguridad alimentaria", que tiene `speakSlide()` dentro de un
     comentario que explica justamente por qué NO llamarla ahí. */
  const lineas = fs.readFileSync(path.join(CURSO, 'js/curso.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' ')).split('\n');
  const apagada = lineas.some((l) => /speakOnSlideChange\s*:\s*false/.test(l) && !/^\s*\/\//.test(l));
  if (!apagada) {
    lineas.forEach((l, i) => {
      if (!/addEventListener\(\s*['"]slidechange['"]/.test(l) || /^\s*\/\//.test(l)) return;
      for (let j = i; j < Math.min(lineas.length, i + 15); j++) {
        if (/^\s*\/\//.test(lineas[j])) continue;
        if (/\bspeakSlide\s*\(/.test(lineas[j])) { narracionDoble.push(j + 1); break; }
        if (j > i && /^\s*\}\s*\)\s*;/.test(lineas[j])) break;
      }
    });
  }
} catch (e) {}

/* ---- `onFinish` de la mini práctica cambió de momento (kit-base v1.9.107) ----
   Ahora corre al CONTESTAR LA ÚLTIMA pregunta (la práctica está completa
   aunque el alumno no pulse "Ver resultado"), cuando la pantalla de
   resultado todavía no existe. Un curso que la decoraba desde `onFinish`
   —"Pedidos de PLU set": veredicto y logro "Aprobado" sobre
   `.d-quiz-result`— se queda sin las dos cosas. El gancho para eso es
   `onResult`. Se avisa si el curso toca `.d-quiz-result` y no usa
   `onResult`. */
let decoraResultado = false;
try {
  const codigo = fs.readFileSync(path.join(CURSO, 'js/curso.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  decoraResultado = /d-quiz-result/.test(codigo) && !/\bonResult\s*:/.test(codigo);
} catch (e) {}

/* ---- Lo que el kit nuevo pide y el plan no avisaba (kit-base v1.9.120) ----
   Relevo de "Seguridad de la información", 2026-10-06, que venía de
   v1.9.71: tres cosas se descubrieron mirando o por un test que reventó,
   no por este plan. (1) `initVideoPlayer` necesita el bloque
   `#d-video-player`, que vive en `index-boilerplate.html` —no en el
   header—: sin él fallaban `popup-video-medida` y `reproductor-video`.
   (2) Las tiras V/F perdieron su ✓/✕: el kit exige `.d-repaso-btns--vf`
   (y `--col` para las de opción múltiple). (3) Tests del curso con el
   mismo nombre que uno del kit: `--forzar` los pisa con el genérico, y
   `puntaje-maximo` perdió así los asserts propios del curso, en silencio. */
const avisosMarcado = [];
try {
  const fuentes = ['index.html', 'marco.html', 'curso.json'].map((f) => path.join(CURSO, f)).filter((f) => fs.existsSync(f))
    .map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const codigo = fs.readFileSync(path.join(CURSO, 'js/curso.js'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const vaAVP = /\binitVideoPlayer\s*\(/.test(codigo) || llamadasFaltantes.some((x) => /initVideoPlayer/.test(x));
  if (vaAVP && !/id=\\?["']d-video-player\\?["']/.test(fuentes)) {
    avisosMarcado.push('js/curso.js llama (o tiene que llamar) a `initVideoPlayer()` y el index no tiene el pop-up `#d-video-player`: copiarlo de' +
      '\n  `index-boilerplate.html` del kit (no está en el header). Sin él, el reproductor no tiene dónde abrirse.');
  }
  const sinModo = (fuentes.match(/class=\\?["']d-repaso-btns\\?["']/g) || []).length;
  if (sinModo) {
    avisosMarcado.push(`${sinModo} tira(s) de repaso con \`class="d-repaso-btns"\` a secas: el kit pide \`d-repaso-btns--vf\`` +
      '\n  (Verdadero/Falso, con su ✓/✕) o `d-repaso-btns--col` (opción múltiple). Sin el modificador se pierden los íconos.');
  }
  /* Una copia propia de una función del kit (kit-base v1.9.133): el
     `curso.js` declara `function initRepasoRapido()` adentro de su IIFE y
     esa copia TAPA la del kit, así que el curso se queda con la versión
     de cuando se copió y nunca recibe lo que el kit le suma después.
     Seguridad alimentaria tenía su `initRepasoRapido` y por eso no tenía
     "↺ Reintentar" (`repaso-reintentar` en rojo desde v1.9.125). Se
     listan las públicas del kit (`global.X = X`) con el mismo nombre. */
  {
    const delKit = new Set();
    for (const f of fs.readdirSync(path.join(KIT, 'js')).filter((x) => x.endsWith('.js') && x !== 'curso.js')) {
      for (const m of fs.readFileSync(path.join(KIT, 'js', f), 'utf8').matchAll(/\bglobal\.(\w+)\s*=\s*\1\b/g)) delKit.add(m[1]);
    }
    const copias = [...new Set([...codigo.matchAll(/\bfunction\s+(\w+)\s*\(/g)].map((m) => m[1]).filter((n) => delKit.has(n)))];
    if (copias.length) {
      avisosMarcado.push(`js/curso.js tiene su propia copia de ${copias.length === 1 ? 'una función' : copias.length + ' funciones'} del kit: ` +
        copias.map((n) => '`' + n + '`').join(', ') + '.' +
        '\n  La copia tapa a la del kit y el curso no recibe lo que el kit le sume después. Pasar a la del kit' +
        '\n  con sus opciones (`seen`, `markSeen`…) y borrar la copia; si la copia hace algo que el kit no, subirlo al kit.');
    }
  }
  /* Un módulo del kit que el marco no carga (v1.9.135, relevo SA K3): el
     aviso ⚠️ de arriba pide pasar a `initLogros`/`initMinijuego`, y el
     curso que no los usaba tampoco cargaba `coto-logros.js` ni
     `coto-minijuego.js`: arrancó con `ReferenceError: initLogros is not
     defined` y el HUD muerto. Se cruza lo que llaman el curso y la
     plantilla con los `<script>` del marco. */
  {
    const deArchivo = new Map();
    for (const f of fs.readdirSync(path.join(KIT, 'js')).filter((x) => x.endsWith('.js') && x !== 'curso.js')) {
      for (const m of fs.readFileSync(path.join(KIT, 'js', f), 'utf8').matchAll(/\bglobal\.(\w+)\s*=\s*\1\b/g)) if (!deArchivo.has(m[1])) deArchivo.set(m[1], 'js/' + f);
    }
    const marcoF = ['marco.html', 'index.html'].map((f) => path.join(CURSO, f)).find((f) => fs.existsSync(f));
    if (marcoF) {
      const cargados = new Set([...fs.readFileSync(marcoF, 'utf8').replace(/<!--[\s\S]*?-->/g, '').matchAll(/<script[^>]*\ssrc="([^"?#]+)/g)].map((m) => m[1]));
      const propias = new Set([...codigo.matchAll(/\bfunction\s+(\w+)\s*\(/g)].map((m) => m[1]));
      const llamadas = (txt) => new Set([...txt.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '').matchAll(/(?<![\w.])(\w+)\s*\(/g)].map((m) => m[1]));
      const delCurso = llamadas(codigo);
      let plantilla = new Set(), txtPlantilla = '';
      try { txtPlantilla = fs.readFileSync(path.join(KIT, 'js', 'curso.js'), 'utf8'); plantilla = llamadas(txtPlantilla); } catch (e) {}
      /* Lo que se llama con guarda (`window.initMiniQuiz ? … : …`) no rompe
         si el módulo falta: el curso sin práctica no tiene por qué cargarlo. */
      const conGuarda = (n) => new RegExp('window\\.' + n + '\\b').test(codigo) || (!delCurso.has(n) && new RegExp('window\\.' + n + '\\b').test(txtPlantilla));
      const faltan = new Map();
      for (const n of new Set([...delCurso, ...plantilla])) {
        const f = deArchivo.get(n);
        if (!f || propias.has(n) || cargados.has(f) || conGuarda(n)) continue;
        if (!faltan.has(f)) faltan.set(f, { usa: [], pide: [] });
        (delCurso.has(n) ? faltan.get(f).usa : faltan.get(f).pide).push(n);
      }
      if (faltan.size) {
        avisosMarcado.push(`${path.basename(marcoF)} no carga ${faltan.size === 1 ? 'un módulo' : faltan.size + ' módulos'} del kit que el curso usa o que la plantilla pide:` +
          [...faltan].map(([f, x]) => `\n    · ${f} — ` + (x.usa.length ? 'el curso llama a ' + x.usa.map((n) => '`' + n + '`').join(', ') + (x.pide.length ? '; ' : '') : '') +
            (x.pide.length ? 'la plantilla llama a ' + x.pide.map((n) => '`' + n + '`').join(', ') : '')).join('') +
          `\n  Sumar su <script src="…"> al marco, antes de js/curso.js (en el orden de la plantilla). Sin eso, pasar a esas funciones` +
          '\n  deja el curso con `ReferenceError` y el HUD muerto.');
      }
    }
  }
  /* El aviso "Girá tu dispositivo" viejo, sin salida (v1.9.122, §7.71):
     el marcado de antes no tenía el botón `data-rotate-seguir`, y en un
     iPad vertical con el giro bloqueado el curso quedaba TAPADO. Es
     marcado, así que actualizar no lo arregla. Lo relevó NOA. */
  if (/d-rotate-notice/.test(fuentes) && !/data-rotate-seguir/.test(fuentes)) {
    avisosMarcado.push('el aviso "Girá tu dispositivo" (`.d-rotate-notice`) no tiene el botón `data-rotate-seguir`' +
      '\n  ("Ver igual, en vertical"): con el giro bloqueado, el iPad vertical queda tapado sin salida. Copiar el' +
      '\n  bloque de `index-boilerplate.html`.');
  }
  /* Restaurar logros filtrando por `BADGES` (v1.9.125, §7.74): desde el
     rediseño, un logro del kit va en el catálogo como TEXTO ("explorador"),
     sin `.id`, y ese filtro lo pierde al recargar. Lo tenía cardio. */
  if (/BADGES\.map\(\s*function\s*\(\s*\w+\s*\)\s*\{\s*return\s+\w+\.id;?\s*\}\s*\)/.test(codigo) && /Logros\.restore\s*\(/.test(codigo)) {
    avisosMarcado.push('js/curso.js filtra los logros a restaurar con `BADGES.map(… .id)`: los logros del kit van en el' +
      '\n  catálogo como texto ("punteria", "explorador"…) y sin `.id`, así que se perderían al recargar. Usar' +
      '\n  `Logros.catalogo().map(…)` (ya los trae expandidos) y pasarle también `lg: s.lg` a `Logros.restore`.');
  }
  /* El instructivo v3 achicado desde el CSS del curso (v1.9.126, §7.75):
     con el v4 del kit, un `width` propio en `.d-instr-modal` lo deja
     angosto y con el contenido scrolleando. Lo tenía cardio. */
  for (const d of ['css']) {
    const dir = path.join(CURSO, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.css') && !nuevos.has(d + '/' + x))) {
      const css = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
      if (/\.d-instr-modal\s*\{[^}]*\bwidth\s*:/.test(css)) {
        avisosMarcado.push(`css/${f} le pone ancho a \`.d-instr-modal\` (era para el instructivo v3): con el v4 del kit` +
          '\n  queda angosto y scrolleando. Sacar ese bloque; el kit ya trae el tamaño.');
      }
      /* La tira de repaso copiada al CSS del curso antes del rediseño
         (v1.9.127, §7.77): sus reglas sueltas le ganan a las del kit y
         el título queda azul sobre la barra azul, sin leerse. Lo tenía
         Seguridad alimentaria. Solo las reglas SUELTAS: una acotada a una
         variante propia (`.d-repaso--factor .d-repaso-title`, cardio) es
         del curso y está bien. */
      if (/(^|\})\s*\.d-repaso-title\s*\{/.test(css) || /(^|\})\s*\.d-repaso-btns\s+button\s*\{/.test(css)) {
        avisosMarcado.push(`css/${f} trae su propia copia de la tira de repaso (\`.d-repaso-title\`, \`.d-repaso-btns button\`…),` +
          '\n  anterior al rediseño: le gana al kit (el título no se lee sobre la barra azul, botones chicos). Sacar' +
          '\n  ese bloque y volver a medir el alto (`data-h`) de cada tira: la contestada del kit es más alta.');
      }
    }
  }
  /* Reglas del CSS propio del curso que redefinen un selector del kit
     (kit-base v1.9.130, §7.79). Cargan después del kit, así que le ganan:
     la pieza queda con el aspecto de cuando se copió, no con el del kit.
     Cardio tenía 50 (los avisos flotantes salían todos azul oscuro, la
     impresión del resumen entera duplicada). Se listan para revisar: si es
     un resto, se saca; si es diseño que vale para todos, sube al kit. */
  {
    const reglas = (css) => {
      const out = [];
      const t = css.replace(/\/\*[\s\S]*?\*\//g, '');
      let ctx = [], tok = '';
      for (const ch of t) {
        if (ch === '{') { ctx.push(tok.trim()); tok = ''; }
        else if (ch === '}') {
          const sel = ctx.pop();
          if (sel && !sel.startsWith('@') && tok.trim()) {
            const media = ctx.filter((c) => c.startsWith('@')).join(' ').replace(/\s+/g, ' ');
            /* La declaración, normalizada (v1.9.135, relevo SA K4): para
               separar las reglas IDÉNTICAS a las del kit —un resto que se
               borra sin cambiar nada— de las que de verdad lo cambian. */
            const decl = tok.split(';').map((d) => d.trim().replace(/\s*:\s*/, ':').replace(/\s+/g, ' ')).filter(Boolean).sort().join(';');
            for (const x of sel.split(',')) { const n = x.trim().replace(/\s+/g, ' '); if (n && !/^(from|to|\d+%)$/.test(n)) out.push({ k: media + '|' + n, decl }); }
          }
          tok = '';
        } else tok += ch;
      }
      return out;
    };
    const delKit = new Map();
    for (const f of fs.readdirSync(path.join(KIT, 'css')).filter((x) => x.endsWith('.css'))) {
      reglas(fs.readFileSync(path.join(KIT, 'css', f), 'utf8')).forEach((r) => { if (!delKit.has(r.k)) delKit.set(r.k, new Set()); delKit.get(r.k).add(r.decl); });
    }
    const pisan = [], iguales = [];
    const dirCss = path.join(CURSO, 'css');
    if (fs.existsSync(dirCss)) {
      for (const f of fs.readdirSync(dirCss).filter((x) => x.endsWith('.css') && !fs.existsSync(path.join(KIT, 'css', x)))) {
        const vistas = new Set();
        for (const r of reglas(fs.readFileSync(path.join(dirCss, f), 'utf8'))) {
          if (!delKit.has(r.k) || vistas.has(r.k + '{' + r.decl)) continue;
          vistas.add(r.k + '{' + r.decl);
          (delKit.get(r.k).has(r.decl) ? iguales : pisan).push(`css/${f}: ${r.k.replace(/^\|/, '')}`);
        }
      }
    }
    if (pisan.length || iguales.length) {
      const lista = (xs, n) => (TODAS ? xs : xs.slice(0, n)).map((x) => '\n    · ' + x).join('') +
        (!TODAS && xs.length > n ? `\n    · … y ${xs.length - n} más (\`--todas\` las lista todas)` : '');
      avisosMarcado.push(`${pisan.length + iguales.length} regla(s) del CSS propio del curso redefinen piezas del kit y le ganan (cargan después).` +
        (iguales.length ? `\n  ${iguales.length} son IDÉNTICAS a la del kit, declaración por declaración: restos que se borran sin cambiar nada:` + lista(iguales, 5) : '') +
        (pisan.length ? `\n  ${pisan.length} lo CAMBIAN:` + lista(pisan, 8) +
          '\n  Revisar cada una: si es un resto, sacarla; si es diseño que vale para todos los cursos, subirlo al kit (§7.79).' : ''));
    }
  }
} catch (e) {}
const testsPropios = plan.sinRegistro.filter((f) => /^tools\/tests\/[^_][^/]*\.mjs$/.test(f));

/* ---- un curso armado desde datos con el index editado a mano (v1.9.111) ----
   Si el curso tiene `curso.json` + `marco.html`, su `index.html` es un
   archivo GENERADO (`armar-curso.mjs`). Un cambio hecho directo en el
   index se pierde la próxima vez que alguien lo arme. Se avisa si el index
   que hay no es el que sale de los datos. */
let indexDesviado = null;
if (fs.existsSync(path.join(CURSO, 'curso.json')) && fs.existsSync(path.join(CURSO, 'marco.html'))) {
  try {
    const { armarIndex } = await import('./curso-datos.mjs');
    const armado = armarIndex(JSON.parse(fs.readFileSync(path.join(CURSO, 'curso.json'), 'utf8')),
      fs.readFileSync(path.join(CURSO, 'marco.html'), 'utf8'));
    const actual = fs.existsSync(path.join(CURSO, 'index.html')) ? fs.readFileSync(path.join(CURSO, 'index.html'), 'utf8') : '';
    if (armado !== actual) indexDesviado = 'el index.html no es el que sale de curso.json + marco.html';
  } catch (e) {
    indexDesviado = 'curso.json o marco.html no se pueden armar (' + e.message + ')';
  }
}

/* ---- el marcado del kit que vive en el HTML del curso (v1.9.125, §7.74) ----
   Los CSS y JS se reemplazan arriba; los títulos de los paneles, el
   instructivo, el aviso de la práctica y el sprite están ESCRITOS en el
   curso. `_migrar-marcado.mjs` cambia solo lo que reconoce como escrito por
   el kit anterior (lo propio del curso no coincide y no se toca). En un
   curso armado desde datos se migra el marco (y los títulos del repaso
   dentro de curso.json) y el index se vuelve a ARMAR; si el index ya
   estaba desviado de los datos, se migra también él, para no perder lo
   que alguien le haya hecho a mano. */
const { migrarMarcado, migrarDatosCurso } = await import('./_migrar-marcado.mjs');
const desdeDatos = fs.existsSync(path.join(CURSO, 'curso.json')) && fs.existsSync(path.join(CURSO, 'marco.html'));
const migraciones = [];   // { f, texto, cambios }
for (const f of desdeDatos ? ['marco.html', 'curso.json', ...(indexDesviado ? ['index.html'] : [])] : ['index.html']) {
  const p = path.join(CURSO, f);
  if (!fs.existsSync(p)) continue;
  const antes = fs.readFileSync(p, 'utf8');
  let r;
  if (f === 'curso.json') { const t = migrarDatosCurso(antes, KIT); r = { html: t.texto, cambios: t.cambios }; }
  else r = migrarMarcado(antes, KIT);
  if (r.cambios.length) migraciones.push({ f, texto: r.html, cambios: r.cambios });
}

/* ---- informe ---- */
/* Se cuentan los avisos ⚠️ que salen, para el plan del final. */
let avisosImpresos = 0;
const logOriginal = console.log;
console.log = (...xs) => { if (/^\s*⚠️/.test(String(xs[0]))) avisosImpresos++; logOriginal(...xs); };
const L = (t, xs) => { if (xs.length) console.log(`\n${t} (${xs.length}):\n  ` + xs.join('\n  ')); };

/* ---- El plan para este curso (kit-base v1.9.134, §7.83) ----
   Hasta v1.9.133 el plan de cada curso se escribía a mano en su ficha, y
   se desactualizaba o se confundía: un chat recibió el mensaje de OTRO
   curso, y todas las fichas pedían "68 tests" cuando eran 72. Lo arma el
   kit: qué cambió desde la versión del curso (los títulos del historial
   del README del kit), cuántos avisos hay que resolver y los pasos hasta
   entregar, con los comandos escritos para ESTE curso. */
function planDelCurso(yaAplicado) {
  const num = (v) => (v || '0.0.0').split('.').map(Number);
  const mayor = (a, b) => { const x = num(a), y = num(b); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; };
  let versiones = [];
  try {
    versiones = [...fs.readFileSync(path.join(KIT, 'README.md'), 'utf8').matchAll(/^### v(\d+\.\d+\.\d+) — (.+)$/gm)]
      .map((m) => ({ v: m[1], t: m[2].trim() }))
      .filter((x) => !versionVieja || mayor(x.v, versionVieja))
      .sort((x, y) => (mayor(x.v, y.v) ? 1 : mayor(y.v, x.v) ? -1 : 0));
  } catch (e) { versiones = []; }
  const rel = (p) => { const r = path.relative(process.cwd(), p); return r.startsWith('..' + path.sep + '..') ? p : (r || '.'); };
  const kit = rel(KIT), curso = rel(CURSO);
  const tests = fs.readdirSync(path.join(KIT, 'tools', 'tests')).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).length;
  logOriginal(`\n══ Plan para este curso: v${versionVieja || '(sin registro)'} → v${versionNueva} ══`);
  if (versiones.length) {
    const mostrar = versiones.length > 15 ? versiones.slice(-15) : versiones;
    logOriginal(`Qué trae el kit desde la versión del curso (${versiones.length} versión(es); el detalle, en ${kit}/README.md):` +
      (versiones.length > mostrar.length ? `\n  … ${versiones.length - mostrar.length} anteriores` : '') +
      mostrar.map((x) => `\n  v${x.v} — ${x.t}`).join(''));
  } else logOriginal('El curso ya está en la versión del kit: no hay cambios del kit que traer.');
  const pasos = [];
  if (!yaAplicado) pasos.push(`Aplicar: node ${kit}/tools/actualizar-kit.mjs ${curso} --aplicar` +
    (plan.editados.length + plan.sinRegistro.length ? ' --forzar (respalda lo editado o sin registro)' : ''));
  pasos.push(avisosImpresos
    ? `Resolver los ${avisosImpresos} aviso(s) ⚠️ de arriba: lo del js/curso.js y el CSS propio del curso lo cambia el curso; lo que sirva a todos, al relevo.`
    : 'No hay avisos ⚠️ que resolver.');
  pasos.push(`Suite completa con el curso servido: node ${kit}/tools/run-tests.mjs http://localhost:<puerto>/index.html (${tests} tests, todos en verde).`);
  pasos.push(`Editor en vivo: node ${kit}/tools/vista-editor.mjs ${curso} <carpeta-temporal>/vista, publicarla y recorrer el curso entero` +
    ` comparándolo con cardio (${kit}/curso-prueba, la receta del MANUAL-DEL-MOLDE.md).`);
  pasos.push(`Relevo y entrega: node ${kit}/tools/revisar-curso.mjs ${curso}, completar "Relevo al kit" en README-CURSO.md y` +
    ' armar los zips con build-zip.py: devolver los DOS (el del curso y el del relevo).');
  logOriginal('Pasos:' + pasos.map((x, i) => `\n  ${i + 1}. ${x}`).join(''));
}
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

if (narracionDoble.length) {
  console.log(`\n⚠️ js/curso.js narra la diapositiva en su propio \`slidechange\` (línea ${narracionDoble.join(', ')}),` +
    '\n  y desde v1.9.71 `initPlayer()` ya lo hace solo: actualizado, cada diapositiva arranca con DOS' +
    '\n  locuciones encimadas. Sacar esa llamada a `speakSlide`, o pasarle `speakOnSlideChange: false`' +
    '\n  a `initPlayer`. (js/curso.js es del curso: no se toca.)');
}

if (decoraResultado) {
  console.log('\n⚠️ js/curso.js decora la pantalla de resultado de la mini práctica (`.d-quiz-result`), y' +
    '\n  desde v1.9.107 `onFinish` corre al contestar la última pregunta, ANTES de que esa pantalla' +
    '\n  exista. Pasar lo que pinta el resultado (y lo que se otorga ahí) a `onResult`, que recibe la' +
    '\n  caja ya dibujada. `onFinish` queda para lo que significa "práctica completa".');
}

if (indexDesviado) {
  console.log(`\n⚠️ Este curso se arma desde datos, y ${indexDesviado}.` +
    '\n  Si alguien editó el index a mano, ese cambio se pierde la próxima vez que se arme: pasarlo a' +
    '\n  curso.json (o al marco) y volver a armar con `node tools/armar-curso.mjs <curso>`. Si lo que' +
    '\n  cambió son los datos y nadie armó todavía, alcanza con armar.');
}

if (migraciones.length) {
  console.log('\nMarcado del kit a actualizar en el HTML del curso (lo propio del curso no se toca):');
  migraciones.forEach((m) => console.log(`  ${m.f}:\n    · ` + m.cambios.join('\n    · ')));
  if (desdeDatos && !indexDesviado) console.log('  index.html: se vuelve a armar desde curso.json + marco.html.');
}
avisosMarcado.forEach((a) => console.log('\n⚠️ ' + a));
if (testsPropios.length) {
  console.log(`\n⚠️ ${testsPropios.length} test(s) del curso se llaman igual que uno del kit: ${testsPropios.join(', ')}.` +
    '\n  `--forzar` los reemplaza por el genérico. Si alguno tenía asserts PROPIOS del curso, copialo antes con otro' +
    '\n  nombre (por ejemplo `tools/tests/puntaje-curso.mjs`): si no, se pierden sin aviso.');
}

const bloqueantes = plan.editados.length + plan.sinRegistro.length;
if (!APLICAR) {
  console.log('\nNo se tocó nada. Para aplicarlo: agregar --aplicar' +
    (bloqueantes ? ' --forzar (hay archivos editados o sin registro; se respaldan igual)' : '') + '.');
  planDelCurso(false);
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
/* `partio` e `historial` (v1.9.135, relevo SA K17): el registro pasa a
   decir la versión NUEVA, y `build-zip` encabezaba el relevo con "Kit del
   que partió: v1.9.133" en un curso que había partido de v1.9.117. */
{
  const nuevo = registroDeVersion(KIT, CURSO);
  nuevo.partio = (reg && reg.partio) || versionVieja || null;
  nuevo.historial = [...((reg && reg.historial) || []), { de: versionVieja || null, a: nuevo.version, fecha: nuevo.actualizado }];
  fs.writeFileSync(path.join(CURSO, 'kit-version.json'), JSON.stringify(nuevo, null, 2) + '\n');
}

/* El marcado (ver arriba), con su respaldo junto al de los archivos. */
for (const m of migraciones) {
  const d = path.join(dirRespaldo, m.f);
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(path.join(CURSO, m.f), d);
  fs.writeFileSync(path.join(CURSO, m.f), m.texto);
}
if (migraciones.length && desdeDatos && !indexDesviado) {
  const { armarIndex } = await import('./curso-datos.mjs');
  const ix = path.join(CURSO, 'index.html');
  const d = path.join(dirRespaldo, 'index.html');
  fs.mkdirSync(path.dirname(d), { recursive: true });
  if (fs.existsSync(ix)) fs.copyFileSync(ix, d);
  fs.writeFileSync(ix, armarIndex(JSON.parse(fs.readFileSync(path.join(CURSO, 'curso.json'), 'utf8')),
    fs.readFileSync(path.join(CURSO, 'marco.html'), 'utf8')));
}
if (migraciones.length) console.log(`  Marcado del kit: ${migraciones.map((m) => m.f + ' (' + m.cambios.length + ')').join(', ')}` +
  (desdeDatos && !indexDesviado ? ' · index.html vuelto a armar' : '') + '.');

/* ---- El manifiesto acompaña al kit (kit-base v1.9.117) ----
   Relevo de "Prevención cardiovascular", 2026-10-05: después de actualizar,
   `check-manifest` daba ROJO por 7 módulos nuevos del kit (coto-piezas,
   coto-visor…) que se copiaron al curso y el `imsmanifest.xml` no
   declaraba; y sacarlos del paquete ponía en rojo `kit-intacto`, que los
   exige. Las dos herramientas tiraban para lados opuestos.
   La convención del kit es que el manifiesto enumera TODO lo servido
   (check-manifest, v1.9.95), así que se cumple acá: todo archivo DEL KIT
   que está en una carpeta servida y no figura, se declara; lo que el kit
   sacó, se quita. Los archivos propios del curso no se tocan: si falta
   uno, lo sigue marcando `check-manifest`. */
const SERVIDAS = /^(css|js|img|fonts|video|doc|audio)\//;
const manifiestoPath = path.join(CURSO, 'imsmanifest.xml');
if (fs.existsSync(manifiestoPath)) {
  let xml = fs.readFileSync(manifiestoPath, 'utf8');
  const declarados = new Set(Array.from(xml.matchAll(/<file\s+href="([^"]+)"/g)).map((m) => decodeURIComponent(m[1])));
  const sumar = [...nuevos].filter((f) => SERVIDAS.test(f) && fs.existsSync(path.join(CURSO, f)) && !declarados.has(f)).sort();
  const sacar = plan.quitar.filter((f) => declarados.has(f));
  for (const f of sacar) xml = xml.replace(new RegExp('[ \\t]*<file\\s+href="' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '"\\s*/>\\r?\\n?'), '');
  if (sumar.length) {
    const cierre = xml.indexOf('</resource>');
    if (cierre >= 0) {
      const sangria = (xml.match(/\n([ \t]*)<file\s/) || [, '      '])[1];
      xml = xml.slice(0, cierre).replace(/[ \t]*$/, '') + sumar.map((f) => `${sangria}<file href="${f}"/>\n`).join('') +
        xml.slice(cierre).replace(/^/, (xml.slice(0, cierre).match(/\n([ \t]*)$/) || [, '    '])[1]);
    }
  }
  if (sumar.length || sacar.length) {
    fs.writeFileSync(manifiestoPath, xml);
    console.log(`  imsmanifest.xml: ${sumar.length} archivo(s) del kit declarado(s), ${sacar.length} quitado(s).`);
  }
}

/* Y los archivos PROPIOS del curso que el manifiesto no declara
   (v1.9.120): no se tocan —el manifiesto del curso es del curso—, pero se
   avisan. "Seguridad de la información" no declaraba ninguno (62: sus
   CSS, curso.js, imágenes, PDF y videos) desde que se generó; Moodle no lo
   nota porque descomprime todo, y un LMS estricto lo serviría roto. */
if (fs.existsSync(manifiestoPath)) {
  const declarados = new Set(Array.from(fs.readFileSync(manifiestoPath, 'utf8').matchAll(/<file\s+href="([^"]+)"/g)).map((m) => decodeURIComponent(m[1])));
  const servidos = [];
  const recorrer = (rel) => {
    for (const e of fs.readdirSync(path.join(CURSO, rel), { withFileTypes: true })) {
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) recorrer(r);
      else if (SERVIDAS.test(r) && !/(^|\/)\.|Thumbs\.db$/.test(r)) servidos.push(r);
    }
  };
  for (const d of ['css', 'js', 'img', 'fonts', 'video', 'doc', 'audio']) if (fs.existsSync(path.join(CURSO, d))) recorrer(d);
  const faltan = servidos.filter((f) => !declarados.has(f));
  if (faltan.length) {
    console.log(`\n⚠️ imsmanifest.xml no declara ${faltan.length} archivo(s) propio(s) del curso (${faltan.slice(0, 4).join(', ')}` +
      `${faltan.length > 4 ? ', …' : ''}). Moodle no lo nota; un LMS estricto sí. \`node tools/check-manifest.mjs <curso> --arreglar\` rehace la lista desde el disco.`);
  }
}

/* La sección del relevo, en un curso que viene de antes (v1.9.122, §7.71):
   desde esta versión `build-zip.py` no arma el zip del curso sin ella. Se
   agrega vacía —"pendiente"— y se avisa: completarla es del chat del curso. */
const readmeCurso = path.join(CURSO, 'README-CURSO.md');
if (fs.existsSync(readmeCurso) && !/^#{1,6}\s+.*relevo al kit/im.test(fs.readFileSync(readmeCurso, 'utf8'))) {
  fs.appendFileSync(readmeCurso, '\n\n## Relevo al kit\n\n(pendiente — antes de entregar: correr `node tools/revisar-curso.mjs .` ' +
    'y anotar acá TODO lo que se resolvió o se encontró en el curso, también lo que parezca propio; decide el kit. ' +
    '`build-zip.py` no arma el zip del curso mientras esta sección diga "pendiente".)\n');
  console.log('\n⚠️ README-CURSO.md no tenía la sección "Relevo al kit": se agregó vacía. Desde v1.9.122' +
    '\n  `build-zip.py` no arma el zip del curso hasta que esté escrita, y con ella arma el zip del relevo.');
}

console.log(`\n✓ Curso llevado a v${versionNueva}: ${reemplazar.length} reemplazado(s), ${plan.agregar.length} agregado(s), ${plan.quitar.length} sacado(s).`);
if (respaldar.length || migraciones.length) console.log(`  Respaldo de lo reemplazado o sacado: ${path.relative(CURSO, dirRespaldo)}/`);
planDelCurso(true);
