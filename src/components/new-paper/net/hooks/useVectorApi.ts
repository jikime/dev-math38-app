/**
 * Vector API 전용 Hooks
 * Vector 서버 API를 위한 커스텀 훅 모음
 */

import { useApiSWR, useApiSWRPost, useApiMutation, UseApiSWROptions } from './useApiSWR';
import {
  ProblemListSearch,
  ProblemSearchResult
} from '../../typings';
import { API_REGISTRY } from '../registry/ApiRegistry';

// ===== 유사 문제 검색 Hooks =====

/**
 * 시험지용 유사 문제 목록 검색
 */
export function useSimilarProblemListForPaper(
  dto: ProblemListSearch | null,
  options?: UseApiSWROptions
) {
  return useApiSWRPost<ProblemSearchResult[]>(
    'vector',
    dto ? API_REGISTRY.vector.problems.search.similar.list : null,
    dto,
    options
  );
}



// ===== 벡터 분석 Hooks =====

/**
 * 문제 클러스터 분석
 */
export function useProblemClusters(
  params: {
    subjectId?: number;
    gradeLevel?: number;
    minClusterSize?: number;
  } | null,
  options?: UseApiSWROptions
) {
  return useApiSWRPost(
    'vector',
    params ? API_REGISTRY.vector.analysis.clusters : null,
    params,
    options
  );
}

/**
 * 문제 간 거리 계산
 */
export function useProblemDistance(
  problemId1: string | null,
  problemId2: string | null,
  options?: UseApiSWROptions
) {
  return useApiSWR(
    'vector',
    problemId1 && problemId2 
      ? API_REGISTRY.vector.analysis.distance(problemId1, problemId2) 
      : null,
    options
  );
}

/**
 * 벡터 품질 평가
 */
export function useVectorQuality(
  problemId: string | null,
  options?: UseApiSWROptions
) {
  return useApiSWR(
    'vector',
    problemId ? API_REGISTRY.vector.analysis.quality(problemId) : null,
    options
  );
}

// ===== 벡터 상태 관리 Hooks =====

/**
 * 벡터 서비스 상태 확인
 */
export function useVectorServiceStatus(options?: UseApiSWROptions) {
  return useApiSWR(
    'vector',
    API_REGISTRY.vector.status,
    options
  );
}

/**
 * 벡터 통계 조회
 */
export function useVectorStats(options?: UseApiSWROptions) {
  return useApiSWR(
    'vector',
    API_REGISTRY.vector.stats,
    options
  );
}

// ===== Mutation Hooks =====

/**
 * 문제 벡터 생성/업데이트
 */
export function useUpsertProblemVector(problemId: string) {
  return useApiMutation(
    'vector',
    API_REGISTRY.vector.problems.vector(problemId),
    'POST'
  );
}

/**
 * 문제 벡터 삭제
 */
export function useDeleteProblemVector(problemId: string) {
  return useApiMutation(
    'vector',
    API_REGISTRY.vector.problems.vector(problemId),
    'DELETE'
  );
}

/**
 * 벡터 인덱스 재구축
 */
export function useRebuildVectorIndex() {
  return useApiMutation(
    'vector',
    API_REGISTRY.vector.index.rebuild,
    'POST'
  );
}