import { useEffect, useState } from "react";
import api from "../api/axios";
import SummaryCard from "../components/SummaryCard";
import TasksTrendChart from "../components/charts/TasksTrendChart";
import SubmissionStatusChart from "../components/charts/SubmissionStatusChart";
import WorkloadChart from "../components/charts/WorkloadChart";
import { mondayOf, formatWeekRange, formatDate } from "../utils/date";

export default function TeamDashboard() {
  const [week, setWeek] = useState(mondayOf());
  const [summary, setSummary] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [trend, setTrend] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [recent, setRecent] = useState([]);

  // Filters for the report table
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ member: "", project: "", from: "", to: "" });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    const [summaryRes, statusRes, trendRes, workloadRes, recentRes] = await Promise.all([
      api.get("/dashboard/summary", { params: { week } }),
      api.get("/dashboard/submission-status", { params: { week } }),
      api.get("/dashboard/tasks-trend", { params: { weeks: 8 } }),
      api.get("/dashboard/workload-by-project", { params: { week } }),
      api.get("/dashboard/recent-activity", { params: { limit: 8 } }),
    ]);
    setSummary(summaryRes.data);
    setStatusList(statusRes.data);
    setTrend(trendRes.data);
    setWorkload(workloadRes.data);
    setRecent(recentRes.data);
  };

  const loadFilters = async () => {
    const [membersRes, projectsRes] = await Promise.all([api.get("/users"), api.get("/projects")]);
    setMembers(membersRes.data);
    setProjects(projectsRes.data);
  };

  const loadReports = async () => {
    const params = {};
    if (filters.member) params.member = filters.member;
    if (filters.project) params.project = filters.project;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    const res = await api.get("/reports", { params });
    setReports(res.data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadDashboard(), loadFilters()]).finally(() => setLoading(false));
  }, [week]);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (loading || !summary) {
    return <p className="text-slate-400 text-sm">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Showing week: {formatWeekRange(summary.weekStart, summary.weekEnd)}
          </p>
        </div>
        <input
          type="date"
          value={week}
          onChange={(e) => setWeek(mondayOf(e.target.value))}
          className="input-field max-w-[180px]"
        />
      </div>

      {/* Summary metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          label="Reports Submitted"
          value={`${summary.reportsSubmitted}`}
          sublabel={`of ${summary.totalMembers} members`}
        />
        <SummaryCard
          label="Submission Compliance"
          value={`${summary.complianceRate}%`}
          accent="emerald"
          sublabel={`${summary.pendingMembers} pending`}
        />
        <SummaryCard label="Open Blockers" value={summary.openBlockers} accent="red" />
        <SummaryCard label="Team Size" value={summary.totalMembers} accent="amber" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TasksTrendChart data={trend} />
        <SubmissionStatusChart data={statusList} />
        <div className="lg:col-span-2">
          <WorkloadChart data={workload} />
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="card p-5">
        <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <ul className="divide-y divide-slate-100">
          {recent.map((r) => (
            <li key={r.id} className="py-2 text-sm flex justify-between">
              <span>
                <span className="font-medium text-slate-800">{r.user}</span> submitted a report for{" "}
                <span className="text-slate-600">{r.project}</span>
              </span>
              <span className="text-slate-400">{formatDate(r.submittedAt)}</span>
            </li>
          ))}
          {recent.length === 0 && <p className="text-slate-400 text-sm">No recent submissions.</p>}
        </ul>
      </div>

      {/* Filterable report table */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold text-slate-900">All Reports</h3>
          <div className="flex flex-wrap gap-2">
            <select
              className="input-field max-w-[160px]"
              value={filters.member}
              onChange={(e) => setFilters({ ...filters, member: e.target.value })}
            >
              <option value="">All members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <select
              className="input-field max-w-[160px]"
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="input-field max-w-[150px]"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
            <input
              type="date"
              className="input-field max-w-[150px]"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100">
                <th className="py-2 pr-4">Member</th>
                <th className="py-2 pr-4">Week</th>
                <th className="py-2 pr-4">Project</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Hours</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-50">
                  <td className="py-2 pr-4">{r.user?.name}</td>
                  <td className="py-2 pr-4">{formatWeekRange(r.weekStart, r.weekEnd)}</td>
                  <td className="py-2 pr-4">{r.project?.name}</td>
                  <td className="py-2 pr-4 capitalize">{r.status}</td>
                  <td className="py-2 pr-4">{r.hoursWorked ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <p className="text-slate-400 text-sm py-4 text-center">No reports match these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
