import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Headphones, 
  ClipboardCheck, 
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  Upload,
  Image as ImageIcon,
  Music,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Book } from '@/src/types';

interface AdminPanelProps {
  onClose: () => void;
  onAddBook: (book: Book) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onAddBook }) => {
  const [activeTab, setActiveTab] = useState<'books' | 'users' | 'stats'>('books');
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: 'Ertaklar',
    isPremium: false,
    hasAudio: false,
    progress: 0,
    cover: '',
    pdfUrl: '',
    audioUrl: '',
    task: '',
    quiz: []
  });

  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewBook(prev => ({ 
        ...prev, 
        [type === 'cover' ? 'cover' : type === 'pdf' ? 'pdfUrl' : 'audioUrl']: result 
      }));
      setUploading(prev => ({ ...prev, [type]: false }));
    };
    reader.readAsDataURL(file);
  };

  const [quizQuestion, setQuizQuestion] = useState({
    question: '',
    options: ['', '', ''],
    correctAnswer: 0
  });

  const handleAddQuizQuestion = () => {
    if (quizQuestion.question && quizQuestion.options.every(o => o)) {
      setNewBook(prev => ({
        ...prev,
        quiz: [...(prev.quiz || []), { ...quizQuestion }]
      }));
      setQuizQuestion({
        question: '',
        options: ['', '', ''],
        correctAnswer: 0
      });
    }
  };

  const handleSaveBook = () => {
    if (newBook.title && (newBook.pdfUrl || newBook.cover)) {
      onAddBook({
        ...newBook as Book,
        id: Math.random().toString(36).substr(2, 9)
      });
      alert('Kitob muvaffaqiyatli qo\'shildi!');
      onClose();
    } else {
      alert('Iltimos, kamida kitob nomi va PDF yoki muqovani yuklang!');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] bg-[#F5F9FF] flex flex-col"
    >
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold text-slate-800">Admin Panel</h1>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-6 border-b border-slate-100">
        {[
          { id: 'books', label: 'Kitoblar', icon: BookOpen },
          { id: 'users', label: 'Foydalanuvchilar', icon: Users },
          { id: 'stats', label: 'Statistika', icon: LayoutDashboard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === tab.id 
                ? "border-brand-blue text-brand-blue" 
                : "border-transparent text-slate-400"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'books' ? (
          <div className="max-w-2xl mx-auto space-y-8 pb-12">
            <section className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-blue" /> Yangi kitob qo'shish
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kitob nomi</label>
                  <input 
                    type="text" 
                    value={newBook.title}
                    onChange={e => setNewBook({...newBook, title: e.target.value})}
                    placeholder="Masalan: Alpomish"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Muallif</label>
                  <input 
                    type="text" 
                    value={newBook.author}
                    onChange={e => setNewBook({...newBook, author: e.target.value})}
                    placeholder="Masalan: Xalq ertagi"
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategoriya</label>
                  <select 
                    value={newBook.category}
                    onChange={e => setNewBook({...newBook, category: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-brand-blue transition-all outline-none"
                  >
                    <option value="Ertaklar">Ertaklar</option>
                    <option value="Ilmiy">Ilmiy</option>
                    <option value="Ingliz tili">Ingliz tili</option>
                    <option value="Mantiq">Mantiq</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Muqova (Rasm yuklash)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'cover')}
                      className="hidden" 
                      id="cover-upload"
                    />
                    <label 
                      htmlFor="cover-upload"
                      className={cn(
                        "w-full p-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all",
                        newBook.cover && "border-green-400 bg-green-50"
                      )}
                    >
                      {uploading.cover ? (
                        <span className="text-xs font-bold text-slate-400 animate-pulse">Yuklanmoqda...</span>
                      ) : newBook.cover ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-xs font-bold text-green-600">Rasm yuklandi</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-400">Rasm tanlash</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Fayl yuklash</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={e => handleFileUpload(e, 'pdf')}
                      className="hidden" 
                      id="pdf-upload"
                    />
                    <label 
                      htmlFor="pdf-upload"
                      className={cn(
                        "w-full p-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all",
                        newBook.pdfUrl && "border-green-400 bg-green-50"
                      )}
                    >
                      {uploading.pdf ? (
                        <span className="text-xs font-bold text-slate-400 animate-pulse">Yuklanmoqda...</span>
                      ) : newBook.pdfUrl ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-xs font-bold text-green-600">PDF yuklandi</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-400">PDF tanlash</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audio (MP3 yuklash)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="audio/mp3,audio/*"
                      onChange={e => handleFileUpload(e, 'audio')}
                      className="hidden" 
                      id="audio-upload"
                      disabled={!newBook.hasAudio}
                    />
                    <label 
                      htmlFor="audio-upload"
                      className={cn(
                        "w-full p-4 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all",
                        !newBook.hasAudio && "opacity-50 cursor-not-allowed bg-slate-100",
                        newBook.audioUrl && "border-green-400 bg-green-50"
                      )}
                    >
                      {uploading.audio ? (
                        <span className="text-xs font-bold text-slate-400 animate-pulse">Yuklanmoqda...</span>
                      ) : newBook.audioUrl ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-xs font-bold text-green-600">Audio yuklandi</span>
                        </>
                      ) : (
                        <>
                          <Music className="w-5 h-5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-400">MP3 tanlash</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newBook.isPremium}
                    onChange={e => setNewBook({...newBook, isPremium: e.target.checked})}
                    className="w-5 h-5 rounded-lg text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm font-bold text-slate-700">Premium kitob</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newBook.hasAudio}
                    onChange={e => setNewBook({...newBook, hasAudio: e.target.checked})}
                    className="w-5 h-5 rounded-lg text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm font-bold text-slate-700">Audio mavjud</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vazifa tavsifi</label>
                <textarea 
                  value={newBook.task}
                  onChange={e => setNewBook({...newBook, task: e.target.value})}
                  placeholder="Kitobni o'qib bo'lgach nima qilish kerak?"
                  className="w-full p-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-brand-blue transition-all outline-none h-24 resize-none"
                />
              </div>
            </section>

            <section className="space-y-4 p-6 bg-blue-50 rounded-[32px] border-2 border-dashed border-blue-200">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-brand-blue" /> Test savollari qo'shish
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Savol</label>
                  <input 
                    type="text" 
                    value={quizQuestion.question}
                    onChange={e => setQuizQuestion({...quizQuestion, question: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {quizQuestion.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input 
                        type="text" 
                        value={opt}
                        onChange={e => {
                          const newOpts = [...quizQuestion.options];
                          newOpts[i] = e.target.value;
                          setQuizQuestion({...quizQuestion, options: newOpts});
                        }}
                        placeholder={`Variant ${i + 1}`}
                        className="flex-1 p-3 rounded-xl bg-white border border-slate-200 outline-none text-sm"
                      />
                      <button 
                        onClick={() => setQuizQuestion({...quizQuestion, correctAnswer: i})}
                        className={cn(
                          "px-4 rounded-xl text-[10px] font-bold uppercase transition-all",
                          quizQuestion.correctAnswer === i ? "bg-green-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                        )}
                      >
                        To'g'ri
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddQuizQuestion}
                  className="w-full py-3 bg-white text-brand-blue border-2 border-brand-blue border-dashed rounded-2xl text-sm font-bold hover:bg-brand-blue hover:text-white transition-all"
                >
                  Savolni ro'yxatga qo'shish
                </button>
              </div>

              {newBook.quiz && newBook.quiz.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qo'shilgan savollar ({newBook.quiz.length})</p>
                  {newBook.quiz.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700 truncate flex-1">{q.question}</span>
                      <button 
                        onClick={() => {
                          const newQuiz = [...(newBook.quiz || [])];
                          newQuiz.splice(i, 1);
                          setNewBook({...newBook, quiz: newQuiz});
                        }}
                        className="p-1 text-red-400 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <button 
              onClick={handleSaveBook}
              className="w-full py-5 bg-brand-blue text-white rounded-[24px] font-bold text-lg shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Save className="w-6 h-6" /> Kitobni saqlash
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-[30px] flex items-center justify-center">
              <LayoutDashboard className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Bu bo'lim tez kunda ishga tushadi</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};
