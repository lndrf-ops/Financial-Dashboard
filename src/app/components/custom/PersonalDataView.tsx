import { ArrowLeft, CheckCircle2, User, Landmark, Briefcase } from "lucide-react";
import { useState } from "react";
import { Switch } from "../ui/switch";

interface PersonalDataViewProps { onBack: () => void; }

export function PersonalDataView({ onBack }: PersonalDataViewProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 1200);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 max-w-[430px] mx-auto font-sans pb-20">
      <div className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"><ArrowLeft size={20} className="text-white" /></button>
        <span className="font-extrabold text-[17px] tracking-tight text-white">Persönliche Daten</span>
      </div>

      <div className="px-6 pt-6 space-y-8">
        <p className="text-xs text-slate-400 leading-relaxed">Diese Parameter werden genutzt, um deine Netto-Steuerlast in der Entnahmephase präziser zu berechnen.</p>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-indigo-400" />
            <h2 className="text-[13px] text-indigo-400 font-semibold uppercase tracking-widest">Stammdaten</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Vorname</label>
              <input type="text" defaultValue="John" className="w-full bg-transparent text-sm text-white focus:outline-none" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Nachname</label>
              <input type="text" defaultValue="Doe" className="w-full bg-transparent text-sm text-white focus:outline-none" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Geburtsdatum</label>
              <input type="date" defaultValue="1995-06-15" className="w-full bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={16} className="text-indigo-400" />
            <h2 className="text-[13px] text-indigo-400 font-semibold uppercase tracking-widest">Steuer & Abgaben</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Steuerklasse</label>
              <select className="bg-transparent text-sm text-white focus:outline-none cursor-pointer w-full">
                <option value="1" className="bg-slate-800">Klasse I (Ledig)</option>
                <option value="2" className="bg-slate-800">Klasse II (Alleinerziehend)</option>
                <option value="3" className="bg-slate-800">Klasse III (Verheiratet, Mehrverdiener)</option>
                <option value="4" className="bg-slate-800">Klasse IV (Verheiratet, Standard)</option>
                <option value="5" className="bg-slate-800">Klasse V (Verheiratet, Geringverdiener)</option>
                <option value="6" className="bg-slate-800">Klasse VI (Zweitjob)</option>
              </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Bundesland</label>
              <select defaultValue="Sachsen" className="bg-transparent text-sm text-white focus:outline-none cursor-pointer w-full">
                <option value="Baden-Württemberg" className="bg-slate-800">Baden-Württemberg</option>
                <option value="Bayern" className="bg-slate-800">Bayern</option>
                <option value="Berlin" className="bg-slate-800">Berlin</option>
                <option value="Hessen" className="bg-slate-800">Hessen</option>
                <option value="Sachsen" className="bg-slate-800">Sachsen</option>
                <option value="NRW" className="bg-slate-800">Nordrhein-Westfalen</option>
              </select>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Kirchensteuer</p>
                <p className="text-[11px] text-slate-500">8% bzw. 9% je nach Bundesland</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-indigo-500" />
            </div>
          </div>
        </section>

        <button onClick={handleSave} className={`w-full font-extrabold text-[15px] py-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer ${saved ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-500 hover:bg-indigo-400 text-white'}`}>
          {saved ? <><CheckCircle2 size={18} /> Erfolgreich aktualisiert</> : "Daten speichern"}
        </button>

      </div>
    </div>
  );
}