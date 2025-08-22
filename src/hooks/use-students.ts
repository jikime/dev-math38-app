import { useApiQuery, useApiMutation, useApiPutMutation, useApiDeleteMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import type { Student, StudentCreateInput, StudentUpdateInput, StudentPerformance } from '@/types/student';

// 학생 목록 조회
export function useStudentList() {
  return useApiQuery<Student[]>(
    queryKeys.students(),
    API_ENDPOINTS.STUDENTS.LIST
  );
}

// 학생 상세 조회
export function useStudent(id: string) {
  return useApiQuery<Student>(
    queryKeys.student(id),
    API_ENDPOINTS.STUDENTS.DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// 학생 생성
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useApiMutation<Student, StudentCreateInput>(
    API_ENDPOINTS.STUDENTS.CREATE,
    {
      onSuccess: () => {
        // 학생 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.students() });
      },
    }
  );
}

// 학생 수정
export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Student, StudentUpdateInput>(
    API_ENDPOINTS.STUDENTS.UPDATE(id),
    {
      onSuccess: (data) => {
        // 특정 학생 캐시 업데이트
        queryClient.setQueryData(queryKeys.student(id), data);
        // 학생 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.students() });
      },
    }
  );
}

// 학생 삭제
export function useDeleteStudent(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.STUDENTS.DELETE(id),
    {
      onSuccess: () => {
        // 학생 관련 모든 캐시 무효화
        queryClient.removeQueries({ queryKey: queryKeys.student(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.students() });
      },
    }
  );
}

// 학생 성과 조회
export function useStudentPerformance(id: string) {
  return useApiQuery<StudentPerformance>(
    [...queryKeys.student(id), 'performance'],
    API_ENDPOINTS.STUDENTS.PERFORMANCE(id),
    {
      enabled: !!id,
    }
  );
}