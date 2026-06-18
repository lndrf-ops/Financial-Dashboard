import React, { useState, useEffect } from "react";
import { usePensionMath } from "./hooks/usePensionMath";
import { TrendingUp, Bell, LogOut, Building2, Briefcase, Home, Landmark, Bitcoin, X, CheckCircle2, ArrowRight, Users } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { Onboarding, Persona } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView, LifeEvent, StressTests } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";
import { AIOnboarding, AIOnboardingData } from "./components/custom/AIOnboarding";
import { PersonalDataView } from "./components/custom/PersonalDataView";

// ─── Tutorial ────────────────────────────────────────────────────────────────

type DashboardView = 'dashboard' | 'invest' | 'simulate' | 'profile';

const TUTORIAL_STEPS: { title: string; text: string; view: DashboardView }[] = [
  {
    title: "Deine Rente auf einen Blick.",
    text: "Hier siehst du deine monatliche Kaufkraft im Alter. Deine gesetzliche und betriebliche Rente werden mit deinem ETF-Sparplan kombiniert.",
    view: 'dashboard',
  },
  {
    title: "Dein Geld arbeitet für dich.",
    text: "Passe deine monatliche Sparrate an und verfolge, wie der Zinseszins dein privates Vermögen über die Jahre skaliert.",
    view: 'invest',
  },
  {
    title: "Was wäre, wenn...?",
    text: "Das Leben passiert. Simuliere Auszeiten, Immobilienkäufe oder Marktcrashs und sieh sofort die Auswirkungen auf deine Rente.",
    view: 'simulate',
  },
  {
    title: "Deine Daten, deine Kontrolle.",
    text: "Passe Renteneintrittsalter, Inflation und Lebenserwartung an. Du hast jederzeit die volle Kontrolle über alle Annahmen.",
    view: 'profile',
  },
];

function TutorialOverlay({
  step,
  onNext,
  onComplete,
}: {
  step: number;
  onNext: () => void;
  onComplete: () => void;
}) {
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  return (
    <>
      {/* Dim background */}
      <div className="fixed inset-0 bg-slate-950/40 z-[90]" />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] bg-slate-950/85 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl px-6 pt-7 pb-10 animate-in slide-in-from-bottom-8 fade-in duration-300">
        {/* Pagination pill-dots */}
        <div className="flex justify-center items-center gap-2 mb-7">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-white' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Step content – key forces re-animation on step change */}
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Schritt {step + 1} von {TUTORIAL_STEPS.length}
          </p>
          <h2 className="text-[22px] font-black text-white tracking-tight leading-tight mb-3">
            {current.title}
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
            {current.text}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={isLast ? onComplete : onNext}
          className="w-full bg-white text-slate-950 font-extrabold text-[15px] py-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          {isLast ? 'Verstanden' : 'Weiter'}
        </button>
      </div>
    </>
  );
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

