/**
 * Vector API Registry
 * Vector 서버 전용 API 엔드포인트 정의
 */

export const VECTOR_API_REGISTRY = {
  problems: {
    search: {
      similar: {
        list: '/api/v1/problems/search/similar/list',
      },
    },
    vector: (problemId: string) => `/api/v1/problems/${problemId}/vector`,
  },
  analysis: {
    clusters: '/api/v1/analysis/clusters',
    distance: (problemId1: string, problemId2: string) =>
      `/api/v1/analysis/distance/${problemId1}/${problemId2}`,
    quality: (problemId: string) => `/api/v1/analysis/quality/${problemId}`,
  },
  status: '/api/v1/status',
  stats: '/api/v1/stats',
  index: {
    rebuild: '/api/v1/index/rebuild',
  },
} as const;

// 타입 추출
export type VectorApiRegistry = typeof VECTOR_API_REGISTRY;