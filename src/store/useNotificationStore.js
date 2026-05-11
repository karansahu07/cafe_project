// stores/notificationStore.js
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (incomingNotifications) =>
    set(() => {
      const normalized = Array.isArray(incomingNotifications)
        ? incomingNotifications.map((item) => ({
            ...item,
            id: item?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            read: Boolean(item?.read)
          }))
        : [];

      const unread = normalized.reduce((count, item) => (item.read ? count : count + 1), 0);
      return {
        notifications: normalized,
        unreadCount: unread
      };
    }),
  addNotification: (notification) =>
    set((state) => {
      const normalizedNotification = {
        ...notification,
        id: notification?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      };

      const exists = state.notifications.some((item) => item.id === normalizedNotification.id);

      return {
      notifications: exists
        ? state.notifications
        : [{ ...normalizedNotification, read: false }, ...state.notifications],
      unreadCount: exists ? state.unreadCount : state.unreadCount + 1,
    };}),
  markAsRead: (id) =>
    set((state) => {
      let reduced = 0;
      const notifications = state.notifications.map((item) => {
        if (item.id === id && !item.read) {
          reduced = 1;
          return { ...item, read: true };
        }
        return item;
      });

      return {
        notifications,
        unreadCount: Math.max(0, state.unreadCount - reduced)
      };
    }),
  removeNotification: (id) =>
    set((state) => {
      const target = state.notifications.find((item) => item.id === id);
      if (!target) return state;

      return {
        notifications: state.notifications.filter((item) => item.id !== id),
        unreadCount: target.read ? state.unreadCount : Math.max(0, state.unreadCount - 1)
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
      unreadCount: 0
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotificationStore;
