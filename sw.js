// Service Worker for Phidel's Portfolio
const CACHE_NAME = 'phidel-portfolio-v7';
const urlsToCache = [
  './',
  './index.html',
  './resume.html',
  './terms.html',
  './privacy.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './favicon-192.png',
  './tariq2.webp',
  './portfolio-preview.webp',
  './marion-preview.svg',
  './birthday-preview.svg',
  './og-image.png',
  './robots.txt',
  './sitemap.xml'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});
