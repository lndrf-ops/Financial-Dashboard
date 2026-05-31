import { AlertTriangle, Calendar, TrendingDown, Plane, Home as HomeIcon } from "lucide-react";
import { Switch } from "../ui/switch";

export function SimulateView() {
  return (
    <div className="bg-black min-h-screen text-white w-full pb-32">
      
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl px-6 py-6 border-b border-white/5">
        <h1 className="font-extrabold text-xl tracking-tight">Erweiterte Simulation</h1>
        <p className="text-xs text-zinc-500 mt-1">Stresstests & Lebensereignisse</p>
      </div>

      <div className="px-6 pt-8">
        <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest mb-4">
          Makro-Stresstests
        </h2>
        
        <div className="space-y-3 mb-10">
          {/* Stresstest 1 */}
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
            <Switch className="data-[state=checked]:bg-[#00e676]" />
          </div>

          {/* Stresstest 2 */}
          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-[14px]">Hohe Inflation (5%)</p>
                <p className="text-[11px] text-zinc-500">Anhaltende Entwertung für 10 Jahre</p>
              </div>
            </div>
            <Switch className="data-[state=checked]:bg-[#00e676]" />
          </div>
        </div>

        <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest mb-4">
          Biografie & Events
        </h2>

        {/* Timeline Mockup */}
        <div className="relative border-l border-white/10 ml-5 space-y-8 pb-8">
          
          <div className="relative pl-6">
            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
              <Plane size={12} className="text-blue-500" />
            </div>
            <p className="text-xs text-zinc-500 font-bold mb-1">Alter 32</p>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
              <p className="font-bold text-sm mb-1">Sabbatical (6 Monate)</p>
              <p className="text-[11px] text-zinc-500">ETF-Sparrate wird pausiert. Entnahme von 10.000 € aus dem Tagesgeld.</p>
            </div>
          </div>

          <div className="relative pl-6">
            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
              <HomeIcon size={12} className="text-purple-500" />
            </div>
            <p className="text-xs text-zinc-500 font-bold mb-1">Alter 40</p>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-white/5 opacity-50 border-dashed">
              <p className="font-bold text-sm mb-1 text-zinc-400">+ Ereignis hinzufügen</p>
              <p className="text-[11px] text-zinc-600">Z.B. Immobilienkauf oder Nachwuchs</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}