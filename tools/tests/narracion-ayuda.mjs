/* narracion-ayuda.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. La grilla de tips del panel "Ayuda" quedaba MUDA: su
   texto vive en `<span>`/`<small>` sueltos, ninguno de los tags que
   `TEXT_SEL` ya narraba. El alumno que hace el curso escuchando abría
   Ayuda y oía la consigna de arriba y nada de los tips — que son
   justamente las tres cosas concretas que el panel viene a explicar.
   El arreglo fue de kit (`.d-instr-item` en `TEXT_SEL`, narrador.js);
   este test es lo que impide que se caiga.

   ⚠️ Llegó desde un curso comprobando SUS tres tips por su texto
   ("Tarjetas y flechas", "Video", "Mini juego"), lo que lo dejaba en
   rojo en cualquier otro curso. Acá se comprueba el contrato, que es
   el mismo con cualquier contenido: **cada `.d-instr-item` que el
   panel tenga, aporta su texto a `textOf()`**. Un curso sin tips no
   tiene nada que revisar y el test lo dice.

   Y la otra mitad, que también es decisión de kit tomada con el
   cliente: el modal de "instrucciones" NO se narra. Está a propósito
   —es el instructivo de arranque, que se lee— y si un día empieza a
   narrarse, esto lo reporta.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];
const { browser, page, errors } = await openCourse(url);

const r = await page.evaluate(() => {
  const pop = document.querySelector('[data-fab-ctl="ayuda"] .d-fab-pop');
  const instr = document.querySelector('[data-popup="instrucciones"] .modal-card');
  const items = pop ? Array.from(pop.querySelectorAll('.d-instr-item')) : [];
  return {
    hayPanel: !!pop,
    narrado: pop ? window.Narrador.textOf(pop) : '',
    /* De cada tip se toma su primer trozo de texto propio: alcanza
       para saber si entró en la narración, y no depende de cómo el
       curso reparta `<b>`/`<span>`/`<small>` adentro. */
    tips: items.map((el) => (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24))
      .filter((t) => t.length > 3),
    _nota: 'ver la normalización de abajo',
    instrucciones: instr ? window.Narrador.textOf(instr) : null
  };
});

if (!r.hayPanel) {
  console.log('  · el curso no tiene panel de Ayuda: nada que revisar.');
} else if (!r.tips.length) {
  console.log('  · el panel de Ayuda no tiene tips (`.d-instr-item`): nada que revisar.');
} else {
  /* Se compara SIN separadores: `textOf()` mete un punto y un espacio
     entre nodos, así que el texto narrado nunca es igual carácter a
     carácter al `textContent` crudo del tip. Comparar literal daba un
     falso positivo en el curso del que salió este test — medido. */
  const pelar = (t) => (t || '').toLowerCase().replace(/[^a-z0-9áéíóúüñ]/gi, '');
  const narradoPelado = pelar(r.narrado);
  const mudos = r.tips.filter((t) => !narradoPelado.includes(pelar(t)));
  if (mudos.length) {
    failures.push(`${mudos.length} de ${r.tips.length} tip(s) del panel de Ayuda NO se narran ` +
      `(${mudos.map((t) => `"${t}…"`).join(', ')}). Su texto vive en <span>/<small> sueltos: ` +
      'lo que lo hace narrable es `.d-instr-item` en `TEXT_SEL` (narrador.js).');
  } else {
    console.log(`  · ${r.tips.length} tip(s) del panel de Ayuda, todos narrados.`);
  }
}

if (r.instrucciones) {
  failures.push('el modal de "instrucciones" empezó a narrarse y no debería: es el instructivo ' +
    `de arranque, que se lee (decisión de producto). Dio: "${r.instrucciones.slice(0, 80)}…"`);
}

if (errors.length) failures.push('errores de consola: ' + errors.join(' | '));
await browser.close();
report('narracion-ayuda', failures);
