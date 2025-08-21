const CACHE_NAME = 'healthcare-dashboard-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_URLS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.url.includes('/baseR4/') || request.url.includes('/fhir/')) {
    // Cache FHIR API responses
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(cache =>
        cache.match(request).then(response => {
          if (response) {
            // Return cached response and update cache in background
            fetch(request).then(fetchResponse => {
              if (fetchResponse.ok) {
                cache.put(request, fetchResponse.clone());
              }
            });
            return response;
          }

          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                cache.put(request, fetchResponse.clone());
              }
              return fetchResponse;
            })
            .catch(() =>
              // If fetch fails, try to return stale cached response
              cache.match(request)
            );
        })
      )
    );
  } else if (
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    // Static assets with network-first strategy
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  } else {
    // Static assets with cache-first strategy
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
