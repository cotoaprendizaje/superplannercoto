/* curso-datos.mjs — el curso como datos (kit-base v1.9.111, Fase 1).

   Un curso se describe en DOS archivos:
     · `curso.json`  — el CONTENIDO: diapositivas, zonas tocables,
                       locución, índice, glosario y fichas (pop-ups).
     · `marco.html`  — todo lo demás del `index.html` (barra superior,
                       botones flotantes, ventanas fijas, scripts), con
                       huecos `<!--{{...}}-->` donde va el contenido.
   `armar-curso.mjs` junta los dos y escribe el `index.html`;
   `extraer-curso.mjs` hace el camino inverso desde un curso hecho a mano.

   Este módulo son SOLO funciones puras que devuelven texto: las usa el
   armador en Node y el extractor DENTRO del navegador (para rearmar cada
   pieza y compararla con la original antes de darla por convertida). Por
   eso no importa nada.

   Los campos de texto (`titulo`, `texto`, `def`, `cuerpo`, `html`…) son
   HTML: admiten <b>, entidades, etc. Los que van a un ATRIBUTO
   (`tituloVideo`, `etiqueta`…) son texto plano y se escapan acá.

   Cualquier pieza que el formato todavía no modela viaja como
   `{ "tipo": "html", "html": "…" }`: se reproduce tal cual. Es la salida
   de emergencia que permite convertir un curso entero sin perder nada, y
   lo que cada versión de la Fase 1 va achicando. */

export const HUECOS = {
  diapositivas: '<!--{{DIAPOSITIVAS}}-->',
  indice: '<!--{{INDICE}}-->',
  glosario: '<!--{{GLOSARIO}}-->',
  fichas: '<!--{{FICHAS}}-->',
  datos: '<!--{{DATOS}}-->',
  total: '{{TOTAL}}'
};

/* Lo que el curso usa desde `curso.js` y no es marcado (v1.9.113): el
   banco de la mini práctica, los logros, las medallas. Viajan dentro del
   index como un bloque `<script type="application/json"
   id="d-curso-datos">` —el navegador no lo ejecuta— y `curso.js` los lee
   con `datosDelCurso('practica')` (coto-ui.js). Así el contenido sale de
   `curso.js` sin que el curso tenga que cargar un archivo aparte (un
   `fetch` de un .json no anda abriendo el curso desde el disco). */
export const CLAVES_DATOS = ['practica', 'logros', 'medallas'];

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function attrs(obj) {
  let out = '';
  for (const [k, v] of Object.entries(obj || {})) {
    if (v === false || v == null) continue;
    out += v === true || v === '' ? ` ${k}` : ` ${k}="${esc(v)}"`;
  }
  return out;
}

function pos(z) {
  return { 'data-l': z.l, 'data-t': z.t, 'data-w': z.w, 'data-h': z.h };
}

function datos(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) out['data-' + k] = v;
  return out;
}

function clases(base, extra) {
  return extra ? base + ' ' + extra : base;
}

function estiloPlay(p) {
  return `--play:${p.tam}; --play-x:${p.x}; --play-y:${p.y}`;
}

/* ---------- zonas tocables sobre la lámina ---------- */

export function armarZona(z, ind = '        ') {
  if (z.tipo === 'html') return ind + z.html;
  const sr = `<span class="sr-only">${z.texto}</span>`;
  if (z.tipo === 'popup' || z.tipo === 'boton') {
    const d = z.tipo === 'popup' ? { 'data-popup-trigger': z.abre } : datos(z.datos);
    return `${ind}<button${attrs({ class: clases('d-shot-hit', z.clase), 'data-hit': true, ...d, ...pos(z) })}>\n` +
      `${ind}  ${sr}\n${ind}</button>`;
  }
  if (z.tipo === 'video') {
    return `${ind}<button${attrs({ class: clases('d-shot-hit', z.clase), 'data-hit': true, 'data-video-play': true,
      'data-video': z.video, 'data-video-title': z.tituloVideo, ...pos(z) })}>\n` +
      `${ind}  ${sr}\n` +
      `${ind}  <span class="d-shot-hit-play d-shot-hit-play--marca" aria-hidden="true" style="${estiloPlay(z.play)}">\n` +
      `${ind}    <img src="img/reproductor-play.webp" alt="">\n${ind}  </span>\n${ind}</button>`;
  }
  if (z.tipo === 'video-circulo') {
    let c = 'd-shot-hit d-shot-hit--circle d-shot-hit--video';
    if (z.encuadre) c += ' d-shot-hit--encuadre';
    if (z.aro === false) c += ' d-shot-hit--sin-aro';
    return `${ind}<div${attrs({ class: clases(c, z.clase), style: z.encuadre ? `--encuadre: ${z.encuadre}` : null,
      'data-hit': true, 'data-inline-video': true, 'data-video': z.video, 'data-video-title': z.tituloVideo, ...pos(z) })}>\n` +
      `${ind}  <video class="d-shot-hit-video" playsinline preload="metadata" tabindex="-1"><source src="${esc(z.video)}" type="video/mp4"></video>\n` +
      `${ind}  <button class="d-shot-hit-play d-shot-hit-play--marca" type="button" style="${estiloPlay(z.play)}">\n` +
      `${ind}    <img src="img/reproductor-play.webp" alt="" aria-hidden="true">\n` +
      `${ind}    ${sr}\n${ind}  </button>\n${ind}</div>`;
  }
  throw new Error(`zona de tipo desconocido: "${z.tipo}"`);
}

