import { useState } from "react";
import { ChevronRight, ChevronDown, X, Plus, Wallet, Info, Lock } from "lucide-react";

const assetInfo: Record<string, { headline: string; bullets: string[] }> = {
  statutory: {
    headline: 'Feste monatliche Auszahlung',
    bullets: [
      'Fließt direkt als feste Summe in die Rentenberechnung ein',
      'Trage den Bruttobetrag aus deiner Renteninformation ein',
      'Wird inflationsbereinigt für die reale Kaufkraftberechnung genutzt',
    ],
  },
  company: {
    headline: 'Feste monatliche Auszahlung',
    bullets: [
      'Bestehende bAV-Auszahlung fließt direkt ein',
      'Zusätzliche Beiträge aus dem Optimierungsplan werden separat angespart',
      'Entgeltumwandlung erhöht den Bruttoanteil um ca. Faktor 2,1',
    ],
  },
  etf: {
    headline: 'Wächst & wird verrentet',
    bullets: [
      'Startkapital wächst mit deiner Renditeerwartung (z.B. 7 % p.a.) bis zur Rente',
      'Wird dann als monatlicher Entnahmeplan über deine Lebenserwartung ausgezahlt',
      'Stresstest: optionaler –20 % Einmalschock beim Renteneintritt simulierbar',
    ],
  },
  crypto: {
    headline: 'Wie ETF gerechnet',
    bullets: [
      'Wird rechnerisch wie ETF-Kapital behandelt (gleiche Renditeerwartung)',
      'Startkapital wächst und fließt als monatlicher Entnahmeplan ein',
      'Krypto-Volatilität wird nicht separat modelliert — konservativer Ansatz',
    ],
  },
  cash: {
    headline: 'Puffer, erst zur Rente eingebracht',
    bullets: [
      'Cash wächst in der Ansparphase nicht (keine Verzinsung)',
      'Wird beim Renteneintritt als Einmalkapital eingebracht und dann ausgezahlt',
      'Wird zuerst für Lebensereignisse (Sabbatical, Hauskauf) verbraucht',
    ],
  },
  realestate: {
    headline: 'Mieteinnahme direkt + Wert im Nettovermögen',
    bullets: [
      'Monatliche Mietersparnis / Mieteinnahme fließt als feste Auszahlung ein',
      'Der Immobilienwert wird nur im Nettovermögen angezeigt, nicht verrentet',
      'Selbstgenutzte Immobilie ohne Mieteinnahme: Auszahlung auf 0 lassen',
    ],
  },
};

export interface Asset { id: string; name: string; subtitle: string; icon: any; payout: number; accumulatedLabel: string; accumulatedValue: number; locked?: boolean; }
interface AssetBreakdownProps { assets: Asset[]; onUpdateAsset: (id: string, payout: number, accumulatedValue: number) => void; combinedMonthlyNominal: number; }

