export default function SummaryCard({ label, value, sublabel, accent = "brand" }) {
  const accentClasses = {
    brand: "text-brand-600",
    emerald: "text-emerald-600",
    red: "text-red-600",
    amber: "text-amber-600",
  };

  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accentClasses[accent]}`}>{value}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  );
}
