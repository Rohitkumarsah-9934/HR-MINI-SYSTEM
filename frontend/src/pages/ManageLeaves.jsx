import { useState, useEffect } from "react";
import { fetchAllLeaves, decideLeave } from "../services/api";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";

const ManageLeaves = () => {
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [deciding, setDeciding] = useState(null);

  const load = () => {
    fetchAllLeaves()
      .then((res) => setLeaves(res.data.leaves))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDecide = async (id, status) => {
    setDeciding(id + status);
    try {
      await decideLeave(id, status);
      showToast(`Leave ${status.toLowerCase()} successfully.`, status === "Approved" ? "success" : "info");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed.", "error");
    } finally {
      setDeciding(null);
    }
  };

  if (loading) return <Spinner />;

  const filtered = filter === "All" ? leaves : leaves.filter((l) => l.status === filter);
  const counts = {
    All: leaves.length,
    Pending: leaves.filter((l) => l.status === "Pending").length,
    Approved: leaves.filter((l) => l.status === "Approved").length,
    Rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Manage Leave Requests</h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === f
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}
          >
            {f} <span className="ml-1 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-14 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-slate-400 text-sm">No {filter.toLowerCase()} leave requests.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((l) => (
              <div key={l._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {l.userId?.name?.[0] || "?"}
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{l.userId?.name || "Unknown"}</p>
                    <Badge status={l.status} />
                  </div>
                  <div className="ml-10">
                    <p className="text-slate-600 text-sm">
                      {l.type === "Casual" ? "🌴" : l.type === "Sick" ? "🤒" : "💰"}{" "}
                      <span className="font-semibold">{l.type} Leave</span> ·{" "}
                      {l.startDate} → {l.endDate} ·{" "}
                      <span className="font-semibold">{l.totalDays} day{l.totalDays > 1 ? "s" : ""}</span>
                    </p>
                    {l.reason && <p className="text-slate-400 text-xs mt-0.5">📝 {l.reason}</p>}
                    <p className="text-slate-400 text-xs mt-0.5">Applied: {l.appliedDate}</p>
                  </div>
                </div>

                {l.status === "Pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDecide(l._id, "Approved")}
                      disabled={deciding === l._id + "Approved"}
                      className="px-4 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {deciding === l._id + "Approved"
                        ? <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        : "✅"} Approve
                    </button>
                    <button
                      onClick={() => handleDecide(l._id, "Rejected")}
                      disabled={deciding === l._id + "Rejected"}
                      className="px-4 py-2 text-xs font-semibold text-red-700 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {deciding === l._id + "Rejected"
                        ? <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        : "❌"} Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLeaves;
