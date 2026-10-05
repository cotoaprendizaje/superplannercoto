# tools/tests/ — suite mínima genérica

kit-base v1.9.117 · Área Aprendizaje (COTO)

Copiar esta carpeta tal cual a cada curso nuevo. **Hoy son 59 tests**
—`npm test` los descubre solos leyendo la carpeta, así que el número
sube sin que haya que anotarlo en ningún lado— y son genéricos de
verdad: solo leen atributos `data-*` y estructura de
`motor-slides.js`, ningún ID de diapositiva ni texto de contenido — no
hace falta adaptar selectores curso a curso. `hitbox-click-check.mjs`
reemplaza y generaliza al antiguo `verify-hitboxes.mjs` (ese sigue
existiendo como herramienta de **inspección visual** ad-hoc; este test
es la versión **pass/fail** para correr en CI o antes de entregar).
`scorm-tracking.mjs` (kit v1.9.9) es el único que NO mira el DOM:
levanta un LMS falso en `window.API` y verifica que el curso realmente
le hable — nació de un bug real en el que ningún curso escuchaba
`courseend`, así que el alumno terminaba todo y en el LMS quedaba
"incomplete" para siempre, sin que ningún test lo notara.

⚠️ **Dieciséis tests se arman su propio marcado** en vez de mirar el del
curso: `objetivos-progreso.mjs` y `recursos-panel.mjs` (kit v1.9.86),
`minijuego.mjs` y `corte-directo.mjs` (v1.9.87), y
`locucion-segundos.mjs` (v1.9.92: le escribe texto propio a la
diapositiva activa, porque si no dependería de cuánto escribió cada
curso en vez del mecanismo del kit), y de v1.9.95 `overlays-colocados.mjs`
(una capa con overlays adentro, para el recálculo por `layerchange`) y
`video-rescate.mjs` (el pop-up del reproductor: llegaba poniéndose ROJO
en todo curso sin video, que es la forma equivocada — un curso puede no
tener videos y no está roto por eso). En v1.9.99 se suman
`prediccion.mjs` (el bloque `[data-pred]`, que un curso generado no
trae) y `reproductor-video.mjs`, que además de inyectar el disparador
si falta **sirve un webm REAL** fabricado con MediaRecorder en lugar de
los .mp4 de 0 bytes: comprueba que el alumno ve el video moverse, no
que el código llama a `play()`. Si un test nuevo necesita reproducción
de verdad, ese es el patrón. En v1.9.103, `popup-video-medida.mjs`
inyecta un `data-video-play` si el curso no tiene video, para medir el
pop-up igual (sin eso, un curso sin videos daría verde sin medir nada).
Y en v1.9.105 `video-fondo-soltar.mjs` convierte una diapositiva en
video de fondo si el curso no tiene ninguna: el arreglo de iPad que
suelta la fuente estuvo seis versiones sin hacer nada, y
`video-fondo.mjs` daba verde porque el curso del arnés no tiene video
de fondo. Y `bloque-no-tapa-arte.mjs` (v1.9.105) se autoverifica
siempre con una lámina dibujada en canvas: un bloque en el hueco tiene
que dar 0 píxeles de dibujo y uno encima del dibujo tiene que detectarse.
Y `una-sola-voz.mjs` (v1.9.112) sirve un webm CON AUDIO fabricado al
vuelo (`$TMPDIR/coto-prueba-video-audio.webm`) y, si el curso no tiene
ningún video, le agrega uno con controles nativos a una diapositiva que
se narra: la regla de una sola voz vive en `narrador.js` y vale para
cualquier video, así que siempre hay algo que medir.

**Regla para todo test que inyecta marcado** (salió de auditar los dos
cursos modelo, v1.9.105): se busca DENTRO de lo inyectado, nunca en todo
el documento, y lo inyectado lleva tamaño propio. Tres tests daban rojo
sobre "Seguridad alimentaria" por lo que el CURSO ya tenía (su propio
minijuego, un cierre en flex, un disparador de video que abre desde su
botón) y no por el kit.
Los dos mecanismos que verifican son OPCIONALES —el boilerplate trae
los pips de objetivo y la ficha de recurso comentados, porque un curso
puede no tener ni objetivos declarados ni documentos—, así que el guard
de siempre ("si la pieza no está, salteo") se saltearía SIEMPRE en un
curso recién generado: verde por ausencia, que es el verde que miente.
Lo que protegen es el mecanismo del kit, no el contenido de un curso,
así que inyectan el marcado, lo ejercitan y lo sacan. Vale como patrón
para cualquier pieza opcional que se agregue de acá en más.

⚠️ Y `corte-directo.mjs` trae otra lección que conviene copiar al
testear un efecto visual: **no busca la clase ni la regla CSS**. Un
efecto vive en dos archivos —el CSS que lo dibuja y el JS que lo
dispara—, así que buscar una de las dos mitades deja pasar el caso en
que se sacó la otra. Mide el RESULTADO (que el `src` cambie dentro del
propio clic y que la opacidad nunca baje de 1), y así las dos formas de
romperlo caen igual. Importa porque el primer intento de cumplir esa
regla sacó solo la mitad CSS y convirtió el fundido en un flash blanco
duro —peor que antes—, y un test que buscara la clase habría dado verde.

