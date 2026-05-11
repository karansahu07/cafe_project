/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const swUrl = new URL(self.location.href);
const config = {
  apiKey: swUrl.searchParams.get('apiKey') || '',
  authDomain: swUrl.searchParams.get('authDomain') || '',
  projectId: swUrl.searchParams.get('projectId') || '',
  storageBucket: swUrl.searchParams.get('storageBucket') || '',
  messagingSenderId: swUrl.searchParams.get('messagingSenderId') || '',
  appId: swUrl.searchParams.get('appId') || ''
};

const canInit = Object.values(config).every(Boolean);

if (canInit) {
  firebase.initializeApp(config);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload?.notification?.title || payload?.data?.title || 'New order';
    const body = payload?.notification?.body || payload?.data?.body || 'You have a new order update';
    const orderId = payload?.data?.order_id || payload?.data?.orderId || '';

    self.registration.showNotification(title, {
      body,
      icon: '/logo.svg',
      data: {
        orderId,
        payload
      }
    });
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const orderId = event.notification?.data?.orderId;
    const targetPath = orderId ? `/orders/${orderId}` : '/all-orders';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.postMessage({ type: 'notification-click', orderId });
            client.focus();
            client.navigate(targetPath);
            return;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetPath);
        }
      })
    );
  });
}
