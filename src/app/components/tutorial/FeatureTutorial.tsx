import React, { useState, useLayoutEffect } from 'react';
import { X } from 'lucide-react';
import { FEATURE_STEPS } from './featureSteps';

interface FeatureTutorialProps {
  tab: string;
  step: number;
  total: number;
  onNext: () => void;
  onComplete: () => void;
}

export function FeatureTutorial({ tab, step, total, onNext, onComplete }: FeatureTutorialProps) {
  const feature = FEATURE_STEPS[tab]?.[step];
  const [spotRect, setSpotRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  useLayoutEffect(() => {
    if (!feature?.targetId) return;
    const el = document.getElementById(feature.targetId);
    if (!el) return;

    const navH = 68;
    const raw = el.getBoundingClientRect();
    const absoluteTop = raw.top + window.scrollY;
    const usableH = window.innerHeight - navH;
    const targetScrollY = Math.max(0, absoluteTop - Math.round((usableH - raw.height) / 2));
    window.scrollTo(0, targetScrollY);

    // Measure BEFORE locking overflow — on iOS, overflow:hidden on body resets scrollY to 0
    const r = el.getBoundingClientRect();
    setSpotRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    document.body.style.overflow = 'hidden';

    const savedPosition   = el.style.position;
    const savedZIndex     = el.style.zIndex;
    const savedBackground = el.style.background;
    el.style.position   = 'relative';
    el.style.zIndex     = '93';
    el.style.background = 'white';

    const handleResize = () => {
      const rr = el.getBoundingClientRect();
      setSpotRect({ top: rr.top, left: rr.left, width: rr.width, height: rr.height });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
      el.style.position   = savedPosition;
      el.style.zIndex     = savedZIndex;
      el.style.background = savedBackground;
    };
  }, [feature?.targetId]);

  if (!feature) { onComplete(); return null; }

  const vh = window.innerHeight;
  const navH = 68;
  const isLast = step === total - 1;
  const pad = 10;
  const spotTop = spotRect ? spotRect.top  - pad : -9999;
  const spotH   = spotRect ? spotRect.height + pad * 2 : 0;
  const cardH = 230;
  const gap = 24;
  const spaceBelow = spotRect ? vh - navH - (spotTop + spotH) - gap : 0;
  // bottom anchor when card goes above: prevents overlap regardless of actual card height
  const cardPositionStyle: React.CSSProperties = !spotRect
    ? { top: vh / 2 }
    : spaceBelow >= cardH
      ? { top: spotTop + spotH + gap }
      : { bottom: vh - (spotTop - gap) };

  return (
    <>
      <div
        className="fixed inset-0 z-[90]"
        style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0, background: 'rgba(15,23,42,0.82)', pointerEvents: 'none' }}
      />
      {spotRect && (
        <div
          className="fixed z-[95]"
          style={{
            top: spotRect.top - pad,
            left: spotRect.left - pad,
            width: spotRect.width + pad * 2,
            height: spotRect.height + pad * 2,
            borderRadius: 20,
            border: '1.5px solid rgba(255,255,255,0.4)',
            transition: 'top 320ms cubic-bezier(0.4,0,0.2,1), left 320ms, width 320ms, height 320ms',
            pointerEvents: 'none',
          }}
        />
      )}
      <div
        className="fixed inset-0 z-[96]"
        style={{ maxWidth: 430, margin: '0 auto', left: 0, right: 0, pointerEvents: 'none' }}
      >
        <div
          key={`${tab}-${step}`}
          className="absolute left-4 right-4 bg-white rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          style={{ ...cardPositionStyle, pointerEvents: 'auto' }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-[16px] font-black text-black leading-tight">{feature.title}</h3>
            <button onClick={onComplete} className="text-gray-300 hover:text-black cursor-pointer shrink-0 mt-0.5">
              <X size={15} />
            </button>
          </div>
          <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{feature.text}</p>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-300 ${i === step ? 'bg-black' : i < step ? 'bg-gray-400' : 'bg-gray-100'}`} />
              ))}
            </div>
            <button
              onClick={isLast ? onComplete : onNext}
              className="bg-black text-white text-[13px] font-extrabold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              {isLast ? 'Fertig' : 'Weiter →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
