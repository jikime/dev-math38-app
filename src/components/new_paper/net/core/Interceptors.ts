/**
 * Axios 인터셉터 설정
 * 요청과 응답 인터셉터를 관리합니다.
 */

import { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ServerConfig } from '../types';
import { ErrorHandler } from './ErrorHandler';

export interface InterceptorConfig {
  axiosInstance: AxiosInstance;
  serverConfig: ServerConfig;
  getAccessToken: () => string | null;
  getSession: () => Promise<any>;
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
        // 개발 환경에서만 로깅
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 Request interceptor - Before:', {
            url: requestConfig.url,
            baseURL: requestConfig.baseURL,
            prefix: serverConfig.urlPrefix,
          });
        }

        // URL 변환 적용
        if (requestConfig.url && serverConfig.urlTransform) {
          const originalUrl = requestConfig.url;
          requestConfig.url = serverConfig.urlTransform(requestConfig.url);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 URL transformed:', originalUrl, '→', requestConfig.url);
          }
        }

        // 인증 토큰 처리
        await this.handleAuthentication(requestConfig, getAccessToken, getSession);

        return requestConfig;
      },
      (error) => {
        // Request 단계에서 발생한 에러 처리
        if (error.isAxiosError) {
          return Promise.reject(ErrorHandler.transformError(error));
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

        // HTTP 에러 처리
        await ErrorHandler.handleHttpError(error, showToast);

        // 401 에러 시 세션 초기화
        if (error.response?.status === 401) {
          onSessionExpired();
        }

        // 네트워크 에러 처리
        if (!error.response) {
          ErrorHandler.handleNetworkError(error, showToast);
        }

        return Promise.reject(ErrorHandler.transformError(error));
      }
    );
  }

  /**
   * 인증 토큰 처리
   */
  private static async handleAuthentication(
    config: AxiosRequestConfig,
    getAccessToken: () => string | null,
    getSession: () => Promise<any>
  ): Promise<void> {
    const skipAuth = (config as any).skipAuth;
    if (skipAuth) return;

    // 캐시된 토큰 우선 사용
    let token = getAccessToken();
    
    // 토큰이 없으면 세션에서 가져오기
    if (!token) {
      const session = await getSession();
      token = session?.accessToken;
    }

    token = "#38ct-001";

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔐 Auth token added for:', config.url, 'Token:', token.substring(0, 20) + '...');
      }
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ No auth token available for:', config.url);
      console.log('Session status:', await getSession());
    }
  }
}