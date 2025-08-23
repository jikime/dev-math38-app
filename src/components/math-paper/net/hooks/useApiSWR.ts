/**
 * 통합 SWR Hook
 * 모든 API 서버에 대한 SWR 호출을 통합 관리
 */

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import { useSession } from 'next-auth/react';
import { ApiServiceFactory } from '../core/ApiServiceFactory';
import { ApiRequestOptions } from '../types';

// SWR Key 타입
export type SWRKey = {
  server: string;
  url: string;
  method?: string;
  params?: any;
  data?: any;
} | null;

// Fetcher 함수 (타임아웃 지원 추가)
async function apiFetcher<T = any>(key: SWRKey & { timeout?: number }): Promise<T> {
  if (!key) throw new Error('Invalid SWR key');

  const { server, url, method = 'GET', params, data, timeout } = key;
  
  // 서버별 API 서비스 가져오기
  const apiService = ApiServiceFactory.createDefaultService(server);
  
  // API 호출 옵션 (타임아웃 포함)
  const options: ApiRequestOptions = {
    method: method as any,
    params,
    data,
    timeout: timeout || 60000, // 기본 60초 타임아웃
  };

  switch (method.toUpperCase()) {
    case 'GET':
      return apiService.get<T>(url, options);
    case 'POST':
      return apiService.post<T>(url, data, options);
    case 'PUT':
      return apiService.put<T>(url, data, options);
    case 'DELETE':
      return apiService.delete<T>(url, options);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}

// Hook 옵션 타입
export interface UseApiSWROptions extends SWRConfiguration {
  // 추가 옵션들
  skip?: boolean; // 조건부 실행
  params?: any;   // URL 파라미터
  data?: any;     // POST 데이터
}

/**
 * 통합 API SWR Hook
 */
export function useApiSWR<T = any>(
  server: string,
  url: string | null,
  options?: UseApiSWROptions
): SWRResponse<T> {
  const { data: session, status } = useSession();
  const { skip = false, params, data, ...swrOptions } = options || {};


  // Key 생성 - 세션이 로딩 중이 아니고, url이 있을 때
  const key: SWRKey = !skip && url && status !== 'loading' ? {
    server,
    url,
    method: 'GET',
    params,
    data,
  } : null;

  return useSWR<T>(key, apiFetcher, {
    ...swrOptions,
    revalidateOnFocus: swrOptions.revalidateOnFocus ?? false,
    revalidateOnReconnect: swrOptions.revalidateOnReconnect ?? true,
  });
}

/**
 * POST 메서드용 SWR Hook
 */
export function useApiSWRPost<T = any>(
  server: string,
  url: string | null,
  data?: any,
  options?: UseApiSWROptions
): SWRResponse<T> {
  const { data: session, status } = useSession();
  const { skip = false, ...swrOptions } = options || {};

  // Key 생성 - 세션이 로딩 중이 아니고, url이 있을 때
  const key: SWRKey = !skip && url && status !== 'loading' ? {
    server,
    url,
    method: 'POST',
    data,
  } : null;

  return useSWR<T>(key, apiFetcher, {
    ...swrOptions,
    revalidateOnFocus: swrOptions.revalidateOnFocus ?? false,
    revalidateOnReconnect: swrOptions.revalidateOnReconnect ?? true,
  });
}

/**
 * Mutation을 위한 헬퍼 함수
 */
export function useApiMutation<T = any>(
  server: string,
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  const apiService = ApiServiceFactory.createDefaultService(server);

  const mutate = async (data?: any, options?: ApiRequestOptions) => {
    switch (method) {
      case 'POST':
        return apiService.post<T>(url, data, options);
      case 'PUT':
        return apiService.put<T>(url, data, options);
      case 'DELETE':
        return apiService.delete<T>(url, options);
    }
  };

  return { mutate };
}