'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { sessionManager } from '@/net/core/session/SessionManager';

/**
 * 세션 토큰 제공자 컴포넌트
 * NextAuth 세션과 API 클라이언트의 토큰을 동기화
 * SessionManager를 통해 중앙집중식 세션 관리
 */
export function SessionTokenProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const lastSessionRef = useRef<string | null>(null);
  
  useEffect(() => {
    // 세션 변경 감지 (무한 루프 방지)
    const currentSessionKey = session ? 
      `${session.accessToken}-${session.user?.id}-${status}` : 
      `null-${status}`;
    
    // 세션이 실제로 변경된 경우에만 동기화
    if (lastSessionRef.current !== currentSessionKey) {
      lastSessionRef.current = currentSessionKey;
      
      if (status === 'authenticated' && session) {
        // SessionManager가 캐싱, API 동기화, 리스너 알림을 모두 처리
        sessionManager.setSession(session as any);
        console.log('🔐 Session synchronized via SessionManager');
      } else if (status === 'unauthenticated') {
        // 세션 무효화
        sessionManager.invalidate();
        console.log('🔐 Session cleared via SessionManager');
      }
    }
  }, [session, status]);
  
  return <>{children}</>;
}