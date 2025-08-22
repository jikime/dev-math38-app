import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { apiRequest } from '@/lib/api/axios-client';

// 공통 Query Hook
export function useApiQuery<TData = unknown, TError = AxiosError>(
  queryKey: readonly unknown[],
  url: string,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> & {
    params?: Record<string, any>;
    method?: 'GET' | 'POST';
  }
) {
  const { params, method = 'GET', ...queryOptions } = options || {};
  
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = method === 'POST' 
        ? await apiRequest.post<TData>(url, params)
        : await apiRequest.get<TData>(url, { params });
      return response.data;
    },
    ...queryOptions,
  });
}

// 공통 Mutation Hook (POST)
export function useApiMutation<TData = unknown, TVariables = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiRequest.post<TData>(url, variables);
      return response.data;
    },
    ...options,
  });
}

// PUT Mutation Hook
export function useApiPutMutation<TData = unknown, TVariables = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiRequest.put<TData>(url, variables);
      return response.data;
    },
    ...options,
  });
}

// PATCH Mutation Hook
export function useApiPatchMutation<TData = unknown, TVariables = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const response = await apiRequest.patch<TData>(url, variables);
      return response.data;
    },
    ...options,
  });
}

// DELETE Mutation Hook
export function useApiDeleteMutation<TData = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, void>
) {
  return useMutation<TData, TError, void>({
    mutationFn: async () => {
      const response = await apiRequest.delete<TData>(url);
      return response.data;
    },
    ...options,
  });
}

// 페이지네이션을 위한 Query Hook
export function useApiPaginatedQuery<TData = unknown, TError = AxiosError>(
  queryKey: readonly unknown[],
  url: string,
  page: number,
  limit: number,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, TError>({
    queryKey: [...queryKey, page, limit],
    queryFn: async () => {
      const response = await apiRequest.get<TData>(url, {
        params: { page, limit },
      });
      return response.data;
    },
    ...options,
  });
}

// 무한 스크롤을 위한 Query Hook
export { useInfiniteQuery } from '@tanstack/react-query';

// 파일 업로드를 위한 Mutation Hook
export function useFileUploadMutation<TData = unknown, TError = AxiosError>(
  url: string,
  options?: UseMutationOptions<TData, TError, FormData>
) {
  return useMutation<TData, TError, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest.post<TData>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    ...options,
  });
}

// 파일 다운로드를 위한 함수
export async function downloadFile(url: string, filename?: string) {
  try {
    const response = await apiRequest.get(url, {
      responseType: 'blob',
    });

    // Blob URL 생성
    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    // 다운로드 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();

    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('File download failed:', error);
    throw error;
  }
}