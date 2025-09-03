// 시험지 뷰 관련 타입 정의

export type ViewMode = 'normal' | 'paper'

export interface PaperLayoutSettings {
  columns: number
  fontSize: number
  lineHeight: number
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
  problemSpacing: number
  minMargin: number  // 39math-ui-prime의 gap 설정
  showProblemNumber: boolean
  showAnswer: boolean
  showExplanation: boolean
  paperSize: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
}

export const DEFAULT_PAPER_SETTINGS: PaperLayoutSettings = {
  columns: 2,
  fontSize: 12,
  lineHeight: 1.6,
  marginTop: 20,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  problemSpacing: 16,
  minMargin: 30,  // 39math-ui-prime의 기본 gap 값
  showProblemNumber: true,
  showAnswer: false,
  showExplanation: false,
  paperSize: 'A4',
  orientation: 'portrait'
}

export interface PaperPage {
  pageNumber: number
  problems: ProblemWithLayout[]
  totalHeight: number
}

export interface ProblemWithLayout {
  problem: any // Problem 타입 (기존 Problem 인터페이스 사용)
  index: number
  estimatedHeight: number
  actualHeight?: number
}