"use client"

import React, { useCallback, useMemo, useState, useEffect } from "react"
import { useManualProblemStore } from "@/stores/manual-problem-store"
import { useProblemsBySkill } from "@/hooks/use-problems"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, X, Filter, BookOpen, Award, Brain, Plus, Minus } from "lucide-react"
import { ApiProblem } from "@/types/api-problem"
import ProblemView from "@/components/math-paper/template/manual/problem-view"

// API 문제를 UI에서 사용할 형태로 변환하는 타입
interface UIProblem extends ApiProblem {
  // UI에서 필요한 추가 속성들
  skillName?: string;
}

interface ManualProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManualProblemDialog({
  open,
  onOpenChange,
}: ManualProblemDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [problemListPage, setProblemListPage] = useState(1) // 문제 목록 페이징
  const PROBLEMS_PER_PAGE = 20 // 페이지당 문제 수
  
  // zustand 스토어에서 항목 관련 상태 가져오기
  const { 
    skillChapters, 
    selectedSkill, 
    selectSkill 
  } = useManualProblemStore()
  
  // 필터 상태
  const [sourceFilter, setSourceFilter] = useState("전체")
  const [methodFilter, setMethodFilter] = useState("전체")
  const [difficultyFilter, setDifficultyFilter] = useState("전체")
  const [domainFilter, setDomainFilter] = useState("전체")

  // 페이지 레이아웃 상태 (A4 페이지 편집)
  interface PageLayout {
    id: number
    columns: number
    problemIds: string[]
    laneOf?: Record<string, number>
  }
  const [pages, setPages] = useState<PageLayout[]>([
    { id: 1, columns: 2, problemIds: [], laneOf: {} },
  ])

  // React Query를 사용해 선택된 단일 스킬의 문제를 가져오기
  const { data: problemsData, isLoading, error } = useProblemsBySkill(selectedSkill || "")
  
  // 스킬명 찾기 및 데이터 변환
  const skill = useMemo(() => {
    if (!selectedSkill) return null
    return skillChapters.flatMap(chapter => chapter.skillList)
      .find(skill => skill.skillId === selectedSkill)
  }, [selectedSkill, skillChapters])
  
  // API 데이터를 UI 형태로 변환
  const problems: UIProblem[] = useMemo(() => {
    if (!problemsData || !skill) return []
    return problemsData.map(problem => ({
      ...problem,
      skillName: skill.skillName
    }))
  }, [problemsData, skill])
  
  
  // 스킬이 변경될 때 문제 목록 페이지만 초기화 (페이지는 유지)
  useEffect(() => {
    if (selectedSkill) {
      setProblemListPage(1) // 문제 목록 페이지만 초기화
    }
  }, [selectedSkill])

  // 필터가 변경될 때마다 문제 목록 페이지 초기화
  useEffect(() => {
    setProblemListPage(1)
  }, [sourceFilter, methodFilter, difficultyFilter, domainFilter])

  // 필터링된 문제 목록 - API 데이터 구조에 맞게 수정
  const filteredProblems = problems.filter((problem) => {
    // 문제 출처 필터 (answerType 기준)
    if (sourceFilter !== "전체") {
      const apiAnswerType = problem.content?.answerType
      const mappedType = apiAnswerType === "choice" ? "객관식" : "주관식"
      if (mappedType !== sourceFilter) return false
    }
    
    // 출제방식 필터 - API에는 source 필드가 없으므로 tags에서 category 확인
    if (methodFilter !== "전체") {
      const sourceTag = problem.tags?.find(tag => 
        tag.type === "category" && 
        ["교과서", "문제집", "기출", "모의고사"].includes(tag.value)
      )
      if (!sourceTag || sourceTag.value !== methodFilter) return false
    }
    
    // 난이도 필터
    if (difficultyFilter !== "전체") {
      const difficultyMap: { [key: string]: string } = {
        "최상": "5",
        "상": "4", 
        "중": "3",
        "하": "2",
        "최하": "1"
      }
      const mappedDifficulty = difficultyMap[difficultyFilter] || difficultyFilter
      if (problem.difficulty !== mappedDifficulty) return false
    }
    
    // 문제 영역 필터 - API에는 domain 필드가 없으므로 생략하거나 ltype으로 대체
    // if (domainFilter !== "전체" && problem.ltype !== domainFilter) return false
    
    
    return true
  })

  // 페이징 처리
  const totalProblemPages = Math.ceil(filteredProblems.length / PROBLEMS_PER_PAGE)
  const paginatedProblems = filteredProblems.slice(
    (problemListPage - 1) * PROBLEMS_PER_PAGE,
    problemListPage * PROBLEMS_PER_PAGE
  )

  const selectedPageIndex = Math.max(0, Math.min(currentPage - 1, pages.length - 1))

  // 전체 문제 목록을 저장하기 위한 상태 (모든 스킬의 문제를 포함)
  const [allProblems, setAllProblems] = useState<UIProblem[]>([])
  
  // 현재 스킬의 문제가 로드될 때마다 전체 문제 목록에 추가
  useEffect(() => {
    if (problems.length > 0) {
      setAllProblems(prev => {
        const existing = prev.filter(p => !problems.some(newP => newP.problemId === p.problemId))
        return [...existing, ...problems]
      })
    }
  }, [problems])

  const getProblemById = useCallback((id: string) => allProblems.find((p) => p.problemId === id), [allProblems])

  const arrangedCount = useMemo(
    () => pages.reduce((acc, p) => acc + p.problemIds.length, 0),
    [pages],
  )

  const handleSubmit = () => {
    onOpenChange(false)
  }

  // ----- A4 칸반 유틸 -----
  const getLaneItems = useCallback((page: PageLayout): string[][] => {
    const laneCount = Math.max(1, Math.min(2, page.columns))
    const lanes: string[][] = Array.from({ length: laneCount }, () => [])
    const laneOf = page.laneOf ?? {}
    for (const id of page.problemIds) {
      const laneIndex = Math.max(0, Math.min(laneCount - 1, laneOf[id] ?? 0))
      lanes[laneIndex].push(id)
    }
    return lanes
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none translate-x-0 translate-y-0 rounded-none border-0 p-0 m-0" showCloseButton={false}>
        <DialogTitle className="sr-only">유형 문제 변경</DialogTitle>
        <div className="flex flex-col h-screen w-screen bg-white">
          {/* 상단 헤더 */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">함수 문제 변경</h2>
              <div className="flex items-center gap-4">
                {/* 필터 영역 */}
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-700">필터</h3>
                
                {/* 문제 출처 필터 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 ${sourceFilter !== "전체" ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      출처
                      {sourceFilter !== "전체" && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">문제 출처</h4>
                      <div className="space-y-1">
                        {["전체", "객관식", "주관식"].map((option) => (
                          <Button
                            key={option}
                            variant={sourceFilter === option ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSourceFilter(option)}
                            className="w-full justify-start text-xs h-7"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 출제방식 필터 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 ${methodFilter !== "전체" ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      방식
                      {methodFilter !== "전체" && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">출제방식</h4>
                      <div className="space-y-1">
                        {["전체", "교과서", "문제집", "기출", "모의고사"].map((option) => (
                          <Button
                            key={option}
                            variant={methodFilter === option ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setMethodFilter(option)}
                            className="w-full justify-start text-xs h-7"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 난이도 필터 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 ${difficultyFilter !== "전체" ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      난이도
                      {difficultyFilter !== "전체" && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">난이도</h4>
                      <div className="space-y-1">
                        {["전체", "최상", "상", "중", "하", "최하"].map((option) => (
                          <Button
                            key={option}
                            variant={difficultyFilter === option ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDifficultyFilter(option)}
                            className={`w-full justify-start text-xs h-7 ${
                              option === "최상" ? "text-red-600" :
                              option === "상" ? "text-orange-600" :
                              option === "중" ? "text-blue-600" :
                              option === "하" ? "text-green-600" :
                              option === "최하" ? "text-purple-600" : ""
                            }`}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* 문제 영역 필터 */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`h-8 ${domainFilter !== "전체" ? "bg-blue-50 border-blue-200" : ""}`}
                    >
                      <Brain className="w-4 h-4 mr-1" />
                      영역
                      {domainFilter !== "전체" && (
                        <Badge variant="secondary" className="ml-1 h-4 text-xs px-1">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">문제 영역</h4>
                      <div className="space-y-1">
                        {["전체", "계산", "이해", "추론", "해결"].map((option) => (
                          <Button
                            key={option}
                            variant={domainFilter === option ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setDomainFilter(option)}
                            className="w-full justify-start text-xs h-7"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                  {/* 필터 초기화 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSourceFilter("전체")
                      setMethodFilter("전체")
                      setDifficultyFilter("전체")
                      setDomainFilter("전체")
                      setProblemListPage(1) // 페이지도 초기화
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    초기화
                  </Button>
                </div>
                
                {/* 닫기 버튼 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 선택된 필터 표시 */}
            {(sourceFilter !== "전체" || methodFilter !== "전체" || difficultyFilter !== "전체" || domainFilter !== "전체") && (
              <div className="flex flex-wrap gap-2 mt-3">
                {sourceFilter !== "전체" && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    출처: {sourceFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-blue-100"
                      onClick={() => setSourceFilter("전체")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {methodFilter !== "전체" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    방식: {methodFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-green-100"
                      onClick={() => setMethodFilter("전체")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {difficultyFilter !== "전체" && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    난이도: {difficultyFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-orange-100"
                      onClick={() => setDifficultyFilter("전체")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {domainFilter !== "전체" && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    영역: {domainFilter}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0 hover:bg-purple-100"
                      onClick={() => setDomainFilter("전체")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* 메인 컨텐츠 영역 - 3단 그리드 (항목 선택 | A4 | 페이지맵) */}
          <div className="flex-1 grid grid-cols-[1.0fr_2.8fr_0.6fr] h-full">
            {/* 1단: 항목 선택 (왼쪽) */}
            <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full min-h-0">
              <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  항목을 선택해 주세요
                </h3>

                {/* 선택된 스킬 표시 */}
                {selectedSkill && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                      선택된 항목: {selectedSkill ? 1 : 0}개
                      {isLoading && <span className="ml-2 text-blue-600">로딩 중...</span>}
                    </div>
                    {selectedSkill && (
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          // skillId로 실제 skill 정보 찾기
                          const skill = skillChapters.flatMap(chapter => chapter.skillList)
                            .find(skill => skill.skillId === selectedSkill)
                          return skill ? (
                            <Badge key={selectedSkill} variant="outline" className="bg-purple-100 text-purple-800 text-xs">
                              {skill.skillName}
                            </Badge>
                          ) : null
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1 min-h-0 overflow-auto">
                {skillChapters.length > 0 ? (
                  <div className="p-4 space-y-6">
                    {skillChapters.map((chapter) => (
                      <div key={chapter.chapterId} className="space-y-3">
                        {/* 챕터 헤더 */}
                        <div className="flex items-center justify-between pb-2 border-b">
                          <h4 className="font-medium text-gray-800">{chapter.chapterIndex} {chapter.chapterName}</h4>
                        </div>

                        {/* 스킬 목록 */}
                        <div className="space-y-2">
                          {chapter.skillList.map((skill) => (
                            <div
                              key={skill.skillId}
                              className={`px-4 py-2 bg-white rounded-lg border cursor-pointer transition-colors ${
                                selectedSkill === skill.skillId
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => selectSkill(skill.skillId)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedSkill === skill.skillId
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}>
                                    {selectedSkill === skill.skillId && (
                                      <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium">{skill.skillName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                                    {skill.counts}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <div className="text-center">
                      <p>선택된 상세 항목에 대한 문제가 없습니다</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* 2단: A4 페이지 편집기 (중앙) */}
            <div className="relative flex flex-col h-full">
              {/* A4 미리보기 & 드롭 영역 */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="w-full h-full flex items-start justify-center">
                  <div className="bg-white border border-gray-300 shadow-sm w-full max-w-none py-4">
                    {/* 스킬이 선택되지 않았을 때 안내 메시지 */}
                    {!selectedSkill ? (
                      <div className="flex items-center justify-center h-[60vh] text-gray-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">왼쪽에서 항목을 선택해주세요</p>
                          <p className="text-sm">선택한 항목의 문제들이 여기에 표시됩니다</p>
                        </div>
                      </div>
                    ) : isLoading ? (
                      <div className="flex items-center justify-center h-[60vh] text-gray-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">문제를 불러오고 있습니다...</p>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-[60vh] text-red-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">문제를 불러오는 중 오류가 발생했습니다</p>
                          <p className="text-sm">{error.message}</p>
                        </div>
                      </div>
                    ) : problems.length === 0 ? (
                      <div className="flex items-center justify-center h-[60vh] text-gray-500">
                        <div className="text-center">
                          <p className="text-lg mb-2">해당 항목에는 문제가 없습니다</p>
                          <p className="text-sm">다른 항목을 선택해보세요</p>
                        </div>
                      </div>
                    ) : (
                    <div>
                      {/* 문제 목록 영역 - 2 column layout with dotted line */}
                      <div className="mb-4 px-1">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b px-4">
                          <div className="text-sm font-medium text-gray-700">
                            사용 가능한 문제 ({filteredProblems.length}개)
                          </div>
                          {/* 페이징 컨트롤 */}
                          {totalProblemPages > 1 && (
                            <div className="flex items-center gap-1 bg-white rounded-lg border px-2 py-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setProblemListPage(Math.max(1, problemListPage - 1))}
                                disabled={problemListPage === 1}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium text-gray-700 px-2 min-w-[60px] text-center">
                                {problemListPage} / {totalProblemPages}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setProblemListPage(Math.min(totalProblemPages, problemListPage + 1))}
                                disabled={problemListPage === totalProblemPages}
                                className="h-6 w-6 p-0 hover:bg-gray-100"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                         <ScrollArea className="h-[calc(100vh-300px)] w-full px-2">
                          {/* 가운데 점선 */}
                          <div className="absolute left-1/2 top-2 bottom-2 border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-10"></div>
                          {/* ScrollArea로 스크롤 처리 */}
                            {/* 2 column grid */}
                            <div className="grid grid-cols-2 gap-4">
                              {paginatedProblems.map((problem, index) => (
                                <div key={problem.problemId} className={`${index % 2 === 0 ? 'pr-2' : 'pl-2'}`}>
                                  <div className="border rounded-lg p-2 bg-white">
                                    {/* 문제 번호 표시 */}
                                    <div className="mb-2 px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                                      문제 번호: {problem.problemNumber || problem.problemId}
                                    </div>
                                    <ProblemView
                                      problem={problem as any}
                                      width={390}
                                      margin={20}
                                      level={Number(problem.difficulty)}
                                      skillId={problem.tags?.find(tag => tag.type === "skill")?.skillId || ""}
                                      ltype={problem.ltype}
                                      answerType={problem.content?.answerType || "choice"}
                                      skillName={problem.skillName}
                                      solution={false}
                                      showTags={true}
                                    />
                                    <div className="mt-2 flex justify-center">
                                      {(() => {
                                        // 모든 페이지에서 해당 문제가 이미 추가되었는지 확인
                                        const isAddedInAnyPage = pages.some(page => page.problemIds.includes(problem.problemId))
                                        
                                        return (
                                          <Button
                                            size="sm"
                                            variant={isAddedInAnyPage ? "destructive" : "outline"}
                                            onClick={() => {
                                              if (isAddedInAnyPage) {
                                                // 문제 제거 - 모든 페이지에서 해당 문제 제거
                                                setPages((prev) => {
                                                  return prev.map(page => ({
                                                    ...page,
                                                    problemIds: page.problemIds.filter(id => id !== problem.problemId),
                                                    laneOf: (() => {
                                                      const newLaneOf = { ...(page.laneOf || {}) }
                                                      delete newLaneOf[problem.problemId]
                                                      return newLaneOf
                                                    })()
                                                  }))
                                                })
                                              } else {
                                                // 문제 추가 - 빈 자리가 있는 페이지를 찾거나 새 페이지 생성
                                                setPages((prev) => {
                                                  const next = prev.map(page => ({
                                                    ...page,
                                                    problemIds: [...page.problemIds],
                                                    laneOf: { ...(page.laneOf || {}) }
                                                  }))
                                                  
                                                  // 빈 자리가 있는 페이지 찾기
                                                  let targetPageIndex = -1
                                                  for (let i = 0; i < next.length; i++) {
                                                    if (next[i].problemIds.length < 4) {
                                                      targetPageIndex = i
                                                      break
                                                    }
                                                  }
                                                  
                                                  // 빈 자리가 없으면 새 페이지 생성
                                                  if (targetPageIndex === -1) {
                                                    const newPageId = Math.max(...next.map(p => p.id)) + 1
                                                    const newPage = { 
                                                      id: newPageId, 
                                                      columns: 2, 
                                                      problemIds: [problem.problemId], 
                                                      laneOf: { [problem.problemId]: 0 } 
                                                    }
                                                    next.push(newPage)
                                                    // 새 페이지로 이동
                                                    setCurrentPage(next.length)
                                                  } else {
                                                    // 기존 페이지에 추가
                                                    const targetPage = next[targetPageIndex]
                                                    targetPage.problemIds.push(problem.problemId)
                                                    // 좌(0) 1,2 → 우(1) 3,4 순서로 배치
                                                    const currentCount = targetPage.problemIds.length
                                                    if (currentCount <= 2) {
                                                      targetPage.laneOf[problem.problemId] = 0 // 좌측 컬럼
                                                    } else {
                                                      targetPage.laneOf[problem.problemId] = 1 // 우측 컬럼
                                                    }
                                                  }
                                                  
                                                  return next
                                                })
                                              }
                                            }}
                                            className="w-full"
                                          >
                                            {isAddedInAnyPage ? (
                                              <>
                                                <Minus className="w-4 h-4 mr-1" />
                                                문제 제거
                                              </>
                                            ) : (
                                              <>
                                                <Plus className="w-4 h-4 mr-1" />
                                                문제 추가
                                              </>
                                            )}
                                          </Button>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3단: 페이지 맵 (오른쪽) */}
            <div className="bg-gray-50 border-l border-gray-200 flex flex-col h-full">
              <div className="p-4 h-16 border-b border-gray-200">
                <h3 className="font-semibold text-lg">페이지 맵</h3>
              </div>
              
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">컬럼</div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPages((prev) => {
                            const idx = selectedPageIndex
                            const next = prev.map((p) => ({ ...p }))
                            next[idx].columns = Math.max(1, Math.min(2, next[idx].columns - 1))
                            return next
                          })}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setPages((prev) => {
                            const idx = selectedPageIndex
                            const next = prev.map((p) => ({ ...p }))
                            next[idx].columns = Math.max(1, Math.min(2, next[idx].columns + 1))
                            return next
                          })}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{pages[selectedPageIndex]?.columns || 2}</div>
                  </div>

                  <div className="bg-white rounded-lg border p-3">
                    <div className="text-sm font-medium mb-2">배치된 문제</div>
                    <div className="text-lg font-semibold">{arrangedCount}개</div>
                  </div>

                  <div className="bg-white rounded-lg border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">페이지 목록</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          title="페이지 삭제"
                          onClick={() => setPages((prev) => {
                            if (prev.length <= 1) return prev
                            const idx = selectedPageIndex
                            const next = prev.filter((_, i) => i !== idx)
                            // 현재 페이지 재조정
                            setCurrentPage((p) => Math.max(1, Math.min(p, next.length)))
                            return next
                          })}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-6 w-6 p-0"
                          title="페이지 추가"
                          onClick={() => setPages((prev) => {
                            const newId = (prev[prev.length - 1]?.id ?? 0) + 1
                            return [...prev, { id: newId, columns: Math.max(1, Math.min(2, prev[selectedPageIndex]?.columns ?? 2)), problemIds: [], laneOf: {} }]
                          })}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {pages.map((pg, i) => (
                        <div
                          key={`pagemap-${pg.id}`}
                          className={`rounded-md border p-2 ${i === selectedPageIndex ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-medium">페이지 {i + 1}</div>
                            <div className="text-[10px] text-gray-500">{pg.problemIds.length}개</div>
                          </div>
                          <div className="relative">
                            {pg.columns === 2 && (
                              <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-gray-300" />
                            )}
                            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${pg.columns}, minmax(0, 1fr))` }}>
                              {getLaneItems(pg).map((lane, laneIdx) => (
                                <div key={`pmap-${i}-col-${laneIdx}`} className="min-h-6 border border-dashed border-transparent p-0.5">
                                  {lane.length === 0 && (
                                    <div className="h-6 rounded-sm border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400 flex items-center justify-center">
                                      비어있음
                                    </div>
                                  )}
                                  {lane.map((pid, idx2) => {
                                    const problem = getProblemById(pid)
                                    const problemNumber = problem?.problemNumber || problem?.problemId || pid
                                    return (
                                      <div key={`mini-${pid}-${idx2}`} className="h-8 rounded-sm border bg-white text-[10px] text-gray-700 flex items-center justify-center truncate cursor-move mb-1">
                                        문제 {problemNumber}
                                      </div>
                                    )
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 액션 바 */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                배치된 문제: <span className="font-medium">{arrangedCount}</span>개
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  취소
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={arrangedCount === 0}
                >
                  선택 완료 ({arrangedCount})
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}