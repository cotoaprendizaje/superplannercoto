/* nota-en-linea.mjs — kit-base v1.9.127 (§7.77)
   ------------------------------------------------------------
   POR QUÉ EXISTE. Las dos notas amarillas con "!" del canvas —la del
   resumen ("Tu resultado:", `.d-cierre-results .d-cert-note`) y la de
   "Curso finalizado" (`.d-salida-eval`)— eran contenedores flex. Con una
   `<b>` adentro, flex hace de cada pedazo de texto una columna: la frase
   se leía partida ("Te queda pendiente la | evaluación final | : es un…").
   Pasó dos veces, una en cada nota, y en las dos lo vio una captura, no
   un test.

   QUÉ HACE, en un curso real, sin depender de que el curso llegue al
   final: arma las dos notas con texto y negritas en una caja de 520px y
   exige que el PRIMER pedazo de texto (que entra holgado en un renglón)
   ocupe un solo renglón. En flex se angosta a una columna y ocupa varios. */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const fallos = [];
const { browser, page } = await openCourse(url);

const r = await page.evaluate(() => {
  const texto = 'Te queda pendiente la <b>evaluación final</b>: es un <b>cuestionario aparte</b>, en la plataforma, que vas a encontrar cuando termines todo el contenido.';
  const caja = document.createElement('div');
  caja.style.cssText = 'position:fixed;left:0;top:0;width:520px;z-index:9999;background:#fff';
  caja.innerHTML = `<div class="d-cierre-results"><p class="d-cert-note" id="zz-n1">${texto}</p></div>` +
    `<div class="d-salida-card"><p class="d-salida-eval" id="zz-n2">${texto}</p></div>`;
  document.body.appendChild(caja);
  const out = {};
  for (const id of ['zz-n1', 'zz-n2']) {
    const n = document.getElementById(id);
    const rg = document.createRange();
    rg.selectNodeContents(n.firstChild);
    out[id] = { renglones: new Set([...rg.getClientRects()].map((x) => Math.round(x.top))).size, display: getComputedStyle(n).display, ancho: Math.round(n.getBoundingClientRect().width) };
  }
  caja.remove();
  return out;
});
for (const [id, nombre] of [['zz-n1', 'la nota del resumen (`.d-cierre-results .d-cert-note`)'], ['zz-n2', 'el aviso de "Curso finalizado" (`.d-salida-eval`)']]) {
  const x = r[id];
  if (x.renglones > 1) fallos.push(`${nombre}: "Te queda pendiente la" ocupa ${x.renglones} renglones en una caja de ${x.ancho}px (display: ${x.display}). Con una <b> adentro la frase se parte en columnas: tiene que ser un bloque.`);
}
await browser.close();
report('nota-en-linea', fallos);
