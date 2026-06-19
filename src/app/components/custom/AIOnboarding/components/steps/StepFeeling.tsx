import { EyeOff, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { FeelingOption } from '../../types';
import { OptionCard } from '../OptionCard';

interface StepFeelingProps {
  selectedFeeling: FeelingOption | null;
  onSelect: (f: FeelingOption) => void;
}

const OPTIONS: { id: FeelingOption; icon: React.ReactNode; title: string; subtitle: string }[] = [
  { id: 'ignore',  icon: <EyeOff size={20} />,       title: 'Ich verdränge es',   subtitle: 'Ist mir noch zu weit weg' },
  { id: 'worried', icon: <AlertTriangle size={20} />, title: 'Macht mir Sorgen',   subtitle: 'Ich habe Angst vor der Lücke' },
  { id: 'relaxed', icon: <CheckCircle2 size={20} />,  title: 'Bin entspannt',      subtitle: 'Ich habe bereits einen Plan' },
];

export function StepFeeling({ selectedFeeling, onSelect }: StepFeelingProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <h1 className="text-2xl font-black text-black mb-3 leading-tight">Altersvorsorge. Ein lästiges Thema.</h1>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">Wie fühlst du dich, wenn du an deine Rente denkst?</p>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} emoji={o.icon} title={o.title} subtitle={o.subtitle} selected={selectedFeeling === o.id} onClick={() => onSelect(o.id)} />
        ))}
      </div>
    </div>
  );
}
