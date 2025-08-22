/**
 * 메인 API 서비스
 * 시험지, 학습, 처방학습, 오류신고 등 핵심 비즈니스 API
 */

import { BaseApiService } from '../../core/BaseApiService';
import { SimpleResponse } from '../../types';

/**
 * 메인 API 서비스 클래스
 * - 시험지 관리 (수동, 학습, 교재)
 * - 처방학습 및 오답 관리
 * - 학교 시험지 검색
 * - 오류 신고 및 프로필 관리
 */
export class MainApiService extends BaseApiService<'main'> {

  // ========== 강좌 관리 API ==========

  /**
   * 내 강좌 목록 조회
   * @returns 내 강좌 목록
   */
  async getMyLectures(): Promise<any[]> {
    return this.get(this.urls.lecture.myLectures);
  }

  /**
   * 강좌의 학생 목록 조회
   * @param lectureId - 강좌 ID
   * @returns 학생 목록
   */
  async getLectureStudents(lectureId: string | null): Promise<any[]> {
    return lectureId ? this.get(this.urls.lecture.students(lectureId)) : [];
  }

  /**
   * 강좌의 시험지 목록 조회 (타입별)
   * @param lectureId - 강좌 ID
   * @param type - 시험지 타입
   * @returns 시험지 목록
   */
  async getLecturePapersByType(lectureId: string, type: string): Promise<any[]> {
    return this.get(this.urls.lecture.papersByType(lectureId, type));
  }

  /**
   * 사용자 오류 신고 목록 조회
   * @param page - 페이지 번호
   * @param size - 페이지 크기
   * @returns 오류 신고 목록
   */
  async getUserErrorReports(page: number = 0, size: number = 10): Promise<any> {
    return this.get(this.urls.errorReport.userReports(page, size));
  }

  // ========== 시험지 관리 API ==========

  /**
   * 강좌의 시험지 삭제
   * @param lectureId - 강좌 ID
   * @param lecturePaperId - 강좌 시험지 ID
   * @returns 삭제 성공 여부
   */
  async deleteLecturePaper(lectureId: string, lecturePaperId: string): Promise<boolean> {
    return this.delete(this.urls.lecture.deletePaper(lectureId, lecturePaperId));
  }

  /**
   * 강좌에 시험지 추가 (Save 강좌에서)
   * @param lectureId - 강좌 ID
   * @param saveLectureId - Save 강좌 ID
   * @param paperIds - 추가할 시험지 ID들
   * @returns 추가 결과
   */
  async addPapersFromSaveLecture(lectureId: string, saveLectureId: string, paperIds: string[]): Promise<any> {
    return this.put(this.urls.lecture.addPapers.fromSave(lectureId, saveLectureId), paperIds);
  }

  /**
   * 강좌에 제공된 시험지 추가
   * @param lectureId - 강좌 ID
   * @param paperIds - 추가할 시험지 ID들
   * @returns 추가 결과
   */
  async addProvidedPapers(lectureId: string, paperIds: string[]): Promise<any> {
    return this.put(this.urls.lecture.addPapers.provided(lectureId), paperIds);
  }

  /**
   * 학습 시험지 저장
   * @param paper - 시험지 데이터
   * @returns 저장 결과
   */
  async saveStudyPaper(paper: any): Promise<any> {
    return this.put(this.urls.study.paper.save, paper);
  }

  /**
   * 수동 시험지 저장
   * @param type - 시험지 타입
   * @param paper - 시험지 데이터
   * @returns 저장 결과
   */
  async saveManualPaper(type: string, paper: any): Promise<any> {
    return this.post(this.urls.paper.manual.save(type), paper);
  }

  /**
   * 강좌에 수동 시험지 추가
   * @param lectureId - 강좌 ID
   * @param type - 시험지 타입
   * @param paper - 시험지 데이터
   * @returns 추가 결과
   */
  async addManualPaperToLecture(lectureId: string, type: string, paper: any): Promise<any> {
    return this.post(this.urls.paper.add.manual(lectureId, type), paper);
  }

  /**
   * 타입별 강좌/세이브강좌 정보 조회
   * @param type - lecture, savelecture 등
   * @param id - 강좌 ID
   * @returns 강좌 정보
   */
  async getLectureByType(type: string, id: string): Promise<any> {
    return this.get(this.urls.common.lectureByType(type, id));
  }

  /**
   * 강좌의 마지막 인덱스 정보 조회
   * @param type - lecture, savelecture 등
   * @param lectureId - 강좌 ID
   * @returns 마지막 인덱스 정보
   */
  async getLastIndexInfo(type: string, lectureId: string): Promise<any> {
    return this.get(this.urls.common.lastIndexInfo(type, lectureId));
  }

  /**
   * 강좌에 아카데미 시험지 추가
   * @param lectureId - 강좌 ID
   * @param academyPaperInput - 아카데미 시험지 데이터
   * @returns 추가된 시험지 정보
   */
  async addAcademyPaperToLecture(lectureId: string, academyPaperInput: any): Promise<any> {
    return this.post(this.urls.paper.add.academy(lectureId), academyPaperInput);
  }

  /**
   * 수동 시험지 정보 조회
   * @param paperId - 시험지 ID
   * @returns 시험지 정보
   */
  async getManualPaper(paperId: string): Promise<any> {
    return this.get(this.urls.paper.manual.get(paperId));
  }

  /**
   * 학습 시험지 정보 조회
   * @param paperId - 시험지 ID
   * @returns 시험지 정보
   */
  async getUserStudyPaper(paperId: string): Promise<any> {
    return this.get(this.urls.study.paper.get(paperId));
  }

