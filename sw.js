// Service Worker for /Purge
const CACHE_NAME = 'purge-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/games.html',
    '/themes.html',
    '/tools.html',
    '/roadmap.html',
    '/apps.html',
    '/styles.css',
    '/games.css',
    '/themes.css',
    '/tools.css',
    '/tab-manager.css',
    '/games.js',
    '/theme-manager.js',
    '/tab-manager.js',
    '/tools.js'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.error('Service Worker: Cache failed', err);
            })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event - Cache first strategy
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request).then((response) => {
                    // Don't cache non-GET requests or non-successful responses
                    if (event.request.method !== 'GET' || !response || response.status !== 200) {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return response;
                });
            })
            .catch(() => {
                // Return offline page if available
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});

