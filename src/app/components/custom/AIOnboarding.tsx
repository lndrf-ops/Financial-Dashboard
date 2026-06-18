import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import {
  Loader2, ArrowLeft, ChevronRight, FileText, X, EyeOff, AlertTriangle,
  CheckCircle2, GraduationCap, Wrench, HelpCircle, Calculator,
  TrendingUp, Building2, Shield, Briefcase,
} from "lucide-react";

export interface PensionAsset {
  type: 'drv' | 'bAV' | 'riester' | 'ruerup' | 'private';
  provider: string;
  monthlyPayout: number;
  inflationAdjusted: boolean;
}

export interface AIOnboardingData {
  age: number;
  monthlySavings: number;
  targetPension: number;
  initialCapital: number;
  income: number;
  pensionAssets: PensionAsset[];
  drvBonus: number;
  employmentType: 'employed' | 'public' | 'selfEmployed';
}

interface AIOnboardingProps {
  onComplete: (data: AIOnboardingData) => void;
  onSwitchToPersonas: () => void;
}

// Mock-Werte aus dem TR-Ökosystem
const TR_AGE = 28;
const TR_SAVINGS = 150;

const MOCK_DETECTED: PensionAsset[] = [
  { type: 'drv',     provider: 'Deutsche Rentenversicherung', monthlyPayout: 1450, inflationAdjusted: true  },
  { type: 'bAV',     provider: 'Allianz',                    monthlyPayout: 280,  inflationAdjusted: false },
  { type: 'riester', provider: 'Deka Investment',            monthlyPayout: 115,  inflationAdjusted: false },
];

const DOC_CATEGORIES = [
  { label: 'Gesetzlich',  docs: ['DRV Renteninformation', 'Beamten-Versorgungsauskunft'] },
  { label: 'Betrieblich', docs: ['bAV Standmitteilung', 'VBL-Nachweis', 'Direktversicherung'] },
  { label: 'Privat',      docs: ['Riester-/Rürup-Bescheinigung', 'Private Lebensversicherung', 'Externer Depotauszug'] },
];

const INCOMES = Array.from({ length: 66 }, (_, i) => (i + 5) * 100);
const ITEM_H = 64;

function getDefaultTargetByAge(age: number): number {
  if (age < 35) return 2000;
  if (age < 50) return 2400;
  return 2800;
}

function IncomeDrumPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = INCOMES.indexOf(value);
    el.scrollTop = (idx < 0 ? 1 : idx + 1) * ITEM_H;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H) - 1;
      const snapped = Math.max(0, Math.min(idx, INCOMES.length - 1));
      el.scrollTop = (snapped + 1) * ITEM_H;
      onChange(INCOMES[snapped]);
    }, 80);
  }, [onChange]);

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative h-[192px] w-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-10 border-y-2 border-black/20 bg-black/[0.03] rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-white to-transparent" />
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
              className={`flex items-center justify-center font-black text-3xl transition-colors ${inc === value ? 'text-black' : 'text-gray-300'}`}
            >
              {inc.toLocaleString('de-DE')}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-2xl font-bold text-gray-400">€ / Monat</span>
    </div>
  );
}

