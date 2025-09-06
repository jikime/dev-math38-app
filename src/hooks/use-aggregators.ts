import { useMemo, useCallback } from "react"
import { useProblemDistribution } from "@/stores/problem-distribution-store"

/** 행/열 의미 상수들 */
// row 0..3: 객관식[계산, 이해, 해결, 추론], row 4..7: 주관식[계산, 이해, 해결, 추론]
// col 0..4 : 난이도 [최상, 상, 중, 하, 최하]
const ROW_COUNT = 8 // 객관4 + 주관4
const DFCTY_COUNT = 5 // 난이도5
const MAX_PROBLEM_COUNT = 200 // 최대 문제 수

// 도우미: 특정 row 범위의 합 구하기 (rowStart <= row < rowEnd)
function sumRows(problemTypeCounts: number[][], rowStart: number, rowEnd: number): number[] {
  const sums = Array(DFCTY_COUNT).fill(0)
  for (let r = rowStart; r < rowEnd; r++) {
    for (let c = 0; c < DFCTY_COUNT; c++) {
      sums[c] += problemTypeCounts[r][c]
    }
  }
  return sums
}

/** 
 * 난이도별 합을 구하기 : 8x5 전체를 난이도단위(5칸)로 압축 
 * => 결과는 길이5짜리 (각 난이도별 총합)
 */
function sumDifficultyAll(problemTypeCounts: number[][]) {
  const result = Array(DFCTY_COUNT).fill(0)
  for (let r = 0; r < ROW_COUNT; r++) {
    for (let c = 0; c < DFCTY_COUNT; c++) {
      result[c] += problemTypeCounts[r][c]
    }
  }
  return result
}

/** 
 * maxFeasible: 8×5, 각 셀에 "그 행(row), 그 난이도(col)에서 가능한 최대치"
 * newVal: 특정 난이도에 배정할 총 문제 수
 * rowStart..rowEnd: 분배할 행 범위(예: 0..8이면 전체)
 */
function distributeByMaxFeasible(
  ptc: number[][],
  rowStart: number,
  rowEnd: number,
  col: number,
  newVal: number,
  maxFeasible: number[][],
){
  // 1) rowStart..rowEnd 구간의 maxFeasible 합을 구한다.
  let totalFeasible = 0
  for (let r = rowStart; r < rowEnd; r++) {
    totalFeasible += maxFeasible[r][col]
  }
  if (totalFeasible <= 0) {
    // 이 구간에 아예 여유가 없다면 => 전부 0 처리
    for (let r = rowStart; r < rowEnd; r++) {
      ptc[r][col] = 0
    }
    return
  }
  
  // 2) 1차 분배: 각 row는 (newVal * (feasible[r]/totalFeasible)) 근사치
  //    동시에, row별로 maxFeasible[r][col]을 초과하지 않도록 clamp
  const partial: { row: number; fraction: number; assigned: number }[] = []
  let assignedSum = 0
  
  for (let r = rowStart; r < rowEnd; r++) {
    const feasibleR = maxFeasible[r][col]
    if (feasibleR <= 0) {
      ptc[r][col] = 0
      continue
    }
    const raw = (newVal * feasibleR) / totalFeasible // 비례 배분
    const floored = Math.floor(raw)
    const assigned = Math.min(floored, feasibleR) // clamp
    assignedSum += assigned
    ptc[r][col] = assigned
    partial.push({
      row: r,
      fraction: raw - floored,
      assigned,
    })
  }
  
  // 3) leftover(잔여분) 분배: 반올림 때문에 합이 newVal보다 작을 수 있음.
  let leftover = newVal - assignedSum
  if (leftover > 0) {
    // fraction 높은 순으로 소트
    partial.sort((a, b) => b.fraction - a.fraction)
    for (let i = 0; i < partial.length && leftover > 0; i++) {
      const { row, assigned } = partial[i]
      const feasibleR = maxFeasible[row][col]
      // 가능한지 체크
      if (assigned < feasibleR) {
        ptc[row][col] = assigned + 1
        partial[i].assigned++
        leftover--
      }
    }
  }
}

/** 
 * 초간단 : 난이도별 5개만 보여주고, 세부는 균등 분배(혹은 기존비율 유지)로 할당
 */
