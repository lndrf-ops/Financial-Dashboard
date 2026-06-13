import { useState } from "react";
import { ArrowLeft, Zap, PieChart, Bot, CheckCircle2, Briefcase, Landmark, X, Mail, Send } from "lucide-react";
import { Switch } from "../ui/switch";

interface OptimizationPlanProps {
  onBack: () => void; projectedMonthly: number; targetPension: number; diff: number;
  monthlyContribution: number; setMonthlyContribution: (val: number) => void;
  expectedReturn: number; setExpectedReturn: (val: number) => void;
  retirementAge: number; setRetirementAge: (val: number) => void;
  vlActive: boolean; setVlActive: (val: boolean) => void;
  bavNettoVerzicht: number[]; setBavNettoVerzicht: (val: number[]) => void;
}

export function OptimizationPlan({ 
  onBack, diff, monthlyContribution, setMonthlyContribution, expectedReturn, setExpectedReturn, retirementAge, setRetirementAge, vlActive, setVlActive, bavNettoVerzicht, setBavNettoVerzicht
}: OptimizationPlanProps) {
  const isPositive = diff >= 0;
  const [appliedStrategy, setAppliedStrategy] = useState<string | null>(null);
  const [showHRModal, setShowHRModal] = useState<'vl' | 'bav' | null>(null);
  const [hrSent, setHRSent] = useState(false);

  const handleHRSend = () => {
    setHRSent(false);
    setTimeout(() => setHRSent(true), 1500);
  };

  const closeModal = () => { setShowHRModal(null); setHRSent(false); };

  const hrModalContent = {
    vl: {
      title: "VL-Antrag senden",
      recipient: "hr@meinefirma.de",
      subject: "Antrag auf vermögenswirksame Leistungen",
      body: "Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich die Gewährung von vermögenswirksamen Leistungen gemäß § 2 VermBG. Ich bitte um Einrichtung der monatlichen Zahlung in Höhe von 40 €.\n\nMit freundlichen Grüßen",
    },
    bav: {
      title: "bAV-Antrag senden",
      recipient: "hr@meinefirma.de",
      subject: "Antrag auf Entgeltumwandlung (bAV)",
      body: `Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich die Einrichtung einer betrieblichen Altersvorsorge via Entgeltumwandlung in Höhe von ${bavNettoVerzicht[0]} € monatlich (Netto-Verzicht).\n\nMit freundlichen Grüßen`,
    },
  };

  const gapMagnitude = diff < 0 ? Math.abs(diff) : 0;
  const suggestedSavings = Math.max(25, Math.ceil((gapMagnitude * 0.4) / 25) * 25); 
  const perfectBavNetto = gapMagnitude === 0 ? 0 : Math.min(250, Math.max(10, Math.ceil((gapMagnitude * 0.4 / 2.1) / 10) * 10));

  // NEU: Kaffee-Übersetzung
  const coffeesPerDay = Math.max(1, Math.ceil(gapMagnitude / 3.5 / 30));

  const applyStrategy = (type: 'save' | 'invest' | 'time') => {
    setAppliedStrategy(type);
    if (type === 'save') setMonthlyContribution(monthlyContribution + suggestedSavings);
    else if (type === 'invest') setExpectedReturn(8.5); 
    else if (type === 'time') setRetirementAge(retirementAge + 2);
  };
  
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 max-w-[430px] mx-auto font-sans overflow-x-hidden pb-10">
      
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer text-slate-300 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight text-white">Dein Aktionsplan</span>
      </div>

      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-500">Aktueller Status</p>
          {isPositive && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
              <CheckCircle2 size={12} /> Ziel erreicht
            </span>
          )}
        </div>
        
        <div className="text-4xl font-black tracking-tight leading-none text-white transition-all mb-6">
          {isPositive ? "Rente gesichert" : "Achtung: Rentenlücke"}
        </div>
        
        <div className={`p-5 rounded-2xl border mb-2 transition-colors shadow-lg ${isPositive ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">{isPositive ? 'Du liegst im Plus:' : 'Dir fehlen monatlich:'}</span>
            <span className={`text-xl font-black ${isPositive ? 'text-indigo-400' : 'text-rose-400'}`}>
              {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")}
            </span>
          </div>
          {!isPositive && (
            <div className="mt-3 pt-3 border-t border-rose-500/20">
              <p className="text-xs text-rose-300/90 leading-relaxed font-medium">
                💡 Das entspricht dem Verzicht auf ca. <strong>{coffeesPerDay} Kaffee To-Go</strong> pro Tag. Packen wir's an!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">1. Quick Wins (Free Money)</h2>
        </div>
        <div className="space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Landmark size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-[14px] text-white">VL-Sparen</p>
                  <p className="text-[11px] text-slate-400">Bis zu 40€ geschenkt vom Chef</p>
                </div>
              </div>
              <Switch checked={vlActive} onCheckedChange={(c) => setVlActive(c)} className="data-[state=checked]:bg-indigo-500" />
            </div>
            {vlActive && (
              <div className="mt-4 pt-3 border-t border-slate-800 animate-in fade-in">
                <button onClick={() => setShowHRModal('vl')} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Mail size={14} /> Antrag direkt an HR senden
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Briefcase size={16} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Betriebliche Rente (bAV)</h3>
                  <p className="text-[11px] text-slate-400">Steuervorteile & 15% AG-Zuschuss</p>
                </div>
              </div>
              
              <div className="bg-slate-950 rounded-xl p-4 mb-4 flex items-center justify-between border border-slate-800">
                 <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Dein Netto-Verzicht</p>
                    <p className="text-lg font-bold text-rose-400">- € {bavNettoVerzicht[0]}</p>
                 </div>
                 <Zap size={18} className="text-slate-600" />
                 <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Echtes Investment</p>
                    <p className="text-lg font-bold text-indigo-400">+ € {bavBruttoInvest}</p>
                 </div>
              </div>

              {bavNettoVerzicht[0] === 0 ? (
                <button 
                  onClick={() => setBavNettoVerzicht([perfectBavNetto])}
                  disabled={isPositive}
                  className={`w-full py-3 border text-[13px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 group ${isPositive ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400 cursor-pointer'}`}
                >
                  <Zap size={16} className={isPositive ? 'text-slate-600' : 'text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform'} /> 
                  {isPositive ? "Optimierung nicht nötig" : `Lücke schließen (${perfectBavNetto} € Netto)`}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setBavNettoVerzicht([0])} className="w-1/3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[13px] font-bold rounded-xl transition-colors flex items-center justify-center cursor-pointer">
                    <X size={16} />
                  </button>
                  <button onClick={() => setShowHRModal('bav')} className="w-2/3 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Mail size={16} /> Bei HR einreichen
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {!isPositive && (
        <div className="px-6 mb-8 animate-in fade-in">
           <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest">2. KI-Strategien (1-Klick)</h2>
          </div>
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={18} className="text-indigo-400" />
              <span className="text-[12px] font-bold text-white">Lücke automatisch schließen</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Wähle den Weg, der am besten zu deinem Leben passt. Wir passen deinen Plan im Hintergrund automatisch an.
            </p>
            <div className="space-y-3">
              <button onClick={() => applyStrategy('save')} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${appliedStrategy === 'save' ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <Zap size={18} className={appliedStrategy === 'save' ? 'text-white' : 'text-indigo-400'} />
                  <span className="text-[14px] font-bold">Ich spare mehr</span>
                </div>
                <span className={`text-[12px] font-bold ${appliedStrategy === 'save' ? 'text-indigo-100' : 'text-slate-400'}`}>+ {suggestedSavings} € mtl.</span>
              </button>
              <button onClick={() => applyStrategy('invest')} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${appliedStrategy === 'invest' ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <PieChart size={18} className={appliedStrategy === 'invest' ? 'text-white' : 'text-cyan-400'} />
                  <span className="text-[14px] font-bold">Ich erhöhe mein Risiko</span>
                </div>
                <span className={`text-[12px] font-bold ${appliedStrategy === 'invest' ? 'text-indigo-100' : 'text-slate-400'}`}>Auf 8.5% p.a.</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 mt-4">
        <button
          onClick={onBack}
          className="w-full font-extrabold text-[15px] py-4 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-2 shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
        >
          {isPositive ? "Perfekt! Plan übernehmen" : "Plan aktivieren & Lücke schließen"}
        </button>
      </div>

      {/* HR Modal */}
      {showHRModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={closeModal}>
          <div className="w-full max-w-[430px] bg-slate-900 border border-slate-700 rounded-t-3xl p-6 animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>

            {!hrSent ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-indigo-400" />
                    <span className="font-extrabold text-white text-[16px]">{hrModalContent[showHRModal].title}</span>
                  </div>
                  <button onClick={closeModal} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">An</p>
                    <p className="text-[13px] text-slate-300 font-medium">{hrModalContent[showHRModal].recipient}</p>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Betreff</p>
                    <p className="text-[13px] text-slate-300 font-medium">{hrModalContent[showHRModal].subject}</p>
                  </div>
                  <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5">Nachricht</p>
                    <p className="text-[12px] text-slate-400 leading-relaxed whitespace-pre-line">{hrModalContent[showHRModal].body}</p>
                  </div>
                </div>

                <button onClick={handleHRSend} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[14px] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Send size={16} /> Jetzt senden
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-indigo-500/15 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Antrag gesendet!</h3>
                <p className="text-sm text-slate-400 text-center mb-6">Deine HR-Abteilung wurde informiert und wird sich in Kürze bei dir melden.</p>
                <button onClick={closeModal} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-[14px] rounded-xl transition-colors cursor-pointer">
                  Schließen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}