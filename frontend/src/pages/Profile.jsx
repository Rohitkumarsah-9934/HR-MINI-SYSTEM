import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const fields = [
    { icon: "👤", label: "Full Name", value: user?.name },
    { icon: "📧", label: "Email Address", value: user?.email },
    { icon: "🎭", label: "Role", value: user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) },
    { icon: "📅", label: "Date of Joining", value: user?.joinDate },
    ...(user?.role === "employee"
      ? [{ icon: "🏖️", label: "Leave Balance", value: `${user?.leaveBalance} days remaining` }]
      : []),
  ];

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">My Profile</h2>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-4xl font-extrabold text-white mx-auto mb-3 shadow-xl">
            {user?.name?.[0]}
          </div>
          <p className="text-white font-extrabold text-xl">{user?.name}</p>
          <p className="text-blue-200 text-sm capitalize mt-1">{user?.role}</p>
        </div>

        {/* Fields */}
        <div className="p-6 space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{f.label}</p>
                <p className="text-sm text-slate-800 font-semibold mt-0.5">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
