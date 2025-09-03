import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import type { 
  Problem, 
  FileWithProblems,
  ProblemFilter,
  ProblemStatus
} from '@/types/problem';

// 문제 관련 쿼리 키
const problemKeys = {
  all: [...queryKeys.all, 'problems'] as const,
  byFile: (fileId: string) => [...problemKeys.all, 'file', fileId] as const,
  single: (problemId: string) => [...problemKeys.all, 'single', problemId] as const,
  status: (fileId: string) => [...problemKeys.byFile(fileId), 'status'] as const,
};

// 파일 정보와 문제 목록을 함께 조회
export function useFileWithProblems(fileId: string) {
  return useApiQuery<FileWithProblems>(
    problemKeys.byFile(fileId),
    `https://cms1.suzag.com/app/academy/resource-problem/get/${fileId}`,
    {
      enabled: !!fileId,
    }
  );
}

// 단일 문제 조회
export function useProblem(problemId: string) {
  return useApiQuery<Problem>(
    problemKeys.single(problemId),
    `https://cms1.suzag.com/app/academy/problem/get/${problemId}`,
    {
      enabled: !!problemId,
    }
  );
}

// 문제 상태 조회 (학습 진도)
export function useProblemStatuses(fileId: string) {
  return useApiQuery<ProblemStatus[]>(
    problemKeys.status(fileId),
    `https://cms1.suzag.com/app/academy/problem/status/${fileId}`,
    {
      enabled: !!fileId,
    }
  );
}

// 문제 검색
export function useSearchProblems(query: string, limit: number = 10) {
  return useApiQuery<Problem[]>(
    [...problemKeys.all, 'search', query],
    `https://cms1.suzag.com/app/academy/problem/search`,
    {
      enabled: !!query && query.length >= 2,
      params: { q: query, limit },
    }
  );
}

// 파일 통계 조회 (새로운 API)
export function useFileStats(fileId: string) {
  return useApiQuery(
    [...problemKeys.all, 'file-stats', fileId],
    `https://cms1.suzag.com/app/academy/book/stats/book/${fileId}`,
    {
      enabled: !!fileId,
    }
  );
}