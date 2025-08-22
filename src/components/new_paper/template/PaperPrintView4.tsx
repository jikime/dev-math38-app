"use client";

import React, { useState, useEffect } from "react";
import { PaperPage } from "../typings";
import BlankPaper from "../academy/BlankPaper";
import PaperTemplate from './PaperTemplate4';
import StartHeader from './StartHeader4';

interface PaperPrintViewProps {
  title: string;
  lectureTitle: string;
  chapterFrom?: string;
  chapterTo?: string;
  pages: PaperPage[];
  minMargin: number;
  columns: number;
  subjectName: string;
  teacherName: string;
  studentName: string;
  academyName: string;
  academyLogo?: string;
  edit?: boolean;
  addBlankPage?: boolean;
  showTags?: boolean;
  headerStyle?: React.CSSProperties; // 헤더 스타일 prop 추가
  totalProblem?: number;
}

const PaperPrintView4 = ({
  title,
  lectureTitle,
  chapterFrom = "",
  chapterTo = "",
  pages,
  columns,
  subjectName,
  teacherName,
  studentName,
  academyName,
  academyLogo,
  edit = false,
  addBlankPage = false,
  showTags = true,
  headerStyle = {}, // 기본값 설정
  totalProblem,
}: PaperPrintViewProps) => {
  const [startHeader, setStartHeader] = useState<React.ReactNode>();

  useEffect(() => {
    setHeader();
  }, [headerStyle]);

  const setHeader = () => {
    setStartHeader(
      <StartHeader
        teacherName={teacherName}
        title={title}
        subjectName={subjectName}
        studentName={studentName}
        lectureTitle={lectureTitle}
        chapterFrom={chapterFrom}
        chapterTo={chapterTo}
        style={headerStyle}
        totalProblem={totalProblem}
      />
    );
  };

  return (
    <div className="paper w-full text-left flex flex-col">
      {pages &&
        pages.map((page, index) => (
          <PaperTemplate
            key={index}
            title={title}
            lectureTitle={lectureTitle}
            subjectName={subjectName}
            chapterFrom={chapterFrom}
            teacherName={teacherName}
            studentName={studentName}
            academyName={academyName}
            chapterTo={chapterTo}
            columns={columns}
            leftSet={page.leftSet}
            rightSet={page.rightSet}
            pageNumber={page.pageNumber}
            totalPages={pages.length}
            startHeader={startHeader}
            edit={edit}
            showTags={showTags}
            academyLogo={academyLogo}
          />
        ))}
      {addBlankPage && <BlankPaper />}
    </div>
  );
};

export default PaperPrintView4;
