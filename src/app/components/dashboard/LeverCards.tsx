import React from 'react';
import { Landmark, Briefcase, TrendingUp } from 'lucide-react';

interface LeverCardsProps {
  leverBavNetto: number;
  leverSavings: number;
}

export function LeverCards({ leverBavNetto, leverSavings }: LeverCardsProps) {
  const levers: { icon: React.ElementType; title: string; subtitle: string; gain: string }[] = [
    { icon: Landmark,   title: "VL-Sparen aktivieren",   subtitle: "Arbeitgeberzuschuss",          gain: "+40 €/mtl." },
    { icon: Briefcase,  title: "Betriebsrente nutzen",    subtitle: "Dein Arbeitgeber zahlt mit",   gain: `+${leverBavNetto} €/mtl.` },
    { icon: TrendingUp, title: "Sparrate erhöhen",        subtitle: "Privater Vermögensaufbau",     gain: `+${leverSavings} €/mtl.` },
  ];

  return (
    <div id="tutorial-dashboard-hebel" className="px-6 pt-2 pb-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Deine 3 größten Hebel</p>
      <div className="space-y-2">
        {levers.map(({ icon: Icon, title, subtitle, gain }) => (
          <div key={title} className="w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 bg-[#F4F4F5] rounded-lg flex items-center justify-center shrink-0 self-center">
              <Icon size={14} className="text-black" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-[13px] font-bold text-black leading-tight">{title}</p>
              <p className="text-[12px] text-gray-400 leading-tight mt-0.5">{subtitle}</p>
            </div>
            <p className="text-[13px] font-extrabold text-emerald-500 shrink-0 self-center">{gain}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
