"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, ChevronDown, ChevronRight, Calculator, TrendingUp, Target, Award } from "lucide-react"

export function ProblemSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["algebra"])
  const [selectedProblem, setSelectedProblem] = useState("algebra-001")

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const problemCategories = [
    {
      id: "algebra",
      name: "대수학",
      icon: Calculator,
      count: 156,
      problems: [
        { id: "algebra-001", title: "일차방정식 기초", difficulty: "쉬움", solved: true },
        { id: "algebra-002", title: "연립방정식 응용", difficulty: "보통", solved: false },
        { id: "algebra-003", title: "이차방정식의 해", difficulty: "어려움", solved: false },
        { id: "algebra-004", title: "부등식 문제", difficulty: "보통", solved: true },
      ],
    },
    {
      id: "geometry",
      name: "기하학",
      icon: Target,
      count: 89,
      problems: [
        { id: "geo-001", title: "삼각형의 성질", difficulty: "쉬움", solved: true },
        { id: "geo-002", title: "원의 방정식", difficulty: "어려움", solved: false },
        { id: "geo-003", title: "평면도형의 넓이", difficulty: "보통", solved: false },
      ],
    },
    {
      id: "calculus",
      name: "미적분",
      icon: TrendingUp,
      count: 124,
      problems: [
        { id: "calc-001", title: "극한의 개념", difficulty: "보통", solved: false },
        { id: "calc-002", title: "도함수 구하기", difficulty: "어려움", solved: false },
        { id: "calc-003", title: "적분의 응용", difficulty: "어려움", solved: false },
      ],
    },
    {
      id: "statistics",
      name: "통계학",
      icon: Award,
      count: 67,
      problems: [
        { id: "stat-001", title: "확률의 기초", difficulty: "쉬움", solved: true },
        { id: "stat-002", title: "정규분포", difficulty: "보통", solved: false },
      ],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-100 text-green-800"
      case "보통":
        return "bg-yellow-100 text-yellow-800"
      case "어려움":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">문제저장소</h2>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />새 문제
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="문제 검색..." className="pl-10 pr-4" />
        </div>

        {/* Filter */}
        <Button variant="outline" size="sm" className="w-full bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          필터
        </Button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {problemCategories.map((category) => {
            const IconComponent = category.icon
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <div key={category.id} className="mb-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 text-left h-auto"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </Button>

                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {category.problems.map((problem) => (
                      <Button
                        key={problem.id}
                        variant="ghost"
                        onClick={() => setSelectedProblem(problem.id)}
                        className={`w-full text-left p-2 rounded-md text-sm transition-colors h-auto justify-start ${
                          selectedProblem === problem.id ? "bg-blue-50 border-l-2 border-blue-500" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-medium ${
                              selectedProblem === problem.id ? "text-blue-900" : "text-gray-900"
                            }`}
                          >
                            {problem.title}
                          </span>
                          {problem.solved && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-xs text-gray-500">해결한 문제</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">436</div>
            <div className="text-xs text-gray-500">전체 문제</div>
          </div>
        </div>
      </div>
    </div>
  )
}
