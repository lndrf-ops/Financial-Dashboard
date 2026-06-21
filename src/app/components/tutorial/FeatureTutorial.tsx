import React, { useEffect, useState } from 'react';
import {
  ChevronRight, Check,
  Target, BadgePercent, Zap, Layers,
  PiggyBank, TrendingUp, Shuffle,
  Shield, Calendar,
  User, RefreshCw, SlidersHorizontal,
  Bot, Lightbulb, MessageSquare,
} from 'lucide-react';
import { FEATURE_STEPS } from './featureSteps';

interface FeatureTutorialProps {
  tab: string;
  step: number;
  total: number;
  onNext: () => void;
  onComplete: () => void;
}

const ICONS: Record<string, React.ReactNode[]> = {
  dashboard: [
    <Target size={18} className="text-white" />,
    <BadgePercent size={18} className="text-white" />,
    <Zap size={18} className="text-white" />,
    <Layers size={18} className="text-white" />,
  ],
  invest: [
    <PiggyBank size={18} className="text-white" />,
    <TrendingUp size={18} className="text-white" />,
    <Shuffle size={18} className="text-white" />,
  ],
  simulate: [
    <Shield size={18} className="text-white" />,
    <Calendar size={18} className="text-white" />,
    <Zap size={18} className="text-white" />,
  ],
  profile: [
    <User size={18} className="text-white" />,
    <RefreshCw size={18} className="text-white" />,
    <SlidersHorizontal size={18} className="text-white" />,
  ],
  chat: [
    <Bot size={18} className="text-white" />,
    <Lightbulb size={18} className="text-white" />,
    <MessageSquare size={18} className="text-white" />,
  ],
};

export function FeatureTutorial({ tab, step, total, onNext, onComplete }: FeatureTutorialProps) {
  const feature = FEATURE_STEPS[tab]?.[step];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [step, tab]);

  const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(false);
      onNext();
    }, 180);
  };

  const handleComplete = () => {
    setVisible(false);
    setTimeout(onComplete, 200);
  };

  if (!feature) { onComplete(); return null; }

  const isLast = step === total - 1;
  const icon = ICONS[tab]?.[step] ?? <Zap size={18} className="text-white" />;

  return (
    <>
      <style>{`
        @keyframes ft-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ft-sheet-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes ft-content-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Backdrop — tap to dismiss */}
      <div
        className="fixed inset-0 z-[90]"
        style={{
          background: 'rgba(8,8,20,0.55)',
          backdropFilter: 'blur(1px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
        onClick={handleComplete}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[91]"
        style={{ maxWidth: 430, margin: '0 auto' }}
      >
        <div
          className="bg-white rounded-t-[32px] shadow-[0_-8px_48px_rgba(0,0,0,0.18)]"
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
            paddingBottom: 'max(2.25rem, env(safe-area-inset-bottom, 2.25rem))',
          }}
        >
          {/* Drag handle */}
          <div className="pt-4 px-6 pb-0">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
          </div>

          {/* Content — re-animates on each step */}
          <div
            key={`${tab}-${step}`}
            className="px-6 pt-5"
            style={{ animation: 'ft-content-in 0.28s ease forwards' }}
          >
            {/* Progress bar */}
            <div className="h-[3px] bg-gray-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-black rounded-full"
                style={{
                  width: `${((step + 1) / total) * 100}%`,
                  transition: 'width 500ms cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>

            {/* Step label + skip */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Schritt {step + 1} von {total}
              </span>
              <button
                onClick={handleComplete}
                className="text-[13px] font-medium text-gray-400 active:text-black transition-colors cursor-pointer"
              >
                Überspringen
              </button>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shrink-0">
                {icon}
              </div>
              <h3 className="text-[20px] font-black text-black leading-tight">
                {feature.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-[14px] text-gray-500 leading-relaxed mb-7">
              {feature.text}
            </p>

            {/* Dots + CTA */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 items-center">
                {Array.from({ length: total }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full"
                    style={{
                      width: i === step ? 22 : 6,
                      height: 6,
                      background: i < step ? '#9ca3af' : i === step ? '#000' : '#e5e7eb',
                      transition: 'width 300ms cubic-bezier(0.4,0,0.2,1), background 300ms ease',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={isLast ? handleComplete : handleNext}
                className="flex items-center gap-1.5 bg-black text-white text-[14px] font-bold px-6 py-3 rounded-2xl cursor-pointer active:scale-95 transition-transform select-none"
              >
                {isLast
                  ? <><Check size={14} strokeWidth={3} />Fertig</>
                  : <>Weiter<ChevronRight size={14} strokeWidth={2.5} /></>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
