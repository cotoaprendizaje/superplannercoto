/* ============================================================
   escenario-boilerplate.js · EL CONTENIDO DE UN SIMULADOR
   ------------------------------------------------------------
   kit-base v1.9.81 · plantilla. Se copia a `js/escenario.js` del
   curso y se llena. Ver CLAUDE.md §7.27 y `js/coto-simulador.js`.

   ESTE ARCHIVO ES DATOS, NO PROGRAMA. Lo puede editar un diseñador
   instruccional sin abrir `curso.js` ni saber JavaScript: son textos,
   números y listas.

   POR QUÉ EXISTE
   Para UN simulador da igual tener el contenido adentro del motor.
   Para una LÍNEA de simuladores significa que el segundo cuesta lo
   mismo que el primero, porque hay que volver a leer 1.000 líneas de
   motor para cambiar tres textos. Separarlos es lo que convierte "un
   simulador" en "el molde de los simuladores".

   LA REGLA: acá va todo lo que cambia entre un simulador y otro. En
   `curso.js` queda el cableado de las pantallas; en
   `coto-simulador.js`, la mecánica.

   ⚠️ UN `var` DUPLICADO GANA EN SILENCIO. Si al migrar un simulador
   dejás la copia vieja de un dato en `curso.js` además de acá, el
   `var` de más abajo pisa al de arriba y el curso sigue diciendo lo
   viejo mientras este archivo dice lo nuevo. Pasó, y no lo agarró
   ninguna lectura del código: lo agarró comparar el texto en pantalla
   contra el de este archivo.
   ============================================================ */
