import React from "react";
import PriceTag from "../common/PriceTag";
import { useCart } from "../../context/CartContext";

export default function CartItemRow({ item }) {
  const { updateItem, removeItem } = useCart();

  function handleQuantityChange(delta) {
    const next = item.quantity + delta;
    if (next < 1) return;
    updateItem(item.productId, next);
  }

  return (
    <div className="flex items-center gap-4 border-b border-border py-4 last:border-b-0">
      <div className="flex-1">
        <p className="font-medium">{item.productName}</p>
        <p className="text-xs text-muted">Unit price: {item.priceAtPurchase}</p>
      </div>

      <div className="flex items-center gap-2 rounded-md border border-border">
        <button
          className="px-3 py-1 text-lg leading-none hover:bg-bg"
          onClick={() => handleQuantityChange(-1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm">{item.quantity}</span>
        <button
          className="px-3 py-1 text-lg leading-none hover:bg-bg"
          onClick={() => handleQuantityChange(1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <PriceTag amount={item.priceAtPurchase * item.quantity} />

      <button
        className="text-sm font-medium text-danger hover:underline"
        onClick={() => removeItem(item.productId)}
      >
        Remove
      </button>
    </div>
  );
}
