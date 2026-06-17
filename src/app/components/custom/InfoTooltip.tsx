import { useState, useRef, useEffect } from "react";

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.top - 10, left: rect.left + rect.width / 2 });
    }
    setOpen(o => !o);
  };

  return (
    <span className="inline-flex items-center align-middle">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center transition-colors cursor-pointer ml-1 shrink-0"
        aria-label="Erklärung"
      >
        <span className="text-[9px] font-black leading-none select-none">i</span>
      </button>

      {open && (
        <div
          ref={tooltipRef}
          className="fixed w-64 bg-[#1C1C1E] text-white text-[12px] leading-relaxed p-3.5 rounded-xl shadow-2xl z-[200] -translate-x-1/2 -translate-y-full"
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #1C1C1E',
            }}
          />
        </div>
      )}
    </span>
  );
}
