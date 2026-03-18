import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Library as LibraryIcon, 
  ClipboardCheck, 
  User as UserIcon 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Bosh sahifa', icon: Home, color: 'text-[#4A90E2]', activeBg: 'bg-transparent' },
    { id: 'library', label: 'Kutubxona', icon: LibraryIcon, color: 'text-white', activeBg: 'bg-[#FFA726]' },
    { id: 'tests', label: 'Testlar', icon: ClipboardCheck, color: 'text-white', activeBg: 'bg-[#4A90E2]' },
    { id: 'profile', label: 'Profil', icon: UserIcon, color: 'text-white', activeBg: 'bg-[#BA68C8]' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="flex flex-col items-center gap-1 flex-1"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            activeTab === tab.id ? tab.activeBg : "bg-transparent",
            activeTab === tab.id ? (tab.id === 'home' ? 'text-[#4A90E2]' : 'text-white') : "text-slate-400"
          )}>
            <tab.icon className={cn("w-6 h-6", activeTab === tab.id ? (tab.id === 'home' ? 'text-[#4A90E2]' : 'text-white') : "text-[#4A90E2]/40")} />
          </div>
          <span className={cn(
            "text-[10px] font-bold transition-all duration-300",
            activeTab === tab.id ? "text-[#1565C0]" : "text-slate-400"
          )}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};
