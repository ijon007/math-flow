import type { PracticeTest } from '@/lib/chat/tools';

export interface PracticeTestGroup {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  createdAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  tags: string[];
  lastTaken: string;
  attempts: number;
  averageScore: number;
  timeLimit?: number;
  isPublic: boolean;
  practiceTestData?: PracticeTest; // Optional practice test data from database
}

export const practiceTestGroups: PracticeTestGroup[] = [
  {
    id: '1',
    title: 'Algebra Fundamentals',
    description: 'Basic algebraic concepts and operations',
    questionCount: 20,
    createdAt: '2024-01-15',
    difficulty: 'Easy',
    subject: 'Algebra',
    tags: ['Algebra', 'Basics', 'Operations'],
    lastTaken: '2024-01-14',
    attempts: 3,
    averageScore: 85,
    timeLimit: 30,
    isPublic: true,
  },
  {
    id: '2',
    title: 'Calculus Derivatives',
    description: 'Derivative rules and applications',
    questionCount: 25,
    createdAt: '2024-01-14',
    difficulty: 'Medium',
    subject: 'Calculus',
    tags: ['Derivatives', 'Rules', 'Applications'],
    lastTaken: '2024-01-13',
    attempts: 2,
    averageScore: 78,
    timeLimit: 45,
    isPublic: true,
  },
  {
    id: '3',
    title: 'Geometry Proofs',
    description: 'Geometric theorems and proof techniques',
    questionCount: 15,
    createdAt: '2024-01-13',
    difficulty: 'Hard',
    subject: 'Geometry',
    tags: ['Proofs', 'Theorems', 'Geometry'],
    lastTaken: '2024-01-12',
    attempts: 1,
    averageScore: 65,
    timeLimit: 60,
    isPublic: false,
  },
  {
    id: '4',
    title: 'Statistics Basics',
    description: 'Descriptive statistics and probability',
    questionCount: 18,
    createdAt: '2024-01-12',
    difficulty: 'Medium',
    subject: 'Statistics',
    tags: ['Statistics', 'Probability', 'Data'],
    lastTaken: '2024-01-11',
    attempts: 4,
    averageScore: 82,
    timeLimit: 40,
    isPublic: true,
  },
  {
    id: '5',
    title: 'Trigonometry Identities',
    description: 'Trigonometric identities and equations',
    questionCount: 22,
    createdAt: '2024-01-11',
    difficulty: 'Medium',
    subject: 'Trigonometry',
    tags: ['Trigonometry', 'Identities', 'Equations'],
    lastTaken: '2024-01-10',
    attempts: 2,
    averageScore: 88,
    timeLimit: 35,
    isPublic: true,
  },
  {
    id: '6',
    title: 'Linear Algebra',
    description: 'Matrix operations and vector spaces',
    questionCount: 30,
    createdAt: '2024-01-10',
    difficulty: 'Hard',
    subject: 'Linear Algebra',
    tags: ['Matrices', 'Vectors', 'Linear Algebra'],
    lastTaken: '2024-01-09',
    attempts: 1,
    averageScore: 72,
    timeLimit: 90,
    isPublic: false,
  },
];
