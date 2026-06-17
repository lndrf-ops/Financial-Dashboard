import { useState } from "react";
import { CheckCircle2, FileText, X, Building, ArrowRight } from "lucide-react";

interface DataSyncModalProps {
  onClose: () => void;
  onSuccess: (payout: number, accumulated: number, type: 'drv' | 'bav') => void;
  type: 'drv' | 'bav';
}

export function DataSyncModal({ onClose, onSuccess, type }: DataSyncModalProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [loadingText, setLoadingText] = useState("");

  const isDRV = type === 'drv';

  const drvSteps = [
    "Initialisiere sichere Verbindung...",
    "Renteninformation_2025.pdf wird analysiert...",
    "KI extrahiert Entgeltpunkte (45.3 EP gefunden)...",
    "Berechne nachgelagerte Besteuerung...",
    "Bereinige um KV/PV Abzüge (11%)...",
    "Daten erfolgreich verarbeitet!"
  ];

  const bavSteps = [
    "Verbinde mit Arbeitgeber-Portal...",
    "Authentifiziere über HR-API (Personio)...",
    "Suche nach Verträgen zur Entgeltumwandlung...",
    "Direktversicherung (Allianz) gefunden...",
    "Lese aktuellen Vertragsstand aus...",
    "Verbindung erfolgreich hergestellt!"
  ];

  const activeSteps = isDRV ? drvSteps : bavSteps;

  const startSimulation = () => {
    setStep(1);
    let currentStep = 0;

    const interval = setInterval(() => {
      setLoadingText(activeSteps[currentStep]);
      currentStep++;

      if (currentStep === activeSteps.length) {
        clearInterval(interval);
        setTimeout(() => setStep(2), 600);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white border border-gray-200 w-full max-w-sm rounded-3xl p-6 relative shadow-xl overflow-hidden">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
          <X size={18} />
        </button>

        {/* STEP 0 */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center mt-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-[#F4F4F5]`}>
              {isDRV ? <FileText size={32} className="text-black" /> : <Building size={32} className="text-black" />}
            </div>
            <h3 className="text-lg font-bold text-black mb-2">
              {isDRV ? "DRV-Information hochladen" : "Arbeitgeber verknüpfen"}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-8 px-2">
              {isDRV
                ? "Lade dein aktuelles PDF der Deutschen Rentenversicherung hoch. Unsere KI erledigt den Rest."
                : "Verbinde dein HR-Portal, um deine betriebliche Altersvorsorge automatisch zu synchronisieren."}
            </p>

            <button
              onClick={startSimulation}
              className="w-full bg-black hover:bg-gray-900 font-extrabold text-[15px] py-4 rounded-xl transition-colors text-white flex items-center justify-center gap-2"
            >
              {isDRV ? "Dokument scannen" : "Sicher verbinden"} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                {isDRV
                  ? <FileText size={24} className="text-black animate-pulse" />
                  : <Building size={24} className="text-black animate-pulse" />
                }
              </div>
            </div>
            <p className="text-[13px] font-bold text-black animate-pulse h-5">
              {loadingText}
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#F4F4F5] flex items-center justify-center mb-5">
              <CheckCircle2 size={40} className="text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">Sync erfolgreich!</h3>
            <p className="text-[13px] text-gray-500 mb-8">
              {isDRV ? "Deine realen Netto-Rentenansprüche wurden berechnet und ins Dashboard übernommen." : "Dein bAV-Vertrag wurde erfolgreich mit deinem Profil synchronisiert."}
            </p>
            <button
              onClick={() => {
                if (isDRV) onSuccess(1450, 68000, 'drv');
                else onSuccess(320, 15000, 'bav');
              }}
              className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors"
            >
              Zum Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
