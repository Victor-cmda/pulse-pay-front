import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoadingSpinner } from "../components";

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin, adminChecked } = useSelector(
    (state) => state.user
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (loading || !adminChecked) {
    return <LoadingSpinner />;
  }

  return children;
};

export default AdminRoute;
