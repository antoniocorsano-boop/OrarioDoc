// minimal service worker - cache shell
const CACHE = 'orariodoc-shell-v3-subtask4';
const SHELL = ['/', '/index.html', '/style.css', '/theme.css', '/src/main.js', '/src/storage.js', '/src/schedule-grid.js', '/src/settings.js', '/src/utils/theme.js', '/src/utils/toast.js', '/src/storage/indexeddb.js', '/manifest.json'];
self.addEventListener('install', ev => { 
  ev.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(SHELL))
  ); 
  self.skipWaiting(); 
});
self.addEventListener('activate', ev => { 
  ev.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', ev => {
  ev.respondWith(caches.match(ev.request).then(r=>r || fetch(ev.request)));
});
