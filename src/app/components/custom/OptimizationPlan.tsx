import { useState } from "react";
import { ArrowLeft, Zap, CalendarClock, PieChart, ChevronDown, Bot, CheckCircle2, AlertTriangle, Briefcase, Landmark } from "lucide-react";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface OptimizationPlanProps {
  onBack: () => void;
  projectedMonthly: number;
  targetPension: number;
  diff: number;
  
  monthlyContribution: number;
  setMonthlyContribution: (val: number) => void;
  expectedReturn: number;
  setExpectedReturn: (val: number) => void;
  retirementAge: number;
  setRetirementAge: (val: number) => void;
}

export function OptimizationPlan({ 
  onBack, 
  diff,
  monthlyContribution,
  setMonthlyContribution,
  expectedReturn,
  setExpectedReturn,
  retirementAge,
  setRetirementAge
}: OptimizationPlanProps) {
  
  const isPositive = diff >= 0;
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [appliedStrategy, setAppliedStrategy] = useState<string | null>(null);

  // Lokale States für die neuen Arbeitgeber-Hebel (als interaktive Demos)
  const [vlActive, setVlActive] = useState(false);
  const [bavNettoVerzicht, setBavNettoVerzicht] = useState([0]);

  const toggleCard = (id: string) => setActiveCard(activeCard === id ? null : id);

  const gapMagnitude = Math.abs(diff);
  const suggestedSavings = Math.max(25, Math.ceil((gapMagnitude * 0.4) / 25) * 25); 

  const applyStrategy = (type: 'save' | 'invest' | 'time') => {
    setAppliedStrategy(type);
    if (type === 'save') setMonthlyContribution(monthlyContribution + suggestedSavings);
    else if (type === 'invest') setExpectedReturn(8.5); 
    else if (type === 'time') setRetirementAge(retirementAge + 2);
  };

  // Simulierter Brutto-Hebel für bAV (Faktor ~2.1 durch Steuern, Sozialabgaben & 15% AG-Zuschuss)
  const bavBruttoInvest = Math.round(bavNettoVerzicht[0] * 2.1);

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans overflow-x-hidden pb-10">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight">Echtzeit-Optimierung</span>
      </div>

      {/* Live Status Board */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b]">Dein Live-Status</p>
          {isPositive && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded">
              <CheckCircle2 size={12} /> Ziel erreicht
            </span>
          )}
        </div>
        
        <div className="text-4xl font-black tracking-tight leading-none text-white transition-all mb-6">
          {isPositive ? "Auf Kurs" : "Handlungsbedarf"}
        </div>
        
        <div className={`p-4 rounded-xl border mb-2 transition-colors ${isPositive ? 'bg-[#00e676]/10 border-[#00e676]/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-white">Lücke zur Wunschrente:</span>
            <span className={`text-lg font-black ${isPositive ? 'text-[#00e676]' : 'text-red-500'}`}>
              {isPositive ? "+" : ""}€ {Math.abs(diff).toLocaleString("de-DE")}
            </span>
          </div>
        </div>
      </div>

      {/* KI Insights (Geführte Analyse) */}
      {!isPositive && (
        <div className="px-6 mb-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-[#00e676]/5 border border-[#00e676]/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00e676]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="flex items-center gap-2 mb-3">
              <Bot size={18} className="text-[#00e676]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00e676]">KI-Analyse</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              Keine Sorge, eine Lücke von <strong>€ {gapMagnitude.toLocaleString("de-DE")}</strong> lässt sich schließen. Hier sind 3 einfache Strategien, um dein Ziel zu erreichen:
            </p>
            <div className="space-y-2">
              <button onClick={() => applyStrategy('save')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${appliedStrategy === 'save' ? 'bg-[#00e676] border-[#00e676] text-black' : 'bg-black border-white/10 hover:border-[#00e676]/50 text-white'}`}>
                <div className="flex items-center gap-3">
                  <Zap size={16} className={appliedStrategy === 'save' ? 'text-black' : 'text-[#00e676]'} />
                  <span className="text-[13px] font-bold">Der Spar-Fokus</span>
                </div>
                <span className={`text-[11px] font-medium ${appliedStrategy === 'save' ? 'text-black/70' : 'text-zinc-500'}`}>+ {suggestedSavings} € mtl. anlegen</span>
              </button>
              <button onClick={() => applyStrategy('invest')} className={`w-full flex flex-col p-3 rounded-xl border transition-all cursor-pointer ${appliedStrategy === 'invest' ? 'bg-[#00e676] border-[#00e676] text-black' : 'bg-black border-white/10 hover:border-[#00e676]/50 text-white'}`}>
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PieChart size={16} className={appliedStrategy === 'invest' ? 'text-black' : 'text-blue-500'} />
                    <span className="text-[13px] font-bold">Chancen & Risiko erhöhen</span>
                  </div>
                  <span className={`text-[11px] font-medium ${appliedStrategy === 'invest' ? 'text-black/70' : 'text-zinc-500'}`}>Auf 8.5% p.a. anpassen</span>
                </div>
              </button>
              <button onClick={() => applyStrategy('time')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${appliedStrategy === 'time' ? 'bg-[#00e676] border-[#00e676] text-black' : 'bg-black border-white/10 hover:border-[#00e676]/50 text-white'}`}>
                <div className="flex items-center gap-3">
                  <CalendarClock size={16} className={appliedStrategy === 'time' ? 'text-black' : 'text-purple-500'} />
                  <span className="text-[13px] font-bold">Der Zeit-Fokus</span>
                </div>
                <span className={`text-[11px] font-medium ${appliedStrategy === 'time' ? 'text-black/70' : 'text-zinc-500'}`}>2 Jahre später in Rente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arbeitgeber-Hebel (NEU) */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">
            Die Arbeitgeber-Hebel
          </h2>
        </div>
        
        <div className="space-y-4">
          {/* Action: VL Sparen */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <Landmark size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-[14px]">VL-Sparen aktivieren</p>
                <p className="text-[11px] text-zinc-500">Kostenloses Geld vom Chef (Trade Republic)</p>
              </div>
            </div>
            <Switch checked={vlActive} onCheckedChange={(c) => {
              setVlActive(c);
              setMonthlyContribution(monthlyContribution + (c ? 40 : -40));
            }} className="data-[state=checked]:bg-[#00e676]" />
          </div>

          {/* Action: bAV / Entgeltumwandlung */}
          <div className={`bg-[#0a0a0a] border ${activeCard === 'bav' ? 'border-zinc-500' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}>
            <div onClick={() => toggleCard('bav')} className="p-4 cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Briefcase size={16} className="text-blue-500" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Betriebliche Altersvorsorge</h3>
                  <p className="text-[11px] text-zinc-500">Brutto-Netto-Magie nutzen</p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-zinc-600 transition-transform ${activeCard === 'bav' ? 'rotate-180 text-white' : ''}`} />
            </div>
            
            {activeCard === 'bav' && (
              <div className="px-4 pb-5 pt-2 animate-in fade-in slide-in-from-top-2">
                <div className="bg-white/5 rounded-xl p-4 mb-5 flex items-center justify-between border border-white/10">
                   <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Dein Netto-Verzicht</p>
                      <p className="text-xl font-bold text-red-400">- € {bavNettoVerzicht[0]}</p>
                   </div>
                   <Zap size={20} className="text-zinc-600" />
                   <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Reales Brutto-Invest</p>
                      <p className="text-xl font-bold text-[#00e676]">+ € {bavBruttoInvest}</p>
                   </div>
                </div>
                
                <Slider value={bavNettoVerzicht} max={250} min={0} step={10} onValueChange={setBavNettoVerzicht} className="w-full" />
                <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">
                  Über die Entgeltumwandlung sparst du Steuern und Sozialabgaben. Dein Arbeitgeber legt gesetzlich nochmal mindestens 15% oben drauf.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manueller Expertenmodus */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">
            Individuelle Parameter
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className={`bg-[#0a0a0a] border ${activeCard === 'etf' ? 'border-zinc-500' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}>
            <div onClick={() => toggleCard('etf')} className="p-4 cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Zap size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Sparrate (Netto)</h3>
                  <p className="text-[11px] text-zinc-500">Aktuell: € {monthlyContribution}</p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-zinc-600 transition-transform ${activeCard === 'etf' ? 'rotate-180 text-white' : ''}`} />
            </div>
            {activeCard === 'etf' && (
              <div className="px-4 pb-5 pt-2 animate-in fade-in slide-in-from-top-2">
                <Slider value={[monthlyContribution]} max={2000} min={0} step={50} onValueChange={(v) => setMonthlyContribution(v[0])} className="w-full" />
              </div>
            )}
          </div>

          <div className={`bg-[#0a0a0a] border ${activeCard === 'age' ? 'border-zinc-500' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}>
            <div onClick={() => toggleCard('age')} className="p-4 cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <CalendarClock size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Renteneintritt</h3>
                  <p className="text-[11px] text-zinc-500">Aktuell: Alter {retirementAge}</p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-zinc-600 transition-transform ${activeCard === 'age' ? 'rotate-180 text-white' : ''}`} />
            </div>
            {activeCard === 'age' && (
              <div className="px-4 pb-5 pt-2 animate-in fade-in slide-in-from-top-2">
                <Slider value={[retirementAge]} max={72} min={60} step={1} onValueChange={(v) => setRetirementAge(v[0])} className="w-full" />
              </div>
            )}
          </div>

          <div className={`bg-[#0a0a0a] border ${activeCard === 'risk' ? 'border-zinc-500' : 'border-white/5'} rounded-2xl overflow-hidden transition-all duration-300`}>
            <div onClick={() => toggleCard('risk')} className="p-4 cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <PieChart size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Renditeerwartung</h3>
                  <p className="text-[11px] text-zinc-500">Aktuell: {expectedReturn.toFixed(1)}% p.a.</p>
                </div>
              </div>
              <ChevronDown size={18} className={`text-zinc-600 transition-transform ${activeCard === 'risk' ? 'rotate-180 text-white' : ''}`} />
            </div>
            {activeCard === 'risk' && (
              <div className="px-4 pb-5 pt-2 animate-in fade-in slide-in-from-top-2">
                <Slider value={[expectedReturn]} max={12.0} min={2.0} step={0.1} onValueChange={(v) => setExpectedReturn(v[0])} className="w-full" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={onBack}
            className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-2"
          >
            Fertig & Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
}