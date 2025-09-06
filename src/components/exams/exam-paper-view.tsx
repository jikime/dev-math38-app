"use client"

import { useExamPaperDetail } from "@/hooks/use-exams"
import AcademyPaperPrint from "./academy-paper-print"
import { Card } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface ExamPaperViewProps {
  paperId?: string
  onClose?: () => void
}
export default function ExamPaperView({ paperId, onClose }: ExamPaperViewProps) {
  const { data: paper, isLoading } = useExamPaperDetail(paperId || null)

  if (!paperId) {
    return (
      <Card className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm">시험지를 선택해주세요</p>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-500">시험지를 불러오는 중...</p>
        </div>
      </Card>
    )
  }

  if (!paper) {
    return null
  }

  return (
    <div className="flex-1">
      <AcademyPaperPrint 
        paper={paper} 
        showTags={true} 
        showBlankPage={false} 
      />
    </div>
  )
}