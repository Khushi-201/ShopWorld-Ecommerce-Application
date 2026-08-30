import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as adminApi from "../../api/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

export default function PendingSellers() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  function load() {
    setLoading(true);
    adminApi
      .getPendingApplications()
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleApprove(sellerId) {
    setActioningId(sellerId);
    try {
      await adminApi.approveSeller(sellerId);
      toast.success("Seller approved.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't approve seller.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(sellerId) {
    setActioningId(sellerId);
    try {
      await adminApi.rejectSeller(sellerId);
      toast.success("Seller rejected.");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't reject seller.");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <h1 className="mb-4 font-display text-2xl font-semibold">
          Pending seller applications
        </h1>

        {loading ? (
          <Loader label="Loading applications…" />
        ) : applications.length === 0 ? (
          <EmptyState
            title="Nothing to review"
            description="New seller applications will show up here."
          />
        ) : (
          <div className="card divide-y divide-border">
            {applications.map((app) => (
              <div key={app.sellerId} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{app.businessName}</p>
                  {app.message && <p className="text-xs text-muted">{app.message}</p>}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(app.sellerId)}
                    loading={actioningId === app.sellerId}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(app.sellerId)}
                    loading={actioningId === app.sellerId}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
