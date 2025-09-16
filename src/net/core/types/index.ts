/**
 * 통합 네트워킹 시스템 타입 정의
 */

// API 응답 타입들 re-export
export * from './api-responses';

// 🆕 서비스 설정 타입들 re-export
export * from './service-config';

// ApiErrorTypes에서 ApiError 타입 가져오기
import { ApiError as ApiErrorClass } from '../errors/ApiErrorTypes';

// RequestInterceptor에서 사용할 타입 별칭
type ApiError = ApiErrorClass;

// 에러 클래스들 re-export
export { 
  ApiError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ServerError,
  NetworkError,
  TimeoutError,
  BusinessError,
  ErrorCodes,
  ErrorMessages,
  createErrorFromStatus,
  type ErrorCode
} from '../errors/ApiErrorTypes';

/**
 * 서버 식별자 타입
 * 동적으로 추가 가능하도록 string 타입으로 변경
 */
export type ServerId = string;

/**
 * 기본 서버 ID 상수
 * 하위 호환성 유지를 위해 기존 서버 ID들을 상수로 정의
 */
export const DEFAULT_SERVER_IDS = {
  MAIN: 'main',
  APP: 'app',
  CMS: 'cms',
  VECTOR: 'vector',
} as const;

/**
 * 기본 서버 ID 타입 (타입 안전성 유지)
 */
export type DefaultServerId = typeof DEFAULT_SERVER_IDS[keyof typeof DEFAULT_SERVER_IDS];

/**
 * 서버 설정 타입
 */
export interface ServerConfig {
  /** 서버 식별자 */
  id: ServerId;
  /** 서버 이름 (표시용) */
  name: string;
  /** 기본 URL */
  baseURL: string;
  /** URL 프리픽스 (예: '/api/') */
  urlPrefix: string;
  /** URL 변환 함수 */
  urlTransform?: (url: string) => string;
  /** 타임아웃 (ms, 기본값: 30000) */
  timeout?: number;
  /** 기본 헤더 */
  headers?: Record<string, string>;
  /** API 버전 */
  version?: string;
  /** 설명 */
  description?: string;
}

/**
 * HTTP 메서드 타입
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API 요청 옵션
 */
export interface ApiRequestOptions {
  /** HTTP 메서드 */
  method?: HttpMethod;
  /** 요청 바디 데이터 */
  data?: any;
  /** URL 파라미터 */
  params?: Record<string, any>;
  /** 추가 헤더 */
  headers?: Record<string, string>;
  /** 타임아웃 오버라이드 (ms) */
  timeout?: number;
  /** 토스트 메시지 표시 여부 (기본값: true) */
  showToast?: boolean;
  /** 인증 스킵 여부 (기본값: false) */
  skipAuth?: boolean;
  /** 재시도 횟수 */
  retry?: number;
  /** 응답 캐싱 여부 */
  cache?: boolean;
  /** 캐시 TTL (ms) */
  cacheTTL?: number;
}

/**
 * API 응답 타입
 */
export interface ApiResponse<T = any> {
  /** 응답 데이터 */
  data: T;
  /** HTTP 상태 코드 */
  status: number;
  /** HTTP 상태 텍스트 */
  statusText: string;
  /** 응답 헤더 */
  headers: Record<string, string>;
  /** 요청 설정 (옵션) */
  config?: any;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  /** 페이지 컨텐츠 */
  content: T[];
  /** 전체 요소 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 (0부터 시작) */
  number: number;
  /** 첫 페이지 여부 */
  first: boolean;
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 비어있음 여부 */
  empty: boolean;
}

/**
 * 표준 응답 포맷
 */
export interface SimpleResponse<T = any> {
  /** 성공 여부 */
  success: boolean;
  /** 응답 메시지 */
  message?: string;
  /** 응답 데이터 */
  data?: T;
  /** 에러 메시지 */
  error?: string;
}

/**
 * React Query 통합을 위한 타입
 */
export interface ApiQueryConfig {
  /** 캐시 유지 시간 (ms) */
  staleTime?: number;
  /** 가비지 컬렉션 시간 (ms) */
  gcTime?: number;
  /** 포커스 시 재검증 여부 */
  refetchOnWindowFocus?: boolean;
  /** 재연결 시 재검증 여부 */
  refetchOnReconnect?: boolean;
  /** 에러 재시도 횟수 */
  retry?: number;
  /** 에러 재시도 간격 함수 */
  retryDelay?: (attemptIndex: number) => number;
  /** 자동 새로고침 간격 (ms) */
  refetchInterval?: number;
  /** 로딩 표시 여부 */
  showLoading?: boolean;
  /** 에러 표시 여부 */
  showError?: boolean;
}

/**
 * API 서비스 인터페이스
 * 모든 API 서비스가 구현해야 하는 기본 인터페이스
 */
export interface IApiService {
  /** GET 요청 */
  get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
  /** POST 요청 */
  post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T>;
  /** PUT 요청 */
  put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T>;
  /** DELETE 요청 */
  delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>;
  /** PATCH 요청 */
  patch<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T>;
}

/**
 * 인터셉터 타입
 * @deprecated 현재 사용하지 않음. Interceptors 클래스 사용
 */
export interface RequestInterceptor {
  onRequest?: (config: ApiRequestOptions) => Promise<ApiRequestOptions> | ApiRequestOptions;
  onError?: (error: ApiError) => Promise<ApiError> | ApiError;
}

/**
 * @deprecated 현재 사용하지 않음. Interceptors 클래스 사용
 */
export interface ResponseInterceptor {
  onResponse?: <T>(response: ApiResponse<T>) => Promise<ApiResponse<T>> | ApiResponse<T>;
  onError?: (error: ApiError) => Promise<ApiError> | ApiError;
}