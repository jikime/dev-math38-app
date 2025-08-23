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

// 강의 쿼리 키
const lectureKeys = {
  all: [...queryKeys.all, 'lecture'] as const,
  myLectures: () => [...lectureKeys.all, 'mylectures'] as const,
  lecture: (id: string) => [...lectureKeys.all, id] as const,
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