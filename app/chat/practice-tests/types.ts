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
}
