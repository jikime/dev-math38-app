/**
 * Axios 인터셉터 설정
 * 요청과 응답 인터셉터를 관리합니다.
 */

import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ServerConfig, AuthSession } from '@/net/core/types';
import { ApiErrorProcessor } from '@/net/core/errors/ApiErrorProcessor';
import { TokenExpiryManager } from '@/net/core/auth/TokenExpiryManager';
import { TokenValidator } from '@/net/core/auth/TokenValidator';
import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('Interceptors');

export interface InterceptorConfig {
  axiosInstance: AxiosInstance;
  serverConfig: ServerConfig;
  getAccessToken: () => string | null;
  getSession: () => Promise<AuthSession | null>;
  onSessionExpired: () => void;
}

export class Interceptors {
  /**
   * 요청 인터셉터 설정
   */
  static setupRequestInterceptor(config: InterceptorConfig): void {
    const { axiosInstance, serverConfig, getAccessToken, getSession } = config;

    axiosInstance.interceptors.request.use(
      async (requestConfig) => {
        // 요청 인터셉터 로깅
        logger.debug('Request interceptor - Before', {
          url: requestConfig.url,
          baseURL: requestConfig.baseURL,
          prefix: serverConfig.urlPrefix,
        });

        // URL 변환 적용
        if (requestConfig.url && serverConfig.urlTransform) {
          const originalUrl = requestConfig.url;
          requestConfig.url = serverConfig.urlTransform(requestConfig.url);
          
          logger.debug(`URL transformed: ${originalUrl} → ${requestConfig.url}`);
        }

        // 인증 토큰 처리
        await this.handleAuthentication(requestConfig, getAccessToken, getSession);

        return requestConfig;
      },
      (error) => {
        // Request 단계에서 발생한 에러 처리
        if (error.isAxiosError) {
          return Promise.reject(ApiErrorProcessor.transformError(error));
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 응답 인터셉터 설정
   */
  static setupResponseInterceptor(config: InterceptorConfig): void {
    const { axiosInstance, onSessionExpired } = config;

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const showToast = (error.config as any)?.showToast !== false;

        // 401 에러 처리 - 토큰 만료 감지
        if (error.response?.status === 401) {
          const isTokenExpired = await this.checkIfTokenExpired(error);
          
          if (isTokenExpired) {
            try {
              logger.info('토큰 만료 감지, TokenExpiryManager 호출');
              
              // 토큰 만료 처리 모달 표시
              const tokenManager = TokenExpiryManager.getInstance();
              const result = await tokenManager.handleTokenExpiry();
              
              if (result.success && result.retry && error.config) {
                logger.info('토큰 갱신 성공, 원래 요청 재시도');
                
                // 원래 요청 재시도
                return axiosInstance.request(error.config);
              } else {
                logger.info('토큰 갱신 실패 또는 사용자가 로그아웃 선택');
                logger.info('갱신 결과:', result);
                // 로그아웃이 이미 TokenExpiryManager에서 처리됨
                try {
                  return Promise.reject(ApiErrorProcessor.transformError(error));
                } catch (transformError) {
                  logger.error('ApiErrorProcessor.transformError 실패:', { transformError, originalError: error });
                  return Promise.reject(error);
                }
              }
            } catch (modalError) {
              logger.error('TokenExpiryManager 처리 중 오류:', { modalError });
              logger.error('원본 에러:', error);
              onSessionExpired();
              try {
                return Promise.reject(ApiErrorProcessor.transformError(error));
              } catch (transformError) {
                logger.error('ApiErrorProcessor.transformError 실패:', { transformError, originalError: error });
                return Promise.reject(error);
              }
            }
          } else {
            // 토큰 만료가 아닌 다른 401 에러
            logger.warn('401 에러 (토큰 만료 아님):', { data: error.response?.data });
            onSessionExpired();
          }
        }

        // HTTP 에러 처리
        await ApiErrorProcessor.handleHttpError(error, showToast);

        // 네트워크 에러 처리
        if (!error.response) {
          ApiErrorProcessor.handleNetworkError(error, showToast);
        }

        return Promise.reject(ApiErrorProcessor.transformError(error));
      }
    );
  }

  /**
   * 토큰 만료 여부 확인 (TokenValidator 사용)
   */
  private static async checkIfTokenExpired(error: AxiosError): Promise<boolean> {
    // 🔒 보안 개선: 중앙화된 토큰 검증 사용
    return TokenValidator.isTokenExpiredError(error);
  }

  /**
   * 인증 토큰 처리
   */
  private static async handleAuthentication(
    config: AxiosRequestConfig,
    getAccessToken: () => string | null,
    getSession: () => Promise<AuthSession | null>
  ): Promise<void> {
    const skipAuth = (config as any).skipAuth;
    if (skipAuth) return;

    // 캐시된 토큰 우선 사용
    let token = getAccessToken();
    
    // 토큰이 없으면 세션에서 가져오기
    if (!token) {
      const session = await getSession();
      token = session?.accessToken || null;
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // 🔒 보안: 토큰 값 로깅 제거
      logger.debug(`Auth token added for: ${config.url}`, {
        hasToken: true
        // tokenPreview: '[REDACTED]' // 토큰 정보 완전 제거
      });
    } else {
      logger.debug(`No auth token available for: ${config.url}`);
    }
  }
}