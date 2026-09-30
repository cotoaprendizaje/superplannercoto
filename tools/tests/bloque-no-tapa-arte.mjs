/* bloque-no-tapa-arte — un bloque marcado `data-no-tapa-arte` no puede
   caer encima del dibujo de la lámina. kit-base v1.9.105 (relevo de "Prevención cardiovascular").

   POR QUÉ EXISTE, y por qué cuenta PÍXELES y no coordenadas.

   En "Prevención cardiovascular" la tira de `Repaso rápido` se ubicó
   cinco veces antes de quedar bien, y en cada vuelta el cliente
   respondía lo mismo: *"mirá cómo quedó"*, *"no me gusta cómo quedó"*,
   *"yo quiero una opción que no tape la ill"*. Las cuatro primeras
   veces se había verificado con COORDENADAS —la banda declarada
   terminaba antes que la caja de la ilustración— y las cuatro veces
   estaba mal, porque:

     · la caja declarada de una ilustración es su HOTSPOT, no su
       dibujo: el hotspot es generoso a propósito;
     · `place()` escribe px contra el arte y el `.slide` no mide
       exactamente el lienzo 2:1, así que lo renderizado cae ~1 punto
       más abajo de lo escrito;
     · y el dibujo deja un fleco de antialias y ruido de compresión
       WebP que ninguna coordenada declara.

   La verificación que sí cerró el tema fue contar, sobre el .webp de la
   lámina, cuántos píxeles de DIBUJO caen dentro del rectángulo
   RENDERIZADO del bloque. Medido en los 6 factores x 2 estados: daba
   228 píxeles en diabetes con las coordenadas "bien", y 0 recién
   después de limpiar el arte. Este test es esa cuenta, automatizada.

   MARCADO
   -------
   En el bloque colocado (el que lleva `data-l/t/w/h`):

     <div class="d-repaso-marco" data-place data-no-tapa-arte
          data-l="…" data-t="…" data-w="…" data-h="…"> … </div>

   Es OPT-IN: sin el atributo, este test no mira nada. La mayoría de los
   overlays del kit están pensados para ir ENCIMA del arte (un cartel de
   dato, una ficha, una guía) y ahí taparlo es lo correcto. El atributo
   es para el caso contrario: un bloque permanente que el cliente quiere
   fuera del dibujo.

   ESTADOS
   -------
   Un bloque puede crecer (una tarjeta que despliega su devolución al
   contestar), así que se mide en el estado que trae y, si el bloque
   tiene opciones de repaso sin contestar, TAMBIÉN después de
   contestarlas — que es el estado más alto y el que se escapa.

   AUTOCHEQUEO (agregado al subir al kit)
   ----------------------------------------
   Sin bloques marcados, la versión del curso salía en verde sin medir
   nada — y el curso de prueba del kit no tiene ninguno. Así que ahora,
   SIEMPRE, antes de mirar el curso, el test inyecta una lámina propia
   dibujada en un canvas (fondo liso, un "texto" a la izquierda y un
   dibujo a la derecha) con DOS bloques: uno en el hueco libre, que
   tiene que dar 0, y otro encima del dibujo, que tiene que detectarse.
   Si no detecta el segundo, el que está roto es el test.

   Uso: node tools/tests/bloque-no-tapa-arte.mjs <url>  */
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();

/* Tolerancia en píxeles de dibujo. CERO a propósito: el pedido que dio
   origen al test fue literal ("que no tape la ilustración"), y un
   umbral "chico" es justamente lo que dejó pasar los 228 píxeles de la
   vuelta anterior — que eran invisibles, pero cuando se los busca con
   un umbral se termina discutiendo el umbral en vez del arte. */
const TOLERANCIA = 0;

const fallos = [];
const notas = [];
const { browser, page, errors } = await openCourse(url);
await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(() => {});

const slides = await page.evaluate(() => {
  document.querySelectorAll('[data-slide]').forEach(s => {
    s.removeAttribute('data-require-seen');
    s.removeAttribute('data-require-popups');
    s.removeAttribute('data-gate-popup');
    s.removeAttribute('data-intro-popup');
  });
  return [...document.querySelectorAll('[data-slide]')]
    .filter(s => s.querySelector('[data-no-tapa-arte]'))
    .map(s => s.getAttribute('data-slide'));
});


/* Cuenta los píxeles de dibujo del arte que caen dentro del rectángulo
   del bloque. Se hace EN LA PÁGINA porque ahí están a la vez el
   rectángulo renderizado y el .webp ya decodificado: el arte se dibuja
   en un canvas a su tamaño natural (mismo origen, así que no se
   contamina) y se mapea el rectángulo a coordenadas del arte.
   "Dibujo" = lo que se aparta del color de FONDO, y el fondo se toma
   del propio arte (la esquina superior izquierda del área del bloque,
   unos píxeles más arriba), no de un blanco asumido. */
