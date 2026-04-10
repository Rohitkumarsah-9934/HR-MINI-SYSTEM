const StatCard = ({ icon, label, value, borderColor = "border-blue-100" }) => (
  <div className={`bg-white rounded-2xl p-6 border ${borderColor} shadow-sm`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default StatCard;
