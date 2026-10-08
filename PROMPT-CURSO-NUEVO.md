# Prompt de arranque para un curso nuevo

**Qué es esto:** el texto que se pega en el chat NUEVO de un curso, para
que arranque sabiendo cómo trabaja este molde sin tener que
redescubrirlo. Vive en el kit y no en el chat de kit-base a propósito:
es el mismo prompt todas las veces, es sobre el PROCESO y no sobre el
contenido de ningún curso, y armarlo de memoria cada vez es exactamente
cómo se pierden los detalles que después cuestan una vuelta de feedback.
Si el proceso cambia, se cambia acá — no en el mensaje que uno escribe
apurado al abrir el chat.

**Cómo se usa:** copiar el bloque de abajo, reemplazar lo que está
entre `<>` y adjuntar el zip de `kit-base/` + el PDF del diseñador.

---

## ✂️ Copiar desde acá

Vas a armar un curso SCORM del molde "Área Aprendizaje (COTO)" usando el
kit adjunto (`kit-base/`, v1.9.126). Antes de escribir una línea, leé del
kit:

- **`MANUAL-DEL-MOLDE.md`, entero.** Son las reglas vigentes, cortas y
  en un solo lugar. `CLAUDE.md` es el diario del kit (la historia de
  cada regla): se consulta cuando hace falta el porqué, y si no coincide
  con el manual, manda el manual.
- `CLAUDE.md` **§7** — el checklist de arranque, paso por paso.
- `CLAUDE.md` **§0.1** — cómo se relevan hallazgos hacia el kit. Es la
  regla más importante de este flujo: **desde este chat NO se edita
  nunca `kit-base/`**, ni para un arreglo de una línea. Si algo del kit
  está mal o falta, se anota y se relaya; lo canónico se edita en su
  propio chat.
- `CLAUDE.md` **§7.3** — la lista de bugs que ya se pagaron una vez y no
  hay que reintroducir. Conviene releerla antes de entregar, no solo al
  empezar.
- `CLAUDE.md` **§1** — qué va en el kit y qué va en el curso. La
  pregunta es siempre: *"¿esto lee algo del curso?"* Si no lee nada del
  curso, es del kit y no se escribe acá.

### Datos de este curso

- **Nombre:** `<NOMBRE DEL CURSO>`
- **Categoría:** `<categoria>` — tiene que ser una de las reales de
  `css/coto-base.css`; el generador valida contra el CSS y las lista si
  te equivocás.
- **PDF del diseñador:** adjunto.
- **Videos:** `<sí / no / todavía no los entregaron>`
- **Tipo:** `<curso normal / SIMULADOR>` — un **simulador** es un curso
  donde el alumno recorre las pantallas reales de un sistema (GESCOM,
  por ejemplo) y resuelve el procedimiento ahí, en vez de leer sobre
  él. Tiene su propio molde: ver CLAUDE.md §7.27 antes de arrancar.

### Paso 1 — generar el esqueleto (NO armarlo a mano)

```bash
node tools/new-course.mjs ../<carpeta-del-curso> \
  --titulo "<NOMBRE DEL CURSO>" --cat <categoria>

# …o, si es un SIMULADOR (CLAUDE.md §7.27):
node tools/new-course.mjs ../<carpeta-del-curso> \
  --titulo "<NOMBRE DEL CURSO>" --cat <categoria> --tipo simulador
```

Eso genera el `index.html` COMPLETO —chrome, barra inferior, índice
lateral, modales, orden de scripts— más el `imsmanifest.xml`, el CSS
propio vacío y las diapositivas rotuladas. Recién salido del generador
tiene que dar **68/68 en verde**; si no, es un bug del kit y se relaya
antes de seguir.

Con `--tipo simulador` suma `js/escenario.js` (el archivo de DATOS, que
es lo primero que se llena) y `simulador-boilerplate.html` (el marcado
del riel, la hoja de ruta y los pop-ups). El motor y su CSS ya viajan
con el kit.

**El curso nace como DATOS** (kit v1.9.116): además del index, quedan
`curso.json` (el contenido: diapositivas, zonas, locución, índice,
glosario, fichas, práctica, logros, medallas) y `marco.html` (el resto
del index). **El contenido se escribe en `curso.json`, no en el
`index.html`**, y el index se arma con `node tools/armar-curso.mjs .`
después de cada cambio. Qué es cada campo: `tools/curso-datos.mjs` y la
sección 11 del manual. Lo que el formato todavía no modela (una pieza
propia del curso) va como `{ "tipo": "html" }` dentro de `curso.json`.
`curso.js` lee la práctica, los logros y las medallas con
`datosDelCurso()`; no se escriben ahí.

