/**
 * API 서비스 통합 Export
 * 모든 API 서비스를 한 곳에서 import할 수 있도록 제공
 */

// 네트워킹 시스템 초기화 (중요: 서비스 생성 전에 실행되어야 함)
import { initializeNetworking } from '../init';

// 서비스 클래스들
export { MainApiService } from './main/MainApiService';
export { CmsApiService } from './cms/CmsApiService';


// 팩토리를 통한 싱글톤 인스턴스 생성 헬퍼
import { ApiServiceFactory } from '../core/ApiServiceFactory';
import { MainApiService } from './main/MainApiService';
import { CmsApiService } from './cms/CmsApiService';


// Lazy initialization을 위한 변수들
let _mainApi: MainApiService | null = null;
let _cmsApi: CmsApiService | null = null;
let _initialized = false;

// 초기화 함수 - 클라이언트 사이드에서만 실행
const ensureInitialized = () => {
  // 서버 사이드에서는 초기화하지 않음
  if (typeof window === 'undefined') {
    return;
  }
  
  if (!_initialized) {
    initializeNetworking();
    _initialized = true;
  }
};

/**
 * 메인 API 서비스 인스턴스 (lazy)
 */
export const mainApi = new Proxy({} as MainApiService, {
  get(target, prop) {
    // 서버 사이드에서는 빈 함수 반환
    if (typeof window === 'undefined') {
      return () => Promise.resolve(null);
    }
    
    ensureInitialized();
    if (!_mainApi) {
      _mainApi = ApiServiceFactory.createService(MainApiService, 'main');
    }
    return (_mainApi as any)[prop];
  }
});

/**
 * CMS API 서비스 인스턴스 (lazy)
 */
export const cmsApi = new Proxy({} as CmsApiService, {
  get(target, prop) {
    // 서버 사이드에서는 빈 함수 반환
    if (typeof window === 'undefined') {
      return () => Promise.resolve(null);
    }
    
    ensureInitialized();
    if (!_cmsApi) {
      _cmsApi = ApiServiceFactory.createService(CmsApiService, 'cms');
    }
    return (_cmsApi as any)[prop];
  }
});

/**
 * 모든 API 서비스 인스턴스를 하나의 객체로
 */
export const api = {
  main: mainApi,
  cms: cmsApi,
} as const;

/**
 * 기존 코드 호환성을 위한 별칭들
 */
export const defaultApi = mainApi;
