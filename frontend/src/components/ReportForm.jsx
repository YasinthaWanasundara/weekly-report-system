import { useEffect, useState } from "react";
import { mondayOf, sundayOf } from "../utils/date";

const emptyForm = {
  weekStart: mondayOf(),
  weekEnd: sundayOf(mondayOf()),
  project: "",
  tasksCompleted: "",
  tasksPlanned: "",
  blockers: "",
  hoursWorked: "",
  notes: "",
};

// This form renders the SAME fixed set of fields, in the SAME order, for every
// user — nothing here is user-configurable, which keeps reports comparable
// across the team on the manager dashboard.
export default function ReportForm({ projects, initialData, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(initialData || emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        weekStart: initialData.weekStart?.slice(0, 10),
        weekEnd: initialData.weekEnd?.slice(0, 10),
        project: initialData.project?.id || initialData.project,
      });
    }
  }, [initialData]);

  const handleWeekStartChange = (value) => {
    setForm({ ...form, weekStart: value, weekEnd: sundayOf(value) });
  };

  const handleSubmit = (status) => (e) => {
    e.preventDefault();
    onSubmit({ ...form, status, hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined });
  };

  return (
    <form className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Week / date range</label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              required
              className="input-field"
              value={form.weekStart}
              onChange={(e) => handleWeekStartChange(e.target.value)}
            />
            <span className="text-slate-400 text-sm">to</span>
            <input type="date" disabled className="input-field bg-slate-50" value={form.weekEnd} />
          </div>
        </div>
        <div>
          <label className="label">Project / category</label>
          <select
            required
            className="input-field"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
          >
            <option value="">Select a project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Tasks completed</label>
        <textarea
          required
          rows={3}
          className="input-field"
          placeholder="What did you get done this week?"
          value={form.tasksCompleted}
          onChange={(e) => setForm({ ...form, tasksCompleted: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Tasks planned for next week</label>
        <textarea
          required
          rows={3}
          className="input-field"
          placeholder="What's on deck for next week?"
          value={form.tasksPlanned}
          onChange={(e) => setForm({ ...form, tasksPlanned: e.target.value })}
        />
      </div>

      <div>
        <label className="label">Blockers / challenges</label>
        <textarea
          rows={2}
          className="input-field"
          placeholder="Anything slowing you down? Leave blank if none."
          value={form.blockers}
          onChange={(e) => setForm({ ...form, blockers: e.target.value })}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Hours worked (optional)</label>
          <input
            type="number"
            min={0}
            max={168}
            className="input-field"
            value={form.hoursWorked}
            onChange={(e) => setForm({ ...form, hoursWorked: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Notes / links (optional)</label>
          <input
            className="input-field"
            placeholder="Any relevant links or context"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          disabled={busy}
          onClick={handleSubmit("submitted")}
          className="btn-primary"
        >
          {busy ? "Saving..." : "Submit report"}
        </button>
        <button type="button" disabled={busy} onClick={handleSubmit("draft")} className="btn-secondary">
          Save as draft
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
