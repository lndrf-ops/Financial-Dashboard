import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Bell, LogOut, Building2, Briefcase, Home, Landmark, Bitcoin, X, CheckCircle2, Sparkles, Users } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { Onboarding, Persona } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView, LifeEvent, StressTests } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";
import { AIOnboarding, AIOnboardingData } from "./components/custom/AIOnboarding";
import { PersonalDataView } from "./components/custom/PersonalDataView";

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

export default function App() {
  const [activeView, setActiveView] = useState<'welcome' | 'aionboarding' | 'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData'>('welcome');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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
    { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: 0 }, 
    { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
    { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Immobilienwert", accumulatedValue: 0 },
    { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: 0 },
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
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "Via KI-Scan (Netto)", icon: Building2, payout: data.drvNetto, accumulatedLabel: "Beiträge", accumulatedValue: data.drvNetto * 40 },
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: etfStart }, 
      { id: "company", name: "Betriebliche Rente", subtitle: "Standmitteilung / Vertrag", icon: Briefcase, payout: data.bavPayout, accumulatedLabel: "Kapital", accumulatedValue: data.bavPayout > 0 ? 15000 : 0 },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Verkehrswert", accumulatedValue: 0 },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: cashStart },
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
      { id: "etf", name: "Weltweites Portfolio", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Start-Depotwert", accumulatedValue: p.assets.etfAcc }, 
      { id: "company", name: "Betriebliche Rente", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: p.assets.companyPayout, accumulatedLabel: "Kapital", accumulatedValue: p.assets.companyAcc },
      { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: p.assets.realestatePayout, accumulatedLabel: "Verkehrswert", accumulatedValue: p.assets.realestateAcc },
      { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Start-Guthaben", accumulatedValue: p.assets.cashAcc },
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

  // Werte für das Asset Breakdown
  const displayAssets = dynamicAssets.map(asset => {
    if (asset.id === "etf") {
      return { 
        ...asset, 
        payout: Math.round(additionalMonthlyPayoutNominal), 
        accumulatedValue: Math.round(capitalAtRetirement),
        accumulatedLabel: "Endkapital" // <-- Prognostiziert entfernt
      };
    }
    return asset;
  });

  // SVG Progress Ring Berechnungen
  const percentage = Math.round((realPurchasingPowerMonthly / targetPensionReal[0]) * 100);
  const cappedPercentage = Math.min(percentage, 100);
  const ringRadius = 80;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeOffset = ringCircumference - (cappedPercentage / 100) * ringCircumference;

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
      <div
        className="min-h-screen flex flex-col text-slate-200 max-w-[430px] mx-auto font-sans relative px-6 py-12 justify-center items-center text-center animate-in fade-in duration-500"
        style={{ backgroundImage: "url('/Senior-woman-standing-on-surfboard.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="absolute inset-0 bg-slate-950/80" />
        <div className="relative z-10 w-full">
          <div className="w-24 h-24 mx-auto bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-2xl">
            <TrendingUp size={48} className="text-indigo-400" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">FutureMe</h1>
          <p className="text-[15px] text-slate-300 leading-relaxed mb-12 px-4">
            Deine Altersvorsorge. Endlich verständlich, komplett digital und gebündelt in einer App.
          </p>
          <div className="w-full space-y-4 mt-8">
            <button onClick={() => setActiveView('aionboarding')} className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer">
              <Sparkles size={18} /> Jetzt starten
            </button>
            <button onClick={() => setActiveView('onboarding')} className="w-full flex justify-center items-center gap-2 bg-transparent border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-[13px] py-4 rounded-xl transition-colors cursor-pointer">
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

          {/* NEU: Erklärender Text & Titel über dem Ring für Anfänger */}
          <div className="px-6 pt-8 pb-2 text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">Deine Rente mit {retirementAge[0]}</h2>
            <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">
              So viel Geld hast du im Alter jeden Monat zur Verfügung. <br className="hidden sm:block"/>(Inflation ist bereits abgezogen)
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-6 px-6">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute inset-0">
                <circle cx="112" cy="112" r={ringRadius} stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-800" />
                <circle 
                  cx="112" cy="112" r={ringRadius} 
                  stroke="currentColor" strokeWidth="14" fill="transparent"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringStrokeOffset}
                  strokeLinecap="round"
                  className={isPositive ? "text-emerald-400 transition-all duration-1000 ease-out" : "text-indigo-500 transition-all duration-1000 ease-out"}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Mtl. Auszahlung</span>
                <span className="text-4xl font-black text-white">€ {realPurchasingPowerMonthly.toLocaleString('de-DE')}</span>
                <span className="text-[11px] text-slate-500 mt-1 font-medium">Ziel: € {targetPensionReal[0].toLocaleString('de-DE')}</span>
              </div>
            </div>
            
            <div className={`mt-6 px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 shadow-sm ${isPositive ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
              {isPositive ? <CheckCircle2 size={16} /> : <TrendingUp size={16} />} 
              {percentage}% vom Ziel erreicht
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Top 20% Banner wurde hier gelöscht */}
            <div className="flex justify-between gap-2 border-t border-slate-800 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Reicht bis Alter", value: `${activeLifeExpectancy}+` }, { label: "Sparrate", value: `€ ${monthlyContribution[0]}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-[15px] font-extrabold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <AssetBreakdown assets={displayAssets} onUpdateAsset={handleUpdateAsset} combinedMonthlyNominal={combinedMonthlyNominal} />

          <div className="px-6 pt-6 pb-8">
            {isPositive ? (
              <button onClick={() => {}} className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-default">
                Lücke geschlossen! Du kannst dich zurücklehnen.
              </button>
            ) : (
              <button onClick={() => setActiveView('optimize')} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-500/20">
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