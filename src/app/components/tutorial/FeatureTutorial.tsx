import React, { useEffect, useRef, useState } from 'react';
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

const PAD = 10;
const CORNER = 14;

interface SpotRect { x: number; y: number; w: number; h: number; }

function isElementInFixedContainer(el: Element): boolean {
  let parent = el.parentElement;
  while (parent) {
    if (getComputedStyle(parent).position === 'fixed') return true;
    parent = parent.parentElement;
  }
  return false;
}

export function FeatureTutorial({ tab, step, total, onNext, onComplete }: FeatureTutorialProps) {
  const feature = FEATURE_STEPS[tab]?.[step];
  const [visible, setVisible] = useState(false);
  const [spotRect, setSpotRect] = useState<SpotRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  // Lock scroll for the entire tutorial — prevent user-initiated scroll
  useEffect(() => {
    const prevent = (e: Event) => { e.preventDefault(); };
    document.addEventListener('wheel', prevent, { passive: false });
    document.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.removeEventListener('wheel', prevent);
      document.removeEventListener('touchmove', prevent);
      spacerRef.current?.remove();
      spacerRef.current = null;
    };
  }, []);

  useEffect(() => {
    setVisible(false);
    setSpotRect(null);

    // Clean up spacer from previous step
    if (spacerRef.current) {
      spacerRef.current.remove();
      spacerRef.current = null;
    }

    const targetId = FEATURE_STEPS[tab]?.[step]?.targetId;
    const el = targetId ? document.getElementById(targetId) : null;

    // Skip step instantly when target element isn't in the DOM
    if (targetId && !el) {
      const t = setTimeout(() => {
        if (step < total - 1) onNext();
        else onComplete();
      }, 50);
      return () => clearTimeout(t);
    }

    if (el) {
      const panelH = panelRef.current?.offsetHeight ?? 320;
      const vH = window.innerHeight;
      const isFixed = getComputedStyle(el).position === 'fixed';

      if (!isFixed) {
        // Normal scrollable page — center element between viewport top and panel top
        const availableH = vH - panelH;
        const idealCenterY = availableH / 2;

        const r = el.getBoundingClientRect();
        const elCenterInViewport = r.top + r.height / 2;
        const scrollDelta = elCenterInViewport - idealCenterY;
        const targetScrollY = window.scrollY + scrollDelta;

        // If the document is too short to reach targetScrollY, add a temporary spacer
        const docH = document.documentElement.scrollHeight;
        if (targetScrollY > 0 && targetScrollY + vH > docH) {
          const extraNeeded = targetScrollY + vH - docH + 40;
          const spacer = document.createElement('div');
          spacer.style.height = `${extraNeeded}px`;
          spacer.style.pointerEvents = 'none';
          document.body.appendChild(spacer);
          spacerRef.current = spacer;
        }

        window.scrollTo({ top: Math.max(0, targetScrollY), behavior: 'smooth' });
      }
    }

    // Wait for scroll/layout to settle before snapping the spotlight
    const delay = el ? 420 : 30;
    const t = setTimeout(() => {
      if (el) {
        const r = el.getBoundingClientRect();
        setSpotRect({ x: r.x, y: r.y, w: r.width, h: r.height });
      }
      setVisible(true);
    }, delay);

    return () => clearTimeout(t);
  }, [step, tab, total, onNext, onComplete]);

  const handleNext = () => {
    setVisible(false);
    setTimeout(onNext, 180);
  };

  const handleComplete = () => {
    setVisible(false);
    if (spacerRef.current) {
      spacerRef.current.remove();
      spacerRef.current = null;
    }
    setTimeout(() => {
      onComplete();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (spotRect) {
      const sx = spotRect.x - PAD;
      const sy = spotRect.y - PAD;
      const sw = spotRect.w + PAD * 2;
      const sh = spotRect.h + PAD * 2;
      const { clientX, clientY } = e;
      if (clientX >= sx && clientX <= sx + sw && clientY >= sy && clientY <= sy + sh) return;
    }
    handleComplete();
  };

  if (!feature) { onComplete(); return null; }

  const isLast = step === total - 1;
  const icon = ICONS[tab]?.[step] ?? <Zap size={18} className="text-white" />;
  const panelAtTop = (feature.panelPosition ?? 'bottom') === 'top';

  // Spotlight geometry
  const sx = spotRect ? spotRect.x - PAD : 0;
  const sy = spotRect ? spotRect.y - PAD : 0;
  const sw = spotRect ? spotRect.w + PAD * 2 : 0;
  const sh = spotRect ? spotRect.h + PAD * 2 : 0;

  const sheetTransform = visible
    ? 'translateY(0)'
    : panelAtTop ? 'translateY(-100%)' : 'translateY(100%)';

  return (
    <>
      <style>{`
        @keyframes ft-content-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* SVG Spotlight backdrop — cutout reveals the target element */}
      <svg
        style={{
          position: 'fixed', inset: 0,
          width: '100%', height: '100%',
          zIndex: 90,
          opacity: visible ? 1 : 0,
          transition: 'opacity 220ms ease',
          cursor: 'pointer',
        }}
        onClick={handleSvgClick}
      >
        <defs>
          <mask id="ft-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotRect && (
              <rect x={sx} y={sy} width={sw} height={sh} rx={CORNER} fill="black" />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(8,8,20,0.72)" mask="url(#ft-spotlight-mask)" />
      </svg>

      {/* Highlight ring around the target element */}
      {spotRect && (
        <div
          style={{
            position: 'fixed',
            left: sx, top: sy,
            width: sw, height: sh,
            borderRadius: CORNER,
            border: '2px solid rgba(255,255,255,0.6)',
            boxShadow: '0 0 0 4px rgba(255,255,255,0.07), 0 0 30px rgba(255,255,255,0.12)',
            zIndex: 91,
            pointerEvents: 'none',
            opacity: visible ? 1 : 0,
            transition: 'opacity 220ms ease',
          }}
        />
      )}

      {/* Info panel — slides from bottom (default) or top (panelAtTop) */}
      <div
        className="fixed left-0 right-0 z-[92]"
        style={{ maxWidth: 430, margin: '0 auto', ...(panelAtTop ? { top: 0 } : { bottom: 0 }) }}
      >
        <div
          ref={panelRef}
          className={`bg-white ${panelAtTop
            ? 'rounded-b-[32px] shadow-[0_8px_48px_rgba(0,0,0,0.18)]'
            : 'rounded-t-[32px] shadow-[0_-8px_48px_rgba(0,0,0,0.18)]'
          }`}
          style={{
            transform: sheetTransform,
            transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
            ...(panelAtTop
              ? { paddingTop: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))', paddingBottom: '1.75rem' }
              : { paddingBottom: 'max(2.25rem, env(safe-area-inset-bottom, 2.25rem))' }
            ),
          }}
        >
          {/* Drag handle — top of sheet for bottom panel */}
          {!panelAtTop && (
            <div className="pt-4 px-6 pb-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
            </div>
          )}

          {/* Content */}
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
                className="text-[13px] font-semibold text-gray-400 active:text-black transition-colors cursor-pointer px-3 py-2 rounded-xl hover:bg-gray-100 -mr-2"
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

          {/* Drag handle — bottom of sheet for top panel */}
          {panelAtTop && (
            <div className="pb-2 px-6 pt-4">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
