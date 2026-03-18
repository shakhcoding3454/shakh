import React from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  ChevronRight, 
  Award, 
  History, 
  CreditCard, 
  LogOut,
  Star,
  ShieldCheck,
  Moon,
  Bell,
  Languages,
  Edit2,
  Check,
  Camera,
  Crown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PaymentModal } from './PaymentModal';

interface ProfileProps {
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
}

export const Profile: React.FC<ProfileProps> = ({ userName, setUserName, userAvatar, setUserAvatar, isPremium, setIsPremium }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [tempName, setTempName] = React.useState(userName);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 1, label: "Til: O'zbekcha", icon: Languages, color: "text-brand-blue bg-blue-50" },
    { id: 2, label: "Bildirishnomalar", icon: Bell, color: "text-brand-orange bg-orange-50", toggle: true, value: isNotificationsEnabled, setter: setIsNotificationsEnabled },
    { id: 3, label: "Tungi rejim", icon: Moon, color: "text-indigo-600 bg-indigo-50", toggle: true, value: isDarkMode, setter: setIsDarkMode },
    ...(!isPremium ? [{ id: 6, label: "Premium obuna", icon: Crown, color: "text-amber-500 bg-amber-50", action: 'premium' }] : []),
    { id: 4, label: "Yordam markazi", icon: ShieldCheck, color: "text-green-600 bg-green-50" },
    { id: 5, label: "Ilova haqida", icon: Settings, color: "text-slate-600 bg-slate-50" },
  ];

  const badges = [
    { id: 1, icon: "🌟", label: "Yulduzcha", color: "bg-yellow-100" },
    { id: 2, icon: "📚", label: "Kitobxon", color: "bg-blue-100" },
    { id: 3, icon: "🚀", label: "Sarguzashtchi", color: "bg-purple-100" },
    { id: 4, icon: "🏆", label: "G'olib", color: "bg-orange-100" },
  ];

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMenuClick = (item: any) => {
    if (item.toggle) {
      item.setter(!item.value);
    } else if (item.action === 'premium') {
      setIsPaymentOpen(true);
    } else {
      alert(`${item.label} bo'limi tez kunda ishga tushadi!`);
    }
  };

  return (
    <div className={cn("flex-1 overflow-y-auto pb-24 px-6 pt-12 transition-colors duration-300", isDarkMode ? "bg-slate-900" : "bg-[#F5F9FF]")}>
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-[40px] bg-brand-light-blue p-1 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {isPremium && (
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
              <Crown className="w-5 h-5 text-white" />
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-600 transition-colors"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div className="flex items-center gap-2 group">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className={cn(
                  "text-2xl font-display font-bold bg-transparent border-b-2 border-brand-blue outline-none px-2 text-center",
                  isDarkMode ? "text-white" : "text-slate-800"
                )}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              />
              <button 
                onClick={handleSaveName}
                className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-sm"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <>
              <h2 className={cn("text-2xl font-display font-bold", isDarkMode ? "text-white" : "text-slate-800")}>{userName}</h2>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-white transition-colors"
              >
                <Edit2 size={16} />
              </button>
            </>
          )}
        </div>
        <p className="text-slate-400 font-medium text-sm">Daraja 5 • 1250 XP</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className={cn("p-4 rounded-3xl soft-shadow border flex flex-col items-center text-center", isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100")}>
          <span className="text-2xl font-display font-bold text-brand-blue">12</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kitoblar</span>
        </div>
        <div className={cn("p-4 rounded-3xl soft-shadow border flex flex-col items-center text-center", isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100")}>
          <span className="text-2xl font-display font-bold text-brand-orange">85%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-10">
        <h3 className={cn("text-lg font-display font-black mb-4", isDarkMode ? "text-white" : "text-slate-800")}>Mening Yutuqlarim</h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={cn(
                "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm border border-black/5",
                badge.color
              )}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[8px] font-black text-slate-600 uppercase">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <motion.button 
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMenuClick(item)}
            className={cn(
              "w-full p-4 rounded-2xl soft-shadow border flex items-center justify-between group transition-colors",
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={cn("font-bold text-sm", isDarkMode ? "text-slate-200" : "text-slate-700")}>{item.label}</span>
            </div>
            {item.toggle ? (
              <div className={cn(
                "w-10 h-5 rounded-full relative transition-colors",
                item.value ? "bg-brand-blue" : "bg-slate-300"
              )}>
                <motion.div 
                  animate={{ x: item.value ? 20 : 2 }}
                  className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                />
              </div>
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue transition-colors" />
            )}
          </motion.button>
        ))}
        
        <button 
          onClick={() => alert("Tizimdan chiqildi!")}
          className="w-full p-4 rounded-2xl flex items-center gap-4 text-red-500 font-bold text-sm mt-6"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          Chiqish
        </button>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={() => setIsPremium(true)}
      />
    </div>
  );
};
