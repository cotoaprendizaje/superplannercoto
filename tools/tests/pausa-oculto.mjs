#!/usr/bin/env node
/* pausa-oculto.mjs — kit-base v1.9.87
   ------------------------------------------------------------
   POR QUÉ EXISTE. Reporte del cliente con foto de la pantalla de
   bloqueo de un iPad: aparecía el widget de reproducción del sistema,
   con el nombre del curso y controles de play/pausa.

   Eso lo muestra iOS PORQUE HAY UN VIDEO REPRODUCIÉNDOSE. Al apagar la
   pantalla el curso seguía corriendo: gastaba batería y, con las
   diapositivas `[data-autoadvance]`, avanzaba solo — el alumno
   desbloqueaba y aparecía tres diapositivas más adelante sin haber
   visto nada. Ningún error, ninguna señal: el mismo modo de fallar que
   el cartel de "Girá tu dispositivo".

   REGLA: ningún medio del curso sigue corriendo con la página oculta.

   ⚠️ QUÉ MIDE Y QUÉ NO. Inyecta un `<video>` de mentira —sin fuente— y
   espía su `pause()`. NO verifica que un video real se detenga: eso
   necesita un archivo con bytes, y un curso recién generado no tiene
   ninguno (pisada real: un fixture con videos de 0 bytes hacía que
   `videoUsable()` cortara antes y la medición no probaba nada). Lo que
   sí verifica es el CABLE, que es donde estaba el bug: que exista el
   listener de `visibilitychange` y que llegue a los videos.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

if (!(await page.evaluate(() => typeof window.initBgVideos === 'function'))) {
  fails.push('initBgVideos no está expuesta — coto-media.js no se cargó');
} else {
  const r = await page.evaluate(async () => {
    const slide = (window.motor && window.motor.current()) || document.querySelector('[data-slide]');
    const id = slide.getAttribute('data-slide');
    slide.classList.add('d-shot-slide--bg-video');
    const v = document.createElement('video');
    v.className = 'd-shot-video';
    v.muted = true;
    slide.appendChild(v);

    let pausas = 0;
    v.pause = function () { pausas++; };

    window.initBgVideos();                 // re-engancha con el video nuevo
    const base = pausas;                   // el sync() inicial ya pudo pausar

    /* `document.hidden` es de solo lectura: se redefine, que es
       exactamente lo que ve el listener. */
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise((res) => setTimeout(res, 100));
    const trasOcultar = pausas;

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise((res) => setTimeout(res, 100));

    v.remove();
    slide.classList.remove('d-shot-slide--bg-video');
    return { base, trasOcultar, slide: id };
  });

  if (r.trasOcultar <= r.base) {
    fails.push('al ocultarse la página (pantalla bloqueada o app en segundo plano) no se pausó ningún ' +
      'video de fondo: el curso sigue corriendo detrás, y con [data-autoadvance] avanza solo');
  }
}

report('pausa-oculto', fails, errors);
await browser.close();
