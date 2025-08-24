// Skill 관련 타입 정의
export interface Skill {
  skillId: string
  skillName: string
  counts: number
  typeCounts: number[][][]
}

export interface SkillChapter {
  chapterId: number
  chapterIndex: string
  chapterName: string
  skillList: Skill[]
}

// POST 요청을 위한 타입 - 숫자 배열을 직접 전송
export type SkillChaptersRequest = number[]

// Skill counts 응답 타입
export interface SkillCountsResponse {
  [skillId: string]: string[]
}