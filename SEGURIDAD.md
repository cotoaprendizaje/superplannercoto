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

Ordenado por esfuerzo:

1. **Cambiar la clave de ingreso.** Un minuto, y saca de circulación la que
   estuvo publicada.

2. **Cerrar RLS y poner la escritura detrás de algo.** La lectura anónima quizá
   sea tolerable; la escritura anónima significa que cualquiera puede vaciarles
   el tablero. Como mínimo, que la tabla no acepte `INSERT`/`UPDATE` anónimos.

3. **Usar Supabase Auth.** Una cuenta por persona del equipo y políticas RLS que
   exijan sesión iniciada. Es la solución correcta y la que hace que la clave de
   ingreso pase a ser de verdad una cerradura. Implica pantalla de login real y
   migrar el gate actual.

4. **Backups.** Mientras la escritura esté abierta, un export periódico
   (Ajustes → exportar JSON) es la red de contención barata.

Hacer privado el repositorio ayuda poco por sí solo: la clave igual viaja en el
`index.html` publicado. El problema se arregla del lado de Supabase, no
escondiendo el código.
