import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zcafe.ekarigar.com';
const LOCAL_FCM_TOKEN_KEY = 'vendor_fcm_token';
const LOCAL_FCM_USER_KEY = 'vendor_fcm_user_id';
const NOTIFICATIONS_PREFIX = '/notifications';

const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '').replace(/\/$/, '');
const SOCKET_API_PREFIX = (import.meta.env.VITE_SOCKET_PATH || '').replace(/\/socket\.io\/?$/, '').replace(/\/$/, '');

const buildCandidateUrls = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const notificationsPath = normalizedPath.startsWith(`${NOTIFICATIONS_PREFIX}/`)
    ? normalizedPath
    : `${NOTIFICATIONS_PREFIX}${normalizedPath}`;

  const candidates = [
    `${API_BASE_URL}${notificationsPath}`,
    `${API_BASE_URL}${normalizedPath}`,
    API_PREFIX ? `${API_BASE_URL}${API_PREFIX}${notificationsPath}` : '',
    API_PREFIX ? `${API_BASE_URL}${API_PREFIX}${normalizedPath}` : '',
    SOCKET_API_PREFIX ? `${API_BASE_URL}${SOCKET_API_PREFIX}${notificationsPath}` : '',
    SOCKET_API_PREFIX ? `${API_BASE_URL}${SOCKET_API_PREFIX}${normalizedPath}` : '',
    `${API_BASE_URL}/delievery-api${notificationsPath}`,
    `${API_BASE_URL}/delievery-api${normalizedPath}`,
    `${API_BASE_URL}/api${notificationsPath}`,
    `${API_BASE_URL}/api${normalizedPath}`
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const postWithFallback = async (path, payload, authToken) => {
  const urls = buildCandidateUrls(path);
  let lastErrorMessage = 'Unable to register notification token';

  console.log('[postWithFallback] Trying URLs:', urls);

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.success !== false) {
        console.log('[postWithFallback] ✅ Success at URL:', url);
        return data;
      }

      console.log('[postWithFallback] Response not ok. Status:', response.status, 'Data:', data);
      if (response.status !== 404) {
        throw new Error(data?.message || `Token API failed (${response.status})`);
      }

      lastErrorMessage = data?.message || `Token endpoint not found at ${url}`;
    } catch (err) {
      console.warn('[postWithFallback] Fetch error:', err?.message, 'URL:', url);
    }
  }

  console.error('[postWithFallback] ❌ All URLs failed:', lastErrorMessage);
  throw new Error(lastErrorMessage);
};

const deleteWithFallback = async (path, payload, authToken) => {
  const urls = buildCandidateUrls(path);

  for (const url of urls) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) return;
    if (response.status !== 404) {
      throw new Error('Unable to remove notification token');
    }
  }

  throw new Error('Unable to remove notification token');
};

const getWithFallback = async (path, authToken) => {
  const urls = buildCandidateUrls(path);
  let lastErrorMessage = 'Unable to fetch notifications';

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        return data;
      }

      if (response.status !== 404) {
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      lastErrorMessage = data?.message || `Endpoint not found at ${url}`;
    } catch (err) {
      console.warn('[getWithFallback] Fetch error:', err?.message, 'URL:', url);
      lastErrorMessage = err?.message || lastErrorMessage;
    }
  }

  throw new Error(lastErrorMessage);
};

const putWithFallback = async (path, payload, authToken) => {
  const urls = buildCandidateUrls(path);
  let lastErrorMessage = 'Unable to update notification';

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: payload ? JSON.stringify(payload) : undefined
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.success !== false) {
        return data;
      }

      if (response.status !== 404) {
        throw new Error(data?.message || `Request failed (${response.status})`);
      }

      lastErrorMessage = data?.message || `Endpoint not found at ${url}`;
    } catch (err) {
      console.warn('[putWithFallback] Fetch error:', err?.message, 'URL:', url);
      lastErrorMessage = err?.message || lastErrorMessage;
    }
  }

  throw new Error(lastErrorMessage);
};

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID
};

const vapidKey = import.meta.env.FIREBASE_VAPID_KEY || import.meta.env.VITE_FIREBASE_VAPID_KEY;

const hasConfig = () => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      vapidKey
  );
};

export const getNotificationPermission = () => {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.permission;
};

const getFirebaseApp = () => {
  if (!hasConfig()) return null;
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
};

export const isMessagingAvailable = async () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (!('serviceWorker' in navigator)) return false;
  if (!hasConfig()) return false;
  try {
    return await isSupported();
  } catch {
    return false;
  }
};

