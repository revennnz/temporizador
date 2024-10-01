const CACHE_NAME = 'entrenamientos-cache-v1';
const urlsToCache = [
  '',
  '/',
  'manifest.json',
  'https://i.imgur.com/St2wFsJ.png', // Ícono de la app
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Archivos en caché durante la instalación:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache eliminada:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar las solicitudes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si hay respuesta en caché, devolverla
                if (response) {
                    return response;
                }
                // Si no hay respuesta en caché, realizar la solicitud a la red
                return fetch(event.request).then((response) => {
                    // Clonar la respuesta para poder almacenarla en caché
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
    );
});
