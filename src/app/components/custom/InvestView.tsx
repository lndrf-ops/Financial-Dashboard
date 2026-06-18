import { useMemo, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { Asset } from "./AssetBreakdown";

interface InvestViewProps {
  monthlyContribution: number;
  assets: Asset[];
}

export function InvestView({ monthlyContribution, assets }: InvestViewProps) {
  const [showTRModal, setShowTRModal] = useState(false);
  const hasCrypto = assets.some(a => a.id === "crypto" && a.accumulatedValue > 0);

  const etfShare = hasCrypto ? Math.round(monthlyContribution * 0.8) : monthlyContribution;
  const cryptoShare = hasCrypto ? monthlyContribution - etfShare : 0;

  const etfValue = assets.find(a => a.id === "etf")?.accumulatedValue || 0;
  const cryptoValue = assets.find(a => a.id === "crypto")?.accumulatedValue || 0;

  const projectionData = useMemo(() => {
    const data = [];
    let currentETF = etfValue;
    let currentCrypto = cryptoValue;

    for (let year = 0; year <= 10; year++) {
      data.push({
        year: `Jahr ${year}`,
        wert: Math.round(currentETF + currentCrypto)
      });
      currentETF = (currentETF + etfShare * 12) * 1.07;
      currentCrypto = (currentCrypto + cryptoShare * 12) * 1.15;
    }
    return data;
  }, [etfValue, cryptoValue, etfShare, cryptoShare]);

  return (
    <div className="w-full">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-gray-100">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
          Ausführung durch
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-black text-[10px]">TR</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-black">Trade Republic</span>
        </div>
      </div>

      <div className="px-6 pt-10 pb-6">
        <p className="text-[13px] text-gray-500 font-medium mb-1">Dein monatlicher Sparplan</p>
        <h1 className="text-5xl font-black tracking-tight text-black mb-8">
          € {monthlyContribution.toLocaleString("de-DE")}
        </h1>

        <div className="h-48 w-full mb-8 relative flex flex-col justify-end border border-gray-200 rounded-2xl bg-[#F9FAFB] overflow-hidden">
          <div className="absolute top-4 left-4 z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">10-Jahres Vorschau</p>
            <p className="text-sm font-extrabold text-black">
              ~ € {projectionData[projectionData.length - 1]?.wert.toLocaleString("de-DE")}
            </p>
          </div>

          <div className="h-32 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="investGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 text-black text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          € {payload[0].value?.toLocaleString("de-DE")}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="wert"
                  stroke="#000000"
                  strokeWidth={2}
                  fill="url(#investGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-black mb-4">Deine Ausführung</h2>

            <div className="bg-[#F9FAFB] rounded-2xl p-4 flex items-center justify-between mb-3 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center border border-gray-200 shrink-0">
                  <span className="text-black font-bold text-xs">iS</span>
                </div>
                <div>
                  <p className="font-bold text-[15px] text-black">Core MSCI World</p>
                  <p className="text-xs text-gray-500">iShares · Depot: € {etfValue.toLocaleString("de-DE")}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3 shrink-0">
                <div>
                  <p className="font-bold text-[15px] text-black">€ {etfShare}</p>
                  <p className="text-xs text-emerald-600">≈ 7% p.a.</p>
                </div>
                <ChevronRight size={16} className="text-gray-300" />
              </div>
            </div>

            {cryptoShare > 0 && (
              <div className="bg-[#F9FAFB] rounded-2xl p-4 flex items-center justify-between border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center border border-gray-200 shrink-0">
                    <span className="text-black font-bold text-xs">₿</span>
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-black">Bitcoin</p>
                    <p className="text-xs text-gray-500">Krypto · Wallet: € {cryptoValue.toLocaleString("de-DE")}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3 shrink-0">
                  <div>
                    <p className="font-bold text-[15px] text-black">€ {cryptoShare}</p>
                    <p className="text-xs text-emerald-600">≈ 15% p.a. (hist.)</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setShowTRModal(true)} className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl mt-4 transition-colors flex justify-center items-center gap-2 cursor-pointer">
            In Trade Republic öffnen <ArrowRight size={18} />
          </button>

          {showTRModal && (
            <div className="fixed inset-0 z-[200] flex items-end justify-center animate-in fade-in duration-200" onClick={() => setShowTRModal(false)}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative bg-white rounded-t-3xl px-6 pt-7 pb-10 w-full max-w-[430px] animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-6" />
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center mb-4">
                  <ArrowRight size={18} className="text-white" />
                </div>
                <h3 className="text-[20px] font-black text-black mb-2">Weiterleitung zur TR App</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
                  In der finalen App öffnet sich hier dein Trade Republic Depot — der Sparplan wird automatisch mit deinen Einstellungen vorausgefüllt.
                </p>
                <button onClick={() => setShowTRModal(false)} className="w-full bg-black text-white font-extrabold text-[15px] py-4 rounded-xl cursor-pointer">
                  Verstanden
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
