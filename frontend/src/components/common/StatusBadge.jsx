import React from "react";
import { titleCase } from "../../utils/format";

const STATUS_STYLES = {
  CREATED: "bg-primary/10 text-primary-dark",
  CONFIRMED: "bg-primary/10 text-primary-dark",
  SHIPPED: "bg-accent/20 text-accent-dark",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
  RETURNED: "bg-danger/10 text-danger",
  PENDING: "bg-accent/20 text-accent-dark",
  APPROVED: "bg-success/10 text-success",
  ACTIVE: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  SUSPENDED: "bg-danger/10 text-danger",
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const style = STATUS_STYLES[status] || "bg-muted/10 text-muted";
  return (
    <span className={`rounded-sm px-2 py-1 text-xs font-semibold ${style}`}>
      {titleCase(status)}
    </span>
  );
}
