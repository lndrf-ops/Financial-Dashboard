import { UploadCloud, User, GraduationCap, Briefcase, FileText, Bot } from "lucide-react";

export interface Persona {
  id: string;
  name: string;
  role: string;
  age: number;
  targetAge: number;
  targetPension: number;
  monthlySavings: number;
  assets: {
    statutoryPayout: number;
    statutoryAcc: number;
    etfAcc: number;
    companyPayout: number;
    companyAcc: number;
    realestatePayout: number;
    realestateAcc: number;
    cashAcc: number;
    cryptoAcc: number;
  };
}

const personas: Persona[] = [
  {
    id: "p1",
    name: "John",
    role: "Data Science Student & Werkstudent",
    age: 25,
    targetAge: 67,
    targetPension: 2000, 
    monthlySavings: 150,
    assets: {
      statutoryPayout: 25, statutoryAcc: 1200, etfAcc: 3500, companyPayout: 0, companyAcc: 0, realestatePayout: 0, realestateAcc: 0, cashAcc: 2000, cryptoAcc: 1500, 
    }
  },
  {
    id: "p2",
    name: "Sarah",
    role: "Senior IT Consultant",
    age: 42,
    targetAge: 65,
    targetPension: 2500,
    monthlySavings: 450,
    assets: {
      statutoryPayout: 850, statutoryAcc: 68000, etfAcc: 45000, companyPayout: 250, companyAcc: 22000, realestatePayout: 1100, realestateAcc: 350000, cashAcc: 15000, cryptoAcc: 0,
    }
  },
  {
    id: "p3",
    name: "Michael",
    role: "Projektleiter (Kurz vor Rente)",
    age: 58,
    targetAge: 66,
    targetPension: 2800,
    monthlySavings: 200,
    assets: {
      statutoryPayout: 1650, statutoryAcc: 210000, etfAcc: 18000, companyPayout: 350, companyAcc: 75000, realestatePayout: 1600, realestateAcc: 650000, cashAcc: 80000, cryptoAcc: 0,
    }
  }
];

interface OnboardingProps {
  onSelectPersona: (persona: Persona) => void;
  onSwitchToAI: () => void;
}

export function Onboarding({ onSelectPersona, onSwitchToAI }: OnboardingProps) {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 max-w-[430px] mx-auto font-sans flex flex-col px-6 py-12 relative">
      
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onSwitchToAI}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 transition-colors cursor-pointer shadow-lg"
        >
          <Bot size={14} className="text-indigo-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">KI-Setup</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
          <UploadCloud size={32} className="text-indigo-400" strokeWidth={2} />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight leading-tight text-white mb-3">
          Dein Start in die <br />
          <span className="text-indigo-400">Altersvorsorge.</span>
        </h1>
        <p className="text-[15px] text-slate-400 leading-relaxed mb-10">
          Wähle ein vorbereitetes Demo-Profil, um die Auswirkung verschiedener Lebenssituationen zu testen.
        </p>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Demo-Profile auswählen</span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>

        <div className="space-y-4">
          {personas.map((persona, idx) => {
            const Icon = idx === 0 ? GraduationCap : idx === 1 ? Briefcase : User;
            return (
              <div 
                key={persona.id}
                onClick={() => onSelectPersona(persona)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <Icon size={20} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-white">{persona.name}, {persona.age}</h3>
                  <p className="text-[12px] text-slate-500 truncate pr-2">{persona.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <FileText size={14} className="text-indigo-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}