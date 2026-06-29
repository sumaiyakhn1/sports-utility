import { ImageIcon } from "lucide-react";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photo: File | null;
  setPhoto: React.Dispatch<React.SetStateAction<File | null>>;
}

const inputClass =
  "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-650 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function StudentSection({ formData, handleChange, photo, setPhoto }: Props) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800">Student Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">Update the student's basic details</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Admission Number">
            <input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Student Name">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Class">
            <input type="text" name="class" value={formData.class} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Date of Birth">
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Phone Number">
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Change Photo">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition group">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.length) setPhoto(e.target.files[0]); }}
              />
              {photo ? (
                <div className="flex flex-col items-center gap-1.5">
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow" />
                  <p className="text-xs font-semibold text-emerald-700">{photo.name}</p>
                  <p className="text-[11px] text-slate-400">Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-450 group-hover:text-emerald-600 transition">
                  <ImageIcon size={20} strokeWidth={1.5} />
                  <p className="text-xs font-medium">Click to upload photo</p>
                </div>
              )}
            </label>
          </FormField>
        </div>
      </div>
    </div>
  );
}