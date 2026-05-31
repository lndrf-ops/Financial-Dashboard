import { UploadCloud, User, GraduationCap, Briefcase, FileText } from "lucide-react";

export interface Persona {
  id: string;
  name: string;
  role: string;
  age: number;
  targetAge: number;
  targetPension: number; // NEU: Individuelle Wunschrente pro Persona
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
    name: "John", // NEU: Name geändert
    role: "Data Science Student & Werkstudent",
    age: 25,
    targetAge: 67,
    targetPension: 2000, 
    monthlySavings: 150,
    assets: {
      statutoryPayout: 25, 
      statutoryAcc: 1200,
      etfAcc: 3500, 
      companyPayout: 0, 
      companyAcc: 0,
      realestatePayout: 0, 
      realestateAcc: 0,
      cashAcc: 2000, 
      cryptoAcc: 1500, 
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
      statutoryPayout: 850,
      statutoryAcc: 68000,
      etfAcc: 45000, 
      companyPayout: 250, 
      companyAcc: 22000,
      realestatePayout: 1100, 
      realestateAcc: 350000,
      cashAcc: 15000,
      cryptoAcc: 0,
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
      statutoryPayout: 1650, // Etwas realistischer angepasst
      statutoryAcc: 210000,
      etfAcc: 18000, 
      companyPayout: 350, 
      companyAcc: 75000,
      realestatePayout: 1600, 
      realestateAcc: 650000,
      cashAcc: 80000, 
      cryptoAcc: 0,
    }
  }
];

interface OnboardingProps {
  onSelectPersona: (persona: Persona) => void;
}

export function Onboarding({ onSelectPersona }: OnboardingProps) {
  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans flex flex-col px-6 py-12">
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-[#00e676]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00e676]/20">
          <UploadCloud size={32} className="text-[#00e676]" strokeWidth={2} />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight leading-tight mb-3">
          Dein Start in die <br />
          <span className="text-[#00e676]">Altersvorsorge.</span>
        </h1>
        <p className="text-[15px] text-[#9a9a9a] leading-relaxed mb-10">
          Lade einfach deine offizielle Renteninformation hoch. Unsere KI extrahiert alle relevanten Daten für dich.
        </p>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b] font-bold">Demo-Profile auswählen</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

        <div className="space-y-4">
          {personas.map((persona, idx) => {
            const Icon = idx === 0 ? GraduationCap : idx === 1 ? Briefcase : User;
            return (
              <div 
                key={persona.id}
                onClick={() => onSelectPersona(persona)}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center cursor-pointer hover:border-[#00e676]/50 hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <Icon size={20} className="text-[#00e676]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-white">{persona.name}, {persona.age}</h3>
                  <p className="text-[12px] text-[#6b6b6b] truncate pr-2">{persona.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00e676]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <FileText size={14} className="text-[#00e676]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}