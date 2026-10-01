#!/usr/bin/env python3
"""achicar-ilustracion.py · kit-base v1.9.105 (doc de --fin/--arriba: v1.9.108) — Área Aprendizaje (COTO)

Achica una ILUSTRACIÓN HORNEADA en la lámina de una diapositiva, para
hacerle lugar abajo a un bloque (una tira de repaso, una ficha, un
cartel) sin que el bloque la tape.

POR QUÉ EXISTE
--------------
En estos cursos la diapositiva es una captura: la ilustración no es un
elemento, está dibujada dentro del .webp. Cuando hace falta meterle un
bloque debajo y no hay lugar, las únicas salidas son taparla un poco
(que el cliente rechaza, y con razón), pedirle al diseñador la lámina de
nuevo (lo correcto a futuro, pero no siempre se puede esperar) o editar
el arte. Esto último se hizo a mano en "Prevención cardiovascular" y
salió bien, así que acá queda como herramienta en vez de como script
suelto de un curso.

Caso real: la tira de `Repaso rápido` se ubicó CINCO veces antes de
cerrar, y las cuatro primeras se verificaron por coordenadas y estaban
mal. Lo que lo resolvió fue achicar las seis ilustraciones para que
terminaran todas en la misma altura, y verificar contando PÍXELES
(`tools/tests/bloque-no-tapa-arte.mjs`).

CÓMO ELEGIR `--fin` Y `--arriba` (lo que costó cinco vueltas)
-------------------------------------------------------------
Estos dos números NO se eligen a ojo ni "probando hasta que entre". Se
calculan, y el cálculo es siempre el mismo:

    --arriba  = donde termina lo que hay encima (el chip de progreso,
                la caja del título) + el aire que se quiera
    --fin     = renglón de abajo − ALTO DEL BLOQUE EN SU PEOR CASO − aire

El alto del bloque hay que MEDIRLO, en puntos del alto de la lámina, y
en el peor caso de tres ejes a la vez:

  1. **el tamaño de pantalla más chico que se soporte en apaisado.** Es
     el que manda, y por una razón que no se ve a ojo: el bloque mide
     los MISMOS PÍXELES en todas las pantallas (su fuente tiene tope
     máximo, por legibilidad) mientras la lámina se encoge. MEDIDO en
     "Prevención cardiovascular", la misma tarjeta:

         escritorio 1600x900   lámina 780px   tarjeta 143px → 18,3 pts
         notebook   1366x768   lámina 648px   tarjeta 143px → 22,1 pts
         iPad apaisado         lámina 658px   tarjeta 130px → 19,8 pts

     Calcular con el escritorio y después abrir el curso en un notebook
     es la forma más rápida de que el bloque termine encima del dibujo.
  2. **el estado más alto del bloque**, no el que trae. Una tarjeta que
     despliega su devolución al contestar crece, y ése es el estado que
     tiene que entrar.
  3. **el peor contenido de la serie.** Una pregunta de dos renglones
     donde las otras cinco entran en uno cuesta 18px más.

Y dos trampas medidas, para no perder el tiempo:

  · **Apretar paddings no sirve.** De 143px se baja a 138: menos de un
    punto de lámina.
  · **Poner la pregunta y las opciones en el mismo renglón EMPEORA** en
    pantallas chicas. En notebook la tarjeta mide 535px y la pregunta al
    lado de los botones se parte en tres renglones: 143px → 166px.

Lo único que mueve la aguja de verdad es sacar un RENGLÓN entero del
bloque. En este curso, el rótulo "Repaso rápido" valía 26px (4,2 puntos)
y llevarlo a `.sr-only` —se sigue leyendo en un lector de pantalla, deja
de ocupar lugar— bajó la tarjeta de 22,07 a 15,28 puntos. Eso alcanzó
para 5,5 puntos de aire arriba Y 7,8% más de dibujo.

CÓMO
----
Para cada lámina: detecta la caja real del dibujo, la recorta, la
reescala, BORRA A BLANCO (o al color de fondo que detecte) la zona
original y la vuelve a pegar anclada al mismo borde SUPERIOR y centrada
en la misma columna. Nada más de la lámina se mueve.

Con `--fin` igual para varias láminas, las deja terminando todas a la
misma altura — y entonces la separación hasta el bloque es la misma en
todas, que es lo que se suele pedir.

SUPONE UNA LÁMINA DE DOS COLUMNAS
---------------------------------
Texto a la izquierda, ilustración a la derecha, separados por un hueco de
fondo que va de punta a punta (así son las láminas de "Prevención
cardiovascular", que es de donde sale). Con `--buscar-en auto` busca ese
hueco antes del 60% del ancho; si la lámina tiene otra disposición, pasar
la caja a mano con `--caja` y mirar el resultado con `--probar` primero.

REVISA SU PROPIA PRECONDICIÓN
-----------------------------
La operación solo es limpia si el fondo alrededor de la ilustración es
uniforme; si no, el borrado deja un parche visible. El script lo MIDE y
se niega a tocar la lámina si no llega a `--min-fondo` (85% por
defecto). En "Prevención cardiovascular" las seis daban 98-99%.

⚠️ ESTO REESCRIBE EL ARTE DEL CLIENTE. Si el diseñador entrega una
lámina nueva, hay que volver a pasarle el script. Conviene guardar los
originales antes (el script no lo hace solo, a propósito: que la copia
de respaldo sea una decisión explícita de quien lo corre).

USO
---
  # una lámina, detectando la caja del dibujo sola
  python3 achicar-ilustracion.py img/factor.webp --fin 68.6

  # varias, todas terminando a la misma altura, con banda de limpieza
  python3 achicar-ilustracion.py img/*.webp --fin 68.6 --limpiar-hasta 93

  # solo medir, sin escribir
  python3 achicar-ilustracion.py img/*.webp --fin 68.6 --probar

OPCIONES
  --fin N            altura (% del alto) donde tiene que terminar el dibujo
  --arriba N         altura donde tiene que EMPEZAR. Sin esto, el dibujo se
                     queda donde arranca hoy y solo se achica desde ahí — y
                     como cada lámina lo arranca a una altura distinta, los
                     dibujos terminan con masa visual desparejada. Con
                     `--arriba` las láminas comparten las DOS puntas, así
                     que ocupan la misma franja y pesan igual.
                     Pedido que lo motivó: *"el margen superior lo debe
                     marcar la caja del título"*.
  --caja L,T,R,B     caja del dibujo en % (si no, se detecta)
  --buscar-en L,R    columna donde buscar el dibujo, en %. Default `auto`:
                     encuentra el hueco de fondo más ancho entre las dos
                     columnas y busca a la derecha de él. Un número fijo no
                     sirve — ver `hueco_entre_columnas()`.
  --limpiar-hasta N  borra al fondo desde un poco abajo del dibujo hasta N%.
                     Hace falta para que el conteo de píxeles dé CERO: el
                     reescalado deja un fleco de antialias y el WebP suma
                     ruido de compresión en el borde. MEDIDO sin esto: hasta
                     228 píxeles de dibujo dentro del bloque — invisibles,
                     pero el pedido era que no lo toque.
  --min-fondo N      % mínimo de fondo uniforme alrededor (default 85)
  --calidad N        calidad WebP de salida (default 88)
  --probar           mide y reporta, sin escribir nada
"""
import argparse, os, sys
try:
    from PIL import Image
    import numpy as np
