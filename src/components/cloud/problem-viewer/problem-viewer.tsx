"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProblemViewerHeader } from "./components/problem-viewer-header"
import { ProblemFilterBar } from "./components/problem-filter-bar"
import { ProblemGrid } from "./components/problem-grid"
import { useFileWithProblems } from "@/hooks/use-problems"
import type { ProblemFilter, ProblemViewerSettings, Problem } from "@/types/problem"
import { useMemo } from "react"

interface ProblemViewerProps {
  fileId: string
  title: string
}

export function ProblemViewer({ fileId, title }: ProblemViewerProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<ProblemFilter>({})
  const [settings, setSettings] = useState<ProblemViewerSettings>({
    layout: 'grid',
    problemsPerPage: 20,
    showAnswer: false,
    showExplanation: false,
    showCurriculum: true,
    autoSave: true
  })

  // 파일 정보와 문제 목록 조회
  const {
    data: fileData,
    isLoading,
    error
  } = useFileWithProblems(fileId)

  // 필터링된 문제 목록 계산
  const filteredProblems = useMemo(() => {
    if (!fileData?.problemList) return []
    
    let problems = fileData.problemList

    // 난이도 필터
    if (filter.difficulty?.length) {
      problems = problems.filter(p => filter.difficulty!.includes(p.difficulty))
    }

    // 유형 필터
    if (filter.ltype?.length) {
      problems = problems.filter(p => filter.ltype!.includes(p.ltype))
    }

    // 문제 타입 필터 (선택형/주관식)
    if (filter.choiceType?.length) {
      problems = problems.filter(p => {
        // choice가 있으면 객관식, 없으면 주관식으로 판단
        const isChoice = p.content?.choice?.values?.some(v => v.trim() !== '')
        const problemType = isChoice ? 'choice' : 'subjective'
        return filter.choiceType!.includes(problemType)
      })
    }

    // 검색 텍스트 필터
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase()
      problems = problems.filter(p => 
        p.content?.value?.toLowerCase().includes(searchLower) ||
        p.problemNumber?.toLowerCase().includes(searchLower)
      )
    }

    return problems
  }, [fileData?.problemList, filter])

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredProblems.length / settings.problemsPerPage)
  const startIndex = (currentPage - 1) * settings.problemsPerPage
  const currentProblems = filteredProblems.slice(startIndex, startIndex + settings.problemsPerPage)

  // 통계 계산
  const stats = useMemo(() => {
    if (!filteredProblems.length) return null

    const byDifficulty: Record<string, number> = {}
    const byLtype: Record<string, number> = {}
    const byChoiceType: Record<string, number> = {}

    filteredProblems.forEach(problem => {
      // 난이도별 통계
      byDifficulty[problem.difficulty] = (byDifficulty[problem.difficulty] || 0) + 1
      
      // 유형별 통계
      byLtype[problem.ltype] = (byLtype[problem.ltype] || 0) + 1
      
      // 문제 타입별 통계
      const isChoice = problem.content?.choice?.values?.some(v => v.trim() !== '')
      const problemType = isChoice ? 'choice' : 'subjective'
      byChoiceType[problemType] = (byChoiceType[problemType] || 0) + 1
    })

    return {
      total: filteredProblems.length,
      byDifficulty,
      byLtype,
      byChoiceType,
      bySkill: {}
    }
  }, [filteredProblems])

  const handleBack = () => {
    router.back()
  }

  const handleShowStats = () => {
    // TODO: 통계 모달 열기
    console.log("통계 보기")
  }

  const handleShowFlashcard = () => {
    // TODO: 플래시카드 모드 열기
    console.log("플래시카드")
  }

  const handleGenerateExam = () => {
    // TODO: 시험지 생성 모달 열기
    console.log("시험지 생성")
  }

  const handleSettings = () => {
    // TODO: 설정 모달 열기
    console.log("설정")
  }

  const handleFilterChange = (newFilter: ProblemFilter) => {
    setFilter(newFilter)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleProblemCopy = (problem: Problem) => {
    // TODO: 문제 복사 로직
    console.log("문제 복사:", problem.problemId)
  }

  const handleAnswerToggle = (problemId: string) => {
    console.log("답안 토글:", problemId)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">문제를 불러올 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error.message}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            뒤로가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <ProblemViewerHeader
        title={fileData?.title || title}
        stats={stats}
        isLoading={isLoading}
        onBack={handleBack}
        onShowStats={handleShowStats}
        onShowFlashcard={handleShowFlashcard}
        onGenerateExam={handleGenerateExam}
        onSettings={handleSettings}
      />

      {/* 필터 바 */}
      <ProblemFilterBar
        filter={filter}
        stats={stats}
        onFilterChange={handleFilterChange}
      />

      {/* 문제 그리드 */}
      <ProblemGrid
        problems={currentProblems}
        isLoading={isLoading}
        settings={settings}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onProblemCopy={handleProblemCopy}
        onAnswerToggle={handleAnswerToggle}
      />
    </div>
  )
}