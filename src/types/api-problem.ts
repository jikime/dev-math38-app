// API 응답을 위한 문제 타입 정의

export interface ApiProblemContent {
  value: string;
  answerType: "choice" | "short" | "essay";
  choice?: {
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
      possibleOtherValues: string | null;
    }>;
    ignoreOrder: boolean;
    count: number;
  };
}

export interface ApiProblemSolution {
  value: string;
  otherSolutions: string | null;
}

export interface ApiProblemTag {
  type: "skill" | "paper" | "keyword" | "category" | "file";
  value: string;
  skillId?: string;
  academyId?: number;
  paperId?: string;
  fileId?: string;
  inPaper: boolean;
  inSkillOrPaper: boolean;
}

export interface ApiProblem {
  problemId: string;
  groupId: number;
  academyId: number;
  subjectId: number;
  creator: string | null;
  atype: string;
  ltype: string;
  fileId: string;
  bookName: string;
  page: number | null;
  problemNumber: string;
  content: ApiProblemContent;
  solution: ApiProblemSolution;
  difficulty: string;
  tags: ApiProblemTag[];
  meta: any;
  printHeight: number;
  accessableIds: number[];
  needToRecache: boolean;
  checkType: string;
  contentsImageId: string | null;
  solutionImageId: string | null;
  quotedFromDetail: any;
  bookId: string;
  images: any;
  app: any;
  sample: any;
  quotedFrom: any;
}

export type ApiProblemsResponse = ApiProblem[];

// use-problems hook에 추가할 스킬별 문제 조회 함수용 타입
export interface SkillProblemsParams {
  skillId: string;
}