import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import Addresses from "../pages/Addresses";
import ApplySeller from "../pages/ApplySeller";

import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProducts from "../pages/seller/SellerProducts";
import ProductEditor from "../pages/seller/ProductEditor";
import ProductImages from "../pages/seller/ProductImages";

import AdminDashboard from "../pages/admin/AdminDashboard";
import PendingSellers from "../pages/admin/PendingSellers";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:productId" element={<ProductDetail />} />

      {/* Authenticated - any logged-in user (buyer flows) */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute requireAuth>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requireAuth>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute requireAuth>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute requireAuth>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute requireAuth>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requireAuth>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/addresses"
        element={
          <ProtectedRoute requireAuth>
            <Addresses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/apply-seller"
        element={
          <ProtectedRoute requireAuth>
            <ApplySeller />
          </ProtectedRoute>
        }
      />

      {/* Seller-only - hidden until sellerStatus is approved/active */}
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute requireAuth requireSeller>
            <SellerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products"
        element={
          <ProtectedRoute requireAuth requireSeller>
            <SellerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/new"
        element={
          <ProtectedRoute requireAuth requireSeller>
            <ProductEditor mode="create" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:productId/edit"
        element={
          <ProtectedRoute requireAuth requireSeller>
            <ProductEditor mode="edit" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/products/:productId/images"
        element={
          <ProtectedRoute requireAuth requireSeller>
            <ProductImages />
          </ProtectedRoute>
        }
      />

      {/* Admin-only - never visible/reachable for a non-admin user */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending"
        element={
          <ProtectedRoute requireAuth requireAdmin>
            <PendingSellers />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
