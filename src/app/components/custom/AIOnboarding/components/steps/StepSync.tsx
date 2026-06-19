import { CheckCircle2, Loader2 } from 'lucide-react';
import { TR_AGE, TR_SAVINGS } from '../../constants';

interface StepSyncProps {
  syncStep: number;
}

const SYNC_ITEMS = [
  { label: 'Alter erkannt',            value: `${TR_AGE} Jahre`,   threshold: 1 },
  { label: 'Aktive Sparpläne importiert', value: `${TR_SAVINGS} €/Mtl.`, threshold: 2 },
] as const;

export function StepSync({ syncStep }: StepSyncProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-2xl overflow-hidden mb-8 border border-gray-200 shadow-sm">
        <img src="/traderepublic_logo.jpg" alt="Trade Republic" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-xl font-black text-black mb-1 text-center">Trade Republic Profil</h2>
      <p className="text-[13px] text-gray-500 mb-10 text-center">Deine Daten werden synchronisiert...</p>
      <div className="w-full space-y-3">
        {SYNC_ITEMS.map((item) => {
          const done = syncStep >= item.threshold;
          return (
            <div key={item.label} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F9FAFB] border-gray-200 opacity-50'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${done ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                {done
                  ? <CheckCircle2 size={17} className="text-emerald-600" />
                  : <Loader2 size={17} className="text-gray-400 animate-spin" />}
              </div>
              <div>
                <p className="text-[13px] font-bold text-black leading-tight">{item.label}</p>
                {done && <p className="text-[12px] text-emerald-600 font-semibold mt-0.5 animate-in fade-in duration-300">{item.value}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
