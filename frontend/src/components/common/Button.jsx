import React from "react";

const VARIANT_CLASS = {
  primary: "btn-primary",
  accent: "btn-accent",
  outline: "btn-outline",
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  children,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`${VARIANT_CLASS[variant] || VARIANT_CLASS.primary} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
