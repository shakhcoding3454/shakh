import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  ChevronRight, 
  Play, 
  Trophy, 
  Lock, 
  CheckCircle2,
  Calculator,
  BookOpen,
  Languages,
  Lightbulb,
  X,
  Crown,
  Check,
  Star
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PaymentModal } from './PaymentModal';
import confetti from 'canvas-confetti';

interface DashboardProps {
  userName: string;
  userAvatar: string | null;
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  onNavigate: (tab: string, category?: string, openBookId?: string) => void;
  onAdminTrigger: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userName, userAvatar, isPremium, setIsPremium, onNavigate, onAdminTrigger }) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAllTasksOpen, setIsAllTasksOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ id: number; title: string; time: string; done: boolean; description: string; exercises?: string[] } | null>(null);
  const [stars, setStars] = useState(124);
  const [streak, setStreak] = useState(5);

  const subjects = [
    { id: 'math', name: 'Matematika', icon: Calculator, color: 'bg-[#26A69A]', category: 'Ilmiy' },
    { id: 'reading', name: "O'qish", icon: BookOpen, color: 'bg-[#FF7043]', category: 'Ertaklar' },
    { id: 'english', name: 'Ingliz tili', icon: Languages, color: 'bg-[#42A5F5]', category: 'Ingliz tili' },
    { id: 'logic', name: 'Mantiq', icon: Lightbulb, color: 'bg-[#FFA726]', category: 'Mantiq' },
  ];

  const notifications = [
    { id: 1, title: 'Yangi kitob qo\'shildi!', description: '"Zumrad va Qimmat" ertagi endi kutubxonada.', time: '5 daqiqa oldin' },
    { id: 2, title: 'Vazifa tekshirildi', description: 'Matematika vazifangiz 5 bahoga baholandi.', time: '2 soat oldin' },
  ];

  const leaderboard = [
    { id: 1, name: 'Asilbek', xp: 2450, level: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Asil' },
    { id: 2, name: userName, xp: 1250, level: 5, avatar: userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`, isMe: true },
    { id: 3, name: 'Madina', xp: 1100, level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Madi' },
    { id: 4, name: 'Jasur', xp: 950, level: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasur' },
    { id: 5, name: 'Laylo', xp: 800, level: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laylo' },
  ];

  const [tasks, setTasks] = useState([
    { 
      id: 1,
      title: 'Matematika: 12-mavzu', 
      time: '14:00', 
      done: true, 
      description: '12-mavzudagi misollarni yechish va tekshirish.',
      exercises: ['5 + 5 = ?', '10 - 3 = ?', '2 * 4 = ?']
    },
    { 
      id: 2,
      title: 'Ingliz tili: Lug\'at', 
      time: '16:30', 
      done: false, 
      description: 'Yangi 10 ta so\'zni yodlash va talaffuzini mashq qilish.',
      exercises: ['Apple - Olma', 'Book - Kitob', 'Sun - Quyosh']
    },
    { 
      id: 3,
      title: 'Ertak o\'qish', 
      time: '18:00', 
      done: false, 
      description: '"Zumrad va Qimmat" ertagini oxirigacha o\'qish.',
      exercises: ['Ertak qahramonlarini sanab bering', 'Ertak mazmunini so\'zlab bering']
    },
    { 
      id: 4,
      title: 'Rasm chizish', 
      time: '19:30', 
      done: false, 
      description: 'Tabiat manzarasi rasmini chizish.',
      exercises: ['Daraxt chizish', 'Quyosh chizish', 'Uy chizish']
    },
  ]);

  const handleCompleteTask = (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, done: true } : t));
    setStars(prev => prev + 10);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF7043', '#4A90E2', '#66BB6A']
    });
    setSelectedTask(null);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#F5F9FF]">
      {/* Header Section */}
      <div className="relative h-44 bg-gradient-to-b from-[#4A90E2] to-[#357ABD] header-wave shadow-lg overflow-hidden">
        {/* Floating Stars Background */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3 + i, 
              repeat: Infinity,
              delay: i * 0.5
            }}
            className="absolute text-white/20"
            style={{ 
              top: `${Math.random() * 80}%`, 
              left: `${Math.random() * 90}%` 
            }}
          >
            <Star size={16 + i * 4} fill="currentColor" />
          </motion.div>
        ))}

        <div className="relative z-10 p-6 pt-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 rounded-2xl bg-white p-0.5 border-2 border-white/40 overflow-hidden shadow-xl"
              >
                <img 
                  src={userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div>
                <h1 
                  onClick={onAdminTrigger}
                  className="text-white font-display font-black text-2xl tracking-tight cursor-pointer select-none active:scale-95 transition-transform drop-shadow-md"
                >
                  SmartBook
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    <Star size={10} className="text-yellow-300 fill-yellow-300" />
                    <span className="text-[10px] font-black text-white">{stars}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                    <span className="text-orange-400">🔥</span>
                    <span className="text-[10px] font-black text-white">{streak} kun</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center relative backdrop-blur-md border border-white/20 shadow-inner"
              >
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5252] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#4A90E2] shadow-lg">2</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 space-y-6">
        {/* User Greeting & Progress */}
        <div className="space-y-3 pt-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-slate-800 font-display font-black text-2xl">Salom, {userName}! 👋</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Bugun sarguzashtlar kutmoqda!</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-blue-500 uppercase">Daraja 5</span>
              <div className="flex items-center gap-1">
                <Trophy size={14} className="text-amber-500" />
                <span className="text-sm font-black text-slate-700">1250 XP</span>
              </div>
            </div>
          </div>
          
          <div className="relative pt-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1 uppercase tracking-tighter">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-1 border border-slate-100 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                className="h-full bg-gradient-to-r from-[#FFA726] to-[#FF7043] rounded-full shadow-[0_0_10px_rgba(255,167,38,0.4)] relative"
              >
                <motion.div 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full mr-1 opacity-50"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800">O'qishni davom ettiring</h2>
            <button 
              onClick={() => onNavigate('library', 'Barchasi')}
              className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
            >
              Hammasi
            </button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('library', 'Ilmiy', '1')}
            className="w-full bg-white rounded-[32px] p-4 flex items-center gap-4 shadow-sm border border-slate-100 transition-all"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-slate-800 mb-1 text-sm">Alisher Navoiy: Hayoti...</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[80%]" />
                </div>
                <span className="text-[10px] font-bold text-slate-400">80%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Oxirgi marta: 2 soat oldin</p>
            </div>
            <ChevronRight className="text-slate-300" />
          </motion.button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {subjects.map((subject, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate('library', subject.category)}
              className="flex flex-col items-center gap-2"
            >
              <div className={cn(
                "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg border-b-4 border-black/10",
                subject.color
              )}>
                <subject.icon className="w-8 h-8 text-white drop-shadow-md" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">{subject.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Today's Tasks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800">Bugungi vazifalar</h2>
            <button 
              onClick={() => setIsAllTasksOpen(true)}
              className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
            >
              Hammasi
            </button>
          </div>
          <div className="bg-white rounded-[32px] p-2 shadow-sm border border-slate-100">
            {tasks.slice(0, 2).map((task, i) => (
              <motion.div 
                key={i} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTask(task)}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors",
                  task.done ? "bg-green-500 border-green-500" : "border-slate-200"
                )}>
                  {task.done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <h4 className={cn("font-bold text-sm", task.done ? "text-slate-400 line-through" : "text-slate-700")}>
                    {task.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">{task.time}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-[#1565C0] rounded-[32px] p-6 text-white relative overflow-hidden mb-6 shadow-xl">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm mb-1">Sizning o'rningiz</p>
            <h3 className="text-3xl font-black mb-4">2-o'rin</h3>
            <button 
              onClick={() => setIsLeaderboardOpen(true)}
              className="bg-white text-[#1565C0] px-6 py-2 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-transform"
            >
              Batafsil
            </button>
          </div>
          <div className="absolute top-4 right-4 opacity-20">
            <Trophy size={80} />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
        </div>

        {/* Premium Banner */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-[#FFD54F] to-[#FFA000] rounded-[32px] p-6 text-white flex items-center justify-between mb-8 shadow-lg">
            <div className="flex-1">
              <h3 className="text-xl font-black mb-1">Premium obuna</h3>
              <p className="text-amber-50 text-xs mb-4">Barcha kitoblardan cheksiz foydalaning</p>
              <button 
                onClick={() => setIsPaymentOpen(true)}
                className="bg-white text-[#FFA000] px-6 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform"
              >
                Sotib olish
              </button>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAllTasksOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllTasksOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-slate-800">Barcha vazifalar</h3>
                <button onClick={() => setIsAllTasksOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {tasks.map((task, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      setSelectedTask(task);
                      setIsAllTasksOpen(false);
                    }}
                    className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer border border-slate-100"
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center",
                      task.done ? "bg-green-500 border-green-500" : "border-slate-200"
                    )}>
                      {task.done && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1">
                      <h4 className={cn("font-bold text-sm", task.done ? "text-slate-400 line-through" : "text-slate-700")}>
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">{task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden text-center"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{selectedTask.title}</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {selectedTask.description}
              </p>

              {selectedTask.exercises && (
                <div className="mb-8 text-left space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mashqlar / Testlar</p>
                  {selectedTask.exercises.map((ex, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 font-medium flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-[10px] text-blue-600 font-bold">{i + 1}</div>
                      {ex}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm"
                >
                  Yopish
                </button>
                {!selectedTask.done && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => handleCompleteTask(selectedTask.id)}
                    className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                    Bajardim
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {isLeaderboardOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeaderboardOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[40px] p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" /> Top 5 Reyting
                </h3>
                <button onClick={() => setIsLeaderboardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-3">
                {leaderboard.map((user, idx) => (
                  <div 
                    key={user.id} 
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      user.isMe ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "w-6 text-sm font-black",
                        idx === 0 ? "text-amber-500" : idx === 1 ? "text-slate-400" : "text-slate-300"
                      )}>
                        {idx + 1}
                      </span>
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Daraja {user.level}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-blue-600 text-sm">{user.xp}</span>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {isNotificationsOpen && (
          <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotificationsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-slate-800">Bildirishnomalar</h3>
                <button onClick={() => setIsNotificationsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
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
