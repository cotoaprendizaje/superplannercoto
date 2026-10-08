# Prompt para retomar un curso que ya existe

**Qué es esto:** el texto que se pega en el chat de un curso YA HECHO
cuando hay que volver a tocarlo (correcciones del cliente, una edición
nueva, ponerlo al día). Para un curso que arranca de cero está
`PROMPT-CURSO-NUEVO.md`.

**Cómo se usa:** copiar el bloque de abajo, reemplazar lo que está entre
`<>` y adjuntar DOS zips: el del curso y el del kit-base más nuevo.
Sirve en el chat de siempre del curso o en uno nuevo: todo lo que hace
falta viaja en los dos zips.

---

## ✂️ Copiar desde acá

Vamos a retomar el curso **`<NOMBRE DEL CURSO>`**, del molde "Área
Aprendizaje (COTO)". Te adjunto el zip del curso y el del kit-base
(v1.9.128). Lo que hay que hacer: `<lo que pidió el cliente, o "ponerlo al día con el kit">`.

### Paso 1 — antes de tocar nada, poner el curso al día con el kit

```bash
node kit-base/tools/actualizar-kit.mjs <carpeta-del-curso>            # muestra el plan
node kit-base/tools/actualizar-kit.mjs <carpeta-del-curso> --aplicar  # lo aplica (con --forzar si lo pide)
```

Leé el plan entero antes de aplicar y **hacé en este mismo momento los
pasos que avise** (líneas con ⚠️): son cambios en `js/curso.js` que el
kit no puede hacer solo, y si no se hacen el curso queda peor que antes
(por ejemplo, la locución doble o una pantalla de resultado sin pintar).
Si marca archivos del kit **editados a mano**, NO los pises sin
mirarlos: anotá qué tenían, porque suelen ser arreglos que tienen que
subir al kit.

Si el curso tiene `curso.json` + `marco.html` (está en datos), el
contenido se edita ahí y el index se arma con
`node tools/armar-curso.mjs <carpeta-del-curso>`; nunca se edita el
`index.html` a mano. Los dos archivos viajan dentro del zip del curso
desde kit v1.9.117.

### Paso 2 — leer las reglas

`MANUAL-DEL-MOLDE.md` entero (las reglas vigentes, cortas). Si algo del
`CLAUDE.md` del kit dice otra cosa, manda el manual. **Desde este chat
no se edita ningún archivo del kit**: ni para un arreglo de una línea.

### Paso 3 — la suite, antes y después de cada cambio

```bash
COURSE_URL="http://localhost:8080/index.html" npm test
```

Lo que dé rojo después de actualizar es del curso o del kit: decidilo
mirando el mensaje (cada test dice qué mide y por qué). Lo del curso se
arregla acá. Lo del kit se anota para relevar (paso 5).

### Paso 4 — antes de entregar al LMS

- La suite entera en verde (y mirá cuántos tests dice haber corrido).
- `python3 tools/build-zip.py <carpeta-del-curso> <salida.zip>` — pasale
  la carpeta DEL CURSO, no la que la contiene: si el manifiesto queda en
  una subcarpeta, la herramienta lo rechaza.
- **La entrega son DOS zips, siempre** (kit-base v1.9.122):
  `python3 tools/build-zip.py <carpeta-del-curso> <salida.zip>` arma el del curso
  y, al lado, `RELEVO-AL-KIT_<curso>_<fecha>.zip` con el relevo, la salida de
  `revisar-curso` y los archivos propios del curso. **Si la sección "Relevo al
  kit" del `README-CURSO.md` falta o dice "pendiente", no arma ninguno de los
  dos.** El mensaje final de este chat nombra los dos zips; si entregás uno
  solo, la entrega está incompleta.

- **Probar que un alumno a mitad de camino retoma donde estaba:** abrir el
  curso viejo, avanzar hasta la mitad, y abrir el nuevo con ese mismo
  progreso guardado.
- **La sección "Relevo al kit" del `README-CURSO.md`, obligatoria** (paso 5):
  `node kit-base/tools/revisar-curso.mjs <carpeta-del-curso>`, y cada punto
  que marque va ahí. Sin esa sección el curso no está listo para entregar.

### Paso 5 — todo lo que resuelvas va al relevo; decide el kit

**Regla: todo lo que resuelvas en el curso va al relevo, y decide el
kit.** No solo lo que te parezca del kit: también lo que arreglaste
"porque era de este curso". Vos no decidís qué es propio y qué es
general; lo decide el chat del kit, que ve todos los cursos. Pasó:
"Prevención cardiovascular" resolvió adentro doce cosas que creyó suyas
—entre ellas el cierre trabado sin salida que el cliente había reportado
con foto— y el kit se enteró recién en un segundo relevo.

Podés parchear la copia local para no frenar la entrega, pero el arreglo
va al chat del kit, en la sección **"Relevo al kit"** del
`README-CURSO.md`, que es obligatoria aunque quede vacía:

```bash
node kit-base/tools/revisar-curso.mjs <carpeta-del-curso>
```

`revisar-curso` lista lo que el curso hizo por su cuenta y puede ser del
kit (funciones privadas del kit, números copiados de los tests,
mecanismos propios, CSS que pelea con el kit). **Cada punto que marque va
al relevo**, con una línea tuya; si te parece propio del curso, decilo,
pero mandalo igual. Si no marca nada, la sección dice "se corrió
`revisar-curso` y no marcó nada". Y en el relevo:

- **Rotulalo por curso y fecha** ("relevo `<curso>`, `<fecha>`). **Nunca con
  un número de versión del kit**: las versiones las pone solo el chat del
  kit, y dos chats numerando por su cuenta ya generaron confusiones.
- **Decí de qué versión del kit partiste** (está en `kit-version.json`).
- Por cada hallazgo: el síntoma, la causa medida en el código, y cómo lo
  verificaste. Separá lo que probaste de lo que suponés.
- Podés mandar los archivos enteros: el chat del kit los porta por partes,
  nunca los copia encima.

## ✂️ Hasta acá
