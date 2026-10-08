#!/usr/bin/env node
/* gamificacion.mjs — kit-base v1.9.80
   ------------------------------------------------------------
   POR QUÉ EXISTE. La gamificación completa es **obligatoria** desde
   §6.17.1 — el cliente fue explícito: *"eso no es una decisión de
   alcance válida, es un faltante"*. Y hasta ahora la única forma de
   hacerla cumplir era el punto 9.5 del checklist de §7, que pide
   "verificar explícitamente que estén los 4 elementos".

   Un checklist que se verifica a mano se cumple hasta que alguien tiene
   apuro. Esto lo mide.

   LOS CUATRO ELEMENTOS:
     1. chip de logros/puntos funcionando en el header;
     2. glosario con términos REALES del curso;
     3. al menos una mini-práctica, quiz o repaso;
     4. que las interacciones sumen puntos de verdad.

   EL CUIDADO QUE HACE QUE ESTO NO MOLESTE: un curso recién generado no
   tiene nada de eso —y no debería fallar por estar vacío—. Así que el
   test primero decide si el curso YA TIENE CONTENIDO, mirando cuánto
   texto narrable hay en total. Un scaffold tiene los rótulos de sección
   y nada más; un curso de verdad tiene cientos de palabras. Por debajo
   del piso, el test informa y no exige: es un curso en construcción.

   Es el mismo criterio de `iconos-indice`: un test que le falla a un
   curso recién generado enseña a ignorar la suite.
*/
import { openCourse, report, requireUrl, irASlide } from './_shared.mjs';

const PISO_PALABRAS = 150;

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

/* Cuánto contenido hay. Se navega diapositiva por diapositiva porque
   `textOf()` filtra por `hidden` y todas menos la activa lo tienen
   (§7.21, trampa 7). */
const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));
let palabras = 0;
for (const id of ids) {
  if (!(await irASlide(page, id))) continue;
  palabras += await page.evaluate((s) => {
    const el = document.querySelector(`[data-slide="${s}"]`);
    if (!el || !window.Narrador || !window.Narrador.textOf) return 0;
    return (window.Narrador.textOf(el) || '').split(/\s+/).filter(Boolean).length;
  }, id);
}

if (palabras < PISO_PALABRAS) {
  console.log(`  · ${palabras} palabras de contenido: el curso está en construcción, ` +
    `no se exige la gamificación todavía (piso: ${PISO_PALABRAS}).`);
  report('gamificacion', errors.map((e) => 'error de consola: ' + e));
  await browser.close();
  process.exit(process.exitCode || 0);
}

const g = await page.evaluate(() => ({
  hayChip: !!document.querySelector('.d-chip--achieve'),
  puntosCableados: (() => {
    const p = document.getElementById('d-points');
    return !!p && p.hasAttribute('data-valor');
  })(),
  terminosGlosario: document.querySelectorAll('dl.d-glossary dt').length,
  hayGlosario: !!document.querySelector('[data-popup="glosario"]'),
  /* La práctica se busca por marcado, y eso deja afuera un caso
     entero: un SIMULADOR es práctica de punta a punta —el alumno
     resuelve pantallas reales del sistema— y no tiene ni un
     `[data-repaso]` ni un `.d-q`. Medido solo por selectores, un curso
     que es 100% práctica falla el test que pide práctica, y el empujón
     es a agregar un quiz decorativo: exactamente lo contrario de lo
     que §6.17.1 busca.
     Por eso el curso puede DECLARAR dónde vive la suya con
     `<body data-practica="...">`. No es un bypass: es el curso
     diciendo qué es, y queda escrito en el marcado para el que lo lea
     después. kit-base v1.9.81. */
  practicaDeclarada: document.body.getAttribute('data-practica') || '',
  hayPractica: !!document.querySelector('[data-repaso-item], .d-q, .d-mj-panel, [data-repaso], [data-sim-rail]'),
  badges: document.querySelectorAll('#d-badges-list .d-badge').length
}));

