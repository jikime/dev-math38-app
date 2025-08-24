"use client"

import React, { createContext, useState, useContext, ReactNode } from 'react'

interface ProblemDistributionContextType {
  // 8x5 배열: [객관식(계산,이해,해결,추론) + 주관식(계산,이해,해결,추론)] x [최상,상,중,하,최하]
  problemTypeCounts: number[][]
  setProblemTypeCounts: (counts: number[][]) => void
}

const ProblemDistributionContext = createContext<ProblemDistributionContextType>({
  problemTypeCounts: Array(8).fill(null).map(() => Array(5).fill(0)),
  setProblemTypeCounts: () => {},
})

export function ProblemDistributionProvider({ children }: { children: ReactNode }) {
  const [problemTypeCounts, setProblemTypeCounts] = useState<number[][]>(
    Array(8).fill(null).map(() => Array(5).fill(0))
  )

  return (
    <ProblemDistributionContext.Provider value={{ problemTypeCounts, setProblemTypeCounts }}>
      {children}
    </ProblemDistributionContext.Provider>
  )
}

export const useProblemDistribution = () => useContext(ProblemDistributionContext)