import { X, Building2, FileText, Shield } from 'lucide-react';
import { DOC_CATEGORIES } from '../constants';

interface DocInfoModalProps {
  onClose: () => void;
}

const CATEGORY_ICON = { Gesetzlich: Building2, Betrieblich: FileText, Privat: Shield } as const;

export function DocInfoModal({ onClose }: DocInfoModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[17px] font-black text-black">Unterstützte Dokumente</h3>
          <button onClick={onClose} className="w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} className="text-black" />
          </button>
        </div>
        <div className="space-y-6">
          {DOC_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON[cat.label as keyof typeof CATEGORY_ICON] ?? FileText;
            return (
              <div key={cat.label}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className="text-gray-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cat.label}</p>
                </div>
                <div className="space-y-2">
                  {cat.docs.map((doc) => (
                    <div key={doc} className="flex items-center gap-3 py-1.5 px-3 bg-[#F9FAFB] rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <p className="text-[13px] text-black font-medium">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
