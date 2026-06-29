import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createStudent, uploadStudentPhoto } from "../api/studentApi";
import { createAchievement, uploadCertificate } from "../api/achievementApi";
import { User, Trophy, ArrowLeft, Upload, ImageIcon } from "lucide-react";

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

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-650 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition";

export default function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentFormData>(initialState);
  const [photo, setPhoto] = useState<File | null>(null);
  const [certificate, setCertificate] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData(initialState);
    setPhoto(null);
    setCertificate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const studentRes = await createStudent({
        admissionNo: formData.admissionNo,
        name: formData.name,
        class: formData.class,
        dob: formData.dob || undefined,
        phone: formData.phone,
      });
      const student = studentRes.data.data;

      if (photo) await uploadStudentPhoto(student._id, photo);

      const achievementRes = await createAchievement({
        student: student._id,
        game: formData.game,
        competition: formData.competition,
        venue: formData.venue,
        date: formData.date || undefined,
        results: formData.results,
      });
      const achievement = achievementRes.data.data;

      if (certificate) await uploadCertificate(achievement._id, certificate);

      toast.success("Student Record Added Successfully");
      resetForm();
      navigate("/achievements");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/achievements")}
          className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-750 transition cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add Student Record</h1>
          <p className="text-sm text-slate-405 mt-0.5">Create a new student profile with achievements</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Information */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <User size={15} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Student Information</h2>
              <p className="text-xs text-slate-400">Basic student details and photo</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Admission Number" required>
                <input
                  type="text"
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ADM/2024/001"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Student Name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Class" required>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  required
                  placeholder="e.g. BCA, B.Sc"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Date of Birth">
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Phone Number">
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Student Photo">
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) setPhoto(e.target.files[0]);
                    }}
                  />
                  {photo ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Preview"
                        className="h-20 w-20 rounded-xl object-cover border-2 border-white shadow"
                      />
                      <p className="text-xs font-semibold text-emerald-700">{photo.name}</p>
                      <p className="text-xs text-emerald-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-450 group-hover:text-emerald-600 transition">
                      <ImageIcon size={24} strokeWidth={1.5} />
                      <p className="text-xs font-medium">Click to upload photo</p>
                      <p className="text-[11px] text-slate-400">PNG, JPG up to 2MB</p>
                    </div>
                  )}
                </label>
              </FormField>
            </div>
          </div>
        </div>

        {/* Achievement Information */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Trophy size={15} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Achievement Information</h2>
              <p className="text-xs text-slate-400">Sports performance and certificate details</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField label="Game / Sport">
                <input
                  type="text"
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  placeholder="e.g. Cricket, Football"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Competition">
                <input
                  type="text"
                  name="competition"
                  value={formData.competition}
                  onChange={handleChange}
                  placeholder="Tournament or event name"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Venue">
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Location of the event"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Event Date">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={inputClass}
                />
              </FormField>

              <FormField label="Result">
                <input
                  type="text"
                  name="results"
                  value={formData.results}
                  onChange={handleChange}
                  placeholder="Gold / Silver / Participation..."
                  className={inputClass}
                />
              </FormField>

              <FormField label="Certificate">
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition group">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) setCertificate(e.target.files[0]);
                    }}
                  />
                  <Upload size={16} className="text-slate-400 group-hover:text-emerald-500 transition shrink-0" />
                  <div>
                    {certificate ? (
                      <>
                        <p className="text-xs font-semibold text-emerald-700">{certificate.name}</p>
                        <p className="text-[11px] text-slate-400">Click to change</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition">
                          Upload Certificate
                        </p>
                        <p className="text-[11px] text-slate-400">PDF or image, up to 5MB</p>
                      </>
                    )}
                  </div>
                </label>
              </FormField>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <button
            type="button"
            onClick={() => navigate("/achievements")}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Record"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}