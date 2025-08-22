/**
 * 핵심 API 클라이언트
 * 모든 API 호출의 기반이 되는 클라이언트
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRequestOptions, ServerConfig } from '../types';
import { Interceptors } from '../core/Interceptors';
import { getCachedSession } from '../utils/globalSession';

/**
 * API 클라이언트 설정 옵션
 */
export interface ApiClientOptions {
  serverConfig: ServerConfig;
  accessToken?: string;
}

export class ApiClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly serverConfig: ServerConfig;
  private sessionCache: any = null;
  private sessionCacheTime = 0;
  private readonly SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5분
  private accessToken: string | null = null;

  constructor(options: ApiClientOptions | ServerConfig, accessToken?: string) {
    // 하위 호환성을 위한 처리
    if ('serverConfig' in options) {
      this.serverConfig = options.serverConfig;
      this.accessToken = options.accessToken || null;
    } else {
      this.serverConfig = options;
      this.accessToken = accessToken || null;
    }
    
    // Axios 인스턴스 생성
    this.axiosInstance = this.createAxiosInstance();

    // 인터셉터 설정
    this.setupInterceptors();
    
    // 초기 세션 로드 (비동기)
    this.initializeSession();
  }

  /**
   * Axios 인스턴스 생성
   */
  private createAxiosInstance(): AxiosInstance {
    // baseURL이 비어있거나 유효하지 않은 경우 기본값 사용
    let baseURL = this.serverConfig.baseURL;
    
    // 빈 문자열이거나 'undefined' 문자열인 경우도 처리
    if (!baseURL || baseURL === '' || baseURL === 'undefined') {
      // 서버 ID에 따라 적절한 기본값 사용
      switch (this.serverConfig.id) {
        case 'main':
          baseURL = 'https://api2.suzag.com';
          break;
        case 'app':
          baseURL = 'https://math2.suzag.com';
          break;
        case 'cms':
          baseURL = 'https://cms1.suzag.com';
          break;
        case 'vector':
          baseURL = 'https://vector.suzag.com';
          break;
        default:
          baseURL = 'https://api2.suzag.com';
      }
    }
    
    return axios.create({
      baseURL,
      timeout: this.serverConfig.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...this.serverConfig.headers,
      },
      withCredentials: true,
    });
  }

  /**
   * 초기 세션 로드
   */
  private async initializeSession(): Promise<void> {
    try {
      const session = await this.getSession();
      if (session?.accessToken) {
        this.accessToken = session.accessToken;
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Session initialized with token');
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Failed to initialize session:', error);
      }
    }
  }

  /**
   * 인터셉터 설정
   */
  private setupInterceptors(): void {
    Interceptors.setupRequestInterceptor({
      axiosInstance: this.axiosInstance,
      serverConfig: this.serverConfig,
      getAccessToken: () => this.accessToken,
      getSession: () => this.getSession(),
      onSessionExpired: () => this.clearSessionCache(),
    });

    Interceptors.setupResponseInterceptor({
      axiosInstance: this.axiosInstance,
      serverConfig: this.serverConfig,
      getAccessToken: () => this.accessToken,
      getSession: () => this.getSession(),
      onSessionExpired: () => this.clearSessionCache(),
    });
  }

  /**
   * 세션 가져오기 (전역 캐시 사용)
   */
  private async getSession(): Promise<any> {
    // 전역 캐시 사용
    return await getCachedSession();
  }


  /**
   * API 요청 실행
   * @param url - 요청 URL
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   * @throws {ApiError} API 에러 발생 시
   */
  async request<T = any>(url: string, options: ApiRequestOptions = {}): Promise<T> {
    const config: AxiosRequestConfig = {
      url,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
      headers: {
        ...options.headers,
      },
      timeout: options.timeout,
    };
    
    // 내부 플래그는 axios config의 다른 속성으로 전달
    (config as any).showToast = options.showToast !== false;
    (config as any).skipAuth = options.skipAuth === true;

    if (process.env.NODE_ENV === 'development') {
      console.log('📡 API Request:', {
        url: config.url,
        method: config.method,
        baseURL: this.serverConfig.baseURL,
      });
    }

    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * GET 요청
   * @param url - 요청 URL
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST 요청
   * @param url - 요청 URL
   * @param data - 요청 바디 데이터
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', data });
  }

  /**
   * PUT 요청
   * @param url - 요청 URL
   * @param data - 요청 바디 데이터
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', data });
  }

  /**
   * DELETE 요청
   * @param url - 요청 URL
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH 요청
   * @param url - 요청 URL
   * @param data - 요청 바디 데이터
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async patch<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'data'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PATCH', data });
  }

  /**
   * 세션 캐시 초기화
   */
  clearSessionCache(): void {
    this.sessionCache = null;
    this.sessionCacheTime = 0;
    this.accessToken = null;
  }

  /**
   * 액세스 토큰 업데이트
   * @param token - 새로운 액세스 토큰
   */
  setAccessToken(token: string | null): void {
    this.accessToken = token;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Access token', token ? 'updated' : 'cleared');
    }
  }

  /**
   * 현재 액세스 토큰 가져오기
   * @returns 현재 액세스 토큰
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * 서버 설정 가져오기
   * @returns 서버 설정
   */
  getServerConfig(): ServerConfig {
    return this.serverConfig;
  }

  /**
   * Axios 인스턴스 가져오기 (하위 호환성)
   * @returns Axios 인스턴스
   * @deprecated 직접 Axios 인스턴스를 사용하지 말고 API 클라이언트 메서드를 사용하세요
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}