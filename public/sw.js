// Cache-first for Pyodide CDN assets and same-origin files; network-first for the HTML.
const CACHE = 'regression-deck-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const cdn = url.hostname === 'cdn.jsdelivr.net' && url.pathname.startsWith('/pyodide/');
  if (!cdn && url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { put(req, res.clone()); return res; }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) put(req, res.clone()); return res; })));
});

function put(req, res) {
  caches.open(CACHE).then((c) => c.put(req, res));
}
