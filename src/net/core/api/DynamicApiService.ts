/**
 * 동적 API 서비스 클래스
 * 런타임에 추가되는 API 서버를 위한 범용 서비스 클래스
 */

import { BaseApiService } from './BaseApiService';
import { ApiClient } from './ApiClient';
import { ServerId } from '@/net/core/types';
import { serverRegistry } from '@/net/core/registry/ServerRegistry';
import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('DynamicApiService');

/**
 * 동적 엔드포인트 정의
 */
export interface DynamicEndpoint {
  /** 엔드포인트 이름 */
  name: string;
  /** URL 패턴 또는 빌더 함수 */
  url: string | ((...args: any[]) => string);
  /** HTTP 메서드 (기본값: GET) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** 엔드포인트 설명 */
  description?: string;
  /** 요청 옵션 */
  options?: Record<string, any>;
}

/**
 * 동적 API 서비스 설정
 */
export interface DynamicApiServiceConfig {
  /** 서버 ID */
  serverId: ServerId;
  /** 서비스 이름 */
  serviceName?: string;
  /** 엔드포인트 목록 */
  endpoints?: DynamicEndpoint[];
  /** 플러그인 또는 확장 기능 */
  plugins?: Array<(service: DynamicApiService) => void>;
}

/**
 * 동적 API 서비스 클래스
 * 런타임에 설정 가능한 범용 API 서비스
 */
export class DynamicApiService extends BaseApiService {
  private endpoints: Map<string, DynamicEndpoint> = new Map();
  private config: DynamicApiServiceConfig;

  constructor(config: DynamicApiServiceConfig) {
    // ApiClient를 직접 생성하거나 팩토리에서 가져오기
    // 순환 참조 방지를 위해 동적 import 사용
    let apiClient: any;
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서만 팩토리 사용
      const factory = (globalThis as any).__apiServiceFactory;
      if (factory) {
        apiClient = factory.getApiClient(config.serverId);
      }
    }
    
    // apiClient가 없으면 기본값 사용
    if (!apiClient) {
      const serverConfig = serverRegistry.getServer(config.serverId) || {
        id: config.serverId,
        name: config.serviceName || config.serverId,
        baseURL: '',
        urlPrefix: '',
        timeout: 30000,
        headers: {},
      };
      apiClient = new ApiClient(serverConfig);
    }
    
    super(apiClient, config.serverId);
    this.config = config;
    
    // 초기 엔드포인트 등록
    if (config.endpoints) {
      this.registerEndpoints(config.endpoints);
    }
    
    // 플러그인 적용
    if (config.plugins) {
      config.plugins.forEach(plugin => plugin(this));
    }

    logger.info(`Dynamic API service created for ${config.serverId}`, {
      serviceName: config.serviceName,
      endpointCount: this.endpoints.size,
    });
  }

  /**
   * 엔드포인트 등록
   */
  registerEndpoint(endpoint: DynamicEndpoint): void {
    this.endpoints.set(endpoint.name, endpoint);
    
    // 동적으로 메서드 생성
    this.createDynamicMethod(endpoint);
  }

  /**
   * 여러 엔드포인트 한번에 등록
   */
  registerEndpoints(endpoints: DynamicEndpoint[]): void {
    endpoints.forEach(endpoint => this.registerEndpoint(endpoint));
  }

  /**
   * 엔드포인트 제거
   */
  unregisterEndpoint(name: string): void {
    this.endpoints.delete(name);
    
    // 동적 메서드 제거
    if (this.hasOwnProperty(name)) {
      delete (this as any)[name];
    }
  }

  /**
   * 동적 메서드 생성
   */
  private createDynamicMethod(endpoint: DynamicEndpoint): void {
    const method = endpoint.method || 'GET';
    
    // 메서드 이름으로 함수 생성
    (this as any)[endpoint.name] = async (...args: any[]) => {
      // URL 생성
      let url: string;
      if (typeof endpoint.url === 'function') {
        url = endpoint.url(...args);
      } else {
        url = endpoint.url;
      }
      
      // 요청 옵션 구성 (method 제외)
      const options = endpoint.options || {};
      
      // 적절한 메서드 호출
      switch (method) {
        case 'GET':
          return this.get(url, options);
        case 'POST':
          return this.post(url, args[0], options);
        case 'PUT':
          return this.put(url, args[0], options);
        case 'DELETE':
          return this.delete(url, options);
        case 'PATCH':
          return this.patch(url, args[0], options);
        default:
          return this.get(url, options);
      }
    };
  }

  /**
   * 등록된 엔드포인트 목록 반환
   */
  getEndpoints(): DynamicEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  /**
   * 특정 엔드포인트 정보 반환
   */
  getEndpoint(name: string): DynamicEndpoint | undefined {
    return this.endpoints.get(name);
  }

  /**
   * 동적으로 API 호출
   */
  async callEndpoint(name: string, ...args: any[]): Promise<any> {
    const endpoint = this.endpoints.get(name);
    if (!endpoint) {
      throw new Error(`Endpoint ${name} not found`);
    }

    const dynamicMethod = (this as any)[name];
    if (typeof dynamicMethod === 'function') {
      return dynamicMethod(...args);
    }

    throw new Error(`Method ${name} not found`);
  }

  /**
   * 서비스 정보 반환
   */
  getServiceInfo(): {
    serverId: ServerId;
    serviceName?: string;
    endpointCount: number;
    endpoints: string[];
  } {
    return {
      serverId: this.config.serverId,
      serviceName: this.config.serviceName,
      endpointCount: this.endpoints.size,
      endpoints: Array.from(this.endpoints.keys()),
    };
  }

  /**
   * 프록시를 통한 동적 메서드 호출 지원
   */
  static createProxy(config: DynamicApiServiceConfig): DynamicApiService {
    const service = new DynamicApiService(config);
    
    return new Proxy(service, {
      get(target, prop: string | symbol) {
        // 기존 메서드나 속성이면 그대로 반환
        if (prop in target) {
          return (target as any)[prop];
        }
        
        // 등록된 엔드포인트가 있으면 동적으로 호출
        if (typeof prop === 'string' && target.endpoints.has(prop)) {
          return (...args: any[]) => target.callEndpoint(prop, ...args);
        }
        
        return undefined;
      },
    });
  }
}

