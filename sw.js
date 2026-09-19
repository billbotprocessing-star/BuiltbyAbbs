// BuiltbyAbbs service worker: makes the app installable and lets the shell open offline.
// Data calls (Supabase, n8n, USDA) always go straight to the network and are never cached.
const CACHE = 'abbs-shell-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const STATIC_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Same-origin (the app itself): network first so updates show up, cache as the offline fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
    );
    return;
  }

  // Library and font files: serve from cache instantly, refresh in the background
  if (STATIC_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = fetch(req)
          .then((res) => { caches.open(CACHE).then((c) => c.put(req, res.clone())); return res; })
          .catch(() => hit);
        return hit || refresh;
      })
    );
  }
  // Everything else (Supabase, n8n, USDA) is not intercepted.
});
