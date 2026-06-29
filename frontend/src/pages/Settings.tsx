import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, KeyRound, ShieldAlert } from "lucide-react";
import { updateCredentials } from "../api/adminApi";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword.length < 10) {
      toast.error("New password must be at least 10 characters.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await updateCredentials({
        username: username.trim() || undefined,
        currentPassword,
        newPassword: newPassword || undefined,
      });

      toast.success("Credentials Updated Successfully");
      setUsername("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl animate-in fade-in duration-300">
      {/* Title Card */}
      <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <KeyRound size={20} />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">
              Change Admin Credentials
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Update admin username or sign-in credentials
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Username */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              New Username
            </label>
            <input
              type="text"
              placeholder="Leave empty if not changing"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Required to authorize changes"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition cursor-pointer"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">
                New Password
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">
                Min 10 characters
              </span>
            </div>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Leave empty if not changing"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition cursor-pointer"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password details"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Call Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-350 text-white font-bold py-3.5 rounded-2xl transition duration-205 flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              "Save Credentials"
            )}
          </button>
        </form>

        {/* Informative Notice Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 text-slate-500">
          <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-semibold leading-relaxed">
            Note: Changing the admin login username or password will invalidate any current sessions. You may need to sign back in with your updated credentials.
          </p>
        </div>
      </div>
    </div>
  );
}