async function medir(id) {
  return page.evaluate(({ id, TOL }) => {
    const sl = id === '#zz-fixture' ? document.getElementById('zz-fixture')
      : document.querySelector('[data-slide="' + id + '"]');
    const shot = sl.querySelector('[data-shot]');
    const img = shot && shot.querySelector('.d-shot-img');
    if (!img || !img.naturalWidth) return { no: 'la lámina no tiene .d-shot-img decodificada' };
    const sb = shot.getBoundingClientRect();
    const W = img.naturalWidth, H = img.naturalHeight;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const cx = cv.getContext('2d');
    cx.drawImage(img, 0, 0, W, H);

    /* ---- Color de FONDO del arte ----
       Se toma el color MÁS FRECUENTE del borde exterior de la lámina
       (1,5% de cada lado), que es el papel.
       ⚠️ La primera versión lo muestreaba unos píxeles ARRIBA del
       bloque, en su misma columna, con la idea de "el color contra el
       que este dibujo contrasta". MEDIDO: en la lámina de diabetes esa
       muestra cae sobre la MANO de la ilustración (rgb(254,172,134)),
       así que el test tomaba piel como fondo y reportaba que el bloque
       tapaba el 100% de su área. Un test que falla por leer mal el
       fondo es peor que no tenerlo: manda a mover un bloque que estaba
       bien. El borde de la lámina no tiene dibujo por definición. */
    const fondo = (() => {
      const bw = Math.max(2, Math.round(W * 0.015)), bh = Math.max(2, Math.round(H * 0.015));
      const trozos = [ cx.getImageData(0, 0, W, bh).data,
                       cx.getImageData(0, H - bh, W, bh).data,
                       cx.getImageData(0, 0, bw, H).data,
                       cx.getImageData(W - bw, 0, bw, H).data ];
      const cuenta = new Map();
      for (const d of trozos) {
        for (let i = 0; i < d.length; i += 4) {
          // se agrupa de a 8 niveles para que el ruido de compresión no
          // parta el mismo color en veinte claves distintas
          const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
          cuenta.set(k, (cuenta.get(k) || 0) + 1);
        }
      }
      let mejor = 0, mk = 0;
      for (const [k, n] of cuenta) if (n > mejor) { mejor = n; mk = k; }
      return [ ((mk >> 10) & 31) << 3 | 4, ((mk >> 5) & 31) << 3 | 4, (mk & 31) << 3 | 4 ];
    })();

    const out = [];
    for (const b of sl.querySelectorAll('[data-no-tapa-arte]')) {
      if (b.hidden || !b.getBoundingClientRect().width) continue;
      const r = b.getBoundingClientRect();
      const x0 = Math.max(0, Math.round((r.left - sb.left) / sb.width * W));
      const y0 = Math.max(0, Math.round((r.top - sb.top) / sb.height * H));
      const x1 = Math.min(W, Math.round((r.right - sb.left) / sb.width * W));
      const y1 = Math.min(H, Math.round((r.bottom - sb.top) / sb.height * H));
      if (x1 <= x0 || y1 <= y0) continue;
      const m = fondo;
      const d = cx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
      let n = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (Math.abs(d[i] - m[0]) + Math.abs(d[i + 1] - m[1]) + Math.abs(d[i + 2] - m[2]) > 24) n++;
      }
      out.push({
        sel: b.className || b.tagName.toLowerCase(),
        pixeles: n, area: (x1 - x0) * (y1 - y0),
        fondo: [m[0], m[1], m[2]],
        caja: [ +((r.left - sb.left) / sb.width * 100).toFixed(2), +((r.top - sb.top) / sb.height * 100).toFixed(2),
                +((r.right - sb.left) / sb.width * 100).toFixed(2), +((r.bottom - sb.top) / sb.height * 100).toFixed(2) ]
      });
    }
    return { bloques: out };
  }, { id, TOL: TOLERANCIA });
}