export function useSimple1Aggregator() {
  const { problemTypeCounts, setProblemTypeCounts } = useProblemDistribution()
  
  // 1) 현재 8×5 중 "난이도별 총합"을 구해서 [최상, 상, 중, 하, 최하] 배열로 만든다.
  const simpleValues = useMemo(() => {
    return sumDifficultyAll(problemTypeCounts)
  }, [problemTypeCounts])

  // 2) 사용자 변경(난이도별 숫자) => 8×5에 다시 배분
  const setSimpleValues = useCallback((newValues: number[], maxFeasible: number[][]) => {
    // 최대 문항수 확인
    const totalNewCount = newValues.reduce((acc, val) => acc + val, 0)
    if (totalNewCount > MAX_PROBLEM_COUNT) {
      alert(`최대 ${MAX_PROBLEM_COUNT}개의 문항만 출제할 수 있습니다.`)
      return
    }

    const newPTC = problemTypeCounts.map((row) => [...row])
    for (let c = 0; c < DFCTY_COUNT; c++) {
      distributeByMaxFeasible(newPTC, 0, ROW_COUNT, c, newValues[c], maxFeasible)
    }
    setProblemTypeCounts(newPTC)
  }, [problemTypeCounts, setProblemTypeCounts])

  return { simpleValues, setSimpleValues }
}

/**
 * 간단 : (객관식 vs 주관식) × 난이도별 개수
 *  => 2개의 배열을 보여주고, 각 배열길이=5, (최상..최하)
 */
export function useNormal1Aggregator() {
  const { problemTypeCounts, setProblemTypeCounts } = useProblemDistribution()

  const objectiveSums = useMemo(() => sumRows(problemTypeCounts, 0, 4), [problemTypeCounts])
  const subjectiveSums = useMemo(() => sumRows(problemTypeCounts, 4, 8), [problemTypeCounts])

  const setNormal1Values = useCallback((newObjective: number[], newSubjective: number[], maxFeasible: number[][]) => {
    // 최대 문항수 확인
    const totalNewCount = [...newObjective, ...newSubjective].reduce((acc, val) => acc + val, 0)
    if (totalNewCount > MAX_PROBLEM_COUNT) {
      alert(`최대 ${MAX_PROBLEM_COUNT}개의 문항만 출제할 수 있습니다.`)
      return
    }

    const newPTC = problemTypeCounts.map((row) => [...row])
    // 객관식(0~3행) 부분
    for (let c = 0; c < DFCTY_COUNT; c++) {
      distributeByMaxFeasible(newPTC, 0, 4, c, newObjective[c], maxFeasible)
    }
    // 주관식(4~7행) 부분
    for (let c = 0; c < DFCTY_COUNT; c++) {
      distributeByMaxFeasible(newPTC, 4, 8, c, newSubjective[c], maxFeasible)
    }

    setProblemTypeCounts(newPTC)
  }, [problemTypeCounts, setProblemTypeCounts])

  return { objectiveSums, subjectiveSums, setNormal1Values }
}

/**
 * 자세히: 8×5를 그대로 보여주고, 직접 입력받는다.
 */
export function useDetailedAggregator() {
  const { problemTypeCounts, setProblemTypeCounts } = useProblemDistribution()

  // 기존 data, setValue의 이름을 보다 명확하게 변경합니다.
  const currentDistribution = problemTypeCounts // 8x5 실제 요청 분배
  const setDistribution = (row: number, col: number, newVal: number) => {
    const newPTC = problemTypeCounts.map((r) => [...r])
    
    // 최대 문항수 확인
    let totalCount = 0
    for (let r = 0; r < newPTC.length; r++) {
      for (let c = 0; c < newPTC[r].length; c++) {
        // 변경하려는 값만 newVal로 계산
        if (r === row && c === col) {
          totalCount += newVal
        } else {
          totalCount += newPTC[r][c]
        }
      }
    }
    
    if (totalCount > MAX_PROBLEM_COUNT) {
      alert(`최대 ${MAX_PROBLEM_COUNT}개의 문항만 출제할 수 있습니다.`)
      return
    }
    
    newPTC[row][col] = newVal
    setProblemTypeCounts(newPTC)
  }

  return { currentDistribution, setDistribution }
}