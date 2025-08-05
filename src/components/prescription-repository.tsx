"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import {
  Search,
  MoreHorizontal,
  Download,
  Eye,
  Edit,
  CalendarIcon,
  ChevronDown,
  Grid3X3,
  List,
  X,
  Filter,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function PrescriptionRepository() {
  const [selectedGrade, setSelectedGrade] = useState("전체")
  const [selectedSubject, setSelectedSubject] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // 컬럼별 필터 상태
  const [columnFilters, setColumnFilters] = useState({
    출제: [] as string[],
    문제종류: [] as string[],
    상태: [] as string[],
  })

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

  const prescriptionData = [
    {
      id: 149,
      date: "7월 11일",
      fullDate: new Date(2025, 6, 11), // 2025년 7월 11일
      subject: "고등",
      category: "공통수학1",
      title: "공통수학1 7월 2주차 DT오답클리닉",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 12,
      easyQuestions: 4,
      mediumQuestions: 6,
      hardQuestions: 2,
      color: "pink",
      grade: "고1",
    },
    {
      id: 138,
      date: "6월 27일",
      fullDate: new Date(2025, 5, 27), // 2025년 6월 27일
      subject: "중등",
      category: "중3",
      title: "중등3학년 1학기 기말고사 대비 '수치증 - 박주환 오답유사클리닉'",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 15,
      easyQuestions: 5,
      mediumQuestions: 8,
      hardQuestions: 2,
      color: "purple",
      grade: "중3",
    },
    {
      id: 137,
      date: "6월 27일",
      fullDate: new Date(2025, 5, 27), // 2025년 6월 27일
      subject: "중등",
      category: "중3",
      title: "중등3학년 1학기 기말대비 - 수업어중 박소현 '오답유사클리닉'",
      type: "기간 유지",
      status: "발행됨",
      examType: "개별시험지",
      totalQuestions: 10,
      easyQuestions: 3,
      mediumQuestions: 5,
      hardQuestions: 2,
      color: "purple",
      grade: "중3",
    },
    {
      id: 134,
      date: "6월 25일",
      fullDate: new Date(2025, 5, 25), // 2025년 6월 25일
      subject: "중등",
      category: "중3",
      title: "중등3학년 1학기 기말대비 - 임현정 '내신대비 클리닉'",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 18,
      easyQuestions: 6,
      mediumQuestions: 9,
      hardQuestions: 3,
      color: "purple",
      grade: "중3",
    },
    {
      id: 133,
      date: "6월 25일",
      fullDate: new Date(2025, 5, 25), // 2025년 6월 25일
      subject: "중등",
      category: "중3",
      title: "중등3학년 1학기 기말대비 대평중 박소율 파이널 - 직전대비",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 14,
      easyQuestions: 4,
      mediumQuestions: 7,
      hardQuestions: 3,
      color: "purple",
      grade: "중3",
    },
    {
      id: 132,
      date: "6월 25일",
      fullDate: new Date(2025, 5, 25), // 2025년 6월 25일
      subject: "중등",
      category: "중3",
      title: "중등3학년 1학기 기말대비 -파이널 직전대비 (포한사)",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 16,
      easyQuestions: 5,
      mediumQuestions: 8,
      hardQuestions: 3,
      color: "purple",
      grade: "중3",
    },
    {
      id: 131,
      date: "6월 24일",
      fullDate: new Date(2025, 5, 24), // 2025년 6월 24일
      subject: "중등",
      category: "중3",
      title: "중등3학년 기말고사 대비 - 파이널 직전대비",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 20,
      easyQuestions: 6,
      mediumQuestions: 10,
      hardQuestions: 4,
      color: "purple",
      grade: "중3",
    },
    {
      id: 129,
      date: "6월 23일",
      fullDate: new Date(2025, 5, 23), // 2025년 6월 23일
      subject: "중등",
      category: "중3",
      title: "중3 이룩중 최수인 - 3차 오답클리닉 학습",
      type: "기간 유지",
      status: "완료",
      examType: "개별시험지",
      totalQuestions: 8,
      easyQuestions: 2,
      mediumQuestions: 4,
      hardQuestions: 2,
      color: "purple",
      grade: "중3",
    },
  ]

  // 컬럼별 고유 값들 추출
  const getUniqueValues = (key: string) => {
    const values = prescriptionData.map((item) => {
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
            className={`h-6 px-2 ${hasActiveFilter ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Filter className="w-3 h-3" />
            {hasActiveFilter && (
              <Badge className="ml-1 bg-blue-100 text-blue-800 text-xs px-1 py-0 h-4">{selectedValues.length}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">{title} 필터</h4>
              {hasActiveFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearColumnFilter(column)}
                  className="h-6 px-2 text-xs text-gray-500"
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
              <div className="text-sm text-gray-500 text-center py-4">필터할 항목이 없습니다</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "고등":
        return "bg-pink-100 text-pink-800"
      case "중등":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-800"
      case "발행됨":
        return "bg-blue-100 text-blue-800"
      case "진행중":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "기간 유지":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPrescriptions = prescriptionData.filter((prescription) => {
    const matchesSearch =
      prescription.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGrade = selectedGrade === "전체" || prescription.grade === selectedGrade
    const matchesSubject = selectedSubject === "전체" || prescription.category === selectedSubject

    // 날짜 필터링
    const matchesDateFrom = !dateFrom || prescription.fullDate >= dateFrom
    const matchesDateTo = !dateTo || prescription.fullDate <= dateTo

    // 컬럼 필터 적용
    const matchesColumnFilters = {
      출제:
        columnFilters.출제.length === 0 ||
        columnFilters.출제.includes(`${prescription.subject} - ${prescription.category}`),
      문제종류: columnFilters.문제종류.length === 0 || columnFilters.문제종류.includes(prescription.type),
      상태: columnFilters.상태.length === 0 || columnFilters.상태.includes(prescription.status),
    }

    return (
      matchesSearch &&
      matchesGrade &&
      matchesSubject &&
      matchesDateFrom &&
      matchesDateTo &&
      Object.values(matchesColumnFilters).every(Boolean)
    )
  })

  const clearDateFilter = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const renderDifficultyGraph = (prescription: any) => (
    <div className="relative group">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all duration-200"
            style={{ width: `${(prescription.easyQuestions / prescription.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-blue-500 transition-all duration-200"
            style={{ width: `${(prescription.mediumQuestions / prescription.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-purple-500 transition-all duration-200"
            style={{ width: `${(prescription.hardQuestions / prescription.totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                쉬움: {prescription.easyQuestions}개 (
                {Math.round((prescription.easyQuestions / prescription.totalQuestions) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                보통: {prescription.mediumQuestions}개 (
                {Math.round((prescription.mediumQuestions / prescription.totalQuestions) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>
                어려움: {prescription.hardQuestions}개 (
                {Math.round((prescription.hardQuestions / prescription.totalQuestions) * 100)}%)
              </span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Filter Section */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mb-6">
        <div className="px-6 p-6">
          <div className="flex items-center justify-between">
            {/* Left side - Grade, Subject and Date filters */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-4 py-2 bg-transparent">
                    <span>학년: {gradeOptions.find((g) => g.value === selectedGrade)?.label}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {gradeOptions.map((grade) => (
                    <DropdownMenuItem
                      key={grade.value}
                      onClick={() => setSelectedGrade(grade.value)}
                      className={selectedGrade === grade.value ? "bg-blue-50" : ""}
                    >
                      {grade.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-4 py-2 bg-transparent">
                    <span>강좌: {subjectOptions.find((s) => s.value === selectedSubject)?.label}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {subjectOptions.map((subject) => (
                    <DropdownMenuItem
                      key={subject.value}
                      onClick={() => setSelectedSubject(subject.value)}
                      className={selectedSubject === subject.value ? "bg-blue-50" : ""}
                    >
                      {subject.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Date Range Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`px-4 py-2 bg-transparent ${dateFrom || dateTo ? "border-blue-500 bg-blue-50" : ""}`}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    <span>
                      {dateFrom || dateTo
                        ? `${dateFrom ? format(dateFrom, "MM/dd", { locale: ko }) : "시작일"} ~ ${
                            dateTo ? format(dateTo, "MM/dd", { locale: ko }) : "종료일"
                          }`
                        : "출제일"}
                    </span>
                    {(dateFrom || dateTo) && (
                      <X
                        className="w-4 h-4 ml-2 hover:bg-blue-200 rounded-full p-0.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearDateFilter()
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <div className="text-sm font-medium text-gray-900">출제일 범위 선택</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">시작일</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "yyyy/MM/dd", { locale: ko }) : "선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                              locale={ko}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">종료일</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "yyyy/MM/dd", { locale: ko }) : "선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus locale={ko} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={clearDateFilter}>
                        초기화
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                            setDateFrom(weekAgo)
                            setDateTo(today)
                          }}
                        >
                          최근 7일
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                            setDateFrom(monthAgo)
                            setDateTo(today)
                          }}
                        >
                          최근 30일
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Search and controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="처방명, 학생명, 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
          <div className="px-6 p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-16 text-center font-semibold">번호</TableHead>
                  <TableHead className="w-24 text-center font-semibold">출제일</TableHead>
                  <TableHead className="w-32 text-center font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      출제
                      {renderColumnFilter("출제", "출제")}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">범위/문제명</TableHead>
                  <TableHead className="w-24 text-center font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      문제 종류
                      {renderColumnFilter("문제종류", "문제 종류")}
                    </div>
                  </TableHead>
                  <TableHead className="w-20 text-center font-semibold">
                    <div className="flex items-center justify-center gap-1">
                      상태
                      {renderColumnFilter("상태", "상태")}
                    </div>
                  </TableHead>
                  <TableHead className="w-32 text-center font-semibold">문항수 (주관식/객관식)</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-center font-medium">{prescription.id}</TableCell>
                    <TableCell className="text-center text-sm text-gray-600">{prescription.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <Badge className={`text-xs ${getSubjectColor(prescription.subject)}`}>
                          {prescription.subject}
                        </Badge>
                        <div className="text-xs text-gray-500">{prescription.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900 leading-tight pr-4 text-base line-clamp-1">
                        {prescription.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${getTypeColor(prescription.type)}`}>{prescription.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs ${getStatusColor(prescription.status)}`}>{prescription.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600 mb-1 text-center">
                          총 {prescription.totalQuestions}문항
                        </div>
                        {renderDifficultyGraph(prescription)}
                        <div className="flex items-center justify-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">쉬움</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">보통</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-600">어려움</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            처방 보기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            수정하기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Download className="mr-2 h-4 w-4" />
                            다운로드
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-lg transition-shadow duration-200">
              <div className="px-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">#{prescription.id}</span>
                    <Badge className={`text-xs ${getSubjectColor(prescription.subject)}`}>{prescription.subject}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        처방 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        수정하기
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        다운로드
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 line-clamp-1">
                    {prescription.title}
                  </h3>
                </div>

                {/* Category and Date */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                  <span>{prescription.category}</span>
                  <span>{prescription.date}</span>
                </div>

                {/* Status and Type */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge className={`text-xs ${getStatusColor(prescription.status)}`}>{prescription.status}</Badge>
                  <Badge className={`text-xs ${getTypeColor(prescription.type)}`}>{prescription.type}</Badge>
                </div>

                {/* Questions Count */}
                <div className="mb-3">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold text-gray-900">{prescription.totalQuestions}</span>
                    <span className="text-sm text-gray-500 ml-1">문항</span>
                  </div>
                </div>

                {/* Difficulty Graph */}
                <div className="space-y-2">
                  {renderDifficultyGraph(prescription)}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">{prescription.easyQuestions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">{prescription.mediumQuestions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">{prescription.hardQuestions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          총 {filteredPrescriptions.length}개의 처방 중 1-{filteredPrescriptions.length}개 표시
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-600 text-white">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            다음
          </Button>
        </div>
      </div>
    </>
  )
}
