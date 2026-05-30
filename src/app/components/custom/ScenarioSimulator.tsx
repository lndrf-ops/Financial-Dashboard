import { useState } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface ScenarioSimulatorProps {
  inflation: number[];
  setInflation: (v: number[]) => void;
  retirementAge: number[];
  setRetirementAge: (v: number[]) => void;
  monthlyContribution: number[];
  setMonthlyContribution: (v: number[]) => void;
  expectedReturn: number[];
  setExpectedReturn: (v: number[]) => void;
  lifeExpectancy: number[];
  setLifeExpectancy: (v: number[]) => void;
  dynamicSavings: boolean;
  setDynamicSavings: (v: boolean) => void;
  projectedMonthly: number;
  diff: number;
  isPositive: boolean;
  yearsLeft: number;
}

export function ScenarioSimulator({
  inflation,
  setInflation,
  retirementAge,
  setRetirementAge,
  monthlyContribution,
  setMonthlyContribution,
  expectedReturn,
  setExpectedReturn,
  lifeExpectancy,
  setLifeExpectancy,
  dynamicSavings,
  setDynamicSavings,
  projectedMonthly,
  diff,
  isPositive,
  yearsLeft,
}: ScenarioSimulatorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="px-6 pt-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group py-2 cursor-pointer"
      >
        <div className="text-left">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-1 group-hover:text-white transition-colors">
            Adjust Scenarios
          </p>
          <p className="text-[13px] text-[#4a4a4a]">
            {isOpen ? "Hide advanced settings" : "See how changes affect your projection"}
          </p>
        </div>
        <div className={`transition-transform duration-300 text-[#4a4a4a] ${isOpen ? "rotate-180 text-[#00e676]" : ""}`}>
          <ChevronDown size={20} strokeWidth={2.5} />
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[800px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col gap-8 pb-4">
          
          {/* Mtl. Sparrate & Dynamik */}
          <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest">
                Mtl. Sparrate (ETF)
              </span>
              <span className="text-xl font-extrabold text-white">
                € {monthlyContribution[0]}
              </span>
            </div>
            <Slider value={monthlyContribution} max={1500} min={0} step={50} onValueChange={setMonthlyContribution} className="w-full" />
            
            <div className="pt-2 flex items-center justify-between border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[#9a9a9a]" />
                <span className="text-[12px] text-[#9a9a9a] font-medium">Dynamic Increase (2% p.a.)</span>
              </div>
              <Switch checked={dynamicSavings} onCheckedChange={setDynamicSavings} className="data-[state=checked]:bg-[#00e676]" />
            </div>
          </div>

          {/* Expected Return */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
                Annual Return (ETF)
              </span>
              <span className="text-xl font-extrabold text-white">
                {expectedReturn[0].toFixed(1)}%
              </span>
            </div>
            <Slider value={expectedReturn} max={12.0} min={2.0} step={0.1} onValueChange={setExpectedReturn} className="w-full" />
          </div>

          {/* Retirement Age */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
                Retirement Age
              </span>
              <span className="text-xl font-extrabold text-white">
                {retirementAge[0]}
              </span>
            </div>
            <Slider value={retirementAge} max={72} min={60} step={1} onValueChange={setRetirementAge} className="w-full" />
          </div>

          {/* NEU: Life Expectancy */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
                Life Expectancy
              </span>
              <span className="text-xl font-extrabold text-white">
                {lifeExpectancy[0]}
              </span>
            </div>
            <Slider value={lifeExpectancy} max={105} min={75} step={1} onValueChange={setLifeExpectancy} className="w-full" />
          </div>

          {/* Inflation */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
                Inflation Rate
              </span>
              <span className="text-xl font-extrabold text-white">
                {inflation[0].toFixed(1)}%
              </span>
            </div>
            <Slider value={inflation} max={6.0} min={0.5} step={0.1} onValueChange={setInflation} className="w-full" />
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-[#0a0a0a] border border-white/10 rounded-xl">
        <p className="text-[11px] text-[#6b6b6b] font-semibold tracking-widest uppercase mb-3.5">
          Scenario Impact
        </p>
        <div className="flex flex-col gap-3">
          {[
            { label: "Real purchasing power", value: `€ ${projectedMonthly.toLocaleString("de-DE")} / mo`, color: isPositive ? "text-[#00e676]" : "text-red-500" },
            { label: "Gap to target", value: `${isPositive ? "+" : ""}€ ${Math.abs(diff).toLocaleString("de-DE")}`, color: isPositive ? "text-[#00e676]" : "text-red-500" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-[13px] text-[#6b6b6b]">{row.label}</span>
              <span className={`text-sm font-extrabold ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}