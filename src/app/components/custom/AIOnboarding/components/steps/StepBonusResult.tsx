import { CheckCircle2 } from 'lucide-react';

interface StepBonusResultProps {
  educationTimesFound: boolean;
}

export function StepBonusResult({ educationTimesFound }: StepBonusResultProps) {
  if (educationTimesFound) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1 justify-center text-center">
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-black mb-4">Deine Rentenzeiten werden gesichert.</h1>
        <p className="text-gray-500 leading-relaxed px-4 mb-8">
          Deine Schul- und Studienzeiten ab 17 können als{' '}
          <strong className="text-black">Anrechnungszeiten</strong> bei der DRV eingetragen werden.
          Das bringt zwar keine direkten Entgeltpunkte — zählt aber vollwertig für deine{' '}
          <strong className="text-black">Wartezeit</strong> und kann dir ermöglichen, früher in Rente zu
          gehen. Wir legen die Anträge{' '}
          <strong className="text-black">V0100 &amp; V0108</strong> automatisch in deinen Optimierungsplan.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 flex flex-col flex-1 justify-center text-center">
      <div className="w-20 h-20 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-black text-black mb-4">Alles erfasst!</h1>
      <p className="text-gray-500 leading-relaxed px-4 mb-8">
        Dein Rentenverlauf scheint lückenlos zu sein.
      </p>
    </div>
  );
}
