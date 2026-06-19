import { useEffect, useRef, useCallback } from 'react';
import { INCOMES, ITEM_H } from '../constants';

interface IncomeDrumPickerProps {
  value: number;
  onChange: (v: number) => void;
}

export function IncomeDrumPicker({ value, onChange }: IncomeDrumPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const idx = INCOMES.indexOf(value);
    el.scrollTop = (idx < 0 ? 1 : idx + 1) * ITEM_H;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    clearTimeout((handleScroll as any)._t);
    (handleScroll as any)._t = setTimeout(() => {
      const idx = Math.round(el.scrollTop / ITEM_H) - 1;
      const snapped = Math.max(0, Math.min(idx, INCOMES.length - 1));
      el.scrollTop = (snapped + 1) * ITEM_H;
      onChange(INCOMES[snapped]);
    }, 80);
  }, [onChange]);

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="relative h-[192px] w-36 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 z-10 border-y-2 border-black/20 bg-black/[0.03] rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-10 bg-gradient-to-t from-white to-transparent" />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll no-scrollbar"
          style={{ scrollSnapType: 'y mandatory' }}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {INCOMES.map((inc) => (
            <div
              key={inc}
              style={{ height: ITEM_H, scrollSnapAlign: 'center' }}
              className={`flex items-center justify-center font-black text-3xl transition-colors ${inc === value ? 'text-black' : 'text-gray-300'}`}
            >
              {inc.toLocaleString('de-DE')}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-2xl font-bold text-gray-400">€ / Monat</span>
    </div>
  );
}
