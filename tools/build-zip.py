#!/usr/bin/env python3
"""build-zip.py — arma el zip de entrega de un curso (o de kit-base
mismo) con nombres de archivo UTF-8 forzados.

Por qué existe: sin forzar el flag, `zip`/`zipfile` en un locale no-UTF-8
puede guardar mal cualquier nombre con tildes/ñ (ej. "Cómo" → "C#U00f3mo")
— se ve roto en Windows/7-Zip aunque acá parezca normal (CLAUDE.md §3.9).
Se reconstruyó a mano varias veces antes de subirlo acá; ahora es una
herramienta fija del kit, no un script ad-hoc por sesión.

⚠️ ACÁ HABÍA UNA TRAMPA, Y ERA AL REVÉS (kit-base v1.9.95). Este
encabezado decía que hay que re-aplicar el flag recorriendo `z.filelist`
después de escribir todo. Eso es justo lo que ROMPÍA el zip: a esa
altura los headers LOCALES ya están escritos, así que el bucle solo
alcanza al directorio central. Local decía 0, central decía 1, y eso es
literalmente lo que `unzip` reporta:

    mismatch between local and central GPF bit 11 ("UTF-8"),
    continuing with central flag (IsUTF8 = 1)

Una vez por entrada, y cerrando con "At least one warning-error was
detected". El archivo descomprime bien y el CRC da, pero a un cliente
que abre el paquete con un descompresor estricto le dice "llegó roto".

Y el bucle NO HACÍA FALTA: `zipfile` pone el flag solo, y bien, en los
DOS headers, para cualquier nombre que lo necesite. Medido:

    nombre               local  central  unzip -t
    a.txt                  0      0        ok     ← correcto: ASCII no necesita el flag
    Cómo recorrer.md       1      1        ok
    ñandú/año.txt          1      1        ok

y las cuatro formas de ponerlo:

    antes de writestr             0,1  0,1   ok
    DESPUÉS, sobre filelist       0,1  1,1   WARNING  ← lo que hacía el kit
    antes y después               0,1  1,1   WARNING
    sin tocar nada                0,1  0,1   ok       ← lo que hace ahora

⚠️ Y la razón de que esto viviera tanto sin que nadie lo viera: la
verificación miraba `z.filelist`, que ES el directorio central — o sea
justo la mitad que el bucle acababa de parchear, nunca la que rompía.
Pasaba siempre, por construcción. Ahora se leen los headers LOCALES a
mano (`zipfile` no los expone) y se comparan con el central.

Uso:
    python3 build-zip.py <carpeta_origen> <salida.zip> [nombre_a_excluir ...]

Ejemplos:
    python3 build-zip.py kit-base kit-base-v1.9.40.zip
    python3 build-zip.py seguridad-alimentaria seguridad-alimentaria.zip node_modules

Excluye siempre, sin necesidad de pedirlo: node_modules/, .git/,
__pycache__/, .pytest_cache/, .kit-anterior/, .DS_Store, Thumbs.db, y cualquier
README.md que conviva con un README-CURSO.md en la misma carpeta (regla
de §6.43 — nunca empaquetar los dos READMEs con nombres casi iguales).
"""
import os
import sys
import struct
import zipfile

# `.kit-anterior`: los respaldos que deja `actualizar-kit.mjs` (v1.9.102).
# Son la red de seguridad de quien actualiza el curso; al LMS no van.
# `curso-prueba`: el curso real contra el que se prueba cada versión del
# kit (v1.9.106, CLAUDE.md §7.55). Vive en la rama del kit, no viaja en el zip.
EXCLUIR_DIRS = {'node_modules', '.git', '__pycache__', '.pytest_cache', '.kit-anterior',
                'curso-prueba'}
EXCLUIR_ARCH = {'.DS_Store', 'Thumbs.db'}
ARCHIVOS_DE_TRABAJO = {'PROMPT-CURSO-NUEVO.md', 'PROMPT-RETOMAR-CURSO.md', 'MANUAL-DEL-MOLDE.md', 'header-boilerplate.html',
                       'simulador-boilerplate.html'}


