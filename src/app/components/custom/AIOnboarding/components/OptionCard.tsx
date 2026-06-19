import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface OptionCardProps {
  emoji?: ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function OptionCard({ emoji, title, subtitle, onClick, selected = false, disabled = false }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full border p-5 rounded-2xl flex items-center justify-between transition-all text-left group ${
        selected
          ? 'bg-black/[0.04] border-black'
          : disabled
            ? 'bg-[#F4F4F5] border-gray-200 opacity-40 cursor-not-allowed'
            : 'bg-[#F9FAFB] border-gray-200 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'
      }`}
    >
      <div className="flex items-center gap-4">
        {emoji && <div className="flex items-center justify-center w-8 h-8 shrink-0 text-black">{emoji}</div>}
        <div>
          <h3 className="font-bold text-[15px] text-black">{title}</h3>
          {subtitle && <p className="text-[12px] text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={18} className={selected ? 'text-black' : 'text-gray-300 group-hover:text-gray-600 transition-colors'} />
    </button>
  );
}
