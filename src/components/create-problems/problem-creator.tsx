"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
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
import { FunctionProblemDialog } from "@/components/create-problems/manual-problem-dialog"
import { useMyLectures, useLectureDetail, useLectureLastIndex } from "@/hooks/use-lecture"
import { useSubjects, useSubjectTops } from "@/hooks/use-subjects"
import { useSkillChapters, useSkillCounts } from "@/hooks/use-skills"
import { MultiSelect } from "@/components/ui/multi-select"
import { SubjectTree } from "@/components/ui/subject-tree"
import type { Option } from "@/components/ui/multi-select"
import type { SkillChapter } from "@/types/skill"
import { ProblemDistributionProvider, useProblemDistribution } from "@/contexts/problem-distribution-context"
import { useSimple1Aggregator, useNormal1Aggregator, useDetailedAggregator } from "@/hooks/use-aggregators"
import { useGeneratePaper } from "@/hooks/use-problems"
import { GeneratedPaper } from "@/types/problem"
import { useManualProblemStore } from "@/stores/manual-problem-store"
import PaperPrintView4 from "@/components/math-paper/template/paper-print-view4"
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
import AnswerSummaryPrint from "./answer-summary-print"
import SolutionPagesPrint from "../math-paper/template/solution-pages-print"

function ProblemCreatorContent() {
  // 강좌 관련 상태
  const [selectedLectureId, setSelectedLectureId] = useState<string>("")
  
  // 시험지명 상태
  const [examTitle, setExamTitle] = useState<string>("")
  
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

  // 생성된 시험지 상태
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedPaper | null>(null)
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false)

  // API 훅들
  const { data: lectures, isLoading: lecturesLoading } = useMyLectures()
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()
  const { data: subjectTops, isLoading: subjectTopsLoading } = useSubjectTops(selectedSubjectKeys)
  const skillChaptersMutation = useSkillChapters()
  
  // zustand 스토어
  const { setSkillChapters: setManualSkillChapters, setSelectedSkill: setManualSelectedSkill } = useManualProblemStore()
  
  // 스킬별 문제 개수 조회
  const { data: skillCounts } = useSkillCounts(selectedLectureId)
  
  // 강의 상세정보 조회 (teacher 정보 포함)
  const { data: lectureDetail } = useLectureDetail(selectedLectureId || "")
  
  // 강의 마지막 인덱스 조회 (시험지 회차용)
  const { data: lastIndexData } = useLectureLastIndex(selectedLectureId || "")
  
  // 시험지 생성 API 훅
  const generatePaperMutation = useGeneratePaper()

  // 난이도 레벨 구성 - 메모제이션
  const levelConfig = useMemo(() => [
    { key: 0, label: '최상', color: 'bg-red-100' },
    { key: 1, label: '상', color: 'bg-orange-100' },
    { key: 2, label: '중', color: 'bg-blue-100' },
    { key: 3, label: '하', color: 'bg-green-100' },
    { key: 4, label: '최하', color: 'bg-teal-100' }
  ], [])

  // 문제 유형 라벨 구성 - 메모제이션
  const typeLabels = useMemo(() => ['계산', '이해', '해결', '추론'], [])
  const difficultyLabels = useMemo(() => ['최상', '상', '중', '하', '최하'], [])
  const difficultyColors = useMemo(() => ['bg-red-50', 'bg-orange-50', 'bg-blue-50', 'bg-green-50', 'bg-teal-50'], [])
  
  // 선택된 트리 항목들로부터 범위 텍스트 생성
  const getRangeText = React.useMemo(() => {
    if (selectedTreeItems.length === 0) {
      return "항목을 선택해주세요"
    }
    
    // 모든 선택된 항목들의 title을 찾기
    const findNodeTitles = (nodes: any[], keys: string[]): string[] => {
      const titles: string[] = []
      
      const findInNode = (node: any) => {
        if (keys.includes(node.key.toString())) {
          titles.push(node.title)
        }
        if (node.children) {
          node.children.forEach(findInNode)
        }
      }
      
      nodes.forEach(findInNode)
      return titles
    }
    
    if (subjectTops) {
      const titles = findNodeTitles(subjectTops, selectedTreeItems)
      if (titles.length > 0) {
        // 첫 번째와 마지막 항목으로 범위 표시
        if (titles.length === 1) {
          return titles[0]
        }
        return `${titles[0]} ~ ${titles[titles.length - 1]}`
      }
    }
    
    return "항목을 선택해주세요"
  }, [selectedTreeItems, subjectTops])

  // chapterFrom과 chapterTo를 위한 범위 계산
  const getChapterRange = React.useMemo(() => {
    if (selectedTreeItems.length === 0) {
      return { from: "", to: "" }
    }
    
    // 모든 선택된 항목들의 title을 찾기
    const findNodeTitles = (nodes: any[], keys: string[]): string[] => {
      const titles: string[] = []
      
      const findInNode = (node: any) => {
        if (keys.includes(node.key.toString())) {
          titles.push(node.title)
        }
        if (node.children) {
          node.children.forEach(findInNode)
        }
      }
      
      nodes.forEach(findInNode)
      return titles
    }
    
    if (subjectTops) {
      const titles = findNodeTitles(subjectTops, selectedTreeItems)
      if (titles.length > 0) {
        if (titles.length === 1) {
          return { from: titles[0], to: titles[0] }
        }
        return { from: titles[0], to: titles[titles.length - 1] }
      }
    }
    
    return { from: "", to: "" }
  }, [selectedTreeItems, subjectTops])

  // 첫 번째 강좌를 기본값으로 설정
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedLectureId) {
      setSelectedLectureId(lectures[0].lectureId)
    }
  }, [lectures, selectedLectureId])

  // lastIndex가 변경될 때 시험지명 자동 설정
  useEffect(() => {
    if (lastIndexData && lastIndexData.lastIndex !== undefined) {
      const nextIndex = lastIndexData.lastIndex + 1
      setExamTitle(`${nextIndex} 회차`)
    }
  }, [lastIndexData])

  // 선택된 강의의 subjectId와 일치하는 과목을 자동으로 설정
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


  // 탭 구성 - 메모제이션
  const tabs = useMemo(() => [
    { id: "exam", label: "시험지", icon: FileText },
    { id: "quick", label: "빠른답안", icon: CheckCircle },
    { id: "detailed", label: "상세 정답지", icon: BookOpenCheck },
    { id: "style", label: "스타일 설정", icon: Settings },
  ], [])

  // 헤더 스타일 구성 - 메모제이션
  const headerStyles = useMemo(() => [
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
  ], [])

  // 강좌 변경 시 일부 데이터 초기화 (aggregator 훅 사용 전)
  useEffect(() => {
    // 1. 트리 항목 초기화 (과목은 자동 선택되므로 초기화하지 않음)
    setSelectedTreeItems([])
    
    // 2. 항목(Skill) 관련 초기화
    setSkillChapters([])
    setSelectedSkills([])
    
    // 3. 생성된 시험지 데이터 초기화
    setGeneratedPaper(null)
    
    // 4. 기타 선택 상태 초기화
    setExpandedCategories([])
    setSelectedProblems([])
    setSelectedProblemsPreview([])
    setSelectedFunctionProblems([])
    
    // 문항수 관련 초기화는 aggregator 훅 선언 이후에 처리
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

  // 강좌 변경 시 문항수 관련 초기화 (aggregator 훅 사용)
  useEffect(() => {
    if (selectedLectureId) {
      // 8x5 빈 배열 생성 (초기화용)
      const emptyMaxFeasible = Array(8).fill(null).map(() => Array(5).fill(0))
      
      // 문항수 관련 초기화
      setSimpleValues([0, 0, 0, 0, 0], emptyMaxFeasible)
      setNormal1Values([0, 0, 0, 0, 0], [0, 0, 0, 0, 0], emptyMaxFeasible)
      // currentDistribution은 8x5 배열 초기화
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 5; col++) {
          setDistribution(row, col, 0)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLectureId])

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

  // 자동출제 함수
  const handleAutoGenerate = async () => {
    try {
      setIsGeneratingPaper(true)

      // 선택된 과목 ID 추출
      const selectedSubjectId = selectedSubjectKeys[0] // 현재 단일 선택
      if (!selectedSubjectId) {
        alert('과목을 선택해주세요.')
        return
      }

      // 선택된 chapter ID들 (트리에서 선택된 항목들)
      const chapterIds = selectedTreeItems.map(id => parseInt(id, 10))

      // 선택된 skill ID들
      const skillIds = selectedSkills

      // payload 구성
      const payload = {
        categoriesFilter: [],
        chapterIds: chapterIds,
        fillProblems: true,
        problemTypeCounts: currentDistribution, // 8x5 배열
        skillIds: skillIds,
        subjectId: selectedSubjectId,
        title: examTitle || `${lastIndexData?.lastIndex ? lastIndexData.lastIndex + 1 : 1} 회차`
      }

      console.log('Generating paper with payload:', payload)
      // API 호출
      const result = await generatePaperMutation.mutateAsync({
        ...payload,
        subjectId: parseInt(selectedSubjectId, 10)
      })
      console.log('Generated paper result:', result)

      result.teacherName = lectureDetail?.teacher?.name ?? ""
      result.lectureTitle = lectureDetail?.name ?? ""
      result.chapterFrom = getChapterRange.from ?? ""
      result.chapterTo = getChapterRange.to ?? ""

      // 시험지 데이터 저장
      setGeneratedPaper(result)
      
      // 시험지 탭으로 이동
      setActiveTab("exam")

    } catch (error) {
      console.error('Paper generation failed:', error)
      alert('시험지 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsGeneratingPaper(false)
    }
  }

  // 초간단 탭 렌더링 함수 - aggregator 사용 (메모제이션)
  const renderSimpleTab = useMemo(() => {
    console.log('renderSimpleTab - difficultyStats:', difficultyStats)
    console.log('renderSimpleTab - simpleValues:', simpleValues)

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
  }, [difficultyStats, simpleValues, setSimpleValues, maxFeasible, levelConfig])

  // 간단 탭 렌더링 함수를 다음과 같이 변경 (박스에 맞는 크기로 조정):
  // 간단 탭 렌더링 함수 - aggregator 사용 (메모제이션)
  const renderIntermediateTab = useMemo(() => {
    console.log('renderIntermediateTab - objectiveSums:', objectiveSums)
    console.log('renderIntermediateTab - subjectiveSums:', subjectiveSums)
    console.log('renderIntermediateTab - maxFeasible:', maxFeasible)

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
  }, [objectiveSums, subjectiveSums, maxFeasible, setNormal1Values, levelConfig])

  // 자세히 탭 렌더링 함수 - aggregator 사용 (메모제이션)
  const renderDetailedTab = useMemo(() => {
    console.log('renderDetailedTab - currentDistribution:', currentDistribution)
    console.log('renderDetailedTab - maxFeasible:', maxFeasible)

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
  }, [currentDistribution, maxFeasible, setDistribution, typeLabels, difficultyLabels, difficultyColors])

  // 스타일 탭 렌더링 함수 - 메모제이션
  const renderStyleTab = useMemo(() => (
    <ScrollArea className="h-[calc(100vh-430px)]">
      <div className="space-y-6 p-4">
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
    </ScrollArea>
  ), [questionsPerPage, selectedHeaderStyle, headerStyles])

  const addProblemToPreview = useCallback((problem: any) => {
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
  }, [])

  const handleManualSubmit = useCallback(() => {
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
  }, [selectedProblemsPreview])

  // 시험지 탭 렌더링 함수 - 메모제이션
  const renderExamTab = useMemo(() => {
    if (!generatedPaper) {
      return (
        <ScrollArea className="h-[calc(100vh-430px)]">
          <div className="space-y-2 px-2">
            <div className="flex items-center justify-center h-96 text-gray-500">
              <div className="text-center">
                <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>왼쪽에서 문제를 선택해주세요</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      )
    }

    const totalProblem = generatedPaper.pages?.reduce(
      (acc, page) => acc + (page.leftSet?.length || 0) + (page.rightSet?.length || 0),
      0
    ) ?? 0

    return (
      <ScrollArea className="h-[calc(100vh-430px)]">
        <div className="space-y-2 px-2">
          <PaperPrintView4
            title={generatedPaper.title}
            lectureTitle={generatedPaper.lectureTitle ?? ""}
            chapterFrom={generatedPaper.chapterFrom}
            chapterTo={generatedPaper.chapterTo}
            minMargin={generatedPaper.minMargin ?? 0}
            columns={generatedPaper.columns ?? 2}
            pages={generatedPaper.pages ?? []}
            subjectName={generatedPaper.subjectName ?? ""}
            teacherName={generatedPaper.teacherName ?? ""}
            studentName={generatedPaper.studentName ?? ""}
            academyName={generatedPaper.academyName ?? ""}
            academyLogo={generatedPaper.academyLogo ?? ""}
            edit={false}
            addBlankPage={(generatedPaper.pages?.length ?? 0) % 2 === 1}
            headerStyle={generatedPaper.headerStyle}
            totalProblem={totalProblem}
          />
        </div>
      </ScrollArea>
    )
  }, [generatedPaper])

  // 빠른답안 탭 렌더링 함수 - 메모제이션
  const renderQuickAnswerTab = useMemo(() => {
    return (
      <ScrollArea className="h-[calc(100vh-430px)]">
        <div className="space-y-6 p-4">
          { generatedPaper ? <AnswerSummaryPrint paper={generatedPaper} showBlankPage={true} /> :
          <div className="flex items-center justify-center h-96 text-gray-500">
            <div className="text-center">
              <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>왼쪽에서 문제를 선택해주세요</p>
            </div>
          </div>}
        </div>
      </ScrollArea>
    )
  }, [generatedPaper])

  // 상세 정답지 탭 렌더링 함수 - 메모제이션
  const renderDetailedSolutionTab = useMemo(() => {
    return (
      <ScrollArea className="h-[calc(100vh-430px)]">
        { generatedPaper ? <SolutionPagesPrint paper={generatedPaper} /> : 
        <div className="flex items-center justify-center h-96 text-gray-500">
          <div className="text-center">
            <BookOpenCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>왼쪽에서 문제를 선택해주세요</p>
          </div>
        </div>}
      </ScrollArea>
    )
  }, [generatedPaper])

  return (
    <div className="container mx-auto px-2 py-8">
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
            
            <div className="flex items-center gap-3 ml-8">
              <label className="font-semibold text-lg whitespace-nowrap">시험지</label>
              <Input 
                type="text" 
                placeholder="제목을 입력하세요"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-64 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

      {/* 범위 및 출제유형 */}
      <div className="mb-6">
        <div className="flex">
          <div className="w-[28%] pr-3">
            <div className="bg-white rounded-lg border p-4 h-20 flex flex-col justify-center">
              <h3 className="font-semibold text-sm mb-2">범위</h3>
              <div className="text-sm text-gray-700">
                {getRangeText}
              </div>
            </div>
          </div>
          
          <div className="w-[72%] pl-3">
            <div className="bg-white rounded-lg border p-4 h-20 flex flex-col justify-center">
              <h3 className="font-semibold text-sm mb-2">출제유형</h3>
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
      </div>

      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-[calc(100vh-200px)]"
      >
        {/* Left Sidebar - Settings */}
        <ResizablePanel defaultSize={28} minSize={28} maxSize={60}>
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
                    {/* {selectedSkills.length > 0 && (
                      <span className="bg-purple-100 text-purple-800 rounded-full px-2 py-1 text-xs font-medium">
                        {selectedSkills.length}개 선택됨
                      </span>
                    )} */}
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
                                        onCheckedChange={() => {}}
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
                    {renderSimpleTab}
                  </TabsContent>

                  <TabsContent value="intermediate" className="mt-4">
                    {renderIntermediateTab}
                  </TabsContent>

                  <TabsContent value="detailed" className="mt-4">
                    {renderDetailedTab}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-center gap-2 mt-4">
                  <Button 
                    size="sm" 
                    disabled={totalProblems === 0 || isGeneratingPaper}
                    className={totalProblems === 0 || isGeneratingPaper ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}
                    onClick={handleAutoGenerate}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    {isGeneratingPaper ? "생성 중..." : "자동출제"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={selectedTreeItems.length === 0 || selectedSkills.length > 0}
                    className={(selectedTreeItems.length === 0 || selectedSkills.length > 0) ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-transparent"}
                    onClick={() => {
                      // zustand 스토어에 현재 skillChapters 설정
                      setManualSkillChapters(skillChapters)
                      // 선택된 스킬이 있으면 첫 번째 스킬을 선택
                      if (selectedSkills.length > 0) {
                        setManualSelectedSkill(selectedSkills[0])
                      } else {
                        setManualSelectedSkill(null)
                      }
                      setShowFunctionDialog(true)
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    수동출제
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={true}
                    className="bg-gray-50 text-gray-400 cursor-not-allowed"
                  >
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
        <ResizablePanel defaultSize={72} minSize={40}>
          <div className="h-full pl-3">
            <div className="bg-card text-card-foreground flex flex-col rounded-xl border h-full max-h-full overflow-hidden">
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
            <div className="px-2 flex-1 flex flex-col">
                <div className="space-y-4 pb-6">
                  {activeTab === "exam" && renderExamTab}
                  {activeTab === "quick" && renderQuickAnswerTab}
                  {activeTab === "detailed" && renderDetailedSolutionTab}
                  {activeTab === "style" && renderStyleTab}
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
