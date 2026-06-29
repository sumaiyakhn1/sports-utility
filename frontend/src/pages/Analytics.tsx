import { useEffect, useState } from "react";
import { getAchievements } from "../api/achievementApi";
import { getDashboard } from "../api/dashboardApi";
import { BarChart3, Trophy, Users, FileCheck, Medal, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Derived chart states
  const [gameStats, setGameStats] = useState<{ game: string; count: number }[]>([]);
  const [yearStats, setYearStats] = useState<{ year: string; count: number }[]>([]);
  const [resultsStats, setResultsStats] = useState<{ result: string; count: number }[]>([]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Fetch general dashboard summary stats
      const dashRes = await getDashboard();
      setDashboardStats(dashRes.data.data);

      // Fetch achievements list to build charts dynamically
      const achRes = await getAchievements({ limit: 1000 });
      const achList = achRes.data.data.achievements || [];
      setAchievements(achList);

      // Process achievements for "Achievements by Game"
      const gameMap: Record<string, number> = {};
      const yearMap: Record<string, number> = {};
      const resultsMap: Record<string, number> = {};

      achList.forEach((ach: any) => {
        // Game grouping
        const game = ach.game || "Other";
        gameMap[game] = (gameMap[game] || 0) + 1;

        // Year grouping
        if (ach.date) {
          const year = new Date(ach.date).getFullYear().toString();
          yearMap[year] = (yearMap[year] || 0) + 1;
        } else {
          yearMap["No Date"] = (yearMap["No Date"] || 0) + 1;
        }

        // Result / Level grouping
        const res = ach.results || "Participation";
        const normalizedRes = res.charAt(0).toUpperCase() + res.slice(1).toLowerCase();
        resultsMap[normalizedRes] = (resultsMap[normalizedRes] || 0) + 1;
      });

      setGameStats(
        Object.entries(gameMap)
          .map(([game, count]) => ({ game, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5 games
      );

      setYearStats(
        Object.entries(yearMap)
          .map(([year, count]) => ({ year, count }))
          .sort((a, b) => a.year.localeCompare(b.year))
      );

      setResultsStats(
        Object.entries(resultsMap)
          .map(([result, count]) => ({ result, count }))
          .sort((a, b) => b.count - a.count)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Compiling statistical insights...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic scale for SVGs
  const maxGameCount = gameStats.length > 0 ? Math.max(...gameStats.map((g) => g.count)) : 3;
  const maxYearCount = yearStats.length > 0 ? Math.max(...yearStats.map((y) => y.count)) : 3;

  // Round up scale bounds
  const getScaleBounds = (maxVal: number) => {
    const bound = Math.max(maxVal, 3);
    return {
      top: bound,
      midHigh: Number((bound * 0.75).toFixed(2)),
      midLow: Number((bound * 0.5).toFixed(2)),
      quarter: Number((bound * 0.25).toFixed(2)),
    };
  };

  const gameBounds = getScaleBounds(maxGameCount);
  const yearBounds = getScaleBounds(maxYearCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Analytics Dashboard Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <BarChart3 size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
            Analytics Dashboard
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Performance insights and statistical analytics across all sports disciplines
          </p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: dashboardStats?.totalStudents || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50/80",
            border: "border-blue-100/60",
          },
          {
            label: "Achievements",
            value: dashboardStats?.totalAchievements || 0,
            icon: Trophy,
            color: "text-emerald-600",
            bg: "bg-emerald-50/80",
            border: "border-emerald-100/60",
          },
          {
            label: "Sports Covered",
            value: dashboardStats?.sportsCovered || 0,
            icon: Medal,
            color: "text-purple-600",
            bg: "bg-purple-50/80",
            border: "border-purple-100/60",
          },
          {
            label: "Certificates",
            value: dashboardStats?.certificatesUploaded || 0,
            icon: FileCheck,
            color: "text-amber-600",
            bg: "bg-amber-50/80",
            border: "border-amber-100/60",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white border ${card.border} rounded-2xl p-5 shadow-xs flex items-center gap-4`}
            >
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-black text-slate-800 mt-1 leading-none">
                  {card.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row containing two main charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Achievements by Game */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <h3 className="text-sm font-extrabold text-slate-800">
              Achievements by Game
            </h3>
          </div>

          {gameStats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
              <Trophy size={32} strokeWidth={1.5} className="mb-2" />
              <p className="text-xs font-semibold">No game achievements recorded yet</p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Custom SVG Bar Chart */}
              <div className="relative h-64 flex w-full px-8 pb-4">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none border-l border-slate-200">
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {gameBounds.top}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {gameBounds.midHigh}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {gameBounds.midLow}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {gameBounds.quarter}
                    </span>
                  </div>
                  <div className="w-full border-b border-slate-200 relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      0
                    </span>
                  </div>
                </div>

                {/* Bars Container */}
                <div className="flex-1 h-full flex justify-around items-end relative z-10 pl-4">
                  {gameStats.map((item, index) => {
                    const heightPercent = (item.count / gameBounds.top) * 90; // max out at 90% of container height
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-end items-center group w-12 h-full"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs transition duration-200 pointer-events-none transform -translate-y-1">
                          {item.count} Wins
                        </div>
                        {/* The Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-8 bg-emerald-600 rounded-t-lg hover:bg-emerald-700 transition-all duration-300 shadow-sm cursor-pointer"
                        />
                        {/* X-Axis label */}
                        <span className="text-[10px] font-bold text-slate-400 mt-2 truncate w-full text-center">
                          {item.game}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 bg-emerald-600 rounded-sm" />
                Total Wins
              </div>
            </div>
          )}
        </div>

        {/* Achievements by Year */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-sm font-extrabold text-slate-800">
              Achievements by Year
            </h3>
          </div>

          {yearStats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
              <BarChart3 size={32} strokeWidth={1.5} className="mb-2" />
              <p className="text-xs font-semibold">No year data available</p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Custom SVG Bar Chart */}
              <div className="relative h-64 flex w-full px-8 pb-4">
                {/* Horizontal grid lines */}
                <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none border-l border-slate-200">
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {yearBounds.top}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {yearBounds.midHigh}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {yearBounds.midLow}
                    </span>
                  </div>
                  <div className="w-full border-t border-slate-100 border-dashed relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      {yearBounds.quarter}
                    </span>
                  </div>
                  <div className="w-full border-b border-slate-200 relative">
                    <span className="absolute -left-7 -top-2 text-[9px] font-bold text-slate-400">
                      0
                    </span>
                  </div>
                </div>

                {/* Bars Container */}
                <div className="flex-1 h-full flex justify-around items-end relative z-10 pl-4">
                  {yearStats.map((item, index) => {
                    const heightPercent = (item.count / yearBounds.top) * 90;
                    return (
                      <div
                        key={index}
                        className="flex flex-col justify-end items-center group w-12 h-full"
                      >
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xs transition duration-200 pointer-events-none transform -translate-y-1">
                          {item.count} Records
                        </div>
                        {/* The Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-8 bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-all duration-300 shadow-sm cursor-pointer"
                        />
                        {/* X-Axis label */}
                        <span className="text-[10px] font-bold text-slate-400 mt-2">
                          {item.year}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-500">
                <span className="w-3 h-3 bg-blue-600 rounded-sm" />
                Achievements
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Participation stats and levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation Statistics Breakdown */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <h3 className="text-sm font-extrabold text-slate-800 mb-5">
            Participation Statistics
          </h3>
          {resultsStats.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10 font-semibold">
              No results recorded
            </p>
          ) : (
            <div className="space-y-4">
              {resultsStats.map((item, index) => {
                const percentage = ((item.count / achievements.length) * 100).toFixed(0);
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">{item.result}</span>
                      <span className="text-slate-400">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full ${
                          index === 0
                            ? "bg-emerald-500"
                            : index === 1
                            ? "bg-blue-500"
                            : index === 2
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievement Verification Levels */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-5">
              Achievement Levels
            </h3>
            <p className="text-xs text-slate-400 font-semibold mb-6">
              Track the proportion of digital certificates uploaded to backup sports wins.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  With Certificates
                </p>
                <p className="text-3xl font-black text-emerald-800 mt-2">
                  {dashboardStats?.certificatesUploaded || 0}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Without Uploads
                </p>
                <p className="text-3xl font-black text-slate-500 mt-2">
                  {(dashboardStats?.totalAchievements || 0) - (dashboardStats?.certificatesUploaded || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Overall Verification Coverage:</span>
            <span className="font-extrabold text-slate-700">
              {dashboardStats?.totalAchievements > 0
                ? `${((dashboardStats.certificatesUploaded / dashboardStats.totalAchievements) * 100).toFixed(1)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
