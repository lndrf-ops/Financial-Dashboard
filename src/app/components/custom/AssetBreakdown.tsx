import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { Switch } from "../ui/switch";

export interface Asset {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  payout: number;
  accumulatedLabel: string;
  accumulatedValue: number;
}

interface AssetBreakdownProps {
  isNetto: boolean;
  setIsNetto: (val: boolean) => void;
  assets: Asset[];
  onUpdateAsset: (id: string, payout: number, accumulatedValue: number) => void;
  combinedMonthlyNominal: number;
}

export function AssetBreakdown({ isNetto, setIsNetto, assets, onUpdateAsset, combinedMonthlyNominal }: AssetBreakdownProps) {
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [inputPayout, setInputPayout] = useState("");
  const [inputAccumulated, setInputAccumulated] = useState("");

  const handleRowClick = (asset: Asset) => {
    setEditingAsset(asset);
    setInputPayout(asset.payout.toString());
    setInputAccumulated(asset.accumulatedValue.toString());
  };

  const handleSave = () => {
    if (editingAsset) {
      onUpdateAsset(
        editingAsset.id, 
        parseFloat(inputPayout) || 0, 
        parseFloat(inputAccumulated) || 0
      );
      setEditingAsset(null);
    }
  };

  const calculatedAssets = ["etf", "cash", "crypto"];

  return (
    <>
      <div className="px-6 pt-8 pb-4 flex justify-between items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-1">Vermögensaufteilung</p>
          <p className="text-[13px] text-[#4a4a4a]">Klicke auf ein Asset zum Bearbeiten</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${!isNetto ? "text-white" : "text-[#6b6b6b]"}`}>Brutto</span>
            <Switch checked={isNetto} onCheckedChange={setIsNetto} className="scale-75 data-[state=checked]:bg-[#00e676]" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isNetto ? "text-[#00e676]" : "text-[#6b6b6b]"}`}>Netto</span>
          </div>
        </div>
      </div>

      <div className="mx-6 border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
        {assets.map((asset, i) => {
          const Icon = asset.icon;
          const isCalculated = calculatedAssets.includes(asset.id);
          
          return (
            <div 
              key={asset.id} 
              onClick={() => handleRowClick(asset)}
              className={`flex items-center p-4 cursor-pointer hover:bg-white/5 transition-colors ${i < assets.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mr-3.5">
                <Icon size={18} className="text-[#9a9a9a]" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white mb-0.5 truncate">{asset.name}</p>
                <p className="text-xs text-[#4a4a4a]">{asset.subtitle}</p>
              </div>
              <div className="text-right ml-3 shrink-0">
                <p className="text-base font-extrabold text-white mb-0.5">
                  {isCalculated ? "Berechnet" : `€ ${asset.payout.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`}
                </p>
                <p className="text-[11px] text-[#4a4a4a]">
                  € {asset.accumulatedValue.toLocaleString("de-DE")} {asset.accumulatedLabel}
                </p>
              </div>
              <ChevronRight size={14} className="text-[#3d3d3d] ml-2.5 shrink-0" />
            </div>
          );
        })}
      </div>

      <div className="mx-6 mt-3 px-5 py-4 bg-[#00e676]/5 border border-[#00e676]/15 rounded-xl flex items-center justify-between">
        <span className="text-[13px] text-[#9a9a9a] font-medium">Aktuelle Basisrente (Nominal)</span>
        <span className="text-xl font-black text-[#00e676] tracking-tight">
          € {combinedMonthlyNominal.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="mx-6 mt-9 h-px bg-white/5" />

      {/* MODAL: ASSET EDITIEREN */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setEditingAsset(null)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-base font-bold text-white mb-1">Bearbeiten: {editingAsset.name}</h3>
            <p className="text-xs text-zinc-500 mb-5">Passe die Basiswerte für dein Profil an.</p>
            
            <div className="space-y-4">
              {!calculatedAssets.includes(editingAsset.id) && (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    {editingAsset.id === "realestate" ? "Monatliche Mietersparnis / Miete (€)" : "Erwartete monatl. Auszahlung (€ Brutto)"}
                  </label>
                  <input 
                    type="number" 
                    value={inputPayout} 
                    onChange={(e) => setInputPayout(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e676]"
                  />
                </div>
              )}
              
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  {calculatedAssets.includes(editingAsset.id) ? "Aktuelles Startkapital (€)" : `Gesamtes angespartes Kapital (€)`}
                </label>
                <input 
                  type="number" 
                  value={inputAccumulated} 
                  onChange={(e) => setInputAccumulated(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00e676]"
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-[#00e676] hover:opacity-90 text-black font-extrabold text-sm py-3 rounded-xl mt-6 transition-opacity cursor-pointer"
            >
              Änderungen speichern
            </button>
          </div>
        </div>
      )}
    </>
  );
}