export function AIOnboarding({ onComplete, onSwitchToPersonas }: AIOnboardingProps) {
  const [step, setStep] = useState(1);

  // TR-Profil ist bereits bekannt — kein manueller Input nötig
  const age = TR_AGE;
  const monthlySavings = TR_SAVINGS;

  const [syncStep, setSyncStep] = useState(0);
  const [importMethod, setImportMethod] = useState<'upload' | 'manual' | null>(null);
  const [income, setIncome] = useState<number>(3000);
  const [initialCapital] = useState<number>(0);
  const [targetPension, setTargetPension] = useState(getDefaultTargetByAge(TR_AGE));
  const [pensionAssets, setPensionAssets] = useState<PensionAsset[]>([]);

  // Dropzone states
  const [dropState, setDropState] = useState<'idle' | 'processing' | 'done'>('idle');
  const [processingStep, setProcessingStep] = useState(0); // 0=idle, 1/2/3=each doc
  const [showDocModal, setShowDocModal] = useState(false);

  const [customIncomeInput, setCustomIncomeInput] = useState("3000");
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [docSelected, setDocSelected] = useState(false);
  const [loadingText, setLoadingText] = useState("Analysiere Daten...");
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [selectedEmployment, setSelectedEmployment] = useState<'employed' | 'public' | 'selfEmployed' | null>(null);
  const [selectedBonusOption, setSelectedBonusOption] = useState<'yes' | 'no' | null>(null);
  const [foundBonus, setFoundBonus] = useState(0);
  const [showBonusInfo, setShowBonusInfo] = useState(false);

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  // Schritt 1: TR-Profil Sync — animiert, dann automatisch weiter
  useEffect(() => {
    if (step !== 1) return;
    const t1 = setTimeout(() => setSyncStep(1), 800);
    const t2 = setTimeout(() => setSyncStep(2), 1700);
    const t3 = setTimeout(() => setStep(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [step]);

  // Schritt 3: Dropzone-Verarbeitungsanimation
  useEffect(() => {
    if (step !== 3 || dropState !== 'processing') return;
    const t1 = setTimeout(() => setProcessingStep(1), 1000);
    const t2 = setTimeout(() => setProcessingStep(2), 2200);
    const t3 = setTimeout(() => setProcessingStep(3), 3400);
    const t4 = setTimeout(() => {
      setDropState('done');
      setPensionAssets(MOCK_DETECTED);
    }, 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step, dropState]);

  // Schritt 7: Finaler Ladescreen → Dashboard öffnen
  useEffect(() => {
    if (step !== 7) return;
    const t1 = setTimeout(() => setLoadingText("Berechne Steuern & Inflation..."), 800);
    const t2 = setTimeout(() => setLoadingText("Konsolidiere alle Rentenquellen..."), 1600);
    const t3 = setTimeout(() => setLoadingText("Dein Dashboard ist bereit!"), 2400);
    const t4 = setTimeout(() => {
      const finalAssets = pensionAssets.map(a =>
        a.type === 'drv' ? { ...a, monthlyPayout: a.monthlyPayout + foundBonus } : a
      );
      onComplete({ age, monthlySavings, targetPension, initialCapital, income, pensionAssets: finalAssets, drvBonus: foundBonus, employmentType: selectedEmployment ?? 'employed' });
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [step, age, monthlySavings, targetPension, initialCapital, income, pensionAssets, foundBonus, selectedEmployment, onComplete]);

  const handleNext = () => setStep(prev => prev + 1);

  const handleBack = () => {
    if (showIncomePicker) {
      setShowIncomePicker(false);
    } else if (docSelected && dropState === 'idle') {
      setDocSelected(false);
    } else if (importMethod === 'manual') {
      setImportMethod(null);
    } else if (dropState !== 'idle') {
      setDropState('idle');
      setProcessingStep(0);
      setPensionAssets([]);
      setDocSelected(false);
    } else if (step > 2) {
      setStep(prev => prev - 1);
    }
  };

  const BottomNav = ({ onNext, nextDisabled = false, nextLabel = "Weiter", onBack, hideNext = false }: {
    onNext?: () => void; nextDisabled?: boolean; nextLabel?: string; onBack?: () => void; hideNext?: boolean;
  }) => (
    <div className="flex gap-3">
      {onBack
        ? <button onClick={onBack} className="flex-none w-14 bg-[#F4F4F5] hover:bg-gray-200 text-black rounded-xl transition-colors cursor-pointer flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
        : <div className="flex-none w-14" />
      }
      {!hideNext && (
        <button onClick={onNext} disabled={nextDisabled} className="flex-1 bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer">
          {nextLabel}
        </button>
      )}
    </div>
  );

  const OptionCard = ({ emoji, title, subtitle, onClick, selected = false, disabled = false }: {
    emoji?: ReactNode; title: string; subtitle?: string; onClick: () => void; selected?: boolean; disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full border p-5 rounded-2xl flex items-center justify-between transition-all text-left group ${
        selected
          ? 'bg-black/[0.04] border-black'
          : disabled
            ? 'bg-[#F4F4F5] border-gray-200 opacity-40 cursor-not-allowed'
            : 'bg-[#F9FAFB] border-gray-200 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        {emoji && <div className="flex items-center justify-center w-8 h-8 shrink-0 text-black">{emoji}</div>}
        <div>
          <h3 className="font-bold text-[15px] text-black">{title}</h3>
          {subtitle && <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={18} className={selected ? 'text-black' : 'text-gray-300 group-hover:text-gray-600 transition-colors'} />
    </button>
  );

  const navConfig = (() => {
    if (step === 1 || step === 7) return null;
    if (step === 2) return {
      onNext: handleNext,
      nextDisabled: !selectedFeeling,
      nextLabel: "Weiter",
      onBack: onSwitchToPersonas,
    };
    if (step === 3 && importMethod === 'manual' && showIncomePicker) return {
      onNext: () => {
        const v = parseInt(customIncomeInput);
        const salary = !isNaN(v) && v > 0 ? v : 2500;
        setIncome(salary);
        setTargetPension(Math.round(salary * 0.8));
        setPensionAssets([{ type: 'drv', provider: 'Schätzung via Gehalt', monthlyPayout: Math.round(salary * 0.45), inflationAdjusted: true }]);
        handleNext();
      },
      nextDisabled: false,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 3 && importMethod === 'manual') return {
      onNext: () => setShowIncomePicker(true),
      nextDisabled: false,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 3 && dropState === 'done') return {
      onNext: handleNext,
      nextDisabled: false,
      nextLabel: "Werte übernehmen",
      onBack: handleBack,
    };
    if (step === 3 && dropState === 'processing') return {
      onNext: undefined,
      nextDisabled: true,
      nextLabel: "Analysiere...",
      onBack: handleBack,
    };
    if (step === 3) return {
      onNext: () => { setDropState('processing'); setProcessingStep(0); },
      nextDisabled: !docSelected && importMethod !== 'manual',
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 4) return {
      onNext: handleNext,
      nextDisabled: !selectedEmployment,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 5) return {
      onNext: () => {
        if (selectedBonusOption === 'yes') { setFoundBonus(85); handleNext(); }
        else if (selectedBonusOption === 'no') { setFoundBonus(0); handleNext(); }
      },
      nextDisabled: !selectedBonusOption,
      nextLabel: "Weiter",
      onBack: handleBack,
    };
    if (step === 6) return { onNext: handleNext, nextDisabled: false, nextLabel: "Weiter zum Dashboard", onBack: handleBack };
    return null;
  })();

  return (
    <div className="bg-white h-screen flex flex-col text-gray-900 max-w-[430px] mx-auto font-sans relative overflow-hidden">

      {/* Progress Bar */}
      <div className="flex-none bg-white px-6 py-4">
        {step > 1 && step < 7 && (
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col px-6 pt-6 min-h-0">

        {/* SCHRITT 1: TR Profil-Sync (auto) */}
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-8 border border-gray-200 shadow-sm">
              <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-black text-black mb-1 text-center">Trade Republic Profil</h2>
            <p className="text-[13px] text-gray-500 mb-10 text-center">Deine Daten werden synchronisiert...</p>
            <div className="w-full space-y-3">
              <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${syncStep >= 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F9FAFB] border-gray-200 opacity-50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${syncStep >= 1 ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                  {syncStep >= 1
                    ? <CheckCircle2 size={17} className="text-emerald-600" />
                    : <Loader2 size={17} className="text-gray-400 animate-spin" />}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-black leading-tight">Alter erkannt</p>
                  {syncStep >= 1 && <p className="text-[12px] text-emerald-600 font-semibold mt-0.5 animate-in fade-in duration-300">{TR_AGE} Jahre</p>}
                </div>
              </div>
              <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${syncStep >= 2 ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F9FAFB] border-gray-200 opacity-50'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${syncStep >= 2 ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                  {syncStep >= 2
                    ? <CheckCircle2 size={17} className="text-emerald-600" />
                    : <Loader2 size={17} className="text-gray-400 animate-spin" />}
                </div>
                <div>
                  <p className="text-[13px] font-bold text-black leading-tight">Aktive Sparpläne importiert</p>
                  {syncStep >= 2 && <p className="text-[12px] text-emerald-600 font-semibold mt-0.5 animate-in fade-in duration-300">{TR_SAVINGS} €/Mtl.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCHRITT 2: Gefühl */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Altersvorsorge. Ein lästiges Thema.</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Wie fühlst du dich, wenn du an deine Rente denkst?</p>
            <div className="space-y-3">
              <OptionCard emoji={<EyeOff size={20} />} title="Ich verdränge es" subtitle="Ist mir noch zu weit weg" selected={selectedFeeling === 'ignore'} onClick={() => setSelectedFeeling('ignore')} />
              <OptionCard emoji={<AlertTriangle size={20} />} title="Macht mir Sorgen" subtitle="Ich habe Angst vor der Lücke" selected={selectedFeeling === 'worried'} onClick={() => setSelectedFeeling('worried')} />
              <OptionCard emoji={<CheckCircle2 size={20} />} title="Bin entspannt" subtitle="Ich habe bereits einen Plan" selected={selectedFeeling === 'relaxed'} onClick={() => setSelectedFeeling('relaxed')} />
            </div>
          </div>
        )}

        {/* SCHRITT 3: Magic Dropzone */}
        {step === 3 && !(importMethod === 'manual' && showIncomePicker) && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">

            {dropState === 'idle' && (
              <>
                <h1 className="text-2xl font-black text-black mb-2 leading-tight">Deine Vorsorgepapiere.</h1>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  {docSelected && importMethod === 'manual'
                    ? 'Dokumente gespeichert — Weiter schätzt via Gehalt. Oder wähle nur Dokumente.'
                    : docSelected
                      ? 'Sieht gut aus! Drücke auf Weiter — KI startet die Analyse.'
                      : 'Tippe auf die Kachel — unsere KI liest deine Rentendokumente automatisch aus.'}
                </p>

                {/* Kachel: leer → Tap → Docs fliegen rein */}
                <button
                  onClick={() => {
                    if (!docSelected) setDocSelected(true);
                    else if (importMethod === 'manual') setImportMethod(null); // tap wieder aktiviert Dokument-Pfad
                  }}
                  className={`w-full rounded-3xl transition-all mb-4 overflow-hidden ${
                    docSelected && importMethod !== 'manual'
                      ? 'border-2 border-black bg-black/[0.03] cursor-pointer p-5'
                      : docSelected && importMethod === 'manual'
                        ? 'border-2 border-dashed border-gray-400 bg-[#F9FAFB] cursor-pointer p-5 opacity-60'
                        : 'border-2 border-dashed border-gray-300 hover:border-black bg-[#FAFAFA] hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center py-12 px-6 gap-4'
                  }`}
                >
                  {!docSelected ? (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] flex items-center justify-center">
                        <FileText size={26} className="text-gray-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[15px] font-bold text-black mb-1">Rentendokumente einlesen</p>
                        <p className="text-[12px] text-gray-400">Einfach antippen — KI erledigt den Rest.</p>
                      </div>
                      <span className="text-[11px] bg-[#F4F4F5] px-3 py-1.5 rounded-full font-bold text-gray-500">
                        Jetzt starten
                      </span>
                    </>
                  ) : (
                    <div className="w-full">
                      {/* Kachel-Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className={importMethod === 'manual' ? 'text-gray-400' : 'text-emerald-500'} />
                          <p className={`text-[12px] font-bold ${importMethod === 'manual' ? 'text-gray-400' : 'text-black'}`}>
                            3 Dokumente bereit
                          </p>
                        </div>
                        {importMethod === 'manual' && (
                          <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                            Pausiert
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'DRV Renteninformation',       sub: 'Deutsche Rentenversicherung', dir: 'left'  },
                          { label: 'Allianz bAV Standmitteilung', sub: 'Betriebliche Altersvorsorge', dir: 'right' },
                          { label: 'Deka Riester-Bescheinigung',  sub: 'Riester-Rente',               dir: 'left'  },
                        ].map((doc, idx) => (
                          <div
                            key={idx}
                            className={`animate-in ${doc.dir === 'left' ? 'slide-in-from-left-8' : 'slide-in-from-right-8'} fade-in duration-700`}
                            style={{ animationDelay: `${idx * 320}ms`, animationFillMode: 'both' }}
                          >
                            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3">
                              <div className="w-9 h-9 bg-[#F9FAFB] rounded-xl flex items-center justify-center shrink-0">
                                <FileText size={16} className="text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[13px] text-black leading-tight truncate">{doc.label}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{doc.sub}</p>
                              </div>
                              <CheckCircle2 size={15} className={importMethod === 'manual' ? 'text-gray-300 shrink-0' : 'text-emerald-500 shrink-0'} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </button>

                {/* Info-Link */}
                {!docSelected && (
                  <button
                    onClick={() => setShowDocModal(true)}
                    className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-black transition-colors mx-auto mb-6 cursor-pointer"
                  >
                    <HelpCircle size={13} />
                    Welche Dokumente kann ich hochladen?
                  </button>
                )}

                {/* Separator + Keine Dokumente */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px bg-gray-200 flex-1" />
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Oder</span>
                  <div className="h-px bg-gray-200 flex-1" />
                </div>
                <OptionCard
                  emoji={<Calculator size={20} />}
                  title="Keine Dokumente zur Hand?"
                  subtitle="Über aktuelles Gehalt schätzen"
                  selected={importMethod === 'manual'}
                  onClick={() => setImportMethod(importMethod === 'manual' ? null : 'manual')}
                />
              </>
            )}

            {(dropState === 'processing' || dropState === 'done') && (
              <div className="flex-1 flex flex-col">
                <h1 className="text-2xl font-black text-black mb-2 leading-tight">Vorsorgepapiere werden analysiert.</h1>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  {dropState === 'processing' ? 'Analysiere 3 Dokumente...' : 'Alle Dokumente erkannt!'}
                </p>

                <div className="space-y-3">
                  {MOCK_DETECTED.map((asset, idx) => {
                    const detected = processingStep > idx;
                    const loading = processingStep === idx && dropState === 'processing';
                    const typeLabel =
                      asset.type === 'drv'     ? 'DRV Renteninformation' :
                      asset.type === 'bAV'     ? 'Allianz bAV' :
                                                 'Deka Riester-Rente';
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${
                          detected ? 'bg-emerald-50 border-emerald-200' :
                          loading  ? 'bg-[#F9FAFB] border-gray-300' :
                                     'bg-[#F9FAFB] border-gray-200 opacity-40'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${detected ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                          {detected
                            ? <CheckCircle2 size={17} className="text-emerald-600" />
                            : loading
                              ? <Loader2 size={17} className="text-gray-400 animate-spin" />
                              : <FileText size={17} className="text-gray-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-black leading-tight">{typeLabel}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{asset.provider}</p>
                        </div>
                        {detected && (
                          <div className="text-right animate-in fade-in duration-300 shrink-0">
                            <p className="text-[14px] font-extrabold text-emerald-600">{asset.monthlyPayout.toLocaleString('de-DE')} €</p>
                            <p className="text-[10px] text-emerald-400">/ Monat</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {dropState === 'done' && (
                  <div className="mt-5 p-4 bg-[#F9FAFB] border border-gray-200 rounded-2xl animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] text-gray-500 font-medium">Gesamt erkannte Rente</p>
                      <p className="text-[18px] font-black text-black">
                        {MOCK_DETECTED.reduce((s, a) => s + a.monthlyPayout, 0).toLocaleString('de-DE')} €/Mtl.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SCHRITT 3: Manuelle Gehaltseingabe */}
        {step === 3 && importMethod === 'manual' && showIncomePicker && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Wie hoch ist dein aktuelles Netto-Einkommen?</h1>
            <p className="text-sm text-gray-500 mb-3 leading-relaxed">Wir schätzen daraus deine gesetzliche Rente und berechnen dein Rentenziel.</p>
            <div className="flex items-center gap-2 mb-8 bg-[#F9FAFB] border border-gray-200 rounded-xl px-3 py-2">
              <TrendingUp size={14} className="text-gray-400 shrink-0" />
              <p className="text-[11px] text-gray-500">Rentenziel wird automatisch auf <strong className="text-black">80 %</strong> deines Nettogehalts gesetzt.</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <IncomeDrumPicker value={parseInt(customIncomeInput) || 2500} onChange={(v) => setCustomIncomeInput(String(v))} />
            </div>
          </div>
        )}

        {/* SCHRITT 4: Arbeitgeber */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Wo arbeitest du gerade?</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Damit wir die richtigen Rentenbausteine für dich aktivieren.</p>
            <div className="space-y-3">
              <OptionCard
                emoji={<Briefcase size={20} />}
                title="Angestellt (Privatwirtschaft)"
                subtitle="bAV & VL möglich"
                selected={selectedEmployment === 'employed'}
                onClick={() => setSelectedEmployment('employed')}
              />
              <OptionCard
                emoji={<Building2 size={20} />}
                title="Öffentlicher Dienst / Beamtenstatus"
                subtitle="VBL-Pflichtversicherung aktiv"
                selected={selectedEmployment === 'public'}
                onClick={() => setSelectedEmployment('public')}
              />
              <OptionCard
                emoji={<Calculator size={20} />}
                title="Selbstständig / Freiberuflich"
                subtitle="Freiwillige DRV oder Rürup-Rente"
                selected={selectedEmployment === 'selfEmployed'}
                onClick={() => setSelectedEmployment('selfEmployed')}
              />
            </div>
          </div>
        )}

        {/* SCHRITT 5: Versteckte Rentenpunkte */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-2xl font-black text-black leading-tight">Lass uns verstecktes Geld finden.</h1>
              <button
                onClick={() => setShowBonusInfo(true)}
                className="flex-none w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer mt-0.5"
              >
                <HelpCircle size={16} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Hast du nach deinem 17. Lebensjahr eine Schule besucht oder studiert?</p>
            <div className="space-y-3">
              <OptionCard emoji={<GraduationCap size={20} />} title="Ja, habe ich" subtitle="Wir prüfen auf fehlende Rentenpunkte" selected={selectedBonusOption === 'yes'} onClick={() => setSelectedBonusOption('yes')} />
              <OptionCard emoji={<Wrench size={20} />} title="Nein, direkte Ausbildung/Arbeit" selected={selectedBonusOption === 'no'} onClick={() => setSelectedBonusOption('no')} />
            </div>
          </div>
        )}

        {/* SCHRITT 6: Bonus-Bestätigung */}
        {step === 6 && (
          <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1 justify-center text-center">
            {foundBonus > 0 ? (
              <>
                <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h1 className="text-3xl font-black text-black mb-4">85 € Free Money gefunden!</h1>
                <p className="text-gray-500 leading-relaxed px-4 mb-8">
                  Weil du nach deinem 17. Geburtstag in Ausbildung warst, steht dir mehr Geld zu. Wir sichern dir diesen Bonus und legen den fertigen Antrag später einfach in deinen Optimierungsplan.
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-[#F4F4F5] border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-black" />
                </div>
                <h1 className="text-3xl font-black text-black mb-4">Alles erfasst!</h1>
                <p className="text-gray-500 leading-relaxed px-4 mb-8">Dein Rentenverlauf scheint lückenlos zu sein.</p>
              </>
            )}
          </div>
        )}

        {/* SCHRITT 7: Finaler Ladescreen */}
        {step === 7 && (
          <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-black/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-[-20px] bg-black/5 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
              <div className="relative w-24 h-24 bg-[#F4F4F5] border border-gray-200 rounded-full flex items-center justify-center">
                <Loader2 size={40} className="text-black animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-black text-center h-8 transition-opacity duration-300">{loadingText}</h2>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      {navConfig && (
        <div className="flex-none px-6 pb-8 pt-4 bg-white">
          <BottomNav {...navConfig} />
        </div>
      )}

      {/* Bonus-Info-Modal (Bottom Sheet) */}
      {showBonusInfo && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowBonusInfo(false)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-black text-black">Wie funktioniert das?</h3>
              <button onClick={() => setShowBonusInfo(false)} className="w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                <X size={16} className="text-black" />
              </button>
            </div>
            <div className="space-y-4 text-[14px] text-gray-600 leading-relaxed">
              <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4">
                <p className="font-bold text-black mb-1">Anrechnungszeiten bei der DRV</p>
                <p>Die Deutsche Rentenversicherung kennt sogenannte <strong className="text-black">Anrechnungszeiten</strong> — Lebensabschnitte, die trotz fehlender Beitragszahlung auf dein Rentenkonto angerechnet werden können.</p>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <GraduationCap size={18} className="text-black shrink-0 mt-0.5" />
                  <p><strong className="text-black">Schul- & Studienzeiten ab 17</strong> — Gymnasien, Berufsschulen, Hochschulen und Universitäten können als Anrechnungszeiten eingetragen werden.</p>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                  <p><strong className="text-black">Bis zu 8 Jahre</strong> anrechenbar — jedes Jahr zählt als ca. 0,45 Entgeltpunkte, was rund <strong className="text-black">18–22 € mehr Rente pro Monat</strong> bedeuten kann.</p>
                </div>
                <div className="flex gap-3">
                  <FileText size={18} className="text-black shrink-0 mt-0.5" />
                  <p><strong className="text-black">Formular V0100</strong> — der offizielle DRV-Antrag, den wir automatisch für dich ausfüllen und vorausfüllt zurückschicken.</p>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 pt-1">Quelle: Deutsche Rentenversicherung, §58 SGB VI (Anrechnungszeiten)</p>
            </div>
          </div>
        </div>
      )}

      {/* Dokument-Modal (Bottom Sheet) */}
      {showDocModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowDocModal(false)} />
          <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-black text-black">Unterstützte Dokumente</h3>
              <button onClick={() => setShowDocModal(false)} className="w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                <X size={16} className="text-black" />
              </button>
            </div>
            <div className="space-y-6">
              {DOC_CATEGORIES.map((cat) => {
                const Icon = cat.label === 'Gesetzlich' ? Building2 : cat.label === 'Betrieblich' ? FileText : Shield;
                return (
                  <div key={cat.label}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={13} className="text-gray-400" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cat.label}</p>
                    </div>
                    <div className="space-y-2">
                      {cat.docs.map((doc) => (
                        <div key={doc} className="flex items-center gap-3 py-1.5 px-3 bg-[#F9FAFB] rounded-xl">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                          <p className="text-[13px] text-black font-medium">{doc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
