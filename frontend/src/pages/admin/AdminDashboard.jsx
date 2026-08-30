import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as adminApi from "../../api/adminApi";
import AdminSidebar from "../../components/admin/AdminSidebar";
import Loader from "../../components/common/Loader";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getPendingApplications()
      .then(setPending)
      .catch(() => setPending([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <h1 className="font-display text-2xl font-semibold">Admin dashboard</h1>
        <p className="mb-6 text-sm text-muted">
          Marketplace overview and seller moderation.
        </p>

        {loading ? (
          <Loader label="Loading overview…" />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/admin/pending"
              className="card flex flex-col justify-center p-5 hover:bg-bg"
            >
              <p className="text-sm text-muted">Pending seller applications</p>
              <p className="font-display text-3xl font-semibold">{pending.length}</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
