// 저장소 관련 타입 정의

import { ProgressState } from "@/components/math-paper/domains/lecture";
import { PaperType } from "@/components/math-paper/domains/paper";

// 실제 API 응답 타입
export interface LecturePaper {
  lecturePaperId: string;
  paperIndex: number;
  lectureId: string;
  paperRefId: string;
  name: string;
  type: PaperType; // "manual" 등
  bookTitle: string | null;
  grade: number;
  subjectId: number;
  rangeFrom: string;
  rangeTo: string;
  count: number; // 총 문제 수
  countChoice: number; // 객관식 문제 수
  countEssay: number; // 주관식 문제 수
  level1: number; // 난이도별 문제 수
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  difficulty: number; // 전체 난이도
  state: ProgressState; // 상태
  paperCount: number; // 시행 횟수
  finishedCount: number; // 완료 횟수
  average: number; // 평균 점수
  published: string | null;
  version: number;
  deleted: boolean;
  deletionDate: string | null;
  created: string; // ISO 날짜 문자열
  updated: string; // ISO 날짜 문자열
}

// API 요청 파라미터
export interface LecturePaperSearchParams {
  lectureId?: string;
  from?: string; // 날짜 범위 시작 (YYYY-MM-DD)
  to?: string; // 날짜 범위 끝 (YYYY-MM-DD)
}

// 기존 RepositoryProblem 타입 (호환성 유지)
export interface RepositoryProblem {
  id: string;
  title: string;
  content: string;
  type: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation';
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  subject: string;
  grade: string;
  chapter?: string;
  topic?: string;
  tags: string[];
  category: string;
  source?: string; // 출처 (교재, 기출문제 등)
  year?: number; // 출제 연도
  isPublic: boolean;
  usageCount: number; // 사용 횟수
  averageDifficulty?: number; // 실제 난이도 (학생 피드백 기반)
  successRate?: number; // 정답률
  imageUrl?: string;
  solution?: string;
  hints?: string[];
  relatedProblems?: string[]; // 관련 문제 IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryPrescription {
  id: string;
  title: string;
  description: string;
  targetGrade: string;
  targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subject: string;
  topics: string[];
  problemSetIds: string[]; // 문제 세트 IDs
  duration: number; // 예상 소요 시간 (분)
  objectives: string[]; // 학습 목표
  prerequisites?: string[]; // 선수 학습 내용
  recommendedFor: {
    weaknesses?: string[]; // 약점 개선
    strengths?: string[]; // 강점 강화
    examPrep?: string[]; // 시험 대비
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'very_hard';
  tags: string[];
  category: string;
  isPublic: boolean;
  usageCount: number;
  rating?: number; // 평점 (1-5)
  reviews?: number; // 리뷰 수
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemSet {
  id: string;
  name: string;
  description?: string;
  problemIds: string[];
  totalPoints: number;
  estimatedTime: number; // 분
  order?: number[]; // 문제 순서
}

export interface RepositorySearchParams {
  query?: string;
  subject?: string;
  grade?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'very_hard';
  type?: 'multiple_choice' | 'short_answer' | 'essay' | 'calculation';
  tags?: string[];
  category?: string;
  source?: string;
  year?: number;
  minSuccessRate?: number;
  maxSuccessRate?: number;
  sortBy?: 'relevance' | 'difficulty' | 'usage' | 'rating' | 'created' | 'updated';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface RepositoryTag {
  id: string;
  name: string;
  category: 'subject' | 'topic' | 'skill' | 'difficulty' | 'custom';
  color?: string;
  description?: string;
  usageCount: number;
  createdAt: string;
}

export interface RepositoryCategory {
  id: string;
  name: string;
  parentId?: string; // 상위 카테고리
  level: number; // 카테고리 깊이 (0: 최상위)
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  problemCount: number;
  prescriptionCount: number;
  children?: RepositoryCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryImportData {
  type: 'problems' | 'prescriptions';
  format: 'json' | 'csv' | 'excel';
  data: any; // 실제 데이터는 format에 따라 다름
  options?: {
    overwrite?: boolean;
    skipDuplicates?: boolean;
    validateBeforeImport?: boolean;
    mapFields?: Record<string, string>; // 필드 매핑
  };
}

export interface RepositoryExportOptions {
  type: 'problems' | 'prescriptions' | 'both';
  format: 'json' | 'csv' | 'excel' | 'pdf';
  ids?: string[]; // 특정 항목만 내보내기
  filters?: RepositorySearchParams; // 필터 조건
  includeRelated?: boolean; // 관련 데이터 포함
  includeSolutions?: boolean; // 해답 포함
}

export interface RepositoryStatistics {
  totalProblems: number;
  totalPrescriptions: number;
  problemsBySubject: Record<string, number>;
  problemsByGrade: Record<string, number>;
  problemsByDifficulty: Record<string, number>;
  problemsByType: Record<string, number>;
  prescriptionsBySubject: Record<string, number>;
  prescriptionsByGrade: Record<string, number>;
  prescriptionsByLevel: Record<string, number>;
  mostUsedProblems: {
    id: string;
    title: string;
    usageCount: number;
  }[];
  topRatedPrescriptions: {
    id: string;
    title: string;
    rating: number;
  }[];
  recentlyAdded: {
    problems: RepositoryProblem[];
    prescriptions: RepositoryPrescription[];
  };
  lastUpdated: string;
}

// Print Modal 관련 타입들
export interface SimpleStudentVO {
  userId: string;
  name: string;
  schoolName: string;
  userStudyPaperId?: string;
}

export interface StudentStudyPaperId {
  userId: string;
  userStudyPaperId: string;
}

export interface M38UserStudyPaper {
  id: string;
  userId: string;
  lecturePaperId: string;
  data?: any;
  created: string;
  updated: string;
}

export enum PrintType {
  paper = "paper",
  quickanswer = "quickanswer", 
  answers = "answers"
}

// Answer Input Modal 관련 타입들
export interface M38UserStudyPaperVO {
  userStudyPaperId: string;
  userId: string;
  studentName: string;
  userLoginId: string;
  lectureName: string;
  state: PaperState;
  score: number;
}

export interface PaperAnswerSheet {
  userStudyPaperId: string;
  studentName: string;
  lectureName: string;
  paperName: string;
  answerList: ProblemAnswer[];
}

export interface ProblemAnswer {
  problemId: string;
  problemNumber: number;
  value?: {
    answers: Answer[];
  };
  correct: number; // -2: 오답, -1: 부분오답, 0: 미채점, 1: 부분정답, 2: 정답
}

export interface Answer {
  dataType: "mathTex" | "math" | "choice" | "katex" | "text";
  value: string;
}

export enum PaperState {
  ready = "ready",
  started = "started", 
  finished = "finished"
}