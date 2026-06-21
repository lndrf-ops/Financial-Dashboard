import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Bot, MessageCircle, Undo2 } from "lucide-react";
import { LifeEvent, StressTests } from "./SimulateView";

interface ChatAction {
  label: string;
  botReply: string;
  execute: () => void;
}

export interface GuidedSmartChatProps {
  monthlyContribution: number;
  setMonthlyContribution: (val: number) => void;
  retirementAge: number;
  setRetirementAge: (val: number) => void;
  lifeEvents: LifeEvent[];
  setLifeEvents: React.Dispatch<React.SetStateAction<LifeEvent[]>>;
  stressTests: StressTests;
  setStressTests: React.Dispatch<React.SetStateAction<StressTests>>;
  avdActive: boolean;
  setAvdActive: (v: boolean) => void;
  onReset?: () => void;
}

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

interface StateSnapshot {
  monthlyContribution: number;
  retirementAge: number;
  lifeEvents: LifeEvent[];
  stressTests: StressTests;
  avdActive: boolean;
}

const STACK_DEPTH = 3;

export function GuidedSmartChat(props: GuidedSmartChatProps) {
  const {
    monthlyContribution, setMonthlyContribution,
    retirementAge, setRetirementAge,
    lifeEvents, setLifeEvents,
    stressTests, setStressTests,
    avdActive, setAvdActive,
    onReset,
  } = props;

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: 'bot', text: 'Hallo, ich bin Finn – dein KI-Rentenassistent. Wähle einen Vorschlag oder stell mir eine Frage.' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chipStack, setChipStack] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [isExiting, setIsExiting] = useState(false);
  const [history, setHistory] = useState<StateSnapshot[]>([]);
  const nextId = useRef(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buildActions = (): ChatAction[] => [
    {
      label: "Sparrate um 50 € erhöhen",
      botReply: `Erledigt! Ich habe deine Sparrate auf ${monthlyContribution + 50} € angehoben. Über die Jahrzehnte macht das einen erheblichen Unterschied.`,
      execute: () => setMonthlyContribution(monthlyContribution + 50),
    },
    {
      label: "2 Jahre früher in Rente",
      botReply: `Notiert. Dein Renteneintrittsalter liegt jetzt bei ${retirementAge - 2} Jahren. Sieh dir an, wie sich das auf deine monatliche Rente auswirkt.`,
      execute: () => setRetirementAge(retirementAge - 2),
    },
    {
      label: "Sabbatical mit 40 (15k€)",
      botReply: "Ich habe ein Sabbatical mit 40 Jahren (15.000 €) zu deiner Simulation hinzugefügt. Das Leben ist mehr als nur sparen!",
      execute: () => {
        if (!lifeEvents.some(e => e.type === 'sabbatical' && e.age === 40)) {
          setLifeEvents(prev => [...prev, { age: 40, type: 'sabbatical', cost: 15000 }]);
        }
      },
    },
    {
      label: "Was passiert bei hoher Inflation?",
      botReply: stressTests.highInflation
        ? "Ich habe den Hochinflations-Stresstest deaktiviert. Zurück zum Basisszenario."
        : "Aktiviert! Sieh dir an, wie sich 3,5 % Inflation langfristig auf deine Kaufkraft auswirkt.",
      execute: () => setStressTests(prev => ({ ...prev, highInflation: !prev.highInflation })),
    },
    {
      label: "Hauskauf mit 45 (50k€)",
      botReply: "Ich habe einen Hauskauf mit 45 Jahren (50.000 € Eigenkapital) in deine Simulation eingebaut.",
      execute: () => {
        if (!lifeEvents.some(e => e.type === 'realestate' && e.age === 45)) {
          setLifeEvents(prev => [...prev, { age: 45, type: 'realestate', cost: 50000 }]);
        }
      },
    },
    {
      label: "Was wenn ich 98 werde?",
      botReply: stressTests.longevity
        ? "Langlebigkeits-Szenario deaktiviert. Lebenserwartung zurück auf Standard."
        : "Gute Frage. Ich habe die Lebenserwartung auf 98 Jahre gesetzt – reicht dein Vermögen bis dahin?",
      execute: () => setStressTests(prev => ({ ...prev, longevity: !prev.longevity })),
    },
    {
      label: "Simuliere Marktcrash",
      botReply: stressTests.bearMarket
        ? "Bärenmarkt-Simulation deaktiviert. Zurück zum Basisszenario."
        : "Simuliert! Ein Marktcrash von −20 % zum Renteneintritt ist jetzt aktiv. Schau dir den Chart an.",
      execute: () => setStressTests(prev => ({ ...prev, bearMarket: !prev.bearMarket })),
    },
    {
      label: "Altersvorsorgedepot 2027 simulieren",
      botReply: "Ab Januar 2027 kannst du das neue staatliche Altersvorsorgedepot nutzen — mit bis zu 200 € Grundzulage pro Jahr. In der Simulation unter 'Erweiterte Simulation' siehst du schon jetzt, wie es deine Rente verbessern würde.",
      execute: () => {},
    },
    {
      label: "Alles zurücksetzen",
      botReply: "Alles zurückgesetzt. Sparrate 150 €, Renteneintritt mit 67, keine Life-Events, keine Stresstests.",
      execute: () => {
        setMonthlyContribution(150);
        setRetirementAge(67);
        setLifeEvents([]);
        setStressTests({ bearMarket: false, highInflation: false, longevity: false });
        setAvdActive(false);
      },
    },
  ];

  const allActions = buildActions();

  const handleStackChipClick = () => {
    if (isTyping || isExiting) return;
    const frontIdx = chipStack[0];
    const action = allActions[frontIdx];
    postMessage(action.label, action.botReply, action.execute);
    setIsExiting(true);
    setTimeout(() => {
      setChipStack(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsExiting(false);
    }, 310);
  };

  const handleRefreshStack = () => {
    if (isTyping || isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      setChipStack(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setIsExiting(false);
    }, 310);
  };

  const postMessage = (userText: string, botText: string, execute?: () => void) => {
    const uid = nextId.current++;
    const bid = nextId.current++;
    setMessages(prev => [...prev, { id: uid, from: 'user', text: userText }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: bid, from: 'bot', text: botText }]);
      if (execute) {
        setHistory(prev => [...prev, { monthlyContribution, retirementAge, lifeEvents, stressTests, avdActive }]);
        execute();
      }
    }, 520);
  };

  const handleUndo = () => {
    if (history.length === 0 || isTyping) return;
    const snapshot = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setMonthlyContribution(snapshot.monthlyContribution);
    setRetirementAge(snapshot.retirementAge);
    setLifeEvents(snapshot.lifeEvents);
    setStressTests(snapshot.stressTests);
    setAvdActive(snapshot.avdActive);
    const bid = nextId.current++;
    setMessages(prev => [...prev, { id: bid, from: 'bot', text: 'Letzte Änderung rückgängig gemacht. Deine Simulation ist wieder auf dem vorherigen Stand.' }]);
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue('');
    const lower = text.toLowerCase();
    const keywordMap: [RegExp, string][] = [
      [/sabbatical/, 'Sabbatical'],
      [/spar|beitrag|sparrate/, 'Sparrate'],
      [/rente|früher/, 'früher'],
      [/inflation/, 'Inflation'],
      [/haus|immobil/, 'Hauskauf'],
      [/98|langlebig/, '98'],
      [/crash|markt|bear/, 'Marktcrash'],
      [/altersvorsorge|avd|depot|förder|zulage|riester|2027/, '2027'],
      [/zurück|reset/, 'zurück'],
    ];
    let found: ChatAction | undefined;
    for (const [regex, keyword] of keywordMap) {
      if (regex.test(lower)) {
        found = allActions.find(a => a.label.includes(keyword));
        if (found) break;
      }
    }
    if (found) {
      postMessage(text, found.botReply, found.execute);
    } else {
      postMessage(text, "Das kann ich dir gerade nicht beantworten — frag mich nach deiner Sparrate, deinem Rentenalter oder einem Szenario wie einem Marktcrash.");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!avdActive) {
      const hintId = nextId.current++;
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: hintId,
          from: 'bot',
          text: '💡 Tipp: Ab Januar 2027 kommt das neue Altersvorsorgedepot — mit bis zu 200 € staatlicher Zulage pro Jahr. Unter "Erweiterte Simulation" kannst du schon jetzt sehen, wie es deine Rente beeinflussen würde.',
        }]);
      }, 800);
    }
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const visibleStack = chipStack.slice(0, STACK_DEPTH);

  return (
    <div className="flex flex-col h-full pb-24 bg-white">

      {/* Header */}
      <div id="tutorial-chat-header" className="shrink-0 sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center gap-3">
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform"
          title="Chat zurücksetzen"
        >
          <MessageCircle size={17} className="text-white" strokeWidth={2} />
        </button>
        <div>
          <p className="text-black font-extrabold text-[17px] tracking-tight leading-none">Finn</p>
          <p className="text-gray-400 text-[11px] mt-0.5">Dein KI-Rentenassistent</p>
        </div>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-gray-300 border border-gray-200 rounded-full px-2.5 py-1">Beta</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3" style={{ minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'bot' && (
              <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={13} className="text-white" />
              </div>
            )}
            <div className={`max-w-[78%] px-4 py-2.5 text-[13px] leading-relaxed ${
              msg.from === 'user'
                ? 'bg-black text-white rounded-2xl rounded-br-sm'
                : 'bg-[#F4F4F5] text-black rounded-2xl rounded-bl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-xl bg-black flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={13} className="text-white" />
            </div>
            <div className="bg-[#F4F4F5] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chip stack + Input */}
      <div className="shrink-0 border-t border-gray-100 bg-white/90 backdrop-blur-xl px-4 pt-3 pb-4 space-y-2.5">

        {/* Chip stack */}
        <div id="tutorial-chat-chips" className="flex items-start gap-2">
          {/* Stack container — tall enough for 3 peeking chips */}
          <div className="flex-1 relative" style={{ height: '64px', overflow: 'visible' }}>
            {visibleStack.slice().reverse().map((actionIdx, revPos) => {
              const depth = (STACK_DEPTH - 1) - revPos; // 0=front, 1=mid, 2=back
              const isFront = depth === 0;
              const offsetY = depth * 12;
              const scaleX = 1 - depth * 0.07;
              const opacity = 1 - depth * 0.28;
              const action = allActions[actionIdx];

              return (
                <div
                  key={actionIdx}
                  className="absolute left-0 right-0"
                  style={{
                    zIndex: STACK_DEPTH - depth,
                    transform: isFront && isExiting
                      ? 'translateY(-52px) translateX(-14px) rotate(-12deg)'
                      : `translateY(${offsetY}px) scaleX(${scaleX})`,
                    opacity: isFront && isExiting ? 0 : opacity,
                    transition: 'transform 300ms cubic-bezier(0.55,0,0.9,0.6), opacity 260ms ease',
                    pointerEvents: isFront ? 'auto' : 'none',
                  }}
                >
                  <button
                    onClick={handleStackChipClick}
                    disabled={isTyping || !isFront || isExiting}
                    className="w-full h-10 px-4 rounded-xl bg-[#F4F4F5] hover:bg-black hover:text-white text-black text-[11px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed cursor-pointer text-left truncate"
                  >
                    {action.label}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Undo button */}
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isTyping}
            className="shrink-0 w-10 h-10 rounded-xl bg-[#F4F4F5] hover:bg-black hover:text-white flex items-center justify-center text-gray-400 transition-all disabled:opacity-40 cursor-pointer"
            title="Rückgängig"
          >
            <Undo2 size={13} />
          </button>

          {/* Refresh button */}
          <button
            onClick={handleRefreshStack}
            disabled={isTyping}
            className="shrink-0 w-10 h-10 rounded-xl bg-[#F4F4F5] hover:bg-black hover:text-white flex items-center justify-center text-gray-400 transition-all disabled:opacity-40 cursor-pointer"
            title="Andere Vorschläge"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Text input */}
        <div id="tutorial-chat-input" className="flex items-center gap-2 bg-[#F4F4F5] border border-gray-200 rounded-xl px-4 h-11 focus-within:border-black transition-colors">
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Frage an Finn…"
            className="flex-1 bg-transparent text-black text-[16px] placeholder:text-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="text-black disabled:opacity-25 disabled:cursor-not-allowed transition-opacity cursor-pointer"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
