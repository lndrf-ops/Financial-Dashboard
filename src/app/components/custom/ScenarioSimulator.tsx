import { TrendingUp, Info, X } from "lucide-react";
import { useState } from "react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

export interface ScenarioSimulatorProps {
  inflation: number[]; setInflation: (v: number[]) => void;
  retirementAge: number[]; setRetirementAge: (v: number[]) => void;
  monthlyContribution: number[]; setMonthlyContribution: (v: number[]) => void;
  expectedReturn: number[]; setExpectedReturn: (v: number[]) => void;
  lifeExpectancy: number[]; setLifeExpectancy: (v: number[]) => void;
  targetPension: number[]; setTargetPension: (v: number[]) => void;
  dynamicSavings: boolean; setDynamicSavings: (v: boolean) => void;
  projectedMonthly: number; diff: number; isPositive: boolean; yearsLeft: number;
}

export function ScenarioSimulator({
  inflation, setInflation, retirementAge, setRetirementAge, monthlyContribution, setMonthlyContribution, expectedReturn, setExpectedReturn, lifeExpectancy, setLifeExpectancy, targetPension, setTargetPension, dynamicSavings, setDynamicSavings, projectedMonthly, diff, isPositive,
}: ScenarioSimulatorProps) {
  const [infoModal, setInfoModal] = useState<{title: string, text: string} | null>(null);

  const explanations = {
    targetPension: { title: "Wunschrente (Kaufkraft)", text: "Stell dir deine Wunschrente wie dein heutiges Gehalt vor. Wir rechnen die zukünftige Inflation vollautomatisch für dich obendrauf, sodass du im Alter exakt den gleichen echten Lebensstandard hast wie heute." },
    monthlyContribution: { title: "Monatliche Sparrate", text: "Jeder Euro, den du heute investierst, vermehrt sich durch den Zinseszinseffekt exponentiell." },
    expectedReturn: { title: "Erwartete Rendite p.a.", text: "Historisch betrachtet hat der weltweite Aktienmarkt ca. 7% bis 8% Rendite pro Jahr geliefert." },
    retirementAge: { title: "Renteneintrittsalter", text: "Jedes Jahr, das du länger arbeitest, wirkt in unserer Simulation gleich doppelt positiv." },
    lifeExpectancy: { title: "Lebenserwartung", text: "Wir rechnen standardmäßig damit, dass das Kapital bis zum 85. oder 90. Lebensjahr reichen muss." },
    inflation: { title: "Inflationsrate", text: "Bei 2,5 % durchschnittlicher Inflation verliert dein Erspartes in 28 Jahren genau die Hälfte seiner Kaufkraft!" }
  };

  const isHighRisk = expectedReturn[0] > 7.5;

  return (
    <div className="pt-2 relative">
      <div className="flex flex-col gap-8 pb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">Wunschrente</span>
              <button onClick={() => setInfoModal(explanations.targetPension)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"><Info size={14} className="text-slate-500 hover:text-white" /></button>
            </div>
            <span className="text-xl font-extrabold text-white">€ {targetPension[0]}</span>
          </div>
          <Slider value={targetPension} max={5000} min={1000} step={100} onValueChange={setTargetPension} className="w-full" />
        </div>

        <div className="space-y-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-indigo-400 font-semibold uppercase tracking-widest">Monatl. Sparrate</span>
              <button onClick={() => setInfoModal(explanations.monthlyContribution)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-indigo-500/10 transition-colors cursor-pointer"><Info size={14} className="text-indigo-400/70 hover:text-indigo-400" /></button>
            </div>
            <span className="text-xl font-extrabold text-white">€ {monthlyContribution[0]}</span>
          </div>
          <Slider value={monthlyContribution} max={1500} min={0} step={50} onValueChange={setMonthlyContribution} className="w-full" />
          <div className="pt-2 flex items-center justify-between border-t border-slate-700 mt-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-slate-500" />
              <span className="text-[12px] text-slate-400 font-medium">Dynamische Erhöhung (2% p.a.)</span>
            </div>
            <Switch checked={dynamicSavings} onCheckedChange={setDynamicSavings} className="data-[state=checked]:bg-indigo-500" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">Rendite p.a.</span>
              <button onClick={() => setInfoModal(explanations.expectedReturn)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"><Info size={14} className="text-slate-500 hover:text-white" /></button>
            </div>
            <span className={`text-xl font-extrabold transition-colors ${isHighRisk ? 'text-amber-400' : 'text-white'}`}>{expectedReturn[0].toFixed(1)}%</span>
          </div>
          <Slider value={expectedReturn} max={12.0} min={2.0} step={0.1} onValueChange={setExpectedReturn} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">Renteneintritt</span>
              <button onClick={() => setInfoModal(explanations.retirementAge)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"><Info size={14} className="text-slate-500 hover:text-white" /></button>
            </div>
            <span className="text-xl font-extrabold text-white">{retirementAge[0]} Jahre</span>
          </div>
          <Slider value={retirementAge} max={72} min={60} step={1} onValueChange={setRetirementAge} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">Lebenserwartung</span>
              <button onClick={() => setInfoModal(explanations.lifeExpectancy)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"><Info size={14} className="text-slate-500 hover:text-white" /></button>
            </div>
            <span className="text-xl font-extrabold text-white">{lifeExpectancy[0]} Jahre</span>
          </div>
          <Slider value={lifeExpectancy} max={105} min={75} step={1} onValueChange={setLifeExpectancy} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-slate-400 font-medium uppercase tracking-widest">Inflation</span>
              <button onClick={() => setInfoModal(explanations.inflation)} className="p-3 -m-3 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors cursor-pointer"><Info size={14} className="text-slate-500 hover:text-white" /></button>
            </div>
            <span className="text-xl font-extrabold text-white">{inflation[0].toFixed(1)}%</span>
          </div>
          <Slider value={inflation} max={6.0} min={0.5} step={0.1} onValueChange={setInflation} className="w-full" />
        </div>
      </div>

      <div className="mt-2 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <p className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase mb-3.5">Auswirkungen auf dein Dashboard</p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Neue reale Kaufkraft", value: `€ ${projectedMonthly.toLocaleString("de-DE")} / Monat`, color: isPositive ? "text-indigo-400" : "text-rose-400" },
            { label: "Lücke zur Wunschrente", value: `${isPositive ? "+" : ""}€ ${Math.abs(diff).toLocaleString("de-DE")}`, color: isPositive ? "text-indigo-400" : "text-rose-400" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-[13px] text-slate-400">{row.label}</span>
              <span className={`text-sm font-extrabold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {infoModal && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
           <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
             <button onClick={() => setInfoModal(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer">
                <X size={16}/>
             </button>
             <h3 className="text-indigo-400 font-bold text-[11px] uppercase tracking-widest mb-3">{infoModal.title}</h3>
             <p className="text-[13px] text-slate-300 leading-relaxed mb-6">{infoModal.text}</p>
             <button onClick={() => setInfoModal(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-[13px] py-3 rounded-xl transition-colors cursor-pointer">
                Verstanden
             </button>
           </div>
        </div>
      )}
    </div>
  );
}