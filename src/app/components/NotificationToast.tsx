import { Bell, CheckCircle2, X } from 'lucide-react';

interface NotificationToastProps {
  message: string;
  onDismiss: () => void;
}

export function NotificationToast({ message, onDismiss }: NotificationToastProps) {
  const isSuccess = message.includes('Glückwunsch');
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[380px] z-[100] bg-white border border-gray-200 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 shadow-xl transition-all animate-in fade-in slide-in-from-top-4">
      <div className="w-8 h-8 rounded-full bg-[#F4F4F5] flex items-center justify-center shrink-0 mt-0.5">
        {isSuccess ? <CheckCircle2 size={16} className="text-black" /> : <Bell size={16} className="text-black" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-black mb-0.5">{isSuccess ? 'Ziel erreicht!' : 'Information'}</p>
        <p className="text-xs text-gray-600 leading-relaxed">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-gray-400 hover:text-black cursor-pointer">
        <X size={14} />
      </button>
    </div>
  );
}
