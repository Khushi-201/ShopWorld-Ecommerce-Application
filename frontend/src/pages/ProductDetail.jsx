import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as productApi from "../api/productApi";
import * as wishlistApi from "../api/wishlistApi";
import PriceTag from "../components/common/PriceTag";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { productId } = useParams();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi
      .getProductById(productId)
      .then((data) => {
        setProduct(data);
        const primary = data.images?.find((img) => img.primary) || data.images?.[0];
        setActiveImage(primary?.imageUrl || null);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    wishlistApi
      .getWishlist()
      .then((items) =>
        setInWishlist(items.some((i) => i.productId === Number(productId)))
      )
      .catch(() => {});
  }, [isAuthenticated, productId]);

  async function handleToggleWishlist() {
    try {
      if (inWishlist) {
        await wishlistApi.removeFromWishlist(Number(productId));
        setInWishlist(false);
      } else {
        await wishlistApi.addToWishlist(Number(productId));
        setInWishlist(true);
      }
    } catch {
      // ignore, user can retry
    }
  }

  if (loading) return <Loader label="Loading product…" />;

  if (!product) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium">Product not found.</p>
        <Link to="/" className="mt-2 inline-block text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const outOfStock = product.quantity === 0;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-bg">
          {activeImage ? (
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              No image
            </div>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.imageUrl)}
                className={`h-16 w-16 overflow-hidden rounded-md border ${
                  activeImage === img.imageUrl ? "border-primary" : "border-border"
                }`}
              >
                <img src={img.imageUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{product.categoryName}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">{product.name}</h1>
        <p className="mt-1 text-sm text-muted">Sold by {product.sellerBusinessName}</p>

        <div className="mt-4">
          <PriceTag amount={product.price} size="lg" />
        </div>

        <p className="mt-4 whitespace-pre-line text-sm text-ink">
          {product.description || "No description provided."}
        </p>

        <p className="mt-4 text-sm">
          {outOfStock ? (
            <span className="font-medium text-danger">Out of stock</span>
          ) : (
            <span className="text-muted">{product.quantity} in stock</span>
          )}
        </p>

        {isAuthenticated ? (
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border">
              <button
                className="px-3 py-2 text-lg leading-none hover:bg-bg"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-[2ch] text-center">{quantity}</span>
              <button
                className="px-3 py-2 text-lg leading-none hover:bg-bg"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <Button
              disabled={outOfStock}
              onClick={() => addItem(product.productId, quantity)}
              className="flex-1"
            >
              Add to cart
            </Button>
            <Button variant="outline" onClick={handleToggleWishlist}>
              {inWishlist ? "♥ Saved" : "♡ Save"}
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <Link to="/login" className="btn-primary">
              Log in to purchase
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
