import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Subject } from '@/types/subject';

// 과목 목록 조회
export function useSubjects() {
  return useApiQuery<Subject[]>(
    queryKeys.subjects(),
    API_ENDPOINTS.SUBJECTS.LIST
  );
}