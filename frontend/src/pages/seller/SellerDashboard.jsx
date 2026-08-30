import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as productApi from "../../api/productApi";
import SellerSidebar from "../../components/seller/SellerSidebar";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";

export default function SellerDashboard() {
  const { access } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .getMyProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <SellerSidebar />

      <div className="flex-1">
        <h1 className="font-display text-2xl font-semibold">
          Welcome back{access?.name ? `, ${access.name}` : ""}
        </h1>
        <p className="mb-6 text-sm text-muted">Here's how your store is doing.</p>

        {loading ? (
          <Loader label="Loading dashboard…" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-sm text-muted">Total products</p>
              <p className="font-display text-3xl font-semibold">{products.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-sm text-muted">Out of stock</p>
              <p className="font-display text-3xl font-semibold">{outOfStockCount}</p>
            </div>
            <Link to="/seller/products/new" className="card flex flex-col justify-center p-5 hover:bg-bg">
              <p className="font-medium text-primary">+ Add a new product</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
