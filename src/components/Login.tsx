import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-brand-blue/10 rounded-[30px] flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-800 tracking-tight">Xush kelibsiz!</h1>
          <p className="text-slate-500 text-sm">SmartBook ilovasiga kirish uchun telefon raqamingizni kiriting</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendCode}
              className="space-y-4"
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400">
                  <Phone className="w-5 h-5" />
                  <span className="font-bold">+998</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="00 000 00 00"
                  className="w-full pl-24 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-bold text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={phone.length < 9 || isLoading}
                className={cn(
                  "w-full py-5 rounded-[24px] font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2",
                  phone.length >= 9 ? "bg-brand-blue shadow-brand-blue/30" : "bg-slate-200 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Kodni yuborish
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div className="space-y-2">
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Tasdiqlash kodi</p>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  className="w-full py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all font-bold text-3xl text-center tracking-[1em] pl-[1em]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={code.length < 4 || isLoading}
                className={cn(
                  "w-full py-5 rounded-[24px] font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2",
                  code.length >= 4 ? "bg-brand-blue shadow-brand-blue/30" : "bg-slate-200 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Tasdiqlash
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
              >
                Raqamni o'zgartirish
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
