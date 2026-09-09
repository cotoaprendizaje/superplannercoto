// Dónde está Chromium, según dónde se corran las pruebas.
//
// En esta máquina de desarrollo viene preinstalado en /opt/pw-browsers; en
// GitHub Actions lo baja `npx playwright install` a su carpeta propia. Con la
// ruta escrita a mano, las pruebas andaban acá y fallaban allá — que es la
// forma más segura de que nadie las corra.

import { existsSync } from "node:fs";

const PREINSTALADO = "/opt/pw-browsers/chromium";

export function rutaChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  if (existsSync(PREINSTALADO)) return PREINSTALADO;
  // undefined = que Playwright use el navegador que se bajó él mismo.
  return undefined;
}
