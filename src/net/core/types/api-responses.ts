/**
 * API 응답 타입 정의
 * 각 API 서비스별 응답 타입을 명확하게 정의
 */

import { PaperType, M38Lecture, GeneratedPaper, M38UserStudyPaper } from '@/types/typings';

// SimpleLecture 타입이 없으므로 임시로 정의
type SimpleLecture = M38Lecture;

// ========== 인증 관련 타입 ==========

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  academyId?: string;
  teacherId?: string;
}

export interface AuthSession {
  user: SessionUser;
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
  name?: string;
  academyId?: string;
  academyName?: string;
  authorities?: string[];
}


// ========== 시험지 관련 타입 ==========

export interface PaperListItem {
  paperId: string;
  title: string;
  type: PaperType;
  subjectId: number;
  subjectName: string;
  problemCount: number;
  created: string;
  modified?: string;
  tags?: string[];
  difficulty?: number;
}

export interface SavePaperRequest {
  paperId?: string;
  title: string;
  type: PaperType;
  subjectId: number;
  pages: any[]; // 실제 페이지 구조는 복잡함
  chapterIds?: number[];
  skillIds?: string[];
  problemTypeCounts?: Record<string, number>;
  categoriesFilter?: string[];
  headerStyle?: Record<string, any>;
}

export interface SavePaperResponse {
  success: boolean;
  paperId: string;
  message?: string;
}

// ========== 처방학습 관련 타입 ==========

export interface AddonPaperGenerateParams {
  title: string;
  lectureId: string;
  studentIds?: string[];
  chapterIds?: number[];
  skillIds?: string[];
  withClass?: boolean;
  maxLimit?: number;
  categories?: string[];
  periodFrom?: string;
  periodTo?: string;
  minErrorRate?: number;
}

// ========== 오류 신고 관련 타입 ==========

export interface ErrorReport {
  reportId: string;
  problemId: string;
  problemNo: string;
  reportType: 'answer' | 'content' | 'image' | 'other';
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  response?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ErrorReportListResponse {
  content: ErrorReport[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}




// ========== 파일 업로드 관련 타입 ==========

export interface SchoolPaperSearchParams {
  region?: string;
  year?: number;
  semester?: number;
  grade?: number;
  schoolType?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

export interface SchoolPaperSearchResult {
  papers: any[]; // 실제 사용 시 적절한 타입으로 교체 필요
  totalCount: number;
  page: number;
  pageSize: number;
}

// ========== 휴지통 관련 타입 ==========

export interface DeletedPaper {
  lectureId: string;
  lectureName: string;
  lecturePaperId: string;
  paperId: string;
  paperRefId: string;
  paperTitle: string;
  subjectName: string;
  problemCount: number;
  distributedCount: number;
  deletionTime: string | number[];
  created?: number[];
}

export interface RestorePaperResponse {
  success: boolean;
  message?: string;
  restoredPaperId?: string;
}

