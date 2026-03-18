export type Subject = {
  id: string;
  name: string;
  icon: string;
  color: string;
  progress: number;
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
  isPremium: boolean;
  hasAudio: boolean;
  audioUrl?: string;
  pdfUrl?: string;
  category?: string;
  progress?: number;
  quiz?: QuizQuestion[];
  task?: string;
};

export type User = {
  name: string;
  xp: number;
  level: number;
  avatar: string;
  progress: number;
};
