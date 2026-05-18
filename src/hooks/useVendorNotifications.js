import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { notification as antNotification } from 'antd';
import useNotificationStore from '../store/useNotificationStore';
import { getResolvedRoleId, getResolvedUserId, getStoredToken } from '../utils/authSession';
import socket from '../services/socket';
import {
  cacheFcmToken,
  clearCachedFcmToken,
  fetchUnreadNotificationsFromBackend,
  fetchFcmToken,
  getCachedFcmToken,
  getNotificationPermission,
  isMessagingAvailable,
  listenForegroundMessages,
  markNotificationAsReadOnBackend,
  removeFcmTokenFromBackend,
  requestNotificationPermission,
  saveFcmTokenToBackend,
  toNotificationModel
} from '../services/firebase/firebaseMessaging';

const LAST_SEEN_KEY = 'vendor_fcm_last_seen';

const readSeenMap = () => {
  try {
    return JSON.parse(localStorage.getItem(LAST_SEEN_KEY) || '{}');
  } catch {
    return {};
  }
};

const markSeen = (id) => {
  const current = readSeenMap();
  if (current[id]) return false;
  current[id] = Date.now();

  const entries = Object.entries(current)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 500);
  localStorage.setItem(LAST_SEEN_KEY, JSON.stringify(Object.fromEntries(entries)));
  return true;
};

