"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, ChevronRight, X, Search, Filter, BookOpen, Target, Award, Brain, Minus, Plus } from "lucide-react"

interface Problem {
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

interface FunctionProblemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProblems: Problem[]
  onProblemsChange: (problems: Problem[]) => void
}

export function FunctionProblemDialog({
  open,
  onOpenChange,
  selectedProblems,
  onProblemsChange,
}: FunctionProblemDialogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("D004")
  const [searchTerm, setSearchTerm] = useState("")
  
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
    columnMap?: Record<string, number>
  }
  const [pages, setPages] = useState<PageLayout[]>([
    { id: 1, columns: 2, problemIds: [], columnMap: {} },
  ])

  // 드래그 인디케이터 상태 (삽입 위치 미리보기)
  const [dragInsert, setDragInsert] = useState<null | { pageIndex: number; index: number; column?: number }>(null)
  // 드래그 소스 상태 (현재 드래그 중인 아이템 메타)
  const [activeDrag, setActiveDrag] = useState<
    null | { source: "pool"; problemId: string } | { source: "page"; pageIndex: number; index: number; problemId: string }
  >(null)

  // A4 그리드 컨테이너 참조 (포인터 위치→컬럼 계산용)
  const gridRef = useRef<HTMLDivElement | null>(null)
  // Masonry 컬럼 보조 정보 저장
  const colInfoRef = useRef<{ lastIndex: number[]; baseIndexToColumn: number[] }>({ lastIndex: [], baseIndexToColumn: [] })

  // DnD 센서
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  // DragOverlay 렌더용
  const renderDragOverlay = () => {
    if (!activeDrag) return null
    const pb = getProblemById(activeDrag.problemId)
    if (!pb) return null
    return (
      <div className="bg-white border rounded-lg p-3 shadow-xl w-56">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">{pb.id}</span>
            <Badge className={getDifficultyColor(pb.difficulty)} variant="outline">
              {pb.difficulty}
            </Badge>
          </div>
        </div>
        <h4 className="font-medium text-sm mb-1 line-clamp-2">{pb.title}</h4>
        <p className="text-[11px] text-gray-600 mb-2 line-clamp-2">{pb.description}</p>
      </div>
    )
  }


  // 문제 데이터 (이미지 기반으로 구성)
  const categories = [
    { id: "D004", title: "그래프에서 좌극한 구하기", count: 347 },
    { id: "D005", title: "함수의 극한의 존재조건", count: 350 },
    { id: "D006", title: "함수의 좌, 우, 양쪽 극한구하기", count: 69 },
    { id: "D007", title: "함수단원의 극한 문제풀이", count: 346 },
    { id: "D008", title: "함수의 극한값", count: 350 },
    { id: "D009", title: "∞/∞ 꼴 극한값 계산", count: 178 },
    { id: "D010", title: "0/0 꼴 극한값 계산", count: 366 },
    { id: "D011", title: "∞ - ∞ 꼴 극한값 계산", count: 137 },
    { id: "D012", title: "함수의 극한과 연속", count: 53 },
    { id: "D013", title: "극한값을 이용한 미지수의 값", count: 617 },
    { id: "D014", title: "∞ × ∞ 꼴 미지수의 값", count: 67 },
    { id: "D015", title: "함수의 극한 대수 공식", count: 613 },
    { id: "D016", title: "함수의 극한 데호", count: 319 },
    { id: "D017", title: "∞/∞ 꼴 함수의 극한 활용", count: 340 },
    { id: "D018", title: "∞² × ∞ 꼴 극한값 활용", count: 38 },
    { id: "D019", title: "0/0 꼴 함수의 활용", count: 280 },
    { id: "D020", title: "함수의 극한값 대입 상한법칙", count: 110 },
  ]

  const problems: Problem[] = [
    {
      id: "D004",
      title: "함수단원의 극한 문제풀이",
      description: "다음 극한값을 구하시오.",
      formula: "lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1) = 2",
      choices: ["① lim(x→1) (x²+1)/(x-1)", "② lim(x→a) x", "③ lim(x→1) (4x²+3)", "④ x→∞"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 346,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-15",
      title: "무한등비수열과 극한",
      description: "수열의 극한을 이용하여 함수 극한을 구하시오.",
      formula: "lim(n→∞) (1 + 1/n)^n = e",
      choices: ["① e", "② 1", "③ 0", "④ 존재하지 않음"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 60,
      source: "모의고사",
      domain: "해결"
    },
    {
      id: "D004-16",
      title: "삼각함수 극한 기본",
      description: "기본 삼각함수 극한 공식을 활용하시오.",
      formula: "lim(x→0) sin x / x = 1",
      choices: ["① 0", "② 1", "③ -1", "④ 존재하지 않음"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 200,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-17",
      title: "삼각함수 극한 응용",
      description: "삼각함수의 합성으로 극한을 구하시오.",
      formula: "lim(x→0) (1-cos x)/x² = 1/2",
      choices: ["① 1/2", "② 1", "③ 0", "④ 2"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 160,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-18",
      title: "지수함수의 극한",
      description: "지수함수의 극한을 계산하시오.",
      formula: "lim(x→∞) (1+2/x)^x = e²",
      choices: ["① e", "② e²", "③ 2e", "④ 1"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 70,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-19",
      title: "로그함수의 극한",
      description: "로그함수의 성질을 이용하여 극한을 구하시오.",
      formula: "lim(x→0) ln(1+x)/x = 1",
      choices: ["① 0", "② 1", "③ -1", "④ 존재하지 않음"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 110,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-20",
      title: "유리식 변형과 극한",
      description: "인수분해 후 극한을 계산하시오.",
      formula: "lim(x→-1) (x²-1)/(x+1) = -2",
      choices: ["① -1", "② -2", "③ 0", "④ 2"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 140,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-21",
      title: "극한과 불연속점",
      description: "점 x=a에서의 불연속 유형을 분류하시오.",
      formula: "점프 불연속/제거가능 불연속/무한대 불연속",
      choices: ["① 제거가능", "② 점프", "③ 무한대", "④ 연속"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 95,
      source: "모의고사",
      domain: "추론"
    },
    {
      id: "D004-22",
      title: "0/0 꼴 유리화 연습",
      description: "유리화를 통해 극한을 구하시오.",
      formula: "lim(x→4) (√x-2)/(x-4)",
      choices: ["① 1/2", "② 1/4", "③ 1/8", "④ 0"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 150,
      source: "문제집",
      domain: "해결"
    },
    {
      id: "D004-23",
      title: "다항식 인수분해와 극한",
      description: "인수분해를 활용하여 극한을 구하시오.",
      formula: "lim(x→2) (x³-8)/(x-2) = 12",
      choices: ["① 8", "② 10", "③ 12", "④ 16"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 155,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-24",
      title: "좌우극한 수치판단",
      description: "좌우극한의 값을 계산하시오.",
      formula: "lim(x→0-) x/|x|, lim(x→0+) x/|x|",
      choices: ["① -1, 1", "② 1, -1", "③ 0, 0", "④ 존재하지 않음"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 90,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-25",
      title: "무리식 곱셈 유리화",
      description: "유리화 공식을 적용하여 극한을 구하시오.",
      formula: "lim(x→0) (√(1+2x)-1)/x = 1",
      choices: ["① 1", "② 2", "③ 1/2", "④ 0"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 190,
      source: "문제집",
      domain: "계산"
    },
    {
      id: "D004-26",
      title: "무한대 차수 비교",
      description: "최고차항 비교로 극한을 구하시오.",
      formula: "lim(x→∞) (7x³+...)/(2x³-...) = 7/2",
      choices: ["① 3/2", "② 7/2", "③ 2/7", "④ 0"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 175,
      source: "모의고사",
      domain: "이해"
    },
    {
      id: "D004-27",
      title: "연속성 판별",
      description: "다음 함수가 x=1에서 연속이 되도록 상수 a를 구하시오.",
      formula: "f(x) = { (x²-1)/(x-1), x≠1; a, x=1 }",
      choices: ["① a=1", "② a=2", "③ a=3", "④ a=4"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 80,
      source: "기출",
      domain: "해결"
    },
    {
      id: "D004-28",
      title: "삼각함수 변형 극한",
      description: "삼각함수 기본 극한을 활용하시오.",
      formula: "lim(x→0) tan x / x = 1",
      choices: ["① 0", "② 1", "③ -1", "④ 존재하지 않음"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 130,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-29",
      title: "지수-로그 혼합 극한",
      description: "지수와 로그의 결합식을 극한으로 평가하시오.",
      formula: "lim(x→0) (e^x-1)/x = 1",
      choices: ["① 0", "② 1", "③ e", "④ 존재하지 않음"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 145,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-30",
      title: "복합 유리화 훈련",
      description: "복수의 근호를 유리화하여 극한을 구하시오.",
      formula: "lim(x→0) (√(x+1)-√(1-x))/x",
      choices: ["① 0", "② 1", "③ 2", "④ 1/2"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 60,
      source: "모의고사",
      domain: "해결"
    },
    {
      id: "D004-31",
      title: "유리식-무리식 혼합",
      description: "인수분해/유리화를 조합하여 극한을 구하시오.",
      formula: "lim(x→1) (√(x+3)-2)/(x-1)",
      choices: ["① 1/2", "② 1/4", "③ 1", "④ 0"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 100,
      source: "문제집",
      domain: "해결"
    },
    {
      id: "D004-32",
      title: "연속 함수의 합성",
      description: "연속함수의 합성에서 극한을 구하시오.",
      formula: "lim(x→a) g(f(x)) = g(lim f(x))",
      choices: ["① 항상 성립", "② 조건부 성립", "③ 성립하지 않음", "④ 모름"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 105,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-33",
      title: "연속 연산 법칙",
      description: "극한의 연산 법칙을 적용하시오.",
      formula: "lim(x→a)(f+g)=lim f + lim g",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 115,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-34",
      title: "극한-상한법칙",
      description: "상한법칙을 이용해 값을 추정하시오.",
      formula: "a≤f(x)≤b ⇒ a≤lim f(x)≤b",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 55,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-35",
      title: "극한 존재 조건",
      description: "좌우극한과 극한의 존재관계를 확인.",
      formula: "lim(x→a-)f=lim(x→a+)f=L ⇒ lim(x→a)f=L",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 190,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-36",
      title: "수열로 본 함수의 극한",
      description: "수열 치환으로 극한을 구하시오.",
      formula: "x_n→a ⇒ f(x_n)→L",
      choices: ["① 항상 참", "② 반례 존재", "③ 불가능", "④ 정보부족"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 65,
      source: "모의고사",
      domain: "추론"
    },
    {
      id: "D004-37",
      title: "무한대로의 비율",
      description: "최고차항 계수의 비로 극한 계산.",
      formula: "lim(x→∞) (ax^n+...)/(bx^n+...) = a/b",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 175,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-38",
      title: "지수-극한 치환",
      description: "표준극한으로 치환 후 계산.",
      formula: "(1+1/n)^n → e",
      choices: ["① e", "② 1", "③ 0", "④ 2"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 125,
      source: "문제집",
      domain: "계산"
    },
    {
      id: "D004-39",
      title: "로그-극한 치환",
      description: "ln(1+x) 표준극한 활용.",
      formula: "ln(1+x) ~ x",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 95,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-40",
      title: "무리식-다항식 혼합",
      description: "적절한 변형으로 극한 계산.",
      formula: "lim(x→0) (√(x+9)-3 - x/6)/x²",
      choices: ["① 0", "② 1/12", "③ 1/18", "④ 존재하지 않음"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 50,
      source: "기출",
      domain: "해결"
    },
    {
      id: "D004-41",
      title: "연속성-함수값 일치",
      description: "연속점에서 함수값과 극한값의 관계.",
      formula: "연속이면 lim f(a)=f(a)",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 140,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-42",
      title: "연속성-합성함수",
      description: "합성함수의 연속성 판정.",
      formula: "f,g 연속 ⇒ g∘f 연속",
      choices: ["① 항상 참", "② 반례 존재", "③ 불가능", "④ 정보부족"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 100,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-43",
      title: "연속성-절댓값",
      description: "절댓값과 연속성 관계.",
      formula: "|f| 연속 ⇐ f 연속",
      choices: ["① 참", "② 거짓", "③ 조건부", "④ 정보부족"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 90,
      source: "모의고사",
      domain: "추론"
    },
    {
      id: "D004-44",
      title: "극한-드릴 종합",
      description: "여러 기법을 종합해 극한을 구하시오.",
      formula: "복합식의 극한 계산",
      choices: ["① 가능", "② 불가능", "③ 조건부", "④ 정보부족"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 40,
      source: "문제집",
      domain: "해결"
    },
    {
      id: "D004-2",
      title: "함수단원의 극한 문제풀이", 
      description: "다음 중 옳은 것은?",
      formula: "lim(x→∞) (3x²-5x+1)/(2x²+x-3) = 3/2",
      choices: ["① 극한값은 존재한다.", "② 극한 □ 같다.", "③ lim(x→1) (4x²+3)", "④ x→∞"],
      difficulty: "중간",
      type: "객관식", 
      category: "함수의 극한",
      count: 346,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-3",
      title: "함수단원의 극한 문제풀이",
      description: "다음 극한값을 구하시오.",
      formula: "lim(x→0) (√(x+1)-1)/x = 1/2",
      choices: ["① 극한값은 존재한다.", "② 극한 □ 같다.", "③ lim(x→1) = ∞", "④ lim(x→1) (x²-1)/(x-1) = ∞"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한", 
      count: 346,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-4",
      title: "함수단원의 극한 문제풀이",
      description: "다음 중 옳은 것을 모두 고르시오.",
      formula: "lim(x→2) (x²-4)/(x-2) = 4",
      choices: ["① 극한값을 옳지않다. □ 극한 없다.", "② 극한값은 존재한다.", "③ lim(x→1) (4x²+3)", "④ ∞로 발산한다."],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 346,
      source: "모의고사",
      domain: "해결"
    },
    {
      id: "D004-5",
      title: "유리함수의 극한",
      description: "다음 극한값을 구하시오.",
      formula: "lim(x→3) (x²-9)/(x-3) = 6",
      choices: ["① 3", "② 6", "③ 9", "④ 존재하지 않음"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 210,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-6",
      title: "무리함수의 극한",
      description: "합성근호를 유리화하여 극한을 구하시오.",
      formula: "lim(x→0) (√(x+4)-2)/x = 1/4",
      choices: ["① 1/2", "② 1/4", "③ 1/8", "④ 0"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 180,
      source: "문제집",
      domain: "이해"
    },
    {
      id: "D004-7",
      title: "절댓값 함수의 극한",
      description: "좌우극한을 비교하여 극한의 존재여부를 판단하시오.",
      formula: "lim(x→0) |x|/x",
      choices: ["① 1", "② -1", "③ 0", "④ 존재하지 않음"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 160,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-8",
      title: "다항식 나눗셈과 극한",
      description: "극한값을 구하시오.",
      formula: "lim(x→1) (x³-1)/(x-1) = 3",
      choices: ["① 1", "② 2", "③ 3", "④ 4"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 145,
      source: "교과서",
      domain: "계산"
    },
    {
      id: "D004-9",
      title: "무한대로의 극한",
      description: "다음 극한값을 구하시오.",
      formula: "lim(x→∞) (5x²+1)/(x²-4) = 5",
      choices: ["① 1", "② 4", "③ 5", "④ 존재하지 않음"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 200,
      source: "모의고사",
      domain: "이해"
    },
    {
      id: "D004-10",
      title: "0/0 꼴 극한의 변형",
      description: "유리화 또는 인수분해를 활용하여 극한을 구하시오.",
      formula: "lim(x→2) (√(x+2)-2)/(x-2)",
      choices: ["① 1/4", "② 1/2", "③ 1", "④ 존재하지 않음"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 210,
      source: "문제집",
      domain: "해결"
    },
    {
      id: "D004-11",
      title: "연속성과 극한",
      description: "연속함수의 극한값을 구하시오.",
      formula: "lim(x→1) (x²+3x+2) = 6",
      choices: ["① 4", "② 5", "③ 6", "④ 7"],
      difficulty: "쉬움",
      type: "객관식",
      category: "함수의 극한",
      count: 120,
      source: "교과서",
      domain: "이해"
    },
    {
      id: "D004-12",
      title: "좌극한과 우극한 비교",
      description: "다음 함수의 x=0에서 극한의 존재 여부를 판단하시오.",
      formula: "f(x) = { x, x≥0; -x, x<0 }",
      choices: ["① 존재한다", "② 존재하지 않는다", "③ 0", "④ 1"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 130,
      source: "기출",
      domain: "추론"
    },
    {
      id: "D004-13",
      title: "무리수 형태의 극한",
      description: "유리화를 통해 극한을 구하시오.",
      formula: "lim(x→0) (√(9+x)-3)/x = 1/6",
      choices: ["① 1/3", "② 1/6", "③ 1/9", "④ 0"],
      difficulty: "중간",
      type: "객관식",
      category: "함수의 극한",
      count: 170,
      source: "문제집",
      domain: "계산"
    },
    {
      id: "D004-14",
      title: "정의역 분할 함수의 극한",
      description: "정의에 의해 극한을 판단하시오.",
      formula: "f(x) = { x², x<1; 2x-1, x≥1 }",
      choices: ["① 연속이다", "② 불연속이다", "③ 극한은 1", "④ 극한은 2"],
      difficulty: "어려움",
      type: "주관식",
      category: "함수의 극한",
      count: 90,
      source: "기출",
      domain: "추론"
    },
  ]

  // 필터링된 문제 목록
  const filteredProblems = problems.filter((problem) => {
    // 문제 출처 필터
    if (sourceFilter !== "전체" && problem.type !== sourceFilter) return false
    
    // 출제방식 필터
    if (methodFilter !== "전체" && problem.source !== methodFilter) return false
    
    // 난이도 필터 (한국어 매핑)
    const difficultyMap: { [key: string]: string } = {
      "최상": "어려움",
      "상": "어려움", 
      "중": "중간",
      "하": "쉬움",
      "최하": "쉬움"
    }
    if (difficultyFilter !== "전체") {
      const mappedDifficulty = difficultyMap[difficultyFilter] || difficultyFilter
      if (problem.difficulty !== mappedDifficulty) return false
    }
    
    // 문제 영역 필터
    if (domainFilter !== "전체" && problem.domain !== domainFilter) return false
    
    // 검색어 필터
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase()
      const inText = `${problem.title} ${problem.description} ${problem.formula}`.toLowerCase()
      if (!inText.includes(q)) return false
    }
    
    return true
  })

  // 카테고리 선택에 따른 문제 풀 정제
  const categoryFilteredPool = useMemo(
    () => filteredProblems.filter((p) => p.id.startsWith(selectedCategory)),
    [filteredProblems, selectedCategory],
  )

  // 페이지 맵 페이지 수
  const totalPages = pages.length

  // 필터 변경 시 페이지를 1로 리셋
  React.useEffect(() => {
    setCurrentPage(1)
  }, [sourceFilter, methodFilter, difficultyFilter, domainFilter])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움": return "bg-blue-100 text-blue-800"
      case "중간": return "bg-green-100 text-green-800" 
      case "어려움": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const selectedPageIndex = Math.max(0, Math.min(currentPage - 1, pages.length - 1))

  const getProblemById = useCallback((id: string) => problems.find((p) => p.id === id), [problems])

  // @dnd-kit 요소들: 드롭/드래그 가능한 래퍼 컴포넌트들
  function DroppablePageArea({ pageIndex, count, children }: { pageIndex: number; count: number; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: `page-container-${pageIndex}`, data: { kind: 'page-container', pageIndex, count } })
    return (
      <div ref={setNodeRef} className={`relative ${isOver ? 'outline outline-2 outline-blue-300/60' : ''}`}>{children}</div>
    )
  }

  function DroppablePageCard({ pageIndex, index, children }: { pageIndex: number; index: number; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: `page-card-${pageIndex}-${index}`, data: { kind: 'page-card', pageIndex, index } })
    return (
      <div ref={setNodeRef} className="relative">
        {dragInsert && dragInsert.pageIndex === pageIndex && dragInsert.index === index && (
          <div className="pointer-events-none absolute inset-0 border-2 border-dashed border-blue-400/80 bg-blue-50/40 rounded-lg" />
        )}
        {children}
      </div>
    )
  }

  function DraggableProblemCard({ pageIndex, index, problemId, hidden }: { pageIndex: number; index: number; problemId: string; hidden?: boolean }) {
    const pb = getProblemById(problemId)
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `page-${pageIndex}-${index}`, data: { source: 'page', pageIndex, index, problemId } })
    if (!pb) return null
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} className={`bg-white border rounded-lg p-4 cursor-move hover:shadow-md w-full ${hidden ? 'opacity-0' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">{pb.id}</span>
            <Badge className={getDifficultyColor(pb.difficulty)} variant="outline">{pb.difficulty}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => removeFromPage(pageIndex, index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{pb.title}</h4>
        <p className="text-xs text-gray-600 mb-3">{pb.description}</p>
        <div className="bg-gray-50 rounded p-2 mb-3">
          <div className="text-xs font-mono text-center">{pb.formula}</div>
        </div>
        <div className="space-y-1 mb-3">
          {pb.choices.slice(0, 2).map((choice, idx) => (
            <div key={idx} className="text-xs text-gray-700 line-clamp-1">{choice}</div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">{pb.type}</Badge>
          <span className="text-xs text-gray-500">배치됨</span>
        </div>
      </div>
    )
  }

  function DraggablePoolCard({ problem }: { problem: Problem }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `pool-${problem.id}`, data: { source: 'pool', problemId: problem.id } })
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} className="bg-white border rounded-lg p-3 cursor-move hover:shadow-md">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">{problem.id}</span>
            <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">{problem.difficulty}</Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => setPages((prev) => {
              const next = prev.map((pg) => ({ ...pg, problemIds: [...pg.problemIds] }))
              const target = next[selectedPageIndex]
              if (!target.problemIds.includes(problem.id)) target.problemIds.push(problem.id)
              return next
            })}
          >
            추가
          </Button>
        </div>
        <h4 className="font-medium text-sm mb-1 line-clamp-2">{problem.title}</h4>
        <p className="text-[11px] text-gray-600 mb-2 line-clamp-2">{problem.description}</p>
        <div className="bg-gray-50 rounded p-2 mb-2">
          <div className="text-[11px] font-mono text-center break-words">{problem.formula}</div>
        </div>
        <div className="space-y-1 mb-2">
          {problem.choices.slice(0, 2).map((choice, index) => (
            <div key={index} className="text-[11px] text-gray-700 line-clamp-1">{choice}</div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px]">{problem.type}</Badge>
          <span className="text-[10px] text-gray-500">A5 미리보기</span>
        </div>
      </div>
    )
  }

  function DroppableColSlot({ pageIndex, column, index, compact }: { pageIndex: number; column: number; index: number; compact?: boolean }) {
    const { setNodeRef, isOver } = useDroppable({ id: `col-slot-${pageIndex}-${column}-${index}`, data: { kind: 'col-slot', pageIndex, column, index } })
    const active = dragInsert && dragInsert.pageIndex === pageIndex && dragInsert.column === column && dragInsert.index === index
    const activeCls = compact ? 'min-h-6' : 'min-h-28'
    return (
      <div ref={setNodeRef} className={`w-full ${active || isOver ? `border-2 border-dashed border-blue-300/70 bg-blue-50/30 rounded-lg ${activeCls}` : (compact ? 'h-1.5' : 'h-2')}`} />
    )
  }

  function DroppableMiniMapContainer({ pageIndex, count, children }: { pageIndex: number; count: number; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: `pagemap-container-${pageIndex}`, data: { kind: 'pagemap-container', pageIndex, count } })
    return (
      <div ref={setNodeRef} className={`relative ${isOver ? 'outline outline-1 outline-blue-300/60' : ''}`}>{children}</div>
    )
  }

  const getEstimatedHeight = (id: string) => {
    const pb = getProblemById(id)
    if (!pb) return 1
    const base = 1
    const desc = Math.ceil((pb.description?.length ?? 0) / 60)
    const form = Math.ceil((pb.formula?.length ?? 0) / 80)
    return base + desc * 0.5 + form * 0.5
  }

  const getColumnEntries = (pageIndex: number, columns: number) => {
    const page = pages[pageIndex]
    const entries = page.problemIds.map((id, baseIndex) => ({ id, baseIndex, column: page.columnMap?.[id] ?? 0 }))
    const result: Array<Array<{ id: string; baseIndex: number }>> = new Array(columns).fill(null).map(() => [])
    for (const e of entries) {
      const col = Math.max(0, Math.min(columns - 1, e.column))
      result[col].push({ id: e.id, baseIndex: e.baseIndex })
    }
    return result
  }

  const chooseTargetColumn = (pageIndex: number, columns: number) => {
    const byCol = getColumnEntries(pageIndex, columns)
    const heights = byCol.map((col) => col.reduce((acc, e) => acc + getEstimatedHeight(e.id), 0))
    let minIdx = 0
    for (let i = 1; i < columns; i += 1) if (heights[i] < heights[minIdx]) minIdx = i
    return minIdx
  }

  const insertAtColumn = (pageIndex: number, column: number, indexInColumn: number, problemId: string) => {
    setPages((prev) => {
      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds], columnMap: { ...(p.columnMap ?? {}) } }))
      const page = next[pageIndex]
      // 이미 존재하면 먼저 제거
      const currentIdx = page.problemIds.indexOf(problemId)
      if (currentIdx >= 0) page.problemIds.splice(currentIdx, 1)
      page.columnMap![problemId] = column
      const byCol = getColumnEntries(pageIndex, page.columns)
      const colList = byCol[column]
      let insertPos = page.problemIds.length
      if (colList.length === 0) {
        insertPos = column === 0 ? 0 : page.problemIds.length
      } else if (indexInColumn < colList.length) {
        // 대상 컬럼의 index 위치 아이템 앞에 삽입
        const beforeId = colList[indexInColumn].id
        insertPos = page.problemIds.indexOf(beforeId)
        if (insertPos < 0) insertPos = page.problemIds.length
    } else {
        // 대상 컬럼의 마지막 아이템 뒤에 삽입
        const lastId = colList[colList.length - 1].id
        const lastPos = page.problemIds.indexOf(lastId)
        insertPos = lastPos >= 0 ? lastPos + 1 : page.problemIds.length
      }
      page.problemIds.splice(insertPos, 0, problemId)
      return next
    })
  }

  function MiniMapDroppableCard({ pageIndex, index, pid, title, column }: { pageIndex: number; index: number; pid: string; title?: string; column?: number }) {
    const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `mini-card-${pageIndex}-${index}`, data: { kind: 'pagemap-card', pageIndex, index } })
    const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id: `mini-drag-${pageIndex}-${index}`, data: { source: 'page', pageIndex, index, problemId: pid } })
    return (
      <div ref={(node) => { setDropRef(node); setDragRef(node as HTMLElement) }} {...attributes} {...listeners}
        className={`h-8 rounded-sm border bg-white text-[10px] text-gray-700 flex items-center justify-center truncate cursor-move ${isOver ? 'ring-2 ring-blue-300/70' : ''}`}
        title={title}
      >
        {pid}
      </div>
    )
  }

  // 초기 로딩 시 부모로부터 받은 선택 문제를 페이지 1에 채워 넣기 (있을 경우, 최초 1회)
  React.useEffect(() => {
    if (selectedProblems.length > 0 && pages.every((p) => p.problemIds.length === 0)) {
      setPages((prev) => {
        const next = [...prev]
        next[0] = { ...next[0], problemIds: selectedProblems.map((p) => p.id) }
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // HTML5 DnD 핸들러 전부 제거 → @dnd-kit 이벤트 기반으로 대체

  const removeFromPage = (pageIndex: number, indexInPage: number) => {
    setPages((prev) => {
      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds] }))
      next[pageIndex].problemIds.splice(indexInPage, 1)
      return next
    })
  }

  const arrangedCount = useMemo(
    () => pages.reduce((acc, p) => acc + p.problemIds.length, 0),
    [pages],
  )

  const handleSubmit = () => {
    const arrangedProblemsFlat: Problem[] = pages
      .flatMap((pg) => pg.problemIds)
      .map((id) => getProblemById(id))
      .filter(Boolean) as Problem[]
    onProblemsChange(arrangedProblemsFlat)
    onOpenChange(false)
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

          {/* 메인 컨텐츠 영역 - 4단 그리드 (항목 선택 | 문제 선택 | A4 | 페이지맵) */}
          <div className="flex-1 grid grid-cols-[0.6fr_0.9fr_3fr_0.6fr] h-full">
            {/* 1단: 항목 선택 (왼쪽) */}
            <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full min-h-0">
              <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <h3 className="font-semibold text-lg mb-2">항목을 선택하세요</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="문제 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0 overflow-auto">
                <div className="p-4 space-y-1">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{category.id}.</span>
                        <span className="text-sm">{category.title}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* 2단: 문제 선택 (중좌) */}
            <div className="bg-white border-r border-gray-200 flex flex-col h-full min-h-0">
              <div className="p-4 h-16 border-b border-gray-200 flex items-center">
                <h3 className="font-semibold text-lg">문제 선택</h3>
                <div className="flex items-center gap-2 justify-between w-full">
                  <Input
                    placeholder="문제 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCategory((c) => (c === 'D004' ? 'D007' : 'D004'))}
                  >
                    카테고리: {selectedCategory}
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 min-h-0 overflow-auto">
                <div className="p-4 grid grid-cols-1 gap-3">
                  {categoryFilteredPool.map((p) => (
                    <div key={`panel-${p.id}`}>
                      <DraggablePoolCard problem={p} />
                    </div>
                  ))}
                  {categoryFilteredPool.length === 0 && (
                    <div className="text-xs text-gray-500">조건에 맞는 문제가 없습니다.</div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* 3단: A4 페이지 편집기 (중앙) */}
            <div className="relative flex flex-col h-full">
              {/* 상단 내비게이션 (페이지 이동) */}
              <div className="p-4 h-16 border-b border-gray-200 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">페이지 {currentPage} / {totalPages}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* A4 미리보기 & 드롭 영역 - @dnd-kit 적용 */}
              <div className="flex-1 p-4 overflow-auto">
                <DndContext
                  sensors={sensors}
                  onDragStart={(event: DragStartEvent) => {
                    const data = (event.active.data.current ?? null) as any
                    if (!data) return
                    if (data.source === 'pool') {
                      setActiveDrag({ source: 'pool', problemId: data.problemId })
                    } else if (data.source === 'page') {
                      setActiveDrag({ source: 'page', pageIndex: data.pageIndex, index: data.index, problemId: data.problemId })
                    }
                  }}
                  onDragOver={(event: DragOverEvent) => {
                    const overData = (event.over?.data.current ?? null) as any
                    if (!overData) return
                    if (overData.kind === 'page-container') {
                      setDragInsert({ pageIndex: overData.pageIndex, index: overData.count })
                    } else if (overData.kind === 'page-card') {
                      setDragInsert({ pageIndex: overData.pageIndex, index: overData.index })
                    } else if (overData.kind === 'col-slot') {
                      setDragInsert({ pageIndex: overData.pageIndex, index: overData.index, column: overData.column })
                    } else if (overData.kind === 'pagemap-card') {
                      setDragInsert({ pageIndex: overData.pageIndex, index: overData.index })
                    } else if (overData.kind === 'pagemap-container') {
                      setDragInsert({ pageIndex: overData.pageIndex, index: overData.count })
                    }
                  }}
                  onDragEnd={(event: DragEndEvent) => {
                    const activeData = (event.active.data.current ?? null) as any
                    const overData = (event.over?.data.current ?? null) as any
                    if (!activeData || !overData) {
                      setActiveDrag(null)
                      setDragInsert(null)
                      return
                    }
                    setPages((prev) => {
                      const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds] }))
                      // 독립 컬럼 슬롯으로 드롭된 경우: 정확한 컬럼/인덱스에 삽입
                      if (overData.kind === 'col-slot') {
                        const targetPageIndex = overData.pageIndex as number
                        const targetColumn = overData.column as number
                        const indexInColumn = overData.index as number
                        if (activeData.source === 'pool') {
                          const pid = activeData.problemId as string
                          insertAtColumn(targetPageIndex, targetColumn, indexInColumn, pid)
                        } else if (activeData.source === 'page') {
                          const { pageIndex: fromPage, index: fromIndex, problemId } = activeData
                          // 원본에서 제거 후 대상 컬럼/슬롯에 삽입
                          const page = next[fromPage]
                          const removedIndex = page.problemIds.indexOf(problemId)
                          if (removedIndex >= 0) page.problemIds.splice(removedIndex, 1)
                          // 상태 반영은 insertAtColumn 내부 setPages와 충돌하므로 여기선 반환만 하고 아래에서 별도 처리
                        }
                        return next
                      }
                      if (overData.kind === 'page-container' || overData.kind === 'page-card') {
                        const targetPageIndex = overData.pageIndex
                        // 컬럼 독립 동작을 위해 컬럼을 선택하고 해당 컬럼 맨 뒤로 삽입
                        const page = next[targetPageIndex]
                        const cols = Math.max(1, Math.min(2, page.columns))
                        const targetColumn = chooseTargetColumn(targetPageIndex, cols)
                        const byCol = getColumnEntries(targetPageIndex, cols)
                        const targetIndex = byCol[targetColumn].length
                        // insertAtColumn이 setPages를 갱신하므로 여기서는 next 반환
                        if (activeData.source === 'pool') {
                          const pid = activeData.problemId as string
                          insertAtColumn(targetPageIndex, targetColumn, targetIndex, pid)
                        } else if (activeData.source === 'page') {
                          const { pageIndex: fromPage, index: fromIndex, problemId } = activeData
                          // 먼저 원본 페이지에서 제거
                          const fromList = next[fromPage].problemIds
                          const rmIdx = fromList.indexOf(problemId)
                          if (rmIdx >= 0) fromList.splice(rmIdx, 1)
                          insertAtColumn(targetPageIndex, targetColumn, targetIndex, problemId)
                        }
                      }
                      if (overData.kind === 'pagemap-container' || overData.kind === 'pagemap-card') {
                        const targetPageIndex = overData.pageIndex
                        // 페이지 맵 드롭도 컬럼 선택 후 해당 컬럼 위치로 삽입
                        const page = next[targetPageIndex]
                        const cols = Math.max(1, Math.min(2, page.columns))
                        const targetColumn = chooseTargetColumn(targetPageIndex, cols)
                        const byCol = getColumnEntries(targetPageIndex, cols)
                        const targetIndex = byCol[targetColumn].length
                        if (activeData.source === 'pool') {
                          const pid = activeData.problemId as string
                          insertAtColumn(targetPageIndex, targetColumn, targetIndex, pid)
                        } else if (activeData.source === 'page') {
                          const { pageIndex: fromPage, index: fromIndex, problemId } = activeData
                          const fromList = next[fromPage].problemIds
                          const rmIdx = fromList.indexOf(problemId)
                          if (rmIdx >= 0) fromList.splice(rmIdx, 1)
                          insertAtColumn(targetPageIndex, targetColumn, targetIndex, problemId)
                        }
                      }
                      return next
                    })
                    setActiveDrag(null)
                    setDragInsert(null)
                  }}
                >
                <div className="w-full h-full flex items-start justify-center">
                  <div className="bg-white border border-gray-300 shadow-sm w-full max-w-none min-h-[80vh] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">A4 미리보기</div>
                      <div className="text-xs text-gray-500">컬럼: {pages[selectedPageIndex]?.columns ?? 1}</div>
                          </div>
                    <div className="relative"
                      onDragLeave={() => setDragInsert((d) => (d && d.pageIndex === selectedPageIndex ? null : d))}
                    >
                      {pages[selectedPageIndex]?.columns === 2 && (
                        <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-gray-300" />
                      )}
                      {(() => {
                        const page = pages[selectedPageIndex]
                        const baseIds = page?.problemIds ?? []
                        const columns = page?.columns ?? 1
                        // 문제/인디케이터 리스트 구성
                        const items: Array<{ kind: 'problem'; id: string } | { kind: 'indicator' }> = []
                        for (let i = 0; i < baseIds.length; i += 1) {
                          if (dragInsert && dragInsert.pageIndex === selectedPageIndex && dragInsert.index === i) {
                            items.push({ kind: 'indicator' })
                          }
                          items.push({ kind: 'problem', id: baseIds[i] })
                        }
                        if (dragInsert && dragInsert.pageIndex === selectedPageIndex && dragInsert.index >= baseIds.length) {
                          items.push({ kind: 'indicator' })
                        }
                        // Masonry를 위해 행 분할 제거하고, column-count 기반으로 렌더링
                        return (
                          <div ref={gridRef} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                            {(() => {
                              // Masonry 배치: 왼쪽→오른쪽으로 각 컬럼 스택 쌓기
                              const columnHeights = new Array(columns).fill(0)
                              const stacks: Array<Array<{ key: string; render: React.ReactNode; baseIndex?: number }>> = new Array(columns).fill(null).map(() => [])
                              const pushToColumn = (node: { key: string; render: React.ReactNode; baseIndex?: number }, estHeight = 1) => {
                                const target = columnHeights.indexOf(Math.min(...columnHeights))
                                stacks[target].push(node)
                                columnHeights[target] += estHeight
                              }
                              // 추정 높이: 문제 텍스트 길이 기반 간단 추정(정교화 가능)
                              const estimate = (id: string) => {
                                const pb = getProblemById(id)
                                if (!pb) return 1
                                const base = 1
                                const desc = Math.ceil((pb.description?.length ?? 0) / 60)
                                const form = Math.ceil((pb.formula?.length ?? 0) / 80)
                                return base + desc * 0.5 + form * 0.5
                              }
                              // baseIndex 순회 (인디케이터는 per-problem 시점에 삽입)
                              baseIds.forEach((id, baseIndex) => {
                                const pb = getProblemById(id)
                                if (!pb) {
                                  pushToColumn({ key: `empty-${baseIndex}`, render: <div key={`empty-${baseIndex}`} /> }, 1)
                                  return
                                }
                                const target = columnHeights.indexOf(Math.min(...columnHeights))
                                const isHidden = activeDrag && activeDrag.source === 'page' && activeDrag.pageIndex === selectedPageIndex && activeDrag.index === baseIndex
                                pushToColumn({ key: `page-${selectedPageIndex}-item-${id}-${baseIndex}`, render: (
                                  <DroppablePageCard pageIndex={selectedPageIndex} index={baseIndex}>
                                    <DraggableProblemCard pageIndex={selectedPageIndex} index={baseIndex} problemId={id} hidden={!!isHidden} />
                                  </DroppablePageCard>
                                ), baseIndex }, estimate(id))
                              })
                              // 하단 인디케이터 (컬럼별 마지막 뒤)
                              const lastIndexByCol: number[] = stacks.map((col) => {
                                const last = [...col].reverse().find((n) => typeof n.baseIndex === 'number')
                                return (last?.baseIndex as number | undefined) ?? -1
                              })
                              colInfoRef.current.lastIndex = lastIndexByCol
                              return stacks.map((col, colIdx) => (
                                <div key={`col-${colIdx}`} className="flex flex-col gap-4 relative">
                                  {col.map((n) => (
                                    <React.Fragment key={n.key}>{n.render}</React.Fragment>
                                  ))}
                                  {/* 컬럼 하단 인디케이터 */}
                                  {dragInsert && dragInsert.pageIndex === selectedPageIndex && dragInsert.column === colIdx && dragInsert.index > lastIndexByCol[colIdx] && (
                                    <div className="border-2 border-dashed border-blue-300/70 bg-blue-50/30 rounded-lg min-h-28 w-full" />
                                  )}
                        </div>
                              ))
                            })()}
                      </div>
                    )
                      })()}
                </div>
                  </div>
                </div>
                {/* 드래그 오버레이 */}
                <DragOverlay dropAnimation={null}>{renderDragOverlay()}</DragOverlay>
                </DndContext>
              </div>
            </div>

            {/* 4단: 페이지 맵 (오른쪽) */}
            <div className="bg-gray-50 border-l border-gray-200 flex flex-col h-full">
              <div className="p-4 h-18 border-b border-gray-200">
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
                        <Popover>
                          <PopoverTrigger asChild>
                        <Button
                              size="icon" variant="outline" className="h-7 w-7" aria-label="페이지 삭제"
                              onClick={() => setPages((prev) => {
                                if (prev.length <= 1) return prev
                                const idx = selectedPageIndex
                                const next = prev.filter((_, i) => i !== idx)
                                setCurrentPage((p) => Math.max(1, Math.min(p, next.length)))
                                return next
                              })}
                            >
                              <Minus className="h-3.5 w-3.5" />
                        </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs">현재 페이지를 삭제</PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="icon" variant="outline" className="h-7 w-7" aria-label="페이지 추가"
                              onClick={() => setPages((prev) => {
                                const newId = (prev[prev.length - 1]?.id ?? 0) + 1
                                return [...prev, { id: newId, columns: Math.max(1, Math.min(2, prev[selectedPageIndex]?.columns ?? 2)), problemIds: [] }]
                              })}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs">새 페이지를 추가</PopoverContent>
                        </Popover>
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
                            <DroppableMiniMapContainer pageIndex={i} count={pg.problemIds.length}>
                              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${pg.columns}, minmax(0, 1fr))` }}>
                                {Array.from({ length: pg.columns }).map((_, colIdx) => (
                                  <div key={`mini-col-${pg.id}-${colIdx}`} className="flex flex-col gap-1.5">
                                    <DroppableColSlot pageIndex={i} column={colIdx} index={0} compact />
                                    {pg.problemIds
                                      .filter((pid) => (pages[i].columnMap?.[pid] ?? 0) === colIdx)
                                      .map((pid, colPos) => (
                                        <React.Fragment key={`mini-entry-${pg.id}-${pid}-${colPos}`}>
                                          <MiniMapDroppableCard pageIndex={i} index={pages[i].problemIds.indexOf(pid)} pid={pid} title={getProblemById(pid)?.title} column={colIdx} />
                                          <DroppableColSlot pageIndex={i} column={colIdx} index={colPos + 1} compact />
                                        </React.Fragment>
                                      ))}
                                  </div>
                                ))}
                              </div>
                            </DroppableMiniMapContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border p-3">
                    <div className="text-sm font-medium mb-2">빠른 이동</div>
                    <Input
                      type="number"
                      placeholder="페이지 번호"
                      min={1}
                      max={totalPages}
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseInt((e.target as HTMLInputElement).value)
                          if (!Number.isNaN(value) && value >= 1 && value <= totalPages) {
                            setCurrentPage(value)
                          }
                        }
                      }}
                    />
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