// يشتغل من غير نت: بيحفظ ملفات اللعبة أول مرة. غيّر VERSION مع كل تحديث.
const VERSION = 'fares-v5';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'vendor/phaser.min.js', 'js/main.js?v=5', 'js/art.js', 'js/sys.js', 'js/scenes.js', 'js/voice.js', 'js/islands.js',
  'assets/icon-192.png', 'assets/icon-512.png',
  ...['400', '700', '800'].flatMap(w => [`assets/fonts/cairo-arabic-${w}-normal.woff2`, `assets/fonts/cairo-latin-${w}-normal.woff2`])];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// الشبكة الأول (عشان التحديثات توصل)، ولو مفيش نت من المحفوظ
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
