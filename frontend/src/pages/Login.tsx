import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Trophy, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(username, password);
      toast.success("Welcome back! Login Successful");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Brand Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex-col items-start justify-between p-16 relative overflow-hidden text-white">
        {/* Decorative Background Patterns */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full border-4 border-white" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-emerald-400" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-wider leading-tight">
              SHAH SATNAMJI
            </h2>
            <p className="text-xs font-bold text-emerald-400 leading-tight">
              COLLEGE SPORTS PORTAL
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 mb-8 shadow-sm">
            <Trophy size={32} className="text-emerald-400 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Sports Record ERP
          </h1>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
            Manage student athletes, upload achievement records, track tournament history, and issue sports gear with an integrated administrative command center.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Achievements
              </p>
              <p className="text-lg font-bold mt-1 text-white">Soft-verified tracking</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Inventory & Gear
              </p>
              <p className="text-lg font-bold mt-1 text-white">Dynamic assignment</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-xs text-emerald-200/50 relative z-10">
          Shah Satnamji College Sports Repository &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>

      {/* Right Panel - Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-100">
          {/* Mobile Brand Title */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-800 tracking-tight">
              Shah Satnamji Sports
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Login
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Sign in to manage athletes and record credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition duration-200"
                placeholder="Enter your admin username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 pr-12 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition duration-200"
                  placeholder="Enter your account password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded-sm border-slate-300 accent-emerald-600 focus:ring-emerald-500"
                />
                Keep me signed in
              </label>
              <span className="text-emerald-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-sm font-bold py-3.5 rounded-2xl transition duration-200 mt-4 flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Authorize Access
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Sports Record ERP &bull; V1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}