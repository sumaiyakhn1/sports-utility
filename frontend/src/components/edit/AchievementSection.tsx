import { Upload } from "lucide-react";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  certificate: File | null;
  setCertificate: React.Dispatch<React.SetStateAction<File | null>>;
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

export default function AchievementSection({ formData, handleChange, certificate, setCertificate }: Props) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-800">Achievement Information</h2>
        <p className="text-xs text-slate-400 mt-0.5">Update sports performance and certificate</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField label="Game / Sport">
            <input type="text" name="game" value={formData.game} onChange={handleChange} placeholder="e.g. Cricket" className={inputClass} />
          </FormField>
          <FormField label="Competition">
            <input type="text" name="competition" value={formData.competition} onChange={handleChange} placeholder="Tournament name" className={inputClass} />
          </FormField>
          <FormField label="Venue">
            <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Location" className={inputClass} />
          </FormField>
          <FormField label="Event Date">
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
          </FormField>
          <FormField label="Result">
            <input type="text" name="results" value={formData.results} onChange={handleChange} placeholder="Gold / Silver / Participation..." className={inputClass} />
          </FormField>
          <FormField label="Upload Certificate">
            <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition group">
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => { if (e.target.files?.length) setCertificate(e.target.files[0]); }}
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
                    <p className="text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition">Upload Certificate</p>
                    <p className="text-[11px] text-slate-400">PDF or image, up to 5MB</p>
                  </>
                )}
              </div>
            </label>
          </FormField>
        </div>
      </div>
    </div>
  );
}