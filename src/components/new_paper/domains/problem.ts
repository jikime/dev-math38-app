/**
 * 문제(Problem) 관련 타입 정의
 */

// Problem 관련 타입
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

export interface Tag {
  type: string;
  value: string;
}

export interface ProblemContent {
  value: string;
  answerType: string;
  choice: ProblemChoice;
  answer: Answer;
}

export interface ProblemSolution {
  value: string;
  otherSolutions?: string[];
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

export enum ProblemAnswerType {
  주관식 = "주관식",
  객관식 = "객관식",
  서술형 = "서술형",
}

// Problem Search 관련
export interface ProblemSearch {
  subjectId: number;
  content: string;
  choiceValues: string[];
}

export interface ProblemListSearch {
  lectureId: string;
  subjectId: number;
  problemSearchList: ProblemSearch[];
}

export interface ProblemSearchResult {
  problemId: string;
  skillId: string;
  chapterId: number;
  chapterName: string;
  skillName: string;
  difficulty: string;
  ltype: string;
  distance?: number;
  similarity?: number;
}

export interface GeneratePaperData {
  subjectId: number;
  title: string;
  searchedProblems: ProblemSearchResult[];
}

export type LType = "calc" | "unds" | "resn" | "soln";