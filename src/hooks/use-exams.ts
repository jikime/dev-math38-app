import { useApiQuery, useApiMutation, useApiPutMutation, useApiDeleteMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { cmsApiRequest } from '@/lib/api/cms-axios-client';
import type { Exam, ExamCreateInput, ExamUpdateInput, ExamResult, ExamStatistics } from '@/types/exam';

// 시험지 폴더 그룹 타입 정의
export interface ExamFolderGroup {
  value: string
  title: string
  children: ExamFolderGroup[] | null
}

// 시험지 목록 API 응답 타입 정의
export interface ExamPaperItem {
  paperId: string
  academyId: number
  academyName: string | null
  subjectId: number
  subjectName: string | null
  paperGroupId: number
  paperGroupName: string
  title: string
  countProblems: number
  creatorId: string
  deleted: boolean
  deletionDate: string | null
}

// 시험지 폴더 그룹 목록 조회 (CMS API)
export function useExamFolderGroups(subjectId: string | null) {
  return useQuery<ExamFolderGroup[]>({
    queryKey: ['exam-folder-groups', subjectId],
    queryFn: async () => {
      if (!subjectId) throw new Error('Subject ID is required');
      const response = await cmsApiRequest.get(`/app/academy/papergroup/tree/${subjectId}`);
      return response.data;
    },
    enabled: !!subjectId,
    staleTime: 5 * 60 * 1000, // 5분간 신선
    gcTime: 30 * 60 * 1000, // 30분간 캐시 (React Query v5에서는 cacheTime이 gcTime으로 변경)
  });
}

// 폴더별 시험지 목록 조회 (CMS API)
export function useExamPapersByFolder(folderValue: string | null) {
  return useQuery<ExamPaperItem[]>({
    queryKey: ['exam-papers-by-folder', folderValue],
    queryFn: async () => {
      if (!folderValue) throw new Error('Folder value is required');
      const response = await cmsApiRequest.get(`/app/academy/papergroup/paper/list/${folderValue}`);
      return response.data;
    },
    enabled: !!folderValue,
    staleTime: 5 * 60 * 1000, // 5분간 신선
    gcTime: 30 * 60 * 1000, // 30분간 캐시
  });
}

// 시험 목록 조회
export function useExamList() {
  return useApiQuery<Exam[]>(
    queryKeys.exams(),
    API_ENDPOINTS.EXAMS.LIST
  );
}

// 시험 상세 조회
export function useExam(id: string) {
  return useApiQuery<Exam>(
    queryKeys.exam(id),
    API_ENDPOINTS.EXAMS.DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// 시험 결과 조회
export function useExamResults(id: string) {
  return useApiQuery<ExamResult[]>(
    queryKeys.examResults(id),
    API_ENDPOINTS.EXAMS.RESULTS(id),
    {
      enabled: !!id,
    }
  );
}

// 시험 통계 조회
export function useExamStatistics(id: string) {
  return useApiQuery<ExamStatistics>(
    [...queryKeys.exam(id), 'statistics'],
    API_ENDPOINTS.EXAMS.STATISTICS(id),
    {
      enabled: !!id,
    }
  );
}

// 시험 생성
export function useCreateExam() {
  const queryClient = useQueryClient();

  return useApiMutation<Exam, ExamCreateInput>(
    API_ENDPOINTS.EXAMS.CREATE,
    {
      onSuccess: () => {
        // 시험 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.exams() });
      },
    }
  );
}

// 시험 수정
export function useUpdateExam(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Exam, ExamUpdateInput>(
    API_ENDPOINTS.EXAMS.UPDATE(id),
    {
      onSuccess: (data) => {
        // 특정 시험 캐시 업데이트
        queryClient.setQueryData(queryKeys.exam(id), data);
        // 시험 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.exams() });
      },
    }
  );
}

// 시험 제출
export function useSubmitExam(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ExamResult, { answers: Record<string, string> }>(
    API_ENDPOINTS.EXAMS.SUBMIT(id),
    {
      onSuccess: () => {
        // 시험 결과 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.examResults(id) });
        // 시험 통계 캐시 무효화
        queryClient.invalidateQueries({ queryKey: [...queryKeys.exam(id), 'statistics'] });
      },
    }
  );
}

// 시험 삭제
export function useDeleteExam(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.EXAMS.DELETE(id),
    {
      onSuccess: () => {
        // 시험 관련 모든 캐시 무효화
        queryClient.removeQueries({ queryKey: queryKeys.exam(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.exams() });
      },
    }
  );
}