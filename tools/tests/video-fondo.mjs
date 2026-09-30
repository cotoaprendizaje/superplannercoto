#!/usr/bin/env node
/* video-fondo.mjs — kit-base v1.9.76
   ------------------------------------------------------------
   POR QUÉ EXISTE. El patrón "video de fondo" (patrón 1 de
   coto-media.js) es el de la portada, y todo el trato con el cliente
   es *"dejá el .mp4 ahí, con ese nombre, y anda sin tocar código"*. Lo
   que hay que blindar es justamente eso, porque nada de esto da error:

     1. el NOMBRE y la CARPETA del archivo — si alguien los cambia, el
        video que suba el cliente no lo levanta nadie y la diapositiva
        se queda en el poster para siempre;
     2. el `poster`, que es lo que se ve mientras el archivo no está —
        sin él la diapositiva es un rectángulo negro;
     3. `playsinline`, sin el cual iOS abre el video a pantalla completa
        y se lleva puesto el curso;
     4. el botón de gesto (`.d-shot-video-tap`) OCULTO al nacer: visible
        de entrada es un "reproducir" sobre un video que ya está
        corriendo;
     5. y lo que costó una entrega (§7.18 K10): que con el autoplay CON
        SONIDO rechazado —que es lo que pasa SIEMPRE en la primera
        diapositiva, porque todavía no hubo un gesto del alumno— el
        video **igual termine reproduciéndose**, en mudo, en vez de
        quedarse congelado en el poster.

   El punto 5 solo se puede medir con la política real del navegador:
   sin `--autoplay-policy=document-user-activation-required` el
   navegador de pruebas deja pasar cualquier autoplay y el bug no
   existe. Por eso este test lanza su propio Chromium.
*/
import { report, requireUrl } from './_shared.mjs';
import { chromium } from 'playwright-core';

const url = requireUrl();

/* El HTML sin ejecutar: se pide una sola vez y se cachea. Es la única
   forma de saber cómo NACE un atributo, porque el DOM que ve el test ya
   pasó por todos los `init*` del curso. */
let fuenteCache = null;
async function fuente() {
  if (fuenteCache === null) fuenteCache = await (await fetch(url)).text();
  return fuenteCache;
}
/* Se acota al bloque de ESA diapositiva antes de buscar el chip: un curso
   tiene varias, y el primer `.d-shot-video-tap` del archivo no
   necesariamente es el suyo. */
async function fuenteTapOculta(id) {
  const html = await fuente();
  const abre = html.indexOf(`data-slide="${id}"`);
  if (abre < 0) return null;
  const fin = html.indexOf('</section>', abre);
  const bloque = html.slice(abre, fin < 0 ? undefined : fin);
  const m = bloque.match(/<button[^>]*class="[^"]*d-shot-video-tap[^"]*"[^>]*>/);
  if (!m) return null;
  return /\shidden(\s|=|>)/.test(m[0]);
}
const executablePath = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({
  executablePath,
  args: ['--no-sandbox', '--autoplay-policy=document-user-activation-required']
});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fails = [];
await page.goto(url);
await page.waitForTimeout(400);

const slides = await page.evaluate(() =>
  Array.from(document.querySelectorAll('.d-shot-slide--bg-video')).map((s) => ({
    id: s.closest('[data-slide]')?.getAttribute('data-slide') || '(sin data-slide)',
    hayVideo: !!s.querySelector('video.d-shot-video')
  })));

if (!slides.length) {
  report('video-fondo', []);              // el curso no usa el patrón: nada que verificar
  await browser.close();
  process.exit(process.exitCode || 0);
}

