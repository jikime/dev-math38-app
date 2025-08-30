// 클라우드 스토리지 관련 타입 정의

// 북그룹(폴더) 타입
export interface CloudBookGroup {
  bookGroupId: number;
  academyId: number;
  parentBookGroupId: number | null;
  subjectId: number;
  groupName: string;
  indexNum: number;
  canRemove: boolean;
  groupType: number;
  subList: any | null;
  created: string;
  title: string;
  value: any | null;
  key: string;
  children: CloudBookGroup[] | null;
}

// 북그룹 상세 정보 타입 (단일 아이템)
export interface CloudBookGroupDetail {
  bookGroupId: number;
  academyId: number;
  parentBookGroupId: number | null;
  subjectId: number;
  groupName: string;
  indexNum: number;
  canRemove: boolean;
  groupType: number;
  subList: any | null;
  created: string;
  title: string;
  value: any | null;
  key: string;
  children: any | null;
}

// 리소스 문제 파일 타입
export interface CloudResourceProblem {
  bookGroupId: number;
  bookGroup: any | null;
  fileId: string;
  academyId: number;
  userId: string;
  title: string;
  path: string;
  indexNum: number;
  subjectId: number;
  chapterId: number | null;
  imageFile: boolean;
  pageCount: number;
  problemCount: number;
  pages: any | null;
  tags: any | null;
  created: string;
  problemList: any | null;
}