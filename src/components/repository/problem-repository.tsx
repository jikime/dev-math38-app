"use client"

import { useState } from "react"
import { useRepositoryProblems } from "@/hooks/use-repository"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { PrescriptionSheet } from "@/components/repository/prescription-sheet"
import PaperModal from "@/components/new_paper/PaperModal"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  CalendarIcon,
  ChevronDown,
  Grid3X3,
  List,
  X,
  Copy,
  FileText,
  Loader2,
  Printer,
  CheckSquare,
  Trash2,
} from "lucide-react"

export function ProblemRepository() {
  const [selectedGrade, setSelectedGrade] = useState("전체")
  const [selectedSubject, setSelectedSubject] = useState("전체")
  const [selectedLevel, setSelectedLevel] = useState("전체")
  const [selectedProblemTypes, setSelectedProblemTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showPrescriptionSheet, setShowPrescriptionSheet] = useState(false)
  const [showPaperModal, setShowPaperModal] = useState(false)
  const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>(undefined)

  // 실제 API 호출
  const { data: lecturePapers, isLoading, error } = useRepositoryProblems({
    from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
    to: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
  })

  // 컬럼별 필터 상태
  const [columnFilters, setColumnFilters] = useState({
    출제: [] as string[],
    문제종류: [] as string[],
    상태: [] as string[],
  })

  const levelOptions = [
    { value: "전체", label: "전체" },
    { value: "초4", label: "초등학교 4학년" },
    { value: "초5", label: "초등학교 5학년" },
    { value: "초6", label: "초등학교 6학년" },
    { value: "중1", label: "중학교 1학년" },
    { value: "중2", label: "중학교 2학년" },
    { value: "중3", label: "중학교 3학년" },
    { value: "수(상)", label: "수학(상)" },
    { value: "수(하)", label: "수학(하)" },
  ]

  const problemTypeOptions = [
    { value: "manual", label: "문제 출제" },
    { value: "workbook_paper", label: "단원 오답" },
    { value: "workbook_similar", label: "단원 유사" },
    { value: "addon_ps", label: "기간 오답" },
    { value: "addon_ps", label: "기간 유사" },
    { value: "workbook_paper", label: "출판교재" },
    { value: "workbook_similar", label: "교재유사" },
    { value: "workbook_similar", label: "개인오답" },
    { value: "workbook_similar", label: "학원콘텐츠" },
  ]

  const gradeOptions = [
    { value: "전체", label: "전체" },
    { value: "중1", label: "중학교 1학년" },
    { value: "중2", label: "중학교 2학년" },
    { value: "중3", label: "중학교 3학년" },
    { value: "고1", label: "고등학교 1학년" },
    { value: "고2", label: "고등학교 2학년" },
    { value: "고3", label: "고등학교 3학년" },
  ]

  const subjectOptions = [
    { value: "전체", label: "전체 강좌" },
    { value: "공통수학1", label: "공통수학1" },
    { value: "공통수학2", label: "공통수학2" },
    { value: "수학1", label: "수학1" },
    { value: "수학2", label: "수학2" },
    { value: "미적분", label: "미적분" },
    { value: "확률과통계", label: "확률과 통계" },
    { value: "기하", label: "기하" },
  ]

  const statusOptions = [
    { value: "finished", label: "완료" },
    { value: "ready", label: "준비" },
    { value: "pending", label: "대기" },
    { value: "published", label: "출판" },
  ]

  // API 데이터를 기존 UI 형식으로 변환
  const transformedProblems = lecturePapers?.map((paper) => ({
    id: paper.lecturePaperId,
    paperRefId: paper.paperRefId,
    paperIndex: paper.paperIndex, // 번호로 사용할 paperIndex 추가
    date: format(new Date(paper.created), "M월 d일", { locale: ko }),
    fullDate: new Date(paper.created),
    subject: paper.grade >= 7 ? "고등" : "중등",
    category: paper.bookTitle || "공통수학1",
    level: `${paper.grade === 7 ? "중1" : paper.grade === 8 ? "중2" : paper.grade === 9 ? "중3" : paper.grade === 10 ? "고1" : paper.grade === 11 ? "고2" : "고3"}`,
    title: paper.name,
    description: `${paper.rangeFrom}${paper.rangeTo !== paper.rangeFrom ? ` ~ ${paper.rangeTo}` : ""}`,
    type_label: problemTypeOptions.find(option => option.value === paper.type)?.label || "단원 오답",
    type: paper.type,
    status_label: paper.state === "published" 
      ? `${paper.finishedCount}/${paper.paperCount}`
      : statusOptions.find(option => option.value === paper.state)?.label || "대기중",
    status: paper.state,
    totalQuestions: paper.count,
    easyQuestions: paper.level1 + paper.level2,
    mediumQuestions: paper.level3,
    hardQuestions: paper.level4 + paper.level5,
    color: paper.state === "finished" ? "green" : paper.state === "ready" ? "blue" : "orange",
    grade: `${paper.grade === 7 ? "중1" : paper.grade === 8 ? "중2" : paper.grade === 9 ? "중3" : paper.grade === 10 ? "고1" : paper.grade === 11 ? "고2" : "고3"}`,
    difficulty: paper.difficulty,
    average: paper.average,
  })) || []

  // 컬럼별 고유 값들 추출
  const getUniqueValues = (key: string) => {
    const values = transformedProblems.map((item) => {
      switch (key) {
        case "출제":
          return `${item.subject} - ${item.category}`
        case "문제종류":
          return item.type
        case "상태":
          return item.status
        default:
          return ""
      }
    })
    return [...new Set(values)].filter(Boolean)
  }

  // 컬럼 필터 토글 함수
  const toggleColumnFilter = (column: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: prev[column as keyof typeof prev].includes(value)
        ? prev[column as keyof typeof prev].filter((item) => item !== value)
        : [...prev[column as keyof typeof prev], value],
    }))
  }

  // 컬럼 필터 초기화 함수
  const clearColumnFilter = (column: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: [],
    }))
  }

  const getProgressColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-500"
      case "blue":
        return "bg-blue-500"
      case "orange":
        return "bg-orange-500"
      case "purple":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "고등":
        return "text-pink-600 dark:text-pink-400"
      case "중등":
        return "text-purple-600 dark:text-purple-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished":
        return "text-green-600 dark:text-green-400"
      case "ready":
        return "text-blue-600 dark:text-blue-400"
      case "pending":
        return "text-yellow-600 dark:text-yellow-400"
      case "published":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // type별 뱃지 색상
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "manual":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "workbook_paper":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "workbook_similar":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "addon_ps":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const filteredProblems = transformedProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = selectedGrade === "전체" || problem.grade === selectedGrade
    const matchesSubject = selectedSubject === "전체" || problem.category === selectedSubject
    const matchesLevel = selectedLevel === "전체" || problem.level === selectedLevel
    const matchesProblemType = selectedProblemTypes.length === 0 || selectedProblemTypes.includes(problem.type)

    const matchesDateFrom = !dateFrom || problem.fullDate >= dateFrom
    const matchesDateTo = !dateTo || problem.fullDate <= dateTo

    // 컬럼 필터 적용
    const matchesColumnFilters = {
      출제: columnFilters.출제.length === 0 || columnFilters.출제.includes(`${problem.subject} - ${problem.category}`),
      문제종류: columnFilters.문제종류.length === 0 || columnFilters.문제종류.includes(problem.type),
      상태: columnFilters.상태.length === 0 || columnFilters.상태.includes(problem.status),
    }

    return (
      matchesSearch &&
      matchesGrade &&
      matchesSubject &&
      matchesLevel &&
      matchesProblemType &&
      matchesDateFrom &&
      matchesDateTo &&
      Object.values(matchesColumnFilters).every(Boolean)
    )
  })

  const clearDateFilter = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  // 제목 클릭 핸들러 - paperRefId 사용
  const handleTitleClick = (paperRefId: string) => {
    setSelectedPaperId(paperRefId)
    setShowPaperModal(true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowPaperModal(false)
    setSelectedPaperId(undefined)
  }

  // 체크박스 관련 함수들
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
      setSelectAll(false)
    } else {
      const allIds = filteredProblems.map(problem => problem.id)
      setSelectedItems(allIds)
      setSelectAll(true)
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSelected = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
      
      // 전체 선택 상태 업데이트
      setSelectAll(newSelected.length === filteredProblems.length && filteredProblems.length > 0)
      
      return newSelected
    })
  }

  const renderDifficultyGraph = (problem: any) => {
    const easyPercent = Math.round((problem.easyQuestions / problem.totalQuestions) * 100)
    const mediumPercent = Math.round((problem.mediumQuestions / problem.totalQuestions) * 100)
    const hardPercent = Math.round((problem.hardQuestions / problem.totalQuestions) * 100)
    
    return (
      <div className="relative group">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-green-500 transition-all duration-200"
              style={{ width: `${easyPercent}%` }}
            ></div>
            <div
              className="bg-blue-500 transition-all duration-200"
              style={{ width: `${mediumPercent}%` }}
            ></div>
            <div
              className="bg-purple-500 transition-all duration-200"
              style={{ width: `${hardPercent}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs mt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              {easyPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              {mediumPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">
              {hardPercent}%
            </span>
          </div>
        </div>

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  쉬움: {problem.easyQuestions}개 ({easyPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>
                  보통: {problem.mediumQuestions}개 ({mediumPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>
                  어려움: {problem.hardQuestions}개 ({hardPercent}%)
                </span>
              </div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  // 컬럼 필터 렌더링 함수
  const renderColumnFilter = (column: string, title: string) => {
    const uniqueValues = getUniqueValues(column)
    const selectedValues = columnFilters[column as keyof typeof columnFilters]
    const hasActiveFilter = selectedValues.length > 0

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`h-5 px-1.5 rounded-md transition-all ${
              hasActiveFilter 
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50" 
                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500"
            }`}
          >
            <Filter className="w-3 h-3" />
            {hasActiveFilter && (
              <span className="ml-0.5 text-[10px] font-bold">{selectedValues.length}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0 border-border" align="start">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">{title} 필터</h4>
              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearColumnFilter(column)}
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  초기화
                </Button>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {uniqueValues.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${column}-${value}`}
                    checked={selectedValues.includes(value)}
                    onCheckedChange={() => toggleColumnFilter(column, value)}
                  />
                  <label
                    htmlFor={`${column}-${value}`}
                    className="text-sm cursor-pointer flex-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {value}
                  </label>
                </div>
              ))}
            </div>
            {uniqueValues.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">필터할 항목이 없습니다</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">저장소 데이터를 불러오는 중...</span>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filter Section */}
      <div className="mb-2">
        {/* Main Filter Bar */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="flex items-center justify-between">
            {/* Left side - Main filters */}
            <div className="flex items-center gap-4">
              {/* Course Name */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">강좌</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 px-3 min-w-[180px] justify-between font-normal">
                      <span className="text-sm">교과서 쌍둥이 유사(조혜진)</span>
                      <ChevronDown className="w-4 h-4 ml-2 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[200px]">
                    <DropdownMenuItem>교과서 쌍둥이 유사(조혜진)</DropdownMenuItem>
                    <DropdownMenuItem>기본 수학 과정</DropdownMenuItem>
                    <DropdownMenuItem>심화 수학 과정</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">기간</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-9 px-3 font-normal justify-start text-left min-w-[140px]"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">
                        {dateRange.from && dateRange.to ? (
                          `${format(dateRange.from, "MM/dd", { locale: ko })} ~ ${format(dateRange.to, "MM/dd", { locale: ko })}`
                        ) : dateRange.from ? (
                          `${format(dateRange.from, "MM/dd", { locale: ko })} ~`
                        ) : (
                          "전체"
                        )}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{from: dateRange.from, to: dateRange.to}}
                      onSelect={(range) => {
                        if (range) {
                          setDateRange({from: range.from, to: range.to})
                          setDateFrom(range.from)
                          setDateTo(range.to)
                        } else {
                          setDateRange({from: undefined, to: undefined})
                          setDateFrom(undefined)
                          setDateTo(undefined)
                        }
                      }}
                      locale={ko}
                      className="rounded-md border"
                    />
                    <div className="p-3 border-t flex justify-between items-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setDateRange({from: undefined, to: undefined})
                          setDateFrom(undefined)
                          setDateTo(undefined)
                        }}
                        className="h-8"
                      >
                        전체
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                            setDateRange({from: weekAgo, to: today})
                            setDateFrom(weekAgo)
                            setDateTo(today)
                          }}
                          className="h-8 text-xs"
                        >
                          최근 7일
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                            setDateRange({from: monthAgo, to: today})
                            setDateFrom(monthAgo)
                            setDateTo(today)
                          }}
                          className="h-8 text-xs"
                        >
                          최근 30일
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Right side - Search and View toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                <Input
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9 pr-4 w-64 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-500 rounded-md transition-all duration-200"
                />
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`h-8 px-3 rounded-md transition-all duration-200 ${
                    viewMode === "table" 
                      ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 px-3 rounded-md transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400" 
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Actions Bar - 선택된 항목이 있을 때만 표시 */}
        {selectedItems.length > 0 && (
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedItems.length}개 항목이 선택되었습니다
                </span>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedItems([])
                    setSelectAll(false)
                  }}
                  className="h-7 px-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  선택 해제
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="default"
                  size="sm"
                  className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={() => setShowPrescriptionSheet(true)}
                >
                  처방 생성
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="flex flex-col gap-6">
          <div className="px-6 p-0">
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
                <TableRow className="border-b-0">
                  <TableHead className="w-12 text-center py-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="mx-auto"
                    />
                  </TableHead>
                  <TableHead className="w-16 text-center py-2">
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">번호</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-24 text-center py-2">
                    <div className="flex items-center justify-center gap-1">
                      <CalendarIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">출제일</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-32 text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">출제</span>
                      </div>
                      {renderColumnFilter("출제", "출제")}
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">범위/문제명</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-24 text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문제종류</span>
                      {renderColumnFilter("문제종류", "문제 종류")}
                    </div>
                  </TableHead>
                  <TableHead className="w-20 text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">상태</span>
                      </div>
                      {renderColumnFilter("상태", "상태")}
                    </div>
                  </TableHead>
                  <TableHead className="w-48 text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <Grid3X3 className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문항수 (주관식/객관식)</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProblems.map((problem) => (
                  <TableRow key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedItems.includes(problem.id)}
                        onCheckedChange={() => handleSelectItem(problem.id)}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">{problem.paperIndex}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{problem.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <Badge 
                          variant="secondary" 
                          className={
                            problem.subject === "고등" 
                              ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/50"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                          }
                        >
                          {problem.subject}
                        </Badge>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{problem.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div 
                          className="font-bold text-md text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline"
                          onClick={() => handleTitleClick(problem.paperRefId)}
                        >
                          {problem.title}
                        </div>
                        {problem.description != 'null' && <div className="text-xs text-gray-600 dark:text-gray-400">{problem.description}</div>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                        {problem.type_label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-1 ${getStatusColor(problem.status)}`}>
                        <div className={`w-2 h-2 rounded-full ${getProgressColor(problem.color)}`}></div>
                        <span className="text-sm font-medium">{problem.status_label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {problem.type === "addon_ps" ? (
                          <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">개별시험지</div>
                        ) : (
                          <>
                          {renderDifficultyGraph(problem)}
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                          <span>총 {problem.totalQuestions}문항</span>
                        </div>
                        </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            사본 만들기
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            시험지 수정
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            출력
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="mr-2 h-4 w-4" />
                            답안입력
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View - 테이블과 일치하는 스타일 */
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map((problem) => (
              <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  {/* 헤더: 학교급, 번호, 날짜 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          problem.subject === "고등" 
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 text-xs"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs"
                        }
                      >
                        {problem.subject}
                      </Badge>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">#{problem.paperIndex}</span>
                    </div>
                    <span className="text-xs text-gray-500">{problem.date}</span>
                  </div>

                  {/* 제목과 설명 */}
                  <div className="space-y-1">
                    <h3 
                      className="font-medium text-sm line-clamp-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline"
                      onClick={() => handleTitleClick(problem.id)}
                    >
                      {problem.title}
                    </h3>
                    {problem.description !== 'null' && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{problem.description}</p>
                    )}
                    <div className="text-xs text-gray-500">{problem.category}</div>
                  </div>

                  {/* 타입과 상태 */}
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                      {problem.type_label}
                    </Badge>
                    <div className={`flex items-center gap-1 ${getStatusColor(problem.status)}`}>
                      <div 
                        className={`w-2 h-2 rounded-full ${getProgressColor(problem.color)}`}
                      ></div>
                      <span className="text-xs font-medium">{problem.status_label}</span>
                    </div>
                  </div>

                  {/* 문제 수 또는 개별시험지 표시 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {problem.type === "addon_ps" ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">개별시험지</span>
                    ) : (
                      <>
                        <span>총 {problem.totalQuestions}문항</span>
                        <span>난이도 {problem.difficulty}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {filteredProblems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            저장된 문제가 없습니다
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            새로운 문제를 생성하거나 필터를 조정해 보세요.
          </p>
        </div>
      )}

      {/* 처방전 시트 */}
      <PrescriptionSheet 
        open={showPrescriptionSheet} 
        onOpenChange={setShowPrescriptionSheet}
        selectedItemsCount={selectedItems.length}
        students={[
          {
            id: 1,
            name: "김지민",
            school: "서울고등학교",
            totalQuestions: 15,
            wrongAnswers: 3,
            partialWrong: 2,
            partialCorrect: 4,
            correct: 6,
          },
          {
            id: 2,
            name: "이수진",
            school: "부산여고",
            totalQuestions: 12,
            wrongAnswers: 1,
            partialWrong: 3,
            partialCorrect: 2,
            correct: 6,
          },
          {
            id: 3,
            name: "박민수",
            school: "대구중학교",
            totalQuestions: 18,
            wrongAnswers: 4,
            partialWrong: 1,
            partialCorrect: 5,
            correct: 8,
          },
          {
            id: 4,
            name: "정하영",
            school: "인천고등학교",
            totalQuestions: 20,
            wrongAnswers: 2,
            partialWrong: 4,
            partialCorrect: 6,
            correct: 8,
          },
          {
            id: 5,
            name: "최도현",
            school: "광주과학고",
            totalQuestions: 25,
            wrongAnswers: 5,
            partialWrong: 3,
            partialCorrect: 7,
            correct: 10,
          },
        ]}
      />

      {/* 시험지 보기 모달 */}
      {/* <PaperModal
        paperViewVisible={showPaperModal}
        deselectPaper={handleCloseModal}
        paperId={selectedPaperId}
        useAcademyContents={false}
      /> */}
            <PaperModal
        isOpen={showPaperModal}
        onClose={handleCloseModal}
        paperId={selectedPaperId}
        useAcademyContents={false}
      />
    </>
  )
}