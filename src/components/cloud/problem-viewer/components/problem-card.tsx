"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, Copy, BookOpen, Edit, FileText } from "lucide-react"
import type { Problem } from "@/types/problem"

interface ProblemCardProps {
  problem: Problem
  index: number
  showAnswer?: boolean
  showExplanation?: boolean
  showCurriculum?: boolean
  onToggleAnswer?: (problemId: string) => void
  onCopyProblem?: (problem: Problem) => void
}

export function ProblemCard({
  problem,
  index,
  showAnswer = false,
  showExplanation = false,
  showCurriculum = true,
  onToggleAnswer,
  onCopyProblem
}: ProblemCardProps) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(showAnswer)

  const difficultyLabels = {
    '1': '최하',
    '2': '하', 
    '3': '중',
    '4': '상',
    '5': '최상'
  }

  const ltypeLabels = {
    'calc': '계산',
    'unds': '이해',
    'soln': '해결', 
    'resn': '추론'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '1': return 'bg-blue-100 text-blue-800'
      case '2': return 'bg-green-100 text-green-800'
      case '3': return 'bg-yellow-100 text-yellow-800'
      case '4': return 'bg-orange-100 text-orange-800'
      case '5': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLtypeColor = (ltype: string) => {
    switch (ltype) {
      case 'calc': return 'bg-blue-100 text-blue-800'
      case 'unds': return 'bg-green-100 text-green-800'
      case 'soln': return 'bg-purple-100 text-purple-800'
      case 'resn': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleToggleAnswer = () => {
    setIsAnswerVisible(!isAnswerVisible)
    onToggleAnswer?.(problem.problemId)
  }

  const handleCopy = () => {
    onCopyProblem?.(problem)
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          {/* 문제 번호 및 타입 뱃지 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold">
              {problem.problemNumber || (index + 1)}
            </div>
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {difficultyLabels[problem.difficulty as keyof typeof difficultyLabels] || problem.difficulty}
            </Badge>
            <Badge className={getLtypeColor(problem.ltype)}>
              {ltypeLabels[problem.ltype as keyof typeof ltypeLabels] || problem.ltype}
            </Badge>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
              title="복사해서 문제만들기"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAnswer}
              className="h-8 w-8 p-0"
              title="수정하기"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 space-y-4">
          {/* 문제 내용 */}
          <div 
            className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ 
              __html: problem.content?.value || "문제 내용이 없습니다." 
            }}
          />

          {/* 선택지 (객관식 문제인 경우) */}
          {problem.content?.choice?.values && problem.content.choice.values.some(v => v.trim() !== '') && (
            <div className="space-y-1">
              {problem.content.choice.values.map((choice, idx) => {
                if (!choice.trim()) return null
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{choice}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* 답안 영역 (토글 가능) */}
          {problem.content?.answer?.answers && isAnswerVisible && (
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">정답</h4>
              <div className="text-sm text-gray-800 dark:text-gray-200">
                {problem.content.answer.answers.map((ans, idx) => (
                  <div key={idx}>{ans.value}</div>
                ))}
              </div>
            </div>
          )}

          {/* 해설 (showExplanation이 true일 때) */}
          {problem.solution?.value && showExplanation && isAnswerVisible && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              <h4 className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">해설</h4>
              <div 
                className="text-sm text-blue-800 dark:text-blue-200"
                dangerouslySetInnerHTML={{ __html: problem.solution.value }}
              />
            </div>
          )}
        </div>

        {/* 하단 고정 정보 영역 */}
        <div className="mt-auto space-y-3">
          {/* 출처 정보 (태그에서 추출) */}
          {problem.tags && problem.tags.filter(tag => tag.type === 'paper').length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <FileText className="w-3 h-3" />
                <span className="font-medium">출처:</span>
                {problem.tags
                  .filter(tag => tag.type === 'paper')
                  .map((tag, idx) => (
                    <span key={idx}>
                      {tag.value}
                    </span>
                  ))
                  .reduce((prev, curr, idx) => prev.length === 0 ? [curr] : [...prev, ', ', curr], [] as React.ReactNode[])
                }
              </div>
            </div>
          )}

          {/* 스킬 정보 (태그에서 추출) */}
          {problem.tags && showCurriculum && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <BookOpen className="w-3 h-3" />
                {problem.tags
                  .filter(tag => tag.type === 'skill')
                  .map((tag, idx) => (
                    <span key={idx}>
                      {tag.value}
                    </span>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}