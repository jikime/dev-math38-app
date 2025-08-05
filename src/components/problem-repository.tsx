"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
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
    { value: "문제 출제", label: "문제 출제" },
    { value: "단원 오답", label: "단원 오답" },
    { value: "단원 유사", label: "단원 유사" },
    { value: "기간 오답", label: "기간 오답" },
    { value: "기간 유사", label: "기간 유사" },
    { value: "출판교재", label: "출판교재" },
    { value: "교재유사", label: "교재유사" },
    { value: "개인오답", label: "개인오답" },
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

  const problemData = [
    {
      id: 156,
      date: "7월 14일",
      fullDate: new Date(2025, 6, 14),
      subject: "고등",
      category: "공통수학1",
      level: "중3",
      title: "DT - 4회차 7/14(월) 중3) 내신집중-M1 공통수학1 (정명 912호)",
      description: "2.4 여러가지 방정식 ~ 2.4.2 연립방정식",
      type: "문제 출제",
      status: "완료",
      totalQuestions: 15,
      easyQuestions: 6,
      mediumQuestions: 7,
      hardQuestions: 2,
      color: "green",
      grade: "중3",
    },
    {
      id: 148,
      date: "7월 10일",
      fullDate: new Date(2025, 6, 10),
      subject: "고등",
      category: "공통수학1",
      level: "중3",
      title: "DT - 3회차 7/11(금) 중3) 내신집중-M1 공통수학1 (정명 912호)",
      description: "2.4 여러가지 방정식 ~ 2.4.2 연립방정식",
      type: "단원 오답",
      status: "완료",
      totalQuestions: 12,
      easyQuestions: 4,
      mediumQuestions: 6,
      hardQuestions: 2,
      color: "blue",
      grade: "중3",
    },
    {
      id: 145,
      date: "7월 09일",
      fullDate: new Date(2025, 6, 9),
      subject: "고등",
      category: "공통수학1",
      level: "중2",
      title: "DT - 2회차 7/9(수) 중3) 내신집중-M1 공통수학1 (정명 912호)",
      description: "2.4.1 삼차방정식과 사차방정식",
      type: "기간 유사",
      status: "진행중",
      totalQuestions: 10,
      easyQuestions: 3,
      mediumQuestions: 5,
      hardQuestions: 2,
      color: "orange",
      grade: "중3",
    },
    {
      id: 140,
      date: "7월 07일",
      fullDate: new Date(2025, 6, 7),
      subject: "고등",
      category: "공통수학1",
      level: "중1",
      title: "DT - 1회차 7/7(월) 중3) 내신집중-M1 공통수학1 (정명 912호)",
      description: "2.4.1 삼차방정식과 사차방정식",
      type: "출판교재",
      status: "대기중",
      totalQuestions: 8,
      easyQuestions: 2,
      mediumQuestions: 4,
      hardQuestions: 2,
      color: "blue",
      grade: "중3",
    },
    {
      id: 139,
      date: "6월 30일",
      fullDate: new Date(2025, 5, 30),
      subject: "중등",
      category: "중3",
      level: "고1",
      title: "고난도 문제풀이 - 최수인 실전대비",
      description: "3 이차방정식 ~ 4.2.1 이차함수의 활용",
      type: "개인오답",
      status: "완료",
      totalQuestions: 20,
      easyQuestions: 5,
      mediumQuestions: 10,
      hardQuestions: 5,
      color: "purple",
      grade: "고1",
    },
  ]

  // 컬럼별 고유 값들 추출
  const getUniqueValues = (key: string) => {
    const values = problemData.map((item) => {
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
      case "완료":
        return "text-green-600 dark:text-green-400"
      case "진행중":
        return "text-blue-600 dark:text-blue-400"
      case "대기중":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const filteredProblems = problemData.filter((problem) => {
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

  const renderDifficultyGraph = (problem: any) => (
    <div className="relative group">
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all duration-200"
            style={{ width: `${(problem.easyQuestions / problem.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-blue-500 transition-all duration-200"
            style={{ width: `${(problem.mediumQuestions / problem.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-purple-500 transition-all duration-200"
            style={{ width: `${(problem.hardQuestions / problem.totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-popover text-popover-foreground text-xs rounded-lg px-3 py-2 border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                쉬움: {problem.easyQuestions}개 ({Math.round((problem.easyQuestions / problem.totalQuestions) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                보통: {problem.mediumQuestions}개 (
                {Math.round((problem.mediumQuestions / problem.totalQuestions) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>
                어려움: {problem.hardQuestions}개 ({Math.round((problem.hardQuestions / problem.totalQuestions) * 100)}
                %)
              </span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
        </div>
      </div>
    </div>
  )

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
            className={`h-6 px-2 ${hasActiveFilter ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Filter className="w-3 h-3" />
            {hasActiveFilter && (
              <span className="ml-1 text-blue-600 dark:text-blue-400 text-xs px-1">{selectedValues.length}</span>
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

  return (
    <>
      {/* Filter Section */}
      <div className="flex flex-col gap-6 mb-6">
        <div className="px-6 p-6">
          <div className="flex items-center justify-between">
            {/* Left side - Grade, Subject and Date filters */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2">
                    <span>학년: {gradeOptions.find((g) => g.value === selectedGrade)?.label}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {gradeOptions.map((grade) => (
                    <DropdownMenuItem
                      key={grade.value}
                      onClick={() => setSelectedGrade(grade.value)}
                      className={selectedGrade === grade.value ? "bg-accent" : ""}
                    >
                      {grade.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="px-4 py-2">
                    <span>강좌: {subjectOptions.find((s) => s.value === selectedSubject)?.label}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {subjectOptions.map((subject) => (
                    <DropdownMenuItem
                      key={subject.value}
                      onClick={() => setSelectedSubject(subject.value)}
                      className={selectedSubject === subject.value ? "bg-accent" : ""}
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
                    variant="ghost"
                    className="px-4 py-2"
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
                        className="w-4 h-4 ml-2 hover:bg-accent rounded-full p-0.5"
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
                    <div className="text-sm font-medium">출제일 범위 선택</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">시작일</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left font-normal h-8 px-2 hover:bg-accent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateFrom ? format(dateFrom, "yyyy/MM/dd", { locale: ko }) : "선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateFrom}
                              onSelect={setDateFrom}
                              initialFocus
                              locale={ko}
                              className="rounded-md"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">종료일</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left font-normal h-8 px-2 hover:bg-accent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateTo ? format(dateTo, "yyyy/MM/dd", { locale: ko }) : "선택"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar 
                              mode="single" 
                              selected={dateTo} 
                              onSelect={setDateTo} 
                              initialFocus 
                              locale={ko}
                              className="rounded-md" 
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <Button variant="ghost" size="sm" onClick={clearDateFilter} className="h-8">
                        초기화
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                            setDateFrom(weekAgo)
                            setDateTo(today)
                          }}
                          className="h-8 hover:bg-accent"
                        >
                          최근 7일
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const today = new Date()
                            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                            setDateFrom(monthAgo)
                            setDateTo(today)
                          }}
                          className="h-8 hover:bg-accent"
                        >
                          최근 30일
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right side - Search, Filter, and View toggle */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="문제명, 범위, 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 shadow-none"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg p-1">
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
        <div className="flex flex-col gap-6">
          <div className="px-6 p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
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
                  <TableHead className="w-48 text-center font-semibold">문항수 (주관식/객관식)</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProblems.map((problem) => (
                  <TableRow key={problem.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center font-medium">{problem.id}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{problem.date}</TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <span className={`text-xs font-medium ${getSubjectColor(problem.subject)}`}>{problem.subject}</span>
                        <div className="text-xs text-muted-foreground">{problem.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium leading-tight text-base line-clamp-1">
                          {problem.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{problem.description}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {problem.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`text-xs font-medium ${getStatusColor(problem.status)}`}>{problem.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">총 {problem.totalQuestions}문항</span>
                        </div>
                        {renderDifficultyGraph(problem)}
                        <div className="flex items-center justify-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">쉬움</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-muted-foreground">보통</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-muted-foreground">어려움</span>
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
                            문제 보기
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
          {filteredProblems.map((problem) => (
            <div key={problem.id} className="flex flex-col gap-6 p-6 rounded-lg border hover:bg-muted/50 transition-colors duration-200">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">#{problem.id}</span>
                    <span className={`text-xs font-medium ${getSubjectColor(problem.subject)}`}>{problem.subject}</span>
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
                        문제 보기
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

                {/* Title and Description */}
                <div className="mb-4">
                  <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-1">
                    {problem.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{problem.description}</p>
                </div>

                {/* Category and Date */}
                <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                  <span>{problem.category}</span>
                  <span>{problem.date}</span>
                </div>

                {/* Status and Type */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-medium ${getStatusColor(problem.status)}`}>{problem.status}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    {problem.type}
                  </span>
                </div>

                {/* Questions Count */}
                <div className="mb-3">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold">{problem.totalQuestions}</span>
                    <span className="text-sm text-muted-foreground ml-1">문항</span>
                  </div>
                </div>

                {/* Difficulty Graph */}
                <div className="space-y-2">
                  {renderDifficultyGraph(problem)}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-muted-foreground">{problem.easyQuestions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground">{problem.mediumQuestions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-muted-foreground">{problem.hardQuestions}</span>
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
        <div className="text-sm text-muted-foreground">
          총 {filteredProblems.length}개의 문제 중 1-{filteredProblems.length}개 표시
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
          <Button variant="default" size="sm">
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
