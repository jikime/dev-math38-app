/**
 * Main API 서비스 설정
 */

import { ServiceConfig } from '@/net/core/types/service-config';

export const mainServiceConfig: ServiceConfig = {
  id: 'main',
  name: '38 서버 비즈니스 API',
  description: '38 서버 비즈니스 API',
  version: 'v2',
  urlPrefix: '/',
  urlTransform: (url: string) => url.replace('/api/', '/api/'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  defaultUrls: {
    production: 'https://api3.suzag.com',
    development: 'https://api3.suzag.com',
  },
  useProxy: true,
  cors: {
    enabled: false, // 프록시 사용으로 CORS 불필요
  },
};

export default mainServiceConfig;