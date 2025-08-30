import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import type { 
  CloudBookGroup, 
  CloudBookGroupDetail, 
  CloudResourceProblem 
} from '@/types/cloud';

// 클라우드 쿼리 키
const cloudKeys = {
  all: [...queryKeys.all, 'cloud'] as const,
  bookGroups: () => [...cloudKeys.all, 'book-groups'] as const,
  bookGroup: (subjectId: string) => [...cloudKeys.bookGroups(), subjectId] as const,
  bookGroupDetail: (bookGroupId: string) => [...cloudKeys.all, 'book-group-detail', bookGroupId] as const,
  resourceProblems: (bookGroupId: string) => [...cloudKeys.all, 'resource-problems', bookGroupId] as const,
};

// 북그룹(폴더) 목록 조회
export function useBookGroups(subjectId: string) {
  return useApiQuery<CloudBookGroup[]>(
    cloudKeys.bookGroup(subjectId),
    `https://cms1.suzag.com/app/academy/bookgroup/list/${subjectId}`,
    {
      enabled: !!subjectId,
    }
  );
}

// 북그룹 상세 정보 조회
export function useBookGroupDetail(bookGroupId: string) {
  return useApiQuery<CloudBookGroupDetail>(
    cloudKeys.bookGroupDetail(bookGroupId),
    `https://cms1.suzag.com/app/academy/bookgroup/get/${bookGroupId}`,
    {
      enabled: !!bookGroupId,
    }
  );
}

// 리소스 문제 목록 조회
export function useResourceProblems(bookGroupId: string) {
  return useApiQuery<CloudResourceProblem[]>(
    cloudKeys.resourceProblems(bookGroupId),
    `https://cms1.suzag.com/app/academy/resource-problem/papers/${bookGroupId}`,
    {
      enabled: !!bookGroupId,
    }
  );
}