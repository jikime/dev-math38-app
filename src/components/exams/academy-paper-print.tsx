"use client";

import React from "react";
import { ExamPaperDetail } from "@/types/exam-paper";
import AcademyPaperTemplate from "./academy-paper-template";

interface PaperPrintProps {
  paper: ExamPaperDetail;
  edit?: boolean;
  showTags?: boolean;
  showBlankPage?: boolean;
  addBlankPage?: boolean;
}

const BlankPaper = () => {
  return <div className="page">&nbsp;</div>;
};

const AcademyPaperPrint = ({
  paper,
  edit = false,
  showTags = true,
  showBlankPage = false,
  addBlankPage = false,
}: PaperPrintProps) => {
  return paper ? (
    <div className="papers">
      {paper.pages?.map((page, index) => (
        <AcademyPaperTemplate
          key={index}
          title={paper.paperGroupName || ""}
          lectureTitle={paper.title}
          chapterFrom={""}
          chapterTo={""}
          pageNumber={index + 1}
          leftSet={page.leftSet || []}
          rightSet={page.rightSet || []}
          columns={2}
          edit={edit}
          showTags={showTags}
          subjectName={
            paper.subjectName || ""
          }
          teacherName={""}
          studentName={""}
          academyName={paper.academyName}
          academyLogo={""}
        />
      ))}
       {addBlankPage && (
        <div className="bg-white shadow-lg rounded-lg p-4 mx-auto" style={{ width: "210mm", minHeight: "297mm" }}>
          <BlankPaper />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};

export default AcademyPaperPrint;