/**
 * CMS API Hooks
 * API Registry 기반으로 자동 생성된 CMS 서버 전용 Hooks
 */

import { createGetHook } from '@/components/math-paper/net/registry/ApiHookFactory';
import { API_REGISTRY } from '@/components/math-paper/net/registry/ApiRegistry';
import type { 
  PaperGroupDataNode,
  AcademyStaticPaper,
  AcademyStaticPaperDTO,
} from '@/components/math-paper/typings';

// ===== 학원 시험지 그룹 관련 Hooks =====

/**
 * 시험지 그룹 트리 조회
 * @param subjectId - 과목 ID
 */
export const usePaperGroupTree = createGetHook<[number], PaperGroupDataNode[]>(
  'cms',
  API_REGISTRY.cms.academy.paperGroup.tree
);

/**
 * 학원 정적 시험지 조회
 * @param paperId - 시험지 ID
 */
export const useAcademyStaticPaper = createGetHook<[string], AcademyStaticPaper>(
  'cms',
  API_REGISTRY.cms.academy.paperGroup.paper
);

/**
 * 시험지 그룹별 시험지 목록
 * @param paperGroupId - 시험지 그룹 ID
 */
export const usePaperGroupPaperList = createGetHook<[number], AcademyStaticPaperDTO[]>(
  'cms',
  API_REGISTRY.cms.academy.paperGroup.paperList
);

// ===== 유틸리티 함수 =====

/**
 * 문제 이미지 URL 생성
 * @param problemId - 문제 ID
 */
export function getProblemImageUrl(problemId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CONTENT_API_URL || '';
  return baseUrl + API_REGISTRY.cms.problem.image(problemId);
}

/**
 * 시험지 PDF URL 생성
 * @param paperId - 시험지 ID
 */
export function getPaperPdfUrl(paperId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_CONTENT_API_URL || '';
  return baseUrl + API_REGISTRY.cms.paper.pdf(paperId);
}