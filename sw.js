const CACHE = 'lector-zona-v3';
const ASSETS = ['./', './index.html', './manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.hostname !== self.location.hostname){ e.respondWith(fetch(e.request)); return; }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => {
    const clone=r.clone(); caches.open(CACHE).then(cache=>cache.put(e.request,clone)); return r;
  })));
});
