import React from "react";
import designOptions from './design-options';

type HeaderProps = {
  teacherName?: string;
  title: string;
  subjectName: string;
  studentName?: string;
  lectureTitle?: string;
  chapterFrom?: string;
  chapterTo?: string;
  style?: React.CSSProperties;
  designOption?: keyof typeof designOptions;
  height?: string;
  totalProblem?: number;
};

const StartHeader4 = ({
  teacherName,
  title,
  subjectName,
  studentName,
  lectureTitle,
  chapterFrom,
  chapterTo,
  style,
  designOption = "default",
  height = "auto",
  totalProblem,
}: HeaderProps) => {
  const combinedStyle = {
    ...designOptions[designOption],
    ...style,
    height,
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  return (
    <div
      className="space-y-4 -mt-10 pt-10 -ml-8 pl-8 -mr-8 pr-8"
      style={combinedStyle as React.CSSProperties}
    >
      <div className="text-center">
        <div className="inline-block border-gray-300 rounded-full px-4 py-1 text-sm">
          {lectureTitle}
        </div>
      </div>
      <h1 className="text-2xl text-center text-black-600">
        {title}
      </h1>
      <div className="flex flex-row justify-between text-sm border-b border-gray-600 pb-2">
        <div className="flex flex-col flex-1">
          <div className="text-xs">{subjectName}</div>
          <div className="text-xs">
            {chapterFrom} ~ {chapterTo}{" "}
            {totalProblem && (
              <span className="inline-block pl-1">[ {totalProblem} 문항 ]</span>
            )}
          </div>
        </div>
        <div className="flex justify-end items-end">
          <span className="mr-2 text-gray-600">담임</span>
          <span className="text-gray-900 font-bold mr-4">{teacherName}</span>
          <span className="mr-2 text-gray-600">학생 </span>
          <span className="text-gray-900 font-bold min-w-10">
            {studentName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StartHeader4;
