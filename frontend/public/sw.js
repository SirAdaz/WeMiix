const CACHE_NAME = "wemiix-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ne pas intercepter les requêtes API / WebSocket
  if (
    request.url.includes("/api/") ||
    request.url.startsWith("ws") ||
    request.method !== "GET"
  ) {
    return;
  }

  // Network-first pour les pages, Cache-first pour les assets statiques
  const isPage = request.mode === "navigate";

  if (isPage) {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((r) => r ?? caches.match("/"))
      )
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  }
});
