"use client";

import { M38UserStudyPaper, SkillCounts, SkillIdName, SkillVO, SpProblem, GeneratedPaper } from "../typings";
import { createContext } from "react";

/**
 *
 *
 */
interface PaperEditContextProps {
  // GeneratedPaper
  paperId: string | undefined;
  subjectId: number | undefined;
  title: string | undefined;
  chapterIds: number[];
  chapterFrom: string;
  chapterTo: string;
  categoriesFilter: string[];
  problemTypeCounts: number[][];

  // AbstractPaper
  paper: GeneratedPaper | M38UserStudyPaper | undefined;
  setPaper: (paper: GeneratedPaper | M38UserStudyPaper | undefined) => void;

  // setter
  setProblemTypeCounts: (typeCounts: number[][]) => void;
  setSubjectId: (subjectId: number | undefined) => void;
  setChapterIds: (chapterIds: number[]) => void;
  setChapterFrom: (value: string) => void;
  setChapterTo: (value: string) => void;
  setCategoriesFilter: (values: string[]) => void;
  setTitle: (title: string) => void;
  generate: (
    lectureId: string,
    lectureTitle: string,
    teacherName: string
  ) => void;

  // add Problem Change context
  problemId: string | undefined;
  // problem: SpProblem | undefined;
  // level: number;
  skillIds: string[];
  skillName: string;
  skillList: SkillVO[];
  setSkillIds: (ids: string[]) => void;
  setSkillName: (name: string) => void;
  setSkillList: (skills: SkillVO[]) => void;

  skillCountsMap: SkillCounts;
  setSkillCountsMap: (skillCountsMap: SkillCounts) => void;

  setProblemId: (id: string) => void;
  changerVisible: boolean;
  setChangerVisible: (visible: boolean) => void;
  addProblem: (problem: SpProblem, skillName: SkillIdName) => void;
  removeProblem: (problemId: string) => void;
  appendAfter: (problemId: string) => void;
  initialize: (
    lectureId: string,
    lectureTitle: string,
    teacherName: string
  ) => void; //  단원 선택 초기화
  keepSelect: boolean;
  setKeepSelect: (keepSelect: boolean) => void;
  emptyPaper: (
    lectureId: string,
    lectureTitle: string,
    teacherName: string
  ) => void;
  rearrangePages: (countPerPage: number) => void;

  reportError: (formData: FormData) => boolean;
  countProblems: () => number;
}

export const PaperEditContext = createContext<PaperEditContextProps>({
  subjectId: undefined,
  paperId: undefined,
  title: undefined,
  chapterIds: [],
  chapterFrom: "",
  chapterTo: "",
  categoriesFilter: [],
  problemTypeCounts: [[]],
  paper: undefined,
  setPaper: () => {},

  // setter
  setProblemTypeCounts: () => {},
  setSubjectId: () => {},
  setChapterIds: () => {},
  setChapterFrom: () => {},
  setChapterTo: () => {},
  setCategoriesFilter: () => {},
  setTitle: () => {},
  generate: () => {},

  problemId: undefined,
  // problem: undefined,
  // level: 0,
  skillIds: [],
  skillName: "",
  skillList: [],
  setSkillIds: () => {},
  setSkillName: () => {},
  setSkillList: () => {},

  skillCountsMap: {},
  setSkillCountsMap: () => {},

  setProblemId: () => {},
  changerVisible: false,
  setChangerVisible: () => {},
  addProblem: () => {},
  removeProblem: () => {},
  appendAfter: () => {},
  initialize: () => {},
  keepSelect: true,
  setKeepSelect: () => {},
  emptyPaper: () => {},
  rearrangePages: () => {},
  countProblems: () => 0,

  reportError: (formData: FormData) => {
    return false;
  },
});
