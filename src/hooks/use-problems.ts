import { useApiQuery, useApiMutation, useApiPutMutation, useApiDeleteMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import type { 
  Problem, 
  ProblemCreateInput, 
  ProblemUpdateInput, 
  ProblemSolution,
  GeneratePaperRequest,
  GeneratedPaper
} from '@/types/problem';
import type { ApiProblemsResponse, SkillProblemsParams } from '@/types/api-problem';

// 문제 목록 조회
export function useProblemList() {
  return useApiQuery<Problem[]>(
    queryKeys.problems(),
    API_ENDPOINTS.PROBLEMS.LIST
  );
}

// 문제 상세 조회
export function useProblem(id: string) {
  return useApiQuery<Problem>(
    queryKeys.problem(id),
    API_ENDPOINTS.PROBLEMS.DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// 교재별 문제 조회
export function useProblemsByTextbook(textbookId: string) {
  return useApiQuery<Problem[]>(
    queryKeys.problemsByTextbook(textbookId),
    API_ENDPOINTS.PROBLEMS.BY_TEXTBOOK(textbookId),
    {
      enabled: !!textbookId,
    }
  );
}

// 유사 문제 조회
export function useSimilarProblems(id: string) {
  return useApiQuery<Problem[]>(
    [...queryKeys.problem(id), 'similar'],
    API_ENDPOINTS.PROBLEMS.SIMILAR(id),
    {
      enabled: !!id,
    }
  );
}

// 문제 풀이 조회
export function useProblemSolution(id: string) {
  return useApiQuery<ProblemSolution>(
    [...queryKeys.problem(id), 'solution'],
    API_ENDPOINTS.PROBLEMS.SOLUTION(id),
    {
      enabled: !!id,
    }
  );
}

// 문제 생성
export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useApiMutation<Problem, ProblemCreateInput>(
    API_ENDPOINTS.PROBLEMS.CREATE,
    {
      onSuccess: (data) => {
        // 문제 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.problems() });
        // 교재별 문제 캐시도 무효화 (교재 ID가 있는 경우)
        if (data.textbookId) {
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.problemsByTextbook(data.textbookId) 
          });
        }
      },
    }
  );
}

// 문제 수정
export function useUpdateProblem(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Problem, ProblemUpdateInput>(
    API_ENDPOINTS.PROBLEMS.UPDATE(id),
    {
      onSuccess: (data) => {
        // 특정 문제 캐시 업데이트
        queryClient.setQueryData(queryKeys.problem(id), data);
        // 문제 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.problems() });
        // 교재별 문제 캐시도 무효화
        if (data.textbookId) {
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.problemsByTextbook(data.textbookId) 
          });
        }
      },
    }
  );
}

// 문제 삭제
export function useDeleteProblem(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.PROBLEMS.DELETE(id),
    {
      onSuccess: () => {
        // 문제 관련 모든 캐시 무효화
        queryClient.removeQueries({ queryKey: queryKeys.problem(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.problems() });
      },
    }
  );
}

// 시험지 생성
export function useGeneratePaper() {
  return useApiMutation<GeneratedPaper, GeneratePaperRequest>(
    API_ENDPOINTS.PROBLEMS.GENERATE_PAPER,
    {
      onSuccess: (data) => {
        console.log('Paper generated successfully:', data);
      },
      onError: (error) => {
        console.error('Paper generation failed:', error);
      },
    }
  );
}

// 스킬별 문제 조회
export function useProblemsBySkill(skillId: string) {
  return useApiQuery<ApiProblemsResponse>(
    ['problems', 'skill', skillId],
    `https://math2.suzag.com/app/skill/${skillId}/problems`,
    {
      enabled: !!skillId,
    }
  );
}