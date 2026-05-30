import { ArrowLeft, Zap, ShieldCheck, PieChart, ArrowRight } from "lucide-react";

interface OptimizationPlanProps {
  onBack: () => void;
  projectedMonthly: number;
  targetPension: number;
  diff: number;
  
  // NEU: States für die interaktiven Actions
  monthlyContribution: number;
  setMonthlyContribution: (val: number) => void;
  expectedReturn: number;
  setExpectedReturn: (val: number) => void;
}

export function OptimizationPlan({ 
  onBack, 
  projectedMonthly, 
  targetPension, 
  diff,
  monthlyContribution,
  setMonthlyContribution,
  expectedReturn,
  setExpectedReturn
}: OptimizationPlanProps) {
  
  const isPositive = diff >= 0;

  // --- ACTION HANDLER ---
  const handleBoostETF = () => {
    setMonthlyContribution(monthlyContribution + 50); // Erhöht die Rate um 50€
    onBack(); // Springt sofort zurück zum Dashboard, um den Effekt zu zeigen!
  };

  const handleRebalance = () => {
    setExpectedReturn(7.5); // Setzt die erwartete Rendite auf 7.5%
    onBack();
  };

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight">Smart Action Plan</span>
      </div>

      <div className="px-6 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-2">
          Your Optimization Status
        </p>
        <div className="flex items-end gap-3 mb-6">
          <div className="text-4xl font-black tracking-tight leading-none text-white">
            {isPositive ? "On Track" : "Action Needed"}
          </div>
        </div>
        <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
          {isPositive 
            ? `Excellent! You are projected to exceed your target of €${targetPension.toLocaleString("de-DE")} by €${diff.toLocaleString("de-DE")}. Here are ways to optimize your surplus or retire even earlier.`
            : `You have a gap of €${Math.abs(diff).toLocaleString("de-DE")} to reach your monthly target of €${targetPension.toLocaleString("de-DE")}. Apply these data-driven recommendations to close it.`}
        </p>
      </div>

      <div className="px-6 space-y-4">
        {/* Action 1: Boost ETF */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-[#00e676]/30 transition-colors group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#00e676]/10 flex items-center justify-center shrink-0">
              <Zap size={20} className="text-[#00e676]" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-white mb-1">Boost ETF Contribution</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Increasing your monthly rate by just <span className="text-white font-semibold">€50</span> will utilize compound interest to add approx. <span className="text-[#00e676] font-bold">€180/mo</span> to your retirement payout.
              </p>
              <button 
                onClick={handleBoostETF}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#00e676] group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Apply Action <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Action 2: Rebalance Portfolio */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-colors group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <PieChart size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-white mb-1">Rebalance Portfolio Risk</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Based on your 30 years left to retirement, your risk profile is currently too conservative. Shift 15% from bonds to global equities to reach a <span className="text-white font-semibold">7.5% expected return</span>.
              </p>
              <button 
                onClick={handleRebalance}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Review Allocation <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Action 3: DRV Payments */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/30 transition-colors group">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-bold text-white mb-1">Voluntary DRV Payments</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Since you plan to retire at 67, you can make voluntary tax-deductible contributions to the statutory pension starting at age 50 to maximize your base payout.
              </p>
              <button 
                onClick={() => alert("This would open an information modal about DRV payments.")}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Learn More <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}