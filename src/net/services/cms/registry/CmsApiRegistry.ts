/**
 * CMS API Registry
 * CMS 서버 전용 API 엔드포인트 정의
 */

export const CMS_API_REGISTRY = {
  academy: {
    paperGroup: {
      tree: (subjectId: number) =>
        `/app/academy/papergroup/tree/${subjectId}`,
      paper: (paperId: string) =>
        `/app/academy/papergroup/paper/${paperId}`,
      paperList: (groupId: number) =>
        `/app/academy/papergroup/paper/list/${groupId}`,
    },
  },
  problem: {
    image: (problemId: string) =>
      `/api/problem/image/${problemId}`,
  },
  paper: {
    pdf: (paperId: string) =>
      `/api/paper/pdf/${paperId}`,
  },
} as const;

// 타입 추출
export type CmsApiRegistry = typeof CMS_API_REGISTRY;