import { useState, useEffect } from "react";
import { CheckCircle2, FileText, Loader2, X, Building, ArrowRight } from "lucide-react";

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
    
    // Simuliert den KI-Scan-Prozess mit wechselnden Texten
    const interval = setInterval(() => {
      setLoadingText(activeSteps[currentStep]);
      currentStep++;
      
      if (currentStep === activeSteps.length) {
        clearInterval(interval);
        setTimeout(() => setStep(2), 600); // Springe zu Success
      }
    }, 800); // Alle 800ms ändert sich der Text (perfekt für eine Live-Demo)
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00e676]/10 blur-[50px] rounded-full pointer-events-none" />

        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
          <X size={18} />
        </button>

        {/* STEP 0: INITIALER AUFRUF */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center mt-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${isDRV ? 'bg-[#00e676]/10 text-[#00e676]' : 'bg-blue-500/10 text-blue-500'}`}>
              {isDRV ? <FileText size={32} /> : <Building size={32} />}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {isDRV ? "DRV-Information hochladen" : "Arbeitgeber verknüpfen"}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-8 px-2">
              {isDRV 
                ? "Lade dein aktuelles PDF der Deutschen Rentenversicherung hoch. Unsere KI erledigt den Rest."
                : "Verbinde dein HR-Portal, um deine betriebliche Altersvorsorge automatisch zu synchronisieren."}
            </p>
            
            <button 
              onClick={startSimulation}
              className={`w-full font-extrabold text-[15px] py-4 rounded-xl transition-colors text-black flex items-center justify-center gap-2 ${isDRV ? 'bg-[#00e676] hover:bg-[#00e676]/90' : 'bg-blue-500 hover:bg-blue-400'}`}
            >
              {isDRV ? "Dokument scannen" : "Sicher verbinden"} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 1: LADE ANIMATION */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center py-10">
            <div className="relative w-20 h-20 mb-6">
              <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${isDRV ? 'border-[#00e676]/30 border-t-[#00e676]' : 'border-blue-500/30 border-t-blue-500'}`} />
              <div className="absolute inset-0 flex items-center justify-center">
                {isDRV ? <FileText size={24} className="text-[#00e676] animate-pulse" /> : <Building size={24} className="text-blue-500 animate-pulse" />}
              </div>
            </div>
            <p className="text-[13px] font-bold text-white animate-pulse h-5">
              {loadingText}
            </p>
          </div>
        )}

        {/* STEP 2: ERFOLG */}
        {step === 2 && (
          <div className="flex flex-col items-center text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-[#00e676]/20 flex items-center justify-center mb-5">
              <CheckCircle2 size={40} className="text-[#00e676]" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Sync erfolgreich!</h3>
            <p className="text-[13px] text-zinc-400 mb-8">
              {isDRV ? "Deine realen Netto-Rentenansprüche wurden berechnet und ins Dashboard übernommen." : "Dein bAV-Vertrag wurde erfolgreich mit deinem Profil synchronisiert."}
            </p>
            <button 
              onClick={() => {
                // Hier übergeben wir realistische Mock-Daten zurück an die App
                if (isDRV) onSuccess(1450, 68000, 'drv'); // z.B. 1450€ Netto Rente
                else onSuccess(320, 15000, 'bav'); // z.B. 320€ bAV Auszahlung
              }}
              className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors"
            >
              Zum Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}