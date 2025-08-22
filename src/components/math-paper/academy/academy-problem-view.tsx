import React from "react";
import { SpProblem } from "../types";
import { NUM } from "../types";

type AcademyProblemViewProps = {
  problem: SpProblem;
  problemNumber?: string;
  skillName?: string;
  skillId: string;
  level?: number;
  ltype: string;
  answerType: string;
  edit?: boolean;
  showTags?: boolean;
};

const AcademyProblemView = ({
  problem,
  problemNumber,
  skillName,
  skillId,
  level,
  ltype,
  answerType,
  edit,
  showTags = true,
}: AcademyProblemViewProps) => {
  if (!problem) {
    return <div className="problem">문제 삭제 됨</div>;
  }

  const { value, answerType: problemAnswerType, choice } = problem.content;

  return (
    <div className="problem" id={problem.problemId}>
      <div className="problem-header">
        <div className="flex items-center gap-2">
          {problemNumber && (
            <span className="problem-number font-bold text-lg">
              {problemNumber.padStart(2, '0')}
            </span>
          )}
          {showTags && (
            <>
              <span className="skill-name text-sm text-gray-600">
                {skillName}
              </span>
              <span className="level text-xs text-gray-500">
                {level || '-'}
              </span>
              <span className="ltype text-xs text-gray-500">
                {ltype === 'calc' ? '계산' : ltype === 'unds' ? '이해' : ltype === 'resn' ? '추론' : '해결'}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="content">
        <div
          className="problem-content"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>

      {problemAnswerType === "choice" && (
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
                    __html: choice.values[index] || "",
                  }}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AcademyProblemView;
