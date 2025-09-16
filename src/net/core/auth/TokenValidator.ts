/**
 * 중앙화된 토큰 검증 유틸리티
 * JWT 토큰의 만료, 유효성 검증을 통합 관리
 */

import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('TokenValidator');

export interface TokenValidationResult {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: number;
  timeUntilExpiry?: number;
  needsRefresh: boolean;
  error?: string;
}

export class TokenValidator {
  // 토큰 갱신 임계시간 (기본: 2분 전)
  private static readonly REFRESH_THRESHOLD_MS = 2 * 60 * 1000;

  /**
   * JWT 토큰 파싱 (안전한 방식)
   * @param token - JWT 토큰
   * @returns 파싱된 페이로드 또는 null
   */
  static parseJWT(token: string): any | null {
    if (!token || typeof token !== 'string') {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        logger.warn('JWT 토큰 형식이 올바르지 않음 (3개 부분 필요)');
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      // padding 추가
      const padLength = 4 - (base64.length % 4);
      const paddedBase64 = base64 + '='.repeat(padLength % 4);

      const jsonPayload = decodeURIComponent(
        atob(paddedBase64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      logger.warn('JWT 파싱 중 오류:', { error });
      return null;
    }
  }

  /**
   * 토큰 만료 시간 추출
   * @param token - JWT 토큰
   * @returns 만료 시간 (밀리초) 또는 null
   */
  static getTokenExpiry(token: string): number | null {
    const payload = this.parseJWT(token);

    if (!payload || !payload.exp) {
      return null;
    }

    // JWT exp는 초 단위이므로 밀리초로 변환
    return payload.exp * 1000;
  }

  /**
   * 토큰 유효성 검증 (종합)
   * @param token - 검증할 JWT 토큰
   * @param refreshThresholdMs - 갱신 임계시간 (기본: 2분)
   * @returns 검증 결과
   */
  static validateToken(
    token: string,
    refreshThresholdMs: number = this.REFRESH_THRESHOLD_MS
  ): TokenValidationResult {
    // 1. 기본 유효성 검증
    if (!token || typeof token !== 'string') {
      return {
        isValid: false,
        isExpired: true,
        needsRefresh: true,
        error: 'Token is null or invalid format'
      };
    }

    // 2. JWT 파싱
    const payload = this.parseJWT(token);
    if (!payload) {
      return {
        isValid: false,
        isExpired: true,
        needsRefresh: true,
        error: 'Failed to parse JWT token'
      };
    }

    // 3. 만료 시간 확인
    const expiresAt = this.getTokenExpiry(token);
    if (!expiresAt) {
      return {
        isValid: false,
        isExpired: true,
        needsRefresh: true,
        error: 'Token does not contain expiry information'
      };
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const isExpired = timeUntilExpiry <= 0;
    const needsRefresh = timeUntilExpiry <= refreshThresholdMs;

    return {
      isValid: !isExpired,
      isExpired,
      expiresAt,
      timeUntilExpiry,
      needsRefresh,
    };
  }

  /**
   * 401 에러가 토큰 만료로 인한 것인지 확인
   * @param error - Axios 에러 객체
   * @returns 토큰 만료 여부
   */
  static isTokenExpiredError(error: any): boolean {
    if (!error || !error.response || error.response.status !== 401) {
      return false;
    }

    // 1. WWW-Authenticate 헤더 확인
    const wwwAuth = error.response.headers['www-authenticate'] as string;
    if (wwwAuth) {
      const tokenExpiredPattern = /error="?token_expired"?/i;
      if (tokenExpiredPattern.test(wwwAuth)) {
        logger.debug('WWW-Authenticate 헤더에서 token_expired 감지');
        return true;
      }
    }

    // 2. 응답 바디 확인
    const responseData = error.response.data;
    if (responseData && typeof responseData === 'object') {
      if (responseData.error === 'token_expired' ||
          responseData.error_code === 'token_expired' ||
          responseData.errorCode === 'token_expired') {
        logger.debug('응답 바디에서 token_expired 감지');
        return true;
      }
    }

    // 3. 에러 메시지 확인
    const errorMessage = responseData?.message ||
                        responseData?.error_description ||
                        responseData?.description || '';

    if (typeof errorMessage === 'string') {
      const expiredKeywords = [
        'expired', '만료', 'token expired', 'jwt expired',
        'access token expired', 'token has expired'
      ];

      const isExpired = expiredKeywords.some(keyword =>
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isExpired) {
        logger.debug('에러 메시지에서 토큰 만료 키워드 감지:', { errorMessage });
        return true;
      }
    }

    logger.debug('토큰 만료가 아닌 401 에러로 판단');
    return false;
  }

  /**
   * 토큰 기본 정보 추출 (디버깅용)
   * @param token - JWT 토큰
   * @returns 토큰 정보
   */
  static getTokenInfo(token: string): {
    isValid: boolean;
    issuer?: string;
    subject?: string;
    audience?: string;
    issuedAt?: Date;
    expiresAt?: Date;
    algorithm?: string;
  } {
    const payload = this.parseJWT(token);
    if (!payload) {
      return { isValid: false };
    }

    // 헤더 파싱 (알고리즘 정보)
    let algorithm: string | undefined;
    try {
      const headerPart = token.split('.')[0];
      const header = JSON.parse(atob(headerPart.replace(/-/g, '+').replace(/_/g, '/')));
      algorithm = header.alg;
    } catch (error) {
      // 헤더 파싱 실패는 무시
    }

    return {
      isValid: true,
      issuer: payload.iss,
      subject: payload.sub,
      audience: payload.aud,
      issuedAt: payload.iat ? new Date(payload.iat * 1000) : undefined,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      algorithm,
    };
  }

  /**
   * 토큰 만료까지 남은 시간을 사람이 읽기 쉬운 형태로 반환
   * @param token - JWT 토큰
   * @returns 시간 문자열
   */
  static getTimeUntilExpiry(token: string): string {
    const validation = this.validateToken(token);

    if (!validation.isValid || !validation.timeUntilExpiry) {
      return '만료됨';
    }

    const totalSeconds = Math.floor(validation.timeUntilExpiry / 1000);

    if (totalSeconds < 60) {
      return `${totalSeconds}초`;
    } else if (totalSeconds < 300) { // 5분(300초) 이하일 때만 초단위 표시
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}분 ${seconds}초`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      return `${minutes}분`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}시간 ${minutes}분`;
    }
  }

  /**
   * 다중 토큰 일괄 검증
   * @param tokens - 검증할 토큰들 (키-값 쌍)
   * @returns 각 토큰의 검증 결과
   */
  static validateMultipleTokens(tokens: Record<string, string>): Record<string, TokenValidationResult> {
    const results: Record<string, TokenValidationResult> = {};

    for (const [key, token] of Object.entries(tokens)) {
      results[key] = this.validateToken(token);
    }

    return results;
  }
}