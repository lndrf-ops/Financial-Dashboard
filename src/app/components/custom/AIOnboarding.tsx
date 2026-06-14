import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, ArrowLeft, ChevronRight, UploadCloud, FileText, Building, Briefcase, X, Maximize2 } from "lucide-react";

export interface AIOnboardingData {
  age: number;
  monthlySavings: number;
  targetPension: number;
  initialCapital: number;
  income: number;
  drvNetto: number;
  bavPayout: number;
}

interface AIOnboardingProps {
  onComplete: (data: AIOnboardingData) => void;
  onSwitchToPersonas: () => void;
}

const AGES = Array.from({ length: 51 }, (_, i) => i + 16);
const INCOMES = Array.from({ length: 66 }, (_, i) => (i + 5) * 100); // 500–7000
const SAVINGS = Array.from({ length: 101 }, (_, i) => i * 10); // 0–1000
const ITEM_H = 64;

function AgeDrumPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = AGES.indexOf(value);
    el.scrollTop = idx * ITEM_H;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const snapped = Math.max(0, Math.min(idx, AGES.length - 1));
      el.scrollTop = snapped * ITEM_H;
      onChange(AGES[snapped]);
    }, 80);
  }, [onChange]);

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative h-[192px] w-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-10 border-y-2 border-indigo-500/60 bg-indigo-500/5 rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-slate-950 to-transparent" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll no-scrollbar"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {AGES.map((age) => (
            <div
              key={age}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center font-black text-4xl transition-colors ${age === value ? 'text-white' : 'text-slate-600'}`}
            >
              {age}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-2xl font-bold text-slate-500">Jahre</span>
    </div>
  );
}

function IncomeDrumPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = INCOMES.indexOf(value);
    el.scrollTop = (idx < 0 ? 0 : idx) * ITEM_H;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const snapped = Math.max(0, Math.min(idx, INCOMES.length - 1));
      el.scrollTop = snapped * ITEM_H;
      onChange(INCOMES[snapped]);
    }, 80);
  }, [onChange]);

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative h-[192px] w-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-10 border-y-2 border-indigo-500/60 bg-indigo-500/5 rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-slate-950 to-transparent" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll no-scrollbar"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {INCOMES.map((inc) => (
            <div
              key={inc}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center font-black text-3xl transition-colors ${inc === value ? 'text-white' : 'text-slate-600'}`}
            >
              {inc.toLocaleString('de-DE')}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-2xl font-bold text-slate-500">€ / Monat</span>
    </div>
  );
}

function SavingsDrumPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = SAVINGS.indexOf(value);
    el.scrollTop = (idx < 0 ? 0 : idx) * ITEM_H;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H);
      const snapped = Math.max(0, Math.min(idx, SAVINGS.length - 1));
      el.scrollTop = snapped * ITEM_H;
      onChange(SAVINGS[snapped]);
    }, 80);
  }, [onChange]);

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative h-[192px] w-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-slate-950 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-10 border-y-2 border-indigo-500/60 bg-indigo-500/5 rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-slate-950 to-transparent" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll no-scrollbar"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {SAVINGS.map((s) => (
            <div
              key={s}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center font-black text-4xl transition-colors ${s === value ? 'text-white' : 'text-slate-600'}`}
            >
              {s}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-2xl font-bold text-slate-500">€ / Monat</span>
    </div>
  );
}

export function AIOnboarding({ onComplete, onSwitchToPersonas }: AIOnboardingProps) {
  const [step, setStep] = useState(1);

  // Data
  const [age, setAge] = useState<number>(0);
  const [importMethod, setImportMethod] = useState<'upload' | 'manual' | null>(null);
  const [income, setIncome] = useState<number>(3000);
  const [drvNetto, setDrvNetto] = useState<number>(1450);
  const [bavPayout, setBavPayout] = useState<number>(0);
  const [initialCapital] = useState<number>(0);
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [foundBonus, setFoundBonus] = useState(0);

  // UI
  const [customAgeInput, setCustomAgeInput] = useState("30");
  const [customIncomeInput, setCustomIncomeInput] = useState("3000");
  const [customMonthlyInput, setCustomMonthlyInput] = useState("150");
  const [showCustomMonthly, setShowCustomMonthly] = useState(false);
  const [isUploadingDRV, setIsUploadingDRV] = useState(false);
  const [isUploadingBAV, setIsUploadingBAV] = useState(false);
  const [loadingText, setLoadingText] = useState("Analysiere Daten...");
  const [livePension, setLivePension] = useState(0);
  const [liveBav, setLiveBav] = useState(0);

  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; label: string } | null>(null);

  // Selection states
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedDRVOption, setSelectedDRVOption] = useState<'upload' | 'manual' | null>(null);
  const [selectedBonusOption, setSelectedBonusOption] = useState<'yes' | 'no' | null>(null);
  const [selectedBavOption, setSelectedBavOption] = useState<'upload' | 'none' | null>(null);
  const [selectedSavingsAmount, setSelectedSavingsAmount] = useState<number | null>(null);

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (step === 8) {
      const t1 = setTimeout(() => setLoadingText("Berechne Steuern & Inflation..."), 800);
      const t2 = setTimeout(() => setLoadingText("Konsolidiere alle Rentenquellen..."), 1600);
      const t3 = setTimeout(() => setLoadingText("Dein Dashboard ist bereit!"), 2400);
      const t4 = setTimeout(() => {
        onComplete({ age: age || 30, monthlySavings, targetPension: 2500, initialCapital, income, drvNetto: drvNetto + foundBonus, bavPayout });
      }, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [step, age, monthlySavings, initialCapital, income, drvNetto, bavPayout, foundBonus, onComplete]);

  const handleNext = () => setStep(prev => prev + 1);

  const handleBack = () => {
    if (showCustomMonthly) {
      setShowCustomMonthly(false);
      setSelectedSavingsAmount(null);
    } else if (importMethod === 'manual') {
      setImportMethod(null);
      setSelectedDRVOption(null);
    } else if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleUploadScanDRV = () => {
    setImportMethod('upload');
    setIsUploadingDRV(true);
    let current = 0;
    const target = 1450;
    const interval = setInterval(() => {
      current += 65;
      if (current >= target) { current = target; clearInterval(interval); }
      setLivePension(current);
    }, 80);
    setTimeout(() => {
      clearInterval(interval); setLivePension(target); setDrvNetto(target); setIsUploadingDRV(false); handleNext();
    }, 3000);
  };

  const handleUploadScanBAV = () => {
    setIsUploadingBAV(true);
    let current = 0;
    const target = 280;
    const interval = setInterval(() => {
      current += 15;
      if (current >= target) { current = target; clearInterval(interval); }
      setLiveBav(current);
    }, 80);
    setTimeout(() => {
      clearInterval(interval); setLiveBav(target); setBavPayout(target); setIsUploadingBAV(false); handleNext();
    }, 3000);
  };

  // Compute nav config for the current step (null = hide nav)
  const navConfig = (() => {
    if (isUploadingDRV || isUploadingBAV || step === 8) return null;
    if (step === 1) return {
      onNext: handleNext,
      nextDisabled: !selectedFeeling,
      nextLabel: "Weiter",
      onBack: onSwitchToPersonas,
    };
    if (step === 2) return {
      onNext: () => {
        const v = parseInt(customAgeInput);
        if (!isNaN(v) && v > 15 && v < 67) { setAge(v); handleNext(); }
      },
      nextDisabled: !customAgeInput || parseInt(customAgeInput) < 16,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 3 && importMethod === 'manual') return {
      onNext: () => {
        const v = parseInt(customIncomeInput);
        if (!isNaN(v) && v > 0) { setIncome(v); setDrvNetto(Math.round(v * 0.45)); handleNext(); }
      },
      nextDisabled: !customIncomeInput || parseInt(customIncomeInput) <= 0,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 3) return {
      onNext: () => {
        if (selectedDRVOption === 'upload') handleUploadScanDRV();
        else if (selectedDRVOption === 'manual') setImportMethod('manual');
      },
      nextDisabled: !selectedDRVOption,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 4) return {
      onNext: () => {
        if (selectedBonusOption === 'yes') { setFoundBonus(85); handleNext(); }
        else if (selectedBonusOption === 'no') { setFoundBonus(0); handleNext(); }
      },
      nextDisabled: !selectedBonusOption,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 5) return {
      onNext: handleNext,
      nextDisabled: false,
      nextLabel: foundBonus > 0 ? "Weiter" : "Weiter",
      onBack: handleBack,
    };
    if (step === 6) return {
      onNext: () => {
        if (selectedBavOption === 'upload') handleUploadScanBAV();
        else if (selectedBavOption === 'none') { setBavPayout(0); handleNext(); }
      },
      nextDisabled: !selectedBavOption,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 7 && showCustomMonthly) return {
      onNext: () => {
        const v = parseInt(customMonthlyInput);
        if (!isNaN(v) && v >= 0) { setMonthlySavings(v); handleNext(); }
      },
      nextDisabled: !customMonthlyInput || parseInt(customMonthlyInput) < 0,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 7) return {
      onNext: () => {
        if (selectedSavingsAmount !== null && selectedSavingsAmount >= 0) {
          setMonthlySavings(selectedSavingsAmount);
          handleNext();
        }
      },
      nextDisabled: selectedSavingsAmount === null || selectedSavingsAmount < 0,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    return null;
  })();

  const BottomNav = ({ onNext, nextDisabled = false, nextLabel = "Weiter", onBack }: {
    onNext: () => void; nextDisabled?: boolean; nextLabel?: string; onBack?: () => void;
  }) => (
    <div className="flex gap-3">
      {onBack
        ? <button onClick={onBack} className="flex-none w-14 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
        : <div className="flex-none w-14" />
      }
      <button onClick={onNext} disabled={nextDisabled} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer">
        {nextLabel}
      </button>
    </div>
  );

  const OptionCard = ({ emoji, title, subtitle, onClick, selected = false, disabled = false }: {
    emoji?: string; title: string; subtitle?: string; onClick: () => void; selected?: boolean; disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full border p-5 rounded-2xl flex items-center justify-between transition-all text-left group ${
        selected
          ? 'bg-indigo-500/10 border-indigo-500'
          : disabled
            ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
            : 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        {emoji && <span className="text-2xl flex items-center justify-center w-8 h-8">{emoji}</span>}
        <div>
          <h3 className="font-bold text-[15px] text-white">{title}</h3>
          {subtitle && <p className="text-[12px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={18} className={selected ? 'text-indigo-400' : 'text-slate-600 group-hover:text-indigo-400 transition-colors'} />
    </button>
  );

  return (
    <div className="bg-slate-950 h-screen flex flex-col text-slate-200 max-w-[430px] mx-auto font-sans relative overflow-hidden">
      {/* Top bar */}
      <div className="flex-none bg-slate-950 px-6 py-4">
        {step < 8 && (
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Scrollable step content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-6 pt-6 min-h-0">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Altersvorsorge. Ein lästiges Thema.</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Wie fühlst du dich, wenn du an deine Rente denkst?</p>
            <div className="space-y-3">
              <OptionCard emoji="🙈" title="Ich verdränge es" subtitle="Ist mir noch zu weit weg" selected={selectedFeeling === 'ignore'} onClick={() => setSelectedFeeling('ignore')} />
              <OptionCard emoji="😰" title="Macht mir Sorgen" subtitle="Ich habe Angst vor der Lücke" selected={selectedFeeling === 'worried'} onClick={() => setSelectedFeeling('worried')} />
              <OptionCard emoji="😎" title="Bin entspannt" subtitle="Ich habe bereits einen Plan" selected={selectedFeeling === 'relaxed'} onClick={() => setSelectedFeeling('relaxed')} />
            </div>
          </div>
        )}

        {/* STEP 2: Age */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Verstanden. Lass uns Licht ins Dunkel bringen.</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Wie alt bist du aktuell?</p>
            <div className="flex-1 flex items-center justify-center">
              <AgeDrumPicker value={parseInt(customAgeInput) || 30} onChange={(v) => setCustomAgeInput(String(v))} />
            </div>
          </div>
        )}

        {/* STEP 3: DRV selection */}
        {step === 3 && importMethod !== 'manual' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            {!isUploadingDRV ? (
              <>
                <h1 className="text-2xl font-black text-white mb-3 leading-tight">Deine gesetzliche Rente.</h1>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">Der wichtigste Grundbaustein. Hast du deine Renteninformation zur Hand?</p>
                <button onClick={() => setFullscreenImage({ src: '/Renteninformation.webp', label: 'Renteninformation' })} className="rounded-2xl overflow-hidden border border-slate-800 mb-5 relative w-full cursor-pointer group">
                  <img src="/Renteninformation.webp" alt="Beispiel Renteninformation" className="w-full object-cover max-h-40 object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <p className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dieses Dokument benötigst du</p>
                  <div className="absolute top-2 right-2 w-7 h-7 bg-slate-950/60 rounded-lg flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={13} className="text-white" />
                  </div>
                </button>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedDRVOption('upload')}
                    className={`w-full relative overflow-hidden p-5 rounded-2xl flex items-center justify-between transition-all cursor-pointer group border ${
                      selectedDRVOption === 'upload'
                        ? 'bg-indigo-500/20 border-indigo-500'
                        : 'bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <UploadCloud size={20} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-white">Dokument scannen</h3>
                        <p className="text-[11px] text-indigo-300/80 mt-0.5">Empfohlen • DRV-Scan mit KI</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-indigo-400 relative z-10" />
                  </div>
                  <div className="flex items-center gap-3 my-4">
                    <div className="h-px bg-slate-800 flex-1" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Oder manuell</span>
                    <div className="h-px bg-slate-800 flex-1" />
                  </div>
                  <OptionCard emoji="💰" title="Über Gehalt schätzen" subtitle="Geht schneller, aber ungenauer" selected={selectedDRVOption === 'manual'} onClick={() => setSelectedDRVOption('manual')} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in">
                <div className="mb-12 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Erwartete DRV-Rente (Netto)</p>
                  <p className="text-6xl font-black text-indigo-400 tabular-nums">€ {livePension}</p>
                </div>
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText size={20} className="text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-bold text-white text-center mb-1">Renteninformation_2026.pdf</p>
                <p className="text-xs text-indigo-400 animate-pulse text-center">Extrahiere Entgeltpunkte...</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Manual income */}
        {step === 3 && importMethod === 'manual' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Wie hoch ist dein aktuelles Netto-Einkommen?</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Wir nutzen das, um deine gesetzliche Rente grob zu schätzen.</p>
            <div className="flex-1 flex items-center justify-center">
              <IncomeDrumPicker
                value={parseInt(customIncomeInput) || 2500}
                onChange={(v) => setCustomIncomeInput(String(v))}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Trüffelschwein */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-3 leading-tight">Lass uns verstecktes Geld finden.</h1>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">Hast du nach deinem 17. Lebensjahr eine Schule besucht oder studiert?</p>
            <div className="space-y-3">
              <OptionCard emoji="🎓" title="Ja, habe ich" subtitle="Wir prüfen auf fehlende Rentenpunkte" selected={selectedBonusOption === 'yes'} onClick={() => setSelectedBonusOption('yes')} />
              <OptionCard emoji="🛠️" title="Nein, direkte Ausbildung/Arbeit" selected={selectedBonusOption === 'no'} onClick={() => setSelectedBonusOption('no')} />
            </div>
          </div>
        )}

        {/* STEP 5: Bonus result */}
        {step === 5 && (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1 justify-center text-center">
            {foundBonus > 0 ? (
              <>
                <div className="text-[60px] mb-2">🎉</div>
                <h1 className="text-3xl font-black text-white mb-4">85 € Free Money gefunden!</h1>
                <p className="text-slate-400 leading-relaxed px-4 mb-8">
                  Schul- und Studienzeiten sind bei der DRV oft nicht erfasst. Wir generieren später automatisch das Formular (V0100) für dich, um dir dieses Geld zu sichern.
                </p>
              </>
            ) : (
              <>
                <div className="text-[60px] mb-2">👍</div>
                <h1 className="text-3xl font-black text-white mb-4">Alles erfasst!</h1>
                <p className="text-slate-400 leading-relaxed px-4 mb-8">Dein Rentenverlauf scheint lückenlos zu sein.</p>
              </>
            )}
          </div>
        )}

        {/* STEP 6: bAV */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            {!isUploadingBAV ? (
              <>
                <h1 className="text-2xl font-black text-white mb-3 leading-tight">Deine Betriebliche Rente.</h1>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed">Hast du eine bAV über deinen Arbeitgeber (z.B. Allianz, MetallRente)?</p>
                <button onClick={() => setFullscreenImage({ src: '/Renteninformation.webp', label: 'Standmitteilung' })} className="rounded-2xl overflow-hidden border border-slate-800 mb-5 relative w-full cursor-pointer group">
                  <img src="/Renteninformation.webp" alt="Beispiel Renteninformation" className="w-full object-cover max-h-40 object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <p className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dieses Dokument benötigst du</p>
                  <div className="absolute top-2 right-2 w-7 h-7 bg-slate-950/60 rounded-lg flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={13} className="text-white" />
                  </div>
                </button>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedBavOption('upload')}
                    className={`w-full relative overflow-hidden p-5 rounded-2xl flex items-center justify-between transition-all cursor-pointer group border ${
                      selectedBavOption === 'upload'
                        ? 'bg-indigo-500/10 border-indigo-500'
                        : 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Briefcase size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-white">Standmitteilung scannen</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Automatischer bAV-Import</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className={selectedBavOption === 'upload' ? 'text-indigo-400' : 'text-slate-600 group-hover:text-indigo-400 transition-colors'} />
                  </div>
                  <OptionCard emoji="🤷" title="Ich habe keine bAV" subtitle="Oder weiß es nicht" selected={selectedBavOption === 'none'} onClick={() => setSelectedBavOption('none')} />
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in">
                <div className="mb-12 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Gefundene bAV-Ansprüche</p>
                  <p className="text-6xl font-black text-blue-400 tabular-nums">€ {liveBav}</p>
                </div>
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building size={20} className="text-blue-400 animate-pulse" />
                  </div>
                </div>
                <p className="text-sm font-bold text-white text-center mb-1">Standmitteilung_Allianz.pdf</p>
                <p className="text-xs text-blue-400 animate-pulse text-center">Lese Vertragswerte aus...</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Sparrate */}
        {step === 7 && !showCustomMonthly && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-8 leading-tight">Wie viel legst du privat jeden Monat zurück?</h1>
            <div className="space-y-3">
              <OptionCard emoji="💤" title="0 €" subtitle="Noch gar nichts" selected={selectedSavingsAmount === 0} onClick={() => setSelectedSavingsAmount(0)} />
              <OptionCard emoji="🌱" title="50 €" subtitle="Der Einstieg" selected={selectedSavingsAmount === 50} onClick={() => setSelectedSavingsAmount(50)} />
              <OptionCard emoji="⭐" title="150 €" subtitle="Der Klassiker" selected={selectedSavingsAmount === 150} onClick={() => setSelectedSavingsAmount(150)} />
              <OptionCard emoji="🎯" title="Eigener Betrag" subtitle="Individuell festlegen" selected={selectedSavingsAmount === -1} onClick={() => { setSelectedSavingsAmount(-1); setShowCustomMonthly(true); }} />
            </div>
          </div>
        )}

        {/* STEP 7: Custom monthly */}
        {step === 7 && showCustomMonthly && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-white mb-8 leading-tight">Dein individueller monatlicher Betrag</h1>
            <div className="flex-1 flex items-center justify-center">
              <SavingsDrumPicker
                value={parseInt(customMonthlyInput) || 0}
                onChange={(v) => setCustomMonthlyInput(String(v))}
              />
            </div>
          </div>
        )}

        {/* STEP 8: AI Processing */}
        {step === 8 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-[-20px] bg-indigo-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
              <div className="relative w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-2xl">
                <Loader2 size={40} className="text-indigo-400 animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white text-center h-8 transition-opacity duration-300">{loadingText}</h2>
          </div>
        )}

      </div>

      {/* Bottom nav — always pinned to bottom of phone */}
      {navConfig && (
        <div className="flex-none px-6 pb-8 pt-4 bg-slate-950">
          <BottomNav {...navConfig} />
        </div>
      )}

      {/* Fullscreen image overlay */}
      {fullscreenImage && (
        <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{fullscreenImage.label}</p>
            <button onClick={() => setFullscreenImage(null)} className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
              <X size={18} className="text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <img src={fullscreenImage.src} alt={fullscreenImage.label} className="w-full rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
