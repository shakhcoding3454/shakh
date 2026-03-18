import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'payme' | 'click' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm glass-card rounded-3xl p-6 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">Premiumga o'tish</h2>
            <p className="text-slate-500 text-sm mb-6">Xamma interaktiv kitoblar va vazifalarni ochish uchun to'lov qiling.</p>

            <div className="space-y-3 mb-8">
              <button
                onClick={() => setMethod('payme')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  method === 'payme' ? "border-brand-blue bg-brand-light-blue" : "border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00BAE0] rounded-xl flex items-center justify-center text-white font-bold">P</div>
                  <span className="font-semibold text-slate-700">Payme</span>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2", method === 'payme' ? "border-brand-blue bg-brand-blue" : "border-slate-300")} />
              </button>

              <button
                onClick={() => setMethod('click')}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                  method === 'click' ? "border-brand-blue bg-brand-light-blue" : "border-slate-100 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0056A3] rounded-xl flex items-center justify-center text-white font-bold">C</div>
                  <span className="font-semibold text-slate-700">Click</span>
                </div>
                <div className={cn("w-5 h-5 rounded-full border-2", method === 'click' ? "border-brand-blue bg-brand-blue" : "border-slate-300")} />
              </button>
            </div>

            <button
              disabled={!method || isProcessing}
              onClick={handlePayment}
              className={cn(
                "w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg",
                isProcessing ? "bg-slate-400" : "bg-brand-blue hover:scale-[1.02] active:scale-95",
                !method && "opacity-50 cursor-not-allowed"
              )}
            >
              {isProcessing ? "To'lov qilinmoqda..." : "To'lash: 15,000 so'm"}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
