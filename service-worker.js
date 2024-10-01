const CACHE_NAME = 'gym-cache-v3'; 
const urlsToCache = [
  '',
  '/',
  'manifest.json', 
  'https://i.imgur.com/St2wFsJ.png'
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
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si hay una respuesta en caché, devuélvela; de lo contrario, haz la solicitud de red
      return response || fetch(event.request).then(networkResponse => {
        // Clona la respuesta porque se puede consumir solo una vez
        const responseClone = networkResponse.clone();
        // Abre el caché y almacena la respuesta en caché
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      });
    })
  );
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
