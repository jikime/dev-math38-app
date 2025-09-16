/**
 * 서버 설정 팩토리
 * 환경별 서버 설정을 관리하고 검증
 */

import { ServerConfig, ServerId } from '@/net/core/types';
import { createModuleLogger } from '@/net/core/utils/Logger';
import { loadServerConfigs } from './api-servers.config';

const logger = createModuleLogger('ServerConfigFactory');

/**
 * 서버 설정 템플릿
 */
export interface ServerConfigTemplate {
  id: ServerId;
  name: string;
  urlPrefix: string;
  urlTransform?: (url: string) => string;
  timeout?: number;
  headers?: Record<string, string>;
  description?: string;
  version?: string;
}

/**
 * 서버 설정 팩토리 클래스
 */
export class ServerConfigFactory {
  private static instance: ServerConfigFactory;
  private configCache: Map<ServerId, ServerConfig> = new Map();

  /**
   * 서버 설정 템플릿 (동적으로 관리)
   */
  private templates: Map<ServerId, ServerConfigTemplate> = new Map();

  /**
   * 환경별 기본 URL (api-servers.config.ts에서 로드)
   */
  private defaultUrls =  {
    main: 'https://api3.suzag.com',
    app: 'https://math3.suzag.com',
    cms: 'https://cms3.suzag.com',
    vector: 'https://vector3.suzag.com',    
  };

  private constructor() {
    this.initializeFromConfig();
  }

  /**
   * api-servers.config.ts에서 템플릿 초기화
   */
  private initializeFromConfig(): void {
    // api-servers.config.ts에서 서버 템플릿 로드
    const serverConfigs = loadServerConfigs();
    serverConfigs.forEach(template => {
      this.registerTemplate(template);
    });

    logger.debug(`Initialized ${serverConfigs.length} server templates from api-servers.config.ts`);
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  static getInstance(): ServerConfigFactory {
    if (!ServerConfigFactory.instance) {
      ServerConfigFactory.instance = new ServerConfigFactory();
    }
    return ServerConfigFactory.instance;
  }


  /**
   * 서버 템플릿 등록
   */
  registerTemplate(template: ServerConfigTemplate): void {
    this.templates.set(template.id, template);
    logger.debug(`Server template registered: ${template.id}`);
  }

  /**
   * 여러 서버 템플릿 한번에 등록
   */
  registerTemplates(templates: ServerConfigTemplate[]): void {
    templates.forEach(template => this.registerTemplate(template));
  }

  /**
   * 서버 템플릿 제거
   */
  unregisterTemplate(serverId: ServerId): void {
    this.templates.delete(serverId);
    this.configCache.delete(serverId);
  }


  /**
   * URL 가져오기 (환경변수 우선, 없으면 기본값)
   */
  private getUrl(serverId: ServerId): string {
    // 클라이언트 사이드에서 환경변수 직접 접근
    let envValue: string | undefined;
    
    switch (serverId) {
      case 'main':
        envValue = process.env.NEXT_PUBLIC_API_URL;
        break;
      case 'app':
        envValue = process.env.NEXT_PUBLIC_MATH_API_URL;
        break;
      case 'cms':
        envValue = process.env.NEXT_PUBLIC_CONTENT_API_URL;
        break;
      case 'vector':
        envValue = process.env.NEXT_PUBLIC_VECTOR_API_URL;
        break;
    }

    // 환경변수가 유효한 경우 사용
    if (envValue && envValue !== '' && envValue !== 'undefined') {
      // URL 검증
      try {
        new URL(envValue);
        return envValue;
      } catch (error) {
        logger.warn(`Invalid URL for ${serverId}: ${envValue}`, { error });
      }
    }

    // 기본값 사용
    const defaultUrl = this.defaultUrls[serverId as keyof typeof this.defaultUrls];
    

    return defaultUrl;
  }

  /**
   * 서버 설정 생성
   */
  createConfig(serverId: ServerId): ServerConfig {
    // 캐시 확인
    if (this.configCache.has(serverId)) {
      return this.configCache.get(serverId)!;
    }

    // 템플릿 찾기
    const template = this.templates.get(serverId);
    if (!template) {
      throw new Error(`Unknown server ID: ${serverId}`);
    }

    // URL 가져오기 (환경변수 우선)
    const baseURL = this.getUrl(serverId);

    // 설정 생성
    const config: ServerConfig = {
      ...template,
      baseURL,
    };


    // 캐시 저장
    this.configCache.set(serverId, config);

    return config;
  }

  /**
   * 모든 서버 설정 가져오기
   */
  getAllConfigs(): ServerConfig[] {
    return Array.from(this.templates.keys()).map(serverId => this.createConfig(serverId));
  }

  /**
   * 템플릿 존재 여부 확인
   */
  hasTemplate(serverId: ServerId): boolean {
    return this.templates.has(serverId);
  }

  /**
   * 모든 템플릿 가져오기
   */
  getAllTemplates(): ServerConfigTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * 설정 캐시 초기화
   */
  clearCache(): void {
    this.configCache.clear();
    logger.debug('Config cache cleared');
  }

  /**
   * 설정 검증
   */
  validateConfig(config: ServerConfig): boolean {
    try {
      // URL 검증
      new URL(config.baseURL);

      // 필수 필드 검증
      if (!config.id || !config.name || !config.urlPrefix) {
        return false;
      }

      // 타임아웃 검증
      if (config.timeout && (config.timeout < 1000 || config.timeout > 60000)) {
        logger.warn(`Invalid timeout for ${config.id}: ${config.timeout}`);
        return false;
      }

      return true;
    } catch (error) {
      logger.error(`Invalid config for ${config.id}`, { error });
      return false;
    }
  }

  /**
   * 헬스 체크 URL 생성
   */
  getHealthCheckUrl(serverId: ServerId): string {
    const config = this.createConfig(serverId);
    return `${config.baseURL}/health`;
  }

 
}

// 싱글톤 인스턴스 export
export const serverConfigFactory = ServerConfigFactory.getInstance();

// 헬퍼 함수들
export function getServerConfig(serverId: ServerId): ServerConfig {
  return serverConfigFactory.createConfig(serverId);
}

export function getAllServerConfigs(): ServerConfig[] {
  return serverConfigFactory.getAllConfigs();
}


/**
 * 서버 설정 목록
 * server-config.ts에서 동적으로 생성
 */
export const serversConfig: ServerConfig[] =  serverConfigFactory.getAllConfigs();


/**
 * 현재 설정 가져오기
 */
export function getAppConfig() {
  return {
    showDebugLogs: false,
    mockEnabled: false,
    cacheTimeout: 5 * 60 * 1000, // 15분
  }
}

export default serverConfigFactory;