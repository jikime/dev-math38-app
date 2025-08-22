"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, FolderOpen, Plus } from "lucide-react"

export function AcademyMaterials() {
  const [selectedGrade, setSelectedGrade] = useState("중3학년")
  const [searchTerm, setSearchTerm] = useState("")

  const gradeOptions = [
    { value: "중1학년", label: "중1학년" },
    { value: "중2학년", label: "중2학년" },
    { value: "중3학년", label: "중3학년" },
    { value: "고1학년", label: "고1학년" },
    { value: "고2학년", label: "고2학년" },
    { value: "고3학년", label: "고3학년" },
  ]

  // 왼쪽 사이드바 폴더 구조
  const folderStructure = [
    { name: "레벨테스트", count: 2, icon: FolderOpen },
    { name: "진단평가", count: 2, icon: FolderOpen },
    { name: "교과서TWI...", count: 10, icon: FolderOpen },
    { name: "교사용TWI...", count: 0, icon: FolderOpen },
  ]

  // 과목별 목록
  const subjectList = [
    { grade: "중3", subject: "중3)내신집중(M1)", count: 4, color: "blue" },
    { grade: "중3", subject: "거울)추가프린트", count: 1, color: "purple" },
    { grade: "중3", subject: "중3)내신집중(M1)", count: 4, color: "blue" },
    { grade: "중3", subject: "공통수학1 다항식-이차함수(중3) 입문 학년별과정)", count: 1, color: "green" },
    { grade: "중3", subject: "중3)내신집중(M1)", count: 2, color: "blue" },
    { grade: "중3", subject: "중3)2025 1학기 기말고사", count: 4, color: "orange" },
    { grade: "중3", subject: "중3)25년 1학기 기말고사", count: 9, color: "red" },
    { grade: "중3", subject: "중3)25년 1학기 기말고사", count: 1, color: "teal" },
  ]

  // 메인 콘텐츠 데이터
  const materialsData = [
    {
      id: 1,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B1-type"1단원',
      description: "1 삼수의 곱셈 ~ 1.3.1 곱셈 공식의 활용 계산",
      totalQuestions: 50,
      multipleChoice: 33,
      shortAnswer: 17,
      easyQuestions: 22,
      mediumQuestions: 18,
      hardQuestions: 10,
    },
    {
      id: 2,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B1-type"2단원',
      description: "2 다항식의 곱셈과 인수분해 ~ 2.2.2 인수분해 공식의 활용",
      totalQuestions: 50,
      multipleChoice: 37,
      shortAnswer: 13,
      easyQuestions: 8,
      mediumQuestions: 30,
      hardQuestions: 12,
    },
    {
      id: 3,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B1-type"3단원',
      description: "3 이차방정식 ~ 3.2.1 이차방정식의 활용",
      totalQuestions: 50,
      multipleChoice: 43,
      shortAnswer: 7,
      easyQuestions: 19,
      mediumQuestions: 25,
      hardQuestions: 6,
    },
    {
      id: 4,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B1-type"4단원',
      description: "4 이차함수 ~ 4.2.1 이차함수의 활용",
      totalQuestions: 60,
      multipleChoice: 41,
      shortAnswer: 19,
      easyQuestions: 12,
      mediumQuestions: 26,
      hardQuestions: 22,
    },
    {
      id: 5,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B2-type"3단원',
      description: "3 이차방정식 ~ 3.2.1 이차방정식의 활용",
      totalQuestions: 80,
      multipleChoice: 65,
      shortAnswer: 15,
      easyQuestions: 8,
      mediumQuestions: 55,
      hardQuestions: 17,
    },
    {
      id: 6,
      grade: "중3",
      title: '25학년도 3학년 1학기 기말고사 1차 시험대비교재"B2-type"4단원',
      description: "4 이차함수 ~ 4.2.1 이차함수의 활용",
      totalQuestions: 80,
      multipleChoice: 49,
      shortAnswer: 31,
      easyQuestions: 8,
      mediumQuestions: 48,
      hardQuestions: 24,
    },
  ]

  const getSubjectColor = (color: string) => {
    const colorMap = {
      blue: "text-blue-600",
      purple: "text-purple-600",
      green: "text-green-600",
      orange: "text-orange-600",
      red: "text-red-600",
      teal: "text-teal-600",
    }
    return colorMap[color as keyof typeof colorMap] || "text-gray-600"
  }

  const renderDifficultyGraph = (material: any) => (
    <div className="relative group">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div className="flex h-full">
          <div
            className="bg-green-500 transition-all duration-200"
            style={{ width: `${(material.easyQuestions / material.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-blue-500 transition-all duration-200"
            style={{ width: `${(material.mediumQuestions / material.totalQuestions) * 100}%` }}
          ></div>
          <div
            className="bg-purple-500 transition-all duration-200"
            style={{ width: `${(material.hardQuestions / material.totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                쉬움: {material.easyQuestions}개 ({Math.round((material.easyQuestions / material.totalQuestions) * 100)}
                %)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                보통: {material.mediumQuestions}개 (
                {Math.round((material.mediumQuestions / material.totalQuestions) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>
                어려움: {material.hardQuestions}개 (
                {Math.round((material.hardQuestions / material.totalQuestions) * 100)}
                %)
              </span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )

  const filteredMaterials = materialsData.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <main className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">학원 자료</h1>
          <p className="text-gray-600 dark:text-gray-300">학원에서 사용하는 교재와 자료를 관리하세요</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          학원 자료 출제
        </Button>
      </div>

      <div className="flex gap-6">
        {/* 왼쪽 사이드바 */}
        <div className="w-80 space-y-4">
          {/* 학년 선택 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">학년:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-transparent">
                  <span>{gradeOptions.find((g) => g.value === selectedGrade)?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
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
          </div>

          {/* 검색 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">검색:</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Save 간접 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 폴더 구조 */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="px-6 p-4">
              <div className="space-y-2">
                {folderStructure.map((folder, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {folder.count}개 항목
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 과목별 목록 */}
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="px-6 p-4">
              <div className="space-y-2">
                {subjectList.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{subject.grade}</span>
                      <span className={`text-sm ${getSubjectColor(subject.color)}`}>{subject.subject}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getSubjectColor(subject.color)}`}>
                      {subject.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="px-6 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-20 text-center font-semibold">과목</TableHead>
                    <TableHead className="font-semibold">범위/문제명</TableHead>
                    <TableHead className="w-48 text-center font-semibold">문항수 (주관식/객관식)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="text-center">
                        <div className="space-y-1">
                          <Badge className="bg-purple-100 text-purple-800 text-xs">중등</Badge>
                          <div className="text-xs text-gray-500">{material.grade}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900 leading-tight text-sm line-clamp-2">
                            {material.title}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">{material.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">
                              총 문항: {material.totalQuestions} ({material.multipleChoice}/{material.shortAnswer})
                            </span>
                          </div>
                          {renderDifficultyGraph(material)}
                          <div className="flex items-center justify-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-600">
                                {Math.round((material.easyQuestions / material.totalQuestions) * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-600">
                                {Math.round((material.mediumQuestions / material.totalQuestions) * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-gray-600">
                                {Math.round((material.hardQuestions / material.totalQuestions) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              총 {filteredMaterials.length}개의 자료 중 1-{filteredMaterials.length}개 표시
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
        </div>
      </div>
    </main>
  )
}
