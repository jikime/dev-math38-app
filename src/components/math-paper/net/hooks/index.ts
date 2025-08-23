/**
 * 네트워킹 Hooks 통합 Export
 * 모든 API 관련 훅을 한 곳에서 import할 수 있도록 제공
 */

// 기본 SWR Hook
export * from './useApiSWR';

// Registry 기반 Hooks (신규 - 권장)
export * from './registry';

// 편의를 위한 네임스페이스 export
import * as mainApiHooks from '@/components/math-paper/net/hooks/useMainApi';
import * as cmsApiHooks from '@/components/math-paper/net/hooks/useCmsApi';
import * as vectorApiHooks from '@/components/math-paper/net/hooks/useVectorApi';

export const hooks = {
  main: mainApiHooks,
  cms: cmsApiHooks,
  vector: vectorApiHooks,
} as const;