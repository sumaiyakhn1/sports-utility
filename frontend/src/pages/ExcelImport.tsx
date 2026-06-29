import { useState } from "react";
import { uploadExcel } from "../api/excelApi";
import toast from "react-hot-toast";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  UserCog,
  Trophy,
  Copy,
  TableProperties,
} from "lucide-react";

const reportCards = [
  { key: "totalRows", label: "Total Rows", icon: TableProperties, bg: "bg-slate-50", border: "border-slate-200", iconBg: "bg-slate-100", iconColor: "text-slate-600", numColor: "text-slate-800" },
  { key: "studentsCreated", label: "Students Created", icon: UserCheck, bg: "bg-emerald-50", border: "border-emerald-100/70", iconBg: "bg-emerald-100/50", iconColor: "text-emerald-700", numColor: "text-emerald-700" },
  { key: "studentsUpdated", label: "Students Updated", icon: UserCog, bg: "bg-blue-50", border: "border-blue-100/70", iconBg: "bg-blue-100/50", iconColor: "text-blue-705", numColor: "text-blue-700" },
  { key: "achievementsCreated", label: "Achievements Created", icon: Trophy, bg: "bg-purple-50", border: "border-purple-100/70", iconBg: "bg-purple-100/50", iconColor: "text-purple-700", numColor: "text-purple-700" },
  { key: "duplicateAchievements", label: "Duplicates Skipped", icon: Copy, bg: "bg-amber-50", border: "border-amber-100/70", iconBg: "bg-amber-100/50", iconColor: "text-amber-700", numColor: "text-amber-700" },
];

export default function ExcelImport() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an Excel file");
      return;
    }
    try {
      setLoading(true);
      const res = await uploadExcel(file);
      setReport(res.data.data);
      toast.success("Excel imported successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message ?? "Unable to import Excel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Excel Import</h1>
        <p className="text-sm text-slate-450 mt-0.5">Bulk import students and achievements from an Excel file</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <FileSpreadsheet size={15} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Upload Excel File</h2>
            <p className="text-xs text-slate-400">.xlsx or .xls format, up to 10MB</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Drop zone */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl py-10 px-6 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/10 transition group">
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setFile(e.target.files[0]);
                  setReport(null);
                }
              }}
            />
            <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-emerald-50 border border-transparent group-hover:border-emerald-100 flex items-center justify-center mb-4 transition">
              <FileSpreadsheet size={28} className="text-slate-400 group-hover:text-emerald-600 transition" />
            </div>
            <p className="text-sm font-bold text-slate-600 group-hover:text-emerald-700 transition">
              {file ? file.name : "Click to select an Excel file"}
            </p>
            <p className="text-xs text-slate-400 mt-1 font-semibold">
              {file
                ? `${(file.size / 1024).toFixed(1)} KB — click to change`
                : "Supports .xlsx and .xls formats"}
            </p>
          </label>

          {/* File preview */}
          {file && (
            <div className="flex items-center gap-3 bg-emerald-50/40 border border-emerald-100/50 rounded-xl px-4 py-3">
              <FileSpreadsheet size={18} className="text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-emerald-800 truncate">{file.name}</p>
                <p className="text-xs text-emerald-600 font-semibold">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            </div>
          )}

          <button
            disabled={loading || !file}
            onClick={handleUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload size={15} />
                Import Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Report */}
      {report && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 size={15} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Import Report</h2>
              <p className="text-xs text-slate-400">Summary of processed data</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {reportCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.key} className={`${card.bg} border ${card.border} rounded-2xl p-4`}>
                    <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon size={16} className={card.iconColor} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">{card.label}</p>
                    <p className={`text-3xl font-black ${card.numColor}`}>{report[card.key] ?? 0}</p>
                  </div>
                );
              })}
              {/* Failed rows card inline */}
              <div className={`${report.failedRows?.length > 0 ? "bg-red-50 border-red-100" : "bg-slate-50 border-slate-200"} border rounded-2xl p-4`}>
                <div className={`w-8 h-8 ${report.failedRows?.length > 0 ? "bg-red-100" : "bg-slate-100"} rounded-lg flex items-center justify-center mb-3`}>
                  <XCircle size={16} className={report.failedRows?.length > 0 ? "text-red-600" : "text-slate-405"} />
                </div>
                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Failed Rows</p>
                <p className={`text-3xl font-black ${report.failedRows?.length > 0 ? "text-red-700" : "text-slate-400"}`}>
                  {report.failedRows?.length ?? 0}
                </p>
              </div>
            </div>

            {/* Failed rows table */}
            {report.failedRows?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-red-500" />
                  <h3 className="text-xs font-bold text-red-700">Failed Rows</h3>
                </div>
                <div className="overflow-x-auto border border-red-100 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-red-50 border-b border-red-100 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        <th className="px-4 py-3 w-20">Row</th>
                        <th className="px-4 py-3">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-50 font-semibold">
                      {report.failedRows.map((row: any, index: number) => (
                        <tr key={index} className="hover:bg-red-50/50 text-slate-700">
                          <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{row.row}</td>
                          <td className="px-4 py-3 leading-snug">{row.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}