/* check-video-autoplay-ios — el video de fondo tiene que arrancar
   aunque el navegador rechace el autoplay con audio.

   Bug real (reporte del cliente, iPad): iOS/iPadOS nunca deja autoplay
   con sonido sin un gesto previo. `play()` se rechazaba con
   NotAllowedError, el video se quedaba en el poster y —como estas
   diapos son [data-autoadvance] y encadenan con `ended`— el curso se
   clavaba esperando un final que no llegaba nunca.

   No se puede reproducir con el .mp4 real acá: este Chromium no trae
   H.264, así que el <video> entra en error antes de llegar a la
   política de autoplay. Lo que sí se puede probar —y es exactamente la
   rama que se escribió— es el comportamiento ante el rechazo: se
   stubbea play() para que rechace con NotAllowedError la primera vez
   (como iOS con audio) y resuelva la segunda (como iOS muteado). */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const fallos = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });

async function escenario({ nombre, muteGlobal, dejaMuteado }) {
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
  await page.addInitScript(({ muteGlobal, dejaMuteado }) => {
    try { localStorage.setItem('coto-diapos-mute', muteGlobal ? '1' : '0'); } catch (e) {}
    window.__llamadas = [];
    const orig = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!this.classList.contains('d-shot-video')) return orig.apply(this, arguments);
      window.__llamadas.push({ muted: this.muted });
      // 1er intento (con el audio que corresponda) → lo rechaza iOS.
      // 2º intento → solo lo acepta si viene muteado.
      if (window.__llamadas.length === 1) {
        const e = new Error('autoplay'); e.name = 'NotAllowedError';
        return Promise.reject(e);
      }
      if (!dejaMuteado && this.muted === false) {
        const e = new Error('autoplay'); e.name = 'NotAllowedError';
        return Promise.reject(e);
      }
      return this.muted ? Promise.resolve() : Promise.reject(Object.assign(new Error('x'), { name: 'NotAllowedError' }));
    };
    // El <video> no decodifica acá (este Chromium no trae H.264): se
    // finge una fuente sana para que videoUsable() no corte antes de
    // llegar a la política de autoplay.
    Object.defineProperty(HTMLMediaElement.prototype, 'error', { get() { return null; } });
    Object.defineProperty(HTMLMediaElement.prototype, 'networkState', { get() { return 1; } });
    /* Y además hay que frenar el evento `error` del <source>, que en un
       dispositivo real NO ocurre. `initBgVideos` escucha 'error' sobre
       el <video> en fase de CAPTURA, así que alcanza a los <source>
       hijos: al fallar la decodificación escondía el botón de sonido y
       el test daba un falso negativo. Este listener va sobre document,
       también en captura, así que corre ANTES y corta la propagación. */
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'SOURCE') e.stopPropagation();
    }, true);
  }, { muteGlobal, dejaMuteado });

  await page.goto(url);
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(800);

  const r = await page.evaluate(() => {
    const v = document.querySelector('.slide.is-active video.d-shot-video');
    const tap = document.querySelector('.slide.is-active .d-shot-video-tap');
    return {
      llamadas: window.__llamadas, muted: v && v.muted,
      tapVisible: tap ? !tap.hidden : null,
      // `data-modo` es el contrato del kit desde v1.9.72 (§7.18 K10):
      // el curso rotula el botón leyendo esto — "sonido" = arrancó
      // mudo y te ofrece el audio; "reproducir" = no arrancó.
      tapModo: tap ? tap.getAttribute('data-modo') : null,
      // ¿la diapositiva probada es la PRIMERA del curso? (ver abajo)
      esPrimera: !!tap && tap.closest('[data-slide]') === document.querySelector('[data-slide]')
    };
  });
  await page.close();
  return r;
}

/* ---- NO SE EJECUTA en un curso sin video de fondo (kit-base
   v1.9.82): un curso recién generado no tiene ninguno, y un test que
   le falla a un curso al que no le corresponde enseña a ignorar la
   suite (mismo criterio que `simulador.mjs`, §7.27). */
{
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(400);
  const hay = await page.evaluate(() => !!document.querySelector('video.d-shot-video'));
  await page.close();
  if (!hay) {
    console.log('  · el curso no tiene ningún video de fondo: nada que revisar.');
    await browser.close();
    report('video-autoplay-ios', []);
    process.exit(process.exitCode || 0);
  }
}

