/**
 * 통합 네트워킹 시스템 메인 엔트리
 * 모든 API 서비스와 유틸리티를 한 곳에서 export합니다.
 */

// ========== 주요 Export ==========

// API 서비스 (가장 많이 사용)
export { api, mainApi, cmsApi, mathApi, vectorApi } from './services';
export * from './services';

// React 훅
export * from './services';

// React 컴포넌트
export { SessionTokenProvider } from './core/session/SessionTokenProvider';

// ========== 타입 Export ==========

export type {
  // 서버 설정
  ServerId,
  ServerConfig,
  
  // API 요청/응답
  HttpMethod,
  ApiRequestOptions,
  ApiResponse,
  ApiError,
  
  // 표준 응답 포맷
  PaginatedResponse,
  SimpleResponse,
  
  // React Query 설정
  ApiQueryConfig,
  
  // 서비스 인터페이스
  IApiService,
} from './core/types';

// ========== 유틸리티 Export ==========

// 세션 관리 - SessionManager로 통합
export { 
  sessionManager,
  getCachedSession,
  clearGlobalSessionCache,
  isSessionCacheValid,
  syncSessionToken,
  useSessionTokenSync
} from './core/session/SessionManager';

// 클래스 이름 유틸리티
export { cn } from './core/utils/classnames';

// ========== 인증 Export ==========

// 인증은 이제 NextAuth v5 + OIDC를 통해 처리됩니다
// 자세한 내용은 /src/net/auth/ 를 참조하세요

// ========== 고급 사용을 위한 Export ==========

// 서버 레지스트리 및 설정
export { serverRegistry } from './core/registry/ServerRegistry';
export { getServerConfig, getAllServerConfigs, serversConfig, getAppConfig } from './core/config/ServerConfigFactory';

// 코어 클래스 (직접 사용은 권장하지 않음)
export { ApiClient } from './core/api/ApiClient';
export { BaseApiService } from './core/api/BaseApiService';
export { ApiServiceFactory } from './core/api/ApiServiceFactory';

// ========== 시스템 초기화 ==========

// init.ts에서 초기화 함수 import
export { initializeNetworking, initializeServerRegistry } from '@/net/init';