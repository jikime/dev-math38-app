/**
 * Main API Hooks
 * API Registry 기반으로 자동 생성된 Main 서버 전용 Hooks
 */

import { createGetHook, createPostHook } from '@/net/core/registry/ApiHookFactory';
import { MAIN_API_REGISTRY } from '@/net/services/main/registry/MainApiRegistry';
import type { 
  LectureStatVO,
  UserStudyPaperStatVO,
  SimpleStudentVO,
  LectureVO,
  TeacherVO,
  ResponseProps,
  M38WorkBook,
  M38WorkBookPaper,
  M38WorkBookProblem,
  M38UserStudyPaperVO,
  M38LectureStudyStatVO,
  M38LectureStudyStatFilter,
  GeneratedPaper,
  SaveLectureVO,
  SpPaperVO,
  LecturePaperRO,
  PaperProblemInfoRO,
  ProvidedPaper,
  SkillCounts,
  ErrorReport,
  PageResponse,
} from '@/types/typings';

// ===== 통계 관련 Hooks =====

/**
 * 강좌 통계 조회
 * @param lectureId - 강좌 ID
 */
export const useLectureStat = createGetHook<[string | null], LectureStatVO>(
  'main',
  MAIN_API_REGISTRY.statistics.lectureStat
);

/**
 * 사용자 시험지 통계 조회
 * @param paperId - 시험지 ID
 */
export const useUserPaperStat = createGetHook<[string], UserStudyPaperStatVO>(
  'main',
  MAIN_API_REGISTRY.statistics.userStat
);

/**
 * 학습 통계 조회
 */
export const useStudyStat1 = createPostHook<[], M38LectureStudyStatFilter, ResponseProps<M38LectureStudyStatVO>>(
  'main',
  MAIN_API_REGISTRY.statistics.studyStat1
);

/**
 * 시험지 문제 통계 정보 조회
 */
export const usePaperProblemInfo = createPostHook<[], any, PaperProblemInfoRO>(
  'main',
  MAIN_API_REGISTRY.statistics.paper.problem.info
);

// ===== 강좌 관련 Hooks =====

/**
 * 내 강좌 목록 조회
 */
export const useMyLectures = createGetHook<[], LectureVO[]>(
  'main',
  MAIN_API_REGISTRY.lecture.myLectures
);

/**
 * 강좌 학생 목록 조회
 * @param lectureId - 강좌 ID
 */
export const useLectureStudents = createGetHook<[string | null], SimpleStudentVO[]>(
  'main',
  MAIN_API_REGISTRY.lecture.students
);

/**
 * 학생 통계 조회
 * @param studentId - 학생 ID
 */
export const useLectureStats = createGetHook<[string], any>(
  'main',
  MAIN_API_REGISTRY.lecture.stats
);

/**
 * 휴지통 시험지 목록 조회
 */
export const useLecturePaperTrash = createGetHook<[], any[]>(
  'main',
  MAIN_API_REGISTRY.lecture.paper.trash
);

// ===== 선생님 관련 Hooks =====

/**
 * 선생님 목록 조회
 */
export const useTeacherList = createPostHook<[], any, ResponseProps<TeacherVO>>(
  'main',
  MAIN_API_REGISTRY.teacher.list
);

/**
 * 선생님 프로필 이미지 URL 생성
 * @param timestamp - 타임스탬프 (캐시 무효화용)
 */
export const useTeacherImage = createGetHook<[number?], any>(
  'main',
  (timestamp?: number) => MAIN_API_REGISTRY.teacher.myImage(timestamp)
);

/**
 * 사용자 계정 정보 조회
 */
export const useProfileAccount = createGetHook<[], any>(
  'main',
  MAIN_API_REGISTRY.teacher.profile.account
);

/**
 * 카카오 SNS 연동 정보 조회
 */
export const useProfileSnsKakao = createGetHook<[], any>(
  'main',
  MAIN_API_REGISTRY.teacher.profile.snsKakao
);

// ===== 학습 관련 Hooks =====

/**
 * 스킬별 정답률 조회
 */
export const useSkillSolveCounts = createPostHook<[], any, any>(
  'main',
  MAIN_API_REGISTRY.study.lecture.solveCounts.skill
);

/**
 * 시험지별 정답률 조회
 */
export const usePaperSolveCounts = createPostHook<[], any, any>(
  'main',
  MAIN_API_REGISTRY.study.lecture.solveCounts.papers
);

/**
 * 학습 시험지 VO 목록 조회
 * @param lecturePaperId - 강좌 시험지 ID
 * @param type - 시험지 타입
 */
export const useStudyPaperVOList = createGetHook<[string | null, string | null], M38UserStudyPaperVO[]>(
  'main',
  MAIN_API_REGISTRY.study.paper.volist
);

// ===== 교재 관련 Hooks =====

/**
 * 교재 목록 조회
 */
export const useWorkBookList = createPostHook<[], any, M38WorkBook[]>(
  'main',
  MAIN_API_REGISTRY.workBook.list
);

/**
 * 교재 시험지 목록 조회
 * @param workBookId - 교재 ID
 */
export const useWorkBookPapers = createGetHook<[string | null], M38WorkBookPaper[]>(
  'main',
  MAIN_API_REGISTRY.workBook.papers
);

/**
 * 교재 시험지 문제 목록 조회
 * @param paperId - 시험지 ID
 */
export const useWorkBookPaperProblems = createGetHook<[string | null], M38WorkBookProblem[]>(
  'main',
  MAIN_API_REGISTRY.workBook.paper.problems
);

// ===== 오류 신고 관련 Hooks =====

/**
 * 사용자 오류 신고 목록 조회
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const useUserErrorReports = createGetHook<[number?, number?], PageResponse<ErrorReport>>(
  'main',
  (page?: number, size?: number) => MAIN_API_REGISTRY.errorReport.userReports(page ?? 0, size ?? 20)
);

// ===== 시험지 관련 Hooks =====


/**
 * 시험지 조회
 * @param paperId - 시험지 ID
 */
export const usePaper = createGetHook<[string], SpPaperVO>(
  'main',
  MAIN_API_REGISTRY.paper.get
);


/**
 * 강좌별 스킬 카운트 조회
 * @param lectureId - 강좌 ID
 */
export const usePaperSkillCounts = createGetHook<[string | null], SkillCounts>(
  'main',
  MAIN_API_REGISTRY.paper.skillCounts
);

// ===== SAVE 강좌 관련 Hooks =====

/**
 * SAVE 강좌 목록 조회
 */
export const useSaveLectureList = createPostHook<[], any, ResponseProps<SaveLectureVO>>(
  'main',
  MAIN_API_REGISTRY.saveLecture.list
);

/**
 * SAVE 강좌 시험지 목록 조회
 * @param saveLectureId - SAVE 강좌 ID
 */
export const useSaveLecturePapers = createGetHook<[string | null], LecturePaperRO[]>(
  'main',
  MAIN_API_REGISTRY.saveLecture.papers
);

// ===== 제공 시험지 관련 Hooks =====

/**
 * 제공 폴더의 시험지 목록 조회
 * @param folderId - 폴더 ID
 */
export const useProvidedFolderPapers = createGetHook<[string | null], ProvidedPaper[]>(
  'main',
  MAIN_API_REGISTRY.provided.folder.papers
);

// ===== 스킬 관련 Hooks =====

/**
 * 스킬별 오답 횟수 조회
 */
// export const useSkillWrongCounts = createPostHook<[], any, any>(
//   'main',
//   MAIN_API_REGISTRY.study.skill.wrongs()
// );