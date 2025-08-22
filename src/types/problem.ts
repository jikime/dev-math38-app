// 문제 관련 타입 정의

export interface Problem {
  id: string;
  title: string;
  content: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  subject: string;
  chapter?: string;
  topic?: string;
  textbookId?: string;
  points: number;
  answer: string;
  solution?: string;
  hints?: string[];
  tags?: string[];
  imageUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemCreateInput {
  title: string;
  content: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  subject: string;
  chapter?: string;
  topic?: string;
  textbookId?: string;
  points: number;
  answer: string;
  solution?: string;
  hints?: string[];
  tags?: string[];
  imageUrl?: string;
}

export interface ProblemUpdateInput extends Partial<ProblemCreateInput> {}

export interface ProblemSolution {
  problemId: string;
  step: number;
  explanation: string;
  formula?: string;
  imageUrl?: string;
}

export interface SimilarProblem {
  id: string;
  similarity: number; // 0-100
  problem: Problem;
}