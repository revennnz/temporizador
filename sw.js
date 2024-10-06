importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

// Verifica que Workbox esté disponible
if (workbox) {
  console.log('Workbox cargado correctamente');

  // Precaching de toda la página: `/`, etc.
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '4' },  // Cambia la revisión al modificar el archivo
    { url: 'manifest.json', revision: '1' },
    // Agrega aquí más archivos si los tienes, pero solo si son archivos estáticos, como iconos, logos, etc.
    // { url: '/styles.css', revision: '1' },
    // { url: '/scripts.js', revision: '1' },
  ]);

  // Auto-sincronización del SW: Activar el nuevo SW inmediatamente después de instalarlo
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Cacheo de imágenes con la estrategia Cache First (prioriza el caché, si no existe, va a la red)
  workbox.routing.registerRoute(
    new RegExp('.*\\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,  // Limita a 50 imágenes en caché
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cachea por 30 días
        }),
      ],
    })
  );

} else {
  console.log('Workbox no se cargó correctamente');
}
