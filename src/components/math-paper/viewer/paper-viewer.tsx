"use client";

import React, { useEffect } from "react";
import { AcademyStaticPaper, M38GeneratedPaper } from "../typings";
import { useManualPaper, useAcademyStaticPaper } from "@/hooks/use-repository";
import { Loader2 } from "lucide-react";
import PaperPrintView4 from "../template/paper-print-view4";
import AcademyPaperPrintView from "../academy/academy-paper-view";

interface PaperViewerProps {
  paperId: string | undefined;
  useAcademyContents?: boolean;
  className?: string;
  onLoadComplete?: (paper: M38GeneratedPaper | AcademyStaticPaper | null) => void;
  onError?: (error: Error) => void;
}

/**
 * 시험지 뷰어 컴포넌트
 * 일반 시험지와 아카데미 시험지를 모두 표시할 수 있는 통합 뷰어
 * 
 * @param paperId - 표시할 시험지 ID
 * @param useAcademyContents - 아카데미 콘텐츠 사용 여부
 * @param className - 추가 CSS 클래스
 * @param onLoadComplete - 시험지 로드 완료 콜백
 * @param onError - 에러 발생 콜백
 */
const PaperViewer: React.FC<PaperViewerProps> = ({
  paperId,
  useAcademyContents = false,
  className = "",
  onLoadComplete,
  onError,
}) => {
  // React Query 훅 사용 - 조건부로 하나만 활성화
  const {
    data: manualPaper,
    isLoading: isLoadingManual,
    error: manualError,
  } = useManualPaper(useAcademyContents ? undefined : paperId);

  const {
    data: academyPaper,
    isLoading: isLoadingAcademy,
    error: academyError,
  } = useAcademyStaticPaper(useAcademyContents ? paperId : undefined);

  // 현재 활성화된 데이터와 상태 선택
  const paper = useAcademyContents ? academyPaper : manualPaper;
  const isLoading = useAcademyContents ? isLoadingAcademy : isLoadingManual;
  const error = useAcademyContents ? academyError : manualError;

  // 로드 완료 콜백 호출
  useEffect(() => {
    if (paper && !isLoading) {
      onLoadComplete?.(paper);
    }
  }, [paper, isLoading, onLoadComplete]);

  // 에러 콜백 호출
  useEffect(() => {
    if (error) {
      const errorObj = error instanceof Error ? error : new Error('시험지를 불러오는데 실패했습니다');
      onError?.(errorObj);
    }
  }, [error, onError]);

  // paperId가 없는 경우
  if (!paperId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`w-full h-full flex flex-col justify-center items-center ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">시험지를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : '시험지를 불러오는데 실패했습니다';
    return (
      <div className={`w-full h-full flex flex-col justify-center items-center ${className}`}>
        <p className="text-red-500 mb-2">시험지를 불러오는데 실패했습니다</p>
        <p className="text-gray-500 text-sm">{errorMessage}</p>
      </div>
    );
  }

  if (!paper) {
    return null;
  }

  // 아카데미 시험지 렌더링
  if (useAcademyContents) {
    const academyPaperData = paper as AcademyStaticPaper;
    return (
      <div className={`paper-printer ${className}`}>
        <AcademyPaperPrintView
          title={academyPaperData.title}
          lectureTitle={academyPaperData.paperGroupName ?? ""}
          chapterFrom={""}
          chapterTo={""}
          pages={academyPaperData.pages ?? []}
          minMargin={academyPaperData.minMargin ?? 0}
          columns={academyPaperData.columns ?? 2}
          subjectName={academyPaperData.subjectName ?? ""}
          teacherName={""}
          studentName={""}
          academyName={academyPaperData.academyName ?? ""}
          academyLogo={""}
          edit={false}
          addBlankPage={academyPaperData.pages?.length % 2 === 1}
        />
      </div>
    );
  }

  // 일반 시험지 렌더링
  const m38Paper = paper as M38GeneratedPaper;
  return (
    <div className={`paper-printer ${className}`}>
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
        totalProblem={m38Paper.pages.reduce(
          (acc, page) =>
            acc + (page.leftSet?.length || 0) + (page.rightSet?.length || 0),
          0
        )}
      />
    </div>
  );
};

export default PaperViewer;