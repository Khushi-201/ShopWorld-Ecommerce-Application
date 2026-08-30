import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-display text-base text-ink">ShopWorld</p>
          <p>© {new Date().getFullYear()} ShopWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
