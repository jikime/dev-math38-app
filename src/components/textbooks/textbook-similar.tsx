"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMyLectures, useLectureDetail } from "@/hooks/use-lecture"
import { useSubjects } from "@/hooks/use-subjects"
import { useWorkBooks, useWorkBookPapers, useWorkBookPaperProblems } from "@/hooks/use-textbooks"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Option } from "@/components/ui/multi-select"
import { BookOpen, FileText, ChevronLeft, Search } from "lucide-react"

export function TextbookSimilar() {
  // 강좌 관련 상태
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  
  // 과정 관련 상태
  const [selectedSubjectKeys, setSelectedSubjectKeys] = useState<string[]>([])
  
  const [selectedProcess, setSelectedProcess] = useState("전체")
  const [selectedSemester, setSelectedSemester] = useState("전체")
  const [instantDistribution, setInstantDistribution] = useState(true)
  const [selectedTextbook, setSelectedTextbook] = useState<string | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  // 페이지 네비게이션 단순화를 위해 그룹 이동 상태 제거
  const [textbookQuery, setTextbookQuery] = useState("")
  const [unitQuery, setUnitQuery] = useState("")

  // API 훅들
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()
  
  // 강의 상세정보 조회 (teacher 정보 포함)
  const { data: lectureDetail } = useLectureDetail(selectedLectureId || "")

  // WorkBook 목록 조회
  const workBookParams = {
    bookName: "", // 검색어는 비워둠 (필터링은 클라이언트에서 처리)
    grade: 0,
    pageNum: 1,
    semester: selectedSemester === "전체" ? 0 : selectedSemester === "1학기" ? 1 : selectedSemester === "2학기" ? 2 : 0,
    size: 1000,
    subjectId: selectedSubjectKeys.length > 0 ? parseInt(selectedSubjectKeys[0]) : 0
  }
  
  const { data: workBooks, isLoading: workBooksLoading } = useWorkBooks(workBookParams)
  
  // WorkBook Papers(단원) 목록 조회
  const { data: workBookPapers, isLoading: workBookPapersLoading } = useWorkBookPapers(selectedTextbook)
  
  // WorkBook Paper Problems(문제) 목록 조회
  const { data: workBookProblems, isLoading: workBookProblemsLoading } = useWorkBookPaperProblems(selectedUnit)

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // 선택된 강의의 subjectId와 일치하는 과정을 자동으로 설정
  useEffect(() => {
    if (selectedLectureId && lectures && subjects && subjects.length > 0) {
      const selectedLecture = lectures.find(l => l.lectureId === selectedLectureId)
      if (selectedLecture) {
        const matchingSubject = subjects.find(subject => subject.key === selectedLecture.subjectId)
        
        if (matchingSubject) {
          setSelectedSubjectKeys([matchingSubject.key.toString()])
        }
      }
    }
  }, [selectedLectureId, lectures, subjects])

  // 과정 데이터를 MultiSelect 옵션으로 변환 - 메모이제이션
  const subjectOptions: Option[] = useMemo(() => 
    subjects?.map(subject => ({
      label: subject.title,
      value: subject.key.toString()
    })) || [], [subjects]
  )

  const semesterOptions = useMemo(() => ["전체", "1학기", "2학기"], [])

  // 필터링된 데이터 - 메모이제이션
  const filteredTextbooks = useMemo(() => 
    workBooks?.filter((t) =>
      textbookQuery.trim() === "" ? true : t.bookName.toLowerCase().includes(textbookQuery.toLowerCase())
    ) || [], [workBooks, textbookQuery]
  )
  
  const filteredUnits = useMemo(() => 
    workBookPapers?.filter((u) =>
      unitQuery.trim() === "" ? true : u.title.toLowerCase().includes(unitQuery.toLowerCase())
    ) || [], [workBookPapers, unitQuery]
  )

  // 문제 목록 관련 상태 및 로직
  const [selectedPageRange, setSelectedPageRange] = useState<number[]>([])
  
  // 페이지 범위 생성 - 메모이제이션
  const allPages = useMemo(() => 
    workBookProblems ? [...new Set(workBookProblems.map(p => p.page))].sort((a, b) => a - b) : [], 
    [workBookProblems]
  )
  
  // 선택된 페이지의 문제들 - 메모이제이션
  const filteredProblems = useMemo(() => 
    workBookProblems?.filter(p => 
      selectedPageRange.length === 0 || selectedPageRange.includes(p.page)
    ) || [], [workBookProblems, selectedPageRange]
  )
  
  // 페이지 선택 토글 - 메모이제이션
  const togglePageSelection = useCallback((page: number) => {
    setSelectedPageRange(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page].sort((a, b) => a - b)
    )
    // 페이지 선택이 바뀌면 선택된 문제도 초기화
    setSelectedProblems([])
  }, [])
  
  // 문제 선택 토글 - 메모이제이션
  const toggleProblemSelection = useCallback((problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(p => p !== problemId)
        : [...prev, problemId]
    )
  }, [])
  
  // 전체 문제 선택/해제 - 메모이제이션
  const toggleAllProblems = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedProblems(filteredProblems.map(p => p.problemId))
    } else {
      setSelectedProblems([])
    }
  }, [filteredProblems])
  
  // 선택된 문제 ID와 전체 선택 상태 - 메모이제이션
  const selectedProblemIds = useMemo(() => selectedProblems, [selectedProblems])
  const allFilteredSelected = useMemo(() => 
    filteredProblems.length > 0 && filteredProblems.every(p => selectedProblemIds.includes(p.problemId)),
    [filteredProblems, selectedProblemIds]
  )

  // 교재 선택 핸들러 - 메모이제이션
  const handleTextbookSelect = useCallback((textbookId: string) => {
    setSelectedTextbook(textbookId)
    setSelectedUnit(null)
    setSelectedProblems([])
    setSelectedPageRange([])
  }, [])

  // 단원 선택 핸들러 - 메모이제이션  
  const handleUnitSelect = useCallback((unitId: string) => {
    setSelectedUnit(unitId)
    setSelectedProblems([])
    setSelectedPageRange([])
  }, [])

  // 뒤로가기 핸들러 - 메모이제이션
  const handleBackToTextbooks = useCallback(() => {
    setSelectedTextbook(null)
    setSelectedUnit(null)
    setSelectedProblems([])
    setUnitQuery("")
  }, [])

  return (
    <main className="container mx-auto px-6 py-4">
      {/* Header - 한줄 레이아웃 */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* 강좌 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">강좌명</span>
            {lecturesLoading ? (
              <div className="h-8 bg-gray-200 rounded animate-pulse w-48" />
            ) : (
              <Select value={selectedLectureId} onValueChange={setSelectedLectureId}>
                <SelectTrigger className="w-48 h-8">
                  <SelectValue placeholder="강좌를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {lectures?.map((lecture) => (
                    <SelectItem key={lecture.lectureId} value={lecture.lectureId}>
                      {lecture.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* 과정 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">과정</span>
            <MultiSelect
              options={subjectOptions}
              selected={selectedSubjectKeys}
              onChange={setSelectedSubjectKeys}
              placeholder="과정을 선택하세요"
              disabled={subjectsLoading} 
              className="w-48 h-8"
            />
          </div>

          {/* 학기 선택 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">학기</span>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {semesterOptions.map((semester) => (
                  <SelectItem key={semester} value={semester}>
                    {semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <Checkbox
                id="instant-distribution"
                checked={instantDistribution}
                onCheckedChange={(checked) => setInstantDistribution(Boolean(checked))}
              />
              <label htmlFor="instant-distribution" className="text-sm">학생들에게 즉시 배포</label>
            </div>
            <Button variant="default" className="h-8">
              <FileText className="w-4 h-4 mr-1" /> 유사문제 생성
            </Button>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-12 gap-6 lg:grid-cols-12 flex-1 min-h-0">
        {/* 1단계/2단계 - 좌측 패널에서 단계 전환 (Flat) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-card text-card-foreground flex flex-col rounded-xl border h-full overflow-hidden">
            <div className="px-6 py-4 border-b">
              {selectedTextbook ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={handleBackToTextbooks}
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
            <div className="px-6 py-4 flex-1 min-h-0">
              {!selectedTextbook ? (
                <>
                  <div className="space-y-4">
                    {/* 검색 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">검색:</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="교재 검색"
                          value={textbookQuery}
                          onChange={(e) => setTextbookQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-3 gap-1 px-2 py-2 text-xs font-medium text-muted-foreground bg-muted/30 rounded-lg">
                      <div className="col-span-2">교재명</div>
                      <div className="text-center">단원수</div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 mt-4">
                    <ScrollArea className="h-full">
                      <div className="space-y-1">
                        {workBooksLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="text-sm text-gray-500">교재 목록 로딩중...</div>
                        </div>
                      ) : filteredTextbooks.length > 0 ? (
                        filteredTextbooks.map((textbook, index) => {
                          const isActive = selectedTextbook === textbook.workBookId
                          return (
                            <div
                              key={textbook.workBookId}
                              className={`grid grid-cols-3 gap-1 px-3 py-3 text-xs cursor-pointer rounded-lg transition-colors ${
                                isActive 
                                  ? "bg-blue-50 border border-blue-200" 
                                  : "hover:bg-muted/50 border border-transparent"
                              }`}
                              onClick={() => handleTextbookSelect(textbook.workBookId)}
                            >
                              <div
                                className={`col-span-2 truncate flex items-center gap-2 ${
                                  isActive ? "text-blue-600 font-semibold" : "text-foreground"
                                }`}
                                title={textbook.bookName}
                              >
                                <span className="group-hover:underline">{textbook.bookName}</span>
                              </div>
                              <div className="text-center">
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  {textbook.paperCount}
                                </Badge>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center">
                            <p className="text-sm">교재가 없습니다</p>
                          </div>
                        </div>
                      )}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    {/* 검색 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">검색:</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="단원 검색"
                          value={unitQuery}
                          onChange={(e) => setUnitQuery(e.target.value)}
                          className="pl-10"
                          disabled={!selectedTextbook}
                        />
                      </div>
                    </div>
                    
                    {/* 테이블 헤더 */}
                    <div className="grid grid-cols-4 gap-1 px-2 py-2 text-xs font-medium text-muted-foreground bg-muted/30 rounded-lg">
                      <div className="text-center">회차</div>
                      <div className="col-span-2">단원명</div>
                      <div className="text-center">문항수</div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 mt-4">
                    <ScrollArea className="h-full">
                      <div className="space-y-1">
                        {workBookPapersLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="text-sm text-gray-500">단원 목록 로딩중...</div>
                        </div>
                      ) : filteredUnits.length > 0 ? (
                        filteredUnits.map((unit) => {
                          const isActive = selectedUnit === unit.workBookPaperId
                          return (
                            <div
                              key={unit.workBookPaperId}
                              className={`grid grid-cols-4 gap-1 px-3 py-3 text-xs cursor-pointer rounded-lg transition-colors ${
                                isActive 
                                  ? "bg-green-50 border border-green-200" 
                                  : "hover:bg-muted/50 border border-transparent"
                              }`}
                              onClick={() => handleUnitSelect(unit.workBookPaperId)}
                            >
                              <div className="text-center">
                                <Badge variant="outline" className="text-xs px-1 py-0">{unit.orderIndex + 1}</Badge>
                              </div>
                              <div
                                className={`col-span-2 truncate ${
                                  isActive ? "text-green-600 font-semibold" : "text-foreground"
                                }`}
                                title={unit.title}
                              >
                                <span className="group-hover:underline">{unit.title}</span>
                              </div>
                              <div className="text-center">
                                <Badge variant="outline" className="text-xs px-1 py-0">{unit.problemCounts}</Badge>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center">
                            <p className="text-sm">단원이 없습니다</p>
                          </div>
                        </div>
                      )}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 중간 패널 제거: 좌측에서 단원까지 표시함 */}

        {/* 3단계 - 문제 목록 */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-card text-card-foreground h-full rounded-xl border overflow-hidden flex flex-col">
            {selectedUnit ? (
              <>
                {/* 헤더 */}
                <div className="px-6 py-4 border-b flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">문제 목록</h3>
                      {workBookPapers && (
                        <span className="text-sm text-muted-foreground">
                          {workBookPapers.find(p => p.workBookPaperId === selectedUnit)?.title}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">
                        전체 {workBookProblems?.length || 0}개
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        선택 {selectedProblems.length}개
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* 페이지 필터링 - 컴팩트 */}
                <div className="px-6 py-4 border-b flex-shrink-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">페이지:</span>
                      <div className="flex items-center gap-1">
                        {selectedPageRange.length === 0 ? (
                          <Badge variant="secondary" className="text-xs">전체</Badge>
                        ) : (
                          <>
                            {selectedPageRange.map(page => (
                              <Badge 
                                key={page} 
                                variant="default" 
                                className="text-xs cursor-pointer"
                                onClick={() => togglePageSelection(page)}
                              >
                                {page} ×
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* 페이지 선택 버튼들 */}
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                        <Button
                          variant={selectedPageRange.length === 0 ? "default" : "outline"}
                          size="sm"
                          className="h-6 px-2 text-xs flex-shrink-0"
                          onClick={() => {
                            setSelectedPageRange([])
                            setSelectedProblems([])
                          }}
                        >
                          전체
                        </Button>
                        {allPages.map(page => (
                          <Button
                            key={page}
                            variant={selectedPageRange.includes(page) ? "default" : "outline"}
                            size="sm"
                            className="h-6 px-2 text-xs flex-shrink-0"
                            onClick={() => togglePageSelection(page)}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                    </div>
                </div>
                
                {/* 문제 목록 테이블 */}
                <div className="flex-1 mx-6 m-6 border rounded-lg overflow-hidden min-h-0 flex flex-col">
                  {workBookProblemsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-sm text-gray-500">문제 목록 로딩중...</div>
                    </div>
                  ) : (
                    <>
                      {/* 테이블 헤더 - 고정 */}
                      <div className="bg-muted/50 p-3 border-b flex-shrink-0 overflow-hidden">
                        <div className="grid grid-cols-11 gap-2 items-center text-sm font-medium min-w-[800px]">
                          <div className="col-span-1 text-center">
                            <Checkbox
                              checked={allFilteredSelected}
                              onCheckedChange={toggleAllProblems}
                            />
                          </div>
                          <div className="col-span-1 text-center">순번</div>
                          <div className="col-span-1 text-center">페이지</div>
                          <div className="col-span-1 text-center">문제</div>
                          <div className="col-span-5 text-center">유형명</div>
                          <div className="col-span-1 text-center">난이도</div>
                          <div className="col-span-1 text-center">인지영역</div>
                        </div>
                      </div>
                      
                      {/* 테이블 바디 - 스크롤 가능 */}
                      <div className="border-t">
                        <ScrollArea className="h-[calc(100vh-30rem)]" type="always">
                          <div className="divide-y min-w-[800px]">
                            {filteredProblems.map((problem, index) => (
                              <div 
                                key={problem.problemId}
                                className="grid grid-cols-11 gap-2 items-center p-3 text-sm hover:bg-muted/25 min-w-full"
                              >
                                <div className="col-span-1 text-center">
                                  <Checkbox
                                    checked={selectedProblemIds.includes(problem.problemId)}
                                    onCheckedChange={() => toggleProblemSelection(problem.problemId)}
                                  />
                                </div>
                                <div className="col-span-1 text-center">{problem.orderIndex}</div>
                                <div className="col-span-1 text-center">{problem.page}</div>
                                <div className="col-span-1 text-center">{problem.problemNumber}</div>
                                <div className="col-span-5 truncate" title={problem.skillName}>
                                  {problem.skillName}
                                </div>
                                <div className="col-span-1 text-center">
                                  <Badge variant="outline" className="text-xs">
                                    {problem.level === 1 ? '하' : problem.level === 2 ? '중' : problem.level === 3 ? '상' : '미정'}
                                  </Badge>
                                </div>
                                <div className="col-span-1 text-center">
                                  <Badge variant="secondary" className="text-xs">
                                    {problem.ltype === 'unds' ? '이해' : 
                                     problem.ltype === 'appl' ? '적용' : 
                                     problem.ltype === 'anal' ? '분석' : 
                                     problem.ltype === 'eval' ? '평가' : 
                                     problem.ltype === 'crea' ? '창조' : 
                                     problem.ltype === 'calcs' ? '계산' : 
                                     problem.ltype || '기타'}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            
                            {filteredProblems.length === 0 && !workBookProblemsLoading && (
                              <div className="flex items-center justify-center h-32 text-gray-500">
                                <div className="text-center">
                                  {workBookProblems && workBookProblems.length > 0 ? (
                                    <>
                                      <p className="text-sm">선택한 페이지에 문제가 없습니다</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        다른 페이지를 선택하거나 "전체" 버튼을 클릭하세요
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm">이 단원에는 문제가 없습니다</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="font-medium mb-2">문제를 선택해주세요</h3>
                  <p className="text-sm">단원을 선택하면 문제 목록이 표시됩니다</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
