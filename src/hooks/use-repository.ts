import { 
  useApiQuery, 
  useApiMutation, 
  useApiPutMutation, 
  useApiDeleteMutation, 
  useApiPaginatedQuery,
  useFileUploadMutation,
  downloadFile 
} from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api/axios-client';
import type { 
  RepositoryProblem, 
  RepositoryPrescription, 
  RepositorySearchParams,
  RepositoryTag,
  RepositoryCategory,
  RepositoryImportData,
  RepositoryExportOptions,
  RepositoryStatistics,
  LecturePaper,
  LecturePaperSearchParams,
  SimpleStudentVO,
  StudentStudyPaperId,
  M38UserStudyPaper,
  M38UserStudyPaperVO,
  PaperAnswerSheet
} from '@/types/repository';
import { M38GeneratedPaper } from '@/components/math-paper/domains/paper';

// 저장소 쿼리 키
const repositoryKeys = {
  all: [...queryKeys.all, 'repository'] as const,
  problems: () => [...repositoryKeys.all, 'problems'] as const,
  problem: (id: string) => [...repositoryKeys.problems(), id] as const,
  prescriptions: () => [...repositoryKeys.all, 'prescriptions'] as const,
  prescription: (id: string) => [...repositoryKeys.prescriptions(), id] as const,
  search: (params: RepositorySearchParams) => [...repositoryKeys.all, 'search', params] as const,
  tags: () => [...repositoryKeys.all, 'tags'] as const,
  categories: () => [...repositoryKeys.all, 'categories'] as const,
  statistics: () => [...repositoryKeys.all, 'statistics'] as const,
};

// ===== 문제 저장소 =====

// 저장소 문제 목록 조회 (실제 API)
export function useRepositoryProblems(params: LecturePaperSearchParams) {
  const defaultParams = {
    ...params
  };

  return useApiQuery<LecturePaper[]>(
    [...repositoryKeys.problems(), defaultParams],
    API_ENDPOINTS.REPOSITORY.LECTURE_PAPERS(defaultParams.lectureId!),
    {
      method: 'POST',
      params: defaultParams,
      enabled: !!defaultParams.lectureId,
    }
  );
}

// 처방 저장소 목록 조회 (addon_ps 타입)
export function useRepositoryPrescriptionProblems(params: LecturePaperSearchParams) {
  const defaultParams = {
    ...params
  };

  return useApiQuery<LecturePaper[]>(
    [...repositoryKeys.problems(), 'prescriptions', defaultParams],
    API_ENDPOINTS.REPOSITORY.PRESCRIPTION_PAPERS(defaultParams.lectureId!),
    {
      method: 'POST',
      params: defaultParams,
      enabled: !!defaultParams.lectureId,
    }
  );
}

// 저장소 문제 상세 조회
export function useRepositoryProblem(id: string) {
  return useApiQuery<RepositoryProblem>(
    repositoryKeys.problem(id),
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/${id}`,
    {
      enabled: !!id,
    }
  );
}

// 저장소 문제 생성
export function useCreateRepositoryProblem() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryProblem, Partial<RepositoryProblem>>(
    API_ENDPOINTS.REPOSITORY.PROBLEMS,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.problems() });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// 저장소 문제 수정
export function useUpdateRepositoryProblem(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<RepositoryProblem, Partial<RepositoryProblem>>(
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/${id}`,
    {
      onSuccess: (data) => {
        queryClient.setQueryData(repositoryKeys.problem(id), data);
        queryClient.invalidateQueries({ queryKey: repositoryKeys.problems() });
      },
    }
  );
}

// 저장소 문제 삭제
export function useDeleteRepositoryProblem(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/${id}`,
    {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: repositoryKeys.problem(id) });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.problems() });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// ===== 처방 저장소 =====

// 저장소 처방 목록 조회
export function useRepositoryPrescriptions(params?: RepositorySearchParams) {
  return useApiQuery<{ prescriptions: RepositoryPrescription[]; total: number }>(
    [...repositoryKeys.prescriptions(), params],
    API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS,
    {
      params,
    }
  );
}

// 저장소 처방 상세 조회
export function useRepositoryPrescription(id: string) {
  return useApiQuery<RepositoryPrescription>(
    repositoryKeys.prescription(id),
    `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/${id}`,
    {
      enabled: !!id,
    }
  );
}

// 저장소 처방 생성
export function useCreateRepositoryPrescription() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryPrescription, Partial<RepositoryPrescription>>(
    API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.prescriptions() });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// 저장소 처방 수정
export function useUpdateRepositoryPrescription(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<RepositoryPrescription, Partial<RepositoryPrescription>>(
    `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/${id}`,
    {
      onSuccess: (data) => {
        queryClient.setQueryData(repositoryKeys.prescription(id), data);
        queryClient.invalidateQueries({ queryKey: repositoryKeys.prescriptions() });
      },
    }
  );
}

// 저장소 처방 삭제
export function useDeleteRepositoryPrescription(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/${id}`,
    {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: repositoryKeys.prescription(id) });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.prescriptions() });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// ===== 검색 =====

