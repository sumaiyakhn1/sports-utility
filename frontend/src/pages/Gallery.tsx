import { useEffect, useState } from "react";
import { getAchievements } from "../api/achievementApi";
import { getStudentById } from "../api/studentApi";
import { Search, Trophy, MapPin, Calendar, X, Eye } from "lucide-react";
import toast from "react-hot-toast";

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([]);

  // Filter States
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [uniqueGames, setUniqueGames] = useState<string[]>([]);
  const [uniqueLevels, setUniqueLevels] = useState<string[]>([]);

  // Modal Detail States
  const [selectedAch, setSelectedAch] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [fullStudentData, setFullStudentData] = useState<any | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await getAchievements({ limit: 1000 });
      const list = res.data.data.achievements || [];
      setAchievements(list);
      setFilteredAchievements(list);

      // Extract unique games and levels (results) for filter dropdowns
      const games = new Set<string>();
      const levels = new Set<string>();
      list.forEach((ach: any) => {
        if (ach.game) games.add(ach.game);
        if (ach.results) {
          const formatted = ach.results.charAt(0).toUpperCase() + ach.results.slice(1).toLowerCase();
          levels.add(formatted);
        }
      });
      setUniqueGames(Array.from(games));
      setUniqueLevels(Array.from(levels));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gallery champions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = achievements;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ach) =>
          ach.student?.name?.toLowerCase().includes(q) ||
          ach.game?.toLowerCase().includes(q) ||
          ach.competition?.toLowerCase().includes(q)
      );
    }

    if (gameFilter) {
      result = result.filter((ach) => ach.game === gameFilter);
    }

    if (levelFilter) {
      result = result.filter(
        (ach) => ach.results?.toLowerCase() === levelFilter.toLowerCase()
      );
    }

    setFilteredAchievements(result);
  }, [search, gameFilter, levelFilter, achievements]);

  const handleResetFilters = () => {
    setSearch("");
    setGameFilter("");
    setLevelFilter("");
  };

  // Open modal and fetch full student details
  const handleOpenDetails = async (ach: any) => {
    setSelectedAch(ach);
    if (!ach.student?._id) return;

    try {
      setModalLoading(true);
      const studentRes = await getStudentById(ach.student._id);
      setFullStudentData(studentRes.data.data.student);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complete student info");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedAch(null);
    setFullStudentData(null);
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Opening gallery repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <Trophy size={24} />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
            Achievement Gallery
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Shah Satnamji College Sports Repository — {filteredAchievements.length} champions on display
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative flex items-center">
            <Search size={14} className="text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, game, or competition..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition"
            />
          </div>

          {/* Filter by Game */}
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Filter by Game</option>
            {uniqueGames.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>

          {/* Filter by Level */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Filter by Level</option>
            {uniqueLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-16 text-center shadow-xs">
          <Trophy size={40} className="text-slate-350 mx-auto mb-3" />
          <p className="text-sm font-extrabold text-slate-700">No champions found</p>
          <p className="text-xs text-slate-400 mt-1">Try resetting filters to show all display records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((ach) => {
            const hasPhoto = !!ach.student?.photo;
            const photoUrl = ach.student?.photo;

            return (
              <div
                key={ach._id}
                className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col group"
              >
                {/* Photo Header Section */}
                <div className="h-48 relative overflow-hidden bg-slate-100 shrink-0">
                  {hasPhoto ? (
                    <img
                      src={photoUrl}
                      alt={ach.student?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-teal-700 flex flex-col items-center justify-center text-white/90 gap-1.5">
                      <span className="text-3xl font-black">
                        {ach.student?.name?.charAt(0)?.toUpperCase()}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                        {ach.game}
                      </span>
                    </div>
                  )}

                  {/* Badges Overlays */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                      {ach.results || "Participation"}
                    </span>
                  </div>

                  {/* Gradient Overlay for bottom text inside image */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end text-white">
                    <h3 className="text-base font-extrabold truncate">
                      {ach.student?.name}
                    </h3>
                    <p className="text-xs text-emerald-300 font-bold tracking-wide uppercase mt-0.5">
                      {ach.game}
                    </p>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    {/* Competition */}
                    <div className="flex items-start gap-2.5 text-xs text-slate-600">
                      <Trophy size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <p className="font-bold leading-snug line-clamp-2">
                        {ach.competition}
                      </p>
                    </div>

                    {/* Venue & Date */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">
                        {ach.venue || "—"} &bull; {ach.date ? new Date(ach.date).getFullYear() : "—"}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleOpenDetails(ach)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye size={12} />
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Details Modal Component */}
      {selectedAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white border border-slate-100 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute right-4.5 top-4.5 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="text-center border-b border-slate-100 pb-5 mb-5 pr-6">
              <h3 className="text-base font-extrabold text-slate-800 leading-tight">
                {selectedAch.student?.name}'s Achievement Details
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">
                Comprehensive information about {selectedAch.student?.name}'s sports achievements.
              </p>
            </div>

            {/* Loading Indicator */}
            {modalLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                <p className="text-xs font-bold text-slate-400">Loading champion profile details...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Circle Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    {fullStudentData?.photo ? (
                      <img
                        src={fullStudentData.photo}
                        alt={selectedAch.student?.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/20 shadow-md ring-4 ring-white"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center text-2xl font-black text-emerald-600 shadow-md ring-4 ring-white">
                        {selectedAch.student?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-5 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Admission No
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {fullStudentData?.admissionNo || selectedAch.student?.admissionNo || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Class
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {fullStudentData?.class || selectedAch.student?.class || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Date of Birth
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {fullStudentData?.dob
                        ? new Date(fullStudentData.dob).toLocaleDateString("en-GB")
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Contact No
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {fullStudentData?.phone || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Game / Sport
                    </p>
                    <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {selectedAch.game}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Result / Position
                    </p>
                    <div className="mt-1">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block">
                        {selectedAch.results || "Participation"}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 border-t border-slate-200/60 pt-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Competition
                    </p>
                    <p className="text-xs font-extrabold text-slate-850 mt-1 leading-snug">
                      {selectedAch.competition}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Venue & Date
                    </p>
                    <p className="text-xs font-extrabold text-slate-850 mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-slate-450 shrink-0" />
                      {selectedAch.venue || "—"}
                      {selectedAch.date && (
                        <>
                          <span className="text-slate-300 mx-1">|</span>
                          <Calendar size={12} className="text-slate-450 shrink-0" />
                          {new Date(selectedAch.date).toLocaleDateString("en-GB")}
                        </>
                      )}
                    </p>
                  </div>

                  {selectedAch.certificate && (
                    <div className="col-span-2 border-t border-slate-200/60 pt-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Certificate Document
                      </p>
                      <a
                        href={selectedAch.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline mt-1.5 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trophy size={12} />
                        View Certificate Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