function Confetti() {
  const colors = ['#000000', '#374151', '#6B7280', '#10b981', '#f59e0b', '#f43f5e'];
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      {[...Array(75)].map((_, i) => {
        const color = colors[i % colors.length];
        const left = `${Math.random() * 100}%`;
        const animDuration = `${Math.random() * 2 + 3}s`;
        const animDelay = `${Math.random() * 0.5}s`;
        const size = Math.random() > 0.5 ? 'w-2 h-5' : 'w-2.5 h-2.5';
        return (
          <div
            key={i}
            className={`absolute top-[-10%] ${size} rounded-sm opacity-90`}
            style={{
              left,
              backgroundColor: color,
              animation: `fall ${animDuration} linear ${animDelay} forwards`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeView, setActiveView] = useState<'welcome' | 'aionboarding' | 'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData'>('welcome');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const [userName, setUserName] = useState("Lena");
  const [currentAge, setCurrentAge] = useState(30);
  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);
  const [lifeExpectancy, setLifeExpectancy] = useState([85]);
  const [monthlyContribution, setMonthlyContribution] = useState([150]);
  const [dynamicSavings, setDynamicSavings] = useState(false);
  const [expectedReturn, setExpectedReturn] = useState([7.0]);
  const [targetPensionReal, setTargetPensionReal] = useState([2100]);

  const [vlActive, setVlActive] = useState(false);
  const [bavNettoVerzicht, setBavNettoVerzicht] = useState([0]);
  const [drvBonus, setDrvBonus] = useState(0);
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [stressTests, setStressTests] = useState<StressTests>({ bearMarket: false, highInflation: false, longevity: false });

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via PDF-Scan (Netto)", icon: Building2, payout: 0, accumulatedLabel: "Beiträge", accumulatedValue: 0 },
    { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: 0 },
    { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
    { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Immobilienwert", accumulatedValue: 0 },
    { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: 0 },
    { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Portfolio", accumulatedValue: 0 }
  ]);

  const handleTutorialNext = () => {
    const nextStep = tutorialStep + 1;
    setTutorialStep(nextStep);
    setActiveView(TUTORIAL_STEPS[nextStep].view);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setActiveView('dashboard');
  };

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAIOnboardingComplete = (data: AIOnboardingData) => {
    setDrvBonus(data.drvBonus);
    setCurrentAge(data.age);
    setMonthlyContribution([data.monthlySavings]);
    setTargetPensionReal([data.targetPension]);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });

    const etfStart = Math.round(data.initialCapital * 0.8);
    const cashStart = data.initialCapital - etfStart;

    const drvPayout = data.pensionAssets.find(a => a.type === 'drv')?.monthlyPayout ?? 0;
    const otherPayout = data.pensionAssets
      .filter(a => a.type !== 'drv')
      .reduce((s, a) => s + a.monthlyPayout, 0);

    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via KI-Scan (Netto)", icon: Building2, payout: drvPayout, accumulatedLabel: "Beiträge", accumulatedValue: drvPayout * 40 },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: etfStart },
      { id: "company", name: "Betriebliche Rente", subtitle: "bAV & Private Vorsorge", icon: Briefcase, payout: otherPayout, accumulatedLabel: "Kapital", accumulatedValue: otherPayout > 0 ? 15000 : 0 },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Verkehrswert", accumulatedValue: 0 },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: cashStart },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: 0 }
    ]);
    setTutorialStep(0);
    setShowTutorial(true);
    setActiveView('dashboard');
  };

  const handleLoadPersona = (p: Persona) => {
    setUserName(p.name);
    setCurrentAge(p.age);
    setRetirementAge([p.targetAge]);
    setMonthlyContribution([p.monthlySavings]);
    setTargetPensionReal([p.targetPension]);
    setLifeEvents([]);
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });
    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: p.assets.statutoryPayout, accumulatedLabel: "Beiträge", accumulatedValue: p.assets.statutoryAcc },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: p.assets.etfAcc },
      { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: p.assets.companyPayout, accumulatedLabel: "Kapital", accumulatedValue: p.assets.companyAcc },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: p.assets.realestatePayout, accumulatedLabel: "Verkehrswert", accumulatedValue: p.assets.realestateAcc },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: p.assets.cashAcc },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: p.assets.cryptoAcc }
    ]);
    setTutorialStep(0);
    setShowTutorial(true);
    setActiveView('dashboard');
  };

  const handleUpdateAsset = (id: string, payout: number, accumulatedValue: number) => {
    setDynamicAssets(prev => prev.map(asset => {
      if (asset.id === id) return { ...asset, payout, accumulatedValue };
      return asset;
    }));
  };

  const handleDataSync = (payout: number, accumulated: number, type: 'drv' | 'bav') => {
    setDynamicAssets(prev => prev.map(asset => {
      if (type === 'drv' && asset.id === 'statutory') return { ...asset, payout, accumulatedValue: accumulated };
      if (type === 'bav' && asset.id === 'company') return { ...asset, payout, accumulatedValue: accumulated };
      return asset;
    }));
    triggerNotification(`${type === 'drv' ? 'DRV-Rente' : 'bAV'} erfolgreich synchronisiert!`);
    setActiveView('dashboard');
  };

  // --- FINANZMATHEMATIK ---
  const {
    capitalAtRetirement,
    additionalMonthlyPayoutNominal,
    totalNominalMonthly,
    inflationFactor,
    realPurchasingPowerMonthly,
    diff,
    isPositive,
    currentGap,
    leverSavings,
    leverBavNetto,
    combinedMonthlyNominal,
    totalNetWorthAtRetirement,
  } = usePensionMath({
    currentAge,
    retirementAge:       retirementAge[0],
    lifeExpectancy:      lifeExpectancy[0],
    monthlyContribution: monthlyContribution[0],
    dynamicSavings,
    expectedReturn:      expectedReturn[0],
    inflation:           inflation[0],
    targetPension:       targetPensionReal[0],
    dynamicAssets,
    vlActive,
    bavBruttoInvest,
    lifeEvents,
    stressTests,
  });

  const activeLifeExpectancy = stressTests.longevity ? 98 : lifeExpectancy[0];

  const statutoryValue   = dynamicAssets.find(a => a.id === 'statutory')?.payout   ?? 0;
  const companyValue     = dynamicAssets.find(a => a.id === 'company')?.payout     ?? 0;
  const realEstatePayout = dynamicAssets.find(a => a.id === 'realestate')?.payout  ?? 0;

  const displayAssets = dynamicAssets.map(asset => {
    if (asset.id === "etf") {
      return {
        ...asset,
        payout: Math.round(additionalMonthlyPayoutNominal),
        accumulatedValue: Math.round(capitalAtRetirement),
        accumulatedLabel: "Endkapital"
      };
    }
    return asset;
  });

  const percentage = Math.round((realPurchasingPowerMonthly / targetPensionReal[0]) * 100);
  const cappedPercentage = Math.min(percentage, 100);
  const ringRadius = 80;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringBadgeBg =
    percentage >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
    percentage >= 85  ? 'bg-teal-50 border-teal-200 text-teal-600' :
    percentage >= 65  ? 'bg-amber-50 border-amber-200 text-amber-600' :
    percentage >= 40  ? 'bg-orange-50 border-orange-200 text-orange-600' :
                        'bg-red-50 border-red-200 text-red-500';

  const segmentPalette: string[] =
    percentage >= 100 ? ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'] :
    percentage >= 85  ? ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] :
    percentage >= 65  ? ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'] :
    percentage >= 40  ? ['#f97316', '#fb923c', '#fdba74', '#fed7aa'] :
                        ['#ef4444', '#f87171', '#fca5a5', '#fecaca'];

  const rawSources = [
    { label: "Gesetzl. Rente", value: Math.round(statutoryValue * inflationFactor) },
    { label: "Portfolio",      value: Math.round(additionalMonthlyPayoutNominal * inflationFactor) },
    { label: "bAV",            value: Math.round(companyValue * inflationFactor) },
    { label: "Immobilie",      value: Math.round(realEstatePayout * inflationFactor) },
  ].filter(s => s.value > 0).map((s, i) => ({ ...s, color: segmentPalette[i] }));

  const totalChartValue = rawSources.reduce((sum, s) => sum + s.value, 0);
  const filledArc = (cappedPercentage / 100) * ringCircumference;
  const SEGMENT_GAP = 4;

  let _cum = 0;
  const segmentData = rawSources.map((s, i) => {
    const slice = totalChartValue > 0 ? (s.value / totalChartValue) * filledArc : 0;
    const segArc = Math.max(0, slice - SEGMENT_GAP);
    const startArc = _cum;
    _cum += slice;
    const midAngle = ((startArc + slice / 2) / ringCircumference) * 360;
    return { ...s, i, segArc, startArc, side: midAngle < 180 ? 'right' : 'left' as 'left' | 'right' };
  });

  useEffect(() => {
    if (isPositive && !hasShownSuccessToast && activeView === 'dashboard') {
      setNotification("Glückwunsch! Deine Rentenlücke ist geschlossen. 🎯");
      setHasShownSuccessToast(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4500);
      setTimeout(() => setNotification(null), 5500);
    } else if (!isPositive && hasShownSuccessToast) {
      setHasShownSuccessToast(false);
    }
  }, [isPositive, hasShownSuccessToast, activeView]);

  // --- RENDER VIEWS ---

  if (activeView === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col text-white max-w-[430px] mx-auto font-sans relative px-6 py-12 justify-center items-center text-center animate-in fade-in duration-500 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: "url('/Senior-woman-standing-on-surfboard.jpg')" }} />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 w-full">
          <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/20">
            <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">FutureMe</h1>
          <p className="text-[15px] text-white/70 leading-relaxed mb-12 px-4">
            Deine Altersvorsorge. Endlich verständlich, komplett digital und gebündelt in einer App.
          </p>
          <div className="w-full space-y-4 mt-8">
            <button onClick={() => setActiveView('aionboarding')} className="w-full flex justify-center items-center gap-2 bg-white hover:bg-gray-100 text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer">
              <ArrowRight size={18} /> Jetzt starten
            </button>
            <button onClick={() => setActiveView('onboarding')} className="w-full flex justify-center items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white/70 hover:text-white font-bold text-[13px] py-4 rounded-xl transition-colors cursor-pointer">
              <Users size={18} /> Demo-Profile (Personas)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'aionboarding') return <AIOnboarding onComplete={handleAIOnboardingComplete} onSwitchToPersonas={() => setActiveView('welcome')} />;
  if (activeView === 'onboarding') return <Onboarding onSelectPersona={handleLoadPersona} onSwitchToAI={() => setActiveView('aionboarding')} />;
  if (activeView === 'personalData') return <PersonalDataView onBack={() => setActiveView('profile')} />;
  if (activeView === 'optimize') {
    return (
      <OptimizationPlan
        onBack={() => setActiveView('dashboard')}
        projectedMonthly={realPurchasingPowerMonthly}
        targetPension={targetPensionReal[0]}
        diff={diff}
        monthlyContribution={monthlyContribution[0]}
        setMonthlyContribution={(val) => setMonthlyContribution([val])}
        expectedReturn={expectedReturn[0]}
        setExpectedReturn={(val) => setExpectedReturn([val])}
        retirementAge={retirementAge[0]}
        setRetirementAge={(val) => setRetirementAge([val])}
        vlActive={vlActive}
        setVlActive={setVlActive}
        bavNettoVerzicht={bavNettoVerzicht}
        setBavNettoVerzicht={setBavNettoVerzicht}
        suggestedBavNettoAmount={leverBavNetto}
        drvBonus={drvBonus}
        currentAge={currentAge}
        lifeExpectancy={lifeExpectancy[0]}
        inflation={inflation[0]}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen text-black max-w-[430px] mx-auto font-sans overflow-x-hidden relative">

      {showConfetti && <Confetti />}

      {/* Tutorial overlay — sits above everything except confetti */}
      {showTutorial && (
        <TutorialOverlay
          step={tutorialStep}
          onNext={handleTutorialNext}
          onComplete={handleTutorialComplete}
        />
      )}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-white border border-gray-200 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 mt-0.5">
            {notification.includes("Glückwunsch") ? <CheckCircle2 size={16} className="text-black" /> : <Bell size={16} className="text-black" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-black mb-0.5">{notification.includes("Glückwunsch") ? "Ziel erreicht!" : "Information"}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-black cursor-pointer"><X size={14} /></button>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="pb-24">
          <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden">
                <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-[18px] tracking-tight text-black">FutureMe</span>
            </div>
            <div className="flex gap-4 text-gray-400">
              <Bell onClick={() => triggerNotification(`Dein Sparplan über ${monthlyContribution[0]} € wurde erfolgreich ausgeführt.`)} size={20} className="cursor-pointer hover:text-black transition-colors" strokeWidth={1.75} />
              <LogOut onClick={() => setActiveView('welcome')} size={20} className="cursor-pointer hover:text-red-500 transition-colors" strokeWidth={1.75} />
            </div>
          </div>

          <div className="px-6 pt-8 pb-2 text-center">
            <p className="text-[13px] text-gray-400 font-medium mb-1">Hallo, {userName}</p>
            <h2 className="text-2xl font-black text-black tracking-tight">Deine Rente mit {retirementAge[0]}</h2>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
              So viel Geld hast du im Alter jeden Monat zur Verfügung. <br className="hidden sm:block"/>(Inflation ist bereits abgezogen)
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 py-2 px-4">
            {/* Left labels */}
            <div className="flex flex-col gap-4 w-[86px]">
              {segmentData.filter(s => s.side === 'left').map(s => (
                <div key={s.label}
                  className="text-right cursor-default transition-opacity duration-200"
                  style={{ opacity: hoveredSegment === s.i ? 1 : 0 }}
                  onMouseEnter={() => setHoveredSegment(s.i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
                  <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
                  <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>{Math.round((s.value / targetPensionReal[0]) * 100)}% vom Ziel</p>
                  <div className="flex justify-end mt-1">
                    <div className="h-[2px] w-7 rounded-full" style={{ backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Ring */}
            <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 224 224" className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="112" cy="112" r={ringRadius} stroke="currentColor" strokeWidth="14" fill="transparent" className="text-gray-100" />
                {segmentData.map(s => (
                  <circle
                    key={s.label}
                    cx="112" cy="112" r={ringRadius}
                    stroke={s.color}
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={`${s.segArc} ${ringCircumference - s.segArc}`}
                    strokeDashoffset={ringCircumference - s.startArc}
                    strokeLinecap="butt"
                    style={{ opacity: hoveredSegment !== null && hoveredSegment !== s.i ? 0.2 : 1, transition: 'opacity 0.2s ease' }}
                    onMouseEnter={() => setHoveredSegment(s.i)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    className="cursor-pointer"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none text-center px-3">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Mtl. Auszahlung</span>
                <span className="text-[22px] font-black text-black leading-tight mt-0.5">€ {realPurchasingPowerMonthly.toLocaleString('de-DE')}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Ziel: € {targetPensionReal[0].toLocaleString('de-DE')}</span>
              </div>
            </div>

            {/* Right labels */}
            <div className="flex flex-col gap-4 w-[86px]">
              {segmentData.filter(s => s.side === 'right').map(s => (
                <div key={s.label}
                  className="text-left cursor-default transition-opacity duration-200"
                  style={{ opacity: hoveredSegment === s.i ? 1 : 0 }}
                  onMouseEnter={() => setHoveredSegment(s.i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <div className="mb-1"><div className="h-[2px] w-7 rounded-full" style={{ backgroundColor: s.color }} /></div>
                  <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
                  <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
                  <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>{Math.round((s.value / targetPensionReal[0]) * 100)}% vom Ziel</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pb-6">
            <div className={`px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 border ${ringBadgeBg}`}>
              {isPositive ? <CheckCircle2 size={16} /> : <TrendingUp size={16} />}
              {isPositive && percentage > 100
                ? `Ziel erreicht · ${percentage}%`
                : `${percentage}% vom Ziel erreicht`}
            </div>
          </div>

          {!isPositive && (
            <div className="px-6 pt-2 pb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Deine 3 größten Hebel</p>
              <div className="space-y-2">
                {([
                  { icon: Landmark, title: "VL-Sparen aktivieren", subtitle: "Arbeitgeberzuschuss", gain: "+40 €/mtl." },
                  { icon: Briefcase, title: "bAV nutzen", subtitle: "Entgeltumwandlung", gain: `+${leverBavNetto} €/mtl.` },
                  { icon: TrendingUp, title: "Sparrate erhöhen", subtitle: "Privater Vermögensaufbau", gain: `+${leverSavings} €/mtl.` },
                ] as { icon: React.ElementType; title: string; subtitle: string; gain: string }[]).map(({ icon: Icon, title, subtitle, gain }) => (
                  <div key={title} className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#F4F4F5] rounded-lg flex items-center justify-center shrink-0 self-center">
                      <Icon size={14} className="text-black" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[13px] font-bold text-black leading-tight">{title}</p>
                      <p className="text-[12px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>
                    </div>
                    <p className="text-[13px] font-extrabold text-emerald-500 shrink-0 self-center">{gain}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            <div className="flex justify-between gap-2 border-t border-gray-100 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Reicht bis Alter", value: `${activeLifeExpectancy}+` }, { label: "Sparrate", value: `€ ${monthlyContribution[0]}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-[15px] font-extrabold text-black">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <AssetBreakdown assets={displayAssets} onUpdateAsset={handleUpdateAsset} combinedMonthlyNominal={combinedMonthlyNominal} />

          <div className="px-6 pt-6 pb-8">
            {isPositive ? (
              <button onClick={() => {}} className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-[15px] py-4 rounded-xl cursor-default">
                Lücke geschlossen!
              </button>
            ) : (
              <button onClick={() => setActiveView('optimize')} className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer">
                Lücke jetzt schließen
              </button>
            )}
          </div>
        </div>
      )}

      {activeView === 'invest' && <div className="pb-24"><InvestView monthlyContribution={monthlyContribution[0]} assets={dynamicAssets} /></div>}
      {activeView === 'simulate' && <div className="pb-24"><SimulateView currentAge={currentAge} retirementAge={retirementAge[0]} lifeEvents={lifeEvents} setLifeEvents={setLifeEvents} stressTests={stressTests} setStressTests={setStressTests} /></div>}

      {activeView === 'profile' && (
        <div className="pb-24">
          <ProfileView
            inflation={inflation} setInflation={setInflation}
            retirementAge={retirementAge} setRetirementAge={setRetirementAge}
            monthlyContribution={monthlyContribution} setMonthlyContribution={setMonthlyContribution}
            expectedReturn={expectedReturn} setExpectedReturn={setExpectedReturn}
            lifeExpectancy={lifeExpectancy} setLifeExpectancy={setLifeExpectancy}
            targetPension={targetPensionReal} setTargetPension={setTargetPensionReal}
            dynamicSavings={dynamicSavings} setDynamicSavings={setDynamicSavings}
            projectedMonthly={realPurchasingPowerMonthly} diff={diff} isPositive={isPositive} yearsLeft={retirementAge[0] - currentAge}
            onNavigateToPersonalData={() => setActiveView('personalData')}
            onSyncComplete={handleDataSync}
          />
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 pt-3 pb-5 flex justify-around">
        {[{ id: "dashboard", label: "Übersicht" }, { id: "invest", label: "Investieren" }, { id: "simulate", label: "Simulation" }, { id: "profile", label: "Profil" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${activeView === tab.id ? "text-black" : "text-gray-400 hover:text-gray-600 transition-colors"}`}>
            {activeView === tab.id && <span className="w-1 h-1 rounded-full bg-black block absolute -top-2" />}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
