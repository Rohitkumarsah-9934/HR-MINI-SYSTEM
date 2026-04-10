import { useState, useEffect } from "react";
import { fetchMyLeaves, cancelLeave } from "../services/api";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";

const MyLeaves = () => {
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchMyLeaves()
      .then((res) => setLeaves(res.data.leaves))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    try {
      await cancelLeave(id);
      showToast("Leave request cancelled.", "info");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to cancel.", "error");
    }
  };

  if (loading) return <Spinner />;

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">My Leave History</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Pending", count: pending, color: "bg-amber-50 border-amber-100 text-amber-700" },
          { label: "Approved", count: approved, color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
          { label: "Rejected", count: rejected, color: "bg-red-50 border-red-100 text-red-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.color}`}>
            <p className="text-2xl font-extrabold">{s.count}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {leaves.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-500 font-medium">No leave requests yet.</p>
          <p className="text-slate-400 text-sm mt-1">Apply for a leave to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div key={l._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base font-extrabold text-slate-800">
                      {l.type === "Casual" ? "🌴" : l.type === "Sick" ? "🤒" : "💰"} {l.type} Leave
                    </span>
                    <Badge status={l.status} />
                  </div>
                  <p className="text-slate-500 text-xs">
                    📅 {l.startDate} → {l.endDate}
                    <span className="ml-2 font-semibold text-slate-700">({l.totalDays} day{l.totalDays > 1 ? "s" : ""})</span>
                  </p>
                  {l.reason && (
                    <p className="text-slate-400 text-xs mt-1">📝 {l.reason}</p>
                  )}
                  <p className="text-slate-400 text-xs mt-1">Applied on: {l.appliedDate}</p>
                </div>
                {l.status === "Pending" && (
                  <button
                    onClick={() => handleCancel(l._id)}
                    className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition shrink-0"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLeaves;
