# Cotonetes Forever

App web del equipo de **Aprendizaje e-Learning · COTO CICSA**: tablero de
planificación (Kanban / Calendario / Timeline / Agenda) + mapa de inventario
de cursos y Edu Points.

## Cómo está armado

La app se despliega como **un solo archivo** (`index.html`), con el CSS, el JS,
las fuentes y los logos embebidos. Eso la hace trivial de servir desde
cualquier hosting estático, pero imposible de editar a mano.

Se publica sola: el hosting es **GitHub Pages** sobre este mismo repositorio, y
todo lo que llega a `main` queda en línea en un minuto, en
<https://cotoaprendizaje.github.io/superplannercoto/>. No hay nada que subir a
ningún lado.

Por eso el código vive separado en `src/` y `index.html` se **genera**:

```
src/index.html    estructura de la página (marcadores @@STYLES@@ y @@SCRIPT@@)
src/styles.css    estilos, con las fuentes referenciadas desde assets/
src/app.js        toda la lógica de la app
assets/           fuentes, logos e íconos
build.mjs         inlinea todo y escribe ./index.html
index.html        ← generado. NO está en el repositorio: lo arma el build.
```

## Trabajar en la app

```bash
npm install       # una sola vez (Playwright, para los tests)
npm run build     # regenera index.html desde src/
npm start         # sirve la carpeta en http://localhost:8080
npm test          # las 85 pruebas (build incluido)
```

El ciclo es: editar en `src/`, correr `npm run build`, abrir `index.html`.

> `index.html` no se versiona: está en `.gitignore`. Lo genera `npm run build`
> localmente, y al publicar lo arma GitHub Actions a partir de `src/`. Así lo
> que se prueba y lo que sale a producción son el mismo archivo, y el
> repositorio deja de engordar 2,3 MB en cada publicación.
>
> Si venís de un clon nuevo, corré `npm run build` (o `npm test`, que lo hace)
> antes de abrir nada: hasta entonces el archivo no existe.

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

## Pruebas

Son 70, en tres baterías, y corren solas en cada cambio (ver
`.github/workflows/pruebas.yml`). Todas abren la app de verdad en un navegador
contra `test/fake-backend.mjs`, que imita las filas de Supabase y su endpoint
de ingreso.

| batería | qué fija |
|---|---|
| `test/sync.test.mjs` | Que dos personas editando a la vez no se pisen. |
| `test/tamano.test.mjs` | Que el documento sincronizado no engorde ni se lleve las imágenes adentro. Es la prueba que faltaba el día que se agotó la cuota. |
| `test/ingreso.test.mjs` | Que sin sesión no se baje nada, y que con sesión se trabaje normal aunque el token venza en el medio. |
| `test/numeros.test.mjs` | Que los números que el equipo lee sean los mismos en todas las vistas: que la campana no marque como pendiente algo terminado, y que Reportería coincida con el Planner y con Técnico. |

El flujo genera `index.html` desde `src/` antes de correr las pruebas y
publica exactamente ese archivo: lo que se prueba y lo que sale a producción
son el mismo byte.

Una prueba que no puede fallar no sirve. Cuando agregues una, comprobá que se
ponga en rojo rompiendo a propósito lo que dice cuidar.

## Ingreso

Cada persona entra con su propia cuenta de Supabase (mail y contraseña). La app
manda el token de esa sesión en cada pedido, y la política de la tabla solo le
contesta a quien está autenticado: sin cuenta, la base devuelve una lista
vacía.

Dos consecuencias en el código, que si no sorprenden:

- **El tablero se carga después de entrar, no antes.** `boot()` decide si hay
  sesión y recién entonces llama a `arrancarApp()`, que es lo que baja los
  datos. Antes era al revés porque cualquiera podía leer.
- **Quién es quién se resuelve por el mail**, cruzado contra el que se carga en
  Ajustes → Equipo. Si no coincide con nadie NO se bloquea el paso: entrar ya
  requirió una cuenta válida, y hacerlo obligatorio dejaría al equipo afuera
  por un mail mal tipeado, incluida la persona que tendría que corregirlo. Se
  entra y se avisa en la barra.

El permiso de administrador (quien ve Ajustes) es del lado del cliente: evita
accidentes, no frena a alguien decidido que ya tiene cuenta. Ver
[SEGURIDAD.md](SEGURIDAD.md).
