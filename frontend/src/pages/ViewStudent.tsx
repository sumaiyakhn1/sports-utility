import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getStudentById } from "../api/studentApi";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Hash,
  BookOpen,
  Trophy,
  MapPin,
  ExternalLink,
  Medal,
  Pencil,
} from "lucide-react";



function InfoItem({ label, value, icon: Icon }: { label: string; value?: string; icon?: any }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
        {Icon && <Icon size={11} />}
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default function ViewStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await getStudentById(id!);
      setStudent(res.data.data.student);
      setAchievements(res.data.data.achievements);
    } catch (error) {
      console.error(error);
      toast.error("Unable to fetch student");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading student...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-400">
        <div className="text-center">
          <User size={40} strokeWidth={1.5} className="mx-auto mb-3" />
          <p className="text-sm font-medium">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/achievements")}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Student Details</h1>
            <p className="text-sm text-slate-400 mt-0.5">View complete profile and achievements</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/students/edit/${id}`)}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      {/* Student Card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <User size={15} className="text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700">Student Profile</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Photo */}
            <div className="shrink-0">
              {student.photo ? (
                <img
                  src={student.photo}
                  className="h-32 w-32 rounded-2xl object-cover border-4 border-white shadow-md"
                  alt={student.name}
                />
              ) : (
                <div className="h-32 w-32 rounded-2xl bg-blue-50 border-4 border-white shadow-md flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl font-extrabold text-blue-400">
                    {student.name?.charAt(0)?.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">No Photo</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-5">
              <InfoItem label="Admission No." value={student.admissionNo} icon={Hash} />
              <InfoItem label="Full Name" value={student.name} icon={User} />
              <InfoItem label="Class" value={student.class} icon={BookOpen} />
              <InfoItem label="Phone" value={student.phone} icon={Phone} />
              <InfoItem
                label="Date of Birth"
                value={student.dob ? new Date(student.dob).toLocaleDateString() : undefined}
                icon={Calendar}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={15} className="text-slate-400" />
            <h2 className="text-sm font-bold text-slate-700">Achievements</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {achievements.length} record{achievements.length !== 1 ? "s" : ""}
          </span>
        </div>

        {achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Medal size={36} strokeWidth={1.5} />
            <p className="text-sm font-medium">No achievements recorded yet</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {achievements.map((achievement, idx) => (
              <div
                key={achievement._id}
                className="border border-slate-100 rounded-xl p-5 hover:border-blue-100 hover:bg-blue-50/20 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Trophy size={13} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Achievement #{idx + 1}
                    </span>
                  </div>
                  {achievement.results && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {achievement.results}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  <InfoItem label="Game / Sport" value={achievement.game} icon={Medal} />
                  <InfoItem label="Competition" value={achievement.competition} icon={Trophy} />
                  <InfoItem label="Venue" value={achievement.venue} icon={MapPin} />
                  <InfoItem
                    label="Event Date"
                    value={achievement.date ? new Date(achievement.date).toLocaleDateString() : undefined}
                    icon={Calendar}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <ExternalLink size={11} />
                      Certificate
                    </p>
                    {achievement.certificate ? (
                      <a
                        href={achievement.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        View Certificate
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">Not uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}