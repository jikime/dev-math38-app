/**
 * Main API 전용 Hooks
 * 메인 서버 API를 위한 커스텀 훅 모음
 */

import { useApiSWR, useApiSWRPost, useApiMutation, UseApiSWROptions } from './useApiSWR';
import { API_REGISTRY } from '../registry/ApiRegistry';
import { 
  TeacherVO, 
  ResponseProps, 
  LectureVO, 
  StudentVO,
  SaveLectureVO,
  SpPaperVO
} from '../../typings';

// ===== 선생님 관련 Hooks =====

/**
 * 선생님 목록 조회
 */
export function useTeacherList(params: {
  name?: string;
  state?: string;
  pageNum?: number;
  size?: number;
}, options?: UseApiSWROptions) {
  return useApiSWRPost<ResponseProps<TeacherVO>>(
    'main',
    API_REGISTRY.main.teacher.list,
    params,
    options
  );
}

/**
 * 내 강좌 목록 조회
 */
export function useMyLectures(options?: UseApiSWROptions) {
  return useApiSWR<LectureVO[]>(
    'main',
    API_REGISTRY.main.lecture.myLectures,
    options
  );
}

// ===== 학생 관련 Hooks =====

/**
 * 학생 목록 조회
 */
export function useStudentList(params: {
  name?: string;
  state?: string;
  pageNum?: number;
  size?: number;
}, options?: UseApiSWROptions) {
  return useApiSWRPost<ResponseProps<StudentVO>>(
    'main',
    API_REGISTRY.main.student.list,
    params,
    options
  );
}

/**
 * 학생 정보 조회
 */
export function useStudent(studentId: string | null, options?: UseApiSWROptions) {
  return useApiSWR<StudentVO>(
    'main',
    studentId ? API_REGISTRY.main.student.get(studentId) : null,
    options
  );
}

/**
 * 학생 간단 정보 조회
 */
export function useStudentSimpleInfo(studentId: string | null, options?: UseApiSWROptions) {
  return useApiSWR(
    'main',
    studentId ? API_REGISTRY.main.student.simpleInfo(studentId) : null,
    options
  );
}

// ===== 강좌 관련 Hooks =====

/**
 * 강좌별 학생 ID 목록
 */
export function useLectureStudentIds(lectureId: string | null, options?: UseApiSWROptions) {
  return useApiSWR<string[]>(
    'main',
    lectureId ? API_REGISTRY.main.lecture.userIdList(lectureId) : null,
    options
  );
}

/**
 * 강좌별 시험지 목록
 */
export function useLecturePapers(lectureId: string | null, options?: UseApiSWROptions) {
  return useApiSWR<SpPaperVO[]>(
    'main',
    lectureId ? API_REGISTRY.main.academy.analysis.sessionGrades.paperList(lectureId) : null,
    options
  );
}

/**
 * 강좌 선생님 정보
 */
export function useLectureTeacher(lectureId: string | null, options?: UseApiSWROptions) {
  return useApiSWR(
    'main',
    lectureId ? API_REGISTRY.main.academy.analysis.lectureTeacher(lectureId) : null,
    options
  );
}

// ===== Save 강좌 관련 Hooks =====

/**
 * Save 강좌 목록
 */
export function useSaveLectureList(options?: UseApiSWROptions) {
  return useApiSWR<SaveLectureVO[]>(
    'main',
    API_REGISTRY.main.saveLecture.list,
    options
  );
}

// ===== 학교 관련 Hooks =====

/**
 * 학교 검색
 */
export function useSchoolSearch(params: {
  schoolName?: string;
  gubun?: string;
  region?: string;
} | null, options?: UseApiSWROptions) {
  return useApiSWRPost(
    'main',
    params ? API_REGISTRY.main.util.school.search : null,
    params,
    options
  );
}

/**
 * 학교 주소 조회
 */
export function useSchoolAddress(schoolCode: string | null, options?: UseApiSWROptions) {
  return useApiSWR(
    'main',
    schoolCode ? API_REGISTRY.main.util.school.address(schoolCode) : null,
    options
  );
}

/**
 * 학년별 학생 수
 */
export function useGradeStudentCount(lectureId: string | null, options?: UseApiSWROptions) {
  return useApiSWR(
    'main',
    lectureId ? API_REGISTRY.main.academy.analysis.sessionGrades.paperGradeStudentCount(lectureId) : null,
    options
  );
}

/**
 * 학교별 학생 수
 */
export function useSchoolStudentCount(lectureId: string | null, options?: UseApiSWROptions) {
  return useApiSWR(
    'main',
    lectureId ? API_REGISTRY.main.academy.analysis.sessionGrades.paperSchoolStudentCount(lectureId) : null,
    options
  );
}

// ===== 분석 관련 Hooks =====

/**
 * 학원 분석 데이터
 */
export function useAcademyAnalysis(params: {
  lectureId: string;
  paperId: string;
  studentId?: string;
} | null, options?: UseApiSWROptions) {
  return useApiSWRPost(
    'main',
    params ? API_REGISTRY.main.academy.analysis.analysis : null,
    params,
    options
  );
}

// ===== Mutation Hooks =====

/**
 * 선생님 생성
 */
export function useCreateTeacher() {
  return useApiMutation('main', API_REGISTRY.main.teacher.create, 'POST');
}

/**
 * 선생님 비밀번호 초기화
 */
export function useResetTeacherPassword() {
  return useApiMutation('main', API_REGISTRY.main.teacher.passwordReset, 'POST');
}

/**
 * Save 강좌 생성
 */
export function useCreateSaveLecture() {
  return useApiMutation('main', API_REGISTRY.main.saveLecture.create, 'POST');
}

/**
 * Save 강좌 삭제
 */
export function useDeleteSaveLecture(saveLectureId: string) {
  return useApiMutation('main', API_REGISTRY.main.saveLecture.delete(saveLectureId), 'DELETE');
}

/**
 * 프로필 이미지 업로드
 */
export function useUploadProfileImage() {
  return useApiMutation('main', API_REGISTRY.main.teacher.profile.upload, 'POST');
}

/**
 * 비밀번호 변경
 */
export function useChangePassword() {
  return useApiMutation('main', API_REGISTRY.main.teacher.profile.changePassword, 'POST');
}