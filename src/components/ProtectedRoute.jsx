import React from "react";
import { Navigate } from "react-router-dom";
import { getResolvedHomeRoute, getResolvedRole, getStoredToken } from "../utils/authSession";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = getStoredToken();
  const role = getResolvedRole();
  // 1️⃣ Agar token hi nahi hai → login pe bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Agar roles diye gaye hain aur role match nahi karta → role home bhej do
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getResolvedHomeRoute()} replace />;
  }

  // 3️⃣ Otherwise → route allow karo
  return children;
};

export default ProtectedRoute;
