"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { PrintSettingsDialog } from "@/components/common/print-settings-dialog"
import { FunctionProblemDialog } from "@/components/create-problems/function-problem-dialog"
import { useMyLectures } from "@/hooks/use-lecture"
import { useSubjects, useSubjectTops } from "@/hooks/use-subjects"
import { useSkillChapters, useSkillCounts } from "@/hooks/use-skills"
import { MultiSelect } from "@/components/ui/multi-select"
import { SubjectTree } from "@/components/ui/subject-tree"
import type { Option } from "@/components/ui/multi-select"
import type { SkillChapter } from "@/types/skill"
import { ProblemDistributionProvider, useProblemDistribution } from "@/contexts/problem-distribution-context"
import { useSimple1Aggregator, useNormal1Aggregator, useDetailedAggregator } from "@/hooks/use-aggregators"
import {
  Plus,
  Settings,
  Download,
  Save,
  Target,
  BookOpen,
  Edit3,
  FileText,
  CheckCircle,
  BookOpenCheck,
  BarChart3,
  Printer
} from "lucide-react"

function ProblemCreatorContent() {
  // 강좌 관련 상태
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  
  // 과목 관련 상태
  const [selectedSubjectKeys, setSelectedSubjectKeys] = useState<string[]>([])
  const [selectedTreeItems, setSelectedTreeItems] = useState<string[]>([])
  
  // Skill 관련 상태
  const [skillChapters, setSkillChapters] = useState<SkillChapter[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  
  const [selectedRange, setSelectedRange] = useState("1 유리수와 순환소수 ~ 3.1.3 일차부등식의 활용")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["1 자연수의 성질"])
  const [selectedProblems, setSelectedProblems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("exam")
  const [questionsPerPage, setQuestionsPerPage] = useState(4)
  const [selectedHeaderStyle, setSelectedHeaderStyle] = useState(1)
  const [difficultyTab, setDifficultyTab] = useState("simple")
  const [showManualDialog, setShowManualDialog] = useState(false)
  const [selectedManualProblems, setSelectedManualProblems] = useState<string[]>([])
  const [selectedProblemsPreview, setSelectedProblemsPreview] = useState<Array<{ id: string; title: string }>>([])
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [showPageMapPreview, setShowPageMapPreview] = useState(false)
  const [showFunctionDialog, setShowFunctionDialog] = useState(false)
  type FunctionDialogProblem = {
    id: string
    title: string
    description: string
    formula: string
    choices: string[]
    difficulty: "쉬움" | "중간" | "어려움"
    type: "객관식" | "주관식"
    category: string
    count: number
    source: "교과서" | "문제집" | "기출" | "모의고사"
    domain: "계산" | "이해" | "추론" | "해결"
  }
  const [selectedFunctionProblems, setSelectedFunctionProblems] = useState<FunctionDialogProblem[]>([])

  // API 훅들
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()
  const { data: subjectTops, isLoading: subjectTopsLoading } = useSubjectTops(selectedSubjectKeys)
  const skillChaptersMutation = useSkillChapters()
  
  // 스킬별 문제 개수 조회
  const { data: skillCounts } = useSkillCounts(selectedLectureId)

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // 첫 번째 강의의 subjectId와 일치하는 과목을 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && subjects && subjects.length > 0 && selectedSubjectKeys.length === 0) {
      const firstLecture = lectures[0]
      const matchingSubject = subjects.find(subject => subject.key === firstLecture.subjectId)
      
      if (matchingSubject) {
        setSelectedSubjectKeys([matchingSubject.key.toString()])
      }
    }
  }, [lectures, subjects, selectedSubjectKeys])


  // 문제 타입 정의
  type Problem = {
    id: string
    title: string
    selected: number
    total: number
  }

  type SubCategory = {
    [key: string]: Problem[]
  }

  type Category = {
    [key: string]: SubCategory
  }

  type CurriculumData = {
    [key: string]: Category
  }

  // 교육과정 데이터 구조
  const curriculumData: CurriculumData = {
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
  const [simpleDifficultyInputs, setSimpleDifficultyInputs] = useState({
    highest: 0,
    high: 0,
    medium: 0,
    low: 0,
    lowest: 0,
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

  // 강좌 변경 시 교육과정 데이터 초기화
  useEffect(() => {
    setExpandedCategories([])
    setSelectedProblems([])
  }, [selectedLectureId])

  // 과목 변경 시 트리 항목 선택 초기화
  useEffect(() => {
    setSelectedTreeItems([])
    setSkillChapters([])
    setSelectedSkills([])
  }, [selectedSubjectKeys])

  // 선택된 트리 항목이 변경될 때 skill API 호출
  useEffect(() => {
    if (selectedTreeItems.length > 0) {
      // string 배열을 number 배열로 변환
      const numericIds = selectedTreeItems.map(id => parseInt(id, 10))
      skillChaptersMutation.mutate(
        numericIds,
        {
          onSuccess: (data) => {
            // skillList가 있는 챕터들만 필터링
            const chaptersWithSkills = data.filter(chapter => chapter.skillList && chapter.skillList.length > 0)
            setSkillChapters(chaptersWithSkills)
            setSelectedSkills([])
          },
          onError: (error) => {
            console.error('Skill chapters fetch failed:', error)
            setSkillChapters([])
          }
        }
      )
    } else {
      setSkillChapters([])
      setSelectedSkills([])
    }
  }, [selectedTreeItems])

  // 선택된 강좌의 과목명 추출
  const selectedSubjectName = selectedLectureId && lectures?.find(l => l.lectureId === selectedLectureId)?.subjectName

  // 선택된 문제 수 계산
  useEffect(() => {
    const currentData = curriculumData[selectedSubjectName as keyof typeof curriculumData]
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
  }, [selectedProblems, selectedSubjectName])

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

  // 과목 데이터를 MultiSelect 옵션으로 변환
  const subjectOptions: Option[] = subjects?.map(subject => ({
    label: subject.title,
    value: subject.key.toString()
  })) || []

  // 스킬 선택 토글 함수
  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    )
  }

  // 챕터별 전체 선택/해제 함수
  const toggleAllSkillsInChapter = (chapter: SkillChapter) => {
    const chapterSkillIds = chapter.skillList.map(skill => skill.skillId)
    const allSelected = chapterSkillIds.every(skillId => selectedSkills.includes(skillId))
    
    setSelectedSkills(prev => {
      if (allSelected) {
        // 모두 선택된 상태라면 해제
        return prev.filter(skillId => !chapterSkillIds.includes(skillId))
      } else {
        // 일부만 선택되었거나 아무것도 선택되지 않았다면 전체 선택
        const newSkills = [...prev]
        chapterSkillIds.forEach(skillId => {
          if (!newSkills.includes(skillId)) {
            newSkills.push(skillId)
          }
        })
        return newSkills
      }
    })
  }

  // 난이도별 총합 계산 (마지막 배열만 사용)
  const difficultyStats = React.useMemo(() => {
    const stats = {
      highest: 0, // index 0 - 최상
      high: 0,    // index 1 - 상
      medium: 0,  // index 2 - 중
      low: 0,     // index 3 - 하
      lowest: 0   // index 4 - 최하
    }

    if (skillChapters.length === 0) return stats

    console.log('Selected skills:', selectedSkills)
    console.log('Skill chapters:', skillChapters)

    // 선택된 스킬들의 typeCounts 마지막 배열(8x5)에서 컬럼별로 합산
    skillChapters.forEach(chapter => {
      chapter.skillList.forEach(skill => {
        if (selectedSkills.includes(skill.skillId) && skill.typeCounts) {
          console.log(`Processing skill ${skill.skillId}:`, skill.typeCounts)
          
          // typeCounts의 마지막 배열을 가져와서 8x5 구조로 처리
          if (Array.isArray(skill.typeCounts) && skill.typeCounts.length > 0) {
            const lastMatrix = skill.typeCounts[skill.typeCounts.length - 1]
            if (Array.isArray(lastMatrix) && lastMatrix.length === 8) {
              // 8개 행의 각 컬럼을 난이도별로 합산
              lastMatrix.forEach(row => {
                if (Array.isArray(row) && row.length >= 5) {
                  stats.highest += row[0] || 0  // 컬럼 0 (최상)
                  stats.high += row[1] || 0     // 컬럼 1 (상)
                  stats.medium += row[2] || 0   // 컬럼 2 (중)
                  stats.low += row[3] || 0      // 컬럼 3 (하)
                  stats.lowest += row[4] || 0   // 컬럼 4 (최하)
                }
              })
            }
          }
        }
      })
    })

    console.log('difficultyStats calculated:', stats)
    return stats
  }, [skillChapters, selectedSkills])

  // Aggregator 훅들
  const { simpleValues, setSimpleValues } = useSimple1Aggregator()
  const { objectiveSums, subjectiveSums, setNormal1Values } = useNormal1Aggregator()
  const { currentDistribution, setDistribution } = useDetailedAggregator()

  // 전체 문항수 계산
  const totalProblems = React.useMemo(() => {
    let total = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 5; col++) {
        total += currentDistribution[row][col] || 0
      }
    }
    return total
  }, [currentDistribution])

  // 실제 typeCounts 구조를 기반으로 8x5 maxFeasible 배열 생성
  const maxFeasible = React.useMemo(() => {
    // 8x5 배열 초기화
    const feasible = Array(8).fill(null).map(() => Array(5).fill(0))

    if (skillChapters.length === 0) return feasible

    // 선택된 스킬들의 typeCounts 마지막 배열(8x5)을 maxFeasible로 사용
    skillChapters.forEach(chapter => {
      chapter.skillList.forEach(skill => {
        if (selectedSkills.includes(skill.skillId) && skill.typeCounts) {
          // typeCounts의 마지막 배열을 가져와서 8x5 구조로 처리
          if (Array.isArray(skill.typeCounts) && skill.typeCounts.length > 0) {
            const lastMatrix = skill.typeCounts[skill.typeCounts.length - 1]
            if (Array.isArray(lastMatrix) && lastMatrix.length === 8) {
              // 8개 행의 각 셀을 maxFeasible에 누적
              lastMatrix.forEach((row, rowIndex) => {
                if (Array.isArray(row) && row.length >= 5) {
                  for (let col = 0; col < 5; col++) {
                    feasible[rowIndex][col] += row[col] || 0
                  }
                }
              })
            }
          }
        }
      })
    })

    return feasible
  }, [skillChapters, selectedSkills])

  const getCurrentCurriculumData = () => {
    return curriculumData[selectedSubjectName as keyof typeof curriculumData] || {}
  }

  // 초간단 탭 렌더링 함수 - aggregator 사용
  const renderSimpleTab = () => {
    console.log('renderSimpleTab - difficultyStats:', difficultyStats)
    console.log('renderSimpleTab - simpleValues:', simpleValues)
    
    const levelConfig = [
      { key: 0, label: '최상', color: 'bg-red-100' },
      { key: 1, label: '상', color: 'bg-orange-100' },
      { key: 2, label: '중', color: 'bg-blue-100' },
      { key: 3, label: '하', color: 'bg-green-100' },
      { key: 4, label: '최하', color: 'bg-teal-100' }
    ]

    return (
      <div className="grid grid-cols-5 gap-1">
        {levelConfig.map(({ key, label, color }) => (
          <div key={key} className="text-center">
            <div className="text-xs font-medium mb-1">{label}</div>
            <div className={`p-0 rounded-lg mb-1 ${color}`}>
              <Input
                type="number"
                value={simpleValues[key]}
                onChange={(e) => {
                  const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                  const newValues = [...simpleValues]
                  newValues[key] = newValue
                  setSimpleValues(newValues, maxFeasible)
                  
                }}
                className="h-10 w-16 text-center font-bold text-base border-0 bg-transparent px-2 focus-visible:ring-0"
                min="0"
              />
            </div>
            <div className="text-xs text-gray-500 mb-1">
              {difficultyStats[['highest', 'high', 'medium', 'low', 'lowest'][key] as keyof typeof difficultyStats]}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 간단 탭 렌더링 함수를 다음과 같이 변경 (박스에 맞는 크기로 조정):
  // 간단 탭 렌더링 함수 - aggregator 사용
  const renderIntermediateTab = () => {
    console.log('renderIntermediateTab - objectiveSums:', objectiveSums)
    console.log('renderIntermediateTab - subjectiveSums:', subjectiveSums)
    console.log('renderIntermediateTab - maxFeasible:', maxFeasible)
    
    const levelConfig = [
      { key: 0, label: '최상', color: 'bg-red-100' },
      { key: 1, label: '상', color: 'bg-orange-100' },
      { key: 2, label: '중', color: 'bg-blue-100' },
      { key: 3, label: '하', color: 'bg-green-100' },
      { key: 4, label: '최하', color: 'bg-teal-100' }
    ]

    return (
      <div className="space-y-6">
        {/* 객관식 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">객관식</h4>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {levelConfig.map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <div className="text-xs font-medium mb-1">{label}</div>
                <div className={`p-0 rounded-lg mb-1 ${color}`}>
                  <Input
                    type="number"
                    value={objectiveSums[key]}
                    onChange={(e) => {
                      const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                      const newObjective = [...objectiveSums]
                      newObjective[key] = newValue
                      setNormal1Values(newObjective, subjectiveSums, maxFeasible)
                    }}
                    className="h-10 w-16 text-center font-bold text-base border-0 bg-transparent px-2 focus-visible:ring-0"
                    min="0"
                  />
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {maxFeasible.slice(0, 4).reduce((sum, row) => sum + row[key], 0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주관식 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">주관식</h4>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {levelConfig.map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <div className="text-xs font-medium mb-1">{label}</div>
                <div className={`p-0 rounded-lg mb-1 ${color}`}>
                  <Input
                    type="number"
                    value={subjectiveSums[key]}
                    onChange={(e) => {
                      const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                      const newSubjective = [...subjectiveSums]
                      newSubjective[key] = newValue
                      setNormal1Values(objectiveSums, newSubjective, maxFeasible)
                    }}
                    className="h-10 w-16 text-center font-bold text-base border-0 bg-transparent px-2 focus-visible:ring-0"
                    min="0"
                  />
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {maxFeasible.slice(4, 8).reduce((sum, row) => sum + row[key], 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 자세히 탭 렌더링 함수 - aggregator 사용
  const renderDetailedTab = () => {
    console.log('renderDetailedTab - currentDistribution:', currentDistribution)
    console.log('renderDetailedTab - maxFeasible:', maxFeasible)
    
    const typeLabels = ['계산', '이해', '해결', '추론']
    const difficultyLabels = ['최상', '상', '중', '하', '최하']
    const difficultyColors = ['bg-red-50', 'bg-orange-50', 'bg-blue-50', 'bg-green-50', 'bg-teal-50']

    return (
      <div className="space-y-4">
        {/* 객관식 테이블 */}
        <div>
          <h4 className="font-medium mb-2">객관식</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 py-1 text-left border-r">구분</th>
                  {difficultyLabels.map((label, index) => (
                    <th key={label} className={`px-1 py-1 text-center border-r ${difficultyColors[index]}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typeLabels.map((type, rowIndex) => (
                  <tr key={type} className="border-t">
                    <td className="px-1 py-1 font-medium border-r">{type}</td>
                    {difficultyLabels.map((difficulty, colIndex) => (
                      <td key={difficulty} className="px-1 py-1 text-center border-r">
                        <div className="flex flex-col items-center">
                          <Input
                            type="number"
                            value={currentDistribution[rowIndex][colIndex]}
                            onChange={(e) => {
                              const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                              setDistribution(rowIndex, colIndex, newValue)
                            }}
                            className={`h-6 w-12 text-center border-0 bg-transparent px-1 focus-visible:ring-0 text-xs ${
                              currentDistribution[rowIndex][colIndex] > 0 ? "text-blue-600 font-medium" : "text-gray-400"
                            }`}
                            min="0"
                            max={maxFeasible[rowIndex][colIndex]}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {maxFeasible[rowIndex][colIndex]}
                          </div>
                        </div>
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
                  <th className="px-1 py-1 text-left border-r">구분</th>
                  {difficultyLabels.map((label, index) => (
                    <th key={label} className={`px-1 py-1 text-center border-r ${difficultyColors[index]}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typeLabels.map((type, rowIndex) => (
                  <tr key={type} className="border-t">
                    <td className="px-1 py-1 font-medium border-r">{type}</td>
                    {difficultyLabels.map((difficulty, colIndex) => (
                      <td key={difficulty} className="px-1 py-1 text-center border-r">
                        <div className="flex flex-col items-center">
                          <Input
                            type="number"
                            value={currentDistribution[rowIndex + 4][colIndex]}
                            onChange={(e) => {
                              const newValue = Math.max(0, Number.parseInt(e.target.value) || 0)
                              setDistribution(rowIndex + 4, colIndex, newValue)
                            }}
                            className={`h-6 w-12 text-center border-0 bg-transparent px-1 focus-visible:ring-0 text-xs ${
                              currentDistribution[rowIndex + 4][colIndex] > 0 ? "text-blue-600 font-medium" : "text-gray-400"
                            }`}
                            min="0"
                            max={maxFeasible[rowIndex + 4][colIndex]}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {maxFeasible[rowIndex + 4][colIndex]}
                          </div>
                        </div>
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
                    ? "border-blue-500 "
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

        {/* 문제 배치 - 가이드 라인 포함 영역 */}
        <div className="relative">
          {/* Vertical guide lines (only within problems area) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-px bg-gray-300/60" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-px bg-gray-300/60" />
          {(questionsPerPage === 2 || questionsPerPage === 4 || questionsPerPage === 6 || questionsPerPage === 8) && (
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-300/70" />
          )}

          {/* 문제 배치 - 기존 로직 유지 */}
          {questionsPerPage === 2 && (
            <div className="grid grid-cols-2 gap-4">
            {getProblemsToShow().map((problem) => (
              <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  border-gray-200">
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
                  <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  border-gray-200">
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
                  <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  border-gray-200">
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
            <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  border-gray-200">
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
          <div key={problem.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6  border-gray-200">
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
      {/* Header - 강좌명 */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-lg">강좌명</h3>
            {lecturesLoading ? (
              <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
            ) : (
              <Select value={selectedLectureId} onValueChange={setSelectedLectureId}>
                <SelectTrigger className="w-64">
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
        
        {/* 범위 및 출제범위 */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-sm mb-2">범위</h3>
            <div className="text-sm text-gray-700">
              1.1 다항식의 연산 ~ 1.1.1 다항식의 연산
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm mb-2">출제범위</h3>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                전체
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                교과서 유형
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                문제집 유형
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                기출 유형
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50">
                모의고사 유형
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResizablePanelGroup 
        direction="horizontal" 
        className="min-h-screen"
      >
        {/* Left Sidebar - Settings */}
        <ResizablePanel defaultSize={30} minSize={30} maxSize={60}>
          <div className="h-full pr-3">
            <div className="space-y-6">
                {/* 과목을 선택해 주세요 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      1
                    </span>
                    과목을 선택해 주세요
                  </h3>

                  {/* 과목 선택 UI */}
                  <MultiSelect
                    options={subjectOptions}
                    selected={selectedSubjectKeys}
                    onChange={setSelectedSubjectKeys}
                    placeholder="과목을 선택하세요"
                    disabled={subjectsLoading}
                    className="w-full"
                  />
                  
                  {subjectsLoading && (
                    <div className="text-sm text-gray-500 mt-2">과목 목록 로딩중...</div>
                  )}
                  
                  {!subjectsLoading && (!subjects || subjects.length === 0) && (
                    <div className="text-sm text-red-500 mt-2">과목 목록을 불러올 수 없습니다</div>
                  )}

                  {/* 선택된 과목의 트리 항목 표시 */}
                  {selectedSubjectKeys.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-sm text-gray-700">상세 항목 선택</h4>
                        {selectedTreeItems.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {selectedTreeItems.length}개 선택됨
                          </span>
                        )}
                      </div>

                      {/* 선택된 트리 항목 Badge 표시 */}
                      {selectedTreeItems.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {selectedTreeItems.slice(0, 3).map((item) => (
                              <Badge key={item} variant="outline" className="bg-green-100 text-green-800 text-xs">
                                {item}
                              </Badge>
                            ))}
                            {selectedTreeItems.length > 3 && (
                              <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                                +{selectedTreeItems.length - 3}개 더
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 트리 구조 표시 */}
                      <div className="border rounded-lg">
                        <ScrollArea className="h-60">
                          {subjectTopsLoading ? (
                            <div className="flex items-center justify-center h-32">
                              <div className="text-sm text-gray-500">항목 로딩중...</div>
                            </div>
                          ) : subjectTops && subjectTops.length > 0 ? (
                            <SubjectTree
                              data={subjectTops}
                              selectedKeys={selectedTreeItems}
                              onSelectionChange={setSelectedTreeItems}
                              className="p-2"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-32 text-gray-500">
                              <div className="text-center">
                                <p className="text-sm">상세 항목이 없습니다</p>
                              </div>
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </div>

                {/* 항목을 선택해 주세요 */}
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      2
                    </span>
                    항목을 선택해 주세요
                    {selectedSkills.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium">
                        {selectedSkills.length}개 선택됨
                      </span>
                    )}
                    <span className="text-sm text-gray-500 ml-auto">* 자동출제용</span>
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

                  <ScrollArea className="h-80">
                    {skillChaptersMutation.isPending ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="text-sm text-gray-500">문항 목록 로딩중...</div>
                      </div>
                    ) : selectedTreeItems.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <div className="text-center">
                          <p>먼저 상세 항목을 선택해주세요</p>
                        </div>
                      </div>
                    ) : skillChapters.length > 0 ? (
                      <div className="space-y-6">
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
                                        readOnly
                                      />
                                      <span className="text-sm font-medium">{skill.skillName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {/* API에서 가져온 문제 개수 */}
                                      <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
                                        문제 {skillCounts?.[skill.skillId]?.length || 0}개
                                      </Badge>
                                      {/* 기존 스킬의 count */}
                                      <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                                        총 {skill.counts}개
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
                          <p>선택된 항목에 대한 문제가 없습니다</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* 문항수를 선택해 주세요 */}
                <div className="bg-white rounded-lg border p-4 flex-1">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      3
                    </span>
                    문항수를 선택해 주세요
                    <span className="text-sm text-gray-500 ml-auto">(최대 200문항)</span>
                  </h3>
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
                    onClick={() => setShowFunctionDialog(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Side - Exam Paper */}
        <ResizablePanel defaultSize={70} minSize={40}>
          <div className="h-full pl-3">
            <div className="bg-card text-card-foreground flex flex-col rounded-xl border h-full">
            <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
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
                            ? "bg-white text-gray-900 border-gray-200 "
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
            <div className="px-6 flex-1 flex flex-col">
              <ScrollArea className="flex-1">
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
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Print Settings Dialog */}
      <PrintSettingsDialog open={showPrintDialog} onOpenChange={setShowPrintDialog} />

      {/* Function Problem Dialog */}
      <FunctionProblemDialog
        open={showFunctionDialog}
        onOpenChange={setShowFunctionDialog}
        selectedProblems={selectedFunctionProblems}
        onProblemsChange={setSelectedFunctionProblems}
      />
    </div>
  )
}

export function ProblemCreator() {
  return (
    <ProblemDistributionProvider>
      <ProblemCreatorContent />
    </ProblemDistributionProvider>
  )
}
