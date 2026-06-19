import { Briefcase, Building2, Calculator } from 'lucide-react';
import type { EmploymentType } from '../../types';
import { OptionCard } from '../OptionCard';

interface StepEmploymentProps {
  selectedEmployment: EmploymentType | null;
  onSelect: (e: EmploymentType) => void;
}

const OPTIONS: { id: EmploymentType; icon: React.ReactNode; title: string; subtitle: string }[] = [
  { id: 'employed',     icon: <Briefcase size={20} />, title: 'Angestellt (Privatwirtschaft)',        subtitle: 'bAV & VL möglich' },
  { id: 'public',       icon: <Building2 size={20} />, title: 'Öffentlicher Dienst / Beamtenstatus',  subtitle: 'VBL-Pflichtversicherung aktiv' },
  { id: 'selfEmployed', icon: <Calculator size={20} />, title: 'Selbstständig / Freiberuflich',       subtitle: 'Freiwillige DRV oder Rürup-Rente' },
];

export function StepEmployment({ selectedEmployment, onSelect }: StepEmploymentProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <h1 className="text-2xl font-black text-black mb-3 leading-tight">Wo arbeitest du gerade?</h1>
      <p className="text-sm text-gray-500 mb-8 leading-relaxed">Damit wir die richtigen Rentenbausteine für dich aktivieren.</p>
      <div className="space-y-3">
        {OPTIONS.map((o) => (
          <OptionCard key={o.id} emoji={o.icon} title={o.title} subtitle={o.subtitle} selected={selectedEmployment === o.id} onClick={() => onSelect(o.id)} />
        ))}
      </div>
    </div>
  );
}
