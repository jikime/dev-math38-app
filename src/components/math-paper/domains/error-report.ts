/**
 * 오류 신고(Error Report) 관련 타입 정의
 */

// Error Report 관련
export interface ErrorReport {
  reportId: number;
  subjectId: number;
  academyId: number;
  chapterId: number;
  skillId: string;
  problemId: string;
  lectureId: string;
  paperId: string | null;
  academyName: string;
  reporterName: string;
  subjectName: string;
  chapterName: string;
  skillName: string;
  lectureTitle: string;
  paperTitle: string;
  problemNumber: string;
  errorType: string;
  errorContent: string;
  state: "REPORTED" | "FIXED";
  correctionContent: string | null;
  reported: string;
  corrected: string | null;
}

