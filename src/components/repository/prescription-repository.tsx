"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { useRepositoryPrescriptionProblems } from "@/hooks/use-repository"
import { useMyLectures } from "@/hooks/use-lecture"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  ChevronDown, 
  CalendarIcon, 
  List,
  Grid3X3,
  FileText,
  Plus,
  BookOpen
} from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSubjectTitle } from "@/lib/tag-utils"
import { PaperType, clinicName, ProgressState } from "../math-paper/typings"
import PaperModal from "../math-paper/paper-modal"
import { PrescriptionSheet } from "@/components/repository/prescription-sheet"


function PrescriptionRepositoryComponent() {
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
  const [selectedLectureId, setSelectedLectureId] = useState<string | undefined>(undefined)
  const [selectedPaperId, setSelectedPaperId] = useState<string | undefined>();
  const [showPaperModal, setShowPaperModal] = useState(false)


  // 강좌 목록 가져오기
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])


  // 선택된 강좌에 대한 처방 목록 가져오기
  const { data: lecturePapers, isLoading, error } = useRepositoryPrescriptionProblems({
    lectureId: selectedLectureId,
    from: dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined,
    to: dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined,
  })

  // 메모이제이션된 함수들
  const getSubject = useCallback((subjectId: number) => {
    const { title, color, tag } = getSubjectTitle(subjectId);
    return (
      <div className={`text-center ${color}`}>
        {tag}
      </div>
    );
  }, [])

  // API 데이터를 기존 UI 형식으로 변환 (메모이제이션)
  const transformedPrescriptions = useMemo(() => 
    lecturePapers?.map((paper) => ({
      id: paper.lecturePaperId,
      paperRefId: paper.paperRefId,
      paperIndex: paper.paperIndex,
      fullDate: new Date(paper.created),
      date: paper.published ? format(new Date(paper.published), "M월 d일", { locale: ko }) : "",
      subject: getSubject(paper.subjectId),
      subjectId: paper.subjectId,
      bookTitle: paper.bookTitle,
      name: paper.name,
      range: `${paper.rangeFrom}${paper.rangeTo !== paper.rangeFrom ? ` ~ ${paper.rangeTo}` : ""}`,
      type_label: clinicName(paper.type as PaperType),
      type: paper.type,
    })) || [], [lecturePapers, getSubject]
  )

  // 처방전 목록 (API 데이터 사용)
  const prescriptions = transformedPrescriptions

  // 현재 선택된 강좌 정보
  const currentLecture = lectures?.find(l => l.lectureId === selectedLectureId)


  // type별 뱃지 색상
  const getTypeBadgeColor = useCallback((type: PaperType) => {
    switch (type) {
      case PaperType.manual:
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      case PaperType.workbook_addon:
        return "bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
      default:
        return "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
    }
  }, [])


  // 필터링된 처방전 목록
  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) => {
      const matchesSearch = searchTerm === "" || 
        prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.range.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSubject = selectedSubject === "전체" || prescription.subjectId.toString() === selectedSubject
      
      const matchesDateRange = (!dateFrom || prescription.fullDate >= dateFrom) &&
                              (!dateTo || prescription.fullDate <= dateTo)

      return matchesSearch && matchesSubject && matchesDateRange
    })
  }, [prescriptions, searchTerm, selectedSubject, dateFrom, dateTo])

    // 제목 클릭 핸들러 - paperRefId 사용
    const handleTitleClick = useCallback((paperRefId: string) => {
      setSelectedPaperId(paperRefId)
      setShowPaperModal(true)
    }, [])

      // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setShowPaperModal(false)
    setSelectedPaperId(undefined)
  }, [])
  

  // 전체 선택 처리
  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedItems(filteredPrescriptions.map(p => p.id))
    } else {
      setSelectedItems([])
    }
  }, [filteredPrescriptions])

  // 개별 선택 처리
  const handleItemSelect = useCallback((id: string, checked: boolean) => {
    setSelectedItems(prev => {
      const newSelected = checked 
        ? [...prev, id]
        : prev.filter(item => item !== id)
      
      setSelectAll(newSelected.length === filteredPrescriptions.length && filteredPrescriptions.length > 0)
      
      return newSelected
    })
  }, [filteredPrescriptions.length])


  // 스켈레톤 컴포넌트들
  const TableSkeleton = memo(() => (
    <div className="px-6 p-0">
      <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
            <TableRow className="border-b-0">
              <TableHead style={{ width: "48px" }} className="text-center py-2">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "64px" }} className="text-center py-2">
                <Skeleton className="h-4 w-8 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "80px" }} className="text-center py-2">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "60px" }} className="text-center py-2">
                <Skeleton className="h-4 w-10 mx-auto" />
              </TableHead>
              <TableHead className="text-center py-2">
                <Skeleton className="h-4 w-20 mx-auto" />
              </TableHead>
              <TableHead style={{ width: "120px" }} className="text-center py-2">
                <Skeleton className="h-4 w-16 mx-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-4 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-10 mx-auto" />
                </TableCell>
                <TableCell>
                  <div className="px-2 space-y-2">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ))
  TableSkeleton.displayName = 'TableSkeleton'

  const GridSkeleton = memo(() => (
    <div className="px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              {/* 헤더: 과목, 번호, 날짜 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
              
              {/* 제목과 설명 */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
              
              {/* 타입 */}
              <div className="flex items-center justify-start">
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ))
  GridSkeleton.displayName = 'GridSkeleton'

  const FilterSkeleton = memo(() => (
    <div className="mb-2">
      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
              <Skeleton className="h-8 w-8 mx-1" />
              <Skeleton className="h-8 w-8 mx-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
  FilterSkeleton.displayName = 'FilterSkeleton'

  // 로딩 상태
  if (lecturesLoading || (isLoading && selectedLectureId)) {
    return (
      <>
        <FilterSkeleton />
        <div className="flex flex-col gap-6">
          {viewMode === "table" ? <TableSkeleton /> : <GridSkeleton />}
        </div>
      </>
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
    <div className="h-full flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full flex flex-col">
            {/* Filter Section */}
            <div className="mb-2">
              {/* Main Filter Bar */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
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
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {lecture.teacherName} | 학생 {lecture.studentCount}명
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
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-1">
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
            </div>
            <ScrollArea className="h-[calc(100vh-280px)]">
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
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">문제 종류</span>
                            </div>
                          </TableHead>
                          <TableHead style={{ width: "96px" }} className="text-center py-2">
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wide uppercase">배포</span>
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPrescriptions.map((prescription) => (
                          <TableRow key={prescription.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                            <TableCell className="text-center">
                              <Checkbox
                                checked={selectedItems.includes(prescription.id)}
                                onCheckedChange={(checked) => handleItemSelect(prescription.id, !!checked)}
                              />
                            </TableCell>
                            <TableCell className="text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                              #{prescription.paperIndex}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="space-y-1">
                                {prescription.subject}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {prescription.range != 'null' && <div className="text-sm text-gray-600 dark:text-gray-400 break-words whitespace-normal">{prescription.range}</div>}
                                <div 
                                  className={`font-medium text-lg ${prescription.paperRefId ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer hover:underline" : "text-gray-800 dark:text-gray-200"} break-words whitespace-normal`}
                                  onClick={prescription.paperRefId ? () => handleTitleClick(prescription.paperRefId) : undefined}
                                >
                                  <span className="text-lg text-gray-600 dark:text-gray-400 break-words whitespace-normal">{prescription.bookTitle}</span> {prescription.name}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {(prescription.type === PaperType.workbook_addon ||
                                  prescription.type === PaperType.workbook_paper) && (
                                  <BookOpen className="w-4 h-4" />
                                )}
                                {prescription.type === PaperType.academy_contents && (
                                  <BookOpen className="w-4 h-4 text-orange-500" />
                                )}
                                <Badge className={`text-xs ${getTypeBadgeColor(prescription.type)}`}>
                                  {prescription.type_label}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-xs text-gray-600 dark:text-gray-400">
                              {prescription.date}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>
                </div>
              ) : (
                /* Grid View */
                <div className="px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                        <div className="space-y-3">
                          {/* 헤더: 학교급, 번호, 날짜, 더보기 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {prescription.subject}
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">#{prescription.paperIndex}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{prescription.date}</span>
                          </div>

                          {/* 제목과 설명 */}
                          <div className="space-y-1">
                            <h3 className="font-medium text-lg line-clamp-2 text-gray-800 dark:text-gray-200">
                              {prescription.name}
                            </h3>
                            {prescription.range && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{prescription.range}</p>
                            )}
                          </div>

                          {/* 타입 */}
                          <div className="flex items-center justify-start">
                            <Badge className={`text-xs ${getTypeBadgeColor(prescription.type)}`}>
                              {prescription.type_label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 빈 상태 */}
              {filteredPrescriptions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    저장된 처방전이 없습니다
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    새로운 처방전을 생성하거나 필터를 조정해 보세요.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={45}>
          <div className="h-full">
            <PrescriptionSheet 
              selectedItemsCount={selectedItems.length}
              lectureId={selectedLectureId}
              paperIds={selectedItems}
              multiplies={[1, 1, -1, -1]}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* 시험지 보기 모달 */}
      <PaperModal
        isOpen={showPaperModal}
        onClose={handleCloseModal}
        paperId={selectedPaperId}
        useAcademyContents={false}
      />
    </div>
  )
}

// 메모이제이션된 컴포넌트 내보내기
export const PrescriptionRepository = memo(PrescriptionRepositoryComponent)
PrescriptionRepository.displayName = 'PrescriptionRepository'