import type { FileWithProblems } from "@/types/problem"
import type { BookGroupStats, BookGroupProblem } from "@/types/cloud"

/**
 * 문제 뷰어의 FileWithProblems 데이터를 기존 통계 모달에서 사용할 수 있는 BookGroupStats 형태로 변환
 */
export function convertFileDataToBookGroupStats(
  fileData: FileWithProblems
): BookGroupStats {
  const problems: BookGroupProblem[] = fileData.problemList.map(problem => ({
    problemId: problem.problemId,
    skillId: problem.tags?.find(tag => tag.type === 'skill')?.skillId || '',
    difficulty: problem.difficulty,
    ltype: problem.ltype,
    choiceType: problem.content?.choice?.values?.some(v => v.trim() !== '') ? 'choice' : 'subjective'
  }))

  return {
    title: fileData.title,
    bookGroupId: fileData.bookGroupId,
    fileId: fileData.fileId,
    subjectId: fileData.subjectId,
    subjectName: fileData.bookGroup?.title || '', // bookGroup에서 과목명 추출
    problems
  }
}

/**
 * 새로운 API 응답 데이터를 기존 BookGroupStats 형태로 변환
 * (새로운 API 응답 구조를 확인한 후 구현)
 */
export function convertFileStatsToBookGroupStats(
  fileStats: any, // 실제 API 응답 구조에 맞게 타입 정의 필요
  fileData: FileWithProblems
): BookGroupStats {
  // 새로운 API 응답 구조에 맞게 구현
  // 현재는 기본 변환 로직 사용
  return convertFileDataToBookGroupStats(fileData)
}