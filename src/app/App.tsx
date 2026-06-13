import { useState, useMemo, useEffect } from "react";
import { ComposedChart, Area, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, Bell, LogOut, Building2, Briefcase, Home, Landmark, Bitcoin, X, CheckCircle2 } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { Onboarding, Persona } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView, LifeEvent, StressTests } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";
import { AIOnboarding, AIOnboardingData } from "./components/custom/AIOnboarding";
import { PersonalDataView } from "./components/custom/PersonalDataView";

// NEU: Globale und unabhängige CSS-Konfetti-Komponente
function Confetti() {
  const colors = ['#6366f1', '#8b5cf6', '#22d3ee', '#10b981', '#f59e0b', '#f43f5e'];
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

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 shadow-2xl flex flex-col gap-1 min-w-[140px]">
        <span className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">Alter {data.age}</span>
        <div className="flex justify-between items-center gap-4">
           <span className="text-indigo-400 font-bold text-[13px]">Gesamtkapital</span>
           <span className="text-white font-extrabold text-[13px]">€ {data.expected.toLocaleString("de-DE")}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [activeView, setActiveView] = useState<'welcome' | 'aionboarding' | 'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData'>('welcome');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // NEU: Confetti State

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
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [stressTests, setStressTests] = useState<StressTests>({ bearMarket: false, highInflation: false, longevity: false });

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via PDF-Scan (Netto)", icon: Building2, payout: 0, accumulatedLabel: "Beiträge", accumulatedValue: 0 },
    { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depotwert", accumulatedValue: 0 }, 
    { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
    { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Immobilienwert", accumulatedValue: 0 },
    { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Guthaben", accumulatedValue: 0 },
    { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Portfolio", accumulatedValue: 0 }
  ]);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAIOnboardingComplete = (data: AIOnboardingData) => {
    setCurrentAge(data.age);
    setMonthlyContribution([data.monthlySavings]);
    setTargetPensionReal([data.targetPension]);
    setLifeEvents([]); 
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });
    
    const etfStart = Math.round(data.initialCapital * 0.8);
    const cashStart = data.initialCapital - etfStart;

    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via PDF-Scan (Netto)", icon: Building2, payout: data.drvNetto, accumulatedLabel: "Beiträge", accumulatedValue: data.drvNetto * 40 },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depot", accumulatedValue: etfStart }, 
      { id: "company", name: "Betriebliche Rente", subtitle: "Standmitteilung (Scan)", icon: Briefcase, payout: data.bavPayout, accumulatedLabel: "Kapital", accumulatedValue: data.bavPayout > 0 ? 15000 : 0 },
      { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Kapital", accumulatedValue: 0 },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Verkehrswert", accumulatedValue: 0 },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Guthaben", accumulatedValue: cashStart },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: 0 }
    ]);
    setActiveView('dashboard');
  };

  const handleLoadPersona = (p: Persona) => {
    setCurrentAge(p.age);
    setRetirementAge([p.targetAge]);
    setMonthlyContribution([p.monthlySavings]);
    setTargetPensionReal([p.targetPension]);
    setLifeEvents([]); 
    setStressTests({ bearMarket: false, highInflation: false, longevity: false });
    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: p.assets.statutoryPayout, accumulatedLabel: "Beiträge", accumulatedValue: p.assets.statutoryAcc },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depot", accumulatedValue: p.assets.etfAcc }, 
      { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: p.assets.companyPayout, accumulatedLabel: "Kapital", accumulatedValue: p.assets.companyAcc },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: p.assets.realestatePayout, accumulatedLabel: "Verkehrswert", accumulatedValue: p.assets.realestateAcc },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Guthaben", accumulatedValue: p.assets.cashAcc },
      { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Wallet", accumulatedValue: p.assets.cryptoAcc }
    ]);
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
  const statutoryValue = dynamicAssets.find(a => a.id === "statutory")?.payout || 0;
  const companyValue = dynamicAssets.find(a => a.id === "company")?.payout || 0;
  const realEstatePayout = dynamicAssets.find(a => a.id === "realestate")?.payout || 0;
  const realEstateAcc = dynamicAssets.find(a => a.id === "realestate")?.accumulatedValue || 0;
  
  const etfStart = dynamicAssets.find(a => a.id === "etf")?.accumulatedValue || 0;
  const cryptoStart = dynamicAssets.find(a => a.id === "crypto")?.accumulatedValue || 0;
  const cashStart = dynamicAssets.find(a => a.id === "cash")?.accumulatedValue || 0;
  const investedStartingCapital = etfStart + cryptoStart;

  const activeInflation = stressTests.highInflation ? Math.max(inflation[0], 5.0) : inflation[0];
  const activeLifeExpectancy = stressTests.longevity ? 98 : lifeExpectancy[0];
  
  const yearsToRetire = retirementAge[0] - currentAge;
  const returnAccumulationMonthly = (expectedReturn[0] / 100) / 12;
  const safeRetirementReturn = 0.035 / 12; 

  const wealthData = useMemo(() => {
    const data = [];
    let currentCapInvested = investedStartingCapital; 
    let currentCapCash = cashStart;
    let loopSavings = monthlyContribution[0];
    const agZusatzInvest = (vlActive ? 40 : 0) + bavBruttoInvest;

    for (let age = currentAge; age <= activeLifeExpectancy; age++) {
      const event = lifeEvents.find(e => e.age === age);
      let activeSavings = loopSavings + agZusatzInvest;
      let oneTimeCost = 0;

      if (event) {
        if (event.type === 'sabbatical') { activeSavings = 0; oneTimeCost = event.cost; } 
        else if (event.type === 'realestate' || event.type === 'child') { oneTimeCost = event.cost; }
      }

      if (oneTimeCost > 0) {
        if (currentCapCash >= oneTimeCost) currentCapCash -= oneTimeCost;
        else {
          const remaining = oneTimeCost - currentCapCash;
          currentCapCash = 0;
          currentCapInvested -= remaining;
        }
      }

      if (stressTests.bearMarket && age === retirementAge[0]) currentCapInvested *= 0.8;

      if (age < retirementAge[0]) {
        for (let m = 0; m < 12; m++) currentCapInvested = currentCapInvested * (1 + returnAccumulationMonthly) + activeSavings;
        if (dynamicSavings && (!event || event.type !== 'sabbatical')) loopSavings *= 1.02;
      } else {
        if (age === retirementAge[0]) { currentCapInvested += currentCapCash; currentCapCash = 0; }
        const yearsInRetirement = Math.max(1, activeLifeExpectancy - retirementAge[0]);
        const monthsInRetirement = yearsInRetirement * 12;
        const q = 1 + safeRetirementReturn;
        const capitalAtRetirementCalculated = data.find(d => d.age === retirementAge[0] - 1)?.expected || currentCapInvested;
        const additionalMonthlyPayoutNominal = monthsInRetirement > 0 ? (capitalAtRetirementCalculated * Math.pow(q, monthsInRetirement) * (q - 1)) / (Math.pow(q, monthsInRetirement) - 1) : 0;
        for (let m = 0; m < 12; m++) currentCapInvested = currentCapInvested * (1 + safeRetirementReturn) - additionalMonthlyPayoutNominal;
      }
      data.push({ age, expected: Math.max(0, Math.round(currentCapInvested + currentCapCash)) });
    }
    return data;
  }, [retirementAge, monthlyContribution, expectedReturn, currentAge, activeLifeExpectancy, dynamicSavings, investedStartingCapital, cashStart, lifeEvents, stressTests.bearMarket, vlActive, bavBruttoInvest]);

  const capitalAtRetirement = wealthData.find(d => d.age === retirementAge[0] - 1)?.expected || 0;
  const retirementStartCapital = stressTests.bearMarket ? capitalAtRetirement * 0.8 : capitalAtRetirement;
  const yearsInRetirementFinal = Math.max(1, activeLifeExpectancy - retirementAge[0]);
  const qFinal = 1 + safeRetirementReturn;
  const additionalMonthlyPayoutNominal = yearsInRetirementFinal > 0 ? 
    (retirementStartCapital * Math.pow(qFinal, yearsInRetirementFinal * 12) * (qFinal - 1)) / (Math.pow(qFinal, yearsInRetirementFinal * 12) - 1) : 0;

  const totalNominalMonthly = statutoryValue + companyValue + realEstatePayout + additionalMonthlyPayoutNominal;
  const inflationFactor = Math.pow(1 - (activeInflation / 100), yearsToRetire);
  const realPurchasingPowerMonthly = Math.round(totalNominalMonthly * inflationFactor);
  
  const diff = realPurchasingPowerMonthly - targetPensionReal[0];
  const isPositive = diff >= 0;
  const combinedMonthlyNominal = statutoryValue + companyValue + realEstatePayout + additionalMonthlyPayoutNominal;
  const totalNetWorthAtRetirement = capitalAtRetirement + realEstateAcc;

  // NEU: Triggert Konfetti und Toast, sobald man erfolgreich aufs Dashboard zurückkehrt
  useEffect(() => {
    if (isPositive && !hasShownSuccessToast && activeView === 'dashboard') {
      setNotification("Glückwunsch! Deine Rentenlücke ist geschlossen. 🎯");
      setHasShownSuccessToast(true);
      setShowConfetti(true);
      
      // Räumt das Konfetti nach 4.5 Sekunden wieder auf
      setTimeout(() => setShowConfetti(false), 4500);
      setTimeout(() => setNotification(null), 5500);
    } else if (!isPositive && hasShownSuccessToast) {
      setHasShownSuccessToast(false);
    }
  }, [isPositive, hasShownSuccessToast, activeView]);

  // --- RENDER VIEWS ---

  if (activeView === 'welcome') {
    return (
      <div
        className="min-h-screen flex flex-col text-slate-200 max-w-[430px] mx-auto font-sans relative px-6 py-12 justify-center items-center text-center animate-in fade-in duration-500"
        style={{
          backgroundImage: "url('/Senior-woman-standing-on-surfboard.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* dunkle Overlay für bessere Lesbarkeit */}
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="relative z-10 w-full">
          <div className="w-24 h-24 mx-auto bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl">
            <TrendingUp size={48} className="text-indigo-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">FutureMe</h1>
          <p className="text-[15px] text-slate-300 leading-relaxed mb-12 px-4">
            Deine Altersvorsorge. Endlich verständlich, komplett digital und gebündelt in einer App.
          </p>
          <div className="w-full space-y-4 mt-8">
            <button onClick={() => setActiveView('aionboarding')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer">
              Jetzt starten
            </button>
            <button onClick={() => setActiveView('onboarding')} className="w-full bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-[13px] py-4 rounded-xl transition-colors cursor-pointer">
              Demo-Profile (Personas)
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
        onBack={() => setActiveView('dashboard')} projectedMonthly={realPurchasingPowerMonthly} targetPension={targetPensionReal[0]} diff={diff}
        monthlyContribution={monthlyContribution[0]} setMonthlyContribution={(val) => setMonthlyContribution([val])}
        expectedReturn={expectedReturn[0]} setExpectedReturn={(val) => setExpectedReturn([val])}
        retirementAge={retirementAge[0]} setRetirementAge={(val) => setRetirementAge([val])}
        vlActive={vlActive} setVlActive={setVlActive} bavNettoVerzicht={bavNettoVerzicht} setBavNettoVerzicht={setBavNettoVerzicht}
      />
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 max-w-[430px] mx-auto font-sans overflow-x-hidden relative">
      
      {/* Konfetti rendern, wenn Status true ist */}
      {showConfetti && <Confetti />}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
            {notification.includes("Glückwunsch") ? <CheckCircle2 size={16} className="text-indigo-400" /> : <Bell size={16} className="text-indigo-400" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-0.5">{notification.includes("Glückwunsch") ? "Ziel erreicht!" : "Information"}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white cursor-pointer"><X size={14} /></button>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="pb-24">
          <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-[18px] tracking-tight text-white">FutureMe</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <Bell onClick={() => triggerNotification(`Dein Sparplan über ${monthlyContribution[0]} € wurde erfolgreich ausgeführt.`)} size={20} className="cursor-pointer hover:text-indigo-400 transition-colors" strokeWidth={1.75} />
              <LogOut onClick={() => setActiveView('welcome')} size={20} className="cursor-pointer hover:text-rose-400 transition-colors" strokeWidth={1.75} />
            </div>
          </div>

          <div className="px-6 pt-8 pb-8">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-slate-400 mb-3">Reale Kaufkraft (heutiger Wert)</p>
            <div className="text-[44px] font-black tracking-tight leading-none text-white mb-2 flex flex-wrap items-baseline gap-2 transition-all duration-300">
              € {realPurchasingPowerMonthly.toLocaleString("de-DE")}
              <span className={`text-[22px] font-semibold transition-colors duration-500 ${isPositive ? 'text-indigo-400' : 'text-rose-400'}`}>/ Monat</span>
            </div>
            <p className="text-[13px] font-medium text-slate-400 mb-5">
              Nominale Auszahlung mit {retirementAge[0]}: <span className="text-white font-semibold">€ {Math.round(totalNominalMonthly).toLocaleString("de-DE")}</span>
            </p>

            <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-bold border transition-colors ${isPositive ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")} {isPositive ? "über dem Ziel" : "unter dem Ziel"}
            </div>

            <div className="mt-7 flex justify-between gap-2 border-t border-slate-800 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Aufgebraucht mit", value: `Alter ${activeLifeExpectancy}` }, { label: "Wunschrente", value: `€ ${targetPensionReal[0].toLocaleString("de-DE")}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-[15px] font-extrabold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-4">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={wealthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
                  <ReferenceLine x={retirementAge[0]} stroke="#6366f1" strokeOpacity={0.4} strokeDasharray="3 3" /> 
                  <defs>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="expected" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorExpected)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-6 pt-2">
              <span className="text-[11px] text-slate-500 font-medium">Heute ({currentAge})</span>
              <span className="text-[11px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">Rente ({retirementAge[0]})</span>
              <span className="text-[11px] text-slate-500 font-medium">Ende ({activeLifeExpectancy})</span>
            </div>
          </div>

          <AssetBreakdown assets={dynamicAssets} onUpdateAsset={handleUpdateAsset} combinedMonthlyNominal={combinedMonthlyNominal} />

          <div className="px-6 pt-8 pb-8">
            <button onClick={() => setActiveView('optimize')} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-500/20">
              Lücke jetzt schließen
            </button>
            <p className="text-center text-xs text-slate-500 mt-3">Basierend auf DRV-Daten und historischen ETF-Renditen</p>
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
            projectedMonthly={realPurchasingPowerMonthly} diff={diff} isPositive={isPositive} yearsLeft={yearsToRetire}
            onNavigateToPersonalData={() => setActiveView('personalData')}
            onSyncComplete={handleDataSync}
          />
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 pt-3 pb-5 flex justify-around">
        {[{ id: "dashboard", label: "Übersicht" }, { id: "invest", label: "Investieren" }, { id: "simulate", label: "Simulation" }, { id: "profile", label: "Profil" }].map((tab) => (
          <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex flex-col items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer ${activeView === tab.id ? "text-indigo-400" : "text-slate-500 hover:text-slate-300 transition-colors"}`}>
            {activeView === tab.id && <span className="w-1 h-1 rounded-full bg-indigo-400 block absolute -top-2" />}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}