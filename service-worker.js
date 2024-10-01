const CACHE_NAME = 'gym-cache-v7'; 
const urlsToCache = [
  '',
  '/',
  'manifest.json', 
  'https://i.imgur.com/St2wFsJ.png' // Ícono de la app
];

// Instalación del Service Worker y almacenamiento en caché de los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar las solicitudes de red para devolver contenido de la caché
self.addEventListener('fetch', event => {
  // Solo almacenaremos en caché respuestas para solicitudes GET
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          // Clonamos la respuesta para que podamos almacenarla en caché
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            // Solo almacenamos respuestas de GET
            if (event.request.method === 'GET') {
              cache.put(event.request, responseClone);
            }
          });
          return networkResponse; // Retornamos la respuesta de la red
        });
      })
    );
  } else {
    // Para otros métodos (como POST), simplemente hacemos la solicitud
    event.respondWith(fetch(event.request));
  }
});

// Actualizar el caché cuando hay nuevos recursos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Notificar al cliente sobre la actualización del Service Worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
