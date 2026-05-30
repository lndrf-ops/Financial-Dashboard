import { UploadCloud, FileText } from "lucide-react";

export function DataUpload() {
  return (
    <div className="px-6 pt-6 pb-2">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-3">
        Data Sync
      </p>
      
      <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 bg-[#0a0a0a] hover:bg-white/5 transition-colors cursor-pointer group">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#00e676]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="text-[#00e676]" size={24} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">
              Upload DRV Information
            </p>
            <p className="text-xs text-[#6b6b6b] max-w-[250px] mx-auto">
              Drop your "Renteninformation" PDF here to auto-fill your projection parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}