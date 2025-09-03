"use client"

import { ProblemCard } from "./problem-card"
import type { Problem, ProblemViewerSettings } from "@/types/problem"

interface ProblemGridProps {
  problems: Problem[]
  isLoading: boolean
  settings: ProblemViewerSettings
  onProblemCopy?: (problem: Problem) => void
  onAnswerToggle?: (problemId: string) => void
}

export function ProblemGrid({
  problems,
  isLoading,
  settings,
  onProblemCopy,
  onAnswerToggle
}: ProblemGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">문제를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">문제가 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* 문제 그리드 */}
      <div className={`grid gap-4 mb-6 ${
        settings.layout === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {problems.map((problem, index) => (
          <ProblemCard
            key={problem.problemId}
            problem={problem}
            index={index}
            showAnswer={settings.showAnswer}
            showExplanation={settings.showExplanation}
            showCurriculum={settings.showCurriculum}
            onToggleAnswer={onAnswerToggle}
            onCopyProblem={onProblemCopy}
          />
        ))}
      </div>
    </div>
  )
}