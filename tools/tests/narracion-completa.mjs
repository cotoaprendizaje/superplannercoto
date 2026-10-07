#!/usr/bin/env node
/* narracion-completa.mjs — kit-base v1.9.76
   ------------------------------------------------------------
   POR QUÉ EXISTE. Lee la salida REAL de `Narrador.textOf()` por
   diapositiva. Ninguno de los otros tests la mira, y ahí se esconden
   fallas que no dan error y que el alumno SÍ nota:

     · una diapositiva MUDA (`textOf()` devuelve '') — el curso "no
       narra" y nada lo delata. Ya pasó con 14 diapositivas mudas;
     · un widget "uno a la vez" que muestra sus variantes SEGUIDAS
       porque están escondidas con CSS y no con el atributo `hidden`:
       `textOf()` filtra por `hidden`, NUNCA por el `display` calculado
       (§7.21 F1). Se esconde de la vista pero no de la voz;
     · texto pegado o punto doble en los límites entre nodos narrados.

   LA TRAMPA DEL PROPIO TEST (§7.21 F7): para leer el `textOf()` de una
   diapositiva hay que NAVEGAR a ella primero. El narrador filtra por
   `hidden` y todas menos la activa lo tienen, así que recorrer el DOM
   de una sola pasada devuelve '' para todas y parece que el curso
   entero está mudo. Por eso acá se navega diapositiva por diapositiva.

   Una diapositiva que ES un video (`.d-shot-slide--bg-video`) narra ''
   A PROPÓSITO (§5): el video trae su propia locución. Eso no es un
   fallo — pero SÍ lo es que tenga ese `''` sin ser de video.
*/
import { openCourse, report, requireUrl, irASlide } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

const hayNarrador = await page.evaluate(() => !!(window.Narrador && window.Narrador.textOf));
if (!hayNarrador) {
  report('narracion-completa', ['el curso no expone `Narrador.textOf` — ¿se cargó narrador.js?']);
  await browser.close();
  process.exit(process.exitCode || 0);
}

const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('[data-slide]')).map((s) => s.getAttribute('data-slide')));

for (const id of ids) {
  if (!(await irASlide(page, id))) { fails.push(`no se pudo navegar a "${id}"`); continue; }

  const r = await page.evaluate((slideId) => {
    const el = document.querySelector(`[data-slide="${slideId}"]`);
    if (!el) return null;
    const texto = window.Narrador.textOf(el) || '';
    return {
      texto,
      esVideo: el.classList.contains('d-shot-slide--bg-video'),
      /* Variantes "uno a la vez" escondidas con CSS en vez de `hidden`:
         el narrador las va a leer TODAS, una detrás de otra. */
      ocultasPorCss: Array.from(el.querySelectorAll('[data-panel], [data-repaso-item], .d-mj-nivel'))
        .filter((n) => {
          if (n.hidden) return false;                        // bien escondido
          const st = getComputedStyle(n);
          return st.display === 'none' || st.visibility === 'hidden';
        })
        .map((n) => n.getAttribute('data-panel') || n.className || n.tagName.toLowerCase())
        .slice(0, 4),

      /* OPCIONES MUDAS (kit-base v1.9.81, relayado desde el primer
         simulador). `TEXT_SEL` no incluye `button`, así que una
         pregunta cuyas opciones son botones sueltos se narra con la
         consigna y NINGUNA opción: el alumno que escucha el curso oye
         "¿de dónde sale el número?" y después silencio.
         Se arregla envolviendo cada botón en un `<li>` —que sí se
         narra— o agregando un `.sr-only` con las opciones enumeradas.
         Lo que lo hace traicionero es que es un cambio de DISEÑO el
         que lo provoca: rehacer una lista como fila de botones apaga
         la locución sin tocar una línea de JS y sin dar ningún error. */
      opcionesMudas: Array.from(el.querySelectorAll('[data-repaso-item], .d-q'))
        .filter((item) => {
          if (item.hidden) return false;
          const ops = Array.from(item.querySelectorAll('[data-repaso-ans], [data-opt]'));
          if (!ops.length) return false;
          /* La pregunta se le hace AL KIT, no a una copia de su lista:
             `Narrador.textSel()` devuelve el `TEXT_SEL` vivo, con lo
             que el curso le haya sumado por `addTextSel()`. Traer acá
             una lista propia era garantizar que un día se
             desincronice y el test mienta en verde (kit-base
             v1.9.81). El respaldo es solo para un curso viejo cuyo
             `narrador.js` todavía no publique `textSel`. */
          const sel = (window.Narrador && window.Narrador.textSel)
            ? window.Narrador.textSel()
            : 'li, dd, p, .d-opt-text';
          return !ops.some((o) => o.matches(sel) || o.closest(sel));
        })
        .map((item) => item.getAttribute('data-repaso-id') || item.className || 'pregunta')
        .slice(0, 4)
    };
  }, id);
  if (!r) continue;

  if (!r.texto.trim() && !r.esVideo) {
    fails.push(`"${id}": `+
      'Narrador.textOf() devuelve vacío y la diapositiva no es de video — va a quedar MUDA ' +
      'sin dar ningún error. Si es a propósito, marcala .d-shot-slide--bg-video.');
  }
  if (r.esVideo && r.texto.trim()) {
    fails.push(`"${id}": es .d-shot-slide--bg-video pero igual narra ` +
      `("${r.texto.slice(0, 40)}…") — se va a encimar con el audio del video.`);
  }
  if (r.ocultasPorCss.length) {
    fails.push(`"${id}": ${r.ocultasPorCss.length} pieza(s) escondida(s) con CSS y no con el ` +
      `atributo \`hidden\` (${r.ocultasPorCss.join(', ')}). textOf() filtra por \`hidden\`, ` +
      'así que las va a narrar TODAS seguidas (§7.21 F1).');
  }
  if (r.opcionesMudas && r.opcionesMudas.length) {
    fails.push(`"${id}": ${r.opcionesMudas.length} pregunta(s) con las opciones MUDAS ` +
      `(${r.opcionesMudas.join(', ')}). Los \`<button>\` no están en TEXT_SEL: se narra la ` +
      'consigna y ninguna respuesta. Envolvelos en `<li>` o sumá un `.sr-only` con las ' +
      'opciones enumeradas.');
  }
  if (/[.!?]\s*[.!?]/.test(r.texto)) {
    const m = r.texto.match(/.{0,25}[.!?]\s*[.!?].{0,25}/);
    fails.push(`"${id}": puntuación doble en el texto narrado — "…${m[0]}…"`);
  }
  /* Dos minúsculas ANTES de la mayúscula, no una (kit-base v1.9.122,
     §7.71): con una sola, "iPad", "iPhone" o "eCommerce" contaban como
     dos frases pegadas. Lo relevó "Uso de Sucursales 3 - NOA" ("…desde el
     iPad para acceder…"). Un pegado real termina una palabra entera:
     "cursoLa", "puntosAhora". */
  const PEGADAS = /(?:^|[^A-Za-zÁÉÍÓÚÑáéíóúñ])[A-Za-zÁÉÍÓÚÑáéíóúñ]*[a-záéíóúñ]{2}[A-ZÁÉÍÓÚÑ]/;
  if (PEGADAS.test(r.texto)) {
    const m = r.texto.match(/.{0,20}[a-záéíóúñ]{2}[A-ZÁÉÍÓÚÑ].{0,20}/);
    fails.push(`"${id}": dos frases pegadas sin separador — "…${m[0]}…"`);
  }
}

if (errors.length) fails.push(...errors.map((e) => 'error de consola: ' + e));
report('narracion-completa', fails);
await browser.close();
