import type { BookGroupStats, SkillChapter } from "@/types/cloud"

// 통계 데이터 계산 함수
export const calculateStats = (bookGroupStats: BookGroupStats | null, skillChapters: SkillChapter[] | null) => {
  if (!bookGroupStats || !skillChapters) return null

  // 각 스킬별 통계 계산
  const skillStats = new Map()
  bookGroupStats.problems.forEach(problem => {
    const skillId = problem.skillId
    const difficulty = parseInt(problem.difficulty)
    
    if (!skillStats.has(skillId)) {
      skillStats.set(skillId, {
        skillId,
        total: 0,
        최하: 0,
        하: 0,
        중: 0,
        상: 0,
        최상: 0
      })
    }

    const stats = skillStats.get(skillId)
    stats.total++
    
    switch(difficulty) {
      case 1:
        stats.최하++
        break
      case 2:
        stats.하++
        break
      case 3:
        stats.중++
        break
      case 4:
        stats.중++
        break
      case 5:
        stats.최상++
        break
    }
  })

  // 챕터별로 그룹화하여 계층 구조 생성
  return skillChapters.map(chapter => {
    const chapterStats = {
      chapterId: chapter.chapterId,
      title: chapter.title,
      isChapter: true,
      total: 0,
      최하: 0,
      하: 0,
      중: 0,
      상: 0,
      최상: 0,
      skills: [] as any[]
    }

    // 각 챕터의 스킬들 처리 (모든 스킬 포함)
    chapter.skills.forEach(skill => {
      const stats = skillStats.get(skill.skillId)
      if (stats) {
        // 챕터 합계에 추가
        chapterStats.total += stats.total
        chapterStats.최하 += stats.최하
        chapterStats.하 += stats.하
        chapterStats.중 += stats.중
        chapterStats.상 += stats.상
        chapterStats.최상 += stats.최상

        // 스킬 정보 추가
        chapterStats.skills.push({
          ...stats,
          title: skill.title,
          isSkill: true
        })
      } else {
        // 문제가 없는 스킬도 0으로 표시
        chapterStats.skills.push({
          skillId: skill.skillId,
          title: skill.title,
          isSkill: true,
          total: 0,
          최하: 0,
          하: 0,
          중: 0,
          상: 0,
          최상: 0
        })
      }
    })

    return chapterStats
  }) // 모든 챕터 표시 (필터링 제거)
}