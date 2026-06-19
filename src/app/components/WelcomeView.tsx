import { ArrowRight, Users, CheckCircle2 } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
  onPersonas: () => void;
}

export function WelcomeView({ onStart, onPersonas }: WelcomeViewProps) {
  return (
    <div className="min-h-screen flex flex-col text-white max-w-[430px] mx-auto font-sans relative animate-in fade-in duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center grayscale" style={{ backgroundImage: "url('/brad_pit_trade_repbulicctrade_republic.jpg')" }} />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex items-center gap-2 px-6 pt-14 pb-0">
        <img src="/traderepublic_logo.jpg" alt="" className="w-4 h-4 rounded-[3px] object-cover opacity-60" />
        <span className="text-white/45 text-[12px] font-semibold tracking-wide">Trade Republic</span>
        <span className="text-white/25 text-[12px] mx-0.5">·</span>
        <span className="text-white/35 text-[12px]">Altersvorsorge</span>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-6 pt-10 pb-12 justify-center items-center text-center">
        <h1 className="text-4xl font-black text-white mb-1 tracking-tight">FutureMe</h1>
        <p className="text-white/35 text-[12px] font-semibold tracking-widest uppercase mb-7">by Trade Republic</p>
        <p className="text-[15px] text-white/70 leading-relaxed mb-8 px-2">
          Deine Rente. Einfach verstehen, selbst gestalten — in 3 Minuten ein klares Bild.
        </p>

        <div className="w-full space-y-3 mb-10 text-left">
          {[
            { bold: true,  text: "KI analysiert deinen Rentenbescheid in Sekunden" },
            { bold: false, text: "Klare Empfehlungen — ohne Fachchinesisch" },
            { bold: false, text: "Direkt investieren über dein Trade Republic Depot" },
          ].map(({ bold, text }) => (
            <div key={text} className="flex items-start gap-3">
              <CheckCircle2 size={15} className="text-emerald-400 mt-[1px] shrink-0" />
              <span className={`text-[13px] leading-snug ${bold ? 'text-white font-medium' : 'text-white/80'}`}>{text}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-4">
          <button
            onClick={onStart}
            className="w-full flex justify-center items-center gap-2 bg-white hover:bg-gray-100 text-black font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowRight size={18} /> Jetzt starten
          </button>
          <button
            onClick={onPersonas}
            className="w-full flex justify-center items-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white/70 hover:text-white font-bold text-[13px] py-4 rounded-xl transition-colors cursor-pointer"
          >
            <Users size={18} /> Beispielprofile ansehen
          </button>
        </div>
      </div>
    </div>
  );
}
