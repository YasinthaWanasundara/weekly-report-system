import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  "Role-based access for members and managers",
  "Live dashboards with team-wide insights",
  "One consistent report format for the whole team",
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel — brand pitch (hidden on small screens) */}
      <div className="hidden md:flex relative flex-col justify-between bg-slate-950 text-white p-12 overflow-hidden">
        {/* decorative background circles */}
        <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-brand-900/60" />
        <div className="absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-brand-900/60" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm">
              W
            </div>
            <span className="font-bold text-lg">
              Weekly<span className="text-brand-400">Report</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-snug mb-4">
            See your whole team&apos;s week, in one place.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
            Submit reports, track blockers, and spot workload gaps before they
            become problems — all from a single, consistent weekly format.
          </p>
        </div>

        <ul className="relative space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
              <svg
                className="w-5 h-5 text-brand-400 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Right panel — login form */}
      <div className="flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Compact brand mark for mobile, where the left panel is hidden */}
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm text-white">
              W
            </div>
            <span className="font-bold text-lg text-slate-900">
              Weekly<span className="text-brand-500">Report</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">
            Log in to submit or review weekly reports.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input-field"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-600 font-medium">
              Register
            </Link>
          </p>

          <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-400">
            Demo: manager@demo.com / password123 (manager) · member1@demo.com / password123 (member)
          </div>
        </div>
      </div>
    </div>
  );
}
