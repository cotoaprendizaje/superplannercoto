# Seguridad

Estado honesto de la app, para poder decidir con la información a la vista.

## Hoy los datos del planner son públicos

La app habla directo con Supabase desde el navegador, con la clave
`sb_publishable_...` que va escrita en `src/app.js` y termina embebida en el
`index.html` que se despliega. Eso no es un error de configuración: una clave
*publishable* está pensada para viajar en el cliente y cualquiera que abra la
app puede leerla desde el código fuente de la página.

Lo que protege los datos, entonces, no es la clave: son las políticas **RLS**
(Row Level Security) de la tabla `planner`. Y como la app necesita leer y
escribir usando sólo esa clave, hoy esas políticas casi con seguridad permiten
lectura y escritura anónimas.

Si es así, cualquiera con la URL de la app puede:

- leer todo el tablero (cursos, notas, responsables, fechas, agenda del equipo);
- sobrescribirlo o vaciarlo por completo.

### Cómo verificarlo

En el navegador, con la app abierta, la consola:

```js
await (await fetch(BACKEND.supabaseUrl + "/rest/v1/planner?select=*", {
  headers: { apikey: BACKEND.supabaseKey },
})).json();
```

Si devuelve la fila con los datos, la lectura anónima está abierta. En el panel
de Supabase se ve más claro en **Authentication → Policies**, sobre la tabla
`planner`.

## La clave de ingreso no es un control de acceso

La pantalla de entrada compara un hash de la clave contra `state.appPassHash`,
del lado del cliente. Ese hash viaja en el mismo documento que cualquiera puede
leer, y el chequeo se saltea desde la consola del navegador en una línea.

Sirve para lo que fue pensada — que el equipo se identifique y quede registrado
quién carga qué — pero no impide que alguien de afuera vea o modifique los
datos. Conviene tratarla como un cartel, no como una cerradura.

`Minuevacontra5` estuvo escrita en `LEEME.txt` en este repositorio público:
**cambiala desde Ajustes**, y no la reutilices en ningún otro lado.

## Qué se puede hacer

### 1. Cambiar la clave de ingreso (un minuto)

Desde Ajustes, dentro de la app. Saca de circulación la que estuvo publicada en
este repositorio.

### 2. Copias de resguardo (ya está hecho)

Cada guardado deja una copia en el navegador de quien está usando la app, hasta
ocho, espaciadas al menos 15 minutos. Se restauran desde **Ajustes → Copias de
resguardo**. Si alguien vacía el tablero, cualquiera del equipo que lo haya
tenido abierto en los últimos días puede devolverlo a como estaba.

Son copias locales: viven en el navegador de cada uno, no en el servidor. Si
todos limpian los datos del navegador el mismo día, no quedan. Para algo más
duradero, un `Ajustes → Exportar JSON` cada tanto y guardarlo en el Drive del
área.

### 3. Cerrar la escritura anónima

Acá hay una trampa que conviene tener clara antes de tocar nada: **la app
escribe usando la misma clave anónima con la que lee**. Si en Supabase se
bloquean los `INSERT`/`UPDATE` anónimos y no se cambia nada más, la app deja de
poder guardar. No alcanza con apretar un botón en el panel.

Para cerrar la escritura de verdad hace falta que la app se autentique. La
opción más corta, que además deja el ingreso actual casi igual:

1. En Supabase, **Authentication → Users**, crear un usuario para el equipo
   (por ejemplo `elearning@coto.com.ar`) con una contraseña.
2. En **Authentication → Policies**, sobre la tabla `planner`:
   - `SELECT`: permitir a `authenticated` (y a `anon` sólo si les sirve que se
     pueda leer sin entrar).
   - `INSERT` / `UPDATE`: **sólo** `authenticated`.
3. En la app, la pantalla de ingreso pasa a iniciar sesión de verdad contra
   Supabase con esa cuenta, en vez de comparar un hash local. La clave grupal
   que ya escriben pasa a ser la contraseña de esa cuenta.

El paso 3 es trabajo en `src/app.js` y hay que hacerlo **junto** con el 2, si no
la app queda sin poder guardar. Los pasos 1 y 2 son del panel de Supabase.

Una cuenta por persona (en vez de una compartida) es mejor todavía —permite
saber quién cambió qué y dar de baja a alguien sin cambiarle la clave al resto—
pero implica manejar altas y bajas.

### Sobre hacer privado el repositorio

Ayuda poco por sí solo: la clave igual viaja en el `index.html` publicado.
El problema se arregla del lado de Supabase, no escondiendo el código.
