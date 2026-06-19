import { Loader2 } from 'lucide-react';

interface StepLoadingProps {
  loadingText: string;
}

export function StepLoading({ loadingText }: StepLoadingProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-black/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-[-20px] bg-black/5 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
        <div className="relative w-24 h-24 bg-[#F4F4F5] border border-gray-200 rounded-full flex items-center justify-center">
          <Loader2 size={40} className="text-black animate-spin" />
        </div>
      </div>
      <h2 className="text-lg font-bold text-black text-center h-8 transition-opacity duration-300">{loadingText}</h2>
    </div>
  );
}
