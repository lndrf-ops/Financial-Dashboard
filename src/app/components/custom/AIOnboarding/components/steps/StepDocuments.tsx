import { FileText, HelpCircle, CheckCircle2, Loader2, Calculator, TrendingUp } from 'lucide-react';
import type { DropState, ImportMethod } from '../../types';
import { MOCK_DETECTED, MOCK_DOC_TILES } from '../../constants';
import { OptionCard } from '../OptionCard';
import { IncomeDrumPicker } from '../IncomeDrumPicker';

interface StepDocumentsProps {
  dropState: DropState;
  processingStep: number;
  docSelected: boolean;
  importMethod: ImportMethod;
  onTileClick: () => void;
  onSelectManual: () => void;
  onOpenDocModal: () => void;
}

interface StepDocumentsIncomeProps {
  value: string;
  onChange: (v: string) => void;
}

export function StepDocumentsIncome({ value, onChange }: StepDocumentsIncomeProps) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <h1 className="text-2xl font-black text-black mb-3 leading-tight">Wie hoch ist dein aktuelles Netto-Einkommen?</h1>
      <p className="text-sm text-gray-500 mb-3 leading-relaxed">Wir schätzen daraus deine gesetzliche Rente und berechnen dein Rentenziel.</p>
      <div className="flex items-center gap-2 mb-8 bg-[#F9FAFB] border border-gray-200 rounded-xl px-3 py-2">
        <TrendingUp size={14} className="text-gray-400 shrink-0" />
        <p className="text-[11px] text-gray-500">Rentenziel wird automatisch auf <strong className="text-black">80 %</strong> deines Nettogehalts gesetzt.</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <IncomeDrumPicker value={parseInt(value) || 2500} onChange={(v) => onChange(String(v))} />
      </div>
    </div>
  );
}

export function StepDocuments({ dropState, processingStep, docSelected, importMethod, onTileClick, onSelectManual, onOpenDocModal }: StepDocumentsProps) {
  if (dropState === 'processing' || dropState === 'done') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
        <h1 className="text-2xl font-black text-black mb-2 leading-tight">Vorsorgepapiere werden analysiert.</h1>
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
          {dropState === 'processing' ? 'Analysiere 3 Dokumente...' : 'Alle Dokumente erkannt!'}
        </p>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-5">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 shrink-0">Demo</span>
          <span className="text-[11px] text-amber-700 leading-tight">Beispieldaten — in der fertigen App werden deine echten Dokumente aus der TR-Ablage ausgelesen.</span>
        </div>
        <div className="space-y-3">
          {MOCK_DETECTED.map((asset, idx) => {
            const detected = processingStep > idx;
            const loading = processingStep === idx && dropState === 'processing';
            const label = asset.type === 'drv' ? 'DRV Renteninformation' : asset.type === 'bAV' ? 'Allianz bAV' : 'Deka Riester-Rente';
            return (
              <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 ${detected ? 'bg-emerald-50 border-emerald-200' : loading ? 'bg-[#F9FAFB] border-gray-300' : 'bg-[#F9FAFB] border-gray-200 opacity-40'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${detected ? 'bg-emerald-100' : 'bg-[#F4F4F5]'}`}>
                  {detected ? <CheckCircle2 size={17} className="text-emerald-600" /> : loading ? <Loader2 size={17} className="text-gray-400 animate-spin" /> : <FileText size={17} className="text-gray-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-black leading-tight">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{asset.provider}</p>
                </div>
                {detected && (
                  <div className="text-right animate-in fade-in duration-300 shrink-0">
                    <p className="text-[14px] font-extrabold text-emerald-600">{asset.monthlyPayout.toLocaleString('de-DE')} €</p>
                    <p className="text-[10px] text-emerald-400">/ Monat</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {dropState === 'done' && (
          <div className="mt-5 p-4 bg-[#F9FAFB] border border-gray-200 rounded-2xl animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-gray-500 font-medium">Gesamt erkannte Rente</p>
              <p className="text-[18px] font-black text-black">
                {MOCK_DETECTED.reduce((s, a) => s + a.monthlyPayout, 0).toLocaleString('de-DE')} €/Mtl.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col flex-1">
      <h1 className="text-2xl font-black text-black mb-2 leading-tight">Deine Vorsorgepapiere.</h1>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        {docSelected && importMethod === 'manual'
          ? 'Dokumente gespeichert — Weiter schätzt via Gehalt. Oder wähle nur Dokumente.'
          : docSelected
            ? 'Sieht gut aus! Drücke auf Weiter — KI startet die Analyse.'
            : 'Tippe auf die Kachel — unsere KI liest deine Rentendokumente automatisch aus.'}
      </p>
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 shrink-0">Demo</span>
        <span className="text-[11px] text-amber-700 leading-tight">Beispieldaten — in der fertigen App werden deine echten TR-Dokumente automatisch ausgelesen.</span>
      </div>

      <button
        onClick={onTileClick}
        className={`w-full rounded-3xl transition-all mb-4 overflow-hidden ${
          docSelected && importMethod !== 'manual'
            ? 'border-2 border-black bg-black/[0.03] cursor-pointer p-5'
            : docSelected && importMethod === 'manual'
              ? 'border-2 border-dashed border-gray-400 bg-[#F9FAFB] cursor-pointer p-5 opacity-60'
              : 'border-2 border-dashed border-gray-300 hover:border-black bg-[#FAFAFA] hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center py-12 px-6 gap-4'
        }`}
      >
        {!docSelected ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-[#F4F4F5] flex items-center justify-center">
              <FileText size={26} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-black mb-1">Rentendokumente einlesen</p>
              <p className="text-[12px] text-gray-400">Einfach antippen — KI erledigt den Rest.</p>
            </div>
            <span className="text-[11px] bg-[#F4F4F5] px-3 py-1.5 rounded-full font-bold text-gray-500">Jetzt starten</span>
          </>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className={importMethod === 'manual' ? 'text-gray-400' : 'text-emerald-500'} />
                <p className={`text-[12px] font-bold ${importMethod === 'manual' ? 'text-gray-400' : 'text-black'}`}>3 Dokumente bereit</p>
              </div>
              {importMethod === 'manual' && (
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">Pausiert</span>
              )}
            </div>
            <div className="space-y-2">
              {MOCK_DOC_TILES.map((doc, idx) => (
                <div
                  key={idx}
                  className={`animate-in ${doc.dir === 'left' ? 'slide-in-from-left-8' : 'slide-in-from-right-8'} fade-in duration-700`}
                  style={{ animationDelay: `${idx * 320}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3">
                    <div className="w-9 h-9 bg-[#F9FAFB] rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[13px] text-black leading-tight truncate">{doc.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{doc.sub}</p>
                    </div>
                    <CheckCircle2 size={15} className={importMethod === 'manual' ? 'text-gray-300 shrink-0' : 'text-emerald-500 shrink-0'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </button>

      {!docSelected && (
        <button onClick={onOpenDocModal} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-black transition-colors mx-auto mb-6 cursor-pointer">
          <HelpCircle size={13} />
          Welche Dokumente kann ich hochladen?
        </button>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Oder</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>
      <OptionCard
        emoji={<Calculator size={20} />}
        title="Keine Dokumente zur Hand?"
        subtitle="Über aktuelles Gehalt schätzen"
        selected={importMethod === 'manual'}
        onClick={onSelectManual}
      />
    </div>
  );
}
