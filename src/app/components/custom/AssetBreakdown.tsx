import { Building2, TrendingUp, Briefcase, ChevronRight } from "lucide-react";

const assets = [
  { id: "statutory", name: "Statutory Pension", subtitle: "Deutsche Rentenversicherung", icon: Building2, payout: "€ 950.00", accumulated: "€ 214,800 contributions" },
  { id: "etf", name: "MSCI World ETF", subtitle: "iShares Core — since 2018", icon: TrendingUp, payout: "€ 850.00", accumulated: "€ 748,320 portfolio value" },
  { id: "company", name: "Company Pension", subtitle: "Betriebliche Altersvorsorge", icon: Briefcase, payout: "€ 650.00", accumulated: "€ 127,440 vested" },
];

export function AssetBreakdown() {
  return (
    <>
      <div className="px-6 pt-8">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-1">Asset Breakdown</p>
        <p className="text-[13px] text-[#4a4a4a] mb-5">3 sources · Monthly payout</p>
      </div>

      <div className="mx-6 border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
        {assets.map((asset, i) => {
          const Icon = asset.icon;
          return (
            <div key={asset.id} className={`flex items-center p-4 cursor-pointer hover:bg-white/5 transition-colors ${i < assets.length - 1 ? "border-b border-white/5" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mr-3.5">
                <Icon size={18} className="text-[#9a9a9a]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-0.5 truncate">{asset.name}</p>
                <p className="text-xs text-[#4a4a4a]">{asset.subtitle}</p>
              </div>
              <div className="text-right ml-3 shrink-0">
                <p className="text-base font-extrabold text-white mb-0.5">{asset.payout}</p>
                <p className="text-[11px] text-[#4a4a4a]">{asset.accumulated}</p>
              </div>
              <ChevronRight size={14} className="text-[#3d3d3d] ml-2.5 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Combined Monthly Row */}
      <div className="mx-6 mt-3 px-5 py-4 bg-[#00e676]/5 border border-[#00e676]/15 rounded-xl flex items-center justify-between">
        <span className="text-[13px] text-[#9a9a9a] font-medium">Combined Monthly</span>
        <span className="text-xl font-black text-[#00e676] tracking-tight">€ 2,450.00</span>
      </div>

      <div className="mx-6 mt-9 h-px bg-white/5" />
    </>
  );
}