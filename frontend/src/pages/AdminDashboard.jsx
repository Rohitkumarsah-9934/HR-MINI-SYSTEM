import { useState, useEffect } from "react";
import {
  fetchAllLeaves,
  fetchAllAttendance,
  fetchEmployees,
} from "../services/api";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";


const today = () => new Date().toISOString().split("T")[0];

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAllLeaves(),
      fetchAllAttendance({ date: today() }),
      fetchEmployees(),
    ])
      .then(([l, a, e]) => {
        setLeaves(l.data.leaves);
        setAttendance(a.data.records);
        setEmployees(e.data.employees);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const pending = leaves.filter((l) => l.status === "Pending").length;
  const presentToday = attendance.filter((a) => a.status === "Present").length;

  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">
          Admin Dashboard
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          System overview — {today()}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Employees"
          value={employees.length}
          borderColor="border-blue-100"
        />
        <StatCard
          icon="⏳"
          label="Pending Leaves"
          value={pending}
          borderColor="border-amber-100"
        />
        <StatCard
          icon="✅"
          label="Present Today"
          value={presentToday}
          borderColor="border-emerald-100"
        />
        <StatCard
          icon="📋"
          label="Total Leaves"
          value={leaves.length}
          borderColor="border-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Recent Leave Requests</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {leaves.slice(0, 5).map((l) => (
              <div
                key={l._id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {l.userId?.name || "—"} · {l.type}
                  </p>
                  <p className="text-xs text-slate-400">
                    {l.startDate} → {l.endDate} ({l.totalDays}d)
                  </p>
                </div>
                <Badge status={l.status} />
              </div>
            ))}
            {leaves.length === 0 && (
              <p className="p-5 text-slate-400 text-sm">No leave requests.</p>
            )}
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Today's Attendance</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {attendance.slice(0, 5).map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between px-5 py-4"
              >
                <p className="text-sm font-semibold text-slate-700">
                  {a.userId?.name || "—"}
                </p>
                <Badge status={a.status} />
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="p-5 text-slate-400 text-sm">
                No attendance marked today.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Employee Quick View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">
            Employees ({employees.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {employees.slice(0, 5).map((e) => (
            <div key={e._id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {e.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">{e.name}</p>
                <p className="text-xs text-slate-400">{e.email}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-blue-600">
                  {e.leaveBalance}
                </p>
                <p className="text-xs text-slate-400">days left</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
