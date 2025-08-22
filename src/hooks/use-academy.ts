import { useApiQuery } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { AcademyMetrics, DashboardData, ClassInfo } from '@/types/academy';

// 학원 대시보드 데이터 조회
export function useDashboardData() {
  return useApiQuery<DashboardData>(
    queryKeys.dashboardMetrics(),
    API_ENDPOINTS.ACADEMY.DASHBOARD
  );
}

// 학원 메트릭스 조회
export function useAcademyMetrics() {
  return useApiQuery<AcademyMetrics>(
    queryKeys.academyStats(),
    API_ENDPOINTS.ACADEMY.METRICS,
    {
      // 5분마다 자동 재조회
      refetchInterval: 5 * 60 * 1000,
      // 포커스 시 재조회 활성화
      refetchOnWindowFocus: true,
    }
  );
}

// 학원 통계 조회
export function useAcademyStatistics(period?: 'daily' | 'weekly' | 'monthly' | 'yearly') {
  return useApiQuery<any>(
    [...queryKeys.academyStats(), 'statistics', period],
    API_ENDPOINTS.ACADEMY.STATISTICS,
    {
      // 통계는 상대적으로 자주 변하지 않으므로 캐시 시간을 길게 설정
      staleTime: 10 * 60 * 1000, // 10분
    }
  );
}

// 반 목록 조회
export function useClassList() {
  return useApiQuery<ClassInfo[]>(
    [...queryKeys.all, 'classes'],
    API_ENDPOINTS.ACADEMY.CLASSES
  );
}

// 반 상세 조회
export function useClassDetail(id: string) {
  return useApiQuery<ClassInfo>(
    [...queryKeys.all, 'classes', id],
    API_ENDPOINTS.ACADEMY.CLASS_DETAIL(id),
    {
      enabled: !!id,
    }
  );
}