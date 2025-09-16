import { SpProblem } from "./problem";
import { ColumnFilterItem } from "./common";

// Paper 관련 타입
export enum PaperType {
    manual = "manual",
    addon_cw = "addon_cw",
    addon_cs = "addon_cs",
    addon_pw = "addon_pw",
    addon_ps = "addon_ps",
    workbook_paper = "workbook_paper",
    workbook_addon = "workbook_addon",
    personal_addon = "personal_addon",
    academy_contents = "academy_contents",
}


export interface SpStaticPaper extends GeneratedPaper {
  paperGroupId: number;
  problemIds: string[];
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

export interface M38GeneratedPaper extends GeneratedPaper {
  lectureId: string;
  lectureTitle: string;
  creatorId: string;
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
  problem: SpProblem;
  level: number;
  ltype: string;
  answerType: string;
  skillId?: string;
  skillName?: string;
}

// Paper 유틸리티 함수 및 상수
export const clinicName = (type: PaperType): string => {
  switch (type) {
    case PaperType.manual:
      return "문제 출제";
    case PaperType.addon_cw:
      return "단원 오답";
    case PaperType.addon_cs:
      return "단원 유사";
    case PaperType.addon_pw:
      return "기간 오답";
    case PaperType.addon_ps:
      return "기간 유사";
    case PaperType.workbook_paper:
      return "출판교재";
    case PaperType.workbook_addon:
      return "교재유사";
    case PaperType.personal_addon:
      return "개인오답";
    case PaperType.academy_contents:
      return "학원콘텐츠";
    default:
      return "";
  }
};

// Paper Type 필터
export const PaperTypeFilter: ColumnFilterItem[] = [];
if (PaperTypeFilter.length === 0) {
  Object.values(PaperType).forEach((type) => {
    if (type) {
      PaperTypeFilter.push({ text: clinicName(type), value: type });
    }
  });
}

// Print 관련
export enum PrintType {
  paper = "paper",
  quickanswer = "quickanswer",
  answers = "answers",
}

export type PaperConfigType =
  | "lecture"
  | "savelecture"
  | "lecturebook"
  | "userstudypaper";

// Paper 생성 및 관리 인터페이스
export interface AddonPaperGenerateParam {
  lectureId: string;
  title: string;
  type: PaperType;
  withClass: boolean;
  studentIds: string[];
  chapterIds?: number[];
  skillIds?: string[];
  paperIds?: string[];
  maxLimit?: number;
  counts?: number[];
  categories: string[];
  porder: string;
  headerStyle?: React.CSSProperties;
}

export interface GeneratePaperParam {
  lectureId: string;
  lecturePaperId: string;
  type: PaperType;
  studentIds: string[];
}

export interface SpPaperVO {
  title: string;
  paperId: string;
  problemCount: number;
}

export interface PaperAnswerSheet {
  userStudyPaperId: string;
  answerList: ProblemAnswer[];
  lectureName: string;
  paperName: string;
  studentName: string;
}

export interface ProblemAnswer {
  problemNumber: string;
  problemId: string;
  correct: number;
  value: any; // Answer type from problem domain
}

// Similar Paper 관련
export type SimilarPaperRequestForm = {
  academyId: number;
  pages: PaperPageWrapper[];
}

export type PaperPageWrapper = {
  pageNumber: number;
  leftSet: PaperProblemWrapper[];
  rightSet: PaperProblemWrapper[];
}

export type PaperProblemWrapper = {
  problemNumber: string;
  problemId?: string;
  skillId: string;
  level: number;
  ltype: string;
  answerType: string;
}

// Academy Static Paper 관련
export interface AcademyStaticPaperDTO {
  paperId: string;
  academyId: number;
  academyName: string;
  subjectId: number;
  subjectName: string;
  paperGroupId: number;
  paperGroupName: string;
  title: string;
  countProblems: number;
  creatorId: string;
  deleted: boolean;
  deletionDate: Date;
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

export interface GenerateAcademyPaperVO {
  lectureId: string;
  title: string;
  paper: GeneratedPaper;
}



  