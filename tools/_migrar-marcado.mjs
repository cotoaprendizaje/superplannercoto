/* _migrar-marcado.mjs — el MARCADO del kit que un curso ya tiene, llevado
   a la versión nueva (kit-base v1.9.125, §7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. `actualizar-kit` reemplaza los CSS y JS del kit, así que
   casi todo el rediseño llega solo a los cursos. Lo que no llega es lo que
   está ESCRITO en el HTML del curso (`marco.html` en los cursos armados
   desde datos, `index.html` en los anteriores): los títulos de los paneles
   con ":", el instructivo "Cómo recorrer el curso" de cuatro pasos, el
   aviso de la mini práctica, el texto de "Mis logros" y el símbolo
   `#i-play` que ya no usa nadie. Copiarlo a mano en cada curso es
   exactamente el tipo de trabajo que se hace en uno y se olvida en otro.

   CÓMO. Cada migración es un cambio CONCRETO de algo que el kit escribió:
   reconoce el texto o el bloque tal como lo dejaba la versión anterior y
   solo entonces lo cambia. Lo que un curso reescribió por su cuenta no se
   toca (no coincide), y correrlo dos veces no cambia nada la segunda
   (lo nuevo ya no coincide con lo viejo). Lo que el curso PUSO adentro de
   un bloque del kit se conserva: los textos propios de las tarjetas del
   instructivo pasan a los pasos nuevos, y la cantidad de preguntas de la
   práctica pasa al aviso nuevo.

   Uso: `migrarMarcado(html, KIT)` → `{ html, cambios: [descripción…] }`.
   Lo llama `actualizar-kit.mjs`; sin `--aplicar` solo lista los cambios. */
import fs from 'node:fs';
import path from 'node:path';

/* Bloque `<div …>` balanceado que empieza en `desde` (los comentarios
   HTML de adentro no cuentan). Devuelve [inicio, fin) o null. */
export function bloqueDiv(html, desde) {
  if (desde < 0) return null;
  const re = /<!--[\s\S]*?-->|<div\b[^>]*>|<\/div>/g;
  re.lastIndex = desde;
  let prof = 0, m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[0] === '</div>') { prof--; if (prof === 0) return [desde, re.lastIndex]; }
    else prof++;
  }
  return null;
}
/* El primer `<div class="modal" data-popup="id"` que NO está dentro de un
   comentario (el boilerplate del índice trae bloques de referencia
   comentados: esos no son del curso). */
