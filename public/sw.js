self.importScripts()

const CACHE = "calorias-v2"

const BASE = "/calorie_counter"

const assets = [
  `${BASE}/`,
  `${BASE}/manifest.json`,
  `${BASE}/icon-192.png`,
  `${BASE}/icon-512.png`,
]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(assets))
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  if (event.request.url.includes("googleapis.com")) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request).then((r) => r || fetch(event.request)))
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => clients.claim())
  )
})
