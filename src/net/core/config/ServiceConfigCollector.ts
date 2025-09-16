/**
 * 서비스 설정 자동 수집기
 * 각 서비스별 config.ts 파일을 동적으로 수집하여 통합 설정 생성
 */

import { ServiceConfig, ServiceConfigRegistry } from '@/net/core/types/service-config';
import { serverRegistry } from '@/net/core/registry/ServerRegistry';

/**
 * 서비스 설정 수집기 클래스
 */
export class ServiceConfigCollector {
  private static configs: ServiceConfigRegistry = {};
  private static isLoaded = false;

  /**
   * 모든 서비스 설정을 자동으로 수집
   */
  static async collectConfigs(): Promise<ServiceConfigRegistry> {
    if (this.isLoaded) {
      return this.configs;
    }

    try {
      // 각 서비스별 설정 파일 동적 import
      const [
        { mainServiceConfig: mainConfig },
        { cmsServiceConfig: cmsConfig },
        { mathServiceConfig: mathConfig },
        { vectorServiceConfig: vectorConfig },
      ] = await Promise.all([
        import('@/net/services/main'),
        import('@/net/services/cms'),
        import('@/net/services/math'),
        import('@/net/services/vector'),
      ]);

      // 설정 등록
      this.configs.main = mainConfig;
      this.configs.cms = cmsConfig;
      this.configs.app = mathConfig; // math 서비스는 app ID 사용
      this.configs.vector = vectorConfig;

      this.isLoaded = true;

      // 서버 레지스트리에도 등록
      this.registerToServerRegistry();

      console.log('✅ 서비스 설정 자동 수집 완료:', Object.keys(this.configs));
      return this.configs;
    } catch (error) {
      console.error('❌ 서비스 설정 수집 중 오류:', error);
      return {};
    }
  }

  /**
   * 특정 서비스 설정 가져오기
   */
  static getServiceConfig(serviceId: string): ServiceConfig | null {
    return this.configs[serviceId] || null;
  }

  /**
   * 모든 서비스 설정 가져오기
   */
  static getAllConfigs(): ServiceConfigRegistry {
    return { ...this.configs };
  }

  /**
   * 서버 레지스트리에 설정 등록
   */
  private static registerToServerRegistry(): void {
    Object.values(this.configs).forEach(config => {
      const serverConfig = {
        id: config.id as any,
        name: config.name,
        baseURL: config.defaultUrls.production,
        urlPrefix: config.urlPrefix,
        timeout: config.timeout,
        headers: config.headers,
      };

      // 기존 서버 레지스트리에 등록
      try {
        serverRegistry.register(serverConfig);
      } catch (error) {
        // 이미 등록된 서버는 무시
        console.debug(`서버 ${config.id} 이미 등록됨`);
      }
    });
  }

  /**
   * Next.js 프록시용 설정 생성
   */
  static generateProxyRewrites(): Array<{ source: string; destination: string }> {
    const rewrites: Array<{ source: string; destination: string }> = [];

    Object.values(this.configs).forEach(config => {
      if (config.useProxy) {
        const envVar = `NEXT_PUBLIC_${config.id.toUpperCase()}_API_URL`;
        rewrites.push({
          source: `${config.urlPrefix}:path*`,
          destination: `\${process.env.${envVar} || '${config.defaultUrls.production}'}/:path*`,
        });
      }
    });

    return rewrites;
  }

  /**
   * 환경변수 기본값 생성
   */
  static generateEnvDefaults(): Record<string, string> {
    const envDefaults: Record<string, string> = {};

    Object.values(this.configs).forEach(config => {
      const envVar = `NEXT_PUBLIC_${config.id.toUpperCase()}_API_URL`;
      envDefaults[envVar] = config.defaultUrls.production;
    });

    return envDefaults;
  }

  /**
   * 설정 유효성 검증
   */
  static validateConfigs(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    Object.entries(this.configs).forEach(([key, config]) => {
      // 필수 필드 검증
      if (!config.id) errors.push(`${key}: id 필드가 누락됨`);
      if (!config.name) errors.push(`${key}: name 필드가 누락됨`);
      if (!config.urlPrefix) errors.push(`${key}: urlPrefix 필드가 누락됨`);
      if (!config.defaultUrls?.production) errors.push(`${key}: defaultUrls.production 필드가 누락됨`);

      // URL 형식 검증
      try {
        new URL(config.defaultUrls.production);
      } catch {
        errors.push(`${key}: 유효하지 않은 production URL`);
      }

      // 프록시 설정 검증
      if (config.useProxy && !config.urlPrefix.startsWith('/')) {
        errors.push(`${key}: 프록시 사용 시 urlPrefix는 '/'로 시작해야 함`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 설정 초기화 (테스트용)
   */
  static reset(): void {
    this.configs = {};
    this.isLoaded = false;
  }
}

// 싱글턴 패턴을 위한 기본 export
export const serviceConfigCollector = ServiceConfigCollector;