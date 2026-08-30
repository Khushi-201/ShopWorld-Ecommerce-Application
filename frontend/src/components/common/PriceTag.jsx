import React from "react";
import { formatPrice } from "../../utils/format";

export default function PriceTag({ amount, size = "md" }) {
  const sizeClass = size === "lg" ? "text-base px-3 py-1.5" : "text-sm px-2 py-1";
  return <span className={`price-tag ${sizeClass}`}>{formatPrice(amount)}</span>;
}
