/**
 * Math API Registry
 * Math 관련 API 엔드포인트 정의 (App 서버 사용)
 */

export const MATH_API_REGISTRY = {
  // 과목 관련
  subject: {
    list: '/app/subject/subject/list',
    top: (subjectId: number, depth: number = 2) =>
      `/app/subject/top?subjectId=${subjectId}&depth=${depth}`,
    tops: (subjectIds: number[], depth: number = 2) =>
      `/app/subject/tops?subjectIds=${subjectIds.join(",")}&depth=${depth}`,
    gradeChapters: {
      byDomain: (domain: string) =>
        `/app/subject/gradechapters?domain=${domain}`,
    },
  },

  // 문제 선택기
  problemSelector: {
    get: (problemId: string | null) => problemId ? `/app/problemselector/get/${problemId}` : null,
  },

  // 챕터 관련
  chapter: {
    skills: '/app/chapter/skills',
    bydomain: '/app/subject/chapter/bydomain',
  },

  // 스킬 관련
  skill: {
    problems: '/app/skill/problems',
    listchapters: '/app/skill/listchapters',
    problemsBySkillId: (skillId: string) => `/app/skill/${skillId}/problems`,
  },

  // 시험지 그룹
  paperGroup: {
    list: (subjectId: number) =>
      `/app/papergroup/list/${subjectId}`,
  },

  // 과거 시험
  pastExam: {
    get: (fileId: string | null) => fileId ?
      `/app/pastexam/get/${fileId}` : null,
  },

  // 시험지 생성
  paper: {
    generate: '/app/paper/generate',
    paperGenerate: '/app/paper/paper/generate',
    similar: {
      generate: '/app/paper/similar/generate',
    },
    change: {
      problem: '/app/paper/change/problem',
    },
    generateWithSearchedProblems: '/app/paper/paper/generate/withSearchedProblems',
  },
} as const;

// 타입 추출
export type MathApiRegistry = typeof MATH_API_REGISTRY;