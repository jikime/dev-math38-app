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

// 시험지 생성 관련 타입
export interface GeneratePaperRequest {
  categoriesFilter: string[];
  chapterIds: number[];
  fillProblems: boolean;
  problemTypeCounts: number[][]; // 8x5 배열
  skillIds: string[];
  subjectId: number;
  title: string;
}

export interface PaperPage {
  leftSet: PaperProblem[];
  rightSet: PaperProblem[];
  pageNumber: number;
  solutions: boolean;
}

export interface PaperProblem {
  problemNumber: string;
  margin: number;
  height: number;
  problemId: string;
  problem: any; // SpProblem 타입
  level: number;
  ltype: string;
  answerType: string;
  skillId?: string;
  skillName?: string;
}

export interface GeneratedPaper {
  paperId?: string;
  academyId: number;
  academyName: string;
  academyLogo?: string;
  subjectId: number;
  title: string;
  countProblems: number;
  chapterFrom?: string;
  chapterTo?: string;
  chapterIds?: number[];
  skillIds: string[];
  categoriesFilter: string[];
  lectureId?: string;
  lectureTitle?: string;
  pages: PaperPage[];
  solutionPages?: PaperPage[];
  columns: number;
  subjectName?: string;
  teacherName?: string;
  studentName?: string;
  minMargin: number;
  skillProblemsMap?: Map<string, string[]>;
  headerStyle?: React.CSSProperties;
}