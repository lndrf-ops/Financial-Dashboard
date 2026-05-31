import { ArrowRight, ChevronRight, TrendingUp } from "lucide-react";
import { Asset } from "./AssetBreakdown";

interface InvestViewProps {
  monthlyContribution: number;
  assets: Asset[];
}

export function InvestView({ monthlyContribution, assets }: InvestViewProps) {
  const hasCrypto = assets.some(a => a.id === "crypto" && a.accumulatedValue > 0);
  
  const etfShare = hasCrypto ? Math.round(monthlyContribution * 0.8) : monthlyContribution;
  const cryptoShare = hasCrypto ? monthlyContribution - etfShare : 0;

  // NEU: Reale Werte aus dem Dashboard-State auslesen
  const etfValue = assets.find(a => a.id === "etf")?.accumulatedValue || 0;
  const cryptoValue = assets.find(a => a.id === "crypto")?.accumulatedValue || 0;

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl px-6 py-6 border-b border-white/5">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">
          Ausführung durch
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-black text-[10px]">TR</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight">Trade Republic</span>
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <p className="text-[13px] text-zinc-400 font-medium mb-1">Dein monatlicher Sparplan</p>
        <h1 className="text-5xl font-black tracking-tight mb-8">
          € {monthlyContribution.toLocaleString("de-DE")}
        </h1>

        <div className="h-40 w-full mb-8 relative flex items-center justify-center border border-white/5 rounded-2xl bg-[#0a0a0a]">
           <TrendingUp size={48} className="text-white/10" />
           <p className="absolute bottom-4 text-xs text-zinc-600 font-medium tracking-wide">Performance-Vorschau generiert...</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Deine Ausführung</h2>
            
            {/* Asset 1: Core MSCI World */}
            <div className="bg-[#0a0a0a] rounded-2xl p-4 flex items-center justify-between mb-3 border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <span className="text-blue-500 font-bold text-xs">iS</span>
                </div>
                <div>
                  <p className="font-bold text-[15px]">Core MSCI World</p>
                  <p className="text-xs text-zinc-500">iShares • Depot: € {etfValue.toLocaleString("de-DE")}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3 shrink-0">
                <div>
                  <p className="font-bold text-[15px]">€ {etfShare}</p>
                  <p className="text-xs text-green-500">+12,4% p.a.</p>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </div>
            </div>

            {/* Asset 2: Bitcoin */}
            {cryptoShare > 0 && (
              <div className="bg-[#0a0a0a] rounded-2xl p-4 flex items-center justify-between border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                    <span className="text-orange-500 font-bold text-xs">₿</span>
                  </div>
                  <div>
                    <p className="font-bold text-[15px]">Bitcoin</p>
                    <p className="text-xs text-zinc-500">Krypto • Wallet: € {cryptoValue.toLocaleString("de-DE")}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3 shrink-0">
                  <div>
                    <p className="font-bold text-[15px]">€ {cryptoShare}</p>
                    <p className="text-xs text-green-500">+45,2% p.a.</p>
                  </div>
                  <ChevronRight size={16} className="text-zinc-600" />
                </div>
              </div>
            )}
          </div>
          
          <button className="w-full bg-white text-black font-extrabold text-[15px] py-4 rounded-xl mt-4 transition-opacity hover:opacity-90 flex justify-center items-center gap-2 cursor-pointer">
            In Trade Republic öffnen <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}