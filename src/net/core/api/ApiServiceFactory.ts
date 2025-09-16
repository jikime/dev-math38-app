/**
 * API 서비스 팩토리
 * 서버별 API 서비스 인스턴스를 생성하고 관리
 */

import { ApiClient } from '@/net/core/api/ApiClient';
import { BaseApiService } from '@/net/core/api/BaseApiService';
import { MainApiService } from '@/net/services/main/api/MainApiService';
import { DynamicApiService, DynamicApiServiceConfig } from '@/net/core/api/DynamicApiService';
import { serverRegistry } from '@/net/core/registry/ServerRegistry';
import { initializeNetworking } from '@/net/init';
// 동적 엔드포인트는 현재 사용하지 않으므로 빈 배열 반환


export class ApiServiceFactory {
  private static instances: Map<string, BaseApiService> = new Map();
  private static apiClients: Map<string, ApiClient> = new Map();

  static {
    // 전역 객체에 팩토리 등록 (DynamicApiService에서 사용)
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__apiServiceFactory = ApiServiceFactory;
    }
  }

  /**
   * API 클라이언트 가져오기 (또는 생성)
   */
  static getApiClient(serverId: string): ApiClient {
    // 서버 사이드 렌더링 중에는 더미 클라이언트 반환
    if (typeof window === 'undefined') {
      // 빌드/SSR 시 기본 설정으로 클라이언트 생성
      const dummyConfig = {
        id: serverId as any,
        name: serverId,
        baseURL: 'https://api3.suzag.com',
        urlPrefix: '',
        timeout: 30000,
        headers: {}
      };
      return new ApiClient(dummyConfig);
    }

    // 캐시된 클라이언트 확인
    if (this.apiClients.has(serverId)) {
      return this.apiClients.get(serverId)!;
    }

    // 서버 설정 가져오기
    const serverConfig = serverRegistry.getServer(serverId);
    if (!serverConfig) {
      // 초기화가 안 된 경우에만 초기화 시도
      initializeNetworking();
      
      // 다시 시도
      const config = serverRegistry.getServer(serverId);
      if (!config) {
        throw new Error(`Server ${serverId} not found in registry`);
      }
      
      // 새 클라이언트 생성 및 캐시
      const client = new ApiClient(config);
      this.apiClients.set(serverId, client);
      return client;
    }

    // 새 클라이언트 생성 및 캐시
    const client = new ApiClient(serverConfig);
    this.apiClients.set(serverId, client);
    
    return client;
  }

  /**
   * API 서비스 생성 (제네릭)
   */
  static createService<T extends BaseApiService>(
    ServiceClass: new (client: ApiClient, server: any) => T,
    serverId: string
  ): T {
    const cacheKey = `${serverId}_${ServiceClass.name}`;
    
    // 캐시된 인스턴스 확인
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey) as T;
    }

    // API 클라이언트 가져오기
    const apiClient = this.getApiClient(serverId);

    // 서비스 인스턴스 생성 및 캐시
    const service = new ServiceClass(apiClient, serverId as any);
    this.instances.set(cacheKey, service);

    return service;
  }

  /**
   * 기본 API 서비스 생성 (MainApiService 사용)
   */
  static createDefaultService(serverId: string): BaseApiService {
    const cacheKey = `${serverId}_MainApiService`;
    
    // 캐시된 인스턴스 확인
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey)!;
    }

    // API 클라이언트 가져오기
    const apiClient = this.getApiClient(serverId);

    // 서비스 인스턴스 생성 및 캐시
    const service = new MainApiService(apiClient, 'main');
    this.instances.set(cacheKey, service);

    return service;
  }

  /**
   * URL로 API 서비스 찾기
   */
  static getServiceByUrl(url: string): BaseApiService | null {
    const serverConfig = serverRegistry.findServerByUrl(url);
    if (!serverConfig) {
      return null;
    }

    return this.createDefaultService(serverConfig.id);
  }

  /**
   * 캐시 초기화
   */
  static clearCache(): void {
    this.instances.clear();
    this.apiClients.clear();
  }

  /**
   * 특정 서버의 캐시 초기화
   */
  static clearServerCache(serverId: string): void {
    // 해당 서버의 모든 서비스 인스턴스 제거
    const keysToDelete: string[] = [];
    this.instances.forEach((_, key) => {
      if (key.startsWith(`${serverId}_`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.instances.delete(key));
    this.apiClients.delete(serverId);
  }

  /**
   * 모든 세션 캐시 초기화 (로그아웃 시 사용)
   */
  static clearAllSessionCaches(): void {
    this.apiClients.forEach(client => {
      client.clearSessionCache();
    });
  }

  /**
   * 모든 API 클라이언트에 액세스 토큰 설정
   */
  static setAccessTokenForAll(token: string | null): void {
    this.apiClients.forEach(client => {
      client.setAccessToken(token);
    });
  }

  /**
   * 특정 서버의 액세스 토큰 설정
   */
  static setAccessToken(serverId: string, token: string | null): void {
    const client = this.apiClients.get(serverId);
    if (client) {
      client.setAccessToken(token);
    }
  }

  /**
   * 동적 API 서비스 생성
   */
  static createDynamicService(
    serverId: string,
    config?: Partial<DynamicApiServiceConfig>
  ): DynamicApiService {
    const cacheKey = `${serverId}_DynamicApiService`;
    
    // 캐시된 인스턴스 확인
    if (this.instances.has(cacheKey)) {
      return this.instances.get(cacheKey) as DynamicApiService;
    }

    // 설정 구성
    const serviceConfig: DynamicApiServiceConfig = {
      serverId,
      serviceName: config?.serviceName || `${serverId} API Service`,
      endpoints: config?.endpoints || [], // 동적 엔드포인트는 현재 사용하지 않음
      plugins: config?.plugins,
    };

    // 서비스 인스턴스 생성 및 캐시
    const service = new DynamicApiService(serviceConfig);
    this.instances.set(cacheKey, service);

    return service;
  }

  /**
   * 서비스 존재 여부 확인
   */
  static hasService(serverId: string, serviceType?: string): boolean {
    const cacheKey = serviceType 
      ? `${serverId}_${serviceType}`
      : `${serverId}_MainApiService`;
    return this.instances.has(cacheKey);
  }

  /**
   * 등록된 모든 서비스 ID 가져오기
   */
  static getAllServiceIds(): string[] {
    return Array.from(this.instances.keys());
  }

  /**
   * 서비스 동적 등록
   */
  static registerService(
    serverId: string,
    service: BaseApiService,
    serviceType: string = 'Custom'
  ): void {
    const cacheKey = `${serverId}_${serviceType}`;
    this.instances.set(cacheKey, service);
  }

  /**
   * 서비스 제거
   */
  static unregisterService(serverId: string, serviceType?: string): void {
    const cacheKey = serviceType 
      ? `${serverId}_${serviceType}`
      : `${serverId}_MainApiService`;
    this.instances.delete(cacheKey);
  }
}