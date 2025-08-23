import React from "react";
import { PaperPage } from "../types";
import PaperTemplate from './paper-template4';
import StartHeader from './start-header4';

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
  headerStyle?: React.CSSProperties;
  totalProblem?: number;
}

const BlankPaper = () => {
  return (
    <div
      className="m-0 p-[10.5mm_8mm_4mm_8mm] text-[9pt] font-[RIDIBatang,Arial,Helvetica,sans-serif]
                 bg-white w-[21cm] min-h-[29.7cm] max-h-[29.7cm] border-none shadow-none
                 flex flex-col overflow-hidden
                 mx-auto my-[0.5cm]
                 print:m-0 print:shadow-none"
    >
      <div className="flex-1"></div>
    </div>
  );
};

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
  headerStyle = {},
  totalProblem,
}: PaperPrintViewProps) => {
  // Create header directly without state - much simpler and avoids infinite loops
  const startHeader = (
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
