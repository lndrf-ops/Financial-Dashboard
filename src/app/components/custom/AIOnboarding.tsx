import { useState } from "react";
import { ArrowRight, Bot, Check, Users } from "lucide-react";

export interface AIOnboardingData {
  age: number;
  income: number; // NEU: Zur Schätzung der DRV
  initialCapital: number;
  monthlySavings: number;
  targetPension: number; // NEU: Für den Ziel-Graphen
}

interface AIOnboardingProps {
  onComplete: (data: AIOnboardingData) => void;
  onSwitchToPersonas: () => void;
}

export function AIOnboarding({ onComplete, onSwitchToPersonas }: AIOnboardingProps) {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const [age, setAge] = useState<string>("");
  const [income, setIncome] = useState<string>("");
  const [initialCapital, setInitialCapital] = useState<string>("");
  const [monthlySavings, setMonthlySavings] = useState<string>("");
  const [targetPension, setTargetPension] = useState<string>("");

  const nextStep = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep((prev) => prev + 1);
    }, 800); 
  };

  const handleFinish = () => {
    setIsTyping(true);
    setTimeout(() => {
      onComplete({
        age: parseInt(age) || 30,
        income: parseInt(income) || 0,
        initialCapital: parseInt(initialCapital) || 0,
        monthlySavings: parseInt(monthlySavings) || 0,
        targetPension: parseInt(targetPension) || 2000,
      });
    }, 1200);
  };

  return (
    <div className="bg-black min-h-screen text-white max-w-[430px] mx-auto font-sans flex flex-col relative">
      
      {/* Toggle Button Oben Rechts */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onSwitchToPersonas}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
        >
          <Users size={14} className="text-zinc-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Personas</span>
        </button>
      </div>

      <div className="pt-12 px-6 pb-6">
        <div className="w-12 h-12 bg-[#00e676]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00e676]/20">
          <Bot size={24} className="text-[#00e676]" />
        </div>
        <h1 className="text-3xl font-black tracking-tight leading-tight mb-2">
          FutureMe <span className="text-[#00e676]">AI</span>
        </h1>
        <p className="text-[13px] text-[#9a9a9a]">
          Lass uns deine Altersvorsorge in wenigen Sekunden aufsetzen.
        </p>
      </div>

      <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-32">
        
        {/* Step 0: Alter */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[90%]">
            <p className="text-sm leading-relaxed">
              Hallo! Um dein Dashboard perfekt zu kalibrieren, brauche ich ein paar schnelle Eckdaten. <br/><br/>
              <span className="font-bold text-[#00e676]">Wie alt bist du aktuell?</span>
            </p>
          </div>
          
          {step === 0 && !isTyping && (
            <div className="mt-4 flex items-center gap-3 animate-in fade-in">
              <input 
                type="number" 
                placeholder="z.B. 25" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                autoFocus
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e676] w-24 text-center font-bold"
              />
              <button 
                onClick={nextStep}
                disabled={!age}
                className="w-12 h-12 bg-[#00e676] rounded-xl flex items-center justify-center text-black disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer"
              >
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Step 1: Einkommen */}
        {step >= 1 && (
          <>
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-2xl rounded-tr-sm p-3 inline-block">
                <p className="text-sm font-bold">{age} Jahre</p>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[90%]">
                <p className="text-sm leading-relaxed">
                  Okay. Um deine gesetzliche Rente zu schätzen, <span className="font-bold text-[#00e676]">wie hoch ist dein aktuelles monatliches Nettoeinkommen?</span>
                </p>
              </div>
              
              {step === 1 && !isTyping && (
                <div className="mt-4 flex items-center gap-3 animate-in fade-in">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-500 font-bold">€</span>
                    <input 
                      type="number" 
                      placeholder="2500" 
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      autoFocus
                      className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#00e676] w-32 font-bold"
                    />
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!income}
                    className="w-12 h-12 bg-[#00e676] rounded-xl flex items-center justify-center text-black disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 2: Startkapital */}
        {step >= 2 && (
          <>
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-2xl rounded-tr-sm p-3 inline-block">
                <p className="text-sm font-bold">€ {income}</p>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[90%]">
                <p className="text-sm leading-relaxed">
                  Verstanden. <span className="font-bold text-[#00e676]">Wie viel liquides Kapital hast du bereits angespart?</span> (Depotwert + Tagesgeld)
                </p>
              </div>
              
              {step === 2 && !isTyping && (
                <div className="mt-4 flex items-center gap-3 animate-in fade-in">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-500 font-bold">€</span>
                    <input 
                      type="number" 
                      placeholder="10000" 
                      value={initialCapital}
                      onChange={(e) => setInitialCapital(e.target.value)}
                      autoFocus
                      className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#00e676] w-36 font-bold"
                    />
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!initialCapital}
                    className="w-12 h-12 bg-[#00e676] rounded-xl flex items-center justify-center text-black disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 3: Sparrate */}
        {step >= 3 && (
          <>
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-2xl rounded-tr-sm p-3 inline-block">
                <p className="text-sm font-bold">€ {initialCapital}</p>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[90%]">
                <p className="text-sm leading-relaxed">
                  Guter Start! <span className="font-bold text-[#00e676]">Wie viel legst du davon aktuell jeden Monat zur Seite?</span>
                </p>
              </div>
              
              {step === 3 && !isTyping && (
                <div className="mt-4 flex items-center gap-3 animate-in fade-in">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-500 font-bold">€</span>
                    <input 
                      type="number" 
                      placeholder="150" 
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(e.target.value)}
                      autoFocus
                      className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#00e676] w-32 font-bold"
                    />
                  </div>
                  <button 
                    onClick={nextStep}
                    disabled={!monthlySavings}
                    className="w-12 h-12 bg-[#00e676] rounded-xl flex items-center justify-center text-black disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 4: Wunschrente */}
        {step >= 4 && (
          <>
            <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 rounded-2xl rounded-tr-sm p-3 inline-block">
                <p className="text-sm font-bold">€ {monthlySavings}</p>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-block max-w-[90%]">
                <p className="text-sm leading-relaxed">
                  Letzte Frage: <span className="font-bold text-[#00e676]">Wie hoch ist deine monatliche Wunschrente</span> (in heutiger Kaufkraft)?
                </p>
              </div>
              
              {step === 4 && !isTyping && (
                <div className="mt-4 flex items-center gap-3 animate-in fade-in">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-zinc-500 font-bold">€</span>
                    <input 
                      type="number" 
                      placeholder="2500" 
                      value={targetPension}
                      onChange={(e) => setTargetPension(e.target.value)}
                      autoFocus
                      className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#00e676] w-36 font-bold"
                    />
                  </div>
                  <button 
                    onClick={handleFinish}
                    disabled={!targetPension}
                    className="w-12 h-12 bg-[#00e676] rounded-xl flex items-center justify-center text-black disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    <Check size={20} strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl rounded-tl-sm p-4 inline-flex items-center gap-1 animate-in fade-in">
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
}