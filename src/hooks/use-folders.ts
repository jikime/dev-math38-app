import { useApiQuery, useApiMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';

// 폴더 관련 타입 정의
export interface ProvidedFolder {
  folderId: string;
  subjectId: number | null;
  grade: number;
  academyId: number;
  folderName: string;
  groupId: string;
  folderOrder: number;
  paperCount: number;
  childFolderCount: number;
  paperList: null;
  created: string;
  updated: string;
}

export interface ProvidedFolderGroup {
  groupId: string;
  academyId: number;
  grade: number;
  groupName: string;
  groupOrder: number | null;
  folderCount: number;
  folders: ProvidedFolder[];
  created: string;
  updated: string;
}

// Save Lecture 관련 타입 정의
export interface SaveLecture {
  index: number | null;
  lectureId: string;
  grade: number;
  subjectId: number;
  name: string;
  paperCount: number;
  created: string;
}

export interface SaveLectureListResponse {
  content: SaveLecture[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface SaveLectureListParams {
  grade: number;
  keyword: string;
  pageNum: number;
  size: number;
}

// Save Lecture Paper 관련 타입 정의
export interface SaveLecturePaper {
  lecturePaperId: string;
  paperIndex: number;
  lectureId: string;
  paperRefId: string;
  name: string;
  type: string;
  bookTitle: string | null;
  grade: number;
  subjectId: number;
  range: string;
  counts: {
    count: number;
    countChoice: number;
    countEssay: number;
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };
  difficulty: number;
  state: string | null;
  paperCount: number;
  finishedCount: number;
  average: number;
  published: string | null;
  created: string;
  updated: string;
}

// 폴더 쿼리 키
const folderKeys = {
  all: [...queryKeys.all, 'folder'] as const,
  byGrade: (grade: number) => [...folderKeys.all, 'byGrade', grade] as const,
  saveLectures: (params: SaveLectureListParams) => [...folderKeys.all, 'saveLectures', params] as const,
  saveLecturePapers: (lectureId: string) => [...folderKeys.all, 'saveLecturePapers', lectureId] as const,
};

// ===== 폴더 조회 =====

// 학년별 폴더 그룹 조회
export function useFoldersByGrade(grade: number | undefined) {
  return useApiQuery<ProvidedFolderGroup[]>(
    grade ? folderKeys.byGrade(grade) : ['disabled'],
    grade ? `/api/m38/provided/group/byGrade/${grade}` : '',
    {
      enabled: !!grade,
      // 폴더 데이터는 자주 변하지 않으므로 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );
}

// ===== Save Lecture 조회 =====

// Save Lecture 목록 조회
export function useSaveLectures(params: SaveLectureListParams | null) {
  return useApiMutation<SaveLectureListResponse, SaveLectureListParams>(
    '/api/m38/savelecture/list',
    {
      method: 'POST',
    }
  );
}

// Save Lecture Papers 조회
export function useSaveLecturePapers(lectureId: string | undefined) {
  return useApiQuery<SaveLecturePaper[]>(
    lectureId ? folderKeys.saveLecturePapers(lectureId) : ['disabled'],
    lectureId ? `/api/m38/savelecture/papers/${lectureId}` : '',
    {
      enabled: !!lectureId,
      staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
      cacheTime: 10 * 60 * 1000, // 10분간 메모리 유지
    }
  );
}