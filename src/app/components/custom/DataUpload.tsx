import { UploadCloud, FileText } from "lucide-react";

export function DataUpload() {
  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-500 mb-3">
        Daten-Sync
      </p>
      
      <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 bg-slate-900 hover:bg-slate-800 hover:border-slate-600 transition-colors cursor-pointer group shadow-sm">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="text-indigo-400" size={24} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">
              DRV-Information hochladen
            </p>
            <p className="text-xs text-slate-400 max-w-[250px] mx-auto leading-relaxed">
              Ziehe deine "Renteninformation" als PDF hierher, um deine Prognose-Parameter automatisch auszufüllen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}