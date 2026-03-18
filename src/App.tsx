import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';
import { Library } from './components/Library';
import { Tests } from './components/Tests';
import { Profile } from './components/Profile';
import { BottomNav } from './components/BottomNav';
import { AdminPanel } from './components/AdminPanel';
import { SplashScreen } from './components/SplashScreen';
import { Book } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'Sharman';
  });
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('userAvatar');
  });
  const [isPremium, setIsPremium] = useState(() => {
    return localStorage.getItem('isPremium') === 'true';
  });
  const [initialLibraryCategory, setInitialLibraryCategory] = useState('Barchasi');
  const [bookToOpenId, setBookToOpenId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [customBooks, setCustomBooks] = useState<Book[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    if (userAvatar) {
      localStorage.setItem('userAvatar', userAvatar);
    }
  }, [userAvatar]);

  useEffect(() => {
    localStorage.setItem('isPremium', String(isPremium));
  }, [isPremium]);

  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  const handleAdminTrigger = () => {
    const now = Date.now();
    if (now - lastClickTime.current > 1000) {
      clickCount.current = 1;
    } else {
      clickCount.current += 1;
    }
    lastClickTime.current = now;

    if (clickCount.current >= 5) {
      setIsAdminOpen(true);
      clickCount.current = 0;
    }
  };

  const handleNavigate = (tab: string, category?: string, openBookId?: string) => {
    if (tab === 'library' && category) {
      setInitialLibraryCategory(category);
    } else if (tab === 'library') {
      setInitialLibraryCategory('Barchasi');
    }
    
    if (openBookId) {
      setBookToOpenId(openBookId);
    } else {
      setBookToOpenId(null);
    }
    
    setActiveTab(tab);
  };

  const handleAddBook = (book: Book) => {
    setCustomBooks(prev => [book, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard userName={userName} userAvatar={userAvatar} isPremium={isPremium} setIsPremium={setIsPremium} onNavigate={handleNavigate} onAdminTrigger={handleAdminTrigger} />;
      case 'library': return (
        <Library 
          initialCategory={initialLibraryCategory} 
          customBooks={customBooks} 
          autoOpenBookId={bookToOpenId || undefined}
          onBookOpened={() => setBookToOpenId(null)}
          isPremium={isPremium}
          onPremiumClick={() => {
            setActiveTab('home');
            // We can't easily trigger the modal from here without more state, 
            // but the user will see the home screen where the banner was.
            // Actually, let's just add a state to open it from anywhere.
          }}
        />
      );
      case 'tests': return <Tests />;
      case 'profile': return <Profile userName={userName} setUserName={setUserName} userAvatar={userAvatar} setUserAvatar={setUserAvatar} isPremium={isPremium} setIsPremium={setIsPremium} />;
      default: return <Dashboard userName={userName} userAvatar={userAvatar} isPremium={isPremium} setIsPremium={setIsPremium} onNavigate={handleNavigate} onAdminTrigger={handleAdminTrigger} />;
    }
  };

  return (
    <div className="mobile-container soft-shadow">
      <AnimatePresence>
        {isInitialLoading && <SplashScreen />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        <BottomNav activeTab={activeTab} setActiveTab={handleNavigate} />
      </motion.div>

      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            onClose={() => setIsAdminOpen(false)} 
            onAddBook={handleAddBook}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
