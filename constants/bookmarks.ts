export interface Bookmark {
  id: string;
  title: string;
  preview: string;
  lastModified: string;
  messageCount: number;
  tags: string[];
  isBookmarked: boolean;
}

export const savedChats: Bookmark[] = [
  {
    id: '1',
    title: 'Calculus Integration Problems',
    preview: 'Solved complex integration problems involving trigonometric functions and substitution methods...',
    lastModified: '2024-01-15',
    messageCount: 12,
    tags: ['Calculus', 'Integration', 'Trigonometry'],
    isBookmarked: true,
  },
  {
    id: '2',
    title: 'Linear Algebra Matrix Operations',
    preview: 'Explained matrix multiplication, determinants, and eigenvalues with step-by-step solutions...',
    lastModified: '2024-01-14',
    messageCount: 8,
    tags: ['Linear Algebra', 'Matrices', 'Eigenvalues'],
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Statistics Probability Theory',
    preview: 'Covered probability distributions, hypothesis testing, and confidence intervals...',
    lastModified: '2024-01-13',
    messageCount: 15,
    tags: ['Statistics', 'Probability', 'Hypothesis Testing'],
    isBookmarked: true,
  },
  {
    id: '4',
    title: 'Differential Equations Solutions',
    preview: 'Solved first-order and second-order differential equations with various methods...',
    lastModified: '2024-01-12',
    messageCount: 6,
    tags: ['Differential Equations', 'ODE', 'Solutions'],
    isBookmarked: true,
  },
  {
    id: '5',
    title: 'Geometry Proof Techniques',
    preview: 'Demonstrated various proof methods for geometric theorems and properties...',
    lastModified: '2024-01-11',
    messageCount: 10,
    tags: ['Geometry', 'Proofs', 'Theorems'],
    isBookmarked: true,
  },
];