except ImportError:
    # Mismo criterio que pdf-capa-texto.py: un mensaje que dice qué
    # instalar, no un traceback (kit-base v1.9.105, al subirlo).
    print('Faltan dependencias. Instalar con:')
    print('  pip install pillow numpy')
    sys.exit(2)


def color_de_fondo(a):
    """El color más frecuente del borde exterior de la lámina: el papel.
    Se agrupa de a 8 niveles para que el ruido de compresión no parta el
    mismo color en veinte claves."""
    H, W = a.shape[:2]
    bh, bw = max(2, int(H * 0.015)), max(2, int(W * 0.015))
    borde = np.concatenate([a[:bh].reshape(-1, 3), a[-bh:].reshape(-1, 3),
                            a[:, :bw].reshape(-1, 3), a[:, -bw:].reshape(-1, 3)])
    q = (borde >> 3).astype(np.int32)
    claves = (q[:, 0] << 10) | (q[:, 1] << 5) | q[:, 2]
    k = np.bincount(claves).argmax()
    return np.array([((k >> 10) & 31) << 3 | 4, ((k >> 5) & 31) << 3 | 4, (k & 31) << 3 | 4])


def hueco_entre_columnas(a, fondo, desde=13.0):
    """Borde derecho del hueco más ancho de FONDO entre las dos columnas.

    ⚠️ Esto reemplaza a un default fijo de `--buscar-en 45,95`, que
    estaba MAL y lo mostró el render: la columna de texto de estas
    láminas termina entre el 43,2% y el 46,8% según el factor, así que
    una ventana que arranca en 45 le come el final de los renglones a
    tres de las seis. MEDIDO en "Prevención cardiovascular": colesterol
    45,6%, sedentarismo 45,0%, diabetes 46,8%. Y el dibujo de
    sedentarismo arranca en 48,0%, así que tampoco sirve mover el
    default a 48: no hay un número que sirva para las seis.
    El hueco entre las dos columnas sí es una propiedad de la lámina, no
    un número elegido: se busca la banda vertical de fondo más ancha y
    se empieza a la derecha de ella."""
    H, W = a.shape[:2]
    # TODO el alto, no solo la franja del texto. Con la franja 25-50%
    # el hueco encontrado puede caer DENTRO de la ilustración, en una
    # altura donde esa parte del dibujo no llega todavía. MEDIDO en
    # sedentarismo: la alfombra llega hasta el 48% de ancho pero recién
    # abajo del 50% de alto, así que la ventana arrancó en 54% y dejó un
    # pedazo de alfombra ATRÁS, sin mover ni achicar — visible en el
    # render, un triángulo suelto abajo a la izquierda.
    # Un gutter de verdad es una columna de fondo de punta a punta.
    cols = (np.abs(a - fondo).sum(axis=2) > 24).sum(axis=0)
    x = int(desde / 100 * W)
    minimo = int(W * 0.015)
    # el PRIMER hueco ancho, no el más ancho: el más ancho es el margen
    # derecho de la lámina, y con ese la ventana queda vacía (medido: las
    # seis daban "no encontré dibujo").
    i = x
    while i < W:
        if cols[i] == 0:
            j = i
            while j < W and cols[j] == 0:
                j += 1
            if j - i >= minimo and j / W * 100 < 60:
                return j / W * 100
            i = j
        else:
            i += 1
    return desde


