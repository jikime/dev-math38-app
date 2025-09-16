/**
 * 학교(School) 및 시험(Exam) 관련 타입 정의
 */

import { SpProblem } from './problem';
import { ColumnFilterItem } from './common';

// School 관련
export interface School {
  type: string;
  office: string;
  code: string;
  name: string;
  nameEng: string;
  schoolKind: string;
  city: string;
  org: string;
  foundation: string;
  post: string;
  address: string;
  addressDetail: string;
  tel: string;
  homepage: string;
  mf: string;
  fax: string;
  highSchoolType: string;
  specialccclExist: string;
  kind: string;
  specialMajor: string;
  entranceExam: string;
  dayNightType: string;
  foundDate: string;
  openDate: string;
  updated: string;
}

export interface SchoolsCount {
  schoolCode: number;
  schoolName: string;
  type: string;
  count: number;
}

export interface SchoolsCountList {
  list: [SchoolsCount[] | [], SchoolsCount[] | [], SchoolsCount[] | []];
}

export interface GradesCountList {
  academyId: number;
  grade: number;
  gradeName: string;
  count: number;
}

// Chapter 관련
export enum MathDomain {
  numbers = "numbers",
  algebra = "algebra",
  geometry = "geometry",
  functions = "functions",
  probability = "probability",
}

export interface ChapterDto {
  chapterId: number;
  chapterName: string;
  chapterIndex: string;
  domain: MathDomain;
  level: number;
  subChapters?: ChapterDto[];
  stats?: ChapterStats;
}

export interface GradeChaptersDto {
  gradeName: string;
  domainChapters: {
    [key in MathDomain]?: ChapterDto[];
  };
}

export interface ChapterTableProps {
  gradeChapters: GradeChaptersDto[];
}

export interface ChapterStats {
  chapterId: number;
  total: number;
  correct: number;
  partialCorrect: number;
  partialWrong: number;
  wrong: number;
}

// Exam 관련
export interface Region {
  id: number;
  name: string;
  districts: District[];
}

export interface District {
  id: number;
  name: string;
  region: Region;
  schools: ExamSchool[];
}

export interface ExamSchool {
  id: number;
  code: string;
  name: string;
  nameEng: string;
  schoolKind: string;
  district: District;
  examPapers: ExamPaper[];
}

export interface ExamPaper {
  id: number;
  grade: number;
  year: number;
  examType: string;
  paperRefId: string;
  school: ExamSchool;
}

export type GradeExamPapersDTO = {
  grade: number;
  examPaperRefs: (string | null)[];
}

export interface YearExamPapersDTO {
  year: number;
  gradeExamPapers: GradeExamPapersDTO[];
}

export interface ExamSchoolDTO {
  id: number;
  code: string;
  name: string;
  nameEng: string;
  schoolKind: string;
  yearExamPapers: YearExamPapersDTO[];
}

export interface RegionDTO {
  id: number;
  name: string;
}

export interface DistrictDTO {
  id: number;
  name: string;
  regionId: number;
}

export interface ExamPaperDTO {
  id: number;
  grade: number;
  year: number;
  examType: string;
  paperRefId: string;
  schoolId: number;
  schoolName: string;
  districtName: string;
  regionName: string;
}

export enum ExamType {
  M1 = "m1",
  F1 = "f1",
  M2 = "m2",
  F2 = "f2",
}

export const examTypeLabels: Record<ExamType, string> = {
  [ExamType.M1]: "1학기 중간",
  [ExamType.F1]: "1학기 기말",
  [ExamType.M2]: "2학기 중간",
  [ExamType.F2]: "2학기 기말",
};

// Subject 필터 (학년별)
export const SubjectFilter: ColumnFilterItem[] = [
  { text: "초4", value: 2 },
  { text: "초5", value: 3 },
  { text: "초6", value: 4 },
  { text: "중1", value: 5 },
  { text: "중2", value: 6 },
  { text: "중3", value: 7 },
  { text: "수(상)", value: 8 },
  { text: "수(하)", value: 9 },
  { text: "수1", value: 10 },
  { text: "수2", value: 11 },
  { text: "미적", value: 12 },
  { text: "확통", value: 13 },
  { text: "기벡", value: 14 },
  { text: "모의고사", value: 15 },
  { text: "공통수학1[2022개정]", value: 16 },
  { text: "공통수학2[2022개정]", value: 17 },
  { text: "대수[2022개정]", value: 18 }
];

export interface ExamPaperFilter {
  districtIds?: number[];
  years?: number[];
  examTypes?: string[];
  schoolIds?: number[];
  grade?: number | null;
}

export interface SchoolYearGradePaperInput {
  schoolId: number;
  year: number;
  grade: number;
  examType: string;
  examPaperId: string;
}

// Math Problem File 관련
export interface MathProblemFile {
  fileId: string;
  title: string;
  groupId: string | null;
  pageCount: number;
  problemCount: number;
  hmlFilePath: string | null;
  htmlFilePath: string | null;
  tags: string[] | null;
  school: string | null;
}

export interface MathPaperResource extends MathProblemFile {
  school: string | null;
  year: number | null;
  grade: number | null;
  examType: string | null;
  pastExamId: number | null;
  bookGroupId: number;
  bookGroup: any;
  academyId: number;
  userId: number;
  path: string;
  subjectId: number;
  chapterId: number | null;
  problemList: SpProblem[];
  pages: string[] | null;
  created?: Date | null;
  imageFile?: boolean;
}

export interface PastExamDTO {
  region: string;
  district: string;
  school: string;
  grade: number;
  year: number;
  examType: string;
  paperRefId: string;
  problemList: SpProblem[];
}