// 통합 검색 (무한 스크롤)
export function useRepositoryInfiniteSearch(params: RepositorySearchParams) {
  return useInfiniteQuery({
    queryKey: repositoryKeys.search(params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiRequest.get(API_ENDPOINTS.REPOSITORY.SEARCH, {
        params: { ...params, page: pageParam, limit: params.limit || 20 },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = Math.ceil(lastPage.total / (params.limit || 20));
      const currentPage = pages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// 일반 검색
export function useRepositorySearch(params: RepositorySearchParams) {
  return useApiQuery<{
    problems: RepositoryProblem[];
    prescriptions: RepositoryPrescription[];
    total: number;
  }>(
    repositoryKeys.search(params),
    API_ENDPOINTS.REPOSITORY.SEARCH,
    {
      params,
      enabled: !!params.query || !!params.tags?.length || !!params.category,
    }
  );
}

// ===== 태그 & 카테고리 =====

// 태그 목록 조회
export function useRepositoryTags() {
  return useApiQuery<RepositoryTag[]>(
    repositoryKeys.tags(),
    API_ENDPOINTS.REPOSITORY.TAGS
  );
}

// 카테고리 목록 조회
export function useRepositoryCategories() {
  return useApiQuery<RepositoryCategory[]>(
    repositoryKeys.categories(),
    API_ENDPOINTS.REPOSITORY.CATEGORIES
  );
}

// 태그 생성
export function useCreateRepositoryTag() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryTag, Partial<RepositoryTag>>(
    API_ENDPOINTS.REPOSITORY.TAGS,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.tags() });
      },
    }
  );
}

// 카테고리 생성
export function useCreateRepositoryCategory() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryCategory, Partial<RepositoryCategory>>(
    API_ENDPOINTS.REPOSITORY.CATEGORIES,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.categories() });
      },
    }
  );
}

// ===== Import/Export =====

// 데이터 가져오기
export function useImportRepositoryData() {
  const queryClient = useQueryClient();

  return useFileUploadMutation<{ 
    success: boolean; 
    imported: number; 
    skipped: number; 
    errors: string[] 
  }>(
    API_ENDPOINTS.REPOSITORY.IMPORT,
    {
      onSuccess: () => {
        // 모든 저장소 관련 캐시 무효화
        queryClient.invalidateQueries({ queryKey: repositoryKeys.all });
      },
    }
  );
}

// 데이터 내보내기
export function useExportRepositoryData() {
  return useApiMutation<{ url: string; filename: string }, RepositoryExportOptions>(
    API_ENDPOINTS.REPOSITORY.EXPORT,
    {
      onSuccess: async (data) => {
        // 파일 다운로드
        await downloadFile(data.url, data.filename);
      },
    }
  );
}

// ===== 통계 =====

// 저장소 통계 조회
export function useRepositoryStatistics() {
  return useApiQuery<RepositoryStatistics>(
    repositoryKeys.statistics(),
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/statistics`,
    {
      // 통계는 5분마다 재조회
      refetchInterval: 5 * 60 * 1000,
    }
  );
}

// ===== 유틸리티 함수 =====

// 문제를 실제 시험이나 학습에 사용 (사용 횟수 증가)
export function useUseProblem() {
  const queryClient = useQueryClient();

  return useApiMutation<void, { problemId: string; context: 'exam' | 'practice' | 'homework' }>(
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/use`,
    {
      onSuccess: (_, variables) => {
        // 해당 문제의 사용 횟수 업데이트
        queryClient.invalidateQueries({ 
          queryKey: repositoryKeys.problem(variables.problemId) 
        });
        queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// 처방 평가
export function useRatePrescription() {
  const queryClient = useQueryClient();

  return useApiMutation<void, { prescriptionId: string; rating: number; review?: string }>(
    `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/rate`,
    {
      onSuccess: (_, variables) => {
        // 해당 처방의 평점 업데이트
        queryClient.invalidateQueries({ 
          queryKey: repositoryKeys.prescription(variables.prescriptionId) 
        });
      },
    }
  );
}

// 문제 복제 (기존 문제를 기반으로 새 문제 생성)
export function useCloneProblem() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryProblem, { problemId: string; modifications?: Partial<RepositoryProblem> }>(
    `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/clone`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.problems() });
      },
    }
  );
}

