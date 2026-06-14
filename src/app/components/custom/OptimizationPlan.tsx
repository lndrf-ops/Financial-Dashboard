import { useState, useEffect } from "react";
import { ArrowLeft, Zap, CalendarClock, PieChart, CheckCircle2, Briefcase, Landmark, ChevronRight, Send, Loader2, TrendingUp, X, Sparkles } from "lucide-react";

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
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  
  // Lokale States für die Bestätigung
  const [selectedVL, setSelectedVL] = useState<'yes' | 'no' | null>(vlActive ? 'yes' : null);
  const [selectedBAV, setSelectedBAV] = useState<'yes' | 'no' | null>(bavNettoVerzicht[0] > 0 ? 'yes' : null);
  const [appliedStrategy, setAppliedStrategy] = useState<'save' | 'invest' | 'time' | 'none' | null>(null);

  const isPositive = diff >= 0;
  const currentGap = diff < 0 ? Math.abs(diff) : 0;
  
  // Wir "frieren" die Werte beim Start ein, um den "Unendlich aufaddieren"-Bug zu beheben!
  const [initialGap] = useState(currentGap);
  const [originalContribution] = useState(monthlyContribution);
  const [originalReturn] = useState(expectedReturn);
  const [originalRetirementAge] = useState(retirementAge);

  const [suggestedSavings] = useState(() => Math.max(25, Math.ceil((initialGap * 0.4) / 25) * 25));
  const [perfectBavNetto] = useState(() => initialGap === 0 ? 0 : Math.min(250, Math.max(10, Math.ceil((initialGap * 0.4 / 2.1) / 10) * 10)));
  const [coffeesPerDay] = useState(() => Math.max(1, Math.ceil(initialGap / 3.5 / 30)));

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Direkter Abschluss, falls es keine Lücke gibt
  useEffect(() => {
    if (step === 1 && isPositive) onBack(); 
  }, [step, isPositive, onBack]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
    else onBack();
  };

  const handleSendHR = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      handleNext();
    }, 2000);
  };

  // Logische Fehlerbehebung: Vorherigen Zustand sauber zurücksetzen, bevor neuer angewandt wird
  const handleSelectStrategy = (type: 'save' | 'invest' | 'time' | 'none') => {
    setAppliedStrategy(type);

    // 1. Immer zuerst auf die Original-Werte zurücksetzen
    setMonthlyContribution(originalContribution);
    setExpectedReturn(originalReturn);
    setRetirementAge(originalRetirementAge);

    // 2. Dann die neue Strategie anwenden
    if (type === 'save') setMonthlyContribution(originalContribution + suggestedSavings);
    if (type === 'invest') setExpectedReturn(8.5);
    if (type === 'time') setRetirementAge(originalRetirementAge + 2);
  };

  const OptionCard = ({ emoji, title, subtitle, onClick, active = false, disabled = false, highlight = false }: any) => (
    <button 
      onClick={onClick} disabled={disabled} 
      className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all text-left group border ${
        active ? 'bg-indigo-500/20 border-indigo-500 shadow-sm shadow-indigo-500/10' : 
        highlight ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/20' : 
        'bg-slate-900 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8">{emoji}</div>
        <div>
          <h3 className={`font-bold text-[15px] text-white`}>{title}</h3>
          {subtitle && <p className={`text-[12px] mt-0.5 ${highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{subtitle}</p>}
        </div>
      </div>
      {active ? <CheckCircle2 size={20} className="text-indigo-400" /> : <ChevronRight size={18} className={highlight ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} />}
    </button>
  );

  const BottomNav = ({ onNext, nextDisabled = false, nextLabel = "Weiter", onBack, nextIcon }: any) => (
    <div className="flex gap-3 mt-auto pt-6 border-t border-slate-800/50">
      {onBack && (
        <button onClick={onBack} className="flex-none w-14 h-14 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-sm">
          <ArrowLeft size={20} />
        </button>
      )}
      <button onClick={onNext} disabled={nextDisabled} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-[15px] rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/25">
        {nextLabel} {nextIcon}
      </button>
    </div>
  );

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-200 max-w-[430px] mx-auto font-sans relative">
      
      {/* Sticky Header mit Live-Ticker */}
      <div className="sticky top-0 z-50 bg-slate-950 px-6 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors cursor-pointer"><ArrowLeft size={20} /></button>
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors duration-500 ${isPositive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
             {isPositive ? <CheckCircle2 size={14} /> : <Zap size={14} className="fill-rose-400/20" />}
             <span className="text-xs font-bold tracking-wide">{isPositive ? "Ziel erreicht" : `Lücke: ${currentGap.toLocaleString("de-DE")} €`}</span>
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8 flex flex-col">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Dein Aktionsplan.</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Dir fehlen aktuell noch <strong className="text-rose-400">{currentGap} €</strong> pro Monat, um deinen Lebensstandard im Alter zu halten.
            </p>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl mb-8">
              <p className="text-[13px] text-slate-300 leading-relaxed font-medium">
                💡 Keine Panik. Das entspricht dem Verzicht auf ca. <strong>{coffeesPerDay} Kaffee To-Go</strong> pro Tag. Wir schließen diese Lücke in 3 simplen Schritten.
              </p>
            </div>
            <BottomNav onNext={handleNext} nextLabel="Los geht's" nextIcon={<Sparkles size={18} />} />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Schritt 1 von 3</div>
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Geld vom Chef.</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Arbeitgeber verschenken oft bis zu 40 € pro Monat an vermögenswirksamen Leistungen (VL).
            </p>
            <div className="space-y-3">
              <OptionCard emoji={<Landmark size={20} className="text-amber-400" />} title="VL-Sparen aktivieren" subtitle="Nimmt 40 € Lücke ab" active={selectedVL === 'yes'} onClick={() => { setSelectedVL('yes'); setVlActive(true); }} />
              <OptionCard emoji={<X size={20} className="text-slate-400" />} title="Überspringen" subtitle="Mein AG bietet das nicht an" active={selectedVL === 'no'} onClick={() => { setSelectedVL('no'); setVlActive(false); }} />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedVL} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Schritt 2 von 3</div>
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Die Brutto-Netto-Magie.</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Durch die betriebliche Altersvorsorge sparst du Steuern. Um deine verbleibende Lücke zu schließen, reicht ein kleiner Netto-Verzicht.
            </p>
            <div className="space-y-3">
              <OptionCard emoji={<Briefcase size={20} className="text-indigo-200" />} title={`bAV nutzen (${perfectBavNetto} € Netto)`} subtitle={`Fließt als ${Math.round(perfectBavNetto * 2.1)} € in deinen Vertrag`} active={selectedBAV === 'yes'} highlight={selectedBAV !== 'yes'} onClick={() => { setSelectedBAV('yes'); setBavNettoVerzicht([perfectBavNetto]); }} />
              <OptionCard emoji={<X size={20} className="text-slate-400" />} title="Überspringen" subtitle="Ich regle das lieber privat" active={selectedBAV === 'no'} onClick={() => { setSelectedBAV('no'); setBavNettoVerzicht([0]); }} />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedBAV} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Schritt 3 von 3</div>
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Der private Turbo.</h1>
            {isPositive ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Ziel erreicht!</h2>
                <p className="text-sm text-slate-400 text-center">Du musst deine privaten Finanzen nicht weiter anpassen.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">Wähle eine Strategie, wie wir deinen privaten Plan anpassen sollen:</p>
                <div className="space-y-3 overflow-y-auto pb-4">
                  <OptionCard emoji={<TrendingUp size={20} className="text-emerald-400" />} title="Ich spare mehr" subtitle={`Sparrate auf ${monthlyContribution + suggestedSavings} € erhöhen`} active={appliedStrategy === 'save'} onClick={() => handleSelectStrategy('save')} />
                  <OptionCard emoji={<PieChart size={20} className="text-cyan-400" />} title="Mehr Risiko" subtitle="Renditeerwartung auf 8.5% anheben" active={appliedStrategy === 'invest'} onClick={() => handleSelectStrategy('invest')} />
                  <OptionCard emoji={<CalendarClock size={20} className="text-purple-400" />} title="Länger arbeiten" subtitle="Renteneintritt um 2 Jahre verschieben" active={appliedStrategy === 'time'} onClick={() => handleSelectStrategy('time')} />
                  <OptionCard emoji={<X size={20} className="text-slate-400" />} title="Nichts anpassen" subtitle="Lücke bleibt bestehen" active={appliedStrategy === 'none'} onClick={() => handleSelectStrategy('none')} />
                </div>
              </>
            )}
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!isPositive && !appliedStrategy} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Wir übernehmen die Bürokratie.</h1>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {(vlActive || bavNettoVerzicht[0] > 0) 
                ? "Du hast dich für Arbeitgeber-Zuschüsse entschieden. Wir haben die Anträge für deine Personalabteilung vorbereitet." 
                : "Du hast deinen Plan optimiert. Alles ist sicher hinterlegt."}
            </p>

            {(vlActive || bavNettoVerzicht[0] > 0) && (
              <div className="space-y-4 mb-8">
                {vlActive && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center"><Send size={16} className="text-indigo-400" /></div>
                    <div>
                      <p className="font-bold text-[14px] text-white">Antrag auf VL-Sparen</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">An: hr@meinefirma.de</p>
                    </div>
                  </div>
                )}
                {bavNettoVerzicht[0] > 0 && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center"><Send size={16} className="text-indigo-400" /></div>
                    <div>
                      <p className="font-bold text-[14px] text-white">Antrag auf bAV ({bavNettoVerzicht[0]} €)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">An: hr@meinefirma.de</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <BottomNav onBack={handleBack} onNext={handleSendHR} nextDisabled={isSending} nextLabel={isSending ? "Sende..." : "Plan aktivieren"} nextIcon={isSending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />} />
          </div>
        )}

        {step === 6 && (
           <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 size={40} className="text-emerald-400" />
             </div>
             <h1 className="text-3xl font-black text-white mb-2">Erfolgreich!</h1>
             <p className="text-sm text-slate-400 text-center px-4 mb-10">
               Dein Plan wurde aktualisiert und (falls gewünscht) an HR gesendet.
             </p>
             <button onClick={onBack} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2">
               Zurück zum Dashboard <ChevronRight size={18} />
             </button>
           </div>
        )}
      </div>
    </div>
  );
}