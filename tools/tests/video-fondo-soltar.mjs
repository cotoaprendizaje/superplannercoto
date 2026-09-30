/* video-fondo-soltar.mjs — el video de fondo SUELTA su fuente al salir
   de la diapositiva y la vuelve a enganchar al volver (kit-base v1.9.105).

   Es la cura de raíz del video que "se queda negro y deja de responder"
   en iPad (§7.47, K46): iOS tiene un tope de medios decodificables a la
   vez y desaloja sin avisar al que está pausado. `initBgVideos` le saca el
   `src` a los videos de las diapositivas que nadie mira y lo repone al
   entrar, con la fuente que guardó en `v._fuenteBg` AL INICIALIZAR.

   Por qué existe este test: desde v1.9.98 hasta v1.9.104 el kit NUNCA
   guardaba `_fuenteBg` —la línea que lo asigna no vino en el bloque
   relevado— así que `soltar()` y `reenganchar()` salían en su primera
   línea y la cura no hacía nada. Nadie lo notó porque `video-fondo.mjs`
   da verde en un curso sin video de fondo (no hay nada que mirar), y el
   curso del arnés no tiene. Lo encontró "Prevención cardiovascular", que
   tenía la línea.

   Así que este test NO depende del curso: si no hay ninguna
   `.d-shot-slide--bg-video`, convierte la segunda diapositiva en una y
   llama a `initBgVideos()` él mismo. Los .mp4 se sirven vacíos: lo que se
   mide son los atributos, no la reproducción. */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
page.on('pageerror', e => fallos.push('error JS: ' + e));
await page.route('**/*.mp4', r => r.fulfill({ status: 200, contentType: 'video/mp4', body: '' }));
await page.goto(url);
await page.waitForTimeout(700);
await page.keyboard.press('Escape').catch(() => {});

const prep = await page.evaluate(() => {
  if (!window.motor || typeof window.initBgVideos !== 'function') return { error: 'sin motor o sin initBgVideos' };
  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const activa = document.querySelector('.slide.is-active');
  let sl = slides.find(s => s !== activa && s.matches('.d-shot-slide--bg-video') && s.querySelector('video.d-shot-video'));
  let inyectado = false;
  if (!sl) {
    sl = slides.find(s => s !== activa);
    if (!sl) return { error: 'el curso tiene una sola diapositiva' };
    sl.classList.add('d-shot-slide', 'd-shot-slide--bg-video');
    const shot = document.createElement('div');
    shot.className = 'd-shot'; shot.setAttribute('data-shot', '');
    shot.innerHTML = '<video class="d-shot-video" playsinline muted preload="metadata">' +
      '<source src="video/zz-prueba-fondo.mp4" type="video/mp4"></video>';
    sl.insertBefore(shot, sl.firstChild);
    window.initBgVideos({});
    inyectado = true;
  }
  return { id: sl.getAttribute('data-slide'), origen: activa && activa.getAttribute('data-slide'), inyectado };
});

if (prep.error) {
  fallos.push(`no se pudo armar la prueba: ${prep.error}.`);
} else {
  const leer = () => page.evaluate((id) => {
    const v = document.querySelector(`[data-slide="${id}"] video.d-shot-video`);
    const s = v.querySelector('source');
    return { src: v.getAttribute('src') || (s && s.getAttribute('src')) || '', guardada: v._fuenteBg || '' };
  }, prep.id);
  const ir = async (id) => { await page.evaluate((x) => window.motor.gotoId(x), id); await page.waitForTimeout(500); };
  const donde = prep.inyectado ? ' (diapositiva de video inyectada por el test)' : '';

  const quieto = await leer();
  if (!quieto.guardada) {
    fallos.push(`"${prep.id}"${donde}: \`initBgVideos\` no guardó la fuente en \`_fuenteBg\` al inicializar. ` +
      'Sin eso `soltar()` y `reenganchar()` salen en su primera línea: el video de fondo no se suelta ' +
      'y en iPad vuelve el "se queda negro y no responde" (§7.47, K46).');
  }
  if (quieto.src) {
    fallos.push(`"${prep.id}"${donde}: con la diapositiva INACTIVA el video sigue con la fuente enganchada ` +
      `("${quieto.src}"). Tendría que estar suelta para no ocupar un decodificador en iPad.`);
  }
  await ir(prep.id);
  const adentro = await leer();
  if (!adentro.src) {
    fallos.push(`"${prep.id}"${donde}: al ENTRAR a la diapositiva el video no recuperó su fuente: queda el poster quieto.`);
  }
  if (prep.origen) {
    await ir(prep.origen);
    const afuera = await leer();
    if (afuera.src) fallos.push(`"${prep.id}"${donde}: al SALIR de la diapositiva la fuente no se soltó ("${afuera.src}").`);
  }
}

await browser.close();
report('video-fondo-soltar', fallos);
