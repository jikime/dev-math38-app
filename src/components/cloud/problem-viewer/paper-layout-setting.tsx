"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Printer, Download, RotateCcw } from "lucide-react"
import type { PaperLayoutSettings } from "@/types/paper-view"

interface PaperLayoutSettingProps {
  settings: PaperLayoutSettings
  onSettingsChange: (settings: PaperLayoutSettings) => void
  onPrint?: () => void
  onExport?: () => void
  totalProblems: number
  totalPages: number
}

export function PaperLayoutSetting({
  settings,
  onSettingsChange,
  onPrint,
  onExport,
  totalProblems,
  totalPages
}: PaperLayoutSettingProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSettingChange = (key: keyof PaperLayoutSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const resetToDefault = () => {
    onSettingsChange(DEFAULT_PAPER_SETTINGS)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            레이아웃 설정
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>문제: {totalProblems}개</span>
            <span>|</span>
            <span>페이지: {totalPages}페이지</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            기본값
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF 내보내기
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            인쇄
          </Button>
        </div>
      </div>

      {/* 상세 설정 패널 */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 페이지 설정 */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 text-sm">페이지 설정</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="paperSize" className="text-xs">용지 크기</Label>
                      <Select
                        value={settings.paperSize}
                        onValueChange={(value: 'A4' | 'A3' | 'Letter') => handleSettingChange('paperSize', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A4">A4</SelectItem>
                          <SelectItem value="A3">A3</SelectItem>
                          <SelectItem value="Letter">Letter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="orientation" className="text-xs">용지 방향</Label>
                      <Select
                        value={settings.orientation}
                        onValueChange={(value: 'portrait' | 'landscape') => handleSettingChange('orientation', value)}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portrait">세로</SelectItem>
                          <SelectItem value="landscape">가로</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="columns" className="text-xs">컬럼 수</Label>
                      <Select
                        value={settings.columns.toString()}
                        onValueChange={(value) => handleSettingChange('columns', parseInt(value))}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1단</SelectItem>
                          <SelectItem value="2">2단</SelectItem>
                          <SelectItem value="3">3단</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 여백 설정 */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 text-sm">여백 설정 (mm)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="marginTop" className="text-xs">위</Label>
                      <Input
                        id="marginTop"
                        type="number"
                        value={settings.marginTop}
                        onChange={(e) => handleSettingChange('marginTop', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={0}
                        max={50}
                      />
                    </div>
                    <div>
                      <Label htmlFor="marginBottom" className="text-xs">아래</Label>
                      <Input
                        id="marginBottom"
                        type="number"
                        value={settings.marginBottom}
                        onChange={(e) => handleSettingChange('marginBottom', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={0}
                        max={50}
                      />
                    </div>
                    <div>
                      <Label htmlFor="marginLeft" className="text-xs">왼쪽</Label>
                      <Input
                        id="marginLeft"
                        type="number"
                        value={settings.marginLeft}
                        onChange={(e) => handleSettingChange('marginLeft', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={0}
                        max={50}
                      />
                    </div>
                    <div>
                      <Label htmlFor="marginRight" className="text-xs">오른쪽</Label>
                      <Input
                        id="marginRight"
                        type="number"
                        value={settings.marginRight}
                        onChange={(e) => handleSettingChange('marginRight', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={0}
                        max={50}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 텍스트 설정 */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 text-sm">텍스트 설정</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="fontSize" className="text-xs">글자 크기 (pt)</Label>
                      <Input
                        id="fontSize"
                        type="number"
                        value={settings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={8}
                        max={20}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lineHeight" className="text-xs">줄 간격</Label>
                      <Input
                        id="lineHeight"
                        type="number"
                        step={0.1}
                        value={settings.lineHeight}
                        onChange={(e) => handleSettingChange('lineHeight', parseFloat(e.target.value))}
                        className="mt-1 text-xs"
                        min={1.0}
                        max={3.0}
                      />
                    </div>

                    <div>
                      <Label htmlFor="problemSpacing" className="text-xs">문제 간격 (px)</Label>
                      <Input
                        id="problemSpacing"
                        type="number"
                        value={settings.problemSpacing}
                        onChange={(e) => handleSettingChange('problemSpacing', parseInt(e.target.value))}
                        className="mt-1 text-xs"
                        min={0}
                        max={50}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 내용 설정 */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 text-sm">내용 설정</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showProblemNumber" className="text-xs">문제 번호 표시</Label>
                      <Switch
                        id="showProblemNumber"
                        checked={settings.showProblemNumber}
                        onCheckedChange={(checked) => handleSettingChange('showProblemNumber', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showAnswer" className="text-xs">정답 표시</Label>
                      <Switch
                        id="showAnswer"
                        checked={settings.showAnswer}
                        onCheckedChange={(checked) => handleSettingChange('showAnswer', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="showExplanation" className="text-xs">해설 표시</Label>
                      <Switch
                        id="showExplanation"
                        checked={settings.showExplanation}
                        onCheckedChange={(checked) => handleSettingChange('showExplanation', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}