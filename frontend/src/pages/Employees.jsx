import { useState, useEffect } from "react";
import { fetchEmployees } from "../services/api";
import Spinner from "../components/Spinner";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees()
      .then((res) => setEmployees(res.data.employees))
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">All Employees</h2>
          <p className="text-slate-500 text-sm mt-0.5">{employees.length} total employees</p>
        </div>
        <input
          type="text" placeholder="🔍 Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64 bg-white"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-14 text-center">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-slate-400 text-sm">No employees found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((e) => (
            <div key={e._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-5">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0 shadow-md">
                {e.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-800">{e.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{e.email}</p>
                <p className="text-slate-400 text-xs">📅 Joined: {e.joinDate}</p>
              </div>

              {/* Leave balance */}
              <div className="text-right shrink-0">
                <p className={`text-2xl font-extrabold ${
                  e.leaveBalance <= 5 ? "text-rose-500" : e.leaveBalance <= 10 ? "text-amber-500" : "text-blue-600"
                }`}>
                  {e.leaveBalance}
                </p>
                <p className="text-slate-400 text-xs">days left</p>
                <div className="mt-1.5 h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      e.leaveBalance <= 5 ? "bg-rose-400" : e.leaveBalance <= 10 ? "bg-amber-400" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min((e.leaveBalance / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Employees;
