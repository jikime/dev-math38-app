/**
 * 사용자(User) 관련 타입 정의
 */

import { User } from "next-auth";
import { BasicFilter2 } from "./common";

// 사용자 상태
export enum M38UserState {
  wait = "wait",
  usable = "usable",
  unavailable = "unavailable",
  graduate = "graduate",
}

// 사용자 권한
export interface M38Authority {
  ROLE_USER: string;
  ROLE_ADMIN: string;
  ROLE_STUDY: string;
  ROLE_TEACHER: string;
  ROLE_PRIME: string;
  userId: string;
  authority: string;
}

// 기본 사용자 정보
export interface M38User {
  userId: string;
  authorities: M38Authority[];
  enabled: boolean;
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  imageThumbnail: string;
  changePassword: boolean;
  academy: M38Academy;
  schoolCode: string;
  schoolName: string;
  state: M38UserState;
  grade: number;
  created: string;
  updated: string;
  studentCount: number;
  prime?: boolean;
}

// 학원 정보
export interface M38Academy {
  academyId: number;
  name: string;
  phoneNumber: string;
  district: string;
  registered: string;
  teacherCount: number;
  studyCount: number;
  type: number;
  created: string;
  updated: string;
}

// 학원 IP 사용자
export interface AcademyIpUser {
  userId: string;
  name: string;
  username: string;
  academyId: number;
  academyName: string;
  authorities: any[];
  loginMethod: string;
}

// 학생 상세 정보
export interface StudentDetails {
  userId: string;
  phone1: string;
  phone2: string;
  phone3: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  parentMobile1: string;
  parentMobile2: string;
  parentMobile3: string;
  memo: string;
}

// 학생 VO
export interface StudentVO {
  id: number;
  userId: string;
  enabled: boolean;
  name: string;
  email: string;
  image: string;
  schoolCode: string;
  schoolName: string;
  state: M38UserState;
  password: string;
  confirm: string;
  grade: number;
  phone1: string;
  phone2: string;
  phone3: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  parentMobile1: string;
  parentMobile2: string;
  parentMobile3: string;
  memo: string;
  created: Date;
  usableLectures: LectureIdName[];
}

// 간단한 학생 정보
export interface SimpleStudentVO {
  userId: string;
  name: string;
  email?: string | null;
  schoolName?: string | null;
  grade: number;
  score: number;
  wrongs?: number;
  userStudyPaperId?: string;
}

// 선생님 VO
export interface TeacherVO {
  id: number;
  userId: string;
  enabled: boolean;
  name: string;
  email: string;
  image: string;
  state: M38UserState;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  role: string;
}

// 학교 학생 VO
export interface SchoolStudentVO {
  userId: string;
  name: string;
  email: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  schoolName: string;
  grade: number;
  usableLectures: LectureIdName[];
  state: "usable";
}

// 강좌 ID와 이름 (임시 - lecture.ts로 이동 예정)
export interface LectureIdName {
  lectureId: string;
  lectureName: string;
}

// 사이트 사용자 (NextAuth 확장)
export interface SiteUser extends User {
  academyId: number;
  academyName: string;
  ip: string;
  valid: boolean;
  loginMethod?: string;
}

// 검색 필터
export interface StudentSearchFilter {
  pageNum: number;
  size: number;
  name: string;
  state?: M38UserState | undefined;
  grade: number;
  teacherId: string | undefined;
}

export interface TeacherSearchFilter extends BasicFilter2 {
  name: string;
  state?: M38UserState | undefined;
}

// 학생 학습 시험지 ID
export interface StudentStudyPaperId {
  userId: string;
  userStudyPaperId: string;
}