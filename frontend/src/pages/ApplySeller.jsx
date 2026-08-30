import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as sellerApi from "../api/sellerApi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import StatusBadge from "../components/common/StatusBadge";

const EMPTY = {
  businessName: "",
  businessType: "",
  businessAddress: "",
  description: "",
};

export default function ApplySeller() {
  const { sellerStatus, isApprovedSeller, refreshAccess } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Already approved sellers land here only via a stale link - send them
  // straight to their dashboard instead of showing the apply form again.
  if (isApprovedSeller) {
    navigate("/seller/dashboard", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.businessName.trim()) {
      setError("Business name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await sellerApi.applyAsSeller(form);
      await refreshAccess();
      toast.success("Application submitted!");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  // Already applied (pending/rejected/suspended) - show status instead of
  // letting them resubmit blindly.
  if (sellerStatus) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-1 font-display text-2xl font-semibold">Seller application</h1>
        <div className="card mt-4 flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted">Current status</p>
            <div className="mt-1">
              <StatusBadge status={sellerStatus} />
            </div>
          </div>
        </div>
        {sellerStatus === "PENDING" && (
          <p className="mt-4 text-sm text-muted">
            Your application is being reviewed. We'll unlock your seller
            dashboard automatically once it's approved.
          </p>
        )}
        {sellerStatus === "REJECTED" && (
          <p className="mt-4 text-sm text-muted">
            Your application wasn't approved. Contact support if you'd like
            more details.
          </p>
        )}
        {sellerStatus === "SUSPENDED" && (
          <p className="mt-4 text-sm text-muted">
            Your seller access has been suspended. Contact support for help
            restoring it.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 font-display text-2xl font-semibold">Become a seller</h1>
      <p className="mb-6 text-sm text-muted">
        Tell us about your business. An admin will review your application.
      </p>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        {error && <p className="text-sm text-danger">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Business name</label>
          <input
            className="input"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Business type</label>
          <input
            className="input"
            placeholder="e.g. Sole proprietorship, LLC…"
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Business address</label>
          <input
            className="input"
            value={form.businessAddress}
            onChange={(e) => setForm({ ...form, businessAddress: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            className="input min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <Button type="submit" loading={submitting}>
          Submit application
        </Button>
      </form>
    </div>
  );
}
