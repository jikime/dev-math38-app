/**
 * Math API 서비스 설정
 */

import { ServiceConfig } from '@/net/core/types/service-config';

export const mathServiceConfig: ServiceConfig = {
  id: 'app', // math 서비스는 app으로 ID 사용
  name: '수학 API 서버',
  description: '메인 컨텐츠 관련 API',
  version: 'v2',
  urlPrefix: '/api/',
  urlTransform: (url: string) => url.replace('/api/', '/app/'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  defaultUrls: {
    production: 'https://math3.suzag.com',
    development: 'https://math3.suzag.com',
  },
  useProxy: true,
  cors: {
    enabled: false, // 프록시 사용으로 CORS 불필요
  },
};

export default mathServiceConfig;