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

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2.5 shadow-xl flex flex-col gap-1.5 min-w-[140px]">
        <span className="text-zinc-400 text-[10px] uppercase tracking-wider mb-0.5">Alter {data.age}</span>
        
        <div className="flex justify-between items-center gap-4">
           <span className="text-[#00e676] font-bold text-[12px]">Depot</span>
           <span className="text-[#00e676] font-bold text-[12px]">€ {data.depot.toLocaleString("de-DE")}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
           <span className="text-blue-400 font-bold text-[12px]">Cash (Liquidität)</span>
           <span className="text-blue-400 font-bold text-[12px]">€ {data.cash.toLocaleString("de-DE")}</span>
        </div>
        
        <div className="flex justify-between items-center gap-4 border-t border-white/10 pt-1.5 mt-0.5">
           <span className="text-white font-extrabold text-[13px]">Gesamt</span>
           <span className="text-white font-extrabold text-[13px]">€ {data.expected.toLocaleString("de-DE")}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [activeView, setActiveView] = useState<'aionboarding' | 'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile' | 'personalData'>('aionboarding');
  const [notification, setNotification] = useState<string | null>(null);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // Basis-Parameter
  const [currentAge, setCurrentAge] = useState(30);
  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);
  const [lifeExpectancy, setLifeExpectancy] = useState([85]); 
  const [monthlyContribution, setMonthlyContribution] = useState([150]); 
  const [dynamicSavings, setDynamicSavings] = useState(false); 
  const [expectedReturn, setExpectedReturn] = useState([7.0]); 
  const [targetPensionReal, setTargetPensionReal] = useState([2100]);
  
  // Arbeitgeber-Hebel
  const [vlActive, setVlActive] = useState(false);
  const [bavNettoVerzicht, setBavNettoVerzicht] = useState([0]);
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  // Simulations-States
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]);
  const [stressTests, setStressTests] = useState<StressTests>({
    bearMarket: false,
    highInflation: false,
    longevity: false
  });

  // Vermögenswerte
  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Gesetzliche Rente", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: 0, accumulatedLabel: "Beiträge", accumulatedValue: 0 },
    { id: "etf", name: "MSCI World ETF", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depotwert", accumulatedValue: 0 }, 
    { id: "company", name: "Betriebliche Altersvorsorge", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
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
    
    const estimatedDRV = Math.round(data.income * 0.45);
    const etfStart = Math.round(data.initialCapital * 0.8);
    const cashStart = data.initialCapital - etfStart;

    setDynamicAssets([
      { id: "statutory", name: "Gesetzliche Rente", subtitle: "KI-Schätzung", icon: Building2, payout: estimatedDRV, accumulatedLabel: "Beiträge", accumulatedValue: estimatedDRV * 40 },
      { id: "etf", name: "MSCI World ETF", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depot", accumulatedValue: etfStart }, 
      { id: "company", name: "Betriebliche Altersvorsorge", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Kapital", accumulatedValue: 0 },
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
      { id: "etf", name: "MSCI World ETF", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depot", accumulatedValue: p.assets.etfAcc }, 
      { id: "company", name: "Betriebliche Altersvorsorge", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: p.assets.companyPayout, accumulatedLabel: "Kapital", accumulatedValue: p.assets.companyAcc },
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
      if (type === 'drv' && asset.id === 'statutory') {
        return { ...asset, payout, accumulatedValue: accumulated };
      }
      if (type === 'bav' && asset.id === 'company') {
        return { ...asset, payout, accumulatedValue: accumulated };
      }
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
        if (event.type === 'sabbatical') {
          activeSavings = 0; 
          oneTimeCost = event.cost;
        } else if (event.type === 'realestate' || event.type === 'child') {
          oneTimeCost = event.cost;
        }
      }

      if (oneTimeCost > 0) {
        if (currentCapCash >= oneTimeCost) {
          currentCapCash -= oneTimeCost;
        } else {
          const remaining = oneTimeCost - currentCapCash;
          currentCapCash = 0;
          currentCapInvested -= remaining;
        }
      }

      if (stressTests.bearMarket && age === retirementAge[0]) {
         currentCapInvested *= 0.8;
      }

      if (age < retirementAge[0]) {
        for (let m = 0; m < 12; m++) {
          currentCapInvested = currentCapInvested * (1 + returnAccumulationMonthly) + activeSavings;
        }
        if (dynamicSavings && (!event || event.type !== 'sabbatical')) {
          loopSavings *= 1.02;
        }
      } 
      else {
        if (age === retirementAge[0]) {
          currentCapInvested += currentCapCash;
          currentCapCash = 0;
        }
        
        const yearsInRetirement = Math.max(1, activeLifeExpectancy - retirementAge[0]);
        const monthsInRetirement = yearsInRetirement * 12;
        const q = 1 + safeRetirementReturn;
        const capitalAtRetirementCalculated = data.find(d => d.age === retirementAge[0] - 1)?.expected || currentCapInvested;
        
        const additionalMonthlyPayoutNominal = monthsInRetirement > 0 ? 
          (capitalAtRetirementCalculated * Math.pow(q, monthsInRetirement) * (q - 1)) / (Math.pow(q, monthsInRetirement) - 1) : 0;

        for (let m = 0; m < 12; m++) {
          currentCapInvested = currentCapInvested * (1 + safeRetirementReturn) - additionalMonthlyPayoutNominal;
        }
      }
      
      data.push({ 
        age, 
        cash: Math.max(0, Math.round(currentCapCash)),
        depot: Math.max(0, Math.round(currentCapInvested)),
        expected: Math.max(0, Math.round(currentCapInvested + currentCapCash)) 
      });
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

  useEffect(() => {
    if (isPositive && !hasShownSuccessToast && activeView === 'dashboard') {
      setNotification("Glückwunsch! Deine Rentenlücke ist geschlossen. 🎯");
      setHasShownSuccessToast(true);
      setTimeout(() => setNotification(null), 5000);
    } else if (!isPositive && hasShownSuccessToast) {
      setHasShownSuccessToast(false);
    }
  }, [isPositive, hasShownSuccessToast, activeView]);


  // --- RENDER VIEWS ---

  if (activeView === 'aionboarding') {
    return <AIOnboarding onComplete={handleAIOnboardingComplete} onSwitchToPersonas={() => setActiveView('onboarding')} />;
  }
  
  if (activeView === 'onboarding') {
    return <Onboarding onSelectPersona={handleLoadPersona} onSwitchToAI={() => setActiveView('aionboarding')} />;
  }

  if (activeView === 'personalData') {
    return <PersonalDataView onBack={() => setActiveView('profile')} />;
  }

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
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden relative">
      
      {/* GLOBAL NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-[#00e676]/10 border border-[#00e676]/30 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-[#00e676]/20 flex items-center justify-center shrink-0 mt-0.5">
            {notification.includes("Glückwunsch") ? <CheckCircle2 size={16} className="text-[#00e676]" /> : <Bell size={16} className="text-[#00e676]" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-0.5">
              {notification.includes("Glückwunsch") ? "Ziel erreicht!" : "Neue Benachrichtigung"}
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-zinc-500 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {activeView === 'dashboard' && (
        <div className="pb-24">
          <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#00e676] rounded-md flex items-center justify-center">
                <TrendingUp size={15} className="text-black" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight">FutureMe</span>
            </div>
            <div className="flex gap-4 text-zinc-400">
              <Bell 
                onClick={() => triggerNotification(`Trade Republic: Dein Sparplan über ${monthlyContribution[0]} € wurde erfolgreich ausgeführt.`)}
                size={20} 
                className="cursor-pointer hover:text-white transition-colors" 
                strokeWidth={1.75} 
              />
              <LogOut 
                onClick={() => setActiveView('aionboarding')}
                size={20} 
                className="cursor-pointer hover:text-[#00e676] transition-colors" 
                strokeWidth={1.75} 
              />
            </div>
          </div>

          <div className="px-6 pt-8 pb-8">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-400 mb-3">
              Reale Kaufkraft (heutiger Wert)
            </p>
            <div className="text-[44px] font-black tracking-tight leading-none text-white mb-2 flex flex-wrap items-baseline gap-2 transition-all duration-300">
              € {realPurchasingPowerMonthly.toLocaleString("de-DE")}
              {/* UX UPDATE: Dynamische Farbe für "/ Monat" je nach Lücke */}
              <span className={`text-[22px] font-semibold transition-colors duration-500 ${isPositive ? 'text-[#00e676]' : 'text-red-500'}`}>
                / Monat
              </span>
            </div>
            <p className="text-[13px] font-medium text-zinc-400 mb-5">
              Nominale Auszahlung mit {retirementAge[0]}: <span className="text-white font-semibold">€ {Math.round(totalNominalMonthly).toLocaleString("de-DE")}</span>
            </p>

            <div className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-bold border transition-colors ${isPositive ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")} {isPositive ? "über dem Ziel" : "unter dem Ziel"}
            </div>

            <div className="mt-7 flex justify-between gap-2 border-t border-white/10 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Aufgebraucht mit", value: `Alter ${activeLifeExpectancy}` }, { label: "Wunschrente", value: `€ ${targetPensionReal[0].toLocaleString("de-DE")}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
                  <p className="text-[15px] font-extrabold">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-4">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={wealthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <ReferenceLine y={0} stroke="#4a4a4a" strokeDasharray="3 3" />
                  <ReferenceLine x={retirementAge[0]} stroke="#00e676" strokeOpacity={0.3} strokeDasharray="3 3" /> 
                  
                  <defs>
                    <linearGradient id="colorDepot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <Area type="monotone" dataKey="cash" stackId="1" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCash)" />
                  <Area type="monotone" dataKey="depot" stackId="1" stroke="#00e676" strokeWidth={2.5} fill="url(#colorDepot)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-6 pt-2">
              <span className="text-[11px] text-zinc-500 font-medium">Heute ({currentAge})</span>
              <span className="text-[11px] text-[#00e676] font-bold">Rente ({retirementAge[0]})</span>
              <span className="text-[11px] text-zinc-500 font-medium">Ende ({activeLifeExpectancy})</span>
            </div>
          </div>

          <AssetBreakdown 
            assets={dynamicAssets}
            onUpdateAsset={handleUpdateAsset}
            combinedMonthlyNominal={combinedMonthlyNominal}
          />

          <div className="px-6 pt-8 pb-8">
            <button 
              onClick={() => setActiveView('optimize')}
              className="w-full bg-[#00e676] hover:opacity-90 text-black font-extrabold text-[15px] py-4 rounded-xl transition-opacity cursor-pointer"
            >
              Plan optimieren
            </button>
            <p className="text-center text-xs text-zinc-500 mt-3">Basierend auf DRV-Daten und historischen ETF-Renditen</p>
          </div>
        </div>
      )}

      {activeView === 'invest' && (
        <div className="pb-24">
          <InvestView monthlyContribution={monthlyContribution[0]} assets={dynamicAssets} />
        </div>
      )}

      {activeView === 'simulate' && (
        <div className="pb-24">
          <SimulateView 
            currentAge={currentAge}
            retirementAge={retirementAge[0]}
            lifeEvents={lifeEvents}
            setLifeEvents={setLifeEvents}
            stressTests={stressTests}
            setStressTests={setStressTests}
          />
        </div>
      )}

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

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-5 flex justify-around">
        {[{ id: "dashboard", label: "Übersicht" }, { id: "invest", label: "Investieren" }, { id: "simulate", label: "Simulation" }, { id: "profile", label: "Profil" }].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveView(tab.id as any)}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider cursor-pointer ${activeView === tab.id ? "text-[#00e676]" : "text-zinc-500 hover:text-zinc-300 transition-colors"}`}
          >
            {activeView === tab.id && <span className="w-1 h-1 rounded-full bg-[#00e676] block" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}