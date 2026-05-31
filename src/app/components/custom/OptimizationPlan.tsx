import { ArrowLeft, Zap, ShieldCheck, PieChart, ArrowRight } from "lucide-react";

interface OptimizationPlanProps {
  onBack: () => void;
  projectedMonthly: number;
  targetPension: number;
  diff: number;
  
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

  const handleBoostETF = () => {
    setMonthlyContribution(monthlyContribution + 50); 
    onBack(); 
  };

  const handleRebalance = () => {
    setExpectedReturn(7.5); 
    onBack();
  };

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight">Smarter Aktionsplan</span>
      </div>

      <div className="px-6 pt-8 pb-6">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-2">
          Dein Optimierungsstatus
        </p>
        <div className="flex items-end gap-3 mb-6">
          <div className="text-4xl font-black tracking-tight leading-none text-white">
            {isPositive ? "Auf Kurs" : "Handlungsbedarf"}
          </div>
        </div>
        <p className="text-[13px] text-[#9a9a9a] leading-relaxed">
          {isPositive 
            ? `Hervorragend! Du wirst dein Ziel von ${targetPension.toLocaleString("de-DE")} € voraussichtlich um ${diff.toLocaleString("de-DE")} € übertreffen. Hier sind Wege, deinen Überschuss zu optimieren oder früher in Rente zu gehen.`
            : `Dir fehlen noch ${Math.abs(diff).toLocaleString("de-DE")} €, um deine monatliche Wunschrente von ${targetPension.toLocaleString("de-DE")} € zu erreichen. Nutze diese datengetriebenen Empfehlungen, um die Lücke zu schließen.`}
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
              <h3 className="text-[15px] font-bold text-white mb-1">ETF-Sparrate erhöhen</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Eine Erhöhung deiner monatlichen Sparrate um nur <span className="text-white font-semibold">50 €</span> bringt dir durch den Zinseszinseffekt ca. <span className="text-[#00e676] font-bold">180 € mehr</span> monatliche Auszahlung in der Rente.
              </p>
              <button 
                onClick={handleBoostETF}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#00e676] group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Aktion anwenden <ArrowRight size={14} strokeWidth={2.5} />
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
              <h3 className="text-[15px] font-bold text-white mb-1">Portfolio-Risiko anpassen</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Angesichts deiner verbleibenden Ansparzeit ist dein Risikoprofil aktuell zu konservativ. Schichte 15 % von Anleihen in globale Aktien um, um eine <span className="text-white font-semibold">erwartete Rendite von 7,5 %</span> zu erreichen.
              </p>
              <button 
                onClick={handleRebalance}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Allokation prüfen <ArrowRight size={14} strokeWidth={2.5} />
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
              <h3 className="text-[15px] font-bold text-white mb-1">Freiwillige DRV-Zahlungen</h3>
              <p className="text-[12px] text-[#6b6b6b] mb-4 leading-relaxed">
                Da du planst, regulär in Rente zu gehen, kannst du ab Alter 50 freiwillige, steuerlich absetzbare Einzahlungen in die gesetzliche Rente leisten, um deine Basisrente zu maximieren.
              </p>
              <button 
                onClick={() => alert("Dieses Modul würde weiterführende Informationen zu freiwilligen Zahlungen an die DRV öffnen.")}
                className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform cursor-pointer"
              >
                Mehr erfahren <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}