  /**
   * 삭제된 시험지 복원
   * @param lectureId - 강좌 ID
   * @param paperId - 시험지 ID
   * @returns 복원 결과
   */
  async restorePaper(lectureId: string, paperId: string): Promise<any> {
    return this.put(this.urls.lecture.restore(lectureId, paperId));
  }

  // ========== 교재 관련 API ==========

  /**
   * 교재 기반 시험지 생성
   * @param data - 시험지 생성 데이터
   * @returns 생성 결과
   */
  async generateWorkbookPaper(data: any): Promise<SimpleResponse> {
    return this.post(this.urls.lecture.workBook.generatePaper, data);
  }

  /**
   * 교재 기반 유사 시험지 생성 (범위 내 스킬)
   * @param data - 시험지 생성 데이터
   * @returns 생성 결과
   */
  async generateWorkbookPaperInRangeSkills(data: any): Promise<SimpleResponse> {
    return this.post(this.urls.lecture.workBook.generateInRangeSkills, data);
  }


  // ========== 학교 시험지 검색 API ==========

  /**
   * 지역 목록 조회
   * @returns 지역 목록
   */
  async getRegions(): Promise<any[]> {
    return this.get(this.urls.school.exam.region);
  }

  /**
   * 학교 목록 조회
   * @param districtId - 지역 ID
   * @param schoolType - 학교 유형
   * @returns 학교 목록
   */
  async getExamSchools(districtId: number, schoolType: string): Promise<any[]> {
    return this.get(this.urls.school.exam.schools(districtId, schoolType));
  }

  /**
   * 시험지 검색
   * @param filter - 검색 필터
   * @param pageRequest - 페이지 요청 정보
   * @returns 시험지 검색 결과
   */
  async searchExamPapers(filter: any, pageRequest: { page: number; size: number }): Promise<any> {
    return this.post(this.urls.school.exam.search(pageRequest.page, pageRequest.size), filter);
  }

  // ========== 처방학습 관련 API ==========

  /**
   * 처방학습 시험지 생성
   * @param param - 처방학습 생성 파라미터
   * @returns 생성 결과
   */
  async createAddonPaper(param: any): Promise<any> {
    return this.post(this.urls.study.lecture.addon, param);
  }

  /**
   * 학생 오답 업데이트
   * @param lectureId - 강좌 ID
   * @param paperIds - 시험지 ID 목록
   * @returns 오답 정보
   */
  async updateStudentWrongs(lectureId: string, paperIds: string[]): Promise<any> {
    return lectureId ? this.post(this.urls.study.student.wrongs(lectureId), paperIds) : null;
  }

  /**
   * 학생 통계 조회
   * @param studentId - 학생 ID
   * @returns 학생의 챕터별 통계
   */
  async getStudentStats(studentId: string): Promise<any> {
    return this.get(this.urls.lecture.stats(studentId));
  }

  /**
   * 스킬별 오답 통계 조회
   * @param lectureId - 강좌 ID
   * @param type - 타입
   * @param skillIds - 스킬 ID 목록
   * @param studentIds - 학생 ID 목록
   * @returns 스킬별 오답 통계
   */
  async getSkillWrongCounts(lectureId: string, type: string, skillIds: string[], studentIds: string[]): Promise<any> {
    return this.post(this.urls.study.skill.wrongs(lectureId, type), {
      skillIds,
      studentIds
    });
  }

  /**
   * 학생별 문제 풀이 통계 조회 (시험지 기준)
   * @param lectureId - 강좌 ID
   * @param studentIds - 학생 ID 목록
   * @param paperIds - 시험지 ID 목록
   * @returns 학생별 풀이 통계
   */
  async getStudentSolveCountsByPapers(lectureId: string, studentIds: string[], paperIds: string[]): Promise<any> {
    return this.post(this.urls.study.lecture.solveCounts.papers, {
      lectureId,
      studentIds,
      paperIds
    });
  }

  /**
   * 학생별 문제 풀이 통계 조회 (스킬 기준)
   * @param lectureId - 강좌 ID
   * @param studentIds - 학생 ID 목록
   * @param skillIds - 스킬 ID 목록
   * @returns 학생별 풀이 통계
   */
  async getStudentSolveCountsBySkills(lectureId: string, studentIds: string[], skillIds: string[]): Promise<any> {
    return this.post(this.urls.study.lecture.solveCounts.skill, {
      lectureId,
      studentIds,
      skillIds
    });
  }

  // ========== 오류 신고 API ==========

  /**
   * 오류 신고
   */
  async reportError(errorReportObj: any): Promise<any> {
    return this.post(this.urls.errorReport.insert, errorReportObj, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * 파일과 함께 오류 신고
   */
  async reportErrorWithFiles(formData: FormData): Promise<any> {
    return this.post(this.urls.errorReport.insertWithFiles, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  // ========== 프로필 API ==========

  /**
   * 프로필 이미지 업로드
   */
  async uploadProfileImage(formData: FormData): Promise<any> {
    return this.post(this.urls.teacher.profile.upload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * 카카오 계정 연결 해제
   * @returns 해제 결과
   */
  async disconnectKakao(): Promise<any> {
    return this.delete(this.urls.teacher.profile.snsKakao);
  }

  // ========== 학습 관련 API ==========

  /**
   * 시험지 답안지 초기화
   * @param paperAnswerSheetId - 답안지 ID
   * @returns 초기화 결과
   */
  async resetPaperAnswerSheet(paperAnswerSheetId: string): Promise<{ result: boolean }> {
    return this.put(this.urls.study.paper.reset(paperAnswerSheetId));
  }

  // BaseApiService의 기본 HTTP 메서드들(get, post, put, delete)은 
  // 직접 사용 가능하므로 별도로 정의하지 않음
}