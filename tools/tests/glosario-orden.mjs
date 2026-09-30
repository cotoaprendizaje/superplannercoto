/* glosario-orden.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. El glosario del molde va en ORDEN DE APARICIÓN, no
   alfabético — pedido explícito del cliente: *"que esté ordenado no
   alfabéticamente sino en orden de aparición de las diapos, como un
   caminito"*. Encaja con el desbloqueo progresivo: si los términos
   siguen el recorrido, lo desbloqueado queda arriba y lo que falta
   abajo, y el glosario se lee como un mapa del avance. `coto-ui.js`
   lo dice igual: el orden lo decide el curso escribiéndolos así, y el
   kit NO los reordena nunca.

   Nadie se entera si se rompe: un glosario alfabético se ve perfecto.

   Se comprueba contra el `data-slide-index` real de la diapositiva que
   cada término enlaza (`data-goto`), y que sea UNA sola lista sin
   subtítulos — dos listas separadas eran el estado anterior, y volver
   a partirlas rompe el caminito.

   ⚠️ Llegó desde un curso exigiendo sus 26 términos exactos, lo que lo
   dejaba en rojo en cualquier otro. Acá el largo lo pone el curso: lo
   que se mide es el ORDEN. Sin glosario, o con menos de dos términos,
   no hay nada que revisar. */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

const info = await page.evaluate(() => {
  var indexPorSlide = {};
  document.querySelectorAll('[data-slide][data-slide-index]').forEach(function (s) {
    indexPorSlide[s.getAttribute('data-slide')] = parseInt(s.getAttribute('data-slide-index'), 10);
  });
  var dts = Array.from(document.querySelectorAll('[data-popup="glosario"] dl.d-glossary dt'));
  var secuencia = dts.map(function (dt) {
    var btn = dt.querySelector('[data-goto]');
    var goto = btn ? btn.getAttribute('data-goto') : null;
    return { term: btn ? btn.textContent.trim() : null, goto: goto, idx: indexPorSlide[goto] };
  });
  var subHeadings = document.querySelectorAll('[data-popup="glosario"] .d-glossary-sub').length;
  var listas = document.querySelectorAll('[data-popup="glosario"] dl.d-glossary').length;
  return { secuencia: secuencia, subHeadings: subHeadings, listas: listas };
});

if (info.secuencia.length < 2) {
  console.log('  · el curso no tiene glosario con términos suficientes: nada que revisar.');
  if (errors.length) failures.push(...errors.map((e) => 'error de consola: ' + e));
  await browser.close();
  report('glosario-orden', failures);
  process.exit(process.exitCode || 0);
}
console.log(`  · ${info.secuencia.length} término(s) en ${info.listas} lista(s).`);
if (info.listas !== 1) {
  failures.push(`el glosario tiene ${info.listas} listas: va UNA sola, en orden de aparición. ` +
    'Partirlo en secciones rompe el "caminito" que pidió el cliente.');
}
if (info.subHeadings !== 0) {
  failures.push(`quedan ${info.subHeadings} subtítulo(s) \`.d-glossary-sub\`: son de la versión ` +
    'partida en secciones, y con una sola lista sobran.');
}

var faltanIdx = info.secuencia.filter(function (t) { return t.idx === undefined || t.idx === null; });
if (faltanIdx.length) failures.push('términos con data-goto que no matchea ninguna diapositiva real: ' + JSON.stringify(faltanIdx));

var desordenados = [];
for (var i = 1; i < info.secuencia.length; i++) {
  if (info.secuencia[i].idx < info.secuencia[i - 1].idx) {
    desordenados.push(info.secuencia[i - 1].term + ' (idx ' + info.secuencia[i - 1].idx + ') antes que ' + info.secuencia[i].term + ' (idx ' + info.secuencia[i].idx + ')');
  }
}
if (desordenados.length) failures.push('el glosario no está en orden de aparición de las diapos: ' + JSON.stringify(desordenados));

/* ⚠️ ACÁ HABÍA UN TÉRMINO HARDCODEADO — "Inocuidad", de "Seguridad
   alimentaria". La aserción decía:

     if (info.secuencia[0].term !== 'Inocuidad') failures.push(...)

   O sea: TODO curso que no sea Seguridad alimentaria fallaba este test,
   con su glosario perfectamente en orden. Medido en "Prevención
   cardiovascular": el único fallo era este, y el primer término ("ENT",
   diapo 4) es exactamente el correcto.

   El bucle de `desordenados` de acá arriba ya verifica que la secuencia
   sea ascendente por índice de diapositiva, así que el nombre del primer
   término no agrega nada sobre el ORDEN. La regla que el kit quiere
   hacer cumplir —"orden de aparición"— es invariante entre cursos; el
   nombre del primer término, no.

   ⚠️ Pero no era 100% redundante, y conviene que quede dicho en vez de
   darlo por saldado: nombrar el primer término también fijaba que el
   glosario no se SALTEE el término más temprano (una secuencia a la que
   le falta el primero sigue siendo ascendente). Esa mitad no se puede
   expresar en el kit: el glosario ES la única fuente de qué términos
   existen —se leen de sus `data-goto`—, así que no hay contra qué
   comparar. `secuencia[0].idx` es, por construcción, el mínimo de los
   términos que hay. Se pierde con el hardcodeo, y es correcto perderla:
   una aserción que solo puede cumplir un curso no es una aserción del
   kit. Si algún día un curso quiere fijar su primer término, va en sus
   propios tests de contenido, no acá. */

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
await browser.close();
report('glosario-orden', failures);
