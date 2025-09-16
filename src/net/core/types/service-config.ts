/**
 * 서비스별 설정 타입 정의
 */

export interface ServiceConfig {
  /** 서비스 ID (고유 식별자) */
  id: string;

  /** 서비스 이름 */
  name: string;

  /** 서비스 설명 */
  description: string;

  /** API 버전 */
  version: string;

  /** URL 프리픽스 (Next.js 프록시 경로) */
  urlPrefix: string;

  /** URL 변환 함수 */
  urlTransform: (url: string) => string;

  /** 타임아웃 (밀리초) */
  timeout: number;

  /** 기본 헤더 */
  headers: Record<string, string>;

  /** 환경별 기본 URL */
  defaultUrls: {
    production: string;
    development?: string;
    test?: string;
  };

  /** 프록시 사용 여부 */
  useProxy: boolean;

  /** CORS 설정 (직접 호출시) */
  cors?: {
    enabled: boolean;
    allowedOrigins?: string[];
  };
}

/**
 * 서비스 설정 로더 함수 타입
 */
export type ServiceConfigLoader = () => ServiceConfig;

/**
 * 서비스 설정 레지스트리
 */
export interface ServiceConfigRegistry {
  [serviceId: string]: ServiceConfig;
}