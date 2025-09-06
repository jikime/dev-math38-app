// 문제 뷰어 관련 타입 정의

// 실제 API 응답에 맞는 문제 타입
export interface Problem {
  problemId: string;
  groupId: number;
  academyId: number;
  subjectId: number;
  creator: string | null;
  atype: string;
  ltype: string; // 'calc' | 'soln' | 'resn' | 'unds'
  fileId: string;
  bookName: string;
  page: number | null;
  problemNumber: string;
  content: ProblemContent;
  solution: ProblemSolution;
  difficulty: string; // '1' | '2' | '3' | '4' | '5'
  tags: ProblemTag[];
  meta: any;
  printHeight: number;
  accessableIds: any;
  needToRecache: boolean;
  checkType: string;
  contentsImageId: string | null;
  solutionImageId: string | null;
  images: any;
  bookId: string;
  app: any;
  sample: any;
  quotedFrom: any;
  quotedFromDetail: any;
}

// 문제 내용 타입
export interface ProblemContent {
  value: string; // HTML 형태의 문제 내용
  answerType: string | null;
  choice: {
    alignType: string;
    values: string[];
    answer: number;
    answers: any[];
    multi: boolean;
    alignNumTop: boolean;
  };
  answer: {
    answers: Array<{
      id: string | null;
      dataType: string;
      value: string;
      preDeco: string | null;
      postDeco: string | null;
      possibleOtherValues: string[] | null;
    }>;
    ignoreOrder: boolean;
    count: number;
  };
}

// 문제 해설 타입
export interface ProblemSolution {
  value: string; // HTML 형태의 해설
  otherSolutions: any;
}

// 문제 태그 타입
export interface ProblemTag {
  type: string; // 'file' | 'paper' | 'category' | 'skill'
  value: string;
  fileId?: string;
  academyId?: number;
  paperId?: string;
  skillId?: string;
  inPaper: boolean;
  inSkillOrPaper: boolean;
}

// 커리큘럼 정보
export interface CurriculumInfo {
  grade: string;
  semester: string;
  chapter: string;
  unit: string;
  skill: string;
}

// 문제 필터 타입
export interface ProblemFilter {
  difficulty?: string[];
  ltype?: string[];
  choiceType?: string[];
  skillIds?: string[];
  searchText?: string;
}

// 문제 통계
export interface ProblemStats {
  total: number;
  byDifficulty: Record<string, number>;
  byLtype: Record<string, number>;
  byChoiceType: Record<string, number>;
  bySkill: Record<string, number>;
}

// 문제 상태 (학습 진도)
export interface ProblemStatus {
  problemId: string;
  status: 'unsolved' | 'solving' | 'solved' | 'confirmed';
  solvedAt?: string;
  attempts: number;
  isCorrect?: boolean;
}

// 실제 API 응답 타입 (단일 파일 정보 + 문제 목록)
export interface FileWithProblems {
  bookGroupId: number;
  bookGroup: {
    bookGroupId: number;
    academyId: number;
    parentBookGroupId: number | null;
    subjectId: number;
    groupName: string;
    indexNum: number;
    canRemove: boolean;
    groupType: number;
    subList: any;
    created: string;
    title: string;
    value: any;
    key: string;
    children: any;
  };
  fileId: string;
  academyId: number;
  userId: string;
  title: string;
  path: string;
  indexNum: number;
  subjectId: number;
  chapterId: number | null;
  imageFile: boolean;
  pageCount: number;
  problemCount: number;
  pages: any;
  tags: any;
  created: string;
  problemList: Problem[];
}

// 페이지네이션 응답 (향후 사용을 위해 유지)
export interface PaginatedProblems {
  problems: Problem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: ProblemStats;
}

// 문제 뷰어 설정
export interface ProblemViewerSettings {
  layout: 'grid' | 'list';
  problemsPerPage: number;
  showAnswer: boolean;
  showExplanation: boolean;
  showCurriculum: boolean;
  autoSave: boolean;
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

export interface PaperPage {
  leftSet: PaperProblem[];
  rightSet: PaperProblem[];
  pageNumber: number;
  solutions: boolean;
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