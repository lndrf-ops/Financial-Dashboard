import { useState, useMemo } from "react";
import { ComposedChart, Area, Line, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, Bell, LogOut, Building2, Briefcase, Home, Landmark, Bitcoin, X } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { ScenarioSimulator } from "./components/custom/ScenarioSimulator";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";
import { Onboarding, Persona } from "./components/custom/Onboarding";
import { InvestView } from "./components/custom/InvestView";
import { SimulateView } from "./components/custom/SimulateView";
import { ProfileView } from "./components/custom/ProfileView";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const expectedData = payload.find((p: any) => p.dataKey === 'expected');
    if (!expectedData) return null;
    return (
      <div className="bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 shadow-xl flex flex-col gap-1.5">
        <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Alter {expectedData.payload.age}</span>
        <span className="text-[#00e676] font-bold text-[13px]">Liquides Kapital: € {(expectedData.value).toLocaleString("de-DE")}</span>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [activeView, setActiveView] = useState<'onboarding' | 'dashboard' | 'optimize' | 'invest' | 'simulate' | 'profile'>('onboarding');
  
  // NEU: Notification State
  const [notification, setNotification] = useState<string | null>(null);

  const [currentAge, setCurrentAge] = useState(30);
  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);
  const [lifeExpectancy, setLifeExpectancy] = useState([85]); 
  const [monthlyContribution, setMonthlyContribution] = useState([150]); 
  const [dynamicSavings, setDynamicSavings] = useState(false); 
  const [expectedReturn, setExpectedReturn] = useState([7.0]); 
  const [isNetto, setIsNetto] = useState(false);
  const [targetPensionReal, setTargetPensionReal] = useState([2100]);

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Gesetzliche Rente", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: 0, accumulatedLabel: "Beiträge", accumulatedValue: 0 },
    { id: "etf", name: "MSCI World ETF", subtitle: "Privater Vermögensaufbau", icon: TrendingUp, payout: 0, accumulatedLabel: "Depotwert", accumulatedValue: 0 }, 
    { id: "company", name: "Betriebliche Altersvorsorge", subtitle: "Entgeltumwandlung", icon: Briefcase, payout: 0, accumulatedLabel: "Angespartes Kapital", accumulatedValue: 0 },
    { id: "realestate", name: "Immobilie", subtitle: "Eigenheim / Vermietung", icon: Home, payout: 0, accumulatedLabel: "Immobilienwert", accumulatedValue: 0 },
    { id: "cash", name: "Tagesgeld", subtitle: "Sichere Liquidität", icon: Landmark, payout: 0, accumulatedLabel: "Guthaben", accumulatedValue: 0 },
    { id: "crypto", name: "Kryptowährungen", subtitle: "Bitcoin & Altcoins", icon: Bitcoin, payout: 0, accumulatedLabel: "Portfolio", accumulatedValue: 0 }
  ]);

  const triggerNotification = () => {
    setNotification(`Trade Republic: Dein Sparplan über ${monthlyContribution[0]} € wurde erfolgreich ausgeführt.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLoadPersona = (p: Persona) => {
    setCurrentAge(p.age);
    setRetirementAge([p.targetAge]);
    setMonthlyContribution([p.monthlySavings]);
    setTargetPensionReal([p.targetPension]);
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

  const yearsToRetire = retirementAge[0] - currentAge;
  const monthsToRetire = yearsToRetire * 12;

  const statutoryValue = dynamicAssets.find(a => a.id === "statutory")?.payout || 0;
  const companyValue = dynamicAssets.find(a => a.id === "company")?.payout || 0;
  const realEstatePayout = dynamicAssets.find(a => a.id === "realestate")?.payout || 0;
  const realEstateAcc = dynamicAssets.find(a => a.id === "realestate")?.accumulatedValue || 0;
  
  const etfStart = dynamicAssets.find(a => a.id === "etf")?.accumulatedValue || 0;
  const cryptoStart = dynamicAssets.find(a => a.id === "crypto")?.accumulatedValue || 0;
  const cashStart = dynamicAssets.find(a => a.id === "cash")?.accumulatedValue || 0;

  const handleUpdateAsset = (id: string, payout: number, accumulatedValue: number) => {
    setDynamicAssets(prev => prev.map(asset => {
      if (asset.id === id) return { ...asset, payout, accumulatedValue };
      return asset;
    }));
  };

  const returnAccumulationMonthly = (expectedReturn[0] / 100) / 12;
  const investedStartingCapital = etfStart + cryptoStart;
  let capitalAtRetirement = investedStartingCapital * Math.pow(1 + returnAccumulationMonthly, monthsToRetire) + cashStart;
  let currentMonthlySave = monthlyContribution[0];

  for (let year = 1; year <= yearsToRetire; year++) {
    for (let month = 1; month <= 12; month++) {
      capitalAtRetirement += currentMonthlySave * Math.pow(1 + returnAccumulationMonthly, monthsToRetire - ((year - 1) * 12 + month));
    }
    if (dynamicSavings) currentMonthlySave *= 1.02; 
  }

  const yearsInRetirement = Math.max(1, lifeExpectancy[0] - retirementAge[0]);
  const monthsInRetirement = yearsInRetirement * 12;
  const safeRetirementReturn = 0.035 / 12; 

  const q = 1 + safeRetirementReturn;
  const additionalMonthlyPayoutNominal = monthsInRetirement > 0 ? 
    (capitalAtRetirement * Math.pow(q, monthsInRetirement) * (q - 1)) / (Math.pow(q, monthsInRetirement) - 1) : 0;

  const taxFactor = isNetto ? 0.81 : 1.0;
  const totalNominalMonthly = (statutoryValue + companyValue + realEstatePayout + additionalMonthlyPayoutNominal) * taxFactor;
  
  const inflationFactor = Math.pow(1 - (inflation[0] / 100), yearsToRetire);
  const realPurchasingPowerMonthly = Math.round(totalNominalMonthly * inflationFactor);
  
  const diff = realPurchasingPowerMonthly - targetPensionReal[0];
  const isPositive = diff >= 0;

  const wealthData = useMemo(() => {
    const data = [];
    let currentCapInvested = investedStartingCapital;
    let currentCapCash = cashStart;
    let loopSavings = monthlyContribution[0];

    for (let age = currentAge; age <= lifeExpectancy[0]; age++) {
      if (age < retirementAge[0]) {
        for (let m = 0; m < 12; m++) {
          currentCapInvested = currentCapInvested * (1 + returnAccumulationMonthly) + loopSavings;
        }
        if (dynamicSavings) loopSavings *= 1.02;
      } else {
        if (age === retirementAge[0]) {
          currentCapInvested += currentCapCash;
          currentCapCash = 0;
        }
        for (let m = 0; m < 12; m++) {
          currentCapInvested = currentCapInvested * (1 + safeRetirementReturn) - additionalMonthlyPayoutNominal;
        }
      }
      data.push({ age, expected: Math.max(0, Math.round(currentCapInvested + currentCapCash)) });
    }
    return data;
  }, [retirementAge, monthlyContribution, expectedReturn, currentAge, lifeExpectancy, dynamicSavings, additionalMonthlyPayoutNominal, investedStartingCapital, cashStart]);

  const combinedMonthlyNominal = statutoryValue + companyValue + realEstatePayout + additionalMonthlyPayoutNominal;
  const totalNetWorthAtRetirement = capitalAtRetirement + realEstateAcc;

  if (activeView === 'onboarding') {
    return <Onboarding onSelectPersona={handleLoadPersona} />;
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
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden relative">
      
      {/* GLOBAL NOTIFICATION TOAST */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-[#00e676]/10 border border-[#00e676]/30 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-2xl transition-all animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-full bg-[#00e676]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Bell size={16} className="text-[#00e676]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white mb-0.5">Neue Benachrichtigung</p>
            <p className="text-xs text-zinc-300 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-zinc-500 hover:text-white">
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
            <div className="flex gap-4 text-[#6b6b6b]">
              <Bell 
                onClick={triggerNotification}
                size={20} 
                className="cursor-pointer hover:text-white transition-colors" 
                strokeWidth={1.75} 
              />
              <LogOut 
                onClick={() => setActiveView('onboarding')}
                size={20} 
                className="cursor-pointer hover:text-[#00e676] transition-colors" 
                strokeWidth={1.75} 
              />
            </div>
          </div>

          <div className="px-6 pt-8 pb-8">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-3">
              Reale Kaufkraft (heutiger Wert)
            </p>
            <div className="text-[44px] font-black tracking-tight leading-none text-white mb-2 flex flex-wrap items-baseline gap-2 transition-all duration-300">
              € {realPurchasingPowerMonthly.toLocaleString("de-DE")}
              <span className="text-[22px] font-semibold text-[#00e676]">/ Monat</span>
            </div>
            <p className="text-[13px] font-medium text-[#6b6b6b] mb-5">
              Nominale Auszahlung mit {retirementAge[0]}: <span className="text-white font-semibold">€ {Math.round(totalNominalMonthly).toLocaleString("de-DE")}</span>
            </p>

            <div className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-bold border transition-colors ${isPositive ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")} {isPositive ? "über dem Ziel" : "unter dem Ziel"}
            </div>

            <div className="mt-7 flex justify-between gap-2 border-t border-white/10 pt-5">
              {[{ label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1000000).toFixed(2)}M` }, { label: "Aufgebraucht mit", value: `Alter ${lifeExpectancy[0]}` }, { label: "Wunschrente", value: `€ ${targetPensionReal[0].toLocaleString("de-DE")}` }].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[10px] text-[#6b6b6b] font-medium tracking-wider uppercase mb-1">{stat.label}</p>
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
                  <Area type="monotone" dataKey="expected" stroke="none" fill="url(#colorUv)" fillOpacity={0.2} />
                  <Line type="monotone" dataKey="expected" stroke="#00e676" strokeWidth={2.5} dot={false} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00e676" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00e676" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-6 pt-2">
              <span className="text-[11px] text-[#3d3d3d] font-medium">Heute ({currentAge})</span>
              <span className="text-[11px] text-[#00e676] font-bold">Rente ({retirementAge[0]})</span>
              <span className="text-[11px] text-[#3d3d3d] font-medium">Ende ({lifeExpectancy[0]})</span>
            </div>
          </div>

          <AssetBreakdown 
            isNetto={isNetto} 
            setIsNetto={setIsNetto} 
            assets={dynamicAssets}
            onUpdateAsset={handleUpdateAsset}
            combinedMonthlyNominal={combinedMonthlyNominal}
          />

          <ScenarioSimulator 
            inflation={inflation} setInflation={setInflation}
            retirementAge={retirementAge} setRetirementAge={setRetirementAge}
            monthlyContribution={monthlyContribution} setMonthlyContribution={setMonthlyContribution}
            expectedReturn={expectedReturn} setExpectedReturn={setExpectedReturn}
            lifeExpectancy={lifeExpectancy} setLifeExpectancy={setLifeExpectancy}
            targetPension={targetPensionReal} setTargetPension={setTargetPensionReal}
            dynamicSavings={dynamicSavings} setDynamicSavings={setDynamicSavings}
            projectedMonthly={realPurchasingPowerMonthly} diff={diff} isPositive={isPositive} yearsLeft={yearsToRetire}
          />

          <div className="px-6 pt-8 pb-8">
            <button 
              onClick={() => setActiveView('optimize')}
              className="w-full bg-[#00e676] hover:opacity-90 text-black font-extrabold text-[15px] py-4 rounded-xl transition-opacity cursor-pointer"
            >
              Plan optimieren
            </button>
            <p className="text-center text-xs text-[#3d3d3d] mt-3">Basierend auf DRV-Daten und historischen ETF-Renditen</p>
          </div>
        </div>
      )}

      {activeView === 'invest' && (
        <InvestView monthlyContribution={monthlyContribution[0]} assets={dynamicAssets} />
      )}

      {activeView === 'simulate' && (
        <SimulateView />
      )}

      {activeView === 'profile' && (
        <ProfileView />
      )}

      {/* --- ZENTRALE BOTTOM NAV --- */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-5 flex justify-around">
        {[{ id: "dashboard", label: "Übersicht" }, { id: "invest", label: "Investieren" }, { id: "simulate", label: "Simulation" }, { id: "profile", label: "Profil" }].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveView(tab.id as any)}
            className={`flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider cursor-pointer ${activeView === tab.id ? "text-[#00e676]" : "text-[#4a4a4a]"}`}
          >
            {activeView === tab.id && <span className="w-1 h-1 rounded-full bg-[#00e676] block" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}