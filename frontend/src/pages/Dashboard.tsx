import { useEffect, useState } from "react";
import { getStudents, getStudentById } from "../api/studentApi";
import {
  User,
  Info,
  Trophy,
  ExternalLink,
  Gamepad2,
  Award,
  ShoppingBag,
  ArrowRight,
  FileText,
  Calendar,
  GraduationCap,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Student specific data
  const [student, setStudent] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  // Load all students for the dropdown selection
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await getStudents({ limit: 1000, sortBy: "name", order: "asc" });
        const list = res.data.data.students || [];
        setStudents(list);

        if (list.length > 0) {
          setSelectedStudentId(list[0]._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load athletes list");
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  // Fetch student details whenever selected student changes
  useEffect(() => {
    if (!selectedStudentId) return;

    const loadStudentData = async () => {
      try {
        setDataLoading(true);
        const res = await getStudentById(selectedStudentId);
        setStudent(res.data.data.student);
        setAchievements(res.data.data.achievements || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load athlete profile details");
      } finally {
        setDataLoading(false);
        setLoading(false);
      }
    };
    loadStudentData();
  }, [selectedStudentId]);

  // Generate dynamic inventory items based on the sport the athlete plays
  const getMockInventory = (game: string) => {
    const sportName = (game || "general").toLowerCase();

    if (sportName.includes("skating")) {
      return [
        { id: "12025-01", name: "Roller Skates (Standard)", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-02", name: "Protective Safety Helmet", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-03", name: "Elbow & Knee Guards Kit", qty: 1, issued: 1, status: "Returned" },
      ];
    } else if (sportName.includes("cricket")) {
      return [
        { id: "12025-01", name: "Kashmir Willow Bat", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-02", name: "Batting Pads & Gloves Set", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-03", name: "Leather Cricket Balls", qty: 3, issued: 3, status: "Returned" },
      ];
    } else if (sportName.includes("football") || sportName.includes("soccer")) {
      return [
        { id: "12025-01", name: "Leather Football Size 5", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-02", name: "Shin Guards (Pair)", qty: 1, issued: 1, status: "Returned" },
        { id: "12025-03", name: "Training Bib Jersey", qty: 2, issued: 2, status: "Returned" },
      ];
    }

    // Default general inventory items (e.g. Kabaddi / General)
    return [
      { id: "12025-01", name: "Kabaddi Jersey", qty: 20, issued: 12, status: "Returned" },
      { id: "12025-02", name: "Training Tracksuit", qty: 1, issued: 1, status: "Returned" },
    ];
  };

  // Generate dynamic training/attendance details
  const getMockTraining = (game: string) => {
    const sport = game || "Kabaddi";
    let coachName = "Mr. Rishu";

    if (sport.toLowerCase().includes("cricket")) {
      coachName = "Mr. Sharma";
    } else if (sport.toLowerCase().includes("football")) {
      coachName = "Mr. Verma";
    }

    return [
      { id: "TR2025-01", date: "15-09-2025", game: sport, coach: coachName, attendance: "Present" },
    ];
  };

  // Generate dynamic scholarship details
  const getMockScholarship = (admissionNo: string) => {
    return [
      { id: "S2025-01", playerId: admissionNo || "1001", scheme: "50% Fee Concession", year: "2025-26" },
    ];
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-500">Accessing Sports ERP records...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xs">
        <User size={40} className="text-slate-455 mx-auto mb-3" />
        <p className="text-sm font-extrabold text-slate-700">No athletes registered yet</p>
        <p className="text-xs text-slate-400 mt-1">Please import records or register a student first.</p>
      </div>
    );
  }

  const athleteSport = achievements.length > 0 ? achievements[0].game : "General Sports";
  const mockInventory = getMockInventory(athleteSport);
  const mockTraining = getMockTraining(athleteSport);
  const mockScholarship = getMockScholarship(student?.admissionNo);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Dropdown Selector Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
            <Gamepad2 size={20} />
          </div>
          <h2 className="text-sm font-extrabold tracking-wider text-slate-700 uppercase">
            DASHBOARD
          </h2>
        </div>

        {/* Dropdown element */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 shrink-0">
            Select Athlete:
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 font-extrabold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/65 transition cursor-pointer max-w-xs truncate shadow-xs"
          >
            {students.map((st) => (
              <option key={st._id} value={st._id}>
                {st.name} ({st.admissionNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Large Wrapper Card - Matches Image 3 Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative">
        {/* Three Dots Menu Option Icon */}
        <div className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 cursor-pointer">
          <MoreVertical size={20} />
        </div>

        {/* ERP Main Title Header inside Card */}
        <div className="text-center pb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Sports Record ERP
          </h1>
        </div>

        {dataLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
            <p className="text-xs font-bold text-slate-400">Loading student statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6 flex flex-col">
              {/* 1. Student/Player Profile Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Green Header */}
                <div className="bg-[#48bb78] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Student/Player Profile
                </div>
                <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                  {/* Photo Avatar */}
                  <div className="shrink-0 flex justify-center w-full sm:w-24 mt-0.5">
                    {student?.photo ? (
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-20 h-20 rounded-full object-cover border-3 border-slate-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-emerald-50 border-3 border-emerald-100 flex items-center justify-center text-2xl font-black text-emerald-600">
                        {student?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Fields list */}
                  <div className="flex-1 w-full text-xs font-semibold text-slate-600 space-y-2.5">
                    {[
                      { label: "Player ID", value: student?.admissionNo },
                      { label: "Name", value: student?.name },
                      { label: "Roll No", value: student?.admissionNo ? `23/${student.admissionNo}` : "—" },
                      { label: "Class", value: student?.class },
                      { label: "Game", value: athleteSport },
                      { label: "Contact No", value: student?.phone || "—" },
                    ].map((field, idx) => (
                      <div key={idx} className="flex justify-between sm:justify-start items-center">
                        <span className="text-slate-400 font-bold text-[10px] uppercase w-24 shrink-0">
                          {field.label}
                        </span>
                        <span className="text-slate-800 font-extrabold truncate">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Achievements/Medals Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Yellow Header */}
                <div className="bg-[#ecc94b] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Achievements/Medals
                </div>
                <div className="overflow-x-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-2.5">Medal ID</th>
                        <th className="px-5 py-2.5">MEDAL TYPE</th>
                        <th className="px-5 py-2.5">POSITION</th>
                        <th className="px-5 py-2.5 text-center">CERTIFICATE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      {achievements.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
                            No medals recorded
                          </td>
                        </tr>
                      ) : (
                        achievements.map((ach, idx) => {
                          const year = ach.date ? new Date(ach.date).getFullYear() : 2025;
                          const isGold = (ach.results || "").toLowerCase().includes("gold");
                          const medalType = ach.results || "Gold";
                          return (
                            <tr key={ach._id} className="hover:bg-slate-50/50">
                              <td className="px-5 py-3 font-mono text-[10px] text-slate-400">
                                M{year}-0{idx + 1}
                              </td>
                              <td className="px-5 py-3 font-extrabold text-slate-800">
                                {medalType}
                              </td>
                              <td className="px-5 py-3">
                                {isGold ? "1st Place" : "Participation"}
                              </td>
                              <td className="px-5 py-3 text-center">
                                {ach.certificate ? (
                                  <a
                                    href={ach.certificate}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-655 transition"
                                  >
                                    <FileText size={14} />
                                  </a>
                                ) : (
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-100 bg-slate-50 text-slate-300">
                                    <FileText size={14} />
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Training & Attendance Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Orange Header */}
                <div className="bg-[#ed8936] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Training & Attendance
                </div>
                <div className="overflow-x-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-2.5">Training ID</th>
                        <th className="px-5 py-2.5">DATE</th>
                        <th className="px-5 py-2.5">GAME</th>
                        <th className="px-5 py-2.5">COACH</th>
                        <th className="px-5 py-2.5 text-right">ATTENDANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      {mockTraining.map((tr, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-mono text-[10px] text-slate-400">
                            {tr.id}
                          </td>
                          <td className="px-5 py-3 font-mono text-slate-500">
                            {tr.date}
                          </td>
                          <td className="px-5 py-3 text-slate-800 font-bold">
                            {tr.game}
                          </td>
                          <td className="px-5 py-3">
                            {tr.coach}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                              {tr.attendance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6 flex flex-col">
              {/* 4. Team & Event Participation Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Blue Header */}
                <div className="bg-[#4299e1] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Team & Event Participation
                </div>
                <div className="overflow-x-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-2.5">Event ID</th>
                        <th className="px-5 py-2.5">Event Name</th>
                        <th className="px-5 py-2.5 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      {achievements.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-6 text-center text-slate-400">
                            No event records
                          </td>
                        </tr>
                      ) : (
                        achievements.slice(0, 3).map((ach, idx) => {
                          const year = ach.date ? new Date(ach.date).getFullYear() : 2025;
                          return (
                            <tr key={ach._id} className="hover:bg-slate-50/50">
                              <td className="px-5 py-3 font-mono text-[10px] text-slate-400">
                                EV{year}-0{idx + 1}
                              </td>
                              <td className="px-5 py-3 font-extrabold text-slate-800">
                                {ach.competition}
                              </td>
                              <td className="px-5 py-3 font-mono text-slate-500 text-right">
                                {ach.date ? new Date(ach.date).toLocaleDateString("en-GB").replace(/\//g, "-") : "—"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Sports Inventory Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Purple Header */}
                <div className="bg-[#9f7aea] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Sports Inventory
                </div>
                <div className="overflow-x-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-2.5">Item ID</th>
                        <th className="px-5 py-2.5">ITEM NAME</th>
                        <th className="px-5 py-2.5 text-center">Quantity</th>
                        <th className="px-5 py-2.5 text-center">Quantity Issued</th>
                        <th className="px-5 py-2.5 text-right">RETUR STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-semibold">
                      {mockInventory.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-mono text-[10px] text-slate-400">
                            {item.id}
                          </td>
                          <td className="px-5 py-3 font-extrabold text-slate-800">
                            {item.name}
                          </td>
                          <td className="px-5 py-3 text-center font-mono">{item.qty}</td>
                          <td className="px-5 py-3 text-center font-mono">{item.issued}</td>
                          <td className="px-5 py-3 text-right">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 6. Scholarship/Fee Concession Card */}
              <div className="bg-white border border-slate-200/75 rounded-2xl overflow-hidden shadow-xs">
                {/* Red Header */}
                <div className="bg-[#e53e3e] text-white px-5 py-3 font-bold text-xs tracking-wider">
                  Scholarship/Fee Concession
                </div>
                <div className="overflow-x-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-2.5">SCHOLARSHIP ID</th>
                        <th className="px-5 py-2.5">PLAYER ID</th>
                        <th className="px-5 py-2.5">SCHEME NAME</th>
                        <th className="px-5 py-2.5 text-right">YEAR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650 font-semibold">
                      {mockScholarship.map((sch, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 font-mono text-[10px] text-slate-400">
                            {sch.id}
                          </td>
                          <td className="px-5 py-3 font-extrabold text-slate-800">
                            University Sports Quota
                          </td>
                          <td className="px-5 py-3">
                            {sch.scheme}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-slate-500">
                            {sch.year}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}