import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getRolebyid } from "../services/utils/role_manager";

const useAuth = create(
  devtools((set, get) => ({
    token: localStorage.getItem("token") || null,
    user: null, // only in memory

    // 🔹 Login function
    login: (token, user) => {
      localStorage.setItem("token", token); // only token persist
      set({ token, user }, false, "auth/login"); // name for devtools
    },

    // 🔹 Logout function
    logout: () => {
      localStorage.removeItem("token");
      set({ token: null, user: null }, false, "auth/logout");
    },

    // 🔹 Get token
    getToken: () => get().token,

    // 🔹 Get role
    getRole: () => getRolebyid(get().user?.role_id) || null,

    // 🔹 Get user
    getUser: () => get().user,
  }))
);

export default useAuth;
