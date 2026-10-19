// Arma un .xlsx mínimo para probar el importador de Moodle sin subir al
// repositorio el Excel real del área (el repo es público). Es un zip con los
// tres XML que el importador lee, comprimidos igual que los deja Excel.

import { crc32, deflateRawSync } from "node:zlib";

const escXml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function zip(archivos) {
  const locales = [],
    centrales = [];
  let offset = 0;
  for (const [nombre, texto] of archivos) {
    const datos = Buffer.from(texto, "utf8"),
      comp = deflateRawSync(datos),
      n = Buffer.from(nombre, "utf8"),
      crc = crc32(datos),
      local = Buffer.alloc(30);
    (local.writeUInt32LE(0x04034b50, 0), local.writeUInt16LE(20, 4), local.writeUInt16LE(8, 8));
    (local.writeUInt32LE(crc, 14), local.writeUInt32LE(comp.length, 18), local.writeUInt32LE(datos.length, 22));
    local.writeUInt16LE(n.length, 26);
    const central = Buffer.alloc(46);
    (central.writeUInt32LE(0x02014b50, 0), central.writeUInt16LE(20, 4), central.writeUInt16LE(20, 6));
    (central.writeUInt16LE(8, 10), central.writeUInt32LE(crc, 16), central.writeUInt32LE(comp.length, 20));
    (central.writeUInt32LE(datos.length, 24), central.writeUInt16LE(n.length, 28), central.writeUInt32LE(offset, 42));
    (locales.push(local, n, comp), centrales.push(central, n));
    offset += 30 + n.length + comp.length;
  }
  const dir = Buffer.concat(centrales),
    fin = Buffer.alloc(22);
  (fin.writeUInt32LE(0x06054b50, 0), fin.writeUInt16LE(archivos.length, 8), fin.writeUInt16LE(archivos.length, 10));
  (fin.writeUInt32LE(dir.length, 12), fin.writeUInt32LE(offset, 16));
  return Buffer.concat([...locales, dir, fin]);
}

// filas: la primera es el encabezado. Los textos van a sharedStrings (como lo
// hace Excel) y los números —fechas incluidas— quedan como número.
export function xlsxDePrueba(filas) {
  const textos = [],
    ix = (s) => (textos.includes(s) ? textos.indexOf(s) : textos.push(s) - 1),
    col = (i) => String.fromCharCode(65 + i),
    hoja = filas
      .map(
        (fila, r) =>
          '<row r="' + (r + 1) + '">' +
          fila
            .map((v, c) =>
              typeof v === "number"
                ? '<c r="' + col(c) + (r + 1) + '"><v>' + v + "</v></c>"
                : '<c r="' + col(c) + (r + 1) + '" t="s"><v>' + ix(v) + "</v></c>",
            )
            .join("") +
          "</row>",
      )
      .join("");
  return zip([
    ["[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>'],
    [
      "xl/sharedStrings.xml",
      '<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        textos.map((t) => "<si><t>" + escXml(t) + "</t></si>").join("") +
        "</sst>",
    ],
    [
      "xl/worksheets/sheet1.xml",
      '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' +
        hoja +
        "</sheetData></worksheet>",
    ],
  ]);
}
