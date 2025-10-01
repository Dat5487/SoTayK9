// =============================================================================
// SERVICE WORKER - PWA Offline Support & Caching
// =============================================================================

const CACHE_NAME = 'k9-management-v5.1.0';
const STATIC_CACHE = 'k9-static-v5.1.0';
const DYNAMIC_CACHE = 'k9-dynamic-v5.1.0';
const API_CACHE = 'k9-api-v5.1.0';

// Files to cache immediately (App Shell)
const STATIC_ASSETS = [
  // Core HTML
  '/dashboard_v5.html',
  '/index.html',
  
  // JavaScript
  '/journal_system.js',
  '/pdf_export.js', 
  '/ai_chat.js',
  
  // PWA files
  '/manifest.json',
  '/sw.js',
  
  // External CDN Resources (essential)
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  
  // Offline page
  '/offline.html'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/auth/me',
  '/api/dashboard/stats',
  '/api/dogs',
  '/api/users',
  '/api/journals'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/journals',
  '/api/dogs'
];

// =============================================================================
// SERVICE WORKER EVENTS
// =============================================================================

self.addEventListener('install', event => {
  // console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        // console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
      }),
      
      // Cache external resources separately  
      caches.open(STATIC_CACHE).then(cache => {
        // console.log('🌐 Caching external resources...');
        const externalUrls = STATIC_ASSETS.filter(url => url.startsWith('http'));
        return Promise.allSettled(
          externalUrls.map(url => 
            cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
          )
        );
      }),
      
      // Create offline page
      createOfflinePage()
    ]).then(() => {
      // console.log('✅ Service Worker installed successfully');
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  // console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanOldCaches(),
      
      // Claim all clients
      self.clients.claim()
    ]).then(() => {
      // console.log('✅ Service Worker activated');
      
      // Notify clients about update
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: CACHE_NAME
          });
        });
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (request.method !== 'GET') {
    // Handle POST/PUT/DELETE requests
    event.respondWith(handleDynamicRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    // Handle API requests
    event.respondWith(handleApiRequest(request));
  } else if (isStaticAsset(request)) {
    // Handle static assets
    event.respondWith(handleStaticRequest(request));
  } else {
    // Handle navigation requests
    event.respondWith(handleNavigationRequest(request));
  }
});

// Handle background sync
self.addEventListener('sync', event => {
  // console.log('🔄 Background sync event:', event.tag);
  
  if (event.tag === 'journal-sync') {
    event.waitUntil(syncJournals());
  } else if (event.tag === 'data-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  // console.log('📬 Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: data.tag || 'general',
        actions: data.actions || [],
        data: data.data || {}
      })
    );
  }
});

