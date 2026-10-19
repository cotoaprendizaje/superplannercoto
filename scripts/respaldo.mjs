// Respaldo semanal de la base, cifrado.
//
// El plan gratuito de Supabase no guarda copias: si la base se pierde, lo único
// que queda es un respaldo. Hasta ahora eso dependía de que alguien apretara
// «Bajar respaldo» — y un respaldo que depende de acordarse no existe. Esto lo
// corre GitHub Actions solo, una vez por semana (ver .github/workflows/respaldo.yml).
//
// Arma el mismo archivo que «Exportar JSON» de la app (tablero, portadas,
// Seguimiento técnico y Edu Point), así que se restaura desde Ajustes →
// Importar JSON como cualquier otro. Pero el repositorio es público y lo que
// queda guardado en Actions lo puede bajar cualquiera con cuenta de GitHub: por
// eso sale cifrado con una clave que solo tiene el equipo. La app lo reconoce y
// pide la clave al importarlo.
//
// El formato es el de `openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -md sha256`,
// así que también se abre sin la app:
//   openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -md sha256 -in respaldo.cifrado -out respaldo.json
//
// Entra a la base igual que una persona del equipo: con mail y contraseña de
// una cuenta propia del respaldo, y la base contesta por sus políticas de
// siempre. A propósito NO usa la clave sb_secret_…: esa saltea todas las
// políticas y no sale del panel de Supabase (ver SEGURIDAD.md).
//
// Necesita tres secretos (en GitHub: Settings → Secrets and variables → Actions):
//   RESPALDO_MAIL    mail de la cuenta del respaldo (creada en Supabase →
//                    Authentication → Users, como las del equipo).
//   RESPALDO_PASS    su contraseña.
//   RESPALDO_CLAVE   la clave con la que se cifra el archivo. Guardarla también
//                    en un lugar del equipo: sin ella el respaldo no se abre.

import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

export const ITER = 200000;

// La dirección del proyecto y la clave publishable se leen de la app misma,
// para que mudar de proyecto no deje al respaldo apuntando al viejo. La
// publishable es pública por diseño: viaja en la página.
const APP = readFileSync(new URL("../src/app.js", import.meta.url), "utf8"),
  URL_BASE = process.env.SUPABASE_URL || (APP.match(/supabaseUrl:\s*"([^"]+)"/) || [])[1],
  CLAVE_PUBLICA = (APP.match(/supabaseKey:\s*"([^"]+)"/) || [])[1],
  TABLA = "planner",
  FILA = "coto",
  MAIL = process.env.RESPALDO_MAIL || "",
  PASS = process.env.RESPALDO_PASS || "",
  CLAVE = process.env.RESPALDO_CLAVE || "",
  SALIDA = process.env.RESPALDO_DIR || "respaldo";

export function cifrar(texto, clave) {
  const sal = randomBytes(8),
    kiv = pbkdf2Sync(clave, sal, ITER, 48, "sha256"),
    c = createCipheriv("aes-256-cbc", kiv.subarray(0, 32), kiv.subarray(32));
  return Buffer.concat([Buffer.from("Salted__"), sal, c.update(texto, "utf8"), c.final()]);
}

async function entrar() {
  const r = await fetch(URL_BASE + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: { apikey: CLAVE_PUBLICA, "Content-Type": "application/json" },
      body: JSON.stringify({ email: MAIL, password: PASS }),
    }),
    j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token)
    throw new Error("No pude entrar con la cuenta del respaldo (" + (j.error_description || r.status) + ").");
  return j.access_token;
}

async function fila(id, token) {
  const r = await fetch(URL_BASE + "/rest/v1/" + TABLA + "?id=eq." + encodeURIComponent(id) + "&select=data", {
    headers: { apikey: CLAVE_PUBLICA, Authorization: "Bearer " + token },
  });
  if (!r.ok) throw new Error("Supabase contestó " + r.status + " al pedir la fila «" + id + "»");
  const j = await r.json();
  return j && j[0] ? j[0].data : null;
}

async function main() {
  if (!URL_BASE || !CLAVE_PUBLICA) throw new Error("No encontré supabaseUrl / supabaseKey en src/app.js.");
  if (!MAIL || !PASS) throw new Error("Faltan los secretos RESPALDO_MAIL y RESPALDO_PASS.");
  if (CLAVE.length < 12) throw new Error("Falta el secreto RESPALDO_CLAVE (mínimo 12 caracteres).");

  const token = await entrar(),
    [tablero, fotos, tec, edu] = await Promise.all(
      [FILA, FILA + "-fotos", FILA + "-tecnico", FILA + "-eduarchivo"].map((id) => fila(id, token)),
    );
  // Un respaldo vacío es peor que ninguno: tapa al último bueno y nadie se
  // entera. Si el tablero no vino, la corrida falla y GitHub manda el mail.
  if (!tablero || !Array.isArray(tablero.cards) || !tablero.cards.length)
    throw new Error("El tablero vino vacío: no se guarda un respaldo así.");

  const doc = {
    version: 1,
    exportado: new Date().toISOString(),
    origen: "respaldo automático semanal",
    cards: tablero.cards,
    templates: tablero.templates || {},
    sectores: tablero.sectores,
    team: tablero.team,
    agenda: tablero.agenda,
    cotofrase: tablero.cotofrase,
    fotos: (fotos && fotos.fotos) || {},
    tecnico: (tec && tec.tecnico) || [],
    eduArchivo: (edu && edu.eduArchivo) || [],
    moodle: (tec && tec.moodle) || null,
  };
  const texto = JSON.stringify(doc),
    dia = doc.exportado.slice(0, 10);
  mkdirSync(SALIDA, { recursive: true });
  writeFileSync(SALIDA + "/cotonetes-respaldo-" + dia + ".cifrado", cifrar(texto, CLAVE));
  console.log(
    "Respaldo " + dia + ": " + doc.cards.length + " tarjetas, " + Object.keys(doc.fotos).length + " portadas, " +
      doc.tecnico.length + " filas de Técnico, " + doc.eduArchivo.length + " de Edu Point · " +
      Math.round(texto.length / 1024) + " KB",
  );
}

if (import.meta.url === "file://" + process.argv[1])
  main().catch((e) => {
    console.error("✗ " + e.message);
    process.exit(1);
  });
