import {build, files, prerendered, version} from '$service-worker'

function installServiceWorker() {
    return caches.open('cache-' + version).then((cache) => {
        return cache.addAll([...files, ...build, ...prerendered]);
    }).then(() => { return self.skipWaiting()}).catch(err => console.log("err: ", err))
}

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    // Remove previous cached data from disk
    event.waitUntil(
      caches.keys().then(async (keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== 'cache-' + version) {
              console.log('[ServiceWorker] Removing old cache', key);
              return caches.delete(key);
            }
          }),
        ),
      ),
    );
    self.clients.claim();
  });

self.addEventListener('install', installServiceWorker);

self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request)
      .then(response => response ? response : fetch(e.request))
    )
  });