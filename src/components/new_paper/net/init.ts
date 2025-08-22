/**
 * 네트워킹 시스템 초기화
 * 앱 시작 시 한 번만 실행되어야 함
 */

import { serverRegistry } from './registry/ServerRegistry';
import { serversConfig } from './registry/servers.config';

/**
 * 서버 레지스트리 초기화 (서버/클라이언트 공통)
 */
export function initializeServerRegistry() {
  // 이미 초기화된 경우 스킵
  if (serverRegistry.getAllServers().length > 0) {
    return;
  }

  // 모든 서버 등록
  serversConfig.forEach(config => {
    serverRegistry.register(config);
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('📡 서버 레지스트리 초기화 완료:', 
      serverRegistry.getAllServers().map(s => s.id)
    );
  }
}

/**
 * 네트워킹 시스템 초기화
 * window 객체를 활용하여 전역 상태 관리
 */
export function initializeNetworking() {
  // 서버 레지스트리 초기화
  initializeServerRegistry();

  // 클라이언트 사이드에서만 추가 초기화
  if (typeof window === 'undefined') {
    return;
  }

  // 이미 초기화된 경우 스킵
  if (window.__NET_INITIALIZED__) {
    return;
  }

  // 모든 서버 등록
  serversConfig.forEach(config => {
    serverRegistry.register(config);
  });

  // 전역 플래그 설정
  window.__NET_INITIALIZED__ = true;
  
  // 개발 환경에서만 한 번 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 네트워킹 시스템 초기화 완료:', 
      serverRegistry.getAllServers().map(s => s.id)
    );
  }
}