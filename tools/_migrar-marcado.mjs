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
    /* v1.9.127: el menú se llama como su botón (pedido de diseño en el
       simulador: "el botón Sonido cuando se abre dice Volumen, hay que
       unificar"; lo mismo Locución, que decía "Avance"). */
    [/(<span class="d-vol-title">)Volumen:?(<\/span>)/, '$1Sonido:$2', 'Volumen → Sonido:'],
    [/(<span class="d-narr-title">)Avance:?(<\/span>)/, '$1Locución:$2', 'Avance → Locución:'],
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
  if (bp && T.pracIntro && /data-pracintro-go/.test(h.slice(...bp)) && !/d-pracintro-n/.test(h.slice(...bp))) {   // cualquier aviso anterior (cardio no traía .d-pracintro-ic)
    const viejo = h.slice(...bp);
    const n = (viejo.match(/<b>(\d+) preguntas<\/b>/) || viejo.match(/(\d+)\s*(?:<\/b>)?\s*preguntas/) || [])[1];
    let nuevo = T.pracIntro;
    if (n) nuevo = nuevo.replace(/(<span class="d-pracintro-n" aria-hidden="true">)\d+(<\/span>)/, '$1' + n + '$2');
    h = h.slice(0, bp[0]) + nuevo + h.slice(bp[1]);
    cambios.push('aviso de la mini práctica → tarjetas' + (n ? ` (${n} preguntas)` : ''));
  }

  /* 4 · Texto de "Mis logros", si es el que traía el kit: el v3, sus
     variantes ("Vas sumando ✦ puntos a medida que avanzás (…) y ganás un
     🏆 logro al completar…": describen un modelo de logros que ya no
     existe) y el de v1.9.125, que decía "ninguno se gana con lo mínimo"
     y con la regla 2 de recorrido + 3 de plus (v1.9.127) dejó de ser
     cierto. */
  const lg = h.match(/<p class="d-badges-intro"[^>]*>[\s\S]*?<\/p>/);
  const introVieja = lg && (texto(lg[0]) === LOGROS_V3 || /^Vas sumando ✦ puntos a medida que avanzás/.test(texto(lg[0])) ||
    /ninguno se gana con lo mínimo\.$/.test(texto(lg[0])) ||
    /* v1.9.136 (relevo SA L4): "Con lo obligatorio llegás a bronce o plata"
       dejó de ser cierto con "pasar es ganar" y el bronce al completar: en
       un curso con el piso calculado, lo obligatorio da justo bronce. */
    /^Con lo obligatorio llegás a bronce o plata\. El oro es para quien hace un poco más: los 3 logros de plus/.test(texto(lg[0])));
  if (lg && T.logrosIntro && introVieja && texto(lg[0]) !== texto(T.logrosIntro)) {
    h = h.replace(lg[0], T.logrosIntro);
    cambios.push('texto de "Mis logros" (bronce al terminar; plata y oro con lo que se suma)');
  }

  /* 4d · La pastilla de logros del instructivo (v1.9.127): "cada uno suma
     +20" dejó de ser cierto con la regla 2 de recorrido + 3 de plus. */
  const PILL_VIEJA = 'Hay 5 logros escondidos.</b> Cada uno suma +20 y te acerca a la medalla de oro.';
  if (h.includes(PILL_VIEJA)) {
    h = h.replace(PILL_VIEJA, 'Hay 5 logros para ganar.</b> Los 3 de plus suman +20 y te acercan a la medalla de oro.');
    cambios.push('pastilla de logros del instructivo (3 de plus suman +20)');
  }

  /* 4b · El botón "Índice" suelto (cursos anteriores a v1.9.85): sin la
     cápsula `.d-top-group--indice` no se parece a Glosario ni a Ampliar,
     que sí la tienen (comentario del cliente en el simulador del editor,
     sobre cardio). Se envuelve, sin tocar el botón. */
  const reIndice = /([ \t]*)(<button class="d-iconbtn d-iconbtn--labeled"[^>]*data-popup-trigger="sidenav"[^>]*>[\s\S]*?<\/button>)/;
  const mi = h.match(reIndice);
  if (mi && !/d-top-group--indice"[^>]*>\s*$/.test(h.slice(0, mi.index + mi[1].length))) {
    const sangria = mi[1];
    const boton = mi[2].replace(/\n/g, '\n  ');
    h = h.replace(reIndice, `${sangria}<div class="d-top-group d-top-group--indice" role="group" aria-label="Índice">\n${sangria}  ${boton}\n${sangria}</div>`);
    cambios.push('botón "Índice" dentro de su cápsula (como Glosario y Ampliar)');
  }

  /* 4c · Locución apagada = micrófono TACHADO (el kit lo trae desde que
     el cliente reportó "el ícono no cambia de estado"; los cursos de
     antes tienen el micrófono liso en los dos estados). Lo volvió a
     pedir diseño en el simulador, sobre cardio. Se suma la línea al
     ícono de apagado, sin tocar nada más del botón. */
  const reMic = /(<button[^>]*id="d-narrate"[^>]*>\s*<svg class="ic-off"[^>]*>)([\s\S]*?)(<\/svg>)/;
  const mm = h.match(reMic);
  if (mm && !/ic-tachado/.test(mm[2])) {
    h = h.replace(reMic, (_, a1, a2, a3) => a1 + a2 + '<line class="ic-tachado" x1="3.5" y1="2.5" x2="20.5" y2="21.5"/>' + a3);
    cambios.push('Locución apagada: micrófono tachado');
  }

  /* 4f · El paso "Sumás puntos" del instructivo (v1.9.135, relevo SA
     K12): decía "Las prácticas dan puntos", y un curso sin mini práctica
     (minijuego, repaso) también da puntos. Solo el texto del kit. */
  const PRACT = 'Las prácticas dan puntos. Con un plus, ganás logros y mejor medalla.';
  if (h.includes(PRACT)) {
    h = h.split(PRACT).join('Las actividades dan puntos. Con un plus, ganás logros y mejor medalla.');
    cambios.push('instructivo: "Las actividades dan puntos"');
  }

  /* 4e · Panel de Locución: el estado en palabras y la ayuda de la barra
     (v1.9.135, relevo SA K2). Los cursos de antes no los tienen y
     `initNarrateTimeline()` no tiene dónde decir "La locución está
     apagada" ni "Esta diapositiva no tiene locución": el alumno ve una
     barra gris y no sabe si está roto. Se suman en su lugar, sin tocar
     el resto del panel. */
  if (/class="d-narr-hd"/.test(h) && !/id="d-narr-estado"/.test(h)) {
    const reHd = /([ \t]*)(<div class="d-narr-hd">[\s\S]*?<\/div>)/;
    const mh = h.match(reHd);
    if (mh) {
      h = h.replace(reHd, `${mh[1]}${mh[2]}\n${mh[1]}<p class="d-narr-estado" id="d-narr-estado"></p>`);
      cambios.push('Locución: estado en palabras (`#d-narr-estado`)');
    }
  }
  if (/class="d-narr-times"/.test(h) && !/class="d-narr-hint"/.test(h)) {
    const reT = /([ \t]*)(<div class="d-narr-times">[\s\S]*?<\/div>)/;
    const mt = h.match(reT);
    if (mt) {
      h = h.replace(reT, `${mt[1]}${mt[2]}\n${mt[1]}<p class="d-narr-hint">Arrastrá para adelantar o volver atrás.</p>`);
      cambios.push('Locución: ayuda de la barra (`.d-narr-hint`)');
    }
  }

  /* 5 · `#i-play`: lo usaba solo el botón del instructivo v3. Sin uso,
     sale del sprite (lo marca `iconos-indice`). */
  if (!/(?:href|xlink:href)="#i-play"/.test(h)) {
    const sym = /[ \t]*<symbol id="i-play"[\s\S]*?<\/symbol>\r?\n?/;
    if (sym.test(h)) { h = h.replace(sym, ''); cambios.push('símbolo #i-play sin uso, fuera del sprite'); }
  }

  return { html: h, cambios };
}

