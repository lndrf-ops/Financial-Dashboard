import { ArrowLeft, CheckCircle2, User, Landmark } from "lucide-react";
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
    <div className="bg-white min-h-screen text-black max-w-[430px] mx-auto font-sans pb-20">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 bg-[#F4F4F5] hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={20} className="text-black" />
        </button>
        <span className="font-extrabold text-[17px] tracking-tight text-black">Persönliche Daten</span>
      </div>

      <div className="px-6 pt-6 space-y-8">
        <p className="text-xs text-gray-500 leading-relaxed">Diese Parameter werden genutzt, um deine Netto-Steuerlast in der Entnahmephase präziser zu berechnen.</p>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-black" />
            <h2 className="text-[13px] text-black font-semibold uppercase tracking-widest">Stammdaten</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 focus-within:border-black transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Vorname</label>
              <input type="text" defaultValue="Lena" className="w-full bg-transparent text-base text-black focus:outline-none" />
            </div>
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 focus-within:border-black transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Nachname</label>
              <input type="text" defaultValue="Müller" className="w-full bg-transparent text-base text-black focus:outline-none" />
            </div>
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3 focus-within:border-black transition-colors">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Geburtsdatum</label>
              <input type="date" defaultValue="1995-06-15" className="w-full bg-transparent text-base text-black focus:outline-none [color-scheme:light]" />
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Landmark size={16} className="text-black" />
            <h2 className="text-[13px] text-black font-semibold uppercase tracking-widest">Steuer & Abgaben</h2>
          </div>
          <div className="space-y-3">
            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Steuerklasse</label>
              <select className="bg-transparent text-sm text-black focus:outline-none cursor-pointer w-full">
                <option value="1" className="bg-white">Klasse I (Ledig)</option>
                <option value="2" className="bg-white">Klasse II (Alleinerziehend)</option>
                <option value="3" className="bg-white">Klasse III (Verheiratet, Mehrverdiener)</option>
                <option value="4" className="bg-white">Klasse IV (Verheiratet, Standard)</option>
                <option value="5" className="bg-white">Klasse V (Verheiratet, Geringverdiener)</option>
                <option value="6" className="bg-white">Klasse VI (Zweitjob)</option>
              </select>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-3">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">Bundesland</label>
              <select defaultValue="Sachsen" className="bg-transparent text-sm text-black focus:outline-none cursor-pointer w-full">
                <option value="Baden-Württemberg" className="bg-white">Baden-Württemberg</option>
                <option value="Bayern" className="bg-white">Bayern</option>
                <option value="Berlin" className="bg-white">Berlin</option>
                <option value="Hessen" className="bg-white">Hessen</option>
                <option value="Sachsen" className="bg-white">Sachsen</option>
                <option value="NRW" className="bg-white">Nordrhein-Westfalen</option>
              </select>
            </div>

            <div className="bg-[#F9FAFB] border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black mb-0.5">Kirchensteuer</p>
                <p className="text-[11px] text-gray-500">8% bzw. 9% je nach Bundesland</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-black" />
            </div>
          </div>
        </section>

        <button onClick={handleSave} className={`w-full font-extrabold text-[15px] py-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer ${saved ? 'bg-[#F4F4F5] text-black border border-gray-200' : 'bg-black hover:bg-gray-900 text-white'}`}>
          {saved ? <><CheckCircle2 size={18} /> Erfolgreich aktualisiert</> : "Daten speichern"}
        </button>

      </div>
    </div>
  );
}
