import { create } from 'zustand'

/** 행/열 의미 상수들 */
// row 0..3: 객관식[계산, 이해, 해결, 추론], row 4..7: 주관식[계산, 이해, 해결, 추론]
// col 0..4 : 난이도 [최상, 상, 중, 하, 최하]
const ROW_COUNT = 8 // 객관4 + 주관4
const DFCTY_COUNT = 5 // 난이도5

// 초기값: 8x5 행렬을 모두 0으로 초기화
const createInitialProblemTypeCounts = (): number[][] => 
  Array.from({ length: ROW_COUNT }, () => Array(DFCTY_COUNT).fill(0))

interface ProblemDistributionState {
  // 8x5 문제 유형별 개수 배열
  // [객관식: 계산/이해/해결/추론, 주관식: 계산/이해/해결/추론] x [최상/상/중/하/최하]
  problemTypeCounts: number[][]
  
  // Actions
  setProblemTypeCounts: (counts: number[][]) => void
  updateProblemTypeCount: (row: number, col: number, value: number) => void
  resetProblemTypeCounts: () => void
}

export const useProblemDistributionStore = create<ProblemDistributionState>((set) => ({
  problemTypeCounts: createInitialProblemTypeCounts(),
  
  setProblemTypeCounts: (counts) => set({ problemTypeCounts: counts }),
  
  updateProblemTypeCount: (row, col, value) => set((state) => {
    const newCounts = state.problemTypeCounts.map(rowArray => [...rowArray])
    newCounts[row][col] = value
    return { problemTypeCounts: newCounts }
  }),
  
  resetProblemTypeCounts: () => set({ problemTypeCounts: createInitialProblemTypeCounts() })
}))

// Context 호환성을 위한 커스텀 훅
export const useProblemDistribution = () => {
  const { problemTypeCounts, setProblemTypeCounts } = useProblemDistributionStore()
  
  return {
    problemTypeCounts,
    setProblemTypeCounts
  }
}