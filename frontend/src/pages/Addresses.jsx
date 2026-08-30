import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as addressApi from "../api/addressApi";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";

const EMPTY_ADDRESS = {
  label: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phoneNumber: "",
  default: false,
};

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = not editing, "new" = creating
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    addressApi
      .getMyAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(EMPTY_ADDRESS);
    setEditingId("new");
  }

  function startEdit(address) {
    setForm({ ...address });
    setEditingId(address.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_ADDRESS);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId === "new") {
        await addressApi.addAddress(form);
        toast.success("Address added.");
      } else {
        await addressApi.updateAddress(editingId, form);
        toast.success("Address updated.");
      }
      cancelEdit();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't save address.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await addressApi.deleteAddress(id);
      toast.success("Address removed.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't remove address.");
    }
  }

  if (loading) return <Loader label="Loading addresses…" />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Your addresses</h1>
        {editingId === null && <Button onClick={startCreate}>Add address</Button>}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Label</label>
            <input
              className="input"
              placeholder="Home, Office…"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone number</label>
            <input
              className="input"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Address line 1</label>
            <input
              className="input"
              value={form.addressLine1}
              onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Address line 2 (optional)</label>
            <input
              className="input"
              value={form.addressLine2}
              onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">State</label>
            <input
              className="input"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Postal code</label>
            <input
              className="input"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <input
              className="input"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.default}
              onChange={(e) => setForm({ ...form, default: e.target.checked })}
            />
            Set as default address
          </label>

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>
              Save address
            </Button>
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {addresses.length === 0 && editingId === null ? (
        <EmptyState
          title="No addresses saved"
          description="Add a delivery address to speed up checkout."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="card flex items-start justify-between gap-4 p-4">
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
              <div className="flex shrink-0 gap-3 text-sm font-medium">
                <button className="text-primary hover:underline" onClick={() => startEdit(addr)}>
                  Edit
                </button>
                <button
                  className="text-danger hover:underline"
                  onClick={() => handleDelete(addr.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
