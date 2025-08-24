// 과목 관련 타입 정의
export interface Subject {
  title: string
  key: number
  leaf: boolean
  children: Subject[]
}