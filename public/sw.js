const cacheName = "diario-plantas-shell-v4";
const shell = ["./", "./index.html", "./style.css", "./app.js", "./firebase-settings.js", "./messages.js"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shell)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(names => Promise.all(
    names.filter(name => name.startsWith("diario-plantas-shell-") && name !== cacheName)
      .map(name => caches.delete(name)),
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin ||
      !shell.some(path => new URL(path, self.location.href).pathname === url.pathname) &&
      !["firebase-engine.js", "firebase-settings.local.js", "motion.js"].includes(url.pathname.split("/").pop())) return;
  event.respondWith(fetch(event.request).then(async response => {
    if (response.ok) {
      try {
        const cache = await caches.open(cacheName);
        await cache.put(event.request, response.clone());
      } catch {
        // Storage can be unavailable in some browser profiles.
      }
    }
    return response;
  }).catch(async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    if (event.request.mode === "navigate") return (await caches.match("./")) ?? Response.error();
    return Response.error();
  }));
});
