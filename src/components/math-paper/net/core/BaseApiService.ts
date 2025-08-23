/**
 * 기본 API 서비스
 * 모든 API 서비스의 기반 클래스
 */

import { ApiClient } from './ApiClient';
import { ApiRequestOptions, IApiService, PaginatedResponse, SimpleResponse } from '../types';
import { API_REGISTRY, ApiRegistry, ApiServer } from '../registry/ApiRegistry';

/**
 * API 서비스 기본 클래스
 * 모든 도메인별 API 서비스는 이 클래스를 상속받아 구현합니다.
 */
export abstract class BaseApiService<TServer extends ApiServer = ApiServer> implements IApiService {
  protected readonly apiClient: ApiClient;
  protected readonly urls: ApiRegistry[TServer];

  constructor(apiClient: ApiClient, server: TServer) {
    this.apiClient = apiClient;
    this.urls = API_REGISTRY[server];
  }

  /**
   * GET 요청
   * @param url - 요청 URL
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async get<T = any>(url: string | null, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    if(!url) {
      return null as unknown as T;
    }
    return this.apiClient.get<T>(url, options);
  }

  /**
   * POST 요청
   * @param url - 요청 URL
   * @param data - 요청 바디 데이터
   * @param options - 요청 옵션
   * @returns API 응답 데이터
   */
  async post<T = any>(
    url: string | null, 
    data?: any, 
    options?: Omit<ApiRequestOptions, 'method' | 'data'>
  ): Promise<T> {
    if(!url) {
      return null as unknown as T;
    }
    return this.apiClient.post<T>(url, data, options);
  }

  /**
   * PUT 요청
   */
  async put<T = any>(
    url: string, 
    data?: any, 
    options?: Omit<ApiRequestOptions, 'method' | 'data'>
  ): Promise<T> {
    return this.apiClient.put<T>(url, data, options);
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.apiClient.delete<T>(url, options);
  }

  /**
   * PATCH 요청
   */
  async patch<T = any>(
    url: string, 
    data?: any, 
    options?: Omit<ApiRequestOptions, 'method' | 'data'>
  ): Promise<T> {
    return this.apiClient.patch<T>(url, data, options);
  }

  /**
   * 서버 정보 가져오기
   * @returns 서버 설정 정보
   */
  getServerInfo() {
    return this.apiClient.getServerConfig();
  }

  /**
   * API 클라이언트 가져오기 (필요시 사용)
   * @returns API 클라이언트 인스턴스
   */
  protected getApiClient(): ApiClient {
    return this.apiClient;
  }

  // ========== 헬퍼 메서드들 ==========

  /**
   * 페이지네이션 요청 헬퍼
   * @param url - 요청 URL
   * @param params - 페이지네이션 파라미터
   * @returns 페이지네이션 응답
   */
  protected async getPaginated<T>(
    url: string, 
    params: { page?: number; size?: number; [key: string]: any }
  ): Promise<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(url, { params });
  }

  /**
   * 명령 실행 헬퍼 (성공/실패만 반환)
   * @param url - 요청 URL
   * @param data - 요청 데이터
   * @returns 단순 응답
   */
  protected async execute<T = any>(
    url: string, 
    data?: any
  ): Promise<SimpleResponse<T>> {
    return this.post<SimpleResponse<T>>(url, data);
  }

  /**
   * 파일 업로드 헬퍼
   * @param url - 업로드 URL
   * @param formData - 파일 폼 데이터
   * @returns 업로드 결과
   */
  protected async uploadFile<T = any>(
    url: string, 
    formData: FormData
  ): Promise<T> {
    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  /**
   * URL 파라미터 문자열 생성 헬퍼
   * @param params - 파라미터 객체
   * @returns URL 파라미터 문자열
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  }
}