// sw.js - Service Worker para Clippy Videos

const CACHE_NAME = 'clippy-videos-v1';
const STATIC_ASSETS = [
    '/',
    '/static/',
    '{{ static_url }}favicon.ico',
    '{{ static_url }}logo.png',
    '/login',
    '/sobre',
    // Adicione mais páginas importantes aqui
];

// Instalar o Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(STATIC_ASSETS);
            })
    );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Cache antigo removido:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Estratégia de Cache: Cache First, depois Network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se existir
                if (response) {
                    return response;
                }

                // Se não estiver em cache, busca na rede
                return fetch(event.request).then(networkResponse => {
                    // Só faz cache de respostas válidas
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return networkResponse;
                });
            })
            .catch(() => {
                // Offline fallback (opcional)
                if (event.request.destination === 'image') {
                    return caches.match('/static/default_thumb.jpg');
                }
                return new Response('Sem conexão', { status: 503 });
            })
    );
});