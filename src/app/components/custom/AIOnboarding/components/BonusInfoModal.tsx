import { X, GraduationCap, CheckCircle2, FileText } from 'lucide-react';

interface BonusInfoModalProps {
  onClose: () => void;
}

export function BonusInfoModal({ onClose }: BonusInfoModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl px-6 pt-6 pb-10 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[17px] font-black text-black">Wie funktioniert das?</h3>
          <button onClick={onClose} className="w-8 h-8 bg-[#F4F4F5] hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
            <X size={16} className="text-black" />
          </button>
        </div>

        <div className="space-y-4 text-[14px] text-gray-600 leading-relaxed">
          <div className="bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4">
            <p className="font-bold text-black mb-1">Anrechnungszeiten bei der DRV</p>
            <p>
              Die Deutsche Rentenversicherung kennt sogenannte{' '}
              <strong className="text-black">Anrechnungszeiten</strong> — Lebensabschnitte, die trotz
              fehlender Beitragszahlung auf dein Rentenkonto eingetragen werden können.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <GraduationCap size={18} className="text-black shrink-0 mt-0.5" />
              <p>
                <strong className="text-black">Schul- &amp; Studienzeiten ab 17</strong> — Gymnasien,
                Berufsschulen, Hochschulen und Universitäten können als Anrechnungszeiten eingetragen werden.
              </p>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
              <p>
                Diese Zeiten gelten nach <strong className="text-black">§58 SGB VI</strong> als{' '}
                <strong className="text-black">unbewertete Anrechnungszeiten</strong> — sie bringen in
                der Regel keine direkten Entgeltpunkte, zählen aber vollwertig für deine{' '}
                <strong className="text-black">Wartezeit</strong>. Das ist entscheidend, z. B. um die{' '}
                <strong className="text-black">35-jährige Wartezeit</strong> für die Rente für langjährig
                Versicherte zu erreichen und damit früher in Rente gehen zu können.
              </p>
            </div>

            <div className="flex gap-3">
              <FileText size={18} className="text-black shrink-0 mt-0.5" />
              <p>
                <strong className="text-black">Formular V0100</strong> (allg. Kontenklärung) und{' '}
                <strong className="text-black">V0108</strong> (Schul-/Studienzeiten) — die offiziellen
                DRV-Anträge zur Eintragung deiner Anrechnungszeiten.
              </p>
            </div>
          </div>

          <p className="text-[12px] text-gray-400 pt-1">
            Quelle: Deutsche Rentenversicherung, §58 SGB VI (Anrechnungszeiten)
          </p>
        </div>
      </div>
    </div>
  );
}
