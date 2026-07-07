import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/projects");
    setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
      } else {
        await api.post("/projects", form);
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description });
  };

  const handleDelete = async (p) => {
    if (!confirm(`Remove project "${p.name}"?`)) return;
    await api.delete(`/projects/${p.id}`);
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Projects & Categories</h1>
      <p className="text-slate-500 text-sm mb-6">
        Manage the projects that team members can attach to their weekly reports.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-1 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">
            {editingId ? "Edit project" : "Add a project"}
          </h2>
          {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input
                required
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Client A"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                rows={3}
                className="input-field"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? "Save changes" : "Add project"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", description: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-slate-400 text-sm">Loading projects...</p>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{p.name}</p>
                    {p.description && <p className="text-sm text-slate-500">{p.description}</p>}
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button onClick={() => handleEdit(p)} className="text-sm text-brand-600 font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-sm text-red-500 font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-slate-400 text-sm">No projects yet — add the first one.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
