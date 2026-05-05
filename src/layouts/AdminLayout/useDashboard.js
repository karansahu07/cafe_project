// hooks/useDashboard.jsx
import { useEffect } from 'react';
import { notification } from 'antd';
import useNotificationStore from '../../store/useNotificationStore';
import socket from '../../services/socket'; // ✅ Your singleton socket instance
import { useNavigate } from 'react-router-dom';
import useAuth from '../../store/useAuth';
import { jwtDecode } from 'jwt-decode';
const useDashboard = () => {

  const addNotification = useNotificationStore((state) => state.addNotification);
  const clearNotifications = useNotificationStore((state) => state.clearNotifications);
  const notifications = useNotificationStore((state) => state.notifications);

  // const login = useAuth((state) => state.login);
  // const token = localStorage.getItem("token");

// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if(token){
//     console.log("token",token);
//     console.log("jwtDecode(token)",jwtDecode(token));
//     // login(token, jwtDecode(token));
//   }
 
// }, []);



  useEffect(() => {

    // const { token } = useAuth();
    // if(!token){
    //   navigate("/login");
    // }
    if (!socket) {
      console.warn("🚫 Socket not initialized.");
      return;
    }

    if (socket.connected) {
      console.log("🟢 Already connected. Socket ID:", socket.id);
      return;
    }

    // Event: On socket connection
    const handleConnect = () => {
      if (!socket.id) {
        console.warn("⚠️ Socket connected but ID is undefined.");
        return;
      }

      console.log("✅ Connected to socket server. Socket ID:", socket.id);
      socket.emit("join", { role: "admin" });
    };

    // Event: On socket error
    const handleError = (err) => {
      console.error("❌ Socket connection error:", err?.message || err);
    };

    // Event: Custom vendor event from backend
    const handleVendorNotification = (data) => {
      console.log("🔔 Vendor Notification received:", data);

      const { message, url, type } = data;

      // 1. Add to Zustand store
      addNotification({
        message,
        url,
        type,
        timestamp: new Date().toISOString(),
      });

      // 2. Show toast
      notification.info({
        message: type === 'vendor' ? 'Vendor Verification' : 'Notification',
        description: message,
        placement: 'topRight',
        duration: 10,
        onClick: () => {
          if (url) window.open(url, '_blank');
        },
      });
    };

    // Register event listeners (only if not already connected)
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.on("vendor_verification_pending", handleVendorNotification);

    // Debug events
    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected from socket server:", reason);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log(`♻️ Reconnect attempt #${attempt}`);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed");
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      socket.off("vendor_verification_pending", handleVendorNotification);
      socket.off("disconnect");
      socket.off("reconnect_attempt");
      socket.off("reconnect_failed");
    };
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    clearNotifications,
  };
};

export default useDashboard;
