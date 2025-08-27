import { create } from 'zustand'
import type { SkillChapter } from '@/types/skill'
import type { GeneratedPaper, PaperPage, PaperProblem } from '@/types/problem'

// 수동 선택된 페이지 레이아웃 인터페이스
export interface ManualPageLayout {
  id: number
  columns: number
  problemIds: string[]
  laneOf?: Record<string, number>
}

// 수동 선택된 문제 정보
export interface ManualProblem {
  problemId: string
  problem: unknown // API에서 받은 문제 데이터
  pageId: number
  column: number
  order: number
}

interface ManualProblemState {
  // 항목 관련 상태
  skillChapters: SkillChapter[]
  selectedSkill: string | null
  
  // 수동 시험지 상태
  manualPages: ManualPageLayout[]
  manualProblems: ManualProblem[]
  manualPaper: GeneratedPaper | null
  isManualMode: boolean
  
  // 상태 업데이트 함수
  setSkillChapters: (chapters: SkillChapter[]) => void
  setSelectedSkill: (skillId: string | null) => void
  selectSkill: (skillId: string) => void
  
  // 수동 시험지 관리 함수
  setManualPages: (pages: ManualPageLayout[]) => void
  addManualProblem: (problemData: unknown, pageId: number, column: number) => void
  removeManualProblem: (problemId: string) => void
  generateManualPaper: (title: string, metadata?: Partial<GeneratedPaper>) => void
  clearManualPaper: () => void
  setManualMode: (isManual: boolean) => void
}

export const useManualProblemStore = create<ManualProblemState>((set, get) => ({
  // 초기 상태
  skillChapters: [],
  selectedSkill: null,
  manualPages: [{ id: 1, columns: 2, problemIds: [], laneOf: {} }],
  manualProblems: [],
  manualPaper: null,
  isManualMode: false,
  
  // 상태 업데이트 함수들
  setSkillChapters: (chapters) => set({ skillChapters: chapters }),
  
  setSelectedSkill: (skillId) => set({ selectedSkill: skillId }),
  
  selectSkill: (skillId) => set({ selectedSkill: skillId }),
  
  // 수동 시험지 관리 함수들
  setManualPages: (pages) => set({ manualPages: pages }),
  
  addManualProblem: (problemData, pageId, column) => {
    const { manualProblems, generateManualPaper } = get()
    const existingProblem = manualProblems.find(p => p.problemId === (problemData as any).problemId)
    
    console.log('Store addManualProblem called:', {
      problemId: (problemData as any).problemId,
      pageId,
      column,
      existingProblem: !!existingProblem,
      currentProblemsCount: manualProblems.length
    })
    
    if (existingProblem) {
      // 기존 문제 위치 업데이트
      const updatedProblems = manualProblems.map(p =>
        p.problemId === (problemData as any).problemId
          ? { ...p, pageId, column, order: Date.now() }
          : p
      )
      console.log('Updating existing problem, new count:', updatedProblems.length)
      set({
        manualProblems: updatedProblems
      })
    } else {
      // 새 문제 추가
      const newProblem: ManualProblem = {
        problemId: (problemData as any).problemId,
        problem: problemData,
        pageId,
        column,
        order: Date.now()
      }
      const updatedProblems = [...manualProblems, newProblem]
      console.log('Adding new problem, new count:', updatedProblems.length)
      set({
        manualProblems: updatedProblems
      })
    }
    
    // 문제가 추가/업데이트된 후 자동으로 수동 시험지 생성
    console.log('Auto-generating manual paper after problem addition')
    generateManualPaper('수동 선택 시험지')
  },
  
  removeManualProblem: (problemId) => {
    const { manualProblems } = get()
    set({
      manualProblems: manualProblems.filter(p => p.problemId !== problemId)
    })
  },
  
  generateManualPaper: (title, metadata = {}) => {
    const { manualPages, manualProblems } = get()
    
    console.log('generateManualPaper called with:', {
      title,
      manualProblemsCount: manualProblems.length,
      manualPagesCount: manualPages.length
    })
    
    // 수동 선택된 문제들을 PaperPage 형식으로 변환
    const pages: PaperPage[] = manualPages.map(pageLayout => {
      const leftProblems: PaperProblem[] = []
      const rightProblems: PaperProblem[] = []
      
      // 해당 페이지의 문제들 찾기
      const pageProblems = manualProblems.filter(p => p.pageId === pageLayout.id)
      
      pageProblems.forEach(manualProblem => {
        const paperProblem: PaperProblem = {
          problemNumber: manualProblem.problemId,
          margin: 20,
          height: 0,
          problemId: manualProblem.problemId,
          problem: manualProblem.problem,
          level: (manualProblem.problem as { difficulty?: number }).difficulty || 3,
          ltype: (manualProblem.problem as { ltype?: string }).ltype || "계산",
          answerType: (manualProblem.problem as { content?: { answerType?: string } }).content?.answerType || "choice",
          skillId: (manualProblem.problem as { tags?: { type: string; skillId?: string }[] })?.tags?.find(tag => tag.type === "skill")?.skillId,
          skillName: (manualProblem.problem as { skillName?: string }).skillName
        }
        
        if (manualProblem.column === 0) {
          leftProblems.push(paperProblem)
        } else {
          rightProblems.push(paperProblem)
        }
      })
      
      return {
        leftSet: leftProblems,
        rightSet: rightProblems,
        pageNumber: pageLayout.id,
        solutions: false
      }
    })
    
    const generatedPaper: GeneratedPaper = {
      academyId: 1,
      academyName: "수학생각",
      subjectId: 1,
      title,
      countProblems: manualProblems.length,
      skillIds: [],
      categoriesFilter: [],
      pages,
      columns: 2,
      minMargin: 20,
      ...metadata
    }
    
    console.log('Generated manual paper:', {
      paperTitle: generatedPaper.title,
      pageCount: generatedPaper.pages.length,
      totalProblems: generatedPaper.countProblems,
      isManualMode: true
    })
    
    set({ 
      manualPaper: generatedPaper,
      isManualMode: true
    })
  },
  
  clearManualPaper: () => {
    set({ 
      manualPaper: null,
      isManualMode: false,
      manualPages: [{ id: 1, columns: 2, problemIds: [], laneOf: {} }],
      manualProblems: []
    })
  },
  
  setManualMode: (isManual) => set({ isManualMode: isManual }),
}))