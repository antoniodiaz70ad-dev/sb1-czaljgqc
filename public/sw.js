/*
 * Service worker del Protocolo del Observador.
 * El objetivo es uno: que la ficha y el corredor abran sin señal.
 */
const CACHE = 'observador-v1';
const BASICOS = ['/', '/index.html', '/manifest.webmanifest', '/icono.svg', '/icono-192.png'];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(BASICOS))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((llaves) => Promise.all(llaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request;
  if (peticion.method !== 'GET') return;

  const url = new URL(peticion.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: red primero, caché como respaldo sin señal.
  if (peticion.mode === 'navigate') {
    evento.respondWith(
      fetch(peticion)
        .then((respuesta) => {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copia));
          return respuesta;
        })
        .catch(() => caches.match('/index.html').then((r) => r ?? Response.error())),
    );
    return;
  }

  // Recursos: caché primero; los nombres de Vite llevan hash, no se quedan viejos.
  evento.respondWith(
    caches.match(peticion).then(
      (guardado) =>
        guardado ??
        fetch(peticion).then((respuesta) => {
          if (respuesta.ok && respuesta.type === 'basic') {
            const copia = respuesta.clone();
            caches.open(CACHE).then((c) => c.put(peticion, copia));
          }
          return respuesta;
        }),
    ),
  );
});
