// ============================================================
// PHONEPHIX GAMES - Service Worker
// ============================================================

const CACHE_NAME = 'phonephix-games-v1.0.0';
const STATIC_CACHE = 'phonephix-static-v1';
const DYNAMIC_CACHE = 'phonephix-dynamic-v1';

// Files to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // Icons
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192-maskable.png',
  
  // Font Awesome CDN
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  
  // Firebase SDKs
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js'
];

// ============================================================
// INSTALL EVENT - Cache static assets
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install complete!');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// ============================================================
// ACTIVATE EVENT - Clean old caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated!');
        return self.clients.claim();
      })
  );
});

// ============================================================
// FETCH EVENT - Serve from cache or network
// ============================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests except CDNs and Firebase storage/images
  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('cdnjs.cloudflare.com') || 
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('firebase') ||
        url.hostname.includes('firebasestorage.googleapis.com')) {
      
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then((response) => {
                const clonedResponse = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, clonedResponse);
                  });
                return response;
              });
          })
          .catch(() => {
            return new Response('Network error', { status: 503 });
          })
      );
      return;
    }
    event.respondWith(fetch(request));
    return;
  }
  
  // For same-origin requests
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          event.waitUntil(
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                      cache.put(request, networkResponse.clone());
                    });
                }
              })
              .catch(() => {})
          );
          return cachedResponse;
        }
        
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clonedResponse = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, clonedResponse);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// ============================================================
// PUSH NOTIFICATIONS
// ============================================================
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update available!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192-maskable.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'PHONEPHIX GAMES',
      options
    )
  );
});

// ============================================================
// NOTIFICATION CLICK
// ============================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

console.log('[Service Worker] Loaded successfully!');

