/**
 * 향상된 세션 관리 시스템
 * 자동 갱신, 만료 처리, 캐싱 전략 포함
 */

import { getSession, signIn } from 'next-auth/react';
import { AuthSession } from '@/net/core/types';
import { createModuleLogger } from '@/net/core/utils/Logger';
import { SecureCookieManager } from '@/net/core/auth/SecureCookieManager';
import { TokenValidator } from '@/net/core/auth/TokenValidator';

// Window 타입 확장 (하위 호환성)
declare global {
  interface Window {
    __cachedSession?: AuthSession | null;
    __sessionExpiryTime?: number;
  }
}

const logger = createModuleLogger('SessionManager');

export interface SessionConfig {
  /** 캐시 유효 시간 (ms) */
  cacheTimeout: number;
  /** 자동 갱신 활성화 */
  autoRefresh: boolean;
  /** 갱신 간격 (ms) */
  refreshInterval: number;
  /** 만료 전 갱신 시간 (ms) */
  refreshBeforeExpiry: number;
  /** 재시도 횟수 */
  maxRetries: number;
  /** 재시도 간격 (ms) */
  retryDelay: number;
}

class SessionManager {
  private static instance: SessionManager;
  private config: SessionConfig;
  private sessionCache: AuthSession | null = null;
  private cacheExpiryTime: number = 0;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<AuthSession | null> | null = null;
  private retryCount: number = 0;
  private listeners: Set<(session: AuthSession | null) => void> = new Set();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeAutoRefresh();
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * 기본 설정 가져오기
   */
  private getDefaultConfig(): SessionConfig {
    return {
      cacheTimeout: 5 * 60 * 1000, // 5분
      autoRefresh: true, // 자동 갱신 활성화 (토큰 만료 방지)
      refreshInterval: 3 * 60 * 1000, // 3분마다 체크
      refreshBeforeExpiry: 2 * 60 * 1000, // 2분 전에 미리 갱신
      maxRetries: 3,
      retryDelay: 1000, // 1초
    };
  }

