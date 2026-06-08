import { useState } from "react";
import { AlertTriangle, TrendingDown, Plane, Home as HomeIcon, Baby, Plus, X, Activity } from "lucide-react";
import { Switch } from "../ui/switch";

export interface LifeEvent {
  id: string;
  age: number;
  type: 'sabbatical' | 'realestate' | 'child';
  label: string;
  description: string;
  cost: number;
}

export interface StressTests {
  bearMarket: boolean;
  highInflation: boolean;
  longevity: boolean;
}

interface SimulateViewProps {
  currentAge: number;
  retirementAge: number;
  lifeEvents: LifeEvent[];
  setLifeEvents: (events: LifeEvent[]) => void;
  stressTests: StressTests;
  setStressTests: (tests: StressTests) => void;
}

export function SimulateView({ currentAge, retirementAge, lifeEvents, setLifeEvents, stressTests, setStressTests }: SimulateViewProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const availableEvents = [
    { type: 'sabbatical', label: 'Sabbatical (Weltreise)', desc: '1 Jahr Auszeit. Sparrate pausiert, 15.000 € Kosten.', cost: 15000, icon: Plane, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { type: 'realestate', label: 'Immobilienkauf', desc: 'Eigenkapital-Einbringung für ein Haus.', cost: 50000, icon: HomeIcon, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { type: 'child', label: 'Elternzeit / Nachwuchs', desc: 'Erhöhte Ausgaben, reduzierte Arbeitszeit.', cost: 20000, icon: Baby, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
  ];

  const handleAddEvent = (type: any, label: string, desc: string, cost: number) => {
    const targetAge = Math.min(currentAge + 3, retirementAge - 1);
    if (lifeEvents.some(e => e.age === targetAge)) {
      alert("In diesem Lebensjahr ist bereits ein Ereignis geplant. Bitte verschiebe es zuerst.");
      return;
    }
    const newEvent: LifeEvent = { id: Math.random().toString(36).substring(7), age: targetAge, type, label, description: desc, cost };
    setLifeEvents([...lifeEvents, newEvent].sort((a, b) => a.age - b.age));
    setShowAddMenu(false);
  };

  const removeEvent = (id: string) => setLifeEvents(lifeEvents.filter(e => e.id !== id));

  return (
    <div className="bg-black min-h-screen text-white w-full pb-32">
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl px-6 py-6 border-b border-white/5">
        <h1 className="font-extrabold text-xl tracking-tight">Erweiterte Simulation</h1>
        <p className="text-xs text-zinc-500 mt-1">Stresstests & Lebensereignisse</p>
      </div>

      <div className="px-6 pt-8">
        <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest mb-4">Makro-Stresstests</h2>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Aktiviere Extrem-Szenarien, um zu sehen, wie widerstandsfähig dein aktueller Finanzplan im Dashboard ist.
        </p>
        
        <div className="space-y-3 mb-10">
          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <TrendingDown size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Bärenmarkt (-20%)</p>
                <p className="text-[11px] text-zinc-500">Crash kurz vor Renteneintritt</p>
              </div>
            </div>
            <Switch 
              checked={stressTests.bearMarket} 
              onCheckedChange={(c) => setStressTests({...stressTests, bearMarket: c})} 
              className="data-[state=checked]:bg-[#00e676]" 
            />
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Hohe Inflation (5%)</p>
                <p className="text-[11px] text-zinc-500">Kaufkraftverlust beschleunigt sich</p>
              </div>
            </div>
            <Switch 
              checked={stressTests.highInflation} 
              onCheckedChange={(c) => setStressTests({...stressTests, highInflation: c})} 
              className="data-[state=checked]:bg-[#00e676]" 
            />
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Activity size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Langlebigkeitsrisiko</p>
                <p className="text-[11px] text-zinc-500">Kapital muss bis Alter 98 reichen</p>
              </div>
            </div>
            <Switch 
              checked={stressTests.longevity} 
              onCheckedChange={(c) => setStressTests({...stressTests, longevity: c})} 
              className="data-[state=checked]:bg-[#00e676]" 
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest">Biografie & Events</h2>
          <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-8 h-8 rounded-full bg-[#00e676]/10 flex items-center justify-center text-[#00e676] hover:bg-[#00e676]/20 transition-colors">
            {showAddMenu ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {showAddMenu && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 mb-8 animate-in fade-in slide-in-from-top-2">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-3">Szenario wählen</p>
            <div className="space-y-2">
              {availableEvents.map((evt, idx) => {
                const Icon = evt.icon;
                return (
                  <div key={idx} onClick={() => handleAddEvent(evt.type, evt.label, evt.desc, evt.cost)} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={evt.color} />
                      <div>
                        <p className="text-sm font-bold text-white">{evt.label}</p>
                        <p className="text-[10px] text-zinc-500">{evt.desc}</p>
                      </div>
                    </div>
                    <Plus size={16} className="text-zinc-600" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative border-l border-white/10 ml-5 space-y-8 pb-8">
          {lifeEvents.length === 0 ? (
            <p className="text-xs text-zinc-600 italic pl-6">Noch keine Lebensereignisse geplant.</p>
          ) : (
            lifeEvents.map((event) => {
              const Icon = event.type === 'sabbatical' ? Plane : event.type === 'realestate' ? HomeIcon : Baby;
              const style = availableEvents.find(e => e.type === event.type);
              
              return (
                <div key={event.id} className="relative pl-6 animate-in fade-in">
                  <div className={`absolute -left-[17px] top-1 w-8 h-8 ${style?.bg} rounded-full flex items-center justify-center border ${style?.border}`}>
                    <Icon size={12} className={style?.color} />
                  </div>
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-xs text-zinc-500 font-bold">Alter {event.age}</p>
                    <button onClick={() => removeEvent(event.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><X size={14} /></button>
                  </div>
                  <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 group">
                    <p className="font-bold text-sm mb-1">{event.label}</p>
                    <p className="text-[11px] text-zinc-500 mb-3">{event.description}</p>
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Alter verschieben</span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setLifeEvents(lifeEvents.map(e => e.id === event.id ? {...e, age: Math.max(currentAge + 1, e.age - 1)} : e))} className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white">-</button>
                        <span className="text-sm font-bold w-4 text-center">{event.age}</span>
                        <button onClick={() => setLifeEvents(lifeEvents.map(e => e.id === event.id ? {...e, age: Math.min(retirementAge - 1, e.age + 1)} : e))} className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}