/* ---------- locución (el bloque `.sr-only` de la diapositiva) ---------- */

export function armarNarracion(n, ind = '      ') {
  if (!n) return '';
  if (n.html != null) return `${ind}${n.html}\n`;
  const filas = n.map((b) => {
    if (b.lista) return `${ind}  <ul>\n` + b.lista.map((li) => `${ind}    <li>${li}</li>\n`).join('') + `${ind}  </ul>`;
    return `${ind}  <p${b.saltear ? ' data-narrate-skip' : ''}>${b.texto}</p>`;
  });
  return `${ind}<div class="sr-only">\n${filas.join('\n')}\n${ind}</div>\n`;
}

/* ---------- diapositivas ---------- */

const CLASE_TIPO = {
  lamina: 'slide d-shot-slide d-shot-slide--bg-layered',
  'video-fondo': 'slide d-shot-slide d-shot-slide--bg-video',
  practica: 'slide',
  cierre: 'slide slide-cierre d-shot-slide'
};

/* ---------- el cierre (v1.9.114) ----------
   El patrón de los cinco cursos auditados: la lámina final (paso
   "shot") y, al tocar Siguiente, el resumen (paso "summary") con la
   medalla, sus rangos, los números del alumno, una nota, los botones y
   un repaso del curso. Lo arma `coto-cierre.js`; acá solo el marcado.

   Los RANGOS de medalla repetían a mano los umbrales de `medallas`
   ("130 puntos o más", "de 115 a 129", "menos de 115"). Si no se pasan,
   salen de `medallas`; un curso que los cuenta de otra forma ("los 5 de
   5 logros", PLU) los trae escritos en `rangos`. */
