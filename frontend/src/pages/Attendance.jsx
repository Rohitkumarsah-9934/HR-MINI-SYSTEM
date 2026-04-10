import { useState, useEffect } from "react";
import { fetchMyAttendance, markAttendance } from "../services/api";
import { useToast } from "../context/ToastContext";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";

const today = () => new Date().toISOString().split("T")[0];

const Attendance = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () => {
    fetchMyAttendance()
      .then((res) => setRecords(res.data.records))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const todayRecord = records.find((r) => r.date === today());
  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const attendancePct = records.length > 0
    ? Math.round((presentCount / records.length) * 100)
    : 0;

  const handleMark = async (status) => {
    if (todayRecord) { showToast("Already marked for today.", "error"); return; }
    setMarking(true);
    try {
      await markAttendance(status);
      showToast(`Marked as ${status} for today! ✅`, "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to mark attendance.", "error");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Attendance</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">{presentCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Present Days</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-rose-500">{absentCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Absent Days</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-blue-600">{attendancePct}%</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Attendance Rate</p>
        </div>
      </div>

      {/* Mark Today */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-800 mb-1">Mark Today's Attendance</h3>
        <p className="text-slate-400 text-xs mb-4">📅 {today()}</p>

        {todayRecord ? (
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm border ${
            todayRecord.status === "Present"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}>
            {todayRecord.status === "Present" ? "✅" : "❌"}
            Already marked as <strong>{todayRecord.status}</strong> today
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => handleMark("Present")} disabled={marking}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-2"
            >
              {marking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "✅"}
              Mark Present
            </button>
            <button
              onClick={() => handleMark("Absent")} disabled={marking}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition shadow-md flex items-center gap-2"
            >
              ❌ Mark Absent
            </button>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Attendance History</h3>
        </div>
        {records.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No attendance records found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((r, i) => (
                <tr key={r._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3 text-sm text-slate-700 font-medium">{r.date}</td>
                  <td className="px-5 py-3"><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
