import { ArrowLeft } from 'lucide-react';
import type { BottomNavConfig } from '../types';

export function BottomNav({ onNext, nextDisabled = false, nextLabel = 'Weiter', onBack, hideNext = false }: BottomNavConfig) {
  return (
    <div className="flex gap-3">
      {onBack
        ? <button onClick={onBack} className="flex-none w-14 bg-[#F4F4F5] hover:bg-gray-200 text-black rounded-xl transition-colors cursor-pointer flex items-center justify-center">
            <ArrowLeft size={20} />
          </button>
        : <div className="flex-none w-14" />
      }
      {!hideNext && (
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 bg-black hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold text-[15px] py-4 rounded-xl transition-colors cursor-pointer"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
