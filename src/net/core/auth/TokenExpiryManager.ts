/**
 * 토큰 만료 처리를 위한 싱글톤 매니저
 * 중복 모달 방지 및 토큰 갱신 프로세스 관리
 */

import { signOut } from 'next-auth/react';
import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('TokenExpiryManager');

export interface TokenExpiryResult {
  success: boolean;
  retry: boolean;
}

interface PendingRequest {
  resolve: (result: TokenExpiryResult) => void;
  reject: (error: Error) => void;
}

export class TokenExpiryManager {
  private static instance: TokenExpiryManager | null = null;
  private isModalVisible = false;
  private isRefreshing = false;
  private pendingRequests: PendingRequest[] = [];

  private constructor() {}

  static getInstance(): TokenExpiryManager {
    if (!TokenExpiryManager.instance) {
      TokenExpiryManager.instance = new TokenExpiryManager();
    }
    return TokenExpiryManager.instance;
  }

  /**
   * 토큰 만료 처리 요청 (자동 갱신)
   * @returns Promise<TokenExpiryResult> - 갱신 결과
   */
  async handleTokenExpiry(): Promise<TokenExpiryResult> {
    logger.debug('토큰 만료 처리 요청 (자동 갱신)');

    // 이미 갱신 중인 경우, 기존 프로세스의 결과를 기다림
    if (this.isRefreshing) {
      logger.debug('이미 토큰 갱신 중입니다. 대기열에 추가');
      return this.waitForRefreshResult();
    }

    // 새로운 자동 갱신 프로세스 시작
    this.isRefreshing = true;
    this.isModalVisible = true;
    
    try {
      const result = await this.performAutoRefresh();
      this.resolveAllPendingRequests(result);
      return result;
    } catch (error) {
      this.rejectAllPendingRequests(error as Error);
      throw error;
    } finally {
      this.isModalVisible = false;
      this.isRefreshing = false;
    }
  }

  /**
   * 대기 중인 요청들을 위한 Promise 생성
   */
  private waitForRefreshResult(): Promise<TokenExpiryResult> {
    return new Promise<TokenExpiryResult>((resolve, reject) => {
      this.pendingRequests.push({ resolve, reject });
    });
  }

  /**
   * 자동 토큰 갱신 수행
   */
  private async performAutoRefresh(): Promise<TokenExpiryResult> {
    // 로딩 모달 표시
    this.createLoadingModal();
    
    try {
      const success = await this.refreshToken();
      this.removeModalElement();
      
      if (success) {
        logger.info('자동 토큰 갱신 성공');
        return { success: true, retry: true };
      } else {
        logger.warn('자동 토큰 갱신 실패 - 로그인 페이지로 이동');
        this.handleLogout();
        return { success: false, retry: false };
      }
    } catch (error) {
      logger.error('자동 토큰 갱신 중 오류:', { error });
      this.removeModalElement();
      this.handleLogout();
      return { success: false, retry: false };
    }
  }

  /**
   * 로딩 모달 DOM 엘리먼트 생성
   */
  private createLoadingModal(): void {
    // 이미 모달이 존재하는 경우 제거
    const existingModal = document.getElementById('token-refreshing-modal-root');
    if (existingModal) {
      existingModal.remove();
    }

    // 모달 컨테이너 생성
    const modalRoot = document.createElement('div');
    modalRoot.id = 'token-refreshing-modal-root';
    modalRoot.style.position = 'fixed';
    modalRoot.style.top = '0';
    modalRoot.style.left = '0';
    modalRoot.style.zIndex = '9999';
    modalRoot.style.width = '100%';
    modalRoot.style.height = '100%';
    
    // 로딩 모달 HTML 생성
    modalRoot.innerHTML = `
      <div style="
        position: fixed;
        inset: 0;
        z-index: 50;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      ">
        <div style="
          background: white;
          border-radius: 8px;
          padding: 24px;
          width: 100%;
          max-width: 320px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        ">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <div style="
              width: 40px;
              height: 40px;
              background-color: #dbeafe;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 24px;
                height: 24px;
                border: 3px solid #3b82f6;
                border-top: 3px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
              "></div>
            </div>
            <div style="text-align: center;">
              <h3 style="font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">세션 갱신 중</h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.5; font-size: 14px;">
                토큰을 갱신하고 있습니다. 잠시만 기다려주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // DOM에 추가
    document.body.appendChild(modalRoot);
  }

  /**
   * 모달 엘리먼트 제거
   */
  private removeModalElement(): void {
    const modalRoot = document.getElementById('token-refreshing-modal-root');
    if (modalRoot) {
      modalRoot.remove();
    }
  }

  /**
   * 토큰 갱신 처리
   */
  private async refreshToken(): Promise<boolean> {
    try {
      logger.debug('토큰 갱신 시도');
      
      // SessionManager를 사용하여 토큰 갱신
      const { sessionManager } = await import('@/net/core/session/SessionManager');
      logger.debug('SessionManager.refreshWithRefreshToken() 호출');
      
      const success = await sessionManager.refreshWithRefreshToken();
      
      logger.debug('SessionManager.refreshWithRefreshToken() 결과:', { success });
      
      if (success) {
        logger.info('토큰 갱신 성공');
        
        // 세션 업데이트 이벤트 발생
        window.dispatchEvent(new Event('session-updated'));
        
        return true;
      } else {
        logger.warn('토큰 갱신 실패 - SessionManager에서 false 반환');
        return false;
      }
    } catch (error) {
      logger.error('토큰 갱신 중 오류:', { 
        error: error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  }

  /**
   * 로그아웃 처리
   */
  private async handleLogout(): Promise<void> {
    logger.info('🚨 TokenExpiryManager.handleLogout() 호출됨');
    console.warn('🚨 TokenExpiryManager가 로그아웃을 트리거함');
    console.warn('스택 트레이스:', new Error().stack);
    window.location.href = "/logout"
  }

  /**
   * 대기 중인 모든 요청에 결과 전달
   */
  private resolveAllPendingRequests(result: TokenExpiryResult): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    requests.forEach(request => {
      request.resolve(result);
    });
    
    logger.debug(`${requests.length}개의 대기 중인 요청에 결과 전달`);
  }

  /**
   * 대기 중인 모든 요청에 에러 전달
   */
  private rejectAllPendingRequests(error: Error): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    requests.forEach(request => {
      request.reject(error);
    });
    
    logger.debug(`${requests.length}개의 대기 중인 요청에 에러 전달`);
  }

  /**
   * 매니저 상태 초기화 (테스트 용도)
   */
  reset(): void {
    this.isModalVisible = false;
    this.isRefreshing = false;
    this.pendingRequests = [];
    this.removeModalElement();
  }
}