export function AssetBreakdown({ assets, onUpdateAsset, combinedMonthlyNominal }: AssetBreakdownProps) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [inputPayout, setInputPayout] = useState("");
  const [inputAccumulated, setInputAccumulated] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const visibleAssets = assets.filter(a => a.id === 'statutory' || a.id === 'etf' || a.payout > 0 || a.accumulatedValue > 0);
  const hiddenAssets = assets.filter(a => !visibleAssets.includes(a));

  const handleRowClick = (asset: Asset) => {
    setEditingAsset(asset); setInputPayout(asset.payout.toString()); setInputAccumulated(asset.accumulatedValue.toString());
  };

  const handleSave = () => {
    if (editingAsset) {
      onUpdateAsset(editingAsset.id, parseFloat(inputPayout) || 0, parseFloat(inputAccumulated) || 0);
      setEditingAsset(null);
    }
  };

  const calculatedAssets = ["etf", "cash", "crypto"];

  return (
    <>
      <div className="px-6 mt-4 mb-6">

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full bg-[#F9FAFB] border border-gray-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-black/[0.06] flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-black" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-0.5">Rente zur Auszahlung (Nominal)</p>
              <p className="text-lg font-black text-black">€ {combinedMonthlyNominal.toLocaleString("de-DE", { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
          <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-black" : ""}`} />
        </button>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {visibleAssets.map((asset, i) => {
              const Icon = asset.icon;
              const isCalculated = calculatedAssets.includes(asset.id);
              const isLocked = !!asset.locked;

              return (
                <div
                  key={asset.id}
                  onClick={isLocked ? undefined : () => handleRowClick(asset)}
                  className={`flex items-center p-4 transition-colors ${i < visibleAssets.length - 1 ? "border-b border-gray-100" : ""} ${isLocked ? "opacity-60 cursor-default" : "cursor-pointer hover:bg-[#F9FAFB]"}`}
                >
                  <div className="relative w-10 h-10 rounded-xl bg-[#F4F4F5] flex items-center justify-center shrink-0 mr-3.5">
                    <Icon size={18} className="text-gray-500" strokeWidth={1.75} />
                    {isLocked && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                        <Lock size={8} className="text-white" strokeWidth={2.5} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black mb-0.5 truncate">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.subtitle}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-base font-extrabold text-black mb-0.5">
                      {isCalculated ? "Berechnet" : `€ ${asset.payout.toLocaleString("de-DE", { maximumFractionDigits: 0 })}`}
                    </p>
                    <p className="text-[11px] text-gray-500">€ {asset.accumulatedValue.toLocaleString("de-DE", { maximumFractionDigits: 0 })} {asset.accumulatedLabel}</p>
                  </div>
                  {isLocked
                    ? <Lock size={14} className="text-gray-300 ml-2.5 shrink-0" />
                    : <ChevronRight size={14} className="text-gray-300 ml-2.5 shrink-0" />
                  }
                </div>
              );
            })}
          </div>

          {hiddenAssets.length > 0 && (
            <>
              <button onClick={() => setShowAddMenu(!showAddMenu)} className="mt-3 flex items-center justify-center gap-2 w-full py-3 border border-dashed border-gray-300 hover:border-gray-500 rounded-xl text-gray-400 hover:text-black transition-colors cursor-pointer">
                <Plus size={16} /> <span className="text-[13px] font-bold">Neues Asset hinzufügen</span>
              </button>
              {showAddMenu && (
                <div className="mt-2 p-2 bg-white border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-sm">
                  {hiddenAssets.map(a => (
                    <div key={a.id} onClick={() => { setShowAddMenu(false); handleRowClick(a); }} className="flex items-center gap-3 p-3 hover:bg-[#F9FAFB] rounded-lg cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#F4F4F5] flex items-center justify-center"><a.icon size={14} className="text-gray-500" /></div>
                      <span className="text-sm font-bold text-black">{a.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mx-6 h-px bg-gray-100" />

      {editingAsset && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white border border-gray-200 w-full max-w-sm rounded-2xl p-6 relative shadow-xl">
            <button onClick={() => setEditingAsset(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#F4F4F5] text-gray-500 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer">
              <X size={16} />
            </button>
            <h3 className="text-base font-bold text-black mb-1">Bearbeiten: {editingAsset.name}</h3>
            <p className="text-xs text-gray-500 mb-5">Passe die Basiswerte für dein Profil an.</p>

            <div className="space-y-4">
              {!calculatedAssets.includes(editingAsset.id) && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    {editingAsset.id === "realestate" ? "Monatliche Mietersparnis / Miete (€)" : "Erwartete monatl. Auszahlung (€ Brutto)"}
                  </label>
                  <input type="number" value={inputPayout} onChange={(e) => setInputPayout(e.target.value)} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-3 py-2.5 text-base text-black focus:outline-none focus:border-black transition-colors" />
                </div>
              )}
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  {calculatedAssets.includes(editingAsset.id) ? "Aktuelles Startkapital (€)" : `Gesamtes angespartes Kapital (€)`}
                </label>
                <input type="number" value={inputAccumulated} onChange={(e) => setInputAccumulated(e.target.value)} className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl px-3 py-2.5 text-base text-black focus:outline-none focus:border-black transition-colors" />
              </div>
            </div>

            {editingAsset && assetInfo[editingAsset.id] && (
              <div className="mt-5 bg-[#F9FAFB] border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={13} className="text-gray-400 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Wie wird berechnet?</span>
                </div>
                <p className="text-[12px] font-bold text-black mb-2">{assetInfo[editingAsset.id].headline}</p>
                <ul className="space-y-1.5">
                  {assetInfo[editingAsset.id].bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600 leading-snug">
                      <span className="text-gray-300 font-bold shrink-0 mt-0.5">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={handleSave} className="w-full bg-black hover:bg-gray-900 text-white font-extrabold text-sm py-3 rounded-xl mt-4 transition-colors cursor-pointer">
              Änderungen speichern
            </button>
          </div>
        </div>
      )}
    </>
  );
}
