/* Service worker du calepin : tout est mis en cache, l'app fonctionne hors connexion. */
const VERSION = '5e50f72883fc'
const CACHE = `calepin-${VERSION}`
const FICHIERS = ["./","assets/index-D76k5FX3.css","assets/index-DnKrcC9z.js","icones/apple-touch-icon.png","icones/icone-192.png","icones/icone-512.png","icones/icone-maskable-512.png","manifest.webmanifest","robots.txt"]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((k) => k.startsWith('calepin-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

self.addEventListener('message', (e) => {
  if (e.data === 'activer') self.skipWaiting()
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  if (req.url.endsWith('version.json')) return // toujours depuis le réseau
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === 'navigate' ? caches.match('./') : null) || fetch(req))
  )
})
