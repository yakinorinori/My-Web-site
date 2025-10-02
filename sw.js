const CACHE_NAME = 'sales-report-v1';
const urlsToCache = [
  '/mobile.html',
  '/js/mobile.js',
  '/style.css',
  '/manifest.json'
];

// インストール時のキャッシュ処理
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('キャッシュを開きました');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時のキャッシュ利用
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュがある場合はキャッシュから返す
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// キャッシュの更新処理
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});