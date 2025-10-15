const CACHE_NAME = 'my-app-cache-v2';
const OFFLINE_URL = '/offline.html';

// INSTALAÇÃO (sem cache inicial)
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando...');
  self.skipWaiting(); // opcional: ativa imediatamente
});

// ATIVAÇÃO: limpeza de caches antigos
// self.addEventListener('activate', (event) => {
//   console.log('[SW] Ativando...');
//   event.waitUntil(
//     caches.keys().then((keyList) =>
//       Promise.all(
//         keyList.map((key) => {
//           if (key !== CACHE_NAME) {
//             console.log('[SW] Deletando cache antigo:', key);
//             return caches.delete(key);
//           }
//         })
//       )
//     )
//   );
//   return self.clients.claim();
// });

// FETCH: Cacheia ao navegar, usa cache se offline
// self.addEventListener('fetch', (event) => {
//   // if (event.request.method !== 'GET') return;

//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         // Armazena em cache se for HTML
//         if (event.request.headers.get('accept')?.includes('text/html')) {
//           const responseClone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseClone);
//           });
//         }
//         return response;
//       })
//       .catch(() => {
//         // Tenta servir do cache se offline
//         return caches.match(event.request).then((cachedResponse) => {
//           if (cachedResponse) return cachedResponse;

//           // Se navegação e sem cache, mostra offline.html
//           if (event.request.mode === 'navigate') {
//             return caches.match(OFFLINE_URL);
//           }
//         });
//       })
//   );
// });
