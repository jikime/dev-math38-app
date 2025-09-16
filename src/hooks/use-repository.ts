import { 
  useApiMutation, 
  useApiPutMutation, 
  useApiDeleteMutation, 
  useApiPaginatedQuery,
  useFileUploadMutation,
  downloadFile 
} from '@/hooks/use-api';
import { createGetHook, createPostHook } from '@/net/core/registry/ApiHookFactory';
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
  PaperAnswerSheet,
  LectureStudentSkillSolveCountRO,
  PaperSolveCountsParams
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
export const useRepositoryProblems = createPostHook<[string], LecturePaperSearchParams, LecturePaper[]>(
  'main',
  (lectureId: string) => API_ENDPOINTS.REPOSITORY.LECTURE_PAPERS(lectureId)
);

// 처방 저장소 목록 조회 (addon_ps 타입)
export const useRepositoryPrescriptionProblems = createPostHook<[string], LecturePaperSearchParams, LecturePaper[]>(
  'main',
  (lectureId: string) => API_ENDPOINTS.REPOSITORY.PRESCRIPTION_PAPERS(lectureId)
);

// 저장소 문제 상세 조회
export const useRepositoryProblem = createGetHook<[string], RepositoryProblem>(
  'main',
  (id: string) => id ? `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/${id}` : null
);

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
export const useRepositoryPrescriptions = createGetHook<[], { prescriptions: RepositoryPrescription[]; total: number }>(
  'main',
  API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS
);

// 저장소 처방 상세 조회
export const useRepositoryPrescription = createGetHook<[string], RepositoryPrescription>(
  'main',
  (id: string) => id ? `${API_ENDPOINTS.REPOSITORY.PRESCRIPTIONS}/${id}` : null
);

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
export const useRepositorySearch = createPostHook<[], RepositorySearchParams, {
  problems: RepositoryProblem[];
  prescriptions: RepositoryPrescription[];
  total: number;
}>(
  'main',
  API_ENDPOINTS.REPOSITORY.SEARCH
);

// ===== 태그 & 카테고리 =====

// 태그 목록 조회
export const useRepositoryTags = createGetHook<[], RepositoryTag[]>(
  'main',
  API_ENDPOINTS.REPOSITORY.TAGS
);

// 카테고리 목록 조회
export const useRepositoryCategories = createGetHook<[], RepositoryCategory[]>(
  'main',
  API_ENDPOINTS.REPOSITORY.CATEGORIES
);

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
export const useRepositoryStatistics = createGetHook<[], RepositoryStatistics>(
  'main',
  `${API_ENDPOINTS.REPOSITORY.PROBLEMS}/statistics`
);

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
export const useManualPaper = createGetHook<[string], M38GeneratedPaper>(
  'main',
  (paperId: string) => paperId ? API_ENDPOINTS.REPOSITORY.MANUAL_PAPER(paperId) : null
);

// 아카데미 정적 시험지 조회
export const useAcademyStaticPaper = createGetHook<[string], any>(
  'main',
  (paperId: string) => paperId ? API_ENDPOINTS.REPOSITORY.ACADEMY_STATIC_PAPER(paperId) : null
);

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
export const useLectureStudents = createGetHook<[string], SimpleStudentVO[]>(
  'main',
  (lectureId: string) => lectureId ? API_ENDPOINTS.REPOSITORY.STUDENTS(lectureId) : null
);

// 학생별 시험지 ID 조회
export const useStudentPaperIds = createGetHook<[string], StudentStudyPaperId[]>(
  'main',
  (lecturePaperId: string) => lecturePaperId ? API_ENDPOINTS.REPOSITORY.USER_STUDY_PAPER_IDS(lecturePaperId) : null
);

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
export const useStudentImage = createGetHook<[string], Blob>(
  'main',
  (userId: string) => userId ? API_ENDPOINTS.REPOSITORY.STUDENT_IMAGE(userId) : null
);

// ===== 답안입력 관련 =====

// 학생별 시험지 목록 조회
export const useStudyPaperList = createGetHook<[string, string], M38UserStudyPaperVO[]>(
  'main',
  (lecturePaperId: string, type: string) => 
    lecturePaperId && type ? API_ENDPOINTS.REPOSITORY.STUDY_PAPER_LIST(lecturePaperId, type) : null
);

// 답안지 조회
export const useAnswerSheet = createGetHook<[string], PaperAnswerSheet>(
  'main',
  (paperId: string) => paperId ? API_ENDPOINTS.REPOSITORY.ANSWER_SHEET(paperId) : null
);

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

// 시험지별 정답률 조회 (PaperSolveCounts)
export const usePaperSolveCounts = createPostHook<[], PaperSolveCountsParams, LectureStudentSkillSolveCountRO>(
  'main',
  API_ENDPOINTS.REPOSITORY.PAPER_SOLVE_COUNTS
);