/* 1 · Sonido activado (el caso del cliente). Rechazo con audio →
      reintento muteado → el video arranca igual y se ofrece el sonido. */
{
  const r = await escenario({ nombre: 'sonido on', muteGlobal: false, dejaMuteado: true });
  if (r.llamadas.length < 2) {
    fallos.push(`sonido on: hubo ${r.llamadas.length} intento(s) de play() — falta el reintento muteado tras NotAllowedError`);
  } else {
    if (r.llamadas[0].muted !== false) fallos.push('sonido on: el 1er intento tendría que ser CON audio');
    if (r.llamadas[1].muted !== true) fallos.push('sonido on: el reintento tendría que ser MUTEADO');
  }
  if (r.muted !== true) fallos.push('sonido on: el video quedó sin mutear, no habría arrancado en iOS');
  if (r.tapVisible !== true) fallos.push('sonido on: arrancó muteado pero no se ofrece el botón para recuperar el audio');
  /* En la PRIMERA diapositiva del curso el rótulo correcto es `inicio`
     ("Tocá para comenzar"), no `sonido`. Es una decisión de producto de
     kit-base v1.9.94: en iOS el audio no arranca sin un gesto del
     alumno, y ese gesto obligatorio no tiene que leerse como un error —
     en la portada el chip ES el botón de empezar. `rotularTap()` traduce
     `sonido`/`reproducir` → `inicio` cuando el chip vive en la primera
     diapositiva.
     Este test exigía `sonido` siempre, así que un curso con la portada
     en `--bg-video` no podía pasar a la vez este test y `video-tap-chip`
     (que exige `inicio` ahí). Lo que importa verificar sigue intacto:
     que el chip QUEDE VISIBLE ofreciendo el audio (r.tapVisible, arriba)
     y que el video haya arrancado muteado — no la palabra exacta.

     ⚠️ Medido al integrarlo (kit-base v1.9.95), para que nadie le
     atribuya más de lo que hace: la rama `'sonido'` de acá abajo NO es
     alcanzable hoy. Este escenario mide la diapositiva ACTIVA AL
     CARGAR, y esa es siempre la primera del documento — probado con un
     curso de dos diapositivas `--bg-video` y también entrando por
     `#slide=`, que no cambia la activa. O sea que `esPrimera` da
     siempre true y, en conducta, esto es lo mismo que aceptar los dos
     modos. Se escribe así igual porque DICE la decisión de producto en
     vez de relajarla, y porque el día que el test navegue a un video
     del medio la aserción ya está bien. Lo que no hay que hacer es
     confiar en que este test cuida el caso de una diapositiva de video
     que no sea la portada: no lo cuida nadie. */
  const modoEsperado = r.esPrimera ? 'inicio' : 'sonido';
  if (r.tapModo !== modoEsperado) {
    fallos.push(`sonido on: el botón quedó en data-modo="${r.tapModo}", se esperaba "${modoEsperado}" — ` +
      'arrancó mudo, tiene que OFRECER el sonido');
  }
}

