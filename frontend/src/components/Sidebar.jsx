import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const empLinks = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/apply-leave", icon: "📝", label: "Apply Leave" },
  { to: "/my-leaves", icon: "📋", label: "My Leaves" },
  { to: "/attendance", icon: "✅", label: "Attendance" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const adminLinks = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/manage-leaves", icon: "📋", label: "Manage Leaves" },
  { to: "/all-attendance", icon: "✅", label: "All Attendance" },
  { to: "/employees", icon: "👥", label: "Employees" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

const Sidebar = ({ open, setOpen }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const links = user?.role === "admin" ? adminLinks : empLinks;

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login");
  };

  return (
    <aside
      onClick={(e) => e.stopPropagation()}
      className={`fixed top-0 left-0 md:static z-40 w-64 min-h-screen bg-slate-900 flex flex-col transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-900/50">
            🏢
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">
              HR MINI SYSTEM
            </p>
            
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">
              {user?.name}
            </p>
            <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setOpen(false)} 
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-900/40 transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
