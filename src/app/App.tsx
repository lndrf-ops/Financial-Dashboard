import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Bell, Settings } from "lucide-react";

// Importiere deine modularisierten Custom-Komponenten
import { AssetBreakdown } from "./components/custom/AssetBreakdown";
import { ScenarioSimulator } from "./components/custom/ScenarioSimulator";

// --- CHART-DATEN ---
const wealthData = [
  { age: 30, value: 12000 }, { age: 32, value: 28000 }, { age: 34, value: 51000 },
  { age: 36, value: 79000 }, { age: 38, value: 112000 }, { age: 40, value: 158000 },
  { age: 42, value: 203000 }, { age: 44, value: 261000 }, { age: 46, value: 324000 },
  { age: 48, value: 398000 }, { age: 50, value: 472000 }, { age: 52, value: 558000 },
  { age: 54, value: 643000 }, { age: 56, value: 741000 }, { age: 58, value: 839000 },
  { age: 60, value: 952000 }, { age: 62, value: 1071000 }, { age: 64, value: 1204000 },
  { age: 66, value: 1351000 }, { age: 67, value: 1440000 },
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0d0d] border border-white/10 rounded-md px-3 py-1.5">
        <span className="text-[#00e676] font-bold text-[13px]">
          € {(payload[0].value / 1000).toFixed(0)}k
        </span>
      </div>
    );
  }
  return null;
}

export default function App() {
  const [inflation, setInflation] = useState([2.5]);
  const [retirementAge, setRetirementAge] = useState([67]);

  // Zentrale mathematische Logik für Berechnungen
  const baseMonthly = 2450;
  const inflationFactor = 1 - (inflation[0] - 2.0) * 0.08;
  const ageFactor = 1 + (retirementAge[0] - 67) * 0.025;
  const projectedMonthly = Math.round(baseMonthly * inflationFactor * ageFactor);
  const diff = projectedMonthly - 2150;
  const isPositive = diff >= 0;
  
  const currentAge = 37;
  const yearsLeft = retirementAge[0] - currentAge;

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden">
      
      {/* Top Nav Bar */}
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

      {/* Hero Header Section */}
      <div className="px-6 pt-10 pb-8">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-3.5">
          Projected Purchasing Power at Age {retirementAge[0]}
        </p>
        <div className="text-[44px] font-black tracking-tight leading-none text-white mb-3">
          € {projectedMonthly.toLocaleString("de-DE")}
          <span className="text-[22px] font-semibold text-[#9a9a9a]"> / mo</span>
        </div>

        <div className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] font-bold border ${isPositive ? 'bg-[#00e676]/10 border-[#00e676]/20 text-[#00e676]' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
          {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")} {isPositive ? "above target" : "below target"}
        </div>

        <div className="mt-7 flex gap-7">
          {[
            { label: "Total Accumulated", value: "€ 1.44M" },
            { label: "Annual Return", value: "7.2%" },
            { label: "Years Left", value: yearsLeft },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] text-[#6b6b6b] font-medium tracking-wider uppercase mb-1">{stat.label}</p>
              <p className="text-[17px] font-extrabold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="pb-2">
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wealthData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line type="monotone" dataKey="value" stroke="#00e676" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#00e676", stroke: "#000", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between px-6 pt-2">
          {["Age 30", "40", "50", "60", "67"].map((label) => (
            <span key={label} className="text-[11px] text-[#3d3d3d] font-medium">{label}</span>
          ))}
        </div>
      </div>

      {/* 1. Modul: Asset Breakdown Liste */}
      <AssetBreakdown />

      {/* 2. Modul: Interaktive Slider-Steuerung */}
      <ScenarioSimulator 
        inflation={inflation}
        setInflation={setInflation}
        retirementAge={retirementAge}
        setRetirementAge={setRetirementAge}
        projectedMonthly={projectedMonthly}
        diff={diff}
        isPositive={isPositive}
        yearsLeft={yearsLeft}
      />

      {/* Call To Action Button */}
      <div className="px-6 pt-8 pb-8">
        <button className="w-full bg-[#00e676] hover:opacity-90 text-black font-extrabold text-[15px] py-4 rounded-xl transition-opacity">
          Optimize My Plan
        </button>
        <p className="text-center text-xs text-[#3d3d3d] mt-3">Based on DRV data and historical ETF returns</p>
      </div>

      {/* Bottom Floating Navigation */}
      <div className="sticky bottom-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-5 flex justify-around">
        {[
          { label: "Overview", active: true }, { label: "Invest", active: false },
          { label: "Simulate", active: false }, { label: "Profile", active: false },
        ].map((tab) => (
          <button key={tab.label} className={`flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-wider ${tab.active ? "text-[#00e676]" : "text-[#4a4a4a]"}`}>
            {tab.active && <span className="w-1 h-1 rounded-full bg-[#00e676] block" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}