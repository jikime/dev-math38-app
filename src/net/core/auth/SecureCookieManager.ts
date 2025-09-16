/**
 * 보안 쿠키 관리자
 * Refresh Token을 HttpOnly 쿠키로 안전하게 저장 및 관리
 */

import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('SecureCookieManager');

export class SecureCookieManager {
  private static readonly REFRESH_TOKEN_COOKIE_NAME = '__Host-refresh-token';
  private static readonly COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7일 (초 단위)

  /**
   * Refresh Token을 HttpOnly 쿠키로 저장
   * @param refreshToken - 저장할 refresh token
   * @param response - Next.js Response 객체
   */
  static setRefreshTokenCookie(refreshToken: string, response?: any): void {
    if (typeof window !== 'undefined') {
      // 클라이언트 사이드에서는 직접 설정 불가 (보안상 이유)
      logger.warn('클라이언트에서는 HttpOnly 쿠키 설정 불가능');
      return;
    }

    // 서버 사이드에서 쿠키 설정
    const cookieOptions = [
      `${this.REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`,
      `Max-Age=${this.COOKIE_MAX_AGE}`,
      'HttpOnly', // JavaScript에서 접근 불가
      'Secure', // HTTPS에서만 전송
      'SameSite=Strict', // CSRF 공격 방지
      'Path=/', // 전체 도메인에서 사용
    ].join('; ');

    if (response?.setHeader) {
      response.setHeader('Set-Cookie', cookieOptions);
      logger.debug('Refresh token 쿠키 설정됨 (HttpOnly)');
    }
  }

  /**
   * HttpOnly 쿠키에서 Refresh Token 가져오기
   * @param request - Next.js Request 객체
   * @returns refresh token 또는 null
   */
  static getRefreshTokenFromCookie(request?: any): string | null {
    if (typeof window !== 'undefined') {
      // 클라이언트에서는 HttpOnly 쿠키 접근 불가
      return null;
    }

    const cookies = request?.headers?.cookie || '';
    const cookieMatch = cookies.match(new RegExp(`${this.REFRESH_TOKEN_COOKIE_NAME}=([^;]+)`));

    if (cookieMatch) {
      logger.debug('쿠키에서 refresh token 발견');
      return cookieMatch[1];
    }

    return null;
  }

  /**
   * Refresh Token 쿠키 삭제
   * @param response - Next.js Response 객체
   */
  static clearRefreshTokenCookie(response?: any): void {
    if (typeof window !== 'undefined') {
      logger.warn('클라이언트에서는 HttpOnly 쿠키 삭제 불가능');
      return;
    }

    const cookieOptions = [
      `${this.REFRESH_TOKEN_COOKIE_NAME}=`,
      'Max-Age=0',
      'HttpOnly',
      'Secure',
      'SameSite=Strict',
      'Path=/',
    ].join('; ');

    if (response?.setHeader) {
      response.setHeader('Set-Cookie', cookieOptions);
      logger.debug('Refresh token 쿠키 삭제됨');
    }
  }

  /**
   * 쿠키 존재 여부 확인 (서버 사이드에서만)
   * @param request - Next.js Request 객체
   * @returns 쿠키 존재 여부
   */
  static hasRefreshTokenCookie(request?: any): boolean {
    return this.getRefreshTokenFromCookie(request) !== null;
  }

  /**
   * 클라이언트용 임시 저장소 (HttpOnly 구현 전까지 사용)
   * 프로덕션에서는 제거하고 쿠키만 사용해야 함
   */
  static setRefreshTokenFallback(refreshToken: string): void {
    if (typeof window === 'undefined') return;

    try {
      // sessionStorage 사용 (localStorage보다 안전)
      sessionStorage.setItem('__temp_refresh_token', refreshToken);
      logger.debug('Refresh token 임시 저장됨 (fallback)');
    } catch (error) {
      logger.error('Refresh token 임시 저장 실패:', { error });
    }
  }

  /**
   * 클라이언트용 임시 저장소에서 가져오기
   */
  static getRefreshTokenFallback(): string | null {
    if (typeof window === 'undefined') return null;

    try {
      const token = sessionStorage.getItem('__temp_refresh_token');
      if (token) {
        logger.debug('임시 저장소에서 refresh token 발견');
      }
      return token;
    } catch (error) {
      logger.error('Refresh token 임시 저장소 접근 실패:', { error });
      return null;
    }
  }

  /**
   * 클라이언트용 임시 저장소 삭제
   */
  static clearRefreshTokenFallback(): void {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.removeItem('__temp_refresh_token');
      logger.debug('Refresh token 임시 저장소 삭제됨');
    } catch (error) {
      logger.error('Refresh token 임시 저장소 삭제 실패:', { error });
    }
  }

  /**
   * 통합 refresh token 가져오기 (쿠키 우선, fallback 보조)
   * @param request - 서버사이드 request 객체
   * @returns refresh token 또는 null
   */
  static getRefreshToken(request?: any): string | null {
    // 서버사이드: 쿠키에서 가져오기
    if (typeof window === 'undefined') {
      return this.getRefreshTokenFromCookie(request);
    }

    // 클라이언트사이드: fallback 저장소에서 가져오기
    return this.getRefreshTokenFallback();
  }

  /**
   * 통합 refresh token 저장
   * @param refreshToken - 저장할 token
   * @param response - 서버사이드 response 객체
   */
  static setRefreshToken(refreshToken: string, response?: any): void {
    // 서버사이드: HttpOnly 쿠키로 저장
    if (typeof window === 'undefined') {
      this.setRefreshTokenCookie(refreshToken, response);
    } else {
      // 클라이언트사이드: fallback 저장소 사용
      this.setRefreshTokenFallback(refreshToken);
    }
  }

  /**
   * 통합 refresh token 삭제
   * @param response - 서버사이드 response 객체
   */
  static clearRefreshToken(response?: any): void {
    // 서버사이드: 쿠키 삭제
    if (typeof window === 'undefined') {
      this.clearRefreshTokenCookie(response);
    } else {
      // 클라이언트사이드: fallback 저장소 삭제
      this.clearRefreshTokenFallback();
    }
  }
}