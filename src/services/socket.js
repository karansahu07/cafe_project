// socket.js (or inside your component if testing only)
import { io } from 'socket.io-client';

const rawSocketPath = import.meta.env.VITE_SOCKET_PATH || '/socket.io';
const normalizedSocketPath = rawSocketPath.endsWith('/') ? rawSocketPath.slice(0, -1) : rawSocketPath;
const resolvedSocketPath = normalizedSocketPath.includes('/delievery-api/socket.io') ? '/socket.io' : normalizedSocketPath;

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['polling', 'websocket'], // Start with polling, then upgrade to websocket
  path: resolvedSocketPath,
  upgrade: true,
  rememberUpgrade: false,
  secure: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  timeout: 20000
});

// 👇 Handle connection success
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
  console.log('[Socket] Transport:', socket.io.engine.transport.name);
  console.log('[Socket] Path:', resolvedSocketPath);
});

// 👇 Handle errors
socket.on('connect_error', (error) => {
  console.error('❌ Socket Connection Error:', error.message || error);
  console.log('[Socket] Current transport:', socket.io.engine.transport?.name || 'unknown');
  console.log('[Socket] URL:', import.meta.env.VITE_SOCKET_URL);
  console.log('[Socket] Path:', resolvedSocketPath);
});

socket.on('connect_timeout', () => {
  console.error('⏳ Socket Connection timed out');
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`♻️ Socket Reconnect attempt ${attempt}`);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Socket Reconnection failed after max attempts');
});

// 👇 Detect disconnection
socket.on('disconnect', (reason) => {
  console.warn('⚠️ Socket Disconnected:', reason);
});

// 👇 Transport upgrade listener
socket.io.engine.on('upgrade', (transport) => {
  console.log('[Socket] Transport upgraded to:', transport.name);
});

export default socket;
