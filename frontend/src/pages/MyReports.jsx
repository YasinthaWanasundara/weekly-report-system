import { useEffect, useState } from "react";
import api from "../api/axios";
import ReportForm from "../components/ReportForm";
import ReportCard from "../components/ReportCard";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsRes, projectsRes] = await Promise.all([
        api.get("/reports"),
        api.get("/projects"),
      ]);
      setReports(reportsRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      setError("Failed to load your reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    setBusy(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/reports/${editing.id}`, data);
      } else {
        await api.post("/reports", data);
      }
      setShowForm(false);
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save report");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (report) => {
    setEditing(report);
    setShowForm(true);
  };

  const handleDelete = async (report) => {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    await api.delete(`/reports/${report.id}`);
    await loadData();
  };

  // Group reports by week for the "organized by week" history view
  const grouped = reports.reduce((acc, r) => {
    const key = r.weekStart?.slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(r);
    return acc;
  }, {});
  const weeks = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Weekly Reports</h1>
          <p className="text-slate-500 text-sm">Create and manage your own weekly reports.</p>
        </div>
        {!showForm && (
          <button
            className="btn-primary"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            disabled={projects.length === 0}
          >
            + New report
          </button>
        )}
      </div>

      {projects.length === 0 && !loading && (
        <div className="bg-amber-50 text-amber-700 text-sm px-4 py-3 rounded-lg mb-6">
          No projects exist yet. Ask a manager to add a project before you can submit a report.
        </div>
      )}

      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>}

      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold text-lg text-slate-900 mb-4">
            {editing ? "Edit report" : "New weekly report"}
          </h2>
          <ReportForm
            projects={projects}
            initialData={editing}
            busy={busy}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading reports...</p>
      ) : weeks.length === 0 ? (
        <p className="text-slate-400 text-sm">
          You haven't submitted any reports yet. Click "New report" to get started.
        </p>
      ) : (
        <div className="space-y-8">
          {weeks.map((week) => (
            <div key={week}>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Week of {new Date(week).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[week].map((r) => (
                  <ReportCard key={r.id} report={r} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
