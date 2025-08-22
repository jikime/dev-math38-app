"use client";

import { PaperIdPrint, M38GeneratedPaper, AcademyStaticPaper } from "@/components/math-paper";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useManualPaper } from "@/hooks/use-repository";

interface PaperModalProps {
  paperViewVisible: boolean;
  deselectPaper: () => void;
  paperId: string | undefined;
  useAcademyContents: boolean;
}

const PaperModal = ({
  paperViewVisible,
  deselectPaper,
  paperId,
  useAcademyContents = false,
}: PaperModalProps) => {
  // React Query를 사용한 API 호출
  console.log(paperId);
  const { data: paperData, isLoading, error } = useManualPaper(paperId);
  console.log(paperData);

  // API 함수들 정의 - PaperIdPrint 컴포넌트용
  const fetchM38Paper = async (paperId: string): Promise<M38GeneratedPaper> => {
    // 이미 로드된 데이터가 있으면 반환, 없으면 API 호출
    if (paperData) {
      return paperData;
    }
    // fallback으로 useManualPaper hook을 통해 가져온 데이터 사용
    return Promise.resolve({} as M38GeneratedPaper);
  };

  const fetchAcademyPaper = async (paperId: string): Promise<AcademyStaticPaper> => {
    return Promise.resolve({} as AcademyStaticPaper);
  };

  return (
    <Dialog open={paperViewVisible} onOpenChange={(open) => !open && deselectPaper()}>
      <DialogContent className="!max-w-4xl h-[calc(100vh-80px)] p-0 gap-0">
        <DialogHeader className="px-8 py-3 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800">
          <DialogTitle className="text-lg font-medium">시험지 보기</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-slate-100 dark:bg-slate-950">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">시험지를 불러오는 중입니다...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 dark:text-red-400">시험지를 불러오는데 실패했습니다.</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">다시 시도해주세요.</p>
              </div>
            </div>
          ) : (
            <div
              className="paper-printer m-0 p-8 h-full overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900"
              style={{
                height: "calc(100vh - 200px)",
              }}
            >
              <PaperIdPrint 
                paperId={paperId} 
                useAcademyContents={useAcademyContents}
                fetchM38Paper={fetchM38Paper}
                fetchAcademyPaper={fetchAcademyPaper}
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <Button variant="outline" size="default" onClick={deselectPaper} className="px-8">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaperModal;