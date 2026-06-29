import { useState, type ReactNode } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, TrendingUp, Building2, Shuffle, Clock } from "lucide-react";
import { requiredMonthlyPMT } from "../../utils/financeMath";

type PackageId = 'A' | 'B' | 'C' | 'D';

const SAFE_RATE = 0.035;
const BAV_LEVERAGE = 1.9;
const MAX_AGE = 72;
const DELAY_C = 2;

export interface PrivateStrategyViewProps {
  /** Stable gap snapshot from when step 4 was first entered — used for PMT calculations
   *  so card values don't change when the user switches between options. */
  originalGap: number;
  expectedReturn: number;
  inflation: number;
  currentAge: number;
  originalRetirementAge: number;
  lifeExpectancy: number;
  originalContribution: number;
  originalBavNetto: number;
  /** false when user explicitly skipped bAV in step 3 — hides Option B */
  bavAvailable?: boolean;
  setMonthlyContribution: (val: number) => void;
  setRetirementAge: (val: number) => void;
  setBavNettoVerzicht: (val: number[]) => void;
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

function PackageCard({ selected, icon, badge, title, subtitle, onClick }: {
  selected: boolean;
  icon: ReactNode;
  badge: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-emerald-400 bg-emerald-50'
          : 'border-gray-200 bg-[#F9FAFB] hover:border-gray-300 hover:bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
          selected ? 'bg-emerald-100' : 'bg-white border border-gray-200'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
            selected ? 'text-emerald-600' : 'text-gray-400'
          }`}>{badge}</p>
          <p className={`text-[14px] font-black leading-tight ${
            selected ? 'text-emerald-800' : 'text-black'
          }`}>{title}</p>
          <p className={`text-[12px] mt-0.5 ${
            selected ? 'text-emerald-600' : 'text-gray-500'
          }`}>{subtitle}</p>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
          selected ? 'bg-emerald-500' : 'bg-gray-200'
        }`}>
          {selected && <CheckCircle2 size={14} className="text-white" />}
        </div>
      </div>
    </button>
  );
}

export function PrivateStrategyView({
  originalGap,
  expectedReturn, inflation,
  currentAge, originalRetirementAge, lifeExpectancy,
  originalContribution, originalBavNetto, bavAvailable = true,
  setMonthlyContribution, setRetirementAge, setBavNettoVerzicht,
  onNext, onBack, onReset,
}: PrivateStrategyViewProps) {
  const [selected, setSelected] = useState<PackageId | null>(null);

  const returnRate = expectedReturn / 100;
  const inflationRate = inflation / 100;
  const yearsToRetire = Math.max(1, originalRetirementAge - currentAge);
  const yearsInRetirement = Math.max(1, lifeExpectancy - originalRetirementAge);

  // A: Private ETF — savings only
  const rawA = requiredMonthlyPMT(originalGap, returnRate, inflationRate, yearsToRetire, yearsInRetirement, SAFE_RATE);
  const extraA = Math.max(25, Math.ceil(rawA / 25) * 25);

  // B: bAV — same effect, lower net cost via tax leverage
  // N4: Math.round for consistency with leverBavNetto calculation in usePensionMath
  const bavNetto = Math.max(10, Math.round(rawA / BAV_LEVERAGE / 10) * 10);

  // C: Kompromiss — 2 years delay + reduced savings
  // Use Math.round (not ceil) so rawC and rawA in the same €25 band still show C as distinct option
  const canC = originalRetirementAge + DELAY_C <= MAX_AGE && yearsInRetirement - DELAY_C >= 1;
  const rawC = canC
    ? requiredMonthlyPMT(originalGap, returnRate, inflationRate, yearsToRetire + DELAY_C, yearsInRetirement - DELAY_C, SAFE_RATE)
    : Infinity;
  const extraC = canC ? Math.max(0, Math.round(rawC / 25) * 25) : Infinity;
  const showC = canC && rawC < rawA; // compare raw PMT values — rounding can hide a real improvement

  // D: Find minimum delay to eliminate extra savings (PMT < €25).
  // Fallback: use maximum feasible delay and show reduced savings if still beneficial.
  const maxDelayD = MAX_AGE - originalRetirementAge;
  let delayD = 0;
  let rawD = Infinity;
  for (let d = 1; d <= maxDelayD; d++) {
    if (yearsInRetirement - d < 2) break;
    const pmt = requiredMonthlyPMT(originalGap, returnRate, inflationRate, yearsToRetire + d, yearsInRetirement - d, SAFE_RATE);
    if (pmt < 25) { delayD = d; rawD = pmt; break; }
    if (d === maxDelayD) { delayD = d; rawD = pmt; } // best achievable delay
  }
  const extraD = rawD < 25 ? 0 : Math.max(0, Math.round(rawD / 25) * 25);
  const showD = delayD > 0 && extraD < extraA;

  const resetLevers = () => {
    setMonthlyContribution(originalContribution);
    setRetirementAge(originalRetirementAge);
    setBavNettoVerzicht([originalBavNetto]);
  };

  const applyPackage = (id: PackageId) => {
    resetLevers();
    setSelected(id);
    if (id === 'A') {
      setMonthlyContribution(originalContribution + extraA);
    } else if (id === 'B') {
      setBavNettoVerzicht([originalBavNetto + bavNetto]);
    } else if (id === 'C') {
      setMonthlyContribution(originalContribution + extraC);
      setRetirementAge(originalRetirementAge + DELAY_C);
    } else { // D
      setRetirementAge(originalRetirementAge + delayD);
      if (extraD > 0) setMonthlyContribution(originalContribution + extraD);
    }
  };

  if (originalGap <= 0) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 3</div>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-black mb-3">Lücke bereits geschlossen!</h1>
          <p className="text-sm text-gray-500 px-4 leading-relaxed">
            Die Maßnahmen aus den vorherigen Schritten haben deine Rentenlücke bereits vollständig geschlossen.
          </p>
        </div>
        <div className="mt-auto flex gap-3">
          <button onClick={() => { onReset(); onBack(); }} className="flex-none w-14 h-14 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
            <ArrowLeft size={20} className="text-black" />
          </button>
          <button onClick={onNext} className="flex-1 h-14 bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2">
            Weiter <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Schritt 3</div>
      <h1 className="text-2xl font-black text-black mb-1 leading-tight">Der private Turbo.</h1>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">
        Wähle deinen Weg – wir schließen die Lücke auf null.
      </p>

      <div className="space-y-3 mb-5">

        <PackageCard
          selected={selected === 'A'}
          icon={<TrendingUp size={20} className={selected === 'A' ? 'text-emerald-600' : 'text-black'} />}
          badge="Der ETF-Weg"
          title={`Sparplan um ${extraA} € erhöhen`}
          subtitle={`Rente weiterhin mit ${originalRetirementAge}.`}
          onClick={() => applyPackage('A')}
        />

        {bavAvailable && (
          <PackageCard
            selected={selected === 'B'}
            icon={<Building2 size={20} className={selected === 'B' ? 'text-emerald-600' : 'text-black'} />}
            badge="Der Steuer-Trick"
            // M4: show total bAV when an existing bAV contribution is already active
            title={originalBavNetto > 0
              ? `Gesamt ${originalBavNetto + bavNetto} € netto in die bAV`
              : `Nur ${bavNetto} € netto in die bAV`}
            subtitle={originalBavNetto > 0
              ? `${bavNetto} € zusätzlich zum bestehenden ${originalBavNetto} € Beitrag.`
              : "Steuervorteil macht's günstiger als privates Sparen."}
            onClick={() => applyPackage('B')}
          />
        )}

        {showC && (
          <PackageCard
            selected={selected === 'C'}
            icon={<Shuffle size={20} className={selected === 'C' ? 'text-emerald-600' : 'text-black'} />}
            badge="Der Kompromiss"
            title={`${DELAY_C} Jahre länger + ${extraC} € mehr sparen`}
            subtitle={`Rente mit ${originalRetirementAge + DELAY_C}.`}
            onClick={() => applyPackage('C')}
          />
        )}

        {showD && (
          <PackageCard
            selected={selected === 'D'}
            icon={<Clock size={20} className={selected === 'D' ? 'text-emerald-600' : 'text-black'} />}
            badge="Der späte Ausstieg"
            title={extraD === 0
              ? `${delayD} Jahre länger arbeiten`
              : `${delayD} J. länger + ${extraD} € sparen`}
            subtitle={extraD === 0
              ? "Keine höhere Sparrate nötig."
              : `Statt ${extraA} € nur ${extraD} € mehr sparen.`}
            onClick={() => applyPackage('D')}
          />
        )}

      </div>

      <button
        onClick={() => { onReset(); onNext(); }}
        className="text-[12px] text-gray-400 hover:text-gray-600 underline underline-offset-2 text-center mb-5 cursor-pointer transition-colors w-full"
      >
        Nichts anpassen (Lücke von {originalGap.toLocaleString('de-DE')} € akzeptieren)
      </button>

      <div className="mt-auto flex gap-3">
        <button
          onClick={() => { onReset(); onBack(); }}
          className="flex-none w-14 h-14 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className={`flex-1 h-14 font-extrabold text-[15px] rounded-xl transition-all duration-300 flex justify-center items-center gap-2 ${
            selected
              ? 'bg-black hover:bg-gray-900 text-white cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selected ? 'Weiter' : 'Paket wählen'}
          {selected ? <ChevronRight size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );
}
