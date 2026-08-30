import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const access = await login(form);
      toast.success("Welcome back!");

      // Admins always land on the admin dashboard, regardless of where
      // they were headed - there's no "choose admin login" step anywhere,
      // this is purely decided by the live /users/me/access response.
      // Accept both `isAdmin` and the current backend field `admin` for compatibility.
      if (access?.isAdmin ?? access?.admin) {
        navigate("/admin", { replace: true });
        return;
      }

      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Couldn't log in. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 font-display text-2xl font-semibold">Log in</h1>
      <p className="mb-6 text-sm text-muted">Welcome back to ShopWorld.</p>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
        {error && <p className="text-sm text-danger">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <Button type="submit" loading={loading}>
          Log in
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        New here?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
