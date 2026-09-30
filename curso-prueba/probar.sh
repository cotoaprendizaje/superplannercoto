#!/bin/sh
# Curso de prueba del kit (kit-base v1.9.106, CLAUDE.md §7.55).
#
# Esta carpeta guarda SOLO los archivos propios de "Prevención
# cardiovascular" (index.html, css/assets|diapositivas|pulido, js/curso.js,
# imsmanifest.xml, img/ y los videos placeholder). Ningún archivo del kit:
# este script arma cada vez una copia fresca, le aplica el kit ACTUAL con
# actualizar-kit.mjs y corre la suite entera contra ella. Así cada versión
# del kit se prueba contra un curso real completo, no solo contra el curso
# sintético, y el propio actualizador queda ejercitado en cada corrida.
#
# Uso (desde la raíz del kit):   sh curso-prueba/probar.sh [puerto]
# Tiene que dar la suite entera en verde. Si no, el que se rompió es el kit.
set -e
AQUI=$(cd "$(dirname "$0")" && pwd)
KIT=$(dirname "$AQUI")
PUERTO=${1:-8110}
DEST="${TMPDIR:-/tmp}/coto-curso-prueba"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -r "$AQUI"/. "$DEST"/
rm -f "$DEST/probar.sh"
node "$KIT/tools/actualizar-kit.mjs" "$DEST" --aplicar > /dev/null
python3 -m http.server "$PUERTO" --directory "$DEST" > /dev/null 2>&1 &
SERVIDOR=$!
trap 'kill $SERVIDOR 2>/dev/null' EXIT
sleep 1
set +e
node "$KIT/tools/run-tests.mjs" "http://localhost:$PUERTO/index.html"
