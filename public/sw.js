/* Service worker: cache-first agar game bisa dimainkan offline. */
// Naikkan versi ini setiap kali isi /assets berubah, kalau tidak pengguna lama
// akan terus melihat versi lama (cache-first).
const CACHE = "mandarin-v16";
const ASSETS = [
  "/",
  "/index.html",
  "/admin.html",
  "/config.json",
  "/assets/css/style.css",
  "/assets/css/admin.css",
  "/assets/js/config.js",
  "/assets/js/data.js",
  "/assets/js/app.js",
  "/assets/js/admin.js",
  "/assets/icon.svg",
  "/assets/icons/icon-16.png",
  "/assets/icons/icon-32.png",
  "/assets/icons/icon-48.png",
  "/assets/icons/icon-72.png",
  "/assets/icons/icon-96.png",
  "/assets/icons/icon-128.png",
  "/assets/icons/icon-144.png",
  "/assets/icons/icon-152.png",
  "/assets/icons/icon-167.png",
  "/assets/icons/icon-180.png",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-384.png",
  "/assets/icons/icon-512.png",
  "/assets/icons/maskable-192.png",
  "/assets/icons/maskable-512.png",
  "/assets/icons/apple-touch-icon.png",
  "/manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // config.json: jaringan-dulu agar perubahan branding cepat tersebar; cache
  // hanya dipakai sebagai cadangan saat offline.
  if (new URL(e.request.url).pathname.endsWith("/config.json")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Sisanya cache-dulu agar cepat & bisa offline.
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit ||
      fetch(e.request)
        .then((res) => {
          if (res.ok && new URL(e.request.url).origin === location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match("/index.html"))
    )
  );
});
