/* tira-suelta.mjs — en iPad vertical la tira de repaso colocada SALE del
   lienzo a la franja libre de abajo, en vez de quedar con scroll tapando
   el dibujo (kit-base v1.9.120, segundo relevo de "Prevención
   cardiovascular").

   El CSS de `.d-repaso-marco--suelto` está en el kit desde v1.9.107,
   pero la lógica que decide cuándo usarlo vivía solo en el `curso.js`
   de cardio: un curso nuevo tenía la regla y no el comportamiento.
   Desde v1.9.120 la trae `initRepasoRapido` (`acomodarTirasSueltas`).

   El test arma su propia lámina 2:1 con una tira colocada en un
   `.d-repaso-marco`, en una diapositiva común, y la mide en dos pantallas:
     · iPad vertical (820×1180): tiene que salir (`--suelto`), entrar sin
       scroll y quedar dentro de la pantalla;
     · escritorio (1600×900): se queda sobre la lámina, como se aprobó. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

const CASOS = [
  { nombre: 'iPad vertical 820×1180', ctx: { viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true }, suelta: true },
  { nombre: 'escritorio 1600×900', ctx: { viewport: { width: 1600, height: 900 } }, suelta: false },
  /* Teléfono apaisado (v1.9.121, §7.70): ni banda ni franja libre. Por
     decisión del cliente, sin scroll: la tira pasa a ser un botón y se
     abre entera en una capa. */
  { nombre: 'iPhone apaisado 844×390', ctx: { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true }, pop: true }
];

