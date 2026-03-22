import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardCheck, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Mic,
  Upload,
  Send,
  X
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Tests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'assignments'>('tests');
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<{ score: number; total: number } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [submitting, setSubmitting] = useState<number | null>(null);

  const tests = [
    { 
      id: 1, 
      title: "Matematika: Ko'paytirish", 
      questions: [
        { q: "5 x 5 = ?", options: ["20", "25", "30", "35"], a: 1 },
        { q: "8 x 4 = ?", options: ["32", "36", "28", "40"], a: 0 },
        { q: "9 x 3 = ?", options: ["24", "27", "30", "21"], a: 1 },
      ],
      time: "15 daqiqa", 
      difficulty: "Oson", 
      color: "bg-green-100 text-green-600" 
    },
    { 
      id: 2, 
      title: "Ingliz tili: Grammatika", 
      questions: [
        { q: "I ___ a student.", options: ["am", "is", "are", "be"], a: 0 },
        { q: "She ___ apple.", options: ["like", "likes", "liking", "liked"], a: 1 },
      ],
      time: "20 daqiqa", 
      difficulty: "O'rta", 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      id: 3, 
      title: "Zakovat: Mantiqiy savollar", 
      questions: [
        { q: "Germaniyada – perlon, Polshada – stilon, Shvetsiyada – grilon. Xo‘sh bizdachi?", options: ["Neylon", "Kapron", "Ipak", "Paxta"], a: 1 },
        { q: "Ikar ismli mashhur qahramonning otasi kim?", options: ["Dedal", "Yevpalam", "Zevs", "Gerkules"], a: 0 },
        { q: "Monarx hamma ishni qilishi mumkin, faqat bittasidan tashqari. U nima?", options: ["Soliq solish", "Urush ochish", "Monarxlikdan voz kechish", "Qonun chiqarish"], a: 2 },
      ],
      time: "10 daqiqa", 
      difficulty: "Qiyin", 
      color: "bg-purple-100 text-purple-600" 
    },
  ];

  const assignments = [
    { id: 1, title: "Audio darslik: 1-mavzu", status: "Tekshirilmoqda", date: "Bugun", type: "audio", result: "A'lo" },
    { id: 2, title: "Matematika: Uy vazifasi", status: "Topshirilgan", date: "Kecha", type: "file", result: "85/100" },
    { id: 3, title: "Ingliz tili: Speaking", status: "Yangi", date: "3 kun oldin", type: "speaking" },
  ];

  const handleTestStart = (test: any) => {
    setSelectedTest(test);
    setCurrentQuestion(0);
    setAnswers([]);
    setTestResult(null);
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const score = newAnswers.reduce((acc, curr, idx) => {
        return curr === selectedTest.questions[idx].a ? acc + 1 : acc;
      }, 0);
      setTestResult({ score, total: selectedTest.questions.length });
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      alert("Ovoz yozib olindi va yuborildi!");
    }, 5000);
  };

  const handleSubmit = (id: number) => {
    setSubmitting(id);
    setTimeout(() => {
      setSubmitting(null);
      alert("Vazifa muvaffaqiyatli yuborildi!");
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-12 bg-[#F5F9FF]">
      <h1 className="text-2xl font-display font-bold text-slate-800 tracking-wide mb-8">Testlar va Vazifalar</h1>

      <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveTab('tests')}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'tests' ? "bg-white text-brand-blue shadow-sm" : "text-slate-400"
          )}
        >
          Testlar
        </button>
        <button 
          onClick={() => setActiveTab('assignments')}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'assignments' ? "bg-white text-brand-blue shadow-sm" : "text-slate-400"
          )}
        >
          Vazifalar
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'tests' ? (
          !selectedTest ? (
            tests.map((test) => (
              <motion.div 
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-5 rounded-3xl soft-shadow border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-light-blue rounded-2xl flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{test.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {test.time}
                      </span>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", test.color)}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleTestStart(test)}
                  className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-blue/30"
                >
                  <Play className="w-4 h-4 fill-white" />
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[40px] soft-shadow border border-slate-100"
            >
              {!testResult ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setSelectedTest(null)} className="p-2 bg-slate-100 rounded-full">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Savol {currentQuestion + 1} / {selectedTest.questions.length}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-8 leading-tight">
                    {selectedTest.questions[currentQuestion].q}
                  </h3>
                  <div className="space-y-3">
                    {selectedTest.questions[currentQuestion].options.map((opt: string, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-brand-blue hover:bg-brand-light-blue transition-all text-left font-bold text-slate-700"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-brand-light-blue rounded-[30px] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Natija</h3>
                  <p className="text-slate-400 font-medium mb-8">Siz {selectedTest.questions.length} tadan {testResult.score} tasiga to'g'ri javob berdingiz.</p>
                  <button 
                    onClick={() => setSelectedTest(null)}
                    className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/30"
                  >
                    Yopish
                  </button>
                </div>
              )}
            </motion.div>
          )
        ) : (
          assignments.map((assignment) => (
            <motion.div 
              key={assignment.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-5 rounded-3xl soft-shadow border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    {assignment.type === 'audio' ? <Mic className="w-5 h-5 text-slate-500" /> : 
                     assignment.type === 'speaking' ? <Mic className="w-5 h-5 text-brand-orange" /> :
                     <Upload className="w-5 h-5 text-slate-500" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{assignment.title}</h3>
                    <p className="text-[10px] font-medium text-slate-400">{assignment.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    assignment.status === 'Tekshirilmoqda' ? "bg-yellow-100 text-yellow-600" :
                    assignment.status === 'Topshirilgan' ? "bg-green-100 text-green-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    {assignment.status}
                  </div>
                  {assignment.result && (
                    <span className="text-[10px] font-bold text-brand-blue">Natija: {assignment.result}</span>
                  )}
                </div>
              </div>
              
              {assignment.status === 'Tekshirilmoqda' && assignment.type === 'audio' && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <button className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue w-1/3" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">0:45 / 2:30</span>
                  </div>
                </div>
              )}

              {assignment.status === 'Yangi' && (
                assignment.type === 'speaking' ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-600 mb-2">Savol:</p>
                      <p className="text-sm font-medium text-slate-800">"What is your favorite color and why?"</p>
                    </div>
                    <button 
                      onClick={startRecording}
                      className={cn(
                        "w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "bg-brand-orange text-white shadow-brand-orange/30"
                      )}
                    >
                      <Mic className="w-4 h-4" /> 
                      {isRecording ? `Yozilmoqda... ${recordingTime}s` : "Ovozni yozish"}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSubmit(assignment.id)}
                    disabled={submitting === assignment.id}
                    className="w-full py-3 bg-brand-blue text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/30 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> {submitting === assignment.id ? "Yuborilmoqda..." : "Vazifani topshirish"}
                  </button>
                )
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
