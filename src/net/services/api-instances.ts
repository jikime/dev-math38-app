/**
 * API 서비스 인스턴스
 */

import { ApiServiceFactory } from '@/net/core/api/ApiServiceFactory';
import { MainApiService } from '@/net/services/main/api/MainApiService';
import { CmsApiService } from '@/net/services/cms/api/CmsApiService';
import { MathApiService } from '@/net/services/math/api/MathApiService';
import { VectorApiService } from '@/net/services/vector/api/VectorApiService';

// API 서비스 인스턴스들 (타입 캐스팅으로 구체적인 타입 지정)
export const mainApi = ApiServiceFactory.createDefaultService('main') as MainApiService;
export const cmsApi = ApiServiceFactory.createService(CmsApiService, 'cms') as CmsApiService;
export const mathApi = ApiServiceFactory.createService(MathApiService, 'app') as MathApiService;
export const vectorApi = ApiServiceFactory.createService(VectorApiService, 'vector') as VectorApiService;

// 기존 호환성을 위한 api 객체
export const api = {
  main: mainApi,
  cms: cmsApi,
  math: mathApi,
  vector: vectorApi,
  app: mainApi, // app은 main API로 통합
};