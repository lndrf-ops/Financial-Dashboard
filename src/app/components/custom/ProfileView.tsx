import { User, Shield, UploadCloud, FileText, Code } from "lucide-react";

export function ProfileView() {
  return (
    <div className="bg-black min-h-screen text-white w-full pb-32">
      
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl px-6 py-6 border-b border-white/5">
        <h1 className="font-extrabold text-xl tracking-tight">Profil & Daten</h1>
        <p className="text-xs text-zinc-500 mt-1">Verwalte deine angebundenen Quellen</p>
      </div>

      <div className="px-6 pt-8 space-y-8">
        
        {/* Data Sync Hub */}
        <section>
          <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest mb-4">
            Daten-Sync
          </h2>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 bg-[#0a0a0a] hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#00e676]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="text-[#00e676]" size={24} strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">
                  DRV-Information aktualisieren
                </p>
                <p className="text-xs text-[#6b6b6b] max-w-[250px] mx-auto leading-relaxed">
                  Lade dein neuestes PDF hoch. Die KI aktualisiert deine Rentenansprüche automatisch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Settings */}
        <section>
          <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest mb-4">
            Einstellungen
          </h2>
          <div className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-white/5 cursor-pointer hover:bg-white/5">
              <User size={18} className="text-zinc-400" />
              <div className="flex-1">
                <p className="font-bold text-sm">Persönliche Daten</p>
                <p className="text-xs text-zinc-500">Steuerklasse, Bundesland, Familienstand</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5">
              <Shield size={18} className="text-zinc-400" />
              <div className="flex-1">
                <p className="font-bold text-sm">Risikoprofil</p>
                <p className="text-xs text-zinc-500">Ausgewogen (Trade Republic Standard)</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}