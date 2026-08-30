import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import * as cartApi from "../api/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null); // CartResponse | null
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch {
      // Non-fatal - leave cart as-is, user can retry via UI.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      const data = await cartApi.addToCart({ productId, quantity });
      setCart(data);
      toast.success("Added to cart");
    } catch {
      toast.error("Couldn't add item to cart");
    }
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    try {
      const data = await cartApi.updateQuantity(productId, quantity);
      setCart(data);
    } catch {
      toast.error("Couldn't update quantity");
    }
  }, []);

  const removeItem = useCallback(async (productId) => {
    try {
      const data = await cartApi.removeFromCart(productId);
      setCart(data);
      toast.success("Removed from cart");
    } catch {
      toast.error("Couldn't remove item");
    }
  }, []);

  const itemCount = (cart?.items || []).reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const value = {
    cart,
    loading,
    itemCount,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
