import { useState } from "react";
import { User, Shield, UploadCloud, ChevronDown, Info, Landmark, Link2, Key, Building, FileCheck, Send, Loader2, CheckCircle2 } from "lucide-react";
import { ScenarioSimulator, ScenarioSimulatorProps } from "./ScenarioSimulator";
import { DataSyncModal } from "./DataSyncModal";

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="border border-gray-200 bg-white rounded-2xl overflow-hidden transition-all duration-300">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[#F9FAFB] transition-colors">
        <h2 className="text-[13px] text-black font-semibold uppercase tracking-widest">{title}</h2>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-black" : ""}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
      </div>
    </section>
  );
}

interface ProfileViewProps extends ScenarioSimulatorProps {
  onNavigateToPersonalData: () => void;
  onSyncComplete: (payout: number, accumulated: number, type: 'drv' | 'bav') => void;
  vlActive: boolean;
  bavNetto: number;
}

function AntraegSection({ vlActive, bavNetto }: { vlActive: boolean; bavNetto: number }) {
  const [vlState, setVlState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [bavState, setBavState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSend = (type: 'vl' | 'bav') => {
    if (type === 'vl') { setVlState('sending'); setTimeout(() => setVlState('sent'), 1800); }
    else { setBavState('sending'); setTimeout(() => setBavState('sent'), 1800); }
  };

  const SentCard = ({ title }: { title: string }) => (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-4 animate-in zoom-in-95 duration-300">
      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
        <CheckCircle2 size={18} className="text-emerald-600" />
      </div>
      <div>
        <p className="font-bold text-[14px] text-emerald-700 leading-tight">Antrag gesendet!</p>
        <p className="text-[11px] text-emerald-600 mt-0.5">{title} · hr@deinunternehmen.de</p>
      </div>
    </div>
  );

  const PendingCard = ({ type, title, subtitle, bullets }: { type: 'vl' | 'bav'; title: string; subtitle: string; bullets: string[] }) => {
    const sending = (type === 'vl' ? vlState : bavState) === 'sending';
    return (
      <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
            <FileCheck size={18} className="text-black" />
          </div>
          <div>
            <p className="font-bold text-[14px] text-black leading-tight">{title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="space-y-1.5 mb-4">
          {bullets.map(b => (
            <div key={b} className="flex items-center gap-2 text-[12px] text-gray-600">
              <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleSend(type)}
          disabled={sending}
          className="w-full h-11 bg-black hover:bg-gray-900 disabled:opacity-50 text-white font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {sending ? <><Loader2 size={14} className="animate-spin" /> Wird gesendet…</> : <><Send size={14} /> Antrag senden</>}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3 mt-4">
      <p className="text-[12px] text-gray-500 leading-relaxed">
        Diese Anträge werden direkt an deine Personalabteilung gesendet — vorausgefüllt mit deinen Daten.
      </p>
      {vlActive && (vlState === 'sent'
        ? <SentCard title="VL-Sparen" />
        : <PendingCard
            type="vl"
            title="Antrag auf VL-Sparen"
            subtitle="hr@deinunternehmen.de · Kostenlos"
            bullets={["Bis zu 40 € monatlich vom Arbeitgeber", "Fließt direkt in deinen ETF-Sparplan", "Bearbeitungszeit: 2–4 Wochen"]}
          />
      )}
      {bavNetto > 0 && (bavState === 'sent'
        ? <SentCard title="bAV Entgeltumwandlung" />
        : <PendingCard
            type="bav"
            title="Antrag auf Entgeltumwandlung"
            subtitle={`hr@deinunternehmen.de · ${bavNetto} € netto`}
            bullets={["Steuervorteile ab dem nächsten Gehalt", "Bruttoverzicht senkt deine Steuerlast", "Bearbeitungszeit: 2–4 Wochen"]}
          />
      )}
    </div>
  );
}

export function ProfileView(props: ProfileViewProps) {
  const [syncType, setSyncType] = useState<'drv' | 'bav' | null>(null);
  const showAntraege = props.vlActive || props.bavNetto > 0;

  return (
    <div className="bg-white min-h-screen text-black w-full pb-32">
      {syncType && <DataSyncModal type={syncType} onClose={() => setSyncType(null)} onSuccess={(payout, acc, type) => { setSyncType(null); props.onSyncComplete(payout, acc, type); }} />}

      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-gray-100">
        <h1 className="font-extrabold text-xl tracking-tight text-black">Profil & Daten</h1>
        <p className="text-xs text-gray-500 mt-1">Verwalte deine Parameter und Quellen</p>
      </div>

      <div className="px-6 pt-6 space-y-4">
        <div id="tutorial-profile-account">
        <CollapsibleSection title="Account" defaultOpen={true}>
          <div className="mt-4 bg-[#F9FAFB] rounded-2xl border border-gray-100 overflow-hidden">
            <div onClick={props.onNavigateToPersonalData} className="p-4 flex items-center gap-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <User size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="font-bold text-sm text-black">Persönliche Daten</p>
                <p className="text-[11px] text-gray-500">Steuerklasse, Bundesland, Familienstand</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <Shield size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="font-bold text-sm text-black">Risikoprofil</p>
                <p className="text-[11px] text-gray-500">Ausgewogen (Trade Republic Standard)</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <Landmark size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="font-bold text-sm text-black">Steuern & Freistellung</p>
                <p className="text-[11px] text-gray-500">Freistellungsauftrag, Vorabpauschale</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
              <Link2 size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="font-bold text-sm text-black">Verknüpfte Konten</p>
                <p className="text-[11px] text-gray-500">Referenzkonto, Open Banking Sync</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 transition-colors">
              <Key size={18} className="text-gray-500" />
              <div className="flex-1">
                <p className="font-bold text-sm text-black">Sicherheit & Login</p>
                <p className="text-[11px] text-gray-500">FaceID, 2-Faktor-Authentifizierung</p>
              </div>
            </div>
          </div>
        </CollapsibleSection>
        </div>{/* tutorial-profile-account */}

        {showAntraege && (
          <CollapsibleSection title="Anträge & HR" defaultOpen={false}>
            <AntraegSection vlActive={props.vlActive} bavNetto={props.bavNetto} />
          </CollapsibleSection>
        )}

        <div id="tutorial-profile-datasync">
        <CollapsibleSection title="Daten-Sync" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div onClick={() => setSyncType('drv')} className="border border-gray-200 rounded-2xl p-4 bg-[#F9FAFB] hover:bg-gray-100 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="text-black" size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-black mb-1">Renten-PDF</p>
                <p className="text-[10px] text-gray-500">DRV KI-Scan</p>
              </div>
            </div>
            <div onClick={() => setSyncType('bav')} className="border border-gray-200 rounded-2xl p-4 bg-[#F9FAFB] hover:bg-gray-100 transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="text-black" size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-black mb-1">HR-Portal</p>
                <p className="text-[10px] text-gray-500">bAV verknüpfen</p>
              </div>
            </div>
          </div>
          <div className="bg-[#F9FAFB] border border-gray-200 p-4 rounded-xl mt-4">
            <h4 className="text-black font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info size={14} /> Warum ist der Sync wichtig?
            </h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Die jährliche Renteninformation der Deutschen Rentenversicherung (DRV) weist deine Rente stets <span className="font-bold text-black">Brutto</span> aus. Unser Algorithmus bereinigt deine Daten vollautomatisch um ca. 11% Kranken- und Pflegeversicherung sowie die nachgelagerte Besteuerung, um mit echten Netto-Werten planen zu können.
            </p>
          </div>
        </CollapsibleSection>
        </div>{/* tutorial-profile-datasync */}

        <div id="tutorial-profile-simparams">
        <CollapsibleSection title="Simulations-Parameter" defaultOpen={false}>
          <p className="text-xs text-gray-500 mb-6 mt-4 leading-relaxed">
            Passe deine Annahmen für Inflation, Lebenserwartung und Rendite an. Diese globalen Einstellungen verändern die Prognose deines Dashboards.
          </p>
          <ScenarioSimulator {...props} />
        </CollapsibleSection>
        </div>{/* tutorial-profile-simparams */}
      </div>
    </div>
  );
}
