"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProblemFilter, ProblemStats } from "@/types/problem"

interface ProblemFilterBarProps {
  filter: ProblemFilter
  stats: ProblemStats | null
  onFilterChange: (filter: ProblemFilter) => void
}

export function ProblemFilterBar({ filter, stats, onFilterChange }: ProblemFilterBarProps) {
  const [activeFilters, setActiveFilters] = useState(filter)

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

  const choiceTypeLabels = {
    'choice': '객관식',
    'subjective': '주관식'
  }

  const handleFilterToggle = (type: keyof ProblemFilter, value: string) => {
    const newFilter = { ...activeFilters }
    const currentValues = newFilter[type] as string[] || []
    
    if (currentValues.includes(value)) {
      (newFilter[type] as string[]) = currentValues.filter(v => v !== value)
    } else {
      (newFilter[type] as string[]) = [...currentValues, value]
    }
    
    if (newFilter[type]?.length === 0) {
      delete newFilter[type]
    }
    
    setActiveFilters(newFilter)
    onFilterChange(newFilter)
  }

  const clearAllFilters = () => {
    const emptyFilter = {}
    setActiveFilters(emptyFilter)
    onFilterChange(emptyFilter)
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="flex items-center gap-4">
        {/* 난이도 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">난이도:</span>
          <div className="flex gap-1">
            {Object.entries(difficultyLabels).map(([value, label]) => {
              const isActive = activeFilters.difficulty?.includes(value) || false
              const count = stats?.byDifficulty?.[value] || 0
              
              return (
                <Button
                  key={value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle('difficulty', value)}
                  className="h-8 text-xs"
                  disabled={count === 0}
                >
                  {label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* 유형 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">유형:</span>
          <div className="flex gap-1">
            {Object.entries(ltypeLabels).map(([value, label]) => {
              const isActive = activeFilters.ltype?.includes(value) || false
              const count = stats?.byLtype?.[value] || 0
              
              return (
                <Button
                  key={value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle('ltype', value)}
                  className="h-8 text-xs"
                  disabled={count === 0}
                >
                  {label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* 문제 타입 필터 */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">문항:</span>
          <div className="flex gap-1">
            {Object.entries(choiceTypeLabels).map(([value, label]) => {
              const isActive = activeFilters.choiceType?.includes(value) || false
              const count = stats?.byChoiceType?.[value] || 0
              
              return (
                <Button
                  key={value}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterToggle('choiceType', value)}
                  className="h-8 text-xs"
                  disabled={count === 0}
                >
                  {label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </div>

        {/* 전체 해제 버튼 */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 text-xs text-gray-500 hover:text-gray-700"
          >
            전체 해제
          </Button>
        )}
      </div>
    </div>
  )
}