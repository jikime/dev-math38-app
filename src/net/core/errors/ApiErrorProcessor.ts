/**
 * API 에러 처리 프로세서
 * Axios 에러를 처리하고 사용자에게 표시합니다.
 */

import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { 
  ApiError,
  NetworkError,
  TimeoutError,
  createErrorFromStatus 
} from '@/net/core/errors/ApiErrorTypes';
import { createModuleLogger } from '@/net/core/utils/Logger';

const logger = createModuleLogger('ApiErrorProcessor');

export class ApiErrorProcessor {
  /**
   * Axios 에러를 ApiError로 변환
   */
  static transformError(error: AxiosError | any): ApiError {
    // Axios 에러가 아닌 경우 처리
    if (!error || !error.isAxiosError) {
      const apiError = new ApiError(
        error?.message || 'Unknown error occurred',
        undefined,
        'UNKNOWN_ERROR',
        error
      );
      
      logger.error('Non-Axios Error', { error });
      
      return apiError;
    }
    
    // 네트워크 에러 처리
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return new TimeoutError();
      }
      if (error.message === 'Network Error') {
        return new NetworkError();
      }
      return new NetworkError(error.message);
    }
    
    // HTTP 상태 코드별 에러 생성
    const status = error.response.status;
    const responseData = error.response.data as any;
    const errorMessage = this.extractErrorMessage(responseData, null) || error.message;
    
    const apiError = createErrorFromStatus(status, errorMessage, {
      url: error.config?.url,
      method: error.config?.method,
      responseData,
    });
    
    // 에러 상세 정보 로깅
    logger.error('API Error Details', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code,
    });
    
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
      toast.error('요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.message === 'Network Error') {
      toast.error('서버에 연결할 수 없습니다. 네트워크 연결 또는 서버 상태를 확인해주세요.');
    } else {
      toast.error(`네트워크 오류: ${error.message || '알 수 없는 오류가 발생했습니다.'}`);
    }
  }

  /**
   * 401 인증 에러 처리
   */
  private static async handle401Error(): Promise<void> {
    if (typeof window === 'undefined') return;

    // 자동 리디렉션 대신 toast 메시지만 표시
    toast.error('로그인이 필요합니다. 로그인 페이지에서 다시 로그인해주세요.', {
      duration: 5000,
      action: {
        label: '로그인',
        onClick: () => {
          const currentPath = window.location.pathname;
          signIn("oauth2", { callbackUrl: currentPath });
        }
      }
    });
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