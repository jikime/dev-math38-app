import React from "react";
import { PaperProblem } from "../types";
import { BookOpen } from "lucide-react";
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
    <div className="page flex flex-col text-left" style={{ height: "100%" }}>
      <div className="header-container">
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <div>
              <p className="text-xs text-gray-500">{title}</p>
            </div>
          </div>
        </div>

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

      <div className="body flex-grow border-t border-b border-orange-200">
        <div className="column-left">
          <div className="empty"></div>
          <div className="problem-column">
            {leftSet?.map((p) => (
              <div
                key={p.problemId}
                className="problem-sect"
              >
                <AcademyProblemView
                  problem={p.problem}
                  problemNumber={p.problemNumber}
                  skillName={p.skillName}
                  skillId={p.skillId!}
                  level={p.level}
                  ltype={p.ltype}
                  answerType={p.answerType}
                  edit={edit}
                  showTags={showTags}
                />
              </div>
            ))}
          </div>
        </div>
        {columns > 1 && rightSet && (
          <div className="column-right">
            <div className="problem-column">
              {rightSet?.map((p) => (
                <div
                  key={p.problemId}
                  className="problem-sect"
                >
                  <AcademyProblemView
                    problem={p.problem}
                    problemNumber={p.problemNumber}
                    skillName={p.skillName}
                    skillId={p.skillId!}
                    level={p.level}
                    ltype={p.ltype}
                    answerType={p.answerType}
                    edit={edit}
                    showTags={showTags}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademyPaperTemplate;
