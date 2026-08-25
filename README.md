# Cotonetes Forever

App web del equipo de **Aprendizaje e-Learning · COTO CICSA**: tablero de
planificación (Kanban / Calendario / Timeline / Agenda) + mapa de inventario
de cursos y Edu Points.

## Cómo está armado

La app se despliega como **un solo archivo** (`index.html`), con el CSS, el JS,
las fuentes y los logos embebidos. Eso la hace trivial de subir a Netlify o
cualquier hosting estático, pero imposible de editar a mano.

Por eso el código vive separado en `src/` y `index.html` se **genera**:

```
src/index.html    estructura de la página (marcadores @@STYLES@@ y @@SCRIPT@@)
src/styles.css    estilos, con las fuentes referenciadas desde assets/
src/app.js        toda la lógica de la app
assets/           fuentes, logos e íconos
build.mjs         inlinea todo y escribe ./index.html
index.html        ← generado, es lo que se despliega. No editar a mano.
```

## Trabajar en la app

```bash
npm install       # una sola vez (Playwright, para los tests)
npm run build     # regenera index.html desde src/
npm start         # sirve la carpeta en http://localhost:8080
npm test          # pruebas de sincronización
```

El ciclo es: editar en `src/`, correr `npm run build`, abrir `index.html`.

> `index.html` es un artefacto generado. Si lo editás directo, el siguiente
> build te pisa los cambios.

### Sobre los nombres de variables

El código se recuperó desde una versión ofuscada. Los nombres de función
sobrevivieron enteros, pero los de las variables no: el ofuscador los reemplazó
por `_0x4f2abb` y esos ya no se pueden recuperar. Se les infirió un nombre a
partir de cómo se usa cada una, así que la mayoría dice algo (`tarjeta`,
`miembro`, `fecha`, `html`, `el`). Donde no alcanzó la evidencia quedaron
nombres genéricos: `arg` para parámetros, `val` para locales. Si tocás una
función y ves uno de esos, ponele el nombre que corresponda.

Para probar con datos de ejemplo en vez de los reales, poné
`window.__CF_SEED__ = true` en la consola antes de cargar la página.

## Persistencia

Los datos se guardan en una fila de Supabase (`BACKEND` en `src/app.js`) y se
sincronizan por polling cada 5 segundos. Si no hay backend disponible, la app
cae a `window.storage` y, en última instancia, a memoria (modo demo: los
cambios se pierden al recargar).

Como el backend guarda **un único documento JSON** con todo el tablero, el
riesgo permanente es que dos personas editando a la vez se pisen. Para evitarlo:

- cada tarjeta lleva su propio `updatedAt`;
- antes de escribir, `persist()` relee lo remoto y mezcla tarjeta por tarjeta,
  quedándose con la versión más nueva de cada una;
- los borrados dejan una lápida en `state.deleted` (se podan a los 30 días) para
  que una tarjeta borrada no reviva desde la copia de otra persona.

`npm test` fija ese comportamiento levantando un backend de mentira y dos
navegadores que editan al mismo tiempo. Si alguien vuelve a hacer que el
guardado escriba la copia local entera, esas pruebas se ponen en rojo.

## Ingreso

La pantalla de entrada pide identificarse con un nombre y, si hay clave
configurada, una clave de ingreso. Ambas cosas se manejan del lado del cliente:
sirven para saber quién carga qué, **no** son un control de acceso real.

Los datos del planner hoy son accesibles para cualquiera que abra la app. Ver
[SEGURIDAD.md](SEGURIDAD.md) para el detalle y qué se puede hacer al respecto.
