/* narracion-video.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. Una diapositiva de VIDEO de fondo no se narra: el
   video trae su propio audio y la locución competiría con él. El caso
   real que lo originó: las portadas y separadores de unidad tienen un
   `<p>` de verdad dentro de su `.sr-only` —lo necesitan para el lector
   de pantalla— y `speakSlide()` lo narraba como cualquier párrafo, así
   que el alumno escuchaba las dos voces encimadas. El arreglo vive en
   `textOf()` (narrador.js), que devuelve '' para cualquier
   `.d-shot-slide--bg-video`.

   Dos mitades, y la segunda es la que importa: que `textOf()` devuelva
   vacío es necesario pero no suficiente — lo que hay que comprobar es
   que **nadie llame a `speechSynthesis.speak()`** al entrar ahí, porque
   el texto podría llegarle por otro camino.

   ⚠️ Llegó desde un curso nombrando SUS cinco diapositivas, así que en
   cualquier otro daba tres fallos que no eran fallos. Acá las
   diapositivas de video y las de contenido se descubren solas.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

/* `textOf()` filtra lo que está dentro de `[hidden]`, y el motor marca
   `hidden` a toda diapositiva que no sea la activa — hay que NAVEGAR a
   cada una antes de leerla, o da vacío por estar oculta y no por el
   arreglo que se está probando. */
const r = await page.evaluate(() => {
  const video = [];
  const conTexto = [];
  Array.from(document.querySelectorAll('[data-slide]')).forEach((sl) => {
    const id = sl.getAttribute('data-slide');
    window.motor.gotoId(id);
    const texto = window.Narrador.textOf(sl);
    if (sl.classList.contains('d-shot-slide--bg-video')) video.push({ id, texto });
    else if (texto.trim().length >= 10) conTexto.push(id);
  });
  return { video, conTexto };
});

if (!r.video.length) {
  console.log('  · el curso no tiene diapositivas con video de fondo: nada que revisar.');
  if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
  await browser.close();
  report('narracion-video', failures);
  process.exit(process.exitCode || 0);
}

console.log(`  · ${r.video.length} diapositiva(s) de video · ${r.conTexto.length} con texto narrable.`);

r.video.filter((s) => s.texto !== '').forEach((s) => {
  failures.push(`textOf("${s.id}") debería dar '' por ser diapositiva de video, dio: ` +
    `"${s.texto.slice(0, 60)}…" — la locución competiría con el audio del video.`);
});

/* El spy de verdad. Se cancela primero lo que haya en cola de la
   navegación anterior: el recorrido de arriba pasó por diapositivas que
   SÍ narran, y sin el cancel el spy agarra fragmentos que ya estaban
   encolados desde antes de instalarlo. */
await page.evaluate(() => window.Narrador.cancel());
await page.evaluate(() => {
  window.__spoken = [];
  const orig = window.speechSynthesis.speak.bind(window.speechSynthesis);
  window.speechSynthesis.speak = function (u) { window.__spoken.push(u.text); return orig(u); };
});
/* Y una pausa de asentamiento antes de medir: el recorrido de arriba
   pasó por TODAS las diapositivas, y alguna puede abrir un pop-up de
   intro cuya narración se encola con retraso. Sin esto, el spy la
   atribuye a la diapositiva de video que se visita después — falso
   positivo medido en un curso real. */
await page.waitForTimeout(700);
await page.evaluate(() => { window.Narrador.cancel(); window.__spoken = []; });
await page.evaluate((id) => window.motor.gotoId(id), r.video[0].id);
await page.waitForTimeout(700);
const spoken = await page.evaluate(() => window.__spoken);
if (spoken.length) {
  failures.push(`entrar a "${r.video[0].id}" (video de fondo) llamó a speechSynthesis.speak(): ` +
    `${JSON.stringify(spoken.slice(0, 2))}. El texto le está llegando por otro camino.`);
}

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
await browser.close();
report('narracion-video', failures);
