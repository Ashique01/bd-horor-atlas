import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = localStorage.getItem("admin") === "true";
  const location = useLocation();

  return isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin-login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
