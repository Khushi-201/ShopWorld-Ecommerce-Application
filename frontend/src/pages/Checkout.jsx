import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import * as addressApi from "../api/addressApi";
import * as orderApi from "../api/orderApi";
import { useCart } from "../context/CartContext";
import PriceTag from "../components/common/PriceTag";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    addressApi
      .getMyAddresses()
      .then((data) => {
        setAddresses(data);
        const defaultAddr = data.find((a) => a.default) || data[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  async function handlePlaceOrder() {
    if (!selectedAddressId) {
      toast.error("Select a delivery address first.");
      return;
    }
    // NOTE: no payment gateway wired up yet. This button places the order
    // directly, as if payment succeeded. Swap this handler for a real
    // payment flow (redirect/confirm) once one exists on the backend.
    setPlacing(true);
    try {
      const order = await orderApi.placeOrder({ addressId: selectedAddressId });
      await refreshCart();
      toast.success("Order placed!");
      navigate(`/orders/${order.orderId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't place order.");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <Loader label="Loading checkout…" />;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Your cart is empty."
        action={
          <Link to="/" className="btn-primary">
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="card p-5 md:col-span-2">
        <h2 className="font-display text-lg font-semibold">Delivery address</h2>

        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            You don't have any saved addresses yet.{" "}
            <Link to="/addresses" className="font-medium text-primary hover:underline">
              Add one
            </Link>{" "}
            before checking out.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`card flex cursor-pointer items-start gap-3 p-3 ${
                  selectedAddressId === addr.id ? "border-primary" : ""
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                />
                <div className="text-sm">
                  <p className="font-medium">
                    {addr.label} {addr.default && <span className="text-xs text-muted">(default)</span>}
                  </p>
                  <p className="text-muted">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.state}{" "}
                    {addr.postalCode}, {addr.country}
                  </p>
                  <p className="text-muted">{addr.phoneNumber}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="card h-fit p-5">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">{items.length} item(s)</span>
          <PriceTag amount={total} />
        </div>

        <div className="mt-4 rounded-md border border-dashed border-border bg-bg px-3 py-2 text-xs text-muted">
          Payment integration coming soon — this button places your order
          directly for now.
        </div>

        <Button
          className="mt-4 w-full"
          onClick={handlePlaceOrder}
          loading={placing}
          disabled={!selectedAddressId}
        >
          Pay &amp; place order
        </Button>
      </div>
    </div>
  );
}
