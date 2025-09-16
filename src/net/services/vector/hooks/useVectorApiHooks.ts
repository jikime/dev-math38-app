/**
 * Vector API Hooks
 * API Registry 기반으로 자동 생성된 Vector 서버 전용 Hooks
 */

import { createGetHook, createPostHook } from '@/net/core/registry/ApiHookFactory';
import { VECTOR_API_REGISTRY } from '@/net/services/vector/registry/VectorApiRegistry';
import type { 
  ProblemListSearch,
  ProblemSearchResult,
} from '@/types/typings';

// ===== 유사 문제 검색 관련 Hooks =====

/**
 * 시험지용 유사 문제 목록 검색
 */
export const useSimilarProblemListForPaper = createPostHook<[], ProblemListSearch, ProblemSearchResult[]>(
  'vector',
  VECTOR_API_REGISTRY.problems.search.similar.list
);

// ===== 벡터 분석 관련 Hooks =====

/**
 * 문제 클러스터 분석
 */
export const useProblemClusters = createPostHook<[], { subjectId?: number; gradeLevel?: number; minClusterSize?: number; }, any>(
  'vector',
  VECTOR_API_REGISTRY.analysis.clusters
);

/**
 * 문제 간 거리 계산
 * @param problemId1 - 첫 번째 문제 ID
 * @param problemId2 - 두 번째 문제 ID
 */
export const useProblemDistance = createGetHook<[string, string], any>(
  'vector',
  VECTOR_API_REGISTRY.analysis.distance
);

/**
 * 벡터 품질 평가
 * @param problemId - 문제 ID
 */
export const useVectorQuality = createGetHook<[string], any>(
  'vector',
  VECTOR_API_REGISTRY.analysis.quality
);

// ===== 벡터 상태 관리 Hooks =====

/**
 * 벡터 서비스 상태 확인
 */
export const useVectorServiceStatus = createGetHook<[], any>(
  'vector',
  VECTOR_API_REGISTRY.status
);

/**
 * 벡터 통계 조회
 */
export const useVectorStats = createGetHook<[], any>(
  'vector',
  VECTOR_API_REGISTRY.stats
);