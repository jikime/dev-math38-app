/**
 * Registry 기반 Hooks 통합 Export
 * API Registry를 기반으로 생성된 모든 Hooks를 export합니다.
 */

// Main API Hooks
export * from './useMainApiHooks';

// App API Hooks
export * from './useAppApiHooks';

// CMS API Hooks
export * from './useCmsApiHooks';

// Vector API Hooks
export * from './useVectorApiHooks';

// 네임스페이스 export (선택적 사용)
import * as mainHooks from '@/net/hooks/registry/useMainApiHooks';
import * as appHooks from '@/net/hooks/registry/useAppApiHooks';
import * as cmsHooks from '@/net/hooks/registry/useCmsApiHooks';
import * as vectorHooks from '@/net/hooks/registry/useVectorApiHooks';

export const registryHooks = {
  main: mainHooks,
  app: appHooks,
  cms: cmsHooks,
  vector: vectorHooks,
} as const;