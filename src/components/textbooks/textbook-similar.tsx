"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, BookOpen, FileText, Plus, ChevronLeft, ChevronRight, Search } from "lucide-react"

export function TextbookSimilar() {
  const [selectedCourse, setSelectedCourse] = useState("교과서 쌍둥이 유사(이정연)")
  const [selectedProcess, setSelectedProcess] = useState("전체")
  const [selectedSemester, setSelectedSemester] = useState("전체")
  const [instantDistribution, setInstantDistribution] = useState(true)
  const [selectedTextbook, setSelectedTextbook] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedPages, setSelectedPages] = useState<number[]>([7, 8, 9, 10])
  const [selectedProblems, setSelectedProblems] = useState<number[]>([])
  const [pageRangeStart, setPageRangeStart] = useState("7")
  const [pageRangeEnd, setPageRangeEnd] = useState("10")
  // 페이지 네비게이션 단순화를 위해 그룹 이동 상태 제거
  const [textbookQuery, setTextbookQuery] = useState("")
  const [unitQuery, setUnitQuery] = useState("")

  const courseOptions = ["교과서 쌍둥이 유사(이정연)", "개념원리 RPM 수학", "쎈 수학 시리즈", "일품 수학"]
  const processOptions = ["전체", "공통수학1", "공통수학2", "수학1", "수학2", "미적분", "확률과통계", "기하"]
  const semesterOptions = ["전체", "1학기", "2학기"]

  // 교재 정보 데이터 (교재명, 단원수만)
  const textbookData = [
    { name: "[중2 1학기] 수학의 바이블(유형)", unitCount: 1, selected: true },
    { name: "[중2 1학기] 일품", unitCount: 4, selected: false },
    { name: "[중2 2학기] 일품", unitCount: 13, selected: false },
    { name: "[중2 1학기] 해결의 법칙(유형)", unitCount: 9, selected: false },
    { name: "[중2 2학기] 해결의 법칙(유형)", unitCount: 10, selected: false },
    { name: "[중2 1학기] 수학의 힘(개념편)", unitCount: 5, selected: false },
    { name: "[중2 1학기] 수학의 힘(유형편)", unitCount: 10, selected: false },
    { name: "[중2 1학기] 올리드 유형완성", unitCount: 7, selected: false },
    { name: "[중2 1학기] 수학익스터 유형편", unitCount: 6, selected: false },
    { name: "[중2 1학기] 렌즈", unitCount: 11, selected: false },
    { name: "[중2 1학기] 수학의 바이블(유형)", unitCount: 5, selected: false },
    { name: "[중2 1학기] 해결의 법칙(개념)", unitCount: 9, selected: false },
    { name: "[중2 2학기] 수학의 힘(개념편)", unitCount: 4, selected: false },
    { name: "[중2 2학기] 수학의 힘(유형편)", unitCount: 10, selected: false },
    { name: "[중2 2학기] 베이직 편", unitCount: 4, selected: false },
  ]

  // 단원 정보 데이터 (교재별 단원 목록)
  const unitsByTextbook: Record<string, Array<{ session: number; unitName: string; problemCount: number }>> = {
    "[중2 1학기] 수학의 바이블(유형)": [
      { session: 1, unitName: "나머지정리와 인수분해", problemCount: 278 },
    ],
    "[중2 1학기] 일품": [
      { session: 1, unitName: "유리수와 소수", problemCount: 150 },
      { session: 2, unitName: "순환소수의 표현", problemCount: 180 },
      { session: 3, unitName: "분수의 유한소수화", problemCount: 160 },
      { session: 4, unitName: "소수의 성질", problemCount: 140 },
    ],
    "[중2 2학기] 일품": [
      { session: 1, unitName: "다항식의 연산", problemCount: 220 },
      { session: 2, unitName: "인수분해", problemCount: 240 },
      { session: 3, unitName: "일차방정식", problemCount: 200 },
    ],
    "[중2 1학기] 해결의 법칙(유형)": [
      { session: 1, unitName: "자연수와 정수", problemCount: 120 },
      { session: 2, unitName: "유리수", problemCount: 130 },
      { session: 3, unitName: "무리수", problemCount: 140 },
    ],
  }

  // 페이지 번호 데이터 (7-49)
  const pageNumbers = Array.from({ length: 43 }, (_, i) => i + 7)

  // 문제 데이터
  const problemData = [
    {
      id: 1,
      order: 1,
      page: 7,
      problem: 1,
      type: "A01. 유한소수, 무한소수 구별하기",
      difficulty: "하",
      cognitiveArea: "인지영역",
    },
    {
      id: 2,
      order: 2,
      page: 7,
      problem: 2,
      type: "A02. 순환소수의 표현",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
    {
      id: 3,
      order: 3,
      page: 7,
      problem: 3,
      type: "A02. 순환소수의 표현",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
    {
      id: 4,
      order: 4,
      page: 7,
      problem: 4,
      type: "A12. 분수를 유한소수로 나타내기 - 분모를 10의 거듭제곱의 꼴로 나타내기",
      difficulty: "상",
      cognitiveArea: "인지영역",
    },
    {
      id: 5,
      order: 5,
      page: 7,
      problem: 5,
      type: "A11. 유한소수로 나타낼 수 있는 분수",
      difficulty: "하",
      cognitiveArea: "인지영역",
    },
    {
      id: 6,
      order: 6,
      page: 7,
      problem: 6,
      type: "A04. 순환소수의 표현 - 분수",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
    {
      id: 7,
      order: 7,
      page: 7,
      problem: 7,
      type: "A04. 순환소수의 표현 - 분수",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
    {
      id: 8,
      order: 8,
      page: 7,
      problem: 8,
      type: "A36. 유리수와 소수의 관계 - 옳은 것 또는 옳지 않은 것 찾기",
      difficulty: "상",
      cognitiveArea: "인지영역",
    },
    {
      id: 9,
      order: 9,
      page: 8,
      problem: 9,
      type: "A01. 유한소수, 무한소수 구별하기",
      difficulty: "하",
      cognitiveArea: "인지영역",
    },
    {
      id: 10,
      order: 10,
      page: 8,
      problem: 10,
      type: "A01. 유한소수, 무한소수 구별하기",
      difficulty: "하",
      cognitiveArea: "인지영역",
    },
    {
      id: 11,
      order: 11,
      page: 8,
      problem: 11,
      type: "A01. 유한소수, 무한소수 구별하기",
      difficulty: "하",
      cognitiveArea: "인지영역",
    },
    {
      id: 12,
      order: 12,
      page: 8,
      problem: 12,
      type: "A14. 분수를 유한소수로 나타내기 - 계산과정",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
    {
      id: 13,
      order: 13,
      page: 8,
      problem: 13,
      type: "A12. 분수를 유한소수로 나타내기 - 분모를 10의 거듭제곱의 꼴로 나타내기",
      difficulty: "상",
      cognitiveArea: "인지영역",
    },
    {
      id: 14,
      order: 14,
      page: 8,
      problem: 14,
      type: "A14. 분수를 유한소수로 나타내기 - 계산과정",
      difficulty: "중",
      cognitiveArea: "인지영역",
    },
  ]

  const togglePage = (pageNumber: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNumber) ? prev.filter((p) => p !== pageNumber) : [...prev, pageNumber],
    )
  }

  const toggleProblem = (problemId: number) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId) ? prev.filter((p) => p !== problemId) : [...prev, problemId],
    )
  }

  const selectAllPages = () => {
    setSelectedPages(pageNumbers)
  }

  const clearAllPages = () => {
    setSelectedPages([])
  }

  const selectPageRange = () => {
    const start = Number.parseInt(pageRangeStart)
    const end = Number.parseInt(pageRangeEnd)
    if (start && end && start <= end) {
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
      const validRange = range.filter((page) => pageNumbers.includes(page))
      setSelectedPages((prev) => [...new Set([...prev, ...validRange])])
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "상":
        return "bg-red-100 text-red-800"
      case "중":
        return "bg-blue-100 text-blue-800"
      case "하":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTextbooks = textbookData.filter((t) =>
    textbookQuery.trim() === "" ? true : t.name.toLowerCase().includes(textbookQuery.toLowerCase()),
  )
  const selectedUnitsRaw = selectedTextbook ? unitsByTextbook[selectedTextbook] ?? [] : []
  const filteredUnits = selectedUnitsRaw.filter((u) =>
    unitQuery.trim() === "" ? true : u.unitName.toLowerCase().includes(unitQuery.toLowerCase()),
  )
  const filteredProblems = problemData.filter((problem) => selectedPages.includes(problem.page))
  const allVisibleProblemsSelected =
    filteredProblems.length > 0 && filteredProblems.every((p) => selectedProblems.includes(p.id))
  const toggleAllFilteredProblems = (checked: boolean) => {
    if (filteredProblems.length === 0) return
    const ids = filteredProblems.map((p) => p.id)
    if (checked) {
      setSelectedProblems((prev) => Array.from(new Set([...prev, ...ids])))
    } else {
      setSelectedProblems((prev) => prev.filter((id) => !ids.includes(id)))
    }
  }

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header - Flat */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold mb-2">출판교재 유사</h1>
        <p className="text-muted-foreground">출판교재에서 유사한 문제를 찾아 활용하세요</p>
      </div>

      {/* Filter Section - Flat */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">강좌명</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2">
                  <span className="truncate max-w-[240px]">{selectedCourse}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                {courseOptions.map((course) => (
                  <DropdownMenuItem key={course} onClick={() => setSelectedCourse(course)}>
                    {course}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">과정</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2">
                  <span>{selectedProcess}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {processOptions.map((process) => (
                  <DropdownMenuItem key={process} onClick={() => setSelectedProcess(process)}>
                    {process}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">학기</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-2">
                  <span>{selectedSemester}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {semesterOptions.map((semester) => (
                  <DropdownMenuItem key={semester} onClick={() => setSelectedSemester(semester)}>
                    {semester}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Checkbox
              id="instant-distribution"
              checked={instantDistribution}
              onCheckedChange={setInstantDistribution}
            />
            <label htmlFor="instant-distribution" className="text-sm">학생들에게 즉시 배포</label>
            <Button variant="default" className="h-8">
              <FileText className="w-4 h-4 mr-1" /> 유사문제 생성
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:grid-cols-12">
        {/* 1단계/2단계 - 좌측 패널에서 단계 전환 (Flat) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="flex flex-col h-[600px]">
            <div className="px-2 pb-2">
              {selectedTextbook ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => {
                      setSelectedTextbook(null)
                      setSelectedUnit(null)
                      setSelectedPages([])
                      setSelectedProblems([])
                      setUnitQuery("")
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" /> 단원 정보
                  </h3>
                </div>
              ) : (
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" /> 교재 정보
                </h3>
              )}
            </div>
            <div className="px-1">
              {!selectedTextbook ? (
                <>
                  <div className="grid grid-cols-3 gap-1 px-2 py-2 text-xs font-medium text-muted-foreground sticky top-0 bg-background z-10 rounded-lg">
                    <div className="col-span-2">교재명</div>
                    <div className="text-center">단원수</div>
                  </div>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Input
                        value={textbookQuery}
                        onChange={(e) => setTextbookQuery(e.target.value)}
                        placeholder="교재 검색"
                        className="h-8 pl-8"
                      />
                      <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <ScrollArea className="h-[520px]">
                    <div>
                      {filteredTextbooks.map((textbook, index) => {
                        const isActive = selectedTextbook === textbook.name
                        return (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-1 px-2 py-2 text-xs cursor-pointer group"
                            onClick={() => {
                              setSelectedTextbook(textbook.name)
                              setSelectedUnit(null)
                              setSelectedPages([])
                              setSelectedProblems([])
                            }}
                          >
                            <div
                              className={`col-span-2 truncate flex items-center gap-2 ${
                                isActive ? "text-blue-600 font-semibold" : "text-foreground"
                              }`}
                              title={textbook.name}
                            >
                              <span className="group-hover:underline">{textbook.name}</span>
                            </div>
                            <div className="text-center">
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {textbook.unitCount}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-1 px-2 py-2 text-xs font-medium text-muted-foreground sticky top-0 bg-background z-10 rounded-lg">
                    <div className="text-center">회차</div>
                    <div className="col-span-2">단원명</div>
                    <div className="text-center">문항수</div>
                  </div>
                  <div className="px-2 pb-2">
                    <div className="relative">
                      <Input
                        value={unitQuery}
                        onChange={(e) => setUnitQuery(e.target.value)}
                        placeholder="단원 검색"
                        className="h-8 pl-8"
                        disabled={!selectedTextbook}
                      />
                      <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <ScrollArea className="h-[520px]">
                    <div>
                      {filteredUnits.map((unit, index) => {
                        const isActive = selectedUnit === unit.unitName
                        return (
                          <div
                            key={index}
                            className="grid grid-cols-4 gap-1 px-2 py-2 text-xs cursor-pointer group"
                            onClick={() => {
                              setSelectedUnit(unit.unitName)
                              setSelectedPages([])
                              setSelectedProblems([])
                            }}
                          >
                            <div className="text-center">
                              <Badge variant="outline" className="text-xs px-1 py-0">{unit.session}</Badge>
                            </div>
                            <div
                              className={`col-span-2 truncate ${
                                isActive ? "text-green-600 font-semibold" : "text-foreground"
                              }`}
                              title={unit.unitName}
                            >
                              <span className="group-hover:underline">{unit.unitName}</span>
                            </div>
                            <div className="text-center">
                              <Badge variant="outline" className="text-xs px-1 py-0">{unit.problemCount}</Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 중간 패널 제거: 좌측에서 단원까지 표시함 */}

        {/* 3단계 - 페이지 선택 및 문제 목록 (Flat) */}
        <div className="col-span-12 lg:col-span-9">
          <div className="h-[600px] flex flex-col gap-6">
            {/* 페이지 선택 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-lg">페이지 선택</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">선택: {selectedPages.length}/43</Badge>
                  <Badge variant="outline" className="text-sm">선택 문제 {selectedProblems.length}</Badge>
                </div>
              </div>
              {selectedTextbook && selectedUnit && (
                <div className="px-1 text-sm text-muted-foreground -mt-2">
                  {selectedTextbook} &gt; {selectedUnit}
                </div>
              )}
              {selectedUnit ? (
                <div className="px-1 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Label className="text-sm font-medium">빠른 선택:</Label>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelectedPages(pageNumbers)}>전체</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelectedPages([])}>초기화</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelectedPages(pageNumbers.filter((p)=>p%2===0))}>짝수</Button>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelectedPages(pageNumbers.filter((p)=>p%2===1))}>홀수</Button>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-14 gap-2 2xl:grid-cols-16">
                      {pageNumbers.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={selectedPages.includes(pageNum) ? "default" : "ghost"}
                          size="sm"
                          className="h-8 px-0 text-xs"
                          onClick={() => togglePage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-1 text-sm text-muted-foreground">단원을 선택하면 페이지 선택이 가능합니다.</div>
              )}
            </div>

            {/* 문제 목록 */}
            <div className="flex flex-col gap-4 min-h-0 flex-1">
              <div className="px-1">
                <h3 className="font-semibold text-lg">문제 목록</h3>
                {!selectedUnit && (
                  <p className="text-sm text-muted-foreground mt-1">단원을 먼저 선택하세요.</p>
                )}
              </div>
              {selectedUnit && (
                <div className="px-1 min-h-0 flex-1">
                  <div className="overflow-auto h-full">
                    <Table>
                      <TableHeader className="[&_tr]:border-0 sticky top-0 bg-background z-10">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-12 text-center">
                            <Checkbox
                              checked={allVisibleProblemsSelected}
                              onCheckedChange={(v: boolean) => toggleAllFilteredProblems(Boolean(v))}
                              aria-label="select all"
                            />
                          </TableHead>
                          <TableHead className="w-16 text-center">순번</TableHead>
                          <TableHead className="w-20 text-center">페이지</TableHead>
                          <TableHead className="w-16 text-center">문제</TableHead>
                          <TableHead className="min-w-96">유형명</TableHead>
                          <TableHead className="w-20 text-center">난이도</TableHead>
                          <TableHead className="w-24 text-center">인지영역</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProblems.length === 0 ? (
                          <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              페이지를 선택하면 해당 페이지의 문제들이 표시됩니다.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProblems.map((problem) => {
                            const isSelected = selectedProblems.includes(problem.id)
                            return (
                              <TableRow
                                key={problem.id}
                                className={`transition-colors border-0 hover:bg-transparent ${
                                  isSelected ? "text-blue-600" : ""
                                }`}
                              >
                                <TableCell className="text-center">
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleProblem(problem.id)}
                                  />
                                </TableCell>
                                <TableCell className="text-center font-medium">{problem.order}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-xs">
                                    {problem.page}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center font-medium">{problem.problem}</TableCell>
                                <TableCell>
                                  <div className="text-sm leading-tight">{problem.type}</div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline" className="text-xs">
                                    {problem.cognitiveArea}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar - Flat */}
      {selectedProblems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 px-4 py-3 rounded-full bg-background/90 backdrop-blur">
            <div className="text-sm font-medium">
              선택된 문제: <span className="text-blue-600">{selectedProblems.length}개</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setSelectedProblems([])}>
                선택 해제
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" /> 문제 추가
              </Button>
              <Button size="sm">
                <FileText className="w-4 h-4 mr-1" /> 시험지 생성
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
