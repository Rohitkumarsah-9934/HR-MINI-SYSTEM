import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      showToast("Account created! Welcome ", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/50">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-blue-300 text-sm mt-1">Join the HRMS Portal</p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1.5 block">Full Name</label>
              <input name="name" value={form.name} onChange={handle} placeholder="Aryan Sharma"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1.5 block">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@company.com"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition" />
            </div>
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1.5 block">Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition" />
            </div>
             <div>
              <label className="text-slate-300 text-xs font-semibold mb-1.5 block">Role</label>
              <select name="role" value={form.role} onChange={handle}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition">
                <option value="employee">Employee</option>
                 <option value="admin">Admin</option> 
               </select>
            </div>  

            {error && (
              <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/50 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
              ) : "Create Account →"}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