/**
 * 동적 API 서비스 빌더
 * 체이닝 방식으로 서비스 구성
 */
export class DynamicApiServiceBuilder {
  private config: DynamicApiServiceConfig;

  constructor(serverId: ServerId) {
    this.config = {
      serverId,
      endpoints: [],
      plugins: [],
    };
  }

  /**
   * 서비스 이름 설정
   */
  withName(name: string): this {
    this.config.serviceName = name;
    return this;
  }

  /**
   * 엔드포인트 추가
   */
  addEndpoint(endpoint: DynamicEndpoint): this {
    if (!this.config.endpoints) {
      this.config.endpoints = [];
    }
    this.config.endpoints.push(endpoint);
    return this;
  }

  /**
   * 여러 엔드포인트 추가
   */
  addEndpoints(endpoints: DynamicEndpoint[]): this {
    if (!this.config.endpoints) {
      this.config.endpoints = [];
    }
    this.config.endpoints.push(...endpoints);
    return this;
  }

  /**
   * 플러그인 추가
   */
  addPlugin(plugin: (service: DynamicApiService) => void): this {
    if (!this.config.plugins) {
      this.config.plugins = [];
    }
    this.config.plugins.push(plugin);
    return this;
  }

  /**
   * 서비스 빌드
   */
  build(): DynamicApiService {
    return new DynamicApiService(this.config);
  }

  /**
   * 프록시 서비스 빌드
   */
  buildWithProxy(): DynamicApiService {
    return DynamicApiService.createProxy(this.config);
  }
}

/**
 * 헬퍼 함수: 동적 API 서비스 생성
 */
export function createDynamicApiService(
  serverId: ServerId,
  endpoints?: DynamicEndpoint[]
): DynamicApiService {
  return new DynamicApiService({
    serverId,
    endpoints,
  });
}

/**
 * 헬퍼 함수: RESTful 엔드포인트 생성
 */
export function createRestfulEndpoints(
  resourceName: string,
  basePath: string
): DynamicEndpoint[] {
  return [
    {
      name: `get${resourceName}List`,
      url: basePath,
      method: 'GET',
      description: `Get ${resourceName} list`,
    },
    {
      name: `get${resourceName}`,
      url: (id: string) => `${basePath}/${id}`,
      method: 'GET',
      description: `Get ${resourceName} by ID`,
    },
    {
      name: `create${resourceName}`,
      url: basePath,
      method: 'POST',
      description: `Create new ${resourceName}`,
    },
    {
      name: `update${resourceName}`,
      url: (id: string) => `${basePath}/${id}`,
      method: 'PUT',
      description: `Update ${resourceName}`,
    },
    {
      name: `delete${resourceName}`,
      url: (id: string) => `${basePath}/${id}`,
      method: 'DELETE',
      description: `Delete ${resourceName}`,
    },
  ];
}