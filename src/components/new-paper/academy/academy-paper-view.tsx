"use client";

import { PaperPage } from "../typings";
import React from "react";
import BlankPaper from "./BlankPaper";
import AcademyPaperTemplate from "./academy-paper-template";

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
}

const AcademyPaperPrintView = ({
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
}: PaperPrintViewProps) => {
  return (
    <div
      className="w-full text-left overflow-y-auto pb-10"
      style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
    >
      {pages &&
        pages.map((page, index) => (
          
            <AcademyPaperTemplate
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
              edit={edit}
              showTags={showTags}
              academyLogo={academyLogo}
            />
          
        ))}
      {addBlankPage && (
        <div className="bg-white shadow-lg rounded-lg p-4 mx-auto" style={{ width: "210mm", minHeight: "297mm" }}>
          <BlankPaper />
        </div>
      )}
    </div>
  );
};

export default AcademyPaperPrintView;