**No adaptar el `index.html` de otro curso a mano.** Ese era el método
viejo y es donde el contrato se rompe en silencio: `initPlayer()` no
tira ningún error si un id no calza, simplemente deja medio chrome
muerto.

### Sobre el curso de referencia adjunto

Va también el zip de un curso ya terminado y aprobado. **Se AUDITA, no
se copia** (§7.1): ninguna diapositiva, imagen ni id de ese curso pasa
a este. Sirve para UNA sola cosa — el estándar de PULIDO: mirarlo para
responder *"¿esto se siente tan terminado como un curso aprobado?"*.

**Y hay algo que NO hay que copiarle: su `curso.js`.** Ese curso se
armó sobre una versión anterior del kit, así que tiene escrito a mano
cosas que HOY son módulos del kit. Si ves ahí una función que hace
puntos, logros, repaso, gates o avisos de "te falta tocar esto", no la
copies: buscá el módulo equivalente en el kit. Copiar de un curso viejo
es cómo un curso nuevo termina ARRANCANDO PEOR que el anterior — ya
pasó una vez, un curso perdió el conteo animado, el pulso del chip y el
envío a xAPI por copiar de otro en vez de mirar el kit.

Regla corta: del curso de referencia se mira **cómo se ve**; del kit se
saca **cómo se hace**.

### Paso 2 — decidir, diapositiva por diapositiva

Por cada página del PDF, una decisión que condiciona todo lo demás:

- **Captura íntegra** (`.d-shot-slide`) — la página entra como imagen y
  las zonas interactivas van encima como hitboxes medidas en píxeles.
- **Piezas HTML reales** — texto vivo + arte suelto, cuando el texto
  tiene que ser seleccionable, buscable o cambiar de tamaño.

Las hitboxes **se miden contra el render, nunca a ojo**, y se verifican
con `npm run verify-hitboxes` (saca capturas con el rectángulo real
dibujado encima).

**En un simulador la decisión es la misma, y el PDF manda igual.** Las
pantallas del sistema van en HTML real —tienen que ser interactivas— y
las ilustraciones (portada, "¡Ups!", cierre) van como captura. Dos
cosas que ya costaron una vuelta entera en el primer simulador:

- **leer el PDF hasta el final antes de tocar marcado**: las últimas
  páginas suelen ser las cáscaras de los pop-ups ("Pistas", "Reglas"),
  y armarlos con el modal genérico del kit obliga a rehacerlos;
- **contar ESTADOS, no páginas**: tres páginas con el mismo menú
  desplegándose son UNA diapositiva con tres estados.

### Paso 3 — escribir `js/curso.js`

Es el ÚNICO archivo que se escribe entero. Va: el vocabulario propio
para la locución, el banco de preguntas, el catálogo de logros, el
puntaje y el cableado de los módulos del kit. La plantilla ya viene con
todo comentado y en el orden correcto.

Lo que **no** va acá porque el kit ya lo hace. Si estás por escribir
algo que suene a alguna de estas cosas, **buscalo primero: está**, y
escribirlo a mano es cómo un curso nuevo termina arrancando peor que el
anterior.

| querés… | ya existe |
|---|---|
| puntos, logros, medalla | `initLogros`, `initCierreCelebration` |
| repaso / mini-quiz | `initRepasoRapido`, `initMiniQuiz` |
| frenar el avance hasta que toquen algo | `initPopupGate`, `initVideoGate` |
| avisar qué le falta tocar al alumno | `initGateHints` |
| glosario con búsqueda y candado | `initGlossarySearch`, `initGlossaryUnlock` |
| índice lateral con tilde y gate | `initIndexJumps` |
| zonas tocables sobre el arte | `initHotspots` |
| cambiar la captura por variantes | `initShotSwap` |
| **revelar de a uno y que queden acumulados** | **`initRevelados`** |
| **dos juegos de carteles sobre el mismo arte** | **`initTandas`** |
| **un documento con paginado, zoom y descarga** | **`initVisorDocs`** |
| **pasar hojas sin abrir el pop-up** | **`initDocEnDiapo`** |
| **pasos numerados al costado del repaso** | **`initPasosRepaso`** |
| **salir del repaso con la última respuesta** | **`initSalidaRepaso`** |
| video de fondo / en pop-up / circular / en capa | `initBgVideos`, `initVideoPlayer`, `initInlineCircleVideos`, `initLayerVideos` |

**La gamificación completa es OBLIGATORIA** (§6.17.1), no una decisión
de alcance: logros, puntos, glosario y gate de avance van en todos los
cursos salvo que el cliente lo apruebe explícitamente por escrito.

Y si escribís el marcado de una de estas piezas y te olvidás de llamar
a su `init`, **`contrato-cableado` te lo dice con la consecuencia**: no
falla en silencio. Esa es la falla más cara que tuvo este molde.

