import { useState, useMemo } from "react";
import { ComposedChart, Area, Line, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, Bell, Settings, Building2, Briefcase } from "lucide-react";

import { AssetBreakdown, Asset } from "./components/custom/AssetBreakdown";
import { ScenarioSimulator } from "./components/custom/ScenarioSimulator";
import { OptimizationPlan } from "./components/custom/OptimizationPlan";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const expectedData = payload.find((p: any) => p.dataKey === 'expected');
    if (!expectedData) return null;
    return (
      <div className="bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-2 shadow-xl flex flex-col gap-1.5">
        <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Age {expectedData.payload.age}</span>
        <span className="text-[#00e676] font-bold text-[13px]">Capital: € {(expectedData.value).toLocaleString("de-DE")}</span>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'optimize'>('dashboard');

  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);
  const [lifeExpectancy, setLifeExpectancy] = useState([85]); 
  const [monthlyContribution, setMonthlyContribution] = useState([150]); // Realistischerer Mittelstands-Sparbetrag
  const [dynamicSavings, setDynamicSavings] = useState(false); 
  const [expectedReturn, setExpectedReturn] = useState([7.0]); 
  const [isNetto, setIsNetto] = useState(false);

  // REALISTISCHE STATE-BASIERTE ASSETS (DEUTSCHER MITTELSTAND)
  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([
    { id: "statutory", name: "Statutory Pension", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: 1300, accumulatedLabel: "contributions", accumulatedValue: 142000 },
    { id: "etf", name: "MSCI World ETF", subtitle: "Private Wealth Accumulation", icon: TrendingUp, payout: 0, accumulatedLabel: "portfolio value", accumulatedValue: 35000 }, // Gesenkt von 125k
    { id: "company", name: "Company Pension", subtitle: "Betriebliche Altersvorsorge", icon: Briefcase, payout: 150, accumulatedLabel: "vested capital", accumulatedValue: 18500 }
  ]);

  const currentAge = 37;
  const yearsToRetire = retirementAge[0] - currentAge;
  const monthsToRetire = yearsToRetire * 12;
  const targetPensionReal = 2100; // Wunschrente (Kaufkraft) für Mittelstand

  // Extrahierte Werte aus dem veränderbaren Asset-State
  const statutoryValue = dynamicAssets.find(a => a.id === "statutory")?.payout || 0;
  const companyValue = dynamicAssets.find(a => a.id === "company")?.payout || 0;
  const startingCapital = dynamicAssets.find(a => a.id === "etf")?.accumulatedValue || 0;

  const handleUpdateAsset = (id: string, payout: number, accumulatedValue: number) => {
    setDynamicAssets(prev => prev.map(asset => {
      if (asset.id === id) {
        return { ...asset, payout, accumulatedValue };
      }
      return asset;
    }));
  };

  // --- FINANZMATHEMATISCHE LOGIK ---
  const returnAccumulationMonthly = (expectedReturn[0] / 100) / 12;
  
  // Berechnung des ETF-Werts am Rentenpunkt
  let capitalAtRetirement = startingCapital * Math.pow(1 + returnAccumulationMonthly, monthsToRetire);
  let currentMonthlySave = monthlyContribution[0];

  for (let year = 1; year <= yearsToRetire; year++) {
    for (let month = 1; month <= 12; month++) {
      capitalAtRetirement += currentMonthlySave * Math.pow(1 + returnAccumulationMonthly, monthsToRetire - ((year - 1) * 12 + month));
    }
    if (dynamicSavings) currentMonthlySave *= 1.02; 
  }

  // Rentenbarwert-Annuität (Kapitalverzehr während der Rentenphase)
  const yearsInRetirement = Math.max(1, lifeExpectancy[0] - retirementAge[0]);
  const monthsInRetirement = yearsInRetirement * 12;
  const safeRetirementReturn = 0.035 / 12; // 3.5% p.a. konservative Anlage im Alter

  const q = 1 + safeRetirementReturn;
  const additionalMonthlyPayoutNominal = monthsInRetirement > 0 ? 
    (capitalAtRetirement * Math.pow(q, monthsInRetirement) * (q - 1)) / (Math.pow(q, monthsInRetirement) - 1) : 0;

  // Steuern & Abgaben (Netto-Abzug ca. 19% für Krankenkassen + Steuern auf gesetzliche Rente/bAV)
  const taxFactor = isNetto ? 0.81 : 1.0;
  const totalNominalMonthly = (statutoryValue + companyValue + additionalMonthlyPayoutNominal) * taxFactor;
  
  // Abzinsung durch Inflation (Heutige reale Kaufkraft)
  const inflationFactor = Math.pow(1 - (inflation[0] / 100), yearsToRetire);
  const realPurchasingPowerMonthly = Math.round(totalNominalMonthly * inflationFactor);
  
  const diff = realPurchasingPowerMonthly - targetPensionReal;
  const isPositive = diff >= 0;
  const targetWealth = (targetPensionReal * 12) / 0.04;

  // Chart-Datenpfad (Aufbau vs. Abbau)
  const wealthData = useMemo(() => {
    const data = [];
    let currentCap = startingCapital;
    let loopSavings = monthlyContribution[0];

    for (let age = currentAge; age <= lifeExpectancy[0]; age++) {
      if (age < retirementAge[0]) {
        for (let m = 0; m < 12; m++) {
          currentCap = currentCap * (1 + returnAccumulationMonthly) + loopSavings;
        }
        if (dynamicSavings) loopSavings *= 1.02;
      } else {
        for (let m = 0; m < 12; m++) {
          currentCap = currentCap * (1 + safeRetirementReturn) - additionalMonthlyPayoutNominal;
        }
      }
      data.push({ age, expected: Math.max(0, Math.round(currentCap)) });
    }
    return data;
  }, [retirementAge, monthlyContribution, expectedReturn, currentAge, lifeExpectancy, dynamicSavings, additionalMonthlyPayoutNominal, startingCapital]);

  const combinedMonthlyNominal = statutoryValue + companyValue + additionalMonthlyPayoutNominal;

  if (activeView === 'optimize') {
    return (
      <OptimizationPlan 
        onBack={() => setActiveView('dashboard')} 
        projectedMonthly={realPurchasingPowerMonthly}
        targetPension={targetPensionReal}
        diff={diff}
        monthlyContribution={monthlyContribution[0]}
        setMonthlyContribution={(val) => setMonthlyContribution([val])}
        expectedReturn={expectedReturn[0]}
        setExpectedReturn={(val) => setExpectedReturn([val])}
      />
    );
  }

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden">
      
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#00e676] rounded-md flex items-center justify-center">
            <TrendingUp size={15} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[17px] tracking-tight">FutureMe</span>
        </div>
        <div className="flex gap-4 text-[#6b6b6b]">
          <Bell size={20} className="cursor-pointer hover:text-white transition-colors" strokeWidth={1.75} />
          <Settings size={20} className="cursor-pointer hover:text-white transition-colors" strokeWidth={1.75} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 pt-8 pb-8">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-3">
          Real Purchasing Power (Today's Value)
        </p>
        <div className="text-[44px] font-black tracking-tight leading-none text-white mb-2 flex flex-wrap items-baseline gap-2 transition-all duration-300">
          € {realPurchasingPowerMonthly.toLocaleString("de-DE")}
          <span className="text-[22px] font-semibold text-[#00e676]">/ mo</span>
        </div>
        <p className="text-[13px] font-medium text-[#6b6b6b] mb-5">
          Nominal Payout in {retirementAge[0]}: <span className="text-white font-semibold">Generational € {Math.round(totalNominalMonthly).toLocaleString("de-DE")}</span>
        </p>

        <div className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-bold border transition-colors ${isPositive ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")} {isPositive ? "above target" : "below target"}
        </div>

        <div className="mt-7 flex justify-between gap-2 border-t border-white/10 pt-5">
          {[{ label: "Peak Capital", value: `€ ${(capitalAtRetirement / 1000000).toFixed(2)}M` }, { label: "Depleted At", value: `Age ${lifeExpectancy[0]}` }, { label: "Target Need", value: `€ ${targetPensionReal.toLocaleString()}` }].map((stat) => (
            <div key={stat.label}>
              <p className="text-[10px] text-[#6b6b6b] font-medium tracking-wider uppercase mb-1">{stat.label}</p>
              <p className="text-[15px] font-extrabold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lebenszyklus Chart */}
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
          <span className="text-[11px] text-[#3d3d3d] font-medium">Now ({currentAge})</span>
          <span className="text-[11px] text-[#00e676] font-bold">Retire ({retirementAge[0]})</span>
          <span className="text-[11px] text-[#3d3d3d] font-medium">End ({lifeExpectancy[0]})</span>
        </div>
      </div>

      {/* Stateful Asset Breakdown Component */}
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
        dynamicSavings={dynamicSavings} setDynamicSavings={setDynamicSavings}
        projectedMonthly={realPurchasingPowerMonthly} diff={diff} isPositive={isPositive} yearsLeft={yearsToRetire}
      />

      <div className="px-6 pt-8 pb-8">
        <button 
          onClick={() => setActiveView('optimize')}
          className="w-full bg-[#00e676] hover:opacity-90 text-black font-extrabold text-[15px] py-4 rounded-xl transition-opacity cursor-pointer"
        >
          Optimize My Plan
        </button>
      </div>

      {/* Bottom Nav */}
      <div className="sticky bottom-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-5 flex justify-around">
        {[{ label: "Overview", active: true }, { label: "Invest", active: false }, { label: "Simulate", active: false }, { label: "Profile", active: false }].map((tab) => (
          <button key={tab.label} className={`flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider cursor-pointer ${tab.active ? "text-[#00e676]" : "text-[#4a4a4a]"}`}>
            {tab.active && <span className="w-1 h-1 rounded-full bg-[#00e676] block" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}