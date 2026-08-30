import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as productApi from "../../api/productApi";
import SellerSidebar from "../../components/seller/SellerSidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import PriceTag from "../../components/common/PriceTag";
import Button from "../../components/common/Button";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    productApi
      .getMyProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(productId) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    try {
      await productApi.removeProduct(productId);
      toast.success("Product removed.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't remove product.");
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <SellerSidebar />

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">My products</h1>
          <Link to="/seller/products/new" className="btn-primary">
            Add product
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading products…" />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first product to start selling."
            action={
              <Link to="/seller/products/new" className="btn-primary">
                Add product
              </Link>
            }
          />
        ) : (
          <div className="card divide-y divide-border">
            {products.map((product) => (
              <div key={product.productId} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted">
                    {product.categoryName} · {product.quantity} in stock
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PriceTag amount={product.price} />
                  <Link
                    to={`/seller/products/${product.productId}/images`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Images
                  </Link>
                  <Link
                    to={`/seller/products/${product.productId}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <Button variant="outline" onClick={() => handleDelete(product.productId)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
