import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  ChevronRight, 
  Award, 
  History, 
  CreditCard, 
  LogOut,
  Star,
  ShieldCheck,
  Bell,
  Languages,
  Edit2,
  Check,
  Camera,
  Crown,
  Send,
  Bot,
  User,
  X,
  MessageCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PaymentModal } from './PaymentModal';
import { GoogleGenAI } from "@google/genai";

interface ProfileProps {
  userName: string;
  setUserName: (name: string) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  userName, 
  setUserName, 
  userAvatar, 
  setUserAvatar, 
  isPremium, 
  setIsPremium,
  onLogout
}) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);
  const [tempName, setTempName] = React.useState(userName);
  const [chatInput, setChatInput] = React.useState('');
  const [chatMessages, setChatMessages] = React.useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Salom! Men SmartBook yordamchisiman. Ilova haqida savollaringiz bormi?" }
  ]);
  const [isAiLoading, setIsAiLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Siz 'SmartBook' ilovasining yordamchisisiz. Bu ilova bolalar uchun interaktiv kitoblar, testlar va vazifalar to'plamidir. Ilovada premium obuna, kutubxona, testlar va profil bo'limlari bor. Dasturchi: @bshaxriyor (Telegram). Faqat ilovaga bog'liq savollarga javob bering. Javoblar qisqa, tushunarli va bolalarbop bo'lsin. O'zbek tilida javob bering.",
        },
      });
      
      const aiText = response.text || "Kechirasiz, savolingizni tushunmadim. Iltimos, qaytadan urinib ko'ring.";
      setChatMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Texnik nosozlik yuz berdi. Iltimos, birozdan so'ng urinib ko'ring." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const menuItems = [
    { id: 1, label: "Til: O'zbekcha", icon: Languages, color: "text-brand-blue bg-blue-50" },
    { id: 2, label: "Bildirishnomalar", icon: Bell, color: "text-brand-orange bg-orange-50", toggle: true, value: isNotificationsEnabled, setter: setIsNotificationsEnabled },
    ...(!isPremium ? [{ id: 6, label: "Premium obuna", icon: Crown, color: "text-amber-500 bg-amber-50", action: 'premium' }] : []),
    { id: 4, label: "Yordam markazi", icon: MessageCircle, color: "text-green-600 bg-green-50", action: 'help' },
    { id: 5, label: "Ilova haqida", icon: Info, color: "text-slate-600 bg-slate-50", action: 'about' },
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
    } else if (item.action === 'help') {
      setIsHelpOpen(true);
    } else if (item.action === 'about') {
      setIsAboutOpen(true);
    } else {
      alert(`${item.label} bo'limi tez kunda ishga tushadi!`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12 bg-[#F5F9FF]">
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
                className="text-2xl font-display font-bold bg-transparent border-b-2 border-brand-blue outline-none px-2 text-center text-slate-800"
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
              <h2 className="text-2xl font-display font-bold text-slate-800">{userName}</h2>
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
        <div className="p-4 rounded-3xl soft-shadow border flex flex-col items-center text-center bg-white border-slate-100">
          <span className="text-2xl font-display font-bold text-brand-blue">12</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kitoblar</span>
        </div>
        <div className="p-4 rounded-3xl soft-shadow border flex flex-col items-center text-center bg-white border-slate-100">
          <span className="text-2xl font-display font-bold text-brand-orange">85%</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-10">
        <h3 className="text-lg font-display font-black mb-4 text-slate-800">Mening Yutuqlarim</h3>
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
            className="w-full p-4 rounded-2xl soft-shadow border flex items-center justify-between group transition-colors bg-white border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-slate-700">{item.label}</span>
            </div>
            {item.toggle ? (
              <div className={cn(
                "w-10 h-6 rounded-full relative transition-colors flex items-center px-1",
                item.value ? "bg-brand-blue" : "bg-slate-300"
              )}>
                <motion.div 
                  animate={{ x: item.value ? 16 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </div>
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-blue transition-colors" />
            )}
          </motion.button>
        ))}
        
        <button 
          onClick={onLogout}
          className="w-full p-4 rounded-2xl flex items-center gap-4 text-red-500 font-bold text-sm mt-6 hover:bg-red-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          Chiqish
        </button>
      </div>

      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-display font-black text-slate-800">Yordam Markazi</h3>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">AI Yordamchi Online</p>
                </div>
              </div>
              <button onClick={() => setIsHelpOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    msg.role === 'user' ? "bg-brand-blue" : "bg-slate-100"
                  )}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-blue" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-brand-blue text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isAiLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-slate-100">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                  placeholder="Savolingizni yozing..."
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:border-brand-blue transition-all text-sm"
                />
                <button
                  onClick={handleAiChat}
                  disabled={!chatInput.trim() || isAiLoading}
                  className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 disabled:opacity-50 transition-all active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isAboutOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-white">
            <div className="p-6 flex items-center justify-between">
              <h3 className="font-display font-black text-2xl text-slate-800">Ilova haqida</h3>
              <button onClick={() => setIsAboutOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-brand-blue/10 rounded-[40px] flex items-center justify-center mx-auto">
                  <Info className="w-12 h-12 text-brand-blue" />
                </div>
                <div>
                  <h4 className="text-xl font-display font-black text-slate-800">SmartBook v2.5.0</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Interaktiv ta'lim platformasi</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <h5 className="font-bold text-slate-800 mb-2">Ilova maqsadi</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    SmartBook - bu bolalar uchun mo'ljallangan zamonaviy interaktiv kitobxon ilovasi. Bizning maqsadimiz bolalarni kitob o'qishga qiziqtirish va ularning bilimlarini interaktiv testlar hamda vazifalar orqali mustahkamlashdir.
                  </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                  <h5 className="font-bold text-slate-800 mb-4">Dasturchi ma'lumotlari</h5>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Telegram</p>
                        <p className="font-bold text-slate-800">@bshaxriyor</p>
                      </div>
                    </div>
                    <a 
                      href="https://t.me/bshaxriyor" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center pt-8">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2026 SmartBook Team. Barcha huquqlar himoyalangan.</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={() => setIsPremium(true)}
      />
    </div>
  );
};
