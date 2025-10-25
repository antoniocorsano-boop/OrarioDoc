// minimal service worker - cache shell
const CACHE = 'orariodoc-shell-v1';
const SHELL = ['/', '/index.html', '/style.css', '/src/main.js', '/src/storage.js', '/src/schedule-grid.js', '/manifest.json'];
self.addEventListener('install', ev => { ev.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', ev => { ev.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', ev => {
  ev.respondWith(caches.match(ev.request).then(r=>r || fetch(ev.request)));
});
