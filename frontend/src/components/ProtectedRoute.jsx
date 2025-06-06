import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { authenticate } = useSelector((state) => state.auth);

  return authenticate ? children : <Navigate to="/messenger/login" />;
};

export default ProtectedRoute;
