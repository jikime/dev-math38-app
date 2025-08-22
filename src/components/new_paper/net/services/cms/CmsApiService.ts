/**
 * CMS API 서비스
 * 콘텐츠 관리, 학원 시험지 관련 API
 */

import { BaseApiService } from '../../core/BaseApiService';
import { 
  PaperGroupDataNode, 
  AcademyStaticPaper, 
  AcademyStaticPaperDTO
} from '../../../typings';

/**
 * CMS API 서비스 클래스
 * - 학원 시험지 그룹 관리
 * - 콘텐츠 URL 생성
 */
export class CmsApiService extends BaseApiService<'cms'> {

  // ========== 학원 시험지 그룹 관련 API ==========

  /**
   * 시험지 그룹 트리 조회
   * @param subjectId - 과목 ID
   * @returns 시험지 그룹 트리
   */
  async getPaperGroupTree(subjectId: number): Promise<PaperGroupDataNode[]> {
    return this.get(this.urls.academy.paperGroup.tree(subjectId));
  }

  /**
   * 학원 정적 시험지 조회
   * @param paperId - 시험지 ID
   * @returns 학원 정적 시험지
   */
  async getAcademyStaticPaper(paperId: string): Promise<AcademyStaticPaper> {
    return this.get(this.urls.academy.paperGroup.paper(paperId));
  }

  /**
   * 시험지 그룹별 시험지 목록
   * @param paperGroupId - 시험지 그룹 ID
   * @returns 시험지 목록
   */
  async getPaperGroupPaperList(paperGroupId: number): Promise<AcademyStaticPaperDTO[]> {
    return this.get(this.urls.academy.paperGroup.paperList(paperGroupId));
  }

  // ===== 컨텐츠 관련 =====

  /**
   * 문제 이미지 URL 생성
   */
  getProblemImageUrl(problemId: string): string {
    const serverConfig = this.getServerInfo();
    return `${serverConfig.baseURL}${this.urls.problem.image(problemId)}`;
  }

  /**
   * 시험지 PDF URL 생성
   */
  getPaperPdfUrl(paperId: string): string {
    const serverConfig = this.getServerInfo();
    return `${serverConfig.baseURL}${this.urls.paper.pdf(paperId)}`;
  }

}