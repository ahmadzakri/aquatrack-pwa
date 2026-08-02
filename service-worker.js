// service-worker.js
// AquaTrack — Service Worker
// Handles: offline caching (app shell) + notification display

const CACHE_NAME = "aquatrack-cache-v2";

// App shell files to cache for offline-first behaviour.
// Add each new page here as pages/ get built out.
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/db.js",
  "./js/notifications.js",
  "./js/charts.js",
  "./js/googlefit.js",
  "./js/i18n.js"
];

// Install: pre-cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: clean up old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first, falling back to cache only when offline.
// (Cache-first was previously used, but that meant updated CSS/JS/HTML
// never reached returning visitors until the cache name changed —
// network-first keeps everyone on the latest deploy while still working
// offline via the cache fallback.)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Notification click: focus/open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow("./index.html");
    })
  );
});

// Placeholder for future push event (Advanced level — Firebase Cloud Messaging)
// self.addEventListener("push", (event) => { ... });
