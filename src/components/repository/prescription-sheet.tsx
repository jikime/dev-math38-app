"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Grid3X3, List } from "lucide-react"

interface Student {
  id: number
  name: string
  school: string
  totalQuestions: number
  wrongAnswers: number
  partialWrong: number
  partialCorrect: number
  correct: number
}

interface PrescriptionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItemsCount: number
  students: Student[]
}

export function PrescriptionSheet({ 
  open, 
  onOpenChange, 
  selectedItemsCount, 
  students 
}: PrescriptionSheetProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [selectAllStudents, setSelectAllStudents] = useState(false)
  const [isGeneratingStats, setIsGeneratingStats] = useState(true) // 통계 생성 중 상태
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid")
  
  // 필터 상태 - 기본값 설정 (정답만 충족)
  const [wrongAnswerFilter, setWrongAnswerFilter] = useState("미충족")
  const [partialWrongFilter, setPartialWrongFilter] = useState("미충족")
  const [partialCorrectFilter, setPartialCorrectFilter] = useState("미충족") 
  const [correctFilter, setCorrectFilter] = useState("충족")
  
  // 상세 필터 상태
  const [examName, setExamName] = useState("")
  const [questionType, setQuestionType] = useState("전체")
  const [questionCount, setQuestionCount] = useState("")
  const [problemOrder, setProblemOrder] = useState("")

  // 필터링된 학생 목록
  const filteredStudents = students.filter((student) => {
    // 각 카테고리별 점수 기준 
    const wrongAnswerPercentage = Math.round((student.wrongAnswers / student.totalQuestions) * 100)
    const partialWrongPercentage = Math.round((student.partialWrong / student.totalQuestions) * 100)
    const partialCorrectPercentage = Math.round((student.partialCorrect / student.totalQuestions) * 100)
    const correctPercentage = Math.round((student.correct / student.totalQuestions) * 100)

    // 필터 조건 확인 - 더 유연한 기준으로 수정
    const checkFilter = (percentage: number, filter: string) => {
      switch (filter) {
        case "미충족": return percentage < 40  // 40% 미만
        case "충족": return percentage >= 20 && percentage <= 80  // 20-80%
        case "발전": return percentage > 60   // 60% 초과
        default: return true
      }
    }

    return (
      checkFilter(wrongAnswerPercentage, wrongAnswerFilter) &&
      checkFilter(partialWrongPercentage, partialWrongFilter) &&
      checkFilter(partialCorrectPercentage, partialCorrectFilter) &&
      checkFilter(correctPercentage, correctFilter)
    )
  })

  // 학생 체크박스 관련 함수들
  const handleSelectAllStudents = () => {
    if (selectAllStudents) {
      setSelectedStudents([])
      setSelectAllStudents(false)
    } else {
      const allFilteredStudentIds = filteredStudents.map(student => student.id)
      setSelectedStudents(allFilteredStudentIds)
      setSelectAllStudents(true)
    }
  }

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev => {
      const newSelected = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
      
      // 전체 선택 상태 업데이트
      setSelectAllStudents(newSelected.length === filteredStudents.length && filteredStudents.length > 0)
      
      return newSelected
    })
  }

  // 필터가 변경될 때마다 선택 상태 초기화
  useEffect(() => {
    setSelectedStudents([])
    setSelectAllStudents(false)
  }, [wrongAnswerFilter, partialWrongFilter, partialCorrectFilter, correctFilter])

  // Sheet가 열릴 때 통계 생성 시뮬레이션
  useEffect(() => {
    if (open) {
      setIsGeneratingStats(true)
      const timer = setTimeout(() => {
        setIsGeneratingStats(false)
      }, 2500) // 2.5초 로딩
      
      return () => clearTimeout(timer)
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-1/2 !max-w-[50vw] bg-gray-50 dark:bg-gray-950 p-0">
        {isGeneratingStats ? (
          /* 로딩 화면 */
          <>
            <SheetTitle className="sr-only">처방 생성</SheetTitle>
            <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
              <div className="text-center space-y-6">
              {/* 차트 생성 애니메이션 */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                
                {/* 데이터 분석 아이콘들 */}
                <div className="absolute inset-4 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-6 h-6 bg-orange-500 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-6 h-6 bg-yellow-500 rounded animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="w-6 h-6 bg-green-500 rounded animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* 로딩 메시지 */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  처방 통계 생성 중...
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  학생별 성과 데이터를 분석하고 있습니다
                </p>
              </div>
              
              {/* 진행률 바 */}
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-[2500ms] ease-out"
                     style={{ width: '100%', transform: 'translateX(-100%)', animation: 'slide-right 2.5s ease-out forwards' }}>
                </div>
              </div>
              
              {/* 분석 단계 표시 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <span>성과 데이터 분석 중...</span>
                </div>
              </div>
            </div>
            
            {/* Tailwind로 구현하기 어려운 애니메이션을 위한 인라인 스타일 */}
            <style dangerouslySetInnerHTML={{
              __html: `
                @keyframes slide-right {
                  from { transform: translateX(-100%); }
                  to { transform: translateX(0%); }
                }
              `
            }} />
            </div>
          </>
        ) : (
          /* 메인 콘텐츠 */
          <div className="h-full flex flex-col">
          <SheetHeader className="flex-shrink-0 bg-white dark:bg-gray-900 px-6 pt-6 pb-4">
            <SheetTitle className="text-lg">처방 생성</SheetTitle>
            <SheetDescription className="text-sm">
              선택된 {selectedItemsCount}개 항목을 기반으로 처방을 생성합니다.
            </SheetDescription>
            
          </SheetHeader>
          
          {/* 상세 필터 - 항상 표시 */}
          <div className="flex-shrink-0 px-6 py-4 bg-gray-25 dark:bg-gray-950/30 border-b border-gray-200 dark:border-gray-700">
            {/* 시험 정보 및 문제 설정 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap w-16">시험지명</span>
                <Input 
                  placeholder="시험지 이름 입력" 
                  className="h-8 w-48 text-sm"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">출제유형</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-32">
                      <span className="text-sm">{questionType}</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-32">
                    <DropdownMenuItem onClick={() => setQuestionType("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuestionType("객관식")}>객관식</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuestionType("주관식")}>주관식</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setQuestionType("서술형")}>서술형</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">문제수</span>
                <Input 
                  type="number" 
                  placeholder="60" 
                  className="h-8 w-20 text-sm"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                />
              </div>
            </div>
            
            {/* 출제순서 단계별 표시 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap w-16">출제순서</span>
              <div className="flex items-center gap-1">
                <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-medium h-7 flex items-center">
                  <div className="flex items-center justify-center w-4 h-4 bg-blue-500 text-white rounded-full mr-1.5 text-[9px] font-bold">
                    1
                  </div>
                  교과서
                </div>
                
                <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5" />
                
                <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full px-3 py-1 text-xs font-medium h-7 flex items-center">
                  <div className="flex items-center justify-center w-4 h-4 bg-green-500 text-white rounded-full mr-1.5 text-[9px] font-bold">
                    2
                  </div>
                  문제집
                </div>
                
                <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5" />
                
                <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full px-3 py-1 text-xs font-medium h-7 flex items-center">
                  <div className="flex items-center justify-center w-4 h-4 bg-orange-500 text-white rounded-full mr-1.5 text-[9px] font-bold">
                    3
                  </div>
                  기출
                </div>
                
                <ChevronRight className="w-3 h-3 text-gray-400 mx-0.5" />
                
                <div className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full px-3 py-1 text-xs font-medium h-7 flex items-center">
                  <div className="flex items-center justify-center w-4 h-4 bg-purple-500 text-white rounded-full mr-1.5 text-[9px] font-bold">
                    4
                  </div>
                  모의고사
                </div>
              </div>
            </div>
          </div>
          
          {/* 성과 필터 - 한 줄 표시 */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
              {/* 오답 필터 */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">오답</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <span>{wrongAnswerFilter}</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20">
                    <DropdownMenuItem onClick={() => setWrongAnswerFilter("미충족")}>미충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setWrongAnswerFilter("충족")}>충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setWrongAnswerFilter("발전")}>발전</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 부분 오답 필터 */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">부분오답</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <span>{partialWrongFilter}</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20">
                    <DropdownMenuItem onClick={() => setPartialWrongFilter("미충족")}>미충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPartialWrongFilter("충족")}>충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPartialWrongFilter("발전")}>발전</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 부분 정답 필터 */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">부분정답</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <span>{partialCorrectFilter}</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20">
                    <DropdownMenuItem onClick={() => setPartialCorrectFilter("미충족")}>미충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPartialCorrectFilter("충족")}>충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPartialCorrectFilter("발전")}>발전</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 정답 필터 */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">정답</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <span>{correctFilter}</span>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-20">
                    <DropdownMenuItem onClick={() => setCorrectFilter("미충족")}>미충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCorrectFilter("충족")}>충족</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCorrectFilter("발전")}>발전</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              </div>
            </div>
          </div>

          {/* 전체 선택 헤더 - Fixed */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectAllStudents}
                  onCheckedChange={handleSelectAllStudents}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  전체 선택 ({filteredStudents.length}명)
                </span>
                {selectedStudents.length > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {selectedStudents.length}명 선택됨
                  </span>
                )}
              </div>
              
              {/* 뷰 모드 토글 버튼 */}
              <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-md">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-7 px-2"
                >
                  <List className="w-3 h-3 mr-1" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 px-2"
                >
                  <Grid3X3 className="w-3 h-3 mr-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* 출제 버튼 - 선택된 학생이 있을 때만 표시 */}
          {selectedStudents.length > 0 && (
            <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedStudents.length}명의 학생이 선택되었습니다
                  </span>
                </div>
                <Button className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-medium">
                  출제
                </Button>
              </div>
            </div>
          )}

          {/* Student List - Table or Grid View */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {viewMode === "table" ? (
              // Table View
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectAllStudents}
                        onCheckedChange={handleSelectAllStudents}
                      />
                    </TableHead>
                    <TableHead>이름/학교</TableHead>
                    <TableHead className="text-center">출제</TableHead>
                    <TableHead className="text-center">오답</TableHead>
                    <TableHead className="text-center">부분오답</TableHead>
                    <TableHead className="text-center">부분정답</TableHead>
                    <TableHead className="text-center">정답</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleSelectStudent(student.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-sm">{student.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{student.school}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-bold">{student.totalQuestions}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-red-600 dark:text-red-400 font-bold">{student.wrongAnswers}</div>
                        <div className="text-xs text-red-500 dark:text-red-400">
                          {Math.round((student.wrongAnswers / student.totalQuestions) * 100)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-orange-600 dark:text-orange-400 font-bold">{student.partialWrong}</div>
                        <div className="text-xs text-orange-500 dark:text-orange-400">
                          {Math.round((student.partialWrong / student.totalQuestions) * 100)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-yellow-600 dark:text-yellow-500 font-bold">{student.partialCorrect}</div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-500">
                          {Math.round((student.partialCorrect / student.totalQuestions) * 100)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="text-green-600 dark:text-green-400 font-bold">{student.correct}</div>
                        <div className="text-xs text-green-500 dark:text-green-400">
                          {Math.round((student.correct / student.totalQuestions) * 100)}%
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Grid View
              <div className="grid grid-cols-2 gap-3">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* Student Header - Compact */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleSelectStudent(student.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{student.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.school}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{student.totalQuestions}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">총 문항</div>
                      </div>
                    </div>

                    {/* Performance Grid - Compact */}
                    <div className="p-3">
                      <div className="grid grid-cols-4 gap-2">
                        {/* 오답 */}
                        <div className="bg-red-50 dark:bg-red-950/30 rounded p-2 text-center min-w-0">
                          <div className="text-lg font-bold text-red-600 dark:text-red-400">{student.wrongAnswers}</div>
                          <div className="text-xs text-red-500 dark:text-red-400">
                            {Math.round((student.wrongAnswers / student.totalQuestions) * 100)}%
                          </div>
                        </div>

                        {/* 부분오답 */}
                        <div className="bg-orange-50 dark:bg-orange-950/30 rounded p-2 text-center min-w-0">
                          <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{student.partialWrong}</div>
                          <div className="text-xs text-orange-500 dark:text-orange-400">
                            {Math.round((student.partialWrong / student.totalQuestions) * 100)}%
                          </div>
                        </div>

                        {/* 부분정답 */}
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded p-2 text-center min-w-0">
                          <div className="text-lg font-bold text-yellow-600 dark:text-yellow-500">{student.partialCorrect}</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-500">
                            {Math.round((student.partialCorrect / student.totalQuestions) * 100)}%
                          </div>
                        </div>

                        {/* 정답 */}
                        <div className="bg-green-50 dark:bg-green-950/30 rounded p-2 text-center min-w-0">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">{student.correct}</div>
                          <div className="text-xs text-green-500 dark:text-green-400">
                            {Math.round((student.correct / student.totalQuestions) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </SheetContent>
    </Sheet>
  )
}