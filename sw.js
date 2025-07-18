// A unique name for the cache - update this version when you deploy changes
const CACHE_NAME = 'focusflow-cache-v1.1.0';

// List of local files to cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/output.css',
    '/assets/fonts/inter.css',
    '/js/app.js',
    '/js/module-loader.js',
    '/js/env-loader.js',
    '/modules/navigation.html',
    '/modules/timer.html',
    '/modules/task-management.html',
    '/modules/credits-perks.html',
    '/modules/modals.html',
    // Add all local font files
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZJhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZthiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZNhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZxhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZBhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZFhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZJhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZthiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZNhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZxhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZBhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZFhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZJhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZthiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZNhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZxhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZBhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZFhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiA.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZJhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZthiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZNhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZxhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZBhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZFhiI2B.woff2',
    '/assets/fonts/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2',
    // Icons
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/icon-72x72.png',
    '/icon-96x96.png',
    '/icon-128x128.png',
    '/icon-144x144.png',
    '/icon-152x152.png',
    '/icon-192x192.png',
    '/icon-384x384.png',
    '/icon-512x512.png'
];

// Install event: fires when the service worker is first installed.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('Service Worker: Caching Files');
            // Use a Set to avoid duplicates and filter out any undefined/null paths
            const uniqueUrls = [...new Set(urlsToCache.filter(url => url))];
            return cache.addAll(uniqueUrls).catch(err => {
                console.error('Service Worker: Failed to cache', err);
            });
        })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

// Fetch event: fires for every network request.
self.addEventListener('fetch', event => {
    // We only want to handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For local assets, use a "cache first" strategy.
    // For external assets (if any), use a "network first" strategy.
    const isLocalAsset = urlsToCache.some(url => event.request.url.endsWith(url));

    if (isLocalAsset) {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                // Cache hit - return the response from the cache
                if (response) {
                    return response;
                }
                // Not in cache, fetch from network, then cache it
                return fetch(event.request).then(
                    networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    }
                ).catch(error => {
                    console.error('Service Worker: Fetch failed for', event.request.url, error);
                    // You could return a fallback page here if needed
                });
            })
        );
    }
    // For non-local assets, you might want a different strategy or just let them be fetched normally.
});

// Activate event: fires when the service worker is activated.
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Delete old caches
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Listen for messages from the main app
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
