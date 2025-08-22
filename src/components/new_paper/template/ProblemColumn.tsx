"use client";

import React from "react";
import ProblemView from "./ProblemView";
import { cn } from "@/lib/utils";
import { PaperProblem } from "../typings";

// ProblemColumn Component
type ProblemColumnProps = {
  problems: PaperProblem[];
  columns: number;
  edit?: boolean;
  showTags?: boolean;
};

const ProblemColumn = ({
  problems,
  columns,
  edit,
  showTags,
}: ProblemColumnProps) => (
  <div className="flex flex-col justify-between h-full">
    {problems?.map((p) =>
      p.problem ? (
        <div
          key={p.problem.problemId}
          className={cn("relative", edit && "edit")}
        >
          <ProblemView
            width={columns === 1 ? 740 : 360}
            problem={p.problem}
            problemNumber={p.problemNumber}
            margin={0}
            skillName={p.skillName}
            skillId={p.skillId!}
            level={p.level}
            ltype={p.ltype}
            answerType={p.answerType}
            edit={edit}
            showTags={showTags}
          />
        </div>
      ) : (
        <div key={"p-" + p.problemNumber}> 문제가 삭제되었습니다. </div>
      )
    )}
    <div className="empty-problem"></div>
  </div>
);

export default ProblemColumn;
