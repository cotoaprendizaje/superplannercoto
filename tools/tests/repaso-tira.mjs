/* repaso-tira — la tira de repaso entra en su banda, sin scroll y sin
   regalar la respuesta. kit-base v1.9.100.

   La tira (`.d-repaso`, css/coto-repaso.css) nació en "Seguridad
   Alimentaria" dentro de un panel propio, y en "Prevención
   cardiovascular" pasó a colocarse sobre la lámina con
   `data-l/t/w/h`. Ese traslado destapó dos trampas que este test fija:

     1. `.d-repaso` trae `position: relative`, y en el kit no hay una
        regla genérica `[data-place]{position:absolute}` —cada clase
        colocable trae la suya—: la tira se queda en el flujo normal, con
        sus `left/top` en px escritos y sin efecto, fuera de la lámina.
        El motor lo avisa por consola, pero nada falla a la vista.
     2. El motor escribe `height` en px sobre lo que coloca, así que una
        tira puesta directo en la banda se estira y queda con un vacío
        abajo; y si en cambio la banda se declara "justa", al contestar
        la devolución se despliega y la tira desborda.

   Y una tercera, de contenido: en una pregunta de opción múltiple el
   ✓ de `.d-repaso-btns--vf` señala la correcta ANTES de contestar.

   Se prueba el estado MÁS ALTO de todos —contestando MAL, que abre la
   devolución, marca cuál era la correcta y despliega el chip de
   completo— porque es el único que puede desbordar.

   ⚠️ SE ARMA SUS PROPIAS TIRAS si el curso no tiene (kit-base v1.9.100,
   al subirlo al kit). La versión que llegó del curso decía "nada que
   revisar" y daba ✓ en cualquier curso sin tira colocada — o sea en
   todo curso recién generado: verde por ausencia. Ahora inyecta DOS,
   de opción múltiple y en columna, sobre una lámina: una con
   `data-l/t/w/h` en la propia `.d-repaso` (trampa 1) y otra adentro
   de un `.d-repaso-marco` (trampa 2). */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();

const fallos = [];
const { browser, page, errors } = await openCourse(url);

const total = await page.evaluate(() => {
  document.querySelectorAll('[data-slide]').forEach(s => {
    s.removeAttribute('data-require-seen');
    s.removeAttribute('data-require-popups');
    s.removeAttribute('data-require-repaso');
  });
  return document.querySelectorAll('[data-slide]').length;
});

/* ---- si el curso no tiene tiras colocadas, se arman dos ---- */
await page.evaluate(() => {
  if (document.querySelector('[data-slide] [data-repaso]')) return;
  const slides = [...document.querySelectorAll('[data-slide]')];
  /* Una diapositiva COMÚN, no una captura ni el cierre (kit-base
     v1.9.107). Antes era "la cuarta", a ciegas, y en "Pedidos de PLU
     set" la cuarta es una `.d-shot-slide--bg-video`: el lienzo de prueba
     metido ahí no se diagrama como una lámina y el test acusaba "la tira
     se sale de la lámina 1118px" sobre una tira que el curso ni tiene. */
  const comun = slides.filter((s, i) => i > 0 && !s.matches('.d-shot-slide, .slide-cierre'));
  const sl = comun[Math.min(2, comun.length - 1)] || slides[Math.min(3, slides.length - 2)];
  if (!sl) return;
  /* Una lámina de 1440x720 (el 2:1 de trabajo, §2.6): con una imagen
     sin tamaño natural `_initShots()` no tiene contra qué medir. */
  const arte = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720"><rect width="1440" height="720" fill="#eef"/></svg>');
  const tira = (id) =>
    '<div class="d-repaso" data-repaso>' +
    '<b class="d-repaso-title"><span class="d-repaso-title-ic">🔍</span>Repaso rápido' +
    '<span class="d-repaso-nav"><button class="d-repaso-arrow" data-repaso-prev>‹</button>' +
    '<span class="d-repaso-count" data-repaso-count>0 de 1</span>' +
    '<button class="d-repaso-arrow" data-repaso-nextq>›</button></span></b>' +
    '<div class="d-repaso-item" data-repaso-item data-repaso-n="1" data-repaso-id="' + id + '" data-repaso-ok="true">' +
    '<p class="d-repaso-q">¿Cuál de estos es un factor de riesgo que se puede modificar?</p>' +
    '<div class="d-repaso-btns d-repaso-btns--col">' +
    '<button data-repaso-ans="false">La edad, que avanza para todos por igual</button>' +
    '<button data-repaso-ans="true">El sedentarismo y la falta de actividad física</button>' +
    '<button data-repaso-ans="false">Los antecedentes familiares directos</button></div>' +
    '<p class="d-repaso-fb" data-repaso-fb hidden>El sedentarismo se puede cambiar: moverse 30 minutos por día ya ayuda.</p>' +
    '<button class="d-repaso-next" data-repaso-next>Siguiente</button></div></div>';
  const shot = document.createElement('div');
  shot.className = 'd-shot'; shot.setAttribute('data-shot', '');
  shot.innerHTML = '<img class="d-shot-img" src="' + arte + '" alt="">' +
    tira('prueba-directa').replace('class="d-repaso" data-repaso',
      'class="d-repaso" data-repaso data-place data-l="4" data-t="8" data-w="42" data-h="84"') +
    '<div class="d-repaso-marco" data-place data-l="54" data-t="8" data-w="42" data-h="84">' + tira('prueba-marco') + '</div>';
  sl.appendChild(shot);
  window.__tiraInyectada = sl.getAttribute('data-slide');
});
await page.waitForTimeout(200);
await page.evaluate(() => {
  if (!window.__tiraInyectada) return;
  if (window.initRepasoRapido) window.initRepasoRapido({});
});

