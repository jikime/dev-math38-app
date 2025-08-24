import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// 에러 메시지 추출 함수
function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // 서버에서 전달한 에러 메시지가 있으면 사용
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // HTTP 상태 코드별 기본 메시지
    switch (error.response?.status) {
      case 400:
        return '잘못된 요청입니다.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다.';
      default:
        return error.message || '알 수 없는 오류가 발생했습니다.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
}

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 재시도 설정
      retry: (failureCount, error) => {
        // 4xx 에러는 재시도하지 않음
        if (error instanceof AxiosError && error.response?.status && error.response.status < 500) {
          return false;
        }
        // 최대 3번까지 재시도
        return failureCount < 3;
      },
      // 재시도 지연 시간 (지수 백오프)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // 캐시 시간 (5분)
      gcTime: 5 * 60 * 1000,
      // stale 시간 (1분)
      staleTime: 1 * 60 * 1000,
      // 포커스 시 재검증 비활성화 (필요 시 활성화)
      refetchOnWindowFocus: false,
      // 재연결 시 재검증
      refetchOnReconnect: 'always',
    },
    mutations: {
      // mutation 에러 핸들링
      onError: (error) => {
        const message = extractErrorMessage(error);
        // 전역 에러 처리 (토스트 메시지 등)
        console.error('Mutation Error:', message);
        // TODO: 토스트 라이브러리 연동 시 아래 주석 해제
        // toast.error(message);
      },
      // 재시도 설정
      retry: false, // mutation은 기본적으로 재시도하지 않음
    },
  },
});

// 쿼리 키 팩토리 패턴
export const queryKeys = {
  all: ['api'] as const,
  
  // 학생 관련
  students: () => [...queryKeys.all, 'students'] as const,
  student: (id: string) => [...queryKeys.students(), id] as const,
  
  // 문제 관련
  problems: () => [...queryKeys.all, 'problems'] as const,
  problem: (id: string) => [...queryKeys.problems(), id] as const,
  problemsByTextbook: (textbookId: string) => [...queryKeys.problems(), 'textbook', textbookId] as const,
  
  // 교재 관련
  textbooks: () => [...queryKeys.all, 'textbooks'] as const,
  textbook: (id: string) => [...queryKeys.textbooks(), id] as const,
  
  // 시험 관련
  exams: () => [...queryKeys.all, 'exams'] as const,
  exam: (id: string) => [...queryKeys.exams(), id] as const,
  examResults: (examId: string) => [...queryKeys.exam(examId), 'results'] as const,
  
  // 성적표 관련
  reportCards: () => [...queryKeys.all, 'report-cards'] as const,
  reportCard: (id: string) => [...queryKeys.reportCards(), id] as const,
  
  // 처방 관련
  prescriptions: () => [...queryKeys.all, 'prescriptions'] as const,
  prescription: (id: string) => [...queryKeys.prescriptions(), id] as const,
  
  // 학원 통계
  academyStats: () => [...queryKeys.all, 'academy-stats'] as const,
  dashboardMetrics: () => [...queryKeys.all, 'dashboard-metrics'] as const,
  
  // 과목 관련
  subjects: () => [...queryKeys.all, 'subjects'] as const,
} as const;