import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const colors = { submitted: "#10b981", pending: "#f59e0b", late: "#ef4444" };

export default function SubmissionStatusChart({ data }) {
  const chartData = data.map((d) => ({ name: d.name, status: d.status, value: 1 }));

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900 mb-4">Submission Status by Team Member</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" hide domain={[0, 1]} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip formatter={(_, __, props) => props.payload.status} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={colors[entry.status] || "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 justify-center mt-2 text-xs text-slate-500">
        {Object.entries(colors).map(([label, color]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
