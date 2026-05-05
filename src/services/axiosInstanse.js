// api.js
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
const api = axios.create({
//   withCredentials: true, // agar cookies use karte ho
  baseURL: API_URL,
  headers: {
    Authorization:  `Bearer ${token}` ,
    "Content-Type": "application/json",  // ✅ Use JSON instead of multipart/form-data
},
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response, // agar response sahi hai to return karo
  (error) => {
    if (error.response && error.response.status === 401) {
      // 👇 Logout call
localStorage.removeItem("token");
      // 👇 Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
