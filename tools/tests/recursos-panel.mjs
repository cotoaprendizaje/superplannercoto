#!/usr/bin/env node
/* recursos-panel.mjs — kit-base v1.9.86
   ------------------------------------------------------------
   POR QUÉ EXISTE. El panel de Recursos subió al kit desde "Seguridad de
   la información", y trae dos mecanismos que pueden fallar EN SILENCIO:

     1. el botón del header se muestra o se esconde según haya o no
        fichas en el panel. Si eso se rompe, un curso sin documentos
        muestra un botón que abre un cajón vacío — y nada avisa;

     2. "Ver en el curso" (`.d-recurso-ir`) pasa por el MISMO gate que
        el índice lateral. Si ese cable se suelta, Recursos se convierte
        en el atajo que saltea las diapositivas —y los gates— del medio:
        el alumno abre el cajón, toca el último documento y aparece del
        otro lado sin haber cumplido nada. El curso sigue "funcionando".

   ⚠️ Igual que `objetivos-progreso`, este test se arma su propio
   marcado. El boilerplate trae la ficha de ejemplo COMENTADA (un curso
   puede no tener documentos), así que un guard de "si no hay fichas,
   salteo" se saltearía siempre en el curso fresco del kit: verde por
   ausencia. Lo que se protege acá es el mecanismo, no el contenido.
*/
import { openCourse, report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const { browser, page, errors } = await openCourse(url);
const fails = [];

/* ---- 1. El botón se esconde cuando NO hay recursos ---------------- */
const vacio = await page.evaluate(() => {
  const btn = document.getElementById('d-recursos-btn');
  const panel = document.querySelector('[data-popup="recursos"]');
  return { hayBtn: !!btn, hayPanel: !!panel, oculto: btn ? btn.hidden : null,
           fichas: panel ? panel.querySelectorAll('.d-recurso').length : null };
});
if (!vacio.hayPanel) fails.push('el curso no trae el panel [data-popup="recursos"] del boilerplate');
if (!vacio.hayBtn) fails.push('el curso no trae el botón #d-recursos-btn del header');
else if (vacio.fichas === 0 && !vacio.oculto) {
  fails.push('el panel no tiene ninguna ficha .d-recurso pero el botón de Recursos se muestra igual');
}

/* ---- 2. …y se muestra cuando SÍ los hay -------------------------- */
if (vacio.hayBtn && vacio.hayPanel) {
  const conFicha = await page.evaluate(() => {
    const panel = document.querySelector('[data-popup="recursos"]');
    const ul = panel.querySelector('.d-recursos') || panel;
    const li = document.createElement('li');
    li.className = 'd-recurso';
    li.innerHTML = '<button class="d-recurso-ir" type="button" data-goto="__lejos__">' +
      '<span class="sr-only">Ir a la diapositiva lejana</span></button>';
    ul.appendChild(li);
    window.initRecursos ? window.initRecursos() : null;
    return { oculto: document.getElementById('d-recursos-btn').hidden, expuesta: !!window.initRecursos };
  });
  if (!conFicha.expuesta) {
    fails.push('initRecursos no está expuesta: no hay forma de re-evaluar el botón tras agregar fichas');
  } else if (conFicha.oculto) {
    fails.push('con una ficha .d-recurso en el panel, el botón de Recursos sigue escondido');
  }

  /* ---- 3. El gate: "Ver en el curso" arranca DESHABILITADO -------
     El refresco se dispara por el camino REAL del curso —un
     `slidechange`, que es lo que corre en cada paso— y no llamando a
     mano al `refrescar` que devuelve `initIndexJumps`, que el test no
     tiene a mano. Así lo que se verifica es el cableado del curso, no
     una función suelta del kit. */
  await page.evaluate(() => {
    const cur = window.motor && window.motor.current();
    document.dispatchEvent(new CustomEvent('slidechange', {
      detail: { id: cur ? cur.getAttribute('data-slide') : 'portada' }
    }));
  });
  const gate = await page.evaluate(() => {
    const b = document.querySelector('.d-recurso-ir[data-goto="__lejos__"]');
    /* `__lejos__` no es ninguna diapositiva de este curso, así que el
       `visited` del curso tiene que darla por NO visitada. Si el botón
       queda habilitado, o nadie lo cableó, o el cable no mira lo
       visitado — las dos cosas lo vuelven un atajo. */
    return { disabled: b ? b.disabled : null, existe: !!b };
  });
  if (!gate.existe) fails.push('no se pudo insertar la ficha de prueba');
  else if (!gate.disabled) {
    fails.push('"Ver en el curso" de una diapositiva NO visitada quedó habilitado: ' +
      'Recursos saltea los gates del medio (falta initIndexJumps con selector .d-recurso-ir)');
  }

  await page.evaluate(() => {
    const li = document.querySelector('.d-recurso-ir[data-goto="__lejos__"]');
    if (li) li.closest('.d-recurso').remove();
    if (window.initRecursos) window.initRecursos();
  });
}

report('recursos-panel', fails, errors);
await browser.close();
