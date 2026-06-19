const TUTORIAL_STEPS: { title: string; text: string }[] = [
  {
    title: "Deine Rente auf einen Blick.",
    text: "Hier siehst du, wie viel du monatlich ausgeben kannst, wenn du in Rente gehst. Gesetzliche Rente, Betriebsrente und dein ETF-Sparplan werden kombiniert.",
  },
  {
    title: "Dein Geld arbeitet für dich.",
    text: "Passe deine monatliche Sparrate an und verfolge, wie dein erspartes Geld mit der Zeit immer schneller wächst — Zinsen auf Zinsen machen den Unterschied.",
  },
  {
    title: "Was wäre, wenn...?",
    text: "Das Leben passiert. Simuliere Auszeiten, Immobilienkäufe oder Marktcrashs und sieh sofort die Auswirkungen auf deine Rente.",
  },
  {
    title: "Deine Daten, deine Kontrolle.",
    text: "Passe Renteneintrittsalter, Inflation und Lebenserwartung an. Du hast jederzeit die volle Kontrolle über alle Annahmen.",
  },
];

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  onComplete: () => void;
}

export function TutorialOverlay({ step, onNext, onComplete }: TutorialOverlayProps) {
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 z-[90]" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[100] bg-slate-950/85 backdrop-blur-xl border-t border-slate-800 rounded-t-3xl px-6 pt-7 pb-10 animate-in slide-in-from-bottom-8 fade-in duration-300">
        <div className="flex justify-center items-center gap-2 mb-7">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-white' : 'w-1.5 bg-slate-700'}`}
            />
          ))}
        </div>
        <div key={step} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Schritt {step + 1} von {TUTORIAL_STEPS.length}
          </p>
          <h2 className="text-[22px] font-black text-white tracking-tight leading-tight mb-3">{current.title}</h2>
          <p className="text-[14px] text-slate-400 leading-relaxed mb-8">{current.text}</p>
        </div>
        <button
          onClick={isLast ? onComplete : onNext}
          className="w-full bg-white text-slate-950 font-extrabold text-[15px] py-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
        >
          {isLast ? 'Verstanden' : 'Weiter'}
        </button>
      </div>
    </>
  );
}
