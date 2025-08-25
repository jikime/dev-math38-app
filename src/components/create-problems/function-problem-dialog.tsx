"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useManualProblemStore } from "@/stores/manual-problem-store"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, X, Search, Filter, BookOpen, Target, Award, Brain, Plus, Minus } from "lucide-react"

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

  // 카테고리 선택에 따른 문제 풀 정제 (이미 배치된 문제는 숨김)
  const categoryFilteredPool = useMemo(() => {
    const arrangedIdSet = new Set<string>()
    for (const pg of pages) {
      for (const id of pg.problemIds) arrangedIdSet.add(id)
    }
    return filteredProblems
      .filter((p) => p.id.startsWith(selectedCategory))
      .filter((p) => !arrangedIdSet.has(p.id))
  }, [filteredProblems, selectedCategory, pages])

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

  // 초기 로딩 시 부모로부터 받은 선택 문제를 페이지 1에 채워 넣기 (있을 경우, 최초 1회)
  React.useEffect(() => {
    if (selectedProblems.length > 0 && pages.every((p) => p.problemIds.length === 0)) {
      setPages((prev) => {
        const next = [...prev]
        const laneOf: Record<string, number> = {}
        selectedProblems.forEach((p) => { laneOf[p.id] = 0 })
        next[0] = { ...next[0], problemIds: selectedProblems.map((p) => p.id), laneOf }
        return next
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 드래그 시작: 문제 풀에서
  const onDragStartFromPool = (problemId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "pool", problemId }),
    )
  }

  // 드래그 시작: 페이지 내부 카드에서
  const onDragStartFromPage = (pageIndex: number, indexInPage: number, problemId: string) => (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ type: "page", fromPageIndex: pageIndex, fromIndex: indexInPage, problemId }),
    )
  }

  // 페이지 드롭 처리 (컨테이너에 드롭 → 끝에 삽입)
  const onDropOnPage = (targetPageIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData("application/json")) as
        | { type: "pool"; problemId: string }
        | { type: "page"; fromPageIndex: number; fromIndex: number; problemId: string }

      setPages((prev) => {
        const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds] }))

        if (payload.type === "pool") {
          // 같은 문제를 동일 페이지에 중복 삽입하지 않음
          if (!next[targetPageIndex].problemIds.includes(payload.problemId)) {
            next[targetPageIndex].problemIds.push(payload.problemId)
          }
          return next
        }

        if (payload.type === "page") {
          const { fromPageIndex, fromIndex, problemId } = payload
          // 원본에서 제거
          const [removed] = next[fromPageIndex].problemIds.splice(fromIndex, 1)
          // 대상에 삽입 (끝에)
          if (removed) {
            if (!next[targetPageIndex].problemIds.includes(problemId)) {
              next[targetPageIndex].problemIds.push(problemId)
            } else if (targetPageIndex === fromPageIndex) {
              // 같은 페이지 내에서의 이동이면서 이미 존재하는 경우는 무시
            }
          }
          return next
        }

        return prev
      })
    } catch {
      // ignore
    }
  }

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // 특정 인덱스 위치에 드롭하여 삽입(페이지 미니맵/중앙 A4 둘 다 사용)
  const onDropOnPageIndex = (targetPageIndex: number, targetIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    try {
      const payload = JSON.parse(e.dataTransfer.getData("application/json")) as
        | { type: "pool"; problemId: string }
        | { type: "page"; fromPageIndex: number; fromIndex: number; problemId: string }

      setPages((prev) => {
        const next = prev.map((p) => ({ ...p, problemIds: [...p.problemIds] }))
        if (payload.type === "pool") {
          const { problemId } = payload
          const page = next[targetPageIndex]
          if (!page.problemIds.includes(problemId)) {
            const insertIndex = Math.max(0, Math.min(targetIndex, page.problemIds.length))
            page.problemIds.splice(insertIndex, 0, problemId)
          }
          return next
        }

        const { fromPageIndex, fromIndex, problemId } = payload
        const src = next[fromPageIndex]
        const dst = next[targetPageIndex]

        // 같은 페이지 내 이동 시, 제거 후 인덱스 보정
        if (fromPageIndex === targetPageIndex) {
          const [removed] = dst.problemIds.splice(fromIndex, 1)
          if (removed) {
            const adjust = fromIndex < targetIndex ? -1 : 0
            const insertIndex = Math.max(0, Math.min(targetIndex + adjust, dst.problemIds.length))
            dst.problemIds.splice(insertIndex, 0, removed)
          }
          return next
        }

        // 다른 페이지로 이동 시: 원본 제거, 대상에 중복 없으면 삽입
        const [removed] = src.problemIds.splice(fromIndex, 1)
        if (removed && !dst.problemIds.includes(problemId)) {
          const insertIndex = Math.max(0, Math.min(targetIndex, dst.problemIds.length))
          dst.problemIds.splice(insertIndex, 0, removed)
        }
        return next
      })
    } catch {
      // ignore
    }
  }

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
    const arrangedProblemsFlat: Problem[] = pages
      .flatMap((pg) => pg.problemIds)
      .map((id) => getProblemById(id))
      .filter(Boolean) as Problem[]
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

  const pickShortestLaneIndex = (page: PageLayout): number => {
    const lanes = getLaneItems(page)
    let minIdx = 0
    for (let i = 1; i < lanes.length; i++) {
      if (lanes[i].length < lanes[minIdx].length) minIdx = i
    }
    return minIdx
  }

  const handleA4DragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return

    const [_, pageIdxStr, __, srcColStr] = source.droppableId.split("-") // page-<idx>-col-<colIdx>
    const [___, pageIdxStr2, ____, dstColStr] = destination.droppableId.split("-")
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

    const [srcPrefix, srcPageIdxStr, _srcMid, srcColStr] = source.droppableId.split("-") // pmap-<pageIdx>-col-<colIdx>
    const [dstPrefix, dstPageIdxStr, _dstMid, dstColStr] = destination.droppableId.split("-")
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
          <div className="flex-1 grid grid-cols-[0.8fr_3.2fr_0.6fr] h-full">
            {/* 1단: 항목 선택 (왼쪽) */}
            <div className="bg-gray-50 border-r border-gray-200 flex flex-col h-full min-h-0">
              <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    2
                  </span>
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
                                  return (
                                    <Draggable draggableId={pid} index={index} key={`drag-${pid}`}>
                                      {(drag) => (
                                        <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="bg-white border rounded-lg p-4 cursor-move hover:shadow-md mb-4">
                                          <h4 className="font-medium text-sm mb-2 line-clamp-2">{problem.title}</h4>
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                              <span className="font-bold text-sm">{problem.id}</span>
                                              <Badge className={getDifficultyColor(problem.difficulty)} variant="outline">
                                                {problem.difficulty}
                                              </Badge>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              onClick={() => removeFromPage(selectedPageIndex, problem.id)}
                                            >
                                              <X className="w-4 h-4" />
                                            </Button>
                                          </div>
                                          <p className="text-xs text-gray-600 mb-3">{problem.description}</p>
                                          <div className="bg-gray-50 rounded p-2 mb-3">
                                            <div className="text-xs font-mono text-center">{problem.formula}</div>
                                          </div>
                                          <div className="space-y-1 mb-3">
                                            {problem.choices.slice(0, 2).map((choice, idx) => (
                                              <div key={idx} className="text-xs text-gray-700 line-clamp-1">{choice}</div>
                                            ))}
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs">{problem.type}</Badge>
                                            <span className="text-xs text-gray-500">배치됨</span>
                                          </div>
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
                                              <div ref={drag.innerRef} {...drag.draggableProps} {...drag.dragHandleProps} className="h-8 rounded-sm border bg-white text-[10px] text-gray-700 flex items-center justify-center truncate cursor-move mb-1" title={getProblemById(pid)?.title}>
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