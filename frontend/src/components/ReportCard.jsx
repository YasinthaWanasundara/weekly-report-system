import { formatWeekRange } from "../utils/date";

const statusStyles = {
  submitted: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
};

export default function ReportCard({ report, onEdit, onDelete }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="font-semibold text-slate-900">
            {formatWeekRange(report.weekStart, report.weekEnd)}
          </p>
          <p className="text-sm text-slate-500">{report.project?.name || "No project"}</p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full uppercase ${
            statusStyles[report.status]
          }`}
        >
          {report.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Completed: </span>
          {report.tasksCompleted}
        </p>
        <p>
          <span className="font-medium text-slate-800">Planned: </span>
          {report.tasksPlanned}
        </p>
        {report.blockers && (
          <p>
            <span className="font-medium text-red-700">Blockers: </span>
            {report.blockers}
          </p>
        )}
        {report.hoursWorked != null && report.hoursWorked !== "" && (
          <p className="text-slate-400">{report.hoursWorked} hrs logged</p>
        )}
      </div>

      <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
        <button onClick={() => onEdit(report)} className="text-sm text-brand-600 font-medium">
          Edit
        </button>
        <button onClick={() => onDelete(report)} className="text-sm text-red-500 font-medium">
          Delete
        </button>
      </div>
    </div>
  );
}
