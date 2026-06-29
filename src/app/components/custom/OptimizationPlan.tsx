import { useState, useEffect } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Briefcase, Landmark, ChevronRight, Send, Loader2, X, ArrowRight, Info, Download, FileCheck } from "lucide-react";
import { PrivateStrategyView } from "./PrivateStrategyView";
import { InfoTooltip } from "./InfoTooltip";

interface OptimizationPlanProps {
  onBack: () => void; projectedMonthly: number; targetPension: number; diff: number;
  monthlyContribution: number; setMonthlyContribution: (val: number) => void;
  expectedReturn: number; setExpectedReturn: (val: number) => void;
  retirementAge: number; setRetirementAge: (val: number) => void;
  vlActive: boolean; setVlActive: (val: boolean) => void;
  bavNettoVerzicht: number[]; setBavNettoVerzicht: (val: number[]) => void;
  /** PMT-derived initial bAV netto suggestion from App.tsx (overrides heuristic). */
  suggestedBavNettoAmount?: number;
  /** True when DRV Anrechnungszeiten were found during onboarding. */
  drvBonus?: boolean;
  /** True when a bAV contract was already detected during onboarding. Adjusts step-3 copy. */
  bavAlreadyExists?: boolean;
  currentAge: number;
  lifeExpectancy: number;
  inflation: number;
}

