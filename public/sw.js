// Service Worker — PlatformaBac
// Strategy: Shell-Only Cache + Network-First for all API/content requests.
//
// ⚠️  SECURITY: lesson content, lesson_blocks, Supabase API responses, and signed
//     media URLs are NEVER cached. Caching them would bypass Supabase RLS and
//     PRO entitlement checks.

const CACHE_NAME = 'platforma-bac-shell-v1';

// Only static shell assets are cached — NO lesson content, NO API responses.
const SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
];

// Patterns that must NEVER be cached (security boundary)
const NEVER_CACHE_PATTERNS = [
  /supabase\.co/,          // All Supabase API/storage requests
  /\/rest\/v1\//,          // PostgREST
  /\/auth\/v1\//,          // Supabase Auth
  /\/storage\/v1\//,       // Supabase Storage (signed URLs)
  /token=/,                // Signed URL query params
  /X-Amz-Signature/,       // AWS S3 signed URLs
  /\/lesson\//,            // Lesson route data
  /\/admin\//,             // Admin API
  /\/dashboard/,           // Protected area
];

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Only cache the shell — do not pre-cache routes (they require auth)
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some shell assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // ⚠️  SECURITY: Never intercept requests matching the security boundary patterns.
  const isNeverCache = NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
  if (isNeverCache) {
    // Pass through to network — no caching
    return;
  }

  // For navigation requests (HTML pages) — Network-First with shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Stale-while-revalidate: update shell cache on successful navigation
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: serve cached shell
          return caches.match('/').then((cached) => {
            if (cached) return cached;
            // Last-resort offline response
            return new Response(
              `<!doctype html>
<html lang="ro">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
  <title>Ești offline — PlatformaBac</title>
  <style>
    body { background: #070d14; color: #f8fafc; font-family: system-ui, sans-serif;
           display: flex; align-items: center; justify-content: center;
           min-height: 100dvh; margin: 0; text-align: center; padding: 1rem; }
    h1 { color: #06b6d4; font-size: 1.5rem; margin-bottom: .5rem; }
    p  { color: #94a3b8; font-size: .9rem; }
    a  { color: #06b6d4; text-decoration: none; }
  </style>
</head>
<body>
  <div>
    <h1>Ești offline</h1>
    <p>Conectează-te la internet pentru a continua studiul.</p>
    <p><a href="/">Reîncearcă</a></p>
  </div>
</body>
</html>`,
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          });
        })
    );
    return;
  }

  // For static assets (JS/CSS/images from /assets/) — Cache-First
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(png|svg|ico|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // All other requests — pass through to network (no caching)
});
