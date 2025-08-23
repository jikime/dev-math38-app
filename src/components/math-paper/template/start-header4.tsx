"use client";

import React from "react";
import designOptions from './design-options';
import { Nanum_Gothic } from "next/font/google";

type HeaderProps = {
  teacherName?: string; // 선택적 교사 이름
  title: string; // 시험지 또는 문서의 제목
  subjectName: string; // 과목 이름
  studentName?: string; // 선택적 학생 이름
  lectureTitle?: string; // 선택적 강의 제목
  chapterFrom?: string; // 선택적 시작 장
  chapterTo?: string; // 선택적 종료 장
  style?: React.CSSProperties; // 추가 사용자 정의 스타일
  designOption?: keyof typeof designOptions; // 미리 정의된 디자인 옵션 중 하나 선택
  height?: string; // 헤더의 높이를 사용자 정의할 수 있는 선택적 속성
  totalProblem?: number; // 총 문제 수
};

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const StartHeader4 = ({
  teacherName,
  title,
  subjectName,
  studentName,
  lectureTitle,
  chapterFrom,
  chapterTo,
  style,
  designOption = "default", // 디자인 옵션이 제공되지 않은 경우 기본값으로 설정
  height = "auto", // 높이 기본값은 "auto"로 설정
  totalProblem,
}: HeaderProps) => {
  // 선택한 디자인 옵션과 추가 사용자 정의 스타일을 결합
  const combinedStyle = {
    ...designOptions[designOption],
    ...style,
    height, // 사용자 정의 높이를 마지막에 추가하여 덮어쓰지 않도록 함
    // 인쇄 시 배경 이미지가 나오도록 설정
    WebkitPrintColorAdjust: "exact",
    printColorAdjust: "exact",
  };

  return (
    <div
      className="space-y-4
        -mt-10 pt-10 -ml-8 pl-8 -mr-8 pr-8
        "
      style={combinedStyle as React.CSSProperties} // 결합된 스타일 적용
    >
      {/* 강의 제목이 제공된 경우 중앙에 표시 */}
      <div className="text-center">
        <div className="inline-block border-gray-300 rounded-full px-4 py-1 text-sm">
          {lectureTitle}
        </div>
      </div>
      {/* 시험지 또는 문서의 주요 제목 */}
      <h1
        className={
          "text-2xl text-center text-black-600 " + nanumGothic.className
        }
      >
        {title}
      </h1>
      {/* 과목, 장 정보, 교사 및 학생 이름 */}
      <div
        className={
          "flex flex-row justify-between text-sm border-b border-gray-600 pb-2 " +
          nanumGothic.className
        }
      >
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
