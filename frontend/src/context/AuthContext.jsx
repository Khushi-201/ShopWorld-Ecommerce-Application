import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authApi from "../api/authApi";
import * as userApi from "../api/userApi";
import { tokenStore } from "../api/axiosClient";
import { isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

/**
 * Shape of `access` (from GET /users/me/access):
 *   { email, name, isAdmin, sellerStatus }
 * Some backends still send `admin` instead of `isAdmin`; accept both.
 * sellerStatus is one of: null | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"
 * (adjust the APPROVED_STATUSES set below if your backend also treats
 * "ACTIVE" as an approved-seller state - it's in the enum too).
 */
const APPROVED_SELLER_STATUSES = ["APPROVED", "ACTIVE"];

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null); // null while unknown/loading
  const [loading, setLoading] = useState(true);

  const refreshAccess = useCallback(async () => {
    const token = tokenStore.get();
    if (!token || isTokenExpired(token)) {
      tokenStore.clear();
      setAccess(null);
      return null;
    }
    try {
      const data = await userApi.getAccess();
      setAccess(data);
      return data;
    } catch {
      tokenStore.clear();
      setAccess(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshAccess().finally(() => setLoading(false));

    // If any request comes back 401, axiosClient clears the token and
    // fires this event - drop our in-memory access snapshot to match.
    const handleUnauthorized = () => setAccess(null);
    window.addEventListener("sw:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("sw:unauthorized", handleUnauthorized);
  }, [refreshAccess]);

  const login = useCallback(
    async ({ email, password }) => {
      await authApi.login({ email, password });
      // Fetch live permissions immediately after login - never decode
      // the token for this, it can be stale the moment status changes.
      return refreshAccess();
    },
    [refreshAccess]
  );

  const logout = useCallback(() => {
    authApi.logout();
    setAccess(null);
  }, []);

  const isAuthenticated = Boolean(access);
  const isAdmin = Boolean(access?.isAdmin ?? access?.admin);
  const sellerStatus = access?.sellerStatus ?? null;
  const isApprovedSeller = APPROVED_SELLER_STATUSES.includes(sellerStatus);

  const value = {
    access,
    loading,
    isAuthenticated,
    isAdmin,
    sellerStatus,
    isApprovedSeller,
    login,
    logout,
    refreshAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
