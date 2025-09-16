/**
 * 통계(Statistics) 관련 타입 정의
 */

import { PaperType } from './paper';
import { Answer } from './problem';

// Study Statistics 관련
export interface UserStudyPaperStatVO {
  paperIndex: number | null;
  userStudyPaperId: string;
  paperName: string;
  studnetId: string;
  studentName: string;
  score: number | null;
  submitDate: string;
  totalCount?: number | null;
  level4Count?: number | null;
  level5Count?: number | null;
  level3Count?: number | null;
  level2Count?: number | null;
  level1Count?: number | null;
  unAnsweredCount?: number | null;
  problemStats: UserProblemStat[];
}

export interface UserProblemStat {
  problemNumber: string;
  problemId: string;
  chapterIndex: string;
  answer?: string | null;
  level: string;
  ltype: string | null;
  answerType: string | null;
  skillId: string;
  skillName: string;
  score: number;
  personal: CorrectDetailRatio;
  classAvg: CorrectRatio;
  academyAvg: CorrectRatio;
  nationalAvg: CorrectRatio;
}

export interface CorrectRatio {
  meets: number;
  corrects: number;
  scores?: number[] | null;
  average?: number;
}

export interface CorrectDetailRatio {
  meets: number;
  corrects: number;
  scores: PaperProblemScore[];
  average?: number;
}

export interface PaperProblemScore {
  userPaperId: string;
  problemId: string;
  paperType: PaperType;
  submitDate: string;
  score: number;
}

export interface PaperProblemInfoRO {
  paperName: string;
  problemNumber: string;
  score: number;
  answerType: string;
  answer?: Answer;
  submitDate: string;
  examDate: string;
  answerSheetId: string;
}

// Academy Analysis
export interface StatusCount {
  name: string;
  count: number;
}

export interface AcademyAnalysis {
  idx: number;
  teacher: string;
  grade: string;
  lecture: string;
  students: number;
  counts: number;
  rate: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  avg: number;
}

export interface TAcademyAnalysis {
  lectureId: string;
  lectureName: string;
  teacherId: string;
  teacherName: string;
  state: any; // LectureState
  paperCount: number;
  studentCount: number;
  finishedCount: number;
  levelProblems: number[];
  average: number;
  progressRatio: number;
}

// 기타 타입들
export interface Subject {
  subjectId?: string;
}

export interface Chapter {
  chapterId?: string;
}