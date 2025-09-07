const CACHE_NAME = 'clover-view-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/scripts/critical.js',
  '/terms.html',
  '/privacy.html',
  '/cookies.html',
  '/favicon.svg',
  '/images/Garden-turfing.webp',
  '/images/Green-Retreats-Garden-Studi.webp',
  '/images/decking.webp',
  '/images/overgrown.webp',
  '/images/rough_looking_garden.webp'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