function capital(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
export function rangosPorDefecto(medallas) {
  const orden = (medallas || []).slice().sort((a, b) => b.desde - a.desde);
  return orden.map((m, k) => {
    let detalle;
    if (k === 0) detalle = `${m.desde} puntos o más`;
    else if (k === orden.length - 1) detalle = `menos de ${orden[k - 1].desde}`;
    else detalle = `de ${m.desde} a ${orden[k - 1].desde - 1}`;
    return { id: m.id, icono: m.icono, nombre: capital(m.nombre), detalle };
  });
}

export function armarCierre(d, ind, medallas) {
  const rangos = d.rangos || rangosPorDefecto(medallas);
  const et = d.rangosEtiqueta || 'i';
  const r = ind + '      ';
  let out = `${ind}  <h2 data-slide-title class="sr-only">${d.titulo}</h2>\n`;
  if (d.bloqueo != null) out += `${ind}  <p class="locked">${d.bloqueo}</p>\n`;
  out += `${ind}  <div class="d-cierre-shot" data-cierre-step="shot">\n` +
    `${ind}    <div class="d-shot" data-shot>\n` +
    `${ind}      <img class="d-shot-img" src="${esc(d.imagen)}" alt="" aria-hidden="true">\n` +
    `${ind}    </div>\n` + armarNarracion(d.narracion, ind + '    ') +
    `${ind}  </div>\n` +
    `${ind}  <div class="slide-inner d-cierre-summary" data-cierre-step="summary" hidden>\n` +
    `${ind}    <div class="d-cierre-cols">\n` +
    `${ind}      <div class="d-cierre-results">\n`;
  if (d.saludo) out += `${r}  <p class="who" hidden>¡Hola, <span id="d-cert-name"></span>! 👋</p>\n`;
  out += `${r}  <div class="d-medalla" data-medalla>\n` +
    `${r}    <div class="d-medalla-ic" data-medalla-ic aria-hidden="true">🥉</div>\n` +
    `${r}    <div>\n` +
    `${r}      <p class="d-medalla-tit">${d.rotuloMedalla ? '<span data-medalla-lbl>Medalla de</span>' : 'Medalla de'} <b data-medalla-nombre>bronce</b></p>\n` +
    `${r}      <p class="d-medalla-sub" data-medalla-sub></p>\n` +
    `${r}    </div>\n${r}  </div>\n` +
    `${r}  <ol class="d-medalla-rangos" data-medalla-rangos aria-label="Cómo se obtiene cada medalla">\n` +
    rangos.map((g) => `${r}    <li data-rango="${esc(g.id)}"><span aria-hidden="true">${g.icono}</span><b>${g.nombre}</b><${et}>${g.detalle}</${et}></li>\n`).join('') +
    `${r}  </ol>\n` +
    `${r}  <div class="d-cert-stats">\n` +
    (d.numeros || []).map((n) => `${r}    <div class="s"><b id="${esc(n.id)}">–</b><span>${n.rotulo}</span></div>\n`).join('') +
    `${r}  </div>\n`;
  if (d.nota != null) out += `${r}  <p class="d-cert-note">${d.nota}</p>\n`;
  out += `${r}  <div class="cta">\n` +
    `${r}    <button class="btn btn-cat" type="button" data-popup-trigger="logros">Ver mis logros 🏆</button>\n` +
    `${r}    <button class="btn btn-cat-ghost" type="button" id="d-summary-print" title="Abre el diálogo de impresión: elegí &quot;Guardar como PDF&quot; para descargarlo">${d.imprimir || 'Imprimir resumen 📄'}</button>\n` +
    `${r}  </div>\n` +
    `${ind}      </div>\n` +
    `${ind}      <div class="d-cierre-recap">\n${ind}        ${d.repaso}\n${ind}      </div>\n` +
    `${ind}    </div>\n${ind}  </div>\n`;
  if (d.confeti) out += `${ind}  <div class="d-confetti" id="d-confetti" aria-hidden="true"></div>\n`;
  return out;
}

function atributosSlide(d, i) {
  const r = d.requisitos || {};
  return {
    class: d.tipo === 'html' ? d.clase : CLASE_TIPO[d.tipo],
    'data-autoadvance': d.avanceSolo ? true : null,
    'data-slide': d.id,
    'data-slide-index': i,
    'data-require-popups': r.popups ? r.popups.join(' ') : null,
    'data-require-seen': r.visto ? r.visto.join(' ') : null,
    'data-gate-popup': r.popupAntes || null,
    'data-slide-end': d.fin ? true : null,
    ...(d.atributos || {})
  };
}

export function armarDiapositiva(d, i, ind = '    ', medallas) {
  const abre = `${ind}<section${attrs(atributosSlide(d, i))}>\n`;
  const cierra = `${ind}</section>`;
  if (d.tipo === 'html') return abre + `${ind}  ${d.html}\n` + cierra;
  /* La mini práctica: el título se VE (no es `sr-only`), la bajada no se
     narra, y `aviso` es HTML libre que va entre la bajada y las
     preguntas (cardio pone ahí "esto no es la evaluación del curso").
     Las preguntas no van acá: son `practica.banco`, en los datos. */
  if (d.tipo === 'cierre') return abre + armarCierre(d, ind, medallas) + cierra;
  if (d.tipo === 'practica') {
    return abre + `${ind}  <div class="slide-inner">\n` +
      (d.antetitulo != null ? `${ind}    <span class="slide-eyebrow">${d.antetitulo}</span>\n` : '') +
      `${ind}    <h2 data-slide-title>${d.titulo}</h2>\n` +
      (d.bajada != null ? `${ind}    <p class="slide-lead" data-narrate-skip>${d.bajada}</p>\n` : '') +
      (d.aviso != null ? `${ind}    ${d.aviso}\n` : '') +
      `${ind}    <div data-quiz></div>\n${ind}  </div>\n` + cierra;
  }
  const h2 = `${ind}  <h2 data-slide-title class="sr-only">${d.titulo}</h2>\n`;
  let shot;
  if (d.tipo === 'lamina') {
    shot = `${ind}  <div class="d-shot" data-shot>\n` +
      `${ind}    <img class="d-shot-img" src="${esc(d.imagen)}" alt="" aria-hidden="true">\n` +
      (d.zonas || []).map((z) => armarZona(z, ind + '    ') + '\n').join('') +
      `${ind}  </div>\n`;
  } else if (d.tipo === 'video-fondo') {
    shot = `${ind}  <div class="d-shot" data-shot>\n` +
      `${ind}    <video class="d-shot-video" playsinline preload="metadata" poster="${esc(d.poster)}" aria-hidden="true">\n` +
      `${ind}      <source src="${esc(d.video)}" type="video/mp4">\n${ind}    </video>\n` +
      `${ind}    <button class="d-shot-video-tap" type="button" hidden></button>\n` +
      `${ind}  </div>\n`;
  } else {
    throw new Error(`diapositiva "${d.id}": tipo desconocido "${d.tipo}"`);
  }
  return abre + h2 + shot + armarNarracion(d.narracion, ind + '  ') + cierra;
}

export function armarDiapositivas(lista, ind = '    ', medallas) {
  return lista.map((d, i) => {
    const rotulo = d.tipo === 'html' ? d.id : String(d.titulo).replace(/<[^>]+>/g, '');
    return `${ind}<!-- ${i} · ${rotulo.replace(/--/g, '—')} -->\n` + armarDiapositiva(d, i, ind, medallas);
  }).join('\n\n');
}

/* ---------- índice lateral ---------- */

const CHECK = '<svg class="ix-ck" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-check"/></svg>';

export function armarIndice(ix, ind = '        ') {
  if (ix.html != null) return ix.html;
  let out = `${ind}<p id="d-sidenav-progress" class="d-sidenav-progress" aria-live="polite"></p>\n`;
  if (ix.objetivos && ix.objetivos.length) {
    out += `${ind}<div class="d-obj-progress" aria-live="polite">\n` +
      ix.objetivos.map((o) => `${ind}  <span class="d-obj-pip" data-obj-pip="${esc(o.letra)}" data-obj-check="${esc(o.diapo)}" title="${esc(o.letra + ' · ' + o.texto)}">${esc(o.letra)}</span>\n`).join('') +
      `${ind}  <span class="d-obj-progress-lbl" data-obj-lbl></span>\n${ind}</div>\n`;
  }
  for (const g of ix.grupos) {
    if (g.titulo != null) out += `${ind}<span class="d-sidenav-group">${g.titulo}</span>\n`;
    for (const it of g.items) {
      out += `${ind}<button${attrs({ class: 'd-sidenav-item', type: 'button', 'data-goto': it.diapo, 'data-icono-tipo': it.tipo || null })}>` +
        `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><use href="#${esc(it.icono)}"/></svg><span>${it.rotulo}</span>${CHECK}</button>\n`;
    }
  }
  return out.replace(/\n$/, '');
}

/* ---------- glosario ---------- */

const CANDADO = '<svg class="d-gloss-lock-ic" data-gloss-lock aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

/* La pista por defecto nombra la diapositiva donde se explica el término,
   con el mismo título que dice la locución. Un término cuya pista diga
   otra cosa la trae escrita en `pista`. */
export function pistaPorDefecto(titulo) {
  return `Se desbloquea al llegar a &ldquo;${titulo}&rdquo;.`;
}

export function armarGlosario(lista, titulos, ind = '          ') {
  if (lista.html != null) return lista.html;
  return lista.map((t) => {
    const pista = t.pista != null ? t.pista : pistaPorDefecto(titulos[t.diapo]);
    return `${ind}<dt><button type="button" class="d-gloss-term-btn" data-goto="${esc(t.diapo)}">${t.termino}</button>${CANDADO}</dt>` +
      `<dd><span class="d-gloss-def">${t.def}</span><span class="d-gloss-hint">${pista}</span></dd>`;
  }).join('\n');
}

/* ---------- fichas: los pop-ups de contenido ---------- */

export function armarFicha(f, ind = '  ') {
  if (f.tipo === 'html') return ind + f.html;
  return `${ind}<div class="modal" data-popup="${esc(f.id)}" role="dialog" aria-modal="true" aria-label="${esc(f.etiqueta)}">\n` +
    `${ind}  <div class="modal-back" data-popup-close></div>\n` +
    `${ind}  <div class="modal-card">\n` +
    `${ind}    <div class="modal-hd modal-hd--dark">\n` +
    `${ind}      <button class="modal-x" data-popup-close aria-label="Cerrar">✕</button>\n` +
    `${ind}      <h3 style="margin:0;color:inherit">${f.titulo}</h3>\n` +
    `${ind}    </div>\n` +
    `${ind}    <div class="${esc(clases('modal-bd', f.clase))}">\n` +
    `${ind}      ${f.cuerpo}\n` +
    `${ind}    </div>\n${ind}  </div>\n${ind}</div>`;
}

/* ---------- los datos para curso.js ---------- */

export function armarDatos(curso) {
  const datos = {};
  for (const k of CLAVES_DATOS) if (curso[k] !== undefined) datos[k] = curso[k];
  if (!Object.keys(datos).length) return '';
  // `<` escapado: un "</script>" dentro de un texto cerraría el bloque.
  const json = JSON.stringify(datos).replace(/</g, '\\u003c');
  return `<script type="application/json" id="d-curso-datos">${json}</script>`;
}

/* ---------- el index.html entero ---------- */

export function armarIndex(curso, marco) {
  const titulos = {};
  for (const d of curso.diapositivas) if (d.titulo != null) titulos[d.id] = d.titulo;
  /* El hueco de DATOS solo hace falta si hay datos: un marco anterior a
     v1.9.113 no lo tiene y sigue armando igual. */
  const datos = armarDatos(curso);
  const faltan = Object.entries(HUECOS)
    .filter(([k, h]) => k !== 'total' && !(k === 'datos' && !datos) && !marco.includes(h)).map(([, h]) => h);
  if (faltan.length) throw new Error('al marco le faltan los huecos ' + faltan.join(', '));
  const total = String(curso.diapositivas.length);
  /* Funciones de reemplazo, no strings: un `$` en el contenido (un precio,
     por ejemplo) se leería como patrón de `replace`. */
  return marco
    .replace(HUECOS.diapositivas, () => armarDiapositivas(curso.diapositivas, '    ', curso.medallas).replace(/^ {4}/, ''))
    .replace(HUECOS.indice, () => armarIndice(curso.indice).replace(/^ +/, ''))
    .replace(HUECOS.glosario, () => armarGlosario(curso.glosario, titulos).replace(/^ +/, ''))
    .replace(HUECOS.fichas, () => (curso.fichas || []).map((f) => armarFicha(f)).join('\n').replace(/^ +/, ''))
    .replace(HUECOS.datos, () => datos)
    .split(HUECOS.total).join(total);
}

/* ---------- comparación: ¿dos piezas de HTML son el mismo curso? ----------
   Solo en el navegador (usa el DOM). Ignora lo que no cambia nada para el
   alumno ni para el código: comentarios, sangría, orden de atributos y de
   clases, espacios dentro de `style`. Compara aparte el texto con los
   espacios colapsados, para que un espacio perdido entre dos palabras
   (`a <b>x</b>` → `a<b>x</b>`) no pase. */
export function huellaDom(raiz) {
  const filas = [];
  const paso = (n, prof) => {
    if (n.nodeType === 8) return;
    if (n.nodeType === 3) {
      const t = n.nodeValue.replace(/\s+/g, ' ').trim();
      if (t) filas.push(' '.repeat(prof) + '#' + t);
      return;
    }
    if (n.nodeType !== 1) return;
    const at = Array.from(n.attributes).map((a) => {
      let v = a.value;
      if (a.name === 'class') v = v.trim().split(/\s+/).sort().join(' ');
      if (a.name === 'style') v = v.replace(/\s+/g, '').replace(/;$/, '');
      // Las coordenadas son números: "70.00" y "70" son la misma zona.
      if (/^data-[ltwh]$/.test(a.name) && /^-?[\d.]+$/.test(v)) v = String(parseFloat(v));
      return a.name + '=' + JSON.stringify(v);
    }).sort();
    filas.push(' '.repeat(prof) + '<' + n.tagName.toLowerCase() + (at.length ? ' ' + at.join(' ') : '') + '>');
    const hijos = n.tagName === 'TEMPLATE' ? n.content.childNodes : n.childNodes;
    for (const h of hijos) paso(h, prof + 1);
  };
  paso(raiz, 0);
  const texto = (raiz.textContent || '').replace(/\s+/g, ' ').trim();
  return { filas, texto };
}

export function mismaHuella(a, b) {
  return a.texto === b.texto && a.filas.length === b.filas.length && a.filas.every((f, i) => f === b.filas[i]);
}
