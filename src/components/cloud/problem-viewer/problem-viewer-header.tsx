"use client"

import { ArrowLeft, Grid3X3, BarChart3, Edit, FileText, MoreVertical, Plus, FolderOpen, ChevronRight, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProblemStats } from "@/types/problem"
import type { ViewMode } from "@/types/paper-view"

interface ProblemViewerHeaderProps {
  title: string
  stats: ProblemStats | null
  isLoading: boolean
  viewMode?: ViewMode
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
  viewMode = 'normal',
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {stats.total} 문항
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem>
                      <Plus className="w-4 h-4 mr-2" />
                      문제 추가
                    </DropdownMenuItem>
                    
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                      폴더
                    </div>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      폴더명 수정
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      폴더 문제 다시 가져오기
                    </DropdownMenuItem>
                    
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                      보기 옵션
                    </div>
                    <DropdownMenuItem>
                      <FolderOpen className="w-4 h-4 mr-2" />
                      펼쳐 보기
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      시험지로 보기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowFlashcard}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            유형 자동매핑
          </Button>
          
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
            onClick={onGenerateExam}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            {viewMode === 'normal' ? '펼쳐보기' : '시험지'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSettings}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            시험지
          </Button>
        </div>
      </div>
    </div>
  )
}