def juntar(raiz, excluir_nombres=()):
    """Devuelve [(ruta_absoluta, nombre_en_zip)] ordenado, determinístico."""
    items = []
    raiz = os.path.abspath(raiz)
    tiene_readme_curso = os.path.isfile(os.path.join(raiz, 'README-CURSO.md'))
    # ¿Esta carpeta ES el kit, o es un curso hecho con el kit?
    # La huella del kit: trae el generador Y la plantilla de index.
    # Un curso generado tiene el `index.html` ya armado, no la plantilla.
    es_kit = (os.path.isfile(os.path.join(raiz, 'tools', 'new-course.mjs'))
              and os.path.isfile(os.path.join(raiz, 'index-boilerplate.html')))
    for dirpath, dirnames, filenames in os.walk(raiz):
        dirnames[:] = sorted(d for d in dirnames if d not in EXCLUIR_DIRS)
        for f in sorted(filenames):
            if f in EXCLUIR_ARCH:
                continue
            abs_p = os.path.join(dirpath, f)
            rel = os.path.relpath(abs_p, raiz)
            partes = rel.replace(os.sep, '/').split('/')
            if partes[0] in excluir_nombres or rel.replace(os.sep, '/') in excluir_nombres:
                continue
            # §6.43: si hay README-CURSO.md en la raíz, el README.md de
            # la raíz (heredado del scaffold del kit) NUNCA se empaqueta.
            if tiene_readme_curso and len(partes) == 1 and partes[0] == 'README.md':
                continue
            # Archivos de TRABAJO del kit que el scaffold deja en la
            # carpeta a propósito, pero que no son parte del curso
            # entregable (kit-base v1.9.72, §7.18 K8):
            #   · PROMPT-CURSO-NUEVO.md — documentación de proceso; sirve
            #     para retomar la carpeta en un chat nuevo, no al alumno.
            #   · header-boilerplate.html — el header YA está inyectado
            #     dentro del index.html. Mandar los dos es garantizar que
            #     algún día se desincronicen, que es justo lo que advierte
            #     el comentario del propio generador.
            #   · simulador-boilerplate.html — el marcado de referencia
            #     del molde de simulador (kit-base v1.9.81). El curso
            #     copia de ahí lo que usa y lo pega en su index.html;
            #     mandar además el catálogo entero son 45 KB de
            #     pantallas que el alumno nunca abre.
            # El zip del curso de referencia aprobado no lleva ninguno.
            #
            # ⚠️ PERO SOLO EN UN CURSO (kit-base v1.9.81). En el zip del
            # KIT esos dos archivos son PARTE DEL KIT: `new-course.mjs`
            # los copia a cada curso que genera, así que un kit
            # empaquetado sin ellos genera cursos rotos — el generador
            # muere con ENOENT en la primera línea que los copia.
            # Se encontró empaquetando v1.9.81 y revisando la lista de
            # entradas del zip, no usándolo: el kit se arma en una
            # sesión y se usa en otra, así que el error habría aparecido
            # recién en el próximo curso, lejos de su causa.
            if not es_kit and len(partes) == 1 and partes[0] in ARCHIVOS_DE_TRABAJO:
                continue
            items.append((abs_p, rel.replace(os.sep, '/')))
    return items


def _flags_locales(path):
    """(nombre, flag_utf8) de cada header LOCAL del zip.

    `zipfile` solo expone el directorio central, así que la mitad que
    rompía el paquete era justamente la que no se podía verificar con la
    librería. Se leen los 30 bytes fijos del header local: firma en 0,
    banderas de propósito general en 6, largo del nombre en 26.
    """
    out = []
    with open(path, 'rb') as fh:
        data = fh.read()
    off = 0
    while True:
        i = data.find(b'PK\x03\x04', off)
        if i < 0:
            return out
        gpf = struct.unpack('<H', data[i + 6:i + 8])[0]
        n = struct.unpack('<H', data[i + 26:i + 28])[0]
        nombre = data[i + 30:i + 30 + n].decode('utf-8', 'replace')
        out.append((nombre, bool(gpf & 0x800)))
        off = i + 4


