/**
 * 공통 타입 정의
 */

// UI 관련 공통 타입
export interface ColumnFilterItem {
  text: React.ReactNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}

export interface DataNode {
  title?: React.ReactNode;
  key: React.Key;
  isLeaf?: boolean;
  children?: DataNode[];
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  icon?: React.ReactNode;
}

export type SizeType = "small" | "middle" | "large" | undefined;

// 응답 관련 타입
export interface SimpleResponse {
  result: boolean;
  message: string;
}

export interface ErrorMessage {
  code: number;
  message: string;
  infos: any;
}

// 페이지네이션
export interface BasicFilter {
  pageNum: number;
  size: number;
}

export interface BasicFilter2 {
  page: number;
  pageSize: number;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: {
    sorted: boolean;
  };
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  number: number;
  size: number;
}

export interface PageRequest {
  page: number;
  size: number;
}

export interface ResponseProps<T> {
  content: T[];
  pageable: Pageable;
  totalElements: number;
}

export type TPagination = {
  current: number;
  pageSize: number;
  defaultPageSize: number;
  total: number;
};

// 일반 유틸리티 타입
export interface OnChangeHandler {
  (e: any): void;
}

export type SelectBoxProps = {
  name?: string;
  value?: string | number;
  defaultValue?: string;
  initialValue?: string;
  onChange?: OnChangeHandler;
  placeholder?: string;
  size?: SizeType;
  width?: number;
  required?: boolean;
  className?: string;
};

// Form 관련
export interface FormValues {
  title: string;
  description: string;
  modifier: string;
}

export interface FormFieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

// SWR Hooks
export type SwrHooksProps = {
  keyword?: string | undefined;
  grade?: number | undefined;
  state?: string | undefined;
  teacherId?: string | undefined;
  schoolCode?: string | undefined;
  pagination?: TPagination;
};

// 페이지 Props
export interface NextPageSpProps {
  title?: string;
  icon?: string;
  menukey?: string;
  auth: boolean;
}

// 유틸리티 상수
export const DIFFICULTY = ["최하", "하", "중", "상", "최상"];

export const getDifficulty = (difficulty: number): string => {
  if (difficulty < 1) return "";
  if (difficulty > 5) return "";
  return DIFFICULTY[difficulty - 1];
};

export const NUM = ["①", "②", "③", "④", "⑤"];

// Form 유효성 검사 규칙
export const SpRules = {
  default: [{ required: true, message: "" }],
  name: [{ required: true, message: "이름을 입력해 주세요!" }],
  userId: [{ required: true, message: "아이디를 입력해 주세요!" }],
  password: [{ required: true, message: "비밀번호를 입력해 주세요!" }],
  repassword: {
    required: true,
    message: "비밀번호를 재입력해 주세요!",
  },
  grade: [{ required: true, message: "학년 선택을 해 주세요!" }],
  phone: [{ required: true, message: "전화번호를 입력해 주세요!" }],
  mobile: [{ required: true, message: "휴대폰을 입력해 주세요!" }],
  parentMobile1: [
    { required: true, message: "부모님 휴대폰을 입력해 주세요!" },
  ],
  state: [{ required: true, message: "상태를 선택해 주세요!" }],
  part: [{ required: true, message: "구분을 선택해 주세요!" }],
  semester: [{ required: true, message: "학기를 선택해 주세요!" }],
  date: [{ required: true, message: "날짜를 선택해 주세요" }],
  educationCourse: [{ required: true, message: "교육과정을 선택해 주세요!" }],
};

// Tree 구조 관련
export interface PaperGroup extends DataNode {
  key: number;
  title: string;
  leaf?: boolean;
  children?: PaperGroup[];
}

export interface SpSubjectVO {
  key: number;
  title: string;
  leaf: boolean;
  children?: SpSubjectVO[];
}

export interface SpChapterVO extends DataNode {
  key: number;
  title: string;
  leaf?: boolean;
  children?: SpChapterVO[];
}

export interface ChapterNode extends DataNode {
  subjectId: number;
  title: string;
  key: number;
  children?: ChapterNode[];
}

export interface PaperGroupDataNode {
  value: string;
  title: string;
  children?: PaperGroupDataNode[];
}

// 기타 공통 타입
export type SkillCounts = {
  [key: string]: string[];
};

export interface ProblemAnswerVO {
  problemId: string;
  answer: string;
}

// 페이지 타입 (페이지네이션용)
export type Page<T> = {
  info: {
    page: number;
    results: number;
    seed: string;
    version: string;
  };
  results: Array<T>;
};