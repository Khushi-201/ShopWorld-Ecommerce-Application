import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as orderApi from "../api/orderApi";
import Loader from "../components/common/Loader";
import StatusBadge from "../components/common/StatusBadge";
import PriceTag from "../components/common/PriceTag";
import Button from "../components/common/Button";
import { formatDateTime } from "../utils/format";

const CANCELLABLE = ["CREATED", "CONFIRMED"];
const RETURNABLE = ["DELIVERED"];

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  function load() {
    setLoading(true);
    orderApi
      .getOrderDetails(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }

  useEffect(load, [orderId]);

  async function handleCancel() {
    setActionLoading(true);
    try {
      const updated = await orderApi.cancelOrder(orderId);
      setOrder(updated);
      toast.success("Order cancelled.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't cancel order.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReturn() {
    setActionLoading(true);
    try {
      const updated = await orderApi.returnOrder(orderId);
      setOrder(updated);
      toast.success("Return requested.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't request return.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loader label="Loading order…" />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium">Order not found.</p>
        <Link to="/orders" className="mt-2 inline-block text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">Order #{order.orderId}</h1>
          <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="card divide-y divide-border">
        {(order.items || []).map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-xs text-muted">Qty: {item.quantity}</p>
            </div>
            <PriceTag amount={item.priceAtPurchase * item.quantity} />
          </div>
        ))}
        <div className="flex items-center justify-between p-4">
          <span className="font-medium">Total</span>
          <PriceTag amount={order.totalAmount} size="lg" />
        </div>
      </div>

      {(CANCELLABLE.includes(order.status) || RETURNABLE.includes(order.status)) && (
        <div className="mt-4 flex gap-3">
          {CANCELLABLE.includes(order.status) && (
            <Button variant="outline" onClick={handleCancel} loading={actionLoading}>
              Cancel order
            </Button>
          )}
          {RETURNABLE.includes(order.status) && (
            <Button variant="outline" onClick={handleReturn} loading={actionLoading}>
              Request return
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
