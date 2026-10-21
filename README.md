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
npm test          # las 407 pruebas (build incluido)
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

## Respaldo automático

El plan gratuito de Supabase no guarda copias. Por eso
`.github/workflows/respaldo.yml` corre `scripts/respaldo.mjs` todos los lunes a
las 6:52 (también se puede correr a mano desde Actions): entra con una cuenta
propia del respaldo, baja el tablero, las portadas, Técnico y Edu Point, y deja
un archivo **cifrado** como artefacto de la corrida durante 90 días. Cifrado
porque el repositorio es público y los artefactos los puede bajar cualquiera.

Se restaura desde la app: Ajustes → Importar JSON → elegir el `.cifrado` →
escribir la clave. Si la corrida falla (falta un secreto, la base no contesta,
el tablero vino vacío) GitHub manda un mail.

Usa tres secretos de Actions: `RESPALDO_MAIL`, `RESPALDO_PASS` (la cuenta del
respaldo en Supabase → Authentication) y `RESPALDO_CLAVE` (con la que se cifra;
guardala también en un lugar del equipo, sin ella el archivo no se abre).

## Editor en vivo

Para revisar la app sin tocar los datos del equipo: `node build.mjs && node
scripts/vista-editor.mjs <carpeta>` arma una vista que se publica como
artefacto de claude.ai (la página es `pagina.html`, y `archivos.json` es el
mapa de `files`). Es la app de verdad con un tablero de ejemplo y una base de
mentira en el navegador de quien mira; arriba lleva una pastilla para comentar
la vista o un elemento, verla con la medida exacta de PC, Full HD, iPad o
teléfono, y entrar como otra persona del equipo. Los comentarios con "Send to
Claude" llegan al chat, que cambia la fuente, rearma la vista y la vuelve a
publicar en el mismo link. La vista es descartable y la capa
(`scripts/editor-vivo/`) nunca entra en el `index.html` que se despliega.

## Pruebas

Son 407, en seis baterías, y corren solas en cada cambio (ver
`.github/workflows/pruebas.yml`). Todas abren la app de verdad en un navegador
contra `test/fake-backend.mjs`, que imita las filas de Supabase y su endpoint
de ingreso.

| batería | qué fija |
|---|---|
| `test/sync.test.mjs` | Que dos personas editando a la vez no se pisen, que importar un JSON pueda sacar filas de verdad (sin esto volvían solas en la siguiente sincronización), y que el respaldo automático cifrado se abra con su clave y con ninguna otra. |
| `test/tamano.test.mjs` | Que el documento sincronizado no engorde ni se lleve las imágenes adentro. Es la prueba que faltaba el día que se agotó la cuota. |
| `test/ingreso.test.mjs` | Que sin sesión no se baje nada; que con sesión se trabaje normal aunque el token venza en el medio; que al recargar la app espere en el ingreso en vez de abrirse sola, y que pasadas las 12 h vuelva a pedir la contraseña. |
| `test/numeros.test.mjs` | Que los números que el equipo lee sean los mismos en todas las vistas: que la campana no marque como pendiente algo terminado, que Reportería coincida con el Planner y con Técnico, y que el pulso de Inicio dé lo mismo que las columnas del Planner. |
| `test/vista-editor.test.mjs` | Que la vista del editor en vivo arranque sola con el ejemplo, no saque ni un pedido a internet ni nombre la base real, que «Ver como» use la medida exacta y que la capa no se cuele en lo que se despliega. |
| `test/interfaz.test.mjs` | Lo que se rompe al usarla, no al leerla: que en el buscador del tablero se pueda escribir de corrido, que una tarjeta creada con “Mis tareas” puesto se vea en el momento, y que reiniciar las CotoFrases no se lleve puesto nada más. También que el panel se pueda leer y tocar (encabezados que abren, controles grandes, responsable, anterior/siguiente), que los mensajes se lean como un chat, que Técnico sea una grilla de tarjetas y no una planilla (con sus embudos de columna, su ficha desplegable y sus acciones en lote) que las 63 reglas de matriculación crucen con las filas del Seguimiento técnico, y que el Excel de Moodle se lea, se muestre antes de aplicarse y no pise lo que el equipo cargó a mano (con un Excel armado en `test/xlsx-de-prueba.mjs`: el real no va al repositorio). |

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
- **Y no se carga solo.** Aunque el permiso guardado siga vigente, `boot()`
  muestra la pantalla de ingreso y `arrancarApp()` corre recién cuando alguien
  aprieta Entrar. Con el permiso vigente no se pide la contraseña —`gateModo()`
  esconde el campo y deja solo el botón—, pero el clic hay que darlo: que la
  página se abriera sola con el tablero adentro, en una computadora compartida,
  es lo que queríamos evitar.
- **El permiso dura 12 horas como máximo** (`TOPE_SESION_MS`), contadas desde
  que se tipeó la contraseña. Se renueva solo mientras se trabaja, pero el tope
  sobrevive a las renovaciones (`sesion.nacida` se copia de la sesión vieja a
  la nueva): sin eso, un permiso que se renueva solo no vence nunca.
- **Quién es quién se resuelve por el mail**, cruzado contra el que se carga en
  Ajustes → Equipo. Si no coincide con nadie NO se bloquea el paso: entrar ya
  requirió una cuenta válida, y hacerlo obligatorio dejaría al equipo afuera
  por un mail mal tipeado, incluida la persona que tendría que corregirlo. Se
  entra y se avisa en la barra.

El permiso de administrador (quien ve Ajustes) es del lado del cliente: evita
accidentes, no frena a alguien decidido que ya tiene cuenta. Ver
[SEGURIDAD.md](SEGURIDAD.md).
