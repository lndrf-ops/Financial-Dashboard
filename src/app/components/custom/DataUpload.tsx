import { UploadCloud } from "lucide-react";

export function DataUpload() {
  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-3">
        Daten-Sync
      </p>

      <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 bg-[#F9FAFB] hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer group">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="text-black" size={24} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-black mb-1">
              DRV-Information hochladen
            </p>
            <p className="text-xs text-gray-500 max-w-[250px] mx-auto leading-relaxed">
              Ziehe deine "Renteninformation" als PDF hierher, um deine Prognose-Parameter automatisch auszufüllen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
