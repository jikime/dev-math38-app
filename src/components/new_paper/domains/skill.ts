/**
 * 스킬(Skill) 관련 타입 정의
 */

// Skill 관련 타입
export interface SkillIdName {
  skillId: string;
  skillName: string;
}

export interface Skill extends SkillIdName {
  chapterId: number;
  index: number;
  academyId: number;
  groupId: number;
  problemIds: string[];
  difficultyMap: Map<string, string[]>;
}

export interface SkillVO {
  skillId: string;
  skillName: string;
  counts: number;
  wrongs?: number;
  typeCounts: number[][][];
}

// Chapter Skill 관련
export interface SpChapterSkillsVO {
  chapterId: number;
  chapterIndex: string;
  chapterName: string;
  skillList: SkillVO[];
}

// Student Skill 관련
export interface StudentWrongs {
  lectureId: string;
  studentId: string;
  wrongCount: number;
}

export interface SkillWrongs {
  skillId: string;
  wrongCount: number;
}

export interface SkillStudentIds {
  skillIds: string[];
  studentids: string[];
}

export interface LectureStudentWrongsVO {
  userId: string;
  name: string;
  email?: string | null;
  schoolName?: string | null;
  grade: number;
  score: number;
  wrongs?: number;
  userStudyPaperId?: string;
  targets: number;
  correct2: number;
  correct1: number;
  wrong1: number;
  wrong2: number;
  total?: number;
}

export interface LectureStudentSkillSolveCountsPO {
  lectureId: string;
  studentIds: string[];
  skillIds: string[];
}

export interface LectureStudentSkillSolveCountRO {
  lectureId: string;
  studentSkillSolveCountMap: Map<string, Map<string, StudentSkillSolveCount>>;
}

export interface StudentSkillSolveCount {
  studentId: string;
  skillId: string;
  correct2: number;
  correct1: number;
  wrong1: number;
  wrong2: number;
}