const registerServiceWorker = async () => {
  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey || '',
    authDomain: firebaseConfig.authDomain || '',
    projectId: firebaseConfig.projectId || '',
    storageBucket: firebaseConfig.storageBucket || '',
    messagingSenderId: firebaseConfig.messagingSenderId || '',
    appId: firebaseConfig.appId || ''
  });

  try {
    console.log('[registerServiceWorker] Registering SW at /firebase-messaging-sw.js');
    const reg = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`);
    console.log('[registerServiceWorker] ✅ SW registered successfully');
    return reg;
  } catch (err) {
    console.error('[registerServiceWorker] ❌ SW registration failed:', err?.message);
    throw err;
  }
};

export const requestNotificationPermission = async () => {
  if (typeof Notification === 'undefined') return 'unsupported';
  return Notification.requestPermission();
};

const getMessagingInstance = async () => {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase config missing');
  const supported = await isMessagingAvailable();
  if (!supported) throw new Error('Messaging is not supported in this browser');
  return getMessaging(app);
};

export const fetchFcmToken = async () => {
  console.log('[fetchFcmToken] Starting token fetch...');
  const messaging = await getMessagingInstance();

  let serviceWorkerRegistration = null;
  try {
    serviceWorkerRegistration = await registerServiceWorker();
  } catch (swErr) {
    console.error('[fetchFcmToken] ⚠️ Service worker registration failed:', swErr?.message);
  }

  console.log('[fetchFcmToken] Calling getToken with VAPID...');
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Token fetch timeout after 10s')), 10000);
  });

  const token = await Promise.race([
    getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration
    }),
    timeoutPromise
  ]);

  console.log('[fetchFcmToken] ✅ Token received:', token ? token.substring(0, 30) + '...' : 'null');
  return token;
};

export const listenForegroundMessages = async (onReceive) => {
  const messaging = await getMessagingInstance();
  return onMessage(messaging, (payload) => {
    onReceive?.(payload);
  });
};

export const getCachedFcmToken = () => localStorage.getItem(LOCAL_FCM_TOKEN_KEY) || '';

export const cacheFcmToken = (token, userId) => {
  if (!token) return;
  localStorage.setItem(LOCAL_FCM_TOKEN_KEY, token);
  if (userId !== undefined && userId !== null) {
    localStorage.setItem(LOCAL_FCM_USER_KEY, String(userId));
  }
};

export const clearCachedFcmToken = () => {
  localStorage.removeItem(LOCAL_FCM_TOKEN_KEY);
  localStorage.removeItem(LOCAL_FCM_USER_KEY);
};

export const saveFcmTokenToBackend = async (userId, token, authToken) => {
  return postWithFallback(
    '/userfcm-token',
    {
      user_id: Number(userId),
      fcmToken: token
    },
    authToken
  );
};

export const removeFcmTokenFromBackend = async (userId, token, authToken) => {
  if (!userId || !token || !authToken) return;

  await deleteWithFallback(
    '/remove-fcmtoken',
    {
      user_id: Number(userId),
      fcmToken: token
    },
    authToken
  );
};

export const fetchUnreadNotificationsFromBackend = async (userId, authToken) => {
  if (!userId || !authToken) return [];

  const data = await getWithFallback(`/all-notifications/${userId}?onlyUnread=true`, authToken);
  const list = data?.notifications || data?.data || data?.rows || [];
  return Array.isArray(list) ? list : [];
};

export const markNotificationAsReadOnBackend = async (notificationId, authToken) => {
  if (!notificationId || !authToken) return null;
  return putWithFallback(`/mark-asread/${notificationId}`, {}, authToken);
};

export const syncVendorFcmTokenOnLogin = async ({ authToken, userId }) => {
  if (!authToken || !userId) return { ok: false, reason: 'missing-auth-or-user' };

  const available = await isMessagingAvailable();
  if (!available) return { ok: false, reason: 'messaging-not-supported' };

  let permission = getNotificationPermission();
  console.log('[FCM-LoginSync] Current permission:', permission);
  if (permission === 'default') {
    console.log('[FCM-LoginSync] Requesting notification permission...');
    permission = await requestNotificationPermission();
    console.log('[FCM-LoginSync] Permission result:', permission);
  }

  if (permission !== 'granted') {
    console.log('[FCM-LoginSync] Permission not granted, skipping token sync');
    return { ok: false, reason: `permission-${permission}` };
  }

  try {
    console.log('[FCM-LoginSync] Fetching Firebase token...');
    const token = await fetchFcmToken();
    if (!token) {
      console.error('[FCM-LoginSync] ❌ Token is empty/null');
      return { ok: false, reason: 'token-missing' };
    }
    console.log('[FCM-LoginSync] Token generated:', token.substring(0, 30) + '...');

    console.log('[FCM-LoginSync] Sending token to backend...');
    await saveFcmTokenToBackend(userId, token, authToken);
    console.log('[FCM-LoginSync] ✅ Token sent to backend for user_id:', userId);
    cacheFcmToken(token, userId);
    return { ok: true, token };
  } catch (err) {
    console.error('[FCM-LoginSync] ❌ Sync failed:', err?.message);
    return { ok: false, reason: 'sync-error', error: err?.message };
  }
};

export const toNotificationModel = (payload) => {
  const title = payload?.notification?.title || payload?.data?.title || 'New order notification';
  const body = payload?.notification?.body || payload?.data?.body || 'You have a new order';
  const orderId = payload?.data?.order_id || payload?.data?.orderId || '';
  const orderUid = payload?.data?.order_uid || payload?.data?.orderUid || '';
  const type = payload?.data?.type || 'order';
  const customer = payload?.data?.customer || '';
  const customerAddress = payload?.data?.customer_address || '';
  const isFastDelivery = payload?.data?.is_fast_delivery || payload?.data?.isFastDelivery || '0';

  const id = String(orderId || orderUid || `${title}-${body}-${type}`).trim();

  return {
    id,
    title,
    body,
    type,
    order_id: orderId,
    order_uid: orderUid,
    customer,
    customer_address: customerAddress,
    is_fast_delivery: String(isFastDelivery) === '1',
    createdAt: new Date().toISOString(),
    read: false,
    source: 'fcm'
  };
};
