import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { Bell, Search, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import { getStudents } from "../../api/studentApi";

export default function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recordsCount, setRecordsCount] = useState<number | null>(null);

  // Fetch count of students for the subtitle dynamically if we are on achievements page
  useEffect(() => {
    if (location.pathname.startsWith("/achievements") || location.pathname.startsWith("/students")) {
      getStudents({ limit: 1 })
        .then((res) => {
          setRecordsCount(res.data.data.totalStudents);
        })
        .catch((err) => console.error(err));
    }
  }, [location.pathname]);

  // Page titles and subtitles mapping
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
      return {
        title: "Dashboard",
        subtitle: "Shah Satnamji College Sports Portal",
      };
    } else if (path.startsWith("/achievements") || path.startsWith("/students")) {
      if (path.includes("/add")) {
        return {
          title: "Add Student Record",
          subtitle: "Create a new sports achievement profile",
        };
      }
      if (path.includes("/edit")) {
        return {
          title: "Edit Student Record",
          subtitle: "Update sports achievement details",
        };
      }
      return {
        title: "Achievements Records",
        subtitle: `Shah Satnamji College Sports Repository — ${recordsCount !== null ? recordsCount : "3"} records`,
      };
    } else if (path.startsWith("/gallery")) {
      return {
        title: "Achievement Gallery",
        subtitle: `Shah Satnamji College Sports Repository — ${recordsCount !== null ? recordsCount : "3"} champions on display`,
      };
    } else if (path.startsWith("/analytics")) {
      return {
        title: "Analytics Dashboard",
        subtitle: "Shah Satnamji College Sports Portal",
      };
    } else if (path.startsWith("/settings")) {
      return {
        title: "Settings",
        subtitle: "Manage admin portal credentials",
      };
    } else if (path.startsWith("/excel-import")) {
      return {
        title: "Excel Import",
        subtitle: "Bulk import student and achievements",
      };
    }
    return {
      title: "Sports Portal",
      subtitle: "Shah Satnamji College Sports Administration",
    };
  };

  const { title, subtitle } = getHeaderDetails();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0 relative z-40">
      <div className="flex items-center justify-between gap-4">
        {/* Left Page Title Info */}
        <div className="min-w-0 flex-1 sm:flex-initial">
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md relative">
          <Search size={16} className="text-slate-400 absolute left-4.5" />
          <input
            type="text"
            placeholder="Search players, games..."
            className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/60 transition"
          />
        </div>

        {/* Right Actions & Profile */}
        <div className="flex items-center gap-4.5">
          {/* Notification Bell */}
          <button className="relative w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center border border-slate-100 transition">
            <Bell size={18} className="text-slate-500" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {/* Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2.5 py-1.5 transition text-left cursor-pointer"
            >
              <div className="hidden sm:block">
                <p className="text-xs font-extrabold text-slate-700 leading-tight">
                  Sports Teacher
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-none">
                  Admin Panel
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 bg-emerald-50 flex items-center justify-center shrink-0">
                <User size={14} className="text-emerald-600" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-1.5 border-b border-slate-50 mb-1.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate mt-0.5">
                      {user?.username ?? "Admin"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition"
                  >
                    <SettingsIcon size={14} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50/50 transition border-t border-slate-50 mt-1.5 pt-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}