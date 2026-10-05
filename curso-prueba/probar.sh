#!/bin/sh
# Curso de prueba del kit (kit-base v1.9.106, CLAUDE.md §7.55).
#
# Esta carpeta guarda SOLO los archivos propios de "Prevención
# cardiovascular" (curso.json + marco.html, css/assets|diapositivas|pulido,
# js/curso.js, imsmanifest.xml, img/ y los videos placeholder). Ningún
# archivo del kit:
# este script arma cada vez una copia fresca, le aplica el kit ACTUAL con
# actualizar-kit.mjs y corre la suite entera contra ella. Así cada versión
# del kit se prueba contra un curso real completo, no solo contra el curso
# sintético, y el propio actualizador queda ejercitado en cada corrida.
#
# Desde v1.9.111 (Fase 1, CLAUDE.md §7.60) el curso de prueba está guardado
# como DATOS: no hay index.html acá, lo arma `armar-curso.mjs` en cada
# corrida. Y antes de la suite se comprueba que extraer ese index armado
# devuelva exactamente los mismos datos: si el armador y el extractor
# dejan de ser inversos, se corta acá.
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
node "$KIT/tools/armar-curso.mjs" "$DEST" > /dev/null
VUELTA="$DEST.vuelta"
rm -rf "$VUELTA"
mkdir -p "$VUELTA"
cp "$DEST/index.html" "$VUELTA/"
node "$KIT/tools/extraer-curso.mjs" "$VUELTA" > /dev/null
if ! cmp -s "$VUELTA/curso.json" "$AQUI/curso.json" || ! cmp -s "$VUELTA/marco.html" "$AQUI/marco.html"; then
  echo "✗ extraer el index armado no devuelve los mismos curso.json y marco.html: el armador y el extractor dejaron de ser inversos." >&2
  exit 1
fi
rm -rf "$VUELTA"
node "$KIT/tools/actualizar-kit.mjs" "$DEST" --aplicar > /dev/null
python3 -m http.server "$PUERTO" --directory "$DEST" > /dev/null 2>&1 &
SERVIDOR=$!
trap 'kill $SERVIDOR 2>/dev/null' EXIT
sleep 1
set +e
node "$KIT/tools/run-tests.mjs" "http://localhost:$PUERTO/index.html"
