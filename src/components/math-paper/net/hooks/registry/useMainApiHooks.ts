/**
 * Main API Hooks
 * API Registry 기반으로 자동 생성된 Main 서버 전용 Hooks
 */

import { createGetHook, createPostHook } from '@/components/math-paper/net/registry/ApiHookFactory';
import { API_REGISTRY } from '@/components/math-paper/net/registry/ApiRegistry';
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
} from '@/components/math-paper/typings';

// ===== 통계 관련 Hooks =====

/**
 * 강좌 통계 조회
 * @param lectureId - 강좌 ID
 */
export const useLectureStat = createGetHook<[string | null], LectureStatVO>(
  'main',
  API_REGISTRY.main.statistics.lectureStat
);

/**
 * 사용자 시험지 통계 조회
 * @param paperId - 시험지 ID
 */
export const useUserPaperStat = createGetHook<[string], UserStudyPaperStatVO>(
  'main',
  API_REGISTRY.main.statistics.userStat
);

/**
 * 학습 통계 조회
 */
export const useStudyStat1 = createPostHook<[], M38LectureStudyStatFilter, ResponseProps<M38LectureStudyStatVO>>(
  'main',
  API_REGISTRY.main.statistics.studyStat1
);

/**
 * 시험지 문제 통계 정보 조회
 */
export const usePaperProblemInfo = createPostHook<[], any, PaperProblemInfoRO>(
  'main',
  API_REGISTRY.main.statistics.paper.problem.info
);

// ===== 강좌 관련 Hooks =====

/**
 * 내 강좌 목록 조회
 */
export const useMyLectures = createGetHook<[], LectureVO[]>(
  'main',
  API_REGISTRY.main.lecture.myLectures
);

/**
 * 강좌 학생 목록 조회
 * @param lectureId - 강좌 ID
 */
export const useLectureStudents = createGetHook<[string | null], SimpleStudentVO[]>(
  'main',
  API_REGISTRY.main.lecture.students
);

/**
 * 학생 통계 조회
 * @param studentId - 학생 ID
 */
export const useLectureStats = createGetHook<[string], any>(
  'main',
  API_REGISTRY.main.lecture.stats
);

/**
 * 휴지통 시험지 목록 조회
 */
export const useLecturePaperTrash = createGetHook<[], any[]>(
  'main',
  API_REGISTRY.main.lecture.paper.trash
);

// ===== 선생님 관련 Hooks =====

/**
 * 선생님 목록 조회
 */
export const useTeacherList = createPostHook<[], any, ResponseProps<TeacherVO>>(
  'main',
  API_REGISTRY.main.teacher.list
);

/**
 * 선생님 프로필 이미지 URL 생성
 * @param timestamp - 타임스탬프 (캐시 무효화용)
 */
export const useTeacherImage = createGetHook<[number?], any>(
  'main',
  (timestamp?: number) => API_REGISTRY.main.teacher.myImage(timestamp)
);

/**
 * 사용자 계정 정보 조회
 */
export const useProfileAccount = createGetHook<[], any>(
  'main',
  API_REGISTRY.main.teacher.profile.account
);

/**
 * 카카오 SNS 연동 정보 조회
 */
export const useProfileSnsKakao = createGetHook<[], any>(
  'main',
  API_REGISTRY.main.teacher.profile.snsKakao
);

// ===== 학습 관련 Hooks =====

/**
 * 스킬별 정답률 조회
 */
export const useSkillSolveCounts = createPostHook<[], any, any>(
  'main',
  API_REGISTRY.main.study.lecture.solveCounts.skill
);

/**
 * 시험지별 정답률 조회
 */
export const usePaperSolveCounts = createPostHook<[], any, any>(
  'main',
  API_REGISTRY.main.study.lecture.solveCounts.papers
);

/**
 * 학습 시험지 VO 목록 조회
 * @param lecturePaperId - 강좌 시험지 ID
 * @param type - 시험지 타입
 */
export const useStudyPaperVOList = createGetHook<[string | null, string | null], M38UserStudyPaperVO[]>(
  'main',
  API_REGISTRY.main.study.paper.volist
);

// ===== 교재 관련 Hooks =====

/**
 * 교재 목록 조회
 */
export const useWorkBookList = createPostHook<[], any, M38WorkBook[]>(
  'main',
  API_REGISTRY.main.workBook.list
);

/**
 * 교재 시험지 목록 조회
 * @param workBookId - 교재 ID
 */
export const useWorkBookPapers = createGetHook<[string | null], M38WorkBookPaper[]>(
  'main',
  API_REGISTRY.main.workBook.papers
);

/**
 * 교재 시험지 문제 목록 조회
 * @param paperId - 시험지 ID
 */
export const useWorkBookPaperProblems = createGetHook<[string | null], M38WorkBookProblem[]>(
  'main',
  API_REGISTRY.main.workBook.paper.problems
);

// ===== 오류 신고 관련 Hooks =====

/**
 * 사용자 오류 신고 목록 조회
 * @param page - 페이지 번호
 * @param size - 페이지 크기
 */
export const useUserErrorReports = createGetHook<[number?, number?], PageResponse<ErrorReport>>(
  'main',
  (page?: number, size?: number) => API_REGISTRY.main.errorReport.userReports(page ?? 0, size ?? 20)
);

// ===== 시험지 관련 Hooks =====


/**
 * 시험지 조회
 * @param paperId - 시험지 ID
 */
export const usePaper = createGetHook<[string], SpPaperVO>(
  'main',
  API_REGISTRY.main.paper.get
);


/**
 * 강좌별 스킬 카운트 조회
 * @param lectureId - 강좌 ID
 */
export const usePaperSkillCounts = createGetHook<[string | null], SkillCounts>(
  'main',
  API_REGISTRY.main.paper.skillCounts
);

// ===== SAVE 강좌 관련 Hooks =====

/**
 * SAVE 강좌 목록 조회
 */
export const useSaveLectureList = createPostHook<[], any, ResponseProps<SaveLectureVO>>(
  'main',
  API_REGISTRY.main.saveLecture.list
);

/**
 * SAVE 강좌 시험지 목록 조회
 * @param saveLectureId - SAVE 강좌 ID
 */
export const useSaveLecturePapers = createGetHook<[string | null], LecturePaperRO[]>(
  'main',
  API_REGISTRY.main.saveLecture.papers
);

// ===== 제공 시험지 관련 Hooks =====

/**
 * 제공 폴더의 시험지 목록 조회
 * @param folderId - 폴더 ID
 */
export const useProvidedFolderPapers = createGetHook<[string | null], ProvidedPaper[]>(
  'main',
  API_REGISTRY.main.provided.folder.papers
);

// ===== 스킬 관련 Hooks =====

/**
 * 스킬별 오답 횟수 조회
 */
// export const useSkillWrongCounts = createPostHook<[], any, any>(
//   'main',
//   API_REGISTRY.main.study.skill.wrongs()
// );