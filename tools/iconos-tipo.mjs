/* ============================================================
   iconos-tipo.mjs · EL CATÁLOGO CANÓNICO DE ÍCONOS DEL ÍNDICE
   ------------------------------------------------------------
   kit-base v1.9.87 · §7.35

   POR QUÉ EXISTE
   --------------
   Pedido del cliente, textual: *"¿esto tiene una lógica coherente?
   para que en todos los cursos se use el mismo sistema de íconos para
   el índice"*.

   El kit ya tenía media respuesta desde v1.9.76: la regla §7.21 E (una
   diapositiva de CONTENIDO lleva el ícono de su tema, y dos temas
   distintos nunca comparten ícono) y el test `iconos-indice.mjs` que la
   hace cumplir. Pero esa regla mira UN curso por vez: evita choques
   adentro, y no dice nada sobre qué ícono le toca a "Portada".

   Medido sobre los dos cursos terminados, el resultado fue el
   previsible — el mismo rol con íconos distintos, y peor, el mismo
   ícono con significados distintos:

     rol                       Seg. alimentaria   Seg. de la información
     Portada                   i-flag             i-home
     Índice de contenidos      i-grid             i-list
     Presentación de unidad    i-layers           i-flag  ← Portada en el otro
     Resumen / Repaso          i-book  ← = Introducción   i-list-check

   Los dos cursos SÍ habían convergido solos en varios (Introducción =
   i-book, Últimos consejos = i-bulb, Cierre = i-medal): esa
   convergencia espontánea es la prueba de que la convención quiere
   existir. Acá se escribe.

   QUÉ ES UN ÍCONO DE TIPO Y QUÉ NO
   --------------------------------
   TIPO = el rol de la diapositiva en la estructura del curso, que es
   el mismo en todos los cursos: la portada es la portada acá y en
   cualquier otro. Estos íconos son FIJOS y SE REPITEN a propósito
   (todas las presentaciones de unidad llevan el mismo).

   TEMA = de qué habla esa diapositiva. Cambia por curso y NO se
   canoniza: "Contaminación" o "Contraseñas" son contenido. Ahí sigue
   valiendo la regla de siempre — un ícono propio por tema, nunca
   repetido dentro del curso.

   ⚠️ Un ícono de TIPO no se usa para una diapositiva de contenido, ni
   al revés. Si una diapositiva de tema usa `i-medal`, el alumno lee
   "cierre" donde no lo hay. El test lo verifica en las dos
   direcciones.
   ============================================================ */

/* La clave es el valor de `data-icono-tipo` en el ítem del índice. */
export const ICONOS_TIPO = {
  portada:      { icono: 'i-flag',       que: 'La primera diapositiva del curso.' },
  introduccion: { icono: 'i-book',       que: 'De qué se trata el curso. Los dos cursos ya coincidían.' },
  objetivos:    { icono: 'i-target',     que: 'Los objetivos de aprendizaje.' },
  indice:       { icono: 'i-grid',       que: 'El índice de contenidos DIBUJADO como diapositiva. `i-grid` y no `i-list`: `i-list` se confunde con `i-list-check` del resumen a tamaño chico.' },
  unidad:       { icono: 'i-layers',     que: 'La presentación/portada de una unidad. Se repite en todas, a propósito. `i-layers` y no `i-flag`: `i-flag` ya es la portada del curso, y un curso lo usaba para las dos cosas.' },
  resumen:      { icono: 'i-list-check', que: 'El resumen o repaso de una unidad. Se repite en todos. NO `i-book`: un curso lo usaba para esto Y para Introducción, así que dos roles distintos se veían igual.' },
  minijuego:    { icono: 'i-game',       que: 'La diapositiva del minijuego.' },
  evaluacion:   { icono: 'i-examen',     que: 'La evaluación, cuando vive dentro del curso.' },
  consejos:     { icono: 'i-bulb',       que: 'Los últimos consejos / para tu día a día. Los dos cursos ya coincidían.' },
  cierre:       { icono: 'i-medal',      que: 'El cierre y la felicitación. Los dos cursos ya coincidían.' }
};

/* Los trazos, en el mismo estilo de línea 24x24 que el resto del kit
   (fill:none, stroke:currentColor, width 2, cap/join redondos). */
export const TRAZOS_TIPO = {
  'i-flag':       '<path d="M4 21V4h11l-1.5 4L15 12H4"/>',
  'i-book':       '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M6 17h13"/>',
  'i-target':     '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  'i-grid':       '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  'i-layers':     '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  'i-list-check': '<polyline points="3 7 5 9 9 5"/><polyline points="3 16 5 18 9 14"/><line x1="12" y1="7" x2="21" y2="7"/><line x1="12" y1="17" x2="21" y2="17"/>',
  'i-game':       '<rect x="2" y="7" width="20" height="11" rx="4"/><line x1="7" y1="10.5" x2="7" y2="14.5"/><line x1="5" y1="12.5" x2="9" y2="12.5"/><circle cx="16" cy="11.5" r="1"/><circle cx="18.5" cy="14" r="1"/>',
  'i-examen':     '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><polyline points="9 13 11 15 15 11"/>',
  'i-bulb':       '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.4.3.5.7.5 1.1v1h6v-1c0-.4.1-.8.5-1.1A6 6 0 0 0 12 3z"/>',
  'i-medal':      '<circle cx="12" cy="15" r="6"/><path d="M8.5 9.5L6 2h12l-2.5 7.5"/>'
};

/* Devuelve el `<symbol>` de cada ícono de tipo, listo para el sprite. */
export function spriteTipos(ids) {
  const lista = ids || Object.keys(TRAZOS_TIPO);
  return lista.map((id) =>
    `    <symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TRAZOS_TIPO[id]}</symbol>`
  ).join('\n');
}

/* El conjunto de ids canónicos, para que el test no los reimplemente. */
export const IDS_TIPO = new Set(Object.values(ICONOS_TIPO).map((t) => t.icono));
