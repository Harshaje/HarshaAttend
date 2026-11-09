// Offline service worker for GitHub Pages: https://harshaje.github.io/HarshaAttend/
const CACHE_NAME = 'harsha-attendance-offline-v3';
const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// External libraries used by index.html. Cache them during installation too,
// because the first page load happens before the service worker controls it.
const CDN_FILES = [
  'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Cache local files individually so one missing optional file does not
    // prevent the entire service worker from installing.
    for (const path of APP_SHELL) {
      try {
        const response = await fetch(path, { cache: 'reload' });
        if (response.ok) await cache.put(new URL(path, self.registration.scope), response);
        else console.warn('[SW] Local file not cached:', path, response.status);
      } catch (error) {
        console.warn('[SW] Failed to cache local file:', path, error);
      }
    }

    // CDN responses are cross-origin opaque. Cache.put supports opaque
    // responses; these are needed for QR, Excel and PDF functions offline.
    for (const url of CDN_FILES) {
      try {
        const response = await fetch(url, { mode: 'no-cors', cache: 'reload' });
        if (response) await cache.put(url, response);
      } catch (error) {
        console.warn('[SW] CDN library not cached (check internet):', url, error);
      }
    }

    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith('harsha-attendance-offline-') && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        const offlinePage = await cache.match(new URL('./index.html', self.registration.scope).href);
        if (offlinePage) return offlinePage;
      }
      return new Response('Offline: this file has not been cached yet. Connect to internet once and reload.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