for (const s of slides) {
  if (!s.hayVideo) {
    fails.push(`"${s.id}": declara .d-shot-slide--bg-video pero no tiene <video class="d-shot-video">. ` +
      'Narrador.textOf() la trata como "diapositiva que ES un video" y NO la narra: queda muda.');
    continue;
  }
  const v = await page.evaluate((id) => {
    const sl = document.querySelector(`[data-slide="${id}"]`);
    const vid = sl.querySelector('video.d-shot-video');
    /* La fuente puede estar SOLTADA a propósito (kit-base v1.9.98):
       `initBgVideos` le saca el src a los videos de fondo de las
       diapositivas que nadie está mirando y lo vuelve a enganchar al
       entrar. Es la cura de raíz del video que "se queda negro y deja de
       responder" en iPad: iOS tiene un tope de medios decodificables a la
       vez y desaloja el que está pausado, sin avisar.

       Antes este chequeo leía el `src` del DOM en vivo, así que acusaba
       "el <video> no tiene src" en toda diapositiva de video que no fuera
       la activa — o sea, le fallaba a los cursos que SÍ tienen la cura
       puesta. Medido en los dos cursos terminados: 2 fallos en
       "Prevención cardiovascular" y 3 en "Seguridad alimentaria", los
       cinco sanos.
       La fuente original queda recordada en `_fuenteBg`, así que eso es
       lo que hay que mirar: "tiene una fuente", esté enganchada ahora o
       guardada para volver a engancharla. */
    const src = vid.getAttribute('src') ||
      (vid.querySelector('source') && vid.querySelector('source').getAttribute('src')) ||
      vid._fuenteBg || '';
    const tap = sl.querySelector('.d-shot-video-tap');
    return {
      src,
      poster: vid.getAttribute('poster') || '',
      sinPoster: vid.hasAttribute('data-sin-poster'),
      playsinline: vid.hasAttribute('playsinline'),
      hayTap: !!tap
    };
  }, s.id);

  /* ⚠️ El `hidden` del chip se lee del HTML COMO ESTÁ ESCRITO, no del DOM
     en vivo (kit-base v1.9.94). Antes se medía `tap.hidden` después de
     cargar, y eso da otra cosa: si el video arranca mudo, `initBgVideos`
     MUESTRA el chip a propósito para ofrecer el audio, así que
     `tap.hidden` es false y el test acusaba "nace VISIBLE" sobre un
     curso perfectamente sano. No se había notado nunca porque ningún
     fixture de la suite tenía un video de fondo que se pudiera
     reproducir de verdad: con un mp4 de 0 bytes nada arranca y el chip
     se queda oculto — verde por ausencia. Lo que este chequeo quiere
     decir es lo que dice su mensaje ("tiene que NACER con hidden"), y
     eso solo se puede medir en la fuente. */
  const tapOculto = v.hayTap ? await fuenteTapOculta(s.id) : null;

  if (!v.src) fails.push(`"${s.id}": el <video> no tiene src ni <source>.`);
  else if (!/^video\//.test(v.src)) {
    fails.push(`"${s.id}": el video vive en "${v.src}" y no en video/. La convención del kit es ` +
      'video/<nombre>.mp4 — si alguien la cambia, el archivo final que suba el cliente no lo ' +
      'levanta nadie y no da ningún error.');
  }
  /* `data-sin-poster` — opt-out explícito (kit-base v1.9.95).
     El kit soporta DOS usos del patrón 1 y este chequeo solo contemplaba
     uno: "arte + video", donde el `poster` ES ese arte y tapa el hueco
     mientras el .mp4 no está. El otro uso es "la diapositiva ES el
     video": un contenedor vacío a la espera del archivo, que por pedido
     del cliente va sin nada de placeholder. Ahí no hay poster que poner,
     y la única salida que le quedaba al curso era editar un test del kit
     — que es exactamente lo que no queremos que un curso tenga que hacer.
     El opt-out va en el marcado, se ve al leerlo, y apaga SOLO este
     chequeo: el resto del contrato (src en video/, playsinline, el chip
     naciendo oculto) sigue exigiéndose igual. */
  if (!v.poster && !v.sinPoster) {
    fails.push(`"${s.id}": el <video> no tiene \`poster\`. Mientras el archivo no está —o mientras ` +
      'carga— la diapositiva es un rectángulo negro. Si esta diapositiva ES el video y va sin ' +
      'arte a propósito, marcala con `data-sin-poster` en el <video>.');
  }
  if (!v.playsinline) {
    fails.push(`"${s.id}": al <video> le falta \`playsinline\`: en iOS abre a pantalla completa y ` +
      'se lleva puesto el curso.');
  }
  if (v.hayTap && tapOculto === false) {
    fails.push(`"${s.id}": el botón de gesto (.d-shot-video-tap) nace VISIBLE. Tiene que nacer con ` +
      '`hidden`: lo muestra el JS solo si hizo falta.');
  }
}

/* 5 · con el autoplay bloqueado, el video igual tiene que arrancar. */
const primera = slides.find((s) => s.hayVideo);
if (primera) {
  await page.evaluate((id) => { if (window.motor && window.motor.gotoId) window.motor.gotoId(id); }, primera.id);
  await page.waitForTimeout(2000);
  const est = await page.evaluate((id) => {
    const vid = document.querySelector(`[data-slide="${id}"] video.d-shot-video`);
    return vid ? { pausado: vid.paused, t: vid.currentTime, listo: vid.readyState } : null;
  }, primera.id);
  /* readyState 0 = el archivo no está (placeholder de 0 bytes): eso es
     un estado válido y esperado durante la producción, no un fallo. */
  if (est && est.listo > 0 && est.pausado && est.t === 0) {
    fails.push(`"${primera.id}": el video está cargado y NO se reproduce. Dos causas posibles, y ` +
      'conviene descartarlas en este orden: (a) nadie llamó a `initBgVideos()` — la pieza está y ' +
      'el cable no, que es la falla más común de este molde (§7.17); o (b) el autoplay CON SONIDO ' +
      'fue rechazado —lo normal en la primera diapositiva, porque todavía no hubo un gesto del ' +
      'alumno— y no se reintentó MUDO (§7.18 K10). Lo que el navegador bloquea es el sonido, no el video.');
  }
}

report('video-fondo', fails);
await browser.close();
