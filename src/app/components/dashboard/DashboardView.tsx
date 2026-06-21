import { useState } from 'react';
import { Bell, LogOut, HelpCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Asset, AssetBreakdown } from '../custom/AssetBreakdown';
import { RetirementRing } from './RetirementRing';
import { LeverCards } from './LeverCards';
import { useDashboardDerived } from './hooks/useDashboardDerived';

interface DashboardViewProps {
  userName: string;
  retirementAge: number;
  monthlyContribution: number;
  totalNetWorthAtRetirement: number;
  activeLifeExpectancy: number;
  realPurchasingPowerMonthly: number;
  targetPensionReal: number;
  additionalMonthlyPayoutNominal: number;
  capitalAtRetirement: number;
  inflationFactor: number;
  combinedMonthlyNominal: number;
  dynamicAssets: Asset[];
  avdPayoutNominal: number;
  isPositive: boolean;
  leverBavNetto: number;
  leverSavings: number;
  onBellClick: () => void;
  onHelpClick: () => void;
  onLogoutClick: () => void;
  onUpdateAsset: (id: string, payout: number, accumulated: number) => void;
  onOptimize: () => void;
}

export function DashboardView({
  userName,
  retirementAge,
  monthlyContribution,
  totalNetWorthAtRetirement,
  activeLifeExpectancy,
  realPurchasingPowerMonthly,
  targetPensionReal,
  additionalMonthlyPayoutNominal,
  capitalAtRetirement,
  inflationFactor,
  combinedMonthlyNominal,
  dynamicAssets,
  avdPayoutNominal,
  isPositive,
  leverBavNetto,
  leverSavings,
  onBellClick,
  onHelpClick,
  onLogoutClick,
  onUpdateAsset,
  onOptimize,
}: DashboardViewProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const { percentage, ringBadgeBg, segmentData, displayAssets, ringRadius, ringCircumference } =
    useDashboardDerived({
      realPurchasingPowerMonthly,
      targetPensionReal,
      additionalMonthlyPayoutNominal,
      capitalAtRetirement,
      inflationFactor,
      dynamicAssets,
      avdPayoutNominal,
    });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden">
            <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-[18px] tracking-tight text-black">FutureMe</span>
        </div>
        <div className="flex gap-4 text-gray-400">
          <Bell onClick={onBellClick} size={20} className="cursor-pointer hover:text-black transition-colors" strokeWidth={1.75} />
          <HelpCircle onClick={onHelpClick} size={20} className="cursor-pointer hover:text-black transition-colors" strokeWidth={1.75} />
          <LogOut onClick={onLogoutClick} size={20} className="cursor-pointer hover:text-red-500 transition-colors" strokeWidth={1.75} />
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pt-8 pb-2 text-center">
        <p className="text-[13px] text-gray-400 font-medium mb-1">Hallo, {userName}</p>
        <h2 className="text-2xl font-black text-black tracking-tight">Deine Rente mit {retirementAge}</h2>
        <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
          So viel Geld hast du im Alter jeden Monat zur Verfügung. <br className="hidden sm:block" />(Inflation ist bereits abgezogen)
        </p>
      </div>

      {/* Ring */}
      <RetirementRing
        segmentData={segmentData}
        ringRadius={ringRadius}
        ringCircumference={ringCircumference}
        realPurchasingPowerMonthly={realPurchasingPowerMonthly}
        targetPensionReal={targetPensionReal}
        hoveredSegment={hoveredSegment}
        onHover={setHoveredSegment}
      />

      {/* Badge */}
      <div className="flex justify-center pb-6">
        <div id="tutorial-dashboard-badge" className={`px-4 py-1.5 rounded-full text-[13px] font-bold flex items-center gap-1.5 border ${ringBadgeBg}`}>
          {isPositive ? <CheckCircle2 size={16} /> : <TrendingUp size={16} />}
          {isPositive && percentage > 100
            ? `Ziel erreicht · ${percentage}%`
            : `${percentage}% vom Ziel erreicht`}
        </div>
      </div>

      {/* Levers */}
      {!isPositive && <LeverCards leverBavNetto={leverBavNetto} leverSavings={leverSavings} />}

      {/* Stats row */}
      <div className="px-6 pb-6">
        <div className="flex justify-between gap-2 border-t border-gray-100 pt-5">
          {[
            { label: "Gesamtvermögen", value: `€ ${(totalNetWorthAtRetirement / 1_000_000).toFixed(2)}M` },
            { label: "Reicht bis Alter", value: `${activeLifeExpectancy}+` },
            { label: "Sparrate", value: `€ ${monthlyContribution}` },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mb-1">{stat.label}</p>
              <p className="text-[15px] font-extrabold text-black">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Asset breakdown */}
      <div id="tutorial-dashboard-assets">
        <AssetBreakdown assets={displayAssets} onUpdateAsset={onUpdateAsset} combinedMonthlyNominal={combinedMonthlyNominal} />
      </div>

      {/* CTA */}
      <div className="px-6 pt-6 pb-8">
        {isPositive ? (
          <button className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 font-extrabold text-[15px] py-4 rounded-xl cursor-default">
            Lücke geschlossen!
          </button>
        ) : (
          <button
            onClick={onOptimize}
            className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <img src="/traderepublic_logo.jpg" alt="" className="w-4 h-4 rounded-[3px] object-cover invert" />
            Mit Trade Republic schließen
          </button>
        )}
      </div>
    </div>
  );
}
