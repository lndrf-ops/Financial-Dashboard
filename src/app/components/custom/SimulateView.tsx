import { useState } from "react";
import { AlertTriangle, TrendingDown, Plane, Home as HomeIcon, Baby, Plus, X, Activity, Wallet, Lock, HelpCircle } from "lucide-react";

import { Switch } from "../ui/switch";

export interface LifeEvent {
  id: string; age: number; type: 'sabbatical' | 'realestate' | 'child'; label: string; description: string; cost: number;
}

export interface StressTests { bearMarket: boolean; highInflation: boolean; longevity: boolean; }

interface SimulateViewProps {
  currentAge: number; retirementAge: number; lifeEvents: LifeEvent[];
  setLifeEvents: (events: LifeEvent[]) => void; stressTests: StressTests; setStressTests: (tests: StressTests) => void;
  avdActive: boolean; setAvdActive: (v: boolean) => void;
  avdMonthlyContribution: number; setAvdMonthlyContribution: (v: number) => void;
  onHelp?: () => void;
}

export function SimulateView({ currentAge, retirementAge, lifeEvents, setLifeEvents, stressTests, setStressTests, avdActive, setAvdActive, avdMonthlyContribution, setAvdMonthlyContribution, onHelp }: SimulateViewProps) {
  const AVD_AVAILABLE = new Date() >= new Date('2027-01-01');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const availableEvents = [
    { type: 'sabbatical', label: 'Sabbatical (Weltreise)', desc: '1 Jahr Auszeit. Sparrate pausiert, 15.000 € Kosten.', cost: 15000, icon: Plane, color: 'text-black', bg: 'bg-[#F4F4F5]', border: 'border-gray-200' },
    { type: 'realestate', label: 'Immobilienkauf', desc: 'Eigenkapital-Einbringung für ein Haus.', cost: 50000, icon: HomeIcon, color: 'text-black', bg: 'bg-[#F4F4F5]', border: 'border-gray-200' },
    { type: 'child', label: 'Elternzeit / Nachwuchs', desc: 'Erhöhte Ausgaben, reduzierte Arbeitszeit.', cost: 20000, icon: Baby, color: 'text-black', bg: 'bg-[#F4F4F5]', border: 'border-gray-200' }
  ];

  const handleAddEvent = (type: any, label: string, desc: string, cost: number) => {
    let targetAge = Math.min(currentAge + 3, retirementAge - 1);
    while (lifeEvents.some(e => e.age === targetAge) && targetAge < retirementAge - 1) {
      targetAge++;
    }
    const newEvent: LifeEvent = { id: Math.random().toString(36).substring(7), age: targetAge, type, label, description: desc, cost };
    setLifeEvents([...lifeEvents, newEvent].sort((a, b) => a.age - b.age));
    setShowAddMenu(false);
  };

  const removeEvent = (id: string) => setLifeEvents(lifeEvents.filter(e => e.id !== id));

  return (
    <div className="bg-white min-h-screen text-black w-full" style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom, 8rem))' }}>
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-xl tracking-tight text-black">Erweiterte Simulation</h1>
          <p className="text-xs text-gray-500 mt-1">Stresstests & Lebensereignisse</p>
        </div>
        <button onClick={onHelp} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
          <HelpCircle size={20} strokeWidth={1.75} />
        </button>
      </div>

      <div className="px-6 pt-8">
        <h2 className="text-[13px] text-black font-semibold uppercase tracking-widest mb-4">Szenarien & Stresstests</h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Aktiviere Extrem-Szenarien, um zu sehen, wie widerstandsfähig dein aktueller Finanzplan im Dashboard ist.
        </p>

        <div id="tutorial-simulate-stresstests" className="space-y-3 mb-10">
          <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <TrendingDown size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-black">Börsencrash (-20%)</p>
                <p className="text-[11px] text-gray-500">Crash kurz vor Renteneintritt</p>
              </div>
            </div>
            <Switch checked={stressTests.bearMarket} onCheckedChange={(c) => setStressTests({ ...stressTests, bearMarket: c })} className="data-[state=checked]:bg-black" />
          </div>

          <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-black">Hohe Inflation (5%)</p>
                <p className="text-[11px] text-gray-500">Kaufkraftverlust beschleunigt sich</p>
              </div>
            </div>
            <Switch checked={stressTests.highInflation} onCheckedChange={(c) => setStressTests({ ...stressTests, highInflation: c })} className="data-[state=checked]:bg-black" />
          </div>

          <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F4F4F5] border border-gray-200 flex items-center justify-center shrink-0">
                <Activity size={18} className="text-black" />
              </div>
              <div>
                <p className="font-bold text-[14px] text-black">Langes Leben einplanen</p>
                <p className="text-[11px] text-gray-500">Kapital reicht bis Alter 98</p>
              </div>
            </div>
            <Switch checked={stressTests.longevity} onCheckedChange={(c) => setStressTests({ ...stressTests, longevity: c })} className="data-[state=checked]:bg-black" />
          </div>
        </div>

        {/* ── Altersvorsorgedepot 2027 ─────────────────────────────────── */}
        <div id="tutorial-simulate-avd" className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <h2 className={`text-[13px] font-semibold uppercase tracking-widest ${AVD_AVAILABLE ? 'text-black' : 'text-gray-400'}`}>Altersvorsorgedepot 2027</h2>
            {AVD_AVAILABLE
              ? <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-black px-2 py-0.5 rounded-full">Neu</span>
              : <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={8} />Ab Jan. 2027</span>
            }
          </div>
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">
            {AVD_AVAILABLE
              ? 'Das staatlich geförderte Altersvorsorgedepot ersetzt die Riester-Rente. Der Staat zahlt bis zu 200 € Grundzulage pro Jahr direkt in dein Depot.'
              : 'Ab Januar 2027 ersetzt das staatlich geförderte Altersvorsorgedepot die Riester-Rente. Der Staat wird bis zu 200 € Grundzulage pro Jahr direkt in dein Depot einzahlen — hier siehst du schon mal, wie es sich auf deine Rente auswirken würde.'}
          </p>

          <div className={`rounded-2xl p-4 border flex items-center justify-between mb-3 ${AVD_AVAILABLE ? 'bg-[#F9FAFB] border-gray-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${AVD_AVAILABLE ? 'bg-black' : 'bg-gray-300'}`}>
                {AVD_AVAILABLE ? <Wallet size={18} className="text-white" /> : <Lock size={18} className="text-white" />}
              </div>
              <div>
                <p className={`font-bold text-[14px] ${AVD_AVAILABLE ? 'text-black' : 'text-gray-400'}`}>
                  {AVD_AVAILABLE ? 'Depot aktivieren' : 'Noch nicht verfügbar'}
                </p>
                <p className="text-[11px] text-gray-500">+ 200 € staatl. Zulage / Jahr</p>
              </div>
            </div>
            <Switch
              checked={avdActive}
              onCheckedChange={AVD_AVAILABLE ? setAvdActive : undefined}
              disabled={!AVD_AVAILABLE}
              className="data-[state=checked]:bg-black disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {!AVD_AVAILABLE && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-3">
              <Lock size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Diese Simulation zeigt dir bereits jetzt, wie das Altersvorsorgedepot deine Rente verbessern würde. Aktivieren kannst du es ab dem <strong>1. Januar 2027</strong>.
              </p>
            </div>
          )}

          {avdActive && AVD_AVAILABLE && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] font-semibold text-black">Monatlicher Eigenbeitrag</span>
                <span className="text-[13px] font-black text-black">{avdMonthlyContribution} €</span>
              </div>
              <input
                type="range" min={25} max={200} step={25}
                value={avdMonthlyContribution}
                onChange={e => setAvdMonthlyContribution(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 mb-3">
                <span>25 €</span><span>200 €</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">Effektiv investiert inkl. Zulage</span>
                <span className="text-[12px] font-bold text-black">= {avdMonthlyContribution + 17} €/Monat</span>
              </div>
            </div>
          )}
        </div>

        <div id="tutorial-simulate-events">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] text-black font-semibold uppercase tracking-widest">Biografie & Events</h2>
          <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-8 h-8 rounded-full bg-[#F4F4F5] border border-gray-200 flex items-center justify-center text-black hover:bg-gray-200 transition-colors">
            {showAddMenu ? <X size={16} /> : <Plus size={16} />}
          </button>
        </div>

        {showAddMenu && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Szenario wählen</p>
            <div className="space-y-2">
              {availableEvents.map((evt, idx) => {
                const Icon = evt.icon;
                return (
                  <div key={idx} onClick={() => handleAddEvent(evt.type, evt.label, evt.desc, evt.cost)} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F9FAFB] cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-black" />
                      <div>
                        <p className="text-sm font-bold text-black">{evt.label}</p>
                        <p className="text-[10px] text-gray-500">{evt.desc}</p>
                      </div>
                    </div>
                    <Plus size={16} className="text-gray-400" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative border-l border-gray-200 ml-5 space-y-8 pb-8">
          {lifeEvents.length === 0 ? (
            <div className="ml-6 bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <p className="text-[13px] text-gray-500">Noch keine Ereignisse geplant.</p>
              <button
                onClick={() => setShowAddMenu(true)}
                className="flex items-center gap-1.5 text-[12px] font-bold text-black border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <Plus size={13} />Hinzufügen
              </button>
            </div>
          ) : (
            lifeEvents.map((event) => {
              const Icon = event.type === 'sabbatical' ? Plane : event.type === 'realestate' ? HomeIcon : Baby;

              return (
                <div key={event.id} className="relative pl-6 animate-in fade-in">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 bg-[#F4F4F5] rounded-full flex items-center justify-center border border-gray-200">
                    <Icon size={12} className="text-black" />
                  </div>
                  <div className="flex justify-between items-end mb-1">
                    <p className="text-xs text-gray-500 font-bold">Alter {event.age}</p>
                    <button onClick={() => removeEvent(event.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="bg-[#F9FAFB] p-4 rounded-xl border border-gray-200">
                    <p className="font-bold text-sm text-black mb-1">{event.label}</p>
                    <p className="text-[11px] text-gray-500 mb-3">{event.description}</p>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Alter verschieben</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLifeEvents(lifeEvents.map(e => e.id === event.id ? { ...e, age: Math.max(currentAge + 1, e.age - 1) } : e))}
                          className="w-10 h-10 rounded-lg bg-[#F4F4F5] border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
                        >−</button>
                        <span className="text-sm font-bold w-6 text-center text-black">{event.age}</span>
                        <button
                          onClick={() => setLifeEvents(lifeEvents.map(e => e.id === event.id ? { ...e, age: Math.min(retirementAge - 1, e.age + 1) } : e))}
                          className="w-10 h-10 rounded-lg bg-[#F4F4F5] border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>{/* tutorial-simulate-events */}
      </div>
    </div>
  );
}
