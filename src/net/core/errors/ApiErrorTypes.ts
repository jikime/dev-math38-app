/**
 * 커스텀 에러 클래스 정의
 * API 에러 처리를 위한 구조화된 에러 클래스들
 */

/**
 * 기본 API 에러 클래스
 */
export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();

    // Prototype chain 복구
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * 인증 에러 클래스
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = '인증이 필요합니다', details?: any) {
    super(message, 401, 'AUTHENTICATION_REQUIRED', details);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * 권한 에러 클래스
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = '권한이 없습니다', details?: any) {
    super(message, 403, 'AUTHORIZATION_FAILED', details);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * 리소스 없음 에러 클래스
 */
export class NotFoundError extends ApiError {
  constructor(message: string = '요청한 리소스를 찾을 수 없습니다', details?: any) {
    super(message, 404, 'RESOURCE_NOT_FOUND', details);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 검증 에러 클래스
 */
export class ValidationError extends ApiError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string = '입력 데이터 검증에 실패했습니다',
    validationErrors?: Record<string, string[]>,
    details?: any
  ) {
    super(message, 400, 'VALIDATION_FAILED', details);
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    };
  }
}

/**
 * 서버 에러 클래스
 */
export class ServerError extends ApiError {
  constructor(
    message: string = '서버 오류가 발생했습니다',
    status: number = 500,
    details?: any
  ) {
    super(message, status, 'SERVER_ERROR', details);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * 네트워크 에러 클래스
 */
export class NetworkError extends ApiError {
  constructor(message: string = '네트워크 연결을 확인해주세요', details?: any) {
    super(message, 0, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * 타임아웃 에러 클래스
 */
export class TimeoutError extends ApiError {
  constructor(message: string = '요청 시간이 초과되었습니다', details?: any) {
    super(message, 408, 'REQUEST_TIMEOUT', details);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * 비즈니스 로직 에러 클래스
 */
export class BusinessError extends ApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 422, code, details);
    this.name = 'BusinessError';
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

/**
 * 에러 코드 상수
 */
export const ErrorCodes = {
  // Authentication & Authorization
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',
  AUTH_PERMISSION_DENIED: 'AUTH_PERMISSION_DENIED',

  // Validation
  VALIDATION_REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
  VALIDATION_INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  VALIDATION_OUT_OF_RANGE: 'VALIDATION_OUT_OF_RANGE',

  // Business Logic
  BUSINESS_DUPLICATE_ENTRY: 'BUSINESS_DUPLICATE_ENTRY',
  BUSINESS_LIMIT_EXCEEDED: 'BUSINESS_LIMIT_EXCEEDED',
  BUSINESS_INVALID_STATE: 'BUSINESS_INVALID_STATE',
  BUSINESS_OPERATION_FAILED: 'BUSINESS_OPERATION_FAILED',

  // System
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE',
  SYSTEM_OVERLOAD: 'SYSTEM_OVERLOAD',
  SYSTEM_DATABASE_ERROR: 'SYSTEM_DATABASE_ERROR',

  // Network
  NETWORK_CONNECTION_LOST: 'NETWORK_CONNECTION_LOST',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  NETWORK_DNS_FAILED: 'NETWORK_DNS_FAILED',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * 에러 메시지 상수
 */
export const ErrorMessages = {
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: '인증 토큰이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCodes.AUTH_TOKEN_INVALID]: '유효하지 않은 인증 토큰입니다.',
  [ErrorCodes.AUTH_SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCodes.AUTH_PERMISSION_DENIED]: '해당 작업을 수행할 권한이 없습니다.',
  
  [ErrorCodes.VALIDATION_REQUIRED_FIELD]: '필수 입력 항목이 누락되었습니다.',
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: '입력 형식이 올바르지 않습니다.',
  [ErrorCodes.VALIDATION_OUT_OF_RANGE]: '입력값이 허용 범위를 벗어났습니다.',
  
  [ErrorCodes.BUSINESS_DUPLICATE_ENTRY]: '이미 존재하는 항목입니다.',
  [ErrorCodes.BUSINESS_LIMIT_EXCEEDED]: '허용된 한도를 초과했습니다.',
  [ErrorCodes.BUSINESS_INVALID_STATE]: '현재 상태에서는 해당 작업을 수행할 수 없습니다.',
  [ErrorCodes.BUSINESS_OPERATION_FAILED]: '작업 처리 중 오류가 발생했습니다.',
  
  [ErrorCodes.SYSTEM_MAINTENANCE]: '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
  [ErrorCodes.SYSTEM_OVERLOAD]: '서버 부하로 인해 일시적으로 서비스를 이용할 수 없습니다.',
  [ErrorCodes.SYSTEM_DATABASE_ERROR]: '데이터베이스 오류가 발생했습니다.',
  
  [ErrorCodes.NETWORK_CONNECTION_LOST]: '네트워크 연결이 끊어졌습니다.',
  [ErrorCodes.NETWORK_TIMEOUT]: '요청 시간이 초과되었습니다.',
  [ErrorCodes.NETWORK_DNS_FAILED]: 'DNS 조회에 실패했습니다.',
} as const;

/**
 * HTTP 상태 코드별 에러 생성 헬퍼
 */
export function createErrorFromStatus(
  status: number,
  message?: string,
  details?: any
): ApiError {
  switch (status) {
    case 400:
      return new ValidationError(message, undefined, details);
    case 401:
      return new AuthenticationError(message, details);
    case 403:
      return new AuthorizationError(message, details);
    case 404:
      // TODO: /image 로 끝나는 request 는 404 에러로 처리하지 않음
      return new NotFoundError(message, details);
    case 408:
      return new TimeoutError(message, details);
    case 422:
      return new BusinessError(
        message || '비즈니스 로직 오류가 발생했습니다',
        'BUSINESS_ERROR',
        details
      );
    case 500:
    case 502:
    case 503:
      return new ServerError(message, status, details);
    default:
      return new ApiError(
        message || `요청 처리 중 오류가 발생했습니다 (${status})`,
        status,
        undefined,
        details
      );
  }
}