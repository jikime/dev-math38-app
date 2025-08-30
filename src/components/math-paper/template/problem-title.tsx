"use client";

import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2,
  Edit2,
  FilePlus,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { PaperEditContext } from "./paper-edit-context";
import { cn } from "@/lib/utils";
import { ApiProblem } from "@/types/api-problem";

interface ProblemTitleProps {
  problemNumber?: string;
  skillId: string;
  skillName?: string;
  level?: number;
  edit?: boolean;
  problem: ApiProblem;
  showTags?: boolean;
  reportError?: () => void;
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

const ProblemTitle = ({
  problemNumber,
  level,
  skillId,
  skillName,
  edit = false,
  problem,
  showTags = true,
  reportError,
}: ProblemTitleProps) => {
  const {
    paperId,
    setProblemId,
    // setSkillId,
    // setSkillName,
    setSkillIds,
    setSkillName,
    appendAfter,
    removeProblem,
    setChangerVisible,
  } = useContext(PaperEditContext);

  const change = () => {
    // console.log("change problem : ", problem);
    setProblemId(problem.problemId);
    // setSkillId(skillId);
    // setSkillName(skillName);
    setSkillIds([skillId]);
    setSkillName(skillName!);
    setChangerVisible(true);
  };
  const append = () => {
    appendAfter(problem.problemId);
  };
  const remove = () => {
    removeProblem(problem.problemId);
  };
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
              style={{ maxWidth: "210px" }}
            >
              {skillTitle()}
            </div>
          )}
          {/* <div>[{problem.printHeight}]</div> */}
        </div>
        {showTags && (
          <div className="relative min-w-0 flex gap-0.5">
            {level && levelDisplay()}
            <span className="sp-span-ltype-title bg-slate-500 text-slate-50 border border-slate-900 text-xs font-medium px-1.5 py-0.5 rounded min-w-0 text-nowrap">
              {ltypestr(problem.ltype)}
            </span>
          </div>
        )}
      </div>
      {edit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-1 hover:bg-pink-50 hover:text-pink-600"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={change}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              교체
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={append}
              className="cursor-pointer"
            >
              <FilePlus className="mr-2 h-4 w-4" />
              뒤에 추가
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => reportError && reportError()}
              className="cursor-pointer text-orange-600 focus:text-orange-600"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              오류 보고
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={remove}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ProblemTitle;
