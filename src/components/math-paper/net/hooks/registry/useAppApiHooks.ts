/**
 * App API Hooks
 * API Registry 기반으로 자동 생성된 App 서버 전용 Hooks
 */

import { createGetHook, createPostHook } from '@/components/math-paper/net/registry/ApiHookFactory';
import { API_REGISTRY } from '@/components/math-paper/net/registry/ApiRegistry';
import type { 
  SpSubjectVO,
  GradeChaptersDto,
  SpChapterSkillsVO,
  ProblemSearchResult,
  GeneratedPaper,
  PastExamDTO,
  SpProblem,
} from '@/components/math-paper/typings';

// ===== 과목 관련 Hooks =====

/**
 * 과목 목록 조회
 */
export const useSubjectList = createGetHook<[], SpSubjectVO[]>(
  'app',
  API_REGISTRY.app.subject.list
);

/**
 * 과목별 챕터 트리 조회
 * @param subjectId - 과목 ID
 * @param depth - 트리 깊이 (기본값: 2)
 */
export const useSubjectTop = createGetHook<[number, number?], any>(
  'app',
  (subjectId: number, depth?: number) => API_REGISTRY.app.subject.top(subjectId, depth ?? 2)
);

/**
 * 여러 과목의 챕터 트리 조회
 * @param subjectIds - 과목 ID 배열
 * @param depth - 트리 깊이 (기본값: 2)
 */
export const useSubjectTops = createGetHook<[number[], number?], any>(
  'app',
  (subjectIds: number[], depth?: number) => API_REGISTRY.app.subject.tops(subjectIds, depth ?? 2)
);

/**
 * 도메인별 학년 챕터 조회
 * @param domain - 도메인 (예: 'elementary', 'middle', 'high')
 */
export const useGradeChaptersByDomain = createGetHook<[string], GradeChaptersDto[]>(
  'app',
  API_REGISTRY.app.subject.gradeChapters.byDomain
);

// ===== 문제 선택기 관련 Hooks =====

/**
 * 문제 상세 정보 조회
 * @param problemId - 문제 ID
 */
export const useProblemSelector = createGetHook<[string | null], SpProblem>(
  'app',
  API_REGISTRY.app.problemSelector.get
);

// ===== 챕터 관련 Hooks =====

/**
 * 챕터별 스킬 목록 조회
 */
export const useChapterSkills = createPostHook<[], number[], SpChapterSkillsVO[]>(
  'app',
  API_REGISTRY.app.chapter.skills
);

// ===== 스킬 관련 Hooks =====

/**
 * 스킬별 문제 목록 조회
 */
export const useSkillProblems = createPostHook<[], any, ProblemSearchResult[]>(
  'app',
  API_REGISTRY.app.skill.problems
);

// ===== 시험지 그룹 관련 Hooks =====

/**
 * 과목별 시험지 그룹 목록 조회
 * @param subjectId - 과목 ID
 */
export const usePaperGroupList = createGetHook<[number], any[]>(
  'app',
  API_REGISTRY.app.paperGroup.list
);

// ===== 과거 시험 관련 Hooks =====

/**
 * 과거 시험 조회
 * @param fileId - 파일 ID
 */
export const usePastExam = createGetHook<[string | null], PastExamDTO>(
  'app',
  API_REGISTRY.app.pastExam.get
);

// ===== 시험지 생성 관련 Hooks =====

/**
 * 시험지 생성
 */
export const useGeneratePaper = createPostHook<[], any, GeneratedPaper>(
  'app',
  API_REGISTRY.app.paper.generate
);