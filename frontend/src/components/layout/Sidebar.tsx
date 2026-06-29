import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Achievements", path: "/achievements", icon: Trophy },
  { name: "Gallery", path: "/gallery", icon: ImageIcon },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col bg-white border-r border-slate-200 text-slate-700 shrink-0">
      {/* Brand / Logo Section */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Custom Green Shield SVG Logo */}
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
            <svg
              className="w-6 h-6 text-emerald-600"
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
            <h1 className="text-sm font-extrabold text-slate-800 leading-tight">
              Shah Satnamji
            </h1>
            <p className="text-xs font-bold text-emerald-600 leading-tight">
              College Sports
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 px-4 py-6">
        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-4">
          Menu
        </p>
        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#eefcf4] text-emerald-700 border border-emerald-500/20 shadow-xs"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Excellence Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-[#f0fdf4] border border-emerald-500/10 rounded-2xl p-4 flex flex-col gap-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Trophy size={14} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-emerald-800">
              Excellence in Sports
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Celebrating every champion
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}