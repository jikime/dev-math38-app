"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrintSettingsDialog } from "@/components/print-settings-dialog"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Download,
  Save,
  Target,
  BookOpen,
  Edit3,
  Calculator,
  FileText,
  CheckCircle,
  BookOpenCheck,
  BarChart3,
  Printer,
  RotateCcw
} from "lucide-react"

export function ProblemCreator() {
  const [selectedCourse, setSelectedCourse] = useState("교과서 쌍둥이 유사(이정연)")
  const [selectedSubject, setSelectedSubject] = useState("중학교 1학년 수학")
  const [selectedRange, setSelectedRange] = useState("1 유리수와 순환소수 ~ 3.1.3 일차부등식의 활용")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1 자연수의 성질"])
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [activeTab, setActiveTab] = useState("exam")
  const [questionsPerPage, setQuestionsPerPage] = useState(4)
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState(1)
  const [difficultyTab, setDifficultyTab] = useState("simple")
  const [showManualDialog, setShowManualDialog] = useState(false)
  const [selectedManualProblems, setSelectedManualProblems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterCategory, setFilterCategory] = useState("전체 선택")
  const [selectedProblemsPreview, setSelectedProblemsPreview] = useState<Array<{ id: string; title: string }>>([])
  const [showPageMapPreview, setShowPageMapPreview] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)

  // 강좌 데이터
  const courseOptions = ["교과서 쌍둥이 유사(이정연)", "개념원리 RPM 수학", "쎈 수학 시리즈", "일품 수학"]

  // 과목 데이터
  const subjectOptions = ["중학교 1학년 수학", "중학교 2학년 수학", "중학교 3학년 수학", "고등학교 1학년 수학"]

  // 교육과정 데이터 구조
  const curriculumData = {
    "중학교 1학년 수학": {
      "1 자연수의 성질": {
        "1.1 소인수분해": [
          { id: "A01", title: "유한소수, 무한소수 구별하기", selected: 13, total: 73 },
          { id: "A02", title: "순환소수의 표현", selected: 2, total: 143 },
          { id: "A03", title: "순환마디 구하기", selected: 13, total: 83 },
          { id: "A04", title: "순환소수의 표현 - 분수", selected: 10, total: 36 },
          { id: "A05", title: "순환마디 구하기 - 분수", selected: 2, total: 75 },
          { id: "A06", title: "순환소수의 표현 - 대소 관계", selected: 0, total: 39 },
        ],
        "1.2 최대공약수와 최소공배수": [
          { id: "A07", title: "소수점 아래 n번째 자리의 숫자 구하기", selected: 2, total: 67 },
          { id: "A08", title: "소수점 아래 n번째 자리의 숫자 구하기", selected: 5, total: 173 },
        ],
      },
      "2 정수와 유리수": {
        "2.1 정수와 유리수": [
          { id: "B01", title: "정수의 개념", selected: 0, total: 45 },
          { id: "B02", title: "유리수의 개념", selected: 0, total: 32 },
        ],
        "2.2 유리수의 계산": [
          { id: "B03", title: "유리수의 덧셈", selected: 0, total: 28 },
          { id: "B04", title: "유리수의 뺄셈", selected: 0, total: 41 },
        ],
      },
      "3 방정식": {
        "3.1 문자와 식": [
          { id: "C01", title: "문자의 사용", selected: 0, total: 29 },
          { id: "C02", title: "식의 값", selected: 0, total: 35 },
        ],
        "3.2 일차방정식의 풀이": [
          { id: "C03", title: "일차방정식의 해", selected: 0, total: 42 },
          { id: "C04", title: "일차방정식의 풀이", selected: 0, total: 38 },
        ],
      },
    },
    "중학교 2학년 수학": {
      "1 유리수와 실수": {
        "1.1 유리수와 순환소수": [{ id: "D01", title: "유리수와 순환소수", selected: 0, total: 45 }],
      },
    },
  }

  // 난이도별 통계 (상세 버전)
  const [detailedDifficultyStats, setDetailedDifficultyStats] = useState({
    객관식: {
      최상: { selected: 0, total: 0 },
      상: { selected: 0, total: 4 },
      중: { selected: 1, total: 3 },
      하: { selected: 0, total: 17 },
      최하: { selected: 0, total: 7 },
    },
    주관식: {
      최상: { selected: 0, total: 0 },
      상: { selected: 0, total: 0 },
      중: { selected: 0, total: 4 },
      하: { selected: 0, total: 20 },
      최하: { selected: 0, total: 23 },
    },
  })

  // 간단 탭용 데이터
  const simpleTableData = {
    객관식: {
      계산: { 최상: 0, 상: 0, 중: 0, 하: 9, 최하: 0 },
      이해: { 최상: 0, 상: 0, 중: 1, 하: 8, 최하: 7 },
      해결: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
      추론: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
    },
    주관식: {
      계산: { 최상: 0, 상: 0, 중: 0, 하: 13, 최하: 18 },
      이해: { 최상: 0, 상: 0, 중: 4, 하: 7, 최하: 5 },
      해결: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
      추론: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
    },
  }

  // 자세히 탭용 상태 추가 (simpleTableData 아래에)
  const [detailedTableData, setDetailedTableData] = useState({
    객관식: {
      계산: { 최상: 0, 상: 0, 중: 0, 하: 9, 최하: 0 },
      이해: { 최상: 0, 상: 0, 중: 1, 하: 8, 최하: 7 },
      해결: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
      추론: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
    },
    주관식: {
      계산: { 최상: 0, 상: 0, 중: 0, 하: 13, 최하: 18 },
      이해: { 최상: 0, 상: 0, 중: 4, 하: 7, 최하: 5 },
      해결: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
      추론: { 최상: 0, 상: 0, 중: 0, 하: 0, 최하: 0 },
    },
  })

  // 초간단 탭용 상태 추가
  const [simpleDifficultyStats, setSimpleDifficultyStats] = useState({
    최상: { selected: 0, total: 0 },
    상: { selected: 0, total: 4 },
    중: { selected: 0, total: 32 },
    하: { selected: 0, total: 13 },
    최하: { selected: 0, total: 26 },
  })

  const tabs = [
    { id: "exam", label: "시험지", icon: FileText },
    { id: "quick", label: "빠른답안", icon: CheckCircle },
    { id: "detailed", label: "상세 정답지", icon: BookOpenCheck },
    { id: "analysis", label: "문항 분석", icon: BarChart3 },
    { id: "style", label: "스타일 설정", icon: Settings },
  ]

  const headerStyles = [
    { id: 1, name: "스타일 1", color: "bg-gray-100", description: "기본 스타일" },
    { id: 2, name: "스타일 2", color: "bg-gradient-to-br from-blue-400 to-blue-600", description: "파란색 그라데이션" },
    { id: 3, name: "스타일 3", color: "bg-gradient-to-br from-teal-400 to-cyan-500", description: "청록색 그라데이션" },
    { id: 4, name: "스타일 4", color: "bg-gradient-to-br from-green-400 to-blue-500", description: "기하학적 패턴" },
    { id: 5, name: "스타일 5", color: "bg-gradient-to-br from-purple-400 to-blue-500", description: "모자이크 패턴" },
    {
      id: 6,
      name: "스타일 6",
      color: "bg-gradient-to-r from-pink-300 via-yellow-300 to-green-300",
      description: "무지개 그라데이션",
    },
  ]

  // 과목 변경 시 교육과정 데이터 초기화
  useEffect(() => {
    setExpandedCategories([])
    setSelectedProblems([])
    setTotalProblems(0)
  }, [selectedSubject])

  // 선택된 문제 수 계산
  useEffect(() => {
    const currentData = curriculumData[selectedSubject as keyof typeof curriculumData]
    if (!currentData) return

    let total = 0
    Object.values(currentData).forEach((category) => {
      Object.values(category).forEach((problems) => {
        problems.forEach((problem) => {
          if (selectedProblems.includes(problem.id)) {
            total += problem.selected
          }
        })
      })
    })
    setTotalProblems(total)
  }, [selectedProblems, selectedSubject])

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleProblem = (problemId: string) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId) ? prev.filter((id) => id !== problemId) : [...prev, problemId],
    )
  }

  const getCurrentCurriculumData = () => {
    return curriculumData[selectedSubject as keyof typeof curriculumData] || {}
  }

  // 초간단 탭 렌더링 함수를 다음과 같이 변경 (더 넓은 입력 필드):
  const renderSimpleTab = () => {
    return (
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(simpleDifficultyStats).map(([level, stats]) => (
          <div key={level} className="text-center">
            <div
              className={`p-2 rounded-lg mb-1 ${
                level === "최상"
                  ? "bg-red-100"
                  : level === "상"
                    ? "bg-orange-100"
                    : level === "중"
                      ? "bg-blue-100"
                      : level === "하"
                        ? "bg-green-100"
                        : "bg-teal-100"
              }`}
            >
              <Input
                type="number"
                value={stats.selected}
                onChange={(e) => {
                  const newValue = Math.max(0, Math.min(stats.total, Number.parseInt(e.target.value) || 0))
                  setSimpleDifficultyStats((prev) => ({
                    ...prev,
                    [level]: { ...prev[level as keyof typeof prev], selected: newValue },
                  }))
                }}
                className="h-10 w-16 text-center font-bold text-lg border-0 bg-transparent px-2 focus-visible:ring-0"
                min="0"
                max={stats.total}
              />
            </div>
            <div className="text-xs text-gray-500 mb-1">{stats.total}</div>
            <div className="text-xs font-medium">{level}</div>
          </div>
        ))}
      </div>
    )
  }

  // 간단 탭 렌더링 함수를 다음과 같이 변경 (박스에 맞는 크기로 조정):
  const renderIntermediateTab = () => {
    return (
      <div className="space-y-6">
        {/* 객관식 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">객관식 : 1</h4>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(detailedDifficultyStats.객관식).map(([difficulty, stats]) => (
              <div
                key={difficulty}
                className={`p-3 rounded-lg border-2 ${
                  difficulty === "최상"
                    ? "bg-red-50 border-red-200"
                    : difficulty === "상"
                      ? "bg-orange-50 border-orange-200"
                      : difficulty === "중"
                        ? "bg-blue-50 border-blue-200"
                        : difficulty === "하"
                          ? "bg-green-50 border-green-200"
                          : "bg-teal-50 border-teal-200"
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium mb-2">{difficulty}</div>
                  <Input
                    type="number"
                    value={stats.selected}
                    onChange={(e) => {
                      const newValue = Math.max(0, Math.min(stats.total, Number.parseInt(e.target.value) || 0))
                      setDetailedDifficultyStats((prev) => ({
                        ...prev,
                        객관식: {
                          ...prev.객관식,
                          [difficulty]: { ...prev.객관식[difficulty as keyof typeof prev.객관식], selected: newValue },
                        },
                      }))
                    }}
                    className="h-12 w-full text-center font-bold text-xl border-0 bg-transparent px-1 focus-visible:ring-0 mb-2"
                    min="0"
                    max={stats.total}
                  />
                  <div className="text-xs text-gray-500">{stats.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주관식 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">주관식 : 0</h4>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(detailedDifficultyStats.주관식).map(([difficulty, stats]) => (
              <div
                key={difficulty}
                className={`p-3 rounded-lg border-2 ${
                  difficulty === "최상"
                    ? "bg-red-50 border-red-200"
                    : difficulty === "상"
                      ? "bg-orange-50 border-orange-200"
                      : difficulty === "중"
                        ? "bg-blue-50 border-blue-200"
                        : difficulty === "하"
                          ? "bg-green-50 border-green-200"
                          : "bg-teal-50 border-teal-200"
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium mb-2">{difficulty}</div>
                  <Input
                    type="number"
                    value={stats.selected}
                    onChange={(e) => {
                      const newValue = Math.max(0, Math.min(stats.total, Number.parseInt(e.target.value) || 0))
                      setDetailedDifficultyStats((prev) => ({
                        ...prev,
                        주관식: {
                          ...prev.주관식,
                          [difficulty]: { ...prev.주관식[difficulty as keyof typeof prev.주관식], selected: newValue },
                        },
                      }))
                    }}
                    className="h-12 w-full text-center font-bold text-xl border-0 bg-transparent px-1 focus-visible:ring-0 mb-2"
                    min="0"
                    max={stats.total}
                  />
                  <div className="text-xs text-gray-500">{stats.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 자세히 탭 렌더링 함수를 다음과 같이 변경 (더 넓은 입력 필드):
  const renderDetailedTab = () => {
    return (
      <div className="space-y-4">
        {/* 객관식 테이블 */}
        <div>
          <h4 className="font-medium mb-2">객관식</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left border-r">구분</th>
                  <th className="px-3 py-2 text-center border-r bg-red-50">최상</th>
                  <th className="px-3 py-2 text-center border-r bg-orange-50">상</th>
                  <th className="px-3 py-2 text-center border-r bg-blue-50">중</th>
                  <th className="px-3 py-2 text-center border-r bg-green-50">하</th>
                  <th className="px-3 py-2 text-center bg-teal-50">최하</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(detailedTableData.객관식).map(([type, difficulties]) => (
                  <tr key={type} className="border-t">
                    <td className="px-3 py-2 font-medium border-r">{type}</td>
                    {Object.entries(difficulties).map(([difficulty, count]) => (
                      <td key={difficulty} className="px-3 py-2 text-center border-r">
                        <Input
                          type="number"
                          value={count}
                          onChange={(e) => {
                            const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                            setDetailedTableData((prev) => ({
                              ...prev,
                              객관식: {
                                ...prev.객관식,
                                [type]: {
                                  ...prev.객관식[type as keyof typeof prev.객관식],
                                  [difficulty]: newValue,
                                },
                              },
                            }))
                          }}
                          className={`h-8 w-16 text-center border-0 bg-transparent px-1 focus-visible:ring-0 ${count > 0 ? "text-blue-600 font-medium" : "text-gray-400"}`}
                          min="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 주관식 테이블 */}
        <div>
          <h4 className="font-medium mb-2">주관식</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left border-r">구분</th>
                  <th className="px-3 py-2 text-center border-r bg-red-50">최상</th>
                  <th className="px-3 py-2 text-center border-r bg-orange-50">상</th>
                  <th className="px-3 py-2 text-center border-r bg-blue-50">중</th>
                  <th className="px-3 py-2 text-center border-r bg-green-50">하</th>
                  <th className="px-3 py-2 text-center bg-teal-50">최하</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(detailedTableData.주관식).map(([type, difficulties]) => (
                  <tr key={type} className="border-t">
                    <td className="px-3 py-2 font-medium border-r">{type}</td>
                    {Object.entries(difficulties).map(([difficulty, count]) => (
                      <td key={difficulty} className="px-3 py-2 text-center border-r">
                        <Input
                          type="number"
                          value={count}
                          onChange={(e) => {
                            const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                            setDetailedTableData((prev) => ({
                              ...prev,
                              주관식: {
                                ...prev.주관식,
                                [type]: {
                                  ...prev.주관식[type as keyof typeof prev.주관식],
                                  [difficulty]: newValue,
                                },
                              },
                            }))
                          }}
                          className={`h-8 w-16 text-center border-0 bg-transparent px-1 focus-visible:ring-0 ${count > 0 ? "text-blue-600 font-medium" : "text-gray-400"}`}
                          min="0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const getSelectedProblemsData = () => {
    const currentData = getCurrentCurriculumData()
    const selectedData: any[] = []

    Object.values(currentData).forEach((category) => {
      Object.values(category).forEach((problems) => {
        problems.forEach((problem) => {
          if (selectedProblems.includes(problem.id)) {
            selectedData.push({
              id: problem.id.slice(1), // A01 -> 01
              title: problem.title,
              content: `다음 문제를 해결하세요.`,
              equation: `${problem.title} 관련 문제`,
              difficulty: "쉬움",
              type: "객관식",
              quickAnswer: "정답",
              detailedSolution: `${problem.title}에 대한 상세한 해설입니다.`,
              explanation: `${problem.title}의 핵심 개념을 이해하는 문제입니다.`,
            })
          }
        })
      })
    })

    return selectedData
  }

  const renderAnalysisTab = () => {
    const problemsData = getSelectedProblemsData()

    if (problemsData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>왼쪽에서 문제를 선택해주세요</p>
          </div>
        </div>
      )
    }

    // 난이도별 분포 데이터
    const difficultyData = [
      { level: "최하", count: 3, color: "bg-purple-300" },
      { level: "하", count: 6, color: "bg-purple-400" },
      { level: "중", count: 8, color: "bg-purple-500" },
      { level: "상", count: 1, color: "bg-purple-600" },
      { level: "최상", count: 0, color: "bg-purple-700" },
    ]

    // 영역별 분포 데이터
    const domainData = [
      { domain: "계산", count: 8, color: "bg-blue-500", percentage: 44.4 },
      { domain: "이해", count: 7, color: "bg-green-500", percentage: 38.9 },
      { domain: "해결", count: 2, color: "bg-orange-500", percentage: 11.1 },
      { domain: "추론", count: 1, color: "bg-red-500", percentage: 5.6 },
      { domain: "기타", count: 0, color: "bg-gray-400", percentage: 0 },
    ]

    // 문항 목록 데이터
    const itemList = [
      { number: 1, type: "A001. 다항식의 덧셈과 뺄셈", difficulty: "중", domain: "이해" },
      { number: 2, type: "A002. 단항식의 곱셈", difficulty: "상", domain: "해결" },
      { number: 3, type: "A003. 다항식의 곱셈", difficulty: "하", domain: "계산" },
      { number: 4, type: "A004. 인수분해", difficulty: "중", domain: "이해" },
      { number: 5, type: "A005. 완전제곱식", difficulty: "하", domain: "계산" },
      { number: 6, type: "A006. 인수분해 공식", difficulty: "상", domain: "해결" },
    ]

    const maxCount = Math.max(...difficultyData.map((d) => d.count))

    return (
      <div className="space-y-6">
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <h3 className="font-semibold text-indigo-800 mb-2">문항 분석</h3>
          <p className="text-sm text-indigo-700">선택된 문항들의 난이도별 분포와 영역별 분포를 확인할 수 있습니다.</p>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-2 gap-8">
          {/* 난이도별 분포 - Bar Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="text-lg font-semibold mb-4 text-center">난이도별 분포</h4>
            <div className="space-y-3">
              {difficultyData.map((item) => (
                <div key={item.level} className="flex items-center gap-3">
                  <div className="w-12 text-sm font-medium text-right">{item.level}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                    <div
                      className={`${item.color} h-8 rounded-full flex items-center justify-end pr-2 transition-all duration-500`}
                      style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
                    >
                      {item.count > 0 && <span className="text-white text-sm font-medium">{item.count}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>문항 수</span>
              </div>
            </div>
          </div>

          {/* 영역별 분포 - Pie Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="text-lg font-semibold mb-4 text-center">영역별 분포</h4>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {(() => {
                    let cumulativePercentage = 0
                    return domainData
                      .filter((item) => item.count > 0)
                      .map((item, index) => {
                        const startAngle = (cumulativePercentage / 100) * 360
                        const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360
                        cumulativePercentage += item.percentage

                        const startAngleRad = (startAngle * Math.PI) / 180
                        const endAngleRad = (endAngle * Math.PI) / 180

                        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

                        const x1 = 50 + 40 * Math.cos(startAngleRad)
                        const y1 = 50 + 40 * Math.sin(startAngleRad)
                        const x2 = 50 + 40 * Math.cos(endAngleRad)
                        const y2 = 50 + 40 * Math.sin(endAngleRad)

                        const pathData = [
                          `M 50 50`,
                          `L ${x1} ${y1}`,
                          `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          `Z`,
                        ].join(" ")

                        const colors = {
                          "bg-blue-500": "#3b82f6",
                          "bg-green-500": "#10b981",
                          "bg-orange-500": "#f97316",
                          "bg-red-500": "#ef4444",
                          "bg-gray-400": "#9ca3af",
                        }

                        return (
                          <path
                            key={item.domain}
                            d={pathData}
                            fill={colors[item.color as keyof typeof colors]}
                            stroke="white"
                            strokeWidth="1"
                          />
                        )
                      })
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">18</div>
                    <div className="text-sm text-gray-600">총 문항</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {domainData
                .filter((item) => item.count > 0)
                .map((item) => (
                  <div key={item.domain} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 ${item.color} rounded`}></div>
                      <span className="text-sm font-medium">{item.domain}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.count}개 ({item.percentage.toFixed(1)}%)
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 문항 목록 테이블 */}
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold">문항 목록</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">번호</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">유형명</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r">난이도</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">인지영역</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itemList.map((item) => (
                  <tr key={item.number} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">{item.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r">{item.type}</td>
                    <td className="px-4 py-3 text-center border-r">
                      <Badge
                        className={`text-xs ${
                          item.difficulty === "최상"
                            ? "bg-red-100 text-red-800"
                            : item.difficulty === "상"
                              ? "bg-orange-100 text-orange-800"
                              : item.difficulty === "중"
                                ? "bg-blue-100 text-blue-800"
                                : item.difficulty === "하"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {item.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        className={`text-xs ${
                          item.domain === "계산"
                            ? "bg-blue-100 text-blue-800"
                            : item.domain === "이해"
                              ? "bg-green-100 text-green-800"
                              : item.domain === "해결"
                                ? "bg-orange-100 text-orange-800"
                                : item.domain === "추론"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.domain}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderStyleTab = () => (
    <div className="space-y-6">
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-2">스타일 설정</h3>
        <p className="text-sm text-purple-700">시험지의 페이지 레이아웃과 헤더 스타일을 설정할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* 페이지당 문제 설정 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">페이지당 문제</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">문제 수:</label>
              <Select
                value={questionsPerPage.toString()}
                onValueChange={(value) => setQuestionsPerPage(Number.parseInt(value))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 페이지 미리보기 */}
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white" style={{ aspectRatio: "210/297" }}>
              <div className="h-full flex flex-col">
                <div
                  className={`h-16 rounded-t-lg mb-4 flex items-center justify-center text-white font-bold ${headerStyles.find((s) => s.id === selectedHeaderStyle)?.color}`}
                >
                  시험지 헤더
                </div>
                <div className="text-center mb-3">
                  <span className="text-lg font-bold text-gray-700">{questionsPerPage} 문항</span>
                </div>
                <div className="flex-1 border-2 border-gray-400 rounded relative">
                  {/* 문제 배치 미리보기 로직 */}
                  {questionsPerPage === 2 && (
                    <div className="h-full grid grid-cols-2 gap-2 p-2">
                      <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                        1
                      </div>
                      <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                        2
                      </div>
                    </div>
                  )}
                  {questionsPerPage === 4 && (
                    <div className="h-full grid grid-cols-2 gap-2 p-2">
                      <div className="grid grid-rows-2 gap-2">
                        <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                          1
                        </div>
                        <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                          2
                        </div>
                      </div>
                      <div className="grid grid-rows-2 gap-2">
                        <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                          3
                        </div>
                        <div className="border border-gray-300 rounded flex items-center justify-center text-lg font-bold text-gray-600">
                          4
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-200 opacity-50"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-purple-200 opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 헤더 스타일 선택 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">헤더 스타일 선택</h3>
          <div className="grid grid-cols-1 gap-3">
            {headerStyles.map((style) => (
              <div
                key={style.id}
                className={`cursor-pointer rounded-lg border-2 transition-all ${
                  selectedHeaderStyle === style.id
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedHeaderStyle(style.id)}
              >
                <div className="p-3">
                  <div
                    className={`h-16 rounded-lg ${style.color} flex items-center justify-center text-white font-bold mb-2`}
                  >
                    {style.name}
                  </div>
                  <div className="text-sm text-gray-600">{style.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const addProblemToPreview = (problem: any) => {
    setSelectedProblemsPreview((prev) => {
      // 이미 추가된 문제인지 확인
      const isAlreadyAdded = prev.some((p) => p.id === problem.id)
      if (isAlreadyAdded) {
        return prev
      }

      return [
        ...prev,
        {
          id: problem.id,
          title: problem.title,
        },
      ]
    })
    setShowPageMapPreview(true)
  }

  const handleManualSubmit = () => {
    // selectedProblemsPreview의 문제들을 selectedProblems에 추가
    const newProblemIds = selectedProblemsPreview.map((problem) => problem.id)

    // 중복 제거하면서 기존 선택된 문제들과 합치기
    setSelectedProblems((prev) => {
      const combined = [...prev, ...newProblemIds]
      return [...new Set(combined)] // 중복 제거
    })

    // 모달 닫기 및 미리보기 초기화
    setShowManualDialog(false)
    setSelectedProblemsPreview([])
    setShowPageMapPreview(false)
  }

  const renderExamTab = () => {
    const problemsData = getSelectedProblemsData()

    if (problemsData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>왼쪽에서 문제를 선택해주세요</p>
          </div>
        </div>
      )
    }

    const getProblemsToShow = () => {
      return problemsData.slice(0, questionsPerPage)
    }

    return (
      <div className="space-y-6">
        {/* 헤더 스타일 적용 */}
        <div
          className={`h-16 rounded-lg mb-4 flex items-center justify-center text-white font-bold ${headerStyles.find((s) => s.id === selectedHeaderStyle)?.color}`}
        >
          시험지 헤더 - {headerStyles.find((s) => s.id === selectedHeaderStyle)?.name}
        </div>

        {/* 문제 수 표시 */}
        <div className="text-center mb-4">
          <span className="text-lg font-bold text-gray-700">
            {Math.min(questionsPerPage, problemsData.length)} 문항
          </span>
        </div>

        {/* 문제 배치 - 기존 로직 유지 */}
        {questionsPerPage === 2 && (
          <div className="grid grid-cols-2 gap-4">
            {getProblemsToShow().map((problem) => (
              <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                <div className="px-6 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{problem.id}</span>
                      <Badge variant="outline" className="text-xs">
                        {problem.title}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">쉬움</Badge>
                      <Badge className="bg-gray-100 text-gray-800 text-xs">객관</Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{problem.content}</p>
                  </div>
                  <div className="mb-3">
                    <Input value={problem.equation} className="text-center font-mono text-sm" readOnly />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      Challenge
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      해답지
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4, 6, 8 문항 레이아웃도 동일하게 적용 */}
        {questionsPerPage === 4 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {getProblemsToShow()
                .slice(0, 2)
                .map((problem) => (
                  <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                    <div className="px-6 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{problem.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {problem.title}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">쉬움</Badge>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">객관</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{problem.content}</p>
                      </div>
                      <div className="mb-3">
                        <Input value={problem.equation} className="text-center font-mono text-sm" readOnly />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="space-y-4">
              {getProblemsToShow()
                .slice(2, 4)
                .map((problem) => (
                  <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                    <div className="px-6 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{problem.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {problem.title}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-blue-100 text-blue-800 text-xs">쉬움</Badge>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">객관</Badge>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{problem.content}</p>
                      </div>
                      <div className="mb-3">
                        <Input value={problem.equation} className="text-center font-mono text-sm" readOnly />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderQuickAnswerTab = () => {
    const problemsData = getSelectedProblemsData()

    if (problemsData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>왼쪽에서 문제를 선택해주세요</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">빠른 답안 확인</h3>
          <p className="text-sm text-green-700">각 문제의 정답을 한눈에 확인할 수 있습니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {problemsData.map((problem) => (
            <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
              <div className="px-6 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{problem.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {problem.title}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">쉬움</Badge>
                    <Badge className="bg-gray-100 text-gray-800 text-xs">객관</Badge>
                  </div>
                </div>
                <div className="mb-3 relative">
                  <Input value={problem.equation} className="text-center font-mono text-sm pr-16" readOnly />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Badge className="bg-green-100 text-green-800 font-bold text-lg px-3 py-1">
                      {problem.quickAnswer}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderDetailedSolutionTab = () => {
    const problemsData = getSelectedProblemsData()

    if (problemsData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>왼쪽에서 문제를 선택해주세요</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">상세 정답지</h3>
          <p className="text-sm text-blue-700">각 문제의 정답, 해설, 학습 포인트를 상세히 확인할 수 있습니다.</p>
        </div>

        {problemsData.map((problem) => (
          <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
            <div className="px-6 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">{problem.id}</span>
                  <Badge variant="outline" className="text-sm">
                    {problem.title}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">쉬움</Badge>
                  <Badge className="bg-gray-100 text-gray-800 text-xs">객관</Badge>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  문제
                </h4>
                <p className="text-gray-700 leading-relaxed mb-3">{problem.content}</p>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <div className="text-center font-mono text-lg">{problem.equation}</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  정답
                </h4>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <span className="text-green-800 font-bold text-2xl">{problem.quickAnswer}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  상세 해설
                </h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 leading-relaxed">{problem.detailedSolution}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  학습 포인트
                </h4>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-purple-800 text-sm leading-relaxed">{problem.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">문제출제</h1>
            <p className="text-gray-600">맞춤형 시험지와 문제집을 쉽게 만들어보세요</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              임시저장
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              시험지 작성
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Settings */}
        <div className="col-span-4">
          <div className="space-y-6">
            {/* 강좌명 선택 */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg">강좌명</h3>
              </div>
              <div className="px-6">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 과목을 선택해 주세요 */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    1
                  </span>
                  과목을 선택해 주세요
                </h3>
              </div>
              <div className="px-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    중학교 1학년 수학
                  </Badge>
                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                    중학교 2학년 수학
                  </Badge>
                </div>

                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {Object.entries(getCurrentCurriculumData()).map(([categoryName, subcategories]) => (
                      <div key={categoryName}>
                        <div className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <Checkbox />
                            <span className="font-medium text-sm">{categoryName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCategory(categoryName)}
                            className="p-1 h-auto"
                          >
                            {expandedCategories.includes(categoryName) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {expandedCategories.includes(categoryName) && (
                          <div className="ml-6 mt-2 space-y-1">
                            {Object.entries(subcategories).map(([subName, problems]) => (
                              <div key={subName}>
                                <div className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                                  <ChevronRight className="w-3 h-3" />
                                  <span className="font-medium">{subName}</span>
                                </div>
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

            {/* 항목을 선택해 주세요 */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
                  항목을 선택해 주세요
                  <span className="text-sm text-gray-500 ml-auto">* 자동출제용</span>
                </h3>
              </div>
              <div className="px-6">
                <div className="mb-4">
                  <div className="font-medium text-sm mb-2">1.1.1 유리수와 순환소수</div>
                  <div className="text-right text-sm text-gray-500 mb-2">전체 선택</div>
                </div>

                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {getCurrentCurriculumData()["1 자연수의 성질"]?.["1.1 소인수분해"]?.map((problem) => {
                      const isAlreadyAdded = selectedProblemsPreview.some((p) => p.id === problem.id)
                      return (
                        <div
                          key={problem.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedProblems.includes(problem.id)
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleProblem(problem.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{problem.id}.</span>
                            <span className="text-sm">{problem.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">{problem.selected}</Badge>
                            <span className="text-xs text-gray-500">{problem.total}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* 문항수를 선택해 주세요 */}
            <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
                <h3 className="leading-none font-semibold text-lg flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    3
                  </span>
                  문항수를 선택해 주세요
                  <span className="text-sm text-gray-500 ml-auto">(최대 200문항)</span>
                </h3>
              </div>
              <div className="px-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold mb-2">전체 문항: {totalProblems}</div>
                </div>

                <Tabs value={difficultyTab} onValueChange={setDifficultyTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="simple">초간단</TabsTrigger>
                    <TabsTrigger value="intermediate">간단</TabsTrigger>
                    <TabsTrigger value="detailed">자세히</TabsTrigger>
                  </TabsList>

                  <TabsContent value="simple" className="mt-4">
                    {renderSimpleTab()}
                  </TabsContent>

                  <TabsContent value="intermediate" className="mt-4">
                    {renderIntermediateTab()}
                  </TabsContent>

                  <TabsContent value="detailed" className="mt-4">
                    {renderDetailedTab()}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-center gap-2 mt-4">
                  <Button size="sm" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    <Edit3 className="w-4 h-4 mr-1" />
                    자동출제
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => setShowManualDialog(true)}
                  >
                    <Calculator className="w-4 h-4 mr-1" />
                    수동출제
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    <Plus className="w-4 h-4 mr-1" />
                    문제추가
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Exam Paper */}
        <div className="col-span-8">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
              {/* Tab Navigation */}
              <div className="relative w-full">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                <div className="flex items-end gap-2 pb-px">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon
                    return (
                      <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg border border-b-0 transition-all duration-200 flex items-center gap-2 relative h-auto ${
                          activeTab === tab.id
                            ? "bg-white text-gray-900 border-gray-200 shadow-sm"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-px bg-white"></div>}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="px-6">
              <ScrollArea className="h-[800px]">
                {activeTab === "exam" && renderExamTab()}
                {activeTab === "quick" && renderQuickAnswerTab()}
                {activeTab === "detailed" && renderDetailedSolutionTab()}
                {activeTab === "analysis" && renderAnalysisTab()}
                {activeTab === "style" && renderStyleTab()}
              </ScrollArea>

              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  총 <span className="font-medium">{selectedProblems.length}</span>개 문제 선택됨
                </div>
                <div className="flex items-center gap-2">
                  {activeTab === "exam" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setShowPrintDialog(true)}>
                        <Printer className="w-4 h-4 mr-1" />
                        프린트
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-1" />
                        시험지 다운로드
                      </Button>
                    </>
                  )}
                  {activeTab === "quick" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-1" />
                      빠른답안 다운로드
                    </Button>
                  )}
                  {activeTab === "detailed" && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Download className="w-4 h-4 mr-1" />
                      정답지 다운로드
                    </Button>
                  )}
                  {activeTab === "analysis" && (
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Download className="w-4 h-4 mr-1" />
                      분석 리포트 다운로드
                    </Button>
                  )}
                  {activeTab === "style" && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      <Download className="w-4 h-4 mr-1" />
                      스타일 다운로드
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Settings Dialog */}
      <PrintSettingsDialog open={showPrintDialog} onOpenChange={setShowPrintDialog} />

      {/* 수동 출제 Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="font-semibold text-lg mb-2">항목을 선택해 주세요</h3>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* 1.1.1 소수와 합성수 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">1.1.1 소수와 합성수</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span className="text-blue-600">A01. 물과 나머지 ✓</span>
                        <span className="text-gray-500">65</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span className="text-blue-600">A02. 소수의 합성수 ✓</span>
                        <span className="text-gray-500">131</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span className="text-blue-600">A03. 소수의 성질 ✓</span>
                        <span className="text-gray-500">105</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A04. 기둥제곱</span>
                        <span className="text-gray-500">175</span>
                      </div>
                    </div>
                  </div>

                  {/* 1.1.2 소인수분해 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">1.1.2 소인수분해</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A05. 소인수분해하기</span>
                        <span className="text-gray-500">140</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A06. 소인수 구하기</span>
                        <span className="text-gray-500">135</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A07. 소인수분해의 결과에서 지수구하기</span>
                        <span className="text-gray-500">63</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A08. 약수 구하기</span>
                        <span className="text-gray-500">138</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A09. 약수의 개수 구하기</span>
                        <span className="text-gray-500">142</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A10. 약수의 개수가 주어질 때 지수 구하기</span>
                        <span className="text-gray-500">42</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A11. 약수의 개수가 주어질 때 미지수 구하기</span>
                        <span className="text-gray-500">41</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A12. 약수의 개수가 가장 작은값 구하기</span>
                        <span className="text-gray-500">48</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A13. 제곱인 수 만들기</span>
                        <span className="text-gray-500">164</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A14. 기둥제곱한 수의 일의 자리 소수</span>
                        <span className="text-gray-500">22</span>
                      </div>
                    </div>
                  </div>

                  {/* 1.1.3 최대공약수와 최소공배수 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">1.1.3 최대공약수와 최소공배수</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A15. 최대공약수 구하기</span>
                        <span className="text-gray-500">120</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A16. 최소공배수 구하기</span>
                        <span className="text-gray-500">115</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A17. 최대공약수와 최소공배수의 관계</span>
                        <span className="text-gray-500">89</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>A18. 서로소인 수 찾기</span>
                        <span className="text-gray-500">76</span>
                      </div>
                    </div>
                  </div>

                  {/* 3.1.1 문자를 사용한 식 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">3.1.1 문자를 사용한 식</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C01. 곱셈의 나눗셈 기호의 생략</span>
                        <span className="text-gray-500">271</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C02. 곱셈의 나눗셈 기호를 사용하여 나타내기</span>
                        <span className="text-gray-500">42</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C03. 문자를 사용한 식: 가격, 할인</span>
                        <span className="text-gray-500">109</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C04. 문자를 사용한 식: 속력</span>
                        <span className="text-gray-500">50</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C05. 문자를 사용한 식: 농도</span>
                        <span className="text-gray-500">35</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C06. 문자를 사용한 식: 지연수, 단위, 평균</span>
                        <span className="text-gray-500">69</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C07. 문자를 사용한 식: 도형</span>
                        <span className="text-gray-500">108</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C08. 문자를 사용한 식: 종합</span>
                        <span className="text-gray-500">110</span>
                      </div>
                    </div>
                  </div>

                  {/* 3.1.2 식의 값 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">3.1.2 식의 값</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C09. 식의 값 구하기</span>
                        <span className="text-gray-500">95</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C10. 문자의 값이 주어질 때 식의 값</span>
                        <span className="text-gray-500">87</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C11. 식의 값이 주어질 때 문자의 값</span>
                        <span className="text-gray-500">73</span>
                      </div>
                    </div>
                  </div>

                  {/* 3.2.1 일차방정식의 풀이 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">3.2.1 일차방정식의 풀이</h4>
                      <span className="text-xs text-gray-500">전체 선택</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C12. 일차방정식의 해</span>
                        <span className="text-gray-500">156</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C13. 일차방정식 풀이</span>
                        <span className="text-gray-500">142</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C14. 계수가 분수인 일차방정식</span>
                        <span className="text-gray-500">98</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm">
                        <span>C15. 계수가 소수인 일차방정식</span>
                        <span className="text-gray-500">67</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Center Content */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">필터선택</span>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="전체 선택">필터</SelectItem>
                        <SelectItem value="소수와 합성수">소수와 합성수</SelectItem>
                        <SelectItem value="소인수분해">소인수분해</SelectItem>
                        <SelectItem value="문자를 사용한 식">문자를 사용한 식</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-gray-600">(291 / 291)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={showPageMapPreview ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowPageMapPreview(!showPageMapPreview)}
                    >
                      페이지 맵
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleManualSubmit}
                      disabled={selectedProblemsPreview.length === 0}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      수동 출제 ({selectedProblemsPreview.length})
                    </Button>
                  </div>
                </div>
              </div>

              {/* Problem Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      className="w-8 h-8 p-0"
                    >
                      1
                    </Button>
                    <Button
                      variant={currentPage === 2 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(2)}
                      className="w-8 h-8 p-0"
                    >
                      2
                    </Button>
                    <Button
                      variant={currentPage === 3 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(3)}
                      className="w-8 h-8 p-0"
                    >
                      3
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Problem Card 1 */}
                  {(() => {
                    const isAlreadyAdded = selectedProblemsPreview.some((p) => p.id === "A01")
                    return (
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                        <div className="px-6 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">A01. 물과 나머지</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">하</Badge>{" "}
                              <Badge className="bg-blue-100 text-blue-800 text-xs">하</Badge>
                              <Badge className="bg-gray-100 text-gray-800 text-xs">이해</Badge>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              100 이하의 자연수 중 15의 배수는 모두 몇 개인지 구하시오.
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Challenge
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              해답지
                            </Button>
                          </div>
                          <div
                            className={`mt-3 p-2 rounded text-center text-sm cursor-pointer ${
                              isAlreadyAdded
                                ? "bg-green-100 text-green-800 font-medium"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => !isAlreadyAdded && addProblemToPreview({ id: "A01", title: "물과 나머지" })}
                          >
                            {isAlreadyAdded ? "추가됨 ✓" : "문제 추가"}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Problem Card 2 */}
                  {(() => {
                    const isAlreadyAdded = selectedProblemsPreview.some((p) => p.id === "A02")
                    return (
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                        <div className="px-6 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">A02. 소수의 합성수</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-blue-100 text-blue-800 text-xs">하</Badge>
                              <Badge className="bg-gray-100 text-gray-800 text-xs">이해</Badge>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              40 미만의 자연수 중 8의 배수이면서 6의 배수가 아닌 것의 개수를 구하시오.
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Challenge
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              해답지
                            </Button>
                          </div>
                          <div
                            className={`mt-3 p-2 rounded text-center text-sm cursor-pointer ${
                              isAlreadyAdded
                                ? "bg-green-100 text-green-800 font-medium"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() =>
                              !isAlreadyAdded && addProblemToPreview({ id: "A02", title: "소수의 합성수" })
                            }
                          >
                            {isAlreadyAdded ? "추가됨 ✓" : "문제 추가"}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Problem Card 3 */}
                  {(() => {
                    const isAlreadyAdded = selectedProblemsPreview.some((p) => p.id === "A03")
                    return (
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                        <div className="px-6 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">A03. 소수의 성질</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-green-100 text-green-800 text-xs">중</Badge>
                              <Badge className="bg-gray-100 text-gray-800 text-xs">이해</Badge>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              자연수 A를 5로 나누었더니 몫이 8이고, 나머지가 3이었다. A를 7로 나눈 나머지를 구하시오.
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Challenge
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              해답지
                            </Button>
                          </div>
                          <div
                            className={`mt-3 p-2 rounded text-center text-sm cursor-pointer ${
                              isAlreadyAdded
                                ? "bg-green-100 text-green-800 font-medium"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => !isAlreadyAdded && addProblemToPreview({ id: "A03", title: "소수의 성질" })}
                          >
                            {isAlreadyAdded ? "추가됨 ✓" : "문제 추가"}
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Problem Card 4 */}
                  {(() => {
                    const isAlreadyAdded = selectedProblemsPreview.some((p) => p.id === "A04")
                    return (
                      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-gray-200">
                        <div className="px-6 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">A04. 기둥제곱</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="bg-green-100 text-green-800 text-xs">중</Badge>
                              <Badge className="bg-gray-100 text-gray-800 text-xs">이해</Badge>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              56을 어떤 자연수로 나누면 몫이 아이어지면서 6의 배수가 아닌 것의 개수를 구하시오.
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              해답지
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              Challenge
                            </Button>
                          </div>
                          <div
                            className={`mt-3 p-2 rounded text-center text-sm cursor-pointer ${
                              isAlreadyAdded
                                ? "bg-green-100 text-green-800 font-medium"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => !isAlreadyAdded && addProblemToPreview({ id: "A04", title: "기둥제곱" })}
                          >
                            {isAlreadyAdded ? "추가됨 ✓" : "문제 추가"}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Page Map Preview */}
            {showPageMapPreview && (
              <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">페이지 맵</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowPageMapPreview(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <div className="border-2 border-gray-300 rounded-lg p-2 mb-2">
                    <div className="text-sm font-medium mb-2">1</div>
                    <div className="border border-gray-300 rounded-lg p-2 relative">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-2">
                          {selectedProblemsPreview
                            .slice(0, Math.ceil(selectedProblemsPreview.length / 2))
                            .map((problem, index) => (
                              <div key={index} className="text-center text-sm font-medium">
                                {index + 1}
                              </div>
                            ))}
                          {selectedProblemsPreview.length === 0 && (
                            <div className="text-center text-sm font-medium">1</div>
                          )}
                          {selectedProblemsPreview.length === 1 && (
                            <div className="text-center text-sm font-medium">2</div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 border-l border-dashed border-gray-300">
                          {selectedProblemsPreview
                            .slice(Math.ceil(selectedProblemsPreview.length / 2))
                            .map((problem, index) => (
                              <div key={index} className="text-center text-sm font-medium">
                                {Math.ceil(selectedProblemsPreview.length / 2) + index + 1}
                              </div>
                            ))}
                          {selectedProblemsPreview.length <= 2 && (
                            <div className="text-center text-sm font-medium">3</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {selectedProblemsPreview.length > 0
                      ? `${selectedProblemsPreview.length}개 문제 추가됨`
                      : "문제를 추가해주세요"}
                  </div>

                  {/* 추가된 문제 목록 */}
                  {selectedProblemsPreview.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">추가된 문제</h4>
                      <div className="space-y-1">
                        {selectedProblemsPreview.map((problem, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-white rounded border text-xs"
                          >
                            <span>
                              {problem.id}. {problem.title}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                setSelectedProblemsPreview((prev) => prev.filter((_, i) => i !== index))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
