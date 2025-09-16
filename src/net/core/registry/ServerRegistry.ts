/**
 * 서버 레지스트리
 * 모든 API 서버 설정을 중앙에서 관리
 */

import { ServerConfig } from '@/net/core/types';

export class ServerRegistry {
  private static instance: ServerRegistry;
  private servers: Map<string, ServerConfig> = new Map();
  private defaultServerId: string = 'main';

  private constructor() {
    // 싱글톤 패턴
  }

  static getInstance(): ServerRegistry {
    if (!ServerRegistry.instance) {
      ServerRegistry.instance = new ServerRegistry();
    }
    return ServerRegistry.instance;
  }

  /**
   * 서버 등록
   */
  register(config: ServerConfig): void {
    if (!config.id) {
      throw new Error('Server config must have an id');
    }
    
    // 이미 등록된 서버는 건너뛰기
    if (this.servers.has(config.id)) {
      return;
    }
    
    // URL 변환 함수가 없으면 기본 함수 제공
    if (!config.urlTransform) {
      config.urlTransform = (url: string) => {
        if (url.startsWith(config.urlPrefix)) {
          return url.substring(config.urlPrefix.length);
        }
        return url;
      };
    }

    this.servers.set(config.id, config);
    console.log(`✅ API 서버 등록: ${config.id} - ${config.name}`);
  }

  /**
   * 여러 서버 한 번에 등록
   */
  registerMultiple(configs: ServerConfig[]): void {
    configs.forEach(config => this.register(config));
  }

  /**
   * 서버 설정 가져오기
   */
  getServer(id: string): ServerConfig | null {
    return this.servers.get(id) || null;
  }

  /**
   * URL로 서버 찾기
   */
  findServerByUrl(url: string): ServerConfig | null {
    const configs = Array.from(this.servers.values());
    for (const config of configs) {
      if (url.startsWith(config.urlPrefix)) {
        return config;
      }
    }
    return null;
  }

  /**
   * 기본 서버 설정
   */
  setDefaultServer(id: string): void {
    if (!this.servers.has(id)) {
      throw new Error(`Server ${id} not found in registry`);
    }
    this.defaultServerId = id;
  }

  /**
   * 기본 서버 가져오기
   */
  getDefaultServer(): ServerConfig | null {
    return this.servers.get(this.defaultServerId) || null;
  }

  /**
   * 모든 서버 목록
   */
  getAllServers(): ServerConfig[] {
    return Array.from(this.servers.values());
  }

  /**
   * 서버 존재 여부 확인
   */
  hasServer(id: string): boolean {
    return this.servers.has(id);
  }

  /**
   * 서버 제거
   */
  unregister(id: string): void {
    this.servers.delete(id);
  }

  /**
   * 모든 서버 제거
   */
  clear(): void {
    this.servers.clear();
  }

  /**
   * 디버그 정보 출력
   */
  debug(): void {
    console.log('📡 등록된 API 서버들:');
    this.servers.forEach((config, id) => {
      console.log(`  - ${id}: ${config.name} (${config.baseURL})`);
    });
    console.log(`  기본 서버: ${this.defaultServerId}`);
  }
}

// 전역 인스턴스 export
export const serverRegistry = ServerRegistry.getInstance();