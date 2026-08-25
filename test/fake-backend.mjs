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
  let row = null;
  let writes = 0;

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");

    if (url.pathname.startsWith("/rest/v1/")) {
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/json");
      if (req.method === "GET") return res.end(JSON.stringify(row ? [{ data: row }] : []));
      if (req.method === "POST") {
        let body = "";
        req.on("data", (c) => (body += c));
        return req.on("end", () => {
          ((row = JSON.parse(body).data), writes++, (res.statusCode = 201), res.end("{}"));
        });
      }
    }

    if (url.pathname === "/__state") {
      res.setHeader("Content-Type", "application/json");
      return res.end(
        JSON.stringify({
          writes,
          cards: (row?.cards || []).map((c) => ({ id: c.id, titulo: c.titulo, updatedAt: c.updatedAt })),
          deleted: row?.deleted || {},
        }),
      );
    }

    if (url.pathname === "/__reset") {
      ((row = null), (writes = 0));
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
        stop: () => new Promise((r) => server.close(r)),
      }),
    );
  });
}
