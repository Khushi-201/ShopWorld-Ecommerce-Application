import React from "react";
import { Link } from "react-router-dom";
import PriceTag from "../common/PriceTag";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, onToggleWishlist, inWishlist }) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const primaryImage =
    product.images?.find((img) => img.primary)?.imageUrl ||
    product.images?.[0]?.imageUrl;

  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/products/${product.productId}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-bg">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted">
              No image
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {product.categoryName}
        </p>
        <Link
          to={`/products/${product.productId}`}
          className="font-display text-base font-semibold leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted">Sold by {product.sellerBusinessName}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag amount={product.price} />
          {product.quantity === 0 && (
            <span className="text-xs font-medium text-danger">Out of stock</span>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex gap-2 pt-2">
            <button
              className="btn-primary flex-1"
              disabled={product.quantity === 0}
              onClick={() => addItem(product.productId, 1)}
            >
              Add to cart
            </button>
            {onToggleWishlist && (
              <button
                className="btn-outline px-3"
                onClick={() => onToggleWishlist(product.productId)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {inWishlist ? "♥" : "♡"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
