// socket.js (or inside your component if testing only)
import { io } from 'socket.io-client';


const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'], // Optional, forces WS instead of polling
  path: import.meta.env.VITE_SOCKET_PATH, // 👈 MUST match backend's path
  secure: true,
  // reconnectionAttempts: 5,   // Retry 5 times
  timeout: 5000              // 5 seconds timeout
});

// 👇 Handle connection success
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

// 👇 Handle errors
socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

socket.on('connect_timeout', () => {
  console.error('⏳ Connection timed out');
});

socket.on('reconnect_attempt', (attempt) => {
  console.log(`♻️ Reconnect attempt ${attempt}`);
});

socket.on('reconnect_failed', () => {
  console.error('❌ Reconnection failed after max attempts');
});

// Optional: Detect disconnection
socket.on('disconnect', (reason) => {
  console.warn('⚠️ Disconnected:', reason);
});

export default socket;
