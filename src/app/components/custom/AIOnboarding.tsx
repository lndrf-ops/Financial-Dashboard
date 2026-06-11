import { useState, useEffect, useRef } from "react";
import { Bot, User, ArrowRight, UploadCloud, FileText, CheckCircle2, Loader2 } from "lucide-react";

export interface AIOnboardingData {
  age: number;
  monthlySavings: number;
  targetPension: number;
  initialCapital: number;
  income: number;
  drvNetto: number; // NEU: Direktes Netto aus dem PDF
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string | React.ReactNode;
}

interface AIOnboardingProps {
  onComplete: (data: AIOnboardingData) => void;
  onSwitchToPersonas: () => void;
}

export function AIOnboarding({ onComplete, onSwitchToPersonas }: AIOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: "Hey! Ich bin FutureMe. Schön, dass du deine Altersvorsorge anpackst. Lass uns das in 2 Minuten klären. Wie alt bist du?" }
  ]);
  const [step, setStep] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Gesammelte Daten
  const [age, setAge] = useState(30);
  const [drvNetto, setDrvNetto] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(150);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isUploading]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    setTimeout(() => {
      if (step === 1) {
        setAge(parseInt(inputValue) || 30);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: (
            <div className="flex flex-col gap-3">
              <p>Super, {inputValue} Jahre jung! Um deine gesetzliche Rente punktgenau zu berechnen, brauche ich deine Renteninformation. Lade einfach das PDF der DRV hoch – ich lese die Daten aus und berechne direkt deine echten Netto-Abzüge.</p>
              <button 
                onClick={handleUploadMock}
                className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/30 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors w-full mt-2"
              >
                <UploadCloud size={18} /> Renten-PDF hochladen
              </button>
            </div>
          ) 
        }]);
        setStep(2);
      } else if (step === 3) {
        setMonthlySavings(parseInt(inputValue) || 150);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: "Perfekt! Ich habe alles, was ich brauche. Ich bereite jetzt deinen persönlichen Aktionsplan vor..." 
        }]);
        
        setTimeout(() => {
          onComplete({
            age: age,
            monthlySavings: parseInt(inputValue) || 150,
            targetPension: 2200,
            initialCapital: 5000,
            income: 3000,
            drvNetto: drvNetto || 1450 // Fallback falls kein Upload
          });
        }, 1500);
      }
    }, 600);
  };

  const handleUploadMock = () => {
    setIsUploading(true);
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), sender: 'user', text: <span className="flex items-center gap-2"><FileText size={16}/> Renteninformation_2025.pdf</span> 
    }]);

    // Simuliere den KI-Scan
    setTimeout(() => {
      setIsUploading(false);
      const calculatedNetto = 1450;
      setDrvNetto(calculatedNetto);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'ai', 
        text: `Wahnsinn, das ging schnell! Ich habe 45 Entgeltpunkte extrahiert. Nach Abzug von Steuern und KV/PV bleiben dir ca. € ${calculatedNetto.toLocaleString("de-DE")} echte Netto-Rente.` 
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          sender: 'ai', 
          text: "Letzte Frage: Wie viel Euro sparst du aktuell ca. pro Monat (z.B. in ETFs oder auf dem Tagesgeld)?" 
        }]);
        setStep(3);
      }, 1000);
    }, 2500);
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-200 max-w-[430px] mx-auto font-sans relative">
      
      <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <span className="font-extrabold text-[17px] tracking-tight text-white">FutureMe AI</span>
        <button onClick={onSwitchToPersonas} className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-full">
          Demo überspringen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-4 rounded-2xl text-[14px] leading-relaxed max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isUploading && (
          <div className="flex gap-3 flex-row animate-in fade-in">
             <div className="w-8 h-8 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                <Bot size={16} />
             </div>
             <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none max-w-[85%] flex flex-col gap-2">
                <Loader2 size={18} className="text-indigo-400 animate-spin" />
                <span className="text-[13px] font-medium animate-pulse text-indigo-300">Entgeltpunkte werden extrahiert und um Steuern bereinigt...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-white/5 p-4 pb-8">
        <div className="flex gap-2">
          <input 
            type="number" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={step === 1 ? "Dein Alter..." : step === 3 ? "Monatliche Sparrate in €..." : "..."}
            disabled={step === 2 || isUploading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || step === 2 || isUploading}
            className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0 disabled:opacity-50 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}