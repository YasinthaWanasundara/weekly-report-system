import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Role-based access",
    body: "Team members submit their own reports. Managers see the whole team — enforced end to end, not just hidden in the UI.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    ),
  },
  {
    title: "One fixed report format",
    body: "Every team member fills the same fields, in the same order — so reports are always comparable, week over week.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
      />
    ),
  },
  {
    title: "Live team dashboard",
    body: "Compliance rate, open blockers, workload by project, and submission status — updated the moment a report comes in.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
  {
    title: "Projects & categories",
    body: "Managers keep a shared list of projects so every report is tagged consistently and workload rolls up cleanly.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    ),
  },
];

const steps = [
  { title: "Submit", body: "Team members fill out one short weekly report before the deadline." },
  { title: "Review", body: "Managers see every submission for the week, filterable by member or project." },
  { title: "Analyze", body: "Trends, blockers, and workload gaps surface automatically on the dashboard." },
];

export default function Home() {
  const { user } = useAuth();
  const primaryHref = user ? (user.role === "manager" ? "/dashboard" : "/app") : "/register";
  const primaryLabel = user ? "Continue to your dashboard" : "Get started free";

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm text-white">
              W
            </div>
            <span className="font-bold text-lg text-slate-900">
              Weekly<span className="text-brand-500">Report</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={primaryHref} className="btn-primary text-sm">
                Go to app
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-brand-900/60" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-brand-900/60" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <p className="text-brand-400 font-semibold text-sm tracking-wide uppercase mb-4">
            Weekly reporting, without the chasing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-3xl mx-auto mb-6">
            See your whole team&apos;s week, in one place.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10">
            One consistent report format for every team member. One live dashboard
            for every manager. No spreadsheets, no chasing people down for updates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to={primaryHref} className="btn-primary px-6 py-3 text-base">
              {primaryLabel}
            </Link>
            {!user && (
              <Link
                to="/login"
                className="px-6 py-3 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Built for the whole team
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Simple enough for a quick Friday update, structured enough for a
            manager to actually act on.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 flex gap-4">
              <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {f.icon}
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-brand-500 text-white font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Ready to stop chasing status updates?
        </h2>
        <p className="text-slate-500 mb-8">Create an account and submit your first report in minutes.</p>
        <Link to={primaryHref} className="btn-primary px-6 py-3 text-base">
          {primaryLabel}
        </Link>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        Weekly Report Generator &amp; Team Dashboard — built as a technical assignment demo.
      </footer>
    </div>
  );
}
