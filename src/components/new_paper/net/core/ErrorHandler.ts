/**
 * API 에러 처리 핸들러
 * 통합된 에러 처리 로직을 제공합니다.
 */

import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { ApiError } from '../types';

export class ErrorHandler {
  /**
   * Axios 에러를 ApiError로 변환
   */
  static transformError(error: AxiosError | any): ApiError {
    // Axios 에러가 아닌 경우 처리
    if (!error || !error.isAxiosError) {
      const apiError: ApiError = new Error(error?.message || 'Unknown error occurred') as ApiError;
      apiError.name = 'ApiError';
      
      if (process.env.NODE_ENV === 'development' && error) {
        console.error('🚨 Non-Axios Error:', error);
      }
      
      return apiError;
    }
    
    // 에러 메시지 생성
    let message = error.message;
    if (error.response?.status) {
      message = `Request failed with status code ${error.response.status}`;
    }
    
    const apiError: ApiError = new Error(message) as ApiError;
    apiError.name = 'ApiError';
    apiError.status = error.response?.status;
    apiError.code = error.code;
    apiError.response = {
      data: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    };
    
    // 개발 환경에서 자세한 에러 정보 로깅
    if (process.env.NODE_ENV === 'development') {
      const errorDetails = {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.config?.headers,
        message: error.message,
        code: error.code,
      };
      
      console.error('🚨 API Error Details:', errorDetails);
      console.error('🚨 Full Error Object:', error);
    }
    
    return apiError;
  }

  /**
   * HTTP 상태 코드별 에러 처리
   */
  static async handleHttpError(
    error: AxiosError,
    showToast: boolean = true
  ): Promise<void> {
    if (!error.response) return;

    const status = error.response.status;
    const data = error.response.data as any;

    switch (status) {
      case 401:
        await this.handle401Error();
        break;

      case 403:
        if (showToast) {
          toast.error(this.extractErrorMessage(data, '권한이 없습니다.'));
        }
        break;

      case 404:
        if (showToast) {
          toast.error('요청한 리소스를 찾을 수 없습니다.');
        }
        break;

      case 500:
      case 502:
      case 503:
        if (showToast) {
          // 서버에서 제공하는 에러 메시지가 있으면 사용
          const serverMessage = this.extractErrorMessage(data, null);
          if (serverMessage) {
            toast.error(`서버 오류: ${serverMessage}`);
          } else {
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
        }
        break;

      default:
        if (showToast && data) {
          toast.error(this.extractErrorMessage(data, '요청 처리 중 오류가 발생했습니다.'));
        }
    }
  }

  /**
   * 네트워크 에러 처리
   */
  static handleNetworkError(error: AxiosError, showToast: boolean = true): void {
    if (!showToast) return;

    if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간이 초과되었습니다.');
    } else if (error.message === 'Network Error') {
      toast.error('네트워크 연결을 확인해주세요.');
    }
  }

  /**
   * 401 인증 에러 처리
   */
  private static async handle401Error(): Promise<void> {
    if (typeof window === 'undefined') return;
  }

  /**
   * 에러 메시지 추출
   */
  private static extractErrorMessage(data: any, defaultMessage: string | null): string | null {
    // 다양한 형태의 에러 메시지 추출 시도
    if (typeof data === 'string') {
      return data;
    }
    
    if (data?.error) {
      return data.error;
    }
    
    if (data?.message) {
      if (typeof data.message === 'string') {
        return data.message;
      }
      if (data.message.error) {
        return data.message.error;
      }
    }
    
    if (data?.msg) {
      return data.msg;
    }
    
    if (data?.detail) {
      return data.detail;
    }
    
    return defaultMessage;
  }
}