def caja_del_dibujo(a, fondo, busca):
    """Caja real del dibujo dentro de la columna indicada, en píxeles."""
    H, W = a.shape[:2]
    bx0, bx1 = int(busca[0] / 100 * W), int(busca[1] / 100 * W)
    reg = a[:, bx0:bx1]
    dif = np.abs(reg - fondo).sum(axis=2) > 24
    ys, xs = np.nonzero(dif)
    if not len(xs):
        return None
    return (bx0 + xs.min(), ys.min(), bx0 + xs.max() + 1, ys.max() + 1)


def fondo_alrededor(a, fondo, caja, margen=16):
    """Fracción de píxeles de FONDO en el marco que rodea la caja."""
    H, W = a.shape[:2]
    x0, y0, x1, y1 = caja
    tiras = [a[max(0, y0 - margen):y0, x0:x1], a[y1:min(H, y1 + margen), x0:x1],
             a[y0:y1, max(0, x0 - margen):x0], a[y0:y1, x1:min(W, x1 + margen)]]
    tiras = [t.reshape(-1, 3) for t in tiras if t.size]
    if not tiras:
        return 0.0
    px = np.concatenate(tiras)
    return float((np.abs(px - fondo).sum(axis=1) <= 24).mean())


def main():
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument('archivos', nargs='+')
    ap.add_argument('--fin', type=float, required=True)
    ap.add_argument('--arriba', type=float)
    ap.add_argument('--caja')
    ap.add_argument('--buscar-en', default='auto')
    ap.add_argument('--limpiar-hasta', type=float)
    ap.add_argument('--min-fondo', type=float, default=85.0)
    ap.add_argument('--calidad', type=int, default=88)
    ap.add_argument('--probar', action='store_true')
    o = ap.parse_args()
    auto = getattr(o, 'buscar_en') == 'auto'
    busca = None if auto else [float(v) for v in getattr(o, 'buscar_en').split(',')]

    print('%-28s %-8s %-14s %-12s %s' % ('lámina', 'escala', 'termina en', 'fondo', 'estado'))
    print('-' * 88)
    hubo_error = False
    for p in o.archivos:
        im = Image.open(p).convert('RGB')
        W, H = im.size
        a = np.asarray(im).astype(int)
        fondo = color_de_fondo(a)

        if o.caja:
            l, t, r, b = [float(v) for v in o.caja.split(',')]
            caja = (int(l / 100 * W), int(t / 100 * H), int(r / 100 * W), int(b / 100 * H))
        else:
            v = [hueco_entre_columnas(a, fondo), 100.0] if auto else busca
            caja = caja_del_dibujo(a, fondo, v)
        if not caja:
            print('%-28s %s' % (os.path.basename(p), 'no encontré dibujo en la columna indicada'))
            hubo_error = True
            continue

        x0, y0, x1, y1 = caja
        frac = fondo_alrededor(a, fondo, caja) * 100
        t_pc, b_pc = y0 / H * 100, y1 / H * 100
        # con `--arriba`, el dibujo se MUEVE a ese renglón y se escala para
        # llenar la franja hasta `--fin`; sin él, se queda donde está.
        destino_t = o.arriba if o.arriba is not None else t_pc
        escala = min(1.0, (o.fin - destino_t) / (b_pc - t_pc))
        estado = 'ok'
        if frac < o.min_fondo:
            estado = 'NO SE TOCA — el fondo alrededor no es uniforme'
            hubo_error = True
        elif escala >= 1.0 and o.arriba is None:
            estado = 'nada que hacer — ya termina arriba de --fin'
        elif escala >= 1.0 and abs(destino_t - t_pc) < 0.05:
            estado = 'nada que hacer — ya está en el renglón pedido y entra'
        elif o.probar:
            estado = 'solo prueba, no escribo'

        print('%-28s %-8.3f %-14s %-12s %s' % (
            os.path.basename(p), escala, '%.2f - %.2f%%' % (destino_t, destino_t + (b_pc - t_pc) * escala),
            '%.0f%% (rgb %d,%d,%d)' % (frac, *fondo), estado))

        if estado != 'ok':
            continue

        dibujo = im.crop((x0, y0, x1, y1))
        nw, nh = max(1, int(dibujo.width * escala)), max(1, int(dibujo.height * escala))
        chico = dibujo.resize((nw, nh), Image.LANCZOS)
        base = im.copy()
        col = tuple(int(v) for v in fondo)
        # se borra desde el MENOR de los dos topes (el original y el
        # destino) hasta el mayor de los dos pies: con `--arriba` el
        # dibujo se mueve, así que la zona a limpiar es la unión.
        yb0 = min(y0, int(destino_t / 100 * H))
        yb1 = max(y1, int((destino_t / 100 * H)) + nh)
        base.paste(col, (max(0, x0 - 2), max(0, yb0 - 2), min(W, x1 + 2), min(H, yb1 + 2)))
        cx = (x0 + x1) // 2
        base.paste(chico, (cx - nw // 2, int(destino_t / 100 * H)))
        if o.limpiar_hasta:
            desde = int((destino_t + (b_pc - t_pc) * escala + 0.6) / 100 * H)
            base.paste(col, (max(0, x0 - 2), desde, min(W, x1 + 2),
                             int(o.limpiar_hasta / 100 * H)))
        base.save(p, 'WEBP', quality=o.calidad, method=6)

    sys.exit(1 if hubo_error else 0)


if __name__ == '__main__':
    main()
