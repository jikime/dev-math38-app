// 과목 관련 타입 정의
export interface Subject {
  title: string
  key: number
  leaf: boolean
  children: Subject[]
}

// 과목 상세 구조 타입 정의
export interface SubjectTop {
  subjectId: number
  title: string
  key: number
  domain: string | null
  children: SubjectTop[] | null
}