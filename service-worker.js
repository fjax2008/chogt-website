// Service Worker for 鹏哥翻译 PWA
const CACHE_NAME = 'pengge-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/favicon.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/pwa-192.png',
    '/pwa-512.png',
    '/manifest.json',
    '/og-image.jpg'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - stale-while-revalidate for static, network-only for API
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and API calls
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) {
        // API calls: network only (Vercel serverless)
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetched = fetch(event.request).then((response) => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            });

            return cached || fetched;
        })
    );
});