const ids = await page.evaluate(() =>
  [...document.querySelectorAll('[data-slide]')]
    .filter(s => s.querySelector('[data-repaso]'))
    .map(s => s.getAttribute('data-slide')));
if (!ids.length) fallos.push('no hay tira de repaso en el curso y no se pudo armar una de prueba (¿falta coto-ui.js?)');


for (const id of ids) {
  const idx = await page.evaluate(id =>
    [...document.querySelectorAll('[data-slide]')].findIndex(s => s.getAttribute('data-slide') === id), id);
  await page.evaluate(i => window.motor.go(i), idx);
  await page.waitForTimeout(500);

  await page.evaluate(() => window.motor._initShots && window.motor._initShots());
  await page.waitForTimeout(200);
  const nTiras = await page.evaluate(id => document.querySelectorAll('[data-slide="' + id + '"] [data-repaso]').length, id);
  for (let k = 0; k < nTiras; k++) {
  const r = await page.evaluate(([id, k]) => {
    const sl = document.querySelector('[data-slide="' + id + '"]');
    const tira = sl.querySelectorAll('[data-repaso]')[k];
    const shot = sl.querySelector('[data-shot]');
    // Una tira que el curso destapa por progreso (video visto, gate…)
    // se destapa a mano: lo que se mide es la CAJA, no la condición.
    let n = tira;
    while (n && n !== sl) { n.hidden = false; n = n.parentElement; }
    /* POR PREGUNTA, no por tira (kit-base v1.9.118, relevo de "Seguridad
       alimentaria"). Contaba los botones de TODA la tira: una tira con dos
       preguntas V/F tiene 4 botones y el test la tomaba por opción
       múltiple, acusando el ✓/✕ que en V/F es lo correcto. Y se miran
       TODAS las preguntas, no solo la primera: una V/F seguida de una de
       opción múltiple tiene que mirarse entera. */
    const items = [...tira.querySelectorAll('[data-repaso-item]')];
    const item = items[0];
    const btns = [...item.querySelectorAll('[data-repaso-ans]')];
    const esTilde = (b) => {
      const c = getComputedStyle(b, '::before').content;
      return c && c !== 'none' && c !== 'normal' && c.replace(/"/g, '') === '✓';
    };
    const multiplesQueRegalan = items.filter((it) => {
      const bs = [...it.querySelectorAll('[data-repaso-ans]')];
      return bs.length > 2 && bs.some(esTilde);
    }).length;
    // Contestar MAL: el estado más alto.
    const ok = item.getAttribute('data-repaso-ok');
    const malo = btns.find(b => b.getAttribute('data-repaso-ans') !== ok);
    if (malo) malo.click();
    return new Promise(res => setTimeout(() => {
      const tb = tira.getBoundingClientRect();
      const sb = shot ? shot.getBoundingClientRect() : null;
      const marco = tira.parentElement;
      const mb = marco ? marco.getBoundingClientRect() : null;
      res({
        colocada: !!tira.closest('[data-l]'),
        pos: getComputedStyle(tira.closest('[data-l]') || tira).position,
        multiplesQueRegalan: multiplesQueRegalan,
        scrollea: tira.scrollHeight > tira.clientHeight + 1,
        fueraDeLamina: sb ? Math.round(Math.max(tb.bottom - sb.bottom, sb.top - tb.top,
                                                tb.right - sb.right, sb.left - tb.left)) : null,
        fueraDelMarco: mb && marco.hasAttribute('data-l') ? Math.round(tb.bottom - mb.bottom) : null,
        contestada: item.classList.contains('is-answered'),
        senala: !!tira.querySelector('.es-la-correcta')
      });
    }, 600));
  }, [id, k]);

  const q = '[' + id + (nTiras > 1 ? ' · tira ' + (k + 1) : '') + '] ';
  if (!r.colocada) { fallos.push(q + 'la tira no está colocada con data-l/t/w/h'); continue; }
  if (r.pos !== 'absolute') {
    fallos.push(q + 'el elemento con data-l/t/w/h es "' + r.pos + '" y no "absolute":'
      + ' su left/top en px no hace nada y la tira cae fuera de la lámina');
  }
  if (r.scrollea) fallos.push(q + 'la tira contestada scrollea por dentro (regla del kit: nunca scroll)');
  if (r.fueraDeLamina !== null && r.fueraDeLamina > 1) {
    fallos.push(q + 'la tira se sale de la lámina ' + r.fueraDeLamina + 'px');
  }
  if (r.fueraDelMarco !== null && r.fueraDelMarco > 1) {
    fallos.push(q + 'la tira se sale de su banda ' + r.fueraDelMarco + 'px');
  }
  if (r.multiplesQueRegalan) {
    fallos.push(q + 'pregunta de opción múltiple con el ✓ de .d-repaso-btns--vf:'
      + ' señala la correcta antes de contestar');
  }
  if (!r.contestada) fallos.push(q + 'se tocó una opción y la pregunta no quedó contestada');
  if (!r.senala) fallos.push(q + 'se contestó MAL y la tira no señala cuál era la correcta');
  }
}

await browser.close();
report('repaso-tira', fallos, errors);
