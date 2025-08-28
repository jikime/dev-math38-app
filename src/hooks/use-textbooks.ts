import { useApiQuery, useApiMutation, useApiPutMutation, useApiDeleteMutation } from '@/hooks/use-api';
import { queryKeys } from '@/lib/api/query-client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import type { Textbook, TextbookCreateInput, TextbookUpdateInput, TextbookChapter } from '@/types/textbook';

export interface WorkBook {
  workBookId: string
  educationCourse: string
  grade: number
  semester: number
  subjectId: number
  subjectName: string
  bookName: string
  state: string
  paperCount: number
  paperList: null
  created: string
  updated: string
}

export interface WorkBookListParams {
  bookName?: string
  grade?: number
  pageNum?: number
  semester?: number
  size?: number
  subjectId?: number
}

export interface WorkBookPaper {
  workBookPaperId: string
  workBookId: string
  orderIndex: number
  problemCounts: number
  title: string
  problems: null
  created: string
  updated: string
}

export interface WorkBookProblem {
  problemId: string
  workBookPaperId: string
  orderIndex: number
  problemNumber: string
  page: number
  skillId: string
  skillName: string
  type: string | null
  multiline: boolean
  answer: string | null
  level: number
  ltype: string
  answerList: string[]
}

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

// WorkBook 목록 조회 (새로운 API)
export function useWorkBooks(params: WorkBookListParams) {
  return useApiQuery<WorkBook[]>(
    ["workBooks", params],
    "/api/m38/workBook/list",
    {
      method: 'POST',
      params: {
        bookName: params.bookName || "",
        grade: params.grade || 0,
        pageNum: params.pageNum || 1,
        semester: params.semester || 0,
        size: params.size || 1000,
        subjectId: params.subjectId || 0
      },
      enabled: params.subjectId !== undefined && params.subjectId > 0, // subjectId가 있을 때만 실행
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
    }
  );
}

// WorkBook의 Paper(단원) 목록 조회
export function useWorkBookPapers(workBookId: string | null) {
  return useApiQuery<WorkBookPaper[]>(
    ["workBookPapers", workBookId],
    `/api/m38/workBook/papers/${workBookId}`,
    {
      method: 'GET',
      enabled: !!workBookId, // workBookId가 있을 때만 실행
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
    }
  );
}

// WorkBook Paper의 Problem(문제) 목록 조회
export function useWorkBookPaperProblems(workBookPaperId: string | null) {
  return useApiQuery<WorkBookProblem[]>(
    ["workBookPaperProblems", workBookPaperId],
    `/api/m38/workBook/paper/problems/${workBookPaperId}`,
    {
      method: 'GET',
      enabled: !!workBookPaperId, // workBookPaperId가 있을 때만 실행
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
    }
  );
}