import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, MessageCircle, Sliders, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: "dashboard", label: "Übersicht", icon: LayoutDashboard, finn: false },
  { id: "invest",    label: "Invest",    icon: TrendingUp,      finn: false },
  { id: "chat",      label: "Finn",      icon: MessageCircle,   finn: true  },
  { id: "simulate",  label: "Simulation",icon: Sliders,         finn: false },
  { id: "profile",   label: "Profil",    icon: User,            finn: false },
] as const;

interface BottomNavBarProps {
  activeView: string;
  onNavigate: (id: string) => void;
}

export function BottomNavBar({ activeView, onNavigate }: BottomNavBarProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-white/90 backdrop-blur-xl border-t border-gray-100 pt-2.5 flex justify-around items-center"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      {NAV_ITEMS.map(({ id, label, icon: Icon, finn }, idx) => {
        const hovIdx = NAV_ITEMS.findIndex(t => t.id === hoveredTab);
        const dist = hovIdx === -1 ? 99 : Math.abs(idx - hovIdx);
        const scale = dist === 0 ? 1.22 : 1;
        const isActive = activeView === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            onMouseEnter={() => setHoveredTab(id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{ transform: `scale(${scale})`, transition: 'transform 180ms cubic-bezier(0.34,1.56,0.64,1)' }}
            className="relative flex flex-col items-center gap-1 min-w-[48px] py-1 cursor-pointer origin-bottom"
          >
            {finn ? (
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-black' : 'bg-black/80'}`}>
                <Icon size={17} className="text-white" strokeWidth={isActive ? 2.5 : 2} />
              </div>
            ) : (
              <Icon size={17} strokeWidth={isActive ? 2.5 : 1.75} className={isActive ? 'text-black' : 'text-gray-400'} />
            )}
            <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
