import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getStudentById, updateStudent, uploadStudentPhoto } from "../api/studentApi";
import { updateAchievement, uploadCertificate } from "../api/achievementApi";
import StudentSection from "../components/edit/StudentSection";
import AchievementSection from "../components/edit/AchievementSection";
import ActionButtons from "../components/edit/ActionButtons";
import { ArrowLeft } from "lucide-react";

interface StudentFormData {
  admissionNo: string;
  name: string;
  class: string;
  dob: string;
  phone: string;
  game: string;
  competition: string;
  venue: string;
  date: string;
  results: string;
}

const initialState: StudentFormData = {
  admissionNo: "",
  name: "",
  class: "",
  dob: "",
  phone: "",
  game: "",
  competition: "",
  venue: "",
  date: "",
  results: "",
};

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentFormData>(initialState);
  const [studentId, setStudentId] = useState("");
  const [achievementId, setAchievementId] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const response = await getStudentById(id!);
      const student = response.data.data.student;
      const achievement = response.data.data.achievements[0];
      setStudentId(student._id);
      if (achievement) setAchievementId(achievement._id);
      setFormData({
        admissionNo: student.admissionNo || "",
        name: student.name || "",
        class: student.class || "",
        dob: student.dob ? student.dob.substring(0, 10) : "",
        phone: student.phone || "",
        game: achievement?.game || "",
        competition: achievement?.competition || "",
        venue: achievement?.venue || "",
        date: achievement?.date ? achievement.date.substring(0, 10) : "",
        results: achievement?.results || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Unable to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateStudent(studentId, {
        admissionNo: formData.admissionNo,
        name: formData.name,
        class: formData.class,
        dob: formData.dob || undefined,
        phone: formData.phone,
      });
      if (photo) await uploadStudentPhoto(studentId, photo);
      if (achievementId) {
        await updateAchievement(achievementId, {
          game: formData.game,
          competition: formData.competition,
          venue: formData.venue,
          date: formData.date || undefined,
          results: formData.results,
        });
        if (certificate) await uploadCertificate(achievementId, certificate);
      }
      toast.success("Student updated successfully");
      navigate("/achievements");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading student...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/achievements")}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Edit Student Record</h1>
          <p className="text-sm text-slate-404 mt-0.5">Update student profile and achievement details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <StudentSection
          formData={formData}
          handleChange={handleChange}
          photo={photo}
          setPhoto={setPhoto}
        />
        <AchievementSection
          formData={formData}
          handleChange={handleChange}
          certificate={certificate}
          setCertificate={setCertificate}
        />
        <ActionButtons loading={loading} onCancel={() => navigate("/achievements")} />
      </form>
    </div>
  );
}