export function OptimizationPlan({
  onBack, diff, monthlyContribution, setMonthlyContribution, expectedReturn, setExpectedReturn,
  retirementAge, setRetirementAge, vlActive, setVlActive, bavNettoVerzicht, setBavNettoVerzicht,
  suggestedBavNettoAmount, drvBonus = false, bavAlreadyExists = false,
  currentAge, lifeExpectancy, inflation,
}: OptimizationPlanProps) {
  const [step, setStep] = useState(1);
  const [vlCardState, setVlCardState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [bavCardState, setBavCardState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [hrEmail, setHrEmail] = useState('');

  // Pre-fill based on existing state so the user sees their current setup (M3)
  const [selectedVL, setSelectedVL] = useState<'yes' | 'no' | null>(vlActive ? 'yes' : null);
  const [selectedBAV, setSelectedBAV] = useState<'yes' | 'no' | null>(bavNettoVerzicht[0] > 0 ? 'yes' : null);

  const [formDownloaded, setFormDownloaded] = useState(false);

  const isPositive = diff >= 0;
  const currentGap = diff < 0 ? Math.abs(diff) : 0;

  // Snapshot of the gap when step 4 is first entered (after VL + bAV effects from steps 2-3).
  // Survives remounts when the user goes forward and comes back.
  // Used as the stable base for PMT calculations inside PrivateStrategyView so that
  // applying an option (which changes currentGap) doesn't recalculate the card values.
  const [step4EntryGap, setStep4EntryGap] = useState<number | null>(null);
  useEffect(() => {
    if (step === 4 && step4EntryGap === null) {
      setStep4EntryGap(currentGap);
    }
  }, [step, step4EntryGap, currentGap]);

  // Snapshot of perfectBavNetto at the moment the user first selects bAV.
  // Prevents the feedback loop: applying bAV shrinks the gap → perfectBavNetto recalculates
  // smaller → a second click would apply a different (wrong) amount.
  const [lockedBavNetto, setLockedBavNetto] = useState<number | null>(null);

  const [initialGap] = useState(currentGap);
  const [originalContribution] = useState(monthlyContribution);
  const [originalRetirementAge] = useState(retirementAge);
  // Snapshots of initial VL and bAV — prevents destructive resets on skip (H2)
  const [initialVlActive] = useState(vlActive);
  const [initialBavNetto] = useState(bavNettoVerzicht[0]);
  const [step4BaseBavNetto, setStep4BaseBavNetto] = useState(bavNettoVerzicht[0]);

  // Derived from currentGap so it reflects VL activation from step 2 (H4)
  const perfectBavNetto =
    suggestedBavNettoAmount ??
    (currentGap === 0 ? 0 : Math.min(250, Math.max(10, Math.ceil((currentGap * 0.4 / 1.9) / 10) * 10)));

  // Display and apply the locked snapshot; fall back to live value before first selection.
  const displayBavNetto = lockedBavNetto ?? perfectBavNetto;

  // M2: Math.round instead of Math.ceil to avoid systematic ~50% gap overstatement
  const formatGapRelativity = (gap: number): string => {
    if (gap < 150) {
      const count = Math.max(1, Math.round(gap / 4 / 30));
      return `${count} Kaffee${count > 1 ? 's' : ''} to-go pro Tag`;
    } else if (gap <= 500) {
      const count = Math.max(1, Math.round(gap / 60));
      return `${count} Restaurantbesuche pro Monat`;
    } else {
      const count = Math.max(1, Math.round(gap / 400));
      return `${count} Wochenend-Trip${count !== 1 ? 's' : ''} pro Jahr`;
    }
  };

  const totalSteps = drvBonus ? 6 : 5;
  const effectiveStep = drvBonus ? step : (step >= 6 ? step - 1 : step);
  const progress = Math.min(100, (effectiveStep / totalSteps) * 100);

  useEffect(() => {
    if (step === 1 && isPositive) onBack();
  }, [step, isPositive, onBack]);

  const vlAvailable = selectedVL !== 'no';
  const bavAvailable = selectedBAV !== 'no';

  const handleNext = () => {
    if (step === 2) {
      // 'yes' was applied live in onClick; apply 'no' only on forward navigation (H2)
      if (selectedVL === 'no') setVlActive(false);
    } else if (step === 3) {
      // lockedBavNetto holds the value snapshotted at click-time; use it so the
      // amount committed here matches what the user already saw applied to the gap header.
      const newBav = selectedBAV === 'yes' ? (lockedBavNetto ?? perfectBavNetto) : initialBavNetto;
      setBavNettoVerzicht([newBav]);
      setStep4BaseBavNetto(newBav);
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else if (step === 6 && !drvBonus) setStep(4);
    else setStep(prev => prev - 1);
  };

  const handleStep4Reset = () => {
    setMonthlyContribution(originalContribution);
    setRetirementAge(originalRetirementAge);
    setBavNettoVerzicht([step4BaseBavNetto]);
  };

  // H3: mock send — UI labels are honest about the simulated nature
  const handleSendCard = (type: 'vl' | 'bav') => {
    if (type === 'vl') {
      setVlCardState('sending');
      setTimeout(() => setVlCardState('sent'), 1800);
    } else {
      setBavCardState('sending');
      setTimeout(() => setBavCardState('sent'), 1800);
    }
  };

  const OptionCard = ({ emoji, title, subtitle, onClick, active = false, disabled = false, highlight = false }: any) => (
    <button
      onClick={onClick} disabled={disabled}
      className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all text-left group border ${
        active
          ? 'bg-black/[0.04] border-black'
          : highlight
            ? 'bg-black hover:bg-gray-900 border-black'
            : 'bg-[#F9FAFB] border-gray-200 hover:border-gray-400 hover:bg-gray-100'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-8 h-8">{emoji}</div>
        <div>
          <h3 className={`font-bold text-[15px] ${highlight && !active ? 'text-white' : 'text-black'}`}>{title}</h3>
          {subtitle && <p className={`text-[12px] mt-0.5 ${highlight && !active ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
      </div>
      {active
        ? <CheckCircle2 size={20} className="text-black" />
        : <ChevronRight size={18} className={highlight && !active ? 'text-white' : 'text-gray-300 group-hover:text-gray-600'} />
      }
    </button>
  );

  const BottomNav = ({ onNext, nextDisabled = false, nextLabel = "Weiter", onBack, nextIcon }: any) => (
    <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100">
      {onBack && (
        <button onClick={onBack} className="flex-none w-14 h-14 bg-[#F4F4F5] border border-gray-200 hover:bg-gray-200 text-black rounded-xl transition-colors cursor-pointer flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
      )}
      <button onClick={onNext} disabled={nextDisabled} className="flex-1 h-14 bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-[15px] rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2">
        {nextLabel} {nextIcon}
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col text-black max-w-[430px] mx-auto font-sans relative">

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-500 hover:text-black transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors duration-500 ${isPositive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-500'}`}>
            {isPositive
              ? <CheckCircle2 size={14} />
              : <AlertTriangle size={14} />
            }
            <span className="text-xs font-bold tracking-wide">
              {isPositive ? "Ziel erreicht" : `Lücke: ${currentGap.toLocaleString("de-DE")} €`}
            </span>
          </div>
        </div>
        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-black transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8 flex flex-col">

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Dein Aktionsplan.</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Dir fehlen aktuell noch <strong className="text-red-500">{currentGap.toLocaleString('de-DE')} €</strong> pro Monat, um deinen Lebensstandard im Alter zu halten.
            </p>
            <div className="bg-[#F9FAFB] border border-gray-200 p-5 rounded-2xl mb-8">
              <p className="text-[13px] text-gray-700 leading-relaxed font-medium flex items-start gap-2">
                <Info size={15} className="text-black shrink-0 mt-0.5" />
                {/* L2: DRV step doesn't close the gap — only 3 savings steps do */}
                <span>Keine Panik. Das entspricht dem Verzicht auf ca. <strong className="text-black">{formatGapRelativity(initialGap)}</strong>. Wir schließen diese Lücke in 3 Schritten.{drvBonus ? ' Als Bonus sichern wir außerdem deine Rentenansprüche bei der DRV.' : ''}</span>
              </p>
            </div>
            <p className="text-[13px] text-gray-500 italic mb-8 leading-relaxed px-1">
              {currentAge <= 30
                ? `Mit ${currentAge} hast du die stärkste Waffe: Zeit.`
                : currentAge <= 45
                  ? `Mit ${currentAge} ist noch genug Spielraum — jeder Schritt zählt doppelt.`
                  : `Mit ${retirementAge - currentAge} Jahren bis zur Rente zählt jede Entscheidung.`}
            </p>
            <BottomNav onNext={handleNext} nextLabel="Los geht's" nextIcon={<ArrowRight size={18} />} />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 1</div>
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Geld vom Chef.</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Arbeitgeber verschenken oft bis zu 40 € pro Monat an{' '}
              <span className="inline-flex items-baseline">
                VL-Sparen
                <InfoTooltip text="Vermögenswirksame Leistungen. Echtes geschenktes Geld von deinem Arbeitgeber, das direkt in deinen ETF-Sparplan fließen kann (bis zu 40 € monatlich)." />
              </span>
              {' '}(Vermögenswirksame Leistungen).
            </p>
            <div className="space-y-3">
              {/* M3: show "Bereits aktiv" when VL was pre-configured */}
              <OptionCard
                emoji={<Landmark size={20} className="text-black" />}
                title="VL-Sparen aktivieren"
                subtitle={initialVlActive ? "Bereits aktiv — wird fortgeführt" : "Kostenloser Arbeitgeberbeitrag"}
                active={selectedVL === 'yes'}
                onClick={() => { setSelectedVL('yes'); setVlActive(true); }}
              />
              <OptionCard
                emoji={<X size={20} className="text-gray-400" />}
                title="Überspringen"
                subtitle="Mein AG bietet das nicht an"
                active={selectedVL === 'no'}
                onClick={() => { setSelectedVL('no'); setVlActive(false); }}
              />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedVL} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 2</div>
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">
              {bavAlreadyExists ? 'Beitrag erhöhen.' : 'Die Brutto-Netto-Magie.'}
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {bavAlreadyExists ? (
                <>
                  Du hast bereits eine{' '}
                  <span className="inline-flex items-baseline">
                    betriebliche Altersvorsorge (bAV)
                    <InfoTooltip text="Ein Teil deines Bruttogehalts geht direkt in die Altersvorsorge, noch bevor Steuern abgezogen werden. So sparst du effektiv mehr, als dir netto fehlt." />
                  </span>
                  {' '}— durch eine Beitragserhöhung kannst du die verbleibende Lücke besonders steuereffizient schließen.
                </>
              ) : (
                <>
                  Durch die{' '}
                  <span className="inline-flex items-baseline">
                    betriebliche Altersvorsorge (bAV)
                    <InfoTooltip text="Ein Teil deines Bruttogehalts geht direkt in die Altersvorsorge, noch bevor Steuern abgezogen werden. So sparst du effektiv mehr, als dir netto fehlt." />
                  </span>
                  {' '}sparst du Steuern. Um deine verbleibende Lücke zu schließen, reicht ein kleiner Netto-Verzicht.
                </>
              )}
            </p>
            <div className="space-y-3">
              <OptionCard
                emoji={<Briefcase size={20} className="text-black" />}
                title={bavAlreadyExists ? `Beitrag erhöhen (${displayBavNetto} € Netto)` : `bAV nutzen (${displayBavNetto} € Netto)`}
                subtitle={`Fließt als ${Math.round(displayBavNetto * 1.9)} € in deinen Vertrag`}
                active={selectedBAV === 'yes'}
                onClick={() => {
                  // Only snap + apply on the first selection to prevent the feedback loop
                  // where applying bAV shrinks the gap → perfectBavNetto recalculates smaller.
                  if (selectedBAV !== 'yes') {
                    const snap = perfectBavNetto;
                    setLockedBavNetto(snap);
                    setBavNettoVerzicht([snap]);
                  }
                  setSelectedBAV('yes');
                }}
              />
              <OptionCard
                emoji={<X size={20} className="text-gray-400" />}
                title="Überspringen"
                subtitle="Ich regle das lieber privat"
                active={selectedBAV === 'no'}
                onClick={() => { setSelectedBAV('no'); setLockedBavNetto(null); setBavNettoVerzicht([initialBavNetto]); }}
              />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedBAV} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 4 && (
          <PrivateStrategyView
            originalGap={step4EntryGap ?? currentGap}
            expectedReturn={expectedReturn}
            inflation={inflation}
            currentAge={currentAge}
            originalRetirementAge={originalRetirementAge}
            lifeExpectancy={lifeExpectancy}
            originalContribution={originalContribution}
            originalBavNetto={step4BaseBavNetto}
            bavAvailable={bavAvailable}
            setMonthlyContribution={setMonthlyContribution}
            setRetirementAge={setRetirementAge}
            setBavNettoVerzicht={setBavNettoVerzicht}
            onNext={() => {
              if (drvBonus) setStep(5);
              else if (vlActive || bavNettoVerzicht[0] > 0) setStep(6);
              else setStep(7);
            }}
            onBack={handleBack}
            onReset={handleStep4Reset}
          />
        )}

        {step === 5 && drvBonus && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            {/* N3: "Bonus" matches the framing in the step-1 intro text */}
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Bonus-Schritt</div>
            {/* H1: removed monetary framing — Anrechnungszeiten give no direct monthly pension bonus */}
            <h1 className="text-2xl font-black text-black mb-2 leading-tight">Rentenanspruch vervollständigen.</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Deine Schul- oder Studienzeiten sind möglicherweise noch nicht bei der DRV eingetragen. Mit den Formularen V0100 &amp; V0108 kannst du eine Kontenklärung beantragen — wir haben sie bereits für dich vorbereitet.
            </p>

            {!formDownloaded ? (
              <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                    <FileCheck size={22} className="text-black" />
                  </div>
                  <div>
                    <p className="font-black text-[15px] text-black leading-tight">Antrag auf Anrechnungszeiten</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">DRV · Formulare V0100 &amp; V0108</p>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Antragsvorlage mit deinen Daten erstellt</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Kostenlos bei der DRV einreichen</span>
                  </div>
                  {/* H1: Anrechnungszeiten don't increase monthly pension — they help with Wartezeit */}
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Sichert deine Wartezeit – kann früheren Rentenbeginn ermöglichen</span>
                  </div>
                </div>
                {/* H3: mock download — button label is honest */}
                <button
                  onClick={() => setFormDownloaded(true)}
                  className="w-full h-12 bg-black hover:bg-gray-900 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download size={16} /> Schritt als erledigt markieren
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-[15px] text-emerald-700 leading-tight">Als erledigt markiert!</p>
                  {/* L1: correct DRV URL */}
                  <p className="text-[12px] text-emerald-600 mt-0.5">Einreichen bei: deutsche-rentenversicherung.de</p>
                </div>
              </div>
            )}

            <BottomNav
              onBack={handleBack}
              onNext={() => { vlActive || bavNettoVerzicht[0] > 0 ? setStep(6) : setStep(7); }}
              nextLabel={formDownloaded ? "Weiter" : "Überspringen"}
              nextIcon={<ChevronRight size={18} />}
            />
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-2 leading-tight">Wir übernehmen die Bürokratie.</h1>
            {/* M5: singular/plural based on how many applications */}
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Wir haben {vlActive && bavNettoVerzicht[0] > 0 ? 'die Anträge' : 'den Antrag'} bereits für dich vorbereitet. Du entscheidest, ob wir {vlActive && bavNettoVerzicht[0] > 0 ? 'sie' : 'ihn'} direkt an deine Personalabteilung senden sollen.
            </p>

            <div className="mb-5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                HR-E-Mail deines Arbeitgebers
              </label>
              <input
                type="email"
                value={hrEmail}
                onChange={e => setHrEmail(e.target.value)}
                placeholder="z.B. personal@meinunternehmen.de"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-[#F9FAFB] text-base text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-4 mb-6">

              {vlActive && (
                vlCardState === 'sent' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={22} className="text-emerald-600" />
                    </div>
                    <div>
                      {/* H3: honest mock label */}
                      <p className="font-black text-[15px] text-emerald-700 leading-tight">Als gesendet markiert</p>
                      <p className="text-[12px] text-emerald-600 mt-0.5">An: {hrEmail || 'deine Personalabteilung'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                        <FileCheck size={22} className="text-black" />
                      </div>
                      <div>
                        <p className="font-black text-[15px] text-black leading-tight">Antrag auf VL-Sparen</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{hrEmail || 'Deine Personalabteilung'} · Kostenlos</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Antragsvorlage mit deinen Daten erstellt</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>AG zahlt bis zu 40 € monatlich dazu</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Bearbeitungszeit: 2–4 Wochen</span>
                      </div>
                    </div>
                    {/* H3: honest mock label */}
                    <button
                      onClick={() => handleSendCard('vl')}
                      disabled={vlCardState === 'sending'}
                      className="w-full h-12 bg-black hover:bg-gray-900 disabled:opacity-50 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {vlCardState === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" /> Wird markiert…</>
                        : <><Send size={16} /> Als gesendet markieren</>}
                    </button>
                  </div>
                )
              )}

              {bavNettoVerzicht[0] > 0 && (
                bavCardState === 'sent' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={22} className="text-emerald-600" />
                    </div>
                    <div>
                      {/* H3: honest mock label */}
                      <p className="font-black text-[15px] text-emerald-700 leading-tight">Als gesendet markiert</p>
                      <p className="text-[12px] text-emerald-600 mt-0.5">An: {hrEmail || 'deine Personalabteilung'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                        <FileCheck size={22} className="text-black" />
                      </div>
                      <div>
                        <p className="font-black text-[15px] text-black leading-tight">Antrag auf Entgeltumwandlung</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">{hrEmail || 'Deine Personalabteilung'} · {bavNettoVerzicht[0]} € netto</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Antragsvorlage mit deinen Daten erstellt</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Steuervorteile ab dem nächsten Gehalt</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Bearbeitungszeit: 2–4 Wochen</span>
                      </div>
                    </div>
                    {/* H3: honest mock label */}
                    <button
                      onClick={() => handleSendCard('bav')}
                      disabled={bavCardState === 'sending'}
                      className="w-full h-12 bg-black hover:bg-gray-900 disabled:opacity-50 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {bavCardState === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" /> Wird markiert…</>
                        : <><Send size={16} /> Als gesendet markieren</>}
                    </button>
                  </div>
                )
              )}

            </div>

            <BottomNav
              onBack={handleBack}
              onNext={() => setStep(7)}
              nextLabel="Abschließen"
              nextIcon={<ChevronRight size={18} />}
            />
          </div>
        )}

        {step === 7 && (
          <div className="flex-1 flex flex-col animate-in zoom-in-95 duration-500 pt-4">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-2">Aktionsplan gesetzt.</h1>
              <p className="text-sm text-gray-500 text-center px-2 leading-relaxed">
                {(() => {
                  const sent = [
                    vlCardState === 'sent' && "VL-Sparen",
                    bavCardState === 'sent' && `Entgeltumwandlung (${bavNettoVerzicht[0]} €)`,
                  ].filter(Boolean).join(" & ");
                  return sent
                    ? `${sent} als gesendet markiert. Reiche die Anträge manuell bei deiner Personalabteilung ein.`
                    : "Dein Plan ist gespeichert. Anträge kannst du jederzeit manuell einreichen.";
                })()}
              </p>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Was passiert als nächstes</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 shrink-0 mt-0.5">Jetzt</span>
                  <span className="text-[13px] text-gray-700 leading-snug">Dashboard zeigt deinen aktualisierten Rentenplan</span>
                </div>
                {vlCardState === 'sent' && (
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0 mt-0.5">2–4 Wo.</span>
                    <span className="text-[13px] text-gray-700 leading-snug">HR richtet VL-Sparen ein — bis zu 40 € / Monat vom Arbeitgeber</span>
                  </div>
                )}
                {bavCardState === 'sent' && (
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 shrink-0 mt-0.5">2–4 Wo.</span>
                    <span className="text-[13px] text-gray-700 leading-snug">Entgeltumwandlung startet mit dem nächsten Gehaltseingang</span>
                  </div>
                )}
                {((vlActive && vlCardState !== 'sent') || (bavNettoVerzicht[0] > 0 && bavCardState !== 'sent')) && (
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 shrink-0 mt-0.5">Offen</span>
                    <span className="text-[13px] text-gray-700 leading-snug">
                      {[
                        vlActive && vlCardState !== 'sent' && 'VL-Sparen',
                        bavNettoVerzicht[0] > 0 && bavCardState !== 'sent' && `Entgeltumwandlung (${bavNettoVerzicht[0]} €)`,
                      ].filter(Boolean).join(' & ')} — Antrag manuell an deine Personalabteilung senden
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* L3/N1: back mirrors the forward navigation from step 4 to avoid empty pages */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (vlActive || bavNettoVerzicht[0] > 0) setStep(6);
                  else if (drvBonus) setStep(5);
                  else setStep(4);
                }}
                className="flex-none w-14 h-14 bg-[#F4F4F5] border border-gray-200 hover:bg-gray-200 text-black rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                <ArrowLeft size={20} />
              </button>
              <button onClick={onBack} className="flex-1 bg-black hover:bg-gray-900 text-white font-bold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2">
                Zum Dashboard <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
