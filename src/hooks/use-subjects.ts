import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Subject, SubjectTop } from '@/types/subject';

// 과목 목록 조회
export function useSubjects() {
  return useApiQuery<Subject[]>(
    queryKeys.subjects(),
    API_ENDPOINTS.SUBJECTS.LIST
  );
}

// 과목 상세 구조 조회
export function useSubjectTops(subjectIds: string[], depth = 2) {
  const subjectIdsString = subjectIds.join(',');
  
  return useApiQuery<SubjectTop[]>(
    [...queryKeys.subjects(), 'tops', subjectIdsString, depth],
    API_ENDPOINTS.SUBJECTS.TOPS(subjectIdsString, depth),
    {
      enabled: subjectIds.length > 0,
    }
  );
}