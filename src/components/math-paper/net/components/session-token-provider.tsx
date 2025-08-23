'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ApiServiceFactory } from '@/components/math-paper/net/core/ApiServiceFactory';

/**
 * 세션 토큰 제공자 컴포넌트
 * NextAuth 세션과 API 클라이언트의 토큰을 동기화
 */
export function SessionTokenProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  useEffect(() => {
    // 세션 상태가 변경될 때마다 토큰 동기화
    if (status === 'authenticated' && session?.accessToken) {
      ApiServiceFactory.setAccessTokenForAll(session.accessToken);
      console.log('🔐 Session token synchronized from provider');
    } else if (status === 'unauthenticated') {
      ApiServiceFactory.setAccessTokenForAll(null);
      console.log('🔐 Session token cleared');
    }
  }, [session, status]);
  
  // 초기 로드 시 세션 동기화는 제거 (이미 위의 useEffect에서 처리됨)
  
  return <>{children}</>;
}