import { create } from 'zustand'
import type { SkillChapter } from '@/types/skill'

interface ManualProblemState {
  // 항목 관련 상태
  skillChapters: SkillChapter[]
  selectedSkill: string | null
  
  // 상태 업데이트 함수
  setSkillChapters: (chapters: SkillChapter[]) => void
  setSelectedSkill: (skillId: string | null) => void
  selectSkill: (skillId: string) => void
}

export const useManualProblemStore = create<ManualProblemState>((set, get) => ({
  // 초기 상태
  skillChapters: [],
  selectedSkill: null,
  
  // 상태 업데이트 함수들
  setSkillChapters: (chapters) => set({ skillChapters: chapters }),
  
  setSelectedSkill: (skillId) => set({ selectedSkill: skillId }),
  
  selectSkill: (skillId) => set({ selectedSkill: skillId }),
}))