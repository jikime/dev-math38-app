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
import { ChevronDown, BookOpen, FileText, Plus, ChevronLeft, ChevronRight } from "lucide-react"

export function TextbookSimilar() {
  const [selectedCourse, setSelectedCourse] = useState("교과서 쌍둥이 유사(이정연)")
  const [selectedProcess, setSelectedProcess] = useState("전체")
  const [selectedSemester, setSelectedSemester] = useState("전체")
  const [instantDistribution, setInstantDistribution] = useState(true)
  const [selectedTextbook, setSelectedTextbook] = useState("[중2 1학기] 수학의 바이블(유형)")
  const [selectedUnit, setSelectedUnit] = useState("나머지정리와 인수분해")
  const [selectedPages, setSelectedPages] = useState<number[]>([7, 8, 9, 10])
  const [selectedProblems, setSelectedProblems] = useState<number[]>([])
  const [pageRangeStart, setPageRangeStart] = useState("7")
  const [pageRangeEnd, setPageRangeEnd] = useState("10")
  const [currentPageGroup, setCurrentPageGroup] = useState(0)

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

  // 단원 정보 데이터 (회차, 단원명, 문항수)
  const unitData = [{ session: 1, unitName: "나머지정리와 인수분해", problemCount: 278 }]

  // 페이지 번호 데이터 (7-49)
  const pageNumbers = Array.from({ length: 43 }, (_, i) => i + 7)
  const pagesPerGroup = 20
  const totalGroups = Math.ceil(pageNumbers.length / pagesPerGroup)
  const currentPages = pageNumbers.slice(currentPageGroup * pagesPerGroup, (currentPageGroup + 1) * pagesPerGroup)

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

  const filteredProblems = problemData.filter((problem) => selectedPages.includes(problem.page))

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">출판교재 유사</h1>
        <p className="text-gray-600 dark:text-gray-300">출판교재에서 유사한 문제를 찾아 활용하세요</p>
      </div>

      {/* Filter Section */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mb-6">
        <div className="px-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">강좌명</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-80 justify-between bg-transparent">
                      <span className="truncate">{selectedCourse}</span>
                      <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80">
                    {courseOptions.map((course) => (
                      <DropdownMenuItem
                        key={course}
                        onClick={() => setSelectedCourse(course)}
                        className={selectedCourse === course ? "bg-blue-50" : ""}
                      >
                        {course}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">과정</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-32 justify-between bg-transparent">
                      <span>{selectedProcess}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {processOptions.map((process) => (
                      <DropdownMenuItem
                        key={process}
                        onClick={() => setSelectedProcess(process)}
                        className={selectedProcess === process ? "bg-blue-50" : ""}
                      >
                        {process}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">학기</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-32 justify-between bg-transparent">
                      <span>{selectedSemester}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {semesterOptions.map((semester) => (
                      <DropdownMenuItem
                        key={semester}
                        onClick={() => setSelectedSemester(semester)}
                        className={selectedSemester === semester ? "bg-blue-50" : ""}
                      >
                        {semester}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="instant-distribution"
                  checked={instantDistribution}
                  onCheckedChange={setInstantDistribution}
                />
                <label htmlFor="instant-distribution" className="text-sm font-medium text-blue-600">
                  학생들에게 즉시 배포
                </label>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <FileText className="w-4 h-4 mr-2" />
                유사문제 생성
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - 교재 정보 */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[600px]">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                교재 정보
              </h3>
            </div>
            <div className="px-6 p-0">
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-3 gap-1 p-3 bg-gray-50 text-xs font-medium text-gray-700">
                  <div className="col-span-2">교재명</div>
                  <div className="text-center">단원수</div>
                </div>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-gray-200">
                  {textbookData.map((textbook, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-3 gap-1 p-3 text-xs cursor-pointer transition-colors ${
                        textbook.selected ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedTextbook(textbook.name)}
                    >
                      <div className="col-span-2 font-medium text-gray-900 truncate" title={textbook.name}>
                        {textbook.name}
                      </div>
                      <div className="text-center">
                        <Badge className="bg-blue-100 text-blue-800 text-xs px-1 py-0">{textbook.unitCount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Center - 단원 정보 */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[600px]">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                단원 정보
              </h3>
            </div>
            <div className="px-6 p-0">
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-4 gap-1 p-3 bg-gray-50 text-xs font-medium text-gray-700">
                  <div className="text-center">회차</div>
                  <div className="col-span-2">단원명</div>
                  <div className="text-center">문항수</div>
                </div>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-gray-200">
                  {unitData.map((unit, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-1 p-3 text-xs bg-green-50 border-l-4 border-l-green-500"
                    >
                      <div className="text-center">
                        <Badge className="bg-green-100 text-green-800 text-xs px-1 py-0">{unit.session}</Badge>
                      </div>
                      <div className="col-span-2 font-medium text-gray-900" title={unit.unitName}>
                        {unit.unitName}
                      </div>
                      <div className="text-center">
                        <Badge className="bg-gray-100 text-gray-800 text-xs px-1 py-0">{unit.problemCount}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Side - 페이지 선택 및 문제 목록 */}
        <div className="col-span-6">
          <div className="space-y-6">
            {/* 페이지 선택 - 개선된 UX */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="leading-none font-semibold text-lg">페이지 선택</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                      선택: {selectedPages.length}/43
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">한계 ({selectedProblems.length}/278)</Badge>
                  </div>
                </div>
              </div>
              <div className="px-6 space-y-4">
                {/* 범위 선택 */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">범위 선택:</Label>
                  <Input
                    type="number"
                    placeholder="시작"
                    value={pageRangeStart}
                    onChange={(e) => setPageRangeStart(e.target.value)}
                    className="w-20 h-8"
                    min="7"
                    max="49"
                  />
                  <span className="text-sm text-gray-500">~</span>
                  <Input
                    type="number"
                    placeholder="끝"
                    value={pageRangeEnd}
                    onChange={(e) => setPageRangeEnd(e.target.value)}
                    className="w-20 h-8"
                    min="7"
                    max="49"
                  />
                  <Button size="sm" onClick={selectPageRange} className="h-8">
                    범위 선택
                  </Button>
                  <Button size="sm" variant="outline" onClick={selectAllPages} className="h-8 bg-transparent">
                    전체
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearAllPages} className="h-8 bg-transparent">
                    초기화
                  </Button>
                </div>

                {/* 페이지 번호 그리드 - 페이지네이션 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      페이지 {currentPageGroup * pagesPerGroup + 7} -{" "}
                      {Math.min((currentPageGroup + 1) * pagesPerGroup + 6, 49)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPageGroup((prev) => Math.max(0, prev - 1))}
                        disabled={currentPageGroup === 0}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-gray-500 px-2">
                        {currentPageGroup + 1} / {totalGroups}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPageGroup((prev) => Math.min(totalGroups - 1, prev + 1))}
                        disabled={currentPageGroup === totalGroups - 1}
                        className="h-8 w-8 p-0"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-10 gap-2">
                    {currentPages.map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={selectedPages.includes(pageNum) ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs ${
                          selectedPages.includes(pageNum)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-transparent hover:bg-gray-100"
                        }`}
                        onClick={() => togglePage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 문제 목록 */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">문제 목록</h3>
              </div>
              <div className="px-6 p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12 text-center">선택</TableHead>
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
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            페이지를 선택하면 해당 페이지의 문제들이 표시됩니다.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProblems.map((problem) => (
                          <TableRow
                            key={problem.id}
                            className={`hover:bg-gray-50 transition-colors ${
                              selectedProblems.includes(problem.id) ? "bg-blue-50" : ""
                            }`}
                          >
                            <TableCell className="text-center">
                              <Checkbox
                                checked={selectedProblems.includes(problem.id)}
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
                              <div className="text-sm text-gray-900 leading-tight">{problem.type}</div>
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
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {selectedProblems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm shadow-lg border-2 border-blue-200">
            <div className="px-6 p-4">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900">
                  선택된 문제: <span className="text-blue-600">{selectedProblems.length}개</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedProblems([])}>
                    선택 해제
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    문제 추가
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4 mr-1" />
                    시험지 생성
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
