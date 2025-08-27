import { 
  useApiQuery, 
  useApiMutation
} from '@/hooks/use-api';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/query-client';
import { apiRequest } from '@/lib/api/axios-client';

// 제공된 폴더 타입 정의
export interface ProvidedFolder {
  folderId: string;
  subjectId: number | null;
  grade: number;
  academyId: number;
  folderName: string;
  groupId: string;
  folderOrder: number;
  paperCount: number;
  childFolderCount: number;
  paperList: any[] | null;
  created: string;
  updated: string;
}

export interface ProvidedFolderGroup {
  groupId: string;
  academyId: number;
  grade: number;
  groupName: string;
  groupOrder: number | null;
  folderCount: number;
  folders: ProvidedFolder[];
  created: string;
  updated: string;
}

// 자료실 쿼리 키
const materialsKeys = {
  all: [...queryKeys.all, 'materials'] as const,
  saveLectures: () => [...materialsKeys.all, 'save-lectures'] as const,
  saveLectureList: (params?: any) => [...materialsKeys.saveLectures(), 'list', params] as const,
  saveLecturePapers: (saveLectureId: string) => [...materialsKeys.saveLectures(), saveLectureId, 'papers'] as const,
  providedPapers: (folderId: string) => [...materialsKeys.all, 'provided', folderId, 'papers'] as const,
  providedGroups: (grade: number) => [...materialsKeys.all, 'provided-groups', grade] as const,
};

// ===== Save 강좌 관련 =====

// Save 강좌 목록 조회 (페이지네이션 + 검색)
export function useSaveLectureList(params: {
  grade?: number;
  keyword?: string;
  pageNum?: number;
  size?: number;
} | null) {
  console.log('🔍 useSaveLectureList called with params:', params);
  
  return useApiQuery<{ 
    content: any[]; 
    totalElements: number; 
    totalPages: number; 
    first: boolean; 
    last: boolean; 
  }>(
    materialsKeys.saveLectureList(params),
    '/m38api/m38/savelecture/list',
    {
      method: 'POST',
      params: params || {},
      enabled: !!params,
    }
  );
}

// Save 강좌의 시험지 목록 조회
export function useSaveLecturePapers(saveLectureId: string | null) {
  return useApiQuery<any[]>(
    saveLectureId ? materialsKeys.saveLecturePapers(saveLectureId) : ['disabled'],
    saveLectureId ? `/m38api/m38/savelecture/papers/${saveLectureId}` : '',
    {
      enabled: !!saveLectureId,
    }
  );
}

// 제공된 폴더의 시험지 목록 조회
export function useProvidedFolderPapers(folderId: string | null) {
  return useApiQuery<any[]>(
    folderId ? materialsKeys.providedPapers(folderId) : ['disabled'],
    folderId ? `/m38api/m38/provided/folder/${folderId}/papers` : '',
    {
      enabled: !!folderId,
    }
  );
}

// ===== 시험지 추가 관련 (Mutations) =====

// Save 강좌에서 현재 강좌로 시험지 추가
export function useAddPapersFromSaveLecture() {
  const queryClient = useQueryClient();

  return useApiMutation<
    { message?: string },
    { lectureId: string; saveLectureId: string; paperIds: string[] }
  >(
    '', // URL will be set dynamically
    {
      mutationFn: async ({ lectureId, saveLectureId, paperIds }) => {
        const response = await apiRequest.post(
          `/m38api/m38/lecture/${lectureId}/papers/add/${saveLectureId}`,
          paperIds
        );
        return response.data;
      },
      onSuccess: () => {
        // 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: materialsKeys.saveLectures() });
        queryClient.invalidateQueries({ queryKey: [...queryKeys.all, 'repository'] });
      },
    }
  );
}

// 제공된 시험지들을 현재 강좌로 추가
export function useAddProvidedPapers() {
  const queryClient = useQueryClient();

  return useApiMutation<
    { message?: string },
    { lectureId: string; paperIds: string[] }
  >(
    '', // URL will be set dynamically
    {
      mutationFn: async ({ lectureId, paperIds }) => {
        const response = await apiRequest.post(
          `/m38api/m38/lecture/${lectureId}/papers/add/provided`,
          paperIds
        );
        return response.data;
      },
      onSuccess: () => {
        // 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: materialsKeys.all });
        queryClient.invalidateQueries({ queryKey: [...queryKeys.all, 'repository'] });
      },
    }
  );
}

// ===== 제공된 폴더 관련 =====

// 제공된 폴더 그룹 조회 (학년별)
export function useProvidedFolderGroups(grade?: number) {
  // GradeSelect의 7-12를 원래 학년으로 변환
  const realGrade = grade && grade >= 7 ? grade : undefined;
  
  return useApiQuery<ProvidedFolderGroup[]>(
    realGrade ? materialsKeys.providedGroups(realGrade) : ['disabled'],
    realGrade ? `/m38api/m38/provided/group/byGrade/${realGrade}` : '',
    {
      enabled: !!realGrade,
    }
  );
}

// ===== 유틸리티 훅들 =====

// 학년별 강좌 통계
export function useLectureStatsByGrade(grade?: number) {
  return useApiQuery<{
    totalLectures: number;
    totalPapers: number;
    recentLectures: any[];
  }>(
    [...materialsKeys.all, 'stats', grade],
    '/m38api/m38/savelecture/stats', // 추정된 엔드포인트
    {
      params: { grade },
      enabled: !!grade,
    }
  );
}

export { materialsKeys };