import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getRolebyid } from '../services/utils/role_manager';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://zcafe.ekarigar.com/backend';
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '').replace(/\/$/, '');
const SOCKET_API_PREFIX = (import.meta.env.VITE_SOCKET_PATH || '').replace(/\/socket\.io\/?$/, '').replace(/\/$/, '');
const NOTIFICATIONS_PREFIX = '/notifications';

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

const cleanupFcmTokenOnLogout = () => {
  try {
    const token = localStorage.getItem('token') || '';
    const fcmToken = localStorage.getItem('vendor_fcm_token') || '';
    const userId = localStorage.getItem('user_id') || '';

    if (!token || !fcmToken || !userId) return;

    const urls = buildCandidateUrls('/remove-fcmtoken');
    const payload = JSON.stringify({
      user_id: Number(userId),
      fcmToken
    });

    urls.forEach((url) => {
      fetch(url, {
        method: 'DELETE',
        keepalive: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      }).catch(() => {});
    });
  } catch {
    // no-op
  }
};

const useAuth = create(
  devtools((set, get) => ({
    token: localStorage.getItem('token') || null,
    user: null, // only in memory

    // 🔹 Login function
    login: (token, user) => {
      localStorage.setItem('token', token); // only token persist
      set({ token, user }, false, 'auth/login'); // name for devtools
    },

    // 🔹 Logout function
    logout: () => {
      cleanupFcmTokenOnLogout();
      localStorage.removeItem('token');
      localStorage.removeItem('vendor_fcm_token');
      localStorage.removeItem('vendor_fcm_user_id');
      set({ token: null, user: null }, false, 'auth/logout');
    },

    // 🔹 Get token
    getToken: () => get().token,

    // 🔹 Get role
    getRole: () => getRolebyid(get().user?.role_id) || null,

    // 🔹 Get user
    getUser: () => get().user
  }))
);

export default useAuth;
