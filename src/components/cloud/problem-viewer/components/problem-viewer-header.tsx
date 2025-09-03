"use client"

import { ArrowLeft, BarChart3, CreditCard, FileText, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProblemStats } from "@/types/problem"

interface ProblemViewerHeaderProps {
  title: string
  stats: ProblemStats | null
  isLoading: boolean
  onBack: () => void
  onShowStats: () => void
  onShowFlashcard: () => void
  onGenerateExam: () => void
  onSettings: () => void
}

export function ProblemViewerHeader({
  title,
  stats,
  isLoading,
  onBack,
  onShowStats,
  onShowFlashcard,
  onGenerateExam,
  onSettings
}: ProblemViewerHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 뒤로가기 + 제목 + 통계 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            
            {isLoading ? (
              <Badge variant="secondary">로딩중...</Badge>
            ) : stats ? (
              <Badge variant="outline" className="text-sm">
                {stats.total} 문항
              </Badge>
            ) : null}
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowStats}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            통계 보기
          </Button>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={onShowFlashcard}
            className="flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            플래시카드
          </Button>
          
          <Button
            variant="outline"
            size="sm" 
            onClick={onGenerateExam}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            시험지
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}