/* 2 · El alumno apagó el sonido a propósito. El primer `play()` ya sale
      muteado, así que NO hay reintento que hacer: reintentar en mudo lo
      que ya falló en mudo no es un problema de gesto.

      ⚠️ Acá la versión que llegó con el relay esperaba que el botón se
      ESCONDIERA, y se corrigió al integrarlo (kit-base v1.9.82): el
      video NO está corriendo, así que esconder el único control deja
      un poster congelado sin salida. El kit muestra el botón en modo
      "reproducir", que es lo que corresponde ofrecerle — y el rótulo
      lo decide el curso leyendo `data-modo`. */
{
  const r = await escenario({ nombre: 'mute global', muteGlobal: true, dejaMuteado: true });
  if (r.muted !== true) fallos.push('mute global: el video tendría que quedar muteado');
  /* El primer `play()` ya sale muteado, así que el reintento mudo de
     `attempt()` no tiene nada que hacer: reintentar en mudo lo que ya
     falló en mudo no es un problema de gesto. Lo que SÍ vuelve a
     intentar es el reintento diferido (§7.30): cuando llegan los datos
     (`canplay`) o cuando hay un primer gesto. Por eso acá no se cuentan
     intentos — la cantidad depende de cuál de los dos llegó primero,
     y las dos son correctas.
     Lo que importa es dónde termina: el video corriendo mudo y el botón
     ESCONDIDO, porque no hay nada que ofrecerle a alguien que apagó el
     sonido a propósito. Si en cambio ninguno de los reintentos lo
     levantó, el botón tiene que estar visible en modo "reproducir": un
     póster congelado sin control es un callejón sin salida. */
  if (r.llamadas.length < 1) fallos.push('mute global: no hubo ningún intento de play()');
  if (r.tapVisible === true && r.tapModo !== 'reproducir') {
    fallos.push(`mute global: el botón quedó visible en data-modo="${r.tapModo}" — el alumno apagó ` +
      'el sonido a propósito, no corresponde ofrecerle audio');
  }
}

/* 3 · El caso que reportó el cliente: al cargar fallan LOS DOS intentos
      (con audio y muteado), como pasa en el iframe del LMS cuando Safari
      no da por válido ningún gesto previo. Antes eso dejaba el póster
      quieto para siempre y, como la diapo es [data-autoadvance], el
      curso se quedaba esperando un `ended` que no llegaba — había que
      navegar a la siguiente y volver para que arrancara. Ahora el primer
      gesto real del alumno dispara un reintento. */
{
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 }, hasTouch: true, isMobile: true });
  await page.addInitScript(() => {
    try { localStorage.setItem('coto-diapos-mute', '0'); } catch (e) {}
    window.__llamadas = [];
    // Todo intento ANTERIOR al primer gesto se rechaza, muteado o no.
    window.__huboGesto = false;
    HTMLMediaElement.prototype.play = function () {
      if (!this.classList.contains('d-shot-video')) return Promise.resolve();
      window.__llamadas.push({ muted: this.muted, trasGesto: window.__huboGesto });
      if (!window.__huboGesto) {
        const e = new Error('autoplay'); e.name = 'NotAllowedError';
        return Promise.reject(e);
      }
      this.__reproduciendo = true;
      return Promise.resolve();
    };
    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      get() { return !this.__reproduciendo; }, configurable: true
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'error', { get() { return null; } });
    Object.defineProperty(HTMLMediaElement.prototype, 'networkState', { get() { return 1; } });
    document.addEventListener('error', function (e) {
      if (e.target && e.target.tagName === 'SOURCE') e.stopPropagation();
    }, true);
  });

  await page.goto(url);
  await page.waitForTimeout(1500);

  const antes = await page.evaluate(() => ({ n: window.__llamadas.length, sonando: !document.querySelector('.slide.is-active video.d-shot-video').paused }));
  if (antes.sonando) fallos.push('gesto: el escenario no se montó bien, el video ya estaba reproduciendo antes del gesto');

  // El alumno toca cualquier cosa por primera vez.
  await page.evaluate(() => { window.__huboGesto = true; });
  await page.tap('body', { timeout: 3000 }).catch(() => page.mouse.click(500, 400));
  await page.waitForTimeout(800);

  const despues = await page.evaluate(() => {
    const v = document.querySelector('.slide.is-active video.d-shot-video');
    return { n: window.__llamadas.length, sonando: !v.paused,
             trasGesto: window.__llamadas.filter(x => x.trasGesto).length };
  });

  if (despues.n <= antes.n) {
    fallos.push(`gesto: no hubo ningún reintento tras el primer toque (${antes.n} intentos antes, ${despues.n} después) — el póster se quedaría quieto y el curso no avanzaría solo`);
  }
  if (!despues.sonando) {
    fallos.push('gesto: el video sigue pausado después del primer gesto del alumno');
  }

  await page.close();
}

await browser.close();
report('video-autoplay-ios', fallos);
