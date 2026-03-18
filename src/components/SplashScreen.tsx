import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Star } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-gradient-to-b from-[#4A90E2] to-[#357ABD] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated Background Elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4 + i, 
            repeat: Infinity,
            delay: i * 0.3
          }}
          className="absolute text-white/20"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%` 
          }}
        >
          <Star size={10 + i * 5} fill="currentColor" />
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
          className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-2xl mb-6 relative"
        >
          <BookOpen className="w-12 h-12 text-[#4A90E2]" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white rounded-[32px]"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white font-display font-black text-4xl tracking-tight drop-shadow-lg"
        >
          SmartBook
        </motion.h1>
        
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/70 font-bold text-xs uppercase tracking-[0.2em] mt-2"
        >
          Bilimlar olamiga xush kelibsiz
        </motion.p>

        <div className="mt-12 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-white/40 text-[10px] font-bold uppercase tracking-widest"
      >
        Yuklanmoqda...
      </motion.div>
    </motion.div>
  );
};
