import { ArrowLeft, CheckCircle2, User, Landmark, Briefcase } from "lucide-react";
import { useState } from "react";
import { Switch } from "../ui/switch";

interface PersonalDataViewProps {
  onBack: () => void;
}

export function PersonalDataView({ onBack }: PersonalDataViewProps) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight">Persönliche Daten</span>
      </div>

      <div className="px-6 pt-6 space-y-8">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Diese Parameter werden genutzt, um deine Netto-Steuerlast in der Entnahmephase präziser zu berechnen (Basis: deutsches Steuerrecht).
        </p>

        {/* Stammdaten */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-[#00e676]" />
            <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest">Stammdaten</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 focus-within:border-[#00e676]/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Vorname</label>
              <input type="text" defaultValue="John" className="w-full bg-transparent text-sm text-white focus:outline-none" />
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 focus-within:border-[#00e676]/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Nachname</label>
              <input type="text" defaultValue="Doe" className="w-full bg-transparent text-sm text-white focus:outline-none" />
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 focus-within:border-[#00e676]/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Geburtsdatum</label>
              <input type="date" defaultValue="1995-06-15" className="w-full bg-transparent text-sm text-white focus:outline-none [color-scheme:dark]" />
            </div>
          </div>
        </section>

        {/* Steuer & Abgaben */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={16} className="text-[#00e676]" />
            <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest">Steuer & Abgaben</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Steuerklasse</label>
              <select className="bg-transparent text-sm text-white focus:outline-none cursor-pointer w-full">
                <option value="1" className="bg-[#0d0d0d]">Klasse I (Ledig)</option>
                <option value="2" className="bg-[#0d0d0d]">Klasse II (Alleinerziehend)</option>
                <option value="3" className="bg-[#0d0d0d]">Klasse III (Verheiratet, Mehrverdiener)</option>
                <option value="4" className="bg-[#0d0d0d]">Klasse IV (Verheiratet, Standard)</option>
                <option value="5" className="bg-[#0d0d0d]">Klasse V (Verheiratet, Geringverdiener)</option>
                <option value="6" className="bg-[#0d0d0d]">Klasse VI (Zweitjob)</option>
              </select>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Bundesland</label>
              <select defaultValue="Sachsen" className="bg-transparent text-sm text-white focus:outline-none cursor-pointer w-full">
                <option value="Baden-Württemberg" className="bg-[#0d0d0d]">Baden-Württemberg</option>
                <option value="Bayern" className="bg-[#0d0d0d]">Bayern</option>
                <option value="Berlin" className="bg-[#0d0d0d]">Berlin</option>
                <option value="Hessen" className="bg-[#0d0d0d]">Hessen</option>
                <option value="Sachsen" className="bg-[#0d0d0d]">Sachsen</option>
                <option value="NRW" className="bg-[#0d0d0d]">Nordrhein-Westfalen</option>
              </select>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white mb-0.5">Kirchensteuer</p>
                <p className="text-[11px] text-zinc-500">8% bzw. 9% je nach Bundesland</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-[#00e676]" />
            </div>
            
            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 focus-within:border-[#00e676]/50 transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block mb-1">Kinderfreibeträge</label>
              <input type="number" defaultValue="0" min="0" step="0.5" className="w-full bg-transparent text-sm text-white focus:outline-none" />
            </div>
          </div>
        </section>

        {/* Berufsstatus */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-[#00e676]" />
            <h2 className="text-[13px] text-[#00e676] font-semibold uppercase tracking-widest">Erwerbsstatus</h2>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3">
            <select className="bg-transparent text-sm text-white focus:outline-none cursor-pointer w-full">
              <option className="bg-[#0d0d0d]">Angestellt (Sozialversicherungspflichtig)</option>
              <option className="bg-[#0d0d0d]">Student / Werkstudent</option>
              <option className="bg-[#0d0d0d]">Selbstständig (Keine DRV-Pflicht)</option>
              <option className="bg-[#0d0d0d]">Beamter (Pension)</option>
            </select>
          </div>
        </section>

        <button 
          onClick={handleSave}
          className={`w-full font-extrabold text-[15px] py-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer
            ${saved ? 'bg-[#00e676]/20 text-[#00e676]' : 'bg-[#00e676] hover:opacity-90 text-black'}`}
        >
          {saved ? <><CheckCircle2 size={18} /> Erfolgreich aktualisiert</> : "Daten speichern"}
        </button>

      </div>
    </div>
  );
}