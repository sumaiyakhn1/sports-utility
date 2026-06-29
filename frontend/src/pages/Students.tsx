import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAchievements, deleteAchievement } from "../api/achievementApi";
import { getStudents, deleteStudent } from "../api/studentApi";
import { uploadExcel } from "../api/excelApi";
import {
  Search,
  Trophy,
  Plus,
  Trash2,
  Edit2,
  FileSpreadsheet,
  FileDown,
  Printer,
  Database,
  Upload,
  RefreshCw,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Students() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([]);

  // Filter Dropdowns Lists
  const [courses, setCourses] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  // Filter States
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [zoneFilter, setZoneFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // DB Operations
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAchievements({ limit: 1000 });
      const list = res.data.data.achievements || [];
      setAchievements(list);
      setFilteredAchievements(list);

      // Extract unique list for filter dropdowns dynamically
      const uniqueCourses = new Set<string>();
      const uniqueSports = new Set<string>();
      const uniqueVenues = new Set<string>();
      const uniqueYears = new Set<string>();

      list.forEach((ach: any) => {
        if (ach.student?.class) {
          // Normalize course name from student class
          const course = ach.student.class.trim();
          uniqueCourses.add(course);
        }
        if (ach.game) uniqueSports.add(ach.game.trim());
        if (ach.venue) uniqueVenues.add(ach.venue.trim());
        if (ach.date) {
          const yr = new Date(ach.date).getFullYear().toString();
          uniqueYears.add(yr);
        }
      });

      setCourses(Array.from(uniqueCourses));
      setSports(Array.from(uniqueSports));
      setVenues(Array.from(uniqueVenues));
      setYears(Array.from(uniqueYears).sort((a, b) => b.localeCompare(a)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load achievements records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter calculation logic
  useEffect(() => {
    let result = achievements;

    // Global text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (ach) =>
          ach.student?.name?.toLowerCase().includes(q) ||
          ach.student?.admissionNo?.toLowerCase().includes(q) ||
          ach.game?.toLowerCase().includes(q) ||
          ach.competition?.toLowerCase().includes(q)
      );
    }

    // Select dropdown filters
    if (courseFilter) {
      result = result.filter((ach) => ach.student?.class === courseFilter);
    }
    if (sportFilter) {
      result = result.filter((ach) => ach.game === sportFilter);
    }
    if (venueFilter) {
      result = result.filter((ach) => ach.venue === venueFilter);
    }
    if (zoneFilter) {
      result = result.filter((ach) =>
        ach.results?.toLowerCase().includes(zoneFilter.toLowerCase())
      );
    }
    if (yearFilter) {
      result = result.filter(
        (ach) => ach.date && new Date(ach.date).getFullYear().toString() === yearFilter
      );
    }

    setFilteredAchievements(result);
    setCurrentPage(1); // Reset page to 1 on filter
  }, [search, courseFilter, sportFilter, venueFilter, zoneFilter, yearFilter, achievements]);

  const handleResetFilters = () => {
    setSearch("");
    setCourseFilter("");
    setSemesterFilter("");
    setSectionFilter("");
    setSportFilter("");
    setZoneFilter("");
    setVenueFilter("");
    setYearFilter("");
  };

  // Pagination indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAchievements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAchievements.length / itemsPerPage);

  // File Exporters
  const handleExportExcel = () => {
    if (filteredAchievements.length === 0) {
      toast.error("No records to export");
      return;
    }

    // Build standard CSV
    const headers = [
      "Sr. No.",
      "Name",
      "Class",
      "Admission No",
      "Date of Birth",
      "Game / Sport",
      "Competition",
      "Venue",
      "Date",
      "Result / Position",
      "Contact No",
    ];

    const rows = filteredAchievements.map((ach, idx) => [
      idx + 1,
      ach.student?.name || "—",
      ach.student?.class || "—",
      ach.student?.admissionNo || "—",
      ach.student?.dob ? new Date(ach.student.dob).toLocaleDateString("en-GB") : "—",
      ach.game || "—",
      ach.competition || "—",
      ach.venue || "—",
      ach.date ? new Date(ach.date).toLocaleDateString("en-GB") : "—",
      ach.results || "—",
      ach.student?.phone || "—",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Shah_Satnamji_College_Sports_Achievements_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Excel CSV file downloaded");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackupJSON = () => {
    if (filteredAchievements.length === 0) {
      toast.error("No records to backup");
      return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(filteredAchievements, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `Sports_DB_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    toast.success("Database JSON backup downloaded successfully");
  };

  // Direct Excel Upload Handler
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await uploadExcel(file);
      toast.success("Excel imported successfully!");
      loadData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Excel import failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Achievement record row
  const handleDeleteRow = async (ach: any) => {
    if (!window.confirm(`Are you sure you want to delete this achievement for ${ach.student?.name}?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteAchievement(ach._id);
      // If student has no other achievements, we can delete the student record too, or just let them manage it
      toast.success("Record deleted successfully");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Delete operation failed");
      setLoading(false);
    }
  };

  // Reset entire Database (sequential soft delete of all records)
  const handleResetDB = async () => {
    try {
      setLoading(true);
      setResetConfirmOpen(false);

      // Soft delete all achievements
      for (const ach of achievements) {
        await deleteAchievement(ach._id);
      }

      // Soft delete all students
      const studentsRes = await getStudents({ limit: 1000 });
      const studentsList = studentsRes.data.data.students || [];
      for (const st of studentsList) {
        await deleteStudent(st._id);
      }

      toast.success("Database reset successful. All records soft deleted.");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset database");
      setLoading(false);
    }
  };

  if (loading && achievements.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Querying achievements repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 print:bg-white print:p-0">
      {/* Title Header Card (Hidden on Print) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
              Achievements Records
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">
              Shah Satnamji College Sports Repository &mdash; {filteredAchievements.length} records found
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter Bar Panel (Hidden on Print) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4 print:hidden">
        {/* Row 1 Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search Input */}
          <div className="relative flex items-center lg:col-span-1">
            <Search size={14} className="text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, admission no, game..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition"
            />
          </div>

          {/* Course */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Semester (Mock/Empty placeholder) */}
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

          {/* Section (Mock/Empty placeholder) */}
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Section</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>

          {/* Sport */}
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Sport</option>
            {sports.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>

          {/* Zone / Level */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Zone / Level</option>
            <option value="Gold">Gold Medal</option>
            <option value="Silver">Silver Medal</option>
            <option value="Bronze">Bronze Medal</option>
            <option value="Participation">Participation</option>
            <option value="Inter-College">Inter-College</option>
            <option value="National">National</option>
            <option value="International">International</option>
          </select>
        </div>

        {/* Row 2 Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 lg:w-[66.6%]">
          {/* Venue */}
          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Venue</option>
            {venues.map((vn) => (
              <option key={vn} value={vn}>
                {vn}
              </option>
            ))}
          </select>

          {/* Year */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/60 focus:bg-white transition cursor-pointer"
          >
            <option value="">Year</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
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

      {/* Action Buttons Row (Hidden on Print) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4.5 print:hidden">
        {/* Left Side Download & Backup */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <FileSpreadsheet size={14} />
            Export Excel
          </button>

          {/* Export PDF */}
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <FileDown size={14} />
            Export PDF
          </button>

          {/* Print List */}
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Printer size={14} />
            Print List
          </button>

          {/* Backup JSON */}
          <button
            onClick={handleBackupJSON}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Database size={14} />
            Backup JSON
          </button>
        </div>

        {/* Right Side Create & Reset */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Hidden File Input for Excel Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleExcelImport}
            accept=".xlsx,.xls"
            className="hidden"
          />

          {/* Import Excel */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Upload size={14} />
            Import Excel
          </button>

          {/* Add Record */}
          <button
            onClick={() => navigate("/students/add")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Add Record
          </button>

          {/* Reset DB */}
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-orange-500/30 text-orange-600 hover:text-red-750 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} />
            Reset DB
          </button>
        </div>
      </div>

      {/* Database Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setResetConfirmOpen(false)}
          />
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl max-w-md w-full z-10 space-y-4">
            <div className="flex items-center gap-2.5 text-orange-600">
              <AlertTriangle size={24} />
              <h4 className="text-sm font-extrabold text-slate-800">
                Warning: Reset Database
              </h4>
            </div>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              This action will soft-delete all registered students and their sports achievements in the system database. This cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDB}
                className="px-4 py-2 bg-orange-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Records Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs print:border-0 print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center w-14">Sr. No.</th>
                <th className="px-4 py-3.5 w-14">Photo</th>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Admission No.</th>
                <th className="px-4 py-3.5">Date of Birth</th>
                <th className="px-4 py-3.5">Game</th>
                <th className="px-5 py-3.5">Competition Name</th>
                <th className="px-4 py-3.5">Venue</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-center">Result</th>
                <th className="px-4 py-3.5">Contact No.</th>
                <th className="px-4 py-3.5 text-center">Certificate</th>
                <th className="px-4 py-3.5 text-center w-28 print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center text-slate-400 font-semibold">
                    No achievements records matching filters.
                  </td>
                </tr>
              ) : (
                currentItems.map((ach, idx) => {
                  const hasPhoto = !!ach.student?.photo;
                  const photoUrl = ach.student?.photo;

                  return (
                    <tr key={ach._id} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-3 text-center font-mono text-slate-400">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        {hasPhoto ? (
                          <img
                            src={photoUrl}
                            alt={ach.student?.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-100 shadow-xs"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-emerald-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-emerald-600">
                            {ach.student?.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-800 font-extrabold whitespace-nowrap">
                        {ach.student?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ach.student?.class}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-450">
                        {ach.student?.admissionNo}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {ach.student?.dob
                          ? new Date(ach.student.dob).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-850 font-bold whitespace-nowrap">
                        {ach.game}
                      </td>
                      <td className="px-5 py-3 leading-snug max-w-xs truncate-2-lines">
                        {ach.competition}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ach.venue || "—"}</td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap">
                        {ach.date ? new Date(ach.date).toLocaleDateString("en-GB") : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eefcf4] text-emerald-700 border border-emerald-500/10">
                          {ach.results || "Participation"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono whitespace-nowrap">
                        {ach.student?.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ach.certificate ? (
                          <a
                            href={ach.certificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-100 items-center justify-center text-red-500 transition cursor-pointer"
                            title="View Certificate"
                          >
                            <FileText size={14} />
                          </a>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Navigate to Profile */}
                          <button
                            onClick={() => navigate(`/students/${ach.student?._id}`)}
                            title="View Student"
                            className="w-7 h-7 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 transition cursor-pointer"
                          >
                            <Eye size={12} />
                          </button>
                          {/* Edit Student */}
                          <button
                            onClick={() => navigate(`/students/edit/${ach.student?._id}`)}
                            title="Edit Record"
                            className="w-7 h-7 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700 transition cursor-pointer"
                          >
                            <Edit2 size={12} />
                          </button>
                          {/* Delete Achievement Row */}
                          <button
                            onClick={() => handleDeleteRow(ach)}
                            title="Delete Record"
                            className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg flex items-center justify-center text-red-650 transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Section (Hidden on Print) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4.5 bg-slate-50/20 print:hidden">
            <span className="text-xs text-slate-450 font-semibold">
              Showing page <span className="font-extrabold text-slate-700">{currentPage}</span> of{" "}
              <span className="font-extrabold text-slate-700">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-450 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-450 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}