/**
 * 전역 세션 캐싱 유틸리티
 * window 객체를 활용한 전역 세션 캐시 관리
 */

import { getSession } from 'next-auth/react';

// 타입 정의
declare global {
  interface Window {
    __cachedSession?: any;
    __sessionExpiryTime?: number;
    __NET_INITIALIZED__?: boolean;
  }
}

const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5분

/**
 * 전역 캐시된 세션 가져오기
 * 캐시가 유효하면 캐시된 세션 반환, 아니면 새로 가져와서 캐시
 */
export async function getCachedSession(): Promise<any> {
  // 서버 사이드에서는 캐싱 사용하지 않음
  if (typeof window === 'undefined') {
    return await getSession();
  }
  
  const now = Date.now();
  
  // 캐시가 유효한 경우
  if (window.__cachedSession && window.__sessionExpiryTime && window.__sessionExpiryTime > now) {
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Using cached session');
    }
    return window.__cachedSession;
  }
  
  // 새 세션 가져오기
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Fetching new session');
  }
  
  const session = await getSession();
  
  if (session?.accessToken) {
    // 전역 캐시에 저장
    window.__cachedSession = session;
    window.__sessionExpiryTime = now + SESSION_CACHE_DURATION;
  }
  
  return session;
}

/**
 * 전역 세션 캐시 초기화
 */
export function clearGlobalSessionCache(): void {
  if (typeof window !== 'undefined') {
    window.__cachedSession = null;
    window.__sessionExpiryTime = 0;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🗑️ Global session cache cleared');
    }
  }
}

/**
 * 세션 유효성 확인
 */
export function isSessionCacheValid(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!(
    window.__cachedSession && 
    window.__sessionExpiryTime && 
    window.__sessionExpiryTime > Date.now()
  );
}