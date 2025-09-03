"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Printer, RotateCcw } from "lucide-react"
import type { PaperLayoutSettings } from "@/types/paper-view"
import { DEFAULT_PAPER_SETTINGS } from "@/types/paper-view"

interface PaperLayoutSettingProps {
  settings: PaperLayoutSettings
  onSettingsChange: (settings: PaperLayoutSettings) => void
  onPrint?: () => void
  onExport?: () => void
  totalProblems: number
  totalPages: number
}

// 39math-ui-prime PaperColumnSetting과 동일한 컴포넌트
function PaperColumnSetting({ 
  columns, 
  setColumns 
}: { 
  columns?: number
  setColumns?: (value: number) => void 
}) {
  const handleColumnChange = (value: number) => {
    setColumns && setColumns(value)
  }

  return (
    <div className="mx-3 my-3">
      <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            columns === 1
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleColumnChange(1)}
        >
          1단
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            columns === 2
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleColumnChange(2)}
        >
          2단
        </button>
      </div>
    </div>
  )
}

/**
 * 39math-ui-prime과 동일한 시험지 레이아웃 설정 컴포넌트
 * 단과 문제 사이 공백의 길이를 설정한다.
 */
export function PaperLayoutSetting({
  settings,
  onSettingsChange,
  onPrint,
  onExport,
  totalProblems,
  totalPages
}: PaperLayoutSettingProps) {
  const [minMargin, setMinMargin] = useState(settings.minMargin || 30)

  const handleColumnChange = (columns: number) => {
    onSettingsChange({
      ...settings,
      columns
    })
  }

  const handleMarginChange = (value: number[]) => {
    const newMargin = value[0]
    setMinMargin(newMargin)
    onSettingsChange({
      ...settings,
      minMargin: newMargin
    })
  }

  const resetToDefault = () => {
    onSettingsChange(DEFAULT_PAPER_SETTINGS)
    setMinMargin(DEFAULT_PAPER_SETTINGS.minMargin)
  }

  // 39math-ui-prime과 동일한 레이아웃과 스타일
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 border-t border-t-slate-400 flex justify-center space-x-4 items-center py-2 h-[50px] bg-white z-10 w-full max-w-screen-2xl px-6">
      {/* 컬럼 설정 */}
      <div>
        <PaperColumnSetting 
          columns={settings.columns} 
          setColumns={handleColumnChange} 
        />
      </div>
      
      {/* Gap 설정 */}
      <div>
        <div className="flex items-center space-x-5 flex-1">
          <div>
            <span>gap : {minMargin}</span>
          </div>
          <div className="w-[200px]">
            <Slider
              value={[minMargin]}
              min={30}
              max={700}
              step={1}
              onValueChange={handleMarginChange}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* 출력 버튼 */}
      {onPrint && (
        <div>
          <Button onClick={onPrint} variant="default" size="sm">
            <Printer className="w-4 h-4 mr-1" />
            출력
          </Button>
        </div>
      )}

      {/* 기본값 재설정 버튼 */}
      <div>
        <Button onClick={resetToDefault} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4 mr-1" />
          기본값
        </Button>
      </div>

      {/* 상태 정보 */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>문제: {totalProblems}개</span>
        <span>•</span>
        <span>페이지: {totalPages}페이지</span>
      </div>
    </div>
  )
}