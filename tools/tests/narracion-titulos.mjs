/* narracion-titulos.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. Tres contratos de narración que se rompen callados:

   1 · Una diapositiva con contenido empieza narrando SU TÍTULO. Sin
       eso, quien escucha el curso pasa de diapositiva y arranca a
       mitad de una explicación sin saber de qué le están hablando.
   2 · Una diapositiva de VIDEO de fondo no narra nada — la voz
       competiría con el audio del video (`.d-shot-slide--bg-video`
       queda fuera de `textOf()`).

   ⚠️ Llegó desde un curso nombrando SUS diapositivas ("alteracion",
   "temperatura", "unidad1") y SUS textos, así que en cualquier otro
   curso daba tres fallos que no eran fallos. Acá las diapositivas se
   descubren: se recorren todas las que tengan título y contenido, y
   los pop-ups con `[data-narrate-only]`, sean los que sean.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

const r = await page.evaluate(() => {
  const pelar = (t) => (t || '').toLowerCase().replace(/[^a-z0-9áéíóúüñ]/gi, '');
  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const conTitulo = [];
  const video = [];
  slides.forEach((sl) => {
    const id = sl.getAttribute('data-slide');
    const h = sl.querySelector('[data-slide-title]');
    const titulo = h ? h.textContent.trim() : '';
    window.motor.gotoId(id);
    const texto = window.Narrador.textOf(sl);
    if (sl.classList.contains('d-shot-slide--bg-video')) {
      video.push({ id, texto });
    } else if (titulo && texto.trim()) {
      conTitulo.push({ id, titulo, arranca: pelar(texto).startsWith(pelar(titulo)) , texto: texto.slice(0, 70) });
    }
  });
  return { conTitulo, video };
});

if (!r.conTitulo.length && !r.video.length) {
  console.log('  · el curso todavía no tiene diapositivas con contenido: nada que revisar.');
} else {
  console.log(`  · ${r.conTitulo.length} diapositiva(s) con título · ${r.video.length} de video.`);
}

r.conTitulo.filter((s) => !s.arranca).forEach((s) => {
  failures.push(`"${s.id}": la narración no empieza por su título ("${s.titulo}") — quien escucha ` +
    `entra a mitad de una explicación. Empieza con: "${s.texto}…"`);
});

r.video.filter((s) => s.texto.trim()).forEach((s) => {
  failures.push(`"${s.id}" es .d-shot-slide--bg-video y narra "${s.texto.slice(0, 50)}…": la voz ` +
    'compite con el audio del video. Esas diapositivas no se narran.');
});

/* ⚠️ ACÁ HABÍA UNA TERCERA ASERCIÓN Y SE SACÓ: comprobaba que un pop-up
   con `[data-narrate-only]` narrara MENOS que su tarjeta entera. Suena
   razonable y no mide nada: lo que queda afuera del acotado son badges
   y encabezados que `TEXT_SEL` tampoco narra, así que los dos textos
   dan igual aunque el acotado esté funcionando perfecto. Medido: 88 de
   88 caracteres en un curso nuevo, 185 de 185 en uno terminado — dos
   fallos que no eran fallos.
   Mejor dos aserciones que miden algo que tres donde una miente. */

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
await browser.close();
report('narracion-titulos', failures);