// 처방 복제
export function useClonePrescription() {
  const queryClient = useQueryClient();

  return useApiMutation<RepositoryPrescription, { prescriptionId: string; modifications?: Partial<RepositoryPrescription> }>(
    `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/clone`,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.prescriptions() });
      },
    }
  );
}

// 수동 시험지 조회 (PaperModal에서 사용)
export function useManualPaper(paperId: string | undefined) {
  return useApiQuery<M38GeneratedPaper>(
    [...repositoryKeys.all, 'manual-paper', paperId],
    API_ENDPOINTS.REPOSITORY.MANUAL_PAPER(paperId!),
    {
      enabled: !!paperId,
    }
  );
}

// 아카데미 정적 시험지 조회
export function useAcademyStaticPaper(paperId: string | undefined) {
  return useApiQuery<any>(
    [...repositoryKeys.all, 'academy-static-paper', paperId],
    API_ENDPOINTS.REPOSITORY.ACADEMY_STATIC_PAPER(paperId!),
    {
      enabled: !!paperId,
    }
  );
}

// 시험지 복사
export function useCopyPaper() {
  const queryClient = useQueryClient();

  return useApiMutation<void, {
    lectureId: string;
    paperId: string;
    paperName: string;
    similar?: boolean;
  }>(
    API_ENDPOINTS.REPOSITORY.COPY_PAPER,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: repositoryKeys.problems() });
        // queryClient.invalidateQueries({ queryKey: repositoryKeys.statistics() });
      },
    }
  );
}

// 강의 학생 목록 조회
export function useLectureStudents(lectureId: string) {
  return useApiQuery<SimpleStudentVO[]>(
    [...repositoryKeys.all, 'lecture-students', lectureId],
    API_ENDPOINTS.REPOSITORY.STUDENTS(lectureId),
    {
      enabled: !!lectureId,
    }
  );
}

// 학생별 시험지 ID 조회
export function useStudentPaperIds(lecturePaperId: string) {
  return useApiQuery<StudentStudyPaperId[]>(
    [...repositoryKeys.all, 'student-paper-ids', lecturePaperId],
    API_ENDPOINTS.REPOSITORY.USER_STUDY_PAPER_IDS(lecturePaperId),
    {
      enabled: !!lecturePaperId,
    }
  );
}

// 시험지 배포
export function usePublishPaper() {
  const queryClient = useQueryClient();

  return useApiMutation<{ message?: string }, {
    lectureId: string;
    lecturePaperId: string;
    userId: string;
    paperType?: string;
    isWorkbook?: boolean;
  }>(
    API_ENDPOINTS.REPOSITORY.PUBLISH_PAPER, // 기본값, 실제로는 PaperPrintModal에서 동적으로 처리
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...repositoryKeys.all, 'student-paper-ids'] });
      },
    }
  );
}

// 학생 이미지 조회 (Blob 응답)
export function useStudentImage(userId: string) {
  return useApiQuery<Blob>(
    [...repositoryKeys.all, 'student-image', userId],
    API_ENDPOINTS.REPOSITORY.STUDENT_IMAGE(userId),
    {
      enabled: !!userId,
      // Blob 응답을 위한 설정 필요
    }
  );
}

// ===== 답안입력 관련 =====

// 학생별 시험지 목록 조회
export function useStudyPaperList(lecturePaperId: string, type: string) {
  return useApiQuery<M38UserStudyPaperVO[]>(
    [...repositoryKeys.all, 'study-paper-list', lecturePaperId, type],
    API_ENDPOINTS.REPOSITORY.STUDY_PAPER_LIST(lecturePaperId, type),
    {
      enabled: !!lecturePaperId && !!type,
    }
  );
}

// 답안지 조회
export function useAnswerSheet(paperId: string) {
  return useApiQuery<PaperAnswerSheet>(
    [...repositoryKeys.all, 'answer-sheet', paperId],
    API_ENDPOINTS.REPOSITORY.ANSWER_SHEET(paperId),
    {
      enabled: !!paperId,
    }
  );
}

// 답안지 채점
export function useGradePaper() {
  const queryClient = useQueryClient();

  return useApiMutation<{ score: number }, PaperAnswerSheet>(
    API_ENDPOINTS.REPOSITORY.GRADE_PAPER,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...repositoryKeys.all, 'study-paper-list'] });
      },
    }
  );
}

// 시험지 초기화
export function useResetPaper() {
  const queryClient = useQueryClient();

  return useApiMutation<{ result: boolean }, string>(
    '', // URL will be determined dynamically
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [...repositoryKeys.all, 'study-paper-list'] });
        queryClient.invalidateQueries({ queryKey: [...repositoryKeys.all, 'answer-sheet'] });
      },
    }
  );
}