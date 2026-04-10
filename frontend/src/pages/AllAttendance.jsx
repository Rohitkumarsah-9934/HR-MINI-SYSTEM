import { useState, useEffect } from "react";
import { fetchAllAttendance, fetchEmployees } from "../services/api";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";

const AllAttendance = () => {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmp, setFilterEmp] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchEmployees().then((res) => setEmployees(res.data.employees));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filterEmp) params.employeeId = filterEmp;
    if (filterDate) params.date = filterDate;
    fetchAllAttendance(params)
      .then((res) => setRecords(res.data.records))
      .finally(() => setLoading(false));
  }, [filterEmp, filterDate]);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">All Attendance Records</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-slate-800">{records.length}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Records</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">{presentCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Present</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-extrabold text-rose-500">{absentCount}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Absent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <select
          value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
        >
          <option value="">All Employees</option>
          {employees.map((e) => (
            <option key={e._id} value={e._id}>{e.name}</option>
          ))}
        </select>
        <input
          type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
        />
        {(filterEmp || filterDate) && (
          <button
            onClick={() => { setFilterEmp(""); setFilterDate(""); }}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition bg-white"
          >
            Clear Filters ✕
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((r, i) => (
                <tr key={r._id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-xs text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {r.userId?.name?.[0] || "?"}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{r.userId?.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-500">{r.userId?.email || "—"}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 font-medium">{r.date}</td>
                  <td className="px-5 py-3"><Badge status={r.status} /></td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAttendance;
