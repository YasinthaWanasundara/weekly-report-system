import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? "bg-brand-500 text-white" : "text-slate-600 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <span className="font-bold text-slate-900 text-lg">
            Weekly<span className="text-brand-500">Report</span>
          </span>
          <div className="hidden sm:flex gap-1">
            <NavLink to="/" end className={linkClass}>
              My Reports
            </NavLink>
            {user?.role === "manager" && (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Team Dashboard
                </NavLink>
                <NavLink to="/projects" className={linkClass}>
                  Projects
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 hidden sm:inline">
            {user?.name}{" "}
            <span className="ml-1 text-xs uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </span>
          <button onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
