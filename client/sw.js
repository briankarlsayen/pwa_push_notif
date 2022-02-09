'use strict';

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');

  const parsedData = JSON.parse(event.data.text())
  const title = parsedData.title
  const options = {
    body: parsedData.body,
    icon: 'image/yin-yang.png',
    badge: 'image/yin-yang.png'
    // image: 'image/batman.png',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

//run when notif is clicked
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    //open website
    clients.openWindow('https://pedantic-brahmagupta-ce84de.netlify.app/')
  );
});