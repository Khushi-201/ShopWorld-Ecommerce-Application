import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItemRow from "../components/cart/CartItemRow";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import PriceTag from "../components/common/PriceTag";
import Button from "../components/common/Button";

export default function Cart() {
  const { cart, loading } = useCart();
  const navigate = useNavigate();

  if (loading && !cart) return <Loader label="Loading cart…" />;

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse products and add something you like."
        action={
          <Link to="/" className="btn-primary">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="card p-4 md:col-span-2">
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>

      <div className="card h-fit p-5">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <PriceTag amount={total} />
        </div>
        <p className="mt-1 text-xs text-muted">Shipping calculated at checkout.</p>
        <Button className="mt-4 w-full" onClick={() => navigate("/checkout")}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
