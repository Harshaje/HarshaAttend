const CACHE_NAME = 'student-attendance-pwa-v1';
const APP_SHELL = ['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(caches.match(req).then(cached => {
    if (cached) return cached;
    return fetch(req).then(response => {
      if (response && (response.ok || response.type === 'opaque')) {
        const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(()=>{});
      }
      return response;
    }).catch(() => {
      if (req.mode === 'navigate') return caches.match('./index.html');
      return new Response('Offline: this resource has not been cached yet.', {status: 503, headers:{'Content-Type':'text/plain'}});
    });
  }));
});
