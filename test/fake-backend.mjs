// Backend de mentira que imita la fila de Supabase donde vive el planner.
// Sirve además los archivos del repo, para poder abrir la app de verdad.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, normalize } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

export function startFakeBackend(port = 8099) {
  // Filas por id, como en Supabase de verdad: la app ahora guarda Seguimiento
  // técnico en su propia fila ("coto-tecnico") separada de la del tablero
  // ("coto"), así que este mock ya no puede asumir una sola fila global.
  const rows = new Map();
  let writes = 0;
  // Cuentas de mentira para probar el ingreso. La app ya no entra con un
  // nombre: pide mail y contraseña contra /auth/v1/token, igual que Supabase.
  const CLAVE_OK = "Cotonetes2026";
  let vidaToken = 3600; // segundos; bajarlo sirve para probar la renovación
  let exigirSesion = false; // simula la base cerrada por las políticas RLS
  let tokens = new Map(); // token -> email
  const nuevoToken = (email, tipo) => {
    const t = tipo + "-" + Math.random().toString(36).slice(2) + "-" + encodeURIComponent(email);
    return (tokens.set(t, email), t);
  };
  const sesionDe = (req) => {
    const auth = String(req.headers.authorization || "").replace(/^Bearer /, "");
    return tokens.get(auth) || null;
  };

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");

    // Ingreso y renovación, como los endpoints de Supabase Auth.
    if (url.pathname === "/auth/v1/token") {
      res.setHeader("Content-Type", "application/json");
      let body = "";
      req.on("data", (c) => (body += c));
      return req.on("end", () => {
        const datos = JSON.parse(body || "{}"),
          tipo = url.searchParams.get("grant_type");
        let email = null;
        if (tipo === "refresh_token") email = tokens.get(datos.refresh_token) || null;
        else if (datos.password === CLAVE_OK) email = String(datos.email || "").toLowerCase();
        if (!email) {
          ((res.statusCode = 400),
            res.end(JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" })));
          return;
        }
        res.end(
          JSON.stringify({
            access_token: nuevoToken(email, "acc"),
            refresh_token: nuevoToken(email, "ref"),
            expires_in: vidaToken,
            user: { email },
          }),
        );
      });
    }

    if (url.pathname.startsWith("/rest/v1/")) {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/json");
      // Con la base cerrada, sin sesión válida no se contesta nada. Es lo que
      // hacen las políticas RLS del proyecto real.
      if (exigirSesion && !sesionDe(req)) {
        ((res.statusCode = 401), res.end(JSON.stringify({ message: "JWT expired" })));
        return;
      }
      if (req.method === "GET") {
        const id = url.searchParams.get("id")?.replace(/^eq\./, "");
        const row = id ? rows.get(id) : null;
        // PostgREST sabe devolver una sola clave del JSON ("select=data->>rev")
        // en vez de la columna entera. La app se apoya en eso para preguntar
        // "¿cambió algo?" gastando unos pocos bytes en vez de bajar todo el
        // documento, así que el mock tiene que respetarlo o la prueba de
        // consumo mide cualquier cosa.
        const select = url.searchParams.get("select") || "data";
        const m = /^data->>?(.+)$/.exec(select);
        if (m) {
          const clave = m[1];
          return res.end(JSON.stringify(row ? [{ [clave]: row[clave] ?? null }] : []));
        }
        return res.end(JSON.stringify(row ? [{ data: row }] : []));
      }
      if (req.method === "POST") {
        let body = "";
        req.on("data", (c) => (body += c));
        return req.on("end", () => {
          const parsed = JSON.parse(body);
          (rows.set(parsed.id, parsed.data), writes++, (res.statusCode = 201), res.end("{}"));
        });
      }
    }

    if (url.pathname === "/__state") {
      res.setHeader("Content-Type", "application/json");
      const id = url.searchParams.get("id") || "coto";
      const row = rows.get(id);
      return res.end(
        JSON.stringify({
          writes,
          cards: (row?.cards || []).map((c) => ({ id: c.id, titulo: c.titulo, updatedAt: c.updatedAt })),
          deleted: row?.deleted || {},
        }),
      );
    }

    if (url.pathname === "/__reset") {
      (rows.clear(), (writes = 0));
      return res.end("ok");
    }

    const rel = normalize(url.pathname === "/" ? "/index.html" : url.pathname).replace(/^(\.\.[/\\])+/, "");
    try {
      const file = join(ROOT, rel);
      const body = await readFile(file);
      const ext = rel.slice(rel.lastIndexOf("."));
      (res.setHeader("Content-Type", TYPES[ext] || "application/octet-stream"), res.end(body));
    } catch {
      ((res.statusCode = 404), res.end("no está"));
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () =>
      resolve({
        url: `http://localhost:${port}`,
        state: async () => (await fetch(`http://localhost:${port}/__state`)).json(),
        reset: () => fetch(`http://localhost:${port}/__reset`),
        clave: CLAVE_OK,
        // Interruptores para las pruebas: cerrar la base, acortar la vida del
        // token, o invalidar todas las sesiones de golpe.
        exigirSesion: (flag) => (exigirSesion = flag !== false),
        vidaToken: (seg) => (vidaToken = seg),
        vencerTodo: () => tokens.clear(),
        stop: () => new Promise((r) => server.close(r)),
      }),
    );
  });
}
