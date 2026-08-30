import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as orderApi from "../api/orderApi";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import PriceTag from "../components/common/PriceTag";
import { formatDate } from "../utils/format";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading orders…" />;

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Once you place an order, it'll show up here."
        action={
          <Link to="/" className="btn-primary">
            Start shopping
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-semibold">Your orders</h1>

      <div className="card divide-y divide-border">
        {orders.map((order) => (
          <Link
            key={order.orderId}
            to={`/orders/${order.orderId}`}
            className="flex items-center justify-between gap-4 p-4 hover:bg-bg"
          >
            <div>
              <p className="font-medium">Order #{order.orderId}</p>
              <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
              <p className="text-xs text-muted">{order.items?.length || 0} item(s)</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <PriceTag amount={order.totalAmount} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
