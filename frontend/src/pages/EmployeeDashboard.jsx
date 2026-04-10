import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchMyLeaves, fetchMyAttendance } from "../services/api";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";

const today = () => new Date().toISOString().split("T")[0];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMyLeaves(), fetchMyAttendance()])
      .then(([l, a]) => {
        setLeaves(l.data.leaves);
        setAttendance(a.data.records);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const presentDays = attendance.filter((a) => a.status === "Present").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-slate-500 text-sm mt-1">Here's your HR overview — {today()}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🏖️" label="Leave Balance" value={user?.leaveBalance ?? "—"} borderColor="border-blue-100" />
        <StatCard icon="⏳" label="Pending Leaves" value={pending} borderColor="border-amber-100" />
        <StatCard icon="✅" label="Approved Leaves" value={approved} borderColor="border-emerald-100" />
        <StatCard icon="📅" label="Days Present" value={presentDays} borderColor="border-purple-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leaves */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Leave Requests</h3>
          </div>
          <div className="p-5 space-y-3">
            {leaves.length === 0 && <p className="text-slate-400 text-sm">No leave requests yet.</p>}
            {leaves.slice(0, 4).map((l) => (
              <div key={l._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{l.type} Leave</p>
                  <p className="text-xs text-slate-400">{l.startDate} → {l.endDate} · {l.totalDays}d</p>
                </div>
                <Badge status={l.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Attendance</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {attendance.length === 0 && (
              <p className="p-5 text-slate-400 text-sm">No attendance records yet.</p>
            )}
            {attendance.slice(0, 5).map((a) => (
              <div key={a._id} className="flex items-center justify-between px-5 py-3">
                <p className="text-sm text-slate-700 font-medium">{a.date}</p>
                <Badge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
