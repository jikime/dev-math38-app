// 시험 관련 타입 정의

export interface Exam {
  id: string;
  title: string;
  description?: string;
  type: 'midterm' | 'final' | 'quiz' | 'mock' | 'diagnostic';
  subject: string;
  grade: string;
  class?: string;
  totalPoints: number;
  passingScore: number;
  duration: number; // 시험 시간 (분)
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  problems: string[]; // Problem IDs
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamCreateInput {
  title: string;
  description?: string;
  type: 'midterm' | 'final' | 'quiz' | 'mock' | 'diagnostic';
  subject: string;
  grade: string;
  class?: string;
  totalPoints: number;
  passingScore: number;
  duration: number;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  problems: string[];
}

export interface ExamUpdateInput extends Partial<ExamCreateInput> {
  status?: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  rank?: number;
  passed: boolean;
  answers: {
    problemId: string;
    answer: string;
    isCorrect: boolean;
    points: number;
  }[];
  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
}

export interface ExamStatistics {
  examId: string;
  totalStudents: number;
  submittedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  scoreDistribution: {
    range: string;
    count: number;
  }[];
  problemStatistics: {
    problemId: string;
    correctRate: number;
    averagePoints: number;
  }[];
}