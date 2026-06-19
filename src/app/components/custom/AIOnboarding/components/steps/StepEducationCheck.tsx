import { GraduationCap, Briefcase, HelpCircle } from 'lucide-react';
import type { BonusOption } from '../../types';
import { OptionCard } from '../OptionCard';

interface StepEducationCheckProps {
  selectedBonusOption: BonusOption | null;
  onSelect: (o: BonusOption) => void;
  onOpenInfo: () => void;
}

export function StepEducationCheck({ selectedBonusOption, onSelect, onOpenInfo }: StepEducationCheckProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-2xl font-black text-black leading-tight">Lass uns versteckte Rentenzeiten sichern.</h1>
        <button
          onClick={onOpenInfo}
          className="flex-none w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer mt-0.5"
        >
          <HelpCircle size={16} className="text-gray-500" />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">
        Hast du nach deinem 17. Lebensjahr eine Schule besucht oder studiert?
      </p>
      <div className="space-y-3">
        <OptionCard
          emoji={<GraduationCap size={20} />}
          title="Ja, habe ich"
          subtitle="Wir prüfen auf eintragbare Anrechnungszeiten"
          selected={selectedBonusOption === 'yes'}
          onClick={() => onSelect('yes')}
        />
        <OptionCard
          emoji={<Briefcase size={20} />}
          title="Nein, direkt ins Berufsleben"
          selected={selectedBonusOption === 'no'}
          onClick={() => onSelect('no')}
        />
      </div>
    </div>
  );
}
