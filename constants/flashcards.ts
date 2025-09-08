import type { Flashcard } from '@/lib/chat/tools';

export interface FlashcardGroup {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  createdAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  subject: string;
  tags: string[];
  lastStudied: string;
  mastery: number;
  flashcardData?: Flashcard; // Optional flashcard data from database
}

export const flashcardGroups: FlashcardGroup[] = [
  {
    id: '1',
    title: 'Calculus Derivatives',
    description: 'Essential derivative rules and formulas for calculus',
    cardCount: 25,
    createdAt: '2024-01-15',
    difficulty: 'Intermediate',
    subject: 'Calculus',
    tags: ['Derivatives', 'Rules', 'Formulas'],
    lastStudied: '2024-01-14',
    mastery: 85,
  },
  {
    id: '2',
    title: 'Trigonometric Identities',
    description: 'Fundamental trigonometric identities and their applications',
    cardCount: 18,
    createdAt: '2024-01-14',
    difficulty: 'Beginner',
    subject: 'Trigonometry',
    tags: ['Identities', 'Trigonometry', 'Formulas'],
    lastStudied: '2024-01-13',
    mastery: 92,
  },
  {
    id: '3',
    title: 'Linear Algebra Basics',
    description: 'Matrix operations, vectors, and linear transformations',
    cardCount: 32,
    createdAt: '2024-01-13',
    difficulty: 'Advanced',
    subject: 'Linear Algebra',
    tags: ['Matrices', 'Vectors', 'Transformations'],
    lastStudied: '2024-01-12',
    mastery: 67,
  },
  {
    id: '4',
    title: 'Statistics Formulas',
    description: 'Key statistical formulas and probability distributions',
    cardCount: 20,
    createdAt: '2024-01-12',
    difficulty: 'Intermediate',
    subject: 'Statistics',
    tags: ['Probability', 'Distributions', 'Formulas'],
    lastStudied: '2024-01-11',
    mastery: 78,
  },
  {
    id: '5',
    title: 'Geometry Theorems',
    description: 'Important geometric theorems and their proofs',
    cardCount: 15,
    createdAt: '2024-01-11',
    difficulty: 'Intermediate',
    subject: 'Geometry',
    tags: ['Theorems', 'Proofs', 'Geometry'],
    lastStudied: '2024-01-10',
    mastery: 90,
  },
  {
    id: '6',
    title: 'Differential Equations',
    description: 'Methods for solving various types of differential equations',
    cardCount: 28,
    createdAt: '2024-01-10',
    difficulty: 'Advanced',
    subject: 'Differential Equations',
    tags: ['ODE', 'Methods', 'Solutions'],
    lastStudied: '2024-01-09',
    mastery: 73,
  },
];
