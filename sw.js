// Nama cache versi saat ini (berfungsi untuk versioning saat update file)
const CACHE_NAME = 'resep-cache-v1';

// Daftar file statis yang akan disimpan ke cache saat service worker di-install
const FILES_TO_CACHE = [
  '/',                          // Halaman utama (root)
  '/index.html',               // File HTML utama
  '/app.js',                   // File JavaScript aplikasi
  '/css/styles.css',           // File CSS tambahan (pastikan path-nya benar!)
  '/images/icon.jpg',          // Ikon aplikasi
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' // CDN Bootstrap
];

// Event 'install' => menyimpan file statis ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE); // Cache semua file penting
    })
  );
  self.skipWaiting(); // Langsung aktifkan SW tanpa menunggu tab lama ditutup
});

// Event 'activate' => menghapus cache versi lama jika ada
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Hapus cache lama yang tidak sesuai versi
          }
        })
      )
    )
  );
  self.clients.claim(); // Klaim kendali atas semua tab terbuka
});

// Event 'fetch' => intercept permintaan jaringan, gunakan cache jika tersedia
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // Hanya cache permintaan GET

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika file ada di cache, gunakan cache. Jika tidak, fetch dari jaringan.
      return response || fetch(event.request);
    })
  );
});
