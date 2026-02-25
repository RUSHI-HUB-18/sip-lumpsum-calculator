// Rushi Finance Tools — Service Worker for PWA
const CACHE_NAME = 'rushi-finance-v2';
const ASSETS = [
    './',
    './index.html',
    './sip.html',
    './lumpsum.html',
    './emi.html',
    './goal.html',
    './retirement.html',
    './tax.html',
    './fdrd.html',
    './ai.html',
    './about.html',
    './dashboard.html',
    './styles.css',
    './app.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
];

// Install — cache all assets
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS).catch(err => {
                console.warn('SW: Some assets failed to cache:', err);
                // Cache what we can
                return Promise.allSettled(ASSETS.map(url =>
                    cache.add(url).catch(() => console.warn('Failed:', url))
                ));
            });
        })
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — network-first for API calls, cache-first for assets
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Skip caching for API calls and external requests
    if (url.hostname === 'generativelanguage.googleapis.com' ||
        e.request.method !== 'GET') {
        return;
    }

    // Cache-first for local assets, network-first for CDN
    if (url.origin === location.origin) {
        e.respondWith(
            caches.match(e.request).then(cached => {
                const fetchPromise = fetch(e.request).then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                    }
                    return response;
                }).catch(() => cached);
                return cached || fetchPromise;
            })
        );
    }
});
