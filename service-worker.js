
const CACHE_NAME = 'harsha-attendance-v4';

const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) =>
            key.startsWith('harsha-attendance-') &&
            key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Do not intercept requests to other websites.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // When offline, serve the cached app page first.
      if (request.mode === 'navigate') {
        try {
          return await fetch(request);
        } catch (error) {
          return await cache.match('./index.html') ||
            new Response('Offline page not cached. Connect and reload.', {
              status: 503
            });
        }
      }

      const cached = await cache.match(request);

      if (cached) return cached;

      try {
        return await fetch(request);
      } catch (error) {
        return new Response('Offline: file not cached.', {
          status: 503
        });
      }
    })()
  );
});