/* ---- Autochequeo: el detector ve el dibujo, y no ve dibujo donde no hay ---- */
await page.evaluate(() => {
  const W = 800, H = 400, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.fillStyle = '#fafaf8'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#28324a'; for (let i = 0; i < 6; i++) x.fillRect(60, 100 + i * 22, 260, 9);
  x.fillStyle = '#e6785a'; x.beginPath(); x.ellipse(600, 170, 110, 120, 0, 0, Math.PI * 2); x.fill();
  const f = document.createElement('div');
  f.id = 'zz-fixture';
  f.style.cssText = 'position:fixed;left:0;top:0;width:800px;height:400px;z-index:2147483000;background:#fff';
  f.innerHTML = '<div data-shot style="position:absolute;inset:0">' +
    '<img class="d-shot-img" alt="" style="display:block;width:100%;height:100%" src="' + c.toDataURL('image/png') + '">' +
    '<div class="zz-libre" data-no-tapa-arte style="position:absolute;left:62%;top:78%;width:26%;height:14%"></div>' +
    '<div class="zz-encima" data-no-tapa-arte style="position:absolute;left:66%;top:30%;width:18%;height:20%"></div></div>';
  document.body.appendChild(f);
  return new Promise(r => { const i = f.querySelector('img'); if (i.complete) r(); else i.onload = r; });
});
{
  const r = await medir('#zz-fixture');
  const libre = r.bloques && r.bloques.find(b => b.sel === 'zz-libre');
  const encima = r.bloques && r.bloques.find(b => b.sel === 'zz-encima');
  if (r.no || !libre || !encima) fallos.push('autochequeo: no se pudo medir la lámina de prueba (' + (r.no || 'faltan bloques') + ')');
  else {
    if (libre.pixeles !== 0) fallos.push(`autochequeo: un bloque sobre fondo liso da ${libre.pixeles} píxeles de dibujo: el test ve dibujo donde no hay y va a mandar a mover bloques que están bien.`);
    if (encima.pixeles === 0) fallos.push('autochequeo: un bloque ENCIMA del dibujo da 0 píxeles: el test no ve el dibujo y su verde no vale nada.');
  }
  await page.evaluate(() => document.getElementById('zz-fixture').remove());
}
if (!slides.length) notas.push('ningún bloque del curso lleva `data-no-tapa-arte`: se verificó solo el mecanismo, con la lámina de prueba');

let revisados = 0;
for (const id of slides) {
  for (const contestar of [false, true]) {
    await page.reload();
    await page.waitForTimeout(600);
    const listo = await page.evaluate(({ id, contestar }) => {
      document.querySelectorAll('[data-slide]').forEach(s => {
        s.removeAttribute('data-require-seen');
        s.removeAttribute('data-require-popups');
        s.removeAttribute('data-gate-popup');
        s.removeAttribute('data-intro-popup');
      });
      const sl = document.querySelector('[data-slide="' + id + '"]');
      if (!window.motor) return false;
      window.motor.go([...document.querySelectorAll('[data-slide]')].indexOf(sl));
      return true;
    }, { id, contestar });
    if (!listo) { notas.push('[' + id + '] no hay motor'); continue; }
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape').catch(() => {});
    /* El bloque puede estar oculto por progreso (un video sin ver, un
       gate). Se destapa a mano toda su cadena: lo que se mide es la
       CAJA, no la condición que la revela. */
    const hay = await page.evaluate(({ id, contestar }) => {
      const sl = document.querySelector('[data-slide="' + id + '"]');
      let algo = false;
      for (const b of sl.querySelectorAll('[data-no-tapa-arte]')) {
        let n = b;
        while (n && n !== sl) { n.hidden = false; n = n.parentElement; }
        algo = true;
        if (contestar) {
          const it = b.querySelector('[data-repaso-item]');
          const ok = it && it.getAttribute('data-repaso-ok');
          const btn = it && it.querySelector('[data-repaso-ans="' + ok + '"]');
          if (btn) btn.click();
        }
      }
      return algo;
    }, { id, contestar });
    if (!hay) continue;
    await page.waitForTimeout(650);

    const r = await medir(id);
    if (r.no) { fallos.push('[' + id + '] ' + r.no); continue; }
    for (const b of r.bloques) {
      revisados++;
      if (b.pixeles > TOLERANCIA) {
        fallos.push('[' + id + (contestar ? ' · contestado' : '') + '] `' + b.sel + '` tapa '
          + b.pixeles + ' píxel(es) de dibujo (' + (b.pixeles / b.area * 100).toFixed(2)
          + '% de su área; fondo rgb(' + b.fondo.join(',') + '); caja '
          + b.caja[0] + '-' + b.caja[2] + '% / ' + b.caja[1] + '-' + b.caja[3] + '%)');
      }
    }
  }
}

if (errors.length) fallos.push('errores de consola: ' + errors.join(' | '));
await browser.close();

notas.forEach(n => console.log('  ⓘ ' + n));
if (slides.length) console.log('  ⓘ ' + revisados + ' medición(es) sobre bloques del curso');
report('bloque-no-tapa-arte', fallos);
