#!/usr/bin/env node
/* check-migracion.mjs — la migración del marcado de `actualizar-kit`
   (kit-base v1.9.125, §7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. `_migrar-marcado.mjs` reescribe el HTML de CADA curso al
   actualizarlo. Un error ahí no rompe el kit: rompe cursos, y en silencio.
   El primer borrador cambiaba "Índice de contenidos" en cualquier <h2>, y
   "Seguridad alimentaria" tiene una DIAPOSITIVA con ese título (lo vio la
   corrida en seco, no un test). Esto fija lo que la migración tiene que
   hacer y lo que no puede tocar.

   QUÉ HACE, sin navegador: arma un HTML con la forma que dejaba el kit
   v1.9.124 —más trampas: un título igual en una diapositiva, una tarjeta
   del instructivo con texto propio del curso, un ícono `#i-play` en uso,
   un `curso.json` con el repaso adentro— y exige:
     · los cambios esperados, y que la trampa siga igual;
     · el texto propio de la tarjeta, conservado en el paso nuevo;
     · que correrlo DOS veces no cambie nada la segunda;
     · que el `curso.json` siga siendo JSON válido. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrarMarcado, migrarTituloRepaso, migrarDatosCurso } from './_migrar-marcado.mjs';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fallos = [];

const tarjeta = (ic, b, span) => `<div class="d-instr-card"><div class="d-instr-card-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="${ic}"/></svg></div>
          <div><b>${b}</b><span>${span}</span></div></div>`;
const VIEJO = `<svg style="display:none"><symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></symbol>
  <symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></symbol></svg>
<section class="slide" data-slide="indice"><h2 data-slide-title class="sr-only">Índice de contenidos</h2></section>
<div class="d-vol-hd"><span class="d-vol-title">Volumen</span></div>
<span class="d-narr-title">Avance</span>
<header class="d-top"><div class="d-top-group d-top-group--audio"><button class="d-iconbtn d-iconbtn--labeled is-on" id="d-narrate" type="button">
            <svg class="ic-off" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8"/></svg>
            <svg class="ic-on" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8"/><path d="M4.5 8a7.5 7.5 0 0 0 0 5"/></svg></button></div><div class="d-top-left">
        <button class="d-iconbtn d-iconbtn--labeled" type="button" data-popup-trigger="sidenav" aria-label="Índice del curso"><svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <span class="lbl">Índice</span>
        </button></div></header>
<span class="d-fab-pop-title">Configuración</span>
<span class="d-fab-pop-title">Ayuda</span>
<p class="d-fab-acc-hd">Preguntas frecuentes</p>
<div class="modal" data-popup="instrucciones" role="dialog">
  <div class="modal-back" data-popup-close=""></div>
  <div class="modal-card d-instr-modal">
    <button class="modal-x" data-popup-close="" aria-label="Cerrar">✕</button>
    <div class="d-instr-hd"><span class="d-instr-kicker">Antes de empezar</span><h3>Cómo recorrer el curso</h3></div>
    <div class="modal-bd">
      <div class="d-instr-cardgrid">
        ${tarjeta('M1 1', 'Es interactivo', 'Tocá las tarjetas y jugá el mini juego.')}
        ${tarjeta('M2 2', 'Hay que ver todo', 'Para avanzar necesitás completar cada interacción — si te falta algo, te lo señalamos.')}
        ${tarjeta('M3 3', 'Subí el volumen', 'El curso se narra solo; silenciala desde <strong>"Locución"</strong> o cambiá la voz desde <strong>"Configuración"</strong>.')}
        ${tarjeta('M4 4', 'Sumás puntos', 'Ganás logros a medida que avanzás y una medalla final.')}
      </div>
      <div class="d-instr-cta"><button class="btn btn-cat btn-ic" type="button" data-popup-close=""><svg viewBox="0 0 24 24"><use href="#i-play"></use></svg>Empezar mi aprendizaje</button></div>
    </div>
  </div>
</div>
<div class="modal" data-popup="practica-intro" role="dialog">
  <div class="modal-back" data-popup-close></div>
  <div class="modal-card">
    <div class="modal-hd modal-hd--dark"><button class="modal-x" data-popup-close aria-label="Cerrar">✕</button><h3>Antes de empezar:</h3></div>
    <div class="modal-bd d-pracintro">
      <div class="d-pracintro-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></div>
      <ul><li>Son <b>5 preguntas</b> para repasar, cada una con su explicación.</li></ul>
      <button class="btn btn-cat" type="button" data-pracintro-go>Empezar la mini práctica</button>
    </div>
  </div>
</div>
<aside class="modal modal--drawer" data-popup="sidenav"><div class="modal-card d-sidenav"><div class="d-sidenav-hd">
      <h2>Índice de contenidos</h2>
      <button class="modal-x" type="button" data-popup-close aria-label="Cerrar">✕</button></div></div></aside>
<div class="modal" data-popup="recursos"><div class="modal-card d-drawer-r"><div class="modal-hd"><button class="modal-x" data-popup-close aria-label="Cerrar">✕</button><h3 style="margin:0;color:inherit">Recursos</h3></div></div></div>
<div class="modal" data-popup="logros"><div class="modal-card d-wide"><div class="modal-hd"><button class="modal-x" data-popup-close aria-label="Cerrar">✕</button><h3 style="margin:0;color:inherit">Mis logros</h3></div>
  <div class="modal-bd"><p class="d-badges-intro" data-narrate-only>Vas sumando <strong>✦ puntos</strong> a medida que avanzás, y ganás un <strong>🏆 logro</strong> al completar cada unidad.</p></div></div></div>
<div class="d-repaso" data-repaso><b class="d-repaso-title"><span class="d-repaso-title-ic" aria-hidden="true">🔍</span>Repaso rápido<span class="d-repaso-nav"></span></b></div>
<div id="d-salida" class="d-salida" hidden role="status"><div class="d-salida-card"><div class="d-salida-ic" aria-hidden="true">👋</div>
    <h2>¡Gracias por hacer el curso!</h2></div></div>`;

const r1 = migrarMarcado(VIEJO, KIT);
const h = r1.html;
const exige = (cond, msg) => { if (!cond) fallos.push(msg); };
exige(/<span class="d-vol-title">Sonido:<\/span>/.test(h), 'el menú de Sonido no pasó a "Sonido:" (decía "Volumen")');
exige(/<span class="d-narr-title">Locución:<\/span>/.test(h), 'el menú de Locución no pasó a "Locución:" (decía "Avance")');
{
  /* v1.9.135 (relevo SA K2): el panel de Locución viejo, sin estado ni ayuda. */
  const narrViejo = '<div class="d-narr-pop">\n  <div class="d-narr-hd">\n    <span class="d-narr-title">Locución:</span>\n  </div>\n  <div class="d-narr-row"><input class="d-narr-range" id="d-narr-range" type="range"></div>\n  <div class="d-narr-times"><span id="d-narr-time">0:00</span><span id="d-narr-total">0:00</span></div>\n</div>';
  const rn = migrarMarcado(narrViejo, KIT);
  exige(/<\/div>\n  <p class="d-narr-estado" id="d-narr-estado"><\/p>\n  <div class="d-narr-row">/.test(rn.html), 'el panel de Locución viejo no ganó `#d-narr-estado` debajo de su cabecera.');
  exige(/d-narr-total">0:00<\/span><\/div>\n  <p class="d-narr-hint">/.test(rn.html), 'el panel de Locución viejo no ganó la ayuda `.d-narr-hint` debajo de los tiempos.');
  exige(migrarMarcado(rn.html, KIT).cambios.length === 0, 'migrar dos veces el panel de Locución vuelve a cambiar algo (tiene que ser idempotente).');
}
exige(migrarMarcado('<span class="d-vol-title">Volumen:</span><span class="d-narr-title">Avance:</span>', KIT).html === '<span class="d-vol-title">Sonido:</span><span class="d-narr-title">Locución:</span>', 'un curso de v1.9.125/126 ("Volumen:", "Avance:") no pasa a "Sonido:"/"Locución:"');
exige(/<span class="d-fab-pop-title">Ajustes:<\/span>/.test(h), 'no cambió "Configuración" por "Ajustes:"');
exige(/<span class="d-fab-pop-title">Ayuda:<\/span>/.test(h), 'no puso "Ayuda:"');
exige(/Preguntas frecuentes:<\/p>/.test(h), 'no puso "Preguntas frecuentes:"');
exige(/d-sidenav-hd">\s*<h2>Índice del curso:<\/h2>/.test(h), 'no cambió el título del panel índice a "Índice del curso:"');
exige(/<h2 data-slide-title class="sr-only">Índice de contenidos<\/h2>/.test(h), 'TOCÓ el título de una DIAPOSITIVA "Índice de contenidos": eso es contenido del curso');
exige(/>Recursos:<\/h3>/.test(h) && />Mis logros:<\/h3>/.test(h), 'no puso ":" en Recursos / Mis logros');
exige(/Repaso rápido:<span class="d-repaso-nav">/.test(h), 'no puso "Repaso rápido:"');
exige(/<h2>Curso finalizado:<\/h2>/.test(h), 'no cambió la pantalla de salida a "Curso finalizado:"');
exige(/d-instr-pasos/.test(h) && !/d-instr-cardgrid/.test(h), 'no pasó el instructivo a los cuatro pasos');
exige(/<b>Es interactivo<\/b>\s*<span>Tocá las tarjetas y jugá el mini juego\.<\/span>/.test(h), 'perdió el texto PROPIO del curso en el paso "Es interactivo"');
exige(!/Para avanzar necesitás completar cada interacción/.test(h), 'dejó el texto VIEJO del kit en "Hay que ver todo" (tenía que ir el nuevo)');
exige(/d-pracintro-n" aria-hidden="true">5</.test(h), 'el aviso de la práctica no conservó "5 preguntas"');
exige(/Con lo obligatorio llegás a <strong>bronce o plata<\/strong>/.test(h), 'no actualizó el texto de "Mis logros"');
exige(!/id="i-play"/.test(h), 'dejó el símbolo #i-play sin uso en el sprite');
exige(/<div class="d-top-group d-top-group--indice"[^>]*>\s*<button class="d-iconbtn d-iconbtn--labeled"[^>]*data-popup-trigger="sidenav"/.test(h), 'no metió el botón "Índice" suelto en su cápsula .d-top-group--indice');
exige(/id="i-check"/.test(h), 'se llevó otro símbolo del sprite (#i-check)');
exige(/<svg class="ic-off"[^>]*><path d="M12 1a3 3 0 0 0-3 3v8"\/><line class="ic-tachado"/.test(h), 'no tachó el micrófono de "Locución" apagada');
exige(!/<svg class="ic-on"[^>]*>(?:(?!<\/svg>)[\s\S])*ic-tachado/.test(h), 'tachó el micrófono de "Locución" PRENDIDA');

/* Textos de logros que la regla 2 + 3 (v1.9.127) volvió falsos. */
for (const [nombre, viejo] of [
  ['el de v1.9.125', 'Con lo obligatorio llegás a <strong>bronce o plata</strong>. El <strong>oro</strong> es para quien hace un poco más: cada logro suma <strong>+20 puntos</strong> y ninguno se gana con lo mínimo.'],
  ['una variante del v3 (cardio)', 'Vas sumando <strong>✦ puntos</strong> a medida que avanzás (ver un video, responder bien) y ganás un <strong>🏆 logro</strong> al completar del todo cada actividad.']]) {
  const r = migrarMarcado(`<p class="d-badges-intro">${viejo}</p>`, KIT).html;
  exige(/3 logros de plus/.test(r), `el texto de "Mis logros" (${nombre}) no pasó al de la regla 2 de recorrido + 3 de plus`);
}
const pill = migrarMarcado('<span><b>Hay 5 logros escondidos.</b> Cada uno suma +20 y te acerca a la medalla de oro.</span>', KIT).html;
exige(/Los 3 de plus suman \+20/.test(pill), 'la pastilla de logros del instructivo sigue diciendo "cada uno suma +20"');
const propioIntro = '<p class="d-badges-intro">Un texto que escribió el curso.</p>';
exige(migrarMarcado(propioIntro, KIT).html === propioIntro, 'tocó un texto de "Mis logros" escrito por el curso');

/* Un #i-play EN USO no se saca. */
const conUso = migrarMarcado('<svg><symbol id="i-play"><path/></symbol></svg><button><svg><use href="#i-play"/></svg></button>', KIT);
exige(/id="i-play"/.test(conUso.html), 'sacó #i-play aunque el curso lo usa');

const r2 = migrarMarcado(h, KIT);
exige(r2.cambios.length === 0 && r2.html === h, `correrlo dos veces cambia algo la segunda: ${r2.cambios.join(', ')}`);

const json = JSON.stringify({ diapos: [{ html: '<b class="d-repaso-title">🔍Repaso rápido<span class="d-repaso-nav"></span></b>' }] });
const j = migrarTituloRepaso(json);
let ok = false; try { ok = JSON.parse(j.texto).diapos[0].html.includes('Repaso rápido:<span'); } catch { ok = false; }
exige(j.n === 1 && ok, 'en curso.json no puso "Repaso rápido:" o dejó un JSON inválido');

/* El aviso de la práctica como FICHA de curso.json (cardio), v1.9.126. */
const conFicha = JSON.stringify({ formato: 1, fichas: [{ id: 'practica-intro', titulo: 'Antes de empezar:', clase: 'd-pracintro',
  cuerpo: '<ul><li>Son <b>4 preguntas</b> para repasar.</li></ul><button data-pracintro-go>Empezar</button>' }, { id: 'otra', cuerpo: '<p>x</p>' }] }, null, 2) + '\n';
const fj = migrarDatosCurso(conFicha, KIT);
let fd = null; try { fd = JSON.parse(fj.texto); } catch { fd = null; }
exige(fd && /d-pracintro-n" aria-hidden="true">4</.test(fd.fichas[0].cuerpo) && /d-pracintro-card/.test(fd.fichas[0].claseTarjeta || ''),
  'la ficha "practica-intro" de curso.json no pasó a las tarjetas del kit conservando "4 preguntas"');
exige(fd && fd.fichas[1].cuerpo === '<p>x</p>', 'tocó otra ficha de curso.json que no era el aviso de la práctica');
exige(migrarDatosCurso(fj.texto, KIT).cambios.length === 0, 'la migración de curso.json cambia algo la segunda vez');

/* "Segunda mirada" → "Explorador" (v1.9.126): el curso sigue con 5. */
const conSegunda = JSON.stringify({ formato: 1, logros: ['punteria', 'racha', 'curioso', 'segunda', 'impecable', { id: 'propio', nom: 'Propio' }] }, null, 2) + '\n';
const sj = migrarDatosCurso(conSegunda, KIT);
let sd = null; try { sd = JSON.parse(sj.texto); } catch { sd = null; }
exige(sd && JSON.stringify(sd.logros.slice(0, 5)) === JSON.stringify(['punteria', 'racha', 'curioso', 'explorador', 'impecable']) && sd.logros[5].id === 'propio',
  'el logro "segunda" de curso.json no pasó a "explorador" en su lugar (o tocó un logro propio)');
const ambos = migrarDatosCurso(JSON.stringify({ logros: ['segunda', 'explorador'] }), KIT);
exige(JSON.parse(ambos.texto).logros.join() === 'explorador', 'con "segunda" y "explorador" a la vez quedó un logro repetido');
exige(migrarDatosCurso(sj.texto, KIT).cambios.length === 0, 'el cambio de "segunda" no es idempotente');

/* Regla 2 de recorrido + 3 de plus (v1.9.127): la lista por defecto vieja
   pasa a la nueva; una lista propia del curso no se toca. */
const vieja = migrarDatosCurso(JSON.stringify({ logros: ['punteria', 'racha', 'curioso', 'explorador', 'impecable'] }), KIT);
exige(JSON.parse(vieja.texto).logros.join() === 'mitad,completo,impecable,racha,explorador', 'la lista de logros por defecto vieja no pasó a 2 de recorrido + 3 de plus');
const propia = JSON.stringify({ logros: ['punteria', 'racha', 'curioso', 'impecable', { id: 'u1', nom: 'U1' }] });
exige(migrarDatosCurso(propia, KIT).texto === propia, 'tocó una lista de logros que el curso armó a mano');

if (fallos.length) {
  console.error(`✗ check-migracion — ${fallos.length} fallo(s):\n  - ` + fallos.join('\n  - '));
  process.exit(1);
}
console.log(`✓ check-migracion — ${r1.cambios.length} cambios sobre un HTML de v1.9.124, nada fuera de lugar, idempotente.`);
