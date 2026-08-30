import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as productApi from "../api/productApi";
import * as categoryApi from "../api/categoryApi";
import * as wishlistApi from "../api/wishlistApi";
import ProductGrid from "../components/product/ProductGrid";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.getAllCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      wishlistApi
        .getWishlist()
        .then((items) => setWishlistedIds(items.map((i) => i.productId)))
        .catch(() => {});
    } else {
      setWishlistedIds([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    const load = query
      ? productApi.searchProductsByName(query)
      : activeCategory
      ? productApi.searchProductsByCategory(activeCategory)
      : productApi.getAllProducts();

    load
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, activeCategory]);

  async function handleToggleWishlist(productId) {
    const inWishlist = wishlistedIds.includes(productId);
    try {
      if (inWishlist) {
        const items = await wishlistApi.removeFromWishlist(productId);
        setWishlistedIds(items.map((i) => i.productId));
      } else {
        const items = await wishlistApi.addToWishlist(productId);
        setWishlistedIds(items.map((i) => i.productId));
      }
    } catch {
      // Silently ignore - user can retry.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          {query ? `Results for "${query}"` : "Shop everything"}
        </h1>
        <p className="text-sm text-muted">Fresh finds from independent sellers.</p>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`rounded-full border px-3 py-1 text-sm ${
              !activeCategory
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface hover:bg-bg"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`rounded-full border px-3 py-1 text-sm ${
                activeCategory === cat.id
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface hover:bg-bg"
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Loader label="Loading products…" />
      ) : (
        <ProductGrid
          products={products}
          wishlistedIds={wishlistedIds}
          onToggleWishlist={isAuthenticated ? handleToggleWishlist : undefined}
        />
      )}
    </div>
  );
}
