/* minijuego-landscape.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   Verifica el fix de un bug real: en un TELÉFONO EN HORIZONTAL el banco
   de opciones del minijuego quedaba físicamente inalcanzable. Medido en
   un iPhone 12 apaisado real (844×390): `.d-stage` ~170px de alto
   contra ~490px de contenido, con `overflow:hidden` en toda la cadena,
   o sea la mitad de las 12 opciones no se podía ver NI alcanzar con
   ningún gesto. Como el minijuego es gate obligatorio (4 de 6 para
   avanzar), podía dejar TRABADO a un alumno que curse desde el celular
   acostado.

   Por qué no lo cubría nada de lo que ya había (las dos cosas parecen
   cubrirlo y ninguna lo hace):
     · El bloque responsive de `max-width:600px` —el que trae el
       `overflow-y:auto` que hace falta— no aplica: 844px de ancho está
       muy por encima de ese corte. El teléfono apaisado es ANCHO, lo
       que le falta es ALTO.
     · El aviso "Girá tu dispositivo" solo se muestra en portrait, y
       este caso ES el landscape que ese aviso pide: lo pasa de largo.

   Regla que deja, para el checklist (§7.3 punto 11): probar mobile no
   es solo probar portrait angosto — un viewport ANCHO Y BAJO es un caso
   distinto, con modos de falla propios. */
import { openCourseMobile, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const failures = [];

/* ⚠️ Llegó desde un curso apuntando a SU diapositiva por nombre
   ("minijuego"), así que en cualquier otro curso daba dos fallos que no
   eran fallos. La diapositiva se descubre por el marcado del kit
   (`[data-mj-start]`), y un curso sin minijuego no tiene nada que
   revisar. */
{
  const { browser, page } = await openCourseMobile(url);
  const hay = await page.evaluate(() => !!document.querySelector('[data-mj-start]'));
  await browser.close();
  if (!hay) {
    console.log('  · el curso no tiene minijuego: nada que revisar.');
    report('minijuego-landscape', []);
    process.exit(process.exitCode || 0);
  }
}

for (const device of ['iPhone 12 landscape', 'iPhone SE landscape']) {
  const { browser, page, errors } = await openCourseMobile(url, device);

  const slide = await page.evaluate(() => {
    const b = document.querySelector('[data-mj-start]');
    const sl = b && b.closest('[data-slide]');
    return sl ? sl.getAttribute('data-slide') : null;
  });
  if (slide) await page.evaluate((id) => window.motor.gotoId(id), slide);
  await page.waitForTimeout(350);
  await page.click('[data-mj-start]').catch(() => {});
  await page.waitForTimeout(400);

  const r = await page.evaluate(() => {
    const play = document.querySelector('.d-mj-play');
    const opts = Array.from(document.querySelectorAll('.d-mj-opt'));
    if (!play || !opts.length) return null;
    const last = opts[opts.length - 1];
    play.scrollTop = play.scrollHeight; // llevar el scroll hasta el fondo
    const lr = last.getBoundingClientRect();
    const pr = play.getBoundingClientRect();
    return {
      total: opts.length,
      overflowY: getComputedStyle(play).overflowY,
      hayScroll: play.scrollHeight > play.clientHeight + 2,
      ultimaAlcanzable: lr.top >= pr.top - 1 && lr.bottom <= pr.bottom + 1
    };
  });

  if (!r) {
    failures.push(`${device}: no se encontró el panel de juego o las opciones`);
  } else {
    if (r.overflowY !== 'auto') {
      failures.push(`${device}: .d-mj-play debería poder scrollear (overflow-y:auto), es "${r.overflowY}"`);
    }
    if (!r.ultimaAlcanzable) {
      failures.push(`${device}: la última de las ${r.total} opciones sigue fuera de alcance ` +
        'incluso scrolleando al fondo — el alumno no puede completar el gate');
    }
  }
  if (errors.length) failures.push(`${device}: errores de consola: ${errors.join(' | ')}`);
  await browser.close();
}

report('minijuego-landscape', failures);
