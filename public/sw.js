const CACHE_NAME='dolarcentral',
urlsToCache=[
    './index.css',
    './app.js',
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
]

//instalar la applicacion
self.addEventListener('install', e=>{
e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache=>{
        return cache.addAll(urlsToCache)
        .then(()=>self.skipWaiting())
    })
    .catch(err=>console.log('fallo el registro de cache',err))
    )
});

//HACE FUNCIONAR LA APPLICACION SIN INTERNET
self.addEventListener('activate', e=>{
const cacheWhitelist = [CACHE_NAME]
e.waitUntil(
    caches.keys()
    .then(cachesName => {
        cachesName.map(cacheName=>{
            if(cacheWhitelist.indexOf(cacheName)===-1){
            return caches.delete(cacheName)
        }
        })
    })
    .then(()=>self.clients.claim())
)
});

self.addEventListener('fetch', e=>{
e.respondWith(
    caches.match(e.request)
    .then(res=>{
     if(res){
        return res
        }
    return fetch(e.request)
    })
    )
});

