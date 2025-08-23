"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PaperProblem } from "../typings";
import { BookOpen } from "lucide-react"
import AcademyProblemView from "./academy-problem-view";

type PaperTemplateProps = {
  title: string;
  chapterFrom?: string;
  chapterTo?: string;
  lectureTitle?: string;
  subjectName: string;
  teacherName?: string;
  studentName?: string;
  academyName?: string;
  pageNumber: number;
  leftSet: PaperProblem[];
  rightSet?: PaperProblem[];
  columns: number;
  edit?: boolean;
  showTags?: boolean;
  academyLogo?: string;
};

const AcademyPaperTemplate = ({
  title = "",
  lectureTitle = "템플릿",
  subjectName = "",
  teacherName = "",
  studentName = "",
  academyName = "수작",
  pageNumber = 1,
  leftSet = [],
  rightSet = [],
  columns = 2,
  edit = false,
  showTags = true,
  academyLogo,
}: PaperTemplateProps) => {
  return (
    <div className="page flex flex-col text-left shadow-md" style={{ height: "100%" }}>
      {/* 헤더 */}
      <div className="header-container">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 시험지명 */}
          <div className="text-right">
            <h2 className="text-sm font-medium text-gray-800 flex items-center gap-2">
                {academyLogo ? (
                <img src={academyLogo} alt={academyName} className="w-8 h-8 object-contain" />
                ) : (
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                </div>
                )}
            {lectureTitle}
            </h2>
          </div>

          {/* 오른쪽: 학원 로고 + 시험지 그룹명 */}
          <div className="flex items-center gap-2">
            
            <div>
              <p className="text-xs text-gray-500">{title}</p>
            </div>
          </div>


        </div>

        {/* 첫번째 페이지에서만 teacher/student 정보 렌더링 */}
        {pageNumber === 1 && (
          <div className="flex justify-end gap-4 py-1">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500"> 선생님 : </span>
              <div className="w-24 border-gray-300 h-5">
                {teacherName && <span className="text-xs">{teacherName}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-500"> 학생 : </span>
              <div className="w-40 border-gray-300 h-5">
                {studentName && <span className="text-xs">{studentName}</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 문제 영역: flex-grow를 사용하여 남은 공간을 채움 */}
      <div className="body flex-grow border-t border-b border-orange-200">
        <div className="column-left">
          <div className="empty"></div>
          <div className="problem-column">
            {leftSet?.map((p) => (
              <div
                key={p.problemId}
                className={cn("problem-sect")}
              >
                <AcademyProblemView
                  width={columns === 1 ? 740 : 360}
                  problem={p.problem}
                  problemNumber={p.problemNumber}
                  margin={0}
                  skillName={p.skillName}
                  skillId={p.skillId!}
                  level={p.level}
                  ltype={p.ltype}
                  answerType={p.answerType || ""}
                  edit={edit}
                  showTags={showTags}
                />
              </div>
            ))}
            <div className="empty-problem"></div>
          </div>
        </div>
        {columns > 1 && (
          <>
            <div className="divier border-l !border-orange-200"></div>
            <div className="column-right">
              <div className="empty"></div>
              <div className="problem-column">
                {rightSet?.map((p) => (
                  <div
                    className={cn("problem-sect")}
                    key={p.problemId}
                  >
                    <AcademyProblemView
                      width={370}
                      problem={p.problem}
                      problemNumber={p.problemNumber}
                      margin={0}
                      skillName={p.skillName}
                      skillId={p.skillId!}
                      level={p.level}
                      ltype={p.ltype}
                      answerType={p.answerType || ""}
                      edit={edit}
                      showTags={showTags}
                    />
                  </div>
                ))}
                <div className="empty-problem"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 푸터 */}
      <div className="footer">
        <div className="academy">
          <span className="academy-title"> {academyName || ""} </span>
        </div>
        <span className="page-num">
          <span> 페이지 </span>
          <span> {pageNumber} </span>
        </span>
      </div>
    </div>
  );
};

export default AcademyPaperTemplate;