⚠️ **Cuando un test falla por un cambio de PRODUCTO** —no por un bug—,
lo que hay que revisar es *qué estaba garantizando de verdad*. Casi
siempre la garantía sigue siendo válida y lo que sobra es el número.
Pasó con tres tests a la vez en v1.9.88, cuando la velocidad de la
locución cambió de 1.0 a 1.15: los tres fijaban el 1.0. La garantía de
`locucion-voz-velocidad` nunca fue el número — era que **la velocidad
sea la misma para toda voz** (el bug real era "suena distinto en cada
dispositivo"), así que ahora le pregunta el default al kit
(`Narrador.getRateDefault()`) Y compara los casos entre sí, que es lo
que de verdad protege y sobrevive al próximo cambio. Un test que fija un
valor que el producto puede decidir cambiar es un candado, no una
garantía.

⚠️ **Un test TÁCTIL sobre algo dibujado en la lámina tiene que
verificar primero que el curso no esté TAPADO.** Desde v1.9.86 el kit
muestra el cartel "Girá tu dispositivo" cuando el lienzo queda vertical
— y en un iPhone 12 vertical el lienzo mide 390x662, así que el cartel
está puesto y **se come todos los toques**. `arrastre-pasos-mobile`
estuvo pasando en verde por eso durante cinco versiones: su aserción
("un toque no mueve la barra") se cumplía porque el toque nunca llegaba
a la barra. Verde por ausencia otra vez, ahora por una razón nueva.
La solución es un viewport apaisado (`openCourseMobile(url, 'iPhone 12
landscape')`) y, además, fallar explícitamente si el stage aparece con
`.is-vertical` — así el día que cambie el criterio del cartel, el test
lo dice en vez de volverse mudo.

Cada curso agrega, aparte, sus propios tests de contenido (ej.
`check-cierre-flow.mjs`, específico del flujo de certificación de ESE
curso) — ver `CLAUDE.md` §6.

## Cómo correr

```bash
# servir el curso en localhost primero, ej.:
cd mi-curso && python3 -m http.server 8891 &

# los 23, de una:
COURSE_URL="http://localhost:8891/index.html" npm test

# o uno suelto, para iterar sobre un fallo:
node tools/tests/deep-audit.mjs http://localhost:8891/index.html
```

`npm test` (`tools/run-tests.mjs`) corre TODO lo que haya en esta
carpeta salvo los archivos que empiezan con `_`, que son librerías.
Agregar un test es dejar el `.mjs` acá; no hay lista que mantener.

Cada script termina con exit code 0 (todo OK) o 1 (hay fallos, detalle
en stdout). Antes de dar un curso por terminado: **23 de 23 en verde.**

Algunos no le corresponden a todo curso y lo dicen en vez de fallar
—`simulador` si el curso no es un simulador, `video-lienzo-tablet`,
`video-autoplay-ios` y `video-tap-chip` si no hay video de fondo—:
informan y salen en verde. Un test que le falla a un curso al que no le corresponde enseña
a ignorar la suite.

`markup-sanity.mjs` (sumado en v1.6, nacido de un bug real en
"Prevención cardiovascular": a un botón de video le faltaba el `>` de
cierre de la etiqueta, y el navegador lo parseó de forma que el texto
accesible quedó VISIBLE en pantalla en vez de en un `.sr-only` — ningún
otro test lo atrapaba) chequea 3 cosas: HTML mal cerrado, hitboxes con
texto visible (debería ir todo en `.sr-only`), y `.sr-only` que quedó
visible por error de CSS.

Requieren `playwright-core` instalado y un Chromium accesible — por
defecto usan `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
(mismo que usa `verify-hitboxes.mjs`); sobreescribir con la variable de
entorno `CHROMIUM_PATH` si hace falta.

## `_shared.mjs` — helpers para tests de contenido/curso

No es un test — es lo que importa cada test de arriba (y cualquier
test propio de un curso). Tres funciones:

- `openCourse(url)` — arranca Chromium, abre el curso en un viewport de
  escritorio (1600×900), junta errores de consola en `errors`. La usan
  casi todos los tests genéricos y prácticamente todos los de contenido.
- `openCourseMobile(url, deviceName?)` — mismo contrato, pero en un
  contexto TÁCTIL real (`isMobile`/`hasTouch`, perfil completo de
  dispositivo de `playwright-core`, default `'iPhone 12'`). Existe
  desde kit-base v1.9.39, para que la regla de CLAUDE.md §6.10.1 punto
  4 ("toda interacción nueva se prueba en mobile real, en la misma
  vuelta en que se construye") sea fácil de cumplir — antes cada test
  mobile repetía a mano el mismo boilerplate de "levantar un contexto
  táctil". Pasar otro `deviceName` (ej. `'iPad (gen 7)'`) para probar
  tablet real sin escribir un test aparte.
- `report(name, failures)` / `requireUrl()` — formato de salida y
  lectura del argumento `<url>` de la línea de comandos, iguales para
  cualquier test.

Patrón de un test mobile nuevo:
```js
import { openCourseMobile, requireUrl } from './_shared.mjs';
const { browser, page, errors } = await openCourseMobile(requireUrl());
// ... interactuar con page.tap()/page.touchscreen.* ...
await browser.close();
```
