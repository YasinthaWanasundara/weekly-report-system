import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const palette = ["#3763f2", "#5a89ff", "#8ab0ff", "#f59e0b", "#10b981", "#ef4444"];

export default function WorkloadChart({ data }) {
  const chartData = data.map((d) => ({ name: d.projectName, value: d.totalHours || d.reportCount }));

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900 mb-4">Workload Distribution by Project</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={palette[i % palette.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {chartData.length === 0 && (
        <p className="text-sm text-slate-400 text-center mt-2">No workload data for this week yet.</p>
      )}
    </div>
  );
}
