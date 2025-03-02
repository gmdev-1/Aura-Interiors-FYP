import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import Spinner from "./Spinner";

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(UserAuthContext);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

    return isAuthenticated ? children : <Navigate to="/user/login" replace />;
  

  return children;
};

export default UserProtectedRoute;
