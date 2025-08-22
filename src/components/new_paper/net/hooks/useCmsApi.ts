/**
 * CMS API 전용 Hooks
 * CMS 서버 API를 위한 커스텀 훅 모음
 */

import { useApiSWR, UseApiSWROptions } from './useApiSWR';
import { 
  PaperGroupDataNode, 
  AcademyStaticPaper, 
  AcademyStaticPaperDTO
} from '../../typings';
import { API_REGISTRY } from '../registry/ApiRegistry';

// ===== 학원 시험지 그룹 관련 Hooks =====

/**
 * 시험지 그룹 트리 조회
 */
export function usePaperGroupTree(
  subjectId: number | null, 
  options?: UseApiSWROptions
) {
  return useApiSWR<PaperGroupDataNode[]>(
    'cms',
    subjectId ? API_REGISTRY.cms.academy.paperGroup.tree(subjectId) : null,
    options
  );
}

/**
 * 학원 정적 시험지 조회
 */
export function useAcademyStaticPaper(
  paperId: string | null,
  options?: UseApiSWROptions
) {
  return useApiSWR<AcademyStaticPaper>(
    'cms',
    paperId ? API_REGISTRY.cms.academy.paperGroup.paper(paperId) : null,
    options
  );
}

/**
 * 시험지 그룹별 시험지 목록
 */
export function usePaperGroupPaperList(
  paperGroupId: number | null,
  options?: UseApiSWROptions
) {
  return useApiSWR<AcademyStaticPaperDTO[]>(
    'cms',
    paperGroupId ? API_REGISTRY.cms.academy.paperGroup.paperList(paperGroupId) : null,
    options
  );
}

// ===== 유틸리티 함수 =====

/**
 * 문제 이미지 URL 생성
 */
export function getProblemImageUrl(problemId: string): string {
  return `${process.env.NEXT_PUBLIC_CONTENT_API_URL}${API_REGISTRY.cms.problem.image(problemId)}`;
}

/**
 * 시험지 PDF URL 생성
 */
export function getPaperPdfUrl(paperId: string): string {
  return `${process.env.NEXT_PUBLIC_CONTENT_API_URL}${API_REGISTRY.cms.paper.pdf(paperId)}`;
}