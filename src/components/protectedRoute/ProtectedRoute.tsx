// src/components/ProtectedRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    if (role === "firststep") {
      return <Navigate to="/first-step-view" replace />;
    } else if (role === "windows") {
      return <Navigate to="/window-view" replace />;
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      return <Navigate to="/" replace />;
    }
  }
  console.log(
    "Token:",
    token,
    "User Role:",
    role,
    "Required Role:",
    requiredRole
  );
  return children;
};

export default ProtectedRoute;