function inicioPopup(html, id) {
  const re = new RegExp('<div\\b[^>]*\\bdata-popup="' + id + '"[^>]*>', 'g');
  let m;
  while ((m = re.exec(html))) {
    const antes = html.slice(0, m.index);
    if (antes.lastIndexOf('<!--') <= antes.lastIndexOf('-->')) return m.index;
  }
  return -1;
}
const texto = (h) => String(h || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

/* Los textos que el kit traía en las tarjetas del instructivo v3: si el
   curso los dejó como venían, van los del v4; si los cambió, se respetan. */
const INSTR_V3 = {
  'Es interactivo': 'Mirá los videos, tocá los gráficos y respondé las actividades.',
  'Hay que ver todo': 'Para avanzar necesitás completar cada interacción — si te falta algo, te lo señalamos.',
  'Subí el volumen': 'El curso se narra solo; silenciala desde "Locución" o cambiá la voz desde "Configuración".',
  'Sumás puntos': 'Ganás logros a medida que avanzás y una medalla final.'
};
const LOGROS_V3 = 'Vas sumando ✦ puntos a medida que avanzás, y ganás un 🏆 logro al completar cada unidad.';

function plantillas(KIT) {
  const header = fs.readFileSync(path.join(KIT, 'header-boilerplate.html'), 'utf8');
  const index = fs.readFileSync(path.join(KIT, 'index-boilerplate.html'), 'utf8');
  const i = inicioPopup(header, 'instrucciones');
  const instr = i >= 0 ? header.slice(...bloqueDiv(header, i)) : null;
  /* El de la práctica vive COMENTADO en el boilerplate (es opcional):
     se busca sin el filtro de comentarios. */
  const p = index.indexOf('<div class="modal" data-popup="practica-intro"');
  const pracIntro = p >= 0 ? index.slice(...bloqueDiv(index, p)) : null;
  const lg = index.match(/<p class="d-badges-intro"[^>]*>[\s\S]*?<\/p>/);
  return { instr, pracIntro, logrosIntro: lg ? lg[0] : null };
}

/* "Repaso rápido" → "Repaso rápido:" en la tira del kit. Sirve también
   para `curso.json`, donde el HTML de las diapositivas va en cadenas JSON
   (comillas escapadas: `\\"`). */
const RE_REPASO = /Repaso rápido(<span class=\\?"d-repaso-nav\\?">|<\/b>)/g;
export function migrarTituloRepaso(t) {
  const n = (t.match(RE_REPASO) || []).length;
  return { n, texto: n ? t.replace(RE_REPASO, 'Repaso rápido:$1') : t };
}

export function migrarMarcado(html, KIT) {
  const cambios = [];
  const T = plantillas(KIT);
  let h = html;

  /* 1 · Títulos de los paneles del kit, terminados en ":" (canvas). */
  const titulos = [
    [/(<span class="d-vol-title">)Volumen(<\/span>)/, '$1Volumen:$2', 'Volumen'],
    [/(<span class="d-narr-title">)Avance(<\/span>)/, '$1Avance:$2', 'Avance'],
    [/(<span class="d-fab-pop-title">)Configuración(<\/span>)/, '$1Ajustes:$2', 'Configuración → Ajustes:'],
    [/(<span class="d-fab-pop-title">)Ayuda(<\/span>)/, '$1Ayuda:$2', 'Ayuda'],
    [/(<p class="d-fab-acc-hd">)Preguntas frecuentes(<\/p>)/, '$1Preguntas frecuentes:$2', 'Preguntas frecuentes'],
    /* Solo el del panel (`.d-sidenav-hd`): una diapositiva "Índice de
       contenidos" del curso es contenido y no se toca. */
    [/(<div class="d-sidenav-hd">[\s\S]{0,200}?<h2[^>]*>)Índice de contenidos(<\/h2>)/, '$1Índice del curso:$2', 'Índice de contenidos → Índice del curso:'],
    [/(<div class="modal-hd[^"]*">\s*(?:<button[^>]*>✕<\/button>\s*)?<h3[^>]*>)Recursos(<\/h3>)/, '$1Recursos:$2', 'Recursos'],
    [/(<div class="modal-hd[^"]*">\s*(?:<button[^>]*>✕<\/button>\s*)?<h3[^>]*>)Glosario(<\/h3>)/, '$1Glosario:$2', 'Glosario'],
    [/(<div class="modal-hd[^"]*">\s*(?:<button[^>]*>✕<\/button>\s*)?<h3[^>]*>)Mis logros(<\/h3>)/, '$1Mis logros:$2', 'Mis logros'],
    [/(<div class="d-salida-card">[\s\S]{0,300}?<h2[^>]*>)(?:¡Gracias por hacer el curso!|Curso finalizado)(<\/h2>)/, '$1Curso finalizado:$2', 'pantalla de salida → Curso finalizado:']
  ];
  for (const [re, por, nombre] of titulos) {
    if (re.test(h)) { h = h.replace(re, por); cambios.push('título "' + nombre + '"'); }
  }
  const rep = migrarTituloRepaso(h);
  if (rep.n) { h = rep.texto; cambios.push(`título "Repaso rápido:" (${rep.n})`); }

  /* 2 · "Cómo recorrer el curso" v3 (tarjetas) → v4 (pasos). */
  const ii = inicioPopup(h, 'instrucciones');
  const bi = ii >= 0 && bloqueDiv(h, ii);
  if (bi && T.instr && /d-instr-cardgrid/.test(h.slice(...bi)) && !/d-instr-pasos/.test(h.slice(...bi))) {
    const viejo = h.slice(...bi);
    const tarjetas = [...viejo.matchAll(/<div><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/div>/g)].map((m) => ({ b: m[1], span: m[2] }));
    let nuevo = T.instr;
    let propios = 0;
    tarjetas.forEach((t, k) => {
      const defecto = INSTR_V3[texto(t.b)];
      if (defecto && texto(t.span) === defecto) return;        // el texto del kit: va el nuevo
      let n = -1;
      nuevo = nuevo.replace(/(<div class="d-instr-paso">[\s\S]*?<\/span>\s*<b>)[\s\S]*?(<\/b>\s*<span>)[\s\S]*?(<\/span>)/g, (todo, a, b, c) => {
        n++;
        if (n !== k) return todo;
        propios++;
        return a + t.b + b + t.span + c;
      });
    });
    h = h.slice(0, bi[0]) + nuevo + h.slice(bi[1]);
    cambios.push('instructivo "Cómo recorrer el curso" → cuatro pasos (v4)' + (propios ? `, con ${propios} texto(s) propio(s) del curso` : ''));
  }

  /* 3 · Aviso de la mini práctica (v1.9.121) → tarjetas (v1.9.125). */
  const ip = inicioPopup(h, 'practica-intro');
  const bp = ip >= 0 && bloqueDiv(h, ip);
  if (bp && T.pracIntro && /d-pracintro-ic/.test(h.slice(...bp)) && !/d-pracintro-n/.test(h.slice(...bp))) {
    const viejo = h.slice(...bp);
    const n = (viejo.match(/<b>(\d+) preguntas<\/b>/) || [])[1];
    let nuevo = T.pracIntro;
    if (n) nuevo = nuevo.replace(/(<span class="d-pracintro-n" aria-hidden="true">)\d+(<\/span>)/, '$1' + n + '$2');
    h = h.slice(0, bp[0]) + nuevo + h.slice(bp[1]);
    cambios.push('aviso de la mini práctica → tarjetas' + (n ? ` (${n} preguntas)` : ''));
  }

  /* 4 · Texto de "Mis logros", si es el que traía el kit. */
  const lg = h.match(/<p class="d-badges-intro"[^>]*>[\s\S]*?<\/p>/);
  if (lg && T.logrosIntro && texto(lg[0]) === LOGROS_V3) {
    h = h.replace(lg[0], T.logrosIntro);
    cambios.push('texto de "Mis logros" (bronce/plata con lo obligatorio, oro con los logros)');
  }

  /* 5 · `#i-play`: lo usaba solo el botón del instructivo v3. Sin uso,
     sale del sprite (lo marca `iconos-indice`). */
  if (!/(?:href|xlink:href)="#i-play"/.test(h)) {
    const sym = /[ \t]*<symbol id="i-play"[\s\S]*?<\/symbol>\r?\n?/;
    if (sym.test(h)) { h = h.replace(sym, ''); cambios.push('símbolo #i-play sin uso, fuera del sprite'); }
  }

  return { html: h, cambios };
}
