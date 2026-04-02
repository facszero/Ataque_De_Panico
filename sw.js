// Service Worker — Ataque De Pánico PWA
const CACHE = 'ataque-panico-v1';
const ASSETS = [
  '/Ataque_De_Panico/',
  '/Ataque_De_Panico/index.html',
  '/Ataque_De_Panico/manifest.json',
  '/Ataque_De_Panico/img/level0.png',
  '/Ataque_De_Panico/img/level1.png',
  '/Ataque_De_Panico/img/level2.png',
  '/Ataque_De_Panico/img/sprites/drone.png',
  '/Ataque_De_Panico/img/sprites/drone_fast.png',
  '/Ataque_De_Panico/img/sprites/tripod.png',
  '/Ataque_De_Panico/img/sprites/artillery.png',
  '/Ataque_De_Panico/img/sprites/artillery_sp.png',
  '/Ataque_De_Panico/img/sprites/miniboss.png',
  '/Ataque_De_Panico/img/sprites/boss_nodriza.png',
  '/Ataque_De_Panico/img/sprites/boss_robot.png',
  '/Ataque_De_Panico/img/sprites/boss_acorazado.png',
  '/Ataque_De_Panico/icons/icon-192x192.png',
  '/Ataque_De_Panico/icons/icon-512x512.png'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match('/Ataque_De_Panico/index.html'));
    })
  );
});
