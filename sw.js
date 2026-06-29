/* Cotonetes Forever — service worker
   - Documento/HTML: network-first → siempre trae la última versión si hay red (cae a caché si estás offline).
   - Estáticos (fuentes, logos, iconos): cache-first (rápido; rara vez cambian).
   - Datos en vivo (*.supabase.co): siempre red, nunca caché.
   Subí una versión nueva del sitio y, al recargar, el HTML se actualiza solo. */
const CACHE = 'cotonetes-forever-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './assets/logo-coto.png', './assets/logo-aprendizaje.png',
  './assets/icon-192.png', './assets/icon-512.png',
  './assets/fonts/Faible-Black.woff2', './assets/fonts/Faible-Medium.woff2',
  './assets/fonts/Roboto-Bold.woff2', './assets/fonts/Roboto-Italic.woff2',
  './assets/fonts/Roboto-Medium.woff2', './assets/fonts/Roboto-Regular.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                        // no tocar POST/PATCH (Supabase escribe)
  const url = new URL(req.url);
  if (url.hostname.endsWith('supabase.co')) return;         // datos en vivo: siempre red
  const isDoc = req.mode === 'navigate' || req.destination === 'document' ||
                url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if (isDoc) {                                              // HTML: red primero, caché de respaldo (offline)
    e.respondWith(
      fetch(req).then(resp => {
        if (resp && resp.status === 200 && url.origin === self.location.origin) {
          const copy = resp.clone(); caches.open(CACHE).then(c => c.put(req, copy));
        }
        return resp;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  // Estáticos: caché primero
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(resp => {
      if (resp && resp.status === 200 && url.origin === self.location.origin) {
        const copy = resp.clone(); caches.open(CACHE).then(c => c.put(req, copy));
      }
      return resp;
    }).catch(() => undefined))
  );
});
