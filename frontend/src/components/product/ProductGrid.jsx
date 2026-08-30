import React from "react";
import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";

export default function ProductGrid({
  products,
  wishlistedIds = [],
  onToggleWishlist,
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try a different search term or browse another category."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          onToggleWishlist={onToggleWishlist}
          inWishlist={wishlistedIds.includes(product.productId)}
        />
      ))}
    </div>
  );
}
