import { useState } from "react";
import { Building2, TrendingUp, Briefcase, ChevronRight, UploadCloud, X, FileText } from "lucide-react";
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
  // State für die interaktiven Modals
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [inputPayout, setInputPayout] = useState("");
  const [inputAccumulated, setInputAccumulated] = useState("");
  
  // NEU: State für das Upload-Fenster
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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

  return (
    <>
      <div className="px-6 pt-8 pb-4 flex justify-between items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[#6b6b6b] mb-1">Asset Breakdown</p>
          <p className="text-[13px] text-[#4a4a4a]">Click any asset to customize</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* NEU: OnClick Event öffnet das Upload-Modal */}
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#00e676]/10 text-[#00e676] hover:bg-[#00e676]/20 transition-colors px-2.5 py-1.5 rounded-lg border border-[#00e676]/20 cursor-pointer"
          >
            <UploadCloud size={14} strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sync</span>
          </button>

          <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/10">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${!isNetto ? "text-white" : "text-[#6b6b6b]"}`}>Gross</span>
            <Switch checked={isNetto} onCheckedChange={setIsNetto} className="scale-75 data-[state=checked]:bg-[#00e676]" />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isNetto ? "text-[#00e676]" : "text-[#6b6b6b]"}`}>Net</span>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="mx-6 border border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a]">
        {assets.map((asset, i) => {
          const Icon = asset.icon;
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
                  € {asset.id === "etf" ? "Calculated" : asset.payout.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-[#4a4a4a]">
                  {asset.id === "etf" 
                    ? `€ ${asset.accumulatedValue.toLocaleString("de-DE")} portfolio` 
                    : `€ ${asset.accumulatedValue.toLocaleString("de-DE")} ${asset.accumulatedLabel}`}
                </p>
              </div>
              <ChevronRight size={14} className="text-[#3d3d3d] ml-2.5 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Combined Monthly Row */}
      <div className="mx-6 mt-3 px-5 py-4 bg-[#00e676]/5 border border-[#00e676]/15 rounded-xl flex items-center justify-between">
        <span className="text-[13px] text-[#9a9a9a] font-medium">Combined Current Base (Nominal)</span>
        <span className="text-xl font-black text-[#00e676] tracking-tight">
          € {combinedMonthlyNominal.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="mx-6 mt-9 h-px bg-white/5" />

      {/* ---------------------------------------------------- */}
      {/* 1. MODAL: ASSET EDITIEREN (Bestehend)                  */}
      {/* ---------------------------------------------------- */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setEditingAsset(null)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-base font-bold text-white mb-1">Edit {editingAsset.name}</h3>
            <p className="text-xs text-zinc-500 mb-5">Adjust the baseline parameters for your middle-class setup.</p>
            
            <div className="space-y-4">
              {editingAsset.id !== "etf" && (
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                    Expected Monthly Payout (€ Gross)
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
                  {editingAsset.id === "etf" ? "Current Portfolio Start Capital (€)" : `Total Vested ${editingAsset.accumulatedLabel} (€)`}
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
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. MODAL: MOCKUP UPLOAD FENSTER (NEU)                  */}
      {/* ---------------------------------------------------- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-[#0d0d0d] border border-white/10 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setIsUploadModalOpen(false)} 
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <div className="mb-6">
              <h3 className="text-lg font-black text-white mb-1 tracking-tight">Sync DRV Data</h3>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">
                Upload your official annual pension statement ("Renteninformation"). FutureMe's AI will securely extract your entitlements and auto-fill your profile.
              </p>
            </div>
            
            {/* Dashed Dropzone */}
            <div 
              className="border-2 border-dashed border-white/15 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              onClick={() => {
                alert("Upload simulator triggered! In a real app, this would open the file browser.");
                setIsUploadModalOpen(false);
              }}
            >
              <div className="w-14 h-14 rounded-full bg-[#00e676]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={28} className="text-[#00e676]" strokeWidth={1.5} />
              </div>
              <p className="text-[15px] font-bold text-white mb-1">Select PDF document</p>
              <p className="text-[12px] text-[#6b6b6b]">or drag and drop here</p>
              <p className="text-[10px] text-zinc-500 mt-4 uppercase tracking-wider font-semibold">Max file size 5MB</p>
            </div>

            <button 
              onClick={() => setIsUploadModalOpen(false)}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-[13px] py-3 rounded-xl mt-4 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}