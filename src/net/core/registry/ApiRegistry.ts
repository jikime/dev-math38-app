/**
 * API Registry - 통합 API URL 관리
 * 각 서비스별 registry를 import하여 통합 관리합니다.
 */

import { MAIN_API_REGISTRY } from '@/net/services/main/registry/MainApiRegistry';
import { CMS_API_REGISTRY } from '@/net/services/cms/registry/CmsApiRegistry';
import { MATH_API_REGISTRY } from '@/net/services/math/registry/MathApiRegistry';
import { VECTOR_API_REGISTRY } from '@/net/services/vector/registry/VectorApiRegistry';

export const API_REGISTRY = {
  main: MAIN_API_REGISTRY,
  app: MATH_API_REGISTRY,      // app 서버는 math 관련 API 사용
  cms: CMS_API_REGISTRY,
  vector: VECTOR_API_REGISTRY,
} as const;

// 타입 추출
export type ApiRegistry = typeof API_REGISTRY;

// 서버 타입
export type ApiServer = keyof ApiRegistry;

// URL 빌더 타입
export type UrlBuilder = string | ((...args: any[]) => string);

// Registry 유틸리티
export const ApiRegistryUtils = {
  /**
   * 모든 엔드포인트 목록 반환
   */
  getAllEndpoints(): string[] {
    const endpoints: string[] = [];
    
    const traverse = (obj: any, path: string[] = []): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = [...path, key];
        
        if (typeof value === 'function') {
          endpoints.push(currentPath.join('.'));
        } else if (typeof value === 'string') {
          endpoints.push(`${currentPath.join('.')}: ${value}`);
        } else if (typeof value === 'object' && value !== null) {
          traverse(value, currentPath);
        }
      });
    };
    
    traverse(API_REGISTRY);
    return endpoints;
  },
  
  /**
   * 키워드로 엔드포인트 검색
   */
  search(keyword: string): string[] {
    return this.getAllEndpoints().filter(endpoint => 
      endpoint.toLowerCase().includes(keyword.toLowerCase())
    );
  },
  
  /**
   * 서버별 엔드포인트 개수
   */
  getStats(): Record<ApiServer, number> {
    const stats: Partial<Record<ApiServer, number>> = {};
    
    Object.keys(API_REGISTRY).forEach((server) => {
      const serverEndpoints = this.getAllEndpoints().filter(ep => 
        ep.startsWith(server)
      );
      stats[server as ApiServer] = serverEndpoints.length;
    });
    
    return stats as Record<ApiServer, number>;
  },
};