import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

/**
 * Wrap any route element with the access it requires. Combine flags as
 * needed - e.g. requireAuth + requireAdmin for admin-only pages.
 *
 * A non-admin user hitting /admin, or a non-approved-seller hitting
 * /seller/*, is bounced to "/" - they never see a "you're not allowed"
 * screen that would hint the route exists.
 */
export default function ProtectedRoute({
  children,
  requireAuth = false,
  requireSeller = false,
  requireAdmin = false,
}) {
  const { loading, isAuthenticated, isAdmin, isApprovedSeller } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireSeller && !isApprovedSeller) {
    return <Navigate to="/apply-seller" replace />;
  }

  return children;
}
