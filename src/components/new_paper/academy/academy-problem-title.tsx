"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SpProblem } from "../typings";

interface Props {
  problemNumber?: string;
  skillId?: string;
  skillName?: string;
  level?: number;
  problem?: SpProblem;
  showTags?: boolean;
}

declare global {
  interface Number {
    pad: (size?: number) => string;
  }
}

Number.prototype.pad = function (size: number = 2): string {
  let s = String(this);
  while (s.length < size) {
    s = "0" + s;
  }
  return s;
};

const AcademyProblemTitle = ({
  problemNumber,
  level,
  skillId,
  skillName,
  problem,
  showTags = true,
}: Props) => {

  const ltypestr = (ltype: string) => {
    switch (ltype) {
      case "unds":
        return "이해";
      case "resn":
        return "추론";
      case "calc":
        return "계산";
      case "soln":
        return "해결";
      default:
        return "이해"; // 미지정은 이해로 처리한다.
    }
  };

  const skillTitle = () => skillName; // ?.replace(/^[A-Z0-9\\.]+/, "");
  const levelDisplay = () => {
    // const txt = "";
    if (!level) return "-";
    if (level === 1)
      return (
        <span className="w-[36px] whitespace-nowrap sp-span-leve-title bg-blue-100 text-blue-800 border border-blue-500 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
          최하
        </span>
      );
    if (level === 2)
      return (
        <span className="sp-span-leve-title bg-indigo-100 text-indigo-800 border border-indigo-500 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-indigo-200 dark:text-indigo-800">
          하
        </span>
      );
    if (level === 3)
      return (
        <span className="sp-span-leve-title bg-gray-100 text-gray-800 border border-gray-500 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-gray-200 dark:text-gray-800">
          중
        </span>
      );
    if (level === 4)
      return (
        <span className="sp-span-leve-title bg-pink-100 text-pink-800 border border-pink-500 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-800">
          상
        </span>
      );
    if (level === 5)
      return (
        <span className="w-[36px] whitespace-nowrap flex-nowrap sp-span-leve-title bg-red-100 text-red-800 border border-red-500 text-xs font-medium px-1.5 py-0.5 rounded dark:bg-red-200 dark:text-red-800">
          최상
        </span>
      );
  };

  return (
    <div
      className={cn(
        "problem-title flex justify-between items-center text-gray-700 relative",
        showTags && "border-b pb-2"
      )}
      role="alert"
    >
      <div className="flex w-full align-bottom justify-between items-center space-x-2">
        <div className="flex align-bottom justify-start items-center space-x-2">
          {problemNumber && (
            <div className="text-xl border-b-orange-600">
              {Number.isNaN(problemNumber)
                ? problemNumber
                : Number(problemNumber).pad()}
            </div>
          )}
          {showTags && skillName && (
            <div
              className="text-xs border-b-violet-600 min-w-0"
            >
              {skillTitle()}
            </div>
          )}
        </div>
        {showTags && (
          <div className="relative min-w-0 flex gap-0.5 no-print">
            {level && levelDisplay()}
            <span className="sp-span-ltype-title bg-slate-500 text-slate-50 border border-slate-900 text-xs font-medium px-1.5 py-0.5 rounded min-w-0 text-nowrap">
              {ltypestr(problem?.ltype || "")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademyProblemTitle;
