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
  /** PMT-derived initial savings suggestion from App.tsx (overrides heuristic). */
  suggestedSavingsAmount?: number;
  /** PMT-derived initial bAV netto suggestion from App.tsx (overrides heuristic). */
  suggestedBavNettoAmount?: number;
  /** DRV Anrechnungszeiten bonus found during onboarding (0 = none found). */
  drvBonus?: number;
  currentAge: number;
  lifeExpectancy: number;
  inflation: number;
}

export function OptimizationPlan({
  onBack, diff, monthlyContribution, setMonthlyContribution, expectedReturn, setExpectedReturn,
  retirementAge, setRetirementAge, vlActive, setVlActive, bavNettoVerzicht, setBavNettoVerzicht,
  suggestedBavNettoAmount, drvBonus = 0,
  currentAge, lifeExpectancy, inflation,
}: OptimizationPlanProps) {
  const [step, setStep] = useState(1);
  const [vlCardState, setVlCardState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [bavCardState, setBavCardState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [selectedVL, setSelectedVL] = useState<'yes' | 'no' | null>(vlActive ? 'yes' : null);
  const [selectedBAV, setSelectedBAV] = useState<'yes' | 'no' | null>(bavNettoVerzicht[0] > 0 ? 'yes' : null);

  // Step-5 DRV form download state
  const [formDownloaded, setFormDownloaded] = useState(false);

  const isPositive = diff >= 0;
  const currentGap = diff < 0 ? Math.abs(diff) : 0;

  const [initialGap] = useState(currentGap);
  const [originalContribution] = useState(monthlyContribution);
  const [originalRetirementAge] = useState(retirementAge);
  // Snapshot of bAV at the moment step 4 is entered — updated in handleNext when leaving step 3.
  // This ensures resetLevers() in PrivateStrategyView restores bAV to what step 3 set, not the mount value.
  const [step4BaseBavNetto, setStep4BaseBavNetto] = useState(bavNettoVerzicht[0]);

  const [perfectBavNetto] = useState(() =>
    suggestedBavNettoAmount ??
    (initialGap === 0 ? 0 : Math.min(250, Math.max(10, Math.ceil((initialGap * 0.4 / 2.1) / 10) * 10)))
  );

  const formatGapRelativity = (gap: number): string => {
    if (gap < 150) {
      const count = Math.max(1, Math.ceil(gap / 4 / 30));
      return `${count} Kaffee${count > 1 ? 's' : ''} to-go pro Tag`;
    } else if (gap <= 500) {
      const count = Math.max(1, Math.ceil(gap / 60));
      return `${count} Restaurantbesuche pro Monat`;
    } else {
      const count = Math.max(1, Math.ceil(gap / 400));
      return `${count} Wochenend-Trip${count !== 1 ? 's' : ''} pro Jahr`;
    }
  };

  const totalSteps = drvBonus > 0 ? 6 : 5;
  // When drvBonus === 0 step 5 doesn't exist, so shift step 6+ down by 1 for display
  const effectiveStep = drvBonus > 0 ? step : (step >= 6 ? step - 1 : step);
  const progress = Math.min(100, (effectiveStep / totalSteps) * 100);

  useEffect(() => {
    if (step === 1 && isPositive) onBack();
  }, [step, isPositive, onBack]);

  // Derived availability flags: 'no' = user explicitly skipped, not available at their employer
  const vlAvailable = selectedVL !== 'no';
  const bavAvailable = selectedBAV !== 'no';

  const handleNext = () => {
    if (step === 3) setStep4BaseBavNetto(bavNettoVerzicht[0]);
    setStep(prev => prev + 1);
  };
  const handleBack = () => {
    if (step === 1) onBack();
    else if (step === 6 && drvBonus === 0) setStep(4);
    else setStep(prev => prev - 1);
  };

  const handleStep4Reset = () => {
    setMonthlyContribution(originalContribution);
    setRetirementAge(originalRetirementAge);
    setBavNettoVerzicht([step4BaseBavNetto]);
  };

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
              Dir fehlen aktuell noch <strong className="text-red-500">{currentGap} €</strong> pro Monat, um deinen Lebensstandard im Alter zu halten.
            </p>
            <div className="bg-[#F9FAFB] border border-gray-200 p-5 rounded-2xl mb-8">
              <p className="text-[13px] text-gray-700 leading-relaxed font-medium flex items-start gap-2">
                <Info size={15} className="text-black shrink-0 mt-0.5" />
                <span>Keine Panik. Das entspricht dem Verzicht auf ca. <strong className="text-black">{formatGapRelativity(initialGap)}</strong>. Wir schließen diese Lücke in 3 simplen Schritten.</span>
              </p>
            </div>
            <BottomNav onNext={handleNext} nextLabel="Los geht's" nextIcon={<ArrowRight size={18} />} />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 1 von 3</div>
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
              <OptionCard emoji={<Landmark size={20} className="text-black" />} title="VL-Sparen aktivieren" subtitle="Nimmt 40 € Lücke ab" active={selectedVL === 'yes'} onClick={() => { setSelectedVL('yes'); setVlActive(true); }} />
              <OptionCard emoji={<X size={20} className="text-gray-400" />} title="Überspringen" subtitle="Mein AG bietet das nicht an" active={selectedVL === 'no'} onClick={() => { setSelectedVL('no'); setVlActive(false); }} />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedVL} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 2 von 3</div>
            <h1 className="text-2xl font-black text-black mb-3 leading-tight">Die Brutto-Netto-Magie.</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Durch die{' '}
              <span className="inline-flex items-baseline">
                betriebliche Altersvorsorge (bAV)
                <InfoTooltip text="Ein Teil deines Bruttogehalts geht direkt in die Altersvorsorge, noch bevor Steuern abgezogen werden. So sparst du effektiv mehr, als dir netto fehlt." />
              </span>
              {' '}sparst du Steuern. Um deine verbleibende Lücke zu schließen, reicht ein kleiner Netto-Verzicht.
            </p>
            <div className="space-y-3">
              <OptionCard emoji={<Briefcase size={20} className={selectedBAV === 'yes' ? 'text-black' : 'text-white'} />} title={`bAV nutzen (${perfectBavNetto} € Netto)`} subtitle={`Fließt als ${Math.round(perfectBavNetto * 2.1)} € in deinen Vertrag`} active={selectedBAV === 'yes'} highlight={selectedBAV !== 'yes'} onClick={() => { setSelectedBAV('yes'); setBavNettoVerzicht([perfectBavNetto]); }} />
              <OptionCard emoji={<X size={20} className="text-gray-400" />} title="Überspringen" subtitle="Ich regle das lieber privat" active={selectedBAV === 'no'} onClick={() => { setSelectedBAV('no'); setBavNettoVerzicht([0]); }} />
            </div>
            <BottomNav onBack={handleBack} onNext={handleNext} nextDisabled={!selectedBAV} nextLabel="Weiter" nextIcon={<ChevronRight size={18} />} />
          </div>
        )}

        {step === 4 && (
          <PrivateStrategyView
            currentGap={currentGap}
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
              if (drvBonus > 0) setStep(5);
              else if (vlActive || bavNettoVerzicht[0] > 0) setStep(6);
              else setStep(7);
            }}
            onBack={handleBack}
            onReset={handleStep4Reset}
          />
        )}

        {step === 5 && drvBonus > 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
            <h1 className="text-2xl font-black text-black mb-2 leading-tight">Deine {drvBonus} € sichern.</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Die DRV hat deine Schul- oder Studienzeiten wahrscheinlich nicht erfasst. Mit dem Formular V0100 kannst du diese Anrechnungszeiten nachträglich geltend machen — wir haben es bereits für dich ausgefüllt.
            </p>

            {!formDownloaded ? (
              <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                    <FileCheck size={22} className="text-black" />
                  </div>
                  <div>
                    <p className="font-black text-[15px] text-black leading-tight">Antrag auf Anrechnungszeiten</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">DRV · Formular V0100</p>
                  </div>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Bereits mit deinen Daten vorausgefüllt</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Kostenlos bei der DRV einreichen</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-gray-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>Effekt: ca. +{drvBonus} €/Mtl. gesetzliche Rente</span>
                  </div>
                </div>
                <button
                  onClick={() => setFormDownloaded(true)}
                  className="w-full h-12 bg-black hover:bg-gray-900 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download size={16} /> Formular herunterladen
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-[15px] text-emerald-700 leading-tight">Formular heruntergeladen!</p>
                  <p className="text-[12px] text-emerald-600 mt-0.5">Einreichen bei: drv.de/formular-v0100</p>
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
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Wir haben die Anträge bereits für dich vorbereitet. Du entscheidest, ob wir sie direkt an deine Personalabteilung senden sollen.
            </p>

            <div className="space-y-4 mb-6">

              {vlActive && (
                vlCardState === 'sent' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={22} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-black text-[15px] text-emerald-700 leading-tight">Antrag gesendet!</p>
                      <p className="text-[12px] text-emerald-600 mt-0.5">An: hr@meinefirma.de</p>
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
                        <p className="text-[12px] text-gray-500 mt-0.5">hr@meinefirma.de · Kostenlos</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Bereits mit deinen Daten vorausgefüllt</span>
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
                    <button
                      onClick={() => handleSendCard('vl')}
                      disabled={vlCardState === 'sending'}
                      className="w-full h-12 bg-black hover:bg-gray-900 disabled:opacity-50 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {vlCardState === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" /> Wird gesendet…</>
                        : <><Send size={16} /> Antrag senden</>}
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
                      <p className="font-black text-[15px] text-emerald-700 leading-tight">Antrag gesendet!</p>
                      <p className="text-[12px] text-emerald-600 mt-0.5">An: hr@meinefirma.de</p>
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
                        <p className="text-[12px] text-gray-500 mt-0.5">hr@meinefirma.de · {bavNettoVerzicht[0]} € netto</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-[13px] text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>Bereits mit deinen Daten vorausgefüllt</span>
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
                    <button
                      onClick={() => handleSendCard('bav')}
                      disabled={bavCardState === 'sending'}
                      className="w-full h-12 bg-black hover:bg-gray-900 disabled:opacity-50 text-white font-bold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {bavCardState === 'sending'
                        ? <><Loader2 size={16} className="animate-spin" /> Wird gesendet…</>
                        : <><Send size={16} /> Antrag senden</>}
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
          <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h1 className="text-3xl font-black text-black mb-2">Erfolgreich!</h1>
            <p className="text-sm text-gray-500 text-center px-4 mb-10">
              {(() => {
                const sent = [
                  vlCardState === 'sent' && "VL-Sparen",
                  bavCardState === 'sent' && `Entgeltumwandlung (${bavNettoVerzicht[0]} €)`,
                ].filter(Boolean).join(" & ");
                return sent
                  ? `Dein Plan ist aktiv. Die Anträge für ${sent} wurden an deine Personalabteilung gesendet.`
                  : "Dein Plan wurde gespeichert. Du kannst die Anträge jederzeit manuell einreichen.";
              })()}
            </p>
            <button onClick={onBack} className="w-full bg-black hover:bg-gray-900 text-white font-bold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2">
              Zurück zum Dashboard <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