const normalizeBackendNotification = (item) => {
  const notificationId = item?.id || item?._id || item?.notification_id || item?.notificationId;
  const orderId = item?.order_id || item?.orderId || item?.order?.order_id || item?.order?.id || '';
  const orderUid = item?.order_uid || item?.orderUid || item?.order?.order_uid || '';
  const createdAt = item?.createdAt || item?.created_at || item?.timestamp || new Date().toISOString();

  return {
    id: String(notificationId || orderId || orderUid || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: item?.title || 'New Order Received',
    body: item?.body || item?.message || item?.description || 'A new customer order was placed.',
    type: item?.type || 'order',
    order_id: orderId,
    order_uid: orderUid,
    createdAt,
    read: Boolean(item?.read || item?.is_read || item?.isRead)
  };
};

const toSocketNotificationModel = (payload) => {
  const orderId = payload?.order_id || payload?.orderId || payload?.id || '';
  const orderUid = payload?.order_uid || payload?.orderUid || '';
  const amount = payload?.total_price || payload?.totalPrice || payload?.amount;
  const amountLine = amount ? `Order #${orderUid || orderId} - Rs.${amount}` : '';

  return {
    id: String(payload?.notification_id || payload?.notificationId || orderId || orderUid || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title: payload?.title || 'New Order Received',
    body: payload?.message || payload?.body || amountLine || 'A new customer order was placed.',
    type: payload?.type || 'order',
    order_id: orderId,
    order_uid: orderUid,
    createdAt: new Date().toISOString(),
    read: false,
    source: 'socket'
  };
};

export default function useVendorNotifications() {
  const roleId = Number(getResolvedRoleId());
  const isVendor = roleId === 3;
  const userId = getResolvedUserId();

  const {
    notifications,
    unreadCount,
    setNotifications,
    addNotification,
    markAsRead,
    removeNotification,
    markAllAsRead,
    clearNotifications
  } = useNotificationStore();

  const [permission, setPermission] = useState(getNotificationPermission());
  const [tokenStatus, setTokenStatus] = useState('idle');
  const [error, setError] = useState('');

  const bcRef = useRef(null);

  const authToken = getStoredToken();

  const registerToken = useCallback(async () => {
    if (!isVendor || !userId) return null;

    const available = await isMessagingAvailable();
    if (!available) {
      setPermission('unsupported');
      setError('Notifications are not supported in this browser.');
      return null;
    }

    if (getNotificationPermission() !== 'granted') {
      setPermission(getNotificationPermission());
      return null;
    }

    setTokenStatus('loading');
    setError('');

    try {
      const token = await fetchFcmToken();
      if (!token) {
        setTokenStatus('error');
        setError('Unable to generate device token. Please retry.');
        return null;
      }
      // Always upsert on backend at login/session start. Backend token may be deleted manually.
      await saveFcmTokenToBackend(userId, token, authToken);
      cacheFcmToken(token, userId);
      setTokenStatus('ready');
      return token;
    } catch (err) {
      setTokenStatus('error');
      setError(err?.message || 'Notification setup failed.');
      return null;
    }
  }, [authToken, isVendor, userId]);

  const requestPermission = useCallback(async () => {
    if (!isVendor) return;
    const status = await requestNotificationPermission();
    setPermission(status);

    if (status === 'granted') {
      await registerToken();
    } else if (status === 'denied') {
      setError('Notification permission denied. You can enable it from browser settings.');
    }
  }, [isVendor, registerToken]);

  const retryTokenRegistration = useCallback(async () => {
    await registerToken();
  }, [registerToken]);

  const unregisterDeviceToken = useCallback(async () => {
    try {
      const token = getCachedFcmToken();
      if (isVendor && userId && token) {
        await removeFcmTokenFromBackend(userId, token, authToken);
      }
    } catch {
      // No blocking for logout flow.
    } finally {
      clearCachedFcmToken();
    }
  }, [authToken, isVendor, userId]);

  useEffect(() => {
    if (!isVendor) return;

    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    if (currentPermission === 'granted') {
      // Already allowed → directly register token
      registerToken();
    } else if (currentPermission === 'default') {
      // Not asked yet → auto-ask browser permission popup
      requestNotificationPermission().then((status) => {
        setPermission(status);
        if (status === 'granted') {
          registerToken();
        }
      });
    }
    // 'denied' → do nothing, user sees message in bell dropdown
  }, [isVendor, registerToken]);

  useEffect(() => {
    if (!isVendor || !userId || !authToken) return;

    let active = true;
    const loadUnreadNotifications = async () => {
      try {
        const unreadList = await fetchUnreadNotificationsFromBackend(userId, authToken);
        if (!active) return;

        const normalized = unreadList
          .map(normalizeBackendNotification)
          .filter((item) => Boolean(item?.id));

        setNotifications(normalized.map((item) => ({ ...item, read: false })));
      } catch (err) {
        setError((prev) => prev || err?.message || 'Unable to load unread notifications.');
      }
    };

    loadUnreadNotifications();

    return () => {
      active = false;
    };
  }, [authToken, isVendor, setNotifications, userId]);

  useEffect(() => {
    if (!isVendor) return;

    let unsubscribe = () => {};

    const setup = async () => {
      try {
        unsubscribe = await listenForegroundMessages((payload) => {
          const model = toNotificationModel(payload);
          if (!model?.id) return;

          if (!markSeen(model.id)) return;

          addNotification(model);
          antNotification.info({
            message: model.title,
            description: model.body,
            placement: 'topRight',
            duration: 4
          });
          bcRef.current?.postMessage({ type: 'new', payload: model });
        });
      } catch {
        // Silent; permission/status UI is handled in hook state.
      }
    };

    setup();

    return () => {
      unsubscribe?.();
    };
  }, [addNotification, isVendor]);

  useEffect(() => {
    if (!isVendor) return;

    const handleSocketOrder = (payload) => {
      const model = toSocketNotificationModel(payload);
      if (!model?.id) return;
      if (!markSeen(model.id)) return;

      addNotification(model);
      bcRef.current?.postMessage({ type: 'new', payload: model });
    };

    socket.on('new_order', handleSocketOrder);
    socket.on('vendor_new_order', handleSocketOrder);

    return () => {
      socket.off('new_order', handleSocketOrder);
      socket.off('vendor_new_order', handleSocketOrder);
    };
  }, [addNotification, isVendor]);

  useEffect(() => {
    if (!isVendor || typeof BroadcastChannel === 'undefined') return;

    bcRef.current = new BroadcastChannel('vendor_notification_channel');
    bcRef.current.onmessage = (event) => {
      const { type, payload } = event?.data || {};
        if (type === 'new' && payload?.id) {
          if (!markSeen(payload.id)) return;
          addNotification(payload);
        }
        if (type === 'mark-read' && payload?.id) {
          markAsRead(payload.id);
        }
        if (type === 'mark-all-read') {
          markAllAsRead();
        }
        if (type === 'clear-all') {
          clearNotifications();
        }
    };

    return () => {
      bcRef.current?.close();
      bcRef.current = null;
    };
  }, [addNotification, clearNotifications, isVendor, markAllAsRead]);

  const onMarkAllRead = useCallback(async () => {
    try {
      const unreadIds = (notifications || []).filter((n) => !n.read).map((n) => n.id).filter(Boolean);
      if (unreadIds.length > 0) {
        await Promise.all(
          unreadIds.map((id) =>
            markNotificationAsReadOnBackend(id, authToken).catch((err) => {
              console.warn('[onMarkAllRead] mark-as-read failed for', id, err?.message || err);
            })
          )
        );
      }
    } catch (err) {
      console.warn('[onMarkAllRead] Unexpected error', err?.message || err);
    } finally {
      markAllAsRead();
      bcRef.current?.postMessage({ type: 'mark-all-read' });
    }
  }, [markAllAsRead, notifications, authToken]);

  const onClearAll = useCallback(() => {
    clearNotifications();
    bcRef.current?.postMessage({ type: 'clear-all' });
  }, [clearNotifications]);

  const onMarkRead = useCallback(async (id) => {
    if (!id) return;
    try {
      await markNotificationAsReadOnBackend(id, authToken);
      markAsRead(id);
      bcRef.current?.postMessage({ type: 'mark-read', payload: { id } });
    } catch (err) {
      setError(err?.message || 'Unable to mark notification as read.');
    }
  }, [authToken, markAsRead]);

  return useMemo(
    () => ({
      isVendor,
      permission,
      tokenStatus,
      error,
      notifications,
      unreadCount,
      requestPermission,
      retryTokenRegistration,
      markAsRead: onMarkRead,
      markAllAsRead: onMarkAllRead,
      clearNotifications: onClearAll,
      unregisterDeviceToken
    }),
    [
      error,
      isVendor,
      notifications,
      onClearAll,
      onMarkAllRead,
      onMarkRead,
      permission,
      requestPermission,
      retryTokenRegistration,
      tokenStatus,
      unreadCount,
      unregisterDeviceToken
    ]
  );
}