(function (global) {
  'use strict';

  global.ESCENARIO = {

    /* ============================================================
       1 · VARIANTES DEL EJERCICIO
       ------------------------------------------------------------
       Cada variante es una partida posible: los datos del caso que le
       toca resolver al alumno. El simulador elige una al azar al
       empezar, así repetirlo no es repetirlo de memoria.

       ⚠️ CON DATOS REALES. Un código inventado se detecta al primer
       alumno que lo busque en el sistema, y ahí el simulador pierde
       justo lo que lo hace valer. Es preferible UNA variante real que
       tres verosímiles: el mecanismo del sorteo ya está, y sumar
       variantes después es agregar objetos a esta lista.
       ============================================================ */
    variantes: [
      {
        // Los campos son libres: los lee `onVariante` del curso, que
        // es quien sabe dónde va cada dato en SU pantalla.
        sucursal: '000',
        producto: { desc: '', codigo: '', precio: '' }
      }
    ],

    /* ============================================================
       2 · LA RESPUESTA CORRECTA
       ------------------------------------------------------------
       Qué hay que completar/elegir para resolver la última pantalla.
       Lo lee el cableado del curso, no el motor.
       ============================================================ */
    respuesta: {},

    /* ============================================================
       3 · LAS PANTALLAS, EN ORDEN
       ------------------------------------------------------------
       `id`     — tiene que coincidir con el `data-slide` de la
                  diapositiva y con el `data-sim-ruta-i` de la ruta.
       `titulo` — lo que dice el "¡Ups!" y la locución de la ruta.
       `rotulo` — lo que muestra la hoja de ruta: corto, en
                  infinitivo, para leerlo de un vistazo.
       `logro`  — id de un logro de `logros`, se desbloquea al
                  resolver la pantalla.
       `pistas` — TRES, de menos a más concreta, y CADA UNA CUESTA
                  UNA LUPA del presupuesto.

       CÓMO SE ESCRIBEN LAS TRES PISTAS (esto es lo que más se
       equivoca, y lo que más notó el cliente):
         1ª — ORIENTA y dice qué mirar. No canta nada.
         2ª — ACOTA: reduce el campo de búsqueda.
         3ª — SEÑALA: da la respuesta, y el motor además resalta la
              zona en la pantalla. Por eso vale una lupa.
       Nunca repiten: pedir la siguiente tiene que traer información
       NUEVA. Tres párrafos que dicen lo mismo con otras palabras es
       exactamente el bug que el cliente reportó en el primer
       simulador ("cada vez que abro una nueva es la misma info").

       Y ninguna se burla ni presupone que el alumno es lento: puede
       ser su primer día (§6.10.2.3).
       ============================================================ */
    pasos: [
      {
        id: 'pantalla-1',
        titulo: '',
        rotulo: '',
        logro: '',
        pistas: ['', '', '']
      }
    ],

    /* ============================================================
       4 · TRAMPAS
       ------------------------------------------------------------
       Controles que existen de verdad en la pantalla y que NO van
       para este pedido. Tocarlos es un error, con su explicación.

       REGLA DURA: solo se ponen las que el alumno puede razonar con
       lo que el curso le enseñó. Una trampa que no se puede deducir
       no enseña, castiga — y el alumno queda en un callejón sin
       entender qué pasó. Los filtros internos que el curso nunca
       explica van en `notaFiltros`, no acá.
       ============================================================ */
    trampas: {},

    /* Los controles que NO penalizan: se tocan, quedan como están y
       avisan UNA vez que para este pedido dan igual. Existe porque un
       control que responde al clic y no hace nada es un control roto
       (§7.3), y uno que castiga sin que el curso lo haya explicado es
       una trampa. Esto no es ninguna de las dos. */
    notaFiltros: 'Ese control existe en el sistema, pero para este pedido no cambia nada.',

    /* ============================================================
       5 · ERRORES DE NAVEGACIÓN
       ------------------------------------------------------------
       Qué decir cuando el alumno toma el camino equivocado. Cada
       texto explica POR QUÉ no es, no solo que no es.
       ============================================================ */
    erroresMenu: {},

    /* ============================================================
       6 · LOGROS
       ------------------------------------------------------------
       `id` viaja en el suspend_data de SCORM (4096 caracteres
       contados): clave corta y estable, no una frase.

       NO poner un logro por "terminar sin usar pistas": premia al que
       duda y no pide ayuda para no perder la medalla, que es
       exactamente el comportamiento que no queremos. Las pistas están
       para usarse.
       ============================================================ */
    logros: [
      { id: '', nom: '', ic: '🏆', txt: '', pista: '' }
    ],

    /* El logro que se desbloquea al terminar el simulador entero. */
    logroFinal: '',

    /* ============================================================
       7 · REGLAS DEL JUEGO
       ------------------------------------------------------------
       Los números que el cliente puede querer mover sin tocar lógica.

       SOBRE `pistasTotales`: si el presupuesto es igual o mayor a la
       cantidad de pantallas, nunca aprieta — siempre alcanza, y
       entonces no hay ninguna decisión que tomar. Que el alumno tenga
       que elegir DÓNDE gastarlas es lo que le da sentido al
       presupuesto, y lo que hace que quedarse sin pistas (con su
       reloj y su "¡Ups!") sea algo que puede pasar de verdad.
       ============================================================ */
    reglas: {
      pistasTotales: 3,        // lupas para todo el simulador
      segundos: 30,            // reloj, una vez gastada la última pista
      nudgeSegundos: 18,       // inactividad antes de señalar la ayuda
      respiroMs: 1400,         // pausa antes de cambiar de pantalla
      zoomBajoDe: 430,         // alto de lienzo (px) que enciende la lupa
      puntosPaso: 25,
      puntosLimpio: 10,        // extra por resolver una pantalla sin errores
      locucionFeedback: true,  // ¿se dice en voz alta el acierto y el error?
      niveles: ['Para empezar', 'Un poco más cerca', 'Te la señalo']
    },

    /* ============================================================
       8 · EL "¡UPS!"
       ------------------------------------------------------------
       Perder tiene que decir DÓNDE te trabaste, no solo que perdiste:
       un cartel genérico manda al alumno a repetir desde cero las
       pantallas que ya tenía resueltas, que es la forma más rápida de
       que abandone.
       ============================================================ */
    ups: {
      etiqueta: 'Te trabaste en',
      retomarTxt: 'Tocá Reintentar para volver a esta pantalla con una pista nueva.',
      desdeCero: 'Empezar el simulador de nuevo'
    },

    /* ============================================================
       9 · VOCABULARIO PARA LA LOCUCIÓN
       ------------------------------------------------------------
       Siglas y números que, leídos letra por letra, sonarían mal. El
       diccionario base del kit ya trae la tabla oficial del Manual de
       Contenido: acá van SOLO las de este simulador.

       ⚠️ EL ORDEN IMPORTA: el reemplazo es secuencial, así que las
       entradas compuestas van ANTES que las sueltas. Si 'Codificacion'
       se aplica antes que 'Codificacion/Datos', la barra queda suelta
       y el sintetizador la lee como "barra diagonal" en medio de la
       frase. Reportado escuchando el curso, no leyéndolo.
       ============================================================ */
    vocabulario: [
      // ['Texto en pantalla', 'como-se-lee']
    ]
  };
})(window);
