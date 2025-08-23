// 시험지 관련 타입 정의 - 기존 타입과 동일
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
  problem: SpProblem;
  level: number;
  ltype: string;
  answerType: string;
  skillId?: string;
  skillName?: string;
}

export interface SpProblem {
  problemId: string;
  groupId: number;
  academyId: number;
  subjectId: number;
  atype: string;
  ltype: "calc" | "unds" | "resn" | "soln";
  skillId?: string;
  skillName?: string;
  content: ProblemContent;
  solution: ProblemSolution;
  difficulty: string;
  tags?: Tag[];
  printHeight?: number;
}

export interface ProblemContent {
  value: string;
  answerType: string;
  choice: ProblemChoice;
  answer: Answer;
}

export interface ProblemChoice {
  alignType: string;
  values: string[];
  answer: number;
  answers: number[];
  multi: boolean;
  alignNumTop: boolean;
}

export interface Answer {
  answers: AnswerUnit[];
  ignoreOrder: boolean;
  count: number;
}

export interface AnswerUnit {
  id: string;
  dataType: string;
  value: string;
  preDeco: string;
  postDeco: string;
  possibleOtherValues: string[];
}

export interface ProblemSolution {
  value: string;
  otherSolutions?: string[];
}

export interface Tag {
  type: string;
  value: string;
}

export interface M38GeneratedPaper {
  paperId: string;
  title: string;
  lectureTitle: string;
  chapterFrom?: string;
  chapterTo?: string;
  pages: PaperPage[];
  subjectName?: string;
  teacherName?: string;
  studentName?: string;
  academyName?: string;
  academyLogo?: string;
  minMargin: number;
  columns: number;
  headerStyle?: React.CSSProperties;
  lectureId: string;
  creatorId: string;
}

export interface AcademyStaticPaper {
  paperId: string | undefined;
  academyId: number;
  academyName: string;
  subjectId: number;
  subjectName: string;
  paperGroupId: number;
  paperGroupName: string;
  title: string;
  countProblems: number;
  pages: PaperPage[];
  solutionPages?: PaperPage[];
  columns: number;
  created?: Date;
  updated?: Date;
  creatorId?: string;
  minMargin?: number;
}

export const NUM = ["①", "②", "③", "④", "⑤"];
