/**
 * API 서비스 팩토리
 * 서버별 API 서비스 인스턴스를 생성하고 관리
 */

import { ApiClient } from './ApiClient';
import { BaseApiService } from './BaseApiService';
import { MainApiService } from '../services/main/MainApiService';
import { serverRegistry } from '../registry/ServerRegistry';
import { initializeNetworking } from '../init';

export class ApiServiceFactory {
  private static instances: Map<string, BaseApiService> = new Map();
  private static apiClients: Map<string, ApiClient> = new Map();

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
        baseURL: 'https://api2.suzag.com',
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
}