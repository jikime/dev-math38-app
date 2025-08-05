"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  BookOpen,
  Clock,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Share,
  Bookmark,
  ThumbsUp,
  MessageCircle,
} from "lucide-react"

export function ProblemDetail() {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showSolution, setShowSolution] = useState(false)

  const problemData = {
    id: "algebra-001",
    title: "일차방정식 기초 문제",
    category: "대수학",
    difficulty: "쉬움",
    timeLimit: "15분",
    points: 10,
    createdBy: "김수학 선생님",
    createdDate: "2025년 7월 25일",
    updatedDate: "2025년 7월 28일",
    solved: false,
    likes: 24,
    comments: 8,
    bookmarked: false,
    description: "일차방정식의 기본 개념을 이해하고 간단한 문제를 해결할 수 있는지 확인하는 문제입니다.",
    problem: "다음 일차방정식을 풀어보세요.\n\n2x + 5 = 13\n\nx의 값을 구하시오.",
    options: [
      { id: "A", text: "x = 3", correct: false },
      { id: "B", text: "x = 4", correct: true },
      { id: "C", text: "x = 5", correct: false },
      { id: "D", text: "x = 6", correct: false },
    ],
    solution:
      "주어진 방정식: 2x + 5 = 13\n\n1단계: 양변에서 5를 빼기\n2x + 5 - 5 = 13 - 5\n2x = 8\n\n2단계: 양변을 2로 나누기\n2x ÷ 2 = 8 ÷ 2\nx = 4\n\n따라서 정답은 B번 x = 4 입니다.",
    hint: "방정식을 풀 때는 등호의 성질을 이용하여 x를 한쪽으로 이항시키면 됩니다.",
    relatedProblems: [
      { id: "algebra-002", title: "연립방정식 응용", difficulty: "보통" },
      { id: "algebra-004", title: "부등식 문제", difficulty: "보통" },
    ],
  }

  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert("답을 선택해주세요!")
      return
    }
    setShowSolution(true)
  }

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
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">{problemData.title}</h1>
            <Badge className={getDifficultyColor(problemData.difficulty)}>{problemData.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-1" />
              공유
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-1" />
              북마크
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-1" />
              문제 풀기
            </Button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>출제자: {problemData.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>제한시간: {problemData.timeLimit}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>생성일: {problemData.createdDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>업데이트: {problemData.updatedDate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="problem" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="problem">문제</TabsTrigger>
            <TabsTrigger value="solution">해설</TabsTrigger>
            <TabsTrigger value="discussion">토론</TabsTrigger>
            <TabsTrigger value="related">관련 문제</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="space-y-6">
            {/* Problem Description */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">문제 설명</h3>
              </div>
              <div className="px-6">
                <p className="text-gray-700 mb-4">{problemData.description}</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{problemData.problem}</pre>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">답안 선택</h3>
              </div>
              <div className="px-6 space-y-3">
                {problemData.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAnswer === option.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option.id}
                      checked={selectedAnswer === option.id}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium mr-2">{option.id}.</span>
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 px-8"
                disabled={!selectedAnswer}
              >
                답안 제출
              </Button>
            </div>

            {/* Result */}
            {showSolution && (
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-green-200 bg-green-50">
                <div className="px-6 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {problemData.options.find((opt) => opt.id === selectedAnswer)?.correct ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">정답입니다! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">틀렸습니다. 다시 시도해보세요!</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    정답: {problemData.options.find((opt) => opt.correct)?.id}번 -{" "}
                    {problemData.options.find((opt) => opt.correct)?.text}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="solution" className="space-y-6">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">상세 해설</h3>
              </div>
              <div className="px-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">���� 힌트</h4>
                  <p className="text-blue-800">{problemData.hint}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{problemData.solution}</pre>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="space-y-6">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  토론 ({problemData.comments})
                </h3>
              </div>
              <div className="px-6">
                <Textarea placeholder="질문이나 의견을 남겨주세요..." className="mb-3" />
                <Button size="sm">댓글 작성</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">관련 문제</h3>
              </div>
              <div className="px-6 space-y-3">
                {problemData.relatedProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium">{problem.title}</h4>
                      <Badge className={`text-xs ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      풀어보기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Stats */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ThumbsUp className="w-4 h-4" />
              <span>{problemData.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{problemData.comments}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              다시 풀기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
