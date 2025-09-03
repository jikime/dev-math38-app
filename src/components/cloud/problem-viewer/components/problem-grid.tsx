"use client"

import { ProblemCard } from "./problem-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Problem, ProblemViewerSettings } from "@/types/problem"

interface ProblemGridProps {
  problems: Problem[]
  isLoading: boolean
  settings: ProblemViewerSettings
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onProblemCopy?: (problem: Problem) => void
  onAnswerToggle?: (problemId: string) => void
}

export function ProblemGrid({
  problems,
  isLoading,
  settings,
  currentPage,
  totalPages,
  onPageChange,
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
            index={(currentPage - 1) * settings.problemsPerPage + index}
            showAnswer={settings.showAnswer}
            showExplanation={settings.showExplanation}
            showCurriculum={settings.showCurriculum}
            onToggleAnswer={onAnswerToggle}
            onCopyProblem={onProblemCopy}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            이전
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNumber: number
              
              if (totalPages <= 7) {
                pageNumber = i + 1
              } else if (currentPage <= 4) {
                pageNumber = i + 1
              } else if (currentPage >= totalPages - 3) {
                pageNumber = totalPages - 6 + i
              } else {
                pageNumber = currentPage - 3 + i
              }

              if (pageNumber === currentPage - 2 && currentPage > 4 && totalPages > 7) {
                return <span key={i} className="px-2 text-gray-400">...</span>
              }
              
              if (pageNumber === currentPage + 2 && currentPage < totalPages - 3 && totalPages > 7) {
                return <span key={i} className="px-2 text-gray-400">...</span>
              }

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            다음
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}