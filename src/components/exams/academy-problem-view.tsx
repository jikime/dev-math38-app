"use client";

import React from "react";
import { ProblemDetail } from "@/types/exam-paper";
import AcademyProblemTitle from "./academy-problem-title";

// NUM array for choice numbering
const NUM = ["①", "②", "③", "④", "⑤"];

type ProblemViewProps = {
  problem: ProblemDetail;
  width: number;
  problemNumber?: string;
  solution?: boolean;
  margin: number;
  skillName?: string;
  skillId?: string;
  level?: number;
  ltype: string;
  answerType: string;
  edit?: boolean;
  showTags?: boolean;
};

/**
 * PaperPrint : 시험지 보기
 * PaperTemplate: 시험지 편집
 * ProblemPanel : 문제 보기
 *
 * @param {*} param0
 */
const AcademyProblemView = ({
  problem,
  width = 375,
  problemNumber,
  solution = false,
  margin,
  skillName,
  skillId,
  level,
  edit,
  showTags = true,
}: ProblemViewProps) => {
  if (!problem) {
    return (
      <div className="problem" style={{ width: width, marginBottom: margin }}>
        <AcademyProblemTitle
          problemNumber={problemNumber}
          skillId={skillId}
          skillName={skillName}
          level={level}
          showTags={showTags}
        ></AcademyProblemTitle>
        <div className="content">
        문제 삭제 됨
        </div>
      </div>
    );
  }
  const { value, answerType, choice } = problem.content;
  return (
    <div
      className="problem"
      style={{ width: width, marginBottom: margin }}
      id={problem.problemId}
    >
      <AcademyProblemTitle
        problemNumber={problemNumber}
        skillId={skillId}
        skillName={skillName}
        level={level}
        problem={problem}
        showTags={showTags}
      ></AcademyProblemTitle>

      <div className="content">
        <div
          className="problem-content"
          dangerouslySetInnerHTML={{ __html: value }}
        ></div>
      </div>

      {answerType === "choice" && (
        <div className="choice-list">
          {choice &&
            NUM.map((n, index) => (
              <div
                key={index}
                className={
                  "choice " +
                  choice.alignType +
                  (choice.alignNumTop ? "" : " num-center")
                }
              >
                <span className="choice-num">{n}</span>
                <span
                  className="choice-value"
                  dangerouslySetInnerHTML={{
                    __html: choice.values[index],
                  }}
                ></span>
              </div>
            ))}
        </div>
      )}
      {showTags && (
        <div className="flex justify-end pt-4 print:hidden">
          {problem.tags &&
            problem.tags
              .filter((tag) => tag.type === "keyword")
              .map((tag) => (
                <span className="rounded-full bg-gray-100 text-gray-800 px-2 py-1 text-xs" key={tag.value}>
                  {tag.value}
                </span>
              ))}
        </div>
      )}
      {solution && (
        <div
          className="problem-solution"
          dangerouslySetInnerHTML={{ __html: problem.solution?.value }}
        ></div>
      )}
    </div>
  );
};

export default AcademyProblemView;