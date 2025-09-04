// 시험지 상세 정보 관련 타입 정의

// 문제 내용 타입
export interface ProblemContent {
  value: string;
  answerType: 'choice' | 'subjective';
  choice?: {
    alignType: string;
    values: string[];
    answer: number;
    answers?: any;
    multi: boolean;
    alignNumTop: boolean;
  };
  answer?: {
    answers: Array<{
      id: string;
      dataType: string;
      value: string;
      preDeco: string;
      postDeco: string;
      possibleOtherValues: any[];
    }>;
    ignoreOrder: boolean;
    count: number;
  };
}

// 해답 타입
export interface ProblemSolution {
  value: string;
  otherSolutions?: any;
}

// 태그 타입
export interface ProblemTag {
  type: string;
  value: string;
  academyId?: number;
  paperId?: string;
  fileId?: string;
  skillId?: string;
  inPaper?: boolean;
  inSkillOrPaper?: boolean;
}

// 문제 상세 정보 타입
export interface ProblemDetail {
  problemId: string;
  groupId: number;
  academyId: number;
  subjectId: number;
  creator: string;
  atype: string;
  ltype: string;
  fileId: string;
  bookName: string;
  page?: any;
  problemNumber: string;
  content: ProblemContent;
  solution: ProblemSolution;
  difficulty: string;
  tags: ProblemTag[];
  meta?: any;
  printHeight: number;
  accessableIds?: any;
  needToRecache: boolean;
  checkType: string;
  contentsImageId: string;
  solutionImageId?: any;
  images?: any;
  bookId: string;
  app?: any;
  sample?: any;
  quotedFrom?: any;
  quotedFromDetail?: any;
}

// 문제 정보 타입
export interface ProblemInfo {
  problemNumber: string;
  margin: number;
  height: number;
  problemId: string;
  skillId: string;
  skillName: string;
  problem: ProblemDetail;
  correct: number;
  level: number;
  ltype: string;
  answerType: string;
  answer?: any;
}

// 페이지 타입
export interface ExamPage {
  leftSet: ProblemInfo[];
  rightSet: ProblemInfo[];
  pageNumber: number;
  solutions: boolean;
}

// 시험지 상세 정보 타입
export interface ExamPaperDetail {
  paperId: string;
  academyId: number;
  academyName: string;
  subjectId: number;
  subjectName?: string;
  paperGroupId: number;
  paperGroupName: string;
  title: string;
  countProblems: number;
  pages: ExamPage[];
}