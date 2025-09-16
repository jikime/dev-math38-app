/**
 * Math API 서비스
 * 수학 교육 플랫폼의 챕터, 스킬, 문제 관련 API
 */

import { BaseApiService } from '@/net/core/api/BaseApiService';
import { 
  SpChapterSkillsVO,
  GeneratedPaper,
  SimilarPaperRequestForm,
  PaperProblemWrapper,
  PaperProblem,
  GeneratePaperData
} from '@/types/typings';

export class MathApiService extends BaseApiService<'app'> {

  // ========== Subject (과목/챕터) 관련 API ==========

  /**
   * 과목 목록 조회
   * @returns 과목 목록
   */
  async getSubjectList(): Promise<any[]> {
    return this.get(this.urls.subject.list);
  }

  /**
   * 도메인별 학년 챕터 조회
   * @returns 학년별 챕터 정보
   */
  async getGradeChaptersByDomain(): Promise<any[]> {
    return this.get(this.urls.chapter.bydomain);
  }

  /**
   * 특정 과목의 상위 챕터 조회
   * @param subjectId - 과목 ID
   * @param depth - 조회 깊이
   * @returns 챕터 트리 구조
   */
  async getTopChapters(subjectId: number, depth: number = 2): Promise<any> {
    return this.get(this.urls.subject.top(subjectId, depth));
  }

  /**
   * 여러 과목의 상위 챕터 조회
   * @param subjectIds - 과목 ID 배열
   * @param depth - 조회 깊이
   * @returns 챕터 트리 구조 배열
   */
  async getTopChaptersBySubjects(subjectIds: number[], depth: number = 2): Promise<any[]> {
    return this.get(this.urls.subject.tops(subjectIds, depth));
  }

  // ========== Skill (스킬) 관련 API ==========

  /**
   * 챕터별 스킬 목록 조회
   * @param chapterIds - 챕터 ID 배열
   * @returns 챕터별 스킬 정보
   */
  async getChapterSkills(chapterIds: number[]): Promise<SpChapterSkillsVO[]> {
    return this.post(this.urls.skill.listchapters, chapterIds);
  }

  /**
   * 특정 스킬의 문제 목록 조회
   * @param skillId - 스킬 ID
   * @returns 문제 목록 응답
   */
  async getSkillProblems(skillId: string): Promise<{ status: number; data: any }> {
    const data = await this.get(this.urls.skill.problemsBySkillId(skillId));
    return { status: 200, data };
  }

  // ========== Paper (시험지) 관련 API ==========

  /**
   * 시험지 생성
   * @param data - 시험지 생성 요청 데이터
   * @returns 생성된 시험지 정보
   */
  async generatePaper(data: any): Promise<any> {
    return this.post(this.urls.paper.paperGenerate, data);
  }

  /**
   * 유사 시험지 생성
   * @param form - 유사 시험지 생성 요청 폼
   * @returns 생성된 시험지 정보
   */
  async generateSimilarPaper(form: SimilarPaperRequestForm): Promise<GeneratedPaper> {
    return this.post(this.urls.paper.similar.generate, form);
  }

  /**
   * 시험지 문제 변경
   * @param wrapper - 문제 변경 요청 래퍼
   * @returns 변경된 문제 정보
   */
  async changeProblem(wrapper: PaperProblemWrapper): Promise<PaperProblem> {
    return this.post(this.urls.paper.change.problem, wrapper);
  }

  /**
   * 검색된 문제로 시험지 생성
   * @param data - 시험지 생성 데이터
   * @returns 생성된 시험지 정보
   */
  async generatePaperWithSearchedProblems(data: GeneratePaperData): Promise<GeneratedPaper> {
    return this.post(this.urls.paper.generateWithSearchedProblems, data);
  }

  // ========== 기타 API ==========

  /**
   * 시험지 그룹 목록 조회
   * @param subjectId - 과목 ID
   * @returns 시험지 그룹 목록
   */
  async getPaperGroupList(subjectId: number): Promise<any[]> {
    return this.get(this.urls.paperGroup.list(subjectId));
  }

  /**
   * 문제 선택기 데이터 조회
   * @param problemId - 문제 ID
   * @returns 문제 상세 정보
   */
  async getProblemSelectorData(problemId: string): Promise<any> {
    return this.get(this.urls.problemSelector.get(problemId));
  }

  /**
   * 기출문제 조회
   * @param fileId - 파일 ID
   * @returns 기출문제 정보
   */
  async getPastExam(fileId: string): Promise<any> {
    return this.get(this.urls.pastExam.get(fileId));
  }

  // BaseApiService의 기본 HTTP 메서드들(get, post, put, delete)은 
  // 직접 사용 가능하므로 별도로 정의하지 않음
}