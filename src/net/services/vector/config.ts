/**
 * Vector API 서비스 설정
 */

import { ServiceConfig } from '@/net/core/types/service-config';

export const vectorServiceConfig: ServiceConfig = {
  id: 'vector',
  name: '벡터 검색 API 서버',
  description: '문제 벡터 조회 API',
  version: 'v1',
  urlPrefix: '/api/',
  urlTransform: (url: string) => url.replace('/api/', '/api/'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  defaultUrls: {
    production: 'https://vector3.suzag.com',
    development: 'https://vector3.suzag.com',
  },
  useProxy: true,
  cors: {
    enabled: false, // 프록시 사용으로 CORS 불필요
  },
};

export default vectorServiceConfig;