def construir(raiz, salida, excluir_nombres=()):
    items = juntar(raiz, excluir_nombres)
    if not items:
        raise SystemExit('Nada para empaquetar en %r (¿ruta correcta?)' % raiz)
    with zipfile.ZipFile(salida, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for abs_p, nombre in items:
            with open(abs_p, 'rb') as fh:
                z.writestr(nombre, fh.read())

    # Verificación real, no "se ve bien": reabrir y chequear entrada por
    # entrada, más un testzip() de integridad.
    with zipfile.ZipFile(salida) as z:
        # Los dos headers tienen que COINCIDIR. Un nombre ASCII con el
        # flag en 0 está bien; lo que no puede pasar es que local y
        # central digan cosas distintas, que es el warning de `unzip`.
        central = {zi.filename: bool(zi.flag_bits & 0x800) for zi in z.filelist}
        desparejos = [n for n, loc in _flags_locales(salida)
                      if n in central and loc != central[n]]
        assert not desparejos, (
            'el flag UTF-8 no coincide entre el header local y el central en %r — '
            '`unzip` lo reporta como zip dañado' % desparejos[:5])
        roto = z.testzip()
        assert roto is None, 'entrada corrupta: %s' % roto
        nombres = z.namelist()
        n = len(z.filelist)
    try:
        revisar_raiz_scorm(nombres, raiz)
    except SystemExit:
        # Un zip rechazado NO queda en disco (kit-base v1.9.107, al subir
        # el chequeo): si quedaba, igual se podía subir al LMS por error.
        os.remove(salida)
        raise
    return n, os.path.getsize(salida)


def revisar_raiz_scorm(nombres, raiz):
    """Un paquete SCORM lleva el `imsmanifest.xml` en la RAÍZ del zip.

    ⚠️ ESTE CHEQUEO SE PAGÓ CARO. Se entregó un curso empaquetado con un
    nivel de carpeta de más —`prevencioncardiovascular/imsmanifest.xml`
    en vez de `imsmanifest.xml`— porque se le pasó a este script la
    carpeta CONTENEDORA en vez de la del curso. Moodle busca el
    manifiesto en la raíz; con ese nivel extra rechaza el paquete al
    subirlo. El cliente lo encontró intentando subirlo: *"no está para
    scorm"*.

    Y lo que no alcanzó para evitarlo: `check-manifest` había dado verde,
    porque corre sobre la CARPETA de trabajo y ahí el manifiesto sí está
    en su lugar. Ninguna verificación sobre la carpeta puede ver un nivel
    que se agrega al empaquetar. Hay que mirar el zip.

    Solo avisa cuando hay un manifiesto y está mal puesto: un zip que no
    es un paquete SCORM (el propio kit-base, un parche) no lleva
    manifiesto y pasa sin decir nada."""
    manifiestos = [n for n in nombres if n.endswith('imsmanifest.xml')]
    if not manifiestos:
        return
    if 'imsmanifest.xml' in manifiestos:
        return
    hondo = sorted(manifiestos, key=lambda n: n.count('/'))[0]
    carpeta = hondo.rsplit('/', 1)[0]
    raise SystemExit(
        'El zip tiene el manifiesto en %r y no en la raíz, así que el LMS lo va a\n'
        'rechazar. Pasale la carpeta DEL CURSO, no la que la contiene:\n'
        '    python3 build-zip.py %s %s\n'
        'en vez de                %s'
        % (hondo, os.path.join(raiz, carpeta), '<salida.zip>', raiz))


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(1)
    raiz, salida = sys.argv[1], sys.argv[2]
    excluir = set(sys.argv[3:])
    n, size = construir(raiz, salida, excluir)
    print('%s  —  %d entradas, %.2f MB, flag UTF-8 verificado en las %d'
          % (salida, n, size / 1024 / 1024, n))


if __name__ == '__main__':
    main()