/* Los dos síntomas se juntaban en un solo mensaje que además afirmaba
   una consecuencia sin medirla ("el curso no puntúa nada"). Son cosas
   distintas y se dicen por separado desde v1.9.84 — ver el comentario
   largo en `contrato-cableado.mjs`, misma corrección: **el chip que
   falta sí es un hallazgo cerrado** (sin él no hay dónde mostrar los
   puntos), y **la huella ausente de `initLogros()` no lo es**: un curso
   puede tener su propia gamificación y andar. */
if (!g.hayChip) {
  fails.push('falta el chip `.d-chip--achieve` en el header: no hay dónde mostrar los puntos ' +
    'ni de dónde sacar la medalla del cierre (§6.17.1).');
}
if (g.hayChip && !g.puntosCableados) {
  fails.push('el chip `.d-chip--achieve` está pero `#d-points` no lleva la huella de ' +
    '`initLogros()`: la gamificación quedó cableada por fuera del kit. Esto NO dice que el ' +
    'curso no puntúe —puede tener implementación propia—; dice que queda fuera del estándar ' +
    '(§6.17.1) y no hereda las mejoras de esa pieza. Para confirmar si puntúa: abrir una ' +
    'interacción que pague y mirar #d-points.');
}
if (!g.badges) {
  fails.push('el catálogo de logros está vacío: `#d-badges-list` no tiene ninguna `.d-badge`. ' +
    'Los logros son contenido del curso y van en el `badges:` de `initLogros()`.');
}
if (!g.hayGlosario) {
  fails.push('el curso no tiene pop-up de glosario (§6.17.1, obligatorio).');
} else if (g.terminosGlosario === 0) {
  fails.push('el glosario existe pero está VACÍO: 0 términos. El pop-up abre y no dice nada — ' +
    'peor que no tenerlo.');
}
if (!g.hayPractica && !g.practicaDeclarada) {
  fails.push('no hay ninguna mini-práctica, quiz ni repaso (§6.17.1, obligatorio). ' +
    'Si la práctica de este curso no es ninguna de esas piezas —un simulador, por ' +
    'ejemplo, donde el curso ENTERO es la práctica— declaralo con ' +
    '`<body data-practica="simulador">` y explicá en README-CURSO.md por qué.');
}

/* ---- Exactamente 5 logros por curso (kit-base v1.9.125, §7.74) ----
   CONVENCIÓN DEL CLIENTE, para TODOS los cursos: "yo había querido
   definir que siempre sean 5 logros". Desde v1.9.97 este test solo
   frenaba los MÁS de 5, así que un curso con 4 pasaba en verde
   (relevo de "Seguridad de la información", A23: el cliente lo vio en el
   curso entregado). Ahora son 5, ni más ni menos. Los cinco del kit
   (`punteria`, `racha`, `curioso`, `explorador`, `impecable`) se piden por id
   en `curso.json` → `logros`; un curso puede cambiar alguno por uno propio.

   Un curso sin logros todavía no falla por esto: el piso lo pone el
   propio test más arriba. */
const LOGROS = 5;
if (g.badges && g.badges !== LOGROS) {
  fails.push(`el catálogo declara ${g.badges} logro(s) y la convención del cliente es EXACTAMENTE ` +
    `${LOGROS} por curso (kit v1.9.125, CLAUDE.md §7.74). ` +
    (g.badges < LOGROS
      ? 'Completar con los del kit: en curso.json → logros, ids "punteria", "racha", "curioso", "explorador", "impecable".'
      : 'Si dos logros miden lo mismo partido en dos, fusionarlos.'));
}

console.log(`  · ${palabras} palabras · ${g.terminosGlosario} término(s) de glosario · ` +
  `${g.badges} logro(s) en el catálogo` +
  (g.practicaDeclarada ? ` · práctica declarada: "${g.practicaDeclarada}"` : ''));

if (errors.length) fails.push(...errors.map((e) => 'error de consola: ' + e));
report('gamificacion', fails);
await browser.close();