for (const c of CASOS) {
  const context = await browser.newContext(c.ctx);
  const page = await context.newPage();
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.goto(url);
  await page.waitForTimeout(700);
  await page.keyboard.press('Escape').catch(() => {});

  const id = await page.evaluate(() => {
    if (typeof window.initRepasoRapido !== 'function') return { no: 'el curso no carga `initRepasoRapido` (coto-ui.js)' };
    const slides = [...document.querySelectorAll('[data-slide]')];
    const comun = slides.filter((s, i) => i > 0 && !s.matches('.d-shot-slide, .slide-cierre') && !s.querySelector('[data-shot]'));
    const sl = comun[Math.min(2, comun.length - 1)];
    if (!sl) return { salta: true };
    sl.removeAttribute('data-require-seen'); sl.removeAttribute('data-require-popups');
    const arte = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720"><rect width="1440" height="720" fill="#eef"/></svg>');
    const shot = document.createElement('div');
    shot.className = 'd-shot'; shot.setAttribute('data-shot', '');
    shot.innerHTML = '<img class="d-shot-img" src="' + arte + '" alt="">' +
      '<div class="d-repaso-marco" id="zz-marco" data-place data-l="54" data-t="62" data-w="42" data-h="30">' +
      '<div class="d-repaso" data-repaso>' +
      '<b class="d-repaso-title">Repaso rápido<span class="d-repaso-nav"><button class="d-repaso-arrow" data-repaso-prev>‹</button>' +
      '<span class="d-repaso-count" data-repaso-count>0 de 1</span><button class="d-repaso-arrow" data-repaso-nextq>›</button></span></b>' +
      '<div class="d-repaso-item" data-repaso-item data-repaso-n="1" data-repaso-id="zz-suelta" data-repaso-ok="true">' +
      '<p class="d-repaso-q">¿Cuál de estos es un factor de riesgo que se puede modificar con hábitos diarios?</p>' +
      '<div class="d-repaso-btns d-repaso-btns--col">' +
      '<button data-repaso-ans="false">La edad, que avanza para todos por igual</button>' +
      '<button data-repaso-ans="true">El sedentarismo y la falta de actividad física</button>' +
      '<button data-repaso-ans="false">Los antecedentes familiares directos</button></div>' +
      '<p class="d-repaso-fb" data-repaso-fb hidden>El sedentarismo se puede cambiar.</p></div></div></div>';
    /* La lámina de prueba tiene que ser LA diapositiva, como una real:
       se esconde lo que la diapositiva ya traía. MEDIDO en cardio: la
       elegida era la de la práctica, y su contenido le dejaba a la lámina
       un lugar que no es el de ninguna lámina del molde. */
    [...sl.children].forEach((ch) => { ch.style.display = 'none'; });
    sl.appendChild(shot);
    /* El motor registra la lámina ANTES de que la tira se suelte, como en
       un curso real (registra al arrancar): así queda capturada en su
       `place()` y se puede ver si la sigue escribiendo después. */
    if (window.motor && window.motor._initShots) window.motor._initShots();
    window.initRepasoRapido({});
    return sl.getAttribute('data-slide');
  });
  if (id && id.no) { fallos.push(`${c.nombre}: ${id.no}`); await context.close(); continue; }
  if (id && id.salta) {
    /* Todas sus diapositivas ya tienen lámina (alimentaria): no hay dónde
       armar una de prueba sin pisar la del curso. */
    console.log(`  · ${c.nombre}: el curso no tiene una diapositiva común donde armar la lámina de prueba: nada que medir.`);
    await context.close(); continue;
  }

  await page.evaluate((sid) => {
    const i = [...document.querySelectorAll('[data-slide]')].findIndex((s) => s.getAttribute('data-slide') === sid);
    window.motor.go(i, true);
  }, id);
  await page.waitForTimeout(900);

  /* Un cambio de tamaño con la tira ya suelta: el motor NO tiene que
     volver a escribirle left/top/width/height en línea (v1.9.121, §7.70).
     Hasta v1.9.120 lo hacía, y por eso `--suelto` necesitaba !important. */
  await page.setViewportSize({ width: c.ctx.viewport.width - 10, height: c.ctx.viewport.height });
  await page.waitForTimeout(400);
  /* …y al irse y volver a la diapositiva, que es cuando el motor vuelve
     a medir TODO lo que capturó (`slidechange` → `remedir`). */
  await page.evaluate((sid) => {
    const sl = [...document.querySelectorAll('[data-slide]')];
    const i = sl.findIndex((s) => s.getAttribute('data-slide') === sid);
    window.motor.go(i > 0 ? i - 1 : i + 1, true);
  }, id);
  await page.waitForTimeout(400);
  await page.evaluate((sid) => {
    const i = [...document.querySelectorAll('[data-slide]')].findIndex((s) => s.getAttribute('data-slide') === sid);
    window.motor.go(i, true);
  }, id);
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const m = document.getElementById('zz-marco');
    const t = m.querySelector('.d-repaso');
    const q = t.getBoundingClientRect();
    return { suelta: m.classList.contains('d-repaso-marco--suelto'), enLinea: m.style.left || m.style.width,
      scroll: t.scrollHeight - t.clientHeight, abajo: Math.round(q.bottom - innerHeight) };
  });
  if (c.pop) {
    const p = await page.evaluate(async () => {
      const m = document.getElementById('zz-marco');
      const b = m.querySelector('.d-repaso-abrir');
      if (!b || !m.classList.contains('d-repaso-marco--pop')) {
        const t = m.querySelector('.d-repaso');
        return { sinPop: true, scroll: t ? t.scrollHeight - t.clientHeight : null };
      }
      b.click();
      await new Promise((r) => setTimeout(r, 300));
      const capa = document.querySelector('.d-repaso-capa');
      const t = capa && capa.querySelector('.d-repaso');
      const q = t && t.getBoundingClientRect();
      const res = { capa: !!t, scroll: t ? t.scrollHeight - t.clientHeight : null,
        dentro: q ? q.top >= -1 && q.bottom <= innerHeight + 1 : false };
      capa.querySelector('.d-repaso-capa-listo').click();
      await new Promise((r) => setTimeout(r, 200));
      res.volvio = !!m.querySelector('.d-repaso') && !document.querySelector('.d-repaso-capa');
      return res;
    });
    if (p.sinPop) fallos.push(`${c.nombre}: la tira no entra y quedó sin botón para abrirla (${p.scroll}px de scroll dentro del marco): el cliente decidió que no haya scroll nunca.`);
    else {
      if (!p.capa) fallos.push(`${c.nombre}: el botón "Repaso rápido" no abrió la tira en la capa.`);
      else {
        if (p.scroll > 3) fallos.push(`${c.nombre}: abierta en la capa, la tira tiene ${p.scroll}px de scroll.`);
        if (!p.dentro) fallos.push(`${c.nombre}: abierta en la capa, la tira se sale de la pantalla.`);
      }
      if (!p.volvio) fallos.push(`${c.nombre}: al tocar "Listo" la tira no volvió a su marco (o la capa quedó abierta).`);
    }
  } else if (c.suelta) {
    if (!r.suelta) fallos.push(`${c.nombre}: la tira se quedó dentro de la banda de la lámina (sin \`--suelto\`), con ${r.scroll}px de scroll: tapa el dibujo y las opciones quedan cortadas.`);
    else {
      /* 3px de tolerancia: el borde y el redondeo del alto en px dejan
         1–2px de `scrollHeight` sobrante sin nada cortado. */
      if (r.scroll > 3) fallos.push(`${c.nombre}: la tira salió a la franja libre pero sigue con ${r.scroll}px de scroll.`);
      if (r.enLinea) fallos.push(`${c.nombre}: con la tira suelta, el motor le volvió a escribir posición en línea (${r.enLinea}) al cambiar el tamaño: sacarle \`data-place\` no la libera.`);
      if (r.abajo > 0) fallos.push(`${c.nombre}: la tira suelta se pasa ${r.abajo}px por debajo de la pantalla.`);
    }
  } else if (r.suelta) {
    fallos.push(`${c.nombre}: la tira salió del lienzo y acá entra en su banda: tiene que quedarse sobre la lámina.`);
  }
  if (errores.length) fallos.push(...errores.map((e) => `${c.nombre}: error de consola: ${e}`));
  await context.close();
}

await browser.close();
report('tira-suelta', fallos);
