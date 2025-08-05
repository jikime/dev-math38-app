"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PrintSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrintSettingsDialog({ open, onOpenChange }: PrintSettingsDialogProps) {
  const [printOptions, setPrintOptions] = useState({
    유형정보: true,
    난이도: true,
    인지영역: true,
    태그정보: true,
    정답률: true,
    동일유형표시: true,
  })

  const [selectedTemplate, setSelectedTemplate] = useState("1번")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")

  const colorPalette = [
    // 첫 번째 줄 - 기본 색상
    ["#000000", "#dc2626", "#ea580c", "#eab308", "#16a34a", "#2563eb", "#7c3aed"],
    // 두 번째 줄 - 연한 색상
    ["#fecaca", "#fed7aa", "#fef3c7", "#dcfce7", "#dbeafe", "#e9d5ff"],
    // 세 번째 줄 - 중간 색상
    ["#fca5a5", "#fdba74", "#fde047", "#86efac", "#93c5fd", "#c4b5fd"],
    // 네 번째 줄 - 진한 색상
    ["#6b7280", "#dc2626", "#c2410c", "#a3a300", "#15803d", "#1d4ed8", "#6d28d9"],
    // 다섯 번째 줄 - 매우 진한 색상
    ["#374151", "#991b1b", "#9a3412", "#854d0e", "#14532d", "#1e3a8a", "#581c87"],
  ]

  const handleOptionToggle = (option: string) => {
    setPrintOptions((prev) => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev],
    }))
  }

  const handleApply = () => {
    // 프린트 설정 적용 로직
    console.log("프린트 설정 적용:", { printOptions, selectedTemplate, selectedColor })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">출력 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 출력 정보 섹션 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">강좌명</Label>
                <Input value="봄 중3)실력B1-공,수1입문P2 실력P1(M2)" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">과정</Label>
                <Input value="공통수학1" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">문제명</Label>
                <Input value="DT - 19회차 5/13(월) 중3 실력B1 -M2(정명-신관3호)" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">출제일</Label>
                <Input value="5월 11일" className="mt-1 bg-gray-50" readOnly />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">종류</Label>
                <Input value="문제 출제" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">범위</Label>
                <Input value="5 행렬 ~ 5.1.2 행렬의 곱셈" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">난이도</Label>
                <Input value="개별" className="mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">문항수</Label>
                <Input value="개별" className="mt-1 bg-gray-50" readOnly />
              </div>
            </div>
          </div>

          {/* 노란색 경고 메시지들 */}
          <div className="space-y-2">
            <div className="bg-yellow-300 text-black p-2 rounded text-sm">
              출력옵션 표시 넣은 부분 안에 진행할지 확인
              <br />
              출제 1회차 : 출제일 - 강좌명
              <br />
              출제 회차 / 상 / 중 / 하
            </div>
            <div className="bg-yellow-300 text-black p-2 rounded text-sm">
              문항도가 학생 개인다 다를 경우에는 개인
              <br />
              공통 시험지일 경우에는 문항 수 표시
              <br />
              22문제(객 5 / 주 : 17)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* 출력 옵션 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">출력 옵션</h3>
              <div className="space-y-4">
                {Object.entries(printOptions).map(([option, enabled]) => (
                  <div key={option} className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{option}</Label>
                    <Switch checked={enabled} onCheckedChange={() => handleOptionToggle(option)} />
                  </div>
                ))}

                {/* 옵션 저장 */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm font-medium">옵션 저장</Label>
                    <div className="w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center">
                      <span className="text-blue-500 font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      적용
                    </Button>
                    <Button size="sm" variant="outline">
                      닫기
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 출력 템플릿 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">출력 템플릿</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">템플릿</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1번">1번</SelectItem>
                      <SelectItem value="2번">2번</SelectItem>
                      <SelectItem value="3번">3번</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 템플릿 미리보기 */}
                <div className="bg-yellow-300 text-black p-4 rounded text-sm">
                  <div className="font-medium mb-2">템플릿 디자인 미리보기</div>
                  <div>내지 구성 미리보기</div>
                  <div>글씨체</div>
                  <div>글자크기</div>
                  <div className="font-medium">템플릿 색 선택</div>
                </div>

                {/* 색상 팔레트 */}
                <div className="space-y-2">
                  {colorPalette.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                      {row.map((color) => (
                        <Button
                          key={color}
                          size="icon"
                          variant="ghost"
                          className={`w-6 h-6 rounded border-2 p-0 ${
                            selectedColor === color ? "border-gray-800" : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* 템플릿 옵션 저장 */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm font-medium">옵션 저장</Label>
                    <div className="w-6 h-6 border-2 border-blue-500 rounded flex items-center justify-center">
                      <span className="text-blue-500 font-bold text-sm">✓</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleApply}>
                      적용
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onOpenChange(false)}>
                      닫기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 경고 메시지 */}
          <div className="bg-yellow-300 text-black p-2 rounded text-sm">출력옵션 표시 넣은 부분 안에 진행할지 확인</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
