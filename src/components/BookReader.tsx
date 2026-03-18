import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Mic, ClipboardCheck, FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Book } from '@/src/types';

interface BookReaderProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export const BookReader: React.FC<BookReaderProps> = ({ isOpen, onClose, book }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(200);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [viewMode, setViewMode] = useState<'story' | 'pdf'>('story');
  const [showTask, setShowTask] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const quizQuestions = book?.quiz || [
    { question: "Ertakdagi bola qanaqa edi?", options: ["Aqlli", "Yalqov", "Sho'x"], correctAnswer: 0 },
    { question: "U qayerda yashagan?", options: ["Shaxarda", "Qishloqda", "O'rmonda"], correctAnswer: 1 },
  ];

  useEffect(() => {
    if (book?.pdfUrl) {
      setViewMode('pdf');
      
      // If it's a base64 data URL, convert to Blob for better compatibility
      if (book.pdfUrl.startsWith('data:application/pdf;base64,')) {
        try {
          const base64Data = book.pdfUrl.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
          
          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (e) {
          console.error('PDF conversion error:', e);
          setPdfBlobUrl(book.pdfUrl);
        }
      } else {
        setPdfBlobUrl(book.pdfUrl);
      }
    } else {
      setViewMode('story');
      setPdfBlobUrl(null);
    }
  }, [book]);

  useEffect(() => {
    if (book?.audioUrl && audioRef.current) {
      audioRef.current.src = book.audioUrl;
    }
  }, [book]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !book?.audioUrl) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, book, duration]);

  useEffect(() => {
    setProgress((currentTime / duration) * 100);
  }, [currentTime, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 200);
    }
  };

  const togglePlay = () => {
    if (book?.audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-50 bg-white flex flex-col"
        >
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
              <X className="w-6 h-6 text-slate-400" />
            </button>
            <div className="text-center px-4 flex-1">
              <h2 className="font-display font-bold text-slate-800 line-clamp-1">{book.title}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sahifa {currentPage} / 12</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowTask(true)}
                className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-md"
                title="Vazifa"
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setShowQuiz(true)}
                className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-md"
                title="Test"
              >
                <ClipboardCheck className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
            {/* View Mode Toggle */}
            {book.pdfUrl && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={() => setViewMode('pdf')}
                  className={cn(
                    "p-2 rounded-xl transition-all shadow-md flex items-center gap-2 text-[10px] font-bold",
                    viewMode === 'pdf' ? "bg-brand-blue text-white" : "bg-white text-slate-400"
                  )}
                >
                  <FileText className="w-4 h-4" /> PDF
                </button>
                <button 
                  onClick={() => setViewMode('story')}
                  className={cn(
                    "p-2 rounded-xl transition-all shadow-md flex items-center gap-2 text-[10px] font-bold",
                    viewMode === 'story' ? "bg-brand-blue text-white" : "bg-white text-slate-400"
                  )}
                >
                  <ImageIcon className="w-4 h-4" /> Hikoya
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {showTask ? (
                <motion.div 
                  key="task"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-xs bg-white rounded-[40px] p-8 soft-shadow border-4 border-brand-orange/20 text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-8 h-8 text-brand-orange" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Kitob bo'yicha vazifa</h3>
                  <p className="text-slate-500 text-sm mb-8 leading-relaxed">{book.task || "Ushbu kitobni diqqat bilan o'qib chiqing."}</p>
                  <button 
                    onClick={() => {
                      alert("Vazifa bajarildi! +50 XP");
                      setShowTask(false);
                    }}
                    className="w-full py-4 bg-brand-orange text-white rounded-2xl font-bold shadow-lg shadow-orange-500/30"
                  >
                    Bajarish
                  </button>
                  <button 
                    onClick={() => setShowTask(false)}
                    className="mt-4 text-slate-400 text-xs font-bold uppercase tracking-widest"
                  >
                    Yopish
                  </button>
                </motion.div>
              ) : !showQuiz ? (
                <motion.div 
                  key="reader"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full flex flex-col items-center justify-center p-6 gap-8"
                >
                  {viewMode === 'pdf' && pdfBlobUrl ? (
                    <div className="w-full h-full flex flex-col gap-4">
                      <div className="flex-1 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white bg-white relative">
                        <object 
                          data={pdfBlobUrl}
                          type="application/pdf"
                          className="w-full h-full border-none"
                        >
                          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold mb-4">PDF faylni ushbu brauzerda ko'rsatib bo'lmadi.</p>
                            <a 
                              href={pdfBlobUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg"
                            >
                              Faylni ochish
                            </a>
                          </div>
                        </object>
                      </div>
                      <div className="flex justify-center">
                        <a 
                          href={pdfBlobUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-slate-600 text-xs font-bold shadow-sm border border-slate-100"
                        >
                          <FileText className="w-4 h-4" /> To'liq ekranda ochish
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <motion.div 
                        animate={{ 
                          scale: isPlaying ? [1, 1.02, 1] : 1,
                          rotate: isPlaying ? [-1, 1, -1] : 0
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-full aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white relative"
                      >
                        <img 
                          src={book.cover} 
                          alt="Page" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-white font-display font-medium text-lg leading-tight">
                            "Bir bor ekan, bir yo'q ekan... Qadim zamonlarda bir aqlli bola yashagan ekan."
                          </p>
                        </div>
                      </motion.div>

                      {/* Audio Controls */}
                      <div className="w-full space-y-6">
                        <audio 
                          ref={audioRef}
                          onTimeUpdate={handleAudioTimeUpdate}
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />
                        <div className="space-y-2">
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-brand-blue"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-8">
                          <button className="p-3 text-slate-400 hover:text-brand-blue transition-colors">
                            <SkipBack className="w-6 h-6 fill-current" />
                          </button>
                          <button 
                            onClick={togglePlay}
                            className="w-20 h-20 bg-brand-blue rounded-[30px] flex items-center justify-center text-white shadow-xl shadow-brand-blue/30 hover:scale-105 active:scale-95 transition-all"
                          >
                            {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1" />}
                          </button>
                          <button className="p-3 text-slate-400 hover:text-brand-blue transition-colors">
                            <SkipForward className="w-6 h-6 fill-current" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full bg-slate-50 rounded-[40px] p-8 soft-shadow border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-display font-bold text-slate-800">Savol-Javob</h3>
                    <button onClick={() => setShowQuiz(false)} className="p-2 bg-slate-200 rounded-full">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  <div className="mb-8">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Savol {quizStep + 1} / {quizQuestions.length}</p>
                    <p className="text-lg font-bold text-slate-800 leading-tight">{quizQuestions[quizStep].question}</p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[quizStep].options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          if (quizStep < quizQuestions.length - 1) {
                            setQuizStep(prev => prev + 1);
                          } else {
                            setShowQuiz(false);
                            setQuizStep(0);
                            alert("Test yakunlandi! +100 XP");
                          }
                        }}
                        className="w-full p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-brand-blue hover:bg-brand-light-blue transition-all text-left font-bold text-slate-700"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-100 flex gap-4">
            <button className="flex-1 py-4 bg-slate-100 rounded-2xl text-slate-600 font-bold text-sm flex items-center justify-center gap-2">
              <Mic className="w-4 h-4" /> Vazifani yozish
            </button>
            <button className="flex-1 py-4 bg-brand-light-blue text-brand-blue rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              <Volume2 className="w-4 h-4" /> Ovozni o'zgartirish
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
