const statusMap = {
  Approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Rejected: "bg-red-100 text-red-700 border border-red-200",
  Pending: "bg-amber-100 text-amber-700 border border-amber-200",
  Present: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Absent: "bg-rose-100 text-rose-700 border border-rose-200",
};

const Badge = ({ status }) => (
  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusMap[status] || "bg-slate-100 text-slate-600"}`}>
    {status}
  </span>
);

export default Badge;
