import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as userApi from "../api/userApi";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", contactNo: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name || "", contactNo: data.contactNo || "" });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userApi.updateProfile(form);
      setProfile(updated);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loader label="Loading profile…" />;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 font-display text-2xl font-semibold">Your profile</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input className="input bg-bg" value={profile?.email || ""} disabled />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Contact number</label>
          <input
            className="input"
            value={form.contactNo}
            onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
            required
          />
        </div>

        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