**Y desde v1.9.71, tampoco va la narración por diapositiva.** Era la
línea que todo curso escribía a mano (`slidechange` → `speakSlide`) y
ahora la engancha `initPlayer()` solo: alcanza con pasarle `speakSlide`,
que la plantilla ya trae. Incluye el corte de la locución anterior y la
espera de 220ms, así que pasar cinco diapositivas rápido dispara UNA
narración en vez de encolar cinco. Si escribís tu propio listener de
`slidechange` para narrar, vas a tener DOS — el opt-out es
`speakOnSlideChange:false`.

Esto viene de que el kit venía fallando en silencio en cuatro lugares
con la misma forma —traía la pieza, nadie la cableaba, y no había
ningún error— hasta el punto de que un curso entero podía quedar
**mudo** sin que nada lo delatara (§7.17). Por eso ahora hay un test
que verifica el cableado, no los síntomas: si algo de esto se
desconecta, `contrato-cableado` lo dice con nombre y consecuencia.

### Paso 4 — antes de entregar

```bash
COURSE_URL="http://localhost:8080/index.html" npm test   # los 68, exit 0 en todos
npm run verify-hitboxes                                   # inspección visual
npm run check-assets                                      # peso/formato de imágenes
```

Un "0 fallos" solo vale si además mirás **cuántos tests dice haber
corrido**. Y `contrato-cableado` es el que más conviene leer cuando
falla: no reporta que algo se ve mal, reporta que algo **no está
enchufado** — que es el tipo de falla que no se nota mirando el curso. Y los umbrales de la medalla **no se escriben a mano**: se
derivan del máximo realmente alcanzable, descontando lo que todavía sea
placeholder, y ese máximo se verifica con un recorrido instrumentado —
la tabla de puntos es una intención, el contador es el hecho (§7.3
punto 19).

**La entrega son DOS zips, siempre** (kit-base v1.9.122):
`python3 tools/build-zip.py <carpeta-del-curso> <salida.zip>` arma el del curso
y, al lado, `RELEVO-AL-KIT_<curso>_<fecha>.zip` con el relevo, la salida de
`revisar-curso` y los archivos propios del curso. **Si la sección "Relevo al
kit" del `README-CURSO.md` falta o dice "pendiente", no arma ninguno de los
dos.** El mensaje final de este chat nombra los dos zips; si entregás uno
solo, la entrega está incompleta.

### Durante todo el curso: el relay

**Regla: todo lo que resuelvas en el curso va al relevo, y decide el
kit.** No solo los bugs del kit: también lo que arreglaste "porque era
de este curso". Vos no decidís qué es propio y qué es general: lo decide
el chat del kit, que ve todos los cursos. Pasó: "Prevención
cardiovascular" resolvió adentro doce cosas que creyó suyas, entre ellas
el cierre trabado sin salida que el cliente había reportado con foto, y
el kit se enteró recién en un segundo relevo. Mientras tanto, los otros
cursos seguían con el bug.

Cada vez que resuelvas algo, **anotalo en el `README-CURSO.md` de este
curso** con: síntoma, diagnóstico contra el código real, y cómo lo
verificaste. Al final se relaya todo junto al chat del kit.

**Antes de entregar, la sección "Relevo al kit" del `README-CURSO.md` es
obligatoria**, aunque quede vacía:

```bash
node kit-base/tools/revisar-curso.mjs <carpeta-del-curso>
```

`revisar-curso` lista lo que el curso hizo por su cuenta y puede ser del
kit: uso de funciones privadas del kit (`motor._algo`), números copiados
de los tests, mecanismos propios (funciones que escuchan al motor, miden
la pantalla o tocan el marcado del molde) y CSS que pelea con el kit.
**Cada punto que marque va al relevo**, con una línea tuya diciendo qué
es; si te parece propio del curso, decilo ahí, pero mandalo igual. Si no
marca nada, la sección dice eso: "se corrió `revisar-curso` y no marcó
nada". Un curso sin esa sección no está listo para entregar.

Lo que hace útil a un relay: que distinga lo que YA probaste de lo que
solo suponés, y que diga cómo lo mediste. Un relay que dice "esto es
mío, esto es del kit, y esto último lo verifiqué así" vale el doble que
uno con más hallazgos sin comprobar.

Y dos reglas de forma, que ya costaron confusiones:

- **Rotulá el relevo por curso y fecha, nunca con un número de versión
  del kit.** Las versiones las pone solo el chat del kit.
- **Decí de qué versión del kit partiste** (`kit-version.json`).

Cuando el curso vuelva más adelante (correcciones, una edición nueva),
se retoma con `PROMPT-RETOMAR-CURSO.md`, que viaja en su carpeta: arranca
siempre poniéndolo al día con `actualizar-kit`.

## ✂️ Hasta acá
