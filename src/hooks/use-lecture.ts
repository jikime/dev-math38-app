import { 
  useApiQuery, 
  useApiMutation, 
  useApiPutMutation, 
  useApiDeleteMutation 
} from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';

// Lecture 타입 정의 (필요에 따라 types 파일로 분리 가능)
export interface Lecture {
  index: number | null;
  lectureId: string;
  grade: number;
  academyId: string | null;
  subjectId: number;
  subjectName: string | null;
  teacherId: string;
  teacherName: string;
  name: string;
  state: string;
  paperCount: number;
  startDate: string;
  endDate: string;
  studentCount: number;
  studentIdList: string[] | null;
}

// 강의 상세정보 타입
export interface LectureDetail {
  academyId: number;
  created: string;
  endDate: string;
  grade: number;
  lectureId: string;
  name: string;
  paperCount: number;
  paperList?: any[];
  startDate: string;
  state: string;
  studentCount: number;
  studentList?: any[];
  subjectId: number;
  teacher: {
    userId: string;
    authorities: Array<{
      userId: string;
      authority: string;
    }>;
    enabled: boolean;
    name: string;
    email: string;
    imageUrl?: string;
    imageThumbnail?: string;
    changePassword: boolean;
    academy: {
      academyId: number;
      name: string;
      phoneNumber: string;
      district: string;
      registered: string;
      state: string;
      principalName: string;
      principalPhoneNumber: string;
      logoUrl?: string;
      allowAnyIp: boolean;
      partnerTier: string;
      type: string;
      created: string;
      updated: string;
      presentationParticipant: boolean;
    };
    schoolCode?: string;
    schoolName?: string;
    mobile1?: string;
    mobile2?: string;
    mobile3?: string;
    state: string;
    loginFailCount: number;
    lastLoginTime?: string;
    loginMethod: string;
    limitTime: string;
    grade: number;
    created: string;
    updated: string;
    username: string;
    tutor: boolean;
    prime: boolean;
    student: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
  };
  teacherId: string;
  updated: string;
}

// 강의 쿼리 키
const lectureKeys = {
  all: [...queryKeys.all, 'lecture'] as const,
  myLectures: () => [...lectureKeys.all, 'mylectures'] as const,
  lecture: (id: string) => [...lectureKeys.all, id] as const,
  lectureDetail: (id: string) => [...lectureKeys.all, 'detail', id] as const,
};

// ===== 강의 조회 =====

// 내 강의 목록 조회
export function useMyLectures() {
  return useApiQuery<Lecture[]>(
    lectureKeys.myLectures(),
    API_ENDPOINTS.LECTURES.MY_LECTURES,
    {
      method: 'GET',
      // 5분마다 자동 재조회
      refetchInterval: 5 * 60 * 1000,
      // 윈도우 포커스 시 재조회
      refetchOnWindowFocus: true,
    }
  );
}

// 특정 강의 상세 조회
export function useLecture(id: string) {
  return useApiQuery<Lecture>(
    lectureKeys.lecture(id),
    API_ENDPOINTS.LECTURES.DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// 강의 상세정보 조회 (teacher 정보 포함)
export function useLectureDetail(id: string) {
  return useApiQuery<LectureDetail>(
    lectureKeys.lectureDetail(id),
    API_ENDPOINTS.LECTURES.GET_DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// ===== 강의 생성/수정/삭제 =====

// 강의 생성
export function useCreateLecture() {
  const queryClient = useQueryClient();

  return useApiMutation<Lecture, Partial<Lecture>>(
    API_ENDPOINTS.LECTURES.CREATE,
    {
      onSuccess: () => {
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의 수정
export function useUpdateLecture(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Lecture, Partial<Lecture>>(
    API_ENDPOINTS.LECTURES.UPDATE(id),
    {
      onSuccess: (data) => {
        // 특정 강의 캐시 업데이트
        queryClient.setQueryData(lectureKeys.lecture(id), data);
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의 삭제
export function useDeleteLecture(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.LECTURES.DELETE(id),
    {
      onSuccess: () => {
        // 특정 강의 캐시 제거
        queryClient.removeQueries({ queryKey: lectureKeys.lecture(id) });
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// ===== 유틸리티 함수 =====

// 강의 활성화/비활성화 토글
export function useToggleLectureStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Lecture, { isActive: boolean }>(
    API_ENDPOINTS.LECTURES.STATUS(id),
    {
      onSuccess: (data) => {
        // 특정 강의 캐시 업데이트
        queryClient.setQueryData(lectureKeys.lecture(id), data);
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의에 학생 추가
export function useAddStudentToLecture(lectureId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<Lecture, { studentId: string }>(
    API_ENDPOINTS.LECTURES.STUDENTS(lectureId),
    {
      onSuccess: (data) => {
        // 특정 강의 캐시 업데이트
        queryClient.setQueryData(lectureKeys.lecture(lectureId), data);
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의에서 학생 제거
export function useRemoveStudentFromLecture(lectureId: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.LECTURES.STUDENTS(lectureId),
    {
      onSuccess: () => {
        // 특정 강의 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.lecture(lectureId) });
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의 복제
export function useCloneLecture() {
  const queryClient = useQueryClient();

  return useApiMutation<Lecture, { lectureId: string; modifications?: Partial<Lecture> }>(
    API_ENDPOINTS.LECTURES.CLONE,
    {
      onSuccess: () => {
        // 강의 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: lectureKeys.myLectures() });
      },
    }
  );
}

// 강의 마지막 인덱스 조회 (시험지 회차용)
export interface LectureLastIndex {
  lastIndex: number;
  lectureId: string;
}

export function useLectureLastIndex(lectureId: string) {
  return useApiQuery<LectureLastIndex>(
    [...lectureKeys.all, 'lastIndex', lectureId],
    API_ENDPOINTS.LECTURES.LAST_INDEX(lectureId),
    {
      enabled: !!lectureId,
      staleTime: 0, // 항상 최신 값을 가져오도록 설정
      cacheTime: 0, // 캐시하지 않음
    }
  );
}