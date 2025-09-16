/**
 * API 서버 설정 파일 (새로운 자동 수집 방식)
 *
 * 이제 각 서비스별 config.ts에서 설정을 관리하고,
 * ServiceConfigCollector가 자동으로 수집합니다.
 *
 * 🔄 마이그레이션 노트:
 * - 기존 수동 설정 → 서비스별 자동 수집 방식으로 변경
 * - 새로운 서비스 추가 시 해당 서비스 폴더에 config.ts만 생성하면 자동 등록
 */

import { ServerConfigTemplate } from './ServerConfigFactory';
import { ServiceConfigCollector } from './ServiceConfigCollector';

/**
 * 🆕 자동 수집된 서비스 설정을 기존 형식으로 변환
 * 호환성 유지를 위해 기존 ServerConfigTemplate 형식으로 변환
 */
async function generateServerConfigs(): Promise<ServerConfigTemplate[]> {
  try {
    const configs = await ServiceConfigCollector.collectConfigs();

    return Object.values(configs).map(config => ({
      id: config.id,
      name: config.name,
      urlPrefix: config.urlPrefix,
      urlTransform: config.urlTransform,
      timeout: config.timeout,
      headers: config.headers,
      description: config.description,
      version: config.version,
    }));
  } catch (error) {
    console.error('❌ 서비스 설정 생성 중 오류:', error);
    return [];
  }
}

/**
 * 🆕 자동 생성된 환경변수 기본값
 */
async function generateServerUrls(): Promise<Record<string, string>> {
  try {
    return await ServiceConfigCollector.generateEnvDefaults();
  } catch (error) {
    console.error('❌ 서버 URL 생성 중 오류:', error);
    return {};
  }
}

/**
 * 🆕 자동 생성된 프록시 설정
 */
async function generateProxyRewrites(): Promise<Array<{ source: string; destination: string }>> {
  try {
    return await ServiceConfigCollector.generateProxyRewrites();
  } catch (error) {
    console.error('❌ 프록시 설정 생성 중 오류:', error);
    return [];
  }
}

// 기존 호환성 유지를 위한 동기 로딩 (초기화 시점에 한 번만 실행)
let cachedServers: ServerConfigTemplate[] = [];
let cachedUrls: Record<string, string> = {};
let cachedRewrites: Array<{ source: string; destination: string }> = [];

// 초기화 함수
async function initializeConfigs() {
  try {
    cachedServers = await generateServerConfigs();
    cachedUrls = await generateServerUrls();
    cachedRewrites = await generateProxyRewrites();

    console.log('✅ API 서버 설정 초기화 완료 (자동 수집)');
    console.log('📦 수집된 서비스:', cachedServers.map(s => s.id));
  } catch (error) {
    console.error('❌ API 서버 설정 초기화 실패:', error);
  }
}

// 앱 시작 시 초기화
if (typeof window !== 'undefined') {
  initializeConfigs();
}

/**
 * 🔄 기존 호환성을 위한 export들
 */
export const API_SERVERS: ServerConfigTemplate[] = cachedServers;
export const SERVER_URLS: Record<string, string> = cachedUrls;
export const PROXY_REWRITES: Array<{ source: string; destination: string }> = cachedRewrites;

/**
 * 서버 설정 로더 (호환성 유지)
 */
export function loadServerConfigs(): ServerConfigTemplate[] {
  // 캐시된 설정이 없으면 기본 설정 반환
  if (cachedServers.length === 0) {
    return getDefaultServerConfigs();
  }
  return cachedServers;
}

/**
 * 기본 서버 설정 (fallback)
 */
function getDefaultServerConfigs(): ServerConfigTemplate[] {
  return [
    {
      id: 'main' as any,
      name: 'Main API Server',
      urlPrefix: '/appapi',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    {
      id: 'cms' as any,
      name: 'CMS API Server',
      urlPrefix: '/cmsapi',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    {
      id: 'app' as any,
      name: 'App API Server',
      urlPrefix: '/mathapi',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    },
    {
      id: 'vector' as any,
      name: 'Vector API Server',
      urlPrefix: '/vectorapi',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  ];
}

/**
 * 🆕 비동기 서버 설정 로더 (권장)
 */
export async function loadServerConfigsAsync(): Promise<ServerConfigTemplate[]> {
  return await generateServerConfigs();
}

// 설정 export (호환성 유지)
const apiServersConfig = {
  servers: cachedServers,
  urls: cachedUrls,
  proxyRewrites: cachedRewrites,
  // 새로운 기능들
  collector: ServiceConfigCollector,
  generateServerConfigs,
  generateServerUrls,
  generateProxyRewrites,
};

export default apiServersConfig;