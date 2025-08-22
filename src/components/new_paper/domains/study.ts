/**
 */

import { PaperType, PaperPage } from './paper';
import { PaperState, ProblemCounts } from './lecture';
import { Answer } from './problem';

// Save Lecture 
export interface SaveLectureVO {
  lectureId: string;
  grade: number | undefined;
  subjectId: number | undefined;
  name: string;
  paperCount: number;
  created: Date;
}

export interface SaveLecture {
  saveLectureId: string;
  lectureId: string;
  academyId: number;
  title: string;
  grade: number;
  subjectId: number;
  paperCount: number;
  paperList: any[]; // M38LecturePaper[]
  created: Date;
  updated: Date;
}

export type SaveLectureFilter = {
  grade?: number;
  keyword?: string;
  pageNum: number;
  size: number;
};

// Provided Folder 
export interface ProvidedFolder {
  folderId: string;
  grade: number;
  subjectId?: number;
  academyId: number;
  folderName: string;
  folderOrder: number;
  paperCount: number;
  paperList: ProvidedPaper[];
  created: string;
  updated: string;
}

export interface ProvidedPaper {
  paperId?: number;
  subjectId: number;
  folderId: string;
  paperRefId: string;
  paperIndex?: number;
  name: string;
  counts?: ProblemCounts;
  created?: Date;
  updated?: Date;
}

// User Study Paper 
export interface M38UserStudyPaper {
  userStudyPaperId: string;
  lectureId: string;
  lecturePaperId: string;
  paperId: string;
  paperType: PaperType;
  lectureTitle: string;
  title: string;
  academyName: string;
  academyId: number;
  academyLogo?: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  grade: number;
  subjectId: number;
  subjectName: string;
  chapterFrom: string;
  chapterTo: string;
  chapterIds: number[];
  categoriesFilter: string[];
  state: PaperState;
  corrects: number;
  wrongs?: WrongProblem[];
  pages: PaperPage[];
  skillProblemsMap: Map<string, string[]>;
  headerStyle?: React.CSSProperties;
}

export interface WrongProblem {
  skillId: string;
  problemId: string;
}

export interface M38UserStudyPaperVO {
  userStudyPaperId: string;
  title: string;
  studentId: string;
  userLoginId: string;
  studentName: string;
  state: PaperState;
  score: number;
}

export interface M38UserStudyPaperSimpleState {
  userStudyPaperId: string;
  state: PaperState;
  score: number;
}