self.addEventListener('notificationclick', event => {
  // console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/dashboard_v5.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('dashboard_v5.html') && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if not found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// =============================================================================
// REQUEST HANDLERS
// =============================================================================

async function handleStaticRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Static request failed:', error);
    
    // Return fallback for specific file types
    if (request.url.includes('.js')) {
      return new Response('console.warn("Offline - Script not available");', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    if (request.url.includes('.css')) {
      return new Response('/* Offline - Styles not available */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    return caches.match('/offline.html');
  }
}

async function handleApiRequest(request) {
  const url = new URL(request.url);
  const isNetworkFirst = NETWORK_FIRST.some(path => url.pathname.includes(path));
  
  if (isNetworkFirst) {
    return handleNetworkFirst(request);
  } else {
    return handleCacheFirst(request);
  }
}

async function handleNetworkFirst(request) {
  try {
    // Try network first
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 5000)
      )
    ]);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.warn('Network request failed, trying cache:', error);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to cached response
      const response = cachedResponse.clone();
      const data = await response.json();
      data._offline = true;
      
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return offline response
    return new Response(JSON.stringify({
      success: false,
      error: 'Offline - Data not available',
      _offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleCacheFirst(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Update cache in background
      updateCacheInBackground(request);
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache the response
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('Cache-first request failed:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Service unavailable',
      _offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
    
  } catch (error) {
    console.warn('Navigation request failed, serving offline page');
    
    // Serve cached dashboard or offline page
    const cachedDashboard = await caches.match('/dashboard_v5.html');
    if (cachedDashboard) {
      return cachedDashboard;
    }
    
    return caches.match('/offline.html');
  }
}

async function handleDynamicRequest(request) {
  try {
    // For POST/PUT/DELETE, always try network
    const networkResponse = await fetch(request);
    
    // If offline, queue for background sync
    return networkResponse;
    
  } catch (error) {
    console.warn('Dynamic request failed:', error);
    
    // Store request for background sync
    if (request.method === 'POST') {
      await storeOfflineAction(request);
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        await self.registration.sync.register('data-sync');
      }
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Request queued for sync when online',
      _queued: true
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// =============================================================================
// UTILITY FUNCTIONS  
// =============================================================================

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.html') ||
         url.pathname.endsWith('.json') ||
         url.pathname.includes('cdnjs.cloudflare.com');
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(cacheName => {
        // console.log('🗑️ Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      })
  );
}

async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.warn('Background cache update failed:', error);
  }
}

async function createOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - K9 Management</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background: linear-gradient(135deg, #667eea, #764ba2);
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #333;
            }
            .offline-container {
                background: white;
                border-radius: 16px;
                padding: 3rem;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 500px;
                width: 90%;
            }
            .offline-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            .offline-title {
                font-size: 2rem;
                color: #2d3748;
                margin-bottom: 1rem;
            }
            .offline-message {
                color: #718096;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            .retry-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: transform 0.3s;
            }
            .retry-btn:hover {
                transform: translateY(-2px);
            }
            .features {
                margin-top: 2rem;
                text-align: left;
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
            }
            .features h3 {
                margin: 0 0 1rem 0;
                color: #2d3748;
            }
            .features ul {
                margin: 0;
                padding-left: 1.5rem;
            }
            .features li {
                color: #4a5568;
                margin-bottom: 0.5rem;
            }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="offline-icon">🔌</div>
            <h1 class="offline-title">Bạn đang offline</h1>
            <p class="offline-message">
                Không thể kết nối internet. Một số tính năng vẫn có thể sử dụng trong chế độ offline.
            </p>
            
            <button class="retry-btn" onclick="window.location.reload()">
                🔄 Thử kết nối lại
            </button>
            
            <div class="features">
                <h3>🛠️ Tính năng offline:</h3>
                <ul>
                    <li>Xem dữ liệu đã tải trước đó</li>
                    <li>Viết nhật ký (sẽ đồng bộ khi online)</li>
                    <li>Sử dụng AI Chat cơ bản</li>
                    <li>Xuất PDF từ dữ liệu đã cache</li>
                </ul>
            </div>
        </div>
        
        <script>
            // Auto-retry when online
            window.addEventListener('online', () => {
                window.location.reload();
            });
            
            // Service worker messaging
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener('message', event => {
                    if (event.data.type === 'BACK_ONLINE') {
                        window.location.reload();
                    }
                });
            }
        </script>
    </body>
    </html>
  `;
  
  const response = new Response(offlineHtml, {
    headers: { 'Content-Type': 'text/html' }
  });
  
  return cache.put('/offline.html', response);
}

// =============================================================================
// BACKGROUND SYNC & OFFLINE SUPPORT
// =============================================================================

async function storeOfflineAction(request) {
  const actionData = {
    url: request.url,
    method: request.method,
    headers: [...request.headers],
    body: await request.text(),
    timestamp: Date.now()
  };
  
  // Store in IndexedDB (simplified implementation)
  if ('indexedDB' in self) {
    const db = await openOfflineDB();
    const transaction = db.transaction(['offline_actions'], 'readwrite');
    const store = transaction.objectStore('offline_actions');
    await store.add(actionData);
  }
}

async function syncOfflineData() {
  // console.log('🔄 Syncing offline data...');
  
  try {
    const db = await openOfflineDB();
    const transaction = db.transaction(['offline_actions'], 'readonly');
    const store = transaction.objectStore('offline_actions');
    const actions = await store.getAll();
    
    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: new Headers(action.headers),
          body: action.body
        });
        
        if (response.ok) {
          // Remove successful action
          const deleteTransaction = db.transaction(['offline_actions'], 'readwrite');
          const deleteStore = deleteTransaction.objectStore('offline_actions');
          await deleteStore.delete(action.id);
          
          // console.log('✅ Synced offline action:', action.url);
        }
      } catch (error) {
        console.error('❌ Failed to sync action:', action.url, error);
      }
    }
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        syncedCount: actions.length
      });
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncJournals() {
  // console.log('📝 Syncing journal data...');
  // Implementation for journal-specific sync
  return syncOfflineData();
}

function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('K9OfflineDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create offline actions store
      if (!db.objectStoreNames.contains('offline_actions')) {
        const store = db.createObjectStore('offline_actions', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('url', 'url');
      }
      
      // Create cache metadata store
      if (!db.objectStoreNames.contains('cache_metadata')) {
        db.createObjectStore('cache_metadata', { keyPath: 'key' });
      }
    };
  });
}

// =============================================================================
// PERIODIC BACKGROUND SYNC
// =============================================================================

self.addEventListener('periodicsync', event => {
  // console.log('⏰ Periodic sync event:', event.tag);
  
  if (event.tag === 'hourly-data-sync') {
    event.waitUntil(performPeriodicSync());
  }
});

async function performPeriodicSync() {
  // console.log('🔄 Performing periodic sync...');
  
  try {
    // Sync critical data
    await Promise.allSettled([
      updateDashboardStats(),
      syncPendingJournals(),
      updateDogData()
    ]);
    
    // console.log('✅ Periodic sync completed');
  } catch (error) {
    console.error('❌ Periodic sync failed:', error);
  }
}

async function updateDashboardStats() {
  const cache = await caches.open(API_CACHE);
  try {
    const response = await fetch('/api/dashboard/stats');
    if (response.ok) {
      await cache.put('/api/dashboard/stats', response);
    }
  } catch (error) {
    console.warn('Failed to update dashboard stats:', error);
  }
}

async function syncPendingJournals() {
  // Sync any pending journal entries
  return syncOfflineData();
}

async function updateDogData() {
  const cache = await caches.open(API_CACHE);
  try {
    const response = await fetch('/api/dogs');
    if (response.ok) {
      await cache.put('/api/dogs', response);
    }
  } catch (error) {
    console.warn('Failed to update dog data:', error);
  }
}

// =============================================================================
// VERSION & UPDATE MANAGEMENT
// =============================================================================

self.addEventListener('message', event => {
  // console.log('📨 SW Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// console.log('🤖 Service Worker loaded - K9 Management v5.1.0');
// console.log('📦 Cache Name:', CACHE_NAME);
// console.log('🔧 Features: Offline support, Background sync, Push notifications');

// Self-diagnostic
self.addEventListener('activate', () => {
  // console.log('🔍 Service Worker diagnostic:');
  // console.log('  - Caches API:', 'caches' in self);
  // console.log('  - IndexedDB:', 'indexedDB' in self);
  // console.log('  - Background Sync:', 'sync' in ServiceWorkerRegistration.prototype);
  // console.log('  - Push API:', 'PushManager' in self);
  // console.log('  - Periodic Sync:', 'periodicsync' in ServiceWorkerRegistration.prototype);
});