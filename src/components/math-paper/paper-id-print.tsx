import React, { useEffect, useState } from "react";
import { M38GeneratedPaper, AcademyStaticPaper } from "./types";
import PaperPrintView4 from "./templates/paper-print-view4";
import AcademyPaperPrintView from "./academy/academy-paper-print-view";

interface PaperPrintProps {
  paperId: string | undefined;
  useAcademyContents: boolean;
  fetchM38Paper?: (paperId: string) => Promise<M38GeneratedPaper>;
  fetchAcademyPaper?: (paperId: string) => Promise<AcademyStaticPaper>;
}

const PaperIdPrint = ({ 
  paperId, 
  useAcademyContents, 
  fetchM38Paper,
  fetchAcademyPaper 
}: PaperPrintProps) => {
  const [paper, setPaper] = useState<M38GeneratedPaper | AcademyStaticPaper | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paperId && fetchM38Paper && fetchAcademyPaper) {
      setIsLoading(true);
      if(useAcademyContents) {
        fetchAcademyPaper(paperId).then(p=>{
          setPaper(p);
        }).finally(()=>{
          setIsLoading(false);
        });
      } else {
        fetchM38Paper(paperId).then(p=>{
          setPaper(p);
        }).finally(()=>{
          setIsLoading(false);
        });
      }
    }
  }, [paperId, useAcademyContents, fetchM38Paper, fetchAcademyPaper]);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div className="mt-2 text-lg">시험지를 불러오는 중입니다.</div>
        </div>
      </div>
    );

  if(useAcademyContents) {
    const academyPaper = paper as AcademyStaticPaper;
    return paper ? (
      <AcademyPaperPrintView
        title={academyPaper.title}
        lectureTitle={academyPaper.paperGroupName ?? ""}
        chapterFrom={""}
        chapterTo={""}
        pages={academyPaper.pages ?? []}
        minMargin={academyPaper.minMargin ?? 0}
        columns={academyPaper.columns ?? 2}
        subjectName={academyPaper.subjectName ?? ""}
        teacherName={""}
        studentName={""}
        academyName={academyPaper.academyName ?? ""}
        academyLogo={""}
        edit={false}
        addBlankPage={academyPaper.pages?.length % 2 === 1}
      />
    ) : (
      <></>
    );
  }

  const m38Paper = paper as M38GeneratedPaper;
  return paper ? (
    <PaperPrintView4
      title={m38Paper.title}
      lectureTitle={m38Paper.lectureTitle ?? ""}
      chapterFrom={m38Paper.chapterFrom ?? ""}
      chapterTo={m38Paper.chapterTo ?? ""}
      minMargin={m38Paper.minMargin ?? 0}
      columns={m38Paper.columns ?? 2}
      pages={m38Paper.pages ?? []}
      subjectName={m38Paper.subjectName ?? ""}
      teacherName={m38Paper.teacherName ?? ""}
      studentName={m38Paper.studentName ?? ""}
      academyName={m38Paper.academyName ?? ""}
      academyLogo={m38Paper.academyLogo ?? ""}
      edit={false}
      addBlankPage={m38Paper.pages?.length % 2 === 1}
      headerStyle={m38Paper.headerStyle}
      totalProblem={m38Paper.pages?.reduce(
        (acc, page) =>
          acc + (page.leftSet?.length || 0) + (page.rightSet?.length || 0),
        0
      ) || 0}
    />
  ) : (
    <></>
  );
};

export default PaperIdPrint;
