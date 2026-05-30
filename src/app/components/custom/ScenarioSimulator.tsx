import { Slider } from "../ui/slider";

interface ScenarioSimulatorProps {
  inflation: number[];
  setInflation: (v: number[]) => void;
  retirementAge: number[];
  setRetirementAge: (v: number[]) => void;
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
  projectedMonthly,
  diff,
  isPositive,
  yearsLeft,
}: ScenarioSimulatorProps) {
  return (
    <div className="px-6 pt-8">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-1">
        Adjust Scenarios
      </p>
      <p className="text-[13px] text-[#4a4a4a] mb-7">
        See how changes affect your projection
      </p>

      <div className="flex flex-col gap-8">
        {/* Inflation Rate Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
              Inflation Rate
            </span>
            <span className="text-xl font-extrabold text-white">
              {inflation[0].toFixed(1)}%
            </span>
          </div>
          <Slider
            value={inflation}
            max={6.0}
            min={0.5}
            step={0.1}
            onValueChange={setInflation}
            className="w-full"
          />
        </div>

        {/* Retirement Age Slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-[#9a9a9a] font-medium uppercase tracking-widest">
              Retirement Age
            </span>
            <span className="text-xl font-extrabold text-white">
              {retirementAge[0]}
            </span>
          </div>
          <Slider
            value={retirementAge}
            max={72}
            min={60}
            step={1}
            onValueChange={setRetirementAge}
            className="w-full"
          />
        </div>
      </div>

      {/* Scenario Impact Box */}
      <div className="mt-8 p-5 bg-[#0a0a0a] border border-white/10 rounded-xl">
        <p className="text-[11px] text-[#6b6b6b] font-semibold tracking-widest uppercase mb-3.5">
          Scenario Impact
        </p>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "With your settings",
              value: `€ ${projectedMonthly.toLocaleString("de-DE")} / mo`,
              color: isPositive ? "text-[#00e676]" : "text-red-500",
            },
            {
              label: "Real purchasing power",
              value: `€ ${Math.round(
                projectedMonthly * Math.pow(0.97, yearsLeft)
              ).toLocaleString("de-DE")} / mo`,
              color: "text-[#9a9a9a]",
            },
            {
              label: "Gap to target",
              value: `${isPositive ? "+" : ""}€ ${Math.abs(diff).toLocaleString("de-DE")}`,
              color: isPositive ? "text-[#00e676]" : "text-red-500",
            },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-[13px] text-[#6b6b6b]">{row.label}</span>
              <span className={`text-sm font-extrabold ${row.color}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}