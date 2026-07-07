import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatDate } from "../../utils/date";

export default function TasksTrendChart({ data }) {
  const chartData = data.map((d) => ({
    week: formatDate(d.weekStart),
    reports: d.reportsSubmitted,
  }));

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900 mb-4">Reports Submitted Trend</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip />
          <Line type="monotone" dataKey="reports" stroke="#3763f2" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      {chartData.length === 0 && (
        <p className="text-sm text-slate-400 text-center mt-2">No submitted reports in this range yet.</p>
      )}
    </div>
  );
}
