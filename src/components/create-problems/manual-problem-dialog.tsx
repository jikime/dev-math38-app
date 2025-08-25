"use client"

import React, { useCallback, useMemo, useState, useEffect } from "react"
import { useManualProblemStore } from "@/stores/manual-problem-store"
import { useProblemsBySkill } from "@/hooks/use-problems"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, X, Filter, BookOpen, Award, Brain, Plus, Minus } from "lucide-react"
import { ApiProblem } from "@/types/api-problem"
import ProblemView from "@/components/math-paper/template/manual/problem-view"
import { SpProblem } from "@/components/math-paper/typings"

// API 문제를 UI에서 사용할 형태로 변환하는 타입
interface UIProblem extends ApiProblem {
  // UI에서 필요한 추가 속성들
  skillName?: string;
}

interface FunctionProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProblems: UIProblem[]
  onProblemsChange: (problems: UIProblem[]) => void
}

export function FunctionProblemDialog({
  open,
  onOpenChange,
  selectedProblems,
  onProblemsChange,
}: FunctionProblemDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  // zustand 스토어에서 항목 관련 상태 가져오기
  const { 
    skillChapters, 
    selectedSkills, 
    toggleSkill, 
    toggleAllSkillsInChapter 
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

  // 선택된 스킬들의 문제를 각각 hook으로 가져오기
  const [problemsData, setProblemsData] = useState<Record<string, UIProblem[]>>({})
  
  // 각 선택된 스킬에 대해 개별적으로 API 호출
  useEffect(() => {
    const loadSkillProblems = async () => {
      console.log('선택된 스킬들:', selectedSkills)
      
      for (const skillId of selectedSkills) {
        if (problemsData[skillId]) {
          console.log(`스킬 ${skillId}는 이미 로드됨`)
          continue // 이미 로드된 스킬은 스킵
        }
        
        console.log(`스킬 ${skillId}의 문제들을 로드 중...`)
        try {
          const response = await fetch(`https://math2.suzag.com/app/skill/${skillId}/problems`)
          const data: ApiProblem[] = await response.json()
          
          console.log(`스킬 ${skillId}에서 ${data.length}개의 문제를 로드함`)
          
          // 스킬명 찾기
          const skill = skillChapters.flatMap(chapter => chapter.skillList)
            .find(skill => skill.skillId === skillId)
          
          const skillProblems = data.map(problem => ({ 
            ...problem, 
            skillName: skill?.skillName 
          }))
          
          setProblemsData(prev => ({
            ...prev,
            [skillId]: skillProblems
          }))
        } catch (error) {
          console.error(`스킬 ${skillId} 문제 로딩 실패:`, error)
        }
      }
    }
    
    if (selectedSkills.length > 0) {
      loadSkillProblems()
    } else {
      console.log('선택된 스킬이 없습니다')
    }
  }, [selectedSkills, skillChapters, problemsData])
  
  // 모든 선택된 스킬의 문제들을 합치기
  const allProblems = useMemo(() => {
    return selectedSkills.flatMap(skillId => problemsData[skillId] || [])
  }, [selectedSkills, problemsData])
  
  // allProblems는 이미 선택된 스킬의 문제들만 포함하고 있으므로 그대로 사용
  const problems: UIProblem[] = allProblems

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


  // 페이지 맵 페이지 수
  const totalPages = pages.length



  const selectedPageIndex = Math.max(0, Math.min(currentPage - 1, pages.length - 1))

  const getProblemById = useCallback((id: string) => problems.find((p) => p.problemId === id), [problems])

  // 초기 로딩 시 부모로부터 받은 선택 문제를 페이지 1에 채워 넣기
  React.useEffect(() => {
    if (selectedProblems.length > 0 && pages.every((p) => p.problemIds.length === 0)) {
      setPages((prev) => {
        const next = [...prev]
        const laneOf: Record<string, number> = {}
        selectedProblems.forEach((p) => { laneOf[p.problemId] = 0 })
        next[0] = { ...next[0], problemIds: selectedProblems.map((p) => p.problemId), laneOf }
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const removeFromPage = (pageIndex: number, problemId: string) => {
    setPages((prev) => {
      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds], laneOf: { ...(p.laneOf ?? {}) } }))
      const page = next[pageIndex]
      page.problemIds = page.problemIds.filter((id) => id !== problemId)
      if (page.laneOf) delete page.laneOf[problemId]
      return next
    })
  }

  const arrangedCount = useMemo(
    () => pages.reduce((acc, p) => acc + p.problemIds.length, 0),
    [pages],
  )

  const handleSubmit = () => {
    const arrangedProblemsFlat: UIProblem[] = pages
      .flatMap((pg) => pg.problemIds)
      .map((id) => getProblemById(id))
      .filter(Boolean) as UIProblem[]
    onProblemsChange(arrangedProblemsFlat)
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


  const handleA4DragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const [, pageIdxStr, , srcColStr] = source.droppableId.split("-") // page-<idx>-col-<colIdx>
    const [, pageIdxStr2, , dstColStr] = destination.droppableId.split("-")
    const pageIndex = parseInt(pageIdxStr)
    const pageIndex2 = parseInt(pageIdxStr2)
    if (Number.isNaN(pageIndex) || Number.isNaN(pageIndex2)) return

    setPages((prev) => {
      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds], laneOf: { ...(p.laneOf ?? {}) } }))
      const page = next[pageIndex]
      const laneOf = page.laneOf ?? {}
      const lanes = getLaneItems(page)
      const srcCol = parseInt(srcColStr)
      const dstCol = parseInt(dstColStr)

      // 원래 위치에서 제거
      const srcItems = [...lanes[srcCol]]
      const [removed] = srcItems.splice(source.index, 1)
      if (!removed) return prev

      // 대상 위치에 삽입
      const dstItems = srcCol === dstCol ? srcItems : [...lanes[dstCol]]
      dstItems.splice(destination.index, 0, removed)

      // 새로운 레인 배열 구성
      const newLanes = lanes.map((arr, i) => {
        if (i === srcCol && srcCol !== dstCol) return srcItems
        if (i === dstCol) return dstItems
        if (i === srcCol && srcCol === dstCol) return dstItems
        return arr
      })

      // laneOf 업데이트 및 problemIds 재구성(좌→우 컬럼 순)
      for (let i = 0; i < newLanes.length; i++) {
        for (const id of newLanes[i]) laneOf[id] = i
      }
      page.problemIds = newLanes.flat()
      page.laneOf = laneOf
      return next
    })
  }

  // 페이지 맵(오른쪽) 드래그 앤 드롭 핸들러
  const handlePmapDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return

    const [srcPrefix, srcPageIdxStr, , srcColStr] = source.droppableId.split("-") // pmap-<pageIdx>-col-<colIdx>
    const [dstPrefix, dstPageIdxStr, , dstColStr] = destination.droppableId.split("-")
    if (srcPrefix !== "pmap" || dstPrefix !== "pmap") return
    const pageIndex = parseInt(srcPageIdxStr)
    const pageIndex2 = parseInt(dstPageIdxStr)
    if (Number.isNaN(pageIndex) || Number.isNaN(pageIndex2)) return

    setPages((prev) => {
      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds], laneOf: { ...(p.laneOf ?? {}) } }))
      const page = next[pageIndex]
      const laneOf = page.laneOf ?? {}
      const lanes = getLaneItems(page)
      const srcCol = parseInt(srcColStr)
      const dstCol = parseInt(dstColStr)

      // 원래 위치에서 제거
      const srcItems = [...lanes[srcCol]]
      const [removed] = srcItems.splice(source.index, 1)
      if (!removed) return prev

      // 대상 위치에 삽입
      const dstItems = srcCol === dstCol ? srcItems : [...lanes[dstCol]]
      dstItems.splice(destination.index, 0, removed)

      // 새로운 레인 배열 구성
      const newLanes = lanes.map((arr, i) => {
        if (i === srcCol && srcCol !== dstCol) return srcItems
        if (i === dstCol) return dstItems
        if (i === srcCol && srcCol === dstCol) return dstItems
        return arr
      })

      // laneOf 업데이트 및 problemIds 재구성
      for (let i = 0; i < newLanes.length; i++) {
        for (const id of newLanes[i]) laneOf[id] = i
      }
      page.problemIds = newLanes.flat()
      page.laneOf = laneOf
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none translate-x-0 translate-y-0 rounded-none border-0 p-0 m-0" showCloseButton={false}>
        <DialogTitle className="sr-only">함수 문제 변경</DialogTitle>
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
          <div className="flex-1 grid grid-cols-[1.2fr_2.8fr_0.6fr] h-full">
            {/* 1단: 항목 선택 (왼쪽) */}
            <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full min-h-0">
              <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  항목을 선택해 주세요
                </h3>

                {/* 선택된 스킬 표시 */}
                {selectedSkills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">선택된 항목: {selectedSkills.length}개</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSkills.slice(0, 3).map((skillId) => {
                        // skillId로 실제 skill 정보 찾기
                        const skill = skillChapters.flatMap(chapter => chapter.skillList)
                          .find(skill => skill.skillId === skillId)
                        return skill ? (
                          <Badge key={skillId} variant="outline" className="bg-purple-100 text-purple-800 text-xs">
                            {skill.skillName.substring(0, 20)}...
                          </Badge>
                        ) : null
                      })}
                      {selectedSkills.length > 3 && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 text-xs">
                          +{selectedSkills.length - 3}개 더
                        </Badge>
                      )}
                    </div>
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
                          <button
                            onClick={() => toggleAllSkillsInChapter(chapter)}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              chapter.skillList.every(skill => selectedSkills.includes(skill.skillId))
                                ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {chapter.skillList.every(skill => selectedSkills.includes(skill.skillId))
                              ? "전체 해제"
                              : "전체 선택"
                            }
                          </button>
                        </div>

                        {/* 스킬 목록 */}
                        <div className="space-y-2">
                          {chapter.skillList.map((skill) => (
                            <div
                              key={skill.skillId}
                              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                                selectedSkills.includes(skill.skillId)
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => toggleSkill(skill.skillId)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedSkills.includes(skill.skillId)}
                                    onCheckedChange={() => {}}
                                  />
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
              {/* 상단 내비게이션 (페이지 이동) */}
              <div className="p-4 border-b border-gray-200 grid grid-cols-[1fr_auto_1fr] items-center">
                <div />
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pages.map((_, idx) => (
                      <Button
                        key={`page-btn-${idx + 1}`}
                        size="sm"
                        variant={currentPage === idx + 1 ? "default" : "outline"}
                        className="h-7 px-2"
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-end">
                  <Button size="sm" onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-white">수동 출제 적용</Button>
                </div>
              </div>

              {/* A4 미리보기 & 드롭 영역 */}
              <div className="flex-1 p-4 overflow-auto">
                <div className="w-full h-full flex items-start justify-center">
                  <div
                    className="bg-white border border-gray-300 shadow-sm w-full max-w-none min-h-[80vh] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">A4 미리보기</div>
                      <div className="text-xs text-gray-500">컬럼: {pages[selectedPageIndex]?.columns ?? 1}</div>
                    </div>
                    <DragDropContext onDragEnd={handleA4DragEnd}>
                      <div className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${pages[selectedPageIndex]?.columns ?? 1}, minmax(0, 1fr))` }}>
                        {pages[selectedPageIndex]?.columns === 2 && (
                          <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-gray-300" />
                        )}
                        {pages[selectedPageIndex] && getLaneItems(pages[selectedPageIndex]).map((lane, laneIdx) => (
                          <Droppable droppableId={`page-${selectedPageIndex}-col-${laneIdx}`} key={`lane-${laneIdx}`}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[60vh] bg-transparent border border-dashed border-transparent">
                                {lane.map((pid, index) => {
                                  const problem = getProblemById(pid)
                                  if (!problem) return null
                                  
                                  // SpProblem 형태로 변환
                                  const spProblem: SpProblem = {
                                    problemId: problem.problemId,
                                    content: problem.content,
                                    solution: problem.solution,
                                    tags: problem.tags || [],
                                    groupId: problem.groupId,
                                    academyId: problem.academyId,
                                    subjectId: problem.subjectId,
                                    creator: problem.creator,
                                    atype: problem.atype,
                                    ltype: problem.ltype,
                                    fileId: problem.fileId,
                                    bookName: problem.bookName,
                                    page: problem.page,
                                    problemNumber: problem.problemNumber,
                                    difficulty: problem.difficulty,
                                    meta: problem.meta,
                                    printHeight: problem.printHeight,
                                    accessableIds: problem.accessableIds,
                                    needToRecache: problem.needToRecache,
                                    checkType: problem.checkType,
                                    contentsImageId: problem.contentsImageId,
                                    solutionImageId: problem.solutionImageId,
                                    quotedFromDetail: problem.quotedFromDetail,
                                    bookId: problem.bookId,
                                    images: problem.images,
                                    app: problem.app,
                                    sample: problem.sample,
                                    quotedFrom: problem.quotedFrom
                                  }
                                  
                                  return (
                                    <Draggable draggableId={pid} index={index} key={`drag-${pid}`}>
                                      {(drag) => (
                                        <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="cursor-move hover:shadow-md mb-4">
                                          <div className="flex items-center justify-end mb-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              onClick={() => removeFromPage(selectedPageIndex, problem.problemId)}
                                            >
                                              <X className="w-4 h-4" />
                                            </Button>
                                          </div>
                                          <ProblemView
                                            problem={spProblem}
                                            width={390}
                                            margin={20}
                                            level={Number(problem.difficulty)}
                                            skillId={problem.tags?.find(tag => tag.type === "skill")?.skillId || ""}
                                            ltype={problem.ltype}
                                            answerType={problem.content?.answerType || "choice"}
                                            skillName={problem.skillName}
                                            solution={false}
                                            showTags={false}
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        ))}
                      </div>
                    </DragDropContext>
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
                    <div className="text-sm font-medium mb-2">현재 페이지</div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">{currentPage}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPages((prev) => {
                            const idx = selectedPageIndex
                            const next = prev.map((p) => ({ ...p }))
                            next[idx].columns = Math.max(1, Math.min(2, next[idx].columns - 1))
                            return next
                          })}
                        >
                          - 컬럼
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setPages((prev) => {
                            const idx = selectedPageIndex
                            const next = prev.map((p) => ({ ...p }))
                            next[idx].columns = Math.max(1, Math.min(2, next[idx].columns + 1))
                            return next
                          })}
                        >
                          + 컬럼
                        </Button>
                      </div>
                    </div>
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
                          className="h-7 w-7 p-0"
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
                          className="h-7 w-7 p-0"
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
                    <DragDropContext onDragEnd={handlePmapDragEnd}>
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
                                  <Droppable droppableId={`pmap-${i}-col-${laneIdx}`} key={`pmap-${i}-col-${laneIdx}`}>
                                    {(provided) => (
                                      <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-6 border border-dashed border-transparent p-0.5">
                                        {lane.length === 0 && (
                                          <div className="h-6 rounded-sm border border-dashed border-gray-300 bg-gray-50 text-[11px] text-gray-400 flex items-center justify-center">
                                            드롭
                                          </div>
                                        )}
                                        {lane.map((pid, idx2) => (
                                          <Draggable draggableId={`pmap-${i}-${pid}`} index={idx2} key={`mini-drag-${i}-${pid}`}>
                                            {(drag) => (
                                              <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="h-8 rounded-sm border bg-white text-[10px] text-gray-700 flex items-center justify-center truncate cursor-move mb-1" title={getProblemById(pid)?.content?.value || pid}>
                                                {pid}
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DragDropContext>
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