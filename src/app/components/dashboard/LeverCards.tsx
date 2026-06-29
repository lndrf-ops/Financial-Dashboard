import React from 'react';
import { Landmark, Briefcase, TrendingUp } from 'lucide-react';

const BAV_LEVERAGE = 1.9;

interface LeverCardsProps {
  leverBavNetto: number;
  leverSavings: number;
  currentGap: number;
  vlActive: boolean;
}

export function LeverCards({ leverBavNetto, leverSavings, currentGap, vlActive }: LeverCardsProps) {
  const vlGain = Math.min(40, currentGap);

  const candidates: { icon: React.ElementType; title: string; subtitle: string; gain: number }[] = [
    // VL: show as activation opportunity when not yet active and gap exists
    ...(!vlActive && vlGain > 0 ? [{ icon: Landmark,   title: "VL-Sparen aktivieren", subtitle: "Kostenloser Arbeitgeberzuschuss", gain: vlGain }] : []),
    // bAV: show brutto investment as gain; subtitle shows net cost for clarity
    ...(leverBavNetto > 0      ? [{ icon: Briefcase,  title: "Betriebsrente nutzen",  subtitle: `Nur ${leverBavNetto} € netto Eigenleistung`, gain: Math.round(leverBavNetto * BAV_LEVERAGE) }] : []),
    // Private savings: always relevant when there's remaining gap
    ...(leverSavings > 0       ? [{ icon: TrendingUp, title: "Sparrate erhöhen",       subtitle: "Privater Vermögensaufbau",              gain: leverSavings }] : []),
  ].sort((a, b) => b.gain - a.gain);

  if (candidates.length === 0) return null;

  return (
    <div id="tutorial-dashboard-hebel" className="px-6 pt-2 pb-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
        {candidates.length === 1 ? 'Dein größter Hebel' : `Deine ${candidates.length} größten Hebel`}
      </p>
      <div className="space-y-2">
        {candidates.map(({ icon: Icon, title, subtitle, gain }) => (
          <div key={title} className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 bg-[#F4F4F5] rounded-lg flex items-center justify-center shrink-0 self-center">
              <Icon size={14} className="text-black" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[13px] font-bold text-black leading-tight">{title}</p>
              <p className="text-[12px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>
            </div>
            <p className="text-[13px] font-extrabold text-emerald-500 shrink-0 self-center">+{gain} €/mtl.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
