import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../store/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = useAuth((state) => state.getRole());


  console.log("role",role);
  console.log("allowedRoles",allowedRoles);
  // 1️⃣ Agar token hi nahi hai → login pe bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Agar role superadmin ya admin hai → hamesha allow karo
  if (role === "super_admin" || role === "admin") {
    return children;
  }

  // 3️⃣ Agar roles diye gaye hain aur role match nahi karta → dashboard bhej do
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4️⃣ Otherwise → route allow karo
  return children;
};

export default ProtectedRoute;
