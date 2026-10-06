# Manual del molde — cursos e-learning COTO (Área Aprendizaje)

Vigente para **kit-base v1.9.120**.

**Qué es esto.** Las reglas que valen HOY para armar un curso con este
kit, en un solo lugar y cortas. No cuenta cómo se llegó a cada una: eso
está en `CLAUDE.md`, que es el **diario** del kit (14.000 líneas, en
orden cronológico, con cada bug que se pagó). Cada regla de acá lleva
entre paréntesis la sección del diario que la explica, por si hace falta
el porqué.

**Si este manual y el diario no coinciden, manda el manual.** El diario
es historia: un párrafo viejo puede describir algo que después se
cambió (pasó varias veces: listas de módulos, conteos de tests, "adaptar
el index a mano"). El manual se reescribe cada vez que una regla cambia;
el diario solo se agrega.

---

## 1 · Las siete reglas que no se discuten

1. **El kit se edita en UN solo chat, el del kit.** Desde el chat de un
   curso no se toca ningún archivo del kit, ni para un arreglo de una
   línea. Lo que es del kit se anota y se releva (§0.1, y la sección 9
   de este manual).
2. **El curso se genera, no se arma.** `node tools/new-course.mjs`
   escribe el `index.html` completo, el manifest, la plantilla de
   `curso.js` y el registro de versión. Nunca se adapta a mano el
   `index.html` de otro curso: `initPlayer()` no da ningún error si un
   id no calza, deja medio chrome muerto en silencio (§7.08).
3. **Lo único que se escribe entero es `js/curso.js`**, más los tres CSS
   propios (`assets.css`, `diapositivas.css`, `pulido.css`). Todo lo
   demás es del kit.
4. **La pregunta de siempre: "¿esto lee algo del curso?"** Si no lee
   ningún texto, id ni imagen de este curso, es del kit y no se escribe
   en el curso (§1).
5. **Del curso de referencia se mira cómo se VE; del kit se saca cómo
   se HACE.** Nunca se copia el `curso.js` de un curso terminado: está
   hecho sobre un kit más viejo y trae a mano cosas que hoy son módulos
   (§7.1).
6. **Nada está hecho hasta que se midió en el navegador.** "Debería
   andar" no es verificado. Un arreglo sin test no está cerrado, está
   sin mirar (§7.44).
7. **La gamificación completa es obligatoria**: logros y puntos,
   glosario, al menos una práctica y gate de avance, en todos los
   cursos, salvo que el cliente lo saque por escrito (§6.17.1).

---

## 2 · Arrancar un curso

```bash
node tools/new-course.mjs ../<carpeta> --titulo "<Nombre>" --cat <categoría>
# simulador (el alumno opera las pantallas reales del sistema, §7.27):
node tools/new-course.mjs ../<carpeta> --titulo "<Nombre>" --cat <categoría> --tipo simulador
```

- **Categorías válidas** (salen de `css/coto-base.css`; el generador las
  valida y las lista si te equivocás): administracion,
  atencion-al-cliente, cajas, control-de-calidad, coto-digital,
  elaborados, flota-propia, gestion-comercial, mantenimiento,
  no-alimentos, recursos-humanos, salon, seguridad, seguridad-higiene,
  servicio-medico, sistemas, tci, zona-cumples, zona-e, zona-gourmet.
- **El curso nace como datos** (`curso.json` + `marco.html`, v1.9.116):
  el contenido se escribe en `curso.json` y el index se arma con
  `node tools/armar-curso.mjs <carpeta>`. Ver la sección 11. Con
  `--sin-datos` sale el index a mano de antes (§7.65).
- **Recién generado tiene que dar la suite entera en verde**
  (`npm test`). Si no, es un bug del kit: se releva antes de seguir.
- **El curso sabe de qué versión del kit es**: `kit-version.json`, con
  una huella de cada archivo del kit. No se edita a mano (§7.51).
- **`actualizar-kit` también declara en `imsmanifest.xml`** los archivos
  del kit que agrega (y quita los que el kit sacó): sin eso
  `check-manifest` y `kit-intacto` tiraban para lados opuestos (§7.66).
- **Poner el curso al día con un kit nuevo** se hace desde el kit
  NUEVO, nunca copiando archivos:

  ```bash
  npm run actualizar-kit -- ../<carpeta>             # muestra el plan
  npm run actualizar-kit -- ../<carpeta> --aplicar   # lo aplica, con respaldo
  ```

  Si avisa que **`curso.js` narra en su propio `slidechange`** (cursos
  anteriores a v1.9.71), hay que sacar esa llamada a `speakSlide` o
  pasarle `speakOnSlideChange: false` a `initPlayer`: si no, cada
  diapositiva arranca con dos locuciones encimadas (§7.56).

  Si el plan marca un archivo **EDITADO A MANO**, frena: casi siempre es
  un arreglo que tiene que subir al kit antes de pisarlo. `--forzar` lo
  pisa igual (queda en `.kit-anterior/`). Al final avisa qué `init*`
  llama la plantilla y el `curso.js` del curso no (§7.51).

---

## 3 · Del PDF a las diapositivas

- **Leer el PDF entero antes de tocar marcado.** Las últimas páginas
  suelen ser las cáscaras de los pop-ups (§7.27).
- **Contar ESTADOS, no páginas.** Pestañas, pasos, antes/después y
  pop-ups en su propia página son UNA diapositiva con variantes
  (`initShotSwap`, `[data-popup]`). 49 páginas dieron 26 diapositivas
  (§7 paso 4).
- **Correr `pdfinfo` por página**: un PDF puede mezclar tamaños, y
  forzar todo al mismo render estira en silencio (§6.32).
- **Por cada diapositiva, una decisión**: captura íntegra
  (`.d-shot-slide`, con zonas encima) o piezas HTML reales (texto vivo).
  Si el cliente manda las imágenes del PDF, se usan: no se reinterpretan
  (§6.32).
- **Las zonas se miden contra el render, nunca a ojo**, y se revisan con
  `npm run verify-hitboxes` (dibuja el rectángulo real). Mirar también
  los `[data-place]`: mal ubicados no rompen nada, solo tapan el arte
  (§7.3 #9).
- **Tres espacios de coordenadas que NO son intercambiables**: el
  archivo suelto, la página del PDF y el contenedor ya renderizado. Se
  mide sobre el renderizado (§7.3 #5).
- **"Este botón dibujado lleva a la siguiente" es `data-goto`**, no
  `data-nav="next"` (ese pinta un bloque de color encima del arte,
  §7.3 #8).
- **Un bloque que NO puede tapar la ilustración** (una tira de repaso
  debajo del dibujo, por ejemplo) se marca `data-no-tapa-arte`, y
  `bloque-no-tapa-arte` lo verifica contando píxeles del dibujo, no
  comparando coordenadas: la caja de una ilustración es su hotspot y
  miente (§7.54). Si no hay lugar, lo primero es pedirle al diseñador la
  lámina; `tools/achicar-ilustracion.py` es el último recurso: reescribe
  el arte del cliente, así que antes se guardan los originales.
- **Si un asset se corrige por segunda vez, cambiarle el nombre**
  (sufijo de versión): el cliente puede estar viendo la copia cacheada
  (§7.3 #20).

---

## 4 · `curso.js`: qué ya existe (buscalo antes de escribirlo)

| querés… | ya existe |
|---|---|
| chrome, barras, índice, navegación, narración por diapositiva | `initPlayer` (la narración se engancha sola si le pasás `speakSlide`) |
| puntos, logros, medalla | `initLogros`, `initCierreCelebration` |
| repaso / mini-quiz | `initRepasoRapido`, `initMiniQuiz` |
| "¿qué creés que pasa?" antes de mostrar | `initPrediccion` |
| frenar el avance hasta que toquen algo | `initPopupGate`, `initVideoGate`, y el gate que devuelve `initMiniQuiz` |
| avisar al motor que un gate cambió | `motor.refrescarGate()` o el evento `gatechange` (nunca `motor._syncNav()`) |
| el margen seguro de tablet (12,22% a los costados, 4,55% arriba y abajo) | `--d-margen-seguro` y `--d-margen-seguro-v` (leerlos con `getComputedStyle`, no copiar el número) |
| que la tira de repaso salga a la franja libre en vertical | ya lo hace `initRepasoRapido` (`acomodarTirasSueltas`) |
| pasos al costado de VARIOS repasos | `initPasosRepaso` toma todas las listas de la página |
| avisar qué le falta tocar | `initGateHints` |
| glosario con búsqueda y candado | `initGlossarySearch`, `initGlossaryUnlock` |
| índice lateral con tilde y gate | `initIndexJumps` |
| zonas tocables sobre el arte | `initHotspots` |
| cambiar la captura por variantes | `initShotSwap` |
| revelar de a uno y que queden | `initRevelados` |
| dos juegos de carteles sobre el mismo arte | `initTandas` |
| documento con paginado, zoom y descarga | `initVisorDocs`, `initDocEnDiapo` |
| pasos al costado del repaso / salir con la última respuesta | `initPasosRepaso`, `initSalidaRepaso` |
| minijuego | `initMinijuego` |
| recursos descargables | `initRecursos` |
| video de fondo / en pop-up / circular / en capa | `initBgVideos`, `initVideoPlayer`, `initInlineCircleVideos`, `initLayerVideos` |
| narrar los pop-ups | `initPopupNarration` |
| entrada animada de los pop-ups | `initPopupStagger` |
| tiempo activo, resumen imprimible | `initTiempoActivo`, `initSummaryPrint` |
| simulador | `initSimulador` + `js/escenario.js` |

- La plantilla de `curso.js` ya trae todo esto comentado y en orden.
- **Si escribís el marcado de una pieza y no llamás su `init`,
  `contrato-cableado` te lo dice con la consecuencia.** Es la falla más
  cara que tuvo el molde: la pieza está y el cable no (§7.17).
- **Mini práctica: `onFinish` = práctica completa; `onResult` = pantalla
  de resultado.** `onFinish` corre al contestar la última pregunta (el
  alumno puede no pulsar "Ver resultado"); lo que decora la pantalla de
  resultado va en `onResult`, que recibe la caja ya dibujada (§7.56).
- **Si hay mini práctica, su gate NO es opcional.** `initMiniQuiz`
  devuelve `{ faltan(slideEl) }`: va a `motor.canAdvance` y a
  `initGateHints` (la plantilla lo trae). Sin él, "Siguiente" pasa de
  largo y el alumno llega a un cierre con candado y sin salida
  (`practica-gate`, §7.68). "Repasar en …" ya va a una diapositiva o a
  un pop-up sin pasarle `goToRelated`.
- **No escribir un listener de `slidechange` para narrar**: ya lo hace
  `initPlayer`, y quedarían dos (§7.17).
- **Los umbrales de la medalla se calculan**, no se eligen: bronce = el
  piso que garantiza el gate; oro = un % alto del máximo REAL. El máximo
  se mide con un recorrido, no sumando la tabla, y se descuenta lo que
  todavía es placeholder (§7.3 #19, §7.14).
- **Un `award()` en una actividad que se puede repetir necesita guard
  persistido**, si no es puntaje infinito (§6.53). Y el puntaje premia
  precisión, no insistencia (§7.14).

---

## 5 · Diseño y CSS

- **El CSS del curso no pisa al kit.** Si una regla del curso le apunta
  a una clase del kit, probablemente sea un arreglo que tiene que subir
  (§7.12).
- **Color de categoría siempre por token**, nunca con el hex copiado.
  Para TEXTO, `--cat-ink` (nunca `--cat-strong`); para fondo que lleva
  texto, `--cat-wash` (nunca `--cat-soft`). `--cat-strong` es para
  bordes, sombras y degradados (§7.3 #16).
- **Todos los pop-ups del menú superior con el mismo header** (degradado
  de marca). Si hace falta otro estilo, en todos, nunca en uno solo
  (§7.3 #1).
- **Lo que vive sobre la lámina se mide en `em` de
  `--d-escala-lamina` o en `cqh`, nunca en `rem`**: la caja escala con
  la lámina y el texto en `rem` no (§7.38).
- **`vh` y `@media (max-height)` responden por la VENTANA, no por la
  lámina.** En un iPad vertical la lámina mide 768×384 con un viewport
  de 1024. Para "cómo se ve al lado del arte", `--d-arte-h`, `cqh` o
  `@container` sobre `.d-stage` (§7.37).
- **El pop-up de video tiene tamaño estándar**:
  `min(1040px, 94vw, alto del lienzo × 16/9)`. **El curso no le pone
  `width` a `.modal-card--video`**; lo verifica `popup-video-medida`
  (§7.52).
- **Un fondo con `z-index:-1` necesita contenedor con
  `position:relative` Y `z-index:0`**, si no desaparece sin error
  (§7.3 #18).
- **Para apagar algo del kit, copiar su selector COMPLETO.**
  `:not(:has(...))` sube la especificidad y una receta más corta no
  apaga nada (§7.16).
- **Toda `animation` apunta a un `@keyframes` que existe.** Uno que falta
  no da error: el elemento aparece sin animar y nadie lo reporta. Al subir
  algo de un curso al kit, sus `@keyframes` suben con él. Lo vigila
  `tools/check-keyframes.mjs`, dentro de `npm run test:kit`; en un curso,
  `node tools/check-keyframes.mjs css` (§7.57).
- **Un comentario CSS no puede contener su propio cierre** (`*/`): cierra
  el comentario y se lleva la regla siguiente sin avisar. Lo agarra
  `check-comentarios-css` (§7.43).
- **Un breakpoint se elige midiendo el contenido en su PEOR caso**
  (el nombre más largo, no el saludo vacío) (§7.43).
- **El escalonado de entrada de los overlays viene apagado** (decisión
  del cliente); se prende con `<html data-overlay-stagger>` (§7.43).

- **Agrandar la caja tocable de un control dibujado: hacia ADENTRO**, no
  centrada, si el dibujo está cerca del borde. Centrada empuja la caja al
  margen que se recorta en tablet (`--d-margen-seguro`, `-v`), y
  `video-lienzo-tablet` la marca aunque el dibujo esté bien (§7.69).

---

## 6 · Video

- **Cuatro patrones, cuatro `init`**: fondo (`initBgVideos`), pop-up
  (`initVideoPlayer`), circular sobre el arte (`initInlineCircleVideos`),
  en capa (`initLayerVideos`).
- **"Sonido" mutea TODO, video incluido.** Cualquier audio nuevo lee la
  misma marca desde el arranque (§7.3 #2).
- **Play de la marca sobre una tarjeta que ya lo trae dibujado**:
  `.d-shot-hit-play--marca` con `--play`, `--play-x` y `--play-y` por
  tarjeta, medidos sobre el .webp. En reposo es igual al arte; al pasar
  el mouse crece. `--horneado` está obsoleto (§7.52).
- **El video de fondo suelta su fuente al salir de la diapositiva** y la
  recupera al volver (iPad desaloja sin avisar los videos pausados). Lo
  hace `initBgVideos`; no hay que escribirlo en el curso (§7.47, §7.54).
- **Toda superficie que es un botón necesita hover propio**;
  `cursor:pointer` solo no alcanza (§7.3 #6).
- **Si faltan los videos reales, placeholders con el nombre final**, y
  sus puntos no cuentan para la medalla hasta que estén (§7 paso 9).

---

## 7 · Locución

- **La narración por diapositiva la engancha `initPlayer`** con
  `speakSlide`; corta la anterior y espera 220 ms (§7.17).
- **Siglas y palabras propias del curso con `Narrador.addFixes()`**.
- **Lo que se oculta de la pantalla con CSS (`display:none`) se sigue
  narrando.** La locución filtra el atributo `hidden`, no el estilo. Si
  algo no se tiene que leer, `hidden` (§7.47).
- **Para hacer algo cuando la voz TERMINÓ, `Narrador.alTerminar()`**:
  `speak()` vuelve enseguida, no al final (§7.49).
- **En iOS el audio no arranca solo, nunca.** El primer gesto del alumno
  tiene que parecer "empezar", no un error (§7.37).
- **La tira de repaso del kit** (`initRepasoRapido`) restaura también las
  respuestas erradas (`seenMal`/`markMal`), avisa cada respuesta
  (`onAnswer`), arranca en la primera sin contestar y, al cambiar de
  pregunta con las flechas, corta la voz y narra solo la pregunta nueva.
  Un curso no necesita su propio repaso para eso (§7.67).
- Velocidad por defecto 1.05, voz latina/argentina antes que la de EE.UU.
  (§7.49, §6.54).
- **Nunca suenan dos cosas a la vez** (regla del cliente). Lo garantiza
  `narrador.js` para cualquier video: una locución que arranca pausa los
  videos audibles, y un video que se vuelve audible corta la locución.
  Un curso no tiene que coordinarlo a mano; `una-sola-voz` lo mide
  (§7.61).
- **El panel de Locución trae ▶/■** (`#d-narr-toggle`, en el header del
  kit desde v1.9.112). Un curso anterior lo gana agregando ese marcado a
  su index; sin él no pasa nada (§7.61).

---

## 8 · Mobile, tablet y accesibilidad

- **Todo lo ≤600px se prueba en viewport táctil REAL**
  (`isMobile:true`, `hasTouch:true`, `openCourseMobile()`), en la misma
  vuelta en que se construye (§7.3 #11 y #14).
- **Un popover se posiciona midiendo su botón en cada apertura**, nunca
  por breakpoint fijo (§7.3 #12).
- **Un clic hace UNA cosa.** Si un botón abre un panel, no cambia además
  un ajuste con el mismo gesto (§7.39).
- **Antes de pedirle algo al alumno, preguntarse si puede hacerlo** en
  ese dispositivo (el cartel de girar, solo donde se puede girar)
  (§7.41).
- **Una espera que parece un cuelgue es un bug**: si no se puede acortar,
  se muestra (§7.43).
- **El índice lateral nunca deja saltar a una diapositiva no vista**
  (lo hace `initIndexJumps` si le pasás `visited`; el glosario, `initGlossaryUnlock`) (§7.3 #3, §6.63).
- **El curso tiene que poder cerrarse** (§6.10.5).

---

## 9 · Relevar al kit (desde el chat de un curso)

**Todo lo que se resuelva en el curso va al relevo, y decide el kit.**
No solo lo que parezca del kit: también lo que se arregló "porque era de
este curso". El chat del curso no decide qué es propio; lo decide el chat
del kit, que ve todos los cursos. (Cardio resolvió adentro doce cosas que
creyó suyas, entre ellas el cierre trabado que el cliente reportó con
foto, y el kit se enteró en un segundo relevo, §7.68.)

**La sección "Relevo al kit" del `README-CURSO.md` es obligatoria antes
de entregar**, aunque quede vacía. Se arma corriendo
`node kit-base/tools/revisar-curso.mjs <carpeta-del-curso>`: lista API
privada del kit, números copiados, mecanismos propios y CSS que pelea con
el kit. Cada punto que marque va al relevo, con una línea diciendo qué
es. Si no marca nada, la sección lo dice.

Cada hallazgo se anota en el `README-CURSO.md` del curso con:

- **síntoma**, **causa medida en el código real**, y **cómo lo
  verificaste**;
- **qué probaste y qué solo suponés**, separado;
- **la versión del kit** sobre la que se encontró (`kit-version.json`);
- **rotulado por curso y fecha, nunca con un número de versión del kit**:
  las versiones las pone solo el chat del kit (§7.58).

**Cada sesión de trabajo sobre un curso que ya existe empieza
poniéndolo al día** (`actualizar-kit`, y los pasos que avise). Así lo que
se encuentre está escrito contra el kit de hoy. El texto para arrancar
ese chat es `PROMPT-RETOMAR-CURSO.md`.

Se puede parchear la copia local del curso para no frenar la entrega,
pero el arreglo de verdad lo aplica el chat del kit. **Nunca se relevan
archivos "completos" para copiar encima**: el chat del kit porta por
partes, porque un archivo entero escrito contra un kit viejo borra
arreglos de otros cursos (pasó cuatro veces, §7.43–§7.50).

---

## 10 · Antes de entregar

```bash
COURSE_URL="http://localhost:8080/index.html" npm test   # la suite entera
npm run verify-hitboxes                                    # mirar las capturas
npm run check-assets                                       # peso de imágenes
node tools/check-css-duplicates.mjs .                     # reglas que se pisan (mira css/)
node tools/check-raw-cat-colors.mjs                        # hex de categoría a mano
node tools/check-globals.mjs .                             # globales sin publicar (mira js/)
node kit-base/tools/revisar-curso.mjs .                     # → sección "Relevo al kit" (obligatoria)
node tools/check-keyframes.mjs css                         # animaciones sin @keyframes
python3 tools/build-zip.py                                 # el zip para el LMS
```

- **Sin la sección "Relevo al kit" en el `README-CURSO.md`, no se
  entrega** (§9, §7.68).
- **Bandas anchas a los costados en Moodle no son del curso**: es el
  marco ("ventana actual", ~2,9:1). Se arregla en el sitio
  (`scorm | frameheight`, alto ≈ `ancho / 2,38 + 120`) o con "ventana
  nueva"; nunca subiendo el techo del CSS. Ver README del kit,
  "Requisitos de publicación" (§7.68).
- **Un "0 fallos" vale si además dice cuántos tests corrió.** La suite
  sale de la carpeta; un test que no corre no avisa (§7.3 #17).
- **`kit-intacto` en rojo = alguien editó un archivo del kit dentro del
  curso.** Eso se releva, no se entrega así (§7.51).
- **Releer §7.3 del diario** (los 20 bugs que ya se pagaron una vez).
- El zip no lleva `README.md` del kit junto al `README-CURSO.md`
  (`build-zip.py` lo resuelve) (§7.3 #10).

---

## 11 · El curso como datos

- **Un curso puede guardarse como `curso.json` + `marco.html`** en vez de
  un index escrito a mano: el contenido (diapositivas, zonas, locución,
  índice, glosario, fichas) en el JSON, y el resto del index en el marco
  con huecos. `node tools/armar-curso.mjs <curso>` escribe el index
  (§7.60).
- **En un curso así, el `index.html` es generado: no se edita a mano.**
  El cambio se hace en `curso.json` (o en el marco) y se vuelve a armar.
  `actualizar-kit` avisa si el index no es el que sale de los datos.
- **Convertir un curso existente**: `node tools/extraer-curso.mjs
  <curso>`. Verifica cada pieza y lo que todavía no sabe modelar lo deja
  como HTML tal cual; si el curso armado no diera igual al original, no
  escribe nada. Es opcional.
- **`--porque`** agregado al extractor lista, por cada pieza que quedó
  como HTML, la diferencia que lo impidió. El formato crece con lo que
  se repite entre cursos; una pieza de un solo curso queda como HTML
  (§7.64).
- **Lo que `curso.js` usa y no es marcado también va en `curso.json`**:
  `practica` (banco, `porIntento`, mensajes), `logros` y `medallas`. El
  armador los pone en el index y `curso.js` los lee con
  `datosDelCurso('practica', {})`. No se escriben otra vez en `curso.js`
  (§7.62).
- **Los rangos de medalla del cierre no se escriben**: salen de
  `medallas`. Solo un curso que los cuenta de otra forma (en logros, por
  ejemplo) los trae en `rangos` (§7.63).
- **Los cursos nuevos nacen como datos** (v1.9.116). Los que ya existen
  pueden pasarse con `extraer-curso.mjs` cuando se los retome; no es
  obligatorio (§7.65).
- **Las `notas` guardan los comentarios** de cada diapositiva, ficha y del
  índice: el extractor los junta y el armador los vuelve a escribir. Una
  decisión que no viaja con su pieza se pierde (§7.66).
- **`curso.json` y `marco.html` viajan dentro del zip del curso** (el LMS
  los ignora): es la forma de poder retomarlo desde ese zip (§7.66).
- **`initVideoPlayer()` se llama siempre** (lo hace la plantilla): el
  reproductor del pop-up está en el chrome de todo curso. Llamarla dos
  veces no rompe nada; la segunda solo engancha disparadores nuevos
  (§7.65).

---

## 12 · Mantener el kit (solo en el chat del kit)

- **Cada relevo se verifica contra el código real** antes de aplicarlo.
  Un diagnóstico correcto no vuelve correcta la conclusión; y si el
  relevo cambia una conducta, buscar si esa conducta fue decidida
  (§7.43).
- **Dos zips con el mismo número de versión no son el mismo zip.** Cada
  chat numera a su manera: se compara contenido, no rótulos (§7.48, §7.49).
- **Se porta por partes, nunca se copia un archivo encima.**
- **Algo sube al kit cuando lo necesita un segundo curso** (§4 del
  diario).
- **Cada versión se prueba contra TRES cursos**: el sintético del arnés,
  el curso de prueba real (`sh curso-prueba/probar.sh`, que arma una copia
  de "Prevención cardiovascular" con el kit actual y corre la suite) y un
  curso RECIÉN GENERADO con `new-course.mjs` (el arnés está enriquecido a
  mano y esconde lo que la plantilla deja sin cablear). Los tres en verde
  antes de entregar (§7.55, §7.65).
- **Todo test nuevo se prueba en las dos direcciones**: verde con el kit
  sano, ROJO con el bug puesto a propósito. Un test que no se vio fallar
  no se sabe si mira algo (§7.13).
- **El navegador de pruebas no aplica la política de autoplay**: un
  `play()` con sonido y sin gesto se acepta. Un test que necesita ese
  rechazo lo simula interceptando `play()` (§7.59).
- **Cuidado con el verde por ausencia**: si la pieza no está, el test no
  la saltea; la inyecta y la mide. Y una medida que da `NaN` es rojo, no
  verde (§7.47, §7.52).
- **Un test que inyecta marcado busca DENTRO de lo que inyectó** y le da
  tamaño propio: si no, se tropieza con lo que el curso ya tiene y acusa
  al kit por el curso (§7.54).
- **Cada cambio lleva**: su sección §7.xx en el diario, entrada en el
  changelog del README, versión en `package.json` + README + prompt +
  `tools/tests/README.md`, y **este manual actualizado si cambió una
  regla**. `npm run test:kit` (con `check-conteos`) agarra los números
  que el kit dice de sí mismo.
- **`visual-regress` fija el azar** (`Math.random` con semilla): sin eso la
  mini práctica baraja otras preguntas en cada carga y la herramienta
  acusa cambios que no existen (§7.60).
- **El curso de prueba se guarda como datos** (`curso-prueba/curso.json` +
  `marco.html`); `probar.sh` lo arma y verifica que extraer y armar sigan
  siendo inversos. Un cambio a `curso-datos.mjs` que rompa eso corta la
  corrida (§7.60).
- **El exportador GIFT de evaluaciones no va al kit** (decisión fija).
- La rama `claude/kit-base` del repo guarda una versión por commit.
