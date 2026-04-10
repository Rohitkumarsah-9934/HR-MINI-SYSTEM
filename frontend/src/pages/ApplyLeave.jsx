import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { applyLeave } from "../services/api";

const calcDays = (start, end) => {
  if (!start || !end) return 0;
  const diff = Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
};

const ApplyLeave = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ type: "Casual", startDate: "", endDate: "", reason: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const days = calcDays(form.startDate, form.endDate);

  const handleSubmit = async () => {
    if (!form.startDate || !form.endDate) { setError("Please select start and end dates."); return; }
    if (form.endDate < form.startDate) { setError("End date must be after start date."); return; }
    setError("");
    setLoading(true);
    try {
      await applyLeave({ ...form });
      await refreshUser();
      setForm({ type: "Casual", startDate: "", endDate: "", reason: "" });
      showToast("Leave request submitted successfully!", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply leave.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Apply for Leave</h2>
      <p className="text-slate-500 text-sm mb-6">
        Current balance:{" "}
        <span className="font-bold text-blue-600">{user?.leaveBalance} days</span>
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        {/* Leave Type */}
        <div>
          <label className="text-slate-600 text-xs font-semibold mb-2 block uppercase tracking-wider">
            Leave Type
          </label>
          <div className="flex gap-3">
            {["Casual", "Sick", "Paid"].map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  form.type === t
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300"
                }`}
              >
                {t === "Casual" ? "🌴" : t === "Sick" ? "🤒" : "💰"} {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-600 text-xs font-semibold mb-2 block uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date" name="startDate" value={form.startDate} onChange={handle}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="text-slate-600 text-xs font-semibold mb-2 block uppercase tracking-wider">
              End Date
            </label>
            <input
              type="date" name="endDate" value={form.endDate} onChange={handle}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Days Preview */}
        {days > 0 && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            days > (user?.leaveBalance || 0)
              ? "bg-red-50 border-red-200"
              : "bg-blue-50 border-blue-100"
          }`}>
            <span className="text-2xl">{days > (user?.leaveBalance || 0) ? "⚠️" : "📅"}</span>
            <div>
              <p className={`text-sm font-bold ${days > (user?.leaveBalance || 0) ? "text-red-700" : "text-blue-700"}`}>
                {days} day{days > 1 ? "s" : ""} requested
              </p>
              {days > (user?.leaveBalance || 0) && (
                <p className="text-red-500 text-xs">Exceeds your balance of {user?.leaveBalance} days</p>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="text-slate-600 text-xs font-semibold mb-2 block uppercase tracking-wider">
            Reason <span className="text-slate-400 normal-case">(optional)</span>
          </label>
          <textarea
            name="reason" value={form.reason} onChange={handle} rows={3}
            placeholder="Briefly describe the reason for your leave..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
            : "Submit Leave Request →"}
        </button>
      </div>
    </div>
  );
};

export default ApplyLeave;
