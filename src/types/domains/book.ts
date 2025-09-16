/**
 * 교재(Book) 관련 타입 정의
 */

import { M38GeneratedPaper } from './paper';
import { ProblemAnswerType } from './problem';

// Book 관련 열거형
export enum EducationCourse {
  Md2015 = "Md2015",
  Md2022 = "Md2022",
}

export enum BookState {
  wait = "wait",
  usable = "usable",
  unavailable = "unavailable",
}

export enum BookType {
  입문 = "입문",
  실력 = "실력",
  심화 = "심화",
  내신 = "내신",
  몰입 = "몰입",
  방학 = "방학",
  특강 = "특강",
}

export enum M38BookContentType {
  cover_front = "cover_front",
  indexes = "indexes",
  concept = "concept",
  paper = "paper",
  insert = "insert",
  cover_back = "cover_back",
}

// Lecture Book 관련
export interface M38LectureBook {
  lectureBookId: string;
  educationCourse: EducationCourse;
  grade: number;
  semester: number;
  subjectId: number;
  subjectName: string;
  bookName: string;
  state: BookState;
  type: BookType;
  created: Date;
  contentList: M38BookContent[];
}

export interface M38LectureBookVO {
  lectureBookId: string;
  educationCourse: EducationCourse;
  grade: number;
  semester: number;
  subjectId: number;
  subjectName: string;
  bookName: string;
  state: BookState;
  type: BookType;
  paperCount: number;
  created: Date;
}

export interface M38BookContent {
  id: string;
  contentType: M38BookContentType;
  title: string;
  problemCount: number;
  pages: number;
  paperIndex: number;
}

export interface M38BookConcept extends M38BookContent {
  contentImages: string[];
}

export interface M38BookContentImage extends M38BookContent {
  contentImage: string;
}

export interface M38BookProblems extends M38BookContent {
  bookPaperId: string;
  paper?: M38GeneratedPaper;
}

// WorkBook 관련
export interface M38WorkBook {
  workBookId: string;
  educationCourse: EducationCourse;
  grade: number;
  semester: number;
  subjectId: number;
  subjectName: string;
  bookName: string;
  state: BookState;
  paperCount: number;
  paperList?: M38WorkBookPaper[];
}

export interface M38WorkBookPaper {
  workBookPaperId: string;
  workBookId: string;
  orderIndex: number;
  problemCounts: number;
  title: string;
}

export interface M38WorkBookProblem {
  problemId: string;
  workBookPaperId: string;
  orderIndex: number;
  problemNumber: string;
  page: number;
  skillId: string;
  skillName: string;
  level: number;
  ltype: string;
  type: ProblemAnswerType;
  multiline: boolean;
  answer: string;
  answerList: string[];
}

// Search Filters
export interface WorkBookSearchFilter {
  educationCourse?: EducationCourse;
  grade: number;
  semester: number;
  subjectId: number;
  bookName: string;
  state?: BookState | undefined;
  pageNum: number;
  size: number;
}

export interface LectureBookSearchFilter {
  grade: number;
  semester: number;
  subjectId: number;
  bookName: string;
  state?: BookState | undefined;
  type?: BookType | undefined;
  pageNum: number;
  size: number;
}