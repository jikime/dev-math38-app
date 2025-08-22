import { useApiQuery, useApiMutation, useApiPutMutation, useApiDeleteMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import type { Textbook, TextbookCreateInput, TextbookUpdateInput, TextbookChapter } from '@/types/textbook';

// 교재 목록 조회
export function useTextbookList() {
  return useApiQuery<Textbook[]>(
    queryKeys.textbooks(),
    API_ENDPOINTS.TEXTBOOKS.LIST
  );
}

// 교재 상세 조회
export function useTextbook(id: string) {
  return useApiQuery<Textbook>(
    queryKeys.textbook(id),
    API_ENDPOINTS.TEXTBOOKS.DETAIL(id),
    {
      enabled: !!id,
    }
  );
}

// 교재 챕터 조회
export function useTextbookChapters(id: string) {
  return useApiQuery<TextbookChapter[]>(
    [...queryKeys.textbook(id), 'chapters'],
    API_ENDPOINTS.TEXTBOOKS.CHAPTERS(id),
    {
      enabled: !!id,
    }
  );
}

// 교재 생성
export function useCreateTextbook() {
  const queryClient = useQueryClient();

  return useApiMutation<Textbook, TextbookCreateInput>(
    API_ENDPOINTS.TEXTBOOKS.CREATE,
    {
      onSuccess: () => {
        // 교재 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.textbooks() });
      },
    }
  );
}

// 교재 수정
export function useUpdateTextbook(id: string) {
  const queryClient = useQueryClient();

  return useApiPutMutation<Textbook, TextbookUpdateInput>(
    API_ENDPOINTS.TEXTBOOKS.UPDATE(id),
    {
      onSuccess: (data) => {
        // 특정 교재 캐시 업데이트
        queryClient.setQueryData(queryKeys.textbook(id), data);
        // 교재 목록 캐시 무효화
        queryClient.invalidateQueries({ queryKey: queryKeys.textbooks() });
      },
    }
  );
}

// 교재 삭제
export function useDeleteTextbook(id: string) {
  const queryClient = useQueryClient();

  return useApiDeleteMutation(
    API_ENDPOINTS.TEXTBOOKS.DELETE(id),
    {
      onSuccess: () => {
        // 교재 관련 모든 캐시 무효화
        queryClient.removeQueries({ queryKey: queryKeys.textbook(id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.textbooks() });
        // 해당 교재의 문제들도 캐시 무효화
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.problemsByTextbook(id) 
        });
      },
    }
  );
}