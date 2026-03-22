import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Play, Lock, Headphones, Search, Filter, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { BookReader } from './BookReader';
import { Book, HomeworkSubmission } from '@/src/types';
import { defaultBooks } from '@/src/constants';

interface LibraryProps {
  initialCategory?: string;
  customBooks?: Book[];
  autoOpenBookId?: string;
  onBookOpened?: () => void;
  isPremium?: boolean;
  onPremiumClick?: () => void;
  userName?: string;
  submissions?: HomeworkSubmission[];
  onAddSubmission?: (submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => void;
}

export const Library: React.FC<LibraryProps> = ({ 
  initialCategory = 'Barchasi', 
  customBooks = [], 
  autoOpenBookId,
  onBookOpened,
  isPremium = false,
  onPremiumClick,
  userName = 'Foydalanuvchi',
  submissions = [],
  onAddSubmission
}) => {
  const [search, setSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'title' | 'author'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  React.useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  React.useEffect(() => {
    if (autoOpenBookId) {
      const book = [...customBooks, ...defaultBooks].find(b => b.id === autoOpenBookId);
      if (book) {
        setSelectedBook(book);
        if (onBookOpened) onBookOpened();
      }
    }
  }, [autoOpenBookId, customBooks]);
  
  const handleBookClick = (book: Book) => {
    if (book.isPremium && !isPremium) {
      if (onPremiumClick) {
        onPremiumClick();
      } else {
        alert("Bu kitobni o'qish uchun Premium obuna bo'lishingiz kerak!");
      }
      return;
    }
    setSelectedBook(book);
  };

  const categories = ['Barchasi', 'Ertaklar', 'Ilmiy', 'Ingliz tili', 'Mantiq'];

  const allBooks = [...customBooks, ...defaultBooks];

  const filteredBooks = allBooks
    .filter(b => 
      (activeCategory === 'Barchasi' || b.category === activeCategory) &&
      b.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortBy].toLowerCase();
      const valB = b[sortBy].toLowerCase();
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  const categoryColors: { [key: string]: string } = {
    'Barchasi': 'bg-brand-blue border-blue-700',
    'Ertaklar': 'bg-pink-500 border-pink-700',
    'Ilmiy': 'bg-emerald-500 border-emerald-700',
    'Ingliz tili': 'bg-purple-500 border-purple-700',
    'Mantiq': 'bg-orange-500 border-orange-700'
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#F5F9FF]">
      <div className="p-6 pt-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-black text-slate-800 tracking-tight">Kutubxona 📚</h1>
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shadow-md border transition-all",
                isFilterOpen ? "bg-brand-blue text-white border-blue-700" : "bg-white text-brand-blue border-slate-100"
              )}
            >
              <Filter className="w-5 h-5" />
            </motion.button>

            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2"
              >
                <div className="p-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Saralash</div>
                <button 
                  onClick={() => { setSortBy('title'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setIsFilterOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-between"
                >
                  Nomi bo'yicha {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  onClick={() => { setSortBy('author'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); setIsFilterOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-between"
                >
                  Muallif bo'yicha {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Kitob qidirish..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white soft-shadow border-none focus:ring-2 focus:ring-brand-blue transition-all font-medium text-slate-700"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all border-b-4 uppercase tracking-wider",
                activeCategory === cat 
                  ? `${categoryColors[cat]} text-white shadow-lg shadow-blue-500/20` 
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Featured Section */}
        {activeCategory === 'Barchasi' && !search && allBooks.length > 0 && (
          <div className="mb-10">
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4">Tavsiya etiladi</h3>
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBookClick(allBooks[0])}
              className="bg-brand-blue rounded-[32px] p-6 text-white flex items-center gap-6 shadow-xl shadow-blue-500/30 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border-2 border-white/20 flex-shrink-0">
                <img src={allBooks[0].cover} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md">Yangi</span>
                <h4 className="text-lg font-bold mt-2 leading-tight">{allBooks[0].title}</h4>
                <p className="text-white/70 text-xs mt-1">{allBooks[0].author}</p>
                <button className="mt-4 bg-white text-brand-blue px-4 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2">
                  <Play className="w-3 h-3 fill-brand-blue" /> O'qishni boshlash
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-2 gap-6">
          {filteredBooks.map((book) => (
            <motion.div 
              key={book.id}
              whileHover={{ y: -5 }}
              className="group relative"
              onClick={() => handleBookClick(book)}
            >
              <div className="aspect-[3/4] rounded-[28px] overflow-hidden shadow-lg relative mb-3 border-b-4 border-slate-200">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Progress Overlay */}
                {book.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                    <div className="h-full bg-brand-yellow" style={{ width: `${book.progress}%` }} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button className="w-full py-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-bold flex items-center justify-center gap-2">
                    <Play className="w-3 h-3 fill-white" /> O'qish
                  </button>
                </div>
                
                <div className="absolute top-3 left-3">
                  {book.progress === 100 && (
                    <div className="bg-green-500 text-white p-1 rounded-lg shadow-lg border-b-2 border-green-700">
                      <Check className="w-3 h-3" strokeWidth={4} />
                    </div>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {book.isPremium && !isPremium && (
                    <div className="w-8 h-8 bg-[#FFD54F] rounded-xl flex items-center justify-center shadow-lg border-b-2 border-[#FBC02D]">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {book.hasAudio && (
                    <div className="w-8 h-8 bg-brand-blue/80 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border-b-2 border-blue-700">
                      <Headphones className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-bold text-slate-800 text-xs line-clamp-1 px-1">{book.title}</h3>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider px-1 mt-0.5">{book.author}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <BookReader 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
        book={selectedBook} 
        userName={userName}
        submissions={submissions}
        onAddSubmission={onAddSubmission}
      />
    </div>
  );
};
