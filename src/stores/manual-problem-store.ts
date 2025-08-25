import { create } from 'zustand'
import type { SkillChapter } from '@/types/skill'

interface ManualProblemState {
  // 항목 관련 상태
  skillChapters: SkillChapter[]
  selectedSkills: string[]
  
  // 상태 업데이트 함수
  setSkillChapters: (chapters: SkillChapter[]) => void
  setSelectedSkills: (skills: string[]) => void
  toggleSkill: (skillId: string) => void
  toggleAllSkillsInChapter: (chapter: SkillChapter) => void
}

export const useManualProblemStore = create<ManualProblemState>((set, get) => ({
  // 초기 상태
  skillChapters: [],
  selectedSkills: [],
  
  // 상태 업데이트 함수들
  setSkillChapters: (chapters) => set({ skillChapters: chapters }),
  
  setSelectedSkills: (skills) => set({ selectedSkills: skills }),
  
  toggleSkill: (skillId) => set((state) => ({
    selectedSkills: state.selectedSkills.includes(skillId)
      ? state.selectedSkills.filter(id => id !== skillId)
      : [...state.selectedSkills, skillId]
  })),
  
  toggleAllSkillsInChapter: (chapter) => set((state) => {
    const chapterSkillIds = chapter.skillList.map(skill => skill.skillId)
    const allSelected = chapterSkillIds.every(skillId => state.selectedSkills.includes(skillId))
    
    if (allSelected) {
      // 모두 선택된 상태라면 해제
      return {
        selectedSkills: state.selectedSkills.filter(skillId => !chapterSkillIds.includes(skillId))
      }
    } else {
      // 일부만 선택되었거나 아무것도 선택되지 않았다면 전체 선택
      const newSkills = [...state.selectedSkills]
      chapterSkillIds.forEach(skillId => {
        if (!newSkills.includes(skillId)) {
          newSkills.push(skillId)
        }
      })
      return { selectedSkills: newSkills }
    }
  }),
}))