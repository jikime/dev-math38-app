/**
 * 강좌(Lecture) 관련 타입 정의
 */

import { M38User } from "./user";
import { PaperType } from "./paper";
import { BasicFilter2 } from "./common";

// 강좌 상태
export enum LectureState {
  wait = "wait",
  usable = "usable",
  unavailable = "unavailable",
  finish = "finish",
}

// 강좌 사용자 상태
export enum LectureUserState {
  usable,
  unavailable,
}

// 강좌 목록 정렬
export enum LectureListOrder {
  created,
}

// 강좌 정보
export interface M38Lecture {
  lectureId: string;
  academyId: number;
  name: string;
  grade: number;
  subjectId: number;
  teacherId: string;
  teacher: M38User;
  state: LectureState;
  start: string;
  end: string;
  studentList: Array<M38LectureUser>;
  studentCount: number;
  paperList: Array<M38LecturePaper>;
  paperCount: number;
  created: string;
  updated: string;
}

// 강좌 사용자
export interface M38LectureUser {
  lectureId: string;
  userId: string;
  state: LectureUserState;
  created: string;
  updated: string;
}

// 강좌 시험지
export interface M38LecturePaper extends LeveledPaper {
  lecturePaperId: string;
  paperIndex: number;
  lectureId: string;
  paperRefId: string;
  name: string;
  bookTitle?: string;
  grade: number;
  subjectId: number;
  rangeFrom: string;
  rangeTo: string;
  state: PaperState;
  paperCount: number;
  finishedCount: number;
  count: number;
  countChoice: number;
  countEssay: number;
  difficulty: number;
  published: Date;
  created?: Date;
  updated?: Date;
}

// 레벨별 시험지
export interface LeveledPaper {
  type: PaperType;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

// 시험지 상태
export enum PaperState {
  published = "published", // 발행
  printed = "printed", // 인쇄
  checking = "checking", // 풀이중
  finished = "finished", // 풀이끝.. 채점
  canceled = "canceled", // 취소
}

// 진행 상태
export enum ProgressState {
  ready = "ready",
  published = "published",
  finished = "finished",
  cliniced = "cliniced",
  ended = "ended",
}

// 강좌 VO
export interface LectureVO {
  id: number;
  lectureId: string;
  grade: number | undefined;
  subjectId: number | undefined;
  subjectName?: string;
  teacherId: string | undefined;
  teacherName: string;
  name: string;
  state: LectureState;
  paperCount: number;
  studentCount: number;
  startDate: string | undefined;
  endDate: string | undefined;
  studentIdList: string[];
}

// 강좌 ID와 이름
// export interface LectureIdName {
//   lectureId: string;
//   lectureName: string;
// }

// 강좌 Form 값
export interface LectureFormvalues {
  grade: number;
  name: string;
  startEndDate: Date[];
  teacherId: string;
}

// 강좌 시험지 RO
export interface LecturePaperRO extends LeveledPaper {
  lecturePaperId: string;
  paperIndex: number;
  lectureId: string;
  paperRefId: string;
  name: string;
  bookTitle: string;
  grade: number | null;
  subjectId: number | null;
  range: string;
  counts: ProblemCounts;
  difficulty: number;
  state: ProgressState;
  paperCount: number;
  finishedCount: number;
  average: number;
  published: Date;
  created: Date;
  updated: Date;
}

// 문제 수 카운트
export interface ProblemCounts {
  count: number;
  countChoice: number;
  countEssay: number;
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

// 강좌 시험지 VO
export interface LecturePaperVO {
  paperId: string;
  paperIndex: number;
  paperRefId: string;
  type: PaperType;
  lectureId: string;
  name: string;
  difficulty: number;
  count: number;
  countChoice: number;
  countEssay: number;
}

// 강좌 시험지 통계 VO
export interface LecturePaperStatsVO {
  lectureId: string;
  paperIndex: number;
  publishedDate: string;
  subjectId: number;
  subjectName: string;
  paperType: string;
  paperName: string;
  publishedPaperCount: number;
  averageScore: number;
  studentScores: any;
}

// 강좌 통계 VO
export interface LectureStatVO {
  lectureId: string;
  lectureName: string;
  subjectId: number;
  subjectName: string;
  studentVOList: any[]; // SimpleStudentVO
  paperStatsVOList: LecturePaperStatsVO[];
}

// 강좌 학습 통계 VO
export interface M38LectureStudyStatVO {
  lectureId: string;
  userId: string;
  name: string;
  grade: number;
  index: number;
  paperCount: number;
  finishedCount: number;
  scores: number[];
  levelProblems: number[];
  average: number;
  progressRatio: number;
}

// 강좌 통계 VO
export interface M38LectureStatVO {
  lectureId: string;
  lectureName: string;
  teacherId: string;
  teacherName: string;
  state: LectureState;
  paperCount: number;
  studentCount: number;
  finishedCount: number;
  levelProblems: number[];
  average: number;
  progressRatio: number;
}

// 검색 필터
export interface LectureListFilter extends BasicFilter2 {
  teacherId: string | undefined;
  subjectId: number | undefined;
  name: string | undefined;
  grade: number;
  state?: LectureState | undefined;
  order?: LectureListOrder;
  asc?: boolean;
}

export interface LectureSearchFilter {
  academyId: number;
  teacherId?: string;
  grade?: number;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  size: number;
}

export interface M38LectureStudyStatFilter {
  academyId: number;
  teacherId?: string;
  lectureId?: string;
  grade?: number;
  name?: string;
  pageNum: number;
  size: number;
}

export interface M38LectureSearchStatFilter {
  lectureId: string | undefined;
  cutline: number;
}