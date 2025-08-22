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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronRight, Target, Users, BookOpen, Download, FileText, Plus } from "lucide-react"

export function WrongSimilar() {
  const [selectedCourse, setSelectedCourse] = useState("교과서 쌍둥이 유사(이정연)")
  const [selectedDifficulty, setSelectedDifficulty] = useState("단원 순서")
  const [problemCount, setProblemCount] = useState("60")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [expandedUnits, setExpandedUnits] = useState<string[]>(["unit1", "unit2"])
  const [selectedProblemTypes, setSelectedProblemTypes] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("problems")

  const courseOptions = ["교과서 쌍둥이 유사(이정연)", "개념원리 RPM 수학", "쎈 수학 시리즈", "일품 수학"]

  const difficultyOptions = ["단원 순서", "난이도 순", "출제빈도 순", "정답률 순"]

  // 왼쪽 사이드바 - 과목 선택 트리
  const subjectTree = [
    {
      id: "unit1",
      name: "1 유리수와 순환소수",
      children: [
        { id: "1.1", name: "1.1 유리수와 순환소수", count: 0 },
        { id: "2", name: "2 식의 계산", count: 0 },
        { id: "2.1", name: "2.1 단항식의 계산", count: 0 },
        { id: "2.2", name: "2.2 다항식의 계산", count: 0 },
        { id: "3", name: "3 부등식과 연립일차방정식", count: 0 },
        { id: "3.1", name: "3.1 일차부등식", count: 0 },
        { id: "3.2", name: "3.2 일차부등식", count: 0 },
        { id: "3.3", name: "3.3 연립일차방정식의 풀이와 활용", count: 0 },
        { id: "4", name: "4 일차함수", count: 0 },
        { id: "4.1", name: "4.1 함수", count: 0 },
        { id: "4.2", name: "4.2 일차함수와 일차함수방정식의 관계", count: 0 },
        { id: "5", name: "5 삼각형의 성질", count: 0 },
        { id: "5.1", name: "5.1 이등변 삼각형", count: 0 },
        { id: "5.2", name: "5.2 삼각형의 외심과 내심", count: 0 },
        { id: "6", name: "6 사각형의 성질", count: 0 },
        { id: "6.1", name: "6.1 평행사변형", count: 0 },
        { id: "6.2", name: "6.2 여러 가지 사각형", count: 0 },
        { id: "7", name: "7 도형의 닮음", count: 0 },
        { id: "7.1", name: "7.1 도형의 닮음", count: 0 },
        { id: "7.2", name: "7.2 평행선과 선분의 길이의 비", count: 0 },
        { id: "7.3", name: "7.3 삼각형의 무게중심", count: 0 },
        { id: "7.4", name: "7.4 닮음의 활용", count: 0 },
        { id: "8", name: "8 피타고라스", count: 0 },
        { id: "8.1", name: "8.1 피타고라스의 정리", count: 0 },
      ],
    },
  ]

  // 중앙 패널 - 학습을 선택해 주세요 데이터
  const problemTypes = [
    {
      section: "1.1 유리수와 순환소수",
      items: [
        { code: "A01", name: "유한소수, 무한소수 구별하기", count: 73, selected: false },
        { code: "A02", name: "순환소수의 표현", count: 143, selected: false },
        { code: "A03", name: "순환마디 구하기", count: 83, selected: false },
        { code: "A04", name: "순환소수의 표현 - 분수", count: 36, selected: false },
        { code: "A05", name: "순환마디 구하기 - 분수", count: 55, selected: false },
        { code: "A06", name: "순환소수의 표현 - 대소 관계", count: 39, selected: false },
        {
          code: "A07",
          name: "소수점 아래 n번째 자리의 숫자 구하기 - 순환소수가 주어진 경우",
          count: 67,
          selected: false,
        },
        {
          code: "A08",
          name: "소수점 아래 n번째 자리의 숫자 구하기 - 순환소수가 주어지지 않은 경우",
          count: 173,
          selected: false,
        },
        {
          code: "A09",
          name: "소수점 아래 n번째 자리까지의 합 구하기 - 순환소수가 주어진 경우",
          count: 10,
          selected: false,
        },
        {
          code: "A10",
          name: "소수점 아래 n번째 자리까지의 합 구하기 - 순환소수가 주어지지 않은 경우",
          count: 72,
          selected: false,
        },
      ],
    },
    {
      section: "1.1.2 유한소수로 나타낼 수 있는 분수",
      items: [
        { code: "A11", name: "유한소수로 나타낼 수 있는 분수", count: 44, selected: false },
        {
          code: "A12",
          name: "분수를 유한소수로 나타내기 - 분모를 10의 거듭제곱의 꼴로 기약분수의 꼴로 나타내기",
          count: 52,
          selected: false,
        },
        { code: "A13", name: "분수를 유한소수로 나타내기", count: 7, selected: false },
        { code: "A14", name: "분수를 유한소수로 나타내기 - 계산과정", count: 59, selected: false },
        {
          code: "A15",
          name: "유한소수/순환소수로 나타낼 수 있는 분수 - 분모가 소인수분해 된 분수",
          count: 46,
          selected: false,
        },
        { code: "A16", name: "유한소수가 되도록 하는 x의 값 구 - 분모", count: 71, selected: false },
        {
          code: "A17",
          name: "유한소수가 되도록 하는 x의 값 구 - 자연수를 곱하여 유한소수가 되도록 하기",
          count: 70,
          selected: false,
        },
        { code: "A18", name: "유한소수가 되도록 하는 x의 값 구 - 조건이 주어졌을 때", count: 61, selected: false },
        { code: "A19", name: "순환소수가 되도록 하는 x의 값 구 - 분자", count: 18, selected: false },
        { code: "A20", name: "순환소수가 되도록 하는 x의 값 구 - 분모", count: 5, selected: false },
        { code: "A21", name: "순환소수가 되도록 하는 x의 값 구 - 분모의 인수", count: 58, selected: false },
        {
          code: "A22",
          name: "유한소수/순환소수로 나타낼 수 있는 분수 - 분모를 소인수분해 하여 하는 경우",
          count: 243,
          selected: false,
        },
        {
          code: "A23",
          name: "유한소수/순환소수로 나타낼 수 있는 분수 - 분모가 자연수 중기를 때",
          count: 26,
          selected: false,
        },
      ],
    },
  ]

  // 오른쪽 패널 - 학생 데이터
  const studentData = [
    {
      id: 1,
      number: 4,
      name: "38stu-3학년",
      school: "",
      problems: 0,
      wrongAnswers: "0%(0)",
      weakTypes: "0%(0)",
      weakRange: "0%(0)",
      check: "0%(0)",
    },
    {
      id: 2,
      number: 3,
      name: "A Type",
      school: "아코고등학교",
      problems: 0,
      wrongAnswers: "0%(0)",
      weakTypes: "0%(0)",
      weakRange: "0%(0)",
      check: "0%(0)",
    },
    {
      id: 3,
      number: 2,
      name: "Btype",
      school: "",
      problems: 0,
      wrongAnswers: "0%(0)",
      weakTypes: "0%(0)",
      weakRange: "0%(0)",
      check: "0%(0)",
    },
    {
      id: 4,
      number: 1,
      name: "Ctype",
      school: "",
      problems: 0,
      wrongAnswers: "0%(0)",
      weakTypes: "0%(0)",
      weakRange: "0%(0)",
      check: "0%(0)",
    },
  ]

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => (prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]))
  }

  const toggleProblemType = (code: string) => {
    setSelectedProblemTypes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]))
  }

  const toggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const selectAllStudents = () => {
    setSelectedStudents(studentData.map((s) => s.id))
  }

  const clearAllStudents = () => {
    setSelectedStudents([])
  }

  return (
    <main className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">오답+유사</h1>
        <p className="text-gray-600 dark:text-gray-300">학생들의 오답을 분석하고 유사한 문제를 생성하세요</p>
      </div>

      {/* Filter Section */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mb-6">
        <div className="px-6 p-6">
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* 강좌명 */}
            <div className="col-span-3 space-y-1">
              <Label className="text-sm font-medium text-gray-700">강좌명</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
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

            {/* 출제 대상 */}
            <div className="col-span-2 space-y-1">
              <Label className="text-sm font-medium text-gray-700">출제 대상</Label>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">개별</Button>
            </div>

            {/* 반별 */}
            <div className="col-span-1 space-y-1">
              <Label className="text-sm font-medium text-gray-700">반별</Label>
              <Button variant="outline" className="w-full bg-transparent">
                반별
              </Button>
            </div>

            {/* 학습을 선택해 주세요 */}
            <div className="col-span-2 space-y-1">
              <Label className="text-sm font-medium text-gray-700">학습을 선택해 주세요</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>{selectedDifficulty}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {difficultyOptions.map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSelectedDifficulty(option)}
                      className={selectedDifficulty === option ? "bg-blue-50" : ""}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 최대 문제수 */}
            <div className="col-span-1 space-y-1">
              <Label className="text-sm font-medium text-gray-700">최대 문제수</Label>
              <Input
                type="number"
                value={problemCount}
                onChange={(e) => setProblemCount(e.target.value)}
                className="w-full"
                min="1"
                max="100"
              />
            </div>

            {/* 오답 */}
            <div className="col-span-1 space-y-1">
              <Label className="text-sm font-medium text-gray-700">오답</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>유사 x1</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>유사 x1</DropdownMenuItem>
                  <DropdownMenuItem>유사 x2</DropdownMenuItem>
                  <DropdownMenuItem>유사 x3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 부족 오답 */}
            <div className="col-span-1 space-y-1">
              <Label className="text-sm font-medium text-gray-700">부족 오답</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>유사 x1</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>유사 x1</DropdownMenuItem>
                  <DropdownMenuItem>유사 x2</DropdownMenuItem>
                  <DropdownMenuItem>유사 x3</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 부족 정답 */}
            <div className="col-span-1 space-y-1">
              <Label className="text-sm font-medium text-gray-700">부족 정답</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    <span>미출제</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>미출제</DropdownMenuItem>
                  <DropdownMenuItem>출제</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* 출제 우선순위 탭 */}
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mb-6">
        <div className="px-6 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="problems" className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 text-white rounded text-sm flex items-center justify-center">
                  1
                </span>
                교과서
              </TabsTrigger>
              <TabsTrigger value="textbook" className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center">
                  2
                </span>
                문제집
              </TabsTrigger>
              <TabsTrigger value="workbook" className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center">
                  3
                </span>
                기출
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 text-gray-600 rounded text-sm flex items-center justify-center">
                  4
                </span>
                모의고사
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - 과목을 선택해 주세요 */}
        <div className="col-span-3">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[700px]">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                과목을 선택해 주세요
              </h3>
            </div>
            <div className="px-6 p-0">
              <ScrollArea className="h-[620px]">
                <div className="p-4 space-y-2">
                  {subjectTree.map((unit) => (
                    <div key={unit.id} className="space-y-1">
                      <div
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => toggleUnit(unit.id)}
                      >
                        {expandedUnits.includes(unit.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="font-medium text-gray-900">{unit.name}</span>
                      </div>

                      {expandedUnits.includes(unit.id) && (
                        <div className="ml-6 space-y-1">
                          {unit.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer text-sm"
                            >
                              <span className="text-gray-700">{child.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {child.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Center Panel - 학습을 선택해 주세요 */}
        <div className="col-span-5">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[700px]">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  학습을 선택해 주세요
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">선택된 항목 수: 50</span>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    전체
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    초기화
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 p-0">
              <ScrollArea className="h-[620px]">
                <div className="space-y-4 p-4">
                  {problemTypes.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-2">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <h3 className="font-medium text-gray-900">{section.section}</h3>
                        <span className="text-sm text-gray-600">전체 선택</span>
                      </div>

                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <div
                            key={item.code}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedProblemTypes.includes(item.code)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleProblemType(item.code)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedProblemTypes.includes(item.code)}
                                onChange={() => toggleProblemType(item.code)}
                              />
                              <div>
                                <span className="font-medium text-blue-600">{item.code}.</span>
                                <span className="ml-2 text-sm text-gray-900">{item.name}</span>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Right Panel - 학생 목록 */}
        <div className="col-span-4">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm h-[700px]">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              <div className="flex items-center justify-between">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  학생 목록
                </h3>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={selectAllStudents} className="bg-blue-600 hover:bg-blue-700">
                    출제
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-6 p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12 text-center">
                        <Checkbox
                          checked={selectedStudents.length === studentData.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              selectAllStudents()
                            } else {
                              clearAllStudents()
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="w-16 text-center font-semibold">번호</TableHead>
                      <TableHead className="font-semibold">이름/학교</TableHead>
                      <TableHead className="w-16 text-center font-semibold">출제</TableHead>
                      <TableHead className="w-20 text-center font-semibold">오답</TableHead>
                      <TableHead className="w-20 text-center font-semibold">부족유형</TableHead>
                      <TableHead className="w-20 text-center font-semibold">부족범위</TableHead>
                      <TableHead className="w-16 text-center font-semibold">점검</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentData.map((student) => (
                      <TableRow
                        key={student.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          selectedStudents.includes(student.id) ? "bg-blue-50" : ""
                        }`}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() => toggleStudent(student.id)}
                          />
                        </TableCell>
                        <TableCell className="text-center font-medium">{student.number}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{student.name}</div>
                            {student.school && <div className="text-xs text-gray-500">{student.school}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-red-600 font-medium">{student.problems}</span>
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-600">{student.wrongAnswers}</TableCell>
                        <TableCell className="text-center text-sm text-gray-600">{student.weakTypes}</TableCell>
                        <TableCell className="text-center text-sm text-gray-600">{student.weakRange}</TableCell>
                        <TableCell className="text-center text-sm text-gray-600">{student.check}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      {(selectedStudents.length > 0 || selectedProblemTypes.length > 0) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm shadow-lg border-2 border-blue-200">
            <div className="px-6 p-4">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-900">
                  선택된 학생: <span className="text-blue-600">{selectedStudents.length}명</span>
                  {selectedProblemTypes.length > 0 && (
                    <span className="ml-4">
                      선택된 유형: <span className="text-green-600">{selectedProblemTypes.length}개</span>
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedStudents([])
                      setSelectedProblemTypes([])
                    }}
                  >
                    선택 해제
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    오답 분석
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <FileText className="w-4 h-4 mr-1" />
                    유사문제 생성
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-1" />
                    시험지 출제
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
