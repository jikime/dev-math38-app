/**
 * API Hook Factory
 * API Registry를 기반으로 타입 안전한 SWR Hook을 생성합니다.
 */

import { useApiSWR, useApiSWRPost, UseApiSWROptions } from '@/components/math-paper/net/hooks/useApiSWR';
import { SWRResponse } from 'swr';
import { ApiServer } from '@/components/math-paper/net/registry/ApiRegistry';

// Hook 생성기 타입
export type HookCreator<TArgs extends any[], TData> = (
  ...args: [...TArgs, UseApiSWROptions?]
) => SWRResponse<TData>;

// POST Hook 생성기 타입
export type PostHookCreator<TArgs extends any[], TBody, TData> = (
  body: TBody | null,
  ...args: [...TArgs, UseApiSWROptions?]
) => SWRResponse<TData>;

/**
 * GET 요청용 Hook 생성기
 * @param server - API 서버 (main, app, cms, vector)
 * @param urlBuilder - URL 생성 함수 또는 문자열
 */
export function createGetHook<TArgs extends any[], TData>(
  server: ApiServer,
  urlBuilder: string | ((...args: TArgs) => string | null) | null
): HookCreator<TArgs, TData> {
  return (...args) => {
    // 마지막 인자가 options인지 확인
    const hasOptions = args.length > 0 && 
      typeof args[args.length - 1] === 'object' &&
      !Array.isArray(args[args.length - 1]) &&
      args[args.length - 1] !== null;
    
    const options = hasOptions ? args[args.length - 1] as UseApiSWROptions : undefined;
    const urlArgs = (hasOptions ? args.slice(0, -1) : args) as unknown as TArgs;
    
    // URL 생성
    let url: string | null = null;
    
    if (urlBuilder === null) {
      // urlBuilder가 null이면 아무것도 하지 않음
      url = null;
    } else if (typeof urlBuilder === 'string') {
      // 정적 URL
      url = urlBuilder;
    } else {
      // 동적 URL - 모든 인자가 null이 아닌 경우에만 생성
      const shouldFetch = urlArgs.every(arg => arg != null);
      if (shouldFetch) {
        url = urlBuilder(...urlArgs);
      }
    }
    
    return useApiSWR<TData>(server, url, options);
  };
}

/**
 * POST 요청용 Hook 생성기
 * @param server - API 서버 (main, app, cms, vector)
 * @param urlBuilder - URL 생성 함수 또는 문자열
 */
export function createPostHook<TArgs extends any[], TBody, TData>(
  server: ApiServer,
  urlBuilder: string | ((...args: TArgs) => string)
): PostHookCreator<TArgs, TBody, TData> {
  return (body, ...args) => {
    // 마지막 인자가 options인지 확인
    const hasOptions = args.length > 0 && 
      typeof args[args.length - 1] === 'object' &&
      !Array.isArray(args[args.length - 1]) &&
      args[args.length - 1] !== null;
    
    const options = hasOptions ? args[args.length - 1] as UseApiSWROptions : undefined;
    const urlArgs = (hasOptions ? args.slice(0, -1) : args) as unknown as TArgs;
    
    // URL 생성
    let url: string | null = null;
    
    if (typeof urlBuilder === 'string') {
      // 정적 URL
      url = body != null ? urlBuilder : null;
    } else {
      // 동적 URL - body와 모든 인자가 null이 아닌 경우에만 생성
      const shouldFetch = body != null && urlArgs.every(arg => arg != null);
      if (shouldFetch) {
        url = urlBuilder(...urlArgs);
      }
    }
    
    return useApiSWRPost<TData>(server, url, body, options);
  };
}

/**
 * 조건부 Hook 생성기 (복잡한 조건을 가진 경우)
 */
export function createConditionalHook<TArgs extends any[], TData>(
  server: ApiServer,
  urlBuilder: (...args: TArgs) => string | null
): HookCreator<TArgs, TData> {
  return (...args) => {
    const hasOptions = args.length > 0 && 
      typeof args[args.length - 1] === 'object' &&
      !Array.isArray(args[args.length - 1]) &&
      args[args.length - 1] !== null;
    
    const options = hasOptions ? args[args.length - 1] as UseApiSWROptions : undefined;
    const urlArgs = (hasOptions ? args.slice(0, -1) : args) as unknown as TArgs;
    
    const url = urlBuilder(...urlArgs);
    
    return useApiSWR<TData>(server, url, options);
  };
}

/**
 * Hook 생성 헬퍼 함수들
 */
export const HookHelpers = {
  /**
   * 선택적 파라미터를 가진 URL 생성
   */
  withOptionalParams<T extends Record<string, any>>(
    baseUrl: string,
    params?: T
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  },
  
  /**
   * 조건부 URL 생성
   */
  conditionalUrl(
    condition: boolean,
    urlIfTrue: string,
    urlIfFalse: string | null = null
  ): string | null {
    return condition ? urlIfTrue : urlIfFalse;
  },
};

// 타입 유틸리티
export type ExtractHookData<T> = T extends HookCreator<any, infer D> ? D : never;
export type ExtractHookArgs<T> = T extends HookCreator<infer A, any> ? A : never;