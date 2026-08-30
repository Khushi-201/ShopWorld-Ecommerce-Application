import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, isApprovedSeller, sellerStatus, access, logout } =
    useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  // Admins get a completely separate nav - no buyer chrome, no seller
  // hints, nothing for a regular user to notice or guess at.
  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/admin" className="font-display text-xl font-semibold text-primary">
            ShopWorld <span className="text-accent-dark">Admin</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/admin" className="hover:text-primary">
              Dashboard
            </Link>
            <Link to="/admin/pending" className="hover:text-primary">
              Pending Sellers
            </Link>
            <button onClick={handleLogout} className="btn-outline">
              Log out
            </button>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 font-display text-xl font-semibold text-primary">
          ShopWorld
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 md:block">
          <input
            className="input"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-medium">
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="hover:text-primary">
                Wishlist
              </Link>
              <Link to="/orders" className="hover:text-primary">
                Orders
              </Link>
              <Link to="/cart" className="relative hover:text-primary">
                Cart
                {itemCount > 0 && (
                  <span className="absolute -right-3 -top-2 rounded-full bg-accent px-1.5 text-xs font-semibold text-ink">
                    {itemCount}
                  </span>
                )}
              </Link>

              {isApprovedSeller ? (
                <Link to="/seller/dashboard" className="hover:text-primary">
                  Seller Dashboard
                </Link>
              ) : (
                <Link to="/apply-seller" className="hover:text-primary">
                  {sellerStatus === "PENDING" ? "Application Pending" : "Apply as Seller"}
                </Link>
              )}

              <Link to="/profile" className="hover:text-primary">
                {access?.name || "Profile"}
              </Link>
              <button onClick={handleLogout} className="btn-outline">
                Log out
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-primary">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
