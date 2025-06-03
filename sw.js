// Service Worker for Jekyll Guitar Chord Website
const CACHE_NAME = 'rumusmusic-v1';
const urlsToCache = [
  '/',
  '/assets/css/optimized-styles.css',
  '/assets/js/optimized-main.js',
  '/assets/js/main.js',
  '/assets/js/search.js',
  '/assets/js/transpose.js',
  '/chords/',
  '/category/'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});