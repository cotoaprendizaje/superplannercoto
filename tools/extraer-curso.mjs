#!/usr/bin/env node
/* extraer-curso.mjs — pasa un curso hecho a mano a datos (kit-base v1.9.111).

   Uso:
     node tools/extraer-curso.mjs <carpeta-del-curso>
   Lee `<carpeta>/index.html` y escribe, en la misma carpeta:
     · `curso.json` — el contenido (ver `tools/curso-datos.mjs`);
     · `marco.html` — el resto del index, con los huecos donde va.
   No toca el `index.html`. Para volver a armarlo: `armar-curso.mjs`.

   CADA PIEZA SE VERIFICA ANTES DE ACEPTARLA. El extractor lee la pieza
   (una zona, una locución, una diapositiva, el índice, el glosario, una
   ficha), la vuelve a armar con el MISMO código que usa el armador y la
   compara con la original (`huellaDom`: misma estructura, mismos
   atributos, mismo texto). Si no da igual, la pieza viaja como
   `{ "tipo": "html" }`, tal cual estaba. Así la conversión nunca pierde
   nada: lo peor que puede pasar es que una pieza quede sin modelar, y el
   informe dice cuáles.

   Al final arma el index entero desde los dos archivos y lo compara con
   el original. Si no da igual, sale con código 1 y no escribe nada.

   Lo que NO viaja: los comentarios HTML de las partes que pasan a datos
   (diapositivas, índice, glosario, fichas). Los del marco se quedan. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const carpeta = process.argv[2];
if (!carpeta) {
  console.error('Uso: node tools/extraer-curso.mjs <carpeta-del-curso>');
  process.exit(2);
}
const indexPath = path.join(carpeta, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`No existe ${indexPath}.`);
  process.exit(2);
}
const html = fs.readFileSync(indexPath, 'utf8');
const modulo = fs.readFileSync(path.join(AQUI, 'curso-datos.mjs'), 'utf8');

const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('about:blank');
await page.evaluate(async (src) => {
  const url = 'data:text/javascript;base64,' + btoa(unescape(encodeURIComponent(src)));
  window.CD = await import(url);
}, modulo);

const r = await page.evaluate((html) => { try {
  const CD = window.CD;
  const informe = { modeladas: [], comoHtml: [] };
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const sinComentarios = (el) => {
    const c = el.cloneNode(true);
    const it = document.createNodeIterator(c, NodeFilter.SHOW_COMMENT);
    const borrar = [];
    for (let n = it.nextNode(); n; n = it.nextNode()) borrar.push(n);
    borrar.forEach((n) => n.remove());
    return c;
  };
  const interno = (el) => sinComentarios(el).innerHTML.trim();
  const externo = (el) => sinComentarios(el).outerHTML;
  const desde = (s, envoltorio) => {
    const t = document.createElement('template');
    t.innerHTML = envoltorio ? `<${envoltorio}>${s}</${envoltorio}>` : s;
    return t.content.firstElementChild;
  };
  // El contenedor (el <nav>, el <dl>) queda en el marco: se compara el
  // contenido armado DENTRO de una copia vacía del contenedor original.
  const dentroDe = (el, interior) => { const c = el.cloneNode(false); c.innerHTML = interior; return c; };
  const igual = (original, armado) => !!armado && CD.mismaHuella(CD.huellaDom(original), CD.huellaDom(armado));
  const hijos = (el) => Array.from(el.children);

  /* ---- zonas ---- */
  const leerPlay = (el) => el && ({
    tam: el.style.getPropertyValue('--play').trim(),
    x: el.style.getPropertyValue('--play-x').trim(),
    y: el.style.getPropertyValue('--play-y').trim()
  });
  const posDe = (el) => {
    const n = (a) => { const v = el.getAttribute(a); return v != null && /^-?[\d.]+$/.test(v) ? parseFloat(v) : v; };
    return { l: n('data-l'), t: n('data-t'), w: n('data-w'), h: n('data-h') };
  };
  const claseExtra = (el, base) => {
    const extra = Array.from(el.classList).filter((c) => !base.includes(c));
    return extra.length ? extra.join(' ') : undefined;
  };
  function leerZona(el) {
    const sr = el.querySelector(':scope .sr-only');
    const texto = sr ? interno(sr) : undefined;
    let z = null;
    if (el.matches('button[data-video-play]')) {
      z = { tipo: 'video', video: el.getAttribute('data-video'), tituloVideo: el.getAttribute('data-video-title'),
        texto, play: leerPlay(el.querySelector('.d-shot-hit-play')), clase: claseExtra(el, ['d-shot-hit']), ...posDe(el) };
    } else if (el.matches('div[data-inline-video]')) {
      const base = ['d-shot-hit', 'd-shot-hit--circle', 'd-shot-hit--video', 'd-shot-hit--encuadre', 'd-shot-hit--sin-aro'];
      z = { tipo: 'video-circulo', video: el.getAttribute('data-video'), tituloVideo: el.getAttribute('data-video-title'),
        texto, play: leerPlay(el.querySelector('.d-shot-hit-play')),
        encuadre: el.classList.contains('d-shot-hit--encuadre') ? el.style.getPropertyValue('--encuadre').trim() : undefined,
        aro: el.classList.contains('d-shot-hit--sin-aro') ? false : undefined,
        clase: claseExtra(el, base), ...posDe(el) };
    } else if (el.matches('button.d-shot-hit[data-popup-trigger]')) {
      z = { tipo: 'popup', abre: el.getAttribute('data-popup-trigger'), texto, clase: claseExtra(el, ['d-shot-hit']), ...posDe(el) };
    } else if (el.matches('button.d-shot-hit')) {
      const datos = {};
      for (const a of el.attributes) {
        if (a.name.startsWith('data-') && !['data-hit', 'data-l', 'data-t', 'data-w', 'data-h'].includes(a.name)) datos[a.name.slice(5)] = a.value;
      }
      z = { tipo: 'boton', datos, texto, clase: claseExtra(el, ['d-shot-hit']), ...posDe(el) };
    }
    if (z) {
      let armado = null;
      try { armado = desde(CD.armarZona(z, '')); } catch (e) { armado = null; }
      if (igual(el, armado)) return z;
    }
    return { tipo: 'html', html: externo(el) };
  }

  /* ---- locución ---- */
  function leerNarracion(el) {
    const bloques = [];
    let ok = true;
    for (const h of hijos(el)) {
      const at = Array.from(h.attributes).map((a) => a.name);
      if (h.tagName === 'P' && at.every((a) => a === 'data-narrate-skip')) {
        bloques.push(h.hasAttribute('data-narrate-skip') ? { texto: interno(h), saltear: true } : { texto: interno(h) });
      } else if (h.tagName === 'UL' && !at.length && hijos(h).every((li) => li.tagName === 'LI' && !li.attributes.length)) {
        bloques.push({ lista: hijos(h).map(interno) });
      } else ok = false;
    }
    if (ok && el.attributes.length === 1 && el.className === 'sr-only' && igual(el, desde(CD.armarNarracion(bloques, '')))) return bloques;
    return { html: externo(el) };
  }

  /* ---- diapositivas ---- */
  const CONOCIDOS = ['class', 'data-slide', 'data-slide-index', 'data-autoadvance', 'data-require-popups',
    'data-require-seen', 'data-gate-popup', 'data-slide-end'];
  function comunes(sec) {
    const d = { id: sec.getAttribute('data-slide') };
    const h2 = sec.querySelector(':scope > h2[data-slide-title]');
    if (h2) d.titulo = interno(h2);
    const req = {};
    if (sec.hasAttribute('data-require-popups')) req.popups = sec.getAttribute('data-require-popups').trim().split(/\s+/);
    if (sec.hasAttribute('data-require-seen')) req.visto = sec.getAttribute('data-require-seen').trim().split(/\s+/);
    if (sec.hasAttribute('data-gate-popup')) req.popupAntes = sec.getAttribute('data-gate-popup');
    if (Object.keys(req).length) d.requisitos = req;
    if (sec.hasAttribute('data-autoadvance')) d.avanceSolo = true;
    if (sec.hasAttribute('data-slide-end')) d.fin = true;
    const otros = {};
    for (const a of sec.attributes) if (!CONOCIDOS.includes(a.name)) otros[a.name] = a.value;
    if (Object.keys(otros).length) d.atributos = otros;
    return d;
  }
  function leerDiapositiva(sec, i) {
    const base = comunes(sec);
    const cls = sec.getAttribute('class');
    const h = hijos(sec);
    const shot = h[1];
    const shotLimpio = shot && shot.matches('div.d-shot[data-shot]') && shot.attributes.length === 2 && shot.className === 'd-shot';
    const narr = h[2];
    const formaOk = h.length >= 2 && h.length <= 3 && h[0].matches('h2[data-slide-title].sr-only') && shotLimpio &&
      (!narr || narr.matches('div.sr-only'));
    let d = null;
    if (formaOk && cls === 'slide d-shot-slide d-shot-slide--bg-layered' && shot.firstElementChild &&
        shot.firstElementChild.matches('img.d-shot-img')) {
      d = { id: base.id, tipo: 'lamina', titulo: base.titulo, imagen: shot.firstElementChild.getAttribute('src'),
        zonas: hijos(shot).slice(1).map(leerZona) };
    } else if (formaOk && cls === 'slide d-shot-slide d-shot-slide--bg-video' && shot.children.length === 2 &&
        shot.children[0].matches('video.d-shot-video') && shot.children[1].matches('button.d-shot-video-tap')) {
      const v = shot.children[0];
      const s = v.querySelector('source');
      d = { id: base.id, tipo: 'video-fondo', titulo: base.titulo, video: s && s.getAttribute('src'), poster: v.getAttribute('poster') };
    } else if (cls === 'slide' && h.length === 1 && h[0].matches('div.slide-inner') && h[0].attributes.length === 1 &&
        h[0].lastElementChild && h[0].lastElementChild.matches('div[data-quiz]')) {
      /* La mini práctica: [antetítulo] título [bajada] [aviso] <div data-quiz>.
         El aviso es UN elemento cualquiera (HTML libre); si hay más, la
         verificación de abajo la manda a `html`. */
      const partes = hijos(h[0]).slice(0, -1);
      d = { id: base.id, tipo: 'practica' };
      if (partes[0] && partes[0].matches('span.slide-eyebrow')) d.antetitulo = interno(partes.shift());
      const h2 = partes.shift();
      if (h2 && h2.matches('h2[data-slide-title]')) {
        d.titulo = interno(h2);
        if (partes[0] && partes[0].matches('p.slide-lead[data-narrate-skip]')) d.bajada = interno(partes.shift());
        if (partes.length === 1) d.aviso = externo(partes.shift());
      }
      if (partes.length || d.titulo === undefined) d = null;
    }
    if (d) {
      for (const k of ['requisitos', 'avanceSolo', 'fin', 'atributos']) if (base[k] !== undefined) d[k] = base[k];
      if (narr) d.narracion = leerNarracion(narr);
      if (d.zonas && !d.zonas.length) delete d.zonas;
      let armado = null;
      try { armado = desde(CD.armarDiapositiva(d, i, '')); } catch (e) { armado = null; }
      if (igual(sec, armado)) return d;
    }
    const crudo = { id: base.id, tipo: 'html', clase: cls };
    if (base.titulo !== undefined) crudo.titulo = base.titulo;
    for (const k of ['requisitos', 'avanceSolo', 'fin', 'atributos']) if (base[k] !== undefined) crudo[k] = base[k];
    crudo.html = interno(sec);
    return crudo;
  }

  const main = doc.querySelector('main.d-stage');
  const secciones = Array.from(main.querySelectorAll(':scope > section.slide'));
  const diapositivas = secciones.map(leerDiapositiva);
  const titulos = {};
  for (const d of diapositivas) if (d.titulo != null) titulos[d.id] = d.titulo;

  /* ---- índice ---- */
  const nav = doc.querySelector('nav.d-sidenav-list');
  let indice = null;
  {
    const ix = { grupos: [] };
    let grupo = null, ok = true;
    for (const h of hijos(nav)) {
      if (h.id === 'd-sidenav-progress') continue;
      if (h.matches('.d-obj-progress')) {
        ix.objetivos = Array.from(h.querySelectorAll('.d-obj-pip')).map((p) => ({
          letra: p.getAttribute('data-obj-pip'), diapo: p.getAttribute('data-obj-check'),
          texto: (p.getAttribute('title') || '').replace(/^.*? · /, '')
        }));
      } else if (h.matches('span.d-sidenav-group')) {
        grupo = { titulo: interno(h), items: [] };
        ix.grupos.push(grupo);
      } else if (h.matches('button.d-sidenav-item')) {
        if (!grupo) { grupo = { items: [] }; ix.grupos.push(grupo); }
        const use = h.querySelector('svg.ic use');
        const sp = h.querySelector(':scope > span');
        const it = { diapo: h.getAttribute('data-goto'), icono: use ? (use.getAttribute('href') || '').replace(/^#/, '') : '', rotulo: sp ? interno(sp) : '' };
        if (h.hasAttribute('data-icono-tipo')) it.tipo = h.getAttribute('data-icono-tipo');
        grupo.items.push(it);
      } else ok = false;
    }
    if (ok && igual(nav, dentroDe(nav, CD.armarIndice(ix, '')))) indice = ix;
    else indice = { html: interno(nav) };
  }

  /* ---- glosario ---- */
  const dl = doc.querySelector('dl.d-glossary');
  let glosario;
  {
    const lista = [];
    const h = hijos(dl);
    let ok = h.length % 2 === 0;
    for (let i = 0; ok && i < h.length; i += 2) {
      const dt = h[i], dd = h[i + 1];
      const btn = dt.querySelector('button.d-gloss-term-btn');
      const def = dd.querySelector('.d-gloss-def');
      const hint = dd.querySelector('.d-gloss-hint');
      if (dt.tagName !== 'DT' || dd.tagName !== 'DD' || !btn || !def || !hint) { ok = false; break; }
      const t = { termino: interno(btn), diapo: btn.getAttribute('data-goto'), def: interno(def) };
      const tmp = document.createElement('span');
      tmp.innerHTML = titulos[t.diapo] != null ? CD.pistaPorDefecto(titulos[t.diapo]) : '';
      if (tmp.innerHTML !== hint.innerHTML) t.pista = interno(hint);
      lista.push(t);
    }
    glosario = ok && igual(dl, dentroDe(dl, CD.armarGlosario(lista, titulos, ''))) ? lista : { html: interno(dl) };
  }

  /* ---- fichas ---- */
  const fichasEl = [];
  const fichas = [];
  for (const m of doc.querySelectorAll('.modal')) {
    if (m.className !== 'modal') continue;
    const card = m.querySelector(':scope > .modal-card');
    const hd = card && card.querySelector(':scope > .modal-hd.modal-hd--dark');
    const bd = card && card.querySelector(':scope > .modal-bd');
    const h3 = hd && hd.querySelector('h3');
    if (!card || card.className !== 'modal-card' || !hd || !bd || !h3) continue;
    const f = { id: m.getAttribute('data-popup'), etiqueta: m.getAttribute('aria-label'), titulo: interno(h3),
      clase: claseExtra(bd, ['modal-bd']), cuerpo: interno(bd) };
    if (igual(m, desde(CD.armarFicha(f, '')))) { fichas.push(f); fichasEl.push(m); }
  }

  /* ---- el marco: lo que queda, con huecos ---- */
  /* Saca la pieza y los comentarios que la documentaban (los que tiene
     justo encima, sin nada más en el medio). Si se pasa `reemplazo`, lo
     deja en su lugar. */
  const quitarConComentarioPrevio = (el, reemplazo) => {
    let p = el.previousSibling;
    while (p && (p.nodeType === 8 || (p.nodeType === 3 && !p.nodeValue.trim()))) {
      const ant = p.previousSibling;
      if (p.nodeType === 8) {
        if (p.nextSibling && p.nextSibling.nodeType === 3 && !p.nextSibling.nodeValue.trim()) p.nextSibling.remove();
        p.remove();
      }
      p = ant;
    }
    if (reemplazo) el.parentNode.insertBefore(reemplazo, el);
    else if (el.previousSibling && el.previousSibling.nodeType === 3 && !el.previousSibling.nodeValue.trim()) el.previousSibling.remove();
    el.remove();
  };
  const hueco = (texto) => doc.createComment(texto.replace(/^<!--|-->$/g, ''));

  // diapositivas: todo desde la primera hasta la última (y sus comentarios) se va.
  {
    const primero = secciones[0];
    let inicio = primero;
    while (inicio.previousSibling && (inicio.previousSibling.nodeType === 8 ||
      (inicio.previousSibling.nodeType === 3 && !inicio.previousSibling.nodeValue.trim() &&
       inicio.previousSibling.previousSibling && inicio.previousSibling.previousSibling.nodeType === 8))) {
      inicio = inicio.previousSibling;
    }
    const ultima = secciones[secciones.length - 1];
    const marca = hueco(CD.HUECOS.diapositivas);
    main.insertBefore(marca, inicio);
    let n = inicio;
    while (n) {
      const sig = n.nextSibling;
      n.remove();
      if (n === ultima) break;
      n = sig;
    }
  }
  const vaciarCon = (el, h) => {
    const ws = Array.from(el.childNodes).filter((n) => n.nodeType === 3);
    const pre = ws.length && ws[0] === el.firstChild ? ws[0].nodeValue : '\n';
    const post = ws.length && ws[ws.length - 1] === el.lastChild ? ws[ws.length - 1].nodeValue : '\n';
    el.textContent = '';
    el.appendChild(doc.createTextNode(pre));
    el.appendChild(hueco(h));
    el.appendChild(doc.createTextNode(post));
  };
  vaciarCon(nav, CD.HUECOS.indice);
  vaciarCon(dl, CD.HUECOS.glosario);
  if (fichasEl.length) {
    // De atrás para adelante: si no, al sacar la segunda ficha la búsqueda
    // de sus comentarios llega hasta el hueco recién puesto y lo borra.
    for (let k = fichasEl.length - 1; k >= 0; k--) quitarConComentarioPrevio(fichasEl[k], k === 0 ? hueco(CD.HUECOS.fichas) : null);
  } else {
    // sin fichas: el hueco va antes del reproductor de video, si está.
    const vp = doc.querySelector('[data-popup="video-player"]') || doc.querySelector('.d-app');
    vp.parentNode.insertBefore(hueco(CD.HUECOS.fichas), vp);
  }
  /* Los datos para curso.js (v1.9.113): si el index ya los trae, se leen
     y su lugar queda como hueco; si no, el hueco va antes del primer
     script, que es donde el armador los pone. */
  const datos = {};
  const bloqueDatos = doc.getElementById('d-curso-datos');
  if (bloqueDatos) {
    Object.assign(datos, JSON.parse(bloqueDatos.textContent));
    bloqueDatos.parentNode.replaceChild(hueco(CD.HUECOS.datos), bloqueDatos);
  } else {
    const primerScript = doc.querySelector('body script[src]');
    if (primerScript) primerScript.parentNode.insertBefore(hueco(CD.HUECOS.datos), primerScript);
  }
  // total de diapositivas: el contador y la barra de progreso.
  const total = String(secciones.length);
  const thumb = doc.querySelector('[data-slide-thumb]');
  if (thumb) {
    if (thumb.getAttribute('aria-valuemax') === total) thumb.setAttribute('aria-valuemax', CD.HUECOS.total);
    const vt = thumb.getAttribute('aria-valuetext');
    if (vt) thumb.setAttribute('aria-valuetext', vt.replace(new RegExp('\\b' + total + '$'), CD.HUECOS.total));
  }
  const cont = doc.querySelector('[data-slide-counter]');
  if (cont) cont.textContent = cont.textContent.replace(new RegExp('/ ' + total + '\\b'), '/ ' + CD.HUECOS.total);

  /* Lo que viene después de </html> el parser lo mete al final del <body>:
     sin esto, cada extracción le sumaba un renglón vacío al marco. */
  const ult = doc.body.lastChild;
  if (ult && ult.nodeType === 3 && !ult.nodeValue.trim()) ult.nodeValue = '\n';
  const doctype = /^<!DOCTYPE html>/i.test(html.trimStart()) ? '<!DOCTYPE html>\n' : '';
  const marco = doctype + doc.documentElement.outerHTML + '\n';
  const curso = { formato: 1, diapositivas, indice, glosario, fichas };
  for (const k of CD.CLAVES_DATOS) if (datos[k] !== undefined) curso[k] = datos[k];

  /* ---- la prueba: el index armado tiene que ser el mismo curso ---- */
  const armado = CD.armarIndex(curso, marco);
  const a = CD.huellaDom(new DOMParser().parseFromString(html, 'text/html').documentElement);
  const b = CD.huellaDom(new DOMParser().parseFromString(armado, 'text/html').documentElement);
  let primera = null;
  if (!CD.mismaHuella(a, b)) {
    const n = Math.max(a.filas.length, b.filas.length);
    for (let i = 0; i < n; i++) {
      if (a.filas[i] !== b.filas[i]) { primera = { i, original: a.filas.slice(Math.max(0, i - 3), i + 3), armado: b.filas.slice(Math.max(0, i - 3), i + 3) }; break; }
    }
    if (!primera) primera = { texto: true };
  }

  /* ---- informe ---- */
  for (const d of diapositivas) {
    if (d.tipo === 'html') informe.comoHtml.push(`diapositiva "${d.id}"`);
    else {
      informe.modeladas.push(`diapositiva "${d.id}" (${d.tipo})`);
      (d.zonas || []).forEach((z, k) => { if (z.tipo === 'html') informe.comoHtml.push(`diapositiva "${d.id}", zona ${k + 1}`); });
      if (d.narracion && d.narracion.html != null) informe.comoHtml.push(`diapositiva "${d.id}", locución`);
    }
  }
  (indice.html != null ? informe.comoHtml : informe.modeladas).push('índice');
  (glosario.html != null ? informe.comoHtml : informe.modeladas).push(`glosario${glosario.length != null ? ` (${glosario.length} términos)` : ''}`);
  informe.modeladas.push(`${fichas.length} fichas`);
  return { curso, marco, igual: !primera, primera, informe, html: armado };
} catch (e) { return { error: String(e && e.message || e) }; } }, html);

await browser.close();

if (r.error) {
  console.error('✗ La extracción falló: ' + r.error);
  process.exit(1);
}
if (!r.igual) {
  console.error('✗ El index armado desde los datos NO es el mismo curso que el original. No se escribió nada.');
  console.error(JSON.stringify(r.primera, null, 2));
  process.exit(1);
}
fs.writeFileSync(path.join(carpeta, 'curso.json'), JSON.stringify(r.curso, null, 2) + '\n');
fs.writeFileSync(path.join(carpeta, 'marco.html'), r.marco);
console.log(`✓ ${path.join(carpeta, 'curso.json')} y marco.html escritos. Armados de nuevo dan el mismo curso.`);
console.log(`  Pasaron a datos: ${r.informe.modeladas.length} piezas.`);
if (r.informe.comoHtml.length) {
  console.log(`  Quedaron como HTML tal cual (${r.informe.comoHtml.length}):`);
  for (const x of r.informe.comoHtml) console.log('    · ' + x);
}
