/* ══════════════════════════════════════════════════════════
   دوروز أكاديمي — Service Worker
   يتيح التثبيت كتطبيق (PWA) وتخزين الملفات الأساسية
══════════════════════════════════════════════════════════ */

const CACHE_NAME   = 'doroz-v1';
const STATIC_CACHE = 'doroz-static-v1';

// الملفات التي تُخزَّن محلياً
const STATIC_FILES = [
  './index.html',
  './app.js',
  './style.css',
  './manifest.json'
];

// ── Install: cache الملفات الأساسية ──
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache){
      return cache.addAll(STATIC_FILES).catch(function(err){
        console.warn('[SW] Cache install error:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── Activate: حذف الكاشات القديمة ──
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== STATIC_CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: Network-first للـ API، Cache-first للملفات الثابتة ──
self.addEventListener('fetch', function(e){
  var url = e.request.url;

  // لا تتدخل في طلبات Supabase / خارجية
  if(url.includes('supabase.co') || url.includes('fonts.googleapis') || 
     url.includes('ibb.co') || url.startsWith('chrome-extension')){
    return;
  }

  // للملفات الثابتة: Cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached){
      if(cached) return cached;
      return fetch(e.request).then(function(response){
        // Cache الملفات الجديدة الناجحة
        if(response && response.status === 200 && response.type === 'basic'){
          var clone = response.clone();
          caches.open(STATIC_CACHE).then(function(cache){
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function(){
        // Offline fallback
        if(e.request.destination === 'document'){
          return caches.match('./index.html');
        }
      });
    })
  );
});