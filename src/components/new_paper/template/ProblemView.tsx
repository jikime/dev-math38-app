"use client";

import React, { useState } from "react";
import { SpProblem, NUM } from "../typings";
import ProblemTitle from './problem-title';
import { Badge } from "@/components/ui/badge";
import ErrorReportModal from './ErrorReportModal';

const printImage = false;

type ProblemViewProps = {
  problem: SpProblem;
  width: number;
  problemNumber?: string;
  solution?: boolean;
  margin: number;
  skillName?: string;
  skillId: string;
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
const ProblemView = ({
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
  const [showErrorReportModal, setShowErrorReportModal] = useState(false);

  if (!problem) {
    return (
      <div className="problem" style={{ width: width, marginBottom: margin }}>
        문제 삭제 됨
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
      <ProblemTitle
        problemNumber={problemNumber}
        skillId={skillId}
        skillName={skillName}
        level={level}
        edit={edit}
        problem={problem}
        showTags={showTags}
        reportError={() => setShowErrorReportModal(true)}
      ></ProblemTitle>

      {printImage ? (
      <div className="flex justify-center items-center p-2">
        <img src={`https://image3.suzag.com/open/image/problem/${problem.problemId}?v=1`} alt="problem" width={width} height={100} />
      </div>
      ): (
        <>
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
      </>
    )}
      {showTags && (
        <div className="flex justify-end pt-4 print:hidden flex-wrap">
          {problem.tags &&
            problem.tags
              .filter((tag) => tag.type === "keyword")
              .map((tag) => (
                <Badge variant="secondary" className="mr-1" key={tag.value}>
                  {tag.value}
                </Badge>
              ))}
        </div>
      )}
      {solution && (
        <div
          className="problem-solution"
          dangerouslySetInnerHTML={{ __html: problem.solution?.value }}
        ></div>
      )}
      {showErrorReportModal && (
        <ErrorReportModal
          visible={showErrorReportModal}
          onCancel={() => setShowErrorReportModal(false)}
          problemInfo={{
            skillId: skillId,
            problemId: problem.problemId,
          }}
        />
      )}
    </div>
  );
};

export default ProblemView;
