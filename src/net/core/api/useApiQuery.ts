/**
 * 통합 React Query Hook
 * 모든 API 서버에 대한 React Query 호출을 통합 관리
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ApiServiceFactory } from '@/net/core/api/ApiServiceFactory';
import { ApiRequestOptions } from '@/net/core/types';

// Query Key 타입
export type QueryKey = {
  server: string;
  url: string;
  method?: string;
  params?: any;
  data?: any;
} | null;

// Fetcher 함수 (타임아웃 지원 추가)
async function apiFetcher<T = any>(key: QueryKey & { timeout?: number }): Promise<T> {
  if (!key) throw new Error('Invalid Query key');

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
export interface UseApiQueryOptions<T = any> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  // 추가 옵션들
  skip?: boolean; // 조건부 실행
  params?: any;   // URL 파라미터
  data?: any;     // POST 데이터
}

/**
 * 통합 API Query Hook
 */
export function useApiQuery<T = any>(
  server: string,
  url: string | null,
  options?: UseApiQueryOptions<T>
): UseQueryResult<T> {
  const { data: session, status } = useSession();
  const { skip = false, params, data, ...queryOptions } = options || {};

  // Key 생성 - 세션이 로딩 중이 아니고, url이 있을 때
  // URL에 session이 필요한 경우 session도 체크
  const needsSession = url && (url.includes('/api/') || url.includes('session'));
  const sessionReady = status !== 'loading' && (!needsSession || session);

  const queryKey: QueryKey = !skip && url && sessionReady ? {
    server,
    url,
    method: 'GET',
    params,
    data,
  } : null;

  return useQuery({
    queryKey: queryKey ? [queryKey] : ['__disabled__'],
    queryFn: queryKey ? () => apiFetcher<T>(queryKey) : () => Promise.resolve(null as T),
    enabled: !!queryKey && !skip,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    ...queryOptions,
  });
}

/**
 * POST 메서드용 Query Hook
 */
export function useApiQueryPost<T = any>(
  server: string,
  url: string | null,
  data?: any,
  options?: UseApiQueryOptions<T>
): UseQueryResult<T> {
  const { data: session, status } = useSession();
  const { skip = false, ...queryOptions } = options || {};

  // Key 생성 - 세션이 로딩 중이 아니고, url이 있을 때
  // URL에 session이 필요한 경우 session도 체크
  const needsSession = url && (url.includes('/api/') || url.includes('session'));
  const sessionReady = status !== 'loading' && (!needsSession || session);

  const queryKey: QueryKey = !skip && url && sessionReady ? {
    server,
    url,
    method: 'POST',
    data,
  } : null;

  return useQuery({
    queryKey: queryKey ? [queryKey] : ['__disabled__'],
    queryFn: queryKey ? () => apiFetcher<T>(queryKey) : () => Promise.resolve(null as T),
    enabled: !!queryKey && !skip,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    ...queryOptions,
  });
}

/**
 * Mutation을 위한 Hook
 */
export function useApiMutation<T = any, TVariables = any>(
  server: string,
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: UseMutationOptions<T, Error, TVariables>
): UseMutationResult<T, Error, TVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const apiService = ApiServiceFactory.createDefaultService(server);

      switch (method) {
        case 'POST':
          return apiService.post<T>(url, variables);
        case 'PUT':
          return apiService.put<T>(url, variables);
        case 'DELETE':
          return apiService.delete<T>(url);
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    onSuccess: () => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({
        queryKey: [{ server, url: url.split('?')[0] }],
        exact: false,
      });
    },
    ...options,
  });
}

/**
 * 특정 서버의 모든 쿼리 무효화
 */
export function useInvalidateServerQueries() {
  const queryClient = useQueryClient();

  return (server: string, urlPattern?: string) => {
    queryClient.invalidateQueries({
      queryKey: [{ server }],
      predicate: (query) => {
        const key = query.queryKey[0] as QueryKey;
        if (!key || key.server !== server) return false;
        if (!urlPattern) return true;
        return key.url.includes(urlPattern);
      },
    });
  };
}

/**
 * 캐시된 데이터 가져오기
 */
export function useGetQueryData<T = any>(server: string, url: string, params?: any) {
  const queryClient = useQueryClient();

  const queryKey: QueryKey = { server, url, method: 'GET', params };
  return queryClient.getQueryData<T>([queryKey]);
}

/**
 * 캐시 데이터 설정
 */
export function useSetQueryData() {
  const queryClient = useQueryClient();

  return <T = any>(server: string, url: string, data: T, params?: any) => {
    const queryKey: QueryKey = { server, url, method: 'GET', params };
    queryClient.setQueryData([queryKey], data);
  };
}