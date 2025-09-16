/**
 * Math API Hooks
 * API Registry 기반으로 자동 생성된 Math 서버 전용 Hooks
 */

import { createGetHook } from '@/net/core/registry/ApiHookFactory';
import { MATH_API_REGISTRY } from '@/net/services/math/registry/MathApiRegistry';
import type { GradeChaptersDto } from '@/types/typings';

// ===== 과목 관련 Hooks =====

/**
 * 학년별 챕터 목록 조회 (도메인별)
 * @param domain - 도메인 (예: 'all')
 */
export const useGradeChapters = createGetHook<[string], GradeChaptersDto[]>(
  'math',
  MATH_API_REGISTRY.subject.gradeChapters.byDomain
);