/* cabecera-paneles.mjs — kit-base v1.9.125 (§7.74)
   ------------------------------------------------------------
   POR QUÉ EXISTE. El rediseño le dio a todos los paneles del kit la
   misma cabecera: una barra de 50px con el título a la izquierda y la ✕
   a la derecha, en la misma línea. Al llevar la FORMA de esa barra a los
   pop-ups de contenido, `.modal-hd` pasó a ser una columna (hay
   cabeceras de curso con una bajada arriba del título), y las reglas de
   los paneles no decían `flex-direction`: la heredaron. El instructivo
   "Cómo recorrer el curso" quedó con el título arriba y la ✕ abajo, en
   una barra del doble de alto. Ningún test lo vio — se vio en la foto.

   QUÉ HACE. Abre cada panel del kit que el curso tenga (índice,
   instructivo, glosario, recursos, logros, aviso de la práctica) y exige:
   barra de hasta 60px de alto, ✕ a la DERECHA del título y centrada con
   él en vertical (6px de tolerancia). */
import { chromium } from 'playwright-core';
import { report, requireUrl } from './_shared.mjs';

const url = requireUrl();
const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
const fallos = [];
const PANELES = ['sidenav', 'instrucciones', 'glosario', 'recursos', 'logros', 'practica-intro'];

for (const vp of [{ width: 1280, height: 760 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto(url);
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape').catch(() => {});
  for (const id of PANELES) {
    const r = await page.evaluate(async (id) => {
      const m = document.querySelector(`.modal[data-popup="${id}"]`);
      if (!m) return null;
      if (window.Popups && Popups.open) Popups.open(id); else m.classList.add('open');
      await new Promise((res) => setTimeout(res, 350));
      const hd = m.querySelector('.d-sidenav-hd, .modal-hd');
      const tit = hd && hd.querySelector('h2, h3, .d-fab-pop-title');
      const x = hd && hd.querySelector('.modal-x');
      if (!hd || !tit || !x) { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return { sin: true }; }
      const h = hd.getBoundingClientRect(), t = tit.getBoundingClientRect(), b = x.getBoundingClientRect();
      const out = { alto: Math.round(h.height), derecha: b.left >= t.right - 1, desfase: Math.round(Math.abs((t.top + t.height / 2) - (b.top + b.height / 2))), visible: h.height > 0 };
      if (window.Popups && Popups.close) Popups.close(id); else m.classList.remove('open');
      document.querySelectorAll('[data-popup-close]').forEach(() => {});
      await new Promise((res) => setTimeout(res, 150));
      return out;
    }, id);
    if (!r || r.sin || !r.visible) continue;
    const q = `[${vp.width}×${vp.height}] ${id}: `;
    if (r.alto > 60) fallos.push(q + `la cabecera mide ${r.alto}px (la barra del kit es de 50).`);
    if (!r.derecha) fallos.push(q + 'la ✕ no está a la derecha del título (quedaron apilados: ¿`.modal-hd` en columna?).');
    if (r.desfase > 6) fallos.push(q + `la ✕ y el título no están en la misma línea (${r.desfase}px de diferencia).`);
  }
  await page.close();
}

report('cabecera-paneles', fallos);
await browser.close();