/* ---- curso.json (cursos armados desde datos) ----
   El HTML de las diapositivas y de las fichas va en cadenas JSON: los
   títulos del repaso (ver arriba) y el aviso de la mini práctica cuando
   es una FICHA (`fichas[].id === "practica-intro"`, así lo tiene cardio):
   se le pone el cuerpo del kit v1.9.125, conservando la cantidad de
   preguntas. Se reescribe el JSON solo si algo cambió, con la sangría que
   ya tenía. */
export function migrarDatosCurso(texto, KIT) {
  const cambios = [];
  const rep = migrarTituloRepaso(texto);
  let t = rep.texto;
  if (rep.n) cambios.push(`título "Repaso rápido:" (${rep.n})`);
  let d;
  try { d = JSON.parse(t); } catch { return { texto: t, cambios }; }
  let reescribir = false;
  const T = plantillas(KIT);
  const f = (d.fichas || []).find((x) => x && x.id === 'practica-intro' && typeof x.cuerpo === 'string');
  if (f && T.pracIntro && /data-pracintro-go/.test(f.cuerpo) && !/d-pracintro-n/.test(f.cuerpo)) {
    const n = (f.cuerpo.match(/(\d+)\s*(?:<\/b>)?\s*preguntas/) || [])[1];
    const bd = T.pracIntro.match(/<div class="modal-bd d-pracintro">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*$/);
    const titulo = (T.pracIntro.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1];
    if (bd) {
      let cuerpo = bd[1].trim();
      if (n) cuerpo = cuerpo.replace(/(<span class="d-pracintro-n" aria-hidden="true">)\d+(<\/span>)/, '$1' + n + '$2');
      f.cuerpo = cuerpo;
      f.claseTarjeta = [f.claseTarjeta, 'd-pracintro-card'].filter(Boolean).join(' ');
      if (titulo) f.titulo = titulo;
      reescribir = true;
      cambios.push('aviso de la mini práctica (ficha) → tarjetas' + (n ? ` (${n} preguntas)` : ''));
    }
  }
  /* v1.9.126: el logro del kit "Segunda mirada" ya no existe (lo
     reemplaza "Explorador"). Un curso que lo pedía por id pasaría a
     tener 4 logros y `gamificacion` lo frena. Si el curso ya pidió
     "explorador" por su cuenta, solo se saca el viejo. */
  if (Array.isArray(d.logros) && d.logros.includes('segunda')) {
    d.logros = d.logros.includes('explorador')
      ? d.logros.filter((x) => x !== 'segunda')
      : d.logros.map((x) => (x === 'segunda' ? 'explorador' : x));
    reescribir = true;
    cambios.push('logro del kit "segunda" → "explorador"');
  }
  /* v1.9.127, regla del cliente "2 de recorrido + 3 de plus": un curso que
     tiene EXACTAMENTE la lista que escribía `new-course` (cinco del kit,
     todos de plus) pasa a la lista nueva. Una lista tocada por el curso no
     se toca: ahí decide el chat del curso (`gamificacion` lo marca). */
  const VIEJA = ['punteria', 'racha', 'curioso', 'explorador', 'impecable'];
  if (Array.isArray(d.logros) && d.logros.length === VIEJA.length && d.logros.every((x, i) => x === VIEJA[i])) {
    d.logros = ['mitad', 'completo', 'impecable', 'racha', 'explorador'];
    reescribir = true;
    cambios.push('logros: 2 de recorrido + 3 de plus (lista por defecto del kit)');
  }
  if (reescribir) {
    const sangria = (t.match(/\n( +)"/) || [, '  '])[1].length;
    t = JSON.stringify(d, null, sangria) + (t.endsWith('\n') ? '\n' : '');
  }
  return { texto: t, cambios };
}

