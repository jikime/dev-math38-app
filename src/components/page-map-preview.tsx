"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PageMapPreviewProps {
  problems: Array<{ id: string; title: string }>
  onClose: () => void
  questionsPerPage?: number
}

export function PageMapPreview({ problems, onClose, questionsPerPage = 4 }: PageMapPreviewProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-medium">페이지 맵</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4">
        <div className="border-2 border-gray-300 rounded-lg p-2 mb-2">
          <div className="text-sm font-medium mb-2">1</div>
          <div className="border border-gray-300 rounded-lg p-2 relative">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                {problems.slice(0, Math.ceil(problems.length / 2)).map((problem, index) => (
                  <div key={index} className="text-center text-sm font-medium">
                    {index + 1}
                  </div>
                ))}
                {problems.length === 0 && <div className="text-center text-sm font-medium">1</div>}
                {problems.length === 1 && <div className="text-center text-sm font-medium">2</div>}
              </div>
              <div className="flex flex-col gap-2 border-l border-dashed border-gray-300">
                {problems.slice(Math.ceil(problems.length / 2)).map((problem, index) => (
                  <div key={index} className="text-center text-sm font-medium">
                    {Math.ceil(problems.length / 2) + index + 1}
                  </div>
                ))}
                {problems.length <= 2 && <div className="text-center text-sm font-medium">3</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center">
          {problems.length > 0 ? `${problems.length}개 문제 추가됨` : "문제를 추가해주세요"}
        </div>
      </div>
    </div>
  )
}
