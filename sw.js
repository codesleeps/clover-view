// Service Worker v3 - force fresh HTML and robust caching
const CACHE_NAME = 'clover-view-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/Garden-turfing.webp',
  '/images/Green-Retreats-Garden-Studi.webp',
  '/images/decking.webp',
  '/images/overgrown.webp',
  '/images/power-washing-wooden-deck-1.webp',
  '/images/rough_looking_garden.webp'
];

// Add pageshow event listener for bfcache
self.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Page was restored from bfcache
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({type: 'BFCACHE_RESTORE'});
      });
    });
  }
});

self.addEventListener('install', (event) => {
  // Install new cache and activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean old caches and take control of clients right away
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Network-first for HTML to prevent stale pages (fixes leaked CSS from cached HTML)
  const accept = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || (req.method === 'GET' && accept.includes('text/html'))) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Cache-first for other GET requests (CSS/JS/images)
  if (req.method === 'GET') {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirst(request) {
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    // Only cache successful same-origin responses
    if (fresh && fresh.ok && fresh.type === 'basic') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (err) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    // As a last resort, try the root fallback if available
    return caches.match('index.html');
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Only cache successful same-origin responses
    if (response && response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // On failure, return nothing (let the browser handle)
    return new Response('', { status: 504, statusText: 'Gateway Timeout' });
  }
}
