"use client"

import { useState, useEffect } from "react"
import { useRepositoryProblems } from "@/hooks/use-repository"
import { useMyLectures } from "@/hooks/use-lecture"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { PrescriptionSheet } from "@/components/repository/prescription-sheet"
import PaperModal from "@/components/math-paper/PaperModal"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  CalendarIcon,
  ChevronDown,
  Grid3X3,
  List,
  Copy,
  FileText,
  Loader2,
  Printer,
  CheckSquare,
  Trash2,
  BookOpen,
} from "lucide-react"
import { getSubjectTitle } from "@/lib/tag-utils"
import { clinicName, PaperType } from "../math-paper/domains/paper"
import { ProgressState } from "../math-paper/domains/lecture"


export function ProblemRepository() {
  const [selectedSubject, setSelectedSubject] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showPrescriptionSheet, setShowPrescriptionSheet] = useState(false)
  const [showPaperModal, setShowPaperModal] = useState(false)
  const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>(undefined)
  const [selectedLectureId, setSelectedLectureId] = useState<string | undefined>(undefined)

  // 강좌 목록 가져오기
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // 선택된 강좌에 대한 문제 목록 가져오기
  const { data: lecturePapers, isLoading, error } = useRepositoryProblems({
    lectureId: selectedLectureId,
    from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
    to: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
  })

  // 현재 선택된 강좌 정보
  const currentLecture = lectures?.find(l => l.lectureId === selectedLectureId)

  // 컬럼별 필터 상태
  const [columnFilters, setColumnFilters] = useState({
    출제: [] as string[],
    문제종류: [] as string[],
    상태: [] as string[],
  })


  const getSubject = (subjectId: number) => {
    const { title, color, tag } = getSubjectTitle(subjectId);
    return (
      <p className={`text-center ${color}`}>
        {tag}
      </p>
    );
  }

  // API 데이터를 기존 UI 형식으로 변환
  const transformedProblems = lecturePapers?.map((paper) => ({
    id: paper.lecturePaperId,
    paperRefId: paper.paperRefId,
    paperIndex: paper.paperIndex, // 번호로 사용할 paperIndex 추가
    date: format(new Date(paper.created), "M월 d일", { locale: ko }),
    fullDate: new Date(paper.created),
    subject: getSubject(paper.subjectId),
    bookTitle: paper.bookTitle,
    title: paper.name,
    range: `${paper.rangeFrom}${paper.rangeTo !== paper.rangeFrom ? ` ~ ${paper.rangeTo}` : ""}`,
    type_label: clinicName(paper.type as PaperType),
    type: paper.type,
    state: paper.state,
    color: paper.state === ProgressState.finished ? "green" : paper.state === ProgressState.ready ? "blue" : "orange",
    finishedCount: paper.finishedCount,
    paperCount: paper.paperCount,
    totalQuestions: paper.count,
    easyQuestions: paper.level1 + paper.level2,
    mediumQuestions: paper.level3,
    hardQuestions: paper.level4 + paper.level5,
    grade: paper.grade,
    difficulty: paper.difficulty,
    average: paper.average,
    countEasy: paper.countEssay,
    countChoice: paper.countChoice,
  })) || []


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

  const getStatusColor = (state: ProgressState) => {
    switch (state) {
      case ProgressState.finished:
        return "text-green-600 dark:text-green-400"
      case ProgressState.ready:
        return "text-blue-600 dark:text-blue-400"
      case ProgressState.cliniced:
        return "text-yellow-600 dark:text-yellow-400"
      case ProgressState.published:
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  // type별 뱃지 색상
  const getTypeBadgeColor = (type: PaperType) => {
    switch (type) {
      case PaperType.manual:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case PaperType.workbook_addon:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    }
  }


  const PaperStateView = (state: ProgressState, finishedCount: number, paperCount: number) => {
    switch (state) {
      case ProgressState.finished:
        return <span className="text-sm font-medium">완료</span>;
      case ProgressState.published:
        if (finishedCount === 0) {
          return <span className="text-sm font-medium">발행됨</span>;
        } else {
          return (
            <span className="text-sm font-medium">
              {finishedCount} / {paperCount}
            </span>
          );
        }
      case ProgressState.ready:
        if (paperCount > 0) {
          return (
            <span className="text-sm font-medium">
              {finishedCount} / {paperCount}
            </span>
          );
        } else {
          return <span className="text-sm font-medium">준비</span>;
        }
    }
    return <></>;
  };

  const filteredProblems = transformedProblems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.range.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = selectedSubject === "전체" || problem.bookTitle === selectedSubject

    const matchesDateFrom = !dateFrom || problem.fullDate >= dateFrom
    const matchesDateTo = !dateTo || problem.fullDate <= dateTo

    return (
      matchesSearch &&
      matchesSubject &&
      matchesDateFrom &&
      matchesDateTo 
    )
  })

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
      <div className="relative group w-full">
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className="flex h-full">
            {easyPercent > 0 && (
              <div
                className="bg-green-500 transition-all duration-200"
                style={{ width: `${easyPercent}%` }}
              />
            )}
            {mediumPercent > 0 && (
              <div
                className="bg-blue-500 transition-all duration-200"
                style={{ width: `${mediumPercent}%` }}
              />
            )}
            {hardPercent > 0 && (
              <div
                className="bg-purple-500 transition-all duration-200"
                style={{ width: `${hardPercent}%` }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {easyPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {mediumPercent}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-600 dark:text-gray-400">
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

  // 로딩 상태
  if (lecturesLoading || (isLoading && selectedLectureId)) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {lecturesLoading ? '강좌 목록을 불러오는 중...' : '저장소 데이터를 불러오는 중...'}
        </span>
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
                      {lecturesLoading ? (
                        <span className="text-sm">강좌 로딩중...</span>
                      ) : (
                        <span className="text-sm truncate">
                          {currentLecture ? currentLecture.name : '강좌를 선택하세요'}
                        </span>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[280px] max-h-[400px] overflow-y-auto">
                    {lectures && lectures.length > 0 ? (
                      lectures.map((lecture) => (
                        <DropdownMenuItem
                          key={lecture.lectureId}
                          onClick={() => setSelectedLectureId(lecture.lectureId)}
                          className={selectedLectureId === lecture.lectureId ? 'bg-gray-100 dark:bg-gray-800' : ''}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{lecture.name}</span>
                            <span className="text-xs text-gray-500">
                              {lecture.teacherName} | 학생 {lecture.studentCount}명 | 시험지 {lecture.paperCount}개
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        강좌가 없습니다
                      </DropdownMenuItem>
                    )}
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
            <Table className="table-fixed w-full">
              <TableHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
                <TableRow className="border-b-0">
                  <TableHead style={{ width: "48px" }} className="text-center py-2">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                      className="mx-auto"
                    />
                  </TableHead>
                  <TableHead style={{ width: "64px" }} className="text-center py-2">
                    <div className="flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">No.</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "96px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">Date</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "140px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">출제</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">범위/문제명</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "100px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">유형</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "90px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">상태</span>
                      </div>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "180px" }} className="text-center py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문항수 (주관식/객관식)</span>
                    </div>
                  </TableHead>
                  <TableHead style={{ width: "64px" }}></TableHead>
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
                        {problem.subject}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {problem.range != 'null' && <div className="text-sm text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.range}</div>}
                        <div 
                          className="font-medium text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline break-words whitespace-normal"
                          onClick={() => handleTitleClick(problem.paperRefId)}
                        >
                          <span className="text-lg text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.bookTitle}</span> {problem.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {(problem.type === PaperType.workbook_addon ||
                          problem.type === PaperType.workbook_paper) && (
                          <BookOpen className="w-4 h-4" />
                        )}
                        {problem.type === PaperType.academy_contents && (
                          <BookOpen className="w-4 h-4 text-orange-500" />
                        )}
                        <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                          {problem.type_label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-1 ${getStatusColor(problem.state)}`}>
                        {PaperStateView(problem.state, problem.finishedCount, problem.paperCount)}
                      </div>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="space-y-2 w-full">
                        {problem.type === PaperType.addon_ps ? (
                          <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">개별시험지</div>
                        ) : (
                          <>
                            {renderDifficultyGraph(problem)}
                            <div className="flex justify-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                              <span>총 {problem.totalQuestions}문항 ({problem.countEasy}/{problem.countChoice})</span>
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
                        {problem.subject}
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">#{problem.paperIndex}</span>
                    </div>
                    <span className="text-xs text-gray-500">{problem.date}</span>
                  </div>

                  {/* 제목과 설명 */}
                  <div className="space-y-1">
                    <h3 
                      className="font-medium text-lg line-clamp-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline"
                      onClick={() => handleTitleClick(problem.id)}
                    >
                      <span className="text-lg text-gray-600 dark:text-gray-400 break-words whitespace-normal">{problem.bookTitle}</span> {problem.title}
                    </h3>
                    {problem.range !== 'null' && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{problem.range}</p>
                    )}
                  </div>

                  {/* 타입과 상태 */}
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getTypeBadgeColor(problem.type)}`}>
                      {problem.type_label}
                    </Badge>
                    <div className={`flex items-center gap-1 ${getStatusColor(problem.state)}`}>
                      <span className="text-xs font-medium">{PaperStateView(problem.state, problem.finishedCount, problem.paperCount)}</span>
                    </div>
                  </div>

                  {/* 문제 수 또는 개별시험지 표시 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {problem.type === "addon_ps" ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">개별시험지</span>
                    ) : (
                      <>
                        <span>총 {problem.totalQuestions}문항 ({problem.countEasy}/{problem.countChoice})</span>
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