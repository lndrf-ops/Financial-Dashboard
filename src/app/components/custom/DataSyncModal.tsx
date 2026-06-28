import { useState } from "react";
import { CheckCircle2, FileText, X, Loader2, UploadCloud, TrendingUp } from "lucide-react";

export type SyncAsset = { assetId: string; payout: number; accumulated: number };

const DETECTED_DOCS = [
  { assetId: 'statutory', label: 'DRV Renteninformation',       provider: 'Deutsche Rentenversicherung',     payout: 1450, accumulated: 68000 },
  { assetId: 'company',   label: 'Allianz bAV Standmitteilung', provider: 'Betriebliche Direktversicherung', payout: 320,  accumulated: 15000 },
];

const LOAD_TEXTS = [
  "Sichere Verbindung wird hergestellt...",
  "DRV Renteninformation.pdf erkannt...",
  "Entgeltpunkte werden extrahiert (45,3 EP)...",
  "KV/PV-Abzüge werden bereinigt (ca. 11 %)...",
  "Allianz bAV Standmitteilung erkannt...",
  "Vertragskonditionen werden ausgelesen...",
  "Alle Dokumente erfolgreich verarbeitet!",
];

interface DataSyncModalProps {
  onClose: () => void;
  onSuccess: (assets: SyncAsset[]) => void;
}

export function DataSyncModal({ onClose, onSuccess }: DataSyncModalProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [loadText, setLoadText] = useState("");
  const [detectedCount, setDetectedCount] = useState(0);

  const startScan = () => {
    setStep(1);
    setDetectedCount(0);
    let i = 0;
    const interval = setInterval(() => {
      setLoadText(LOAD_TEXTS[i]);
      if (i === 2) setDetectedCount(1);
      if (i === 5) setDetectedCount(2);
      i++;
      if (i === LOAD_TEXTS.length) {
        clearInterval(interval);
        setTimeout(() => setStep(2), 600);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-black text-black">
            {step === 0 ? "Vorsorgepapiere importieren" : step === 1 ? "Dokumente werden analysiert." : "Sync erfolgreich!"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {step === 0 && (
          <>
            <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
              Lade alle deine Rentenpapiere hoch — unsere KI erkennt DRV-Bescheide, bAV-Standmitteilungen, Riester- und Rürup-Bescheinigungen automatisch.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl py-9 px-6 flex flex-col items-center gap-3 mb-4 bg-[#FAFAFA]">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] flex items-center justify-center">
                <UploadCloud size={26} className="text-gray-400" />
              </div>
              <p className="text-[14px] font-bold text-black">Alle Dokumente hochladen</p>
              <p className="text-[11px] text-gray-400 text-center">DRV · bAV · Riester · Rürup · Private Lebensversicherung</p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 shrink-0">Demo</span>
              <span className="text-[11px] text-amber-700 leading-tight">Beispieldaten — in der fertigen App werden deine echten TR-Dokumente genutzt.</span>
            </div>
            <button
              onClick={startScan}
              className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer"
            >
              KI-Scan starten
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 shrink-0">Demo</span>
              <span className="text-[11px] text-amber-700 leading-tight">Beispieldaten — echte Dokumente werden aus der TR-Ablage ausgelesen.</span>
            </div>
            <div className="space-y-3 mb-5">
              {DETECTED_DOCS.map((doc, idx) => {
                const detected = detectedCount > idx;
                const loading = detectedCount === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                      detected ? 'bg-emerald-50 border-emerald-200' : loading ? 'bg-[#F9FAFB] border-gray-300' : 'bg-[#F9FAFB] border-gray-200 opacity-40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${detected ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                      {detected ? <CheckCircle2 size={17} className="text-emerald-600" /> : loading ? <Loader2 size={17} className="text-gray-400 animate-spin" /> : <FileText size={17} className="text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-black leading-tight">{doc.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{doc.provider}</p>
                    </div>
                    {detected && (
                      <div className="text-right animate-in fade-in duration-300 shrink-0">
                        <p className="text-[14px] font-extrabold text-emerald-600">{doc.payout.toLocaleString('de-DE')} €</p>
                        <p className="text-[10px] text-emerald-400">/ Monat</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[12px] text-gray-400 font-medium animate-pulse min-h-[18px]">{loadText}</p>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">
              {DETECTED_DOCS.length} Vorsorgequellen erkannt und mit deinem Dashboard verknüpft.
            </p>
            <div className="space-y-3 mb-4">
              {DETECTED_DOCS.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border bg-emerald-50 border-emerald-200 animate-in zoom-in-95 duration-300" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={17} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-black leading-tight">{doc.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{doc.provider}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[14px] font-extrabold text-emerald-600">{doc.payout.toLocaleString('de-DE')} €</p>
                    <p className="text-[10px] text-emerald-400">/ Monat</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                <span className="text-[12px] text-gray-600 font-medium">Gesamt erkannte Rente</span>
              </div>
              <span className="text-[15px] font-black text-black">
                {DETECTED_DOCS.reduce((s, d) => s + d.payout, 0).toLocaleString('de-DE')} €/Mtl.
              </span>
            </div>
            <button
              onClick={() => onSuccess(DETECTED_DOCS.map(d => ({ assetId: d.assetId, payout: d.payout, accumulated: d.accumulated })))}
              className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer"
            >
              Ins Dashboard übernehmen
            </button>
          </>
        )}
      </div>
    </div>
  );
}
