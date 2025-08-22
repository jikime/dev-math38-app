/**
 * API 서버 설정
 * 모든 API 서버의 설정을 여기서 관리
 */

import { ServerConfig } from '../types';

// 환경변수에서 URL 가져오기 (빌드 시에도 안전한 기본값 사용)
const getApiUrl = () => {
  // 빌드 시점이거나 환경변수가 없을 때는 프로덕션 URL 사용
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url === '' || url === 'undefined') {
    return 'https://api2.suzag.com';
  }
  return url;
};

const getMathApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_MATH_API_URL;
  if (!url || url === '' || url === 'undefined') {
    return 'https://math2.suzag.com';
  }
  return url;
};

const getContentApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_CONTENT_API_URL;
  if (!url || url === '' || url === 'undefined') {
    return 'https://cms1.suzag.com';
  }
  return url;
};

const getVectorApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_VECTOR_API_URL;
  if (!url || url === '' || url === 'undefined') {
    return 'https://vector.suzag.com';
  }
  return url;
};

const API_URL = getApiUrl();
const MATH_API_URL = getMathApiUrl();
const CONTENT_API_URL = getContentApiUrl();
const VECTOR_API_URL = getVectorApiUrl();

/**
 * 서버 설정 목록
 */
export const serversConfig: ServerConfig[] = [
  {
    id: 'main',
    name: '38 서버 비즈니스 API',
    baseURL: API_URL,
    urlPrefix: '/m38api/',
    urlTransform: (url: string) => url.replace('/m38api/', '/api/'),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    description: '38 서버 비즈니스 API',
  },
  {
    id: 'app',
    name: '수학 API 서버',
    baseURL: MATH_API_URL,
    urlPrefix: '/appapi/',
    urlTransform: (url: string) => url.replace('/appapi/', '/app/'),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    description: '메인 컨텐츠 관련 API',
  },
  {
    id: 'cms',
    name: 'CMS API 서버',
    baseURL: CONTENT_API_URL,
    urlPrefix: '/cmsapi/',
    urlTransform: (url: string) => url.replace('/cmsapi/', '/'),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    description: '학원 컨텐츠 API',
  },
  {
    id: 'vector',
    name: '벡터 검색 API 서버',
    baseURL: VECTOR_API_URL,
    urlPrefix: '/vectorapi/',
    urlTransform: (url: string) => url.replace('/vectorapi/', '/api/'),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    description: '문제 벡터 조회 API',
  },
];

/**
 * 개발 환경별 설정 (필요시 사용)
 */
export const environmentConfig = {
  development: {
    // 개발 환경 특별 설정
    showDebugLogs: true,
    mockEnabled: false
  },
  staging: {
    // 스테이징 환경 설정
    showDebugLogs: false,
    mockEnabled: false,
  },
  production: {
    // 프로덕션 환경 설정
    showDebugLogs: false,
    mockEnabled: false,
  },
};

/**
 * 현재 환경 가져오기
 */
export function getCurrentEnvironment() {
  return process.env.NODE_ENV || 'development';
}

/**
 * 환경별 설정 가져오기
 */
export function getEnvironmentConfig() {
  const env = getCurrentEnvironment() as keyof typeof environmentConfig;
  return environmentConfig[env] || environmentConfig.development;
}