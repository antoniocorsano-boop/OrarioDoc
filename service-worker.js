// Service Worker ottimizzato per performance - Subtask 9
const CACHE_VERSION = 'v4';
const STATIC_CACHE = 'orariodoc-static-' + CACHE_VERSION;
const DYNAMIC_CACHE = 'orariodoc-dynamic-' + CACHE_VERSION;

// Static assets da cachare durante install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/theme.css',
  '/src/main.js',
  '/src/storage.js',
  '/src/schedule-grid.js',
  '/src/settings.js',
  '/src/utils/theme.js',
  '/src/utils/toast.js',
  '/src/storage/indexeddb.js',
  '/src/screens/settings-screen.js',
  '/src/components/button.css',
  '/src/components/card.css',
  '/manifest.json'
];

// Installazione: pre-cache degli asset statici
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Attivazione: pulizia cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Strategia di caching
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests (fonts, etc.)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Cache-first strategy per asset statici
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.pathname.startsWith('/src/') || 
      url.pathname.endsWith('.css') || 
      url.pathname.endsWith('.js')) {
    
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) {
            return cached;
          }
          return fetch(request).then(response => {
            // Cache la risposta per richieste future
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Fallback offline per HTML
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
    return;
  }
  
  // Network-first per tutto il resto (dati dinamici)
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback alla cache se offline
        return caches.match(request);
      })
  );
});
