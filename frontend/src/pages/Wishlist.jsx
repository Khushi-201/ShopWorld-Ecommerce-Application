import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as wishlistApi from "../api/wishlistApi";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import PriceTag from "../components/common/PriceTag";
import Button from "../components/common/Button";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    wishlistApi
      .getWishlist()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleRemove(productId) {
    try {
      const updated = await wishlistApi.removeFromWishlist(productId);
      setItems(updated);
    } catch {
      // ignore, user can retry
    }
  }

  if (loading) return <Loader label="Loading wishlist…" />;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save products you're interested in to find them here later."
        action={
          <Link to="/" className="btn-primary">
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Wishlist</h1>

      <div className="card divide-y divide-border">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between gap-4 p-4">
            <div>
              <Link
                to={`/products/${item.productId}`}
                className="font-medium hover:text-primary"
              >
                {item.productName}
              </Link>
              {!item.inStock && (
                <p className="text-xs font-medium text-danger">Out of stock</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <PriceTag amount={item.price} />
              <Button
                disabled={!item.inStock}
                onClick={() => addItem(item.productId, 1)}
              >
                Add to cart
              </Button>
              <button
                className="text-sm font-medium text-danger hover:underline"
                onClick={() => handleRemove(item.productId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
