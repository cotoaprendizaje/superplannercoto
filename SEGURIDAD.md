# Seguridad

Estado honesto de la app, para poder decidir con la información a la vista.

## Cómo está protegido hoy

Septiembre de 2026: se cerró el acceso anónimo a la base. Antes de eso los
datos eran públicos —cualquiera con la URL de la app podía leer el inventario
de capacitación entero, o vaciarlo, sin dejar rastro—. Hoy no.

Lo que protege los datos son dos piezas que trabajan juntas:

1. **Cada persona entra con su propia cuenta** de Supabase (mail y contraseña).
   La app manda el token de esa sesión en cada pedido, en el `Authorization`.
2. **La política de la tabla `planner` solo le contesta a `authenticated`.**
   Con la clave publishable sola —la que va escrita en el `index.html` y que
   cualquiera puede leer del código de la página— la base devuelve una lista
   vacía.

```sql
-- lo que está aplicado sobre la tabla
create policy "solo con sesion"
  on planner for all
  to authenticated
  using (true) with check (true);
```

La clave `sb_publishable_...` que viaja en el cliente **no es un secreto** y no
hace falta esconderla: está pensada para eso. La que nunca puede salir del
panel de Supabase es la `sb_secret_...`, que saltea las políticas.

### Cómo verificar que sigue cerrado

En una ventana de incógnito, en la app, **sin entrar**, desde la consola del
navegador:

```js
await (await fetch(BACKEND.supabaseUrl + "/rest/v1/planner?select=id", {
  headers: { apikey: BACKEND.supabaseKey },
})).json()
```

Tiene que devolver `[]`. Si devuelve filas, el acceso anónimo se reabrió y hay
que revisar las políticas.

Ojo con el código de estado: una lectura bloqueada por RLS devuelve **200 con
lista vacía**, no 401. El 401 es para una clave inválida. Mirar el estado en
vez del contenido lleva a creer que está abierto cuando no lo está, y al revés.

Para ver el estado desde el SQL Editor:

```sql
select
  (select relrowsecurity from pg_class where relname = 'planner') as rls_activo,
  (select count(*) from pg_policies where tablename = 'planner') as politicas;
```

`rls_activo` tiene que ser `true` y `politicas` tiene que ser `1`. Si RLS
quedara apagado, las políticas no se aplican y todo pasa.

## Lo que esto NO protege

**El permiso de administrador es de la app, no de la base.** Quien administra
es el único que ve Ajustes y datos —sectores, equipo, importar, reiniciar—,
pero eso se decide en el navegador: alguien con conocimientos lo saltea desde
la consola. Sirve para lo que realmente pasa, que es que alguien toque sin
querer algo que le cambia el tablero a todo el equipo. No para frenar a alguien
decidido que ya tiene una cuenta válida.

Dicho de otro modo: **cualquiera de las seis cuentas puede, si se lo propone,
hacer todo lo que hace la cuenta que administra.** El límite real es de acceso
(tener cuenta o no tenerla), no de rol.

**Tampoco hay registro de auditoría.** Cada tarjeta guarda quién la tocó
último, pero no hay un historial de cambios que no se pueda alterar.

## Copias de resguardo

Dos niveles, y conviene entender qué cubre cada uno.

**Automático, en el navegador.** Cada guardado deja una copia en el navegador
de quien está usando la app, hasta ocho, espaciadas al menos 15 minutos. Se
restauran desde **Ajustes → Copias de resguardo**. Cubre el caso "alguien borró
algo sin querer": si otra persona tuvo la app abierta hace poco, ahí está.

No cubre nada más. Son copias locales: si todos limpian los datos del navegador
el mismo día, o si el proyecto de Supabase desaparece, no queda nada.

**Manual, fuera del navegador.** `Ajustes → ⬇ Exportar JSON`, y el archivo al
Drive del área. Es lo único que sobrevive a que la base se pierda. La app lo
recuerda: pasados siete días sin bajar un respaldo, quien administra ve un
aviso en Inicio.

El plan gratuito de Supabase **no hace copias de seguridad ni permite volver a
un punto en el tiempo**. Mientras se siga en ese plan, ese respaldo semanal no
es una recomendación: es lo único que hay.

## Antecedente: la cuota agotada

En septiembre de 2026 la app consumió 43,6 GB de salida sobre una cuota de 5, y
Supabase restringió el proyecto por tres semanas. La causa: el tablero llevaba
1,35 MB de portadas en base64 adentro del documento sincronizado, y el polling
lo bajaba entero cada cinco segundos, mirara alguien o no.

Está corregido —las portadas viven en su propia fila, el polling pregunta un
sello de versión de 36 bytes antes de bajar nada, y se detiene con la pestaña
de fondo— y hay una prueba automática (`test/tamano.test.mjs`) que se pone en
rojo si una imagen vuelve a meterse en el documento del tablero.

Vale la pena saberlo porque explica dos reglas que si no parecen manías:

- **Nada que crezca sin límite va adentro del documento que se sincroniza.**
- **Las alarmas de consumo se configuran antes del 100 %, no en el 100 %.**
  Una vez restringido el proyecto, la espera es de semanas.

## Qué falta

**Una fila por tarjeta.** Hoy las 126 tarjetas, los sectores, el equipo y las
plantillas son un único documento JSON. De ahí salen tres consecuencias: cada
cambio obliga a las demás pantallas a bajarlo entero, una escritura equivocada
reemplaza todo, y el guardado de emergencia al cerrar la pestaña no entra —el
navegador rechaza envíos con `keepalive` de más de 64 KB y el documento pesa
unos 170—. Está compensado (mezcla por tarjeta según cuál sea más nueva,
lápidas para los borrados, copia local antes de intentar la red) pero es un
parche sobre una forma de guardar que aprieta más a medida que el tablero
crece.

**Que las pruebas frenen la publicación.** Corren en cada cambio y avisan, pero
GitHub Pages publica por su cuenta al fusionar a `main` sin mirar si quedaron
en rojo. Para que un rojo frene la publicación hay que pasar Pages a desplegar
desde Actions, en la configuración del repositorio.
