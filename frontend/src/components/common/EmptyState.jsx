import React from "react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-16 text-center">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
