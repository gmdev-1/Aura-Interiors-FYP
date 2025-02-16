import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

    return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
  

  return children;
};

export default ProtectedRoute;
