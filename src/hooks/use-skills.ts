import { useApiMutation, useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { SkillChapter, SkillChaptersRequest, SkillCountsResponse } from '@/types/skill';

// Skill 챕터 목록 조회 (POST 요청)
export function useSkillChapters() {
  return useApiMutation<SkillChapter[], SkillChaptersRequest>(
    API_ENDPOINTS.SKILLS.LIST_CHAPTERS
  );
}

// Skill 개수 조회 (GET 요청)
export function useSkillCounts(lectureId: string, enabled: boolean = true) {
  return useApiQuery<SkillCountsResponse>(
    ['skillCounts', lectureId],
    API_ENDPOINTS.SKILLS.SKILL_COUNTS(lectureId),
    { enabled: enabled && !!lectureId }
  );
}