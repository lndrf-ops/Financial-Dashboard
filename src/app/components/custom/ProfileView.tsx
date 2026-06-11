import { useState } from "react";
import { User, Shield, UploadCloud, ChevronDown, Info, Landmark, Link2, Key, Building } from "lucide-react";
import { ScenarioSimulator, ScenarioSimulatorProps } from "./ScenarioSimulator";
import { DataSyncModal } from "./DataSyncModal";

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="border border-slate-800 bg-slate-900 rounded-2xl overflow-hidden transition-all duration-300">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800 transition-colors">
        <h2 className="text-[13px] text-indigo-400 font-semibold uppercase tracking-widest">{title}</h2>
        <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-4 pt-0 border-t border-slate-800">{children}</div>
      </div>
    </section>
  );
}

interface ProfileViewProps extends ScenarioSimulatorProps {
  onNavigateToPersonalData: () => void;
  onSyncComplete: (payout: number, accumulated: number, type: 'drv' | 'bav') => void;
}

export function ProfileView(props: ProfileViewProps) {
  const [syncType, setSyncType] = useState<'drv' | 'bav' | null>(null);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 w-full pb-32">
      {syncType && <DataSyncModal type={syncType} onClose={() => setSyncType(null)} onSuccess={(payout, acc, type) => { setSyncType(null); props.onSyncComplete(payout, acc, type); }} />}
      
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl px-6 py-6 border-b border-slate-800">
        <h1 className="font-extrabold text-xl tracking-tight text-white">Profil & Daten</h1>
        <p className="text-xs text-slate-400 mt-1">Verwalte deine Parameter und Quellen</p>
      </div>

      <div className="px-6 pt-6 space-y-4">
        <CollapsibleSection title="Account" defaultOpen={true}>
          <div className="mt-4 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
            <div onClick={props.onNavigateToPersonalData} className="p-4 flex items-center gap-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
              <User size={18} className="text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Persönliche Daten</p>
                <p className="text-[11px] text-slate-500">Steuerklasse, Bundesland, Familienstand</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
              <Shield size={18} className="text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Risikoprofil</p>
                <p className="text-[11px] text-slate-500">Ausgewogen (Trade Republic Standard)</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
              <Landmark size={18} className="text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Steuern & Freistellung</p>
                <p className="text-[11px] text-slate-500">Freistellungsauftrag, Vorabpauschale</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
              <Link2 size={18} className="text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Verknüpfte Konten</p>
                <p className="text-[11px] text-slate-500">Referenzkonto, Open Banking Sync</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-900 transition-colors">
              <Key size={18} className="text-slate-400" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">Sicherheit & Login</p>
                <p className="text-[11px] text-slate-500">FaceID, 2-Faktor-Authentifizierung</p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Daten-Sync" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div onClick={() => setSyncType('drv')} className="border border-slate-800 rounded-2xl p-4 bg-slate-950 hover:bg-slate-800 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="text-indigo-400" size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white mb-1">Renten-PDF</p>
                <p className="text-[10px] text-slate-500">DRV KI-Scan</p>
              </div>
            </div>
            <div onClick={() => setSyncType('bav')} className="border border-slate-800 rounded-2xl p-4 bg-slate-950 hover:bg-slate-800 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="text-blue-500" size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white mb-1">HR-Portal</p>
                <p className="text-[10px] text-slate-500">bAV verknüpfen</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl mt-4">
            <h4 className="text-indigo-400 font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info size={14} /> Warum ist der Sync wichtig?
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Die jährliche Renteninformation der Deutschen Rentenversicherung (DRV) weist deine Rente stets <span className="font-bold text-white">Brutto</span> aus. Unser Algorithmus bereinigt deine Daten vollautomatisch um ca. 11% Kranken- und Pflegeversicherung sowie die nachgelagerte Besteuerung, um mit echten Netto-Werten planen zu können.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Simulations-Parameter" defaultOpen={false}>
          <p className="text-xs text-slate-400 mb-6 mt-4 leading-relaxed">
            Passe deine Annahmen für Inflation, Lebenserwartung und Rendite an. Diese globalen Einstellungen verändern die Prognose deines Dashboards.
          </p>
          <ScenarioSimulator {...props} />
        </CollapsibleSection>
      </div>
    </div>
  );
}