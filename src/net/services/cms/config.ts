/**
 * CMS API 서비스 설정
 */

import { ServiceConfig } from '@/net/core/types/service-config';

export const cmsServiceConfig: ServiceConfig = {
  id: 'cms',
  name: 'CMS API 서버',
  description: '학원 컨텐츠 API',
  version: 'v1',
  urlPrefix: '/api/',
  urlTransform: (url: string) => url.replace('/api/', '/'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  defaultUrls: {
    production: 'https://cms3.suzag.com',
    development: 'https://cms3.suzag.com',
  },
  useProxy: true,
  cors: {
    enabled: false, // 프록시 사용으로 CORS 불필요
  },
};

export default cmsServiceConfig;