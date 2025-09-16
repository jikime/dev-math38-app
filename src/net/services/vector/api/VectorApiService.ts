/**
 * Vector API 서비스
 * 문제 유사도 검색 API
 */

import { BaseApiService } from '@/net/core/api/BaseApiService';
import {
  ProblemListSearch,
  ProblemSearchResult
} from '@/types/typings';

export class VectorApiService extends BaseApiService<'vector'> {

  // ===== 유사 문제 검색 =====

  /**
   * 시험지용 유사 문제 목록 검색
   */
  async getSimilarProblemListForPaper(dto: ProblemListSearch): Promise<ProblemSearchResult[]> {
    return this.post(this.urls.problems.search.similar.list, dto);
  }

  // ===== 벡터 분석 =====

  /**
   * 문제 클러스터 분석
   */
  async getProblemClusters(params: { subjectId?: number; gradeLevel?: number; minClusterSize?: number; }): Promise<any> {
    return this.post(this.urls.analysis.clusters, params);
  }

  /**
   * 문제 간 거리 계산
   */
  async getProblemDistance(problemId1: string, problemId2: string): Promise<any> {
    return this.get(this.urls.analysis.distance(problemId1, problemId2));
  }

  /**
   * 벡터 품질 평가
   */
  async getVectorQuality(problemId: string): Promise<any> {
    return this.get(this.urls.analysis.quality(problemId));
  }

  // ===== 벡터 상태 관리 =====

  /**
   * 벡터 서비스 상태 확인
   */
  async getServiceStatus(): Promise<any> {
    return this.get(this.urls.status);
  }

  /**
   * 벡터 통계 조회
   */
  async getStats(): Promise<any> {
    return this.get(this.urls.stats);
  }

  // ===== 벡터 관리 =====

  /**
   * 문제 벡터 생성/업데이트
   */
  async upsertProblemVector(problemId: string, data?: any): Promise<any> {
    return this.post(this.urls.problems.vector(problemId), data);
  }

  /**
   * 문제 벡터 삭제
   */
  async deleteProblemVector(problemId: string): Promise<any> {
    return this.delete(this.urls.problems.vector(problemId));
  }

  /**
   * 벡터 인덱스 재구축
   */
  async rebuildIndex(): Promise<any> {
    return this.post(this.urls.index.rebuild);
  }

}