  /**
   * 설정 업데이트
   */
  configure(config: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...config };
    this.restartAutoRefresh();
  }

  /**
   * 자동 갱신 초기화
   */
  private initializeAutoRefresh(): void {
    if (!this.config.autoRefresh) {
      return;
    }

    // 브라우저 환경에서만 실행
    if (typeof window === 'undefined') {
      return;
    }

    // 페이지 포커스 이벤트 리스너
    window.addEventListener('focus', () => {
      logger.debug('Window focused, checking session');
      this.checkAndRefreshSession();
    });

    // 페이지 visibility 변경 이벤트
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        logger.debug('Page became visible, checking session');
        this.checkAndRefreshSession();
      }
    });

    // 주기적 갱신 시작
    this.startRefreshTimer();
  }

  /**
   * 갱신 타이머 시작
   */
  private startRefreshTimer(): void {
    this.stopRefreshTimer();

    if (!this.config.autoRefresh) {
      return;
    }

    this.refreshTimer = setInterval(() => {
      this.checkAndRefreshSession();
    }, this.config.refreshInterval);

    logger.debug('Auto-refresh timer started', {
      interval: this.config.refreshInterval,
    });
  }

  /**
   * 갱신 타이머 중지
   */
  private stopRefreshTimer(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
      logger.debug('Auto-refresh timer stopped');
    }
  }

  /**
   * 자동 갱신 재시작
   */
  private restartAutoRefresh(): void {
    this.stopRefreshTimer();
    this.startRefreshTimer();
  }

  /**
   * 세션 확인 및 갱신
   * 외부에서 수동으로 호출 가능하도록 public으로 변경
   */
  async checkAndRefreshSession(): Promise<void> {
    const now = Date.now();

    // 현재 세션 가져오기
    const currentSession = this.sessionCache || await getSession() as AuthSession | null;

    if (!currentSession?.accessToken) {
      logger.debug('세션 또는 액세스 토큰이 없음 - 갱신하지 않음');
      return;
    }

    // 🔒 보안 개선: TokenValidator 사용하여 토큰 검증
    const validation = TokenValidator.validateToken(
      currentSession.accessToken,
      this.config.refreshBeforeExpiry
    );

    const shouldRefresh = validation.needsRefresh;

    if (!shouldRefresh) {
      logger.debug('토큰 갱신 불필요:', {
        isValid: validation.isValid,
        expiresAt: validation.expiresAt ? new Date(validation.expiresAt).toLocaleString() : null,
        timeUntilExpiry: TokenValidator.getTimeUntilExpiry(currentSession.accessToken),
        refreshThreshold: this.config.refreshBeforeExpiry / 1000 + '초'
      });
      return;
    }

    logger.debug('토큰 갱신 필요:', {
      isValid: validation.isValid,
      isExpired: validation.isExpired,
      expiresAt: validation.expiresAt ? new Date(validation.expiresAt).toLocaleString() : null,
      timeUntilExpiry: TokenValidator.getTimeUntilExpiry(currentSession.accessToken),
      now: new Date(now).toLocaleString()
    });

    // 이미 갱신 중인 경우 대기
    if (this.isRefreshing && this.refreshPromise) {
      await this.refreshPromise;
      return;
    }

    // 세션 갱신
    await this.refreshSession();
  }

  /**
   * 세션 갱신
   */
  private async refreshSession(): Promise<AuthSession | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    logger.debug('Refreshing session');

    this.refreshPromise = this.fetchSessionWithRetry();

    try {
      const session = await this.refreshPromise;
      
      if (session) {
        this.updateCache(session);
        this.notifyListeners(session);
        this.retryCount = 0;
        logger.info('Session refreshed successfully');
      } else {
        this.clearCache();
        this.notifyListeners(null);
        logger.warn('Session refresh failed - no session returned');
      }

      return session;
    } catch (error) {
      logger.error('Session refresh error', { error });
      this.clearCache();
      this.notifyListeners(null);
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * 재시도 로직이 포함된 세션 가져오기
   */
  private async fetchSessionWithRetry(): Promise<AuthSession | null> {
    let lastError: any;

    for (let i = 0; i <= this.config.maxRetries; i++) {
      try {
        const session = await getSession() as AuthSession | null;
        
        if (session?.accessToken) {
          return session;
        }

        // 세션이 없으면 재시도하지 않음
        if (!session) {
          return null;
        }
      } catch (error) {
        lastError = error;
        logger.warn(`Session fetch attempt ${i + 1} failed`, { error });

        if (i < this.config.maxRetries) {
          await this.delay(this.config.retryDelay * Math.pow(2, i)); // 지수 백오프
        }
      }
    }

    throw lastError || new Error('Failed to fetch session after retries');
  }

  /**
   * 캐시 업데이트
   */
  private updateCache(session: AuthSession): void {
    this.sessionCache = session;
    this.cacheExpiryTime = Date.now() + this.config.cacheTimeout;

    // 전역 캐시도 업데이트 (하위 호환성)
    if (typeof window !== 'undefined') {
      window.__cachedSession = session;
      window.__sessionExpiryTime = this.cacheExpiryTime;
    }

    logger.debug('Session cache updated', {
      expiresIn: this.config.cacheTimeout,
    });
  }

  /**
   * 캐시 초기화
   */
  private clearCache(): void {
    this.sessionCache = null;
    this.cacheExpiryTime = 0;

    // 전역 캐시도 초기화
    if (typeof window !== 'undefined') {
      window.__cachedSession = null;
      window.__sessionExpiryTime = 0;
    }

    logger.debug('Session cache cleared');
  }

  /**
   * 지연 헬퍼
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 리스너 알림
   */
  private notifyListeners(session: AuthSession | null): void {
    this.listeners.forEach(listener => {
      try {
        listener(session);
      } catch (error) {
        logger.error('Session listener error', { error });
      }
    });
  }

  /**
   * 세션 가져오기 (공개 API)
   */
  async getSession(): Promise<AuthSession | null> {
    // 서버 사이드에서는 항상 새로 가져오기
    if (typeof window === 'undefined') {
      return await getSession() as AuthSession | null;
    }

    const now = Date.now();

    // 캐시가 유효한 경우
    if (this.sessionCache && this.cacheExpiryTime > now) {
      logger.debug('Returning cached session');
      return this.sessionCache;
    }

    // 갱신 중인 경우 대기
    if (this.isRefreshing && this.refreshPromise) {
      logger.debug('Waiting for ongoing refresh');
      return await this.refreshPromise;
    }

    // 새로 가져오기
    return await this.refreshSession();
  }

  /**
   * 세션 강제 갱신
   */
  async forceRefresh(): Promise<AuthSession | null> {
    logger.info('Force refreshing session');
    this.clearCache();
    return await this.refreshSession();
  }

  /**
   * Refresh Token을 사용한 토큰 갱신
   * TokenExpiryManager에서 사용
   */
  async refreshWithRefreshToken(): Promise<boolean> {
    try {
      logger.debug('토큰 갱신 시도 (refresh token 사용)');

      // 현재 토큰 정보 저장 (비교용)
      const currentSession = this.sessionCache || await getSession() as AuthSession | null;

      // refreshToken을 안전한 방법으로 가져오기
      // 1순위: SecureCookieManager (더 안전)
      // 2순위: 세션 (클라이언트 접근 가능)
      const refreshToken = SecureCookieManager.getRefreshToken() || currentSession?.refreshToken;

      if (!refreshToken) {
        logger.warn('Refresh token이 없어 갱신할 수 없음');
        return false;
      }
      const currentAccessToken = currentSession?.accessToken;
      let currentExpiry = null;

      // 현재 토큰의 만료 시간 추출
      if (currentAccessToken) {
        try {
          const tokenParts = currentAccessToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            currentExpiry = payload.exp * 1000; // 밀리초로 변환
          }
        } catch (error) {
          logger.warn('현재 토큰 파싱 중 오류:', error as Record<string, any>);
        }
      }

      // NextAuth v5에서는 update 함수를 직접 import할 수 없음
      // 대신 캐시를 무효화하고 새 세션을 가져와서 JWT callback 트리거
      // JWT callback에서 자동으로 토큰 갱신이 처리됨
      logger.debug('캐시 무효화 후 새 세션 가져오기로 JWT callback 트리거');
      this.clearCache();
      await getSession();

      // 잠시 대기 후 새 세션 가져오기 (토큰 갱신 완료 대기)
      await this.delay(1500);

      // 새 세션 가져오기
      const updatedSession = await this.fetchSessionWithRetry();
      const newAccessToken = updatedSession?.accessToken;

      if (!newAccessToken) {
        logger.warn('토큰 갱신 실패: 새 토큰을 가져올 수 없음');
        return false;
      }

      // 새 토큰의 만료 시간 추출
      let newExpiry = null;
      try {
        const tokenParts = newAccessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          newExpiry = payload.exp * 1000; // 밀리초로 변환
        }
      } catch (error) {
        logger.warn('새 토큰 파싱 중 오류:', error as Record<string, any>);
      }

      logger.debug('토큰 비교:', {
        tokenChanged: newAccessToken !== currentAccessToken,
        expiryChanged: newExpiry !== currentExpiry,
        currentExpiry: currentExpiry ? new Date(currentExpiry).toLocaleString() : null,
        newExpiry: newExpiry ? new Date(newExpiry).toLocaleString() : null
      });

      // 성공 판정: 토큰이 변경되었거나 만료 시간이 연장되었으면 성공
      const isSuccess = newAccessToken !== currentAccessToken ||
                       (newExpiry && currentExpiry && newExpiry > currentExpiry);

      if (isSuccess) {
        this.updateCache(updatedSession);
        await this.syncToApiServices();
        this.notifyListeners(updatedSession);

        if (newAccessToken !== currentAccessToken) {
          logger.info('토큰 갱신 성공 - 새 토큰 발급됨 (refresh token)');
        } else {
          logger.info('토큰 갱신 성공 - 만료시간 연장됨 (refresh token)');
        }
        return true;
      } else {
        // 토큰이 아직 유효해서 갱신이 필요하지 않은 경우도 성공으로 처리
        logger.info('토큰 갱신 불필요 - 토큰이 아직 유효함');
        return true;  // false에서 true로 변경
      }
    } catch (error) {
      logger.error('토큰 갱신 중 오류:', {error});
      return false;
    }
  }

  /**
   * 세션 무효화
   */
  invalidate(): void {
    logger.info('Invalidating session');
    this.clearCache();
    this.stopRefreshTimer();
    this.notifyListeners(null);
  }

  /**
   * 세션 변경 리스너 추가
   */
  addListener(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.add(listener);
    
    // 현재 세션으로 즉시 호출
    if (this.sessionCache) {
      listener(this.sessionCache);
    }

    // 제거 함수 반환
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 세션 유효성 확인
   */
  isSessionValid(): boolean {
    return !!(this.sessionCache && this.cacheExpiryTime > Date.now());
  }

  /**
   * 액세스 토큰 가져오기
   */
  getAccessToken(): string | null {
    return this.sessionCache?.accessToken || null;
  }

  /**
   * 로그인 필요 여부 확인 (리다이렉트 없음)
   */
  async requireAuth(): Promise<AuthSession> {
    const session = await this.getSession();
    
    if (!session) {
      logger.info('Authentication required - no automatic redirect');
      throw new Error('Authentication required');
    }

    return session;
  }

  /**
   * API 서비스에 토큰 동기화
   * session.ts의 syncSessionToken 기능을 통합
   */
  async syncToApiServices(): Promise<string | null> {
    const session = await this.getSession();
    const token = session?.accessToken || null;
    
    // ApiServiceFactory를 동적으로 import하여 순환 의존성 방지
    try {
      const { ApiServiceFactory } = await import('@/net/core/api/ApiServiceFactory');
      ApiServiceFactory.setAccessTokenForAll(token);
      
      if (token) {
        logger.debug('Session token synchronized across all API clients');
      } else {
        logger.warn('No session token available for API sync');
      }
    } catch (error) {
      logger.error('Failed to sync token to API services', { error });
    }
    
    return token;
  }

  /**
   * 세션 설정 및 동기화
   * SessionTokenProvider에서 사용
   */
  async setSession(session: AuthSession | null): Promise<void> {
    if (session) {
      this.updateCache(session);
      await this.syncToApiServices();
      this.notifyListeners(session);
    } else {
      this.clearCache();
      this.notifyListeners(null);
    }
  }

  /**
   * 정리 (앱 종료 시)
   */
  dispose(): void {
    this.stopRefreshTimer();
    this.clearCache();
    this.listeners.clear();
    logger.info('SessionManager disposed');
  }
}

// 싱글톤 인스턴스 export
export const sessionManager = SessionManager.getInstance();

// 하위 호환성을 위한 함수 export
export async function getCachedSession(): Promise<AuthSession | null> {
  return await sessionManager.getSession();
}

export function clearGlobalSessionCache(): void {
  sessionManager.invalidate();
}

export function isSessionCacheValid(): boolean {
  return sessionManager.isSessionValid();
}

// session.ts에서 가져온 함수들 (하위 호환성)
export async function syncSessionToken(): Promise<string | null> {
  return await sessionManager.syncToApiServices();
}

export function useSessionTokenSync() {
  if (typeof window === 'undefined') return;
  
  const handleFocus = () => {
    sessionManager.checkAndRefreshSession();
  };
  
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      sessionManager.checkAndRefreshSession();
    }
  };
  
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 초기 동기화
  sessionManager.syncToApiServices();
  
  // 클린업 함수 반환
  return () => {
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

// 기본 export
export default sessionManager;