"use client"

import { useState, useEffect, useMemo } from "react"
import { useLectureStudents, usePaperSolveCounts } from "@/hooks/use-repository"
import type { LectureStudentWrongsVO, PaperSolveCountsParams } from "@/types/repository"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronRight, Grid3X3, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  userId: string
  name: string
  email: string
  schoolName: string
  grade: number
  score: number
  // 처방 데이터 (API에서 별도 로드)
  totalQuestions?: number
  wrongAnswers?: number
  partialWrong?: number
  partialCorrect?: number
  correct?: number
  targets?: number
  index?: number
}

// SimpleStudentVO 타입에 맞게 변환
interface ExtendedStudent extends Student {
  // 기본 API 응답 필드들은 이미 Student에 있음
}

interface PrescriptionSheetProps {
  selectedItemsCount: number
  lectureId?: string
  paperIds: string[]
  multiplies?: number[]
}

export function PrescriptionSheet({ 
  selectedItemsCount, 
  lectureId,
  paperIds,
  multiplies = [1, 1, -1, -1]
}: PrescriptionSheetProps) {
  // Props 확인
  console.log('📌 PrescriptionSheet Props:', {
    selectedItemsCount,
    lectureId,
    paperIds,
    paperIdsLength: paperIds?.length,
    multiplies
  })
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectAllStudents, setSelectAllStudents] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [students, setStudents] = useState<Student[]>([])
  
  // 오답 설정 상태 (multiplies 배열: [오답, 부분오답, 부분정답, 정답])
  const [wrongAnswerMultiplies, setWrongAnswerMultiplies] = useState<number[]>(multiplies)
  
  // multiplies가 변경될 때 동기화
  useEffect(() => {
    setWrongAnswerMultiplies(multiplies)
  }, [multiplies])
  
  const setMultiply = (index: number, value: number) => {
    const newMultiplies = [...wrongAnswerMultiplies]
    newMultiplies[index] = value
    setWrongAnswerMultiplies(newMultiplies)
  }
  
  // 상세 필터 상태
  const [examName, setExamName] = useState("")
  const [questionType, setQuestionType] = useState("전체")
  const [questionCount, setQuestionCount] = useState("60")
  const [problemOrder, setProblemOrder] = useState("chapter")
  const [categories, setCategories] = useState<string[]>(["교과서", "문제집", "기출", "모의고사"])

  // 학생 목록 가져오기 (React Query 사용)
  const { data: studentList, isLoading, error } = useLectureStudents(lectureId || "")

  // 선택된 학생들의 성과 데이터 가져오기 - 선택된 학생이 있을 때만 API 호출
  const paperSolveCountsParams: PaperSolveCountsParams | null = useMemo(() => {
    // 선택된 학생이 없으면 API 호출하지 않음
    if (!lectureId || selectedStudents.length === 0) {
      console.log('❌ API 호출 조건 미충족:', {
        lectureId: !!lectureId,
        selectedStudentsCount: selectedStudents.length,
        paperIdsCount: paperIds?.length || 0,
        reason: !lectureId ? 'No lectureId' : 'No selected students'
      })
      return null
    }
    
    // paperIds가 없으면 빈 배열로 처리
    const finalPaperIds = paperIds && paperIds.length > 0 ? paperIds : []
    
    const params = {
      lectureId,
      studentIds: selectedStudents,
      paperIds: finalPaperIds
    }
    
    console.log('✅ API 호출 파라미터 생성:', {
      lectureId,
      selectedStudentIds: selectedStudents,
      paperCount: finalPaperIds.length,
      params
    })
    
    return params
  }, [lectureId, selectedStudents, paperIds])

  const { data: studentSolveCounts, isLoading: solveCountsLoading, error: solveCountsError, refetch: refetchSolveCounts } = usePaperSolveCounts(paperSolveCountsParams)
  
  // API 호출 상태 로깅
  useEffect(() => {
    if (paperSolveCountsParams) {
      if (solveCountsLoading) {
        console.log('⏳ API 호출 중...')
      } else if (solveCountsError) {
        console.error('❌ API 호출 실패:', solveCountsError)
      } else if (studentSolveCounts) {
        console.log('✅ API 응답 수신:', studentSolveCounts)
      }
    }
  }, [paperSolveCountsParams, solveCountsLoading, solveCountsError, studentSolveCounts])

  // 학생 데이터 처리 (실제 API 데이터 기반)
  const studentsWithIndex = useMemo(() => {
    if (!studentList) return []

    // 선택된 학생들의 데이터 로딩 상태 체크
    if (selectedStudents.length > 0) {
      if (solveCountsLoading) {
        console.log('⏳ 선택된 학생들의 성과 데이터 로딩 중...')
      } else if (studentSolveCounts) {
        console.log('✅ 성과 데이터 로드 완료:', Object.keys(studentSolveCounts.studentSkillSolveCountMap).length + '명')
      }
    }

    return studentList.map((student, index) => {
      let correct2 = 0
      let correct1 = 0  
      let wrong1 = 0
      let wrong2 = 0

      // API에서 가져온 성과 데이터가 있으면 사용
      if (studentSolveCounts && selectedStudents.includes(student.userId)) {
        const skillSolveCounts = studentSolveCounts.studentSkillSolveCountMap[student.userId]
        if (skillSolveCounts) {
          Object.values(skillSolveCounts).forEach((skillCount) => {
            if (skillCount.solveCounts) {
              if (skillCount.solveCounts[0]) correct2 += skillCount.solveCounts[0]
              if (skillCount.solveCounts[1]) correct1 += skillCount.solveCounts[1] 
              if (skillCount.solveCounts[2]) wrong1 += skillCount.solveCounts[2]
              if (skillCount.solveCounts[3]) wrong2 += skillCount.solveCounts[3]
            }
          })
        }
      }

      const totalQuestions = correct2 + correct1 + wrong1 + wrong2
      
      // targets 계산 (multiplies 기반)
      const targets = 
        (wrongAnswerMultiplies[0] < 0 ? 0 : wrongAnswerMultiplies[0] * wrong2) +    // 오답
        (wrongAnswerMultiplies[1] < 0 ? 0 : wrongAnswerMultiplies[1] * wrong1) +    // 부분오답
        (wrongAnswerMultiplies[2] < 0 ? 0 : wrongAnswerMultiplies[2] * correct1) +  // 부분정답
        (wrongAnswerMultiplies[3] < 0 ? 0 : wrongAnswerMultiplies[3] * correct2) +  // 정답
        // multiplies가 0인 경우 (재출제)
        (wrongAnswerMultiplies[0] === 0 ? wrong2 : 0) +
        (wrongAnswerMultiplies[1] === 0 ? wrong1 : 0) +
        (wrongAnswerMultiplies[2] === 0 ? correct1 : 0) +
        (wrongAnswerMultiplies[3] === 0 ? correct2 : 0)
      
      return {
        ...student,
        index: index + 1,
        totalQuestions,
        wrongAnswers: wrong2,    // 오답
        partialWrong: wrong1,    // 부분오답
        partialCorrect: correct1, // 부분정답
        correct: correct2,       // 정답
        targets
      }
    }) as ExtendedStudent[]
  }, [studentList, studentSolveCounts, selectedStudents, wrongAnswerMultiplies, solveCountsLoading])

  // 필터링된 학생 목록 (오답 설정 기반)
  const filteredStudents = studentsWithIndex.filter((student) => {
    if (!student.totalQuestions) return true // 데이터 없으면 모두 표시
    
    // 각 카테고리별 문제 수
    const wrongAnswerCount = student.wrongAnswers || 0
    const partialWrongCount = student.partialWrong || 0  
    const partialCorrectCount = student.partialCorrect || 0
    const correctCount = student.correct || 0
    
    // multiplies에 따른 필터링 (음수면 해당 카테고리 제외)
    const includeWrongAnswer = wrongAnswerMultiplies[0] >= 0 && wrongAnswerCount > 0
    const includePartialWrong = wrongAnswerMultiplies[1] >= 0 && partialWrongCount > 0
    const includePartialCorrect = wrongAnswerMultiplies[2] >= 0 && partialCorrectCount > 0
    const includeCorrect = wrongAnswerMultiplies[3] >= 0 && correctCount > 0
    
    // 하나라도 출제 대상이면 표시
    return includeWrongAnswer || includePartialWrong || includePartialCorrect || includeCorrect
  })

  // 학생 체크박스 관련 함수들
  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      const allFilteredStudentIds = filteredStudents.map(student => student.userId)
      console.log('✅ 전체 학생 선택:', allFilteredStudentIds.length + '명')
      setSelectedStudents(allFilteredStudentIds)
      setSelectAllStudents(true)
    } else {
      console.log('❌ 전체 학생 선택 해제')
      setSelectedStudents([])
      setSelectAllStudents(false)
    }
  }

  const handleSelectStudent = (userId: string, checked: boolean) => {
    let newSelectedIds: string[]
    if (checked) {
      newSelectedIds = [...selectedStudents, userId]
      console.log('✅ 학생 선택 추가:', userId, '총', newSelectedIds.length + '명')
    } else {
      newSelectedIds = selectedStudents.filter(id => id !== userId)
      console.log('❌ 학생 선택 제거:', userId, '총', newSelectedIds.length + '명')
    }
    setSelectedStudents(newSelectedIds)
    setSelectAllStudents(newSelectedIds.length === filteredStudents.length && filteredStudents.length > 0)
  }

  // 비율 계산 함수
  const ratio = (value: number, total: number) => {
    if (total === 0) return "0%"
    return ((value / total) * 100).toFixed(0) + "%"
  }

  // multiplies가 변경될 때마다 선택 상태 초기화
  useEffect(() => {
    setSelectedStudents([])
    setSelectAllStudents(false)
  }, [wrongAnswerMultiplies])


  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 p-0">
      {/* 메인 콘텐츠 */}
      <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-6 pt-6 pb-4">
            <h2 className="text-lg font-semibold">처방 생성</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              선택된 {selectedItemsCount}개 항목을 기반으로 처방을 생성합니다.
            </p>
            
            {/* 에러 표시 */}
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded">
                학생 목록을 불러오는 중 오류가 발생했습니다.
              </div>
            )}
          </div>
          
          {/* 상세 필터 - 항상 표시 */}
          <div className="flex-shrink-0 px-6 py-4 bg-gray-25 dark:bg-gray-950/30 border-b border-gray-200 dark:border-gray-700">
            {/* 시험 정보 및 문제 설정 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center gap-2 min-w-0 flex-1 min-w-[200px]">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap flex-shrink-0">시험지명</span>
                <Input 
                  placeholder="시험지 이름 입력" 
                  className="h-8 text-sm min-w-0 flex-1"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">원본출제유형</span>
                <Select value={problemOrder} onValueChange={setProblemOrder}>
                  <SelectTrigger className="w-28 sm:w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapter">단원 순서</SelectItem>
                    <SelectItem value="leveldesc">높은 난이도</SelectItem>
                    <SelectItem value="levelasc">낮은 난이도</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">최대 문제수</span>
                <Input 
                  type="number" 
                  className="h-8 w-16 sm:w-20 text-sm"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(e.target.value)}
                />
              </div>
            </div>
            
            {/* 출제순서 단계별 표시 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap flex-shrink-0">출제순서</span>
              <div className="flex flex-wrap items-center gap-1">
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
          
          {/* 오답 설정 - WrongAnswerSettings 스타일 */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {/* 2x2 그리드로 배치, 각 항목은 라벨(위) + 선택박스(아래) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 오답 설정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">오답</span>
                </div>
                <Select
                  value={wrongAnswerMultiplies[0].toString()}
                  onValueChange={(value) => setMultiply(0, Number(value))}
                >
                  <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">유사 x1</SelectItem>
                    <SelectItem value="2">유사 x2</SelectItem>
                    <SelectItem value="3">유사 x3</SelectItem>
                    <SelectItem value="0">재출제</SelectItem>
                    <SelectItem value="-1">미출제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 부분 오답 설정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">부분오답</span>
                </div>
                <Select
                  value={wrongAnswerMultiplies[1].toString()}
                  onValueChange={(value) => setMultiply(1, Number(value))}
                >
                  <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">유사 x1</SelectItem>
                    <SelectItem value="2">유사 x2</SelectItem>
                    <SelectItem value="3">유사 x3</SelectItem>
                    <SelectItem value="0">재출제</SelectItem>
                    <SelectItem value="-1">미출제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 부분 정답 설정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">부분정답</span>
                </div>
                <Select
                  value={wrongAnswerMultiplies[2].toString()}
                  onValueChange={(value) => setMultiply(2, Number(value))}
                >
                  <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">유사 x1</SelectItem>
                    <SelectItem value="2">유사 x2</SelectItem>
                    <SelectItem value="3">유사 x3</SelectItem>
                    <SelectItem value="0">재출제</SelectItem>
                    <SelectItem value="-1">미출제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* 정답 설정 */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">정답</span>
                </div>
                <Select
                  value={wrongAnswerMultiplies[3].toString()}
                  onValueChange={(value) => setMultiply(3, Number(value))}
                >
                  <SelectTrigger className="w-[90px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">발전</SelectItem>
                    <SelectItem value="-1">미출제</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 전체 선택 헤더 - Fixed */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Checkbox
                  checked={selectAllStudents}
                  onCheckedChange={handleSelectAllStudents}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  전체 선택 ({filteredStudents.length}명)
                </span>
                {selectedStudents.length > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap">
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
                  <List className="w-3 h-3" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-7 px-2"
                >
                  <Grid3X3 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* 출제 버튼 - 선택된 학생이 있을 때만 표시 */}
          {selectedStudents.length > 0 && (
            <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedStudents.length}명의 학생이 선택되었습니다
                  </span>
                </div>
                <Button className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-medium w-full sm:w-auto">
                  출제
                </Button>
              </div>
            </div>
          )}

          {/* Student List - Table or Grid View */}
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3">
            {viewMode === "table" ? (
              // Table View
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader className="sticky top-0 bg-slate-50 z-10">
                    <TableRow>
                      <TableHead className="w-12 text-center">번호</TableHead>
                      <TableHead className="w-10 text-center">
                        <Checkbox
                          checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                          onCheckedChange={handleSelectAllStudents}
                        />
                      </TableHead>
                      <TableHead className="w-20">이름 / 학교</TableHead>
                      <TableHead className="w-12 text-center">출제</TableHead>
                      <TableHead className="w-14 text-center">오답</TableHead>
                      <TableHead className="w-14 text-center hidden sm:table-cell">부분오답</TableHead>
                      <TableHead className="w-14 text-center hidden sm:table-cell">부분정답</TableHead>
                      <TableHead className="w-14 text-center">정답</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow 
                      key={student.userId} 
                      className={cn(
                        selectedStudents.includes(student.userId) && "bg-slate-50",
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                    >
                      <TableCell className="text-center text-sm">
                        {student.index}
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedStudents.includes(student.userId)}
                          onCheckedChange={(checked) => handleSelectStudent(student.userId, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="min-w-0">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium truncate">{student.name}</div>
                          <div className="text-xs text-gray-500 truncate">{student.schoolName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {selectedStudents.includes(student.userId) && (
                          solveCountsLoading ? (
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : (
                            <div className="text-red-500 font-bold">
                              {student.targets || 0}
                            </div>
                          )
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {selectedStudents.includes(student.userId) && (
                          solveCountsLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : student.totalQuestions ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{ratio(student.wrongAnswers || 0, student.totalQuestions)}</span>
                              <span className="text-gray-500">({student.wrongAnswers || 0})</span>
                            </div>
                          ) : null
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs hidden sm:table-cell">
                        {selectedStudents.includes(student.userId) && (
                          solveCountsLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : student.totalQuestions ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{ratio(student.partialWrong || 0, student.totalQuestions)}</span>
                              <span className="text-gray-500">({student.partialWrong || 0})</span>
                            </div>
                          ) : null
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs hidden sm:table-cell">
                        {selectedStudents.includes(student.userId) && (
                          solveCountsLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : student.totalQuestions ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{ratio(student.partialCorrect || 0, student.totalQuestions)}</span>
                              <span className="text-gray-500">({student.partialCorrect || 0})</span>
                            </div>
                          ) : null
                        )}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {selectedStudents.includes(student.userId) && (
                          solveCountsLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          ) : student.totalQuestions ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{ratio(student.correct || 0, student.totalQuestions)}</span>
                              <span className="text-gray-500">({student.correct || 0})</span>
                            </div>
                          ) : null
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredStudents.map((student) => (
                  <div key={student.userId} className={cn(
                    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    selectedStudents.includes(student.userId) && "bg-slate-50"
                  )}>
                    {/* Student Header - Compact */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Checkbox
                          checked={selectedStudents.includes(student.userId)}
                          onCheckedChange={(checked) => handleSelectStudent(student.userId, checked as boolean)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{student.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.schoolName}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{student.index}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">번호</div>
                      </div>
                    </div>

                    {/* Performance Grid - Only show when selected */}
                    {selectedStudents.includes(student.userId) && (
                      <div className="p-3">
                        {solveCountsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-sm text-gray-500">데이터 로딩중...</span>
                          </div>
                        ) : student.totalQuestions ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {/* 오답 */}
                          <div className="bg-red-50 dark:bg-red-950/30 rounded p-2 text-center min-w-0">
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">{student.wrongAnswers || 0}</div>
                            <div className="text-xs text-red-500 dark:text-red-400">
                              {ratio(student.wrongAnswers || 0, student.totalQuestions)}
                            </div>
                          </div>

                          {/* 부분오답 */}
                          <div className="bg-orange-50 dark:bg-orange-950/30 rounded p-2 text-center min-w-0">
                            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{student.partialWrong || 0}</div>
                            <div className="text-xs text-orange-500 dark:text-orange-400">
                              {ratio(student.partialWrong || 0, student.totalQuestions)}
                            </div>
                          </div>

                          {/* 부분정답 */}
                          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded p-2 text-center min-w-0">
                            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-500">{student.partialCorrect || 0}</div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-500">
                              {ratio(student.partialCorrect || 0, student.totalQuestions)}
                            </div>
                          </div>

                          {/* 정답 */}
                          <div className="bg-green-50 dark:bg-green-950/30 rounded p-2 text-center min-w-0">
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">{student.correct || 0}</div>
                            <div className="text-xs text-green-500 dark:text-green-400">
                              {ratio(student.correct || 0, student.totalQuestions)}
                            </div>
                          </div>
                          </div>
                        ) : (
                          <div className="p-3 text-center text-sm text-gray-500">
                            선택하면 성과 데이터가 표시됩니다
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  )
}