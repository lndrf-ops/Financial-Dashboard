import { UploadCloud, User, GraduationCap, Briefcase, FileText, SlidersHorizontal } from "lucide-react";

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

type GapSeverity = { label: string; color: string };

const personaGapSeverity: Record<string, GapSeverity> = {
  p1: { label: 'Lücke: klein',  color: 'bg-amber-50 text-amber-700 border-amber-200' },
  p2: { label: 'Lücke: mittel', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  p3: { label: 'Lücke: groß',   color: 'bg-red-50 text-red-700 border-red-200' },
};

const personas: Persona[] = [
  {
    id: "p1",
    name: "John",
    role: "Data Science Student & Werkstudent",
    age: 25,
    targetAge: 67,
    targetPension: 1800,
    monthlySavings: 200,
    assets: {
      statutoryPayout: 30, statutoryAcc: 1200, etfAcc: 3500, companyPayout: 0, companyAcc: 0, realestatePayout: 0, realestateAcc: 0, cashAcc: 2000, cryptoAcc: 1500,
    }
  },
  {
    id: "p2",
    name: "Lena",
    role: "Senior IT Consultant",
    age: 32,
    targetAge: 65,
    targetPension: 2900,
    monthlySavings: 350,
    assets: {
      statutoryPayout: 650, statutoryAcc: 68000, etfAcc: 22000, companyPayout: 150, companyAcc: 0, realestatePayout: 0, realestateAcc: 0, cashAcc: 15000, cryptoAcc: 0,
    }
  },
  {
    id: "p3",
    name: "Michael",
    role: "Projektleiter (Kurz vor Rente)",
    age: 58,
    targetAge: 66,
    targetPension: 3000,
    monthlySavings: 200,
    assets: {
      statutoryPayout: 1550, statutoryAcc: 210000, etfAcc: 18000, companyPayout: 0, companyAcc: 0, realestatePayout: 0, realestateAcc: 350000, cashAcc: 80000, cryptoAcc: 0,
    }
  }
];

interface OnboardingProps {
  onSelectPersona: (persona: Persona) => void;
  onSwitchToAI: () => void;
}

export function Onboarding({ onSelectPersona, onSwitchToAI }: OnboardingProps) {
  return (
    <div className="bg-white min-h-screen text-black max-w-[430px] mx-auto font-sans flex flex-col px-6 py-12 relative">

      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onSwitchToAI}
          className="flex items-center gap-2 bg-[#F4F4F5] hover:bg-gray-200 border border-gray-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
        >
          <SlidersHorizontal size={14} className="text-black" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-black">KI-Setup</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-[#F4F4F5] rounded-2xl flex items-center justify-center mb-6 border border-gray-200">
          <UploadCloud size={32} className="text-black" strokeWidth={2} />
        </div>

        <h1 className="text-4xl font-black tracking-tight leading-tight text-black mb-3">
          Dein Start in die <br />
          <span className="text-black">Altersvorsorge.</span>
        </h1>
        <p className="text-[15px] text-gray-500 leading-relaxed mb-10">
          Wähle ein vorbereitetes Demo-Profil, um die Auswirkung verschiedener Lebenssituationen zu testen.
        </p>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Demo-Profile auswählen</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="space-y-4">
          {personas.map((persona, idx) => {
            const Icon = idx === 0 ? GraduationCap : idx === 1 ? Briefcase : User;
            return (
              <div
                key={persona.id}
                onClick={() => onSelectPersona(persona)}
                className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 flex items-center cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] border border-gray-200 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <Icon size={20} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-black">{persona.name}, {persona.age}</h3>
                  <p className="text-[12px] text-gray-500 truncate pr-2">{persona.role}</p>
                  {personaGapSeverity[persona.id] && (
                    <span className={`inline-block mt-1.5 text-[10px] font-bold border rounded-full px-2 py-0.5 ${personaGapSeverity[persona.id].color}`}>
                      {personaGapSeverity[persona.id].label}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#F4F4F5] border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <FileText size={14} className="text-black" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
