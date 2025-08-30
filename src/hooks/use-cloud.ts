import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import type { 
  CloudBookGroup, 
  CloudBookGroupDetail, 
  CloudResourceProblem,
  BookGroupStats,
  SkillChapter
} from '@/types/cloud';

// 클라우드 쿼리 키
const cloudKeys = {
  all: [...queryKeys.all, 'cloud'] as const,
  bookGroups: () => [...cloudKeys.all, 'book-groups'] as const,
  bookGroup: (subjectId: string) => [...cloudKeys.bookGroups(), subjectId] as const,
  bookGroupDetail: (bookGroupId: string) => [...cloudKeys.all, 'book-group-detail', bookGroupId] as const,
  resourceProblems: (bookGroupId: string) => [...cloudKeys.all, 'resource-problems', bookGroupId] as const,
  bookGroupStats: (bookGroupId: string) => [...cloudKeys.all, 'book-group-stats', bookGroupId] as const,
  skillChapters: (subjectId: string) => [...cloudKeys.all, 'skill-chapters', subjectId] as const,
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

// 북그룹 통계 조회
export function useBookGroupStats(bookGroupId: string) {
  return useApiQuery<BookGroupStats>(
    cloudKeys.bookGroupStats(bookGroupId),
    `https://cms1.suzag.com/app/academy/book/stats/group/${bookGroupId}`,
    {
      enabled: !!bookGroupId,
    }
  );
}

// 스킬 챕터 목록 조회
export function useSkillChapters(subjectId: string) {
  return useApiQuery<SkillChapter[]>(
    cloudKeys.skillChapters(subjectId),
    `https://math2.suzag.com/app/skill/leafChapterSkills/${subjectId}`,
    {
      enabled: !!subjectId,
    }
  );
}