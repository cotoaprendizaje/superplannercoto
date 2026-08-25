// Genera el index.html desplegable a partir de src/ + assets/.
// Todo queda inline (fuentes, logos, CSS y JS) para que la app funcione
// como un único archivo, igual que la versión que ya está en producción.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const p = (...s) => join(root, ...s);

const MIME = {
  woff2: "font/woff2",
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
};

async function dataURI(relPath) {
  const ext = relPath.split(".").pop().toLowerCase();
  const mime = MIME[ext];
  if (!mime) throw new Error(`No sé qué MIME usar para ${relPath}`);
  const buf = await readFile(p(relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

// url('../assets/fonts/X.woff2') -> url('data:font/woff2;base64,...')
async function inlineCssAssets(css) {
  const refs = [...css.matchAll(/url\(["']?\.\.\/(assets\/[^"')]+)["']?\)/g)];
  let out = css;
  for (const [match, rel] of refs) {
    out = out.replace(match, `url('${await dataURI(rel)}')`);
  }
  return out;
}

// "@@ASSET:assets/logo-coto.png@@" -> "data:image/png;base64,..."
async function inlineJsAssets(js) {
  const refs = [...js.matchAll(/@@ASSET:([^@]+)@@/g)];
  let out = js;
  for (const [match, rel] of refs) {
    out = out.replace(match, await dataURI(rel));
  }
  return out;
}

const [shell, css, js] = await Promise.all([
  readFile(p("src/index.html"), "utf8"),
  readFile(p("src/styles.css"), "utf8"),
  readFile(p("src/app.js"), "utf8"),
]);

for (const token of ["<!-- @@STYLES@@ -->", "<!-- @@SCRIPT@@ -->"]) {
  if (!shell.includes(token)) throw new Error(`Falta el marcador ${token} en src/index.html`);
}

const html = shell
  .replace("<!-- @@STYLES@@ -->", `<style>\n${await inlineCssAssets(css)}\n</style>`)
  .replace("<!-- @@SCRIPT@@ -->", `<script>\n${await inlineJsAssets(js)}\n</script>`);

await writeFile(p("index.html"), html);
console.log(`index.html generado · ${(html.length / 1024).toFixed(0)} KB`);
