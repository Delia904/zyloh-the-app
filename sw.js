const CACHE = 'zyloh-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'vendor/tailwind/tailwind.js',
  'vendor/chart/chart.umd.min.js',
  'vendor/fa/css/all.min.css',
  'vendor/fa/webfonts/fa-solid-900.woff2',
  'vendor/fa/webfonts/fa-regular-400.woff2',
  'vendor/fa/webfonts/fa-brands-400.woff2',
  'vendor/fa/webfonts/fa-solid-900.ttf',
  'vendor/fa/webfonts/fa-regular-400.ttf',
  'vendor/fa/webfonts/fa-brands-400.ttf',
  'vendor/fonts/inter.css',
  'vendor/fonts/inter-1.woff2',
  'vendor/fonts/inter-2.woff2',
  'vendor/fonts/inter-3.woff2',
  'vendor/fonts/inter-4.woff2',
  'vendor/fonts/inter-5.woff2',
  'vendor/fonts/inter-6.woff2',
  'vendor/fonts/inter-7.woff2'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('index.html'));
    })
  );
});
