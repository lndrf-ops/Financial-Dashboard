import { SegmentDatum } from './hooks/useDashboardDerived';

interface RetirementRingProps {
  segmentData: SegmentDatum[];
  ringRadius: number;
  ringCircumference: number;
  realPurchasingPowerMonthly: number;
  targetPensionReal: number;
  hoveredSegment: number | null;
  onHover: (i: number | null) => void;
}

export function RetirementRing({
  segmentData,
  ringRadius,
  ringCircumference,
  realPurchasingPowerMonthly,
  targetPensionReal,
  hoveredSegment,
  onHover,
}: RetirementRingProps) {
  return (
    <div id="tutorial-dashboard-ring" className="flex items-center justify-center gap-2 py-2 px-4">
      {/* Left labels */}
      <div className="flex flex-col gap-4 w-[86px]">
        {segmentData.filter(s => s.side === 'left').map(s => {
          const isHovered = hoveredSegment === s.i;
          const anyHovered = hoveredSegment !== null;
          return (
            <div
              key={s.label}
              className="text-right cursor-pointer"
              style={{
                opacity: anyHovered && !isHovered ? 0.35 : 1,
                transform: isHovered ? 'scale(1.1)' : anyHovered ? 'scale(0.9)' : 'scale(1)',
                transformOrigin: 'right center',
                transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={() => onHover(s.i)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onHover(hoveredSegment === s.i ? null : s.i)}
            >
              <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
              <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
              <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>
                {Math.round((s.value / targetPensionReal) * 100)}% vom Ziel
              </p>
              <div className="flex justify-end mt-1">
                <div className="h-[2px] rounded-full transition-all duration-200" style={{ backgroundColor: s.color, width: isHovered ? '36px' : '28px' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ring SVG */}
      <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 224 224" className="w-full h-full transform -rotate-90 absolute inset-0">
          <circle cx="112" cy="112" r={ringRadius} stroke="currentColor" strokeWidth="14" fill="transparent" className="text-gray-100" />
          {segmentData.map(s => {
            const isHovered = hoveredSegment === s.i;
            const anyHovered = hoveredSegment !== null;
            return (
              <circle
                key={s.label}
                cx="112" cy="112" r={ringRadius}
                stroke={s.color}
                fill="transparent"
                strokeDasharray={`${s.segArc} ${ringCircumference - s.segArc}`}
                strokeDashoffset={ringCircumference - s.startArc}
                strokeLinecap="butt"
                style={{
                  strokeWidth: isHovered ? 20 : anyHovered ? 11 : 14,
                  opacity: anyHovered && !isHovered ? 0.25 : 1,
                  transition: 'stroke-width 200ms ease, opacity 200ms ease',
                }}
                onMouseEnter={() => onHover(s.i)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onHover(hoveredSegment === s.i ? null : s.i)}
                className="cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none text-center px-3">
          {hoveredSegment !== null && segmentData[hoveredSegment] ? (
            <>
              <span className="text-[9px] font-bold uppercase tracking-widest leading-tight transition-all duration-200" style={{ color: segmentData[hoveredSegment].color }}>
                {segmentData[hoveredSegment].label}
              </span>
              <span className="text-[22px] font-black text-black leading-tight mt-0.5">
                € {segmentData[hoveredSegment].value.toLocaleString('de-DE')}
              </span>
              <span className="text-[10px] mt-0.5 font-semibold" style={{ color: segmentData[hoveredSegment].color }}>
                {Math.round((segmentData[hoveredSegment].value / targetPensionReal) * 100)}% vom Ziel
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-tight">Mtl. Auszahlung</span>
              <span className="text-[22px] font-black text-black leading-tight mt-0.5">€ {realPurchasingPowerMonthly.toLocaleString('de-DE')}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Ziel: € {targetPensionReal.toLocaleString('de-DE')}</span>
            </>
          )}
        </div>
      </div>

      {/* Right labels */}
      <div className="flex flex-col gap-4 w-[86px]">
        {segmentData.filter(s => s.side === 'right').map(s => {
          const isHovered = hoveredSegment === s.i;
          const anyHovered = hoveredSegment !== null;
          return (
            <div
              key={s.label}
              className="text-left cursor-pointer"
              style={{
                opacity: anyHovered && !isHovered ? 0.35 : 1,
                transform: isHovered ? 'scale(1.1)' : anyHovered ? 'scale(0.9)' : 'scale(1)',
                transformOrigin: 'left center',
                transition: 'opacity 200ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={() => onHover(s.i)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onHover(hoveredSegment === s.i ? null : s.i)}
            >
              <div className="mb-1">
                <div className="h-[2px] rounded-full transition-all duration-200" style={{ backgroundColor: s.color, width: isHovered ? '36px' : '28px' }} />
              </div>
              <p className="text-[11px] font-bold text-black leading-tight">{s.label}</p>
              <p className="text-[12px] font-extrabold leading-tight" style={{ color: s.color }}>€ {s.value.toLocaleString('de-DE')}</p>
              <p className="text-[10px] font-semibold leading-tight mt-0.5" style={{ color: s.color }}>
                {Math.round((s.value / targetPensionReal) * 100)}% vom Ziel
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
