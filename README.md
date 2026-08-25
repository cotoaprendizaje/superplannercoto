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
npm run build     # regenera index.html desde src/
npm start         # sirve la carpeta en http://localhost:8080
```

El ciclo es: editar en `src/`, correr `npm run build`, abrir `index.html`.

> `index.html` es un artefacto generado. Si lo editás directo, el siguiente
> build te pisa los cambios.

## Persistencia

Los datos se guardan en una fila de Supabase (`BACKEND` en `src/app.js`) y se
sincronizan por polling cada 5 segundos. Si no hay backend disponible, la app
cae a `window.storage` y, en última instancia, a memoria (modo demo: los
cambios se pierden al recargar).

## Ingreso

La pantalla de entrada pide identificarse con un nombre y, si hay clave
configurada, una clave de ingreso. Ambas cosas se manejan del lado del cliente:
sirven para saber quién carga qué, **no** son un control de acceso real.
