import React from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/seller/dashboard", label: "Dashboard" },
  { to: "/seller/products", label: "My Products" },
  { to: "/seller/products/new", label: "Add Product" },
];

export default function SellerSidebar() {
  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav className="card flex flex-row gap-1 p-2 md:flex-col">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? "bg-primary text-white" : "text-ink hover:bg-bg"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
